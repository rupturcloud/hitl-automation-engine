#!/usr/bin/env node
/**
 * Script 020 — Setup Tenant Ruptur + Super Admins
 *
 * O que faz:
 *   1. Aplica migration SQL (super_admins table + RLS atualizado + tenant ruptur-os)
 *   2. Cria usuários no Supabase Auth via Admin API
 *   3. Vincula ao tenant ruptur-os com roles corretos
 *   4. Marca super admins
 *
 * Uso: node scripts/020_setup_ruptur_tenant.mjs
 */

import pkg from 'pg';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import ws from 'ws';

const { Client } = pkg;
const __dirname = dirname(fileURLToPath(import.meta.url));

// Carregar .env
function loadEnv() {
  try {
    const lines = readFileSync(resolve(__dirname, '../.env'), 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx < 0) continue;
      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
      // Expandir variáveis simples tipo SUPABASE_URL=${VITE_SUPABASE_URL}
      val = val.replace(/\$\{([^}]+)\}/g, (_, k) => process.env[k] || '');
      if (!process.env[key]) process.env[key] = val;
    }
  } catch { /* sem .env local */ }
}
loadEnv();

const SUPABASE_URL     = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_KEY      = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TEMP_PASSWORD    = 'Ruptur@2026!';

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não encontrados');
  process.exit(1);
}

// Conexão pg direta ao Supabase Postgres
const host = SUPABASE_URL.replace('https://', '').replace('http://', '');
const pgClient = new Client({
  connectionString: `postgresql://postgres.${host.split('.')[0]}:${SERVICE_KEY}@aws-0-sa-east-1.pooler.supabase.com:6543/postgres`,
  ssl: { rejectUnauthorized: false },
});

// Supabase Admin API (Node 20 precisa de ws como transporte)
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
  realtime: { transport: ws },
});

// ============================================================
const MIGRATION_SQL = `
-- ============================================================
-- Migration 020 — Super Admin + Tenant Ruptur
-- ============================================================

-- 1. Tabela super_admins
CREATE TABLE IF NOT EXISTS super_admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  granted_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Função helper
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (SELECT 1 FROM super_admins WHERE user_id = auth.uid());
$$;

-- 3. Atualizar policies RLS

DROP POLICY IF EXISTS tenants_isolation ON tenants;
CREATE POLICY tenants_isolation ON tenants
  FOR ALL USING (
    is_super_admin()
    OR id IN (SELECT tenant_id FROM user_tenant_memberships WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS users_isolation ON users;
CREATE POLICY users_isolation ON users
  FOR ALL USING (
    is_super_admin()
    OR tenant_id IN (SELECT tenant_id FROM user_tenant_memberships WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS memberships_isolation ON user_tenant_memberships;
CREATE POLICY memberships_isolation ON user_tenant_memberships
  FOR SELECT USING (is_super_admin() OR user_id = auth.uid());

ALTER TABLE super_admins ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS super_admins_read ON super_admins;
CREATE POLICY super_admins_read ON super_admins
  FOR SELECT USING (is_super_admin() OR user_id = auth.uid());

-- 4. Atualizar check constraints
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check
  CHECK (role IN ('super_admin','owner','admin','member','viewer'));

ALTER TABLE user_tenant_memberships DROP CONSTRAINT IF EXISTS user_tenant_memberships_role_check;
ALTER TABLE user_tenant_memberships ADD CONSTRAINT user_tenant_memberships_role_check
  CHECK (role IN ('super_admin','owner','admin','member','viewer'));

-- 5. Criar tenant Ruptur OS
INSERT INTO tenants (slug, name, email, plan, status, credits_balance)
VALUES ('ruptur-os', 'Ruptur OS', 'ruptur.cloud@gmail.com', 'custom', 'active', 9999)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  plan = EXCLUDED.plan,
  status = EXCLUDED.status;
`;

// Usando 'owner' enquanto a migration DDL não adiciona 'super_admin' ao constraint
// Após executar 020_super_admin_ruptur_tenant.sql no Supabase SQL Editor,
// esses roles serão atualizados para 'super_admin'
const USERS = [
  { email: 'ruptur.cloud@gmail.com',                  full_name: 'Diego Silva (Ruptur)',       role: 'owner', is_super_admin: true  },
  { email: 'diegoizac@gmail.com',                     full_name: 'Diego I. L. da Silva',       role: 'owner', is_super_admin: true  },
  { email: 'stephaniegabrielledefreitas@gmail.com',   full_name: 'Stephanie G. de Freitas',    role: 'admin', is_super_admin: false },
];

// ============================================================
async function main() {
  console.log('🚀 Setup Tenant Ruptur OS\n');

  // ── 1. Criar/garantir tenant ruptur-os via DML ───────────
  console.log('── [1/3] Criando tenant ruptur-os...');
  const { error: insertTenantErr } = await supabase.from('tenants').upsert({
    slug: 'ruptur-os',
    name: 'Ruptur OS',
    email: 'ruptur.cloud@gmail.com',
    plan: 'custom',
    status: 'active',
    credits_balance: 9999,
  }, { onConflict: 'slug' });

  if (insertTenantErr) {
    console.error(`  ❌ Erro ao criar tenant: ${insertTenantErr.message}`);
  } else {
    console.log('  ✅ Tenant upserted\n');
  }

  // ── 2. Buscar tenant ─────────────────────────────────────
  console.log('── [2/3] Buscando tenant ruptur-os...');
  const { data: tenant, error: tErr } = await supabase
    .from('tenants').select('id,slug,name').eq('slug', 'ruptur-os').single();

  if (tErr || !tenant) {
    console.error('  ❌ Tenant ruptur-os não encontrado após migration. Verifique o SQL Editor.');
    console.error('  →', tErr?.message);
    process.exit(1);
  }
  console.log(`  ✅ Tenant: ${tenant.name} (${tenant.id})\n`);

  // ── 3. Criar/vincular usuários ───────────────────────────
  console.log('── [3/3] Criando usuários...');

  const { data: listData } = await supabase.auth.admin.listUsers({ perPage: 200 });
  const existingUsers = listData?.users || [];

  for (const u of USERS) {
    console.log(`\n  • ${u.email}`);

    // Verificar se já existe
    const existing = existingUsers.find(x => x.email === u.email);
    let userId;

    if (existing) {
      userId = existing.id;
      console.log(`    ℹ️  Já existe no Auth (${userId})`);
    } else {
      const { data: created, error: cErr } = await supabase.auth.admin.createUser({
        email: u.email,
        password: TEMP_PASSWORD,
        email_confirm: true,
        user_metadata: {
          full_name: u.full_name,
          must_change_password: true,  // força troca no primeiro acesso
        },
      });
      if (cErr) { console.error(`    ❌ Auth: ${cErr.message}`); continue; }
      userId = created.user.id;
      console.log(`    ✅ Criado no Auth (${userId})`);
    }

    // Garantir flag must_change_password em usuários já existentes com senha temporária
    if (existing) {
      const alreadyChanged = existing.user_metadata?.password_changed_at;
      if (!alreadyChanged) {
        await supabase.auth.admin.updateUserById(existing.id, {
          user_metadata: { ...existing.user_metadata, must_change_password: true },
        });
        console.log(`    ✅ Flag must_change_password setada`);
      }
    }

    // Upsert em users
    const { error: uErr } = await supabase.from('users').upsert(
      { id: userId, tenant_id: tenant.id, email: u.email, full_name: u.full_name, role: u.role },
      { onConflict: 'id' }
    );
    if (uErr) console.error(`    ❌ users: ${uErr.message}`);
    else console.log(`    ✅ Registro em users (role: ${u.role})`);

    // Membership
    const { error: mErr } = await supabase.from('user_tenant_memberships').upsert(
      { user_id: userId, tenant_id: tenant.id, role: u.role },
      { onConflict: 'user_id,tenant_id' }
    );
    if (mErr) console.error(`    ❌ membership: ${mErr.message}`);
    else console.log(`    ✅ Membership criado`);

    // Super admin
    if (u.is_super_admin) {
      const { error: sErr } = await supabase.from('super_admins')
        .upsert({ user_id: userId }, { onConflict: 'user_id' });
      if (sErr) console.error(`    ❌ super_admins: ${sErr.message}`);
      else console.log(`    ✅ Super admin marcado`);
    }
  }

  // ── Resumo ───────────────────────────────────────────────
  console.log('\n════════════════════════════════════════');
  console.log('✅ Setup concluído!\n');
  console.log(`Tenant : ${tenant.name} (${tenant.slug})`);
  console.log(`Senha  : ${TEMP_PASSWORD}  ← trocar no primeiro acesso\n`);
  for (const u of USERS) {
    const tag = u.is_super_admin ? ' [SUPER ADMIN]' : ' [ADMIN]';
    console.log(`  ${u.email}${tag}`);
  }
  console.log('════════════════════════════════════════\n');
}

main().catch(e => { console.error('❌ Fatal:', e.message); process.exit(1); });

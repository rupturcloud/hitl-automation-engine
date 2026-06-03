/**
 * Script 020 — Criar usuários Ruptur no Supabase Auth + vincular ao tenant
 *
 * Executa na VM onde o .env já tem SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
 *
 * Usage: node scripts/020_create_ruptur_users.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Carregar .env manualmente (sem dotenv para manter deps mínimas)
function loadEnv() {
  try {
    const envPath = resolve(__dirname, '../.env');
    const lines = readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const [key, ...vals] = line.split('=');
      if (key && vals.length) {
        process.env[key.trim()] = vals.join('=').trim().replace(/^["']|["']$/g, '');
      }
    }
  } catch { /* .env pode não existir localmente */ }
}

loadEnv();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não encontrados no .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ============================================================
// Configuração dos usuários
// ============================================================
const TEMP_PASSWORD = 'Ruptur@2026!'; // Todos trocam no primeiro acesso

const USERS = [
  {
    email: 'ruptur.cloud@gmail.com',
    full_name: 'Diego Silva (Ruptur)',
    role: 'super_admin',
    is_super_admin: true,
  },
  {
    email: 'diegoizac@gmail.com',
    full_name: 'Diego I. L. da Silva',
    role: 'super_admin',
    is_super_admin: true,
  },
  {
    email: 'stephaniegabrielledefreitas@gmail.com',
    full_name: 'Stephanie G. de Freitas',
    role: 'admin',
    is_super_admin: false,
  },
];

// ============================================================
async function main() {
  console.log('🚀 Iniciando criação de usuários Ruptur OS\n');

  // 1. Buscar tenant ruptur-os
  const { data: tenant, error: tenantErr } = await supabase
    .from('tenants')
    .select('id, slug, name')
    .eq('slug', 'ruptur-os')
    .single();

  if (tenantErr || !tenant) {
    console.error('❌ Tenant ruptur-os não encontrado. Execute a migration 020 SQL primeiro.');
    console.error(tenantErr?.message);
    process.exit(1);
  }

  console.log(`✅ Tenant encontrado: ${tenant.name} (${tenant.id})\n`);

  // 2. Criar/atualizar cada usuário
  for (const u of USERS) {
    console.log(`\n── ${u.email} ──────────────────────`);

    // Verificar se já existe
    const { data: existing } = await supabase.auth.admin.listUsers();
    const existingUser = existing?.users?.find(usr => usr.email === u.email);

    let userId;

    if (existingUser) {
      console.log(`  ℹ️  Usuário já existe (${existingUser.id})`);
      userId = existingUser.id;
    } else {
      // Criar no Auth
      const { data: created, error: createErr } = await supabase.auth.admin.createUser({
        email: u.email,
        password: TEMP_PASSWORD,
        email_confirm: true, // Já confirma o email
        user_metadata: {
          full_name: u.full_name,
          tenant: 'ruptur-os',
        },
      });

      if (createErr) {
        console.error(`  ❌ Erro ao criar: ${createErr.message}`);
        continue;
      }

      userId = created.user.id;
      console.log(`  ✅ Criado no Auth (${userId})`);
    }

    // Inserir/atualizar em users
    const { error: upsertErr } = await supabase
      .from('users')
      .upsert({
        id: userId,
        tenant_id: tenant.id,
        email: u.email,
        full_name: u.full_name,
        role: u.role,
      }, { onConflict: 'id' });

    if (upsertErr) {
      console.error(`  ❌ Erro ao upsert users: ${upsertErr.message}`);
    } else {
      console.log(`  ✅ Registro em users criado/atualizado`);
    }

    // Vincular ao tenant
    const { error: memberErr } = await supabase
      .from('user_tenant_memberships')
      .upsert({
        user_id: userId,
        tenant_id: tenant.id,
        role: u.role,
      }, { onConflict: 'user_id,tenant_id' });

    if (memberErr) {
      console.error(`  ❌ Erro ao criar membership: ${memberErr.message}`);
    } else {
      console.log(`  ✅ Membership criado (role: ${u.role})`);
    }

    // Marcar como super_admin se aplicável
    if (u.is_super_admin) {
      const { error: saErr } = await supabase
        .from('super_admins')
        .upsert({ user_id: userId }, { onConflict: 'user_id' });

      if (saErr) {
        console.error(`  ❌ Erro ao marcar super_admin: ${saErr.message}`);
      } else {
        console.log(`  ✅ Marcado como super_admin`);
      }
    }
  }

  // 3. Resumo final
  console.log('\n\n════════════════════════════════════════');
  console.log('✅ Processo concluído. Resumo:\n');
  console.log(`Tenant:  ${tenant.name} (${tenant.slug})`);
  console.log(`Senha temporária: ${TEMP_PASSWORD}`);
  console.log('\nUsuários criados:');
  for (const u of USERS) {
    const sa = u.is_super_admin ? ' [SUPER ADMIN]' : '';
    console.log(`  • ${u.email} — ${u.full_name}${sa}`);
  }
  console.log('\n⚠️  Peça para cada usuário trocar a senha no primeiro acesso.');
  console.log('════════════════════════════════════════\n');
}

main().catch(e => {
  console.error('❌ Erro fatal:', e.message);
  process.exit(1);
});

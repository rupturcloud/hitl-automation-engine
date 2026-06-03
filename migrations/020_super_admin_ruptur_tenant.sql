-- ============================================================
-- Migration 020 — Super Admin + Tenant Ruptur
-- Cria:
--   1. Tabela super_admins (bypass RLS total)
--   2. Função is_super_admin() para uso nos checks
--   3. Atualiza policies de RLS para permitir super admin ver tudo
--   4. Adiciona role 'super_admin' nos check constraints
--   5. Cria tenant Ruptur OS (tenant zero / master)
-- ============================================================

-- 1. Tabela super_admins
CREATE TABLE IF NOT EXISTS super_admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  granted_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE super_admins IS 'Usuários com acesso total ao sistema — enxergam todos os tenants';

-- 2. Função helper
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM super_admins WHERE user_id = auth.uid()
  );
$$;

-- 3. Atualizar policies RLS — super admin bypassa isolamento de tenant

-- tenants
DROP POLICY IF EXISTS tenants_isolation ON tenants;
CREATE POLICY tenants_isolation ON tenants
  FOR ALL USING (
    is_super_admin()
    OR id IN (
      SELECT tenant_id FROM user_tenant_memberships
      WHERE user_id = auth.uid()
    )
  );

-- users
DROP POLICY IF EXISTS users_isolation ON users;
CREATE POLICY users_isolation ON users
  FOR ALL USING (
    is_super_admin()
    OR tenant_id IN (
      SELECT tenant_id FROM user_tenant_memberships
      WHERE user_id = auth.uid()
    )
  );

-- memberships
DROP POLICY IF EXISTS memberships_isolation ON user_tenant_memberships;
CREATE POLICY memberships_isolation ON user_tenant_memberships
  FOR SELECT USING (
    is_super_admin()
    OR user_id = auth.uid()
  );

-- RLS na própria tabela super_admins (apenas super admins leem)
ALTER TABLE super_admins ENABLE ROW LEVEL SECURITY;
CREATE POLICY super_admins_read ON super_admins
  FOR SELECT USING (is_super_admin() OR user_id = auth.uid());

-- 4. Atualizar check constraints de role para incluir super_admin
ALTER TABLE users
  DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users
  ADD CONSTRAINT users_role_check
  CHECK (role IN ('super_admin','owner','admin','member','viewer'));

ALTER TABLE user_tenant_memberships
  DROP CONSTRAINT IF EXISTS user_tenant_memberships_role_check;
ALTER TABLE user_tenant_memberships
  ADD CONSTRAINT user_tenant_memberships_role_check
  CHECK (role IN ('super_admin','owner','admin','member','viewer'));

-- 5. Criar tenant Ruptur OS
INSERT INTO tenants (slug, name, email, plan, status, credits_balance)
VALUES ('ruptur-os', 'Ruptur OS', 'ruptur.cloud@gmail.com', 'custom', 'active', 9999)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  plan = EXCLUDED.plan,
  status = EXCLUDED.status;

-- Verificação final
DO $$
BEGIN
  RAISE NOTICE '✅ Migration 020 aplicada com sucesso';
  RAISE NOTICE '   → Tabela super_admins criada';
  RAISE NOTICE '   → Função is_super_admin() criada';
  RAISE NOTICE '   → RLS atualizado com bypass para super admins';
  RAISE NOTICE '   → Tenant ruptur-os criado';
  RAISE NOTICE '   → Próximo passo: executar script 020_create_users.mjs para criar os usuários';
END $$;

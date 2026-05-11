-- ============================================================================
-- MIGRATION 008: Audit Logs + RBAC (Versão Simplificada)
-- Copie e execute isso no Supabase SQL Editor se 008 tiver falhado
-- ============================================================================

-- 1. Criar tabela audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id UUID,
  old_value JSONB,
  new_value JSONB,
  ip_address INET,
  user_agent TEXT,
  session_id UUID,
  acting_as_role VARCHAR(50),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_id ON audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);

-- 2. Criar tabela user_tenant_roles
CREATE TABLE IF NOT EXISTS user_tenant_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tenant_id)
);

CREATE INDEX IF NOT EXISTS idx_user_tenant_roles_user ON user_tenant_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tenant_roles_tenant ON user_tenant_roles(tenant_id);

-- 3. Criar tabela tenant_billing_permissions
CREATE TABLE IF NOT EXISTS tenant_billing_permissions (
  tenant_id UUID PRIMARY KEY REFERENCES public.tenants(id) ON DELETE CASCADE,
  purchase_allowed_roles TEXT[] DEFAULT ARRAY['owner', 'admin'],
  view_billing_allowed_roles TEXT[] DEFAULT ARRAY['owner', 'admin', 'member'],
  manage_subscription_allowed_roles TEXT[] DEFAULT ARRAY['owner', 'admin'],
  refund_allowed_roles TEXT[] DEFAULT ARRAY['owner'],
  max_purchase_amount DECIMAL(10,2),
  require_approval_above DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Habilitar RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tenant_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_billing_permissions ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies para audit_logs
DROP POLICY IF EXISTS audit_logs_tenant_isolation ON audit_logs;
CREATE POLICY audit_logs_tenant_isolation ON audit_logs
  FOR SELECT USING (
    tenant_id IN (
      SELECT tenant_id FROM user_tenant_roles
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS audit_logs_insert_admin ON audit_logs;
CREATE POLICY audit_logs_insert_admin ON audit_logs
  FOR INSERT WITH CHECK (
    tenant_id IN (
      SELECT utr.tenant_id FROM user_tenant_roles utr
      WHERE utr.user_id = auth.uid()
        AND utr.role IN ('owner', 'admin')
    )
  );

-- 6. RLS Policies para user_tenant_roles
DROP POLICY IF EXISTS user_tenant_roles_select ON user_tenant_roles;
CREATE POLICY user_tenant_roles_select ON user_tenant_roles
  FOR SELECT USING (user_id = auth.uid());

-- 7. RLS Policies para tenant_billing_permissions
DROP POLICY IF EXISTS billing_permissions_select ON tenant_billing_permissions;
CREATE POLICY billing_permissions_select ON tenant_billing_permissions
  FOR SELECT USING (
    tenant_id IN (
      SELECT tenant_id FROM user_tenant_roles
      WHERE user_id = auth.uid()
    )
  );

-- 8. Trigger para auto-populate tenant_billing_permissions
DROP FUNCTION IF EXISTS create_default_billing_permissions() CASCADE;
CREATE OR REPLACE FUNCTION create_default_billing_permissions()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO tenant_billing_permissions (tenant_id)
  VALUES (NEW.id)
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_create_default_billing_permissions ON tenants;
CREATE TRIGGER trigger_create_default_billing_permissions
  AFTER INSERT ON tenants
  FOR EACH ROW
  EXECUTE FUNCTION create_default_billing_permissions();

-- 9. Grants
GRANT SELECT ON audit_logs TO authenticated;
GRANT SELECT ON user_tenant_roles TO authenticated;
GRANT SELECT ON tenant_billing_permissions TO authenticated;

-- ============================================================================
-- FIM DA MIGRATION 008 SIMPLIFICADA
-- ============================================================================

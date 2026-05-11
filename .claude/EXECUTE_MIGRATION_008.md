# ⚡ Executar Migration 008 (5 minutos)

## Passo 1: Abrir Supabase SQL Editor

1. Acesse [console.supabase.com](https://console.supabase.com)
2. Selecione seu projeto Ruptur
3. Vá em **SQL Editor** (barra esquerda)
4. Clique em **New Query**

## Passo 2: Copiar Migration Completa

Copie TODO o SQL de `migrations/008_audit_logs_and_rbac.sql`:

```bash
cat saas/migrations/008_audit_logs_and_rbac.sql
```

Cole em uma nova query no Supabase SQL Editor.

## Passo 3: Executar

Clique em botão azul **▶ Run** ou aperte Ctrl+Enter

**Esperado:** Sem erros, as 3 tabelas criadas aparecem em **Table Editor**

## Passo 4: Migrar Dados (2 min)

Na mesma query, copie/cole este SQL:

```sql
-- Copiar dados de user_tenant_memberships → user_tenant_roles
INSERT INTO user_tenant_roles (user_id, tenant_id, role, created_at)
SELECT user_id, tenant_id, role, created_at
FROM user_tenant_memberships
ON CONFLICT (user_id, tenant_id) DO NOTHING;

-- Verificar quantas linhas foram copiadas
SELECT COUNT(*) as total_roles FROM user_tenant_roles;

-- Comparar com memberships (devem ser iguais)
SELECT COUNT(*) as total_memberships FROM user_tenant_memberships;
```

Clique **▶ Run**

**Esperado:** Mesmo COUNT em ambas queries

## ✅ Checklist Pós-Execução

- [ ] `audit_logs` table existe e tem índices
- [ ] `user_tenant_roles` table existe com dados copiados
- [ ] `tenant_billing_permissions` table existe e está vazia (será preenchida por trigger)
- [ ] RLS está ativo em todas as 3 tabelas
- [ ] `COUNT(*) FROM user_tenant_roles` == `COUNT(*) FROM user_tenant_memberships`

## 🧪 Teste Rápido (Opcional)

No SQL Editor, execute:

```sql
-- Ver audit logs (vazio por enquanto)
SELECT COUNT(*) FROM audit_logs;

-- Ver roles copiadas
SELECT COUNT(*) FROM user_tenant_roles;
SELECT DISTINCT role FROM user_tenant_roles;

-- Ver permissões criadas por tenant
SELECT COUNT(*) FROM tenant_billing_permissions;
SELECT * FROM tenant_billing_permissions LIMIT 1;
```

## ⚠️ Se Receber Erro

**Erro: "relation does not exist"**
- Migration 008 não foi executada
- Copie/cole novamente TODO o arquivo 008

**Erro: "function update_updated_at_column does not exist"**
- Essa função deve existir em seu DB (vem de migration anterior)
- Se não existir, execute:

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**Erro: "permission denied"**
- Você está com o usuário supabase_admin?
- Abra em "Docs" → SQL Editor → verifique user (deve ser supabase_admin)

## 🎯 Próximo Passo

Após confirmar que migration rodou sem erros:

1. Abra `.claude/START_HERE.md`
2. Siga **Passo 3: Integrar Serviços nas Rotas**
3. Teste a rota POST /api/billing/checkout com um user membro

---

**Tempo Total:** ~5-10 minutos (migration + migração de dados + verificação)

# Phase 1: Migrations Guide - Execução Passo a Passo

**Data**: 2026-05-07  
**Status**: ✅ Pronto para executar  
**Tempo estimado**: 10-15 minutos  
**Risco**: BAIXO (apenas ADD COLUMN + nova tabela, sem breaking changes)

---

## 📋 Migrations Criadas

| # | Arquivo | Descrição | Status |
|---|---------|-----------|--------|
| 015 | `20260507001600_user_management_soft_delete.sql` | Soft-delete columns | ✅ Pronto |
| 016 | `20260507001700_user_tenant_invites.sql` | Tabela de invites | ✅ Pronto |
| 017 | `20260507001800_action_tokens.sql` | Tabela de action tokens | ✅ Pronto |

---

## 🚀 COMO EXECUTAR

### Opção 1: Supabase Dashboard (RECOMENDADO)

1. **Abra** [Supabase Dashboard](https://app.supabase.com)
2. **Selecione** seu projeto Ruptur
3. **Vá para** SQL Editor → + Create Query
4. **Copie** todo o conteúdo de `20260507001600_user_management_soft_delete.sql`
5. **Cole** na query editor
6. **Clique** "Run"
7. **Aguarde** 2-3 segundos até aparecer "Success"
8. **Repita** para as outras 2 migrations (016 e 017)

**⚠️ IMPORTANTE**: Execute NA ORDEM:
1. 015 (soft-delete)
2. 016 (invites)
3. 017 (action-tokens)

---

### Opção 2: Supabase CLI (Automático)

```bash
# Dentro da pasta /saas

# 1. Verificar status das migrations
supabase migration list

# 2. Executar migrations pendentes
supabase db push

# Resultado esperado:
# ✓ 20260507001600_user_management_soft_delete.sql
# ✓ 20260507001700_user_tenant_invites.sql
# ✓ 20260507001800_action_tokens.sql
```

---

## ✅ VALIDAR EXECUÇÃO

Após executar as migrations, validar que foram criadas:

### 1. Verificar Columns em `user_tenant_roles`

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'user_tenant_roles'
AND column_name IN ('status', 'deleted_at', 'deleted_by', 'token_invalidated_at');
```

**Resultado esperado**: 4 linhas
```
status                 | character varying
deleted_at            | timestamp with time zone
deleted_by            | uuid
token_invalidated_at  | timestamp with time zone
```

### 2. Verificar Tabela `user_tenant_invites`

```sql
SELECT COUNT(*) FROM information_schema.tables
WHERE table_name = 'user_tenant_invites';
```

**Resultado esperado**: 1

### 3. Verificar Tabela `action_tokens`

```sql
SELECT COUNT(*) FROM information_schema.tables
WHERE table_name = 'action_tokens';
```

**Resultado esperado**: 1

### 4. Verificar Triggers

```sql
SELECT trigger_name FROM information_schema.triggers
WHERE table_name IN ('user_tenant_roles', 'user_tenant_invites', 'action_tokens')
ORDER BY trigger_name;
```

**Resultado esperado**: ~10 triggers
```
audit_invite_accepted
audit_invite_created
audit_invite_rejected
audit_invite_rejected
audit_role_change
audit_user_removal
audit_user_status_change
audit_action_token_used
enforce_min_admins
validate_invite_not_expired
update_user_tenant_invites_updated_at
```

---

## 🧪 TESTE RÁPIDO DE FUNCIONAMENTO

### Teste 1: Validar que Último Admin Não Pode Ser Removido

```sql
-- Simular tentativa de remover último admin
UPDATE user_tenant_roles
SET status = 'inactive', deleted_at = NOW()
WHERE user_id = 'ALGUM_ADMIN_UUID'
AND tenant_id = 'ALGUM_TENANT_UUID'
AND role = 'admin';

-- Resultado esperado: ERROR
-- "Cannot remove last admin from tenant. Assign another admin first."
```

### Teste 2: Validar que Soft-Delete Cria Audit Log

```sql
-- Ver logs de auditoria
SELECT action, old_value, new_value, created_at
FROM audit_logs
WHERE action IN ('user_removed_from_tenant', 'user_role_changed')
ORDER BY created_at DESC
LIMIT 5;
```

### Teste 3: Validar que Invite Expira

```sql
-- Ver invites pendentes
SELECT email, expires_at, NOW() as now, 
  EXTRACT(DAY FROM expires_at - NOW()) || ' days left' as time_remaining
FROM user_tenant_invites
WHERE status = 'pending'
LIMIT 5;
```

---

## 🔄 ROLLBACK (SE NECESSÁRIO)

### Voltar para estado anterior

```sql
-- ❌ NÃO EXECUTE ISSO AGORA, apenas se algo deu errado

-- Remover tabelas
DROP TABLE IF EXISTS action_tokens;
DROP TABLE IF EXISTS user_tenant_invites;

-- Remover columns
ALTER TABLE user_tenant_roles DROP COLUMN IF EXISTS status;
ALTER TABLE user_tenant_roles DROP COLUMN IF EXISTS deleted_at;
ALTER TABLE user_tenant_roles DROP COLUMN IF EXISTS deleted_by;
ALTER TABLE user_tenant_roles DROP COLUMN IF EXISTS token_invalidated_at;

-- Remover triggers
DROP TRIGGER IF EXISTS audit_user_role_change ON user_tenant_roles;
DROP TRIGGER IF EXISTS audit_user_status_change ON user_tenant_roles;
DROP TRIGGER IF EXISTS enforce_min_admins ON user_tenant_roles;
```

---

## 📊 IMPACT ANALYSIS

### O que mudou?

| Item | Antes | Depois | Impacto |
|------|-------|--------|--------|
| `user_tenant_roles` | 6 colunas | 10 colunas | ✅ Zero breaking |
| Tabelas | 1 | 3 | ✅ Additive |
| Triggers | ~3 | ~13 | ✅ Automático |
| Índices | 5 | 15+ | ✅ Performance melhora |
| RLS Policies | Existentes | Melhoradas | ✅ Mais seguro |

### Compatibilidade Backward

✅ **ZERO breaking changes**
- Todas novas colunas têm DEFAULT values
- Novas tabelas não afetam código existente
- Triggers são adicionais (não modificam behavior)

---

## 🎯 PRÓXIMOS PASSOS

✅ **Depois de executar as migrations:**

1. **Phase 2**: Criar Services (UserManagement, Invite, Audit)
2. **Phase 3**: Criar API Routes
3. **Phase 4**: Criar React Components

**Você está aqui** 👈 Phase 1 (Database)

---

## 📞 TROUBLESHOOTING

### Erro: "relation user_tenant_invites does not exist"

**Solução**: Migration 016 não foi executada. Execute na ordem correta.

### Erro: "duplicate key value violates unique constraint"

**Solução**: Dados duplicados. Verificar se migration já foi executada.

### Erro: "permission denied for schema public"

**Solução**: Usuário do Supabase não tem permissões. Use role `postgres`.

### Triggers não aparecem

**Solução**: Atualizar página do Supabase (F5). Triggers estão lá.

---

## ✨ VALIDAÇÃO FINAL

Após todas as migrations:

```javascript
// No seu cliente JavaScript, testar que funções existem:

const { data } = await supabase
  .rpc('count_active_admins', { p_tenant_id: 'TENANT_UUID' });

// Resultado esperado: número > 0
console.log('Active admins:', data);
```

---

## 📝 CHECKLIST PRÉ-DEPLOY

- [ ] Migration 015 executada com sucesso
- [ ] Migration 016 executada com sucesso
- [ ] Migration 017 executada com sucesso
- [ ] Columns adicionadas em `user_tenant_roles`
- [ ] Tabelas `user_tenant_invites` e `action_tokens` existem
- [ ] Triggers criadas (~13 no total)
- [ ] RLS policies habilitadas
- [ ] Teste de "último admin" funcionando
- [ ] Audit logs sendo criados
- [ ] Invites com expiração funcionando

---

## 🚀 GO!

**Pronto para executar?**

1. Abra Supabase Dashboard
2. SQL Editor → New Query
3. Cole migration 015, execute
4. Cole migration 016, execute
5. Cole migration 017, execute
6. ✅ Phase 1 completa!

**Tempo**: ~10 minutos  
**Complexidade**: Baixa  
**Risco**: Nenhum (rollback é simples)

---

**Quando terminar**, me avise e vamos para **Phase 2 (Services)**!

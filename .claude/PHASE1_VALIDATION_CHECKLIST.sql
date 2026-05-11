/**
 * Phase 1 - Validation Checklist
 *
 * Execute DEPOIS de rodar todas as 3 migrations.
 * Este arquivo contém queries de validação para garantir que tudo foi instalado corretamente.
 *
 * Tempo estimado: 5 minutos
 * Status: Pronto para rodar
 */

-- ============================================================================
-- 1. VALIDAR COLUMNS EM user_tenant_roles
-- ============================================================================

-- Query 1: Verificar que as 4 novas columns existem
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'user_tenant_roles'
AND column_name IN ('status', 'deleted_at', 'deleted_by', 'token_invalidated_at')
ORDER BY ordinal_position;

-- Resultado esperado: 4 linhas
-- ✅ status | character varying | YES | 'active'::character varying
-- ✅ deleted_at | timestamp with time zone | YES | NULL
-- ✅ deleted_by | uuid | YES | NULL
-- ✅ token_invalidated_at | timestamp with time zone | YES | NULL

-- ============================================================================
-- 2. VALIDAR ÍNDICES
-- ============================================================================

-- Query 2: Verificar que índices foram criados
SELECT
  indexname,
  tablename,
  indexdef
FROM pg_indexes
WHERE tablename IN ('user_tenant_roles', 'user_tenant_invites', 'action_tokens')
AND indexname NOT LIKE '%_pkey'
ORDER BY tablename, indexname;

-- Resultado esperado: ~15+ índices
-- ✅ idx_user_tenant_roles_status
-- ✅ idx_user_tenant_roles_deleted_at
-- ✅ idx_user_tenant_invites_token
-- etc...

-- ============================================================================
-- 3. VALIDAR TABELAS CRIADAS
-- ============================================================================

-- Query 3: Verificar que as 2 novas tabelas existem
SELECT
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('user_tenant_invites', 'action_tokens')
ORDER BY table_name;

-- Resultado esperado: 2 linhas
-- ✅ user_tenant_invites | BASE TABLE
-- ✅ action_tokens | BASE TABLE

-- ============================================================================
-- 4. VALIDAR TRIGGERS
-- ============================================================================

-- Query 4: Listar todos os triggers criados
SELECT
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
AND event_object_table IN ('user_tenant_roles', 'user_tenant_invites', 'action_tokens')
ORDER BY event_object_table, trigger_name;

-- Resultado esperado: ~13 triggers
-- ✅ audit_user_role_change | UPDATE | user_tenant_roles
-- ✅ audit_user_status_change | UPDATE | user_tenant_roles
-- ✅ enforce_min_admins | UPDATE | user_tenant_roles
-- ✅ update_user_tenant_invites_updated_at | UPDATE | user_tenant_invites
-- ✅ validate_invite_not_expired | UPDATE | user_tenant_invites
-- ✅ audit_invite_accepted | UPDATE | user_tenant_invites
-- ✅ audit_invite_rejected | UPDATE | user_tenant_invites
-- ✅ audit_invite_created | INSERT | user_tenant_invites
-- ✅ mark_token_expired_if_needed | UPDATE | action_tokens
-- ✅ audit_action_token_used | UPDATE | action_tokens
-- ✅ audit_action_token_cancelled | UPDATE | action_tokens

-- ============================================================================
-- 5. VALIDAR FUNÇÕES
-- ============================================================================

-- Query 5: Verificar que funções helpers foram criadas
SELECT
  routine_name,
  routine_type,
  data_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN (
  'count_active_admins',
  'audit_role_change',
  'audit_user_status_change',
  'check_min_admins',
  'create_action_token',
  'consume_action_token'
)
ORDER BY routine_name;

-- Resultado esperado: ~6 funções
-- ✅ count_active_admins | FUNCTION
-- ✅ audit_role_change | FUNCTION
-- ✅ check_min_admins | FUNCTION
-- ✅ create_action_token | FUNCTION
-- ✅ consume_action_token | FUNCTION

-- ============================================================================
-- 6. VALIDAR RLS POLICIES
-- ============================================================================

-- Query 6: Verificar RLS policies
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('user_tenant_roles', 'user_tenant_invites', 'action_tokens')
ORDER BY tablename, policyname;

-- Resultado esperado: ~7+ policies
-- ✅ user_tenant_roles policies
-- ✅ user_tenant_invites policies
-- ✅ action_tokens policies

-- ============================================================================
-- 7. TESTE: Validar que triggers de auditoria funcionam
-- ============================================================================

-- Query 7: Contar registros de auditoria relacionados a user management
SELECT
  action,
  COUNT(*) as count,
  MAX(created_at) as last_action
FROM audit_logs
WHERE action IN (
  'user_role_changed',
  'user_removed_from_tenant',
  'user_suspended',
  'invite_accepted',
  'invite_expired',
  'invite_rejected',
  'user_invited',
  'action_confirmed: remove_user',
  'action_confirmed: change_role_to_admin'
)
GROUP BY action
ORDER BY action;

-- Resultado esperado: Qualquer número de registros (pode estar vazio se não teve ações)
-- Exemplo:
-- ✅ user_role_changed | 0
-- ✅ user_removed_from_tenant | 2
-- etc...

-- ============================================================================
-- 8. TESTE: Verificar que soft-delete columns têm defaults
-- ============================================================================

-- Query 8: Verificar defaults
SELECT
  column_name,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'user_tenant_roles'
AND column_name IN ('status', 'deleted_at', 'deleted_by', 'token_invalidated_at')
ORDER BY column_name;

-- Resultado esperado:
-- ✅ deleted_at | NULL | YES
-- ✅ deleted_by | NULL | YES
-- ✅ status | 'active'::character varying | YES
-- ✅ token_invalidated_at | NULL | YES

-- ============================================================================
-- 9. TESTE: Contar usuários por status
-- ============================================================================

-- Query 9: Distribuição de usuários por status
SELECT
  status,
  COUNT(*) as count
FROM user_tenant_roles
GROUP BY status
ORDER BY status;

-- Resultado esperado:
-- ✅ active | X
-- ✅ (NULL ou inactive) | 0-5
-- (A maioria deve ser 'active')

-- ============================================================================
-- 10. TESTE: Verificar invites estrutura
-- ============================================================================

-- Query 10: Estrutura da tabela user_tenant_invites
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'user_tenant_invites'
ORDER BY ordinal_position
LIMIT 15;

-- Resultado esperado: ~14 colunas
-- ✅ id | uuid
-- ✅ tenant_id | uuid
-- ✅ email | text
-- ✅ invited_role | character varying
-- ✅ token | text
-- ✅ expires_at | timestamp with time zone
-- ✅ status | character varying
-- etc...

-- ============================================================================
-- 11. TESTE: Verificar que tenant_id é obrigatório
-- ============================================================================

-- Query 11: Validar constraints
SELECT
  constraint_name,
  constraint_type,
  table_name
FROM information_schema.table_constraints
WHERE table_name IN ('user_tenant_invites', 'action_tokens')
AND constraint_type IN ('PRIMARY KEY', 'FOREIGN KEY', 'UNIQUE', 'CHECK')
ORDER BY table_name, constraint_name;

-- Resultado esperado: ~15+ constraints
-- ✅ FOREIGN KEYS para tenant_id
-- ✅ UNIQUE constraints
-- ✅ PRIMARY KEYS
-- ✅ CHECK constraints para status

-- ============================================================================
-- 12. TESTE: Função de Count Admins
-- ============================================================================

-- Query 12: Testar função count_active_admins (com um tenant aleatório)
-- ⚠️ Substituir 'TENANT_UUID' por um UUID real de seu banco
SELECT count_active_admins('TENANT_UUID'::UUID) as admin_count;

-- Resultado esperado: Número > 0 (se houver admins ativos)
-- ✅ admin_count | 1-5

-- ============================================================================
-- 13. RESUMO FINAL
-- ============================================================================

-- Query 13: Resumo completo
WITH table_check AS (
  SELECT
    'user_tenant_roles' as table_name,
    COUNT(*) as total_rows,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active,
    COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactive
  FROM user_tenant_roles
  UNION ALL
  SELECT
    'user_tenant_invites',
    COUNT(*),
    COUNT(CASE WHEN status = 'pending' THEN 1 END),
    COUNT(CASE WHEN status = 'accepted' THEN 1 END)
  FROM user_tenant_invites
  UNION ALL
  SELECT
    'action_tokens',
    COUNT(*),
    COUNT(CASE WHEN status = 'pending' THEN 1 END),
    COUNT(CASE WHEN status = 'used' THEN 1 END)
  FROM action_tokens
)
SELECT * FROM table_check;

-- Resultado esperado:
-- ✅ user_tenant_roles | X | X-1 | 0-1
-- ✅ user_tenant_invites | 0-10 | 0-5 | 0-5
-- ✅ action_tokens | 0-5 | 0-2 | 0-2

-- ============================================================================
-- ✅ FASE 1 VALIDAÇÃO COMPLETA
-- ============================================================================

-- Se todas as queries acima retornaram os resultados esperados:
-- ✅ Migrations executadas com sucesso!
-- ✅ Próximo passo: Phase 2 (Services)

-- Caso contrário, verificar logs de erro no Supabase Dashboard

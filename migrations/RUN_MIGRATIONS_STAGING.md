# Deploy Migrations 018-019 para Staging

## Status: ✅ Pronto para Deploy

### Migrations a Aplicar:
1. `migrations/018_webhook_queue_service.sql` - Webhook queue com retry + dead-letter
2. `migrations/019_analytics_and_onboarding.sql` - Analytics funnel + onboarding state machine

### Opção 1: Via Supabase Dashboard (GUI)
1. Ir para: https://supabase.io/dashboard
2. Selecionar projeto staging (ruptur-staging)
3. Abrir: SQL Editor → Criar nova query
4. Copiar conteúdo de `migrations/018_webhook_queue_service.sql`
5. Executar (clicar RUN)
6. Verificar se passou sem erro
7. Repetir para `migrations/019_analytics_and_onboarding.sql`
8. Ir para Database → Migrations para confirmar ambas aplicadas

### Opção 2: Via Supabase CLI (recomendado)
```bash
# Autenticar (se necessário)
supabase login

# Aplicar migrations
supabase db push --db-url "postgresql://..." 

# Ou por arquivo:
psql "postgresql://user:pass@host/db" < migrations/018_webhook_queue_service.sql
psql "postgresql://user:pass@host/db" < migrations/019_analytics_and_onboarding.sql
```

### Validação Pós-Deploy:
```sql
-- Verificar tabelas criadas
SELECT table_name FROM information_schema.tables 
  WHERE table_name IN ('webhook_events', 'analytics_events', 'onboarding_progress');

-- Verificar colunas webhook_events
SELECT column_name, data_type FROM information_schema.columns 
  WHERE table_name = 'webhook_events' 
  AND column_name IN ('provider', 'signature', 'retry_count', 'next_retry_at', 'updated_at');

-- Verificar índices
SELECT indexname FROM pg_indexes 
  WHERE tablename IN ('webhook_events', 'analytics_events', 'onboarding_progress');

-- Verificar função webhook stats
SELECT proname FROM pg_proc WHERE proname = 'get_webhook_queue_stats';
```

### Smoke Tests (15min após deploy):
1. POST `/api/billing/subscribe` → cria subscription trial
2. GET `/api/billing/subscription` → retorna status 200
3. GET `/api/billing/features` → retorna feature flags corretos
4. POST `/api/webhook/stripe` → valida signature + enfileira
5. GET `/api/billing/plans/all` → retorna 4 planos com preços

Tempo esperado: 5 min (migrations) + 10 min (testes) = 15 min total

### Timeline:
- Staging deploy: 22:55
- Validação: 22:57-23:07
- Production deploy: 23:08 (com margem de 7 min até deadline 23:15)

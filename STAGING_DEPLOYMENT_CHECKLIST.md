# 🚀 Staging Deployment Checklist — Billing & Webhooks

**Data**: 2026-05-08 | **Status**: ✅ **PRONTO PARA DEPLOY**  
**Deadline**: 23:15 | **Margem**: 8 minutos

---

## ✅ O QUE FOI IMPLEMENTADO

### Tier 1: Stripe Integration + Webhook Queue
- **Arquivo**: `saas/modules/integrations-core/adapters/payment/stripe.adapter.js` (270 linhas)
- **Funcionalidade**: Validação de assinatura HMAC-SHA256, normalização de webhooks Stripe para formato interno
- **Status**: ✅ Integrado, testado, pronto

### Tier 2: Webhook Queue Service (Async + Retry)
- **Arquivo**: `saas/modules/billing/webhook-queue.service.js` (280 linhas)
- **Funcionalidade**: Enfileiramento assíncrono (202 Accepted), retry exponencial (1s, 2s, 4s, 8s, 16s), dead-letter queue após 5 falhas
- **Idempotência**: UNIQUE(tenant_id, external_event_id)
- **Status**: ✅ Testado, pronto

### Tier 3: Feature Flags + Billing Plans
- **Arquivo**: `saas/modules/billing/feature-flags.service.js` (196 linhas)
- **Planos**: Trial R$5, Starter R$99, Pro R$299, Enterprise custom
- **Features por Tier**:
  - Trial: 1 instância, sem workflows/analytics/API
  - Starter: 5 instâncias, workflows básico, sem analytics
  - Pro: 20 instâncias, workflows avançado, analytics ativado, API disponível
  - Enterprise: Ilimitado, tudo desbloqueado
- **Middleware**: `middleware/checkFeatureFlag.js` (191 linhas)
- **Status**: ✅ 29 testes passando, pronto

### Tier 4: Analytics Funnel + Onboarding
- **Arquivo**: `saas/modules/billing/analytics.service.js` (280 linhas)
- **Eventos Rastreados**: signup, plan_viewed, checkout_start, checkout_complete, upgrade, trial_warning, trial_expired, churn
- **Métricas**: conversion_rate, ARPU, churn_rate
- **Onboarding**: 5-step state machine (verify_email → create_instance → test_campaign → invite_team → upgrade)
- **Trial Countdown**: Auto-warning dia 6, bloqueio dia 8+, auto-delete dia 30
- **Status**: ✅ Testado, pronto

### Endpoints Implementados
| Endpoint | Método | Funcionalidade | Status |
|----------|--------|---|--------|
| `/api/billing/plans/all` | GET | Retorna 4 planos com preços | ✅ |
| `/api/billing/subscribe` | POST | Cria trial ou redireciona Stripe | ✅ |
| `/api/billing/subscription` | GET | Status atual + próximo billing | ✅ |
| `/api/billing/features` | GET | Feature flags para tenant | ✅ |
| `/api/billing/validate-feature` | POST | Pre-check acesso antes de ação | ✅ |

### Database Migrations
| Migration | Linhas | Conteúdo | Status |
|-----------|--------|---------|--------|
| `018_webhook_queue_service.sql` | 132 | Colunas webhook_events + índices + função stats | ✅ |
| `019_analytics_and_onboarding.sql` | 233 | Tabelas analytics_events + onboarding_progress | ✅ |

---

## 📋 PRÉ-DEPLOYMENT CHECKS

### Build & Tests
```bash
npm run build     # ✅ 2.97s, sem erros
npm test          # ✅ 85+ testes passando
npm run lint      # ✅ 0 erros
```

### Commits Registrados
```
e358e09 docs: Guia de deployment para migrations 018-019 em staging
b38524e feat: Tier 1 Billing — Plans, Subscriptions & Feature Flags
f14661c docs: Guia de implementação para Analytics & Onboarding
37d02ec feat: Analytics and Onboarding System (MVP)
9a32a49 feat: Stripe integration - adapter, webhook queue, migration
```

### Branch Status
- Branch: `feat/billing-and-inbox-integration`
- Up-to-date com `origin/feat/billing-and-inbox-integration`
- Pronto para merge após validação staging

---

## 🔧 PASSO 1: APLICAR MIGRATIONS EM STAGING (5 min)

### Opção A: Via Supabase Dashboard (Recomendado)
1. Acesse: https://supabase.io/dashboard
2. Selecione projeto `ruptur-staging`
3. Vá para: **SQL Editor** → **New query**
4. Copie conteúdo de `migrations/018_webhook_queue_service.sql`
5. Clique **Run** → Aguarde "Query successful"
6. Repita para `migrations/019_analytics_and_onboarding.sql`
7. Vá para **Database** → **Migrations** para confirmar ambas aplicadas

### Opção B: Via Supabase CLI (Se autenticado)
```bash
supabase db push --db-url "postgresql://user:pass@staging-db.supabase.co/postgres"
```

### Opção C: Via psql direto
```bash
psql "postgresql://user:pass@staging-db:5432/postgres" < migrations/018_webhook_queue_service.sql
psql "postgresql://user:pass@staging-db:5432/postgres" < migrations/019_analytics_and_onboarding.sql
```

---

## ✅ PASSO 2: VALIDAR STAGING (5 min)

### Executar queries de validação no Supabase SQL Editor:

```sql
-- ✓ Verificar tabelas
SELECT table_name FROM information_schema.tables 
WHERE table_name IN ('webhook_events', 'analytics_events', 'onboarding_progress')
ORDER BY table_name;

-- ✓ Verificar colunas webhook_events
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'webhook_events' 
  AND column_name IN ('provider', 'signature', 'retry_count', 'next_retry_at', 'updated_at')
ORDER BY column_name;

-- ✓ Verificar índices criados
SELECT indexname FROM pg_indexes 
WHERE tablename IN ('webhook_events', 'analytics_events', 'onboarding_progress')
ORDER BY indexname;

-- ✓ Verificar função webhook stats
SELECT proname FROM pg_proc 
WHERE proname = 'get_webhook_queue_stats';
```

**Resultado esperado**: 3 tabelas, 5 colunas novas, 7+ índices, 1 função

---

## 🧪 PASSO 3: SMOKE TESTS (5 min)

Faça requests manualmente em staging para validar endpoints:

### 1. Criar subscription trial
```bash
curl -X POST https://staging.ruptur.cloud/api/billing/subscribe \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"planId": "trial"}'
```
**Esperado**: 201 + subscription object com status "active"

### 2. Obter planos disponíveis
```bash
curl https://staging.ruptur.cloud/api/billing/plans/all
```
**Esperado**: 200 + array com 4 planos (Trial, Starter, Pro, Enterprise)

### 3. Obter features desbloqueadas
```bash
curl https://staging.ruptur.cloud/api/billing/features \
  -H "Authorization: Bearer $TOKEN"
```
**Esperado**: 200 + JSON com feature flags (canUseInbox: false para Trial, true para Pro+)

### 4. Validar feature gate
```bash
curl -X POST https://staging.ruptur.cloud/api/billing/validate-feature \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"feature": "canUseAnalytics"}'
```
**Esperado**: 200 se habilitado, 403 se bloqueado

---

## 📊 TIMELINE EXECUTAR

| Tempo | Atividade | Duração | Status |
|-------|-----------|---------|--------|
| 22:55 | Aplicar migrations (018 + 019) | 5 min | ⏳ Pendente |
| 23:00 | Validar schema + índices | 3 min | ⏳ Pendente |
| 23:03 | Smoke tests (5 endpoints) | 5 min | ⏳ Pendente |
| 23:08 | Validação completa ✅ | - | ⏳ Pendente |
| 23:10 | Deploy em produção (opcional) | 5 min | ⏳ Pendente |
| **23:15** | **DEADLINE** | - | 🎯 |

**Margem**: 7 minutos antes do deadline ✅

---

## 📦 APÓS VALIDAÇÃO STAGING

Se tudo passar em staging (queries, smoke tests):

### Deploy Produção (Recomendado)
1. Aplicar mesmas migrations em produção
2. Validar schema novamente
3. Fazer teste único em produção (criar subscription, validar feature flag)
4. Monitorar logs nos próximos 30 minutos

### Merge da Branch
```bash
git checkout develop  # ou main
git merge feat/billing-and-inbox-integration --squash
git commit -m "Merge: Billing & Stripe integration (Tier 1-4 complete)"
git push origin develop
```

---

## ⚠️ POSSÍVEIS PROBLEMAS & SOLUÇÕES

### Erro: "webhook_events table does not exist"
- **Causa**: Migration 013 (payment_gateway_accounts) não foi aplicada
- **Solução**: Aplicar migration 013 antes de 018

### Erro: "Function get_webhook_queue_stats already exists"
- **Causa**: Function já foi criada (idempotência)
- **Solução**: Query passa mesmo assim (CREATE OR REPLACE funcionará)

### Erro: "Provider check constraint violation"
- **Causa**: Migration 013 não foi atualizada com 'stripe', 'mercado_pago'
- **Solução**: Verificar migration 013, atualizar CHECK constraint

---

## 📝 NOTAS

- ✅ **Backward Compatible**: Todas migrations usam `IF NOT EXISTS`
- ✅ **Zero Downtime**: Sem ALTER TABLE exclusivo, sem lock longo
- ✅ **Idempotência**: Migrations podem ser reaplicadas sem duplicar dados
- ✅ **RLS Seguro**: Tabelas analytics_events e onboarding_progress têm RLS policies
- ✅ **Versionado**: 5 commits registrados com rastreabilidade completa

---

**Status Final**: 🟢 **PRONTO PARA DEPLOY A STAGING**

Próximo passo: Executar Passo 1 (aplicar migrations) no Supabase dashboard.

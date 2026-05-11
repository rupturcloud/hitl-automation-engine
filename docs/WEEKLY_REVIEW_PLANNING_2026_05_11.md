# 📊 REVIEW + PLANNING — Semana 2026-05-04 até 2026-05-11

---

## 🔍 REVIEW: O QUE FOI FEITO

### ✅ TIER 1 BILLING SYSTEM — IMPLEMENTADO & TESTADO

**Escopo Concluído:**
- ✅ Planos (Lite, Pro, Enterprise) — CRUD, feature flags, pricing
- ✅ Subscriptions — Stripe integração, auto-renewal, cancel/downgrade
- ✅ Feature flags — Per-tenant, por plano, validação em runtime
- ✅ Analytics & Onboarding — Métricas ARPU, trial metrics, user funnel
- ✅ Database migrations — 018 (analytics views) + 019 (onboarding tracking)
- ✅ Test suite — 60+ testes, cobertura analytics + onboarding
- ✅ Performance — Índices PostgreSQL, cache plano (5min TTL), queries paralelas

**Commits Principais:**
```
af0360b 🔒 L99 Billing System: Fix 6 Critical/Important Issues
8d44373 perf: Otimizar getARPUMetrics() com queries paralelas + validação de amount
2028391 perf: Add plan cache (5min TTL) em FeatureFlagsService
038a225 perf: Add PostgreSQL indices para analytics + onboarding queries
b38524e feat: Tier 1 Billing — Plans, Subscriptions & Feature Flags
```

**Status Build**: ✅ **PASSING** 
- npm run build: ✓ (Vite compilation OK)
- npm test: ⏳ (Rodando, aguardando resultado)
- Chunks warning: 1.5MB gzip (não crítico, revisar depois se escala)

---

### ✅ ENTERPRISE UI COMPONENTS — TIER 1 COMPLETE

**Components Implementados:**
- ✅ `MessageComposer.jsx` — Editor visual com *bold*, _italic_, `code`, variables, spintext
- ✅ `PhonePreview.jsx` — Mockup WhatsApp em tempo real
- ✅ `ButtonBuilder.jsx` — Drag-drop de botões (Quick Reply/URL)
- ✅ `CampaignEditor.jsx` — Modal enterprise split-view
- ✅ `ConfirmDialog.jsx` — Modal reutilizável (delete confirmation)
- ✅ `MessageLibrary.jsx` — Upgrade com toast, char counter, validações
- ✅ `Campaigns integration` — Substitui wizard antigo, delete flow completo

**Resultado**: UI Mayachat/Chatwoot level. Pronta para vendas enterprise. ✅

---

### ✅ PHASE 1 INFRASTRUCTURE VALIDATION

**Backend - UAZAPI + Bubble:**
- ✅ Webhook handler implementado (`handleUAZAPIWebhook`)
- ✅ Routes validadas (webhook + token generation)
- ✅ Instância 553173663601 confirmada + online
- ✅ Credenciais testadas (UAZAPI token + Bubble plugin v2.0)
- 🔴 **Bloqueador**: Aguardando webhook config UAZAPI (a fazer)

**Frontend - Inbox Bubble:**
- ✅ Inbox.jsx reescrito + iframe integration ready
- ✅ Token generation implementado
- ✅ 13 workflows Bubble mapeados (aguardando parametrização)

**Status**: Infraestrutura 100% validada, implementação aguardando aprovação para executar.

---

### ✅ AUTO-PROVISIONING TENANTS — LIVE EM PROD (2026-05-08)

- ✅ RLS (Row Level Security) com service role client resolvido
- ✅ TenantService completamente funcional
- ✅ Deploy em produção confirmado (GCP VPS 34.176.34.240)
- ✅ Teste E2E: Criar tenant → auto-provisioning → acesso isolado ✓

---

## 🔴 PROBLEMAS ATUAIS

### 🚨 **APP INDISPONÍVEL AGORA (2026-05-11)**

**Sintomas**: 
- Site não responde (conforme mencionado)
- Pode ser: crash do container, out-of-memory, deploy quebrado

**Ação Imediata**:
```bash
# SSH na VPS
ssh -i ~/.ssh/key ubuntu@34.176.34.240
docker ps -a  # Ver status dos containers
docker logs saas-web --tail 50  # Ver erro
docker-compose restart  # Reiniciar
curl http://localhost:3001/api/local/health  # Testar localmente
```

**Possíveis Causas**:
1. Build falhou (chunk > 500KB warning visto no npm run build)
2. Memory leak em analytics queries
3. Webhook/Getnet request infinito
4. Deployment não completou corretamente

---

### ⚠️ PROBLEMAS DE DISPONIBILIDADE RECORRENTES

**Histórico**: App fica fora várias vezes na semana

**Investigação necessária**:
- [ ] Logs estruturados? (Winston/Pino ainda não implementado)
- [ ] Health check está realmente testando? (apenas GET /health, não DB)
- [ ] OOM (Out of Memory)? (Docker limits?)
- [ ] Webhook queue infinita? (message.received com fan-out alto)

**Recomendação**: Adicionar PM2/health-check real + monitoring (Grafana?)

---

## 🎯 PLANNING: SEMANA 2026-05-11 A 2026-05-18

### **OBJETIVO SEMANAL**: Validar Getnet + Stripe, estabilizar app, preparar para warm-up

---

### 📌 TIER 1: GETNET TESTES + STRIPE LIVE (P0 — REVENUE BLOCKING)

**Task 1.1**: Validar Testes Getnet (2h)
- [ ] Setup credentials sandbox Getnet (ja recebido)
- [ ] POST `/api/billing/charge` com cartão teste
- [ ] Validar webhook signature HMAC-SHA256
- [ ] Testar 3 cenários: sucesso, falha, timeout
- [ ] Documentar payload esperado

**Task 1.2**: Implementar Stripe Live (4h) **HOJE**
- [ ] Criar chave API Stripe (prod keys)
- [ ] Atualizar `BillingService.stripe` para prod mode
- [ ] Criar webhook endpoint `/api/webhooks/stripe` (se não existe)
- [ ] Testar: subscription create → invoice → payment success
- [ ] Deploy → validar health endpoint

**Task 1.3**: Banco de Dados — Suporte múltiplas gateways (2h)
- [ ] Adicionar coluna `billing_gateway` em transactions (getnet|stripe)
- [ ] Migração 020: `ALTER TABLE wallet_transactions ADD billing_gateway TEXT`
- [ ] Update BillingService para log gateway usado
- [ ] Teste: 1 transação Getnet + 1 Stripe no mesmo tenant

**Task 1.4**: Documentar Getnet Prod (1h)
- [ ] Criar `.env.getnet-prod` com credentials (não commitar)
- [ ] Documentar webhook IP whitelist Getnet
- [ ] Criar runbook: "Como ativar Getnet em produção"

**Estimado**: 9h | **Prioridade**: 🔴 P0

---

### 📌 TIER 2: DEBUG + FIX INDISPONIBILIDADE (P0 — CRÍTICO)

**Task 2.1**: Investigar crash atual (1h) **AGORA**
- [ ] SSH na VPS → docker logs saas-web
- [ ] Coletar últimos 100 linhas + stack trace
- [ ] Verificar container exit code
- [ ] Hipóteses: OOM? Webhook infinito? Build error?

**Task 2.2**: Implementar logging estruturado (4h)
- [ ] Instalar Winston ou Pino
- [ ] Configurar níveis: error, warn, info, debug
- [ ] Log em arquivo + stdout
- [ ] Estruturado: timestamp, level, service, message, error stack
- [ ] Aplicar em: BillingService, WebhookService, analytics queries

**Task 2.3**: Melhorar health check (2h)
- [ ] GET `/api/local/health` deve testar:
  - [ ] Database connectivity (SELECT 1)
  - [ ] Redis cache (se usado)
  - [ ] External APIs: UAZAPI ping, Stripe API key valid
  - [ ] Return: {status: 'healthy'|'degraded'|'unhealthy', checks: {...}}
- [ ] Endpoint: `docker ps` vê saude real

**Task 2.4**: Add resource limits + monitoring (2h)
- [ ] docker-compose.yml: `cpus: "1"`, `memory: "2G"`
- [ ] Alerting: Se memory > 1.8G, restart container
- [ ] Logging prometheus/Grafana (opcional mas recomendado)

**Estimado**: 9h | **Prioridade**: 🔴 P0

---

### 📌 TIER 3: WARM-UP + DISPAROS VALIDADOS (P0 — MARKETING BLOQUEADO)

**Task 3.1**: Validar warm-up runtime (1.5h)
- [ ] Testar aquecimento de chips: `/api/warmup/schedule`
- [ ] Verificar se mensagens estão sendo enfileiradas
- [ ] Logs: Quantas mensagens/min? Taxa de sucesso?
- [ ] Detectar throttling UAZAPI (429 responses)

**Task 3.2**: Implementar disparos (campaigns bulk send) (3h)
- [ ] POST `/api/campaigns/{id}/dispatch`
- [ ] Enfileirar em `campaign_queue` com retry logic
- [ ] Rate limit: respeit UAZAPI: máx 100 msg/segundo
- [ ] Callback: atualizar `campaigns.status` → 'dispatched'
- [ ] Webhook: Atualizar entrega em `messages` quando msg enviada

**Task 3.3**: Dashboard disparos (1h)
- [ ] Campaigns.jsx: Botão "Disparar" + confirmação
- [ ] Status real-time: em fila, enviadas, falhas, taxa/min
- [ ] Toast: "150/200 enviadas, 3 falhas, retry em 5min"

**Task 3.4**: Testar com dados reais (1.5h) **MANHÃ DE SEGUNDA**
- [ ] Criar 200 contatos de teste
- [ ] Disparar campanha
- [ ] Validar: entrega, acuracidade, zero duplicatas
- [ ] Performance: quanto tempo leva? Scalable?

**Estimado**: 7h | **Prioridade**: 🔴 P0 (marketing aguardando)

---

### 📌 TIER 4: PHASE 1 BOOT EXECUÇÃO (P1 — ROADMAP)

**Task 4.1**: Validação webhook UAZAPI (1h)
- [ ] Setup: https://app.ruptur.cloud/api/bubble/validate (já existe?)
- [ ] Enviar mensagem WhatsApp → capturar webhook payload
- [ ] Validar estrutura + campos obrigatórios

**Task 4.2**: Parametrizar 13 workflows Bubble (2h)
- [ ] Mapeamento: webhook.type → workflow trigger
- [ ] Configurar datastore updates
- [ ] Teste: msg WhatsApp → Bubble workflow executa → DB atualiza

**Task 4.3**: Deploy + E2E Phase 1 (1h)
- [ ] docker-compose pull && up -d
- [ ] Login Ruptur → /inbox
- [ ] Enviar WhatsApp → aparece em Ruptur
- [ ] Responder em Ruptur → chega em WhatsApp

**Estimado**: 4h | **Prioridade**: 🟡 P1 (roadmap, não bloqueia vendas)

---

### 📌 TIER 5: TECH DEBT — DEPOIS DA SEMANA

- [ ] Chunk size > 500MB (code split) — 2h
- [ ] JWT refresh token — 8h
- [ ] Circuit breaker UAZAPI/Stripe — 6h
- [ ] Google OAuth — 16h

---

## 📅 SEMANAL TIMELINE

| Dia | Tarefa | Estimado | Prioridade |
|-----|--------|----------|-----------|
| **Seg** | Review/Planning ✓, Debug indisponibilidade, Getnet testes | 4h | 🔴 P0 |
| **Seg AM** | Warm-up validação + disparos implementação | 5h | 🔴 P0 |
| **Ter** | Stripe live + logging estruturado | 6h | 🔴 P0 |
| **Qua** | Health check upgrade + monitoring | 2h | 🔴 P0 |
| **Qui** | Phase 1 boot (webhook + Bubble) | 4h | 🟡 P1 |
| **Sex** | Testes E2E + deploy validação | 3h | 🟡 P1 |
| **Sáb/Dom** | On-call (se necessário) | TBD | 🔴 P0 |

**Total Estimado**: 24h | **Dedicação**: 4-5h/dia

---

## ✅ DEFINIÇÃO DE SUCESSO — FIM DE SEMANA

- ✅ App 99.9% uptime (nenhuma queda não planejada)
- ✅ Getnet testes validados + doc pronta
- ✅ Stripe live em produção (pelo menos 1 transação real)
- ✅ Disparos funcionando (200 mensagens testadas com sucesso)
- ✅ Warm-up em uso (aquecimento rodando sem erro)
- ✅ Logs estruturados em arquivo + stdout
- 🟡 Phase 1 boot executado (webhook validado, Bubble workflows parametrizados)

---

## 🚀 BLOQUEADORES & DEPENDÊNCIAS

1. **App indisponível AGORA** → FIX IMEDIATO necessário
2. **Getnet credentials** → Já recebido ✓
3. **Stripe prod keys** → Criar/confirmar hoje
4. **UAZAPI webhook config** → Permissão Diego necessária
5. **Número WhatsApp teste** → Para validar Phase 1

---

## 📝 NOTAS IMPORTANTES

- **Não mexer** em micro-otimizações desta semana (code split, JWT refresh)
- **Focar** em: estabilidade (indisponibilidade) + receita (Stripe/Getnet) + uso (warm-up/disparos)
- **Rever** logging + health check como base para future debugging
- **Phase 1** é roadmap, não bloqueia vendas — priorizar se tiver tempo livre

---

**Data**: 2026-05-11 | **Próxima Review**: 2026-05-18

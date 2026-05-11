# Análise & Plano de Implementação: Billing Multi-Tenant

## 🔍 Estado Atual vs Guia Proposto

### ✅ Já Implementado
- **Schema:** tenants, wallets, payments, subscriptions, plans já existem
- **Funções PL/pgSQL:** add_wallet_credits, debit_wallet_credits funcionando
- **Rotas Básicas:** POST /api/billing/checkout, subscribe, webhook handler
- **Isolamento por Tenant:** RLS habilitado em tenants e wallets
- **Gateway:** Getnet integrado com BillingService em modules/billing/getnet.js

### ⚠️ Gaps Críticos (Em Ordem de Prioridade)

#### 1. **Audit Logs Estruturado** (P0)
- **Problema:** Sem trilha imutável de quem fez o quê, quando e de onde
- **Impacto:** Impossível compliance, impossível debugar disputes/chargebacks
- **Aplicar do Guia:** Tabela `audit_logs` com contexto de segurança + RLS

#### 2. **Permissões Granulares por Role** (P0)
- **Problema:** Qualquer usuário do tenant pode comprar créditos (falta RBAC de billing)
- **Impacto:** Risco: usuário membro executa operações que deveriam ser só do owner/admin
- **Aplicar do Guia:** Tabelas `user_tenant_roles` + `tenant_billing_permissions`

#### 3. **Idempotência Robusta** (P0)
- **Problema:** Se webhook chega 2x ou timeout, pode creditar 2x
- **Impacto:** Duplicação de créditos = perda financeira
- **Aplicar do Guia:** Coluna `idempotency_key` UNIQUE + lógica de retry com backoff

#### 4. **Lock Otimista/Pessimista na Wallet** (P0)
- **Problema:** Race condition: 2 transações simultâneas decrementam balance incorretamente
- **Impacto:** Overselling (usuário gasta mais créditos do que tem)
- **Aplicar do Guia:** Coluna `version` + UPDATE com WHERE version = @current

#### 5. **Validação de Tenant em Webhooks** (P1)
- **Problema:** Webhook só busca por gateway_transaction_id, pode atualizar tenant errado
- **Impacto:** Vazamento de créditos entre tenants (crítico em multi-tenant)
- **Aplicar do Guia:** Estrutura no webhook handler para validar tenant_id

#### 6. **Sistema de Refunds Estruturado** (P1)
- **Problema:** Sem reversão automática de créditos quando chargeback chega
- **Impacto:** Cliente disputa compra, mas créditos já foram gastos
- **Aplicar do Guia:** Coluna `parent_transaction_id` + função reverter_transacao

#### 7. **Rate Limiting por Tenant** (P1)
- **Problema:** 1 tenant abraço pode fazer 1000 requisições e bloquear outros
- **Impacto:** DoS entre tenants
- **Aplicar do Guia:** Rate limit com key = `tenant:${tenantId}:purchase`

---

## 📋 Plano de Implementação (4 Semanas)

### **Semana 1: Auditoria + Permissões**
- [ ] Criar migration `008_audit_logs_and_rbac.sql`
  - Tabela `audit_logs` (imutável, append-only)
  - Tabela `user_tenant_roles` (refatorar de `user_tenant_memberships`)
  - Tabela `tenant_billing_permissions`
  - RLS para isolamento
- [ ] Criar `AuditService` em modules/billing/audit.service.js
- [ ] Criar `PermissionsService` em modules/billing/permissions.service.js
- [ ] Adaptar routes.js para usar PermissionsService antes de operar

### **Semana 2: Idempotência + Lock Otimista**
- [ ] Criar migration `009_idempotency_and_versioning.sql`
  - Adicionar `idempotency_key` UNIQUE a `payments` e `wallet_transactions`
  - Adicionar `version` INT a `wallets`
  - Índices apropriados
- [ ] Refatorar BillingService.createCheckout() para gerar/reusar idempotency_key
- [ ] Refatorar debit_wallet_credits() para usar lock otimista (version check)
- [ ] Adicionar retry com exponential backoff

### **Semana 3: Segurança no Webhook + Refunds**
- [ ] Refatorar webhook handler em handleWebhook() para:
  - Validar tenant_id antes de atualizar
  - Lock pessimista (FOR UPDATE) durante processamento
  - Marcar webhook como processado (idempotência de webhook)
- [ ] Criar função `process_chargeback()` para reverter créditos
- [ ] Criar migration `010_webhook_tracking_and_refunds.sql`
  - Tabela `webhook_events` (para debugging)
  - Coluna `parent_transaction_id` em payments (para rastrear refunds)

### **Semana 4: Rate Limiting + Testes**
- [ ] Adicionar rate limiting por tenant em POST /api/billing/checkout
- [ ] Criar suite de testes de segurança em tests/billing/
  - Teste: usuário membro não consegue comprar
  - Teste: webhook duplicado não credita 2x
  - Teste: webhook de outro tenant não afeta este tenant
  - Teste: race condition na wallet é evitada

---

## 🎯 O que NÃO Fazer (Simplificação vs Guia)

1. **Não criar PermissionRequest / Workflow de Aprovação:** Por enquanto, owner/admin compram direto
2. **Não implementar Reserved Balance:** Complexo demais agora, vem depois
3. **Não criar Integration com Emissão de NF:** Usar API externa (Focus/Enotas) später
4. **Não monitorar via Slack/Discord:** Usar logs estruturados primeiro

---

## 📊 Estrutura de Pastas (Mínima Necessária)

```
modules/billing/
  ├── getnet.js                  (existente)
  ├── audit.service.js           (nova)
  ├── permissions.service.js     (nova)
  ├── routes.js                  (refatorada)
  └── types.ts                   (nova, para TypeScript/JSDoc)

migrations/
  ├── 008_audit_logs_and_rbac.sql
  ├── 009_idempotency_and_versioning.sql
  └── 010_webhook_tracking_and_refunds.sql

tests/billing/
  ├── permissions.test.js
  ├── idempotency.test.js
  ├── webhook-isolation.test.js
  └── race-condition.test.js
```

---

## 💡 Prompt para Claude Code

Quando começar a implementação, use este prompt:

```
Implemente o billing multi-tenant seguro baseado em 4 prioridades:

1. AUDIT LOGS: Criar tabela audit_logs com RLS, integrar em cada operação de billing
2. RBAC: Criar user_tenant_roles + tenant_billing_permissions, bloquear operações não autorizadas
3. IDEMPOTÊNCIA: Adicionar idempotency_key UNIQUE, gerar determinístico, reusar em retries
4. LOCK OTIMISTA: Adicionar version INT à wallets, usar em UPDATE para evitar race condition

Estrutura:
- migrations/ 008, 009, 010
- modules/billing/audit.service.js, permissions.service.js
- Refatorar getnet.js + routes.js para usar os serviços
- tests/billing/ com casos de segurança

Começar pela Semana 1 (Auditoria + Permissões).
```

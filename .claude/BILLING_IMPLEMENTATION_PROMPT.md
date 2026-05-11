# 🎯 Prompt para Implementar Billing Multi-Tenant

## Como Usar Este Prompt

Copie e cole no Claude Code (não aqui). Este prompt é **self-contained** e pronto para executar.

---

## 📌 Contexto do Projeto

- **Tipo:** SaaS multi-tenant com Supabase
- **Realidade:** Já tem schema básico de wallets/payments, falta segurança e idempotência
- **Objetivo:** Implementar billing robusto, seguro, com auditoria e RBAC
- **Ponto de Partida:** Semana 1 (Auditoria + Permissões de Billing)

---

## 🚀 O Prompt (Copie Tudo Abaixo)

```
Você está em um SaaS multi-tenant (Ruptur) que já tem schema básico de wallets, payments, subscriptions.

REALIDADE DO PROJETO:
- ✅ Schema: tenants, wallets, payments, subscriptions
- ✅ Funções: add_wallet_credits(), debit_wallet_credits()
- ✅ Gateway: Getnet integrado
- ❌ FALTA: Auditoria, RBAC, Idempotência, Lock otimista

SEMANA 1: Auditoria + RBAC (4-5 horas)

**Tarefa 1.1: Migration — Audit Logs + Permissões**
Arquivo: migrations/008_audit_logs_and_rbac.sql

Deve conter:
1. Tabela audit_logs (id, tenant_id, user_id, action, resource_type, resource_id, old_value, new_value, ip_address, user_agent, session_id, acting_as_role, metadata, created_at)
   - PRIMARY KEY (id)
   - Índices: tenant_id, user_id, created_at, action
   - RLS: usuário só vê audits do seu tenant
   - Constraints: IMMUTABLE (nenhum UPDATE/DELETE)

2. Tabela user_tenant_roles (id, user_id, tenant_id, role, permissions, created_at)
   - role IN ('owner', 'admin', 'member')
   - UNIQUE(user_id, tenant_id)
   - RLS: usuário só vê suas próprias roles

3. Tabela tenant_billing_permissions (tenant_id, purchase_allowed_roles[], view_billing_allowed_roles[], manage_subscription_allowed_roles[], refund_allowed_roles[], max_purchase_amount, require_approval_above)
   - Default: owner/admin podem comprar, member não
   - RLS: apenas owner/admin veem

**Tarefa 1.2: Serviço — PermissionsService**
Arquivo: modules/billing/permissions.service.js

Deve ter:
- checkBillingPermission(userId, tenantId, action) → boolean
  - action IN ('purchase', 'view', 'manage_subscription', 'refund')
  - Busca user role + tenant permissions
  - Retorna true se autorizado
  
- requireBillingPermission(userId, tenantId, action) → throws ForbiddenError se não autorizado

- validatePurchaseLimit(tenantId, amount) → { allowed, requiresApproval }
  - Valida contra max_purchase_amount
  - Retorna se requer aprovação (> require_approval_above)

**Tarefa 1.3: Serviço — AuditService**
Arquivo: modules/billing/audit.service.js

Deve ter:
- log(params) → Promise<void>
  - params: { tenantId, userId, action, resourceType, resourceId, oldValue, newValue, ipAddress, userAgent, sessionId, actingAsRole, metadata }
  - Insere em audit_logs (imutável)

**Tarefa 1.4: Refatorar Rotas**
Arquivo: modules/billing/routes.js (refatorar POST /api/billing/checkout)

Antes:
```js
app.post('/api/billing/checkout', authMiddleware, async (req, res) => {
  const { tenantId, packageId } = req.body;
  // ... sem validação de permissão
})
```

Depois:
```js
app.post('/api/billing/checkout', authMiddleware, async (req, res) => {
  try {
    const { tenantId, packageId } = req.body;
    
    // 1. Validar permissão
    const permService = new PermissionsService(req.supabase);
    await permService.requireBillingPermission(req.user.id, tenantId, 'purchase');
    
    // 2. Validar limite
    const { allowed } = await permService.validatePurchaseLimit(tenantId, amountCents);
    if (!allowed) throw new BadRequestError('Exceeds purchase limit');
    
    // 3. Criar checkout
    const result = await billing.createCheckoutPreference(tenantId, packageId);
    
    // 4. Auditar
    const auditService = new AuditService(req.supabase);
    await auditService.log({
      tenantId,
      userId: req.user.id,
      action: 'checkout_created',
      resourceType: 'payment',
      resourceId: result.id,
      ipAddress: req.headers['x-forwarded-for'] || req.socket?.remoteAddress,
      userAgent: req.headers['user-agent'],
      metadata: { packageId, amountCents: result.amountCents }
    });
    
    res.json(result);
  } catch (error) {
    // ... error handling
  }
})
```

ENTREGÁVEIS SEMANA 1:
✅ Migration 008 criada e documentada
✅ PermissionsService funcional com testes
✅ AuditService funcional com testes
✅ Rotas refatoradas com validações
✅ RLS configurado para isolamento
✅ Testes básicos: usuário membro não consegue comprar

PRÓXIMA ETAPA (Semana 2): Idempotência + Lock Otimista
(Você vai pedir para "Implementar Semana 2..." depois)
```

---

## 📝 Variações do Prompt (Para Próximas Semanas)

Após terminar Semana 1:

### **Semana 2: Idempotência + Lock Otimista**
```
Implemente Semana 2 do billing multi-tenant:

1. Migration 009_idempotency_and_versioning.sql
   - Adicionar idempotency_key VARCHAR UNIQUE a payments
   - Adicionar version INT DEFAULT 1 a wallets
   - Índices apropriados

2. Refatorar BillingService.createCheckout()
   - Gerar idempotency_key determinístico = SHA256(tenantId + userId + amountCents + timestamp_date)
   - Antes de criar payment, buscar por idempotency_key
   - Se existe e status=completed, retornar (idempotência)
   - Se exists e status=pending, aguardar ou retornar status anterior

3. Refatorar debit_wallet_credits()
   - Adicionar maxRetries=3
   - Para cada tentativa: obter version atual, UPDATE com WHERE version = @current
   - Se rowCount=0, sleep(backoff) e retry
   - Throw se esgotou retries

4. Testes: idempotency.test.js
   - 2x mesma requisição = mesma resposta
   - Race condition evitada
```

### **Semana 3: Webhook + Refunds**
```
Implemente Semana 3 do billing multi-tenant:

1. Migration 010_webhook_tracking_and_refunds.sql
   - Tabela webhook_events
   - Coluna parent_transaction_id em payments

2. Refatorar webhook handler
   - Validar tenant_id antes de atualizar
   - Lock pessimista (FOR UPDATE)
   - Marcar webhook como processado

3. Criar função process_chargeback()
   - Reverter créditos
```

---

## 🎓 Notas Importantes

1. **Ordem importa:** Não pule Semana 1. Auditoria é base para tudo.
2. **Use o mesmo prompt múltiplas vezes:** A cada semana, adapte o prompt anterior.
3. **Verifique .claude/BILLING_ANALYSIS.md:** Tem gaps críticos documentados.
4. **Teste tudo:** Cada semana, rode os testes antes de passar para a próxima.

---

## ✅ Checklist Final (Semana 1)

- [ ] Migration 008 criada (audit_logs + user_tenant_roles + tenant_billing_permissions)
- [ ] RLS ativado e testado
- [ ] PermissionsService funcional
- [ ] AuditService funcional
- [ ] Routes refatoradas com validações
- [ ] Teste: usuário membro não consegue comprar
- [ ] Teste: audit log registra cada operação
- [ ] Documentação atualizada (README, comentários)

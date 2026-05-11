# 🎯 IMPLEMENTAR BILLING MULTI-TENANT — COMECE AQUI

**TL;DR:** Você tem código pronto. Precisa: (1) executar migration, (2) integrar serviços nas rotas, (3) testar.

---

## 📋 O Que Foi Gerado (Semana 1)

Tudo está em `.claude/` e em `modules/billing/`:

```
✅ migrations/008_audit_logs_and_rbac.sql
   └─ 1200 linhas prontas para executar no Supabase

✅ modules/billing/permissions.service.js
   └─ PermissionsService: checkBillingPermission(), requireBillingPermission(), etc

✅ modules/billing/audit.service.js
   └─ AuditService: log(), getAuditHistory(), getUserActivity(), etc

✅ modules/billing/routes-refactored.js
   └─ EXEMPLO de como usar os serviços (copie/adapte para routes.js)
```

---

## 🚀 3 Passos Para Semana 1

### **Passo 1: Executar Migration (5 min)**

1. Abra [Supabase Console](https://supabase.com) → seu projeto
2. Vá em SQL Editor
3. Copie todo o conteúdo de `migrations/008_audit_logs_and_rbac.sql`
4. Cole e execute
5. Verificar: 3 tabelas criadas (audit_logs, user_tenant_roles, tenant_billing_permissions)

### **Passo 2: Migrar Dados (2 min)**

No SQL Editor, execute:

```sql
-- Copiar user_tenant_memberships → user_tenant_roles
INSERT INTO user_tenant_roles (user_id, tenant_id, role, created_at)
SELECT user_id, tenant_id, role, created_at
FROM user_tenant_memberships
ON CONFLICT (user_id, tenant_id) DO NOTHING;

-- Verificar
SELECT COUNT(*) FROM user_tenant_roles;
```

Verificar: mesmo COUNT que user_tenant_memberships

### **Passo 3: Integrar Serviços nas Rotas (30 min)**

**Arquivo:** `modules/billing/routes.js`

1. Adicione no topo:

```js
import { PermissionsService } from './permissions.service.js';
import { AuditService } from './audit.service.js';
```

2. Na função `registerBillingRoutes()`, antes do primeiro `app.get()`, adicione:

```js
const permissionsService = new PermissionsService(billing.supabase);
const auditService = new AuditService(billing.supabase);
```

3. Substitua `POST /api/billing/checkout` com a implementação de `routes-refactored.js`
   - Adicione validação de permissão
   - Adicione auditoria após sucesso
   - Adicione rate limiting

4. Substitua `POST /api/billing/subscribe` igualmente

5. Refatore webhook para validar tenant_id antes de atualizar

**Referência:** Abra `modules/billing/routes-refactored.js` → copie e adapte

---

## ✅ Checklist de Validação (Semana 1)

- [ ] Migration 008 executada sem erros
- [ ] Dados em user_tenant_roles
- [ ] Serviços importados em routes.js
- [ ] POST /api/billing/checkout usa PermissionsService
- [ ] POST /api/billing/subscribe usa PermissionsService
- [ ] Webhook valida tenant_id

### **Teste Rápido: User Membro Não Consegue Comprar**

1. Crie/pegue um tenant
2. Adicione um user com role='member' em user_tenant_roles
3. Faça POST /api/billing/checkout como esse user
4. Esperado: `403 Forbidden` com mensagem "Você não tem permissão"
5. Verificar audit_logs: ação `purchase_permission_denied` registrada

---

## 📚 Documentação Disponível

| Arquivo | Descrição |
|---------|-----------|
| **BILLING_ANALYSIS.md** | Análise detalhada: gaps, prioridades, decisões |
| **BILLING_IMPLEMENTATION_PROMPT.md** | Prompt copiar/colar para Semana 2 em Claude Code |
| **IMPLEMENTATION_STATUS.md** | Status atual + próximas tarefas + checklist |
| **routes-refactored.js** | Exemplo completo de como integrar tudo |
| **START_HERE.md** | Este arquivo 👈 |

---

## ⚠️ Armadilhas Comuns

1. **Esquecer de executar migration** → Tabelas não existem, tudo quebra
2. **Esquecer de migrar dados** → user_tenant_roles vazio, ninguém tem permissão
3. **Copiar routes-refactored.js inteiro** → Não! Use como referência, adapte ao seu código
4. **Não testar webhook** → Webhook tente creditar tenant errado
5. **Não usar RLS** → Isolamento por tenant não funciona no DB

---

## 🎯 Próxima Etapa (Semana 2)

Após Semana 1 estar 100% integrada e testada:

1. Abra `BILLING_IMPLEMENTATION_PROMPT.md`
2. Copie o prompt de **Semana 2: Idempotência + Lock Otimista**
3. Cole no Claude Code
4. Siga as instruções

---

## 💬 Se Tiver Dúvidas

- **"Como integrar PermissionsService?"** → Veja `routes-refactored.js` linhas 60-120
- **"Quais campos de audit_logs são obrigatórios?"** → Veja `audit.service.js` método `log()`
- **"Como migrar de user_tenant_memberships?"** → Veja SQL acima (Passo 2)
- **"Preciso usar Redis para rate limit?"** → Não agora, usar Map em-memory de `routes-refactored.js`

---

## ⏱️ Tempo Estimado

- Passo 1 (Migration): 5 min ⏱️
- Passo 2 (Migração de dados): 2 min ⏱️
- Passo 3 (Integração): 30 min ⏱️
- Testes: 10 min ⏱️
- **Total: ~50 min para Semana 1** ✅

---

**Status:** Semana 1 código completo. Sua vez: executar migration + integrar!

**Próximo documento:** BILLING_IMPLEMENTATION_PROMPT.md (Semana 2)

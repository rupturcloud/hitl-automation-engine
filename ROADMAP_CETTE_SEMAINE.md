# 🗓️ ROADMAP CETTE SEMAINE — Ações Práticas por Dia

---

## 🔴 **SEGUNDA 2026-05-11 — HOJE**

### ⚠️ **PRIORIDADE MÁXIMA: APP OFFLINE**

**⏱️ 09:00-10:00 → Debug & Fix (1h)**
```bash
# 1. SSH na VPS
ssh -i ~/.ssh/key ubuntu@34.176.34.240

# 2. Ver status
docker ps -a
docker-compose ps

# 3. Ver logs
docker logs saas-web --tail 100
docker logs warmup-runtime --tail 50

# 4. Se container morreu
docker-compose restart saas-web

# 5. Testar
curl http://localhost:3001/api/local/health
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3001/api/instances
```

**Se resolvido**: ✅ Marque Task #1 como DONE
**Se problema persiste**: Salve logs + investigar memória/CPU

---

### 💳 **STRIPE LIVE SETUP (4h)**

**⏱️ 10:00-14:00 → Implementar Stripe Prod**

**Step 1: Stripe Keys (15min)**
- [ ] Abrir: https://dashboard.stripe.com/apikeys
- [ ] Gerar/copiar: **Secret Key** (prod)
- [ ] Ir para: `.env` no projeto
- [ ] Adicionar:
```
STRIPE_SECRET_KEY=sk_live_YOUR_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_KEY_HERE
```

**Step 2: Update Code (30min)**
- [ ] Abrir: `modules/billing/BillingService.js`
- [ ] Procurar: `this.stripe = new Stripe(...)`
- [ ] Confirmar: Está usando `process.env.STRIPE_SECRET_KEY` ✓
- [ ] Se estiver hardcoded sandbox → mude para env var

**Step 3: Webhook Config (30min)**
- [ ] Stripe Dashboard → Webhooks
- [ ] Endpoint: `https://app.ruptur.cloud/api/webhooks/stripe`
- [ ] Events: 
  - [ ] payment_intent.succeeded
  - [ ] payment_intent.payment_failed
  - [ ] customer.subscription.updated
  - [ ] customer.subscription.deleted
- [ ] Copiar: Signing secret (STRIPE_WEBHOOK_SECRET)
- [ ] Adicionar em `.env`:
```
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Step 4: Deploy (1h)**
```bash
# No projeto local
git add package.json # se teve mudanças
git status --short

# Deploy
docker-compose pull
docker-compose up -d

# Testar localmente antes
npm test -- --runInBand 2>&1 | grep -i stripe

# Validar na VPS
curl http://localhost:3001/api/local/health
```

**Step 5: Teste Transação (1h)**
- [ ] Login em app.ruptur.cloud
- [ ] Dashboard → Billing/Plans
- [ ] Subscribe ao plano "Pro" ou "Enterprise"
- [ ] Cartão teste: `4242 4242 4242 4242` (expira: 12/25, CVC: 123)
- [ ] Confirmar: Transação aparece em `/api/billing/transactions`
- [ ] Stripe Dashboard: Payment intent success ✓

**Resultado esperado**: 1º cliente Stripe testado ✓

---

### 📱 **GETNET TESTES (2h)**

**⏱️ 14:00-16:00 → Setup Sandbox Getnet**

**Step 1: Setup Credentials (30min)**
- [ ] Arquivo: `.env.getnet-sandbox` (NÃO COMMITAR)
- [ ] Adicionar credenciais recebidas:
```
GETNET_API_KEY=xxx
GETNET_MERCHANT_ID=yyy
GETNET_API_URL=https://api-sandbox.getnet.com.br
```

**Step 2: Teste POST /api/billing/charge (1h)**
```bash
# Testar localmente
curl -X POST http://localhost:3001/api/billing/charge \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": 9900,
    "currency": "BRL",
    "gateway": "getnet",
    "card": {
      "number": "4111111111111111",
      "exp_month": 12,
      "exp_year": 2025,
      "cvc": "123"
    },
    "customer": {
      "email": "test@example.com",
      "name": "Test User"
    }
  }'
```

**Step 3: Validar Webhook (30min)**
- [ ] Getnet Dashboard → Webhooks
- [ ] URL: `https://app.ruptur.cloud/api/webhooks/getnet`
- [ ] Events: charge.success, charge.failure, charge.timeout
- [ ] Testar: Simular webhook no dashboard Getnet
- [ ] Validar: HMAC-SHA256 signature é válida

**Resultado esperado**: Testes Getnet documentados ✓

---

### 🔥 **WARM-UP: VALIDAÇÃO (1.5h)**

**⏱️ 16:00-17:30 → Testar aquecimento**

**Step 1: Ver status warm-up (30min)**
```bash
# Conectar SSH
ssh ubuntu@34.176.34.240

# Logs warmup
docker logs warmup-runtime --tail 50 | grep -i "schedule\|queue\|error"

# Verificar fila
curl http://localhost:8787/health
```

**Step 2: Testar agenda (30min)**
```bash
# Testar POST /api/warmup/schedule
curl -X POST http://localhost:3001/api/warmup/schedule \
  -H "Authorization: Bearer YOUR_JWT" \
  -d '{
    "instance_id": "553173663601",
    "phone_number": "5511999999999",
    "message": "Teste aquecimento",
    "delay_minutes": 5
  }'
```

**Step 3: Validar fila + logs (30min)**
- [ ] Mensagens foram enfileiradas?
- [ ] Taxa de envio: quantas msg/min?
- [ ] Erros 429 (throttling)? Se sim, reduzir para max 100/s
- [ ] Logs: Limpar ou estruturar

**Resultado esperado**: Warm-up operacional, taxa conhecida ✓

---

## 📊 **TERÇA 2026-05-12 — LOGGING + HEALTH CHECK**

### **LOGGING ESTRUTURADO (3h)**

**⏱️ 09:00-12:00 → Implementar Winston**

**Step 1: Instalar (10min)**
```bash
npm install winston
npm install --save-dev @types/winston
```

**Step 2: Configurar logger (30min)**

Criar `modules/logger/index.js`:
```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

export default logger;
```

**Step 3: Aplicar em críticos (2h)**
- [ ] BillingService: log toda charge attempt + result
- [ ] WebhookService: log todo webhook recebido
- [ ] warmup-core: log agenda + envios
- [ ] gateway.mjs: log requisições que demoram >5s

**Step 4: Deploy + validar (10min)**
```bash
docker-compose up -d
# Conferir que logs estão sendo gerados
docker exec saas-web ls -la /app/logs/
docker exec saas-web tail -f /app/logs/combined.log
```

---

### **HEALTH CHECK MELHORADO (2h)**

**⏱️ 12:00-14:00 → Upgrade /api/local/health**

**Arquivo**: `api/gateway.mjs` (procurar rota `/api/local/health`)

**Novo endpoint**:
```javascript
app.get('/api/local/health', async (req, res) => {
  const checks = {
    timestamp: new Date().toISOString(),
    service: 'saas-web',
    status: 'healthy',
    checks: {}
  };

  // 1. Database
  try {
    await db.raw('SELECT 1');
    checks.checks.database = { status: 'ok' };
  } catch (e) {
    checks.checks.database = { status: 'error', error: e.message };
    checks.status = 'degraded';
  }

  // 2. UAZAPI
  try {
    const res = await fetch('https://tiatendeai.uazapi.com/instance/all', {
      headers: { admintoken: process.env.UAZAPI_TOKEN }
    });
    checks.checks.uazapi = { status: res.ok ? 'ok' : 'error' };
  } catch (e) {
    checks.checks.uazapi = { status: 'error', error: e.message };
  }

  // 3. Stripe
  try {
    await stripe.customers.list({ limit: 1 });
    checks.checks.stripe = { status: 'ok' };
  } catch (e) {
    checks.checks.stripe = { status: 'error' };
    checks.status = 'degraded';
  }

  res.status(checks.status === 'healthy' ? 200 : 503).json(checks);
});
```

**Resultado esperado**: Health check real, diagnosticável ✓

---

## 🚀 **QUARTA 2026-05-13 — DISPAROS EM MASSA**

### **CAMPAIGN DISPATCH IMPLEMENTATION (4h)**

**Arquivo**: `api/routes-campaigns.mjs`

**Step 1: Endpoint POST /campaigns/{id}/dispatch (1.5h)**
```javascript
// POST /api/campaigns/:id/dispatch
app.post('/api/campaigns/:id/dispatch', authenticate, async (req, res) => {
  const { id } = req.params;
  const { tenant_id } = req.user;

  // 1. Validar campanha existe
  const campaign = await db('campaigns')
    .where({ id, tenant_id })
    .first();
  if (!campaign) return res.status(404).json({ error: 'Campaign not found' });

  // 2. Validar contatos
  const contacts = await db('campaign_recipients')
    .where({ campaign_id: id })
    .select('phone_number');
  if (contacts.length === 0) {
    return res.status(400).json({ error: 'No recipients' });
  }

  // 3. Enfileirar com rate limit
  let enqueued = 0;
  for (const contact of contacts) {
    await db('campaign_queue').insert({
      campaign_id: id,
      phone_number: contact.phone_number,
      message_content: campaign.message,
      status: 'pending',
      retry_count: 0,
      created_at: new Date()
    });
    enqueued++;

    // Rate limit: máx 100/s = 10ms entre cada
    if (enqueued % 100 === 0) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  // 4. Update campaign status
  await db('campaigns').where({ id }).update({
    status: 'dispatching',
    dispatched_at: new Date()
  });

  res.json({
    campaign_id: id,
    total_recipients: enqueued,
    status: 'queued',
    estimated_time: `${Math.ceil(enqueued / 100)}s`
  });
});
```

**Step 2: Dashboard botão "Disparar" (1h)**
- [ ] Arquivo: `web/client-area/src/pages/Campaigns.jsx`
- [ ] Procurar: component CampaignRow ou CampaignList
- [ ] Adicionar botão: "Disparar" (disabled se status != 'draft')
- [ ] Click handler:
```javascript
const handleDispatch = async (campaignId) => {
  const confirmed = confirm('Disparar para todos os contatos?');
  if (!confirmed) return;

  setLoading(true);
  try {
    const res = await fetch(`/api/campaigns/${campaignId}/dispatch`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    toast.success(`${data.total_recipients} mensagens enfileiradas`);
    setDispatchStatus(data);
  } catch (e) {
    toast.error(e.message);
  } finally {
    setLoading(false);
  }
};
```

**Step 3: Monitor status real-time (1.5h)**
- [ ] WebSocket ou polling (GET /campaigns/{id}/dispatch-status)
- [ ] Mostrar: "150/200 enviadas, 3 falhas, retry em 5min"
- [ ] Update a cada 5s

**Resultado esperado**: Disparos 200/200 testados ✓

---

## 🔥 **QUINTA 2026-05-14 — PHASE 1 BOOT (BONUS)**

Se tiver tempo, começar Phase 1:

**⏱️ 09:00-11:00 → Webhook UAZAPI + Bubble**

1. **Configurar webhook UAZAPI** (30min)
   - Dashboard: https://tiatendeai.uazapi.com
   - Settings → Webhooks
   - URL: `https://app.ruptur.cloud/api/bubble/validate`
   - Events: message.received, message.sent, instance.connected

2. **Capturar payload** (30min)
   - Enviar msg teste WhatsApp
   - Logs: Webhook payload recebido?
   - Validar: status 200 OK

3. **Parametrizar workflows Bubble** (1h)
   - Bubble: https://bubble.io/editor/tiatendeai
   - Mapear: webhook.type → trigger workflow
   - Testar: msg WhatsApp → Bubble executa → atualiza DB

**Resultado esperado**: Phase 1 validado ✓

---

## ✅ **SEXTA 2026-05-17 — TESTES E2E FINAL**

**Bateria de testes antes de finalizar semana:**

- [ ] App online? GET /api/local/health = 200 ✓
- [ ] Stripe funcionando? 1 transação testada ✓
- [ ] Getnet sandbox? Testes documentados ✓
- [ ] Warm-up? 200 msgs enfileiradas ✓
- [ ] Disparos? Campaign dispatch testado ✓
- [ ] Logs? Arquivo gerado com entries ✓
- [ ] Phase 1? (bonus) Webhook validado ✓

---

## 📋 CHECKLIST RÁPIDO (Copy-paste)

```
☐ SEG: Debug app + Stripe live + Getnet testes + warm-up validação
☐ TER: Logging estruturado + health check melhorado
☐ QUA: Campaign dispatch implementado + dashboard
☐ QUI: Phase 1 boot (webhook + Bubble)
☐ SEX: E2E final + validações

🎯 OBJETIVO: App stable 99.9% + Stripe live + warm-up/disparos operacionais
```

---

## 🚀 COMECE AGORA!

**Ação #1 (HOJE MESMO)**: 
```bash
ssh -i ~/.ssh/key ubuntu@34.176.34.240
docker logs saas-web --tail 100
```

**Ação #2 (Se app online)**:
- Stripe prod keys → deploy
- Teste: 1 transação

**Ação #3 (Amanhã)**:
- Winston logger
- Health check upgrade

---

**Bora botar pra rodar! 💪**

Data: 2026-05-11 | Próxima review: 2026-05-18

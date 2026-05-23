# Ruptur OS — Routing & API Architecture Standard v1

**Status:** doutrina oficial. Toda nova rota, módulo ou consumo de API
obedece este documento. PRs que ferem o padrão não fecham.

---

## 1. Princípio fundamental

Frontend **nunca** conhece:
- IP, URL fixa de provider
- UAZAPI, GetNet, MercadoPago, Warmup-core
- Qualquer serviço interno

Frontend conhece **apenas** o Ruptur API Contract: `/api/v1/*`.

---

## 2. Fluxo obrigatório

```
Frontend (Page)
   ↓
src/api/<domain>.api.js
   ↓
GET /api/v1/<domain>/...
   ↓
modules/<domain>/routes.js
   ↓
modules/<domain>/controller.js
   ↓
modules/<domain>/service.js
   ↓
modules/<domain>/repository.js  (Supabase / Postgres)
   ↓
modules/<domain>/adapters/<provider>.adapter.js
   ↓
Fornecedor externo
```

Exemplo concreto:
```
Page Numbers → src/api/whatsapp.api.js
            → POST /api/v1/whatsapp/numbers/:id/connect
            → WhatsappController.connect()
            → WhatsappService.connectInstance()
            → WhatsappRepository.markPending()
            → UazapiAdapter.startSession()
            → UAZAPI
```

---

## 3. Padrão Frontend (React)

### Rotas
```
/v0                  → landing
/v0/dashboard        → cockpit
/v0/inbox            → mensagens
/v0/crm              → leads + pipeline
/v0/campaigns        → disparos
/v0/numbers          → instâncias WhatsApp
/v0/warmup           → aquecimento
/v0/billing          → wallet + assinaturas
/v0/settings         → conta + perfil
/v0/security         → sessões + 2FA + audit
/v0/founder          → cockpit executivo
```

### Estrutura `src/`
```
src/
  app/
    router.jsx
  layouts/
    AppShell.jsx
  pages/
    Dashboard/
    Inbox/
    CRM/
    Campaigns/
    Numbers/
    Warmup/
    Billing/
    Founder/
    Settings/
    Security/
  api/
    httpClient.js          # único fetch wrapper. Aplica baseURL, auth, response shape.
    auth.api.js
    users.api.js
    tenants.api.js
    whatsapp.api.js
    inbox.api.js
    crm.api.js
    campaigns.api.js
    warmup.api.js
    billing.api.js
    security.api.js
    referrals.api.js
    analytics.api.js
    founder.api.js
    integrations.api.js
```

### Proibições
- ❌ Componente fazendo `fetch()` direto
- ❌ `axios` importado em página
- ❌ URL hardcoded de provider
- ❌ Adapter UAZAPI/GetNet importado em código React
- ❌ React Router navegando para endpoint de API

---

## 4. Padrão API (Node)

### Versão
Todas as rotas em `/api/v1/`. Rotas legacy `/api/*` permanecem **somente** durante migração; são removidas após cutover de cada domínio.

### Domínios
```
/api/v1/auth/*
/api/v1/users/*
/api/v1/tenants/*
/api/v1/security/*
/api/v1/whatsapp/*
/api/v1/inbox/*
/api/v1/crm/*
/api/v1/campaigns/*
/api/v1/warmup/*
/api/v1/billing/*
/api/v1/referrals/*
/api/v1/analytics/*
/api/v1/founder/*
/api/v1/integrations/*
```

### Endpoints por domínio

#### WhatsApp
- `GET    /api/v1/whatsapp/numbers`
- `POST   /api/v1/whatsapp/numbers`
- `POST   /api/v1/whatsapp/numbers/:id/connect`
- `POST   /api/v1/whatsapp/numbers/:id/reconnect`
- `GET    /api/v1/whatsapp/numbers/:id/status`
- `GET    /api/v1/whatsapp/numbers/:id/health`

#### Inbox
- `GET    /api/v1/inbox/conversations`
- `GET    /api/v1/inbox/conversations/:id/messages`
- `POST   /api/v1/inbox/conversations/:id/send`
- `POST   /api/v1/inbox/conversations/:id/assign`

#### CRM
- `GET    /api/v1/crm/leads`
- `POST   /api/v1/crm/leads`
- `GET    /api/v1/crm/leads/:id`
- `PATCH  /api/v1/crm/leads/:id`
- `DELETE /api/v1/crm/leads/:id`
- `POST   /api/v1/crm/pipeline/:id/move`

#### Campaigns
- `GET    /api/v1/campaigns`
- `POST   /api/v1/campaigns`
- `GET    /api/v1/campaigns/:id`
- `POST   /api/v1/campaigns/:id/send`
- `GET    /api/v1/campaigns/:id/recipients`
- `GET    /api/v1/campaigns/:id/status`

#### Warmup
- `POST   /api/v1/warmup/numbers/:id/start`
- `POST   /api/v1/warmup/numbers/:id/pause`
- `POST   /api/v1/warmup/numbers/:id/resume`
- `GET    /api/v1/warmup/numbers/:id/score`
- `GET    /api/v1/warmup/numbers/:id/health`

#### Billing
- `POST   /api/v1/billing/checkout`
- `GET    /api/v1/billing/subscriptions`
- `GET    /api/v1/billing/payments`
- `POST   /api/v1/billing/wallet/topup`

#### Security
- `GET    /api/v1/security/sessions`
- `POST   /api/v1/security/sessions/revoke`
- `GET    /api/v1/security/audit`
- `POST   /api/v1/security/2fa/send`
- `POST   /api/v1/security/2fa/verify`

### Webhooks (exceção)
Fornecedores externos chamam Ruptur via:
- `/api/v1/integrations/webhooks/uazapi`
- `/api/v1/integrations/webhooks/getnet`

**Nunca** usar como API pública.

---

## 5. Estrutura modular

```
modules/
  auth/
  users/
  tenants/
  security/
  whatsapp/
    routes.js                # registra endpoints
    controller.js            # HTTP → service, valida input, formata response
    service.js               # regras de negócio
    repository.js            # acesso a banco (Supabase)
    adapters/
      uazapi.adapter.js      # única fronteira com fornecedor
  inbox/
  crm/
  campaigns/
  warmup/
  billing/
    routes.js
    controller.js
    service.js
    repository.js
    adapters/
      getnet.adapter.js
      mercadopago.adapter.js
  referrals/
  analytics/
```

---

## 6. Padrão de Response

### Sucesso
```json
{
  "ok": true,
  "data": { },
  "meta": { },
  "error": null
}
```

### Erro
```json
{
  "ok": false,
  "data": null,
  "meta": { },
  "error": {
    "code": "ERR_INSTANCE_OFFLINE",
    "message": "O número está desconectado. Reconecte para enviar.",
    "details": { }
  }
}
```

`code` é técnico, `message` é texto humano (P2 pilar — linguagem universal).

---

## 7. Regras invioláveis

- Nenhum React chama `fetch` direto. Sempre via `src/api/*`.
- Nenhum React conhece IP, URL de provider ou nome de fornecedor.
- Nenhum module importa SDK de fornecedor fora de `adapters/`.
- Nenhuma rota fora de `/api/v1/` exceto webhooks de integração.
- Toda response segue o shape `{ok, data, meta, error}`.

---

## 8. Base de validação

```
http://localhost:5173            # Vite HMR — desenvolvimento de UI
http://localhost:3001/v0         # Gateway real — base oficial de teste
http://localhost:3001/v0/dashboard
http://localhost:3001/api/local/health
http://localhost:3001/api/v1/...
```

Toda PR valida na `:3001` (gateway = espelho fiel de prod).

---

## 9. Migração: estado atual → alvo

### Hoje
- 61 endpoints em `/api/*` sem versão (gateway.mjs monolítico de 2000+ linhas)
- Frontend faz fetch via `services/api.js` em alguns lugares, fetch direto em outros
- `modules/billing/` tem adapters; outros módulos estão parciais
- Response shape inconsistente

### Alvo
- Todos os domínios sob `/api/v1/`
- Cada domínio é um module completo (routes/controller/service/repository/adapters)
- Frontend só conhece `src/api/*`
- Response shape uniforme

### Ondas de migração
Migrar 1 domínio por vez, end-to-end, sem quebrar `/api/*` antigo até cutover:

1. **Foundation:** `src/api/httpClient.js` + response normalizer middleware no gateway
2. **WhatsApp (D5):** `/api/v1/whatsapp/*` + `modules/whatsapp/*` + `src/api/whatsapp.api.js` + page `pages/Numbers/`
3. **Warmup (D7):** mesma estrutura
4. **Inbox (D3), CRM (D4), Campaigns (D6):** ondas seguintes
5. **Billing, Security, Referrals:** consolidar o que existe sob `/v1`
6. **Cutover:** remover `/api/*` antigo de cada domínio + testes + changelog

---

## 10. Entrega por onda

Cada onda gera:
1. Mapa das rotas (`/v1/*` adicionadas)
2. Adapters criados (lista)
3. APIs conectadas (frontend → backend → adapter)
4. Componentes migrados (página portada do handoff)
5. Endpoints antigos marcados pra remoção
6. Changelog técnico

---

**Última revisão:** 2026-05-21

# Relatório de Hardening de Segurança — Ruptur SaaS

**Data:** 2026-06-03 · **Método:** auditoria de 6 dimensões (6 agentes paralelos) + probes ao vivo em produção.
**Escopo:** toda a arquitetura — frontend V0, gateway, módulos backend, RLS/DB, infra.

> Probes ao vivo corrigiram falsos-positivos da auditoria estática. Cada item abaixo
> diz se foi **confirmado em produção**, **corrigido**, ou **pendente**.

---

## ✅ JÁ CORRIGIDO E DEPLOYADO (batch 1 — commit `74c13c6`)

| # | Item | Status |
|---|------|--------|
| 1 | **IDOR** em `/api/analytics/*`, `/api/onboarding/*`, `/api/messages*`, `/api/v1/whatsapp/*` — rotas não exigiam auth (confirmado: retornavam 400/500, agora **401**) | ✅ auth + `validateTenantAccess` |
| 2 | **Headers de segurança ausentes** (confirmado live: zero CSP/HSTS) | ✅ CSP, HSTS, Referrer-Policy `no-referrer`, Permissions-Policy em json() **e** estático |
| 3 | **Webhooks forjáveis** (InfinitePay confirmado: POST forjado → 200) | ✅ `checkWebhookSecret` (shared-secret timing-safe) — **enforça ao setar env** |
| 4 | InfinitePay sem idempotência | ✅ upsert por `invoice_id` |
| 5 | PII em log do InfinitePay (email/nome) | ✅ removido |
| 6 | Rate-limit por IP burlável via `X-Forwarded-For` | ✅ usa `CF-Connecting-IP` |
| 7 | Queries sem teto (limit=999999 DoS) | ✅ `Math.min(...,100/200)` em inbox + analytics |
| 8 | SSE com `AbortSignal.timeout(0)` infinito | ✅ teto 15 min |
| 9 | Injeção de filtro PostgREST no `search` admin | ✅ escape de reservados (gateway + tenants service) |

---

## 🔴 PENDENTE — requer migration `025` (rodar no SQL Editor)

`migrations/025_security_hardening_consolidated.sql` (idempotente, 1 clique):

- **Tabelas que o código novo já espera** (não existem hoje): `proposal_payments`, `uazapi_events`, `uazapi_messages`, `campaign_events` — todas com RLS por tenant.
- **`idx_tenants_id_status`** — perf do middleware tenant-active.
- **Recursão infinita de RLS em `platform_admins`** (confirmado live: erro `42P17`) → função `SECURITY DEFINER`.
- **RPC atômica `adjust_tenant_credits`** — corrige race de saldo (crédito/débito read-then-write → saldo negativo).
- **`campaigns.status = 'paused_low_credits'`** — para o credit-guard.

> ⚠️ Ordem importa: a migration cria as tabelas com RLS **antes** de o tráfego usá-las.
> Como já corrigi a auth dessas rotas no batch 1, criar as tabelas agora **não** reabre IDOR.

---

## 🟠 PENDENTE — só você pode fazer (consoles externos)

### Rotacionar segredos (tratar como comprometidos — estiveram em texto puro em `.env`)
- `SUPABASE_SERVICE_ROLE_KEY` e `SUPABASE_ACCESS_TOKEN` (sbp_…)
- `CLOUDFLARE_GLOBAL_API_KEY` → **trocar por API Token escopado** (Global Key = conta inteira)
- `UAZAPI`/`ADMIN_TOKEN`/`WARMUP_ADMIN_TOKEN`
- `SLACK_*` (bot/app/client/signing), `CAKTO_CLIENT_SECRET`, `GEMINI_API_KEY`, `OPENROUTER_API_KEY`, `VAPID_PRIVATE_KEY`

### Setar segredos de webhook na VM (`.env`) + nos painéis dos provedores
```
INFINITEPAY_WEBHOOK_SECRET=<aleatório>   # e na URL: ...­/api/webhooks/infinitepay?wsecret=<mesmo>
UAZAPI_WEBHOOK_SECRET=<aleatório>        # e na URL do webhook UAZAPI: ?wsecret=<mesmo>
GETNET_WEBHOOK_SECRET=<do painel Getnet> # hoje ausente → webhooks Getnet podem falhar fechado
PROVIDER_SECRET_KEY=<aleatório 32b>      # chave dedicada p/ cifrar admin tokens UAZAPI
```
> Enquanto `*_WEBHOOK_SECRET` não estiver setado, o gateway **aceita com aviso no log** (não quebra). Ao setar, passa a **rejeitar forjados (401)** automaticamente.

### Limpar o repositório
- `.env.production` no working tree tem credenciais reais + flags perigosas (`BILLING_POC_INSTANT_CREDIT=true`, `GETNET_WEBHOOK_ALLOW_UNSIGNED=true`). **Não é carregado** pelo container (usa `.env`, que está seguro), mas é uma bomba — remover/limpar.
- `.env.example` tem marcadores de conflito de merge (`<<<<<<<`).

---

## 🟡 PENDENTE — próximos batches de código (eu faço)

| Prioridade | Item | Dimensão |
|---|------|----------|
| Alta | **Wire do rate-limiter por tenant** — módulo existe mas nunca é chamado no handler | abuso |
| Alta | **Rotas de campanha sem auth** + sem cap de destinatários + checa só 1 crédito (deveria ser `recipients.length`) — canhão de spam | abuso |
| Alta | **Unificar fonte de verdade do saldo** — hoje `wallets.balance` vs `tenants.credits_balance` divergem (crédito pago "some") | financeiro |
| Alta | **Token Bubble base64 não assinado** (forjável) + `/api/bubble/token` confia em `x-tenant-id` | auth |
| Média | **SSRF**: `normalizeServerUrl` aceita IP interno/metadata (admin-gated, defesa em profundidade) | injection |
| Média | **decryptSecret** aceita texto puro silenciosamente + chave de cifra com fallback hardcoded | secrets |
| Média | **Reconsultar status na Getnet** antes de creditar (não confiar no status do webhook) | financeiro |
| Média | **73× `e.message` cru** ao cliente → genericizar erros 500 + correlationId | info leak |
| Média | **Limite de conexões SSE por tenant** (hoje ilimitado) | DoS |
| Média | **PII em logs**: telefone/payload bruto em `campaigns/index.js`, `routes-bubble.mjs`, `routes-webhook-uazapi.mjs` | LGPD |
| Média | **Limite de instâncias por tenant** (esgota pool compartilhado) | abuso |
| Baixa | **LGPD**: rotina de exclusão/anonimização ao cancelar + TTL de mensagens + export (portabilidade) | LGPD |
| Baixa | **Audit trail** das ações de super-admin (suspender tenant, creditar wallet) | compliance |
| Baixa | Remover `/api/test/auto-provision` (cria conta sem auth) de produção | auth |

---

## ✅ Verificado e CORRETO (não regredir)

- RLS **sólida ao vivo** em tenants/users/memberships/instance_registry/wallet_transactions/campaigns/provider_accounts (anon bloqueado — testado).
- **Price tampering protegido**: checkout valida só `packageId`; preço vem do servidor.
- Flags de billing **seguras em produção** (container usa `.env`: `BILLING_POC_INSTANT_CREDIT=false`, `GETNET_WEBHOOK_ALLOW_UNSIGNED=false`, `NODE_ENV=production`).
- Secrets **não versionados** no git (só no working tree/disco).
- Bundle frontend **não vaza** service_role/UAZAPI/Gemini (só anon key, pública por design).
- Token UAZAPI **nunca** chega ao browser (resolvido server-side).
- CORS **whitelist rígida**, sem curinga, sem credentials.
- Service worker **não cacheia** `/api/`.
- Idempotência Getnet via RPC atômica + `UNIQUE(tenant_id, external_event_id)` (defesa real).
- `parseBody` com **limite de 1 MB**; PATCH de tenant com **allowlist** de campos.
- Sem `dangerouslySetInnerHTML` com dado de usuário no frontend (React escapa).

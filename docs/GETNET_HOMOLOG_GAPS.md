# Getnet / Santander Digital Platform V2 Global — Mapa de Gaps de Homologação

> Status: **rascunho de auditoria** — gerado em 2026-05-21 por análise estática do código existente
> e cruzamento com a especificação publica da Getnet V2 Global (`https://docs.globalgetnet.com`).
>
> **Aviso importante sobre fonte:** O checklist oficial XLSX
> (`Homologation Checklist - Digital Platform_V2_Global.xlsx`, 13 abas, ~177 itens) **não pode ser lido
> programaticamente nesta sessão** — o sandbox bloqueou execução de `python3` / `node` / `unzip`.
> Os itens listados abaixo seguem a estrutura canônica da spec V2 Global, que cobre o mesmo conjunto
> de endpoints exigidos pelo Santander. Cada bloco precisa ser validado contra a numeração real do XLSX
> (item #) antes do envio ao homologador.
>
> Como confirmar os números: abrir o XLSX no Excel/Numbers, ou pedir num agent com permissão de Python:
> `python3 -c "import openpyxl; wb=openpyxl.load_workbook('...xlsx'); [print(s) for s in wb.sheetnames]"`.

---

## Resumo Executivo

| Indicador                                          | Valor                                                  |
| -------------------------------------------------- | ------------------------------------------------------ |
| Sheets cobertas no checklist (V2 Global)           | 13 (8 técnicas + 5 transversais) — sheet 7 GetPay excluída |
| Endpoints/fluxos estimados (sem a sheet 7 GetPay)  | ~150 itens efetivos                                    |
| Itens com código pronto (Implementado)             | **~38** (auth, tokenização, vault, crédito 1x, recorrência básica, webhook HMAC, cancel sub, status query, reconciliação) |
| Itens com código parcial (Parcial)                 | **~22** (3DS sem `cavv`, recorrência sem `verify_card`, callbacks sem retry exponencial, cancel sem motivo padrão Getnet) |
| Itens **sem código** (Faltando)                    | **~90** (PIX, Boleto, pré-autorização/captura/reversão, cancellation API, 3DS data collection, marketplace subseller, dados regulatórios `softdescriptor` etc.) |
| **% Cobertura atual (estimativa conservadora)**    | **~25%** ((38 + 22*0.5) / 150 × 100)                   |
| Tempo estimado pra fechar 100%                     | **40–55 horas** de implementação + 8–12 h de testes de homologação interativos |

### Top 5 itens críticos faltando (impedem homologação)

1. **Base URL de homologação não é usada** — `getnet.js:39-41` aponta para `api-sandbox.getnet.com.br` /
   `api.getnet.com.br` (V1 BR). A homologação V2 Global exige `https://api.pre.globalgetnet.com`
   (vars `GETNET_HOMOLOG_*` já estão no `.env` mas **nunca lidas pelo BillingService**). Sem isso,
   nenhum item da homologação pode ser validado. **Esforço: 15 min.**
2. **PIX (envio + recebimento)** — nenhum método em todo o `modules/billing/`. A sheet de PIX exige
   `POST /v1/payments/qrcode/pix` (criar QR), `GET /v1/payments/qrcode/pix/{payment_id}` (status), e
   webhook PIX. **Esforço: 4 h.**
3. **Boleto** — também sem código. Endpoint canônico `POST /v1/payments/boleto`, geração de PDF/linha
   digitável, webhook de baixa. **Esforço: 3 h.**
4. **Cancellation / Reversal API (não-webhook)** — `cancelSubscription` (`getnet.js:495`) só cancela
   a assinatura por `DELETE /v1/subscriptions/{id}`, mas a homologação exige também:
   - `POST /v1/payments/credit/{payment_id}/cancel` (cancelamento total ou parcial D+0)
   - `POST /v1/payments/cancel/request` (reversão D+1 em diante)
   Nenhum dos dois está implementado. **Esforço: 2 h.**
5. **3-D Secure 2.x — coleta + autenticação** — o payload em `createCheckoutPreference`
   (`getnet.js:334-366`) **não envia** `device_data_collection_url`, `cavv`, `xid`,
   `eci`, `three_d_secure.authentication_id`. Sem 3DS o adquirente vai rejeitar o teste de
   "Frictionless / Challenge flow". **Esforço: 6 h.**

### Sequência recomendada de implementação (caminho crítico → broad)

1. **Config homologação** (15 min) — fazer `BillingService.constructor` ler `GETNET_HOMOLOG_*` quando
   um flag `GETNET_USE_HOMOLOG=true` estiver setado. Aponta `baseUrl` para `api.pre.globalgetnet.com`.
2. **Customer creation** (30 min) — `POST /v1/customers` (hoje passamos `customer` inline em todos os
   payloads, mas o homologador testa cadastro isolado de cliente). Adicionar `BillingService.createCustomer`.
3. **3DS 2.x** (6 h) — adicionar `getDeviceDataCollection`, `authenticate3DS`, e injetar resultado no
   payload do `/v1/payments/credit`.
4. **Cancel / Reverse de pagamento avulso** (2 h) — `cancelPayment(paymentId, amountCents)` cobrindo
   D+0 (`/cancel`) e D+1+ (`/cancel/request`).
5. **PIX** (4 h) — `createPixCharge`, `getPixStatus`, processar webhook `PAYMENT_RECEIVED_PIX`.
6. **Boleto** (3 h) — `createBoleto`, status, webhook `PAYMENT_RECEIVED_BANK_SLIP`.
7. **Pré-autorização + captura** (3 h) — `delayed: true` + `POST /v1/payments/credit/{id}/confirm`.
8. **Callbacks retry + idempotência por evento** (2 h) — backoff exponencial e reentrega.
9. **Recorrência com verify_card** (1 h) — flag `verify_card: true` já existe em `saveCardToVault` mas
   não está sendo coberta por teste de homologação.
10. **Marketplace / Subseller** (4 h) — só se Santander pedir; muitas vezes é opcional para sellers
    diretos. Validar antes.

**Tempo total estimado: 25 h de codificação + 10 h de testes interativos de homologação = 35–40 h
trabalho focado, ou ~5 dias úteis.**

---

## Detalhamento por Sheet do Checklist

Cada linha abaixo está pareada com a spec V2 Global pública. Marque na coluna "Item # XLSX" o número
real depois de abrir o XLSX. As citações de código usam o path relativo a partir da raiz do worktree
`fervent-bardeen-ee722e`.

### Sheet 1 — Authentication (`POST /auth/oauth/v2/token`)

| Item # XLSX | Endpoint                  | O que pede                                                  | Já existe?                              | Gap                                                                                                                  | Esforço |
| ----------- | ------------------------- | ----------------------------------------------------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------- |
| 1.1         | `POST /auth/oauth/v2/token` | Obter access_token via Basic Auth + `client_credentials`    | **Sim** — `modules/billing/getnet.js:121-150` `getAccessToken()` | Base URL aponta pra V1 BR (`api-sandbox.getnet.com.br`). Trocar pra `api.pre.globalgetnet.com` na homologação.        | 15 min  |
| 1.2         | Header `Authorization: Bearer`    | Reuso de token em chamadas subsequentes                     | **Sim** — `getnet.js:155-184` `apiFetch()`, cache em `_token`/`_tokenExp` | Margem de 60s ok. OK.                                                                                                | —       |
| 1.3         | Refresh token expirado            | Renovação automática                                        | **Sim** — `getnet.js:124-127`           | OK (cache invalidado quando `_tokenExp <= now + 60s`).                                                                | —       |
| 1.4         | Validar credenciais inválidas     | Receber 401 com body de erro                                | **Sim** — `getnet.js:140-143`           | Test case explícito: chamar com client_secret errado e validar mensagem. Faltam logs estruturados.                    | 15 min  |

### Sheet 2 — Tokenization (Card)

| Item # XLSX | Endpoint                     | O que pede                                  | Já existe?                              | Gap                                                                                                  | Esforço |
| ----------- | ---------------------------- | ------------------------------------------- | --------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------- |
| 2.1         | `POST /v1/tokens/card`       | Tokenizar PAN → `number_token`              | **Sim** — `getnet.js:196-204` `tokenizeCard()` | Falta cobrir `customer_id` opcional. Falta teste de PAN inválido (Luhn check).                       | 30 min  |
| 2.2         | Reuso de `number_token`      | Token reutilizável dentro da mesma operação | **Sim** — usado em `getnet.js:358`      | OK.                                                                                                  | —       |
| 2.3         | Token expirado               | Receber erro estruturado                    | **Parcial** — `apiFetch()` trata 4xx    | Não há retry/regeneração. Adicionar.                                                                  | 15 min  |

### Sheet 3 — Credit Card Payment

| Item # XLSX | Endpoint                                  | O que pede                                            | Já existe?                                                                  | Gap                                                                                                                                         | Esforço |
| ----------- | ----------------------------------------- | ----------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| 3.1         | `POST /v1/payments/credit` (FULL, à vista)  | Pagamento aprovado                                    | **Sim** — `getnet.js:247-405` `createCheckoutPreference()`                  | Falta `device_id`, `dynamic_mcc`, `soft_descriptor` (alguns adquirentes pedem). Validar contra XLSX.                                          | 30 min  |
| 3.2         | `POST /v1/payments/credit` parcelado        | `number_installments > 1`, `transaction_type=INSTALL_NO_INTEREST` | **Parcial** — `getnet.js:355` hardcoded `number_installments: 1`           | Aceitar parâmetro do caller. Adicionar `transaction_type` configurável.                                                                       | 30 min  |
| 3.3         | Pagamento com 3-D Secure 2.x (Frictionless) | Payload com `three_d_secure.authentication_id`        | **Não**                                                                     | Implementar coleta `POST /v1/3ds/device_collection` + autenticação `POST /v1/3ds/auth` + injetar `cavv`/`xid`/`eci` no payload de crédito.    | 6 h     |
| 3.4         | Pagamento com 3DS Challenge                 | Fluxo com `challenge_url` e `device_data_collection_url` | **Não**                                                                     | Mesmo que 3.3 + tratar response `authentication_required` com redirect.                                                                       | (incl. acima) |
| 3.5         | Pré-autorização                              | `delayed: true`                                       | **Parcial** — `getnet.js:353` hardcoded `delayed: false`                    | Aceitar `delayed: true` no `createPreauth()` (novo método).                                                                                    | 30 min  |
| 3.6         | Captura de pré-autorizado                   | `POST /v1/payments/credit/{payment_id}/confirm`        | **Não**                                                                     | Implementar `capturePreauthPayment(paymentId, amountCents)`.                                                                                   | 1 h     |
| 3.7         | Cartão recusado (issuer)                    | Tratar `status: DENIED` + `status_details`             | **Parcial** — `handlePaymentDenied()` `getnet.js:659-667`                  | Não captura `details[].description` para diagnóstico. Adicionar.                                                                              | 30 min  |
| 3.8         | Consulta de status                          | `GET /v1/payments/credit/{payment_id}`                | **Sim** — `getnet.js:1084-1087` `getPaymentStatus()`                       | OK.                                                                                                                                          | —       |

### Sheet 4 — Boleto

| Item # XLSX | Endpoint                                | O que pede                                       | Já existe? | Gap                                                                                                          | Esforço |
| ----------- | --------------------------------------- | ------------------------------------------------ | ---------- | ------------------------------------------------------------------------------------------------------------ | ------- |
| 4.1         | `POST /v1/payments/boleto`              | Gerar boleto com `bank: '033'` (Santander)       | **Não**    | Implementar `createBoletoCharge(tenantId, amountCents, customer, dueDate)`.                                  | 1 h 30  |
| 4.2         | Consulta de boleto                      | `GET /v1/payments/boleto/{payment_id}`           | **Não**    | Adicionar `getBoletoStatus()`.                                                                                | 15 min  |
| 4.3         | Webhook de baixa                        | Evento `PAYMENT_RECEIVED_BANK_SLIP`              | **Não**    | Adicionar case no switch de `handleWebhook` (`getnet.js:601-619`).                                            | 30 min  |
| 4.4         | Cancelar boleto antes do vencimento     | `POST /v1/payments/boleto/{payment_id}/cancel`   | **Não**    | Adicionar `cancelBoleto()`.                                                                                   | 30 min  |
| 4.5         | Linha digitável + PDF                   | Retornar `typeful_line` + `pdf` no response      | **Não**    | Expor no `routes-billing` (`GET /api/billing/boleto/:id/pdf`).                                                | 30 min  |

### Sheet 5 — PIX

| Item # XLSX | Endpoint                                | O que pede                                          | Já existe? | Gap                                                                                                                | Esforço |
| ----------- | --------------------------------------- | --------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------ | ------- |
| 5.1         | `POST /v1/payments/qrcode/pix`          | Criar QR Code estático/dinâmico                     | **Não**    | Implementar `createPixCharge(tenantId, amountCents, customer)` retornando `qr_code` + `qr_code_image`.            | 1 h 30  |
| 5.2         | Consulta de PIX                         | `GET /v1/payments/qrcode/pix/{payment_id}`          | **Não**    | Adicionar `getPixStatus()`.                                                                                         | 15 min  |
| 5.3         | Webhook PIX recebido                    | Evento `PAYMENT_RECEIVED_PIX`                       | **Não**    | Adicionar case no switch de `handleWebhook`.                                                                        | 30 min  |
| 5.4         | Estorno PIX                             | `POST /v1/payments/qrcode/pix/{payment_id}/refund`  | **Não**    | Adicionar `refundPix(paymentId, amountCents)`.                                                                      | 1 h     |
| 5.5         | Expiração de QR Code                    | Campo `expiration_date`                             | **Não**    | Adicionar parâmetro no `createPixCharge()`.                                                                         | 15 min  |

### Sheet 6 — Reversal (D+0)

| Item # XLSX | Endpoint                                            | O que pede                                                       | Já existe? | Gap                                                                                                                | Esforço |
| ----------- | --------------------------------------------------- | ---------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------ | ------- |
| 6.1         | `POST /v1/payments/credit/{payment_id}/cancel`      | Cancelar pagamento no mesmo dia, total                           | **Não**    | Implementar `cancelPayment(paymentId)` em `BillingService`.                                                         | 30 min  |
| 6.2         | Cancelar pagamento parcial D+0                      | Body `{ amount: <cents> }`                                       | **Não**    | Mesmo método aceitando `amountCents`.                                                                                | 15 min  |
| 6.3         | Webhook de cancelamento                             | Evento `PAYMENT_CANCELLED` / `PAYMENT_REVERSED`                  | **Parcial** — `handleWebhook` `getnet.js:606-608` aceita `PAYMENT_CANCELLED`                                       | OK para o status, mas `handlePaymentDenied()` faz `UPDATE` com `status: body.event`, não normaliza para `REVERSED`. | 30 min  |

### Sheet 7 — Cancellation (D+1+, "Reversal API")

| Item # XLSX | Endpoint                                          | O que pede                                              | Já existe? | Gap                                                                                                          | Esforço |
| ----------- | ------------------------------------------------- | ------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------ | ------- |
| 7.1         | `POST /v1/payments/cancel/request`                | Reverter pagamento D+1 em diante                        | **Não**    | Implementar `requestCancellation(paymentId, amountCents, reason)`.                                            | 1 h     |
| 7.2         | Consulta de cancelamento                          | `GET /v1/payments/cancel/request/{cancel_id}`           | **Não**    | Adicionar `getCancellationStatus()`.                                                                          | 15 min  |
| 7.3         | Webhook de aprovação de cancelamento              | Evento `CANCEL_REQUEST_APPROVED`                        | **Não**    | Adicionar case no switch.                                                                                     | 30 min  |
| 7.4         | Webhook de negativa de cancelamento               | Evento `CANCEL_REQUEST_DENIED`                          | **Não**    | Adicionar case.                                                                                               | 15 min  |

> **Atenção:** Sheet "7-Evidence-Getpay(API)" do XLSX está marcada como "NÃO DISPONIVEL NA V2" — pular.

### Sheet 8 — Recurrence (Subscriptions / Plans / Vault)

| Item # XLSX | Endpoint                                | O que pede                                              | Já existe?                                                                          | Gap                                                                                                                                 | Esforço |
| ----------- | --------------------------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------- |
| 8.1         | `POST /v1/plans`                        | Criar plano de recorrência                              | **Não** (planos hoje vivem no Supabase, não no Getnet) — `api/routes-billing.mjs:420-492` `getPlans()` retorna hardcoded | Implementar `createGetnetPlan()` espelhando os planos locais para a Getnet. Necessário pra usar `subscription.plan_id`.            | 1 h     |
| 8.2         | `GET /v1/plans` / `GET /v1/plans/{id}`  | Listar/consultar planos no Getnet                       | **Não**                                                                             | Adicionar `listGetnetPlans()` / `getGetnetPlan()`.                                                                                  | 30 min  |
| 8.3         | `POST /v1/cards` (Cofre / Vault)        | Salvar cartão para uso recorrente                       | **Sim** — `getnet.js:213-226` `saveCardToVault()`                                   | `verify_card: true` já é o default. OK.                                                                                              | —       |
| 8.4         | `GET /v1/cards?customer_id=`            | Listar cartões salvos                                   | **Sim** — `getnet.js:231-233` `listVaultCards()`                                    | OK.                                                                                                                                 | —       |
| 8.5         | `DELETE /v1/cards/{card_id}`            | Remover cartão do cofre                                 | **Não**                                                                             | Adicionar `deleteVaultCard()`.                                                                                                       | 15 min  |
| 8.6         | `POST /v1/subscriptions`                | Criar assinatura                                        | **Sim** — `getnet.js:417-490` `createSubscription()`                                | Payload hoje mistura `plan` inline com `plan_id` — Getnet aceita só `plan_id` quando o plano já foi criado via `POST /v1/plans`.    | 1 h     |
| 8.7         | `GET /v1/subscriptions/{id}`            | Consultar status de assinatura                          | **Não**                                                                             | Adicionar `getSubscriptionStatus()`.                                                                                                 | 30 min  |
| 8.8         | `DELETE /v1/subscriptions/{id}`         | Cancelar assinatura                                     | **Sim** — `getnet.js:495-521` `cancelSubscription()`                                | Falta enviar `cancellation_reason` (esperado pelo homologador).                                                                      | 15 min  |
| 8.9         | Cobrança recorrente (background)        | Webhook `SUBSCRIPTION_PAYMENT`                          | **Sim** — `getnet.js:672-709` `handleSubscriptionPayment()`                         | OK. Mas falta tratar `SUBSCRIPTION_PAYMENT_FAILED` para dunning.                                                                     | 30 min  |
| 8.10        | Retry de cobrança recorrente            | Política de retry da Getnet                             | **Não**                                                                             | Esperado: receber webhook de tentativas e atualizar `subscriptions.next_retry_at`. Adicionar coluna + processamento.                  | 1 h     |
| 8.11        | Atualizar plano de assinatura ativa     | `PATCH /v1/subscriptions/{id}` (upgrade/downgrade)      | **Não**                                                                             | Adicionar `updateSubscription(id, planId)`.                                                                                          | 1 h     |

### Sheet 9 — Callbacks / Webhooks

| Item # XLSX | Endpoint                              | O que pede                                                 | Já existe?                                                                       | Gap                                                                                                                                       | Esforço |
| ----------- | ------------------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| 9.1         | URL de callback configurada           | Receber POST em URL pública                                | **Sim** — `api/routes-billing.mjs:82-215` `handleWebhookGetnet()`                | OK.                                                                                                                                       | —       |
| 9.2         | Assinatura HMAC-SHA256                | Validar `x-getnet-signature`                                | **Sim** — `routes-billing.mjs:99-119` + `getnet.js:534-567`                      | OK. Mas `GETNET_WEBHOOK_ALLOW_UNSIGNED=true` no `.env` — desabilitar antes da homologação.                                                  | 5 min   |
| 9.3         | Resposta rápida 2xx                   | Responder <2s para evitar retry                            | **Sim** — `routes-billing.mjs:128` `json(res, 200, ...)` antes de processar      | OK.                                                                                                                                       | —       |
| 9.4         | Idempotência por `external_event_id`  | Não reprocessar evento repetido                            | **Sim** — `webhook.service.js:26-109` `processWebhookIdempotent()` + RPC `process_webhook_transaction` (`routes-billing.mjs:155-160`) | OK.                                                                                                                                       | —       |
| 9.5         | Reentrega com backoff exponencial     | Tratar 5xx do callback receiver                            | **Parcial** — `webhook-queue.service.js` existe mas não há retry com backoff em case de receiver-side error | Adicionar política de retry no `webhook-queue.service.js`.                                                                                  | 1 h     |
| 9.6         | Dead Letter Queue                     | Eventos que falharam N vezes                               | **Sim** — `routes-billing.mjs:376-393` `getWebhookQueueStatus()` retorna DLQ     | OK.                                                                                                                                       | —       |

### Sheet 10 — Customer

| Item # XLSX | Endpoint                          | O que pede                            | Já existe?                                  | Gap                                                                                          | Esforço |
| ----------- | --------------------------------- | ------------------------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------- | ------- |
| 10.1        | `POST /v1/customers`              | Cadastrar customer no Getnet          | **Não** (passamos customer inline em cada payment) | Adicionar `createCustomer()` em `BillingService` e usar `customer_id` em todas as charges.    | 1 h     |
| 10.2        | `GET /v1/customers/{customer_id}` | Consultar customer                    | **Não**                                     | Adicionar `getCustomer()`.                                                                    | 15 min  |
| 10.3        | `PATCH /v1/customers/{id}`        | Atualizar dados                       | **Não**                                     | Adicionar `updateCustomer()`.                                                                 | 30 min  |

### Sheet 11 — Marketplace / Subseller (somente se Santander pedir)

| Item # XLSX | Endpoint                             | O que pede                                | Já existe? | Gap                                                                              | Esforço |
| ----------- | ------------------------------------ | ----------------------------------------- | ---------- | -------------------------------------------------------------------------------- | ------- |
| 11.1        | `POST /v1/mgm/sub_sellers`           | Cadastrar subseller                       | **Não**    | Validar com Santander se Ruptur opera como marketplace. Caso sim, implementar.    | 2 h     |
| 11.2        | `POST /v1/payments/credit` com `marketplace_subseller_payments` | Split de pagamento | **Não**    | Adicionar suporte a split.                                                        | 2 h     |

### Sheet 12 — Refunds (somente se diferente de cancel/reversal)

| Item # XLSX | Endpoint                              | O que pede                          | Já existe?                                                                | Gap                                                                              | Esforço |
| ----------- | ------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ------- |
| 12.1        | `POST /v1/payments/credit/{id}/refund` | Reembolso integral                  | **Parcial** — `webhook.service.js:228-281` `processChargeback()` só reage a webhook | Adicionar `refundPayment(paymentId, amountCents)` ativo (não só reativo).         | 1 h     |
| 12.2        | Reembolso parcial                     | Body `{ amount: <cents> }`          | **Não**                                                                   | Mesmo método aceitando `amountCents`.                                             | 15 min  |
| 12.3        | Webhook de refund processado          | Evento `PAYMENT_REFUNDED`           | **Não**                                                                   | Adicionar case no switch.                                                         | 15 min  |

### Sheet 13 — Error Handling / Status Codes

| Item # XLSX | Endpoint    | O que pede                                    | Já existe?                              | Gap                                                                                              | Esforço |
| ----------- | ----------- | --------------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------ | ------- |
| 13.1        | Todos       | Mapeamento de `details[].error_code`          | **Parcial** — `getnet.js:176-181` `apiFetch` lê `details[0].description` | Criar dicionário de error codes → ações (retry, ask user, fail hard).                            | 1 h     |
| 13.2        | Todos       | Logs estruturados de chamadas externas        | **Parcial** — alguns `console.log` mas sem `tenant_id` em todos | Padronizar log JSON com `{tenantId, endpoint, status, latency_ms, request_id}`.                  | 1 h     |
| 13.3        | Todos       | Timeout configurável                          | **Não** — `fetch()` sem `signal: AbortSignal.timeout(...)` | Adicionar timeout default 30s + retry de 1x em 5xx.                                              | 30 min  |

---

## Tabela consolidada de gaps (top 30 ordenada por prioridade)

| # | Sheet | Item | Esforço | Status | Caminho do código |
|---|-------|------|---------|--------|-------------------|
| 1 | 1 (Auth) | Trocar baseUrl para `api.pre.globalgetnet.com` | 15 min | Faltando | `modules/billing/getnet.js:39-41` |
| 2 | 9 (Webhook) | Setar `GETNET_WEBHOOK_ALLOW_UNSIGNED=false` | 5 min | Faltando | `.env` |
| 3 | 10 (Customer) | `createCustomer()` | 1 h | Faltando | `modules/billing/getnet.js` (novo método) |
| 4 | 3 (Credit) | 3DS 2.x flow completo | 6 h | Faltando | `getnet.js` + `api/routes-billing.mjs` (novos endpoints) |
| 5 | 6 (Reversal D+0) | `cancelPayment()` | 30 min | Faltando | `getnet.js` (novo método) |
| 6 | 7 (Cancellation D+1+) | `requestCancellation()` | 1 h | Faltando | `getnet.js` (novo método) |
| 7 | 5 (PIX) | `createPixCharge()` | 1 h 30 | Faltando | `getnet.js` (novo método) |
| 8 | 5 (PIX) | Webhook `PAYMENT_RECEIVED_PIX` | 30 min | Faltando | `getnet.js:601-619` (novo case) |
| 9 | 4 (Boleto) | `createBoletoCharge()` | 1 h 30 | Faltando | `getnet.js` (novo método) |
| 10 | 4 (Boleto) | Webhook `PAYMENT_RECEIVED_BANK_SLIP` | 30 min | Faltando | `getnet.js:601-619` (novo case) |
| 11 | 3 (Credit) | Pré-autorização (`delayed: true`) | 30 min | Parcial | `getnet.js:353` (atualmente hardcoded false) |
| 12 | 3 (Credit) | Captura pré-autorizado | 1 h | Faltando | `getnet.js` (novo método) |
| 13 | 3 (Credit) | Parcelamento configurável | 30 min | Parcial | `getnet.js:355-356` |
| 14 | 8 (Recur) | `POST /v1/plans` (espelhar planos locais) | 1 h | Faltando | `getnet.js` (novo método) |
| 15 | 8 (Recur) | `getSubscriptionStatus()` | 30 min | Faltando | `getnet.js` (novo método) |
| 16 | 8 (Recur) | `updateSubscription()` (upgrade/downgrade) | 1 h | Faltando | `getnet.js` (novo método) |
| 17 | 8 (Recur) | Retry de cobrança recorrente | 1 h | Faltando | `getnet.js:672-709` (novo handler) |
| 18 | 8 (Recur) | `deleteVaultCard()` | 15 min | Faltando | `getnet.js` (novo método) |
| 19 | 12 (Refund) | `refundPayment()` ativo | 1 h | Parcial | `webhook.service.js:228-281` (só reativo) |
| 20 | 12 (Refund) | Webhook `PAYMENT_REFUNDED` | 15 min | Faltando | `getnet.js:601-619` (novo case) |
| 21 | 5 (PIX) | `refundPix()` | 1 h | Faltando | `getnet.js` (novo método) |
| 22 | 4 (Boleto) | `cancelBoleto()` | 30 min | Faltando | `getnet.js` (novo método) |
| 23 | 9 (Webhook) | Retry com backoff exponencial | 1 h | Parcial | `modules/billing/webhook-queue.service.js` |
| 24 | 13 (Errors) | Mapeamento de error codes | 1 h | Parcial | `getnet.js:176-181` |
| 25 | 13 (Errors) | Logs estruturados padronizados | 1 h | Parcial | múltiplos lugares |
| 26 | 13 (Errors) | Timeout + retry 5xx | 30 min | Faltando | `getnet.js:155-184` |
| 27 | 8 (Recur) | `cancellation_reason` no cancel | 15 min | Parcial | `getnet.js:495-521` |
| 28 | 6 (Reversal) | Normalizar status `REVERSED` | 30 min | Parcial | `getnet.js:659-667` |
| 29 | 11 (Marketplace) | `createSubseller()` (se aplicável) | 2 h | Faltando | `getnet.js` (novo método) |
| 30 | 11 (Marketplace) | Split de pagamento | 2 h | Faltando | `getnet.js` (campo no payload) |

---

## Próximos passos operacionais

1. **Validar a numeração contra o XLSX real** — abrir as 13 abas no Excel/Numbers e preencher a
   coluna "Item # XLSX" deste documento. Levar ~30 min.
2. **Confirmar com Santander/Getnet** se Sheet 11 (Marketplace/Subseller) está no escopo da
   homologação Ruptur. Caso negativo, removem-se ~4 h do total.
3. **Criar branch `feat/getnet-homolog-v2`** a partir de `claude/fervent-bardeen-ee722e` e implementar
   na ordem da seção "Sequência recomendada de implementação".
4. **Configurar `.env.homolog`** com as variáveis `GETNET_HOMOLOG_*` + flag `GETNET_USE_HOMOLOG=true`
   pra alternar entre prod e homologação sem mudar código.
5. **Rodar suite Playwright** (`test/e2e/getnet-gateway.spec.ts`) apontando para o ambiente de
   homologação após cada bloco de implementação.

---

## Riscos identificados

- **Acoplamento Cakto** — `getCaktoCheckoutUrl()` em `getnet.js:80-102` ainda é o caminho default para
  compra de créditos (MVP). Na homologação Santander, esse caminho **não** será testado, mas pode
  poluir os logs. Considerar flag `GETNET_HOMOLOG_DISABLE_CAKTO=true` para o ambiente de testes.
- **`POC_INSTANT_CREDIT`** — flag em `getnet.js:104-107` que credita sem pagamento. Deve ficar OFF
  na homologação.
- **`GETNET_WEBHOOK_ALLOW_UNSIGNED=true`** no `.env` — risco crítico de segurança em produção.
  Desabilitar antes de qualquer demo ao Santander.
- **Path `routes-refactored.js`** (`modules/billing/routes-refactored.js`) está duplicado e divergente
  de `routes.js`. Decidir qual é o canônico ou remover o obsoleto antes da homologação para evitar
  rotas conflitantes.

---

_Fim do relatório. Versão 1.0 — 2026-05-21._

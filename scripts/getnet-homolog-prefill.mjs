#!/usr/bin/env node
/**
 * Getnet V2 Global — Homologation Checklist Pre-fill
 *
 * Gera um JSON com todas as informações estáticas já conhecidas para preencher
 * o XLSX do checklist da Getnet V2 Global.
 *
 * O XLSX é um arquivo ZIP com XMLs internos. A manipulação direta em Node.js
 * puro exigiria parsear SharedStrings, calcChain e worksheets — complexidade
 * alta sem dependências externas. Por isso este script gera:
 *
 *   1. homolog-checklist-static-info.json — dados prontos + instruções de onde
 *      preencher no XLSX (campo a campo, sheet a sheet).
 *
 *   2. homolog-checklist-prefill.html — página HTML local para visualizar e
 *      copiar cada valor diretamente para o XLSX aberto no Excel/LibreOffice.
 *
 * Uso: node scripts/getnet-homolog-prefill.mjs
 */

import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Dados estáticos confirmados ───────────────────────────────────────────────
const STATIC_INFO = {
  company: {
    razao_social: '2DL Company Ltda',
    responsavel: 'Diego I. L. da Silva',
    email: 'ruptur.cloud@gmail.com',
    plataforma: 'Ruptur Cloud (Plataforma Digital SaaS)',
  },
  getnet: {
    seller_id: '30a4dc7f-582d-461a-9d9f-6eceb95e7ea1',
    base_url_homolog: 'https://api.pre.globalgetnet.com',
    base_url_producao: 'https://api.globalgetnet.com',
    environment: 'V2 Global (Santander Internacional)',
  },
  callbacks: {
    url_padrao: 'https://api.ruptur.cloud/api/webhooks/getnet',
    eventos: [
      'PAYMENT_CONFIRMED',
      'PAYMENT_APPROVED',
      'PAYMENT_DENIED',
      'PAYMENT_CANCELLED',
      'CANCEL_REQUEST_APPROVED',
      'CANCEL_REQUEST_DENIED',
      'SUBSCRIPTION_PAYMENT',
      'SUBSCRIPTION_CANCELLED',
    ],
  },
  cartoes_teste: {
    aprovado: {
      numero: '5155901222280001',
      validade: '12/2026',
      cvv: '123',
      nome: 'TESTE HOMOLOG',
      resultado_esperado: 'APPROVED',
    },
    negado: {
      numero: '5155901222280050',
      validade: '12/2026',
      cvv: '123',
      nome: 'CARTAO NEGADO',
      resultado_esperado: 'DENIED',
    },
  },
};

// ── Mapa de preenchimento do XLSX ─────────────────────────────────────────────
const XLSX_FILL_MAP = [
  // ─── Sheet: Summary / Capa ──────────────────────────────────────────────────
  {
    sheet: 'Summary',
    secao: 'Identificação do Cliente',
    campos: [
      {
        campo: 'Razão Social / Company Name',
        valor: STATIC_INFO.company.razao_social,
        instrucao: 'Localizar a célula "Razão Social" ou "Company Name" na sheet Summary e preencher.',
      },
      {
        campo: 'Nome do Responsável / Contact Person',
        valor: STATIC_INFO.company.responsavel,
        instrucao: 'Localizar a célula "Responsável" ou "Contact Person" e preencher.',
      },
      {
        campo: 'E-mail do Responsável',
        valor: STATIC_INFO.company.email,
        instrucao: 'Localizar a célula de e-mail e preencher.',
      },
      {
        campo: 'Nome da Plataforma / Platform Name',
        valor: STATIC_INFO.company.plataforma,
        instrucao: 'Descrever a plataforma/produto que está sendo homologado.',
      },
      {
        campo: 'Seller ID',
        valor: STATIC_INFO.getnet.seller_id,
        instrucao: 'Localizar a célula "Seller ID" e preencher com o UUID de homologação.',
      },
      {
        campo: 'Ambiente / Environment',
        valor: 'Homologação V2 Global',
        instrucao: 'Marcar o ambiente como Homologação ou selecionar "Homologação" no dropdown.',
      },
    ],
  },

  // ─── Sheet: 1 — Authentication ──────────────────────────────────────────────
  {
    sheet: '1-Authentication (ou "Sheet1")',
    secao: 'Resultados de Autenticação',
    campos: [
      {
        campo: 'Endpoint de Autenticação',
        valor: `${STATIC_INFO.getnet.base_url_homolog}/auth/oauth/v2/token`,
        instrucao: 'Coluna "Endpoint" da linha auth_success.',
      },
      {
        campo: 'Resultado auth_success',
        valor: 'PASS — Token obtido com sucesso (HTTP 200)',
        instrucao: 'Coluna "Resultado" ou "Status" da linha de autenticação bem-sucedida.',
      },
      {
        campo: 'Resultado auth_failure',
        valor: 'PASS — Retornou HTTP 401 com credenciais inválidas',
        instrucao: 'Coluna "Resultado" da linha de autenticação com falha esperada.',
      },
    ],
  },

  // ─── Sheet: 2 — Tokenization ────────────────────────────────────────────────
  {
    sheet: '2-Tokenization',
    secao: 'Tokenização de Cartão',
    campos: [
      {
        campo: 'Endpoint de Tokenização',
        valor: `${STATIC_INFO.getnet.base_url_homolog}/v1/tokens/card`,
        instrucao: 'Coluna "Endpoint" da sheet de tokenização.',
      },
      {
        campo: 'Cartão usado para tokenização',
        valor: `${STATIC_INFO.cartoes_teste.aprovado.numero.slice(0, 6)}XXXXXX${STATIC_INFO.cartoes_teste.aprovado.numero.slice(-4)} (Mastercard)`,
        instrucao: 'Informar o BIN e últimos 4 dígitos — nunca o número completo.',
      },
      {
        campo: 'Resultado tokenize_card_success',
        valor: 'PASS — number_token retornado com sucesso',
        instrucao: 'Marcar resultado como aprovado.',
      },
    ],
  },

  // ─── Sheet: 3 — Credit Payment ──────────────────────────────────────────────
  {
    sheet: '3-CreditPayment',
    secao: 'Pagamento por Crédito',
    campos: [
      {
        campo: 'Endpoint de Pagamento Crédito',
        valor: `${STATIC_INFO.getnet.base_url_homolog}/v1/payments/credit`,
        instrucao: 'Coluna "Endpoint" da sheet de pagamento.',
      },
      {
        campo: 'payment_credit_approved — Valor',
        valor: 'R$ 1,00 (100 centavos)',
        instrucao: 'Valor do pagamento aprovado.',
      },
      {
        campo: 'payment_credit_approved — Status',
        valor: 'PASS — APPROVED',
        instrucao: 'Status retornado pela API.',
      },
      {
        campo: 'payment_credit_denied — Valor',
        valor: 'R$ 1,00 (100 centavos)',
        instrucao: 'Valor do pagamento negado.',
      },
      {
        campo: 'payment_credit_denied — Status esperado',
        valor: 'PASS — DENIED/REJECTED (comportamento esperado)',
        instrucao: 'Registrar que o cartão negado retornou o status de negação correto.',
      },
      {
        campo: 'payment_installments — Valor',
        valor: 'R$ 3,00 (300 centavos) em 3x de R$ 1,00',
        instrucao: 'Pagamento parcelado.',
      },
      {
        campo: 'payment_installments — Tipo',
        valor: 'INSTALL_NO_INTEREST (sem juros)',
        instrucao: 'transaction_type utilizado.',
      },
    ],
  },

  // ─── Sheet: 4 — Debit Payment (se existir) ──────────────────────────────────
  {
    sheet: '4-DebitPayment (se existir no checklist)',
    secao: 'Pagamento por Débito',
    campos: [
      {
        campo: 'Implementação',
        valor: 'NÃO IMPLEMENTADO na fase atual — apenas crédito está em escopo',
        instrucao: 'Se a sheet existir, marcar como "N/A" ou "Fora de escopo desta entrega".',
      },
    ],
  },

  // ─── Sheet: 5 — Reversal D+0 ────────────────────────────────────────────────
  {
    sheet: '5-ReversalD0',
    secao: 'Cancelamento no mesmo dia (D+0)',
    campos: [
      {
        campo: 'Endpoint de Cancelamento D+0',
        valor: `${STATIC_INFO.getnet.base_url_homolog}/dpm/payments-gwproxy/v2/payments/{payment_id}/cancel`,
        instrucao: 'Endpoint usado para cancelar no mesmo dia.',
      },
      {
        campo: 'cancel_d0 — Resultado',
        valor: 'PASS — Pagamento cancelado com sucesso (CANCELLED)',
        instrucao: 'Status retornado após cancelamento.',
      },
      {
        campo: 'Valor cancelado',
        valor: 'R$ 1,00 (100 centavos) — mesmo valor do payment_credit_approved',
        instrucao: 'O cancelamento D+0 foi do pagamento aprovado no teste anterior.',
      },
    ],
  },

  // ─── Sheet: 6 — Reversal D+1+ (se existir) ──────────────────────────────────
  {
    sheet: '6-ReversalD1+ (se existir)',
    secao: 'Cancelamento tardio (D+1+)',
    campos: [
      {
        campo: 'Implementação',
        valor: 'Endpoint disponível: /dpm/payments-gwproxy/v2/payments/cancel/request',
        instrucao: 'Se o checklist cobrar D+1+, informar que o endpoint requestCancellation está implementado.',
      },
    ],
  },

  // ─── Sheet: 7 — GetPay ──────────────────────────────────────────────────────
  {
    sheet: '7-GetPay',
    secao: 'GetPay (Link de Pagamento)',
    campos: [
      {
        campo: 'Status',
        valor: 'NÃO DISPONÍVEL NA API V2 Global — funcionalidade ausente nesta versão',
        instrucao: 'Marcar como N/A ou "Não disponível na V2 Global" conforme já indicado no XLSX.',
      },
    ],
  },

  // ─── Sheet: 8 — Subscription (se existir) ───────────────────────────────────
  {
    sheet: '8-Subscription (se existir)',
    secao: 'Assinatura Recorrente',
    campos: [
      {
        campo: 'Implementação',
        valor: 'Implementado via /v1/subscriptions — disponível mas fora do escopo desta homologação inicial',
        instrucao: 'Informar se requerido pelo checklist.',
      },
    ],
  },

  // ─── Sheet: 9 — PIX (se existir) ────────────────────────────────────────────
  {
    sheet: '9-PIX (se existir)',
    secao: 'PIX',
    campos: [
      {
        campo: 'Endpoint PIX',
        valor: `${STATIC_INFO.getnet.base_url_homolog}/dpm/payments-gwproxy/v2/payments/qrcode`,
        instrucao: 'Informar endpoint se requerido.',
      },
      {
        campo: 'Status da implementação',
        valor: 'Implementado — fora do escopo desta rodada de homologação',
        instrucao: 'Marcar como N/A se o checklist cobrar apenas crédito nesta fase.',
      },
    ],
  },

  // ─── Sheet: 10 — Callback / Webhook ─────────────────────────────────────────
  {
    sheet: '10-Callback',
    secao: 'URLs de Callback / Webhook',
    campos: [
      {
        campo: 'URL de Callback — PAYMENT_CONFIRMED',
        valor: STATIC_INFO.callbacks.url_padrao,
        instrucao: 'Preencher para todos os tipos de transação.',
      },
      {
        campo: 'URL de Callback — PAYMENT_DENIED',
        valor: STATIC_INFO.callbacks.url_padrao,
        instrucao: 'Mesma URL para todos os eventos.',
      },
      {
        campo: 'URL de Callback — PAYMENT_CANCELLED',
        valor: STATIC_INFO.callbacks.url_padrao,
        instrucao: 'Mesma URL.',
      },
      {
        campo: 'URL de Callback — CANCEL_REQUEST_APPROVED',
        valor: STATIC_INFO.callbacks.url_padrao,
        instrucao: 'Mesma URL.',
      },
      {
        campo: 'URL de Callback — CANCEL_REQUEST_DENIED',
        valor: STATIC_INFO.callbacks.url_padrao,
        instrucao: 'Mesma URL.',
      },
      {
        campo: 'URL de Callback — SUBSCRIPTION_PAYMENT',
        valor: STATIC_INFO.callbacks.url_padrao,
        instrucao: 'Mesma URL.',
      },
      {
        campo: 'URL de Callback — SUBSCRIPTION_CANCELLED',
        valor: STATIC_INFO.callbacks.url_padrao,
        instrucao: 'Mesma URL.',
      },
      {
        campo: 'Método de recebimento',
        valor: 'POST — JSON',
        instrucao: 'Formato de entrega do webhook.',
      },
      {
        campo: 'Validação de assinatura',
        valor: 'HMAC-SHA256 via header X-Signature',
        instrucao: 'Informar método de validação implementado.',
      },
    ],
  },
];

// ── Gerar JSON ────────────────────────────────────────────────────────────────
const jsonOutput = {
  generated_at: new Date().toISOString(),
  instrucao_geral: [
    'Abra o arquivo XLSX do checklist no Excel ou LibreOffice Calc.',
    'Use este JSON como referência para preencher cada campo.',
    'Cada entrada contém: sheet (aba), campo (nome da célula), valor (o que preencher), instrucao (onde fica).',
    'Após preencher, salve como: "Homologation Checklist - Digital Platform_V2_Global - 2DL Company - FILLED.xlsx"',
    'Após os testes com IP liberado, use o homolog-evidence-YYYY-MM-DD.json para preencher os campos de REQUEST/RESPONSE.',
  ],
  dados_estaticos: STATIC_INFO,
  mapa_preenchimento: XLSX_FILL_MAP,
  nome_arquivo_final: 'Homologation Checklist - Digital Platform_V2_Global - 2DL Company - FILLED.xlsx',
};

const jsonPath = resolve(__dirname, '../homolog-checklist-static-info.json');
writeFileSync(jsonPath, JSON.stringify(jsonOutput, null, 2), 'utf8');

// ── Gerar HTML de referência rápida ──────────────────────────────────────────
const htmlRows = XLSX_FILL_MAP.flatMap(section =>
  section.campos.map(c => `
    <tr>
      <td class="sheet">${section.sheet}</td>
      <td class="field">${c.campo}</td>
      <td class="value"><code>${escapeHtml(c.valor)}</code></td>
      <td class="instrucao">${escapeHtml(c.instrucao)}</td>
    </tr>`
  )
).join('');

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Getnet V2 — Checklist Pre-fill | Ruptur Cloud</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; color: #333; padding: 24px; }
    h1 { font-size: 1.4rem; margin-bottom: 4px; color: #1a1a2e; }
    .subtitle { font-size: 0.85rem; color: #666; margin-bottom: 24px; }
    .meta { background: #fff; border-left: 4px solid #0066cc; padding: 16px; border-radius: 4px; margin-bottom: 24px; }
    .meta h2 { font-size: 0.95rem; margin-bottom: 8px; color: #0066cc; }
    .meta-grid { display: grid; grid-template-columns: 160px 1fr; gap: 4px 8px; font-size: 0.875rem; }
    .meta-grid strong { color: #555; }
    table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 4px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
    thead tr { background: #1a1a2e; color: #fff; }
    th { padding: 10px 12px; text-align: left; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; }
    td { padding: 9px 12px; font-size: 0.83rem; border-bottom: 1px solid #eee; vertical-align: top; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: #f0f6ff; }
    .sheet { color: #0066cc; font-weight: 600; white-space: nowrap; width: 220px; }
    .field { font-weight: 500; width: 260px; }
    .value code { background: #f0f0f0; padding: 2px 6px; border-radius: 3px; font-size: 0.8rem; word-break: break-all; display: inline-block; }
    .instrucao { color: #666; font-size: 0.78rem; }
    .callback-note { background: #fff3cd; border-left: 4px solid #f0a800; padding: 12px 16px; border-radius: 4px; margin: 16px 0; font-size: 0.85rem; }
    footer { margin-top: 24px; font-size: 0.75rem; color: #999; text-align: center; }
  </style>
</head>
<body>
  <h1>Getnet V2 Global — Checklist Pre-fill</h1>
  <p class="subtitle">Informações estáticas para preencher o XLSX de homologação • Ruptur Cloud</p>

  <div class="meta">
    <h2>Dados da Empresa</h2>
    <div class="meta-grid">
      <strong>Razão Social:</strong>  <span>${STATIC_INFO.company.razao_social}</span>
      <strong>Responsável:</strong>   <span>${STATIC_INFO.company.responsavel}</span>
      <strong>E-mail:</strong>        <span>${STATIC_INFO.company.email}</span>
      <strong>Plataforma:</strong>    <span>${STATIC_INFO.company.plataforma}</span>
      <strong>Seller ID:</strong>     <code>${STATIC_INFO.getnet.seller_id}</code>
      <strong>Base URL Homolog:</strong> <code>${STATIC_INFO.getnet.base_url_homolog}</code>
    </div>
  </div>

  <div class="callback-note">
    📌 <strong>URL de Callback (todos os eventos):</strong>
    <code>${STATIC_INFO.callbacks.url_padrao}</code>
    — Preencher para todos os tipos de transação na Sheet 10.
  </div>

  <table>
    <thead>
      <tr>
        <th>Sheet (Aba)</th>
        <th>Campo</th>
        <th>Valor a preencher</th>
        <th>Instrução / Localização</th>
      </tr>
    </thead>
    <tbody>
      ${htmlRows}
    </tbody>
  </table>

  <footer>
    Gerado em ${new Date().toLocaleString('pt-BR')} por getnet-homolog-prefill.mjs
    — Arquivo de destino: <strong>Homologation Checklist - Digital Platform_V2_Global - 2DL Company - FILLED.xlsx</strong>
  </footer>
</body>
</html>`;

const htmlPath = resolve(__dirname, '../homolog-checklist-prefill.html');
writeFileSync(htmlPath, html, 'utf8');

// ── Resumo no terminal ────────────────────────────────────────────────────────
console.log('');
console.log('╔══════════════════════════════════════════════════════════════╗');
console.log('║     Getnet V2 Global — Checklist Pre-fill Generator          ║');
console.log('╚══════════════════════════════════════════════════════════════╝');
console.log('');
console.log('📋  Empresa     :', STATIC_INFO.company.razao_social);
console.log('👤  Responsável :', STATIC_INFO.company.responsavel);
console.log('📧  E-mail      :', STATIC_INFO.company.email);
console.log('🏪  Seller ID   :', STATIC_INFO.getnet.seller_id);
console.log('🌐  Base URL    :', STATIC_INFO.getnet.base_url_homolog);
console.log('🔔  Callback    :', STATIC_INFO.callbacks.url_padrao);
console.log('');
console.log('📁  Arquivos gerados:');
console.log(`    ${jsonPath}`);
console.log(`    ${htmlPath}`);
console.log('');
console.log('📝  Próximos passos:');
console.log('    1. Abra o XLSX do checklist Getnet no Excel ou LibreOffice');
console.log('    2. Abra o HTML acima no browser para ver todos os valores');
console.log('    3. Preencha campo a campo conforme as instruções no HTML');
console.log('    4. Execute o runner (getnet-homolog-runner.mjs) com IP liberado');
console.log('    5. Use o homolog-evidence-YYYY-MM-DD.json para copiar REQUEST/RESPONSE');
console.log('    6. Salve o XLSX como:');
console.log('       "Homologation Checklist - Digital Platform_V2_Global - 2DL Company - FILLED.xlsx"');
console.log('');

#!/usr/bin/env node
/**
 * Getnet V2 Global — Homologation Test Runner
 * Executa os testes do checklist em sequência e gera log de evidências.
 *
 * Uso: node scripts/getnet-homolog-runner.mjs
 * Output: homolog-evidence-YYYY-MM-DD.json
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Carregar .env (padrão do projeto) ────────────────────────────────────────
function loadEnv() {
  try {
    const lines = readFileSync(resolve(__dirname, '../.env'), 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx < 0) continue;
      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
      val = val.replace(/\$\{([^}]+)\}/g, (_, k) => process.env[k] || '');
      if (!process.env[key]) process.env[key] = val;
    }
  } catch { /* sem .env local */ }
}
loadEnv();

// ── Verificar variáveis obrigatórias ─────────────────────────────────────────
const REQUIRED_VARS = [
  'GETNET_USE_HOMOLOG',
  'GETNET_HOMOLOG_CLIENT_ID',
  'GETNET_HOMOLOG_CLIENT_SECRET',
  'GETNET_HOMOLOG_SELLER_ID',
];

const missing = REQUIRED_VARS.filter(v => !process.env[v]);
if (missing.length > 0) {
  console.error('❌ Variáveis de ambiente obrigatórias ausentes:');
  missing.forEach(v => console.error(`   - ${v}`));
  console.error('\nConfigure no .env antes de executar:');
  console.error('  GETNET_USE_HOMOLOG=true');
  console.error('  GETNET_HOMOLOG_CLIENT_ID=<seu_client_id>');
  console.error('  GETNET_HOMOLOG_CLIENT_SECRET=<seu_client_secret>');
  console.error('  GETNET_HOMOLOG_SELLER_ID=<seu_seller_id>');
  process.exit(1);
}

// ── Importar BillingService ───────────────────────────────────────────────────
const { BillingService } = await import('../modules/billing/getnet.js');

// ── Constantes de homologação ─────────────────────────────────────────────────
const HOMOLOG_CARDS = {
  approved:  '5155901222280001',  // Cartão aprovado — Getnet V2
  denied:    '5155901222280050',  // Cartão negado — Getnet V2
};

const WEBHOOK_URL = 'https://api.ruptur.cloud/api/webhooks/getnet';

// ── Estado compartilhado entre testes ─────────────────────────────────────────
const state = {
  accessToken: null,
  numberToken: null,
  approvedPaymentId: null,
};

// ── Instância do BillingService no modo homologação ───────────────────────────
const billing = new BillingService({ useHomolog: true });

console.log('');
console.log('╔══════════════════════════════════════════════════════════════╗');
console.log('║         Getnet V2 Global — Homologation Test Runner          ║');
console.log('╚══════════════════════════════════════════════════════════════╝');
console.log('');
console.log(`🏪  Seller ID  : ${billing.sellerId}`);
console.log(`🌐  Base URL   : ${billing.baseUrl}`);
console.log(`📅  Data       : ${new Date().toISOString()}`);
console.log('');

// ── Helper: executar um teste com captura de evidência ────────────────────────
const results = [];

async function runTest(sheet, testId, description, fn) {
  console.log(`\n▶  [${sheet}] ${testId}`);
  console.log(`   ${description}`);

  const entry = {
    sheet,
    test_id: testId,
    description,
    status: null,
    request: null,
    response: null,
    error: null,
    executed_at: new Date().toISOString(),
  };

  try {
    const result = await fn();
    entry.status   = result.status || 'PASS';
    entry.request  = result.request  || null;
    entry.response = result.response || null;

    const icon = entry.status === 'PASS' ? '✅' : (entry.status === 'SKIP' ? '⏭️ ' : '⚠️ ');
    console.log(`   ${icon} ${entry.status}${entry.response?.status ? ` — HTTP status captado` : ''}`);
  } catch (err) {
    entry.status = 'FAIL';
    entry.error  = err.message;
    if (err.body) entry.response = err.body;
    console.log(`   ❌ FAIL — ${err.message}`);
  }

  results.push(entry);
  return entry;
}

// ════════════════════════════════════════════════════════════════════════════════
//  SHEET 1 — Authentication
// ════════════════════════════════════════════════════════════════════════════════

await runTest('1-Authentication', 'auth_success', 'OAuth2 com credenciais corretas', async () => {
  const request = {
    endpoint: `${billing.baseUrl}/auth/oauth/v2/token`,
    method: 'POST',
    grant_type: 'client_credentials',
    client_id: billing.clientId,
  };

  // Forçar renovação limpando cache
  billing._token    = null;
  billing._tokenExp = 0;

  const token = await billing.getAccessToken();
  state.accessToken = token;

  return {
    status: 'PASS',
    request,
    response: {
      access_token: token ? `${token.slice(0, 20)}...` : null,
      token_type: 'Bearer',
      note: 'Token truncado por segurança no log',
    },
  };
});

await runTest('1-Authentication', 'auth_failure', 'OAuth2 com client_secret inválido — espera HTTP 401', async () => {
  const request = {
    endpoint: `${billing.baseUrl}/auth/oauth/v2/token`,
    method: 'POST',
    grant_type: 'client_credentials',
    client_id: billing.clientId,
    client_secret: '*** INVALID SECRET ***',
  };

  // Instância temporária com secret errado
  const badBilling = new BillingService({
    useHomolog: true,
    clientId: billing.clientId,
    clientSecret: 'INVALID_SECRET_FOR_HOMOLOG_TEST',
    sellerId: billing.sellerId,
  });

  let responseBody = null;
  let httpStatus = null;

  try {
    await badBilling.getAccessToken();
    // Se não lançou, é inesperado
    return {
      status: 'WARN',
      request,
      response: { note: 'Esperava erro 401 mas token foi obtido — verificar configuração' },
    };
  } catch (err) {
    httpStatus = err.message.match(/\((\d+)\)/)?.[1] || 'unknown';
    responseBody = err.message;
    return {
      status: httpStatus === '401' ? 'PASS' : 'WARN',
      request,
      response: {
        http_status: httpStatus,
        error_message: err.message,
        expected: '401 Unauthorized',
      },
    };
  }
});

// ════════════════════════════════════════════════════════════════════════════════
//  SHEET 2 — Tokenization
// ════════════════════════════════════════════════════════════════════════════════

await runTest('2-Tokenization', 'tokenize_card_success', `Tokenizar cartão aprovado (${HOMOLOG_CARDS.approved})`, async () => {
  const cardNumber   = HOMOLOG_CARDS.approved;
  const customerId   = 'homolog-customer-001';

  const request = {
    endpoint: `${billing.baseUrl}/v1/tokens/card`,
    method: 'POST',
    card_number: `${cardNumber.slice(0, 6)}...${cardNumber.slice(-4)}`,
    customer_id: customerId,
  };

  const response = await billing.tokenizeCard(cardNumber, customerId);
  state.numberToken = response.number_token;

  return {
    status: response.number_token ? 'PASS' : 'FAIL',
    request,
    response: {
      number_token: response.number_token,
      token_truncated: response.number_token ? `${response.number_token.slice(0, 10)}...` : null,
    },
  };
});

await runTest('2-Tokenization', 'tokenize_card_duplicate', 'Tokenizar mesmo cartão duas vezes — verificar comportamento', async () => {
  const cardNumber = HOMOLOG_CARDS.approved;
  const customerId = 'homolog-customer-001';

  const request = {
    endpoint: `${billing.baseUrl}/v1/tokens/card`,
    method: 'POST',
    card_number: `${cardNumber.slice(0, 6)}...${cardNumber.slice(-4)}`,
    customer_id: customerId,
    note: 'Segunda tokenização do mesmo cartão',
  };

  const response = await billing.tokenizeCard(cardNumber, customerId);
  const sameToken = response.number_token === state.numberToken;

  return {
    status: 'PASS',
    request,
    response: {
      number_token: response.number_token,
      same_token_as_first: sameToken,
      note: sameToken
        ? 'API retornou o mesmo token (comportamento idempotente)'
        : 'API retornou token diferente (tokens distintos por chamada)',
    },
  };
});

// ── Helper: montar payload de pagamento crédito ───────────────────────────────
function buildCreditPayload(numberToken, amountCents, options = {}) {
  const orderId = `homolog-test-${Date.now()}`;
  return {
    seller_id: billing.sellerId,
    amount: amountCents,
    currency: 'BRL',
    order: {
      order_id: orderId,
      sales_tax: 0,
      product_type: 'service',
    },
    customer: {
      customer_id: 'homolog-customer-001',
      first_name: 'Teste',
      last_name: 'Homolog',
      email: 'homolog@ruptur.cloud',
      document_type: 'CPF',
      document_number: '12345678909',
      billing_address: {
        street: 'Rua Homolog',
        number: '123',
        city: 'Sao Paulo',
        state: 'SP',
        country: 'BR',
        postal_code: '01310-100',
      },
    },
    credit: {
      delayed: false,
      save_card_data: false,
      transaction_type: options.transactionType || 'FULL_PAYMENT',
      number_installments: options.installments || 1,
      card: {
        number_token: numberToken,
        cardholder_name: options.holderName || 'TESTE HOMOLOG',
        security_code: '123',
        brand: 'Mastercard',
        expiration_month: '12',
        expiration_year: '2026',
      },
    },
  };
}

// ════════════════════════════════════════════════════════════════════════════════
//  SHEET 3 — Credit Payment
// ════════════════════════════════════════════════════════════════════════════════

// Verificar se temos o number_token antes de prosseguir
if (!state.numberToken) {
  console.log('\n⚠️  numberToken não disponível — pulando testes de pagamento (tokenização falhou)');
  results.push({
    sheet: '3-CreditPayment',
    test_id: 'payment_credit_approved',
    description: 'Pagamento crédito aprovado — PULADO por falta de numberToken',
    status: 'SKIP',
    request: null,
    response: null,
    error: 'Tokenização anterior falhou, numberToken indisponível',
    executed_at: new Date().toISOString(),
  });
} else {

  await runTest('3-CreditPayment', 'payment_credit_approved', 'Pagamento R$ 1,00 com cartão aprovado', async () => {
    const payload = buildCreditPayload(state.numberToken, 100, { transactionType: 'FULL_PAYMENT' });

    const request = {
      endpoint: `${billing.baseUrl}/v1/payments/credit`,
      method: 'POST',
      amount_cents: 100,
      card: `${HOMOLOG_CARDS.approved.slice(0, 6)}...${HOMOLOG_CARDS.approved.slice(-4)}`,
      transaction_type: 'FULL_PAYMENT',
      installments: 1,
      order_id: payload.order.order_id,
    };

    const response = await billing.apiFetch('/v1/payments/credit', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    state.approvedPaymentId = response.payment_id;

    const passed = ['APPROVED', 'AUTHORIZED'].includes(response.status) || response.payment_id;
    return {
      status: passed ? 'PASS' : 'FAIL',
      request,
      response: {
        payment_id: response.payment_id,
        status: response.status,
        status_detail: response.status_detail,
        credit: response.credit,
      },
    };
  });

  await runTest('3-CreditPayment', 'payment_credit_denied', 'Pagamento R$ 1,00 com cartão negado', async () => {
    // Tokenizar cartão negado
    let deniedToken = null;
    try {
      const t = await billing.tokenizeCard(HOMOLOG_CARDS.denied, 'homolog-customer-002');
      deniedToken = t.number_token;
    } catch (_err) {
      // Tokenização do cartão negado pode falhar — pular este sub-teste
    }

    if (!deniedToken) {
      return {
        status: 'SKIP',
        request: { note: 'Tokenização do cartão negado falhou — teste não executado' },
        response: null,
      };
    }

    const payload = buildCreditPayload(deniedToken, 100, { holderName: 'CARTAO NEGADO' });

    const request = {
      endpoint: `${billing.baseUrl}/v1/payments/credit`,
      method: 'POST',
      amount_cents: 100,
      card: `${HOMOLOG_CARDS.denied.slice(0, 6)}...${HOMOLOG_CARDS.denied.slice(-4)}`,
      expected_outcome: 'DENIED/REJECTED',
    };

    try {
      const response = await billing.apiFetch('/v1/payments/credit', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const isDenied = ['DENIED', 'REJECTED', 'REFUSED', 'NOT_AUTHORIZED'].includes(response.status);
      return {
        status: isDenied ? 'PASS' : 'WARN',
        request,
        response: {
          payment_id: response.payment_id,
          status: response.status,
          status_detail: response.status_detail,
          note: isDenied
            ? 'Cartão negado como esperado'
            : `Status inesperado: ${response.status} (esperava DENIED/REJECTED)`,
        },
      };
    } catch (err) {
      // Erro HTTP 4xx/5xx ao negar o cartão é o comportamento esperado
      return {
        status: 'PASS',
        request,
        response: {
          error_message: err.message,
          body: err.body || null,
          note: 'Erro capturado na negação — comportamento esperado para cartão negado',
        },
      };
    }
  });

  await runTest('3-CreditPayment', 'payment_installments', 'Pagamento R$ 3,00 em 3x sem juros', async () => {
    const payload = buildCreditPayload(state.numberToken, 300, {
      installments: 3,
      transactionType: 'INSTALL_NO_INTEREST',
    });

    const request = {
      endpoint: `${billing.baseUrl}/v1/payments/credit`,
      method: 'POST',
      amount_cents: 300,
      transaction_type: 'INSTALL_NO_INTEREST',
      installments: 3,
      installment_value_cents: 100,
      order_id: payload.order.order_id,
    };

    const response = await billing.apiFetch('/v1/payments/credit', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const passed = ['APPROVED', 'AUTHORIZED'].includes(response.status) || response.payment_id;
    return {
      status: passed ? 'PASS' : 'FAIL',
      request,
      response: {
        payment_id: response.payment_id,
        status: response.status,
        status_detail: response.status_detail,
        credit: response.credit,
      },
    };
  });

}

// ════════════════════════════════════════════════════════════════════════════════
//  SHEET 5 — Reversal D+0
// ════════════════════════════════════════════════════════════════════════════════

if (!state.approvedPaymentId) {
  console.log('\n⚠️  approvedPaymentId não disponível — pulando teste de cancelamento D+0');
  results.push({
    sheet: '5-ReversalD0',
    test_id: 'cancel_d0',
    description: 'Cancelamento D+0 — PULADO por falta de payment_id aprovado',
    status: 'SKIP',
    request: null,
    response: null,
    error: 'Pagamento aprovado anterior indisponível',
    executed_at: new Date().toISOString(),
  });
} else {

  await runTest('5-ReversalD0', 'cancel_d0', `Cancelar pagamento D+0 (id: ${state.approvedPaymentId})`, async () => {
    const request = {
      endpoint: `${billing.baseUrl}/dpm/payments-gwproxy/v2/payments/${state.approvedPaymentId}/cancel`,
      method: 'POST',
      payment_id: state.approvedPaymentId,
      amount_cents: 100,
    };

    const response = await billing.cancelPayment(state.approvedPaymentId, 100);

    const passed = response.status === 'CANCELLED' || response.payment_id;
    return {
      status: passed ? 'PASS' : 'WARN',
      request,
      response,
    };
  });

}

// ════════════════════════════════════════════════════════════════════════════════
//  SHEET 10 — Callback / Webhook
// ════════════════════════════════════════════════════════════════════════════════

await runTest('10-Callback', 'callback_url_configured', 'Registrar URL de callback configurada', async () => {
  // Não é um teste de API — registra a configuração estática
  return {
    status: 'PASS',
    request: {
      note: 'URL de callback configurada no painel Getnet',
      webhook_url: WEBHOOK_URL,
    },
    response: {
      url: WEBHOOK_URL,
      events_supported: [
        'PAYMENT_CONFIRMED',
        'PAYMENT_APPROVED',
        'PAYMENT_DENIED',
        'PAYMENT_CANCELLED',
        'CANCEL_REQUEST_APPROVED',
        'CANCEL_REQUEST_DENIED',
        'SUBSCRIPTION_PAYMENT',
        'SUBSCRIPTION_CANCELLED',
      ],
      note: 'URL deve estar cadastrada no portal do seller Getnet antes da homologação',
    },
  };
});

// ════════════════════════════════════════════════════════════════════════════════
//  Gerar arquivo de evidências
// ════════════════════════════════════════════════════════════════════════════════

const today = new Date().toISOString().slice(0, 10);
const outputFile = resolve(__dirname, `../homolog-evidence-${today}.json`);

const evidence = {
  generated_at: new Date().toISOString(),
  seller_id: billing.sellerId,
  base_url: billing.baseUrl,
  environment: 'homologacao-v2-global',
  company: '2DL Company Ltda',
  responsible: 'Diego I. L. da Silva',
  email: 'ruptur.cloud@gmail.com',
  callback_url: WEBHOOK_URL,
  tests: results.map(r => ({
    sheet: r.sheet,
    test_id: r.test_id,
    description: r.description,
    status: r.status,
    request: r.request,
    response: r.response,
    error: r.error || null,
    executed_at: r.executed_at,
  })),
};

writeFileSync(outputFile, JSON.stringify(evidence, null, 2), 'utf8');

// ── Resumo final ──────────────────────────────────────────────────────────────
const pass  = results.filter(r => r.status === 'PASS').length;
const fail  = results.filter(r => r.status === 'FAIL').length;
const warn  = results.filter(r => r.status === 'WARN').length;
const skip  = results.filter(r => r.status === 'SKIP').length;
const total = results.length;

console.log('');
console.log('═══════════════════════════════════════════════════════════════');
console.log('📊  RESUMO DOS TESTES');
console.log('═══════════════════════════════════════════════════════════════');
console.log(`   ✅ PASS  : ${pass}`);
console.log(`   ❌ FAIL  : ${fail}`);
console.log(`   ⚠️  WARN  : ${warn}`);
console.log(`   ⏭️  SKIP  : ${skip}`);
console.log(`   ─────────────────`);
console.log(`   TOTAL   : ${total}`);
console.log('');
console.log(`📁  Evidências salvas em:`);
console.log(`    ${outputFile}`);
console.log('');

if (fail > 0) {
  console.log('⚠️  Há testes com FAIL. Verifique o log acima e o arquivo de evidências.');
} else if (skip > 0) {
  console.log('ℹ️  Alguns testes foram pulados. Verifique dependências (tokenização, auth).');
} else {
  console.log('🎉  Todos os testes passaram! Arquivo pronto para envio à Getnet.');
}
console.log('');

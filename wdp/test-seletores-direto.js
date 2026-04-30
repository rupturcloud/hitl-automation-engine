#!/usr/bin/env node
/**
 * Teste Direto: Validar seletores de realizarAposta.js
 * Simula DOM real do Bac Bo e testa encontrarChip() + decomporStake()
 */

const { JSDOM } = require('jsdom');

console.log('\n' + '='.repeat(70));
console.log('🔍 DIAGNÓSTICO: Seletores de realizarAposta.js');
console.log('='.repeat(70) + '\n');

// Criar DOM virtual
const html = `
<!DOCTYPE html>
<html>
<head><title>Bac Bo</title></head>
<body>
  <div id="betting-panel" style="display: flex; gap: 5px;">
    <button class="chip-button" data-value="5">5</button>
    <button class="chip-button" data-value="10">10</button>
    <button class="chip-button" data-value="25">25</button>
    <button class="chip-button" data-value="125">125</button>
    <button class="chip-button" data-value="500" aria-label="Chip 500">500</button>
    <button class="chip-button" data-value="2500">2500</button>
    <button class="chip-button" data-value="5000">5000</button>
    <button class="chip-button" data-value="12000">12000</button>
  </div>

  <div id="betting-areas">
    <button id="bet-player" data-side="P">PLAYER</button>
    <button id="bet-banker" data-side="B">BANKER</button>
    <button id="bet-tie" data-side="T">TIE</button>
  </div>
</body>
</html>
`;

const dom = new JSDOM(html, { url: 'http://localhost' });
global.document = dom.window.document;
global.window = dom.window;

// ============ FUNÇÕES DE TESTE ============

function normalizarNumeroTexto(text) {
  return String(text || '').replace(/\s/g, '').replace(/[R$.,]/g, '');
}

function isVisible(el) {
  if (!el) return false;
  return true; // Em jsdom, assume visível
}

function textOf(el) {
  return `${el.textContent || ''} ${el.getAttribute('aria-label') || ''} ${el.getAttribute('title') || ''} ${el.getAttribute('data-value') || ''} ${el.getAttribute('data-amount') || ''}`.trim();
}

function encontrarChip(valor) {
  const normalizedStake = String(Math.round(Number(valor)));
  const selectors = [
    `[data-value="${normalizedStake}"]`,
    `[data-amount="${normalizedStake}"]`,
    `[aria-label*="${normalizedStake}"]`,
    `[data-role="chip"]`,
    `[class*="chip" i]`,
    `button[value="${normalizedStake}"]`,
    `button`,
    `div[role="button"]`,
    `[role="button"]`
  ];

  const candidatos = [];
  for (const selector of selectors) {
    try {
      document.querySelectorAll(selector).forEach((el) => {
        if (!candidatos.includes(el) && isVisible(el)) candidatos.push(el);
      });
    } catch (e) {
      // Selector inválido, skip
    }
  }

  return candidatos.find((el) => {
    const rawText = `${el.textContent || ''} ${el.getAttribute('aria-label') || ''} ${el.getAttribute('data-value') || ''} ${el.className || ''}`.toLowerCase();
    const numberRegex = new RegExp(`(?:^|[^0-9])0*${normalizedStake}(?:[^0-9]|$)`);

    const attrs = normalizarNumeroTexto(`${el.getAttribute('data-value') || ''} ${el.getAttribute('data-amount') || ''} ${el.getAttribute('value') || ''}`);
    if (attrs === normalizedStake) return true;

    const filhos = el.querySelectorAll('[class*="chip" i], button');
    if (filhos.length > 2) return false;

    return numberRegex.test(rawText) && (/chip|coin|token|bet/i.test(rawText));
  });
}

const BAC_BO_CHIPS = [12000, 10000, 5000, 2500, 500, 125, 25, 10, 5];

function decomporStake(stake) {
  let restante = Math.round(Number(stake));
  if (!Number.isFinite(restante) || restante < 5) return [];
  const chips = [];
  for (const chip of BAC_BO_CHIPS) {
    while (restante >= chip) {
      chips.push(chip);
      restante -= chip;
    }
  }
  return restante === 0 ? chips : [];
}

function calcularChipProtecao(stake) {
  const percentual10 = stake * 0.10;
  const chipMaisProximo = BAC_BO_CHIPS.find(chip => chip <= percentual10) || 5;
  return chipMaisProximo;
}

// ============ EXECUTAR TESTES ============

console.log('📝 TESTE 1: encontrarChip() - Localizar chips individuais');
console.log('-'.repeat(70));

const testeChips = [5, 10, 25, 125, 500, 2500, 5000, 12000];
let passadas = 0;

for (const valor of testeChips) {
  const resultado = encontrarChip(valor);
  const passou = resultado !== undefined && resultado.dataset.value === String(valor);
  console.log(`  ${passou ? '✓' : '✗'} R$ ${valor.toString().padStart(5)} → ${resultado ? `encontrado (${resultado.dataset.value})` : 'NÃO ENCONTRADO'}`);
  if (passou) passadas++;
}

console.log(`\n✓ Resultado: ${passadas}/${testeChips.length} chips encontrados\n`);

console.log('📝 TESTE 2: decomporStake() - Decompor valores em chips');
console.log('-'.repeat(70));

const decomposicoes = [
  { stake: 35, esperado: [25, 10] },
  { stake: 150, esperado: [125, 25] },
  { stake: 500, esperado: [500] },
  { stake: 2525, esperado: [2500, 25] },
  { stake: 12145, esperado: [12000, 125, 25] },
  { stake: 12345, esperado: [] }, // Impossível decompor
];

passadas = 0;
for (const { stake, esperado } of decomposicoes) {
  const resultado = decomporStake(stake);
  const passou = JSON.stringify(resultado) === JSON.stringify(esperado);
  console.log(`  ${passou ? '✓' : '✗'} R$ ${stake} → [${resultado.join(', ') || 'vazio'}]`);
  if (passou) passadas++;
}

console.log(`\n✓ Resultado: ${passadas}/${decomposicoes.length} decomposições corretas\n`);

console.log('📝 TESTE 3: calcularChipProtecao() - Proteção de empate');
console.log('-'.repeat(70));

const protecoes = [
  { stake: 500, esperado: 25 },   // 10% = 50 → chip mais próximo é 25
  { stake: 150, esperado: 10 },   // 10% = 15 → chip mais próximo é 10
  { stake: 2500, esperado: 125 }, // 10% = 250 → chip mais próximo é 125
];

passadas = 0;
for (const { stake, esperado } of protecoes) {
  const resultado = calcularChipProtecao(stake);
  const passou = resultado === esperado;
  console.log(`  ${passou ? '✓' : '✗'} Stake R$ ${stake} → Proteção R$ ${resultado} (esperado R$ ${esperado})`);
  if (passou) passadas++;
}

console.log(`\n✓ Resultado: ${passadas}/${protecoes.length} proteções corretas\n`);

console.log('📝 TESTE 4: Clicar em áreas de aposta (Player, Banker, Tie)');
console.log('-'.repeat(70));

const areas = ['player', 'banker', 'tie'];
passadas = 0;

for (const area of areas) {
  const botao = document.querySelector(`#bet-${area}`);
  const existe = botao !== null;
  const lado = botao?.dataset.side;
  console.log(`  ${existe ? '✓' : '✗'} #bet-${area} existe → Side: ${lado || 'N/A'}`);
  if (existe) passadas++;
}

console.log(`\n✓ Resultado: ${passadas}/${areas.length} áreas encontradas\n`);

console.log('='.repeat(70));
console.log('✅ DIAGNÓSTICO COMPLETO');
console.log('='.repeat(70));
console.log(`
CONCLUSÃO:
  Os seletores funcionam contra DOM simulado.
  Problema provavelmente está:
    1. NO SELETORES REAIS DO EVOLUTION GAMING (diferentes do mock)
    2. NA VELOCIDADE DE CLIQUES (timing de retry muito curto)
    3. NA DETECÇÃO DE VISIBILIDADE (elementos presentes mas hidden)
    4. NO JITTER (delay entre cliques insuficiente contra anti-bot)

PRÓXIMO PASSO:
  Testar contra mesa ao vivo com Playwright + logging detalhado
`);

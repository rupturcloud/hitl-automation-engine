#!/usr/bin/env node
/**
 * Smoke Test: Modo Híbrido (Executar Agora)
 * Valida: HTML, JS handlers, message passing
 */

const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

console.log('\n' + '='.repeat(70));
console.log('🧪 Smoke Test: Modo Híbrido');
console.log('='.repeat(70) + '\n');

// 1. Verificar HTML
console.log('📝 Teste 1: HTML Structure');
console.log('-'.repeat(70));

const html = fs.readFileSync(
  path.join(__dirname, 'extensao 4/sidepanel.html'),
  'utf-8'
);

const checks = {
  'auto-exec-panel exists': html.includes('id="auto-exec-panel"'),
  'btn-auto-exec exists': html.includes('id="btn-auto-exec"'),
  'auto-exec-info exists': html.includes('id="auto-exec-info"'),
  'Panel has blue styling': html.includes('#0ea5e9'),
  'Status div exists': html.includes('id="auto-exec-status"'),
};

Object.entries(checks).forEach(([check, result]) => {
  console.log(`  ${result ? '✓' : '✗'} ${check}`);
});

const allPass = Object.values(checks).every(v => v);
console.log(`✓ HTML validation: ${allPass ? 'PASSOU' : 'FALHOU'}\n`);

// 2. Verificar JS handlers em sidepanel.js
console.log('📝 Teste 2: Sidepanel.js Handlers');
console.log('-'.repeat(70));

const sidepanel = fs.readFileSync(
  path.join(__dirname, 'extensao 4/sidepanel.js'),
  'utf-8'
);

const jsChecks = {
  'atualizar() updated': sidepanel.includes('Atualizar painel automático'),
  'temSugestao check': sidepanel.includes('temSugestao'),
  'auto-exec-panel toggled': sidepanel.includes('autoExecPanel.classList.toggle'),
  'btn-auto-exec click handler': sidepanel.includes('btn-auto-exec'),
  'EXECUTAR_SUGESTAO_AGORA message': sidepanel.includes('EXECUTAR_SUGESTAO_AGORA'),
  'Feedback "Enviando..."': sidepanel.includes('Enviando...'),
  'Status update after execution': sidepanel.includes('auto-exec-status'),
};

Object.entries(jsChecks).forEach(([check, result]) => {
  console.log(`  ${result ? '✓' : '✗'} ${check}`);
});

const jsPass = Object.values(jsChecks).every(v => v);
console.log(`✓ Sidepanel.js validation: ${jsPass ? 'PASSOU' : 'FALHOU'}\n`);

// 3. Verificar handler em content.js
console.log('📝 Teste 3: Content.js Handler');
console.log('-'.repeat(70));

const content = fs.readFileSync(
  path.join(__dirname, 'extensao 4/content.js'),
  'utf-8'
);

const contentChecks = {
  'EXECUTAR_SUGESTAO_AGORA handler': content.includes("request.action === 'EXECUTAR_SUGESTAO_AGORA'"),
  'ultimaAnalise check': content.includes('Core.estadoRobo.ultimaAnalise'),
  'getBestHistory() call': content.includes('getBestHistory()'),
  'executarApostaNoMelhorFrame() call': content.includes('executarApostaNoMelhorFrame'),
  'Log entry creation': content.includes("'hybrid-"),
  'Success/error response': content.includes('sendResponse({ success:'),
};

Object.entries(contentChecks).forEach(([check, result]) => {
  console.log(`  ${result ? '✓' : '✗'} ${check}`);
});

const contentPass = Object.values(contentChecks).every(v => v);
console.log(`✓ Content.js validation: ${contentPass ? 'PASSOU' : 'FALHOU'}\n`);

// 4. Verificar fluxo de dados
console.log('📝 Teste 4: Data Flow');
console.log('-'.repeat(70));

const flowChecks = {
  '1. status.ultimaAnalise available in atualizar()': sidepanel.includes('status.ultimaAnalise'),
  '2. Acao/motivo/confianca extracted': sidepanel.includes('const { acao, motivo, confianca'),
  '3. Action label computed': sidepanel.includes('acaoLabel'),
  '4. Info div populated': sidepanel.includes('infoDiv.innerHTML'),
  '5. Button state updated': sidepanel.includes('autoExecBtn.disabled = false'),
  '6. Click sends EXECUTAR_SUGESTAO_AGORA': sidepanel.includes("'EXECUTAR_SUGESTAO_AGORA'"),
  '7. Content.js receives and processes': content.includes("'EXECUTAR_SUGESTAO_AGORA'"),
  '8. Response with success flag': content.includes('sendResponse({ success:'),
};

Object.entries(flowChecks).forEach(([check, result]) => {
  console.log(`  ${result ? '✓' : '✗'} ${check}`);
});

const flowPass = Object.values(flowChecks).every(v => v);
console.log(`✓ Data flow validation: ${flowPass ? 'PASSOU' : 'FALHOU'}\n`);

// 5. Resumo
console.log('='.repeat(70));
console.log('✅ SMOKE TEST RESUMO');
console.log('='.repeat(70));

const allTests = [
  ['HTML Structure', allPass],
  ['Sidepanel.js Handlers', jsPass],
  ['Content.js Handler', contentPass],
  ['Data Flow', flowPass],
];

const totalPass = allTests.every(([_, pass]) => pass);

allTests.forEach(([name, pass]) => {
  console.log(`  ${pass ? '✓' : '✗'} ${name}`);
});

console.log(`
Status Geral: ${totalPass ? '✅ TUDO PRONTO' : '❌ FALHAS DETECTADAS'}

Proximos Passos:
${totalPass ? '  1. Testar com extensão real no navegador' : '  1. Revisar falhas acima'}
  2. Verificar se sugestão aparece no painel
  3. Clicar "Executar Agora" e validar execução
  4. Validar fallback quando seletores quebram
  5. Integrar com ciclo produtivo (estabilizar seletores)
`);

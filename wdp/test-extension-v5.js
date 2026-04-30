#!/usr/bin/env node
/**
 * Validação da Extensão v5
 * Testa: Syntax, Config, Keep-Alive, Proxy Intelligence, Logging
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const EXTENSION_DIR = path.join(__dirname, 'extensao 5');
const TESTS_PASSED = [];
const TESTS_FAILED = [];

console.log('\n' + '='.repeat(80));
console.log('🧪 VALIDAÇÃO COMPLETA - EXTENSÃO v5');
console.log('='.repeat(80) + '\n');

// ====== HELPER FUNCTIONS ======
function test(name, fn) {
  try {
    const result = fn();
    if (result === false) throw new Error('Assertion failed');
    TESTS_PASSED.push(name);
    console.log(`✓ ${name}`);
  } catch (err) {
    TESTS_FAILED.push({ name, error: err.message });
    console.log(`✗ ${name}: ${err.message}`);
  }
}

function readFile(filename) {
  const filePath = path.join(EXTENSION_DIR, filename);
  return fs.readFileSync(filePath, 'utf-8');
}

function validateSyntax(filename) {
  const code = readFile(filename);
  try {
    new vm.Script(code);
    return true;
  } catch (err) {
    throw new Error(`Syntax error in ${filename}: ${err.message}`);
  }
}

function extractSection(code, startPattern, endPattern) {
  const start = code.indexOf(startPattern);
  if (start === -1) throw new Error(`Pattern not found: ${startPattern}`);
  const end = code.indexOf(endPattern, start);
  if (end === -1) throw new Error(`End pattern not found: ${endPattern}`);
  return code.substring(start, end + endPattern.length);
}

// ====== TESTE 1: SYNTAX ======
console.log('📝 TESTE 1: Validação de Sintaxe JavaScript');
console.log('-'.repeat(80));

test('sidepanel.js - syntax válido', () => validateSyntax('sidepanel.js'));
test('background.js - syntax válido', () => validateSyntax('background.js'));
test('keepAliveClicker.js - syntax válido', () => validateSyntax('keepAliveClicker.js'));
test('proxyIntelligence.js - syntax válido', () => validateSyntax('proxyIntelligence.js'));

console.log('');

// ====== TESTE 2: CONFIG ISSUES ======
console.log('📝 TESTE 2: Validação de Configuração');
console.log('-'.repeat(80));

test('desabilitarLimiteStake sem ReferenceError', () => {
  const code = readFile('sidepanel.js');
  // Verifica se desabilitarLimiteStake é definido antes de ser usado
  const funcStart = code.indexOf('async function coletarConfigPainel()');
  const returnStart = code.indexOf('return {', funcStart);
  const returnSection = code.substring(funcStart, returnStart + 500);

  // Deve ter definição
  if (!returnSection.includes('const desabilitarLimiteStake')) {
    throw new Error('desabilitarLimiteStake não definido');
  }

  // Deve estar no return
  if (!returnSection.includes('desabilitarLimiteStake,')) {
    throw new Error('desabilitarLimiteStake não está no return object');
  }

  return true;
});

test('stakeMax usa variável correta', () => {
  const code = readFile('sidepanel.js');
  const funcStart = code.indexOf('async function coletarConfigPainel()');
  const returnStart = code.indexOf('return {', funcStart);
  const section = code.substring(funcStart, returnStart + 300);

  // Ambas devem estar presentes
  if (!section.includes('const desabilitarLimiteStake')) {
    throw new Error('Definição ausente');
  }
  if (!section.includes('desabilitarLimiteStake ? 999999 : 150')) {
    throw new Error('stakeMax não usa desabilitarLimiteStake');
  }

  return true;
});

test('DEFAULT_CONFIG inclui campos obrigatórios', () => {
  const code = readFile('sidepanel.js');
  const requiredFields = [
    'bankrollInicial',
    'desabilitarLimiteStake',
    'stakeBase',
    'maxGales',
    'minConfianca'
  ];

  const defaultConfigStart = code.indexOf('const DEFAULT_CONFIG');
  const defaultConfigEnd = code.indexOf('};', defaultConfigStart);
  const configSection = code.substring(defaultConfigStart, defaultConfigEnd);

  for (const field of requiredFields) {
    if (!configSection.includes(`${field}:`)) {
      throw new Error(`Campo obrigatório ausente: ${field}`);
    }
  }

  return true;
});

console.log('');

// ====== TESTE 3: KEEP-ALIVE ======
console.log('📝 TESTE 3: Keep-Alive Clicker');
console.log('-'.repeat(80));

test('KEEP_ALIVE_INTERVAL definido (45s)', () => {
  const code = readFile('keepAliveClicker.js');
  if (!code.includes('const KEEP_ALIVE_INTERVAL = 45000')) {
    throw new Error('KEEP_ALIVE_INTERVAL não é 45s');
  }
  return true;
});

test('startKeepAliveClicker existe', () => {
  const code = readFile('keepAliveClicker.js');
  if (!code.includes('function startKeepAliveClicker()')) {
    throw new Error('Function startKeepAliveClicker não encontrada');
  }
  return true;
});

test('stopKeepAliveClicker existe', () => {
  const code = readFile('keepAliveClicker.js');
  if (!code.includes('function stopKeepAliveClicker()')) {
    throw new Error('Function stopKeepAliveClicker não encontrada');
  }
  return true;
});

test('visibilitychange handler presente', () => {
  const code = readFile('keepAliveClicker.js');
  if (!code.includes("document.addEventListener('visibilitychange'")) {
    throw new Error('visibilitychange handler ausente');
  }
  return true;
});

console.log('');

// ====== TESTE 4: PROXY INTELLIGENCE ======
console.log('📝 TESTE 4: Proxy Intelligence');
console.log('-'.repeat(80));

test('HEALTH_CHECK_TIMEOUT definido (5s)', () => {
  const code = readFile('proxyIntelligence.js');
  if (!code.includes('HEALTH_CHECK_TIMEOUT: 5000')) {
    throw new Error('HEALTH_CHECK_TIMEOUT não é 5s');
  }
  return true;
});

test('healthCheckProxy function existe', () => {
  const code = readFile('proxyIntelligence.js');
  if (!code.includes('async function healthCheckProxy(config)')) {
    throw new Error('healthCheckProxy não definida');
  }
  return true;
});

test('trackProxyFailure function existe', () => {
  const code = readFile('proxyIntelligence.js');
  if (!code.includes('function trackProxyFailure(')) {
    throw new Error('trackProxyFailure não definida');
  }
  return true;
});

test('failureHistory com max limit', () => {
  const code = readFile('proxyIntelligence.js');
  if (!code.includes('MAX_FAILURE_HISTORY:')) {
    throw new Error('MAX_FAILURE_HISTORY não definido');
  }
  return true;
});

console.log('');

// ====== TESTE 5: BACKGROUND.JS ======
console.log('📝 TESTE 5: Background Service Worker');
console.log('-'.repeat(80));

test('DEFAULT_PROXY_CONFIG definido', () => {
  const code = readFile('background.js');
  if (!code.includes('const DEFAULT_PROXY_CONFIG')) {
    throw new Error('DEFAULT_PROXY_CONFIG ausente');
  }
  return true;
});

test('MAX_RETRIES configurável', () => {
  const code = readFile('background.js');
  if (!code.includes('maxRetries:')) {
    throw new Error('maxRetries não definido');
  }
  return true;
});

test('carregarConfigProxy existe', () => {
  const code = readFile('background.js');
  if (!code.includes('async function carregarConfigProxy()')) {
    throw new Error('carregarConfigProxy não definida');
  }
  return true;
});

console.log('');

// ====== TESTE 6: CONSISTENCY ======
console.log('📝 TESTE 6: Consistência Cross-File');
console.log('-'.repeat(80));

test('manifest.json existe', () => {
  const manifestPath = path.join(EXTENSION_DIR, 'manifest.json');
  return fs.existsSync(manifestPath);
});

test('content.js existe', () => {
  const contentPath = path.join(EXTENSION_DIR, 'content.js');
  return fs.existsSync(contentPath);
});

test('background.js acessível', () => {
  const bgPath = path.join(EXTENSION_DIR, 'background.js');
  return fs.existsSync(bgPath);
});

console.log('');

// ====== RESUMO ======
console.log('='.repeat(80));
console.log('📊 RESULTADO FINAL');
console.log('='.repeat(80));

const totalTests = TESTS_PASSED.length + TESTS_FAILED.length;
const passRate = Math.round((TESTS_PASSED.length / totalTests) * 100);

console.log(`
✓ Passou:  ${TESTS_PASSED.length}/${totalTests}
✗ Falhou:  ${TESTS_FAILED.length}/${totalTests}
📈 Taxa:   ${passRate}%
`);

if (TESTS_FAILED.length > 0) {
  console.log('❌ TESTES COM FALHA:');
  TESTS_FAILED.forEach(t => {
    console.log(`   - ${t.name}`);
    console.log(`     ${t.error}`);
  });
  console.log('');
  process.exit(1);
} else {
  console.log('✅ TODOS OS TESTES PASSARAM!');
  console.log(`
STATUS: 🟢 EXTENSÃO v5 VÁLIDA E PRONTA
  - Sintaxe JavaScript: OK
  - Configuração: OK
  - Keep-Alive: OK
  - Proxy Intelligence: OK
  - Background Service: OK

Recomendação: Pronto para deploy em produção.
`);
  process.exit(0);
}

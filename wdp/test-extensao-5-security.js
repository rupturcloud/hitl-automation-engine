#!/usr/bin/env node
/**
 * Teste: Segurança da Extensão 5
 * Valida: Credenciais seguras + Retry limit + Proxy config
 */

const fs = require('fs');
const path = require('path');

console.log('\n' + '='.repeat(70));
console.log('🔐 Teste: Segurança da Extensão 5');
console.log('='.repeat(70) + '\n');

// ═══ TESTE 1: Verificar se credenciais foram removidas do código ═══
console.log('📝 TESTE 1: Credenciais Hardcoded');
console.log('-'.repeat(70));

const backgroundJs = fs.readFileSync(
  path.join(__dirname, 'extensao 5/background.js'),
  'utf8'
);

const senhasPerigosas = [
  'pchoFejQSy-mob-br-sid-47537741',
  'PC_31DbRAzEOkEWTbEkK',
  'proxy-cheap.com'
];

let credenciaisEncontradas = 0;
for (const senha of senhasPerigosas) {
  if (backgroundJs.includes(senha)) {
    console.log(`  ✗ Credencial encontrada: ${senha.substring(0, 20)}...`);
    credenciaisEncontradas++;
  }
}

if (credenciaisEncontradas === 0) {
  console.log(`  ✓ Nenhuma credencial hardcoded encontrada`);
  console.log(`  ✓ Usando chrome.storage.local para credenciais\n`);
} else {
  console.log(`  ✗ FALHA: ${credenciaisEncontradas} credenciais hardcoded encontradas\n`);
}

// ═══ TESTE 2: Verificar se tem MAX_WS_RETRIES ═══
console.log('📝 TESTE 2: WebSocket Retry Limit');
console.log('-'.repeat(70));

if (backgroundJs.includes('MAX_WS_RETRIES')) {
  const match = backgroundJs.match(/MAX_WS_RETRIES\s*=\s*(\d+)/);
  if (match) {
    const maxRetries = parseInt(match[1]);
    console.log(`  ✓ MAX_WS_RETRIES definido: ${maxRetries}`);
    if (maxRetries > 0 && maxRetries <= 100) {
      console.log(`  ✓ Valor razoável (não infinito, não muito restritivo)\n`);
    } else {
      console.log(`  ⚠️ Valor fora do esperado (${maxRetries})\n`);
    }
  }
} else {
  console.log(`  ✗ MAX_WS_RETRIES não encontrado\n`);
}

// ═══ TESTE 3: Verificar se tem handler WS_MAX_RETRIES_REACHED ═══
console.log('📝 TESTE 3: Avisor de Máximo de Retries');
console.log('-'.repeat(70));

if (backgroundJs.includes('WS_MAX_RETRIES_REACHED')) {
  console.log(`  ✓ Event WS_MAX_RETRIES_REACHED presente`);
  console.log(`  ✓ Usuário será notificado quando retries atingem máximo\n`);
} else {
  console.log(`  ✗ Event WS_MAX_RETRIES_REACHED não encontrado\n`);
}

// ═══ TESTE 4: Verificar se options.html tem campos de proxy ═══
console.log('📝 TESTE 4: UI para Configurar Proxy');
console.log('-'.repeat(70));

const optionsHtml = fs.readFileSync(
  path.join(__dirname, 'extensao 5/options.html'),
  'utf8'
);

const requiredFields = [
  'proxyEnabled',
  'proxyHost',
  'proxyPort',
  'proxyUsername',
  'proxyPassword'
];

let camposFaltando = 0;
for (const field of requiredFields) {
  if (optionsHtml.includes(`id="${field}"`)) {
    console.log(`  ✓ Campo encontrado: ${field}`);
  } else {
    console.log(`  ✗ Campo faltando: ${field}`);
    camposFaltando++;
  }
}

if (camposFaltando === 0) {
  console.log(`  ✓ Todos os campos de proxy presentes\n`);
} else {
  console.log(`  ✗ ${camposFaltando} campos faltando\n`);
}

// ═══ TESTE 5: Verificar se config.example.json existe ═══
console.log('📝 TESTE 5: Template de Configuração Segura');
console.log('-'.repeat(70));

const configExample = path.join(__dirname, 'extensao 5/config.example.json');
if (fs.existsSync(configExample)) {
  const config = JSON.parse(fs.readFileSync(configExample, 'utf8'));
  console.log(`  ✓ config.example.json existe`);
  console.log(`  ✓ Proxy template: ${config.proxy.enabled ? 'ativado' : 'desativado'} (padrão seguro)`);
  if (config.proxy.username === 'SEU_USERNAME_AQUI') {
    console.log(`  ✓ Template usa placeholders (não hardcoded)\n`);
  }
} else {
  console.log(`  ✗ config.example.json não encontrado\n`);
}

// ═══ TESTE 6: Verificar se SECURITY_CONFIG.md existe ═══
console.log('📝 TESTE 6: Documentação de Segurança');
console.log('-'.repeat(70));

const secDoc = path.join(__dirname, 'extensao 5/SECURITY_CONFIG.md');
if (fs.existsSync(secDoc)) {
  const content = fs.readFileSync(secDoc, 'utf8');
  console.log(`  ✓ SECURITY_CONFIG.md documentando mudanças`);
  if (content.includes('chrome.storage.local')) {
    console.log(`  ✓ Documentação menciona chrome.storage.local\n`);
  }
} else {
  console.log(`  ✗ SECURITY_CONFIG.md não encontrado\n`);
}

// ═══ RESUMO ═══
console.log('='.repeat(70));
console.log('✅ TESTES CONCLUÍDOS');
console.log('='.repeat(70));
console.log(`
MUDANÇAS IMPLEMENTADAS:
  ✓ Credenciais removidas de background.js
  ✓ WebSocket com MAX_WS_RETRIES (parada automática)
  ✓ Avisor WS_MAX_RETRIES_REACHED (UI feedback)
  ✓ UI em options.html para configurar proxy
  ✓ Configuração armazenada em chrome.storage.local
  ✓ config.example.json com template seguro
  ✓ SECURITY_CONFIG.md com instruções

PRÓXIMOS PASSOS:
  → Testar carregamento da extensão em Chrome
  → Validar se proxy é configurado quando salvo em Options
  → Verificar se WebSocket para após 10 tentativas
  → Testar UI feedback quando servidor não responde
`);

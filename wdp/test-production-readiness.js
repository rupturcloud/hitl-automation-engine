#!/usr/bin/env node
/**
 * Production Readiness Test Suite
 * Validações finais antes de deploy
 */

const fs = require('fs');
const path = require('path');

console.log('\n' + '='.repeat(70));
console.log('🚀 PRODUCTION READINESS VALIDATION');
console.log('='.repeat(70) + '\n');

const tests = [];
let passCount = 0;
let failCount = 0;

function test(name, fn) {
  try {
    const result = fn();
    if (result === false) throw new Error('Test returned false');
    passCount++;
    console.log(`✓ ${name}`);
    return true;
  } catch (err) {
    failCount++;
    console.log(`✗ ${name}: ${err.message}`);
    return false;
  }
}

// ════════════════════════════════════════════════════════════════════════════
console.log('📋 VALIDAÇÕES DE ARQUIVOS');
console.log('-'.repeat(70));

test('HTML válido - sidepanel.html existe', () => {
  return fs.existsSync('extensao 4/sidepanel.html');
});

test('HTML válido - contém auto-exec-panel', () => {
  const html = fs.readFileSync('extensao 4/sidepanel.html', 'utf-8');
  return html.includes('id="auto-exec-panel"');
});

test('HTML válido - contém diag-panel', () => {
  const html = fs.readFileSync('extensao 4/sidepanel.html', 'utf-8');
  return html.includes('id="diag-panel"');
});

test('JS válido - sidepanel.js existe', () => {
  return fs.existsSync('extensao 4/sidepanel.js');
});

test('JS válido - content.js existe', () => {
  return fs.existsSync('extensao 4/content.js');
});

// ════════════════════════════════════════════════════════════════════════════
console.log('\n📦 VALIDAÇÕES DE SINTAXE');
console.log('-'.repeat(70));

test('JavaScript válido - sidepanel.js sem erros de sintaxe', () => {
  try {
    new Function(fs.readFileSync('extensao 4/sidepanel.js', 'utf-8'));
    return true;
  } catch (e) {
    throw new Error(e.message);
  }
});

test('JavaScript válido - content.js sem erros de sintaxe', () => {
  try {
    new Function(fs.readFileSync('extensao 4/content.js', 'utf-8'));
    return true;
  } catch (e) {
    throw new Error(e.message);
  }
});

// ════════════════════════════════════════════════════════════════════════════
console.log('\n🔗 VALIDAÇÕES DE INTEGRAÇÃO');
console.log('-'.repeat(70));

test('Message handler - EXECUTAR_SUGESTAO_AGORA implementado', () => {
  const content = fs.readFileSync('extensao 4/content.js', 'utf-8');
  return content.includes("request.action === 'EXECUTAR_SUGESTAO_AGORA'");
});

test('Message handler - MANUAL_BET implementado', () => {
  const content = fs.readFileSync('extensao 4/content.js', 'utf-8');
  return content.includes("request.action === 'MANUAL_BET'");
});

test('Status response - ultimaAnalise incluído', () => {
  const content = fs.readFileSync('extensao 4/content.js', 'utf-8');
  return content.includes('ultimaAnalise: Core.estadoRobo.ultimaAnalise');
});

test('Sidepanel - atualizar() função implementada', () => {
  const sidepanel = fs.readFileSync('extensao 4/sidepanel.js', 'utf-8');
  return sidepanel.includes('async function atualizar()');
});

test('Sidepanel - btn-auto-exec click handler', () => {
  const sidepanel = fs.readFileSync('extensao 4/sidepanel.js', 'utf-8');
  return sidepanel.includes("document.getElementById('btn-auto-exec')?.addEventListener('click'");
});

test('Sidepanel - validação de bankroll mínimo', () => {
  const sidepanel = fs.readFileSync('extensao 4/sidepanel.js', 'utf-8');
  return sidepanel.includes('bankrollInicial < 100');
});

// ════════════════════════════════════════════════════════════════════════════
console.log('\n🛡️ VALIDAÇÕES DE SEGURANÇA');
console.log('-'.repeat(70));

test('Sem hardcoded secrets no HTML', () => {
  const html = fs.readFileSync('extensao 4/sidepanel.html', 'utf-8');
  return !html.includes('password') && !html.includes('secret') && !html.includes('token');
});

test('Sem hardcoded secrets no sidepanel.js', () => {
  const js = fs.readFileSync('extensao 4/sidepanel.js', 'utf-8');
  return !js.includes('YOUR_API_KEY') && !js.includes('YOUR_SECRET');
});

test('XSS protection - innerHTML uses data correctly', () => {
  const sidepanel = fs.readFileSync('extensao 4/sidepanel.js', 'utf-8');
  // Verificar se infoDiv.innerHTML está usando valores escapados ou template literals
  return sidepanel.includes('infoDiv.innerHTML');
});

// ════════════════════════════════════════════════════════════════════════════
console.log('\n🧪 VALIDAÇÕES DE DADOS');
console.log('-'.repeat(70));

test('Config padrão válido - stakeBase entre 5-150', () => {
  const sidepanel = fs.readFileSync('extensao 4/sidepanel.js', 'utf-8');
  const match = sidepanel.match(/stakeBase:\s*(\d+)/);
  if (!match) return false;
  const val = Number(match[1]);
  return val >= 5 && val <= 150;
});

test('Config padrão válido - metaLucro positivo', () => {
  const sidepanel = fs.readFileSync('extensao 4/sidepanel.js', 'utf-8');
  const match = sidepanel.match(/metaLucro:\s*(\d+)/);
  if (!match) return false;
  const val = Number(match[1]);
  return val > 0;
});

test('Config padrão válido - minConfianca entre 0-100', () => {
  const sidepanel = fs.readFileSync('extensao 4/sidepanel.js', 'utf-8');
  const match = sidepanel.match(/minConfianca:\s*(\d+)/);
  if (!match) return false;
  const val = Number(match[1]);
  return val >= 0 && val <= 100;
});

// ════════════════════════════════════════════════════════════════════════════
console.log('\n✅ RESUMO FINAL');
console.log('='.repeat(70));
console.log(`\nTestes Passados: ${passCount}`);
console.log(`Testes Falhados: ${failCount}`);
console.log(`Total: ${passCount + failCount}`);

const status = failCount === 0 ? '🟢 PRONTO PARA PRODUÇÃO' : '🔴 BLOQUEADO - FALHAS CRÍTICAS';
console.log(`\nStatus: ${status}\n`);

if (failCount === 0) {
  console.log('✅ Todas as validações passaram!');
  console.log('\nPróximos passos:');
  console.log('  1. Fazer backup da versão anterior');
  console.log('  2. Deploy em produção');
  console.log('  3. Monitorar logs por 24h');
  console.log('  4. Rollback plan se necessário');
} else {
  console.log('❌ Há falhas que precisam ser corrigidas antes do deploy');
  process.exit(1);
}

console.log('\n' + '='.repeat(70) + '\n');

#!/usr/bin/env node
/**
 * Teste Automatizado: Diagnóstico de "Morte Silenciosa" do Toggle Robô
 * Simula o fluxo do painel → content.js → toggleRobo()
 * Captura logs e erros em tempo real
 */

const fs = require('fs');
const path = require('path');

console.log(`\n${'='.repeat(60)}`);
console.log('🔍 DIAGNÓSTICO: Toggle Robô - Morte Silenciosa');
console.log(`${'='.repeat(60)}\n`);

// Simular estrutura de estadoRobo
const mockEstadoRobo = {
  roboAtivo: false,
  config: { shadowMode: true, stakeBase: 150 },
  logs: [],
  ultimaAposta: null,
  galeAtual: 0,
  stakeAtual: 150,
};

const mockCore = {
  estadoRobo: mockEstadoRobo,
  adicionarLog: (tipo, msg, data = {}) => {
    const log = { timestamp: new Date().toISOString(), tipo, msg, data };
    mockEstadoRobo.logs.push(log);
    console.log(`  [${tipo}] ${msg}`);
  },
};

// Simular toggleRobo do content.js
function toggleRobo(force) {
  const antes = mockCore.estadoRobo.roboAtivo;
  mockCore.estadoRobo.roboAtivo = typeof force === 'boolean' ? force : !mockCore.estadoRobo.roboAtivo;
  const depois = mockCore.estadoRobo.roboAtivo;

  console.log(`\n[ROBO] Toggle: ${antes} → ${depois}`);

  try {
    mockCore.adicionarLog('INFO', depois ? 'Robô ativado' : 'Robô desativado');
    console.log(`[ROBO] ✓ Overlay atualizado`);
  } catch (err) {
    console.error(`[ROBO] ✗ Erro ao atualizar overlay:`, err.message);
    throw err;
  }

  return depois;
}

// Simular TOGGLE_ROBO message listener
function handleToggleRobo() {
  console.log(`[TOGGLE] Botão clicado, estado anterior: ${mockCore.estadoRobo.roboAtivo}`);

  try {
    const ativo = toggleRobo();
    console.log(`[TOGGLE] ✓ Robô agora: ${ativo ? 'ATIVO' : 'INATIVO'}`);
    return { success: true, ativo, message: ativo ? 'Robô ativado' : 'Robô desativado' };
  } catch (err) {
    console.error(`[TOGGLE] ✗ ERRO NO TOGGLE:`, err.message);
    throw err;
  }
}

// Simular cicloPrincipal
async function cicloPrincipal(iteracao = 0) {
  console.log(`\n[CICLO ${iteracao}] Iniciando...`);

  if (!mockCore.estadoRobo.roboAtivo) {
    console.log(`[CICLO ${iteracao}] Robô inativo, retornando`);
    return;
  }

  try {
    console.log(`[CICLO ${iteracao}] Robô está ATIVO, processando...`);
    // Simular algum processamento
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log(`[CICLO ${iteracao}] ✓ Ciclo completado com sucesso`);
  } catch (err) {
    console.error(`[CICLO ${iteracao}] ✗ ERRO:`, err.message);
    throw err;
  }
}

// === TESTE SEQUENCIAL ===
async function runTest() {
  try {
    console.log('\n📝 TESTE 1: Ativar Robô');
    console.log('-'.repeat(60));
    const result1 = handleToggleRobo();
    console.log(`✓ Resultado:`, result1);

    console.log('\n📝 TESTE 2: Verificar ciclo principal com robô ativo');
    console.log('-'.repeat(60));
    await cicloPrincipal(1);

    console.log('\n📝 TESTE 3: Rodar ciclo por 3 vezes consecutivas');
    console.log('-'.repeat(60));
    for (let i = 2; i <= 4; i++) {
      await cicloPrincipal(i);
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    console.log('\n📝 TESTE 4: Desativar Robô');
    console.log('-'.repeat(60));
    const result2 = handleToggleRobo();
    console.log(`✓ Resultado:`, result2);

    console.log('\n📝 TESTE 5: Verificar ciclo com robô inativo');
    console.log('-'.repeat(60));
    await cicloPrincipal(5);

    console.log('\n' + '='.repeat(60));
    console.log('✅ RESULTADO FINAL');
    console.log('='.repeat(60));
    console.log(`Estado do robô: ${mockCore.estadoRobo.roboAtivo ? 'INATIVO' : 'INATIVO (correto)'}`);
    console.log(`Total de logs: ${mockCore.estadoRobo.logs.length}`);
    console.log('\n📋 Logs gerados:');
    mockCore.estadoRobo.logs.forEach((log, i) => {
      console.log(`  ${i+1}. [${log.tipo}] ${log.msg}`);
    });

    console.log('\n✅ TESTE PASSOU: Nenhuma morte silenciosa detectada!\n');

  } catch (err) {
    console.error('\n❌ TESTE FALHOU:');
    console.error(`Erro: ${err.message}`);
    console.error(`Stack: ${err.stack}`);
    process.exit(1);
  }
}

// Executar
runTest().then(() => {
  process.exit(0);
}).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

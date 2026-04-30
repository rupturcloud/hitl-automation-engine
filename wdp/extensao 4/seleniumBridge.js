// seleniumBridge.js — Bridge entre extensão e selenium_driver.py
// Delega cliques de aposta para Python via WebSocket (isTrusted: true via CDP)
// AGUARDANDO TESTE: Este arquivo está pronto mas desativado
// Para ativar, integre em manifest.json e habilite em realizarAposta.js

(function () {
  'use strict';

  const SELENIUM_TIMEOUT = 8000; // 8 segundos para resposta do Selenium
  const WS_RECONNECT_INTERVAL = 3000; // 3 segundos entre tentativas

  let wsConnected = false;
  let wsPendingResponses = new Map();

  // Verificar se WebSocket já está disponível (injetado por ws-bridge.js)
  function aguardarWebSocket(timeout = 5000) {
    return new Promise((resolve) => {
      const checkInterval = 100;
      let elapsed = 0;

      const checker = setInterval(() => {
        elapsed += checkInterval;

        // Verificar window.__WILL_DADOS_WS (postMessage bridge)
        if (window.__WILL_DADOS_WS) {
          clearInterval(checker);
          resolve(true);
          return;
        }

        if (elapsed >= timeout) {
          clearInterval(checker);
          console.warn('[SELENIUM-BRIDGE] WebSocket bridge não disponível após timeout');
          resolve(false);
        }
      }, checkInterval);
    });
  }

  // Enviar comando para selenium_driver.py via WebSocket
  function enviarParaSelenium(cmd) {
    if (!window.__WILL_DADOS_WS) {
      return Promise.reject(new Error('WebSocket bridge não está disponível'));
    }

    return new Promise((resolve, reject) => {
      const responseId = `selenium_${Date.now()}_${Math.random().toString(16).slice(2)}`;
      const timeout = setTimeout(() => {
        wsPendingResponses.delete(responseId);
        reject(new Error(`Timeout aguardando resposta do Selenium (${SELENIUM_TIMEOUT}ms)`));
      }, SELENIUM_TIMEOUT);

      wsPendingResponses.set(responseId, (response) => {
        clearTimeout(timeout);
        resolve(response);
      });

      window.__WILL_DADOS_WS({
        type: 'PERFORM_BET',
        id: responseId,
        acao: cmd.acao,
        stake: cmd.stake,
        options: cmd.options || {}
      });
    });
  }

  // Listener para respostas do Selenium
  window.addEventListener('message', (event) => {
    if (!event.data || event.data.type !== 'BET_RESULT') return;

    const { id, ok, motivo } = event.data;
    const callback = wsPendingResponses.get(id);

    if (callback) {
      callback({ ok, motivo });
      wsPendingResponses.delete(id);
    }
  });

  // Wrapper de realizarAposta que tenta Selenium primeiro, fallback para dispatchEvent
  async function realizarApostaComSelenium(acao, stake, options = {}) {
    if (!['P', 'B', 'T'].includes(acao)) {
      return { ok: false, motivo: 'Ação inválida' };
    }

    console.log(`[SELENIUM-BRIDGE] Tentando aposta via Selenium: ${acao} R$${stake}`);

    try {
      // Tentar usar Selenium se disponível
      const result = await enviarParaSelenium({
        acao,
        stake,
        options
      });

      if (result.ok) {
        console.log(`[SELENIUM-BRIDGE] ✓ Aposta bem-sucedida: ${result.motivo}`);
        return result;
      } else {
        console.warn(`[SELENIUM-BRIDGE] Aposta falhou: ${result.motivo}`);
        // Cair para fallback
      }
    } catch (e) {
      console.warn(`[SELENIUM-BRIDGE] Erro ao chamar Selenium: ${e.message}`);
      // Cair para fallback
    }

    // FALLBACK: usar dispatchEvent (extensão 2 original)
    console.log('[SELENIUM-BRIDGE] Usando fallback: dispatchEvent');
    if (globalThis.WillDadosAposta && globalThis.WillDadosAposta.realizarAposta) {
      return globalThis.WillDadosAposta.realizarAposta(acao, stake, options);
    }

    return { ok: false, motivo: 'Nenhum método de aposta disponível' };
  }

  // Inicializar: aguardar WebSocket e substituir realizarAposta
  async function inicializar() {
    console.log('[SELENIUM-BRIDGE] Inicializando...');

    // Aguardar WebSocket estar disponível
    const wsReady = await aguardarWebSocket(5000);

    if (!wsReady) {
      console.warn('[SELENIUM-BRIDGE] WebSocket não está disponível, usando dispatchEvent');
      return;
    }

    console.log('[SELENIUM-BRIDGE] ✓ WebSocket disponível, redirecionando cliques para Selenium');

    // Sobrescrever realizarAposta para usar Selenium
    const originalRealizarAposta = globalThis.WillDadosAposta?.realizarAposta;

    if (!originalRealizarAposta) {
      console.error('[SELENIUM-BRIDGE] realizarAposta não encontrado');
      return;
    }

    // Criar versão com fallback
    globalThis.WillDadosAposta.realizarAposta = async function(acao, stake, options = {}) {
      return realizarApostaComSelenium(acao, stake, options);
    };

    globalThis.WillDadosAposta.realizarApostaOriginal = originalRealizarAposta;
    globalThis.WillDadosAposta.usandoSelenium = true;

    console.log('[SELENIUM-BRIDGE] ✓ Inicializado com sucesso');
  }

  // Função para verificar status
  window.WillDadosBridgeStatus = function() {
    return {
      wsAvailable: !!window.__WILL_DADOS_WS,
      seleniumEnabled: globalThis.WillDadosAposta?.usandoSelenium || false,
      pendingResponses: wsPendingResponses.size
    };
  };

  // Inicializar se estamos em contexto de jogo
  if (document.location.href.includes('evolutiongaming') ||
      document.location.href.includes('evo-games') ||
      document.location.href.includes('betboom')) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', inicializar);
    } else {
      inicializar();
    }
  }

  console.log('[SELENIUM-BRIDGE] Módulo carregado (aguardando ativação)');
})();

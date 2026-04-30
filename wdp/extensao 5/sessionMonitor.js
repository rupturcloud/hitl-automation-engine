// sessionMonitor.js — Monitora saúde da sessão em tempo real
// Detecta Session Expiry, desconexões e inconsistências

(function () {
  'use strict';

  const SESSION_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutos sem atividade = sessão morreu
  const CHECK_INTERVAL_MS = 2000; // Checar a cada 2 segundos

  let sessionState = {
    isAlive: true,
    lastUpdate: Date.now(),
    lastResult: null,
    bettingOpen: null,
    countdown: null,
    balance: null,
    detailedStatus: 'INITIALIZING',
    warnings: [],
    error: null
  };

  const STATUS = {
    INITIALIZING: 'INITIALIZING',
    BETTING: 'BETTING',
    RESULT: 'RESULT',
    SYNCING: 'SYNCING',
    SESSION_EXPIRED: 'SESSION_EXPIRED',
    CONNECTION_LOST: 'CONNECTION_LOST',
    ERROR: 'ERROR'
  };

  // ─── Detecção de Sessão Viva ───────────────────────────────────────────────────

  function detectSessionExpiry() {
    // Sinais de que sessão expirou:

    // 1. Página redireciona para login
    if (document.title?.toLowerCase().includes('login') ||
        document.location.href?.toLowerCase().includes('login')) {
      return { expired: true, reason: 'Login page detected' };
    }

    // 2. Modal de "Your session has expired"
    const expiredModal = document.querySelector('[class*="session"][class*="expired" i], [class*="expired"][class*="session" i]');
    if (expiredModal?.offsetParent) {
      return { expired: true, reason: 'Session expired modal visible' };
    }

    // 3. Nenhum elemento do jogo visível
    const gameElements = document.querySelectorAll('[class*="table"], [class*="game"], [class*="betting"], iframe');
    const visibleGame = Array.from(gameElements).some(el => el.offsetParent !== null);
    if (!visibleGame) {
      return { expired: true, reason: 'No game elements visible' };
    }

    // Balance é opcional - pode estar em lugares diferentes por plataforma
    // Não marca como expirado só porque não achou balance

    return { expired: false };
  }

  function detectBettingStatus() {
    // Procura por indicadores de "betting open"
    const timerText = document.querySelector('[class*="timer"], [class*="countdown"]')?.textContent;
    const timerMs = parseInt(timerText) || null;

    if (timerMs && timerMs > 0) {
      return { status: STATUS.BETTING, countdown: timerMs };
    }

    // Se não há timer, pode estar em resultado
    const resultText = document.querySelector('[class*="result"], [class*="winner"]')?.textContent;
    if (resultText?.toLowerCase().includes('player') ||
        resultText?.toLowerCase().includes('banker') ||
        resultText?.toLowerCase().includes('tie')) {
      return { status: STATUS.RESULT, lastResult: resultText.substring(0, 50) };
    }

    return { status: STATUS.SYNCING };
  }

  function detectBalance() {
    // Tentar primeiro com calibração (se chipCalibrator já detectou)
    let balanceEl = null;

    // Seletores em cascata (por ordem de especificidade)
    const selectors = [
      '[class*="balance"]',
      '[class*="wallet"]',
      '[class*="saldo"]',
      '[class*="account"]',
      '[class*="funds"]',
      '[class*="credit"]',
      '[data-role*="balance"]',
      '[aria-label*="balance" i]',
      '[aria-label*="saldo" i]',
      '[aria-label*="account" i]',
      // Betboom específico
      '[class*="AccountBalance"]',
      '[class*="account-balance"]',
      '[class*="player-balance"]'
    ];

    for (const sel of selectors) {
      const els = document.querySelectorAll(sel);
      for (const el of els) {
        if (el.offsetParent && el.textContent?.trim()) { // Visível e com conteúdo
          balanceEl = el;
          break;
        }
      }
      if (balanceEl) break;
    }

    if (!balanceEl) {
      // Fallback: buscar por regex no texto visível
      const bodyText = document.body.innerText || '';
      const match = bodyText.match(/R\$\s*([\d.,]+)/);
      if (match) {
        const raw = match[1].replace(/[.,]/g, '');
        return parseFloat(raw) || null;
      }
      return null;
    }

    const text = balanceEl.textContent || '';
    const match = text.match(/[\d.,]+/);
    if (match) {
      const raw = match[0].replace(/[.,]/g, '');
      return parseFloat(raw) || null;
    }
    return null;
  }

  function updateSessionState() {
    try {
      const expiry = detectSessionExpiry();
      const betting = detectBettingStatus();
      const balance = detectBalance();

      // Atualizar estado
      sessionState.isAlive = !expiry.expired;
      sessionState.lastUpdate = Date.now();
      sessionState.bettingOpen = betting.status === STATUS.BETTING;
      sessionState.countdown = betting.countdown;
      sessionState.lastResult = betting.lastResult;
      sessionState.balance = balance;
      sessionState.detailedStatus = betting.status;
      sessionState.error = expiry.reason;

      // Validar consistência
      validateSessionConsistency();

    } catch (e) {
      console.warn('[SESSION-MONITOR] Erro ao atualizar estado:', e.message);
      sessionState.error = e.message;
    }
  }

  function validateSessionConsistency() {
    sessionState.warnings = [];

    // Warning 1: Timeout sem atualizações
    const timeSinceUpdate = Date.now() - sessionState.lastUpdate;
    if (timeSinceUpdate > SESSION_TIMEOUT_MS) {
      sessionState.warnings.push('No updates received for 5 minutes');
      sessionState.isAlive = false;
    }

    // Warning 2: Balance mudou drasticamente
    if (sessionState.balance !== null && sessionState.previousBalance !== null) {
      const change = Math.abs(sessionState.balance - (sessionState.previousBalance || 0));
      if (change > sessionState.previousBalance * 0.5 && change > 100) {
        sessionState.warnings.push(`Balance changed drastically: ${change}`);
      }
    }
    sessionState.previousBalance = sessionState.balance;

    // Warning 3: Timing inconsistente
    if (sessionState.countdown === 0 && sessionState.bettingOpen === true) {
      sessionState.warnings.push('Countdown is 0 but betting still open (timing sync issue)');
    }
  }

  // ─── API Pública ──────────────────────────────────────────────────────────────

  function getStatus() {
    return {
      isAlive: sessionState.isAlive,
      status: sessionState.detailedStatus,
      countdown: sessionState.countdown,
      balance: sessionState.balance,
      bettingOpen: sessionState.bettingOpen,
      warnings: sessionState.warnings,
      error: sessionState.error,
      lastUpdate: new Date(sessionState.lastUpdate).toLocaleTimeString(),
      canBet: sessionState.isAlive && sessionState.bettingOpen
    };
  }

  function assertSessionAlive() {
    if (!sessionState.isAlive) {
      throw new Error(`Session not alive: ${sessionState.error || 'Unknown reason'}`);
    }
    if (sessionState.warnings.length > 0) {
      console.warn('[SESSION-MONITOR] Warnings:', sessionState.warnings);
    }
  }

  function reset() {
    sessionState = {
      isAlive: true,
      lastUpdate: Date.now(),
      lastResult: null,
      bettingOpen: null,
      countdown: null,
      balance: null,
      detailedStatus: 'INITIALIZING',
      warnings: [],
      error: null
    };
    console.log('[SESSION-MONITOR] Estado resetado');
  }

  // ─── Monitoramento Contínuo ───────────────────────────────────────────────────

  let monitorInterval = null;

  function startMonitoring() {
    if (monitorInterval) {
      console.log('[SESSION-MONITOR] Monitoramento já ativo');
      return;
    }

    console.log('[SESSION-MONITOR] Iniciando monitoramento');
    updateSessionState(); // Primeira atualização imediata

    monitorInterval = setInterval(() => {
      updateSessionState();

      // Log periodicamente
      if (Date.now() % 10000 < 2000) { // A cada ~10 segundos
        const status = getStatus();
        if (!status.isAlive) {
          console.warn('[SESSION-MONITOR] ⚠️ Sessão morreu:', status.error);
        } else if (status.warnings.length > 0) {
          console.warn('[SESSION-MONITOR] ⚠️ Warnings:', status.warnings);
        }
      }
    }, CHECK_INTERVAL_MS);
  }

  function stopMonitoring() {
    if (monitorInterval) {
      clearInterval(monitorInterval);
      monitorInterval = null;
      console.log('[SESSION-MONITOR] Monitoramento parado');
    }
  }

  // ─── Integração com realizarAposta ────────────────────────────────────────────

  // Hook: antes de qualquer aposta, verificar se sessão está viva
  const originalRealizarAposta = globalThis.WillDadosAposta?.realizarAposta;

  if (originalRealizarAposta) {
    globalThis.WillDadosAposta.realizarAposta = async function(acao, stake, options = {}) {
      try {
        assertSessionAlive();
      } catch (e) {
        console.error('[SESSION-MONITOR] Bloqueando aposta:', e.message);
        return {
          ok: false,
          motivo: `Session não está viva: ${e.message}`
        };
      }

      return originalRealizarAposta.call(this, acao, stake, options);
    };
  }

  // ─── Inicialização ────────────────────────────────────────────────────────────

  // Iniciar monitoramento quando documento estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startMonitoring);
  } else {
    startMonitoring();
  }

  // Exportar API
  globalThis.WDPSessionMonitor = {
    getStatus,
    assertSessionAlive,
    startMonitoring,
    stopMonitoring,
    reset,
    // Debug
    _internalState: () => sessionState
  };

  console.log('[SESSION-MONITOR] Módulo carregado. Use WDPSessionMonitor.getStatus()');
})();

// modules/content/ws-interceptor-isolated.js
// RODANDO NO MUNDO: ISOLATED (Contexto da Extensão)
// Responsabilidade: Receber dados do mundo MAIN, normalizar e atualizar o estado.

(function () {
  'use strict';

  window.__BETIA.state.wsEndpoints = window.__BETIA.state.wsEndpoints || [];

  window.addEventListener('message', (event) => {
    if (event.source !== window) return;

    if (event.data?.type === '__BETIA_WS_OPEN__') {
      const url = String(event.data.url || '');
      if (url && !window.__BETIA.state.wsEndpoints.includes(url)) {
        window.__BETIA.state.wsEndpoints = [...window.__BETIA.state.wsEndpoints, url].slice(-12);
      }
      return;
    }

    if (event.data?.type !== '__BETIA_WS_DATA__') return;

    const payload = event.data.payload;

    // Usa o platform-detector para normalizar se disponível, 
    // senão usa um fallback genérico aqui mesmo.
    let normalized = null;
    if (window.__BETIA.platformDetector?.normalizeWs) {
      normalized = window.__BETIA.platformDetector.normalizeWs(payload);
    } else {
      normalized = fallbackNormalize(payload);
    }

    if (normalized) {
      const nextState = mergeWsData(window.__BETIA.state.wsData, {
        ...normalized,
        source: 'ws',
        wsUrl: event.data.url || null,
        ts: Date.now(),
      });
      window.__BETIA.state.wsData = nextState;
      window.__BETIA.onNewSource?.('ws');
    }
  });

  function wsBalanceSourceRank(source) {
    const normalized = String(source || '').toLowerCase();
    if (/ws:official|balanceupdated|accountbalance\.getmy/.test(normalized)) return 100;
    if (normalized === 'ws:generic') return 20;
    return normalized ? 10 : 0;
  }

  function mergeWsData(previous, incoming) {
    if (!previous) return incoming;

    const merged = {
      ...previous,
      ...incoming,
    };

    if (
      wsBalanceSourceRank(previous.balanceSource) > wsBalanceSourceRank(incoming.balanceSource) &&
      Number.isFinite(previous.balance)
    ) {
      merged.balance = previous.balance;
      merged.balanceRaw = previous.balanceRaw ?? incoming.balanceRaw ?? null;
      merged.balanceSource = previous.balanceSource ?? incoming.balanceSource ?? null;
    }

    if ((!Array.isArray(incoming.history) || incoming.history.length === 0) && Array.isArray(previous.history)) {
      merged.history = previous.history;
    }

    if ((incoming.countdown === null || incoming.countdown === undefined) && previous.countdown !== undefined) {
      merged.countdown = previous.countdown;
    }

    if (!incoming.result && previous.result) {
      merged.result = previous.result;
    }

    return merged;
  }

  function deepPick(obj, keys, depth = 0) {
    if (!obj || depth > 6) return null;
    if (Array.isArray(obj)) {
      for (const item of obj) {
        const found = deepPick(item, keys, depth + 1);
        if (found !== null && found !== undefined) return found;
      }
      return null;
    }
    if (typeof obj !== 'object') return null;
    for (const key of keys) {
      if (obj[key] !== undefined && obj[key] !== null) return obj[key];
    }
    for (const value of Object.values(obj)) {
      const found = deepPick(value, keys, depth + 1);
      if (found !== null && found !== undefined) return found;
    }
    return null;
  }

  function parseNumber(value) {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string') {
      const match = value.replace(/\s/g, '').match(/-?[\d.,]+/);
      if (!match) return null;
      const parsed = parseLocalizedNumber(match[0]);
      return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
  }

  function parseLocalizedNumber(raw) {
    const text = String(raw || '').replace(/[^\d,.-]/g, '');
    if (!text) return null;

    const lastComma = text.lastIndexOf(',');
    const lastDot = text.lastIndexOf('.');
    let normalized = text;

    if (lastComma >= 0 && lastDot >= 0) {
      const decimalSep = lastComma > lastDot ? ',' : '.';
      const thousandSep = decimalSep === ',' ? '.' : ',';
      normalized = text
        .replace(new RegExp(`\\${thousandSep}`, 'g'), '')
        .replace(decimalSep, '.');
    } else if (lastComma >= 0) {
      const decimals = text.length - lastComma - 1;
      normalized = decimals > 0 && decimals <= 2 ? text.replace(',', '.') : text.replace(/,/g, '');
    } else if (lastDot >= 0) {
      const decimals = text.length - lastDot - 1;
      normalized = decimals > 0 && decimals <= 2 ? text : text.replace(/\./g, '');
    }

    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function normalizeHistory(rawHistory) {
    if (!rawHistory) return [];
    const source = Array.isArray(rawHistory)
      ? rawHistory
      : Array.isArray(rawHistory.items)
        ? rawHistory.items
        : Array.isArray(rawHistory.results)
          ? rawHistory.results
          : [];
    return source.map((item) => window.__BETIA.normalizeResult?.(item)).filter(Boolean).slice(0, 156);
  }

  function fallbackNormalize(raw) {
    const countdown = deepPick(raw, ['countdown', 'timer', 'timeLeft', 'remainingTime', 'timeToClose']);
    const balance   = deepPick(raw, ['balance', 'credits', 'wallet', 'accountBalance']);
    const result    = deepPick(raw, ['result', 'winner', 'outcome', 'lastResult', 'winnerSide', 'gameResult']);
    const history   = normalizeHistory(deepPick(raw, ['history', 'results', 'rounds', 'road', 'roadmap', 'pastResults']));

    if (countdown === null && balance === null && result === null && history.length === 0) return null;

    return {
      countdown: countdown !== null ? parseNumber(countdown) : null,
      balance:   balance   !== null ? parseNumber(balance)   : null,
      balanceRaw: typeof balance === 'string' ? balance : balance !== null && balance !== undefined ? String(balance) : null,
      balanceSource: balance !== null ? 'ws:generic' : null,
      result:    window.__BETIA.normalizeResult?.(result) ?? history[0] ?? null,
      history,
    };
  }

  console.log('[Bet IA WS-Isolated] Receptor pronto no mundo ISOLATED.');
})();

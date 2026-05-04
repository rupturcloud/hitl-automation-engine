// modules/content/data-fusion.js
// Responsabilidade: fundir dados de múltiplas fontes por prioridade.
// Prioridade operacional: Viewer/DOM > Vision > WebSocket.
// O WebSocket complementa/valida; a identificação começa pelo histórico visual.
// Contrato canônico de saída:
// - `history`
// - `timer`
// - `countdown`
// - `lastResult`
// - `result`
// - `balance`
// - `status`
// - `sources`
// - `freshnessMs`
// - `ts`

(function () {
  'use strict';

  window.__BETIA.normalizeResult = function (raw) {
    if (!raw) return null;
    if (typeof raw === 'object') {
      return window.__BETIA.normalizeResult(
        raw.result ??
          raw.winner ??
          raw.winnerSide ??
          raw.outcome ??
          raw.gameResult ??
          raw.side ??
          raw.value ??
          raw.code ??
          raw.name,
      );
    }
    const r = String(raw).toUpperCase().trim();
    if (r.includes('PLAYER') || r === 'P' || r.includes('JOGADOR')) return 'PLAYER';
    if (r.includes('BANKER') || r === 'B' || r.includes('BANCA')) return 'BANKER';
    if (r.includes('TIE') || r === 'T' || r.includes('EMPATE')) return 'TIE';
    return null;
  };

  function deriveStatus(timerValue, result) {
    const parsedTimer =
      typeof timerValue === 'number' ? timerValue : Number.parseFloat(String(timerValue ?? ''));

    if (Number.isFinite(parsedTimer) && parsedTimer > 0) {
      return 'BETTING';
    }

    if (result) {
      return 'RESULT';
    }

    return 'SYNCING';
  }

  function normalizeHistory(rawHistory) {
    if (!Array.isArray(rawHistory)) return [];
    return rawHistory
      .map((entry) => window.__BETIA.normalizeResult(entry))
      .filter(Boolean)
      .slice(0, 156);
  }

  function isFiniteBalance(value) {
    return typeof value === 'number' && Number.isFinite(value) && value >= 0;
  }

  function isTrustedWsBalance(balanceSource) {
    const normalized = String(balanceSource || '').toLowerCase();
    return /ws:official|balanceupdated|accountbalance\.getmy/.test(normalized);
  }

  function pickBalance(dom, vision, ws) {
    if (dom && isFiniteBalance(dom.balance)) {
      return {
        balance: dom.balance,
        balanceRaw: dom.balanceRaw ?? null,
        balanceSource: dom.balanceSource ?? 'viewer',
      };
    }

    if (vision && isFiniteBalance(vision.balance)) {
      return {
        balance: vision.balance,
        balanceRaw: vision.balanceRaw ?? null,
        balanceSource: vision.balanceSource ?? 'vision',
      };
    }

    if (ws && isFiniteBalance(ws.balance) && isTrustedWsBalance(ws.balanceSource)) {
      return {
        balance: ws.balance,
        balanceRaw: ws.balanceRaw ?? null,
        balanceSource: ws.balanceSource ?? 'ws',
      };
    }

    const fallback = [dom, vision, ws].find((entry) => entry && isFiniteBalance(entry.balance));
    if (!fallback) {
      return {
        balance: null,
        balanceRaw: null,
        balanceSource: null,
      };
    }

    return {
      balance: fallback.balance,
      balanceRaw: fallback.balanceRaw ?? null,
      balanceSource: fallback.balanceSource ?? null,
    };
  }

  function getPlatformSnapshot() {
    const platform = window.__BETIA.platform || null;
    return {
      platform: platform?.name || platform?.id || null,
      platformId: platform?.id || null,
      platformName: platform?.name || null,
      detectionReason: platform?.detectionReason || null,
      behaviorProfile: platform?.behaviorProfile || null,
    };
  }

  function buildSyncPayload() {
    const ws = window.__BETIA.state.wsData;
    const dom = window.__BETIA.state.domData;
    const vision = window.__BETIA.state.visionData;

    // Seleciona a MELHOR fonte de histórico (não concatena, evita duplicatas).
    // Prioridade: WS fresco (< 30s) > DOM > Vision > WS stale.
    const domHistory    = normalizeHistory(dom?.history);
    const visionHistory = normalizeHistory(vision?.history);
    const wsHistory     = normalizeHistory(ws?.history);
    const wsIsFresh     = ws?.ts && (Date.now() - ws.ts) < 30000;

    let history;
    if (wsIsFresh && wsHistory.length >= domHistory.length && wsHistory.length >= visionHistory.length) {
      history = wsHistory;
    } else if (domHistory.length >= visionHistory.length) {
      history = domHistory;
    } else if (visionHistory.length > 0) {
      history = visionHistory;
    } else {
      history = wsHistory.length > 0 ? wsHistory : domHistory;
    }
    const countdown = dom?.countdown ?? vision?.countdown ?? ws?.countdown ?? null;
    const balanceSnapshot = pickBalance(dom, vision, ws);
    const balance = balanceSnapshot.balance;
    const balanceRaw = balanceSnapshot.balanceRaw;
    const balanceSource = balanceSnapshot.balanceSource;
    const result = dom?.result ?? vision?.result ?? ws?.result ?? history[0] ?? null;
    const ts = Date.now();
    const sources = [
      dom ? 'viewer' : null,
      vision ? 'vision' : null,
      ws ? 'ws' : null,
    ].filter(Boolean);

    if (history.length === 0 && countdown === null && balance === null && !result) {
      return null;
    }

    return {
      history,
      timer: countdown,
      countdown,
      lastResult: result,
      result,
      balance,
      balanceRaw,
      balanceSource,
      status: deriveStatus(countdown, result),
      isSyncing: true,
      ...getPlatformSnapshot(),
      wsEndpoints: Array.isArray(window.__BETIA.state.wsEndpoints)
        ? window.__BETIA.state.wsEndpoints.slice(-12)
        : [],
      sources,
      freshnessMs: 0,
      ts,
    };
  }

  function publishSyncPayload(payload) {
    window.__BETIA.state.fusedData = payload;
    window.__BETIA.state.lastFusedAt = payload.ts;
    window.__BETIA.getSyncPayload = function () {
      return {
        ...payload,
        freshnessMs: Math.max(0, Date.now() - payload.ts),
      };
    };

    try {
      chrome.runtime
        .sendMessage({
          type: 'GAME_DATA_UPDATE',
          data: payload,
        })
        .catch(() => {});
    } catch (_) {}
  }

  function fuse() {
    const payload = buildSyncPayload();
    if (!payload) return;
    publishSyncPayload(payload);
  }

  window.__BETIA.onNewSource = function () {
    if (window.__BETIA._fuseDebounce) clearTimeout(window.__BETIA._fuseDebounce);
    window.__BETIA._fuseDebounce = setTimeout(() => {
      fuse();
    }, 50);
  };

  console.log('[Bet IA Fusion] Módulo de fusão pronto.');
})();

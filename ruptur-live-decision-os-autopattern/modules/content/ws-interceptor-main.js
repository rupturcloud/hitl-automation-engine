// modules/content/ws-interceptor-main.js
// RODANDO NO MUNDO: MAIN (Contexto da Página)
// Responsabilidade: Interceptar instâncias de WebSocket antes que a página as use.

(function() {
  if (window.__BETIA_WS_INSTALLED) return;
  window.__BETIA_WS_INSTALLED = true;

  const _OriginalWS = window.WebSocket;

  // Termos relevantes — inclui padrões do BetBoom e da Evolution Gaming
  const RELEVANT_PATTERN = /history|result|winner|gameState|countdown|timer|balance|balanceUpdated|accountBalance|getMy|road|round|rounds|BacBo|bacbo|playerState|player|banker|tie|betsOpen|bettingOpen|timeToClose|beadPlate|roadmap|scoreboard|winnerSide|gameResult|tableId|dealerName/i;

  function parsePayload(raw) {
    if (typeof raw !== 'string') return null;
    try {
      return JSON.parse(raw);
    } catch (_) {
      return RELEVANT_PATTERN.test(raw) ? { __rawText: raw.slice(0, 4000) } : null;
    }
  }

  function containsRelevantSignal(value, depth = 0) {
    if (!value || depth > 6) return false;
    if (typeof value === 'string') return RELEVANT_PATTERN.test(value);
    if (Array.isArray(value)) {
      return value.some((item) => containsRelevantSignal(item, depth + 1));
    }
    if (typeof value === 'object') {
      return Object.entries(value).some(([key, item]) =>
        RELEVANT_PATTERN.test(key) || containsRelevantSignal(item, depth + 1),
      );
    }
    return false;
  }

  function BetIAWebSocket(url, protocols) {
    const ws = protocols
      ? new _OriginalWS(url, protocols)
      : new _OriginalWS(url);

    window.postMessage({
      type: '__BETIA_WS_OPEN__',
      url: String(url || ''),
      ts: Date.now()
    }, '*');

    ws.addEventListener('message', function(event) {
      try {
        const data = parsePayload(event.data);
        if (data && containsRelevantSignal(data)) {
          // Envia para o mundo ISOLATED via postMessage
          window.postMessage({
            type: '__BETIA_WS_DATA__',
            payload: data,
            url: String(url || ''),
            ts: Date.now()
          }, '*');
        }
      } catch (e) {
        // Ignora mensagens não-JSON
      }
    });

    return ws;
  }

  // Preserva propriedades estáticas
  BetIAWebSocket.CONNECTING = _OriginalWS.CONNECTING;
  BetIAWebSocket.OPEN       = _OriginalWS.OPEN;
  BetIAWebSocket.CLOSING    = _OriginalWS.CLOSING;
  BetIAWebSocket.CLOSED     = _OriginalWS.CLOSED;
  BetIAWebSocket.prototype  = _OriginalWS.prototype;

  window.WebSocket = BetIAWebSocket;
  console.log('[Bet IA WS-Main] Interceptor injetado no mundo MAIN.');
})();

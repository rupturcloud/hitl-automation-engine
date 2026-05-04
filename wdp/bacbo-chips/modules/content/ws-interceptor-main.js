// modules/content/ws-interceptor-main.js
// RODANDO NO MUNDO: MAIN (Contexto da Página)
// Responsabilidade: Interceptar instâncias de WebSocket antes que a página as use.
//
// UPGRADE v2: Usa Proxy no construtor e intercepta .send() para captura bidirecional.
// Baseado no ws-bridge.js da extensao 5 — mais resiliente e invisível.

(function () {
  'use strict';

  if (window.__BETIA_WS_INSTALLED) return;
  window.__BETIA_WS_INSTALLED = true;

  const _OriginalWS = window.WebSocket;

  // Termos relevantes — inclui padrões do BetBoom e da Evolution Gaming
  const RELEVANT_PATTERN =
    /history|result|winner|gameState|countdown|timer|balance|balanceUpdated|accountBalance|getMy|road|round|rounds|BacBo|bacbo|playerState|player|banker|tie|betsOpen|bettingOpen|timeToClose|beadPlate|roadmap|scoreboard|winnerSide|gameResult|tableId|dealerName/i;

  // Limita envios por segundo para não saturar o canal
  let lastPostTime = 0;
  const MIN_POST_INTERVAL_MS = 40;

  function throttledPost(msg) {
    const now = Date.now();
    if (now - lastPostTime < MIN_POST_INTERVAL_MS) return;
    lastPostTime = now;
    try { window.postMessage(msg, '*'); } catch (_) {}
  }

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
      return Object.entries(value).some(
        ([key, item]) => RELEVANT_PATTERN.test(key) || containsRelevantSignal(item, depth + 1),
      );
    }
    return false;
  }

  // ─── Proxy do Construtor WebSocket ────────────────────────────────────────
  const WebSocketProxy = new Proxy(_OriginalWS, {
    construct(Target, args) {
      const ws = new Target(...args);
      const url = String(args[0] || '');

      // Notifica nova conexão
      throttledPost({
        type: '__BETIA_WS_OPEN__',
        url,
        ts: Date.now(),
      });

      // Intercepta mensagens recebidas (servidor → cliente)
      ws.addEventListener('message', function (event) {
        try {
          const data = parsePayload(event.data);
          if (data && containsRelevantSignal(data)) {
            throttledPost({
              type: '__BETIA_WS_DATA__',
              payload: data,
              url,
              ts: Date.now(),
            });
          }
        } catch (_) {
          // Ignora mensagens não-JSON
        }
      });

      // Intercepta mensagens enviadas (cliente → servidor) via Proxy no .send()
      const originalSend = ws.send.bind(ws);
      ws.send = new Proxy(originalSend, {
        apply(target, thisArg, sendArgs) {
          try {
            const data = parsePayload(sendArgs[0]);
            if (data && containsRelevantSignal(data)) {
              throttledPost({
                type: '__BETIA_WS_SEND__',
                payload: data,
                url,
                ts: Date.now(),
              });
            }
          } catch (_) {}
          try {
            return Reflect.apply(target, thisArg, sendArgs);
          } catch (e) {
            // Engole o erro se o jogo tentar enviar em um socket fechado/conectando.
            // Evita que o erro apareça no console com a stack trace apontando para a extensão.
            return;
          }
      });

      // Monitora fechamento para diagnóstico
      ws.addEventListener('close', function (event) {
        throttledPost({
          type: '__BETIA_WS_CLOSE__',
          url,
          code: event.code,
          reason: event.reason || '',
          ts: Date.now(),
        });
      });

      return ws;
    },
  });

  // Preserva propriedades estáticas e prototype
  Object.defineProperty(WebSocketProxy, 'CONNECTING', { value: _OriginalWS.CONNECTING });
  Object.defineProperty(WebSocketProxy, 'OPEN', { value: _OriginalWS.OPEN });
  Object.defineProperty(WebSocketProxy, 'CLOSING', { value: _OriginalWS.CLOSING });
  Object.defineProperty(WebSocketProxy, 'CLOSED', { value: _OriginalWS.CLOSED });

  window.WebSocket = WebSocketProxy;
  console.log('[Bet IA WS-Main] Interceptor Proxy v2 injetado no mundo MAIN.');
})();

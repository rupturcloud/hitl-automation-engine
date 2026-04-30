// ws-bridge.js — Wrapper de WebSocket que intercepta mensagens do jogo Bac Bo.
// Executado no MAIN world (contexto da página) via manifest.json.
// Comunica com o content script via CustomEvent usando Proxy para não quebrar validações da Evolution.
(() => {
  if (window.__WILL_DADOS_WS_WRAPPED__) return;
  window.__WILL_DADOS_WS_WRAPPED__ = true;

  const WS_EVENT_TYPE = '__WILL_DADOS_WS_MESSAGE__';
  const OriginalWebSocket = window.WebSocket;

  window.WebSocket = new Proxy(OriginalWebSocket, {
    construct(target, args) {
      const ws = new target(...args);
      const urlText = String(args[0] || '');

      // Intercepta só websockets de jogo (pode customizar a regex)
      if (/bacbo|bac-bo|BacBo|evo-games/i.test(urlText)) {
        ws.addEventListener('message', (event) => {
          let payload = event.data;
          let kind = typeof payload;
          if (payload instanceof Blob) kind = 'blob';
          if (payload instanceof ArrayBuffer) kind = 'arraybuffer';
          if (typeof payload !== 'string') {
            try { payload = String(payload); } catch (_) { payload = ''; }
          }
          document.dispatchEvent(new CustomEvent(WS_EVENT_TYPE, {
            detail: { direction: 'received', url: urlText, kind, data: payload, ts: Date.now() }
          }));
        });

        // Proxy no send para não quebrar o construtor do protótipo
        const originalSend = ws.send;
        ws.send = function (data) {
          let payload = data;
          let kind = typeof payload;
          if (payload instanceof Blob) kind = 'blob';
          if (payload instanceof ArrayBuffer) kind = 'arraybuffer';
          if (typeof payload !== 'string') {
            try { payload = String(payload); } catch (_) { payload = ''; }
          }
          document.dispatchEvent(new CustomEvent(WS_EVENT_TYPE, {
            detail: { direction: 'sent', url: urlText, kind, data: payload, ts: Date.now() }
          }));
          return originalSend.apply(this, arguments);
        };
      }
      return ws;
    }
  });
})();

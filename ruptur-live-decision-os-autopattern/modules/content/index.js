// modules/content/index.js
// Entry point — wiring final.
// Conecta os módulos entre si. NÃO contém lógica própria.
// Se precisar mudar a ordem de inicialização: edite só aqui.

(function () {
  'use strict';

  let lastPlatformSignature = '';

  function isTopFrame() {
    try {
      return window.top === window;
    } catch (_) {
      return false;
    }
  }

  function publishPlatformReady(reason = 'boot') {
    const platform = window.__BETIA.platformDetector?.detect?.() || window.__BETIA.platform;
    if (platform) {
      window.__BETIA.platform = platform;
    }

    const signature = JSON.stringify({
      id: platform?.id || 'unknown',
      name: platform?.name || null,
      reason: platform?.detectionReason || reason,
      mode: platform?.behaviorProfile?.mode || null,
      engine: platform?.behaviorProfile?.engine || null,
      frameUrl: window.location.href.split(/[?#]/)[0],
    });

    if (signature === lastPlatformSignature && reason !== 'manual') {
      return;
    }
    lastPlatformSignature = signature;

    try {
      chrome.runtime
        .sendMessage({
          type: 'CONTENT_SCRIPT_READY',
          platform: platform?.id || 'unknown',
          platformName: platform?.name || platform?.id || 'Desconhecida',
          detectionReason: platform?.detectionReason || reason,
          behaviorProfile: platform?.behaviorProfile || null,
          isTopFrame: isTopFrame(),
          url: window.location.href,
        })
        .catch(() => {});
    } catch (_) {}
  }

  // ─── Heartbeat periódico ───────────────────────────────────────────────────
  // Força uma leitura DOM a cada segundo como complemento ao MutationObserver.
  // (O observer reage a mudanças; o heartbeat garante leituras mesmo sem eventos)
  setInterval(() => {
    publishPlatformReady('heartbeat');
    const data = window.__BETIA.readDOMData?.();
    if (data) {
      window.__BETIA.state.domData = data;
      window.__BETIA.onNewSource?.('dom');
    }
    try {
      chrome.runtime
        .sendMessage({
          type: 'CONTENT_HEARTBEAT',
          ts: Date.now(),
          platform: window.__BETIA.platform?.id || 'unknown',
          platformName: window.__BETIA.platform?.name || null,
          behaviorProfile: window.__BETIA.platform?.behaviorProfile || null,
          hasFreshData: Boolean(window.__BETIA.state.fusedData),
          lastFusedAt: window.__BETIA.state.lastFusedAt || 0,
        })
        .catch(() => {});
    } catch (_) {}
    // Mantém o "vivo" postado na janela para o ws-interceptor
    window.postMessage({ type: '__BETIA_HEARTBEAT__', ts: Date.now() }, '*');
  }, 1000);

  // ─── Cria o overlay logo de início (invisível, só monta o DOM) ───────────
  // Assim ele fica pronto para aparecer instantaneamente quando necessário.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.__BETIA.overlay?.create();
    });
  } else {
    window.__BETIA.overlay?.create();
  }

  // ─── Avisa o background que o content script está ativo ──────────────────
  publishPlatformReady('boot');
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => publishPlatformReady('dom_ready'), 250);
    });
  } else {
    setTimeout(() => publishPlatformReady('dom_ready'), 250);
  }

  console.log('[Bet IA] Todos os módulos carregados. Plataforma:', window.__BETIA.platform?.name);
})();

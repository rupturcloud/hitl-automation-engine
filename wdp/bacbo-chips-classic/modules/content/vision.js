// modules/content/vision.js
// Responsabilidade: capturar screenshot da aba e enviar para o background.
// O background repassa ao Side Panel para análise visual (OCR/frame diff).
// Para mudar o intervalo ou o formato: edite APENAS este arquivo.
// Contrato de saída: postMessage SCREENSHOT_CAPTURED ao background

(function () {
  'use strict';

  const CAPTURE_INTERVAL_MS = 2000; // Captura a cada 2 segundos

  function capture() {
    try {
      chrome.runtime.sendMessage({
        type: 'SCREENSHOT_CAPTURED',
        // Nota: o content script não tem acesso direto ao canvas da página,
        // mas o background pode usar chrome.tabs.captureVisibleTab.
        // Aqui sinalizamos ao background que ele deve capturar.
        requestCapture: true,
        ts: Date.now(),
      }).catch(() => {});
    } catch (_) {}
  }

  // Inicia capturas periódicas
  setInterval(capture, CAPTURE_INTERVAL_MS);

  // Recebe dados de visão processados de volta (vindos do Side Panel via background)
  window.__BETIA.onVisionData = function (data) {
    if (!data) return;
    window.__BETIA.state.visionData = { ...data, source: 'vision', ts: Date.now() };
    window.__BETIA.onNewSource?.('vision');
  };

  console.log('[Bet IA Vision] Módulo de captura iniciado. Intervalo:', CAPTURE_INTERVAL_MS, 'ms');
})();

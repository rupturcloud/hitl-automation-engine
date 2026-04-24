// modules/content/bridge.js
// Responsabilidade: ouvir mensagens vindas do background (chrome.runtime)
// e rotear para os módulos corretos.
// Mantém o contrato canônico P0.1 para leitura e execução.

(function () {
  'use strict';

  function readSyncPayload() {
    if (typeof window.__BETIA.getSyncPayload === 'function') {
      return window.__BETIA.getSyncPayload();
    }

    return (
      window.__BETIA.state.fusedData ||
      window.__BETIA.platformDetector?.getDiagnostics?.() || {
        error: 'Nenhum dado disponível ainda. Aguarde a próxima captura.',
      }
    );
  }

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    const { type } = message;

    if (type === 'INJECT_OVERLAY') {
      window.__BETIA.overlay?.create();
      window.__BETIA.overlay?.update({
        robotState: message.state || 'IDLE',
        phase: message.phase,
        countdown: message.countdown,
        confidence: message.confidence,
      });
      sendResponse({ ok: true });
      return true;
    }

    if (type === 'UPDATE_OVERLAY') {
      window.__BETIA.overlay?.update({
        robotState: message.state,
        phase: message.phase,
        countdown: message.countdown,
        confidence: message.confidence,
      });
      sendResponse({ ok: true });
      return true;
    }

    if (type === 'REMOVE_OVERLAY') {
      window.__BETIA.overlay?.remove();
      sendResponse({ ok: true });
      return true;
    }

    if (type === 'GET_GAME_DATA') {
      sendResponse(readSyncPayload());
      return true;
    }

    if (type === 'EXECUTE_BET') {
      const executor = Array.isArray(message.bets)
        ? window.__BETIA.platformDetector?.executeBets
        : window.__BETIA.platformDetector?.executeBet;

      if (!executor) {
        sendResponse({
          success: false,
          message: 'Platform detector não disponível.',
        });
        return true;
      }

      Promise.resolve(
        Array.isArray(message.bets)
          ? executor(message.bets, message.traceId)
          : executor(message.target, message.amount, message.traceId),
      )
        .then(sendResponse)
        .catch((error) =>
          sendResponse({
            success: false,
            message: error?.message || 'Falha inesperada ao executar aposta.',
          }),
        );
      return true;
    }

    if (
      type === 'GET_CALIBRATION_STATE' ||
      type === 'START_CALIBRATION' ||
      type === 'CANCEL_CALIBRATION' ||
      type === 'RESET_CALIBRATION'
    ) {
      const calibrationApi = window.__BETIA.platformDetector;
      const currentState = calibrationApi?.getCalibrationState?.() || null;

      if (type === 'GET_CALIBRATION_STATE') {
        sendResponse({
          ok: true,
          data: currentState,
        });
        return true;
      }

      const command =
        type === 'START_CALIBRATION'
          ? calibrationApi?.startCalibration
          : type === 'CANCEL_CALIBRATION'
            ? calibrationApi?.cancelCalibration
            : calibrationApi?.resetCalibration;

      if (!command) {
        sendResponse({
          ok: false,
          message: 'API de calibração não disponível.',
          data: currentState,
        });
        return true;
      }

      Promise.resolve(command())
        .then((data) =>
          sendResponse({
            ok: true,
            data,
          }),
        )
        .catch((error) =>
          sendResponse({
            ok: false,
            message: error?.message || 'Falha ao executar comando de calibração.',
            data: calibrationApi?.getCalibrationState?.() || currentState,
          }),
        );
      return true;
    }

    // ── Calibração de Fichas ─────────────────────────────────────────────────
    if (
      type === 'GET_CHIP_CAL_STATE' ||
      type === 'START_CHIP_CALIBRATION' ||
      type === 'CANCEL_CHIP_CALIBRATION' ||
      type === 'RESET_CHIP_CALIBRATION'
    ) {
      const api = window.__BETIA.platformDetector;
      if (type === 'GET_CHIP_CAL_STATE') {
        sendResponse({ ok: true, data: api?.getChipCalState?.() || null });
        return true;
      }
      const cmd =
        type === 'START_CHIP_CALIBRATION'  ? api?.startChipCalibration  :
        type === 'CANCEL_CHIP_CALIBRATION' ? api?.cancelChipCalibration :
                                              api?.resetChipCalibration;
      if (!cmd) {
        sendResponse({ ok: false, message: 'API de calibração de fichas não disponível.' });
        return true;
      }
      Promise.resolve(cmd())
        .then((data) => sendResponse({ ok: true, data }))
        .catch((err) => sendResponse({ ok: false, message: err?.message || 'Falha.' }));
      return true;
    }

    if (type === 'VISION_DATA_RESULT') {
      window.__BETIA.onVisionData?.(message.data);
      sendResponse({ ok: true });
      return true;
    }

    if (type === 'RE_DETECT_PLATFORM') {
      const platform = window.__BETIA.platformDetector?.detect();
      if (platform) {
        window.__BETIA.platform = platform;
        chrome.runtime
          .sendMessage({
            type: 'CONTENT_SCRIPT_READY',
            platform: platform.id,
            platformName: platform.name,
            url: window.location.href,
          })
          .catch(() => {});
        sendResponse({
          success: true,
          platform: platform.name,
          data: readSyncPayload(),
        });
      } else {
        sendResponse({
          success: false,
          message: 'Detector de plataforma não disponível.',
        });
      }
      return true;
    }

    return true;
  });

  console.log('[Bet IA Bridge] Listeners de mensagem instalados.');
})();

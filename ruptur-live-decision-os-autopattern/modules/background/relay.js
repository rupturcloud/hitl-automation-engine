// modules/background/relay.js
// Responsabilidade: rotear mensagens entre Side Panel e Content Script.
// Contrato canônico:
// - sync sempre circula como `SYNC_DATA`
// - leitura pontual responde com `{ ok, data }`
// - fail-safe circula como `FAILSAFE_STATE`

import { bgState } from './state.js';
import { onPanelOpened, onPanelClosed } from './panel-control.js';
import { pauseExecution, resumeExecution, getSnapshot } from './debugger-control.js';
import { WORKSPACE_GROUP_TITLE } from './workspace-manager.js';

const HEARTBEAT_TIMEOUT_MS = 5000;
const SYNC_STALE_MS = 5000;
let failSafeMonitorStarted = false;

function logViewerDetected(platformName, tabId, frameId) {
  const nextKey = `${platformName || 'unknown'}::tab:${tabId || 0}::frame:${frameId || 0}`;
  if (bgState.lastPlatformLogKey === nextKey) {
    return;
  }

  bgState.lastPlatformLogKey = nextKey;
  console.log(
    `[Bet IA Relay] Viewer detectado: ${platformName} ` +
      `(tab ${tabId}, frame ${frameId})`,
  );
}

function deriveStatus(timerValue, lastResult) {
  const parsedTimer =
    typeof timerValue === 'number' ? timerValue : Number.parseFloat(String(timerValue ?? ''));

  if (Number.isFinite(parsedTimer) && parsedTimer > 0) {
    return 'BETTING';
  }

  if (lastResult && lastResult !== '---') {
    return 'RESULT';
  }

  return 'SYNCING';
}

function getFailSafeSnapshot() {
  return {
    executionLocked: bgState.executionLocked,
    isDesynced: bgState.isDesynced,
    manualOverride: bgState.manualOverride,
    failSafeReason: bgState.failSafeReason,
    lastHeartbeatAt: bgState.lastHeartbeatAt,
    lastSyncAt: bgState.lastSyncPayload?.ts || 0,
  };
}

function getCalibrationSnapshot() {
  return {
    ...(bgState.calibration || {
      active: false,
      stepIndex: 0,
      stepOrder: ['PLAYER', 'TIE', 'BANKER'],
      currentTarget: 'PLAYER',
      points: {},
      profile: null,
      message: null,
      updatedAt: 0,
    }),
  };
}

function normalizeSyncData(rawData = {}) {
  const data = rawData && typeof rawData === 'object' ? rawData : {};
  const ts = typeof data.ts === 'number' ? data.ts : Date.now();
  const timerValue = data.timer ?? data.countdown ?? data.timeLeft ?? null;
  const lastResult = data.lastResult ?? data.result ?? '---';
  const history = Array.isArray(data.history) ? data.history.slice(0, 156) : [];

  const normalized = {
    history,
    timer:
      typeof timerValue === 'number'
        ? Number(timerValue.toFixed(1))
        : timerValue ?? '0',
    countdown:
      typeof timerValue === 'number'
        ? Number(timerValue.toFixed(1))
        : timerValue ?? '0',
    lastResult,
    result: lastResult,
    balance: data.balance ?? null,
    balanceRaw: data.balanceRaw ?? null,
    balanceSource: data.balanceSource ?? null,
    status: data.status ?? deriveStatus(timerValue, lastResult),
    platform: data.platformName || data.platform || bgState.platform?.name || bgState.platform?.id || null,
    platformId: data.platformId || bgState.platform?.id || null,
    platformName: data.platformName || data.platform || bgState.platform?.name || null,
    detectionReason: data.detectionReason || bgState.platform?.detectionReason || null,
    behaviorProfile: data.behaviorProfile || bgState.platform?.behaviorProfile || null,
    wsEndpoints: Array.isArray(data.wsEndpoints) ? data.wsEndpoints.slice(-12) : [],
    isSyncing: data.isSyncing !== false,
    sources: Array.isArray(data.sources) ? data.sources : [],
    freshnessMs: Math.max(0, Date.now() - ts),
    ts,
    ...getFailSafeSnapshot(),
  };

  bgState.lastSyncPayload = normalized;
  return normalized;
}

function buildErrorResponse(message) {
  return {
    ok: false,
    error: message,
  };
}

function platformRank(platformId) {
  const id = String(platformId || '').toLowerCase();
  if (!id || id === 'unknown') return 0;
  if (id === 'generic' || id === 'behavioral') return 1;
  return 2;
}

function computeSyncFrameScore(rawData = {}, sender) {
  const data = rawData && typeof rawData === 'object' ? rawData : {};
  const sources = new Set(
    Array.isArray(data.sources)
      ? data.sources.map((source) => String(source || '').toLowerCase())
      : [],
  );

  let score = 0;
  if (sources.has('viewer')) score += 60;
  if (sources.has('vision')) score += 35;
  if (sources.has('ws')) score += 15;

  const historyLength = Array.isArray(data.history) ? data.history.length : 0;
  if (historyLength >= 12) score += 10;
  else if (historyLength > 0) score += 5;

  const timerValue = data.timer ?? data.countdown ?? data.timeLeft ?? null;
  if (timerValue !== null && timerValue !== undefined && timerValue !== '') {
    score += 4;
  }
  const parsedTimer =
    typeof timerValue === 'number' ? timerValue : Number.parseFloat(String(timerValue ?? ''));
  if (Number.isFinite(parsedTimer) && parsedTimer > 0) {
    score += 8;
  } else if (Number.isFinite(parsedTimer) && parsedTimer === 0) {
    score -= 4;
  }

  const balanceSource = String(data.balanceSource || '').toLowerCase();
  if (/deposit-neighbor|visible-header|balance-selector/.test(balanceSource)) {
    score += 18;
  }
  if (/ws:official|balanceupdated|accountbalance\.getmy/.test(balanceSource)) {
    score += 14;
  }

  const platformId = data.platformId || data.platform || bgState.platform?.id || null;
  score += platformRank(platformId) * 10;

  const behaviorMode = data.behaviorProfile?.mode;
  if (behaviorMode === 'interactive_viewer') score += 16;
  else if (behaviorMode === 'viewer_only') score += 8;

  const frameId = Number.isInteger(sender?.frameId) ? sender.frameId : 0;
  if (frameId !== 0) {
    score += 6;
  }

  if (frameId !== 0 && platformRank(platformId) >= 2) {
    score += 10;
  }

  if (frameId === 0 && sources.has('viewer') && !sources.has('ws') && platformRank(platformId) <= 1) {
    score -= 24;
  }

  return score;
}

function shouldAcceptSyncUpdate(rawData, sender) {
  const incomingFrameId = Number.isInteger(sender?.frameId) ? sender.frameId : 0;
  const currentFrameId = Number.isInteger(bgState.activeBancaFrameId)
    ? bgState.activeBancaFrameId
    : null;
  const incomingScore = computeSyncFrameScore(rawData, sender);
  const incomingPlatformId =
    rawData && typeof rawData === 'object' ? rawData.platformId || rawData.platform || null : null;
  const currentPlatformId = bgState.platform?.id || null;

  if (currentFrameId === null) {
    return { accept: true, promote: true, incomingScore };
  }

  if (incomingFrameId === currentFrameId) {
    return { accept: true, promote: true, incomingScore };
  }

  if (
    currentFrameId !== 0 &&
    incomingFrameId === 0 &&
    platformRank(currentPlatformId) >= platformRank(incomingPlatformId)
  ) {
    return {
      accept: false,
      promote: false,
      incomingScore,
      reason: 'prefer_nested_frame',
    };
  }

  const currentScore = Number(bgState.activeBancaFrameScore || 0);
  if (incomingScore > currentScore + 8) {
    return { accept: true, promote: true, incomingScore };
  }

  return {
    accept: false,
    promote: false,
    incomingScore,
    reason: 'lower_priority_frame',
  };
}

function shouldPromotePlatform(incoming, sender) {
  if (!incoming) return false;
  if (!bgState.platform) return true;

  const incomingRank = platformRank(incoming.id);
  const currentRank = platformRank(bgState.platform.id);
  if (incomingRank > currentRank) return true;
  if (incomingRank < currentRank) return false;

  const incomingFrameId = Number.isInteger(sender?.frameId) ? sender.frameId : 0;
  const currentFrameId = Number.isInteger(bgState.activeBancaFrameId) ? bgState.activeBancaFrameId : 0;

  // Se top-frame detectou apenas o wrapper, promova o iframe da banca/viewer.
  return incomingFrameId !== 0 && currentFrameId === 0;
}

function trackFrameFromSender(sender, message = {}, frameScore = null) {
  const tabId = sender?.tab?.id;
  if (tabId) {
    bgState.activeBancaTabId = tabId;
  }

  if (Number.isInteger(sender?.frameId)) {
    bgState.activeBancaFrameId = sender.frameId;
  }

  if (typeof frameScore === 'number' && Number.isFinite(frameScore)) {
    bgState.activeBancaFrameScore = frameScore;
  }

  bgState.activeBancaFrameUrl = message.url || sender?.url || bgState.activeBancaFrameUrl || '';
}

function shouldIgnoreSenderTab(sender) {
  const tabId = sender?.tab?.id;
  return Boolean(bgState.sidePanelIsOpen && bgState.activeBancaTabId && tabId && tabId !== bgState.activeBancaTabId);
}

function sendMessageToBanca(message, tabId = bgState.activeBancaTabId) {
  if (!tabId) {
    return Promise.reject(new Error('Sem aba de banca detectada.'));
  }

  const frameId = bgState.activeBancaFrameId;
  if (Number.isInteger(frameId)) {
    return chrome.tabs
      .sendMessage(tabId, message, { frameId })
      .catch((error) => {
        console.warn(
          `[Bet IA Relay] Frame ${frameId} não respondeu; tentando top-frame/all-frames.`,
          error,
        );
        return chrome.tabs.sendMessage(tabId, message);
      });
  }

  return chrome.tabs.sendMessage(tabId, message);
}

async function resolveActiveWorkspaceExecutionTab() {
  const tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  const activeTab = tabs?.[0] || null;

  if (!activeTab?.id) {
    return {
      ok: false,
      message: 'Nenhuma guia ativa encontrada para execução.',
    };
  }

  bgState.activeBrowserTabId = activeTab.id;
  bgState.activeBrowserWindowId = activeTab.windowId || bgState.activeBrowserWindowId;

  const workspaceGroupId = Number.isInteger(bgState.tabGroupId) ? bgState.tabGroupId : null;
  const activeGroupId = Number.isInteger(activeTab.groupId) ? activeTab.groupId : null;

  if (workspaceGroupId !== null && activeGroupId !== workspaceGroupId) {
    return {
      ok: false,
      message:
        `Execução bloqueada: a guia ativa (${activeTab.id}) está fora do grupo "${WORKSPACE_GROUP_TITLE}". ` +
        `Ative uma guia dentro do grupo antes de confirmar.`,
      tabId: activeTab.id,
      groupId: activeGroupId,
      workspaceGroupId,
    };
  }

  if (bgState.activeBancaTabId !== activeTab.id) {
    bgState.activeBancaFrameId = null;
    bgState.activeBancaFrameScore = 0;
    bgState.activeBancaFrameUrl = '';
  }

  bgState.activeBancaTabId = activeTab.id;
  return {
    ok: true,
    tabId: activeTab.id,
    groupId: activeGroupId,
    workspaceGroupId,
  };
}

function broadcastToSidePanel(message) {
  chrome.runtime.sendMessage(message).catch(() => {});
}

function buildOverlayState() {
  if (bgState.manualOverride) {
    return 'MANUAL_OVERRIDE';
  }

  if (bgState.executionLocked) {
    return 'DESYNC';
  }

  return bgState.robotState;
}

function pushOverlayState() {
  if (!bgState.activeBancaTabId || !bgState.sidePanelIsOpen) {
    return;
  }

  const syncPayload = bgState.lastSyncPayload;
  sendMessageToBanca({
      type: 'UPDATE_OVERLAY',
      state: buildOverlayState(),
      phase: bgState.failSafeReason || bgState.robotState,
      countdown: syncPayload?.countdown,
      confidence: bgState.executionLocked ? 0 : syncPayload?.confidence,
    })
    .catch(() => {});
}

function broadcastFailSafeState() {
  broadcastToSidePanel({
    type: 'FAILSAFE_STATE',
    data: getFailSafeSnapshot(),
  });
}

function broadcastCalibrationState() {
  broadcastToSidePanel({
    type: 'CALIBRATION_STATE',
    data: getCalibrationSnapshot(),
  });
}

function setFailSafe(reason) {
  const previous = JSON.stringify(getFailSafeSnapshot());

  bgState.failSafeReason = reason;
  bgState.executionLocked = Boolean(reason);
  bgState.isDesynced = Boolean(reason && reason !== 'manual_override');

  const next = JSON.stringify(getFailSafeSnapshot());
  if (previous !== next) {
    broadcastFailSafeState();
    if (bgState.lastSyncPayload) {
      bgState.lastSyncPayload = {
        ...bgState.lastSyncPayload,
        ...getFailSafeSnapshot(),
      };
      broadcastToSidePanel({
        type: 'SYNC_DATA',
        data: bgState.lastSyncPayload,
      });
    }
  }

  pushOverlayState();
}

function clearFailSafe() {
  const previous = JSON.stringify(getFailSafeSnapshot());

  bgState.executionLocked = false;
  bgState.isDesynced = false;
  bgState.failSafeReason = null;

  const next = JSON.stringify(getFailSafeSnapshot());
  if (previous !== next) {
    broadcastFailSafeState();
    if (bgState.lastSyncPayload) {
      bgState.lastSyncPayload = {
        ...bgState.lastSyncPayload,
        ...getFailSafeSnapshot(),
      };
      broadcastToSidePanel({
        type: 'SYNC_DATA',
        data: bgState.lastSyncPayload,
      });
    }
  }

  pushOverlayState();
}

function evaluateFailSafe() {
  if (bgState.manualOverride) {
    setFailSafe('manual_override');
    return;
  }

  if (!bgState.activeBancaTabId) {
    setFailSafe('no_active_tab');
    return;
  }

  if (!bgState.platform || bgState.platform.id === 'unknown') {
    setFailSafe('platform_unknown');
    return;
  }

  if (!bgState.lastHeartbeatAt || Date.now() - bgState.lastHeartbeatAt > HEARTBEAT_TIMEOUT_MS) {
    setFailSafe('heartbeat_timeout');
    return;
  }

  if (bgState.lastSyncPayload?.ts && Date.now() - bgState.lastSyncPayload.ts > SYNC_STALE_MS) {
    setFailSafe('sync_stale');
    return;
  }

  clearFailSafe();
}

function startFailSafeMonitor() {
  if (failSafeMonitorStarted) {
    return;
  }

  failSafeMonitorStarted = true;
  setInterval(() => {
    evaluateFailSafe();
  }, 1000);
}

function queryPlatformFromActiveTab() {
  if (!bgState.activeBancaTabId) {
    return;
  }

  sendMessageToBanca({ type: 'RE_DETECT_PLATFORM' }).catch(() => {});
}

export function setupRelay() {
  startFailSafeMonitor();

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const { type } = message;

    if (type === 'DEBUGGER_PAUSE') {
      const tabId = bgState.activeBancaTabId;
      if (!tabId) {
        sendResponse(buildErrorResponse('Sem aba de banca detectada.'));
        return true;
      }

      bgState.manualOverride = true;
      setFailSafe('manual_override');

      pauseExecution(tabId)
        .then(() => sendResponse({ ok: true, data: getFailSafeSnapshot() }))
        .catch((err) => sendResponse(buildErrorResponse(err.message)));
      return true;
    }

    if (type === 'DEBUGGER_RESUME') {
      const tabId = bgState.activeBancaTabId;
      if (!tabId) {
        sendResponse(buildErrorResponse('Sem aba de banca detectada.'));
        return true;
      }

      bgState.manualOverride = false;

      resumeExecution(tabId)
        .then(() => {
          evaluateFailSafe();
          sendResponse({ ok: true, data: getFailSafeSnapshot() });
        })
        .catch((err) => sendResponse(buildErrorResponse(err.message)));
      return true;
    }

    if (type === 'DEBUGGER_SNAPSHOT') {
      const tabId = bgState.activeBancaTabId;
      if (!tabId) {
        sendResponse(buildErrorResponse('Sem aba de banca detectada.'));
        return true;
      }

      getSnapshot(tabId)
        .then((snapshot) => sendResponse({ ok: true, snapshot }))
        .catch((err) => sendResponse(buildErrorResponse(err.message)));
      return true;
    }

    // ── Vindas do CONTENT SCRIPT ────────────────────────────────────────────

    if (type === 'CONTENT_HEARTBEAT') {
      if (shouldIgnoreSenderTab(sender)) {
        sendResponse({ ok: true, ignored: true });
        return true;
      }

      bgState.lastHeartbeatAt = typeof message.ts === 'number' ? message.ts : Date.now();
      bgState.lastHeartbeatPlatform = message.platform || bgState.platform?.id || null;
      const incomingPlatform = {
        id: message.platform || 'unknown',
        name: message.platformName || message.platform || 'Desconhecida',
        url: message.url || sender.url || '',
        detectionReason: message.detectionReason || null,
        behaviorProfile: message.behaviorProfile || null,
      };
      if (shouldPromotePlatform(incomingPlatform, sender)) {
        trackFrameFromSender(sender, message);
        bgState.platform = incomingPlatform;
      }
      evaluateFailSafe();
      sendResponse({ ok: true });
      return true;
    }

    if (type === 'CONTENT_SCRIPT_READY') {
      if (shouldIgnoreSenderTab(sender)) {
        sendResponse({ ok: true, ignored: true });
        return true;
      }

      const tabId = sender.tab?.id;
      if (tabId && (!bgState.sidePanelIsOpen || !bgState.activeBancaTabId || tabId === bgState.activeBancaTabId)) {
        bgState.activeBancaTabId = tabId;
      }

      const incomingPlatform = {
        id: message.platform || 'unknown',
        name: message.platformName || message.platform || 'Desconhecida',
        url: message.url || '',
        detectionReason: message.detectionReason || null,
        behaviorProfile: message.behaviorProfile || null,
      };

      if (shouldPromotePlatform(incomingPlatform, sender)) {
        trackFrameFromSender(sender, message);
        bgState.platform = incomingPlatform;
      }

      logViewerDetected(
        bgState.platform?.name || incomingPlatform.name,
        tabId,
        bgState.activeBancaFrameId ?? sender.frameId ?? 0,
      );

      evaluateFailSafe();

      if (bgState.sidePanelIsOpen) {
        broadcastToSidePanel({
          type: 'PLATFORM_DETECTED',
          platform: bgState.platform,
        });
        broadcastFailSafeState();
        broadcastCalibrationState();

        if (bgState.lastSyncPayload) {
          broadcastToSidePanel({
            type: 'SYNC_DATA',
            data: {
              ...bgState.lastSyncPayload,
              ...getFailSafeSnapshot(),
            },
          });
        }
      }

      sendResponse({ ok: true });
      return true;
    }

    if (type === 'CALIBRATION_STATE') {
      bgState.calibration = {
        ...getCalibrationSnapshot(),
        ...(message.data && typeof message.data === 'object' ? message.data : {}),
      };

      if (bgState.sidePanelIsOpen) {
        broadcastCalibrationState();
      }

      sendResponse({
        ok: true,
        data: getCalibrationSnapshot(),
      });
      return true;
    }

    // Push proativo do content script com o estado do mapa de fichas
    if (type === 'CHIP_MAP_STATUS') {
      bgState.lastChipMapStatus = message.data || null;
      if (bgState.sidePanelIsOpen) {
        broadcastToSidePanel({ type: 'CHIP_MAP_STATUS', data: bgState.lastChipMapStatus });
      }
      sendResponse({ ok: true });
      return true;
    }

    if (type === 'GAME_DATA_UPDATE') {
      if (shouldIgnoreSenderTab(sender)) {
        sendResponse({ ok: true, ignored: true });
        return true;
      }

      const syncDecision = shouldAcceptSyncUpdate(message.data, sender);
      if (!syncDecision.accept) {
        sendResponse({ ok: true, ignored: true, reason: syncDecision.reason });
        return true;
      }

      if (sender.tab?.id && syncDecision.promote) {
        trackFrameFromSender(sender, message, syncDecision.incomingScore);
      }

      const normalized = normalizeSyncData(message.data);
      evaluateFailSafe();

      if (bgState.sidePanelIsOpen) {
        broadcastToSidePanel({
          type: 'SYNC_DATA',
          data: {
            ...normalized,
            ...getFailSafeSnapshot(),
          },
        });
      }

      sendResponse({
        ok: true,
        data: {
          ...normalized,
          ...getFailSafeSnapshot(),
        },
      });
      return true;
    }

    if (type === 'SCREENSHOT_CAPTURED') {
      const tabId = sender.tab?.id || bgState.activeBancaTabId;
      if (tabId && bgState.sidePanelIsOpen) {
        chrome.tabs.captureVisibleTab(null, { format: 'jpeg', quality: 50 }, (dataUrl) => {
          if (chrome.runtime.lastError) {
            return;
          }
          broadcastToSidePanel({
            type: 'VISION_FRAME',
            dataUrl,
            ts: Date.now(),
          });
        });
      }
      sendResponse({ ok: true });
      return true;
    }

    // ── Vindas do SIDE PANEL / APP ──────────────────────────────────────────

    if (type === 'PANEL_OPENED') {
      onPanelOpened(message.tabId);
      evaluateFailSafe();

      if (bgState.platform) {
        setTimeout(() => {
          broadcastToSidePanel({
            type: 'PLATFORM_DETECTED',
            platform: bgState.platform,
          });
          broadcastFailSafeState();
          broadcastCalibrationState();

          if (bgState.lastSyncPayload) {
            broadcastToSidePanel({
              type: 'SYNC_DATA',
              data: {
                ...bgState.lastSyncPayload,
                ...getFailSafeSnapshot(),
              },
            });
          }

          if (bgState.lastChipMapStatus) {
            broadcastToSidePanel({ type: 'CHIP_MAP_STATUS', data: bgState.lastChipMapStatus });
          }
        }, 200);
      } else {
        queryPlatformFromActiveTab();
      }

      sendResponse({ ok: true });
      return true;
    }

    if (type === 'PANEL_CLOSED') {
      onPanelClosed();
      sendResponse({ ok: true });
      return true;
    }

    if (type === 'ROBOT_STATE_CHANGED') {
      bgState.robotState = message.state;
      pushOverlayState();
      sendResponse({ ok: true, data: getFailSafeSnapshot() });
      return true;
    }

    if (type === 'GET_CALIBRATION_STATE') {
      sendResponse({
        ok: true,
        data: getCalibrationSnapshot(),
      });
      return true;
    }

    if (
      type === 'START_CALIBRATION' ||
      type === 'CANCEL_CALIBRATION' ||
      type === 'RESET_CALIBRATION'
    ) {
      const tabId = message.tabId || bgState.activeBancaTabId;
      if (!tabId) {
        sendResponse(buildErrorResponse('Nenhuma aba ativa encontrada para calibração.'));
        return true;
      }

      const targetType =
        type === 'START_CALIBRATION'
          ? 'START_CALIBRATION'
          : type === 'CANCEL_CALIBRATION'
            ? 'CANCEL_CALIBRATION'
            : 'RESET_CALIBRATION';

      sendMessageToBanca({ type: targetType }, tabId)
        .then((response) => {
          const nextCalibration =
            response?.data && typeof response.data === 'object'
              ? response.data
              : getCalibrationSnapshot();

          bgState.calibration = {
            ...getCalibrationSnapshot(),
            ...nextCalibration,
          };

          if (bgState.sidePanelIsOpen) {
            broadcastCalibrationState();
          }

          sendResponse({
            ok: Boolean(response?.ok ?? true),
            data: getCalibrationSnapshot(),
            message: response?.message || null,
          });
        })
        .catch((err) => sendResponse(buildErrorResponse(err.message)));
      return true;
    }

    // ── Calibração de Fichas ─────────────────────────────────────────────────
    if (
      type === 'GET_CHIP_CAL_STATE' ||
      type === 'START_CHIP_CALIBRATION' ||
      type === 'CANCEL_CHIP_CALIBRATION' ||
      type === 'RESET_CHIP_CALIBRATION'
    ) {
      const tabId = message.tabId || bgState.activeBancaTabId;
      if (!tabId) {
        sendResponse(buildErrorResponse('Nenhuma aba ativa para calibração de fichas.'));
        return true;
      }
      sendMessageToBanca({ type }, tabId)
        .then((response) => {
          if (bgState.sidePanelIsOpen) {
            broadcastToSidePanel({ type: 'CHIP_CALIBRATION_STATE', data: response?.data || null });
          }
          sendResponse({ ok: Boolean(response?.ok ?? true), data: response?.data || null });
        })
        .catch((err) => sendResponse(buildErrorResponse(err.message)));
      return true;
    }

    if (type === 'REQUEST_GAME_DATA' || type === 'GET_GAME_DATA') {
      const tabId = message.tabId || bgState.activeBancaTabId;
      if (tabId) {
        bgState.activeBancaTabId = tabId;
      }

      if (!bgState.activeBancaTabId) {
        sendResponse(buildErrorResponse('Sem aba de banca detectada.'));
        return true;
      }

      sendMessageToBanca({ type: 'GET_GAME_DATA' })
        .then((data) => {
          if (data?.error) {
            sendResponse(buildErrorResponse(data.error));
            return;
          }

          const normalized = normalizeSyncData(data);
          evaluateFailSafe();

          sendResponse({
            ok: true,
            data: {
              ...normalized,
              ...getFailSafeSnapshot(),
            },
          });
        })
        .catch((err) => sendResponse(buildErrorResponse(err.message)));
      return true;
    }

    if (type === 'MANUAL_SYNC') {
      const tabId = message.tabId || bgState.activeBancaTabId;
      if (!tabId) {
        sendResponse(buildErrorResponse('Nenhuma aba ativa encontrada.'));
        return true;
      }

      sendMessageToBanca({ type: 'RE_DETECT_PLATFORM' }, tabId)
        .then((resp) => {
          if (resp?.data && !resp.data.error) {
            normalizeSyncData(resp.data);
          }
          evaluateFailSafe();
          sendResponse({
            ok: Boolean(resp?.success),
            data: bgState.lastSyncPayload
              ? {
                  ...bgState.lastSyncPayload,
                  ...getFailSafeSnapshot(),
                }
              : null,
            platform: resp?.platform || bgState.platform?.name || null,
            message: resp?.message || null,
          });
        })
        .catch((err) => sendResponse(buildErrorResponse(err.message)));
      return true;
    }

    if (type === 'EXECUTE_BET') {
      (async () => {
        const executionTab = await resolveActiveWorkspaceExecutionTab();
        if (!executionTab.ok) {
          sendResponse(buildErrorResponse(executionTab.message));
          return;
        }

        evaluateFailSafe();

        if (bgState.executionLocked) {
          sendResponse(
            buildErrorResponse(
              `Execução bloqueada pelo fail-safe (${bgState.failSafeReason || 'desconhecido'}).`,
            ),
          );
          return;
        }

        if (bgState.calibration?.active) {
          sendResponse(
            buildErrorResponse('Calibração em andamento. Finalize ou cancele antes de executar.'),
          );
          return;
        }

        const data = await sendMessageToBanca(
          {
            type: 'EXECUTE_BET',
            bets: Array.isArray(message.bets) ? message.bets : undefined,
            target: message.target,
            amount: message.amount,
            totalAmount: message.totalAmount,
            traceId: message.traceId,
            calibrationProfile: bgState.calibration?.profile || null,
          },
          executionTab.tabId,
        );

          if (!data) {
            sendResponse(
              buildErrorResponse(
                'A aba da banca não retornou resposta. Recarregue a banca e a extensão.',
              ),
            );
            return;
          }

          sendResponse({
            ok: Boolean(data.success),
            data,
            error: data.success
              ? null
              : data.message || 'Content script recusou a execução sem detalhar o motivo.',
          });
      })().catch((err) => sendResponse(buildErrorResponse(err.message)));
      return true;
    }

    return true;
  });
}

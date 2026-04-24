// modules/background/tab-tracker.js
// Responsabilidade: rastrear qual aba é a banca ativa.
// Para atualizar: edite apenas este arquivo.

import { bgState } from './state.js';
import { organizeWorkspace, WORKSPACE_GROUP_TITLE } from './workspace-manager.js';

export function setupTabTracker() {
  // Quando o usuário muda de aba
  chrome.tabs.onActivated.addListener(async ({ tabId }) => {
    let tab = null;
    try {
      tab = await chrome.tabs.get(tabId);
    } catch (_) {}

    bgState.activeBrowserTabId = tabId;
    bgState.activeBrowserWindowId = tab?.windowId || bgState.activeBrowserWindowId;

    const workspaceGroupId = Number.isInteger(bgState.tabGroupId) ? bgState.tabGroupId : null;
    const tabGroupId = Number.isInteger(tab?.groupId) ? tab.groupId : null;
    const isInsideWorkspaceGroup =
      workspaceGroupId === null ||
      (tabGroupId !== null && tabGroupId === workspaceGroupId);

    if (!isInsideWorkspaceGroup) {
      console.log(
        `[Bet IA Tab Tracker] Aba ${tabId} ignorada: fora do grupo "${WORKSPACE_GROUP_TITLE}" (${workspaceGroupId}).`,
      );
      return;
    }

    if (bgState.activeBancaTabId !== tabId) {
      bgState.activeBancaFrameId = null;
      bgState.activeBancaFrameScore = 0;
      bgState.activeBancaFrameUrl = '';
    }

    bgState.activeBancaTabId = tabId;
    console.log(`[Bet IA Tab Tracker] Aba ativa no grupo "${WORKSPACE_GROUP_TITLE}":`, tabId);

    if (bgState.sidePanelIsOpen) {
      notifyContentOverlay(tabId, getOverlayState());
      if (workspaceGroupId === null) {
        organizeWorkspace(tabId);
      }
    }
  });

  // Quando uma aba termina de carregar (ex: usuário recarregou a banca)
  chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === 'complete' && tabId === bgState.activeBancaTabId) {
      if (bgState.sidePanelIsOpen) {
        notifyContentOverlay(tabId, getOverlayState());
      }
    }
  });
}

function getOverlayState() {
  if (bgState.manualOverride) {
    return 'MANUAL_OVERRIDE';
  }

  if (bgState.executionLocked) {
    return 'DESYNC';
  }

  if (bgState.sidePanelIsOpen && bgState.robotState === 'IDLE') {
    return 'ACTIVE_LOCK';
  }

  return bgState.robotState;
}

function notifyContentOverlay(tabId, state) {
  chrome.tabs.sendMessage(tabId, {
    type: 'INJECT_OVERLAY',
    state,
  }).catch(() => {
    // Content script pode não ter carregado — injeta via scripting API
    chrome.scripting.executeScript({
      target: { tabId, allFrames: true },
      files: [
        'modules/content/state.js',
        'modules/content/platform-detector.js',
        'modules/content/ws-interceptor-isolated.js',
        'modules/content/dom-observer.js',
        'modules/content/vision.js',
        'modules/content/data-fusion.js',
        'modules/content/overlay.js',
        'modules/content/bridge.js',
        'modules/content/index.js',
      ],
    }).catch(console.warn);
  });
}

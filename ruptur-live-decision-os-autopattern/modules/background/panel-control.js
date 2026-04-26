// modules/background/panel-control.js
// Responsabilidade: controlar abertura e fechamento do Side Panel.
// Para atualizar o comportamento do painel: edite apenas este arquivo.

import { bgState } from './state.js';
import { attachDebugger, detachDebugger } from './debugger-control.js';
import { organizeWorkspace } from './workspace-manager.js';

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

export function setupPanelControl() {
  // Abre o Side Panel ao clicar no ícone da extensão
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch(console.error);
}

// Funções exportadas para uso pelo relay
export async function onPanelOpened(tabId) {
  bgState.sidePanelIsOpen = true;
  if (tabId && tabId !== bgState.activeBancaTabId) {
    bgState.activeBancaFrameId = null;
    bgState.activeBancaFrameScore = 0;
    bgState.activeBancaFrameUrl = '';
  }
  if (tabId) bgState.activeBancaTabId = tabId;
  console.log('[Bet IA Panel] Aberto. Aba:', tabId);

  // Ativa o modo de depuração imediatamente (requisito do usuário)
  if (tabId) {
    const ok = await attachDebugger(tabId);
    chrome.runtime.sendMessage({
      type: 'DEBUGGER_STATUS',
      attached: ok
    }).catch(() => {});

    // Agrupa a aba da banca com cor/título para ficar claro que o workspace
    // está sob controle da Bet IA.
    await organizeWorkspace(tabId);
  }

  if (bgState.activeBancaTabId) {
    chrome.tabs.sendMessage(bgState.activeBancaTabId, {
      type: 'INJECT_OVERLAY',
      state: getOverlayState(),
    }).catch(() => {});
  }
}

export function onPanelClosed() {
  const lastTabId = bgState.activeBancaTabId;
  bgState.sidePanelIsOpen = false;
  console.log('[Bet IA Panel] Fechado.');

  // Desconecta o debugger para remover a barra de aviso do Chrome
  if (lastTabId) {
    detachDebugger(lastTabId);
  }

  if (lastTabId) {
    chrome.tabs.sendMessage(lastTabId, {
      type: 'REMOVE_OVERLAY',
    }).catch(() => {});
  }
}

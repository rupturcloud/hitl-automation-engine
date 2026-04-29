// background.js — roteia mensagens, mantém side panel/overlay e dá suporte ao popup compacto.
console.log('[Will Dados Robô] Background iniciado');

chrome.runtime.onInstalled.addListener(async () => {
  console.log('[Will Dados Robô] Instalado/atualizado');
  if (chrome.sidePanel?.setPanelBehavior) {
    await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error) => {
      console.warn('[Will Dados Robô] Falha ao configurar sidePanel:', error?.message || error);
    });
  }
});

chrome.runtime.onStartup?.addListener(async () => {
  if (chrome.sidePanel?.setPanelBehavior) {
    await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});
  }
});

chrome.action.onClicked.addListener(async (tab) => {
  // Este listener só dispara quando o manifest não usa default_popup.
  // Mantemos como fallback para builds que preferirem abrir direto o painel lateral.
  try {
    if (chrome.sidePanel?.setOptions && tab?.id) {
      await chrome.sidePanel.setOptions({ tabId: tab.id, path: 'sidepanel.html', enabled: true });
    }
    if (chrome.sidePanel?.open) {
      await chrome.sidePanel.open({ windowId: tab.windowId });
      return;
    }
  } catch (error) {
    console.warn('[Will Dados Robô] Não conseguiu abrir sidePanel:', error?.message || error);
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request?.action === 'ENTER_OVERLAY_MODE') {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      try {
        const tab = tabs?.[0];
        if (!tab?.id) throw new Error('Nenhuma aba ativa encontrada.');
        const stored = await chrome.storage.local.get(['willDadosConfig']);
        const config = { ...(stored.willDadosConfig || {}), showOverlay: true };
        await chrome.storage.local.set({ willDadosConfig: config });
        await chrome.tabs.sendMessage(tab.id, { action: 'UPDATE_CONFIG', config }).catch(() => null);
        // Regra visual: modo overlay e painel lateral não ficam abertos juntos.
        // Em Chrome compatível, desabilitar o side panel da aba fecha/oculta o painel atual.
        if (chrome.sidePanel?.setOptions) {
          await chrome.sidePanel.setOptions({ tabId: tab.id, path: 'sidepanel.html', enabled: false }).catch(() => null);
        }
        sendResponse({ success: true, config });
      } catch (error) {
        sendResponse({ success: false, message: error?.message || String(error) });
      }
    });
    return true;
  }

  if (request?.action === 'OPEN_SIDE_PANEL') {
    const tabFromSender = sender?.tab;
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      try {
        const tab = tabFromSender || tabs?.[0];
        if (!tab?.id) throw new Error('Nenhuma aba ativa encontrada.');
        const stored = await chrome.storage.local.get(['willDadosConfig']);
        const config = { ...(stored.willDadosConfig || {}), showOverlay: false };
        await chrome.storage.local.set({ willDadosConfig: config });
        await chrome.tabs.sendMessage(tab.id, { action: 'UPDATE_CONFIG', config }).catch(() => null);
        if (chrome.sidePanel?.setOptions) {
          await chrome.sidePanel.setOptions({ tabId: tab.id, path: 'sidepanel.html', enabled: true }).catch(() => null);
        }
        if (chrome.sidePanel?.open && tab?.windowId) {
          await chrome.sidePanel.open({ windowId: tab.windowId });
          sendResponse({ success: true });
          return;
        }
        sendResponse({ success: false, message: 'sidePanel API indisponível.' });
      } catch (error) {
        sendResponse({ success: false, message: error?.message || String(error) });
      }
    });
    return true;
  }

  const passThrough = ['GET_STATUS', 'GET_LOGS', 'TOGGLE_ROBO', 'UPDATE_CONFIG', 'EXPORT_LOGS_CSV'];
  if (!passThrough.includes(request?.action)) return false;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs?.[0];
    if (!tab?.id) {
      sendResponse({ success: false, message: 'Nenhuma aba ativa encontrada.' });
      return;
    }

    chrome.tabs.sendMessage(tab.id, request, (response) => {
      if (chrome.runtime.lastError) {
        sendResponse({ success: false, message: chrome.runtime.lastError.message });
        return;
      }
      sendResponse(response || { success: false, message: 'Sem resposta do content script.' });
    });
  });

  return true;
});

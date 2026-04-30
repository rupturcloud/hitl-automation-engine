// background.js — roteia mensagens, mantém side panel/overlay e WebSocket externo com reconexão.
console.log('[Will Dados Robô] Background iniciado - Extensão 5');

// ==================== CONFIGURAÇÃO SEGURA DO PROXY ====================
const DEFAULT_PROXY_CONFIG = {
  enabled: false,
  host: "",
  port: 9595,
  username: "",
  password: "",
  scheme: "socks5"
};

const DEFAULT_WS_CONFIG = {
  url: 'ws://localhost:8765',
  maxRetries: 10,
  retryDelay: 3000,
  maxRetryDelay: 30000
};

const PROXY_DOMAINS = [
  "*.betboom.bet.br",
  "*.betboom.com",
  "*.evolutiongaming.com",
  "*.evo-games.com"
];

async function carregarConfigProxy() {
  const stored = await chrome.storage.local.get(['willDadosProxyConfig']);
  return stored.willDadosProxyConfig || DEFAULT_PROXY_CONFIG;
}

async function configurarProxy() {
  const config = await carregarConfigProxy();

  if (!config.enabled || !config.host || !config.username || !config.password) {
    console.log('[PROXY] Proxy desativado ou credenciais incompletas. Usando conexão direta.');
    chrome.proxy.settings.set({
      value: { mode: "direct" },
      scope: 'regular'
    }, () => {
      if (chrome.runtime.lastError) {
        console.warn('[PROXY] Erro ao desativar proxy:', chrome.runtime.lastError.message);
      }
    });
    return;
  }

  const pacScript = `
    function FindProxyForURL(url, host) {
      var domains = ${JSON.stringify(PROXY_DOMAINS)};
      for (var i = 0; i < domains.length; i++) {
        if (shExpMatch(host, domains[i])) {
          return "SOCKS5 ${config.username}:${config.password}@${config.host}:${config.port}";
        }
      }
      return "DIRECT";
    }
  `;

  chrome.proxy.settings.set({
    value: {
      mode: "pac_script",
      pacScript: { data: pacScript }
    },
    scope: 'regular'
  }, () => {
    console.log('[PROXY] ✓ Proxy configurado para Betboom/Evolution');
    if (chrome.runtime.lastError) {
      console.error('[PROXY] Erro ao configurar proxy:', chrome.runtime.lastError.message);
    }
  });
}

chrome.runtime.onInstalled.addListener(() => {
  configurarProxy();
});

chrome.runtime.onStartup.addListener(() => {
  configurarProxy();
});
// ============================================================

const DEFAULT_WS_URL = 'ws://localhost:8765';
const MAX_WS_RETRIES = 10;
let ws = null;
let wsReconnectTimer = null;
let wsReconnectDelay = 3000;
let wsUrlAtual = DEFAULT_WS_URL;
let wsConnectedAt = null;
let ultimaMensagemWsAt = null;
let wsErroConsecutivo = 0;
let wsJaConectouUmaVez = false;
let wsMaxRetriesAtingido = false;

function avisarWsParaUis(action, extra = {}) {
  try {
    chrome.runtime.sendMessage({ action, ...extra }, () => void chrome.runtime.lastError);
  } catch (_) {}
}

function estadoWs() {
  return {
    url: wsUrlAtual,
    connected: ws?.readyState === WebSocket.OPEN,
    readyState: ws?.readyState ?? WebSocket.CLOSED,
    connectedAt: wsConnectedAt,
    lastMessageAt: ultimaMensagemWsAt,
    erros: wsErroConsecutivo,
    maxRetries: MAX_WS_RETRIES,
    parado: wsMaxRetriesAtingido
  };
}

function agendarReconexaoWs() {
  if (wsErroConsecutivo >= MAX_WS_RETRIES) {
    if (!wsMaxRetriesAtingido) {
      wsMaxRetriesAtingido = true;
      console.error(`[Will Dados Robô] ✗ WebSocket: máximo de ${MAX_WS_RETRIES} tentativas atingido. Servidor não está respondendo.`);
      avisarWsParaUis('WS_MAX_RETRIES_REACHED', { ...estadoWs(), message: `Servidor WebSocket indisponível após ${MAX_WS_RETRIES} tentativas. Verifique se está rodando em ${wsUrlAtual}` });
    }
    return;
  }

  if (wsReconnectTimer) clearTimeout(wsReconnectTimer);
  wsReconnectTimer = setTimeout(() => {
    wsReconnectTimer = null;
    conectarWebSocketExterno();
  }, wsReconnectDelay);
  // Backoff exponencial: 3s → 5s → 8s → 13s → 20s → 30s (max)
  wsReconnectDelay = Math.min(30000, Math.round(wsReconnectDelay * 1.6));
}

async function obterWsUrlConfigurada() {
  try {
    const stored = await chrome.storage.local.get(['willDadosWsUrl', 'willDadosConfig']);
    return stored.willDadosWsUrl || stored.willDadosConfig?.wsUrl || DEFAULT_WS_URL;
  } catch (_) {
    return DEFAULT_WS_URL;
  }
}

async function conectarWebSocketExterno(force = false) {
  wsUrlAtual = await obterWsUrlConfigurada();
  if (!wsUrlAtual) return;
  if (!force && (ws?.readyState === WebSocket.OPEN || ws?.readyState === WebSocket.CONNECTING)) return;

  try { ws?.close?.(); } catch (_) {}

  try {
    ws = new WebSocket(wsUrlAtual);

    ws.onopen = () => {
      wsReconnectDelay = 3000;
      wsErroConsecutivo = 0;
      wsConnectedAt = Date.now();
      wsJaConectouUmaVez = true;
      console.log('[Will Dados Robô] WebSocket externo conectado:', wsUrlAtual);
      avisarWsParaUis('WS_CONNECTED', estadoWs());
      enviarParaWebSocket({
        type: 'EXTENSION_HELLO',
        source: 'background',
        version: chrome.runtime.getManifest().version,
        timestamp: Date.now()
      });
    };

    ws.onmessage = (event) => {
      ultimaMensagemWsAt = Date.now();
      let payload = event.data;
      try { payload = JSON.parse(event.data); } catch (_) {}
      console.log('[Will Dados Robô] WS externo recebido:', payload);
      // Envia para todas as abas
      chrome.tabs.query({}, (tabs) => {
        for (const tab of tabs || []) {
          if (!tab.id) continue;
          chrome.tabs.sendMessage(tab.id, { action: 'WS_MESSAGE', payload }, () => void chrome.runtime.lastError);
        }
      });
      avisarWsParaUis('WS_MESSAGE_RECEIVED', { payload, ...estadoWs() });
    };

    ws.onclose = () => {
      const estavConectado = wsConnectedAt != null;
      wsConnectedAt = null;
      wsErroConsecutivo += 1;
      // Só loga se já estava conectado antes (queda real) ou é a primeira tentativa
      if (estavConectado || wsErroConsecutivo === 1) {
        console.warn(`[Will Dados Robô] WebSocket ${estavConectado ? 'desconectado' : 'indisponível'}; reconexão em ${Math.round(wsReconnectDelay / 1000)}s`);
      }
      avisarWsParaUis('WS_DISCONNECTED', estadoWs());
      agendarReconexaoWs();
    };

    ws.onerror = () => {
      // Silencioso — o onclose já trata reconexão.
      // Chrome sempre mostra ERR_CONNECTION_REFUSED no console, não há como suprimir.
    };
  } catch (error) {
    wsErroConsecutivo += 1;
    if (wsErroConsecutivo <= 1) {
      console.warn('[Will Dados Robô] WebSocket servidor não disponível; tentando reconectar em background...');
    }
    agendarReconexaoWs();
  }
}

function enviarParaWebSocket(payload) {
  if (!ws || ws.readyState !== WebSocket.OPEN) return false;
  ws.send(JSON.stringify(payload));
  return true;
}

// --- Lifecycle ---

chrome.runtime.onInstalled.addListener(async () => {
  console.log('[Will Dados Robô] Instalado/atualizado');
  // WS externo é lazy — só conecta quando solicitado (CONNECT_WS ou SEND_TO_WS)
  if (chrome.sidePanel?.setPanelBehavior) {
    await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error) => {
      console.warn('[Will Dados Robô] Falha ao configurar sidePanel:', error?.message || error);
    });
  }
});

chrome.runtime.onStartup?.addListener(async () => {
  // WS externo é lazy — não conecta automaticamente
  if (chrome.sidePanel?.setPanelBehavior) {
    await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});
  }
});

chrome.action.onClicked.addListener(async (tab) => {
  // Fallback para builds sem default_popup — abre direto o painel lateral.
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

// --- Message Router ---

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // WebSocket: enviar dados
  if (request?.action === 'SEND_TO_WS') {
    const ok = enviarParaWebSocket(request.payload || {});
    if (!ok) conectarWebSocketExterno();
    sendResponse({
      success: ok,
      ws: estadoWs(),
      message: ok ? 'Enviado ao WebSocket.' : 'WebSocket não conectado; reconexão agendada.'
    });
    return true;
  }

  // WebSocket: estado
  if (request?.action === 'GET_WS_STATE') {
    sendResponse({ success: true, ws: estadoWs() });
    return true;
  }

  // WebSocket: forçar conexão (reset de retries)
  if (request?.action === 'CONNECT_WS') {
    wsErroConsecutivo = 0;
    wsMaxRetriesAtingido = false;
    wsReconnectDelay = 3000;
    conectarWebSocketExterno(true).then(() => sendResponse({ success: true, ws: estadoWs() }));
    return true;
  }

  // Proxy: reconfigurar
  if (request?.action === 'RECONFIG_PROXY') {
    configurarProxy().then(() => sendResponse({ success: true, message: 'Proxy reconfigurado' }));
    return true;
  }

  // Overlay mode
  if (request?.action === 'ENTER_OVERLAY_MODE') {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      try {
        const tab = tabs?.[0];
        if (!tab?.id) throw new Error('Nenhuma aba ativa encontrada.');
        const stored = await chrome.storage.local.get(['willDadosConfig']);
        const config = { ...(stored.willDadosConfig || {}), showOverlay: true };
        await chrome.storage.local.set({ willDadosConfig: config });
        await chrome.tabs.sendMessage(tab.id, { action: 'UPDATE_CONFIG', config }).catch(() => null);
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

  // Side panel
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

  // Pass-through para content script
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

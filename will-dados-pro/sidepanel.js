// sidepanel.js
// Bridge canônico entre o iframe do app e a extensão.
// Regras:
// - app -> extension: source __BETIA_APP__
// - extension -> app: source __BETIA_EXT__
// - sync sempre entra no app como SYNC_DATA

const frame = document.getElementById('app-frame');
const syncBtn = document.getElementById('sync-btn');
const pauseBtn = document.getElementById('pause-btn');
const resumeBtn = document.getElementById('resume-btn');
const platformBadge = document.getElementById('platform-status');
const studioBadge = document.getElementById('studio-status');
const debugBadge = document.getElementById('debug-status');
const offlineState = document.getElementById('offline-state');
const offlineMessage = document.getElementById('offline-message');
const retryStudioBtn = document.getElementById('retry-studio-btn');
const APP_SOURCE = '__BETIA_APP__';
const EXT_SOURCE = '__BETIA_EXT__';
const APP_URL_STORAGE_KEY = 'betia_sidepanel_app_url';
const DEFAULT_APP_CANDIDATES = [
  'http://127.0.0.1:4173?mode=robo&type=bacbo&ui=classic',
  'http://localhost:4173?mode=robo&type=bacbo&ui=classic',
  'http://127.0.0.1:3000?mode=robo&type=bacbo&ui=classic',
  'http://localhost:3000?mode=robo&type=bacbo&ui=classic',
];
const RECONNECT_INTERVAL_MS = 2500;

let appOrigin = null;
let activeAppUrl = null;
let reconnectTimer = null;

function setStudioStatus(text, isActive = false) {
  studioBadge.textContent = text;
  studioBadge.classList.toggle('active', Boolean(isActive));
  studioBadge.classList.toggle('offline', !isActive);
}

function showOfflineState(message) {
  offlineMessage.textContent = message;
  offlineState.hidden = false;
}

function hideOfflineState() {
  offlineState.hidden = true;
}

function scheduleReconnect() {
  if (reconnectTimer) return;
  reconnectTimer = window.setTimeout(() => {
    reconnectTimer = null;
    bootAppFrame({ silent: true }).catch((error) => {
      console.error('[Bet IA Sidepanel] Falha ao tentar reconectar o Studio.', error);
    });
  }, RECONNECT_INTERVAL_MS);
}

function clearReconnectTimer() {
  if (!reconnectTimer) return;
  window.clearTimeout(reconnectTimer);
  reconnectTimer = null;
}

function buildCandidateUrls() {
  const params = new URLSearchParams(window.location.search);
  const explicitAppUrl = params.get('appUrl');
  return [explicitAppUrl, ...DEFAULT_APP_CANDIDATES].filter(Boolean);
}

function probeAppUrl(url) {
  return new Promise((resolve) => {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.timeout = 2500;
      xhr.onload = () => resolve(xhr.status >= 200 && xhr.status < 500);
      xhr.onerror = () => resolve(false);
      xhr.ontimeout = () => resolve(false);
      xhr.send();
    } catch (_) {
      resolve(false);
    }
  });
}

async function resolveInitialAppUrl() {
  const stored = await chrome.storage.local
    .get([APP_URL_STORAGE_KEY])
    .then((result) => result?.[APP_URL_STORAGE_KEY] || null)
    .catch(() => null);

  const candidates = [stored, ...buildCandidateUrls()].filter(Boolean);

  for (const url of candidates) {
    // eslint-disable-next-line no-await-in-loop
    const ok = await probeAppUrl(url);
    if (ok) return url;
  }

  return null;
}

async function bootAppFrame({ silent = false } = {}) {
  if (!silent) {
    setStudioStatus('Conectando Studio...', false);
  }
  const resolvedUrl = await resolveInitialAppUrl();

  if (!resolvedUrl) {
    activeAppUrl = null;
    appOrigin = null;
    frame.src = 'about:blank';
    setStudioStatus('Studio offline', false);
    showOfflineState(
      'Nenhum Studio local respondeu. Suba o preview em 4173 ou o dev server em 3000.',
    );
    scheduleReconnect();
    console.error(
      '[Bet IA Sidepanel] Nenhum Studio local respondeu. Tente 4173 (preview) ou 3000 (dev).',
    );
    return;
  }

  clearReconnectTimer();
  activeAppUrl = resolvedUrl;
  appOrigin = new URL(resolvedUrl).origin;
  if (frame.src !== resolvedUrl) {
    frame.src = resolvedUrl;
  }
  hideOfflineState();
  setStudioStatus('Studio conectado', true);
  chrome.storage.local.set({ [APP_URL_STORAGE_KEY]: resolvedUrl }).catch(() => {});
  console.log('[Bet IA Sidepanel] Studio resolvido em:', resolvedUrl);
}

function postToApp(message) {
  if (!frame.contentWindow) return;

  const payload = { source: EXT_SOURCE, ...message };

  // Resolve a origem atual do iframe antes de escolher o targetOrigin.
  // Se a origem ainda não está disponível (iframe carregando) ou diverge
  // da origem do app, usamos '*' que é seguro: o postMessage ainda vai
  // apenas para frame.contentWindow. A validação de autenticidade fica
  // no app via source === EXT_SOURCE.
  let targetOrigin = '*';
  try {
    const currentOrigin = frame.contentWindow.location?.origin;
    if (currentOrigin && appOrigin && currentOrigin === appOrigin) {
      targetOrigin = appOrigin;
    }
  } catch (_) {
    // Cross-origin access ao location bloqueado → manter '*'
  }

  try {
    frame.contentWindow.postMessage(payload, targetOrigin);
  } catch (_) {
    // Fallback absoluto — não logar para não poluir console
    try { frame.contentWindow.postMessage(payload, '*'); } catch (_) {}
  }
}

function updateDebuggerUI(isAttached) {
  if (isAttached) {
    debugBadge.style.display = 'block';
    pauseBtn.style.opacity = '1';
    resumeBtn.style.opacity = '1';
    return;
  }

  debugBadge.style.display = 'none';
  pauseBtn.style.opacity = '0.3';
  resumeBtn.style.opacity = '0.3';
}

function updatePlatformUI(platform) {
  if (platform && platform.id !== 'unknown') {
    platformBadge.textContent = platform.name;
    platformBadge.classList.add('active');
    return;
  }

  platformBadge.textContent = 'Não Detectada';
  platformBadge.classList.remove('active');
}

function getActiveTabId() {
  return chrome.tabs
    .query({ active: true, currentWindow: true })
    .then((tabs) => tabs?.[0]?.id || null)
    .catch(() => null);
}

function needsActiveBancaTab(type) {
  return [
    'GET_GAME_DATA',
    'REQUEST_GAME_DATA',
    'EXECUTE_BET',
    'MANUAL_SYNC',
    'START_CALIBRATION',
    'CANCEL_CALIBRATION',
    'RESET_CALIBRATION',
  ].includes(type);
}

syncBtn.addEventListener('click', () => {
  console.log('[Bet IA Sidepanel] Solicitando sincronização manual...');
  syncBtn.textContent = 'SINCRONIZANDO...';
  syncBtn.disabled = true;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs?.[0]?.id;
    chrome.runtime
      .sendMessage({ type: 'MANUAL_SYNC', tabId })
      .then((response) => {
        if (response?.data) {
          postToApp({
            type: 'SYNC_DATA',
            data: response.data,
          });
        }
      })
      .finally(() => {
        setTimeout(() => {
          syncBtn.textContent = 'SINCRONIZAR';
          syncBtn.disabled = false;
        }, 1000);
      });
  });
});

pauseBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'DEBUGGER_PAUSE' });
});

resumeBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'DEBUGGER_RESUME' });
});

retryStudioBtn.addEventListener('click', () => {
  clearReconnectTimer();
  bootAppFrame().catch((error) => {
    console.error('[Bet IA Sidepanel] Falha ao tentar reconectar o Studio.', error);
  });
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'PLATFORM_DETECTED') {
    updatePlatformUI(message.platform);
  }

  if (message.type === 'DEBUGGER_STATUS') {
    updateDebuggerUI(message.attached);
  }

  if (message.type === 'SYNC_DATA' && message.data) {
    postToApp({
      type: 'SYNC_DATA',
      data: message.data,
    });
    return;
  }

  postToApp(message);
});

window.addEventListener('message', async (event) => {
  if (event.source !== frame.contentWindow) {
    return;
  }

  if (!appOrigin || event.origin !== appOrigin) {
    return;
  }

  if (!event.data?.type || event.data.source !== APP_SOURCE) {
    return;
  }

  const { type, source: _source, emittedAt: _emittedAt, ...payload } = event.data;

  const tabId = needsActiveBancaTab(type) ? await getActiveTabId() : null;

  chrome.runtime
    .sendMessage({ type, ...payload, ...(tabId ? { tabId } : {}) })
    .then((response) => {
      if (!response) {
        if (type === 'EXECUTE_BET') {
          postToApp({
            type: 'EXECUTE_BET_RESPONSE',
            ok: false,
            error: 'Background não retornou resposta para EXECUTE_BET.',
          });
        }
        return;
      }

      if ((type === 'GET_GAME_DATA' || type === 'REQUEST_GAME_DATA') && response.data) {
        postToApp({
          type: 'GET_GAME_DATA_RESPONSE',
          data: response.data,
        });
        return;
      }

      postToApp({
        type: `${type}_RESPONSE`,
        ...response,
      });
    })
    .catch((error) => {
      postToApp({
        type: `${type}_RESPONSE`,
        ok: false,
        error: error?.message || 'Falha ao enviar comando para o background da extensão.',
      });
    });
});

frame.addEventListener('load', () => {
  if (!activeAppUrl) {
    return;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs?.[0]?.id;
    console.log('[Bet IA Sidepanel] App carregada.', { tabId, appUrl: activeAppUrl });
    chrome.runtime.sendMessage({ type: 'PANEL_OPENED', tabId });
  });
});

window.addEventListener('beforeunload', () => {
  clearReconnectTimer();
  chrome.runtime.sendMessage({ type: 'PANEL_CLOSED' }).catch(() => {});
});

bootAppFrame().catch((error) => {
  activeAppUrl = null;
  appOrigin = null;
  frame.src = 'about:blank';
  setStudioStatus('Studio offline', false);
  console.error('[Bet IA Sidepanel] Falha ao inicializar o Studio.', error);
});

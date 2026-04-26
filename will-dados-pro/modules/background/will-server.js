// modules/background/will-server.js
// Conector com servidor V7 (will_server_minimal.py)
// Faz polling do estado do robô + envia comandos

const SERVER_URL = 'http://127.0.0.1:5000'; // Bridge V2 (proxy)
const POLL_INTERVAL_MS = 1000;

let pollInterval = null;
let serverOnline = false;
let lastServerState = null;

export async function checkServerHealth() {
  try {
    const response = await fetch(`${SERVER_URL}/health`, { timeout: 3000 });
    const ok = response.status === 200;

    if (ok && !serverOnline) {
      console.log('[Will Server] ✅ Servidor conectado');
      serverOnline = true;
    }

    return ok;
  } catch (e) {
    if (serverOnline) {
      console.log('[Will Server] ❌ Servidor desconectado');
      serverOnline = false;
    }
    return false;
  }
}

export async function startRobo() {
  try {
    const response = await fetch(`${SERVER_URL}/api/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      console.log('[Will Server] 🚀 Robô iniciado');
      startPolling();
      return { ok: true };
    }

    return { ok: false, error: await response.text() };
  } catch (e) {
    console.error('[Will Server] Erro ao iniciar:', e.message);
    return { ok: false, error: e.message };
  }
}

export async function stopRobo() {
  try {
    const response = await fetch(`${SERVER_URL}/api/stop`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      console.log('[Will Server] ⏹ Robô parado');
      stopPolling();
      return { ok: true };
    }

    return { ok: false, error: await response.text() };
  } catch (e) {
    console.error('[Will Server] Erro ao parar:', e.message);
    return { ok: false, error: e.message };
  }
}

export async function getServerState() {
  try {
    const response = await fetch(`${SERVER_URL}/api/state`);
    const data = await response.json();

    lastServerState = data;

    // Converte pra formato que extensão espera
    return {
      ok: true,
      data: {
        status: data.status,
        timer: 0,
        saldo: data.saldo_atual,
        ciclo: data.ciclo,
        historico: data.historico,
        platformName: 'betboom',
      },
    };
  } catch (e) {
    console.error('[Will Server] Erro ao obter estado:', e.message);
    return { ok: false, error: e.message };
  }
}

function startPolling() {
  if (pollInterval) return;

  console.log('[Will Server] 🔄 Polling iniciado');

  pollInterval = setInterval(async () => {
    const state = await getServerState();

    if (state.ok) {
      // Envia state pra sidepanel
      chrome.runtime.sendMessage({
        type: 'SYNC_DATA',
        data: state.data,
      }).catch(() => {});
    }
  }, POLL_INTERVAL_MS);
}

function stopPolling() {
  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
    console.log('[Will Server] ⏸ Polling parado');
  }
}

// Setup: monitora saúde do servidor periodicamente
setInterval(() => {
  checkServerHealth().catch(() => {});
}, 10000);

// Listener pra comandos da sidepanel
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'ROBOT_START') {
    startRobo().then(sendResponse);
    return true;
  }

  if (message.type === 'ROBOT_STOP') {
    stopRobo().then(sendResponse);
    return true;
  }

  if (message.type === 'ROBOT_STATE') {
    getServerState().then(sendResponse);
    return true;
  }

  return false;
});

console.log('[Will Server] Module carregado');

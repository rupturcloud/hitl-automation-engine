// ============================================================
// Bet IA — Content Script v3.0.0
// Arquitetura: "Agnostic Observer" com Multi-Source Fusion
//
// PRIORIDADE DOS DADOS (alta → baixa):
//   1. WebSocket Interceptor  — dados brutos do jogo (mais rápido)
//   2. DOM Observer           — MutationObserver em elementos-chave
//   3. Vision / Screenshot    — captura de tela (layout-agnostic)
//
// Se o layout da banca mudar completamente, o WebSocket e/ou o
// Vision continuam funcionando — o sistema nunca para por uma
// única fonte de dados.
// ============================================================

console.log('[Bet IA] Content Script v3.0.0 iniciado.');

// ============================================================
// ESTADO INTERNO
// ============================================================
const state = {
  overlay: null,           // Referência ao elemento DOM do overlay
  overlayVisible: false,
  robotState: 'IDLE',
  phase: 'WAIT',
  countdown: 0,
  confidence: 0,
  wsData: null,            // Último dado via WebSocket
  domData: null,           // Último dado via DOM
  fusedData: null,         // Dado final (fusão por prioridade)
  lastFusedAt: 0,
};

// ============================================================
// FONTE 1: WEBSOCKET INTERCEPTOR
// Injeta um proxy no WebSocket nativo da página para capturar
// mensagens em tempo real, independente do layout visual.
// ============================================================
function installWebSocketInterceptor() {
  const script = document.createElement('script');
  script.textContent = `
    (function() {
      const OriginalWebSocket = window.WebSocket;
      window.WebSocket = function(url, protocols) {
        const ws = protocols ? new OriginalWebSocket(url, protocols) : new OriginalWebSocket(url);
        ws.addEventListener('message', function(event) {
          try {
            const data = JSON.parse(event.data);
            // Detecta padrões comuns de plataformas de jogo (Evolution, etc.)
            if (data && (data.gameState || data.result || data.countdown || data.balance || data.action)) {
              window.postMessage({
                type: 'BETIA_WS_DATA',
                payload: data,
                source: 'websocket',
                ts: Date.now()
              }, '*');
            }
          } catch(e) {
            // Dados não-JSON (binário, etc.) — ignora
          }
        });
        return ws;
      };
      // Preserva propriedades estáticas
      Object.keys(OriginalWebSocket).forEach(key => {
        window.WebSocket[key] = OriginalWebSocket[key];
      });
      window.WebSocket.prototype = OriginalWebSocket.prototype;
      console.log('[Bet IA WS Interceptor] Proxy instalado.');
    })();
  `;
  (document.head || document.documentElement).appendChild(script);
  script.remove();
}
installWebSocketInterceptor();

// Ouve mensagens do interceptor injetado
window.addEventListener('message', (event) => {
  if (event.source !== window) return;

  if (event.data?.type === 'BETIA_WS_DATA') {
    const raw = event.data.payload;
    // Normaliza dados — tenta extrair campos padrão de múltiplas plataformas
    const normalized = normalizeGameData(raw, 'ws');
    if (normalized) {
      state.wsData = normalized;
      fuseSources();
    }
  }
});

// ============================================================
// FONTE 2: DOM OBSERVER (MutationObserver)
// Monitora mudanças no DOM sem depender de seletores fixos.
// Usa uma lista de heurísticas para identificar elementos.
// ============================================================
const DOM_HEURISTICS = {
  // Timer: busca por texto numérico crescente/decrescente em elementos pequenos
  timer: [
    '[data-betia-id="timer"]',
    '[class*="timer"]',
    '[class*="countdown"]',
    '[class*="clock"]',
    '[id*="timer"]',
    '[id*="countdown"]',
  ],
  // Saldo: busca por texto monetário
  balance: [
    '[data-betia-id="balance"]',
    '[class*="balance"]',
    '[class*="wallet"]',
    '[class*="credits"]',
    '[class*="saldo"]',
    '[id*="balance"]',
  ],
  // Resultado: busca por indicadores de resultado
  result: [
    '[data-betia-result]',
    '[class*="result"]',
    '[class*="winner"]',
    '[class*="outcome"]',
  ],
};

function queryHeuristic(heuristics) {
  for (const selector of heuristics) {
    try {
      const el = document.querySelector(selector);
      if (el && el.textContent?.trim()) return el;
    } catch(e) {}
  }
  return null;
}

function readDOMData() {
  const timerEl = queryHeuristic(DOM_HEURISTICS.timer);
  const balanceEl = queryHeuristic(DOM_HEURISTICS.balance);
  const resultEl = queryHeuristic(DOM_HEURISTICS.result);

  const timerText = timerEl?.textContent?.trim() || '';
  const balanceText = balanceEl?.textContent?.trim() || '';
  const resultText = resultEl?.getAttribute?.('data-betia-result') || resultEl?.textContent?.trim() || '';

  // Extrai número do timer
  const timerMatch = timerText.match(/(\d+)/);
  const countdown = timerMatch ? parseFloat(timerMatch[1]) : null;

  // Extrai número do saldo (aceita R$, €, $, etc.)
  const balanceMatch = balanceText.replace(/\s/g, '').match(/([\d.,]+)/);
  const balance = balanceMatch
    ? parseFloat(balanceMatch[1].replace(',', '.'))
    : null;

  // Normaliza resultado
  const result = normalizeResult(resultText);

  if (countdown === null && balance === null && !result) return null;

  return { countdown, balance, result, source: 'dom', ts: Date.now() };
}

let domObserver = null;
function installDOMObserver() {
  domObserver = new MutationObserver(() => {
    const data = readDOMData();
    if (data) {
      state.domData = data;
      fuseSources();
    }
  });
  domObserver.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
  });
}

// Aguarda o DOM estar pronto antes de observar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', installDOMObserver);
} else {
  installDOMObserver();
}

// ============================================================
// FONTE 3: VISION / SCREENSHOT (layout-agnostic)
// A cada 2s, captura um screenshot da aba e envia para o
// background processar. Mais lento, mas imune a mudanças de layout.
// (Atualmente envia o dataURL — o background/side panel faz OCR)
// ============================================================
function captureAndSendScreenshot() {
  chrome.runtime.sendMessage({
    type: 'REQUEST_SCREENSHOT',
  }).catch(() => {});
}
setInterval(captureAndSendScreenshot, 2000);

// ============================================================
// FUSÃO DE FONTES (prioridade: ws > dom > vision)
// ============================================================
function fuseSources() {
  // Usamos a fonte disponível mais prioritária para cada campo
  const ws = state.wsData;
  const dom = state.domData;

  const fused = {
    countdown: ws?.countdown ?? dom?.countdown ?? null,
    balance:   ws?.balance   ?? dom?.balance   ?? null,
    result:    ws?.result    ?? dom?.result     ?? null,
    source:    ws ? 'ws+dom' : dom ? 'dom' : 'none',
    ts: Date.now(),
  };

  state.fusedData = fused;
  state.lastFusedAt = fused.ts;

  // Envia ao background (que repassa ao Side Panel)
  chrome.runtime.sendMessage({
    type: 'GAME_DATA_UPDATE',
    data: fused,
  }).catch(() => {});
}

// ============================================================
// NORMALIZAÇÃO DE DADOS
// ============================================================
function normalizeGameData(raw, source) {
  if (!raw) return null;

  // Tenta mapear campos de múltiplas plataformas (Evolution, Pragmatic, etc.)
  const countdown =
    raw.countdown ?? raw.timer ?? raw.timeLeft ?? raw.remainingTime ?? null;
  const balance =
    raw.balance ?? raw.credits ?? raw.wallet ?? raw.accountBalance ?? null;
  const resultRaw =
    raw.result ?? raw.winner ?? raw.outcome ?? raw.lastResult ?? null;

  if (countdown === null && balance === null && !resultRaw) return null;

  return {
    countdown: countdown !== null ? parseFloat(countdown) : null,
    balance:   balance !== null   ? parseFloat(balance)   : null,
    result:    normalizeResult(resultRaw),
    source,
    ts: Date.now(),
  };
}

function normalizeResult(raw) {
  if (!raw) return null;
  const r = String(raw).toUpperCase().trim();
  if (r.includes('PLAYER') || r === 'P' || r.includes('JOGADOR')) return 'PLAYER';
  if (r.includes('BANKER') || r === 'B' || r.includes('BANCA'))   return 'BANKER';
  if (r.includes('TIE')    || r === 'T' || r.includes('EMPATE'))  return 'TIE';
  return null;
}

// ============================================================
// OVERLAY DE BLOQUEIO DA BANCA
// Injetado quando o Side Panel está ativo com o robô operando.
// ============================================================
const PHASE_CONFIG = {
  IDLE:      { color: 'rgba(0,0,0,0.0)',   label: '',                       pulse: false },
  ANALYZING: { color: 'rgba(6,10,30,0.75)', label: '🔍 Analisando Padrão',  pulse: false, accent: '#6366f1' },
  PROPOSING: { color: 'rgba(10,6,30,0.80)', label: '⚡ Decisão Detectada',  pulse: true,  accent: '#a855f7' },
  EXECUTING: { color: 'rgba(20,0,0,0.88)', label: '🔒 EXECUTANDO — Não Toque', pulse: true,  accent: '#ef4444' },
  WAITING:   { color: 'rgba(0,8,20,0.72)', label: '⏳ Aguardando Resultado', pulse: false, accent: '#0ea5e9' },
};

function createOverlay() {
  if (state.overlay) return;

  const el = document.createElement('div');
  el.id = '__betia_overlay__';
  el.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 2147483647;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: 'Inter', -apple-system, sans-serif;
    transition: background 0.5s ease, opacity 0.4s ease;
    opacity: 0;
  `;

  // Aura de cor (4 cantos)
  el.innerHTML = `
    <div id="__betia_aura_tl__" style="position:absolute;top:0;left:0;width:300px;height:300px;border-radius:50%;filter:blur(80px);opacity:0;transition:all 0.6s;"></div>
    <div id="__betia_aura_br__" style="position:absolute;bottom:0;right:0;width:300px;height:300px;border-radius:50%;filter:blur(80px);opacity:0;transition:all 0.6s;"></div>
    <div id="__betia_aura_tr__" style="position:absolute;top:0;right:0;width:200px;height:200px;border-radius:50%;filter:blur(60px);opacity:0;transition:all 0.6s;"></div>
    <div id="__betia_aura_bl__" style="position:absolute;bottom:0;left:0;width:200px;height:200px;border-radius:50%;filter:blur(60px);opacity:0;transition:all 0.6s;"></div>
    
    <div id="__betia_badge__" style="
      position:absolute;
      top: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0,0,0,0.7);
      border: 1px solid rgba(255,255,255,0.1);
      backdrop-filter: blur(20px);
      border-radius: 100px;
      padding: 8px 20px;
      display: flex;
      align-items: center;
      gap: 10px;
      opacity: 0;
      transition: opacity 0.4s;
    ">
      <div id="__betia_dot__" style="width:8px;height:8px;border-radius:50%;background:#6366f1;box-shadow:0 0 10px #6366f1;"></div>
      <span id="__betia_label__" style="color:#fff;font-size:11px;font-weight:800;letter-spacing:0.15em;text-transform:uppercase;white-space:nowrap;">Bet IA Ativo</span>
      <span id="__betia_countdown__" style="color:rgba(255,255,255,0.4);font-size:11px;font-weight:700;font-variant-numeric:tabular-nums;"></span>
    </div>

    <div id="__betia_confidence__" style="
      position:absolute;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 8px;
      opacity: 0;
      transition: opacity 0.4s;
    ">
      <span style="color:rgba(255,255,255,0.3);font-size:9px;font-weight:800;letter-spacing:0.2em;text-transform:uppercase;">Confiança</span>
      <div style="width:80px;height:3px;background:rgba(255,255,255,0.1);border-radius:10px;overflow:hidden;">
        <div id="__betia_confbar__" style="height:100%;background:#6366f1;border-radius:10px;transition:width 0.5s;width:0%;"></div>
      </div>
      <span id="__betia_confpct__" style="color:rgba(255,255,255,0.5);font-size:9px;font-weight:800;font-variant-numeric:tabular-nums;">0%</span>
    </div>
  `;

  document.documentElement.appendChild(el);
  state.overlay = el;
}

function updateOverlay({ robotState, phase, countdown, confidence }) {
  if (!state.overlay) createOverlay();

  const cfg = PHASE_CONFIG[robotState] || PHASE_CONFIG.IDLE;
  const el = state.overlay;

  // Se IDLE e sem fase ativa, some completamente
  if (robotState === 'IDLE') {
    el.style.opacity = '0';
    el.style.pointerEvents = 'none';
    state.overlayVisible = false;
    return;
  }

  el.style.background = cfg.color;
  el.style.opacity = '1';
  el.style.pointerEvents = robotState === 'EXECUTING' ? 'all' : 'none';
  state.overlayVisible = true;

  // Auras com a cor do estado
  const accent = cfg.accent || '#6366f1';
  ['tl', 'br', 'tr', 'bl'].forEach(pos => {
    const aura = document.getElementById(`__betia_aura_${pos}__`);
    if (aura) {
      aura.style.background = accent;
      aura.style.opacity = cfg.pulse ? '0.25' : '0.12';
    }
  });

  // Animação de pulse nas auras
  if (cfg.pulse && !el.__pulseInterval) {
    let toggle = false;
    el.__pulseInterval = setInterval(() => {
      toggle = !toggle;
      ['tl', 'br', 'tr', 'bl'].forEach(pos => {
        const aura = document.getElementById(`__betia_aura_${pos}__`);
        if (aura) aura.style.opacity = toggle ? '0.35' : '0.15';
      });
    }, 800);
  } else if (!cfg.pulse && el.__pulseInterval) {
    clearInterval(el.__pulseInterval);
    el.__pulseInterval = null;
  }

  // Badge
  const badge = document.getElementById('__betia_badge__');
  const dot = document.getElementById('__betia_dot__');
  const label = document.getElementById('__betia_label__');
  const countdownEl = document.getElementById('__betia_countdown__');

  if (badge) badge.style.opacity = '1';
  if (badge) badge.style.borderColor = `${accent}40`;
  if (dot) { dot.style.background = accent; dot.style.boxShadow = `0 0 10px ${accent}`; }
  if (label) { label.textContent = cfg.label; label.style.color = '#fff'; }
  if (countdownEl && countdown != null) {
    countdownEl.textContent = `${parseFloat(countdown).toFixed(1)}s`;
  }

  // Confiança
  const confDiv = document.getElementById('__betia_confidence__');
  const confBar = document.getElementById('__betia_confbar__');
  const confPct = document.getElementById('__betia_confpct__');
  const showConf = confidence != null && robotState !== 'IDLE' && robotState !== 'WAITING';

  if (confDiv) confDiv.style.opacity = showConf ? '1' : '0';
  if (confBar) { confBar.style.width = `${confidence ?? 0}%`; confBar.style.background = accent; }
  if (confPct) confPct.textContent = `${Math.round(confidence ?? 0)}%`;
}

function removeOverlay() {
  if (state.overlay) {
    state.overlay.style.opacity = '0';
    setTimeout(() => {
      state.overlay?.remove();
      state.overlay = null;
      state.overlayVisible = false;
    }, 500);
  }
}

// ============================================================
// LISTENERS — Comandos vindos do Background
// ============================================================
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  const { type } = message;

  if (type === 'INJECT_OVERLAY') {
    createOverlay();
    updateOverlay({ robotState: message.state || 'IDLE', phase: message.phase, countdown: message.countdown, confidence: message.confidence });
    sendResponse({ ok: true });
    return true;
  }

  if (type === 'UPDATE_OVERLAY') {
    updateOverlay({
      robotState: message.state,
      phase: message.phase,
      countdown: message.countdown,
      confidence: message.confidence,
    });
    sendResponse({ ok: true });
    return true;
  }

  if (type === 'REMOVE_OVERLAY') {
    removeOverlay();
    sendResponse({ ok: true });
    return true;
  }

  if (type === 'GET_GAME_DATA') {
    // Retorna os dados mais frescos disponíveis (fusão)
    sendResponse(state.fusedData || { error: 'Sem dados disponíveis ainda.' });
    return true;
  }

  if (type === 'EXECUTE_BET') {
    const actionId = `bet-${message.target?.toLowerCase()}`;
    const btn = document.querySelector(`[data-betia-id="${actionId}"]`);
    if (btn) {
      btn.click();
      sendResponse({ success: true, message: `Aposta ${actionId} executada via DOM.` });
    } else {
      sendResponse({ success: false, message: `Elemento ${actionId} não encontrado no DOM.` });
    }
    return true;
  }

  return true;
});

// ============================================================
// HEARTBEAT — Envia dados ao background periodicamente
// ============================================================
setInterval(() => {
  const data = readDOMData();
  if (data) {
    state.domData = data;
    fuseSources();
  }
  // Notifica que o content script está vivo
  window.postMessage({ type: 'BETIA_HEARTBEAT', ts: Date.now() }, '*');
}, 1000);

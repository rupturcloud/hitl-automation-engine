// content.js — UI principal + bridge entre frame principal e iframes da mesa.
(function () {
  'use strict';

  const Core = globalThis.WillDadosRobo;
  const Clicker = globalThis.WillDadosAposta;
  if (!Core) {
    console.error('[Will Dados Robô] Core não carregado.');
    return;
  }

  const IS_TOP_FRAME = window.top === window;
  const FRAME_ID = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const SNAPSHOT_TYPE = '__WILL_DADOS_FRAME_SNAPSHOT__';
  const COMMAND_TYPE = '__WILL_DADOS_FRAME_COMMAND__';
  const COMMAND_RESULT_TYPE = '__WILL_DADOS_FRAME_COMMAND_RESULT__';
  const WS_EVENT_TYPE = '__WILL_DADOS_WS_MESSAGE__';

  const frameSnapshots = new Map();
  const pendingCommands = new Map();
  const wsState = {
    installed: false,
    history: [],
    roundId: null,
    lastResult: null,
    bettingOpen: null,
    balance: null,
    lastMessageAt: 0,
    lastHash: ''
  };

  let overlay = null;
  let observerStarted = false;
  let lastActionAt = 0;
  let lastHistoryHash = '';
  let lastHistoryCount = 0;
  let ultimoPadrao = '';
  let overlayPinnedLeft = true;
  let wsListenerStarted = false;

  function instalarWebSocketBridgeMainWorld() {
    if (wsState.installed) return;
    wsState.installed = true;
    try {
      const script = document.createElement('script');
      script.textContent = `
        (() => {
          if (window.__WILL_DADOS_WS_WRAPPED__) return;
          window.__WILL_DADOS_WS_WRAPPED__ = true;
          const OriginalWebSocket = window.WebSocket;
          function WrappedWebSocket(url, protocols) {
            const ws = protocols === undefined ? new OriginalWebSocket(url) : new OriginalWebSocket(url, protocols);
            const urlText = String(url || '');
            if (/bacbo|bac-bo|BacBo|evo-games/i.test(urlText)) {
              ws.addEventListener('message', (event) => {
                let payload = event.data;
                let kind = typeof payload;
                if (payload instanceof Blob) kind = 'blob';
                if (payload instanceof ArrayBuffer) kind = 'arraybuffer';
                if (typeof payload !== 'string') {
                  try { payload = String(payload); } catch (_) { payload = ''; }
                }
                document.dispatchEvent(new CustomEvent('${WS_EVENT_TYPE}', {
                  detail: { direction: 'received', url: urlText, kind, data: payload, ts: Date.now() }
                }));
              });
              const originalSend = ws.send;
              ws.send = function(data) {
                let payload = data;
                let kind = typeof payload;
                if (payload instanceof Blob) kind = 'blob';
                if (payload instanceof ArrayBuffer) kind = 'arraybuffer';
                if (typeof payload !== 'string') {
                  try { payload = String(payload); } catch (_) { payload = ''; }
                }
                document.dispatchEvent(new CustomEvent('${WS_EVENT_TYPE}', {
                  detail: { direction: 'sent', url: urlText, kind, data: payload, ts: Date.now() }
                }));
                return originalSend.apply(this, arguments);
              };
            }
            return ws;
          }
          WrappedWebSocket.prototype = OriginalWebSocket.prototype;
          Object.setPrototypeOf(WrappedWebSocket, OriginalWebSocket);
          window.WebSocket = WrappedWebSocket;
        })();
      `;
      (document.documentElement || document.head || document).appendChild(script);
      script.remove();
    } catch (error) {
      console.warn('[Will Dados Robô] Falha ao injetar wrapper WS:', error?.message || error);
    }
  }

  instalarWebSocketBridgeMainWorld();

  function isLikelyBacBoPage() {
    const text = (document.body?.innerText || '').toLowerCase();
    const href = location.href.toLowerCase();
    return href.includes('bacbo') || href.includes('bac-bo') || href.includes('bac_bo') ||
      (text.includes('player') && text.includes('banker')) ||
      (text.includes('jogador') && text.includes('banca')) ||
      text.includes('bac bo');
  }

  function isVisible(el) {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
  }

  function classifyResultElement(el) {
    const text = `${el.textContent || ''} ${el.getAttribute('data-result') || ''} ${el.getAttribute('aria-label') || ''} ${el.getAttribute('title') || ''}`.trim().toLowerCase();
    const cls = `${el.className || ''} ${el.id || ''}`.toLowerCase();
    const style = getComputedStyle(el);
    const colors = `${style.backgroundColor || ''} ${style.color || ''} ${style.fill || ''}`.toLowerCase();
    const hay = `${text} ${cls} ${colors}`;

    if (/\b(player|jogador|blue|azul|\bp\b)/i.test(hay)) return 'P';
    if (/\b(banker|banca|red|vermelho|\bb\b)/i.test(hay)) return 'B';
    if (/\b(tie|empate|yellow|gold|amarelo|\bt\b)/i.test(hay)) return 'T';

    // Heurística RGB aproximada para círculos do road.
    const nums = (colors.match(/\d+(?:\.\d+)?/g) || []).map(Number);
    for (let i = 0; i + 2 < nums.length; i += 3) {
      const [r, g, b] = nums.slice(i, i + 3);
      if (b > 110 && b > r * 1.25 && b > g * 1.05) return 'P';
      if (r > 130 && r > g * 1.4 && r > b * 1.15) return 'B';
      if (r > 150 && g > 110 && b < 120) return 'T';
    }
    return null;
  }

  function orderKey(el) {
    const r = el.getBoundingClientRect();
    // Caminho de contas: coluna esquerda→direita e topo→baixo.
    return `${String(Math.round(r.left / 6)).padStart(5, '0')}:${String(Math.round(r.top / 6)).padStart(5, '0')}`;
  }

  function cellKey(el) {
    const r = el.getBoundingClientRect();
    return `${Math.round(r.left / 4)}:${Math.round(r.top / 4)}:${Math.round(r.width / 4)}:${Math.round(r.height / 4)}`;
  }

  function extrairBeadRoad() {
    const selectors = [
      '.bead-road .cell', '.bead-road span', '.bead-plate .road-item', '.bead-plate .item',
      '.result-history .item', '[class*="bead" i]', '[class*="road" i] .cell', '[class*="road" i] [class*="item" i]',
      '[data-result]', '[data-role*="road" i] *', 'svg circle', 'svg rect'
    ];
    const candidates = [];
    for (const selector of selectors) {
      try {
        document.querySelectorAll(selector).forEach((el) => {
          if (!candidates.includes(el) && isVisible(el)) candidates.push(el);
        });
      } catch (_) {}
    }

    const mapped = candidates
      .map((el) => {
        const rect = el.getBoundingClientRect();
        return { el, result: classifyResultElement(el), key: orderKey(el), area: rect.width * rect.height };
      })
      .filter((x) => x.result && x.area >= 8 && x.area <= 16000);

    mapped.sort((a, b) => a.key.localeCompare(b.key));

    // Compactação por posição/tamanho para remover duplicatas pai/filho comuns em SVG/DOM da Evolution.
    const compact = [];
    const seenCells = new Set();
    for (const item of mapped) {
      const key = `${cellKey(item.el)}:${item.result}`;
      if (seenCells.has(key)) continue;
      seenCells.add(key);
      compact.push(item.result);
      if (compact.length >= 140) break;
    }
    return compact.slice(-40);
  }

  function normalizeResultValue(value) {
    const text = String(value ?? '').trim().toLowerCase();
    if (!text) return null;
    if (/^(p|player|blue|azul|jogador)$/.test(text) || text.includes('player') || text.includes('blue')) return 'P';
    if (/^(b|banker|red|vermelho|banca)$/.test(text) || text.includes('banker') || text.includes('red')) return 'B';
    if (/^(t|tie|yellow|gold|empate)$/.test(text) || text.includes('tie') || text.includes('empate')) return 'T';
    return null;
  }

  function parseWsData(data) {
    if (typeof data !== 'string') return null;
    const trimmed = data.trim();
    if (!trimmed) return null;
    try { return JSON.parse(trimmed); } catch (_) {}
    const jsonStart = Math.min(...[trimmed.indexOf('{'), trimmed.indexOf('[')].filter((i) => i >= 0));
    if (Number.isFinite(jsonStart) && jsonStart >= 0) {
      try { return JSON.parse(trimmed.slice(jsonStart)); } catch (_) {}
    }
    return null;
  }

  function walkJson(value, visitor, path = '', depth = 0) {
    if (depth > 9 || value == null) return;
    visitor(value, path);
    if (Array.isArray(value)) {
      value.forEach((item, i) => walkJson(item, visitor, `${path}[${i}]`, depth + 1));
    } else if (typeof value === 'object') {
      Object.entries(value).forEach(([k, v]) => walkJson(v, visitor, path ? `${path}.${k}` : k, depth + 1));
    }
  }

  function extractRoadFromPayload(payload) {
    let best = [];
    walkJson(payload, (value, path) => {
      if (!Array.isArray(value) || value.length < 3) return;
      const direct = value.map(normalizeResultValue).filter(Boolean);
      if (direct.length >= 3 && direct.length >= best.length) best = direct;
      const objectResults = value
        .map((item) => {
          if (!item || typeof item !== 'object') return null;
          return normalizeResultValue(item.result || item.winner || item.outcome || item.win || item.type || item.color);
        })
        .filter(Boolean);
      if (objectResults.length >= 3 && objectResults.length >= best.length) best = objectResults;
      if (/bead|road|history|score/i.test(path) && objectResults.length >= 2 && objectResults.length >= best.length) best = objectResults;
    });
    return best.slice(-80);
  }

  function extractLatestResultFromPayload(payload) {
    let found = null;
    walkJson(payload, (value, path) => {
      if (found) return;
      if (!/result|winner|outcome|win|gameResult/i.test(path)) return;
      const normalized = normalizeResultValue(value);
      if (normalized) found = normalized;
    });
    return found;
  }

  function extractRoundIdFromPayload(payload) {
    let found = null;
    walkJson(payload, (value, path) => {
      if (found || typeof value === 'object') return;
      if (/roundId|gameId|round|shoe|startedAt|gameNumber/i.test(path) && String(value).length >= 3) found = String(value);
    });
    return found;
  }

  function extractBalanceFromPayload(payload) {
    let found = null;
    walkJson(payload, (value, path) => {
      if (found != null) return;
      if (!/balance|wallet|saldo|cash/i.test(path)) return;
      const n = Number(String(value).replace(/[^\d.-]/g, ''));
      if (Number.isFinite(n)) found = n;
    });
    return found;
  }

  function extractBettingOpenFromPayload(payload) {
    let found = null;
    walkJson(payload, (value, path) => {
      if (found != null) return;
      const text = String(value ?? '').toLowerCase();
      const hay = `${path} ${text}`;
      if (/betting.*open|place.*bets|betsopen|betting/i.test(hay) && !/closed|close|ended|no more/i.test(hay)) found = true;
      if (/betting.*closed|no more bets|betsclosed|dealing|result|resolved/i.test(hay)) found = false;
    });
    return found;
  }

  function processWebSocketEnvelope(detail) {
    if (!detail || detail.direction !== 'received') return;
    const url = String(detail.url || '');
    if (!/bacbo|bac-bo|BacBo|evo-games/i.test(url)) return;
    const payload = parseWsData(detail.data);
    if (!payload) return;

    const road = extractRoadFromPayload(payload);
    if (road.length >= 3) {
      const hash = road.join('');
      if (hash !== wsState.lastHash) {
        wsState.history = road.slice(-80);
        wsState.lastHash = hash;
        Core.adicionarLog('WS', `Histórico WS atualizado (${wsState.history.length})`, { source: 'bacbo-ws' });
      }
    }
    const result = extractLatestResultFromPayload(payload);
    if (result) wsState.lastResult = result;
    const roundId = extractRoundIdFromPayload(payload);
    if (roundId) wsState.roundId = roundId;
    const balance = extractBalanceFromPayload(payload);
    if (balance != null) {
      wsState.balance = balance;
      Core.setBankrollAtual(balance);
    }
    const bettingOpen = extractBettingOpenFromPayload(payload);
    if (bettingOpen != null) wsState.bettingOpen = bettingOpen;
    wsState.lastMessageAt = Date.now();
  }

  function iniciarWebSocketListener() {
    if (wsListenerStarted) return;
    wsListenerStarted = true;
    document.addEventListener(WS_EVENT_TYPE, (event) => processWebSocketEnvelope(event.detail));
  }

  iniciarWebSocketListener();

  function publicarSnapshotDoFrame() {
    if (IS_TOP_FRAME) return;
    const history = extrairBeadRoad();
    try {
      window.top.postMessage({
        type: SNAPSHOT_TYPE,
        frameId: FRAME_ID,
        href: location.href,
        isBacBo: isLikelyBacBoPage(),
        history,
        historyLength: history.length,
        canClick: Boolean(Clicker?.realizarAposta),
        ts: Date.now()
      }, '*');
    } catch (_) {}
  }

  function instalarCommandListenerNoFrame() {
    if (IS_TOP_FRAME) return;
    window.addEventListener('message', async (event) => {
      const msg = event.data;
      if (!msg || msg.type !== COMMAND_TYPE || msg.frameId !== FRAME_ID) return;
      let response = { ok: false, motivo: 'Comando não executado' };
      try {
        if (msg.command === 'PING') {
          response = { ok: true, motivo: 'pong', historyLength: extrairBeadRoad().length };
        } else if (msg.command === 'PERFORM_BET') {
          if (!Clicker?.realizarAposta) throw new Error('Clicker indisponível no iframe');
          response = await Clicker.realizarAposta(msg.acao, msg.stake, msg.options || {});
        } else if (msg.command === 'EXTRACT_HISTORY') {
          response = { ok: true, motivo: 'history', history: extrairBeadRoad() };
        }
      } catch (error) {
        response = { ok: false, motivo: error.message };
      }
      window.top.postMessage({
        type: COMMAND_RESULT_TYPE,
        frameId: FRAME_ID,
        commandId: msg.commandId,
        response,
        ts: Date.now()
      }, '*');
    });
  }

  function iniciarBridgeTop() {
    if (!IS_TOP_FRAME) return;
    window.addEventListener('message', (event) => {
      const data = event.data;
      if (!data) return;

      if (data.type === SNAPSHOT_TYPE && data.frameId) {
        frameSnapshots.set(data.frameId, { ...data, sourceWindow: event.source });
        limparSnapshotsVelhos();
        return;
      }

      if (data.type === COMMAND_RESULT_TYPE && data.commandId) {
        const pending = pendingCommands.get(data.commandId);
        if (pending) {
          pendingCommands.delete(data.commandId);
          pending.resolve(data.response || { ok: false, motivo: 'Resposta vazia' });
        }
      }
    });
  }

  function limparSnapshotsVelhos() {
    const now = Date.now();
    for (const [id, snap] of frameSnapshots.entries()) {
      if (now - Number(snap.ts || 0) > 10000) frameSnapshots.delete(id);
    }
  }

  function getBestHistory() {
    const own = extrairBeadRoad();
    let best = { source: 'top', frameId: null, history: own, href: location.href, ts: Date.now(), canClick: Boolean(Clicker?.realizarAposta) };
    const now = Date.now();
    if (wsState.history.length > (best.history?.length || 0) && now - Number(wsState.lastMessageAt || 0) < 30000) {
      best = { source: 'websocket', frameId: null, history: wsState.history.slice(-40), href: location.href, ts: wsState.lastMessageAt, canClick: Boolean(Clicker?.realizarAposta) };
    }
    for (const snap of frameSnapshots.values()) {
      if (now - Number(snap.ts || 0) > 10000) continue;
      if ((snap.history?.length || 0) > (best.history?.length || 0)) {
        best = { source: `iframe:${snap.frameId}`, frameId: snap.frameId, history: snap.history || [], href: snap.href, ts: snap.ts, canClick: snap.canClick };
      }
    }
    return best;
  }

  function enviarComandoParaFrame(frameId, payload, timeoutMs = 6000) {
    const snap = frameSnapshots.get(frameId);
    if (!snap?.sourceWindow) return Promise.resolve({ ok: false, motivo: 'Frame alvo não encontrado na bridge' });
    const commandId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        pendingCommands.delete(commandId);
        resolve({ ok: false, motivo: 'Timeout aguardando iframe' });
      }, timeoutMs);
      pendingCommands.set(commandId, {
        resolve: (value) => {
          clearTimeout(timer);
          resolve(value);
        }
      });
      snap.sourceWindow.postMessage({ type: COMMAND_TYPE, frameId, commandId, ...payload }, '*');
    });
  }

  async function executarApostaNoMelhorFrame(best, resultado) {
    const options = {
      protecaoEmpate: Core.estadoRobo.config.protecaoEmpate,
      valorProtecao: Core.estadoRobo.config.valorProtecao
    };
    if (best.frameId) {
      return enviarComandoParaFrame(best.frameId, {
        command: 'PERFORM_BET',
        acao: resultado.acao,
        stake: Core.estadoRobo.stakeAtual,
        options
      });
    }
    if (!Clicker?.realizarAposta) return { ok: false, motivo: 'Clicker indisponível no frame principal' };
    return Clicker.realizarAposta(resultado.acao, Core.estadoRobo.stakeAtual, options);
  }

  function criarOverlay() {
    if (!IS_TOP_FRAME) return;
    const overlays = Array.from(document.querySelectorAll('#will-dados-overlay'));
    overlays.slice(1).forEach((el) => el.remove());
    if (overlay || overlays[0]) {
      overlay = overlay || overlays[0];
      aplicarAncoragemOverlay();
      return;
    }
    overlay = document.createElement('div');
    overlay.id = 'will-dados-overlay';
    overlay.innerHTML = `
      <div class="wd-panel-title"><span>Painel de Configuração (Bac Bo)</span><button id="wd-pin" title="Alternar ancoragem">📌</button></div>
      <div class="wd-panel-body">
        <div class="wd-logo-card"><div class="wd-logo-mark">WILL<br><span>DADOS</span></div></div>
        <div class="wd-actions"><button id="wd-toggle" class="wd-toggle">Ligar</button><button id="wd-back-panel" class="wd-back-panel">Voltar painel</button></div>
        <div id="wd-step" class="wd-step">1/5 • Aguardando mesa</div>
        <div id="wd-main-status" class="wd-status-bar">Aguardando...</div>
        <div class="wd-metrics hidden" id="wd-metrics">
          <div><span>Banca</span><strong id="wd-bankroll">R$ 0</strong></div>
          <div><span>Lucro</span><strong id="wd-lucro">R$ 0</strong></div>
          <div><span>Stake</span><strong id="wd-stake">R$ 0 / G0</strong></div>
          <div><span>Meta/Stop</span><strong id="wd-meta-stop">--</strong></div>
          <div><span>Modo</span><strong id="wd-mode">Shadow</strong></div>
        </div>
        <div id="wd-padrao" class="wd-padrao">Aguardando Padrões do Will...</div>
        <div id="wd-alerta" class="wd-alerta"></div>
        <div id="wd-bridge" class="wd-bridge">Bridge: 0 frames</div>
      </div>`;
    document.getElementById('will-dados-overlay-style')?.remove();
    const style = document.createElement('style');
    style.id = 'will-dados-overlay-style';
    style.textContent = `
      #will-dados-overlay{position:fixed;top:92px;left:18px;right:auto;z-index:2147483647;width:286px;background:#f5f5f5;color:#111;border:1px solid #9ca3af;border-radius:3px;font:13px Arial,sans-serif;box-shadow:0 8px 28px rgba(0,0,0,.35);overflow:hidden}
      #will-dados-overlay .wd-panel-title{height:31px;line-height:31px;text-align:center;font-weight:700;color:#111;background:linear-gradient(#e8e8e8,#c9c9c9);border-bottom:1px solid #9f9f9f;font-family:Georgia,serif;font-size:13px;display:flex;align-items:center;justify-content:center;position:relative}#wd-pin{position:absolute;right:6px;top:4px;border:0;background:#111;color:#facc15;border-radius:5px;cursor:pointer;height:22px;width:28px}
      #will-dados-overlay .wd-panel-body{padding:14px 12px 12px;background:#f7f7f7}.wd-logo-card{width:96px;height:96px;margin:0 auto 14px;border-radius:2px;background:linear-gradient(135deg,#230000,#d82323 58%,#facc15);display:flex;align-items:center;justify-content:center;box-shadow:inset 0 0 0 1px rgba(0,0,0,.25)}
      .wd-logo-mark{font-weight:900;line-height:.92;text-align:center;color:#fff;text-shadow:0 2px 3px rgba(0,0,0,.7);font-size:22px;transform:skew(-5deg)}.wd-logo-mark span{color:#facc15;font-size:18px}
      .wd-actions{display:flex;gap:8px;align-items:center;margin:0 0 14px 0}.wd-toggle{width:94px;height:38px;border:0;border-radius:8px;background:#050505;color:#fff;font-weight:800;cursor:pointer;box-shadow:0 2px 0 rgba(0,0,0,.3);transition:.15s}.wd-back-panel{flex:1;height:38px;border:0;border-radius:8px;background:#e5e7eb;color:#111;font-weight:800;cursor:pointer}.wd-toggle:hover,.wd-back-panel:hover{filter:brightness(1.05);transform:translateY(-1px)}
      .wd-step{font-size:11px;color:#4b5563;font-weight:800;text-transform:uppercase;letter-spacing:.3px;margin:-2px 0 6px;text-align:center}.wd-status-bar{height:42px;line-height:42px;border-radius:8px;text-align:center;font-weight:900;color:#052e09;background:linear-gradient(#12b512,#067806);border:1px solid #045d04;box-shadow:inset 0 1px 0 rgba(255,255,255,.35);font-size:15px;margin-bottom:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:0 8px}.wd-status-bar.off{background:linear-gradient(#6b7280,#374151);border-color:#374151;color:#fff}.wd-status-bar.alert{background:linear-gradient(#facc15,#d97706);border-color:#92400e;color:#111}
      .wd-metrics{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:8px 0 9px}.wd-metrics.hidden{display:none}.wd-metrics div{background:#fff;border:1px solid #dedede;border-radius:6px;padding:6px;min-height:45px}.wd-metrics span{display:block;color:#6b7280;font-size:10px;text-transform:uppercase;font-weight:700;margin-bottom:2px}.wd-metrics strong{font-size:12px;color:#111}.wd-metrics #wd-lucro.pos{color:#078407}.wd-metrics #wd-lucro.neg{color:#b91c1c}
      .wd-padrao{background:#fff;border:1px solid #dedede;border-radius:7px;padding:8px;min-height:40px;color:#111;font-size:12px;margin:8px 0}.wd-padrao b{font-size:14px}.wd-padrao small{color:#666}.wd-alerta{min-height:16px;color:#b45309;font-weight:800;font-size:11px;margin-top:5px}.wd-bridge{color:#777;font-size:10px;margin-top:5px;text-align:right}`;
    document.documentElement.appendChild(style);
    document.body.appendChild(overlay);
    aplicarAncoragemOverlay();
    overlay.querySelector('#wd-toggle').addEventListener('click', () => toggleRobo());
    overlay.querySelector('#wd-pin').addEventListener('click', alternarAncoragemOverlay);
    overlay.querySelector('#wd-back-panel').addEventListener('click', voltarParaPainelLateral);
  }


  function aplicarAncoragemOverlay() {
    if (!overlay) return;
    overlay.style.left = overlayPinnedLeft ? '18px' : 'auto';
    overlay.style.right = overlayPinnedLeft ? 'auto' : '18px';
    const pin = overlay.querySelector('#wd-pin');
    if (pin) pin.textContent = overlayPinnedLeft ? '📌' : '📍';
  }

  function alternarAncoragemOverlay() {
    overlayPinnedLeft = !overlayPinnedLeft;
    aplicarAncoragemOverlay();
    Core.adicionarLog('INFO', overlayPinnedLeft ? 'Overlay ancorado à esquerda' : 'Overlay ancorado à direita');
  }

  async function voltarParaPainelLateral() {
    Core.atualizarConfiguracoes({ showOverlay: false });
    Core.salvarConfiguracoes();
    const existing = document.getElementById('will-dados-overlay');
    if (existing) existing.remove();
    document.getElementById('will-dados-overlay-style')?.remove();
    overlay = null;
    try {
      chrome.runtime.sendMessage({ action: 'OPEN_SIDE_PANEL' });
    } catch (_) {}
  }

  function calcularUiState(status, resultado) {
    const active = Boolean(Core.estadoRobo.roboAtivo);
    const hasBridge = frameSnapshots.size > 0;
    const hasMesa = isLikelyBacBoPage() || hasBridge;
    const hasHistory = lastHistoryCount > 0;
    const statusText = String(status || '');

    // Tela 1: lobby/primeira tela. Não exibe banca, lucro nem stake.
    if (!hasMesa) {
      return { step: '1/7 • Aguardando mesa', message: 'Aguardando Padrões do Will...', showMetrics: false, tone: 'off' };
    }

    // Tela 2: mesa/iframe detectado, mas ainda sem Bead Road confiável.
    if (!hasHistory) {
      return { step: '2/7 • Mesa detectada', message: `Sincronizando histórico • Bridge ${frameSnapshots.size}`, showMetrics: false, tone: 'alert' };
    }

    if (/stop/i.test(statusText)) {
      return { step: '7/7 • Stop atingido', message: statusText, showMetrics: true, tone: 'alert' };
    }

    if (/ganhou|perdeu|empate/i.test(statusText) || ['GANHOU','PERDEU','EMPATE'].includes(Core.estadoRobo.ultimaAposta?.status)) {
      return { step: '6/7 • Resultado processado', message: statusText || Core.estadoRobo.ultimaAcao, showMetrics: true, tone: 'on' };
    }

    if (/simula|aposta enviada|entrada simulada|shadow mode/i.test(statusText) || Core.estadoRobo.ultimaAposta?.status === 'PENDENTE') {
      return { step: Core.estadoRobo.config.shadowMode ? '5/7 • Entrada simulada' : '5/7 • Entrada apostada', message: statusText || Core.estadoRobo.ultimaAcao, showMetrics: true, tone: 'on' };
    }

    // Tela 3: histórico conectado. Só aqui liberamos os valores operacionais.
    if (!active) {
      return { step: '3/7 • Histórico conectado', message: 'Clique em Ligar para iniciar', showMetrics: true, tone: 'off' };
    }

    if (resultado && resultado.acao !== 'SKIP') {
      return { step: '4/7 • Entrada encontrada', message: Core.estadoRobo.config.shadowMode ? 'Preparando simulação' : 'Preparando aposta', showMetrics: true, tone: 'on' };
    }

    if (/sem histórico|risco|stop|erro/i.test(statusText)) {
      return { step: '3/7 • Atenção', message: statusText, showMetrics: hasHistory, tone: 'alert' };
    }

    return { step: '4/7 • Analisando padrões', message: status || 'Esperando padrão da mesa...', showMetrics: true, tone: 'on' };
  }


  function atualizarOverlay(status = null, resultado = null) {
    if (!overlay) return;
    const estado = Core.estadoRobo;
    const ui = calcularUiState(status, resultado);
    const bankroll = Core.getBankrollAtual();
    const lucro = Number(estado.lucroSessao) || 0;
    const statusEl = overlay.querySelector('#wd-main-status');
    const toggleEl = overlay.querySelector('#wd-toggle');
    const metricsEl = overlay.querySelector('#wd-metrics');
    overlay.querySelector('#wd-step').textContent = ui.step;
    overlay.querySelector('#wd-mode').textContent = estado.config.shadowMode ? 'Shadow' : 'Auto';
    toggleEl.textContent = estado.roboAtivo ? 'Desligar' : 'Ligar';
    statusEl.textContent = ui.message;
    statusEl.classList.toggle('off', ui.tone === 'off');
    statusEl.classList.toggle('alert', ui.tone === 'alert');
    metricsEl.classList.toggle('hidden', !ui.showMetrics);
    overlay.querySelector('#wd-bridge').textContent = `Bridge: ${frameSnapshots.size} frame(s) • Histórico: ${lastHistoryCount}`;
    overlay.querySelector('#wd-bankroll').textContent = `R$ ${Math.floor(bankroll).toLocaleString('pt-BR')}`;
    const lucroEl = overlay.querySelector('#wd-lucro');
    lucroEl.textContent = `${lucro >= 0 ? '+' : ''}R$ ${Math.floor(lucro).toLocaleString('pt-BR')}`;
    lucroEl.className = lucro >= 0 ? 'pos' : 'neg';
    overlay.querySelector('#wd-stake').textContent = `R$ ${Math.floor(estado.stakeAtual).toLocaleString('pt-BR')} / G${estado.galeAtual}`;
    const metaSaldo = Number(estado.config.metaSaldoAlvo) || 0;
    const stopSaldo = Number(estado.config.stopLossSaldo) || 0;
    overlay.querySelector('#wd-meta-stop').textContent = `${Math.floor(metaSaldo).toLocaleString('pt-BR')} / ${Math.floor(stopSaldo).toLocaleString('pt-BR')}`;
    const padraoEl = overlay.querySelector('#wd-padrao');
    if (!ui.showMetrics) padraoEl.textContent = 'Aguardando Padrões do Will...';
    else if (resultado) {
      const acaoLabel = resultado.acao === 'P' ? 'Azul' : resultado.acao === 'B' ? 'Vermelho' : resultado.acao === 'T' ? 'Empate' : 'Aguardar';
      padraoEl.innerHTML = `<b>${acaoLabel}</b> — ${resultado.motivo}<br><small>Confiança ${resultado.confianca}% | P:${resultado.scoreP || 0} B:${resultado.scoreB || 0}</small>`;
    } else if (!estado.roboAtivo) padraoEl.textContent = 'Aguardando Padrões do Will...';
    else padraoEl.textContent = lastHistoryCount > 0 ? 'Esperando padrão da mesa...' : 'Aguardando Padrões do Will...';
    const riscos = [];
    if (estado.stakeAtual >= estado.config.stakeBase * 2) riscos.push(`Gale ativo: G${estado.galeAtual}`);
    if (Math.abs(estado.lucroSessao) >= Math.abs(estado.config.stopLoss) * 0.75 && estado.lucroSessao < 0) riscos.push('Próximo do Stop Loss');
    overlay.querySelector('#wd-alerta').textContent = riscos.join(' • ');
  }

  let ultimoHashAnalisado = '';

  // Monitor em tempo real: Chama detectarPadrao() quando histórico muda e atualiza UI
  // Roda a cada 800ms independentemente do estado do robô (sempre ativo)
  // Exibe: [Lado] — [Padrão] | Confiança X% | P:Score B:Score
  function atualizarIndicacoesDeEntrada() {
    const best = getBestHistory();
    const history = best.history || [];
    const historyHash = history.join('');

    if (historyHash !== ultimoHashAnalisado && history.length >= 3) {
      ultimoHashAnalisado = historyHash;
      const resultado = Core.detectarPadrao(history);

      if (overlay && resultado) {
        const padraoEl = overlay.querySelector('#wd-padrao');
        if (padraoEl && resultado.acao !== 'SKIP') {
          const acaoLabel = resultado.acao === 'P' ? 'Azul' : resultado.acao === 'B' ? 'Vermelho' : resultado.acao === 'T' ? 'Empate' : 'Aguardar';
          const scoreText = `P:${resultado.scoreP || 0} B:${resultado.scoreB || 0}`;
          padraoEl.innerHTML = `<b>${acaoLabel}</b> — ${resultado.motivo}<br><small>Confiança ${resultado.confianca}% | ${scoreText}</small>`;
        } else if (padraoEl && resultado.acao === 'SKIP') {
          padraoEl.textContent = `⏸️ ${resultado.motivo}`;
        }
      }
    }
  }

  function toggleRobo(force) {
    Core.estadoRobo.roboAtivo = typeof force === 'boolean' ? force : !Core.estadoRobo.roboAtivo;
    Core.adicionarLog('INFO', Core.estadoRobo.roboAtivo ? 'Robô ativado' : 'Robô desativado');
    atualizarOverlay();
    return Core.estadoRobo.roboAtivo;
  }

  function inferirResultadoMaisRecente(history) {
    return wsState.lastResult || (history?.length ? history[history.length - 1] : null);
  }

  function estaEmFaseDeAposta() {
    if (wsState.bettingOpen === true && Date.now() - Number(wsState.lastMessageAt || 0) < 15000) return true;
    if (wsState.bettingOpen === false && Date.now() - Number(wsState.lastMessageAt || 0) < 7000) return false;

    const bodyText = (document.body?.innerText || '').toLowerCase();
    if (/no more bets|não.*apostas|apostas encerradas|fechado|closed|aguarde|wait/i.test(bodyText)) return false;
    if (/place your bets|faça suas apostas|faca suas apostas|aposte agora|bet now/i.test(bodyText)) return true;

    const candidates = Array.from(document.querySelectorAll('[class*="timer" i], [class*="traffic" i], [class*="bet" i], [data-role*="bet" i], button, [role="button"]'))
      .filter(isVisible)
      .slice(0, 250);
    for (const el of candidates) {
      const hay = `${el.textContent || ''} ${el.className || ''} ${el.getAttribute('aria-label') || ''} ${el.getAttribute('title') || ''}`.toLowerCase();
      if (/no more|closed|encerrad|fechad|disabled/.test(hay)) return false;
      if (/place.*bet|bet.*open|faça.*aposta|faca.*aposta|apostar|bet now|active/.test(hay)) return true;
      const style = getComputedStyle(el);
      const colors = `${style.backgroundColor || ''} ${style.color || ''}`.toLowerCase();
      const nums = (colors.match(/\d+(?:\.\d+)?/g) || []).map(Number);
      for (let i = 0; i + 2 < nums.length; i += 3) {
        const [r, g, b] = nums.slice(i, i + 3);
        if (g > 120 && g > r * 1.2 && g > b * 1.2) return true;
        if (r > 150 && r > g * 1.25 && r > b * 1.25) return false;
      }
    }
    return false;
  }

  async function cicloPrincipal() {
    if (!Core.estadoRobo.roboAtivo) {
      atualizarOverlay();
      return;
    }
    if (Date.now() - lastActionAt < 1400) return;
    limparSnapshotsVelhos();
    const best = getBestHistory();
    const history = best.history || [];
    lastHistoryCount = history.length;
    const historyHash = history.join('');
    if (!history.length) {
      atualizarOverlay(`Sem histórico detectado ainda — bridge ${frameSnapshots.size} frame(s)`);
      return;
    }

    if (Core.estadoRobo.ultimaAposta?.status === 'PENDENTE') {
      const aposta = Core.estadoRobo.ultimaAposta;
      const mudouHistorico = Boolean(aposta.historyHash) && historyHash !== aposta.historyHash;
      const mudouRodada = Boolean(aposta.roundId && wsState.roundId) && wsState.roundId !== aposta.roundId;
      const podeProcessarResultado = mudouHistorico || mudouRodada;
      if (podeProcessarResultado && historyHash !== Core.estadoRobo.ultimoResultadoProcessadoHash) {
      const resultadoFinal = inferirResultadoMaisRecente(history);
      if (resultadoFinal) {
        Core.estadoRobo.ultimoResultadoProcessadoHash = historyHash;
        Core.atualizarAposResultado(resultadoFinal);
      }
      }
    }

    if (historyHash === lastHistoryHash) {
      atualizarOverlay();
      return;
    }
    lastHistoryHash = historyHash;
    const resultado = Core.detectarPadrao(history);
    ultimoPadrao = resultado.motivo;
    atualizarOverlay(`Analisando ${history.length} resultados (${best.source})`, resultado);

    if (!Core.deveApostar(resultado)) {
      if (resultado.acao === 'SKIP') Core.adicionarLog('SKIP', resultado.motivo, resultado);
      return;
    }

    if (!estaEmFaseDeAposta()) {
      Core.adicionarLog('SKIP', 'Fora da janela de apostas; entrada ignorada para evitar clique inválido', { resultado, source: best.source, wsBettingOpen: wsState.bettingOpen });
      atualizarOverlay('Fora da janela de apostas', resultado);
      return;
    }

    Core.registrarAposta(resultado);
    if (Core.estadoRobo.ultimaAposta) {
      Core.estadoRobo.ultimaAposta.historyHash = historyHash;
      Core.estadoRobo.ultimaAposta.roundId = wsState.roundId || null;
      Core.estadoRobo.ultimoResultadoProcessadoHash = historyHash;
    }
    lastActionAt = Date.now();
    if (Core.estadoRobo.config.shadowMode) {
      atualizarOverlay('Shadow mode: entrada simulada', resultado);
      return;
    }
    const exec = await executarApostaNoMelhorFrame(best, resultado);
    Core.adicionarLog(exec.ok ? 'APOSTA' : 'ERRO', exec.motivo, { resultado, best });
    atualizarOverlay(exec.ok ? 'Aposta enviada' : `Falha: ${exec.motivo}`, resultado);
  }

  function iniciarObserver() {
    if (observerStarted) return;
    observerStarted = true;
    new MutationObserver(() => window.setTimeout(cicloPrincipal, 250)).observe(document.body, { childList: true, subtree: true, attributes: true, characterData: true });
    window.setInterval(cicloPrincipal, 1200);
    window.setInterval(atualizarIndicacoesDeEntrada, 800);
  }

  function getStatus() {
    return {
      success: true,
      ativo: Core.estadoRobo.roboAtivo,
      shadowMode: Core.estadoRobo.config.shadowMode,
      bankroll: Math.floor(Core.getBankrollAtual()),
      lucro: Math.floor(Core.estadoRobo.lucroSessao),
      stake: Math.floor(Core.estadoRobo.stakeAtual),
      gale: Core.estadoRobo.galeAtual,
      metaSaldoAlvo: Math.floor(Number(Core.estadoRobo.config.metaSaldoAlvo) || 0),
      stopLossSaldo: Math.floor(Number(Core.estadoRobo.config.stopLossSaldo) || 0),
      ultimoPadrao,
      ultimaAcao: Core.estadoRobo.ultimaAcao,
      ultimaApostaStatus: Core.estadoRobo.ultimaAposta?.status || null,
      ultimaApostaAcao: Core.estadoRobo.ultimaAposta?.acao || null,
      isBacBo: isLikelyBacBoPage(),
      bridgeFrames: frameSnapshots.size,
      historyCount: lastHistoryCount,
      wsHistoryCount: wsState.history.length,
      wsRoundId: wsState.roundId,
      bettingOpen: wsState.bettingOpen,
      wsBalance: wsState.balance
    };
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (!IS_TOP_FRAME) return false;
    if (request.action === 'GET_STATUS') { sendResponse(getStatus()); return true; }
    if (request.action === 'GET_LOGS') { sendResponse(Core.estadoRobo.logs); return true; }
    if (request.action === 'TOGGLE_ROBO') { const ativo = toggleRobo(); sendResponse({ success: true, ativo, message: ativo ? 'Robô ativado' : 'Robô desativado' }); return true; }
    if (request.action === 'UPDATE_CONFIG') {
      Core.atualizarConfiguracoes(request.config || {});
      Core.salvarConfiguracoes();
      if (Core.estadoRobo.config.showOverlay) {
        criarOverlay();
        atualizarOverlay('Configurações atualizadas');
      } else {
        const existing = document.getElementById('will-dados-overlay');
        if (existing) existing.remove();
        document.getElementById('will-dados-overlay-style')?.remove();
        overlay = null;
      }
      sendResponse({ success: true });
      return true;
    }
    if (request.action === 'EXPORT_LOGS_CSV') { sendResponse({ success: true, csv: Core.exportarLogsCsv() }); return true; }
    return false;
  });

  async function init() {
    await Core.carregarConfiguracoes();
    iniciarWebSocketListener();
    if (!IS_TOP_FRAME) {
      instalarCommandListenerNoFrame();
      window.setInterval(publicarSnapshotDoFrame, 900);
      new MutationObserver(() => window.setTimeout(publicarSnapshotDoFrame, 150)).observe(document.body, { childList: true, subtree: true, attributes: true, characterData: true });
      publicarSnapshotDoFrame();
      return;
    }
    iniciarBridgeTop();
    if (Core.estadoRobo.config.showOverlay) {
      criarOverlay();
      atualizarOverlay(isLikelyBacBoPage() ? 'Mesa provável detectada' : 'Aguardando mesa Bac Bo');
    } else {
      const existing = document.getElementById('will-dados-overlay');
      if (existing) existing.remove();
      document.getElementById('will-dados-overlay-style')?.remove();
    }
    if (isLikelyBacBoPage() && Core.estadoRobo.config.autoStart) toggleRobo(true);
    iniciarObserver();
    Core.adicionarLog('INFO', 'Content script iniciado com bridge completa', { href: location.href, bacbo: isLikelyBacBoPage() });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

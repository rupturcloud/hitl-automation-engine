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
  const SUGESTOES_APENAS = true; // Extensão 4: apenas recomendações, sem cliques automáticos
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
  let hitlState = null;
  let ultimoEnvioWsExterno = 0;
  let userCursor = null;

  // --- Sistema de Marcador do Usuário ("Eu") ---
  function initUserCursor() {
    if (userCursor || !document.body) return;
    userCursor = document.createElement('div');
    userCursor.id = 'wdp-user-tag';
    userCursor.style.cssText = `
      position: fixed;
      z-index: 2147483647;
      pointer-events: none;
      display: flex;
      align-items: center;
      transition: transform 0.05s linear;
      opacity: 0;
    `;
    userCursor.innerHTML = `
      <div style="
        background: #0ea5e9;
        color: white;
        font-family: 'Inter', sans-serif, system-ui;
        font-size: 11px;
        font-weight: 700;
        padding: 2px 8px;
        border-radius: 10px;
        white-space: nowrap;
        box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.2);
        transform: translateY(18px) translateX(8px);
      ">Eu</div>
    `;
    document.body.appendChild(userCursor);
  }

  document.addEventListener('mousemove', (e) => {
    if (!userCursor) initUserCursor();
    if (userCursor) {
      userCursor.style.opacity = '1';
      userCursor.style.left = e.clientX + 'px';
      userCursor.style.top = e.clientY + 'px';
    }
  }, { passive: true });

  // O wrapper de WebSocket (ws-bridge.js) é carregado automaticamente
  // pelo manifest.json no MAIN world com run_at: document_start.
  // Não é necessário injetar inline — evita violação de CSP.
  wsState.installed = true;

  // [EXTENSÃO 4 ESPECÍFICO] Função para ler banca da tela como fallback do WebSocket
  function lerBancaDaTela() {
    const candidates = Array.from(document.querySelectorAll(
      '[class*="balance" i], [class*="bankroll" i], [class*="credit" i], ' +
      '[class*="wallet" i], [class*="cash" i], [id*="balance" i], ' +
      '[data-balance], [data-bankroll], [aria-label*="balance" i], ' +
      '[title*="balance" i], span, div'
    )).filter(el => {
      const text = (el.textContent || '').trim();
      const hay = `${text} ${el.className || ''} ${el.id || ''} ${el.getAttribute('aria-label') || ''} ${el.getAttribute('title') || ''}`.toLowerCase();
      return /(?:saldo|balance|crédito|bankroll|wallet|cash|caixa).*?(R\$|\d+(?:\.|,)\d+)/i.test(hay) ||
             /\b(?:R\$|USD|BRL)\s*[\d.,]+(?:\s+(?:BRL|USD))?\b/i.test(text);
    }).slice(0, 50);

    for (const el of candidates) {
      const text = (el.textContent || '').trim();
      const matches = text.match(/(?:R\$|USD)?\s*([\d.,]+)/);
      if (matches && matches[1]) {
        const valorStr = matches[1].replace(/\./g, '').replace(',', '.');
        const valor = parseFloat(valorStr);
        if (valor > 0 && valor < 1000000) return valor;
      }
    }
    return null;
  }

  let ultimaBancaLida = null;
  let ultimoCheckBanca = 0;

  // [EXTENSÃO 4 ESPECÍFICO] Monitor de banca: checa a cada 2.5s e atualiza se mudou
  function monitorarBancaTela() {
    const agora = Date.now();
    if (agora - ultimoCheckBanca < 2000) return;
    ultimoCheckBanca = agora;

    const bancaTela = lerBancaDaTela();
    if (bancaTela && Math.abs(bancaTela - (ultimaBancaLida || 0)) > 0.1) {
      ultimaBancaLida = bancaTela;
      Core.setBankrollAtual(bancaTela);
      Core.adicionarLog('BANCA', `Banca lida da tela: R$ ${bancaTela.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, { fonte: 'tela' });
    }
  }

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
      } catch (_) { }
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
    try { return JSON.parse(trimmed); } catch (_) { }
    const jsonStart = Math.min(...[trimmed.indexOf('{'), trimmed.indexOf('[')].filter((i) => i >= 0));
    if (Number.isFinite(jsonStart) && jsonStart >= 0) {
      try { return JSON.parse(trimmed.slice(jsonStart)); } catch (_) { }
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
    } catch (_) { }
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

  /**
   * Envia comando (ex: PERFORM_BET) para o iframe que possui a mesa do jogo, 
   * e aguarda sua conclusão com timeout.
   *
   * @param {string} frameId - ID do frame injetado.
   * @param {Object} payload - Dados do comando.
   * @param {number} timeoutMs - Tempo máximo de espera da resposta. Aumentado para 15000ms devido a retries de renderização.
   * @returns {Promise<Object>} Promessa resolvendo com resultado ou falha de timeout.
   */
  function enviarComandoParaFrame(frameId, payload, timeoutMs = 15000) {
    const snap = frameSnapshots.get(frameId);
    if (!snap?.sourceWindow) return Promise.resolve({ ok: false, motivo: 'Frame alvo não encontrado na bridge' });
    const commandId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        pendingCommands.delete(commandId);
        resolve({ ok: false, motivo: 'Timeout aguardando resposta do iframe (timeoutMs expirado)' });
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
      valorProtecao: Core.estadoRobo.config.valorProtecao,
      galeCount: resultado.galeCount || Core.estadoRobo.galeAtual || 0
    };
    const stakeAposta = resultado.stake || Core.estadoRobo.ultimaAposta?.stake || Core.estadoRobo.stakeAtual;

    if (best.frameId) {
      return enviarComandoParaFrame(best.frameId, {
        command: 'PERFORM_BET',
        acao: resultado.acao,
        stake: stakeAposta,
        options
      });
    }
    if (!Clicker?.realizarAposta) return { ok: false, motivo: 'Clicker indisponível no frame principal' };
    return Clicker.realizarAposta(resultado.acao, stakeAposta, options);
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
    } catch (_) { }
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

    if (/ganhou|perdeu|empate/i.test(statusText) || ['GANHOU', 'PERDEU', 'EMPATE'].includes(Core.estadoRobo.ultimaAposta?.status)) {
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
      Core.estadoRobo.ultimaAnalise = resultado;
      const acaoLabel = resultado.acao === 'P' ? 'Azul' : resultado.acao === 'B' ? 'Vermelho' : resultado.acao === 'T' ? 'Empate' : 'Aguardar';
      padraoEl.innerHTML = `<b>${acaoLabel}</b> — ${resultado.motivo}<br><small>Confiança ${resultado.confianca}% | P:${resultado.scoreP || 0} B:${resultado.scoreB || 0}</small>`;
    } else if (!estado.roboAtivo) padraoEl.textContent = 'Aguardando Padrões do Will...';
    else padraoEl.textContent = lastHistoryCount > 0 ? 'Esperando padrão da mesa...' : 'Aguardando Padrões do Will...';
    const riscos = [];
    if (estado.stakeAtual >= estado.config.stakeBase * 2) riscos.push(`Gale ativo: G${estado.galeAtual}`);
    if (Math.abs(estado.lucroSessao) >= Math.abs(estado.config.stopLoss) * 0.75 && estado.lucroSessao < 0) riscos.push('Próximo do Stop Loss');
    overlay.querySelector('#wd-alerta').textContent = riscos.join(' • ');
  }


  function removerHitlOverlay() {
    document.getElementById('will-dados-hitl')?.remove();
    document.getElementById('will-dados-hitl-style')?.remove();
    window.removeEventListener('keydown', onHitlKeyDown, true);
  }

  function onHitlKeyDown(event) {
    if (event.key === 'Escape' && hitlState) cancelarEntradaHitl('ESC');
  }

  function cancelarEntradaHitl(origem = 'manual') {
    if (!hitlState) return;
    clearInterval(hitlState.timer);
    const resolver = hitlState.resolve;
    hitlState = null;
    removerHitlOverlay();
    Core.adicionarLog('CANCEL', `Entrada cancelada pelo usuário (${origem})`);
    resolver(false);
  }

  function criarHitlOverlay(resultado, segundos) {
    if (!IS_TOP_FRAME) return;
    removerHitlOverlay();
    const lado = resultado.acao === 'P' ? 'PLAYER / AZUL' : resultado.acao === 'B' ? 'BANKER / VERMELHO' : 'EMPATE';
    const cor = resultado.acao === 'P' ? '#2563eb' : resultado.acao === 'B' ? '#dc2626' : '#ca8a04';
    const el = document.createElement('div');
    el.id = 'will-dados-hitl';
    el.innerHTML = `
      <div class="wd-hitl-card" role="dialog" aria-modal="true">
        <div class="wd-hitl-kicker">Sugestão de entrada • HITL</div>
        <div class="wd-hitl-side" style="color:${cor}">${lado}</div>
        <div class="wd-hitl-grid">
          <div><span>Stake</span><strong>R$ ${Math.floor(Core.estadoRobo.stakeAtual).toLocaleString('pt-BR')}</strong></div>
          <div><span>Confiança</span><strong>${resultado.confianca}%</strong></div>
          <div><span>Gale</span><strong>G${Core.estadoRobo.galeAtual}/${resultado.galeMax ?? Core.estadoRobo.config.maxGales}</strong></div>
          <div><span>Modo</span><strong>${Core.estadoRobo.config.shadowMode ? 'Shadow' : 'Auto'}</strong></div>
        </div>
        <div class="wd-hitl-motivo">${resultado.motivo}</div>
        <div class="wd-hitl-count"><span id="wd-hitl-seconds">${segundos}</span>s</div>
        <button id="wd-hitl-cancel">CANCELAR ENTRADA</button>
        <div class="wd-hitl-help">ESC também cancela. Se não cancelar, a extensão executa o clique.</div>
      </div>`;
    const style = document.createElement('style');
    style.id = 'will-dados-hitl-style';
    style.textContent = `
      #will-dados-hitl{position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,.52);display:flex;align-items:center;justify-content:center;font-family:Arial,sans-serif;color:#111}
      #will-dados-hitl .wd-hitl-card{width:min(92vw,460px);background:#fff;border-radius:18px;padding:24px;box-shadow:0 24px 80px rgba(0,0,0,.55);text-align:center;border:3px solid #111}
      .wd-hitl-kicker{font-size:12px;font-weight:900;color:#6b7280;text-transform:uppercase;letter-spacing:.8px}.wd-hitl-side{font-size:31px;line-height:1.1;font-weight:1000;margin:10px 0 14px}.wd-hitl-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:10px 0}.wd-hitl-grid div{border:1px solid #e5e7eb;border-radius:10px;padding:9px;background:#f9fafb}.wd-hitl-grid span{display:block;font-size:10px;color:#6b7280;text-transform:uppercase;font-weight:800}.wd-hitl-grid strong{font-size:17px}.wd-hitl-motivo{background:#111;color:#fff;border-radius:12px;padding:10px;margin:12px 0;font-weight:800}.wd-hitl-count{font-size:18px;font-weight:900;margin:12px 0}.wd-hitl-count span{font-size:54px;color:#f59e0b}#wd-hitl-cancel{width:100%;height:58px;border:0;border-radius:14px;background:#dc2626;color:#fff;font-size:20px;font-weight:1000;cursor:pointer;box-shadow:0 5px 0 #7f1d1d}#wd-hitl-cancel:active{transform:translateY(2px);box-shadow:0 2px 0 #7f1d1d}.wd-hitl-help{font-size:12px;color:#6b7280;margin-top:12px;font-weight:700}`;
    document.documentElement.appendChild(style);
    document.body.appendChild(el);
    el.addEventListener('click', (event) => { if (event.target === el) cancelarEntradaHitl('clique fora'); });
    el.querySelector('#wd-hitl-cancel').addEventListener('click', () => cancelarEntradaHitl('botão'));
    window.addEventListener('keydown', onHitlKeyDown, true);
  }

  function solicitarConfirmacaoHitl(resultado, segundos = 8) {
    if (!IS_TOP_FRAME) return Promise.resolve(true);
    if (hitlState) return Promise.resolve(false);
    criarHitlOverlay(resultado, segundos);
    return new Promise((resolve) => {
      hitlState = { resolve, restante: segundos, timer: null };
      hitlState.timer = setInterval(() => {
        if (!hitlState) return;
        hitlState.restante -= 1;
        const count = document.getElementById('wd-hitl-seconds');
        if (count) count.textContent = String(Math.max(0, hitlState.restante));
        if (hitlState.restante <= 0) {
          clearInterval(hitlState.timer);
          const resolver = hitlState.resolve;
          hitlState = null;
          removerHitlOverlay();
          resolver(true);
        }
      }, 1000);
    });
  }

  function publicarStatusWsExterno(status = null, resultado = null, best = null) {
    if (!IS_TOP_FRAME || !chrome?.runtime?.sendMessage) return;
    const now = Date.now();
    if (now - ultimoEnvioWsExterno < 1200) return;
    ultimoEnvioWsExterno = now;
    try {
      chrome.runtime.sendMessage({
        action: 'SEND_TO_WS',
        payload: {
          type: 'STATUS_UPDATE',
          source: 'content',
          href: location.href,
          status,
          resultado,
          bestSource: best?.source || null,
          isBacBo: isLikelyBacBoPage(),
          bridgeFrames: frameSnapshots.size,
          historyCount: lastHistoryCount,
          wsHistoryCount: wsState.history.length,
          bettingOpen: wsState.bettingOpen,
          bankroll: Math.floor(Core.getBankrollAtual()),
          lucro: Math.floor(Core.estadoRobo.lucroSessao),
          stake: Math.floor(Core.estadoRobo.stakeAtual),
          gale: Core.estadoRobo.galeAtual,
          ativo: Core.estadoRobo.roboAtivo,
          shadowMode: Core.estadoRobo.config.shadowMode,
          timestamp: now
        }
      }, () => void chrome.runtime.lastError);
    } catch (_) { }
  }

  let ultimoHashAnalisado = '';

  // Monitor em tempo real: Chama detectarPadrao() quando histórico muda e atualiza UI
  // Roda a cada 800ms independentemente do estado do robô (sempre ativo)
  // Exibe: [Lado] — [Padrão] | Confiança X% | P:Score B:Score
  // Se acao === 'SKIP': exibe ⏸️ motivo (mesa instável, aguardando)
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
    if (hitlState) return;
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
    Core.estadoRobo.ultimaAnalise = resultado;
    atualizarOverlay(`Analisando ${history.length} resultados (${best.source})`, resultado);
    publicarStatusWsExterno('ANALISANDO', resultado, best);

    if (!Core.deveApostar(resultado)) {
      if (resultado.acao === 'SKIP') Core.adicionarLog('SKIP', resultado.motivo, resultado);
      return;
    }

    if (!estaEmFaseDeAposta()) {
      Core.adicionarLog('SKIP', 'Fora da janela de apostas; entrada ignorada para evitar clique inválido', { resultado, source: best.source, wsBettingOpen: wsState.bettingOpen });
      atualizarOverlay('Fora da janela de apostas', resultado);
      return;
    }

    lastActionAt = Date.now();

    if (!Core.estadoRobo.config.shadowMode) {
      atualizarOverlay('Aguardando confirmação HITL', resultado);
      publicarStatusWsExterno('HITL_AGUARDANDO', resultado, best);
      const confirmado = await solicitarConfirmacaoHitl(resultado, Number(Core.estadoRobo.config.hitlCountdownSegundos) || 8);
      if (!confirmado) {
        atualizarOverlay('Entrada cancelada', resultado);
        publicarStatusWsExterno('HITL_CANCELADO', resultado, best);
        return;
      }
      if (!Core.estadoRobo.roboAtivo || !estaEmFaseDeAposta()) {
        Core.adicionarLog('SKIP', 'Entrada abortada após HITL: robô desligado ou janela de apostas fechada', { resultado });
        atualizarOverlay('Entrada abortada após countdown', resultado);
        return;
      }
    }

    Core.registrarAposta(resultado);
    if (Core.estadoRobo.ultimaAposta) {
      Core.estadoRobo.ultimaAposta.historyHash = historyHash;
      Core.estadoRobo.ultimaAposta.roundId = wsState.roundId || null;
      Core.estadoRobo.ultimoResultadoProcessadoHash = historyHash;
    }
    if (Core.estadoRobo.config.shadowMode || SUGESTOES_APENAS) {
      const msg = SUGESTOES_APENAS ? 'Sugestão de entrada' : 'Shadow mode: entrada simulada';
      atualizarOverlay(msg, resultado);
      publicarStatusWsExterno(SUGESTOES_APENAS ? 'SUGESTAO_EXIBIDA' : 'ENTRADA_SIMULADA', resultado, best);
      return;
    }
    const exec = await executarApostaNoMelhorFrame(best, resultado);
    Core.adicionarLog(exec.ok ? 'APOSTA' : 'ERRO', exec.motivo, { resultado, best });
    atualizarOverlay(exec.ok ? 'Aposta enviada' : `Falha: ${exec.motivo}`, resultado);
    publicarStatusWsExterno(exec.ok ? 'APOSTA_ENVIADA' : 'ERRO_APOSTA', resultado, best);
  }

  function iniciarObserver() {
    if (observerStarted) return;
    if (!document.body) {
      // Aguarda body existir para anexar observer
      setTimeout(iniciarObserver, 200);
      return;
    }
    observerStarted = true;
    new MutationObserver(() => window.setTimeout(cicloPrincipal, 250)).observe(document.body, { childList: true, subtree: true, attributes: true, characterData: true });
    window.setInterval(cicloPrincipal, 1200);
    window.setInterval(atualizarIndicacoesDeEntrada, 800);
    window.setInterval(monitorarBancaTela, 2500); // [EXTENSÃO 4] Monitor de banca
  }

  function getStatus() {
    const minConfianca = Number(Core.estadoRobo.config.minConfianca) || 58;
    const isBacBo = isLikelyBacBoPage();
    let semaforo = { status: 'AGUARDANDO', cor: '#d1d5db', confianca: 0, p: 0, b: 0 };

    if (Core.estadoRobo.ultimaAnalise) {
      const res = Core.estadoRobo.ultimaAnalise;
      semaforo.confianca = res.confianca || 0;
      semaforo.p = res.scoreP || 0;
      semaforo.b = res.scoreB || 0;
      semaforo.acao = res.acao;
      if (res.acao === 'SKIP') {
        semaforo.status = 'NÃO INDICADO';
        semaforo.cor = '#ef4444'; // Vermelho
      } else {
        if (res.confianca >= minConfianca) {
          semaforo.status = 'INDICADO';
          semaforo.cor = '#10b981'; // Verde
        } else {
          semaforo.status = 'ATENÇÃO';
          semaforo.cor = '#f59e0b'; // Amarelo
        }
      }
    }

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
      semaforo,
      isBacBo,
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
    if (request.action === 'MANUAL_BET') {
      const best = getBestHistory();
      const resultadoManual = {
        acao: request.acao,
        motivo: 'Aposta Manual via Painel',
        confianca: 100,
        scoreP: 0,
        scoreB: 0,
        galeCount: request.gale || 0,
        stake: request.stake
      };
      const apostaBackup = Core.estadoRobo.ultimaAposta;

      Core.estadoRobo.ultimaAposta = {
        id: `manual-${Date.now()}`,
        acao: request.acao,
        stake: request.stake,
        gale: request.gale || 0,
        motivo: 'Aposta Manual',
        timestamp: Date.now(),
        status: 'PENDENTE',
        historyHash: best.history?.join(''),
        roundId: wsState.roundId
      };

      executarApostaNoMelhorFrame(best, resultadoManual).then(exec => {
        if (!exec || !exec.ok) {
          Core.adicionarLog('ERRO', `Falha ao executar aposta manual: ${exec?.motivo || 'erro desconhecido'}`, exec);
          Core.estadoRobo.ultimaAposta = apostaBackup;
        } else {
          Core.adicionarLog('INFO', `Aposta manual executada: ${request.acao} com Stake R$${request.stake}`);
        }
      });
      sendResponse({ success: true });
      return true;
    }
    if (request.action === 'WS_MESSAGE') {
      const payload = request.payload || {};
      const action = payload.action || payload.type;
      if (action === 'CANCEL_BET') cancelarEntradaHitl('WebSocket');
      if (action === 'TOGGLE_ROBO') toggleRobo(Boolean(payload.ativo));
      if (action === 'UPDATE_CONFIG' && payload.config) {
        Core.atualizarConfiguracoes(payload.config);
        Core.salvarConfiguracoes();
      }
      sendResponse({ success: true });
      return true;
    }
    if (request.action === 'WS_CONNECTED') {
      Core.adicionarLog('WS', 'WebSocket externo reconectado via background');
      sendResponse({ success: true });
      return true;
    }
    if (request.action === 'WS_DISCONNECTED') {
      Core.adicionarLog('WS', 'WebSocket externo desconectado');
      sendResponse({ success: true });
      return true;
    }
    if (request.action === 'EXPORT_LOGS_CSV') { sendResponse({ success: true, csv: Core.exportarLogsCsv() }); return true; }
    return false;
  });

  async function init() {
    // Guard: aguarda body existir (necessário para MutationObserver)
    if (!document.body) {
      setTimeout(init, 100);
      return;
    }
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

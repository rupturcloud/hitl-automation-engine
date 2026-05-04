// modules/content/executor.js
// Motor de execução humanizada de apostas.
// Portado do realizarAposta.js (extensao 5) e adaptado para a arquitetura Bet IA.
//
// Responsabilidades:
//   - Cliques humanizados com jitter anti-bot (pointer/mouse events completos)
//   - Decomposição de stake em fichas disponíveis (greedy)
//   - Proteção automática de empate (~10% da stake)
//   - Cursor visual do robô com rastro e efeito de clique
//   - Sistema de fallback com parada automática após falhas consecutivas
//   - Keep-alive para manter sessão viva
//
// Contrato: expõe window.__BETIA.executor

(function () {
  'use strict';

  // ─── Fichas padrão Bac Bo (ordem decrescente para decomposição gulosa) ─────
  const BAC_BO_CHIPS = [12000, 10000, 5000, 2500, 500, 125, 25, 10, 5];

  // ─── Utilitários ──────────────────────────────────────────────────────────
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const jitter = (min = 250, max = 750) => min + Math.random() * (max - min);

  function isVisible(el) {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    return (
      rect.width > 0 &&
      rect.height > 0 &&
      style.visibility !== 'hidden' &&
      style.display !== 'none'
    );
  }

  // ─── Cursor Visual do Robô ────────────────────────────────────────────────
  let robotCursor = null;

  function initRobotVisuals() {
    if (robotCursor || !document.body) return;
    // Cria apenas no frame de topo para evitar duplicação em iframes
    try { if (window.top !== window) return; } catch (_) { return; }

    robotCursor = document.createElement('div');
    robotCursor.id = '__betia_robot_cursor__';
    robotCursor.style.cssText = `
      position: fixed; z-index: 2147483647; pointer-events: none;
      display: flex; align-items: flex-start;
      transition: all 0.2s cubic-bezier(0.23, 1, 0.32, 1);
      opacity: 0; transform: translate(-2px, -2px);
    `;
    robotCursor.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#ef4444" stroke="white" stroke-width="1.5"
           style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
        <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/>
      </svg>
      <div style="
        background: #ef4444; color: white;
        font-family: 'Inter', system-ui, sans-serif;
        font-size: 11px; font-weight: 800;
        padding: 2px 8px; border-radius: 10px;
        margin-left: -2px; margin-top: 14px;
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.2);
        white-space: nowrap;
      ">Robô</div>
    `;
    document.body.appendChild(robotCursor);
  }

  function criarRastro(x, y) {
    if (!document.body) return;
    const trail = document.createElement('div');
    trail.style.cssText = `
      position: fixed; left: ${x}px; top: ${y}px;
      width: 4px; height: 4px;
      background: rgba(239, 68, 68, 0.6); border-radius: 50%;
      pointer-events: none; z-index: 2147483646;
      transition: all 0.5s ease-out;
    `;
    document.body.appendChild(trail);
    setTimeout(() => {
      trail.style.transform = 'scale(0)';
      trail.style.opacity = '0';
      setTimeout(() => trail.remove(), 500);
    }, 50);
  }

  function efeitoClique(x, y) {
    if (!document.body) return;
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: fixed; left: ${x}px; top: ${y}px;
      width: 10px; height: 10px; margin-left: -5px; margin-top: -5px;
      border: 3px solid #ef4444; border-radius: 50%;
      pointer-events: none; z-index: 2147483647;
      transition: all 0.4s ease-out;
    `;
    document.body.appendChild(ripple);
    requestAnimationFrame(() => {
      ripple.style.width = '60px';
      ripple.style.height = '60px';
      ripple.style.marginLeft = '-30px';
      ripple.style.marginTop = '-30px';
      ripple.style.opacity = '0';
      ripple.style.borderWidth = '1px';
    });
    setTimeout(() => ripple.remove(), 400);
  }

  function moverRobo(x, y) {
    initRobotVisuals();
    if (!robotCursor) return;
    robotCursor.style.opacity = '1';
    robotCursor.style.left = x + 'px';
    robotCursor.style.top = y + 'px';
    criarRastro(x, y);
  }

  function esconderRobo() {
    if (robotCursor) robotCursor.style.opacity = '0';
  }

  // ─── Clique Humanizado ────────────────────────────────────────────────────
  async function humanClick(el) {
    if (!el) return false;
    try { window.focus(); el.focus(); } catch (_) {}
    el.scrollIntoView({ block: 'center', inline: 'center' });

    const rect = el.getBoundingClientRect();
    // Adiciona micro-offset aleatório para não clicar sempre no centro exato
    const offsetX = (Math.random() - 0.5) * rect.width * 0.3;
    const offsetY = (Math.random() - 0.5) * rect.height * 0.3;
    const x = Math.round(rect.left + rect.width / 2 + offsetX);
    const y = Math.round(rect.top + rect.height / 2 + offsetY);

    moverRobo(x, y);
    await sleep(jitter(150, 300));

    const optsBase = {
      bubbles: true, cancelable: true, view: window,
      clientX: x, clientY: y,
      screenX: window.screenX + x, screenY: window.screenY + y,
      pointerId: 1, pointerType: 'mouse', isPrimary: true,
    };

    // Simula movimentação natural do mouse
    el.dispatchEvent(new PointerEvent('pointerover', optsBase));
    el.dispatchEvent(new MouseEvent('mouseover', optsBase));
    el.dispatchEvent(new PointerEvent('pointermove', optsBase));
    el.dispatchEvent(new MouseEvent('mousemove', optsBase));
    await sleep(jitter(20, 70));

    const optsDown = { ...optsBase, button: 0, buttons: 1 };
    efeitoClique(x, y);
    el.dispatchEvent(new PointerEvent('pointerdown', optsDown));
    el.dispatchEvent(new MouseEvent('mousedown', optsDown));
    await sleep(jitter(60, 150));

    const optsUp = { ...optsBase, button: 0, buttons: 0 };
    el.dispatchEvent(new PointerEvent('pointerup', optsUp));
    el.dispatchEvent(new MouseEvent('mouseup', optsUp));
    el.dispatchEvent(new MouseEvent('click', optsBase));

    await sleep(jitter(100, 200));
    return true;
  }

  // ─── Decomposição de Stake ────────────────────────────────────────────────
  function decomporStake(stake) {
    let restante = Math.round(Number(stake));
    if (!Number.isFinite(restante) || restante < 5) return [];
    const chips = [];
    for (const chip of BAC_BO_CHIPS) {
      while (restante >= chip) {
        chips.push(chip);
        restante -= chip;
      }
    }
    return restante === 0 ? chips : [];
  }

  function calcularChipProtecao(stake) {
    const percentual10 = stake * 0.10;
    const chipMaisProximo = BAC_BO_CHIPS.find((c) => c <= percentual10) || 5;
    return chipMaisProximo;
  }

  // ─── Busca de Chips no DOM ────────────────────────────────────────────────
  function textOf(el) {
    return `${el.textContent || ''} ${el.getAttribute('aria-label') || ''} ${el.getAttribute('data-value') || ''} ${el.getAttribute('data-amount') || ''}`.trim();
  }

  function encontrarChip(valor) {
    const normalized = String(Math.round(Number(valor)));

    // Tenta calibração primeiro (prioridade máxima)
    const calEl = window.__BETIA.platformDetector?.resolveChipCalibrationElement?.(Number(valor));
    if (calEl && isVisible(calEl)) return calEl;

    const selectors = [
      `[data-betia-id="chip-${normalized}"]`,
      `[data-chip-value="${normalized}"]`,
      `[data-value="${normalized}"]`,
      `[data-amount="${normalized}"]`,
      `[aria-label*="${normalized}"]`,
      `[data-role="chip"]`,
      `[class*="chip" i]`,
      `button[value="${normalized}"]`,
    ];

    const candidatos = [];
    for (const sel of selectors) {
      try {
        document.querySelectorAll(sel).forEach((el) => {
          if (!candidatos.includes(el) && isVisible(el)) candidatos.push(el);
        });
      } catch (_) {}
    }

    return candidatos.find((el) => {
      const rawText = `${el.textContent || ''} ${el.getAttribute('aria-label') || ''} ${el.getAttribute('data-value') || ''} ${el.className || ''}`.toLowerCase();
      const numberRegex = new RegExp(`(?:^|[^0-9])0*${normalized}(?:[^0-9]|$)`);

      // Atributo explícito
      const attrs = String(el.getAttribute('data-value') || el.getAttribute('data-amount') || el.getAttribute('value') || '').replace(/\s/g, '').replace(/[R$.,]/g, '');
      if (attrs === normalized) return true;

      // Container de muitos chips — skip
      const filhos = el.querySelectorAll('[class*="chip" i], button');
      if (filhos.length > 2) return false;

      return numberRegex.test(rawText) && /chip|coin|token|bet/i.test(rawText);
    });
  }

  async function encontrarComRetry(fn, retries = 6, ms = 500) {
    let el = null;
    let tentativas = retries;
    while (tentativas > 0 && !el) {
      el = fn();
      if (!el) { tentativas--; if (tentativas > 0) await sleep(ms); }
    }
    return el;
  }

  async function selecionarChip(stake) {
    const valor = Math.round(Number(stake));
    if (!Number.isFinite(valor) || valor < 5) {
      return { ok: false, motivo: `Valor mínimo de chip é R$ 5` };
    }

    // Tenta chip exato
    const exato = await encontrarComRetry(() => encontrarChip(valor), 4, 150);
    if (exato) {
      await humanClick(exato);
      await sleep(jitter(100, 250));
      return { ok: true, motivo: `Chip R$ ${valor} selecionado`, chips: [valor] };
    }

    // Compõe com múltiplos chips
    const composicao = decomporStake(valor);
    if (!composicao.length) {
      return { ok: false, motivo: `Não foi possível compor R$ ${valor} com chips Bac Bo` };
    }

    const clicados = [];
    for (const chip of composicao) {
      const el = await encontrarComRetry(() => encontrarChip(chip), 3, 100);
      if (!el) {
        return { ok: false, motivo: `Chip R$ ${chip} não encontrado para compor R$ ${valor}`, chips: clicados };
      }
      await humanClick(el);
      clicados.push(chip);
      await sleep(jitter(80, 180));
    }
    return { ok: true, motivo: `Chips [${clicados.join(' + ')}]`, chips: clicados };
  }

  // ─── Busca de Área de Aposta ──────────────────────────────────────────────
  function candidatosArea(acao) {
    const nomeBet = acao === 'P' ? 'player' : acao === 'B' ? 'banker' : 'tie';
    const terms = acao === 'P'
      ? ['player', 'jogador', 'azul', 'blue']
      : acao === 'B'
        ? ['banker', 'banca', 'vermelho', 'red']
        : ['tie', 'empate', 'amarelo', 'yellow', 'gold'];

    // Usa o detector de plataforma se disponível (prioridade)
    const pd = window.__BETIA.platformDetector;
    if (pd) {
      const target = nomeBet.toUpperCase();
      const platform = window.__BETIA.platform;
      const selectorList = platform?.domSelectors?.[`bet${target.charAt(0) + target.slice(1).toLowerCase()}`] || [];

      // Tenta calibração primeiro
      const calResult = pd.resolveCalibrationElement?.(target);
      if (calResult?.element && calResult.score >= 16) {
        return [{ el: calResult.element, score: 2000, strategy: 'calibration' }];
      }

      // Tenta seletores exatos da plataforma
      for (const sel of selectorList) {
        try {
          const els = Array.from(document.querySelectorAll(sel)).filter(isVisible);
          if (els.length > 0) {
            return els.map((el) => ({ el, score: 1000, strategy: 'platform-selector' }));
          }
        } catch (_) {}
      }
    }

    // Fallback: busca genérica
    const all = [];
    const docs = [document];
    try {
      document.querySelectorAll('iframe').forEach((iframe) => {
        try { if (iframe.contentDocument) docs.push(iframe.contentDocument); } catch (_) {}
      });
    } catch (_) {}

    // data-bet exato
    for (const doc of docs) {
      try {
        doc.querySelectorAll(`[data-bet="${nomeBet}"]`).forEach((el) => {
          if (!all.includes(el) && isVisible(el)) all.push(el);
        });
      } catch (_) {}
    }
    if (all.length > 0) {
      return all.map((el) => ({ el, score: 1000, strategy: 'data-bet' }));
    }

    // Heurística
    const allCandidatos = [];
    for (const doc of docs) {
      try {
        doc.querySelectorAll('button, [role="button"], div[onclick], [class*="bet" i], [class*="area" i]').forEach((el) => {
          if (!allCandidatos.includes(el) && isVisible(el)) allCandidatos.push(el);
        });
      } catch (_) {}
    }

    return allCandidatos
      .map((el) => {
        const cls = typeof el.className === 'string' ? el.className : el.getAttribute('class') || '';
        const fullText = `${textOf(el)} ${cls} ${el.id || ''} ${el.getAttribute('aria-label') || ''} ${el.getAttribute('data-bet') || ''}`.toLowerCase();
        let score = 0;
        for (const term of terms) {
          if (new RegExp(`\\b${term}\\b`, 'i').test(fullText)) score += 300;
        }
        if (/bet|area|spot|zone|button/i.test(cls)) score += 150;
        if (/history|road|score|trend|bead|nav|panel|chip|overlay|board/i.test(fullText)) score -= 1000;
        const rect = el.getBoundingClientRect();
        if (rect.width * rect.height > window.innerWidth * window.innerHeight * 0.3) score -= 300;
        return { el, score, strategy: 'heuristic' };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);
  }

  async function clicarNaArea(acao) {
    const nomeAcao = acao === 'P' ? 'PLAYER' : acao === 'B' ? 'BANKER' : 'TIE';
    let areasObj = [];
    let tentativas = 8;

    while (tentativas > 0 && !areasObj.length) {
      areasObj = candidatosArea(acao);
      if (!areasObj.length) { tentativas--; if (tentativas > 0) await sleep(500); }
    }

    if (!areasObj.length) {
      return { ok: false, motivo: `Área ${nomeAcao} não encontrada na UI` };
    }

    areasObj.sort((a, b) => b.score - a.score);
    for (let i = 0; i < Math.min(areasObj.length, 3); i++) {
      const el = areasObj[i].el;
      if (!isVisible(el)) continue;
      const rect = el.getBoundingClientRect();
      if (rect.width <= 10 || rect.height <= 10) continue;

      await humanClick(el);
      await sleep(jitter(300, 700));
      return { ok: true, motivo: `Clique em ${nomeAcao} executado` };
    }

    return { ok: false, motivo: `Nenhum candidato válido para ${nomeAcao}` };
  }

  // ─── Sistema de Fallback ──────────────────────────────────────────────────
  const fallbackState = {
    falhas: [],
    tentativas: 0,
    maxTentativasConsecutivas: 5,
    parado: false,
  };

  function registrarFalha(etapa, motivo) {
    fallbackState.falhas.push({ timestamp: new Date().toISOString(), etapa, motivo });
    fallbackState.tentativas++;
    console.error(`[Bet IA Executor] ✗ Falha #${fallbackState.tentativas}: ${etapa} — ${motivo}`);

    if (fallbackState.tentativas >= fallbackState.maxTentativasConsecutivas) {
      fallbackState.parado = true;
      console.error('[Bet IA Executor] ⛔ PARADA AUTOMÁTICA após falhas consecutivas');
      try {
        chrome.runtime.sendMessage({
          type: 'EXECUTOR_EMERGENCY_STOP',
          razao: 'Seletores desatualizados — recalibre manualmente',
          falhas: fallbackState.falhas.slice(-5),
        }).catch(() => {});
      } catch (_) {}
    }
  }

  function resetarFalhas() {
    fallbackState.tentativas = 0;
    fallbackState.parado = false;
  }

  // ─── Função Principal: realizarAposta ─────────────────────────────────────
  async function realizarAposta(acao, stake, options = {}) {
    if (fallbackState.parado) {
      return { ok: false, motivo: 'Robô parado por muitas falhas — recalibre manualmente' };
    }

    const nomeAcao = acao === 'P' ? 'PLAYER' : acao === 'B' ? 'BANKER' : 'TIE';
    if (!['P', 'B', 'T'].includes(acao)) {
      return { ok: false, motivo: `Ação inválida: ${acao}` };
    }

    console.log(`[Bet IA Executor] ═══ APOSTA: ${nomeAcao} R$ ${stake} ═══`);
    await sleep(jitter(150, 350));

    // Etapa 1: Selecionar chip
    const chip = await selecionarChip(stake);
    if (!chip.ok) {
      registrarFalha('selecionarChip', chip.motivo);
      return chip;
    }
    resetarFalhas();

    // Etapa 2: Clicar na área
    const area = await clicarNaArea(acao);
    if (!area.ok) {
      registrarFalha('clicarNaArea', area.motivo);
      return area;
    }
    resetarFalhas();

    // Etapa 3: Proteção automática de empate
    if (acao !== 'T' && options.protecao !== false) {
      const valorProtecao = calcularChipProtecao(stake);
      console.log(`[Bet IA Executor] Proteção: R$ ${valorProtecao} no EMPATE`);
      await sleep(jitter(50, 150));
      const chipTie = await selecionarChip(valorProtecao);
      if (chipTie.ok) {
        const areaTie = await clicarNaArea('T');
        if (areaTie.ok) {
          console.log(`[Bet IA Executor] ✓ Proteção adicionada`);
        }
      }
    }

    esconderRobo();
    console.log(`[Bet IA Executor] ✓ APOSTA COMPLETA: ${nomeAcao} R$ ${stake}`);

    // Notifica o background/sidepanel
    try {
      chrome.runtime.sendMessage({
        type: 'EXECUTOR_BET_COMPLETED',
        data: { acao, nomeAcao, stake, chips: chip.chips, ts: Date.now() },
      }).catch(() => {});
    } catch (_) {}

    return { ok: true, motivo: `Aposta ${nomeAcao} R$ ${stake} executada com proteção` };
  }

  // ─── Keep-Alive ───────────────────────────────────────────────────────────
  const KEEP_ALIVE_INTERVAL = 4 * 60 * 1000;
  let keepAliveTimer = null;

  function encontrarPontoNeutro() {
    const seletores = [
      '[class*="close"][aria-label]', '[class*="close"]', '[class*="dismiss"]',
      '[role="button"][aria-label*="fechar"]', '[role="button"][aria-label*="close"]',
      'button[title*="close" i]', '[class*="menu"]', document.body,
    ];
    return seletores.map((s) => typeof s === 'string' ? document.querySelector(s) : s)
      .find((el) => el && isVisible(el));
  }

  function executarKeepAlive() {
    const spot = encontrarPontoNeutro();
    if (!spot) return;
    spot.dispatchEvent(new MouseEvent('click', {
      bubbles: true, cancelable: true, view: window,
      clientX: Math.random() * 10, clientY: Math.random() * 10,
    }));
    console.log(`[Bet IA Keep-Alive] ✓ Pulse em ${new Date().toLocaleTimeString()}`);
  }

  function iniciarKeepAlive() {
    if (keepAliveTimer) return;
    keepAliveTimer = setInterval(executarKeepAlive, KEEP_ALIVE_INTERVAL);
  }

  function pararKeepAlive() {
    if (keepAliveTimer) { clearInterval(keepAliveTimer); keepAliveTimer = null; }
  }

  // ─── API Pública ──────────────────────────────────────────────────────────
  window.__BETIA.executor = {
    realizarAposta,
    humanClick,
    decomporStake,
    selecionarChip,
    clicarNaArea,
    esconderRobo,
    // Fallback
    fallbackState: () => ({ ...fallbackState }),
    getFalhas: () => fallbackState.falhas,
    resetarFalhas,
    isPaused: () => fallbackState.parado,
    // Keep-alive
    iniciarKeepAlive,
    pararKeepAlive,
  };

  console.log('[Bet IA Executor] Motor humanizado carregado.');
})();

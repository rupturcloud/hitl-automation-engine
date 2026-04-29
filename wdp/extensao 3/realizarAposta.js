// realizarAposta.js — Visual apenas. Cliques reais delegados ao selenium_driver.py.
// O content.js envia o comando via WebSocket; este módulo só anima o cursor e exibe feedback.
(function () {
  'use strict';

  const BAC_BO_CHIPS = [2500, 500, 125, 25, 10, 5];

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // --- Sistema Visual do Robô (mantido intacto) ---
  let robotCursor = null;

  function initRobotVisuals() {
    if (robotCursor || !document.body) return;
    robotCursor = document.createElement('div');
    robotCursor.id = 'wdp-robot-cursor';
    robotCursor.style.cssText = `
      position: fixed;
      z-index: 2147483647;
      pointer-events: none;
      display: flex;
      align-items: flex-start;
      transition: all 0.2s cubic-bezier(0.23, 1, 0.32, 1);
      opacity: 0;
      transform: translate(-2px, -2px);
    `;
    robotCursor.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#ef4444" stroke="white" stroke-width="1.5" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
        <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/>
      </svg>
      <div style="
        background: #ef4444;
        color: white;
        font-family: 'Inter', sans-serif, system-ui;
        font-size: 11px;
        font-weight: 800;
        padding: 2px 8px;
        border-radius: 10px;
        margin-left: -2px;
        margin-top: 14px;
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.2);
        white-space: nowrap;
      ">Robô</div>
    `;
    document.body.appendChild(robotCursor);
  }

  function criarRastro(x, y) {
    const trail = document.createElement('div');
    trail.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: 4px;
      height: 4px;
      background: rgba(239, 68, 68, 0.6);
      border-radius: 50%;
      pointer-events: none;
      z-index: 2147483646;
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
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: 10px;
      height: 10px;
      margin-left: -5px;
      margin-top: -5px;
      border: 3px solid #ef4444;
      border-radius: 50%;
      pointer-events: none;
      z-index: 2147483647;
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

  const jitter = (min = 250, max = 750) => min + Math.random() * (max - min);

  function isVisible(el) {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
  }

  // humanClick: APENAS visual — sem dispatchEvent. Clique real é feito pelo selenium_driver.py.
  async function humanClick(el) {
    if (!el) return false;
    try { el.scrollIntoView({ block: 'center', inline: 'center' }); } catch (_) {}
    const rect = el.getBoundingClientRect();
    const x = Math.round(rect.left + rect.width / 2);
    const y = Math.round(rect.top + rect.height / 2);
    moverRobo(x, y);
    efeitoClique(x, y);
    await sleep(jitter(150, 300));
    return true;
  }

  function textOf(el) {
    return `${el.textContent || ''} ${el.getAttribute('aria-label') || ''} ${el.getAttribute('title') || ''} ${el.getAttribute('data-value') || ''} ${el.getAttribute('data-amount') || ''}`.trim();
  }

  function normalizarNumeroTexto(text) {
    return String(text || '').replace(/\s/g, '').replace(/[R$.,]/g, '');
  }

  function encontrarChip(valor) {
    const normalizedStake = String(Math.round(Number(valor)));
    const selectors = [
      `[data-value="${normalizedStake}"]`,
      `[data-amount="${normalizedStake}"]`,
      `[aria-label*="${normalizedStake}"]`,
      `[data-role="chip"]`,
      `[class*="chip" i]`,
      `button[value="${normalizedStake}"]`,
      `button`,
      `div[role="button"]`,
      `[role="button"]`
    ];
    const candidatos = [];
    for (const selector of selectors) {
      document.querySelectorAll(selector).forEach((el) => {
        if (!candidatos.includes(el) && isVisible(el)) candidatos.push(el);
      });
    }
    return candidatos.find((el) => {
      const rawText = `${el.textContent || ''} ${el.getAttribute('aria-label') || ''} ${el.getAttribute('data-value') || ''} ${el.className || ''}`.toLowerCase();
      const numberRegex = new RegExp(`(?:^|[^0-9])0*${normalizedStake}(?:[^0-9]|$)`);
      const attrs = normalizarNumeroTexto(`${el.getAttribute('data-value') || ''} ${el.getAttribute('data-amount') || ''} ${el.getAttribute('value') || ''}`);
      if (attrs === normalizedStake) return true;
      const filhos = el.querySelectorAll('[class*="chip" i], button');
      if (filhos.length > 2) return false;
      return numberRegex.test(rawText) && (/chip|coin|token|bet/i.test(rawText));
    });
  }

  function decomporStake(stake) {
    let restante = Math.round(Number(stake));
    if (!Number.isFinite(restante) || restante < 5) return [];
    const chips = [];
    for (const chip of BAC_BO_CHIPS) {
      while (restante >= chip) { chips.push(chip); restante -= chip; }
    }
    return restante === 0 ? chips : [];
  }

  async function encontrarComRetry(fnBusca, retries = 3, ms = 300) {
    let el = null;
    let tentativas = retries;
    while (tentativas > 0 && !el) {
      el = fnBusca();
      if (!el) { tentativas--; if (tentativas > 0) await sleep(ms); }
    }
    return el;
  }

  function candidatosArea(acao) {
    const isP = acao === 'P';
    const terms = isP
      ? ['player', 'jogador', 'azul', 'blue']
      : acao === 'B'
        ? ['banker', 'banca', 'vermelho', 'red']
        : ['tie', 'empate', 'amarelo', 'yellow', 'gold'];
    const selectors = [
      `[data-bet="${isP ? 'player' : acao === 'B' ? 'banker' : 'tie'}"]`,
      `[data-role*="${isP ? 'player' : acao === 'B' ? 'banker' : 'tie'}" i]`,
      `[class*="${isP ? 'player' : acao === 'B' ? 'banker' : 'tie'}" i]`,
      'button', '[role="button"]', 'div', 'path', 'g'
    ];
    const all = [];
    for (const selector of selectors) {
      try { document.querySelectorAll(selector).forEach((el) => { if (!all.includes(el) && isVisible(el)) all.push(el); }); } catch (_) {}
    }
    return all
      .map((el) => {
        const className = (el.className && typeof el.className === 'string' ? el.className : el.getAttribute('class') || '');
        const dataBet = el.getAttribute('data-bet') || '';
        const haystack = `${textOf(el)} ${className} ${el.id || ''} ${el.getAttribute('aria-label') || ''} ${dataBet}`.toLowerCase();
        let score = 0;
        if (/history|road|score|trend|statistic|bead|nav|panel|chip|overlay/i.test(haystack)) score -= 1000;
        if (/spot|bet|area|zone|click/i.test(haystack)) score += 500;
        if (dataBet === (isP ? 'player' : acao === 'B' ? 'banker' : 'tie')) score += 1000;
        return { el, haystack, score };
      })
      .filter((item) => item.score > -500 && terms.some((term) => item.haystack.includes(term)));
  }

  // realizarAposta: anima cursor na direção certa, sem clicar.
  // O clique real é executado pelo selenium_driver.py após receber o PERFORM_BET via WS.
  async function realizarAposta(acao, stake, options = {}) {
    if (!['P', 'B', 'T'].includes(acao)) return { ok: true, motivo: 'Visual skip' };
    await sleep(jitter(300, 600));

    // Anima cursor para o chip
    const chipEl = await encontrarComRetry(() => encontrarChip(Math.round(Number(stake))), 3, 300);
    if (chipEl) await humanClick(chipEl);

    // Anima cursor para a área de aposta
    const areasObj = candidatosArea(acao);
    if (areasObj.length) {
      areasObj.sort((a, b) => b.score - a.score);
      await humanClick(areasObj[0].el);
    }

    return { ok: true, motivo: 'Visual OK — aguardando SeleniumBase' };
  }

  globalThis.WillDadosAposta = { realizarAposta, humanClick, decomporStake, encontrarChip };
})();

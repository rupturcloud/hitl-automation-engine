// realizarAposta.js
// Automação de cliques. Por segurança, o content.js chama isto apenas quando shadowMode=false.
(function () {
  'use strict';

  const BAC_BO_CHIPS = [2500, 500, 125, 25, 10, 5];
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const jitter = (min = 250, max = 750) => min + Math.random() * (max - min);

  function isVisible(el) {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
  }

  async function humanClick(el) {
    if (!el) return false;
    try { window.focus(); el.focus(); } catch (_) {}
    el.scrollIntoView({ block: 'center', inline: 'center' });
    await sleep(jitter(60, 160));
    
    const rect = el.getBoundingClientRect();
    const x = Math.round(rect.left + rect.width / 2);
    const y = Math.round(rect.top + rect.height / 2);
    
    const optsBase = { 
       bubbles: true, cancelable: true, view: window, 
       clientX: x, clientY: y, screenX: window.screenX + x, screenY: window.screenY + y,
       pointerId: 1, pointerType: 'mouse', isPrimary: true
    };
    
    el.dispatchEvent(new PointerEvent('pointermove', optsBase));
    el.dispatchEvent(new MouseEvent('mousemove', optsBase));
    await sleep(jitter(20, 70));
    
    const optsDown = { ...optsBase, button: 0, buttons: 1 };
    el.dispatchEvent(new PointerEvent('pointerdown', optsDown));
    el.dispatchEvent(new MouseEvent('mousedown', optsDown));
    await sleep(jitter(35, 110));
    
    const optsUp = { ...optsBase, button: 0, buttons: 0 };
    el.dispatchEvent(new PointerEvent('pointerup', optsUp));
    el.dispatchEvent(new MouseEvent('mouseup', optsUp));
    el.dispatchEvent(new MouseEvent('click', optsBase));
    
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

    // Busca exata para evitar pegar a Div Container de todos os chips (que teria "5 10 25 100")
    return candidatos.find((el) => {
      const rawText = `${el.textContent || ''} ${el.getAttribute('aria-label') || ''} ${el.getAttribute('data-value') || ''} ${el.className || ''}`.toLowerCase();
      // Precisamos que o número 5 esteja isolado de outros números (ex: não queremos 50, nem 15)
      const numberRegex = new RegExp(`(?:^|[^0-9])0*${normalizedStake}(?:[^0-9]|$)`);
      
      const attrs = normalizarNumeroTexto(`${el.getAttribute('data-value') || ''} ${el.getAttribute('data-amount') || ''} ${el.getAttribute('value') || ''}`);
      if (attrs === normalizedStake) return true;
      
      // Checar se ele é o container de muitos chips (tem muitos filhos que também são chips)
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
      while (restante >= chip) {
        chips.push(chip);
        restante -= chip;
      }
    }
    return restante === 0 ? chips : [];
  }

  async function selecionarChip(stake) {
    const valor = Math.round(Number(stake));
    if (!Number.isFinite(valor) || valor < 5) return { ok: false, motivo: `Valor mínimo de chip é R$ 5` };

    const exato = encontrarChip(valor);
    if (exato) {
      await humanClick(exato);
      await sleep(jitter(250, 550));
      return { ok: true, motivo: `Chip R$ ${valor} selecionado`, chips: [valor] };
    }

    const composicao = decomporStake(valor);
    if (!composicao.length) return { ok: false, motivo: `Não foi possível compor R$ ${valor} com chips Bac Bo` };

    const clicados = [];
    const infoAlvos = [];
    for (const chip of composicao) {
      const el = encontrarChip(chip);
      if (!el) return { ok: false, motivo: `Chip R$ ${chip} não encontrado para compor R$ ${valor}`, chips: clicados };
      await humanClick(el);
      clicados.push(chip);
      infoAlvos.push(`<${el.tagName.toLowerCase()} class="${el.className || ''}">`);
      await sleep(jitter(220, 480));
    }
    return { ok: true, motivo: `Chips [${infoAlvos.join(', ')}]`, chips: clicados };
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
      'button',
      '[role="button"]',
      'div',
      'path',
      'g'
    ];

    const all = [];
    for (const selector of selectors) {
      try {
        document.querySelectorAll(selector).forEach((el) => {
          if (!all.includes(el) && isVisible(el)) all.push(el);
        });
      } catch (_) {}
    }

    return all
      .map((el) => {
        const className = (el.className && typeof el.className === 'string' ? el.className : el.getAttribute('class') || '');
        const id = el.id || '';
        const aria = el.getAttribute('aria-label') || '';
        const dataBet = el.getAttribute('data-bet') || '';
        const haystack = `${textOf(el)} ${className} ${id} ${aria} ${dataBet}`.toLowerCase();
        
        // Punição severa para coisas de histórico
        let score = 0;
        if (/history|road|score|trend|statistic|bead|nav|panel|chip|overlay/i.test(haystack)) score -= 1000;
        if (/spot|bet|area|zone|click/i.test(haystack)) score += 500;
        if (dataBet === (isP ? 'player' : acao === 'B' ? 'banker' : 'tie')) score += 1000;
        
        return { el, haystack, score };
      })
      .filter((item) => item.score > -500 && terms.some((term) => item.haystack.includes(term)))
      .map((item) => item);
  }

  async function clicarNaArea(acao) {
    const areasObj = candidatosArea(acao);
    if (!areasObj.length) return { ok: false, motivo: `Área ${acao} não encontrada` };

    // Preferir elementos com maior score de "bet spot", depois por tamanho razoável (nem muito pequeno, nem tela inteira)
    areasObj.sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score;
      const ra = a.el.getBoundingClientRect();
      const rb = b.el.getBoundingClientRect();
      const areaA = ra.width * ra.height;
      const areaB = rb.width * rb.height;
      const maxArea = (window.innerWidth * window.innerHeight) * 0.4;
      
      const aValido = areaA > 100 && areaA < maxArea;
      const bValido = areaB > 100 && areaB < maxArea;
      
      if (aValido && !bValido) return -1;
      if (!aValido && bValido) return 1;
      return areaB - areaA;
    });

    const alvo = areasObj[0].el;
    await humanClick(alvo);
    await sleep(jitter(300, 700));
    const detalhesAlvo = `<${alvo.tagName.toLowerCase()} class="${alvo.className || ''}" id="${alvo.id || ''}">`;
    return { ok: true, motivo: `Clique em ${acao} [${detalhesAlvo}]` };
  }

  async function realizarAposta(acao, stake, options = {}) {
    if (!['P', 'B', 'T'].includes(acao)) return { ok: false, motivo: 'Ação inválida' };

    await sleep(jitter(400, 900));
    const chip = await selecionarChip(stake);
    if (!chip.ok) return chip;

    const area = await clicarNaArea(acao);
    if (!area.ok) return area;

    if (options.protecaoEmpate && acao !== 'T' && Number(options.valorProtecao) > 0) {
      await sleep(jitter(250, 600));
      const chipTie = await selecionarChip(options.valorProtecao);
      if (chipTie.ok) await clicarNaArea('T');
    }

    return { ok: true, motivo: `Aposta ${acao} enviada: ${chip.motivo} -> ${area.motivo}` };
  }

  globalThis.WillDadosAposta = { realizarAposta, selecionarChip, clicarNaArea, humanClick, decomporStake, encontrarChip };
})();

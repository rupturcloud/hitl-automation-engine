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
    el.scrollIntoView({ block: 'center', inline: 'center' });
    await sleep(jitter(60, 160));
    const rect = el.getBoundingClientRect();
    const x = rect.left + rect.width * (0.35 + Math.random() * 0.30);
    const y = rect.top + rect.height * (0.35 + Math.random() * 0.30);
    const opts = { bubbles: true, cancelable: true, view: window, clientX: x, clientY: y, pointerId: 1, pointerType: 'mouse', isPrimary: true };
    el.dispatchEvent(new PointerEvent('pointermove', opts));
    el.dispatchEvent(new MouseEvent('mousemove', opts));
    await sleep(jitter(20, 70));
    el.dispatchEvent(new PointerEvent('pointerdown', opts));
    el.dispatchEvent(new MouseEvent('mousedown', opts));
    await sleep(jitter(35, 110));
    el.dispatchEvent(new PointerEvent('pointerup', opts));
    el.dispatchEvent(new MouseEvent('mouseup', opts));
    el.dispatchEvent(new MouseEvent('click', opts));
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
      `button[value="${normalizedStake}"]`,
      `[class*="chip"]`,
      `[class*="Chip"]`,
      `button`,
      `[role="button"]`
    ];

    const candidatos = [];
    for (const selector of selectors) {
      document.querySelectorAll(selector).forEach((el) => {
        if (!candidatos.includes(el) && isVisible(el)) candidatos.push(el);
      });
    }

    return candidatos.find((el) => {
      const text = normalizarNumeroTexto(textOf(el));
      const attrs = normalizarNumeroTexto(`${el.getAttribute('data-value') || ''} ${el.getAttribute('data-amount') || ''} ${el.getAttribute('value') || ''}`);
      return text === normalizedStake || attrs === normalizedStake || text.includes(normalizedStake);
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
    for (const chip of composicao) {
      const el = encontrarChip(chip);
      if (!el) return { ok: false, motivo: `Chip R$ ${chip} não encontrado para compor R$ ${valor}`, chips: clicados };
      await humanClick(el);
      clicados.push(chip);
      await sleep(jitter(220, 480));
    }
    return { ok: true, motivo: `Composição R$ ${valor}: ${clicados.join(' + ')}`, chips: clicados };
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
      'div'
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
      .map((el) => ({ el, haystack: `${textOf(el)} ${el.className || ''} ${el.id || ''}`.toLowerCase() }))
      .filter((item) => terms.some((term) => item.haystack.includes(term)))
      .map((item) => item.el);
  }

  async function clicarNaArea(acao) {
    const areas = candidatosArea(acao);
    if (!areas.length) return { ok: false, motivo: `Área ${acao} não encontrada` };

    // Preferir elementos grandes, típicos de área de aposta.
    areas.sort((a, b) => {
      const ra = a.getBoundingClientRect();
      const rb = b.getBoundingClientRect();
      return (rb.width * rb.height) - (ra.width * ra.height);
    });

    await humanClick(areas[0]);
    await sleep(jitter(300, 700));
    return { ok: true, motivo: `Clique em ${acao}` };
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

    return { ok: true, motivo: `Aposta enviada em ${acao}`, chip: chip.motivo, area: area.motivo };
  }

  globalThis.WillDadosAposta = { realizarAposta, selecionarChip, clicarNaArea, humanClick, decomporStake, encontrarChip };
})();

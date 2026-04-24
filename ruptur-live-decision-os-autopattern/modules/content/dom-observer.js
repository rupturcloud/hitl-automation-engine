// modules/content/dom-observer.js
// Responsabilidade: observar o DOM da banca por mudanças relevantes.
// Para ajustar seletores ou adicionar novos campos: edite APENAS este arquivo.
// Contrato de saída: escreve em window.__BETIA.state.domData

(function () {
  'use strict';

  // ─── Heurísticas de seletores (por prioridade) ─────────────────────────────
  // Adicionar novos seletores aqui para suportar mais plataformas.
  // O sistema tenta cada seletor em ordem e para no primeiro que retornar texto.
  const SELECTORS = {
    history: [
      // Nosso próprio data attribute (banca simulada)
      '[data-betia-result]',
      '[data-result]',
      // Evolution Gaming / BetBoom — seletores conhecidos do roadmap Bac Bo
      '[class*="road__item"] [aria-label]',
      '[class*="RoadItem"] [aria-label]',
      '[class*="roadmap__cell"] [aria-label]',
      '[class*="BeadPlate"] [aria-label]',
      '[class*="bead-plate"] [aria-label]',
      '[class*="road-map"] [aria-label]',
      // Genérico — containers de roadmap com aria-labels
      '[class*="history"] [aria-label]',
      '[class*="road"] [aria-label]',
      '[class*="bead"] [aria-label]',
      '[class*="score"] [aria-label]',
      '[class*="scoreboard"] [aria-label]',
    ],
    // Containers de roadmap para leitura varredura pelo readHistoryFromRoadmap()
    roadmapContainers: [
      '[class*="road__item"]',
      '[class*="RoadItem"]',
      '[class*="roadmap"]',
      '[class*="road-map"]',
      '[class*="BeadPlate"]',
      '[class*="bead-plate"]',
      '[class*="bead"]',
      '[class*="road"]',
      '[class*="history"]',
      '[class*="scoreboard"]',
    ],
    timer: [
      // Nossa própria banca simulada
      '[data-betia-id="timer"]',
      // Evolution Gaming / BetBoom — seletores conhecidos do timer Bac Bo
      '[data-role="timer"]',
      '[data-role="countdown"]',
      '[class*="timeIndicator"]',
      '[class*="TimeIndicator"]',
      '[class*="countDown"]',
      '[class*="CountDown"]',
      '[class*="counter"]',
      '[class*="Counter"]',
      // Genérico
      '[class*="timer"]',
      '[class*="countdown"]',
      '[class*="clock"]',
      '[id*="timer"]',
      '[id*="countdown"]',
    ],
    balance: [
      '[data-betia-id="balance"]',
      '[class*="balance"]',
      '[class*="wallet"]',
      '[class*="credits"]',
      '[class*="saldo"]',
      '[id*="balance"]',
    ],
    result: [
      '[data-betia-result]',
      '[class*="result"]',
      '[class*="winner"]',
      '[class*="outcome"]',
    ],
  };

  // ─── Leitura do DOM ────────────────────────────────────────────────────────
  function queryAll(list) {
    const result = [];
    for (const sel of list) {
      try {
        result.push(...Array.from(document.querySelectorAll(sel)));
      } catch (_) {}
    }
    return result;
  }

  function queryFirst(list) {
    for (const sel of list) {
      try {
        const el = document.querySelector(sel);
        if (el && el.textContent?.trim()) return el;
      } catch (_) {}
    }
    return null;
  }

  function isVisibleElement(element) {
    if (!element?.getBoundingClientRect) return false;
    const rect = element.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return false;
    const style = window.getComputedStyle?.(element);
    return style?.visibility !== 'hidden' && style?.display !== 'none';
  }

  function normalizeHistoryEntry(element) {
    const raw =
      element?.getAttribute?.('data-betia-result') ||
      element?.getAttribute?.('data-result') ||
      element?.getAttribute?.('aria-label') ||
      element?.getAttribute?.('title') ||
      element?.textContent ||
      '';
    return window.__BETIA.normalizeResult?.(raw) ?? null;
  }

  function parseMoneyText(text) {
    const matches = String(text || '').match(/(?:R\$\s*)?-?\d{1,3}(?:\.\d{3})*(?:,\d{2})|(?:R\$\s*)?-?\d+(?:[.,]\d{2})?/g);
    if (!matches?.length) return null;

    for (const raw of matches) {
      const value = parseLocalizedNumber(raw);
      if (Number.isFinite(value)) return value;
    }

    return null;
  }

  function parseLocalizedNumber(raw) {
    const text = String(raw || '')
      .replace(/R\$/gi, '')
      .replace(/[^\d,.-]/g, '');
    if (!text) return null;

    const lastComma = text.lastIndexOf(',');
    const lastDot = text.lastIndexOf('.');
    let normalized = text;

    if (lastComma >= 0 && lastDot >= 0) {
      const decimalSep = lastComma > lastDot ? ',' : '.';
      const thousandSep = decimalSep === ',' ? '.' : ',';
      normalized = text
        .replace(new RegExp(`\\${thousandSep}`, 'g'), '')
        .replace(decimalSep, '.');
    } else if (lastComma >= 0) {
      const decimals = text.length - lastComma - 1;
      normalized = decimals > 0 && decimals <= 2 ? text.replace(',', '.') : text.replace(/,/g, '');
    } else if (lastDot >= 0) {
      const decimals = text.length - lastDot - 1;
      normalized = decimals > 0 && decimals <= 2 ? text : text.replace(/\./g, '');
    }

    const value = Number(normalized);
    return Number.isFinite(value) ? value : null;
  }

  function readBalanceNearDeposit() {
    let depositAnchors = [];
    try {
      depositAnchors = Array.from(document.querySelectorAll('button, [role="button"], a, div, span'))
        .filter((element) => {
          if (!isVisibleElement(element)) return false;
          const rect = element.getBoundingClientRect();
          if (rect.top > 200 || rect.height < 18 || rect.width < 40) return false;
          return /dep[oó]sito|deposito|deposit/i.test(element.textContent || '');
        })
        .slice(0, 8);
    } catch (_) {
      return null;
    }

    if (depositAnchors.length === 0) {
      return null;
    }

    let balanceCandidates = [];
    try {
      balanceCandidates = Array.from(document.querySelectorAll('button, [role="button"], a, div, span, strong, p'))
        .filter((element) => {
          if (!isVisibleElement(element)) return false;
          const rect = element.getBoundingClientRect();
          if (rect.top > 220 || rect.height < 12 || rect.width < 24) return false;
          const text = (element.textContent || '').slice(0, 80);
          return /r\$\s*\d|brl\s*\d|\d+[.,]\d{2}/i.test(text);
        });
    } catch (_) {
      return null;
    }

    let best = null;
    let bestScore = 0;

    for (const candidate of balanceCandidates) {
      const raw = (candidate.textContent || '').trim().slice(0, 120);
      const value = parseMoneyText(raw);
      if (!Number.isFinite(value) || value < 0) continue;

      const rect = candidate.getBoundingClientRect();
      for (const anchor of depositAnchors) {
        const anchorRect = anchor.getBoundingClientRect();
        const distance = Math.hypot(anchorRect.left - rect.right, anchorRect.top - rect.top);
        const sameParent =
          candidate.parentElement === anchor.parentElement ||
          candidate.closest?.('header, [class*="header" i], [class*="topbar" i], [class*="navbar" i]') ===
            anchor.closest?.('header, [class*="header" i], [class*="topbar" i], [class*="navbar" i]');

        let score = 0;
        if (/r\$|brl/i.test(raw)) score += 14;
        if (sameParent) score += 22;
        if (rect.left < anchorRect.left) score += 10;
        if (rect.right <= anchorRect.left + 40) score += 8;
        if (rect.top < 140) score += 6;
        score += Math.max(0, 28 - distance / 14);

        if (score > bestScore) {
          best = { value, raw, source: 'deposit-neighbor' };
          bestScore = score;
        }
      }
    }

    return bestScore >= 24 ? best : null;
  }

  function inferBalanceFromVisibleHeader() {
    let candidates = [];
    try {
      candidates = Array.from(document.querySelectorAll('button, [role="button"], a, div, span, strong, p'));
    } catch (_) {
      return null;
    }

    const viewportWidth = Math.max(window.innerWidth || 0, 1);
    const scored = [];

    for (const element of candidates) {
      if (!isVisibleElement(element)) continue;
      const rect = element.getBoundingClientRect();
      if (rect.width < 28 || rect.height < 12) continue;
      if (rect.top > Math.max(260, window.innerHeight * 0.3)) continue;

      const text = (element.textContent || '').trim().slice(0, 120);
      if (!/r\$\s*\d|brl\s*\d|\d+[.,]\d{2}/i.test(text)) continue;

      const value = parseMoneyText(text);
      if (!Number.isFinite(value) || value < 0) continue;

      const context = [
        text,
        element.className || '',
        element.id || '',
        element.getAttribute?.('data-automation-id') || '',
        element.getAttribute?.('data-role') || '',
        element.getAttribute?.('aria-label') || '',
        element.parentElement?.textContent || '',
        element.closest?.('header, [class*="header" i], [class*="topbar" i], [class*="navbar" i]')?.textContent || '',
      ]
        .join(' ')
        .toLowerCase();

      let score = 0;
      if (/r\$|brl/.test(text.toLowerCase())) score += 12;
      if (/saldo|balance|wallet|bankroll|banca/.test(context)) score += 18;
      if (/dep[oó]sito|deposito|deposit/.test(context)) score += 16;
      if (/header|topbar|navbar/.test(context)) score += 8;
      if (rect.left > viewportWidth * 0.55) score += 8;
      if (rect.top < 140) score += 8;
      if (text.length <= 24) score += 5;
      if (value <= 500000) score += 3;

      scored.push({ value, score, raw: text });
    }

    scored.sort((a, b) => b.score - a.score);
    const best = scored[0];
    if (!best || best.score < 12) return null;

    return {
      value: best.value,
      raw: best.raw,
      source: 'visible-header',
    };
  }

  function readHistory() {
    const grid = document.querySelector('[data-betia-id="history-grid"]');
    if (grid) {
      const gridHistory = Array.from(grid.querySelectorAll('[data-betia-result], [data-result]'))
        .map(normalizeHistoryEntry)
        .filter(Boolean);

      if (gridHistory.length > 0) {
        const ordered =
          grid.getAttribute('data-betia-history-order') === 'oldest-first'
            ? gridHistory.reverse()
            : gridHistory;
        return ordered.slice(0, 156);
      }
    }

    const semantic = queryAll(SELECTORS.history)
      .map(normalizeHistoryEntry)
      .filter(Boolean);

    if (semantic.length > 0) {
      return semantic.slice(0, 156);
    }

    // Fallback 1: varredura por containers de roadmap conhecidos (BetBoom/Evolution)
    const roadmapHistory = readHistoryFromRoadmapContainers();
    if (roadmapHistory.length > 0) {
      return roadmapHistory;
    }

    // Fallback 2: aria-label globais restritos a termos Bac Bo (evita falsos positivos)
    const BACBO_TERMS = /^(player|banker|tie|jogador|banca|empate|p|b|t)$/i;
    const ariaResults = [];
    try {
      for (const el of document.querySelectorAll('[aria-label]')) {
        const label = (el.getAttribute('aria-label') || '').trim();
        if (BACBO_TERMS.test(label)) {
          const normalized = window.__BETIA.normalizeResult?.(label);
          if (normalized) ariaResults.push(normalized);
        }
      }
    } catch (_) {}

    if (ariaResults.length > 0) {
      return ariaResults.slice(0, 156);
    }

    return [];
  }

  // Lê o histórico a partir de containers de roadmap (BetBoom / Evolution)
  function readHistoryFromRoadmapContainers() {
    const BAD_CLASSES = /bet|chip|confirm|button|control|menu|nav|header|footer|balance|wallet|saldo/i;

    for (const containerSel of SELECTORS.roadmapContainers) {
      try {
        const containers = Array.from(document.querySelectorAll(containerSel));
        const container = containers.find((el) => {
          const cls = (el.className || '').toLowerCase();
          if (BAD_CLASSES.test(cls)) return false;
          const rect = el.getBoundingClientRect();
          return rect.width > 40 && rect.height > 20;
        });

        if (!container) continue;

        // Tenta leitura por aria-label dentro do container
        const byAriaLabel = Array.from(container.querySelectorAll('[aria-label]'))
          .map((el) => window.__BETIA.normalizeResult?.(el.getAttribute('aria-label') || ''))
          .filter(Boolean);

        if (byAriaLabel.length >= 3) {
          return byAriaLabel.slice(0, 156);
        }

        // Tenta leitura por data-result dentro do container
        const byDataResult = Array.from(container.querySelectorAll('[data-result], [data-betia-result]'))
          .map(normalizeHistoryEntry)
          .filter(Boolean);

        if (byDataResult.length >= 3) {
          return byDataResult.slice(0, 156);
        }

        // Tenta ler o texto de cada filho pequeno (células do roadmap)
        const byText = Array.from(container.children)
          .filter((el) => {
            const rect = el.getBoundingClientRect();
            return rect.width > 4 && rect.width < 80 && rect.height > 4 && rect.height < 80;
          })
          .map((el) => window.__BETIA.normalizeResult?.(
            el.getAttribute?.('aria-label') ||
            el.getAttribute?.('title') ||
            el.textContent?.trim() || '',
          ))
          .filter(Boolean);

        if (byText.length >= 3) {
          return byText.slice(0, 156);
        }
      } catch (_) {}
    }

    return [];
  }

  // Fallback: busca elementos pequenos com texto puramente numérico (1-2 dígitos)
  // na área superior da tela — padrão comum de timers em bancas live.
  function readTimerByNumericHeuristic() {
    const viewport = { w: window.innerWidth || 1, h: window.innerHeight || 1 };
    const candidates = Array.from(document.querySelectorAll('div, span, p, strong'));
    for (const el of candidates) {
      try {
        const rect = el.getBoundingClientRect();
        // Elemento pequeno, no terço superior da tela
        if (rect.width > 80 || rect.height > 60 || rect.top > viewport.h * 0.35) continue;
        const text = (el.textContent || '').trim();
        // Texto que parece um timer: 1-3 dígitos, opcionalmente com decimal
        if (/^\d{1,2}(\.\d{1,2})?$/.test(text)) {
          const val = parseFloat(text);
          if (val > 0 && val <= 60) return val;
        }
      } catch (_) {}
    }
    return null;
  }

  function readDOMData() {
    const history = readHistory();
    const timerEl   = queryFirst(SELECTORS.timer);
    const balanceEl = queryFirst(SELECTORS.balance);
    const resultEl  = queryFirst(SELECTORS.result);

    const timerText   = timerEl?.textContent?.trim()   || '';
    const balanceText = balanceEl?.textContent?.trim() || '';
    const resultText  =
      resultEl?.getAttribute?.('data-betia-result') ||
      resultEl?.textContent?.trim() ||
      '';

    const countdownMatch = timerText.match(/(\d+(?:\.\d+)?)/);
    let countdown = countdownMatch ? parseFloat(countdownMatch[1]) : null;

    // Se os seletores falharam, tenta heurística numérica
    if (countdown === null || countdown <= 0) {
      const heuristicTimer = readTimerByNumericHeuristic();
      if (heuristicTimer !== null) countdown = heuristicTimer;
    }

    const directBalance = parseMoneyText(balanceText);
    const heuristicBalance = readBalanceNearDeposit() || inferBalanceFromVisibleHeader();
    const balance = directBalance ?? heuristicBalance?.value ?? null;
    const balanceRaw = (directBalance !== null ? balanceText : heuristicBalance?.raw) || '';
    const balanceSource =
      (directBalance !== null ? 'balance-selector' : heuristicBalance?.source) || null;

    const result = window.__BETIA.normalizeResult?.(resultText) ?? history[0] ?? null;

    if (history.length === 0 && countdown === null && balance === null && !result) return null;

    return {
      countdown,
      balance,
      balanceRaw,
      balanceSource,
      result,
      history,
      source: 'viewer',
      ts: Date.now(),
    };
  }

  // ─── MutationObserver ─────────────────────────────────────────────────────
  // Reage a qualquer mudança no DOM — não depende de layout fixo.
  let observer = null;

  function install() {
    if (observer) return;
    observer = new MutationObserver(() => {
      const data = readDOMData();
      if (data) {
        window.__BETIA.state.domData = data;
        window.__BETIA.onNewSource?.('dom');
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    console.log('[Bet IA DOM] Observer instalado.');
  }

  // Expõe a função de leitura para uso externo (ex: heartbeat do index.js)
  window.__BETIA.readDOMData = readDOMData;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', install);
  } else {
    install();
  }
})();

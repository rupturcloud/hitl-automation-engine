// modules/content/platform-detector.js
// Responsabilidade: detectar como a banca se comporta pelo viewer/tela e
// normalizar contratos de dados e ações. O nome da plataforma é secundário.
//
// COMO ADICIONAR UMA NOVA BANCA:
//   1. Adicione uma entrada em PLATFORM_REGISTRY com os identificadores dela.
//   2. Implemente os seletores DOM e os mapeamentos de WebSocket.
//   3. Pronto — nenhum outro módulo precisa ser alterado.
//
// Contrato de saída: window.__BETIA.platform (objeto com dados da banca detectada)

(function () {
  'use strict';

  // ─── Seletores canônicos da nossa banca Bac Bo Live ────────────────────────
  // Estes nomes são a forma estável usada pela Bet IA para falar dos spots.
  // Os seletores abaixo continuam aceitando aliases da Evolution, mas estes
  // identificadores são a referência canônica do runtime.
  const BACBO_LIVE_CANONICAL_SELECTORS = Object.freeze({
    PLAYER_BET_SPOT: 'player-bet-spot',
    BANKER_BET_SPOT: 'banker-bet-spot',
    TIE_BET_SPOT: 'tie-bet-spot',
    WC_BET_SPOT: 'wc-bet-spot',
    BETSPOT_PLAYER: 'betspot--player',
    BETSPOT_BANKER: 'betspot--banker',
    BETSPOT_TIE: 'betspot--tie',
  });

  const BACBO_LIVE_SELECTOR_ALIASES = Object.freeze({
    commonBetSpot: [
      `[class*="${BACBO_LIVE_CANONICAL_SELECTORS.WC_BET_SPOT}"]`,
    ],
    player: [
      `[data-role="${BACBO_LIVE_CANONICAL_SELECTORS.PLAYER_BET_SPOT}"]`,
      '[data-element="player"]',
      `[class*="${BACBO_LIVE_CANONICAL_SELECTORS.WC_BET_SPOT}--player"]`,
      `[class*="${BACBO_LIVE_CANONICAL_SELECTORS.BETSPOT_PLAYER}"]`,
      '[class*="BetSpot"][class*="player"]',
      '[class*="bet-spot-player"]',
      '[class*="spot"][class*="player"]',
      '[class*="player"][class*="bet"]',
      'button[class*="Player"]',
      '[aria-label*="Player" i]',
      '[aria-label*="Jogador" i]',
    ],
    banker: [
      `[data-role="${BACBO_LIVE_CANONICAL_SELECTORS.BANKER_BET_SPOT}"]`,
      '[data-element="banker"]',
      `[class*="${BACBO_LIVE_CANONICAL_SELECTORS.WC_BET_SPOT}--banker"]`,
      `[class*="${BACBO_LIVE_CANONICAL_SELECTORS.BETSPOT_BANKER}"]`,
      '[class*="BetSpot"][class*="banker"]',
      '[class*="bet-spot-banker"]',
      '[class*="spot"][class*="banker"]',
      '[class*="banker"][class*="bet"]',
      'button[class*="Banker"]',
      '[aria-label*="Banker" i]',
      '[aria-label*="Banca" i]',
    ],
    tie: [
      `[data-role="${BACBO_LIVE_CANONICAL_SELECTORS.TIE_BET_SPOT}"]`,
      '[data-element="tie"]',
      `[class*="${BACBO_LIVE_CANONICAL_SELECTORS.WC_BET_SPOT}--tie"]`,
      `[class*="${BACBO_LIVE_CANONICAL_SELECTORS.BETSPOT_TIE}"]`,
      '[class*="BetSpot"][class*="tie"]',
      '[class*="bet-spot-tie"]',
      '[class*="spot"][class*="tie"]',
      '[class*="tie"][class*="bet"]',
      'button[class*="Tie"]',
      '[aria-label*="Tie" i]',
      '[aria-label*="Empate" i]',
    ],
  });

  window.__BETIA = window.__BETIA || {};
  window.__BETIA.canonicalSelectors = {
    bacboLive: BACBO_LIVE_CANONICAL_SELECTORS,
  };

  // ─── Registro de Plataformas ────────────────────────────────────────────────
  // Cada entrada representa uma plataforma/banca suportada.
  // Detectada por URL, DOM signature e/ou padrões de WebSocket.
  const PLATFORM_REGISTRY = [

    // ── Evolution Gaming (Bac Bo, Dragon Tiger, etc.) ─────────────────────────
    {
      id: 'evolution',
      name: 'Evolution Gaming',
      detect: {
        url: /evolution|evo-games|evogaming|evolutiongaming|evo-live|livecasino.*evo/i,
        dom: [
          '[class*="evo"]',
          '[id*="evolution"]',
          'iframe[src*="evolution"]',
          'iframe[src*="evo-games"]',
          'iframe[src*="evogaming"]',
          ...BACBO_LIVE_SELECTOR_ALIASES.player.slice(0, 1),
          ...BACBO_LIVE_SELECTOR_ALIASES.banker.slice(0, 1),
          ...BACBO_LIVE_SELECTOR_ALIASES.tie.slice(0, 1),
          ...BACBO_LIVE_SELECTOR_ALIASES.commonBetSpot,
          `[class*="${BACBO_LIVE_CANONICAL_SELECTORS.BETSPOT_PLAYER}"]`,
          `[class*="${BACBO_LIVE_CANONICAL_SELECTORS.BETSPOT_BANKER}"]`,
          `[class*="${BACBO_LIVE_CANONICAL_SELECTORS.BETSPOT_TIE}"]`,
          'video[class*="stream"]',
          'canvas',
        ],
        wsKeywords: [
          'gameState',
          'tableId',
          'dealerName',
          'BacBo',
          'bacbo',
          'timeToClose',
          'bettingOpen',
          'betsOpen',
        ],
      },
      // Mapeamento dos campos da resposta WS para o formato interno
      wsMap: {
        countdown:  ['countdown', 'timer', 'timeToClose', 'timeLeft', 'remainingTime', 'secondsLeft'],
        balance:    ['balance', 'credits', 'wallet', 'accountBalance', 'cashBalance'],
        result:     ['result', 'winner', 'gameResult', 'winnerSide', 'outcome', 'winningSide'],
        history:    ['history', 'results', 'rounds', 'road', 'roadmap', 'beadPlate', 'scoreboard', 'pastResults'],
      },
      // Seletores DOM específicos desta plataforma
      domSelectors: {
        timer:   ['[data-role="timer"]', '[class*="counter"]', '[class*="timer"]', '[class*="countdown"]', '[data-betia-id="timer"]'],
        balance: ['[class*="balance"]', '[data-betia-id="balance"]'],
        result:  ['[data-betia-result]', '[class*="result-label"]'],
        betPlayer: [
          '[data-betia-id="bet-player"]',
          ...BACBO_LIVE_SELECTOR_ALIASES.player,
        ],
        betBanker: [
          '[data-betia-id="bet-banker"]',
          ...BACBO_LIVE_SELECTOR_ALIASES.banker,
        ],
        betTie:    [
          '[data-betia-id="bet-tie"]',
          ...BACBO_LIVE_SELECTOR_ALIASES.tie,
        ],
      },
    },

    // ── Pragmatic Play Live ───────────────────────────────────────────────────
    {
      id: 'pragmatic',
      name: 'Pragmatic Play',
      detect: {
        url: /pragmatic|pplive/i,
        dom: ['[class*="pragmatic"]', '[id*="pragmatic"]'],
        wsKeywords: ['roundId', 'gameType', 'remainingTime'],
      },
      wsMap: {
        countdown:  ['remainingTime', 'countdown'],
        balance:    ['balance', 'accountBalance'],
        result:     ['winnerSide', 'outcome'],
        history:    ['history', 'results', 'rounds', 'road', 'roadmap', 'pastResults'],
      },
      domSelectors: {
        timer:   ['[class*="remaining"]', '[class*="clock"]'],
        balance: ['[class*="balance"]', '[class*="amount"]'],
        result:  ['[data-betia-result]', '[class*="winner-side"]'],
        betPlayer: ['[data-betia-id="bet-player"]', '[class*="player"]'],
        betBanker: ['[data-betia-id="bet-banker"]', '[class*="banker"]'],
        betTie:    ['[data-betia-id="bet-tie"]',    '[class*="tie"]'],
      },
    },

    // ── BetBoom ───────────────────────────────────────────────────────────────
    // Operadora russa que embute Evolution Gaming em iframe.
    // A detecção por URL identifica o shell; o engine é tratado como evolution.
    {
      id: 'betboom',
      name: 'BetBoom',
      detect: {
        url: /betboom|bet-boom|betboom\.ru|betboom\.com|betboom\.bet\.br/i,
        dom: [
          '[class*="betboom"]',
          '[id*="betboom"]',
          '[class*="bb-"]',
          'iframe[src*="betboom"]',
          'iframe[src*="evolution"]',
          'iframe[src*="evo-games"]',
        ],
        wsKeywords: [
          'gameState', 'tableId', 'BacBo', 'bacbo',
          'timeToClose', 'bettingOpen', 'betsOpen',
          'balanceUpdated', 'accountBalance',
          'rounds', 'history', 'road',
        ],
      },
      wsMap: {
        countdown: ['timeToClose', 'countdown', 'timer', 'timeLeft', 'remainingTime', 'secondsLeft'],
        balance:   ['balance', 'credits', 'wallet', 'accountBalance', 'cashBalance'],
        result:    ['result', 'winner', 'gameResult', 'winnerSide', 'outcome', 'winningSide'],
        history:   ['history', 'results', 'rounds', 'road', 'roadmap', 'beadPlate', 'scoreboard', 'pastResults'],
      },
      domSelectors: {
        timer: [
          '[data-role="timer"]',
          '[class*="counter"]',
          '[class*="timer"]',
          '[class*="countdown"]',
          '[class*="clock"]',
          '[data-betia-id="timer"]',
        ],
        balance: [
          '[class*="balance"]',
          '[class*="wallet"]',
          '[class*="credits"]',
          '[data-betia-id="balance"]',
        ],
        result: [
          '[data-betia-result]',
          '[class*="result-label"]',
          '[class*="winner"]',
          '[aria-label*="Player" i]',
          '[aria-label*="Banker" i]',
        ],
        betPlayer: [
          '[data-betia-id="bet-player"]',
          ...BACBO_LIVE_SELECTOR_ALIASES.player,
        ],
        betBanker: [
          '[data-betia-id="bet-banker"]',
          ...BACBO_LIVE_SELECTOR_ALIASES.banker,
        ],
        betTie: [
          '[data-betia-id="bet-tie"]',
          ...BACBO_LIVE_SELECTOR_ALIASES.tie,
        ],
      },
    },

    // ── Bet AI (plataforma própria Ruptur) ────────────────────────────────────
    {
      id: 'betai',
      name: 'Bet AI (Ruptur)',
      detect: {
        url: /betai|bet-ia|ruptur|localhost:(3000|4173)|127\.0\.0\.1:4173/i,
        dom: ['[data-betia-id]'],
        wsKeywords: [],
      },
      wsMap: {
        countdown: ['countdown', 'timer'],
        balance:   ['balance'],
        result:    ['result', 'lastResult'],
        history:   ['history', 'results', 'rounds'],
      },
      domSelectors: {
        timer:   ['[data-betia-id="timer"]'],
        balance: ['[data-betia-id="balance"]'],
        result:  ['[data-betia-result]'],
        betPlayer: ['[data-betia-id="bet-player"]'],
        betBanker: ['[data-betia-id="bet-banker"]'],
        betTie:    ['[data-betia-id="bet-tie"]'],
      },
    },

    // ── Fallback genérico — tenta funcionar em qualquer banca ─────────────────
    {
      id: 'generic',
      name: 'Banca Genérica',
      detect: {
        url: null,
        dom: [],
        wsKeywords: [],
      },
      wsMap: {
        countdown: ['countdown', 'timer', 'timeLeft', 'remainingTime', 'timeToClose'],
        balance:   ['balance', 'credits', 'wallet', 'accountBalance'],
        result:    ['result', 'winner', 'outcome', 'lastResult', 'winnerSide', 'gameResult'],
        history:   ['history', 'results', 'rounds', 'road', 'roadmap', 'beadPlate', 'scoreboard', 'pastResults'],
      },
      domSelectors: {
        timer:   ['[data-betia-id="timer"]', '[data-role="timer"]', '[class*="timer"]', '[class*="countdown"]', '[class*="clock"]', '[class*="counter"]', '[aria-label*="timer" i]', '[aria-label*="tempo" i]'],
        balance: ['[data-betia-id="balance"]', '[class*="balance"]', '[class*="credits"]', '[class*="wallet"]', '[class*="saldo"]'],
        result:  ['[data-betia-result]', '[class*="result"]', '[class*="winner"]', '[class*="outcome"]'],
        betPlayer: ['[data-betia-id="bet-player"]', ...BACBO_LIVE_SELECTOR_ALIASES.player, '[class*="player"]'],
        betBanker: ['[data-betia-id="bet-banker"]', ...BACBO_LIVE_SELECTOR_ALIASES.banker, '[class*="banker"]'],
        betTie:    ['[data-betia-id="bet-tie"]', ...BACBO_LIVE_SELECTOR_ALIASES.tie, '[class*="tie"]'],
      },
    },
  ];

  const TARGET_TERMS = {
    PLAYER: ['player', 'jogador'],
    BANKER: ['banker', 'banca', 'bank'],
    TIE: ['tie', 'empate'],
  };

  const TARGET_DIRECTION_HINTS = {
    PLAYER: { centerX: 0.2, softTolerance: 0.26, hardLimit: 0.62 },
    TIE: { centerX: 0.5, softTolerance: 0.18, hardLimit: 0.24 },
    BANKER: { centerX: 0.8, softTolerance: 0.26, hardLimit: 0.62 },
  };

  const TARGET_PLATFORM_SELECTORS = {
    PLAYER: {
      exact: [
        '[data-betia-id="bet-player"]',
        '[data-role="player-bet-spot"]',
        '[data-element="player"]',
        '[class*="wc-bet-spot--player"]',
        '[class*="betspot--player"]',
        '[class*="bet-spot-player"]',
      ],
      exactBetAi: ['[data-betia-id="bet-player"]'],
    },
    BANKER: {
      exact: [
        '[data-betia-id="bet-banker"]',
        '[data-role="banker-bet-spot"]',
        '[data-element="banker"]',
        '[class*="wc-bet-spot--banker"]',
        '[class*="betspot--banker"]',
        '[class*="bet-spot-banker"]',
      ],
      exactBetAi: ['[data-betia-id="bet-banker"]'],
    },
    TIE: {
      exact: [
        '[data-betia-id="bet-tie"]',
        '[data-role="tie-bet-spot"]',
        '[data-element="tie"]',
        '[class*="wc-bet-spot--tie"]',
        '[class*="betspot--tie"]',
        '[class*="bet-spot-tie"]',
      ],
      exactBetAi: ['[data-betia-id="bet-tie"]'],
    },
  };

  const NEGATIVE_BET_TERMS = [
    'confirm',
    'confirmar',
    'clear',
    'limpar',
    'cancel',
    'undo',
    'repeat',
    'double',
    'history',
    'road',
    'score',
    'settings',
    'chat',
    'deposit',
    'depósito',
    'wallet',
    'saldo',
    'timer',
    'countdown',
    'dealer',
    'menu',
    'panel',
    'toggle',
    'header',
    'footer',
    'sidebar',
  ];

  const CLICKABLE_ANCESTOR_SELECTOR = [
    'button',
    '[role="button"]',
    '[data-betia-id]',
    '[data-role]',
    '[data-element]',
    '[data-testid]',
    '[class*="betspot"]',
    '[class*="bet-spot"]',
    '[class*="wc-bet-spot"]',
    '[class*="chip"]',
  ].join(', ');

  const CALIBRATION_STORAGE_PREFIX = 'betia_calibration_v1';
  const CALIBRATION_SEQUENCE = ['PLAYER', 'TIE', 'BANKER'];
  const CALIBRATION_HUD_ID = '__betia_calibration_hud__';

  // ─── Calibração de Fichas ────────────────────────────────────────────────────
  const CHIP_CAL_PREFIX = 'betia_chip_cal_v1';
  const CHIP_CAL_HUD_ID = '__betia_chip_cal_hud__';
  const CHIP_CAL_AMOUNTS = [5, 10, 25, 50, 100, 500];

  const CHIP_SELECTOR_CANDIDATES = [
    '[data-betia-id^="chip-"]',
    '[data-role*="chip"]',
    '[class*="chip"]:not([class*="container"])',
    '[class*="Chip"]:not([class*="Tray"])',
    '[class*="token"]',
    '[data-chip-value]',
    '[data-value]',
  ];
  const HUMAN_DELAY_BEFORE_BATCH_MS = 260;
  const HUMAN_DELAY_BETWEEN_BETS_MS = 220;

  function isTopFrame() {
    try {
      return window.top === window;
    } catch (_) {
      return false;
    }
  }

  function redactUrl(value) {
    try {
      const url = new URL(value, window.location.href);
      return `${url.origin}${url.pathname}`;
    } catch (_) {
      return String(value || '').split(/[?#]/)[0];
    }
  }

  function safeQuery(selector) {
    try {
      return document.querySelector(selector);
    } catch (_) {
      return null;
    }
  }

  function safeQueryAll(selector) {
    try {
      return Array.from(document.querySelectorAll(selector));
    } catch (_) {
      return [];
    }
  }

  function collectFrameUrls() {
    return safeQueryAll('iframe[src]')
      .map((frame) => frame.getAttribute('src') || '')
      .filter(Boolean)
      .map(redactUrl)
      .slice(0, 8);
  }

  function textHasAny(text, terms) {
    const normalized = String(text || '').toLowerCase();
    return terms.some((term) => normalized.includes(term));
  }

  function getElementLabel(element) {
    if (!element) return '';
    const text =
      typeof element.textContent === 'string'
        ? element.textContent.replace(/\s+/g, ' ').trim().slice(0, 140)
        : '';
    return [
      element.getAttribute?.('aria-label'),
      element.getAttribute?.('title'),
      element.getAttribute?.('data-betia-id'),
      element.getAttribute?.('data-role'),
      element.getAttribute?.('data-element'),
      element.getAttribute?.('data-value'),
      element.getAttribute?.('data-chip-value'),
      element.getAttribute?.('data-testid'),
      element.getAttribute?.('class'),
      text,
    ]
      .filter(Boolean)
      .join(' ');
  }

  function closestStableClickable(element) {
    if (!element) return null;
    try {
      return element.closest?.(CLICKABLE_ANCESTOR_SELECTOR) || element;
    } catch (_) {
      return element;
    }
  }

  function dedupeElements(elements) {
    const unique = [];
    const seen = new Set();
    for (const element of elements) {
      if (!element || seen.has(element)) continue;
      seen.add(element);
      unique.push(element);
    }
    return unique;
  }

  function countMatchedTargets(label) {
    return Object.keys(TARGET_TERMS).reduce((count, target) => {
      return count + (textHasAny(label, TARGET_TERMS[target]) ? 1 : 0);
    }, 0);
  }

  function targetOppositeTerms(target) {
    return Object.entries(TARGET_TERMS)
      .filter(([key]) => key !== target)
      .flatMap(([, terms]) => terms);
  }

  function getViewportBox() {
    return {
      width: Math.max(window.innerWidth || 0, 1),
      height: Math.max(window.innerHeight || 0, 1),
    };
  }

  function getClickablePoint(element) {
    if (!element?.getBoundingClientRect) return null;
    const rect = element.getBoundingClientRect();
    const points = [
      { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
      { x: rect.left + rect.width * 0.25, y: rect.top + rect.height * 0.5 },
      { x: rect.left + rect.width * 0.75, y: rect.top + rect.height * 0.5 },
      { x: rect.left + rect.width * 0.5, y: rect.top + rect.height * 0.35 },
      { x: rect.left + rect.width * 0.5, y: rect.top + rect.height * 0.65 },
    ];

    for (const point of points) {
      const x = Math.max(rect.left + 2, Math.min(rect.right - 2, point.x));
      const y = Math.max(rect.top + 2, Math.min(rect.bottom - 2, point.y));
      const hit = document.elementFromPoint(x, y);
      if (hit && (element === hit || element.contains?.(hit) || hit.contains?.(element))) {
        return { x, y, hit };
      }
    }

    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      hit: document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2),
    };
  }

  function describeElement(element) {
    if (!element) return null;
    const rect = element.getBoundingClientRect?.();
    return {
      tag: element.tagName?.toLowerCase() || null,
      id: element.id || null,
      betiaId: element.getAttribute?.('data-betia-id') || null,
      role: element.getAttribute?.('data-role') || null,
      element: element.getAttribute?.('data-element') || null,
      testId: element.getAttribute?.('data-testid') || null,
      label: getElementLabel(element).slice(0, 220),
      rect: rect
        ? {
            left: Math.round(rect.left),
            top: Math.round(rect.top),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          }
        : null,
    };
  }

  function getCalibrationState() {
    const calibration = window.__BETIA.state?.calibration || {};
    const platform = window.__BETIA.platform || detect();
    return {
      active: calibration.active === true,
      stepIndex: Number.isFinite(calibration.stepIndex) ? calibration.stepIndex : 0,
      stepOrder: Array.isArray(calibration.stepOrder) ? calibration.stepOrder : CALIBRATION_SEQUENCE,
      currentTarget: calibration.currentTarget || CALIBRATION_SEQUENCE[0],
      points: calibration.points || {},
      profile: calibration.profile || null,
      message: calibration.message || null,
      updatedAt: calibration.updatedAt || 0,
      platformId: platform?.id || null,
      platformName: platform?.name || null,
      host: window.location.hostname,
      frameUrl: redactUrl(window.location.href),
    };
  }

  function setCalibrationState(nextCalibration = {}) {
    const previous = getCalibrationState();
    window.__BETIA.state.calibration = {
      ...window.__BETIA.state.calibration,
      ...nextCalibration,
      updatedAt: Date.now(),
    };
    const snapshot = getCalibrationState();
    renderCalibrationHud(snapshot);

    if (JSON.stringify(previous) !== JSON.stringify(snapshot)) {
      broadcastCalibrationState(snapshot);
    }

    return snapshot;
  }

  function getCalibrationStorageKey(platform = window.__BETIA.platform || detect()) {
    const platformId = platform?.id || 'unknown';
    const host = window.location.hostname || 'unknown-host';
    return `${CALIBRATION_STORAGE_PREFIX}:${platformId}:${host}`;
  }

  function buildCalibrationPoint(target, event, element) {
    const viewport = getViewportBox();
    const rect = element?.getBoundingClientRect?.();
    return {
      target,
      viewportX: Number((event.clientX / viewport.width).toFixed(6)),
      viewportY: Number((event.clientY / viewport.height).toFixed(6)),
      element: describeElement(element),
      capturedAt: Date.now(),
    };
  }

  function getCalibrationPoint(target, profile = null) {
    const activeProfile = profile || getCalibrationState().profile;
    return activeProfile?.points?.[target] || null;
  }

  function resolveCalibrationElement(target, profile = null) {
    const point = getCalibrationPoint(target, profile);
    if (!point) return null;

    const viewport = getViewportBox();
    const x = Math.round(point.viewportX * viewport.width);
    const y = Math.round(point.viewportY * viewport.height);
    const hit = document.elementFromPoint(x, y);
    const stable = closestStableClickable(hit);

    if (!stable) return null;

    return {
      element: stable,
      point: { x, y },
      score: scoreBetSpotCandidate(stable, target, window.__BETIA.platform?.id || ''),
      hit: describeElement(hit),
    };
  }

  function broadcastCalibrationState(snapshot = getCalibrationState()) {
    try {
      chrome.runtime
        .sendMessage({
          type: 'CALIBRATION_STATE',
          data: snapshot,
        })
        .catch(() => {});
    } catch (_) {}
  }

  function removeCalibrationHud() {
    const hud = document.getElementById(CALIBRATION_HUD_ID);
    if (hud) {
      hud.remove();
    }
  }

  function renderCalibrationHud(snapshot = getCalibrationState()) {
    if (!snapshot.active) {
      removeCalibrationHud();
      return;
    }

    let hud = document.getElementById(CALIBRATION_HUD_ID);
    if (!hud) {
      hud = document.createElement('div');
      hud.id = CALIBRATION_HUD_ID;
      hud.style.cssText = `
        position: fixed;
        right: 20px;
        bottom: 20px;
        z-index: 2147483647;
        pointer-events: none;
        max-width: 320px;
        padding: 14px 16px;
        border-radius: 18px;
        border: 1px solid rgba(245, 158, 11, 0.35);
        background: rgba(10, 10, 12, 0.92);
        box-shadow: 0 12px 44px rgba(0, 0, 0, 0.45);
        color: white;
        font: 700 12px/1.45 Inter, sans-serif;
        letter-spacing: 0.02em;
      `;
      document.documentElement.appendChild(hud);
    }

    const badges = snapshot.stepOrder
      .map((target, index) => {
        const completed = Boolean(snapshot.points?.[target]);
        const active = snapshot.currentTarget === target;
        const bg = completed
          ? 'rgba(16,185,129,0.18)'
          : active
            ? 'rgba(245,158,11,0.18)'
            : 'rgba(255,255,255,0.06)';
        const border = completed
          ? 'rgba(16,185,129,0.38)'
          : active
            ? 'rgba(245,158,11,0.45)'
            : 'rgba(255,255,255,0.12)';
        const text = completed ? '#34d399' : active ? '#fbbf24' : 'rgba(255,255,255,0.6)';
        return `<span style="display:inline-flex;align-items:center;justify-content:center;padding:4px 8px;border-radius:999px;border:1px solid ${border};background:${bg};color:${text};font-size:10px;font-weight:900;letter-spacing:0.14em;text-transform:uppercase;">${index + 1}. ${target}</span>`;
      })
      .join('');

    hud.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:10px;">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;">
          <span style="font-size:10px;font-weight:900;letter-spacing:0.2em;text-transform:uppercase;color:#fbbf24;">Modo calibração</span>
          <span style="font-size:10px;color:rgba(255,255,255,0.45);">${snapshot.platformName || snapshot.platformId || 'viewer'}</span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;">${badges}</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.92);">
          Clique agora em <strong style="color:#fbbf24;">${snapshot.currentTarget}</strong> na mesa real.
        </div>
        <div style="font-size:11px;color:rgba(255,255,255,0.55);">
          Os cliques são interceptados nesta etapa — nenhum duplo clique ou undo extra é disparado.
        </div>
      </div>
    `;
  }

  async function persistCalibrationProfile(profile) {
    const key = getCalibrationStorageKey();
    try {
      await chrome.storage.local.set({ [key]: profile });
    } catch (_) {}
  }

  async function loadCalibrationProfile() {
    const key = getCalibrationStorageKey();
    try {
      const stored = await chrome.storage.local.get([key]);
      return stored?.[key] || null;
    } catch (_) {
      return null;
    }
  }

  async function hydrateCalibrationProfile() {
    const profile = await loadCalibrationProfile();
    setCalibrationState({
      profile,
      active: false,
      stepIndex: 0,
      currentTarget: CALIBRATION_SEQUENCE[0],
      points: profile?.points || {},
      message: profile ? 'Calibração carregada.' : null,
    });
    return getCalibrationState();
  }

  // Handler genérico que bloqueia qualquer evento de input durante calibração
  function calBlockAllHandler(event) {
    if (!getCalibrationState().active) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation?.();
  }

  const CAL_CAPTURE_DEBOUNCE_MS = 650;

  function isDuplicateCalibrationGesture(kind, event) {
    const previous = window.__BETIA.__lastCalibrationGesture || null;
    const current = {
      kind,
      ts: typeof event?.timeStamp === 'number' ? event.timeStamp : Date.now(),
      x: Number.isFinite(event?.clientX) ? event.clientX : -1,
      y: Number.isFinite(event?.clientY) ? event.clientY : -1,
    };

    window.__BETIA.__lastCalibrationGesture = current;

    if (!previous || previous.kind !== kind) {
      return false;
    }

    return (
      current.ts - previous.ts < CAL_CAPTURE_DEBOUNCE_MS &&
      Math.abs(current.x - previous.x) <= 12 &&
      Math.abs(current.y - previous.y) <= 12
    );
  }

  function calibrationCaptureHandler(event) {
    const snapshot = getCalibrationState();
    if (!snapshot.active) return;

    // Bloqueia o evento primeiro — evita que o clique chegue à banca
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation?.();

    if (isDuplicateCalibrationGesture('spots', event)) {
      return;
    }

    const target = snapshot.currentTarget;
    const clickedElement = closestStableClickable(event.target);
    const point = buildCalibrationPoint(target, event, clickedElement);
    const nextPoints = {
      ...snapshot.points,
      [target]: point,
    };
    const nextStepIndex = snapshot.stepIndex + 1;
    const isComplete = nextStepIndex >= snapshot.stepOrder.length;
    const profile = isComplete
      ? {
          id: `${window.__BETIA.platform?.id || 'platform'}-${window.location.hostname}`,
          platformId: window.__BETIA.platform?.id || null,
          platformName: window.__BETIA.platform?.name || null,
          host: window.location.hostname,
          frameUrl: redactUrl(window.location.href),
          points: nextPoints,
          savedAt: Date.now(),
        }
      : snapshot.profile;

    setCalibrationState({
      active: !isComplete,
      stepIndex: isComplete ? snapshot.stepOrder.length : nextStepIndex,
      currentTarget: isComplete ? null : snapshot.stepOrder[nextStepIndex],
      points: nextPoints,
      profile,
      message: isComplete
        ? 'Calibração concluída com sucesso.'
        : `Ponto ${target} salvo. Agora clique em ${snapshot.stepOrder[nextStepIndex]}.`,
    });

    if (isComplete && profile) {
      persistCalibrationProfile(profile);
    }
  }

  // Eventos que podem registrar um bet na Evolution — todos bloqueados em capture
  const CAL_BLOCK_EVENTS = ['mousedown', 'mouseup', 'touchstart', 'touchend', 'pointerdown', 'pointerup', 'dblclick'];

  function ensureCalibrationListeners() {
    if (window.__BETIA.__calibrationListenersInstalled) return;
    // Captura o clique para registrar o ponto de calibração
    document.addEventListener('click', calibrationCaptureHandler, true);
    // Bloqueia todos os outros eventos de input que a banca pode usar para registrar bets
    for (const evtName of CAL_BLOCK_EVENTS) {
      document.addEventListener(evtName, calBlockAllHandler, true);
    }
    window.__BETIA.__calibrationListenersInstalled = true;
  }

  async function startCalibration() {
    if (getCalibrationState().active) {
      return getCalibrationState();
    }

    // Garante que apenas um modo de calibração fica ativo por vez
    if (getChipCalState().active) {
      removeChipCalListeners();
      setChipCalState({ active: false });
    }
    ensureCalibrationListeners();
    return setCalibrationState({
      active: true,
      stepIndex: 0,
      currentTarget: CALIBRATION_SEQUENCE[0],
      stepOrder: CALIBRATION_SEQUENCE,
      points: {},
      message: 'Clique em PLAYER para iniciar a calibração.',
    });
  }

  async function cancelCalibration() {
    return setCalibrationState({
      active: false,
      stepIndex: 0,
      currentTarget: CALIBRATION_SEQUENCE[0],
      points: getCalibrationState().profile?.points || {},
      message: 'Calibração cancelada.',
    });
  }

  async function resetCalibration() {
    const key = getCalibrationStorageKey();
    try {
      await chrome.storage.local.remove([key]);
    } catch (_) {}
    return setCalibrationState({
      active: false,
      stepIndex: 0,
      currentTarget: CALIBRATION_SEQUENCE[0],
      points: {},
      profile: null,
      message: 'Calibração removida.',
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CALIBRAÇÃO DE FICHAS
  // Fluxo: startChipCalibration → usuário clica em cada ficha → salvo em storage
  // Integrado em selectChipAmount como prioridade sobre a busca heurística.
  // ═══════════════════════════════════════════════════════════════════════════

  function getChipCalKey() {
    const id = window.__BETIA.platform?.id || 'unknown';
    const host = window.location.hostname || 'unknown-host';
    return `${CHIP_CAL_PREFIX}:${id}:${host}`;
  }

  function getChipCalState() {
    return window.__BETIA.state?.chipCal || {
      active: false, stepIndex: 0, amounts: CHIP_CAL_AMOUNTS, points: {}, profile: null,
    };
  }

  function setChipCalState(next = {}) {
    window.__BETIA.state = window.__BETIA.state || {};
    window.__BETIA.state.chipCal = { ...getChipCalState(), ...next, updatedAt: Date.now() };
    renderChipCalHud(window.__BETIA.state.chipCal);
    try {
      chrome.runtime.sendMessage({ type: 'CHIP_CALIBRATION_STATE', data: window.__BETIA.state.chipCal }).catch(() => {});
    } catch (_) {}
    return window.__BETIA.state.chipCal;
  }

  function renderChipCalHud(state = getChipCalState()) {
    const existing = document.getElementById(CHIP_CAL_HUD_ID);
    if (!state.active) { existing?.remove(); return; }

    let hud = existing;
    if (!hud) {
      hud = document.createElement('div');
      hud.id = CHIP_CAL_HUD_ID;
      hud.style.cssText = `
        position:fixed; right:20px; bottom:100px; z-index:2147483647; pointer-events:none;
        max-width:300px; padding:14px 16px; border-radius:18px;
        border:1px solid rgba(99,102,241,0.40); background:rgba(10,10,12,0.93);
        box-shadow:0 12px 44px rgba(0,0,0,0.45); color:white;
        font:700 12px/1.45 Inter,sans-serif; letter-spacing:0.02em;
      `;
      document.documentElement.appendChild(hud);
    }

    const totalSteps = state.amounts.length;
    const currentAmount = state.amounts[state.stepIndex];
    const doneBadges = state.amounts.map((amount, i) => {
      const done = Boolean(state.points[String(amount)]);
      const active = i === state.stepIndex;
      const bg = done ? 'rgba(16,185,129,0.18)' : active ? 'rgba(99,102,241,0.20)' : 'rgba(255,255,255,0.05)';
      const border = done ? 'rgba(16,185,129,0.38)' : active ? 'rgba(99,102,241,0.55)' : 'rgba(255,255,255,0.10)';
      const color = done ? '#34d399' : active ? '#a5b4fc' : 'rgba(255,255,255,0.40)';
      return `<span style="display:inline-flex;padding:3px 8px;border-radius:999px;border:1px solid ${border};background:${bg};color:${color};font-size:10px;font-weight:900;">${done ? '✓' : active ? '→' : ''}R$${amount}</span>`;
    }).join('');

    hud.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:10px;">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <span style="font-size:10px;font-weight:900;letter-spacing:0.2em;text-transform:uppercase;color:#a5b4fc;">Calibrar Fichas</span>
          <span style="font-size:10px;color:rgba(255,255,255,0.40);">${state.stepIndex + 1}/${totalSteps}</span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:5px;">${doneBadges}</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.92);">
          Clique na ficha de <strong style="color:#a5b4fc;">R$&nbsp;${currentAmount}</strong> na mesa.
        </div>
        <div style="font-size:10px;color:rgba(255,255,255,0.45);line-height:1.4;">
          Os cliques desta etapa são interceptados — nenhuma aposta será disparada.
        </div>
      </div>
    `;
  }

  function chipCalCaptureHandler(event) {
    const state = getChipCalState();
    if (!state.active) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation?.();

    if (isDuplicateCalibrationGesture('chips', event)) {
      return;
    }

    const amount = state.amounts[state.stepIndex];
    const vx = event.clientX / Math.max(window.innerWidth, 1);
    const vy = event.clientY / Math.max(window.innerHeight, 1);
    const el = closestStableClickable(event.target);

    const nextPoints = {
      ...state.points,
      [String(amount)]: { amount, x: event.clientX, y: event.clientY, vx, vy, element: describeElement(el), capturedAt: Date.now() },
    };

    const nextStep = state.stepIndex + 1;
    const done = nextStep >= state.amounts.length;

    if (done) {
      const profile = {
        platformId: window.__BETIA.platform?.id || null,
        host: window.location.hostname,
        points: nextPoints,
        savedAt: Date.now(),
      };
      chrome.storage.local.set({ [getChipCalKey()]: profile }).catch(() => {});
      removeChipCalListeners();
      setChipCalState({ active: false, stepIndex: 0, points: nextPoints, profile, message: 'Fichas calibradas com sucesso!' });
    } else {
      setChipCalState({ stepIndex: nextStep, points: nextPoints, message: `R$${amount} salvo. Clique agora em R$${state.amounts[nextStep]}.` });
    }
  }

  function chipCalBlockHandler(event) {
    if (!getChipCalState().active) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation?.();
  }

  async function loadChipCalProfile() {
    try {
      const stored = await chrome.storage.local.get([getChipCalKey()]);
      return stored?.[getChipCalKey()] || null;
    } catch (_) { return null; }
  }

  async function hydrateChipCalProfile() {
    const profile = await loadChipCalProfile();
    if (profile) {
      setChipCalState({ profile, points: profile.points || {}, active: false });
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MONITOR DE MAPA DE FICHAS
  // Compara fichas detectadas no DOM com o perfil calibrado e avisa o side
  // panel sempre que houver divergência (fichas adicionadas / removidas /
  // posição deslocada). Intervalo: 3 s.
  // ═══════════════════════════════════════════════════════════════════════════

  let __chipMapMonitorInterval = null;
  let __lastChipMapKey = '';
  let __lastChipMapPayload = null;
  let __lastChipMapWarningKey = '';

  function buildChipMapKey(amounts) {
    return [...amounts].sort((a, b) => a - b).join(',');
  }

  // Verifica se cada ficha calibrada ainda tem um elemento visível com o valor correto
  function validateChipCalElements() {
    const state = getChipCalState();
    if (!state.profile?.points) return {};
    const result = {};
    for (const [amountStr, point] of Object.entries(state.profile.points)) {
      try {
        const vp = getViewportBox();
        const x = Math.round(point.vx * vp.width);
        const y = Math.round(point.vy * vp.height);
        const hit = document.elementFromPoint(x, y);
        if (!hit) { result[amountStr] = false; continue; }
        const el = closestStableClickable(hit);
        if (!el) { result[amountStr] = false; continue; }
        const text = (el.textContent || '').replace(/R\$|\s/gi, '').trim();
        const actual = parseNumericValue(text);
        const expected = Number(amountStr);
        result[amountStr] = Number.isFinite(actual) && Math.abs(actual - expected) < 0.01;
      } catch (_) { result[amountStr] = false; }
    }
    return result;
  }

  function broadcastChipMapStatus(payload) {
    try {
      chrome.runtime.sendMessage({ type: 'CHIP_MAP_STATUS', data: payload }).catch(() => {});
    } catch (_) {}
  }

  function monitorChipMap() {
    // Não monitora durante calibração ativa para evitar ruído
    if (getChipCalState().active) return;

    const detected = detectAvailableChips();
    const state = getChipCalState();
    const calibrated = state.profile
      ? Object.keys(state.profile.points || {}).map(Number).sort((a, b) => a - b)
      : [];

    const detectedSet = new Set(detected);
    const calibratedSet = new Set(calibrated);
    const added = detected.filter(v => !calibratedSet.has(v));
    const removed = calibrated.filter(v => !detectedSet.has(v));
    const hasDrift = added.length > 0 || removed.length > 0;

    const nextKey = buildChipMapKey(detected);
    const changed = nextKey !== __lastChipMapKey;
    __lastChipMapKey = nextKey;

    // Valida posições calibradas apenas quando há perfil salvo
    const elementOk = calibrated.length > 0 ? validateChipCalElements() : {};
    const hasElementMismatch = calibrated.length > 0
      ? Object.values(elementOk).some(ok => !ok)
      : false;
    const warningKey = JSON.stringify({
      detected,
      calibrated,
      added,
      removed,
      elementOk,
      hasElementMismatch,
    });

    if ((hasDrift || hasElementMismatch) && warningKey !== __lastChipMapWarningKey) {
      __lastChipMapWarningKey = warningKey;
      console.warn('[Bet IA Chip Map] Divergência detectada:', {
        detected, calibrated, added, removed, elementOk,
      });
    } else if (!hasDrift && !hasElementMismatch) {
      __lastChipMapWarningKey = '';
    }

    const payload = {
      detected,
      calibrated,
      added,
      removed,
      hasDrift,
      hasElementMismatch,
      elementOk,
      changed,
      ts: Date.now(),
    };

    __lastChipMapPayload = payload;
    broadcastChipMapStatus(payload);
  }

  function startChipMapMonitor() {
    if (__chipMapMonitorInterval) return;
    // Primeiro scan após 1s (DOM pode ainda estar carregando)
    setTimeout(monitorChipMap, 1000);
    __chipMapMonitorInterval = setInterval(monitorChipMap, 3000);
  }

  async function startChipCalibration() {
    if (getChipCalState().active) {
      return getChipCalState();
    }

    // Garante que apenas um modo de calibração fica ativo por vez
    if (getCalibrationState().active) {
      setCalibrationState({ active: false });
    }
    if (!window.__BETIA.__chipCalListenersInstalled) {
      document.addEventListener('click', chipCalCaptureHandler, true);
      for (const evtName of CAL_BLOCK_EVENTS) {
        document.addEventListener(evtName, chipCalBlockHandler, true);
      }
      window.__BETIA.__chipCalListenersInstalled = true;
    }

    // Detecta fichas reais da banca antes de iniciar (fallback para padrão)
    const detectedAmounts = detectAvailableChips();
    const amountsToCalibrate = detectedAmounts.length >= 2 ? detectedAmounts : CHIP_CAL_AMOUNTS;
    console.log('[Bet IA Chip Cal] Fichas detectadas na banca:', amountsToCalibrate);

    return setChipCalState({
      active: true, stepIndex: 0, amounts: amountsToCalibrate, points: {},
      message: `Clique na ficha de R$${amountsToCalibrate[0]} na mesa.`,
    });
  }

  // Detecta quais fichas estão disponíveis no DOM da banca neste momento
  function detectAvailableChips() {
    const found = new Map(); // amount -> element (deduplica por valor)

    for (const sel of CHIP_SELECTOR_CANDIDATES) {
      try {
        for (const el of Array.from(document.querySelectorAll(sel))) {
          if (!isVisibleElement(el)) continue;

          // Tenta atributo explícito primeiro (mais confiável)
          const dataVal =
            el.getAttribute('data-chip-value') ||
            el.getAttribute('data-value') ||
            (el.getAttribute('data-betia-id') || '').replace('chip-', '');

          let amount = null;
          if (dataVal) {
            amount = parseNumericValue(dataVal);
          }

          // Fallback: texto visível do elemento
          if (!amount) {
            const text = (el.textContent || '').replace(/R\$|\s/gi, '').trim();
            amount = parseNumericValue(text);
          }

          if (Number.isFinite(amount) && amount > 0 && amount <= 100000) {
            if (!found.has(amount)) {
              found.set(amount, el);
            }
          }
        }
      } catch (_) {}
    }

    return [...found.keys()].sort((a, b) => a - b);
  }

  function removeChipCalListeners() {
    document.removeEventListener('click', chipCalCaptureHandler, true);
    for (const evtName of CAL_BLOCK_EVENTS) {
      document.removeEventListener(evtName, chipCalBlockHandler, true);
    }
    window.__BETIA.__chipCalListenersInstalled = false;
  }

  async function cancelChipCalibration() {
    removeChipCalListeners();
    return setChipCalState({ active: false, message: 'Calibração de fichas cancelada.' });
  }

  async function resetChipCalibration() {
    try { await chrome.storage.local.remove([getChipCalKey()]); } catch (_) {}
    removeChipCalListeners();
    return setChipCalState({ active: false, points: {}, profile: null, message: 'Calibração de fichas removida.' });
  }

  // Ponto de ficha calibrado → element na posição salva
  function resolveChipCalibrationElement(amount) {
    const state = getChipCalState();
    const point = state.profile?.points?.[String(amount)] || state.points?.[String(amount)];
    if (!point) return null;

    const vp = getViewportBox();
    const x = Math.round(point.vx * vp.width);
    const y = Math.round(point.vy * vp.height);
    const hit = document.elementFromPoint(x, y);
    const stable = closestStableClickable(hit);

    if (stable) {
      const text = (stable.textContent || '').replace(/R\$|\s/gi, '').trim();
      const actual = parseNumericValue(text);
      const expected = Number(amount);
      if (Number.isFinite(actual) && Math.abs(actual - expected) >= 0.01) {
        console.warn(
          `[Bet IA Chip Map] Posição calibrada para R$${expected} aponta para elemento com valor R$${actual}. ` +
          'A banca pode ter mudado o mapa de fichas. Recalibre.'
        );
        // Dispara atualização imediata do monitor para alertar o side panel
        setTimeout(monitorChipMap, 0);
      }
    }

    return stable || null;
  }

  function hasExactBetSpot(target, platformId = '') {
    const targetSelectors = TARGET_PLATFORM_SELECTORS[target];
    if (!targetSelectors) return false;

    const selectors =
      platformId === 'betai'
        ? targetSelectors.exactBetAi || []
        : targetSelectors.exact || [];

    return selectors.some((selector) => {
      try {
        return Array.from(document.querySelectorAll(selector))
          .map((element) => closestStableClickable(element))
          .some((element) => isVisibleElement(element));
      } catch (_) {
        return false;
      }
    });
  }

  function hasTargetInViewer(target) {
    const terms = TARGET_TERMS[target] || [];
    if (!terms.length) return false;

    const directSelector =
      target === 'PLAYER'
        ? '[data-betia-id="bet-player"]'
        : target === 'BANKER'
          ? '[data-betia-id="bet-banker"]'
          : '[data-betia-id="bet-tie"]';

    if (safeQuery(directSelector)) return true;

    const candidates = safeQueryAll(
      'button, [role="button"], [aria-label], [title], [class], [data-testid], [data-role]',
    ).slice(0, 700);
    return candidates.some((element) => textHasAny(getElementLabel(element), terms));
  }

  function detectEngineFromViewer(frameUrls = collectFrameUrls()) {
    const urlCorpus = [window.location.href, ...frameUrls].join(' ');
    if (/evolution|evo-games|evogaming|evolutiongaming|evo-live|livecasino.*evo/i.test(urlCorpus)) {
      return 'evolution';
    }

    const pageCorpus = [
      document.title,
      document.body?.innerText?.slice(0, 5000),
      safeQuery('meta[name="description"]')?.getAttribute('content'),
    ].join(' ');

    if (/bac\s*bo|player|banker|tie|jogador|banca|empate/i.test(pageCorpus)) {
      return 'bacbo-viewer';
    }

    return 'unknown';
  }

  function buildBehaviorProfile(platform) {
    const frameUrls = collectFrameUrls();
    const targets = {
      player: hasTargetInViewer('PLAYER'),
      banker: hasTargetInViewer('BANKER'),
      tie: hasTargetInViewer('TIE'),
    };
    const exactTargets = {
      player: hasExactBetSpot('PLAYER', platform?.id),
      banker: hasExactBetSpot('BANKER', platform?.id),
      tie: hasExactBetSpot('TIE', platform?.id),
    };
    const hasBetTargets = targets.player && targets.banker && targets.tie;
    const hasExactBetTargets = exactTargets.player && exactTargets.banker && exactTargets.tie;
    // Pode executar se encontrou spots exatos OU spots heurísticos (texto/aria)
    const canExecuteBets = hasExactBetTargets || hasBetTargets;
    const hasViewerSurface = Boolean(
      safeQuery('canvas') ||
        safeQuery('video') ||
        safeQuery('iframe') ||
        safeQuery('[data-betia-id="bacbo-area"]') ||
        hasBetTargets,
    );
    const engine = (platform?.id === 'evolution' || platform?.id === 'betboom') ? 'evolution' : detectEngineFromViewer(frameUrls);
    const mode =
      hasExactBetTargets || hasBetTargets
        ? 'interactive_viewer'
        : hasViewerSurface
          ? 'viewer_only'
          : 'scanner';

    return {
      mode,
      engine,
      canExecuteBets,
      topFrame: isTopFrame(),
      frameCount: frameUrls.length,
      frameUrls,
      viewerSignals: {
        hasViewerSurface,
        hasCanvas: Boolean(safeQuery('canvas')),
        hasVideo: Boolean(safeQuery('video')),
        hasIframe: Boolean(safeQuery('iframe')),
        targets,
        exactTargets,
        canExecuteBets,
      },
      dataNeeds: [
        'round history/roadmap',
        'timer/countdown',
        'saldo ao lado de Depósito',
        'result/winner',
        'bet targets/player-banker-tie',
      ],
      complementSources: ['websocket', 'dom', 'vision'],
    };
  }

  function decoratePlatform(platform, detectionReason) {
    const behaviorProfile = buildBehaviorProfile(platform);
    return {
      ...platform,
      name:
        platform.id === 'generic'
          ? behaviorProfile.engine === 'evolution'
            ? 'Modo viewer — Evolution Gaming'
            : 'Modo viewer — comportamento da banca'
          : platform.name,
      detectionReason,
      behaviorProfile,
    };
  }

  function logDetection(message, key) {
    const nextKey = `${key}::${isTopFrame() ? 'top' : `frame:${window.location.pathname || 'unknown'}`}`;
    if (window.__BETIA.lastPlatformLogKey === nextKey) return;
    window.__BETIA.lastPlatformLogKey = nextKey;
    console.log(message);
  }

  // ─── Detecção ───────────────────────────────────────────────────────────────
  function detect() {
    const url = window.location.href;
    const viewerEngine = detectEngineFromViewer();
    if (viewerEngine === 'evolution') {
      const evolution = PLATFORM_REGISTRY.find((platform) => platform.id === 'evolution');
      if (evolution) {
        logDetection('[Bet IA Platform] Viewer indica engine Evolution.', 'viewer_engine:evolution');
        return decoratePlatform(evolution, 'viewer_engine');
      }
    }

    for (const platform of PLATFORM_REGISTRY) {
      const { detect: d } = platform;

      // 1. Viewer/DOM primeiro: o nome da plataforma/wrapper é secundário.
      if (d.dom?.length) {
        const found = d.dom.some(sel => {
          try { return !!document.querySelector(sel); } catch (_) { return false; }
        });
        if (found) {
          logDetection(`[Bet IA Platform] Detectado por DOM: ${platform.name}`, `dom:${platform.id}`);
          return decoratePlatform(platform, 'viewer_dom');
        }
      }

      // 2. URL só complementa quando o viewer ainda não revelou a engine.
      if (d.url && d.url.test(url)) {
        logDetection(`[Bet IA Platform] Detectado por URL: ${platform.name}`, `url:${platform.id}`);
        return decoratePlatform(platform, 'url');
      }
    }

    // Sempre retorna pelo menos o viewer genérico para evitar "plataforma fantasma".
    return decoratePlatform(PLATFORM_REGISTRY[PLATFORM_REGISTRY.length - 1], 'viewer_behavior_fallback');
  }

  // ─── Verificação de relevância de mensagem WS ──────────────────────────────
  // Usada pelo ws-interceptor para saber se uma mensagem é relevante.
  function deepPick(obj, keys, depth = 0) {
    if (!obj || depth > 6) return null;

    if (Array.isArray(obj)) {
      for (const item of obj) {
        const found = deepPick(item, keys, depth + 1);
        if (found !== null && found !== undefined) return found;
      }
      return null;
    }

    if (typeof obj !== 'object') return null;

    for (const key of keys) {
      if (obj[key] !== undefined && obj[key] !== null) return obj[key];
    }

    for (const value of Object.values(obj)) {
      const found = deepPick(value, keys, depth + 1);
      if (found !== null && found !== undefined) return found;
    }

    return null;
  }

  function deepHasAnyKey(obj, keys) {
    return deepPick(obj, keys) !== null;
  }

  function parseNumericValue(value) {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string') {
      const match = value.replace(/\s/g, '').match(/-?[\d.,]+/);
      if (!match) return null;
      return parseLocalizedNumber(match[0]);
    }
    return null;
  }

  function parseLocalizedNumber(raw) {
    const text = String(raw || '').replace(/[^\d,.-]/g, '');
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

    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function isWsMessageRelevant(data, platform) {
    const allKeys = [
      ...platform.wsMap.countdown,
      ...platform.wsMap.balance,
      ...platform.wsMap.result,
      ...(platform.wsMap.history || []),
    ];
    return deepHasAnyKey(data, allKeys);
  }

  function normalizeHistoryEntry(entry) {
    if (typeof entry === 'string' || typeof entry === 'number') {
      return window.__BETIA.normalizeResult?.(entry);
    }

    if (!entry || typeof entry !== 'object') return null;

    const raw =
      entry.result ??
      entry.winner ??
      entry.winnerSide ??
      entry.outcome ??
      entry.gameResult ??
      entry.side ??
      entry.value ??
      entry.code ??
      entry.name;

    return window.__BETIA.normalizeResult?.(raw);
  }

  function normalizeHistory(rawHistory) {
    if (!rawHistory) return [];

    const source = Array.isArray(rawHistory)
      ? rawHistory
      : Array.isArray(rawHistory?.items)
        ? rawHistory.items
        : Array.isArray(rawHistory?.results)
          ? rawHistory.results
          : [];

    return source.map(normalizeHistoryEntry).filter(Boolean).slice(0, 156);
  }

  function buildBalanceSnapshot(value, source, rawValue = null) {
    const parsed = parseNumericValue(value);
    if (!Number.isFinite(parsed)) return null;

    return {
      balance: parsed,
      balanceRaw:
        typeof rawValue === 'string'
          ? rawValue
          : rawValue !== null && rawValue !== undefined
            ? String(rawValue)
            : typeof value === 'string'
              ? value
              : String(value),
      balanceSource: source,
    };
  }

  function pickOfficialBalanceEntry(entries) {
    if (!Array.isArray(entries) || entries.length === 0) return null;

    return (
      entries.find((item) => item && item.real === true && item.display === true) ||
      entries.find((item) => item && item.display === true) ||
      entries.find((item) => item && item.real === true) ||
      entries.find((item) => item && (item.value !== undefined || item.amount !== undefined || item.balance !== undefined)) ||
      null
    );
  }

  function extractEvolutionOfficialBalance(raw) {
    if (!raw || typeof raw !== 'object') return null;

    if (raw.type === 'balanceUpdated') {
      return buildBalanceSnapshot(
        raw?.args?.balance,
        'ws:official:evolution.balanceUpdated',
        raw?.args?.balance,
      );
    }

    if (raw.namespace === 'accountBalance' && raw.method === 'getMy') {
      const official = pickOfficialBalanceEntry(raw?.result?.balances);
      if (!official) return null;
      return buildBalanceSnapshot(
        official.value ?? official.amount ?? official.balance,
        'ws:official:accountBalance.getMy',
        official.value ?? official.amount ?? official.balance,
      );
    }

    return null;
  }

  function extractEvolutionCountdown(raw) {
    if (!raw || typeof raw !== 'object') return null;
    if (raw.type !== 'bacbo.playerState') return null;

    const game = raw?.args?.game ?? raw?.args ?? null;
    return parseNumericValue(
      game?.timeToClose ??
        game?.countdown ??
        game?.timer ??
        game?.remainingTime ??
        game?.secondsLeft,
    );
  }

  function extractEvolutionHistory(raw) {
    if (!raw || typeof raw !== 'object') return [];

    if (raw.type === 'bacbo.road') {
      return normalizeHistory(raw?.args?.history ?? raw?.args?.road ?? raw?.history).reverse();
    }

    if (raw.type === 'bacbo.playerState') {
      const history = normalizeHistory(raw?.args?.game?.history ?? raw?.args?.history);
      return history.length ? history.reverse() : [];
    }

    return [];
  }

  function extractEvolutionResult(raw, normalizedHistory) {
    const direct = window.__BETIA.normalizeResult?.(
      raw?.args?.game?.winner ??
        raw?.args?.winner ??
        raw?.args?.winnerSide ??
        raw?.args?.result ??
        raw?.winner ??
        raw?.result,
    );

    return direct ?? normalizedHistory[0] ?? null;
  }

  function normalizeGenericWsForPlatform(raw, platform) {
    const countdown = deepPick(raw, platform.wsMap.countdown);
    const balance = deepPick(raw, platform.wsMap.balance);
    const result = deepPick(raw, platform.wsMap.result);
    const history = deepPick(raw, platform.wsMap.history || []);
    const normalizedHistory = normalizeHistory(history);

    if (countdown === null && balance === null && result === null && normalizedHistory.length === 0) {
      return null;
    }

    return {
      countdown: countdown !== null ? parseNumericValue(countdown) : null,
      balance: balance !== null ? parseNumericValue(balance) : null,
      balanceRaw:
        typeof balance === 'string'
          ? balance
          : balance !== null && balance !== undefined
            ? String(balance)
            : null,
      balanceSource: balance !== null ? 'ws:generic' : null,
      result: window.__BETIA.normalizeResult?.(result) ?? normalizedHistory[0] ?? null,
      history: normalizedHistory,
    };
  }

  function normalizeEvolutionWs(raw, platform) {
    const generic = normalizeGenericWsForPlatform(raw, platform);
    const officialBalance = extractEvolutionOfficialBalance(raw);
    const officialCountdown = extractEvolutionCountdown(raw);
    const officialHistory = extractEvolutionHistory(raw);
    const mergedHistory = officialHistory.length > 0 ? officialHistory : generic?.history || [];
    const result = extractEvolutionResult(raw, mergedHistory) ?? generic?.result ?? null;

    if (
      officialCountdown === null &&
      !officialBalance &&
      !result &&
      mergedHistory.length === 0 &&
      !generic
    ) {
      return null;
    }

    return {
      countdown: officialCountdown ?? generic?.countdown ?? null,
      balance: officialBalance?.balance ?? generic?.balance ?? null,
      balanceRaw: officialBalance?.balanceRaw ?? generic?.balanceRaw ?? null,
      balanceSource: officialBalance?.balanceSource ?? generic?.balanceSource ?? null,
      result,
      history: mergedHistory,
    };
  }

  // ─── Normalização WS com mapa da plataforma ────────────────────────────────
  function normalizeWsForPlatform(raw, platform) {
    const activePlatform = platform || PLATFORM_REGISTRY[PLATFORM_REGISTRY.length - 1];
    const looksEvolutionLike =
      activePlatform.id === 'evolution' ||
      activePlatform.id === 'betboom' ||
      activePlatform.behaviorProfile?.engine === 'evolution';

    if (looksEvolutionLike) {
      return normalizeEvolutionWs(raw, activePlatform);
    }

    return normalizeGenericWsForPlatform(raw, activePlatform);
  }

  function normalizeTarget(target) {
    const normalized = String(target || '').trim().toUpperCase();
    if (['PLAYER', 'BANKER', 'TIE'].includes(normalized)) {
      return normalized;
    }
    return '';
  }

  function dispatchHumanClick(element, preferredPoint = null) {
    if (!element) return null;

    try {
      element.scrollIntoView({ block: 'center', inline: 'center', behavior: 'instant' });
    } catch (_) {
      try {
        element.scrollIntoView({ block: 'center', inline: 'center' });
      } catch (_) {}
    }

    const point =
      preferredPoint && Number.isFinite(preferredPoint.x) && Number.isFinite(preferredPoint.y)
        ? {
            x: preferredPoint.x,
            y: preferredPoint.y,
            hit: document.elementFromPoint(preferredPoint.x, preferredPoint.y),
          }
        : getClickablePoint(element);
    const eventOptions = {
      bubbles: true,
      cancelable: true,
      view: window,
      button: 0,
      buttons: 1,
      clientX: point?.x,
      clientY: point?.y,
      screenX: point?.x,
      screenY: point?.y,
    };

    try {
      const hitTarget =
        (point?.hit && (element.contains?.(point.hit) ? point.hit : element)) || element;
      hitTarget.dispatchEvent(new PointerEvent('pointerover', eventOptions));
      hitTarget.dispatchEvent(new MouseEvent('mouseover', eventOptions));
      hitTarget.dispatchEvent(new PointerEvent('pointerenter', eventOptions));
      hitTarget.dispatchEvent(new MouseEvent('mouseenter', eventOptions));
      hitTarget.dispatchEvent(new PointerEvent('pointermove', eventOptions));
      hitTarget.dispatchEvent(new MouseEvent('mousemove', eventOptions));
      hitTarget.dispatchEvent(new PointerEvent('pointerdown', eventOptions));
      hitTarget.dispatchEvent(new MouseEvent('mousedown', eventOptions));
      hitTarget.dispatchEvent(new PointerEvent('pointerup', eventOptions));
      hitTarget.dispatchEvent(new MouseEvent('mouseup', eventOptions));
      hitTarget.dispatchEvent(new MouseEvent('click', eventOptions));
    } catch (_) {
      element.click();
    }

    return {
      point: point ? { x: Math.round(point.x), y: Math.round(point.y) } : null,
      hit: point?.hit ? describeElement(point.hit) : null,
    };
  }

  function findFirstClickable(selectors) {
    for (const sel of selectors) {
      try {
        const element = Array.from(document.querySelectorAll(sel))
          .map((candidate) => closestStableClickable(candidate))
          .find((candidate) => isVisibleElement(candidate));
        if (element) return element;
      } catch (_) {}
    }
    return null;
  }

  function isVisibleElement(element) {
    if (!element?.getBoundingClientRect) return false;
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle?.(element);
    return rect.width > 0 && rect.height > 0 && style?.visibility !== 'hidden' && style?.display !== 'none';
  }

  function findClickableByTerms(terms, extraFilter = null) {
    const candidates = safeQueryAll(
      'button, [role="button"], [aria-label], [title], [data-testid], [data-role], [class]',
    ).slice(0, 900);

    return (
      candidates.find((element) => {
        if (!isVisibleElement(element)) return false;
        if (extraFilter && !extraFilter(element)) return false;
        const label = getElementLabel(element);
        if (NEGATIVE_BET_TERMS.some((term) => label.toLowerCase().includes(term))) return false;
        return textHasAny(label, terms);
      }) || null
    );
  }

  function targetMatchesExactAttribute(element, target) {
    if (!element) return false;
    const targetKey = String(target || '').toUpperCase();
    if (targetKey === 'PLAYER') {
      return (
        element.getAttribute?.('data-betia-id') === 'bet-player' ||
        element.getAttribute?.('data-role') === BACBO_LIVE_CANONICAL_SELECTORS.PLAYER_BET_SPOT ||
        element.getAttribute?.('data-element') === 'player'
      );
    }
    if (targetKey === 'BANKER') {
      return (
        element.getAttribute?.('data-betia-id') === 'bet-banker' ||
        element.getAttribute?.('data-role') === BACBO_LIVE_CANONICAL_SELECTORS.BANKER_BET_SPOT ||
        element.getAttribute?.('data-element') === 'banker'
      );
    }
    if (targetKey === 'TIE') {
      return (
        element.getAttribute?.('data-betia-id') === 'bet-tie' ||
        element.getAttribute?.('data-role') === BACBO_LIVE_CANONICAL_SELECTORS.TIE_BET_SPOT ||
        element.getAttribute?.('data-element') === 'tie'
      );
    }
    return false;
  }

  function scoreDirection(target, rect) {
    if (!rect) return -100;
    const { width } = getViewportBox();
    const ratio = (rect.left + rect.width / 2) / width;
    const hint = TARGET_DIRECTION_HINTS[target];
    if (!hint) return 0;

    const distance = Math.abs(ratio - hint.centerX);
    let score = Math.round((1 - Math.min(distance / hint.softTolerance, 1.25)) * 26);

    if (target === 'PLAYER' && ratio > hint.hardLimit) score -= 48;
    if (target === 'BANKER' && ratio < 1 - hint.hardLimit) score -= 48;
    if (target === 'TIE' && distance > hint.hardLimit) score -= 44;

    return score;
  }

  function scoreBetSpotCandidate(element, target, platformId = '') {
    if (!element || !isVisibleElement(element)) return -Infinity;
    const rect = element.getBoundingClientRect();
    if (rect.width < 24 || rect.height < 24) return -Infinity;

    const label = getElementLabel(element).toLowerCase();
    const targetTerms = TARGET_TERMS[target] || [];
    const oppositeTerms = targetOppositeTerms(target);
    const viewport = getViewportBox();
    const centerYRatio = (rect.top + rect.height / 2) / viewport.height;

    let score = 0;
    if (targetMatchesExactAttribute(element, target)) score += 120;
    if (textHasAny(label, targetTerms)) score += 28;
    if (textHasAny(label, oppositeTerms)) score -= 42;
    if (NEGATIVE_BET_TERMS.some((term) => label.includes(term))) score -= 64;
    if (countMatchedTargets(label) > 1 && !targetMatchesExactAttribute(element, target)) score -= 28;

    if (/betspot|bet-spot|wc-bet-spot/.test(label)) score += 42;
    if (/bet/.test(label)) score += 12;
    if (/spot/.test(label)) score += 10;
    if (/player-bet-spot|banker-bet-spot|tie-bet-spot/.test(label)) score += 24;

    if (platformId === 'betai' && /^bet-(player|banker|tie)$/.test(element.getAttribute?.('data-betia-id') || '')) {
      score += 200;
    }

    if (platformId === 'evolution') {
      if (element.closest?.('[class*="road"], [class*="history"], [class*="score"], [class*="bead"]')) {
        score -= 80;
      }
      if (rect.width > viewport.width * 0.92 && rect.height > viewport.height * 0.55) {
        score -= 80;
      }
      if (centerYRatio < 0.14 || centerYRatio > 0.96) {
        score -= 30;
      }
    }

    if (centerYRatio < 0.08 || centerYRatio > 0.98) score -= 30;
    if (rect.width >= 44 && rect.height >= 28) score += 6;
    if (rect.width >= 80 && rect.height >= 40) score += 8;
    if (rect.width > viewport.width * 0.8) score -= 40;

    score += scoreDirection(target, rect);

    return score;
  }

  function collectBetSpotCandidates(target, selectors = [], platformId = '') {
    const targetSelectors = TARGET_PLATFORM_SELECTORS[target] || {};
    const strictSelectors =
      platformId === 'betai'
        ? targetSelectors.exactBetAi || []
        : targetSelectors.exact || [];
    const selectorPool = [...strictSelectors, ...selectors];
    const elements = [];

    for (const sel of selectorPool) {
      try {
        elements.push(
          ...Array.from(document.querySelectorAll(sel)).map((element) => closestStableClickable(element)),
        );
      } catch (_) {}
    }

    if (elements.length > 0) {
      return dedupeElements(elements);
    }

    if (platformId === 'betai') {
      return [];
    }

    return dedupeElements(
      safeQueryAll('button, [role="button"], [aria-label], [title], [data-role], [data-element], [class]')
        .slice(0, 1200)
        .map((element) => closestStableClickable(element)),
    );
  }

  function findBetSpotByTarget(target, selectors = [], platformId = '') {
    const candidates = collectBetSpotCandidates(target, selectors, platformId);
    let best = null;
    let bestScore = -Infinity;

    for (const element of candidates) {
      const score = scoreBetSpotCandidate(element, target, platformId);
      if (score > bestScore) {
        best = element;
        bestScore = score;
      }
    }

    if (best && bestScore >= 20) {
      return best;
    }

    return findClickableByTerms(TARGET_TERMS[target] || [], (element) => {
      return scoreBetSpotCandidate(closestStableClickable(element), target, platformId) >= 12;
    });
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function parseMoneyText(text) {
    const raw = String(text || '').replace(/\s/g, '');
    const match = raw.match(/([\d.,]+)/);
    if (!match) return null;
    const value = parseLocalizedNumber(match[1]);
    return Number.isFinite(value) ? value : null;
  }

  function readTotalBet() {
    try {
      const el = document.querySelector('[data-betia-id="total-bet"]');
      return parseMoneyText(el?.textContent);
    } catch (_) {
      return null;
    }
  }

  function readSelectedChip() {
    try {
      const root = document.querySelector('[data-betia-id="bacbo-area"]');
      const value = root?.getAttribute('data-betia-selected-chip');
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    } catch (_) {
      return null;
    }
  }

  async function waitForSelectedChip(amount, timeoutMs = 800) {
    const expected = Number(amount);
    if (!Number.isFinite(expected)) return false;

    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      if (readSelectedChip() === expected) {
        return true;
      }
      await sleep(40);
    }

    return false;
  }

  function flashClick(element, label) {
    if (!element?.getBoundingClientRect) return;

    try {
      const rect = element.getBoundingClientRect();
      const marker = document.createElement('div');
      marker.textContent = label || 'BOT';
      marker.style.cssText = `
        position: fixed;
        left: ${rect.left + rect.width / 2 - 24}px;
        top: ${rect.top + rect.height / 2 - 24}px;
        z-index: 2147483647;
        width: 48px;
        height: 48px;
        border-radius: 999px;
        border: 2px solid #f59e0b;
        background: rgba(245, 158, 11, 0.18);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font: 800 9px/1 Inter, sans-serif;
        letter-spacing: 0.08em;
        pointer-events: none;
        box-shadow: 0 0 28px rgba(245, 158, 11, 0.75);
        transform: scale(0.7);
        opacity: 1;
        transition: transform 220ms ease, opacity 420ms ease;
      `;
      document.documentElement.appendChild(marker);
      requestAnimationFrame(() => {
        marker.style.transform = 'scale(1.35)';
        marker.style.opacity = '0';
      });
      setTimeout(() => marker.remove(), 520);
    } catch (_) {}
  }

  function normalizeAmount(amount) {
    const numeric = Number(amount);
    if (!Number.isFinite(numeric) || numeric <= 0) {
      return null;
    }

    return Number.isInteger(numeric) ? String(numeric) : String(numeric).replace('.', ',');
  }

  async function selectChipAmount(amount) {
    const normalizedAmount = normalizeAmount(amount);
    if (!normalizedAmount) {
      return {
        success: true,
        skipped: true,
        message: 'Execução sem seleção automática de ficha.',
      };
    }

    // ── Prioridade 0: ponto de calibração salvo ──────────────────────────────
    // Se o usuário calibrou as fichas, usa o ponto exato registrado.
    const chipCalEl = resolveChipCalibrationElement(Number(amount));
    if (chipCalEl) {
      flashClick(chipCalEl, `R$${normalizedAmount}`);
      dispatchHumanClick(chipCalEl);
      await waitForSelectedChip(Number(amount));
      console.log('[Bet IA Chip] Ficha selecionada via calibração:', normalizedAmount);
      return { success: true, skipped: false, message: `Ficha R$${normalizedAmount} via calibração.` };
    }

    const chipSelectors = [
      `[data-betia-id="chip-${normalizedAmount}"]`,
      `[data-chip-value="${normalizedAmount}"]`,
      `[data-value="${normalizedAmount}"]`,
      `[aria-label*="${normalizedAmount}"]`,
      `[title*="${normalizedAmount}"]`,
    ];

    let chipByText = findFirstClickable(chipSelectors);

    if (!chipByText) {
      const viewport = getViewportBox();
      const candidates = dedupeElements(
        CHIP_SELECTOR_CANDIDATES.flatMap((selector) =>
          safeQueryAll(selector).map((element) => closestStableClickable(element)),
        ),
      );

      let best = null;
      let bestScore = -Infinity;

      for (const element of candidates) {
        if (!isVisibleElement(element)) continue;

        const rect = element.getBoundingClientRect();
        const label = getElementLabel(element).toLowerCase();
        const text = String(element.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
        const amountValue =
          element.getAttribute?.('data-chip-value') ||
          element.getAttribute?.('data-value') ||
          '';
        let score = 0;

        if (String(amountValue) === normalizedAmount) score += 160;
        if (element.getAttribute?.('data-betia-id') === `chip-${normalizedAmount}`) score += 200;
        if (label.includes(normalizedAmount)) score += 26;
        if (text === normalizedAmount || text === `r$ ${normalizedAmount}` || text === `r$${normalizedAmount}`) {
          score += 36;
        }
        if (/chip|ficha|token/.test(label)) score += 24;
        if (rect.top > viewport.height * 0.45) score += 8;
        if (rect.width >= 24 && rect.width <= 120) score += 6;
        if (rect.height >= 24 && rect.height <= 120) score += 6;
        if (Math.abs(rect.width - rect.height) <= 12) score += 8;
        if (/player|banker|tie|jogador|banca|empate/.test(label)) score -= 60;

        if (score > bestScore) {
          best = element;
          bestScore = score;
        }
      }

      if (best && bestScore >= 18) {
        chipByText = best;
      }
    }

    if (!chipByText) {
      return {
        success: false,
        skipped: false,
        message: `Ficha de R$ ${normalizedAmount} não encontrada no DOM.`,
      };
    }

    flashClick(chipByText, `R$${normalizedAmount}`);
    dispatchHumanClick(chipByText);
    await waitForSelectedChip(Number(amount));
    return {
      success: true,
      skipped: false,
      message: `Ficha de R$ ${normalizedAmount} selecionada.`,
    };
  }

  // ─── Execução de aposta — abstrai o seletor por plataforma ────────────────
  async function executeBet(target, amount, traceId) {
    const platform = window.__BETIA.platform;
    if (!platform) return { success: false, message: 'Plataforma não detectada.' };

    const normalizedTarget = normalizeTarget(target);
    if (!normalizedTarget) {
      return { success: false, message: `Alvo de aposta inválido: "${target}".` };
    }

    if (
      getCalibrationState().active ||
      window.__BETIA.state?.calibration?.active === true
    ) {
      return {
        success: false,
        message: 'Calibração em andamento. Finalize ou cancele antes de executar apostas.',
        target: normalizedTarget,
        amount,
        traceId,
      };
    }

    // Guard para Evolution e BetBoom: requer que spots estejam visíveis OU que
    // exista ponto de calibração salvo. Evita cliques em posição errada.
    const needsGuard = platform.id === 'evolution' || platform.id === 'betboom';
    if (
      needsGuard &&
      platform.behaviorProfile?.viewerSignals?.canExecuteBets !== true &&
      !getCalibrationPoint(normalizedTarget)
    ) {
      return {
        success: false,
        message:
          `${platform.name}: nenhum spot de aposta visível e sem calibração salva. ` +
          'Use o modo Calibração para registrar os pontos de clique.',
        target: normalizedTarget,
        amount,
        traceId,
        calibrationState: getCalibrationState(),
      };
    }

    const amountNumber = Number(amount);
    const beforeTotal = readTotalBet();

    const chipResult = await selectChipAmount(amount);
    if (!chipResult.success && platform.id === 'betai') {
      return {
        success: false,
        message: chipResult.message,
        target: normalizedTarget,
        amount,
        traceId,
      };
    }

    const selectorList = platform.domSelectors[`bet${capitalize(normalizedTarget)}`] || [];
    const calibrationCandidate = resolveCalibrationElement(normalizedTarget);
    const btn =
      calibrationCandidate?.score >= 16
        ? calibrationCandidate.element
        : findBetSpotByTarget(normalizedTarget, selectorList, platform.id);
    if (btn) {
      flashClick(btn, normalizedTarget.slice(0, 1));
      const clickTrace = dispatchHumanClick(btn, calibrationCandidate?.point || null);
      console.log('[Bet IA Execute] Clique resolvido:', {
        platform: platform.id,
        target: normalizedTarget,
        amount,
        traceId,
        element: describeElement(btn),
        clickTrace,
        calibrationCandidate,
      });
      await sleep(180);

      const afterTotal = readTotalBet();
      if (
        beforeTotal !== null &&
        afterTotal !== null &&
        Number.isFinite(amountNumber) &&
        afterTotal < beforeTotal + amountNumber
      ) {
        return {
          success: false,
          message:
            `Clique enviado, mas a banca não registrou a ficha. ` +
            `Total antes: R$ ${beforeTotal}; depois: R$ ${afterTotal}. ` +
            `Possíveis causas: saldo insuficiente, rodada fechada ou botão desabilitado.`,
          target: normalizedTarget,
          amount,
          traceId,
          beforeTotal,
          afterTotal,
          chipSelected: chipResult.success && !chipResult.skipped,
          chipMessage: chipResult.message,
          clickTrace,
          element: describeElement(btn),
          calibrationCandidate,
        };
      }

      return {
        success: true,
        message: `Aposta ${normalizedTarget} executada via ${platform.name}.`,
        target: normalizedTarget,
        amount,
        traceId,
        chipSelected: chipResult.success && !chipResult.skipped,
        chipMessage: chipResult.message,
        clickTrace,
        element: describeElement(btn),
        calibrationCandidate,
      };
    }

    return {
      success: false,
      message: `Botão de aposta "${normalizedTarget}" não encontrado em ${platform.name}.`,
      target: normalizedTarget,
      amount,
      traceId,
      chipMessage: chipResult.message,
    };
  }

  async function executeBets(bets, traceId) {
    if (!Array.isArray(bets) || bets.length === 0) {
      return {
        success: false,
        message: 'Fila de apostas vazia.',
        traceId,
        results: [],
      };
    }

    const results = [];
    await sleep(HUMAN_DELAY_BEFORE_BATCH_MS);
    for (const [index, bet] of bets.entries()) {
      const result = await executeBet(bet.target, bet.amount, `${traceId || 'batch'}-${index + 1}`);
      results.push({
        index,
        target: bet.target,
        amount: bet.amount,
        ...result,
      });

      if (!result.success) {
        return {
          success: false,
          message: `Falha na ficha ${index + 1}/${bets.length}: ${result.message}`,
          traceId,
          results,
        };
      }

      await sleep(HUMAN_DELAY_BETWEEN_BETS_MS);
    }

    const totalAmount = bets.reduce((acc, bet) => acc + (Number(bet.amount) || 0), 0);
    return {
      success: true,
      message: `${bets.length} ficha(s) executada(s) com sucesso.`,
      traceId,
      totalAmount,
      results,
    };
  }

  function capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';
  }

  function getDiagnostics() {
    const platform = window.__BETIA.platform || detect();
    return {
      timer: null,
      countdown: null,
      lastResult: '---',
      result: null,
      history: [],
      balance: null,
      balanceRaw: null,
      balanceSource: null,
      status: 'VIEWER_SCANNING',
      isSyncing: true,
      platform: platform.name,
      platformId: platform.id,
      platformName: platform.name,
      detectionReason: platform.detectionReason,
      behaviorProfile: platform.behaviorProfile,
      wsEndpoints: Array.isArray(window.__BETIA.state?.wsEndpoints)
        ? window.__BETIA.state.wsEndpoints.slice(-12)
        : [],
      sources: ['viewer'],
      freshnessMs: 0,
      ts: Date.now(),
    };
  }

  // ─── API pública ───────────────────────────────────────────────────────────
  const detected = detect();
  window.__BETIA.platform = detected;
  ensureCalibrationListeners();
  hydrateCalibrationProfile().catch(() => {});
  hydrateChipCalProfile().catch(() => {});
  startChipMapMonitor();
  window.__BETIA.platformDetector = {
    detect,
    isWsMessageRelevant: (data) => isWsMessageRelevant(data, window.__BETIA.platform || detected),
    normalizeWs:         (data) => normalizeWsForPlatform(data, window.__BETIA.platform || detected),
    executeBet,
    executeBets,
    getDiagnostics,
    // Calibração de spots
    getCalibrationState,
    startCalibration,
    cancelCalibration,
    resetCalibration,
    // Calibração de fichas
    getChipCalState,
    startChipCalibration,
    cancelChipCalibration,
    resetChipCalibration,
    detectAvailableChips,
    monitorChipMap,
  };

  console.log(`[Bet IA Platform] Plataforma ativa: "${detected.name}" (${detected.id})`);
})();

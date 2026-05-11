// chipCalibrator.js — Calibragem automática de chips, banca e painel
// Baseado em platform-detector.js do web-betia--studio000001
// Detecta e mapeia elementos automaticamente, sem hardcoding de seletores

(function () {
  'use strict';

  // ─── Seletores Canônicos (ordem de preferência) ───────────────────────────────

  const CHIP_SELECTORS = [
    '[data-value]',
    '[data-amount]',
    '[class*="chip"]',
    'button[value]',
    'button[data-value]',
    'button[aria-label*="R$"]',
    '[role="button"][data-value]',
    '[class*="bet-amount"]',
    '[class*="betting-chip"]',
    'button',
    '[role="button"]'
  ];

  const BETSPOT_SELECTORS = {
    player: [
      '[data-bet="player"]',
      '[data-role*="player"]',
      '[data-element="player"]',
      '[class*="betspot"][class*="player"]',
      '[class*="player"][class*="bet"]',
      '[aria-label*="Player" i]',
      '[aria-label*="Jogador" i]',
      'button[class*="Player"]',
      '[class*="player-spot"]',
      '[class*="player-area"]',
    ],
    banker: [
      '[data-bet="banker"]',
      '[data-role*="banker"]',
      '[data-element="banker"]',
      '[class*="betspot"][class*="banker"]',
      '[class*="banker"][class*="bet"]',
      '[aria-label*="Banker" i]',
      '[aria-label*="Banca" i]',
      'button[class*="Banker"]',
      '[class*="banker-spot"]',
      '[class*="banker-area"]',
    ],
    tie: [
      '[data-bet="tie"]',
      '[data-role*="tie"]',
      '[data-element="tie"]',
      '[class*="betspot"][class*="tie"]',
      '[class*="tie"][class*="bet"]',
      '[aria-label*="Tie" i]',
      '[aria-label*="Empate" i]',
      'button[class*="Tie"]',
      '[class*="tie-spot"]',
      '[class*="tie-area"]',
    ]
  };

  const TARGET_TERMS = {
    PLAYER: ['player', 'jogador', 'azul', 'blue'],
    BANKER: ['banker', 'banca', 'bank', 'vermelho', 'red'],
    TIE: ['tie', 'empate', 'amarelo', 'yellow', 'gold']
  };

  const TARGET_POSITION_HINTS = {
    PLAYER: { centerX: 0.2, tolerance: 0.25 },
    TIE: { centerX: 0.5, tolerance: 0.2 },
    BANKER: { centerX: 0.8, tolerance: 0.25 }
  };

  // ─── Storage e Estado ──────────────────────────────────────────────────────────

  const CALIBRATION_KEY = 'WDP_CHIP_CALIBRATION';
  let calibration = {
    timestamp: null,
    platform: null,
    url: null,
    chips: {}, // { "2500": selector, "500": selector, ... }
    betspots: { // { "P": selector, "B": selector, "T": selector }
      P: null,
      B: null,
      T: null
    },
    panelInfo: {
      containerSelector: null,
      visibleChips: []
    }
  };

  // ─── Detecção de Plataforma ───────────────────────────────────────────────────

  const WS_KEYWORDS = {
    evolution: ['gameState', 'tableId', 'dealerName', 'BacBo', 'bacbo', 'timeToClose', 'bettingOpen', 'betsOpen', 'beadPlate', 'roadmap', 'winnerSide'],
    pragmatic: ['roundId', 'gameType', 'remainingTime', 'balanceUpdated'],
    betboom: ['gameState', 'tableId', 'BacBo', 'bacbo', 'timeToClose', 'bettingOpen', 'balanceUpdated', 'accountBalance', 'rounds', 'history', 'road']
  };

  function detectPlatformByWS(wsMessage) {
    if (!wsMessage) return null;

    const text = typeof wsMessage === 'string' ? wsMessage : JSON.stringify(wsMessage);
    const lower = text.toLowerCase();

    for (const [platform, keywords] of Object.entries(WS_KEYWORDS)) {
      const matches = keywords.filter(k => lower.includes(k.toLowerCase())).length;
      if (matches >= 2) return { id: platform, name: platform.toUpperCase(), confidence: 'WS', matches };
    }

    return null;
  }

  function detectPlatform() {
    const url = window.location.href.toLowerCase();

    // Primeiro: detectar por URL (mais rápido)
    if (url.includes('betboom')) return { id: 'betboom', name: 'BetBoom', confidence: 'URL' };
    if (url.includes('evolution') || url.includes('evo-games')) return { id: 'evolution', name: 'Evolution Gaming', confidence: 'URL' };
    if (url.includes('pragmatic')) return { id: 'pragmatic', name: 'Pragmatic Play', confidence: 'URL' };

    // Fallback: genérico
    return { id: 'generic', name: 'Plataforma Genérica', confidence: 'FALLBACK' };
  }

  // ─── Busca Inteligente de Elementos ────────────────────────────────────────────

  function encontrarElemento(seletores, filtro = null) {
    for (const sel of seletores) {
      try {
        const elementos = document.querySelectorAll(sel);
        for (const el of elementos) {
          if (!el.offsetParent) continue; // Elemento invisível
          if (filtro && !filtro(el)) continue;
          return el;
        }
      } catch (_) {
        // Seletor inválido, continua
      }
    }
    return null;
  }

  function encontrarChipsDisponiveis() {
    const chips = {};
    const valores = [2500, 500, 125, 25, 10, 5];

    for (const valor of valores) {
      const el = encontrarElemento(CHIP_SELECTORS, (el) => {
        const texto = el.textContent || el.getAttribute('data-value') || '';
        return texto.toString().includes(valor.toString());
      });

      if (el) {
        const selector = el.getAttribute('data-value') ? `[data-value="${valor}"]` :
                        el.getAttribute('data-amount') ? `[data-amount="${valor}"]` :
                        el.getAttribute('value') ? `button[value="${valor}"]` :
                        `.${el.className.split(' ')[0]}:contains("${valor}")`;
        chips[valor] = selector;
      }
    }

    return chips;
  }

  function encontrarBetspot(tipo) {
    const seletores = BETSPOT_SELECTORS[tipo.toLowerCase()] || BETSPOT_SELECTORS['player'];
    const terms = TARGET_TERMS[tipo.toUpperCase()] || TARGET_TERMS.PLAYER;

    // Primeiro: tentar seletores explícitos
    const el = encontrarElemento(seletores);
    if (el) return el;

    // Fallback: buscar por texto
    const allButtons = document.querySelectorAll('button, [role="button"], div[class*="bet"]');
    for (const btn of allButtons) {
      if (!btn.offsetParent) continue;

      const texto = (btn.textContent || '').toLowerCase();
      if (terms.some(t => texto.includes(t))) {
        return btn;
      }
    }

    return null;
  }

  function encontrarBetspots() {
    return {
      P: encontrarBetspot('PLAYER'),
      B: encontrarBetspot('BANKER'),
      T: encontrarBetspot('TIE')
    };
  }

  function encontrarPainelDeChips() {
    const candidatos = document.querySelectorAll(
      '[class*="betting"][class*="panel"], ' +
      '[class*="chip-panel"], ' +
      '[class*="bet-panel"], ' +
      '[class*="wager"], ' +
      '[data-role="chipPanel"]'
    );

    for (const painel of candidatos) {
      if (painel.offsetParent) return painel;
    }

    return null;
  }

  // ─── Calibração ───────────────────────────────────────────────────────────────

  async function calibrar() {
    console.log('[CHIP-CALIBRATOR] Iniciando calibração...');

    const platform = detectPlatform();
    const timestamp = Date.now();

    // Encontrar chips
    const chips = encontrarChipsDisponiveis();
    console.log('[CHIP-CALIBRATOR] Chips encontrados:', Object.keys(chips).length, chips);

    // Encontrar betspots
    const betspotEls = encontrarBetspots();
    const betspots = {};
    for (const [key, el] of Object.entries(betspotEls)) {
      betspots[key] = el ? {
        selector: el.getAttribute('data-bet') || el.getAttribute('data-role') || `.${el.className.split(' ')[0]}`,
        text: el.textContent?.substring(0, 50)
      } : null;
    }
    console.log('[CHIP-CALIBRATOR] Betspots encontrados:', betspots);

    // Encontrar painel
    const panelEl = encontrarPainelDeChips();
    const panelInfo = panelEl ? {
      containerSelector: panelEl.getAttribute('data-role') || `.${panelEl.className.split(' ')[0]}`,
      dimensions: {
        width: panelEl.offsetWidth,
        height: panelEl.offsetHeight,
        x: panelEl.offsetLeft,
        y: panelEl.offsetTop
      }
    } : null;
    console.log('[CHIP-CALIBRATOR] Painel encontrado:', panelInfo);

    // Salvar calibração
    calibration = {
      timestamp,
      platform,
      url: window.location.href,
      chips,
      betspots,
      panelInfo,
      qualidade: {
        chipsEncontrados: Object.keys(chips).length,
        betspotsCompletos: Object.values(betspots).filter(v => v).length,
        painelEncontrado: !!panelEl
      }
    };

    // Persistir em localStorage
    try {
      localStorage.setItem(CALIBRATION_KEY, JSON.stringify(calibration));
      console.log('[CHIP-CALIBRATOR] ✓ Calibração salva em localStorage');
    } catch (e) {
      console.warn('[CHIP-CALIBRATOR] ⚠ Não foi possível salvar em localStorage:', e.message);
    }

    // Exportar para globalThis
    globalThis.WDPCalibration = calibration;

    return calibration;
  }

  function carregarCalibracaoSalva() {
    try {
      const saved = localStorage.getItem(CALIBRATION_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        // Validar se é da mesma URL
        if (data.url === window.location.href) {
          calibration = data;
          globalThis.WDPCalibration = calibration;
          console.log('[CHIP-CALIBRATOR] ✓ Calibração carregada de localStorage');
          return true;
        }
      }
    } catch (e) {
      console.warn('[CHIP-CALIBRATOR] Erro ao carregar calibração:', e.message);
    }
    return false;
  }

  // ─── API Pública ──────────────────────────────────────────────────────────────

  async function garantirCalibrada() {
    if (carregarCalibracaoSalva()) {
      return calibration;
    }

    // Aguardar DOM estar pronto
    if (document.readyState === 'loading') {
      return new Promise((resolve) => {
        document.addEventListener('DOMContentLoaded', async () => {
          const result = await calibrar();
          resolve(result);
        });
      });
    }

    return calibrar();
  }

  function obterSeletorChip(valor) {
    return calibration.chips?.[valor] || null;
  }

  function obterSeletorBetspot(tipo) {
    const betspot = calibration.betspots?.[tipo];
    return betspot?.selector || null;
  }

  function obterStatusCalibração() {
    return {
      calibrado: !!calibration.timestamp,
      tempo: new Date(calibration.timestamp || 0).toLocaleString(),
      qualidade: calibration.qualidade,
      platform: calibration.platform,
      chipsDisponiveis: Object.keys(calibration.chips || {}),
      betspots: Object.fromEntries(
        Object.entries(calibration.betspots || {})
          .map(([k, v]) => [k, !!v])
      )
    };
  }

  function resetarCalibração() {
    calibration = {
      timestamp: null,
      platform: null,
      url: null,
      chips: {},
      betspots: { P: null, B: null, T: null },
      panelInfo: { containerSelector: null, visibleChips: [] }
    };
    localStorage.removeItem(CALIBRATION_KEY);
    delete globalThis.WDPCalibration;
    console.log('[CHIP-CALIBRATOR] ✓ Calibração resetada');
  }

  // ─── Inicialização ────────────────────────────────────────────────────────────

  // Carregar calibração salva se existir
  carregarCalibracaoSalva();

  // Detectar plataforma por WebSocket (se disponível)
  function updatePlatformByWS(wsMessage) {
    const detected = detectPlatformByWS(wsMessage);
    if (detected && calibration.platform?.id !== detected.id) {
      console.log('[CHIP-CALIBRATOR] Plataforma detectada por WebSocket:', detected);
      calibration.platform = detected;
    }
  }

  // Exportar API
  globalThis.WDPChipCalibrator = {
    calibrar,
    garantirCalibrada,
    obterSeletorChip,
    obterSeletorBetspot,
    obterStatusCalibração,
    resetarCalibração,
    updatePlatformByWS, // ← Função nova para atualizar por WS
    detectPlatformByWS   // ← Função nova para debug
  };

  console.log('[CHIP-CALIBRATOR] Módulo carregado. Use WDPChipCalibrator.calibrar() para calibrar');
})();

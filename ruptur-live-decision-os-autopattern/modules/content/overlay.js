// modules/content/overlay.js
// COMPLIANCE: overlay nunca bloqueia a visão da banca.
// Usa anel luminoso na borda da tela + badge no topo.
// Background máximo: 0.13 de alpha — banca sempre visível.

(function () {
  'use strict';

  const PHASE_CONFIG = {
    IDLE: {
      bg: 'rgba(0,0,0,0)', border: 'transparent',
      label: '', accent: 'transparent', pulse: false,
    },
    ANALYZING: {
      bg: 'rgba(20,30,80,0.10)', border: 'rgba(99,102,241,0.40)',
      label: '🔍 Analisando...', accent: '#6366f1', pulse: false,
    },
    PROPOSING: {
      bg: 'rgba(40,10,90,0.11)', border: 'rgba(168,85,247,0.55)',
      label: '⚡ Decisão Detectada', accent: '#a855f7', pulse: true,
    },
    EXECUTING: {
      bg: 'rgba(80,0,0,0.13)', border: 'rgba(239,68,68,0.70)',
      label: '🎯 EXECUTANDO', accent: '#ef4444', pulse: true,
    },
    WAITING: {
      bg: 'rgba(0,20,60,0.09)', border: 'rgba(14,165,233,0.42)',
      label: '⏳ Aguardando Resultado...', accent: '#0ea5e9', pulse: false,
    },
    DESYNC: {
      bg: 'rgba(80,30,0,0.11)', border: 'rgba(249,115,22,0.60)',
      label: '⚠️ DESYNC — Execução Bloqueada', accent: '#f97316', pulse: true,
    },
    PAUSED: {
      bg: 'rgba(20,20,30,0.09)', border: 'rgba(148,163,184,0.38)',
      label: '⏸️ Pausado', accent: '#94a3b8', pulse: false,
    },
    MANUAL_OVERRIDE: {
      bg: 'rgba(80,0,20,0.11)', border: 'rgba(251,113,133,0.58)',
      label: '🛑 Manual Override', accent: '#fb7185', pulse: true,
    },
    ACTIVE_LOCK: {
      bg: 'rgba(10,0,40,0.11)', border: 'rgba(168,85,247,0.52)',
      label: '🔒 Bet IA Ativa', accent: '#a855f7', pulse: true,
    },
  };

  function createOverlay() {
    if (document.getElementById('__betia_overlay__')) return;

    const el = document.createElement('div');
    el.id = '__betia_overlay__';
    el.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      pointer-events: none;
      opacity: 0;
      transition: background 0.5s ease, opacity 0.35s ease, box-shadow 0.5s ease;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    `;

    el.innerHTML = `
      <div id="__betia_badge__" style="
        position:absolute; top:16px; left:50%; transform:translateX(-50%);
        background:rgba(0,0,0,0.68); border:1px solid rgba(255,255,255,0.12);
        backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px);
        border-radius:100px; padding:6px 18px;
        display:flex; align-items:center; gap:10px;
        opacity:0; transition:opacity 0.35s; white-space:nowrap;
        box-shadow:0 4px 20px rgba(0,0,0,0.35);
      ">
        <div id="__betia_dot__" style="width:7px;height:7px;border-radius:50%;flex-shrink:0;transition:background 0.3s;"></div>
        <span id="__betia_label__" style="color:#fff;font-size:10px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;"></span>
        <span id="__betia_countdown__" style="color:rgba(255,255,255,0.45);font-size:10px;font-weight:700;font-variant-numeric:tabular-nums;min-width:32px;text-align:right;"></span>
      </div>

      <div id="__betia_confidence__" style="
        position:absolute; bottom:20px; left:50%; transform:translateX(-50%);
        display:flex; align-items:center; gap:8px; opacity:0; transition:opacity 0.35s;
      ">
        <span style="color:rgba(255,255,255,0.35);font-size:8px;font-weight:800;letter-spacing:0.2em;text-transform:uppercase;">Confiança</span>
        <div style="width:72px;height:2px;background:rgba(255,255,255,0.1);border-radius:10px;overflow:hidden;">
          <div id="__betia_confbar__" style="height:100%;border-radius:10px;transition:width 0.5s ease;width:0%;"></div>
        </div>
        <span id="__betia_confpct__" style="color:rgba(255,255,255,0.45);font-size:8px;font-weight:800;font-variant-numeric:tabular-nums;">0%</span>
      </div>
    `;

    document.documentElement.appendChild(el);
    window.__BETIA.state.overlay = el;
  }

  function updateOverlay({ robotState, phase: _phase, countdown, confidence }) {
    const cfg = PHASE_CONFIG[robotState] || PHASE_CONFIG.IDLE;
    const el  = document.getElementById('__betia_overlay__');
    if (!el) return;

    if (robotState === 'IDLE') {
      // Suaviza: primeiro some o badge, depois o fundo
      const badge = document.getElementById('__betia_badge__');
      const conf  = document.getElementById('__betia_confidence__');
      if (badge) badge.style.opacity = '0';
      if (conf)  conf.style.opacity  = '0';
      setTimeout(() => {
        el.style.background = 'rgba(0,0,0,0)';
        el.style.boxShadow  = 'none';
        el.style.opacity    = '0';
      }, 80);
      stopPulse(el);
      return;
    }

    // Anel luminoso nas bordas — visível sem escurecer a banca
    el.style.background = cfg.bg;
    el.style.boxShadow  = `inset 0 0 0 3px ${cfg.border}`;
    el.style.opacity    = '1';
    el.style.pointerEvents = 'none'; // NUNCA bloqueia cliques — compliance

    if (cfg.pulse) startPulse(el, cfg.border);
    else stopPulse(el);

    const badge     = document.getElementById('__betia_badge__');
    const dot       = document.getElementById('__betia_dot__');
    const labelEl   = document.getElementById('__betia_label__');
    const cntdownEl = document.getElementById('__betia_countdown__');

    if (badge) {
      badge.style.opacity     = '1';
      badge.style.borderColor = `${cfg.accent}60`;
      badge.style.boxShadow   = `0 0 18px ${cfg.accent}28`;
    }
    if (dot) {
      dot.style.background = cfg.accent;
      dot.style.boxShadow  = `0 0 8px ${cfg.accent}`;
    }
    if (labelEl)   labelEl.textContent   = cfg.label;
    if (cntdownEl) cntdownEl.textContent = countdown != null ? `${parseFloat(countdown).toFixed(1)}s` : '';

    const confDiv = document.getElementById('__betia_confidence__');
    const confBar = document.getElementById('__betia_confbar__');
    const confPct = document.getElementById('__betia_confpct__');
    const showConf = confidence != null && !['IDLE', 'WAITING'].includes(robotState);

    if (confDiv) confDiv.style.opacity  = showConf ? '1' : '0';
    if (confBar) { confBar.style.width = `${confidence ?? 0}%`; confBar.style.background = cfg.accent; }
    if (confPct)  confPct.textContent  = `${Math.round(confidence ?? 0)}%`;
  }

  function removeOverlay() {
    const el = document.getElementById('__betia_overlay__');
    if (!el) return;
    stopPulse(el);
    el.style.opacity = '0';
    setTimeout(() => { el.remove(); window.__BETIA.state.overlay = null; }, 400);
  }

  function startPulse(el, borderColor) {
    if (el.__betia_pulse) return;
    let bright = false;
    el.__betia_pulse = setInterval(() => {
      bright = !bright;
      // Varia apenas a intensidade do anel, não o fundo
      const alpha = bright ? '0.80' : '0.35';
      const color = borderColor.replace(/[\d.]+\)$/, `${alpha})`);
      el.style.boxShadow = `inset 0 0 0 3px ${color}`;
    }, 750);
  }

  function stopPulse(el) {
    if (!el?.__betia_pulse) return;
    clearInterval(el.__betia_pulse);
    el.__betia_pulse = null;
  }

  window.__BETIA.overlay = {
    create: createOverlay,
    update: updateOverlay,
    remove: removeOverlay,
  };

  console.log('[Bet IA Overlay] Módulo compliance pronto.');
})();

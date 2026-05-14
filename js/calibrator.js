/**
 * BBCalibrator — modo "ensinar onde clicar"
 *
 * Quando o DOM da Evolution muda demais ou é canvas-only, o ChipDetector
 * falha em achar fichas/spots. Esse modulo deixa o operador CLICAR uma vez
 * em cada elemento e grava as coordenadas reais (clientX/clientY) em
 * localStorage. Apos isso, o Executor usa essas coordenadas via
 * chrome.debugger (HardwareAutomationEngine) — funciona mesmo com canvas.
 *
 * Uso no console (top frame da pagina BetBoom):
 *
 *   await BBCalibrator.tudo()      // fluxo guiado completo
 *
 * Ou item por item:
 *   await BBCalibrator.capturar('chip5')
 *   await BBCalibrator.capturar('player')
 *   await BBCalibrator.capturar('banker')
 *   await BBCalibrator.capturar('tie')
 *   await BBCalibrator.capturar('confirmar')
 *   BBCalibrator.exportar()        // mostra JSON salvo
 *   BBCalibrator.limpar()
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'BB_CALIBRATED_COORDS_v1';
  const PREFIX = '[BBCalibrator]';

  // Slots padrao que o sistema precisa
  const SLOTS_PADRAO = [
    { id: 'chip5',     label: 'Ficha de R$ 5 (ou a menor disponivel)' },
    { id: 'chip25',    label: 'Ficha de R$ 25 (opcional - aperte ESC para pular)' },
    { id: 'chip100',   label: 'Ficha de R$ 100 (opcional - aperte ESC para pular)' },
    { id: 'player',    label: 'Spot AZUL / PLAYER' },
    { id: 'banker',    label: 'Spot VERMELHO / BANKER' },
    { id: 'tie',       label: 'Spot VERDE / TIE (opcional - aperte ESC para pular)' },
    { id: 'confirmar', label: 'Botao CONFIRMAR APOSTA (se existir)' }
  ];

  function lerStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : { coords: {}, atualizadoEm: null };
    } catch (_) {
      return { coords: {}, atualizadoEm: null };
    }
  }

  function salvarStorage(data) {
    try {
      data.atualizadoEm = new Date().toISOString();
      data.url = window.location.href;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn(PREFIX, 'Falha ao salvar:', e.message);
    }
  }

  function flashHighlight(x, y) {
    try {
      const dot = document.createElement('div');
      dot.style.cssText = [
        'position:fixed', 'z-index:2147483647', 'pointer-events:none',
        `left:${x - 16}px`, `top:${y - 16}px`,
        'width:32px', 'height:32px', 'border-radius:50%',
        'background:rgba(34,197,94,0.4)',
        'border:3px solid #22c55e',
        'box-shadow:0 0 24px rgba(34,197,94,0.9)',
        'animation:bbCalibratorPulse 0.8s ease-out forwards'
      ].join(';');
      if (!document.getElementById('bb-calibrator-style')) {
        const s = document.createElement('style');
        s.id = 'bb-calibrator-style';
        s.textContent = '@keyframes bbCalibratorPulse{0%{transform:scale(0.4);opacity:1}100%{transform:scale(2.2);opacity:0}}';
        document.head.appendChild(s);
      }
      document.body.appendChild(dot);
      setTimeout(() => dot.remove(), 850);
    } catch (_) {}
  }

  function showBanner(texto, cor = '#1d4ed8') {
    const id = 'bb-calibrator-banner';
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement('div');
      el.id = id;
      el.style.cssText = [
        'position:fixed', 'top:0', 'left:0', 'right:0', 'z-index:2147483646',
        'padding:14px 20px', 'font:600 16px/1.4 -apple-system,Segoe UI,sans-serif',
        'color:#fff', 'text-align:center',
        'box-shadow:0 4px 16px rgba(0,0,0,0.3)',
        'pointer-events:none'
      ].join(';');
      document.body.appendChild(el);
    }
    el.style.background = cor;
    el.textContent = texto;
  }

  function hideBanner() {
    const el = document.getElementById('bb-calibrator-banner');
    if (el) el.remove();
  }

  /**
   * Captura UM clique do operador. Retorna { x, y, target } ou null se cancelado.
   */
  function capturarUmClique(label, timeoutMs = 30000) {
    return new Promise((resolve) => {
      showBanner(`👉 Clique em: ${label}  —  ESC para pular`, '#1d4ed8');

      let resolved = false;
      const cleanup = () => {
        document.removeEventListener('click', onClick, true);
        document.removeEventListener('keydown', onKey, true);
        hideBanner();
      };
      const onClick = (ev) => {
        if (resolved) return;
        resolved = true;
        ev.preventDefault();
        ev.stopPropagation();
        ev.stopImmediatePropagation();
        const x = ev.clientX;
        const y = ev.clientY;
        flashHighlight(x, y);
        cleanup();
        resolve({ x, y, target: ev.target ? ev.target.tagName : null });
      };
      const onKey = (ev) => {
        if (resolved) return;
        if (ev.key === 'Escape') {
          resolved = true;
          cleanup();
          resolve(null);
        }
      };
      document.addEventListener('click', onClick, true);
      document.addEventListener('keydown', onKey, true);

      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          cleanup();
          resolve(null);
        }
      }, timeoutMs);
    });
  }

  async function capturar(slotId, labelOverride) {
    const slot = SLOTS_PADRAO.find((s) => s.id === slotId);
    const label = labelOverride || (slot ? slot.label : slotId);
    console.log(`${PREFIX} aguardando clique para "${slotId}" — ${label}`);
    const ponto = await capturarUmClique(label);
    if (!ponto) {
      console.warn(`${PREFIX} cancelado para "${slotId}"`);
      return null;
    }
    const data = lerStorage();
    data.coords[slotId] = { x: ponto.x, y: ponto.y };
    salvarStorage(data);
    console.log(`${PREFIX} ✅ "${slotId}" salvo em (${ponto.x}, ${ponto.y})`);
    return data.coords[slotId];
  }

  async function tudo() {
    console.log(`${PREFIX} 🎯 Calibracao guiada iniciando — abra a mesa do Bac Bo com fichas visiveis.`);
    showBanner('🎯 CALIBRACAO INICIADA — siga as instrucoes', '#9333ea');
    await new Promise((r) => setTimeout(r, 1500));
    for (const slot of SLOTS_PADRAO) {
      await capturar(slot.id);
      await new Promise((r) => setTimeout(r, 400));
    }
    showBanner('✅ CALIBRACAO COMPLETA — use BBCalibrator.exportar() para conferir', '#16a34a');
    setTimeout(hideBanner, 4000);
    console.log(`${PREFIX} ✅ Calibracao completa. Coordenadas salvas:`, lerStorage().coords);
  }

  function exportar() {
    const data = lerStorage();
    console.group(`${PREFIX} 📋 Coordenadas calibradas`);
    console.log('Atualizado em:', data.atualizadoEm);
    console.log('URL:', data.url);
    console.table(data.coords);
    console.groupEnd();
    return data;
  }

  function limpar() {
    localStorage.removeItem(STORAGE_KEY);
    console.log(`${PREFIX} 🗑 Calibracao apagada.`);
  }

  function obter(slotId) {
    const data = lerStorage();
    return data.coords[slotId] || null;
  }

  function temCalibracao() {
    const data = lerStorage();
    return !!(data.coords && (data.coords.chip5 || data.coords.chip25) && data.coords.player && data.coords.banker);
  }

  /**
   * Dispara clique de HARDWARE via background.js (chrome.debugger)
   * nas coordenadas calibradas. Retorna Promise<boolean>.
   */
  function clicarHardware(slotId) {
    return new Promise((resolve) => {
      const c = obter(slotId);
      if (!c) {
        console.warn(`${PREFIX} sem coordenadas para "${slotId}"`);
        resolve(false);
        return;
      }
      if (typeof chrome === 'undefined' || !chrome.runtime) {
        console.warn(`${PREFIX} chrome.runtime indisponivel`);
        resolve(false);
        return;
      }
      try {
        chrome.runtime.sendMessage(
          { type: 'BB_EXECUTE_HARDWARE_CLICK', x: c.x, y: c.y, label: slotId },
          (resp) => {
            if (chrome.runtime.lastError) {
              console.warn(`${PREFIX} sendMessage falhou:`, chrome.runtime.lastError.message);
              resolve(false);
              return;
            }
            resolve(!!(resp && resp.ok));
          }
        );
      } catch (e) {
        console.warn(`${PREFIX} excecao:`, e.message);
        resolve(false);
      }
    });
  }

  /**
   * Sequencia de aposta usando coordenadas calibradas:
   *   1) clica na ficha apropriada
   *   2) aguarda chipDelayMs
   *   3) clica no spot (player/banker/tie)
   *   4) aguarda spotDelayMs
   *   5) (opcional) clica em confirmar
   */
  async function executarAposta(cor, stake = 5, opts = {}) {
    const chipDelayMs = opts.chipDelayMs || 350;
    const spotDelayMs = opts.spotDelayMs || 250;
    const clicarConfirmar = opts.clicarConfirmar !== false;

    // Escolha de ficha: prioridade pelo stake, com fallback pra menor
    const ordemFichas = stake >= 100 ? ['chip100', 'chip25', 'chip5']
                      : stake >= 25  ? ['chip25', 'chip5', 'chip100']
                      : ['chip5', 'chip25', 'chip100'];
    const fichaId = ordemFichas.find((id) => obter(id));
    if (!fichaId) {
      console.warn(`${PREFIX} nenhuma ficha calibrada. Rode BBCalibrator.tudo() primeiro.`);
      return { ok: false, motivo: 'sem-ficha-calibrada' };
    }

    const spotId = (cor === 'azul' || cor === 'player' || cor === 'A') ? 'player'
                 : (cor === 'vermelho' || cor === 'banker' || cor === 'V') ? 'banker'
                 : (cor === 'empate' || cor === 'tie' || cor === 'E') ? 'tie'
                 : null;
    if (!spotId || !obter(spotId)) {
      console.warn(`${PREFIX} spot "${cor}" sem coordenada calibrada.`);
      return { ok: false, motivo: `sem-spot-${cor}-calibrado` };
    }

    console.log(`${PREFIX} 🎲 Executando aposta: ${fichaId} -> ${spotId}${clicarConfirmar ? ' -> confirmar' : ''}`);

    const r1 = await clicarHardware(fichaId);
    await new Promise((r) => setTimeout(r, chipDelayMs));
    const r2 = await clicarHardware(spotId);

    let r3 = true;
    if (clicarConfirmar && obter('confirmar')) {
      await new Promise((r) => setTimeout(r, spotDelayMs));
      r3 = await clicarHardware('confirmar');
    }

    const ok = r1 && r2 && r3;
    console.log(`${PREFIX} ${ok ? '✅' : '❌'} aposta encerrada — ficha=${r1} spot=${r2} confirm=${r3}`);
    return { ok, fichaId, spotId, etapas: { chip: r1, spot: r2, confirmar: r3 } };
  }

  // Expor globalmente no top frame
  if (typeof window !== 'undefined') {
    window.BBCalibrator = {
      tudo,
      capturar,
      obter,
      exportar,
      limpar,
      temCalibracao,
      clicarHardware,
      executarAposta,
      SLOTS_PADRAO
    };
  }

  console.log(`${PREFIX} ✅ carregado. Use BBCalibrator.tudo() no console para calibrar.`);
})();

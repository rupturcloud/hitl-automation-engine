/**
 * BetBoom Chip Detector v2.0
 * ===========================
 * Detecção robusta de fichas (baseada em chips-classic).
 * Roda em content script (iframe Evolution).
 *
 * Responsabilidades:
 * - Encontrar ficha pelo valor (exato ou aproximado)
 * - Validar visibilidade (dim, visibility, opacity)
 * - Retry com backoff exponencial
 * - Cache de fichas encontradas por rodada
 * - Logging detalhado para debug
 */

const ChipDetector = (() => {
  const PREFIX = '[ChipDetector]';

  let chipCache = {};
  let lastRoundId = null;

  // Seletores em ordem de prioridade (Betia + Evolution Gaming)
  const CHIP_SELECTORS = [
    // Betia custom
    (valor) => `[data-betia-id="chip-${valor}"]`,
    // Evolution Gaming
    (valor) => `[data-automation-id="chip-${valor}"]`,
    // Data attributes
    (valor) => `[data-chip-value="${valor}"]`,
    (valor) => `[data-value="${valor}"]`,
    (valor) => `[data-amount="${valor}"]`,
    // Aria labels com número
    (valor) => `[aria-label*="${valor}"]`,
    // Buttons com value
    (valor) => `button[value="${valor}"]`,
    // Generic (sem valor específico)
    () => `[data-role="chip"]`,
    () => `[class*="chip" i]`,
    () => `button[class*="chip" i]`,
  ];

  /**
   * Valida se um elemento é visível
   */
  function isVisible(el) {
    if (!el?.getBoundingClientRect) return false;
    const rect = el.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return false;

    const style = window.getComputedStyle?.(el);
    if (!style) return false;

    return style.display !== 'none' && style.visibility !== 'hidden';
  }

  /**
   * Extrai número do texto de um elemento
   */
  function extractValue(el) {
    const text = `${el.textContent || ''} ${el.getAttribute('aria-label') || ''} ${el.getAttribute('data-value') || ''} ${el.className || ''}`.toLowerCase();
    return text;
  }

  /**
   * Encontra ficha por valor com regex flexível
   */
  function encontrarFichaPorValor(valor) {
    const normalized = String(Math.round(Number(valor)));

    // Coletar todos os candidatos visíveis
    const candidatos = [];

    for (const selectorFn of CHIP_SELECTORS.slice(0, 7)) {
      const sel = selectorFn(normalized);
      try {
        document.querySelectorAll(sel).forEach((el) => {
          if (isVisible(el) && !candidatos.includes(el)) {
            candidatos.push({ el, sel, priority: CHIP_SELECTORS.indexOf(selectorFn) });
          }
        });
      } catch (_) {}
    }

    // Seletores genéricos (sem valor)
    for (const selectorFn of CHIP_SELECTORS.slice(7)) {
      const sel = selectorFn();
      try {
        document.querySelectorAll(sel).forEach((el) => {
          if (isVisible(el) && !candidatos.find(c => c.el === el)) {
            candidatos.push({ el, sel, priority: 100 });
          }
        });
      } catch (_) {}
    }

    // Filtrar por matching de número (regex flexível)
    const numberRegex = new RegExp(`(?:^|[^0-9])0*${normalized}(?:[^0-9]|$)`);
    const matches = candidatos.filter((c) => {
      const text = extractValue(c.el);
      return numberRegex.test(text);
    });

    if (matches.length > 0) {
      // Ordenar por prioridade (seletores específicos primeiro)
      matches.sort((a, b) => a.priority - b.priority);
      const melhor = matches[0];
      return { el: melhor.el, sel: melhor.sel, valor: normalized };
    }

    return null;
  }

  /**
   * Fallback visual: procura por dimensões típicas de ficha
   */
  function encontrarFichaFallback() {
    const allButtons = Array.from(document.querySelectorAll('button, div[role="button"], [onclick]'));

    for (const el of allButtons) {
      if (!isVisible(el)) continue;

      const rect = el.getBoundingClientRect();
      const text = extractValue(el);

      // Heurísticas de ficha
      const isDimensionallyLikeChip = (
        rect.width >= 30 && rect.width <= 150 &&
        rect.height >= 30 && rect.height <= 150
      );

      const hasChipClass = /chip|token|stake|bet/i.test(el.className);
      const hasChipAttr = /chip|value|stake/i.test(el.getAttribute('data-role') || '');
      const hasNumber = /\d+/.test(text);

      if (isDimensionallyLikeChip || hasChipClass || hasChipAttr || hasNumber) {
        return { el, sel: `[fallback-visual: ${text.slice(0, 20)}]`, valor: 'desconhecido' };
      }
    }

    return null;
  }

  /**
   * Encontra ficha com retry e backoff
   */
  async function encontrarComRetry(valor, maxRetries = 4, baseDelay = 150) {
    const startTime = Date.now();

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const resultado = encontrarFichaPorValor(valor);
      if (resultado) {
        const duration = Date.now() - startTime;
        console.log(`${PREFIX} ✅ Ficha encontrada (tentativa ${attempt}): R$${resultado.valor} via ${resultado.sel} (${duration}ms)`);

        // Registrar telemetria
        if (typeof TelemetryCollector !== 'undefined') {
          TelemetryCollector.recordDetectionLatency(valor, duration, true);
        }

        return resultado;
      }

      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt - 1);
        console.log(`${PREFIX} ⏳ Tentativa ${attempt} falhou, aguardando ${delay}ms...`);
        await new Promise(r => setTimeout(r, delay));
      }
    }

    // Última tentativa: fallback visual
    const fallback = encontrarFichaFallback();
    const duration = Date.now() - startTime;

    if (fallback) {
      console.log(`${PREFIX} ⚠️ Usando fallback visual após ${maxRetries} tentativas (${duration}ms)`);

      // Registrar telemetria com fallback
      if (typeof TelemetryCollector !== 'undefined') {
        TelemetryCollector.recordDetectionLatency(valor, duration, true);
      }

      return fallback;
    }

    console.warn(`${PREFIX} ❌ Ficha não encontrada após ${maxRetries} tentativas + fallback (${duration}ms)`);

    // Registrar falha de detecção
    if (typeof TelemetryCollector !== 'undefined') {
      TelemetryCollector.recordDetectionLatency(valor, duration, false);
    }

    return null;
  }

  /**
   * Limpar cache quando rodada muda (idempotência)
   */
  function onNovaRodada(roundId) {
    if (roundId !== lastRoundId) {
      lastRoundId = roundId;
      chipCache = {};
      console.log(`${PREFIX} Cache limpo para rodada ${roundId}`);
    }
  }

  // Public API
  return {
    /**
     * Encontra ficha para um valor (sincronous, sem retry)
     */
    encontrar(valor) {
      return encontrarFichaPorValor(valor);
    },

    /**
     * Encontra ficha com retry automático (asynchronous)
     */
    async encontrarComRetry(valor, maxRetries = 4, baseDelay = 150) {
      return encontrarComRetry(valor, maxRetries, baseDelay);
    },

    /**
     * Fallback visual quando nada funciona
     */
    encontrarFallback() {
      return encontrarFichaFallback();
    },

    /**
     * Notificar sobre mudança de rodada
     */
    onNovaRodada(roundId) {
      onNovaRodada(roundId);
    },

    /**
     * Validar visibilidade de elemento
     */
    isVisible(el) {
      return isVisible(el);
    },

    /**
     * Teste: listar todas as fichas encontradas
     */
    diagnosticar() {
      const resultado = {
        fichasExatas: {},
        fichasGenéricas: [],
        fallback: null,
        timestamp: new Date().toISOString()
      };

      // Procurar fichas exatas
      for (const valor of [5, 10, 25, 50, 100, 500]) {
        const chip = encontrarFichaPorValor(valor);
        if (chip) resultado.fichasExatas[valor] = chip.sel;
      }

      // Procurar fichas genéricas
      try {
        document.querySelectorAll('[data-role="chip"], [class*="chip" i]').forEach((el) => {
          if (isVisible(el)) {
            resultado.fichasGenéricas.push({
              texto: extractValue(el).slice(0, 40),
              seletor: `${el.tagName}.${el.className.split(' ').join('.')}`
            });
          }
        });
      } catch (_) {}

      resultado.fallback = encontrarFichaFallback();

      console.group(`${PREFIX} 🔍 Diagnóstico de Fichas`);
      console.log('Fichas exatas:', resultado.fichasExatas);
      console.log('Fichas genéricas:', resultado.fichasGenéricas);
      console.log('Fallback:', resultado.fallback);
      console.groupEnd();

      return resultado;
    }
  };
})();

// Expor globalmente
if (typeof window !== 'undefined') {
  window.ChipDetector = ChipDetector;
  console.log('[ChipDetector] ✅ Módulo carregado');
}

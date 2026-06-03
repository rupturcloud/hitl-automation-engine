/**
 * InstanceFusionService — doutrina Anduril aplicada a instâncias WhatsApp.
 *
 * Combina sinais de múltiplos sensores com decaimento temporal (weighted voting).
 * Substitui o modelo de sensor único (/instance/status poll) por estado fundido
 * com confidence score explícito.
 *
 * Sensores suportados:
 *   S1: http_poll      — GET /instance/status (peso 0.3)
 *   S2: sse_event      — SSE stream UAZAPI (peso 0.5)
 *   S3: webhook_push   — eventos push do UAZAPI (peso 0.5)
 *   S4: state_cache    — last known state do Supabase metadata (peso 0.1)
 *   S5: heartbeat      — probe de envio real (peso 0.4)
 *
 * Adaptive tracking:
 *   confidence > 0.8 → STABLE   (poll 60s)
 *   confidence 0.6–0.8 → WATCH  (poll 15s)
 *   confidence < 0.6 → UNCERTAIN (poll 5s + todos sensores)
 *   token expirado/gone → LOST   (stop poll + HITL)
 */

export const SENSOR_WEIGHTS = {
  http_poll:    0.3,
  sse_event:    0.5,
  webhook_push: 0.5,
  state_cache:  0.1,
  heartbeat:    0.4,
};

export const TRACKING_MODES = {
  STABLE:    { pollIntervalMs: 60_000, label: 'stable' },
  WATCH:     { pollIntervalMs: 15_000, label: 'watch' },
  UNCERTAIN: { pollIntervalMs: 5_000,  label: 'uncertain' },
  LOST:      { pollIntervalMs: null,   label: 'lost' },
};

export const CONFIDENCE_THRESHOLDS = {
  STABLE:    0.8,
  WATCH:     0.6,
  HITL:      0.6,  // abaixo disso → surface para usuário
};

// Decaimento temporal: sinal de 5min tem 80% do peso original
const DECAY_HALF_LIFE_MS = 5 * 60 * 1000;

function temporalDecay(ageMs) {
  return Math.exp(-Math.LN2 * ageMs / DECAY_HALF_LIFE_MS);
}

export class InstanceFusionService {
  /**
   * @param {{ repository?: object }} opts — repository é opcional.
   * Para o singleton de processo use fusionBus (exportado abaixo) sem repository;
   * passe o repo como parâmetro em persistFusedState().
   */
  constructor({ repository } = {}) {
    this.repo = repository || null;
    // Map: instanceId → Signal[]
    this._signals = new Map();
  }

  /**
   * Injeta um novo sinal de qualquer sensor.
   * @param {string} instanceId
   * @param {{ source: string, state: 'connected'|'disconnected'|'connecting', confidence?: number }} signal
   */
  injectSignal(instanceId, { source, state, confidence = 1.0 }) {
    if (!this._signals.has(instanceId)) {
      this._signals.set(instanceId, []);
    }
    const signals = this._signals.get(instanceId);
    signals.push({ source, state, confidence, timestamp: Date.now() });
    // Manter apenas os últimos 20 sinais por instância
    if (signals.length > 20) signals.splice(0, signals.length - 20);
  }

  /**
   * Computa o estado fundido de uma instância.
   * @param {string} instanceId
   * @returns {{ state: string, confidence: number, trackingMode: string, signals: number }}
   */
  computeState(instanceId) {
    const signals = this._signals.get(instanceId) || [];
    if (signals.length === 0) {
      return { state: 'unknown', confidence: 0, trackingMode: 'LOST', signals: 0 };
    }

    const now = Date.now();
    let connectedWeight = 0;
    let disconnectedWeight = 0;
    let totalWeight = 0;

    for (const sig of signals) {
      const ageMs = now - sig.timestamp;
      const weight = (SENSOR_WEIGHTS[sig.source] || 0.2) * sig.confidence * temporalDecay(ageMs);
      if (sig.state === 'connected') connectedWeight += weight;
      else if (sig.state === 'disconnected') disconnectedWeight += weight;
      totalWeight += weight;
    }

    if (totalWeight === 0) {
      return { state: 'unknown', confidence: 0, trackingMode: 'LOST', signals: signals.length };
    }

    // Estado dominante: qual grupo tem mais peso decaído
    const dominantState = connectedWeight >= disconnectedWeight ? 'connected' : 'disconnected';
    // Confidence: soma total dos pesos (capped em 1.0) — reflete quantidade de evidência
    // Não normaliza pelo total para que decaimento temporal reduza confidence naturalmente
    const confidence = Math.min(totalWeight, 1.0);

    let trackingMode;
    if (confidence >= CONFIDENCE_THRESHOLDS.STABLE) trackingMode = 'STABLE';
    else if (confidence >= CONFIDENCE_THRESHOLDS.WATCH) trackingMode = 'WATCH';
    else trackingMode = 'UNCERTAIN';

    return {
      state: dominantState,
      confidence: Math.round(confidence * 100) / 100,
      trackingMode,
      signals: signals.length,
      needsHITL: confidence < CONFIDENCE_THRESHOLDS.HITL,
    };
  }

  /**
   * Persiste o estado fundido no metadata da instância (S4 — state cache).
   * @param {string} instanceId
   * @param {object} fusedState
   * @param {object} [repoOverride] — repository a usar (prevalece sobre this.repo).
   *   Obrigatório quando usando o singleton fusionBus (que não tem repo próprio).
   */
  async persistFusedState(instanceId, fusedState, repoOverride = null) {
    const repo = repoOverride || this.repo;
    try {
      await repo.mergeMetadata({
        id: instanceId,
        patch: {
          fusedState: {
            ...fusedState,
            computedAt: new Date().toISOString(),
          },
        },
      });
    } catch (e) {
      console.warn('[fusion.service] persist failed (non-fatal):', e?.message);
    }
  }

  /**
   * Carrega o estado cacheado do banco como sinal S4 inicial.
   * Chamado na inicialização para não começar "cego".
   * @param {string} instanceId
   * @param {object} cachedState — { state, confidence, computedAt }
   */
  loadCachedSignal(instanceId, cachedState) {
    if (!cachedState?.state) return;
    const ageMs = cachedState.computedAt
      ? Date.now() - new Date(cachedState.computedAt).getTime()
      : DECAY_HALF_LIFE_MS * 3; // muito antigo → peso baixo

    this.injectSignal(instanceId, {
      source: 'state_cache',
      state: cachedState.state,
      confidence: cachedState.confidence ?? 0.5,
    });
  }

  /**
   * Retorna o intervalo de polling adaptativo para uma instância.
   * @param {string} instanceId
   * @returns {number|null} ms, ou null se LOST
   */
  getPollInterval(instanceId) {
    const { trackingMode } = this.computeState(instanceId);
    return TRACKING_MODES[trackingMode]?.pollIntervalMs ?? null;
  }
}

/**
 * Singleton de processo — compartilhado entre todas as requests.
 * O Map de sinais persiste enquanto o processo Node estiver em pé.
 * repository não é passado aqui; passe-o em persistFusedState(id, state, repo).
 */
export const fusionBus = new InstanceFusionService();

export default InstanceFusionService;

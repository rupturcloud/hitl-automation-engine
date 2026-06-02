/**
 * Rate limiter por tenant_id — complementa o rate limiter por IP.
 *
 * Limites por plano (requests/minuto):
 *   trial:    60  (1/seg)
 *   starter:  300 (5/seg)
 *   pro:      600 (10/seg)
 *   business: 1200 (20/seg)
 *   custom:   Infinity (sem limite — tenants como ruptur-os)
 *
 * Implementação: sliding window em memória (Map).
 * Sem Redis — zero dependências externas.
 */

const WINDOW_MS = 60_000; // 1 minuto

/** @type {Record<string, number>} */
const PLAN_LIMITS = {
  trial:    60,
  starter:  300,
  pro:      600,
  business: 1200,
  custom:   Infinity,
};

/** @type {Map<string, { timestamps: number[] }>} */
const _store = new Map();

// Cleanup automático a cada 5 minutos para evitar memory leak
setInterval(() => {
  const cutoff = Date.now() - WINDOW_MS;
  for (const [key, record] of _store) {
    // Remove registros sem timestamps na janela ativa
    if (record.timestamps.length === 0 || record.timestamps[record.timestamps.length - 1] < cutoff) {
      _store.delete(key);
    }
  }
}, 300_000).unref?.(); // .unref() evita que o timer impeça o processo de encerrar

/**
 * Retorna o limite de requests/min para o plano dado.
 * Planos desconhecidos recebem o limite mais restritivo (trial).
 * @param {string} plan
 * @returns {number}
 */
function limitForPlan(plan) {
  return PLAN_LIMITS[plan] ?? PLAN_LIMITS.trial;
}

/**
 * Registra e avalia uma requisição do tenant.
 *
 * @param {string} tenantId
 * @param {string} [plan='trial']
 * @returns {{ allowed: boolean, remaining: number, resetAt: Date, limit: number }}
 */
function rateLimitTenant(tenantId, plan = 'trial') {
  const limit = limitForPlan(plan);

  // Planos custom: sempre permitido, sem registrar no store
  if (limit === Infinity) {
    return { allowed: true, remaining: Infinity, resetAt: new Date(0), limit: Infinity };
  }

  const now = Date.now();
  const cutoff = now - WINDOW_MS;

  let record = _store.get(tenantId);
  if (!record) {
    record = { timestamps: [] };
    _store.set(tenantId, record);
  }

  // Descarta timestamps fora da janela deslizante
  record.timestamps = record.timestamps.filter(ts => ts > cutoff);

  const count = record.timestamps.length;

  if (count >= limit) {
    // Próximo reset: quando o timestamp mais antigo sair da janela
    const resetAt = new Date(record.timestamps[0] + WINDOW_MS);
    return { allowed: false, remaining: 0, resetAt, limit };
  }

  record.timestamps.push(now);
  return {
    allowed: true,
    remaining: limit - record.timestamps.length,
    resetAt: new Date(now + WINDOW_MS),
    limit,
  };
}

/**
 * Gera os headers HTTP padrão de rate limit.
 *
 * @param {string} tenantId
 * @param {string} [plan='trial']
 * @returns {Record<string, string>}
 */
function getRateLimitHeaders(tenantId, plan = 'trial') {
  const result = rateLimitTenant(tenantId, plan);
  return {
    'X-RateLimit-Limit':     String(result.limit === Infinity ? 'unlimited' : result.limit),
    'X-RateLimit-Remaining': String(result.remaining === Infinity ? 'unlimited' : result.remaining),
    'X-RateLimit-Reset':     result.limit === Infinity ? '0' : String(Math.floor(result.resetAt.getTime() / 1000)),
  };
}

/**
 * Rotas isentas de rate limit por tenant.
 * Verificar no gateway ANTES de chamar rateLimitTenant.
 */
const EXEMPT_PREFIXES = [
  '/api/health',
  '/api/webhooks/',
  '/api/inbox/sse/',
];

/**
 * Retorna true se a rota é isenta de rate limit por tenant.
 * @param {string} pathname
 * @returns {boolean}
 */
function isExemptRoute(pathname) {
  return EXEMPT_PREFIXES.some(prefix => pathname === prefix || pathname.startsWith(prefix));
}

export { rateLimitTenant, getRateLimitHeaders, isExemptRoute, PLAN_LIMITS, WINDOW_MS };

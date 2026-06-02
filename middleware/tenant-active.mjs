/**
 * tenant-active.mjs — Verifica se o tenant está ativo em cada request autenticada.
 *
 * Problema que resolve:
 *   Quando um tenant é suspenso via PATCH /api/admin/platform/tenants/:id,
 *   os JWTs existentes continuam válidos por horas. Sem esta verificação,
 *   usuários de tenants suspensos continuam usando a API.
 *
 * Implementação:
 *   Cache em Map com TTL de 60s — evita DB hit em cada request sem sacrificar
 *   reatividade (máximo 60s de lag ao suspender um tenant).
 *
 * Falha aberta (fail-open):
 *   Se o Supabase estiver indisponível, permite a request para evitar
 *   interrupção de serviço por falha de infraestrutura.
 *
 * Uso:
 *   import { assertTenantActive, invalidateTenantStatusCache } from '../middleware/tenant-active.mjs';
 *
 *   // Em extractAndValidateTenantId, após validar membership:
 *   const { error: statusError } = await assertTenantActive(supabase, tenantId);
 *   if (statusError) return null; // 403 será retornado pelo caller
 *
 *   // Após suspender um tenant, invalidar o cache:
 *   invalidateTenantStatusCache(tenantId);
 */

const _cache = new Map();
const CACHE_TTL_MS = 60_000; // 60 segundos

/** Status que bloqueiam acesso completamente */
const BLOCKED = new Set(['suspended', 'cancelled']);

/** Status que permitem acesso normal */
const ALLOWED = new Set(['active', 'pending']);

/**
 * Verifica se o tenant está ativo.
 * @returns {{ tenant: object|null, error: string|null }}
 *   error !== null → bloquear a request com 403
 *   error === null → permitir
 */
export async function assertTenantActive(supabase, tenantId) {
  if (!tenantId) return { tenant: null, error: 'tenantId ausente' };

  // Verificar cache
  const cached = _cache.get(tenantId);
  if (cached && cached.expiresAt > Date.now()) {
    if (BLOCKED.has(cached.status)) {
      return { tenant: null, error: `Tenant bloqueado (status: ${cached.status})` };
    }
    return { tenant: { id: tenantId, status: cached.status }, error: null };
  }

  try {
    const { data: tenant, error: dbError } = await supabase
      .from('tenants')
      .select('id, status')
      .eq('id', tenantId)
      .single();

    if (dbError || !tenant) {
      // Tenant não encontrado — bloquear
      return { tenant: null, error: 'Tenant não encontrado' };
    }

    // Atualizar cache
    _cache.set(tenantId, {
      status: tenant.status,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });

    if (BLOCKED.has(tenant.status)) {
      console.warn(`[TenantActive] Acesso bloqueado: tenant=${tenantId} status=${tenant.status}`);
      return { tenant: null, error: `Tenant com acesso bloqueado (status: ${tenant.status})` };
    }

    if (!ALLOWED.has(tenant.status)) {
      // Status desconhecido — logar mas permitir (fail-open)
      console.warn(`[TenantActive] Status desconhecido '${tenant.status}' para tenant ${tenantId}`);
    }

    return { tenant, error: null };
  } catch (err) {
    // Supabase indisponível — fail-open para não interromper serviço
    console.error(`[TenantActive] Erro ao verificar tenant ${tenantId}: ${err.message}`);
    return { tenant: null, error: null }; // null = permitir
  }
}

/**
 * Invalida o cache de um tenant específico.
 * Chamar imediatamente após suspender/reativar um tenant via PATCH.
 */
export function invalidateTenantStatusCache(tenantId) {
  if (tenantId) {
    _cache.delete(tenantId);
    console.info(`[TenantActive] Cache invalidado: tenant=${tenantId}`);
  }
}

/** Limpar entradas expiradas (chamar periodicamente se o Map crescer muito) */
export function pruneCache() {
  const now = Date.now();
  for (const [key, entry] of _cache) {
    if (entry.expiresAt <= now) _cache.delete(key);
  }
}

/** Stats para health check / debug */
export function getTenantCacheStats() {
  const now = Date.now();
  let active = 0, expired = 0;
  for (const [, entry] of _cache) {
    if (entry.expiresAt > now) active++; else expired++;
  }
  return { total: _cache.size, active, expired };
}

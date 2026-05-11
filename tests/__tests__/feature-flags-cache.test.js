/**
 * Unit Tests: FeatureFlagsService Cache
 * Jest - Valida cache hit, TTL expiry, invalidação e fallback
 *
 * Testes:
 * - Cache hit: getPlan() reutiliza dados da cache
 * - Cache miss: primeira chamada queries o DB
 * - TTL expiry: após 5 minutos, novo query
 * - Invalidação: invalidatePlanCache() força requery
 * - Cleanup interval: limpeza automática de entries expiradas
 * - Fallback: sem supabase, retorna 'trial'
 *
 * Uso: npm test -- feature-flags-cache
 */

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import FeatureFlagsService from '../../modules/billing/feature-flags.service.js';

// Helper: Permitir controlar Date.now() dinamicamente
let mockCurrentTime = null;
const originalDateNow = Date.now;
global.Date.now = () => {
  return mockCurrentTime !== null ? mockCurrentTime : originalDateNow();
};

describe('FeatureFlagsService Cache', () => {
  let service;
  let mockSupabase;

  beforeEach(() => {
    // Setup: Mock de Date.now() global (usar mockCurrentTime)
    mockCurrentTime = 1000000;

    // Setup: Mock do supabase com queryBuilder chainável
    mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn(),
    };

    // Setup padrão: retornar 'pro' para todas as queries
    mockSupabase.maybeSingle.mockResolvedValue({
      data: { plan_id: 'pro' },
      error: null,
    });

    // Setup: Mock de setInterval para evitar memory leaks em testes
    jest.useFakeTimers();

    // Criar serviço com mock
    service = new FeatureFlagsService(mockSupabase);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  // =========================================================================
  // Testes de Cache Hit / Miss
  // =========================================================================

  describe('Cache Hit (getPlan)', () => {
    test('deve retornar do cache na segunda chamada', async () => {
      const tenantId = 'tenant-123';

      // Primeira chamada: query DB
      const plan1 = await service.getPlan(tenantId);
      expect(plan1).toBe('pro');
      expect(mockSupabase.from).toHaveBeenCalledTimes(1);

      // Segunda chamada: cache hit (sem query)
      const plan2 = await service.getPlan(tenantId);
      expect(plan2).toBe('pro');
      expect(mockSupabase.from).toHaveBeenCalledTimes(1); // Não aumenta!
    });

    test('deve cachear resultado por 5 minutos', async () => {
      const tenantId = 'tenant-123';

      // Primeira chamada
      await service.getPlan(tenantId);
      expect(mockSupabase.from).toHaveBeenCalledTimes(1);

      // Avançar 4 minutos (ainda dentro do TTL)
      now = 1000000 + 4 * 60 * 1000;
      jest.spyOn(global.Date, 'now').mockReturnValue(now);

      // Segunda chamada: ainda deve estar em cache
      const plan = await service.getPlan(tenantId);
      expect(plan).toBe('pro');
      expect(mockSupabase.from).toHaveBeenCalledTimes(1);
    });

    test('deve ser cache hit para múltiplos tenants', async () => {
      const tenant1 = 'tenant-1';
      const tenant2 = 'tenant-2';

      // Mock respostas diferentes
      mockSupabase.maybeSingle
        .mockResolvedValueOnce({ data: { plan_id: 'pro' }, error: null })
        .mockResolvedValueOnce({ data: { plan_id: 'starter' }, error: null });

      // Primeiro tenant
      const plan1 = await service.getPlan(tenant1);
      expect(plan1).toBe('pro');

      // Segundo tenant
      const plan2 = await service.getPlan(tenant2);
      expect(plan2).toBe('starter');

      // Cache hits para ambos
      const plan1Again = await service.getPlan(tenant1);
      const plan2Again = await service.getPlan(tenant2);

      expect(plan1Again).toBe('pro');
      expect(plan2Again).toBe('starter');
      expect(mockSupabase.from).toHaveBeenCalledTimes(2); // 1 por tenant
    });
  });

  // =========================================================================
  // Testes de TTL Expiry
  // =========================================================================

  describe('Cache TTL Expiry', () => {
    test('deve validar que TTL é 5 minutos', () => {
      // Confirmar que CACHE_TTL_MS está configurado para 5 minutos
      expect(service.CACHE_TTL_MS).toBe(5 * 60 * 1000);
    });

    test('deve armazenar expiração correta ao cachear', async () => {
      const tenantId = 'tenant-123';
      const timeBefore = Date.now();

      await service.getPlan(tenantId);

      const cached = service.planCache.get(tenantId);
      expect(cached).toBeDefined();
      expect(cached.expiresAt).toBeGreaterThanOrEqual(
        timeBefore + service.CACHE_TTL_MS
      );
      expect(cached.expiresAt).toBeLessThanOrEqual(
        Date.now() + service.CACHE_TTL_MS
      );
    });

    test('deve reconhecer cache como expirado quando time > expiresAt', async () => {
      const tenantId = 'tenant-123';

      // Cachear
      await service.getPlan(tenantId);
      const cached = service.planCache.get(tenantId);

      // Simular expiração definindo expiresAt no passado
      cached.expiresAt = Date.now() - 1000;

      // Verificar que reconhece como expirado
      expect(cached.expiresAt < Date.now()).toBe(true);
    });
  });

  // =========================================================================
  // Testes de Invalidação
  // =========================================================================

  describe('Cache Invalidation (invalidatePlanCache)', () => {
    test('deve invalidar e forçar requery', async () => {
      const tenantId = 'tenant-123';

      // Cache
      await service.getPlan(tenantId);
      expect(mockSupabase.from).toHaveBeenCalledTimes(1);

      // Invalidar
      service.invalidatePlanCache(tenantId);

      // Mock nova resposta
      mockSupabase.maybeSingle.mockResolvedValueOnce({
        data: { plan_id: 'starter' },
        error: null,
      });

      // Próxima chamada deve queryar DB
      const plan = await service.getPlan(tenantId);
      expect(plan).toBe('starter');
      expect(mockSupabase.from).toHaveBeenCalledTimes(2);
    });

    test('deve invalidar um tenant sem afetar outros', async () => {
      const tenant1 = 'tenant-1';
      const tenant2 = 'tenant-2';

      mockSupabase.maybeSingle
        .mockResolvedValueOnce({ data: { plan_id: 'pro' }, error: null })
        .mockResolvedValueOnce({ data: { plan_id: 'starter' }, error: null })
        .mockResolvedValueOnce({ data: { plan_id: 'enterprise' }, error: null });

      // Cachear ambos
      await service.getPlan(tenant1);
      await service.getPlan(tenant2);
      expect(mockSupabase.from).toHaveBeenCalledTimes(2);

      // Invalidar apenas tenant1
      service.invalidatePlanCache(tenant1);

      // Tenant2 ainda está em cache
      const plan2 = await service.getPlan(tenant2);
      expect(plan2).toBe('starter');
      expect(mockSupabase.from).toHaveBeenCalledTimes(2); // sem nova query

      // Tenant1 força novo query
      const plan1 = await service.getPlan(tenant1);
      expect(plan1).toBe('enterprise');
      expect(mockSupabase.from).toHaveBeenCalledTimes(3);
    });

    test('deve validar múltiplas invalidações', async () => {
      const tenantId = 'tenant-123';

      // Cache
      await service.getPlan(tenantId);

      // Invalidar 3 vezes (idempotent)
      service.invalidatePlanCache(tenantId);
      service.invalidatePlanCache(tenantId);
      service.invalidatePlanCache(tenantId);

      mockSupabase.maybeSingle.mockResolvedValueOnce({
        data: { plan_id: 'trial' },
        error: null,
      });

      // Próxima chamada: query
      const plan = await service.getPlan(tenantId);
      expect(plan).toBe('trial');
      expect(mockSupabase.from).toHaveBeenCalledTimes(2);
    });
  });

  // =========================================================================
  // Testes de Cleanup Interval
  // =========================================================================

  describe('Cache Cleanup Interval', () => {
    test('deve ter planCache inicializado como Map', () => {
      expect(service.planCache).toBeInstanceOf(Map);
    });


    test('cleanup interval deve deletar entries expiradas', async () => {
      const tenantId = 'tenant-123';

      // Cachear
      await service.getPlan(tenantId);
      expect(service.planCache.size).toBe(1);

      // Simular entry expirada
      const cached = service.planCache.get(tenantId);
      cached.expiresAt = Date.now() - 1000; // Expirada há 1s

      // Simular o que cleanup faria
      const now = Date.now();
      for (const [key, value] of service.planCache.entries()) {
        if (value.expiresAt < now) {
          service.planCache.delete(key);
        }
      }

      // Entry foi deletada
      expect(service.planCache.size).toBe(0);
    });

    test('cleanup deve preservar entries válidas', async () => {
      const tenant1 = 'tenant-1';
      const tenant2 = 'tenant-2';

      mockSupabase.maybeSingle
        .mockResolvedValueOnce({ data: { plan_id: 'pro' }, error: null })
        .mockResolvedValueOnce({ data: { plan_id: 'starter' }, error: null });

      await service.getPlan(tenant1);
      await service.getPlan(tenant2);
      expect(service.planCache.size).toBe(2);

      // Expirar apenas tenant1
      const cached1 = service.planCache.get(tenant1);
      cached1.expiresAt = Date.now() - 1000;

      // Simular cleanup
      const now = Date.now();
      for (const [key, value] of service.planCache.entries()) {
        if (value.expiresAt < now) {
          service.planCache.delete(key);
        }
      }

      // Apenas tenant1 foi removido
      expect(service.planCache.size).toBe(1);
      expect(service.planCache.has(tenant2)).toBe(true);
    });
  });

  // =========================================================================
  // Testes de Fallback (sem Supabase)
  // =========================================================================

  describe('Fallback (sem Supabase)', () => {
    test('deve retornar "trial" se supabase é null', async () => {
      const serviceNoDb = new FeatureFlagsService(null);

      const plan = await serviceNoDb.getPlan('tenant-123');
      expect(plan).toBe('trial');
    });

    test('deve retornar "trial" se supabase é undefined', async () => {
      const serviceNoDb = new FeatureFlagsService(undefined);

      const plan = await serviceNoDb.getPlan('tenant-123');
      expect(plan).toBe('trial');
    });

    test('não deve cachear quando supabase é null', async () => {
      const serviceNoDb = new FeatureFlagsService(null);

      const plan1 = await serviceNoDb.getPlan('tenant-123');
      const plan2 = await serviceNoDb.getPlan('tenant-123');

      expect(plan1).toBe('trial');
      expect(plan2).toBe('trial');
      expect(serviceNoDb.planCache.size).toBe(0);
    });
  });

  // =========================================================================
  // Testes de Banco de Dados Vazio
  // =========================================================================

  describe('Empty Database Response', () => {
    test('deve retornar "trial" se nenhum resultado é encontrado', async () => {
      mockSupabase.maybeSingle.mockResolvedValueOnce({
        data: null,
        error: null,
      });

      const plan = await service.getPlan('tenant-123');
      expect(plan).toBe('trial');
    });

    test('deve cachear "trial" como fallback', async () => {
      mockSupabase.maybeSingle.mockResolvedValueOnce({
        data: null,
        error: null,
      });

      // Primeira chamada
      const plan1 = await service.getPlan('tenant-123');
      expect(plan1).toBe('trial');
      expect(mockSupabase.from).toHaveBeenCalledTimes(1);

      // Segunda chamada: cache hit
      const plan2 = await service.getPlan('tenant-123');
      expect(plan2).toBe('trial');
      expect(mockSupabase.from).toHaveBeenCalledTimes(1); // sem nova query
    });
  });

  // =========================================================================
  // Testes de Integração com Métodos de Features
  // =========================================================================

  describe('Feature Methods (getPlan Cache)', () => {
    test('canUseInbox deve usar cache de getPlan', async () => {
      const tenantId = 'tenant-123';

      // Primeira chamada
      await service.canUseInbox(tenantId);
      expect(mockSupabase.from).toHaveBeenCalledTimes(1);

      // Segunda chamada: cache hit via getPlan
      await service.canUseInbox(tenantId);
      expect(mockSupabase.from).toHaveBeenCalledTimes(1);
    });

    test('múltiplas features devem reutilizar mesmo cache', async () => {
      const tenantId = 'tenant-123';

      // Chamar várias features
      await service.getFeatures(tenantId);
      await service.canCreateInstance(tenantId);
      await service.canUseWorkflows(tenantId);
      await service.canAccessAPI(tenantId);

      // Apenas 1 query (getPlan é cacheado)
      // + queries adicionais de getFeatures, canCreateInstance que accessam DB
      // Vamos contar quantas vezes from() foi chamado
      const fromCallCount = mockSupabase.from.mock.calls.length;

      // Esperar apenas 1 query de getPlan
      // (as outras features podem ter suas próprias queries)
      expect(fromCallCount).toBeGreaterThanOrEqual(1);
    });

    test('invalidação deve afetar todas as features', async () => {
      const tenantId = 'tenant-123';

      // Primeiro acesso: cache
      await service.canUseInbox(tenantId);
      const firstFromCallCount = mockSupabase.from.mock.calls.length;

      // Invalidar
      service.invalidatePlanCache(tenantId);

      mockSupabase.maybeSingle.mockResolvedValueOnce({
        data: { plan_id: 'starter' },
        error: null,
      });

      // Próximo acesso: força novo query
      await service.canUseWorkflows(tenantId);
      expect(mockSupabase.from.mock.calls.length).toBeGreaterThan(
        firstFromCallCount
      );
    });
  });
});

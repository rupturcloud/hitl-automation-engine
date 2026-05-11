import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { AnalyticsService } from '../../modules/billing/analytics.service.js';

describe('AnalyticsService', () => {
  let service;
  let mockSupabase;

  beforeEach(() => {
    mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null }),
      order: jest.fn().mockReturnThis(),
      range: jest.fn().mockReturnThis(),
    };
    service = new AnalyticsService(mockSupabase);
  });

  describe('track()', () => {
    it('deve rastrear evento válido', async () => {
      mockSupabase.insert.mockReturnThis();
      mockSupabase.select.mockResolvedValue({ data: [{ id: 1 }], error: null });

      const result = await service.track('signup', { tenantId: 'tenant-123' });

      expect(mockSupabase.insert).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.id).toBe(1);
    });

    it('deve rejeitar evento inválido', async () => {
      await expect(
        service.track('invalid_event', { tenantId: 'tenant-123' })
      ).rejects.toThrow('Tipo de evento inválido');
    });

    it('deve rejeitar se tenantId falta', async () => {
      await expect(
        service.track('signup', {})
      ).rejects.toThrow('tenantId é obrigatório');
    });

    it('deve validar amount >= 0 para checkout_complete', async () => {
      await expect(
        service.track('checkout_complete', {
          tenantId: 'tenant-123',
          amount: -5000,
        })
      ).rejects.toThrow('Amount deve ser >= 0');
    });

    it('deve validar amount >= 0 para upgrade', async () => {
      await expect(
        service.track('upgrade', {
          tenantId: 'tenant-123',
          amount: -1000,
        })
      ).rejects.toThrow('Amount deve ser >= 0');
    });

    it('deve validar que amount é number', async () => {
      await expect(
        service.track('checkout_complete', {
          tenantId: 'tenant-123',
          amount: 'not-a-number',
        })
      ).rejects.toThrow('Amount deve ser >= 0');
    });

    it('deve aceitar amount = 0', async () => {
      mockSupabase.insert.mockReturnThis();
      mockSupabase.select.mockResolvedValue({ data: [{ id: 1 }], error: null });

      const result = await service.track('checkout_complete', {
        tenantId: 'tenant-123',
        amount: 0,
      });

      expect(result).toBeDefined();
      expect(mockSupabase.insert).toHaveBeenCalled();
    });

    it('deve não validar amount para eventos não-monetários', async () => {
      mockSupabase.insert.mockReturnThis();
      mockSupabase.select.mockResolvedValue({ data: [{ id: 1 }], error: null });

      const result = await service.track('signup', {
        tenantId: 'tenant-123',
        amount: -5000, // Não deve validar
      });

      expect(result).toBeDefined();
    });

    it('deve incluir userId, ipAddress e userAgent se fornecidos', async () => {
      mockSupabase.insert.mockReturnThis();
      mockSupabase.select.mockResolvedValue({ data: [{ id: 1 }], error: null });

      await service.track('signup', {
        tenantId: 'tenant-123',
        userId: 'user-456',
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
      });

      expect(mockSupabase.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          tenant_id: 'tenant-123',
          event_type: 'signup',
          user_id: 'user-456',
          ip_address: '192.168.1.1',
          user_agent: 'Mozilla/5.0',
        })
      );
    });

    it('deve rejeitar se Supabase retorna erro', async () => {
      mockSupabase.insert.mockReturnThis();
      mockSupabase.select.mockResolvedValue({
        data: null,
        error: new Error('Database error'),
      });

      await expect(
        service.track('signup', { tenantId: 'tenant-123' })
      ).rejects.toThrow('Database error');
    });
  });

  describe('getARPUMetrics()', () => {
    it('deve calcular ARPU corretamente com múltiplos eventos', async () => {
      const events = [
        { properties: { amount: 9999 }, event_type: 'checkout_complete' },
        { properties: { amount: 29999 }, event_type: 'upgrade' },
      ];

      mockSupabase.from
        .mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          in: jest.fn().mockResolvedValue({ data: events, error: null }),
        })
        .mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: { users: ['user1', 'user2'] },
            error: null,
          }),
        });

      const arpu = await service.getARPUMetrics('tenant-123');

      expect(arpu.totalRevenue).toBe(400); // (9999 + 29999) / 100 = 399.98, arredondado 400
      expect(arpu.transactionCount).toBe(2);
      expect(arpu.arpu).toBeCloseTo(200, 1); // 400 / 2 = 200
      expect(arpu.averageTransactionValue).toBeCloseTo(200, 1);
    });

    it('deve ignorar eventos com amount < 0', async () => {
      const events = [
        { properties: { amount: 9999 }, event_type: 'checkout_complete' },
        { properties: { amount: -5000 }, event_type: 'upgrade' }, // Inválido
      ];

      mockSupabase.from
        .mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          in: jest.fn().mockResolvedValue({ data: events, error: null }),
        })
        .mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: { users: ['user1'] },
            error: null,
          }),
        });

      const arpu = await service.getARPUMetrics('tenant-123');

      expect(arpu.transactionCount).toBe(1); // Ignora o evento com amount < 0
      expect(arpu.totalRevenue).toBe(100); // Apenas 9999 / 100 = 99.99, arredondado 100
      expect(arpu.arpu).toBeCloseTo(99.99, 1);
    });

    it('deve ignorar eventos com amount não-number', async () => {
      const events = [
        { properties: { amount: 9999 }, event_type: 'checkout_complete' },
        { properties: { amount: 'invalid' }, event_type: 'upgrade' },
      ];

      mockSupabase.from
        .mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          in: jest.fn().mockResolvedValue({ data: events, error: null }),
        })
        .mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: { users: ['user1'] },
            error: null,
          }),
        });

      const arpu = await service.getARPUMetrics('tenant-123');

      expect(arpu.transactionCount).toBe(1);
      expect(arpu.totalRevenue).toBe(100);
    });

    it('deve retornar zeros se sem eventos', async () => {
      mockSupabase.from
        .mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          in: jest.fn().mockResolvedValue({ data: [], error: null }),
        })
        .mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: { users: [] },
            error: null,
          }),
        });

      const arpu = await service.getARPUMetrics('tenant-123');

      expect(arpu.totalRevenue).toBe(0);
      expect(arpu.transactionCount).toBe(0);
      expect(arpu.arpu).toBe(0);
      expect(arpu.averageTransactionValue).toBe(0);
    });

    it('deve usar Promise.all para queries paralelas', async () => {
      const promiseAllSpy = jest.spyOn(Promise, 'all');

      mockSupabase.from
        .mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          in: jest.fn().mockResolvedValue({ data: [], error: null }),
        })
        .mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: { users: [] },
            error: null,
          }),
        });

      await service.getARPUMetrics('tenant-123');

      expect(promiseAllSpy).toHaveBeenCalled();
      promiseAllSpy.mockRestore();
    });

    it('deve rejeitar se tenantId falta', async () => {
      await expect(
        service.getARPUMetrics(null)
      ).rejects.toThrow('tenantId é obrigatório');
    });

    it('deve rejeitar se evento query falha', async () => {
      mockSupabase.from
        .mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          in: jest.fn().mockResolvedValue({
            data: null,
            error: new Error('Query failed'),
          }),
        })
        .mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: { users: [] },
            error: null,
          }),
        });

      await expect(
        service.getARPUMetrics('tenant-123')
      ).rejects.toThrow('Query failed');
    });

    it('deve calcular ARPU com múltiplos usuários', async () => {
      const events = [
        { properties: { amount: 10000 }, event_type: 'checkout_complete' },
        { properties: { amount: 20000 }, event_type: 'checkout_complete' },
        { properties: { amount: 30000 }, event_type: 'upgrade' },
      ];

      mockSupabase.from
        .mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          in: jest.fn().mockResolvedValue({ data: events, error: null }),
        })
        .mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: { users: ['user1', 'user2', 'user3', 'user4', 'user5'] },
            error: null,
          }),
        });

      const arpu = await service.getARPUMetrics('tenant-123');

      // Total: 10000 + 20000 + 30000 = 60000 centavos = 600 reais
      // ARPU: 600 / 5 usuários = 120 reais por usuário
      expect(arpu.totalRevenue).toBe(600);
      expect(arpu.transactionCount).toBe(3);
      expect(arpu.arpu).toBe(120);
      expect(arpu.averageTransactionValue).toBe(200); // 600 / 3 transações
    });
  });

  describe('getConversionMetrics()', () => {
    it('deve retornar zeros se sem dados', async () => {
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { code: 'PGRST116' }, // Sem linhas
        }),
      });

      const metrics = await service.getConversionMetrics('tenant-123');

      expect(metrics.totalSignups).toBe(0);
      expect(metrics.planViews).toBe(0);
      expect(metrics.checkoutCompletes).toBe(0);
    });

    it('deve rejeitar se tenantId falta', async () => {
      await expect(
        service.getConversionMetrics(null)
      ).rejects.toThrow('tenantId é obrigatório');
    });
  });

  describe('getDashboardMetrics()', () => {
    it('deve usar Promise.all para múltiplas métricas', async () => {
      const promiseAllSpy = jest.spyOn(Promise, 'all');

      mockSupabase.from
        .mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: {
              total_signups: 10,
              plan_views: 8,
              checkout_starts: 5,
              checkout_completes: 3,
              upgrades: 1,
            },
            error: null,
          }),
        })
        .mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          in: jest.fn().mockResolvedValue({ data: [], error: null }),
        })
        .mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: { users: [] },
            error: null,
          }),
        })
        .mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          in: jest.fn().mockResolvedValue({ data: [], error: null }),
        })
        .mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: { total_signups: 10 },
            error: null,
          }),
        });

      await service.getDashboardMetrics('tenant-123');

      expect(promiseAllSpy).toHaveBeenCalled();
      promiseAllSpy.mockRestore();
    });

    it('deve rejeitar se tenantId falta', async () => {
      await expect(
        service.getDashboardMetrics(null)
      ).rejects.toThrow('tenantId é obrigatório');
    });
  });

  describe('getChurnMetrics()', () => {
    it('deve rejeitar se tenantId falta', async () => {
      await expect(
        service.getChurnMetrics(null)
      ).rejects.toThrow('tenantId é obrigatório');
    });
  });

  describe('getEventHistory()', () => {
    it('deve rejeitar se tenantId falta', async () => {
      await expect(
        service.getEventHistory(null)
      ).rejects.toThrow('tenantId é obrigatório');
    });

    it('deve usar limit e offset padrões', async () => {
      const mockRange = jest.fn().mockResolvedValue({
        data: [],
        error: null,
        count: 0,
      });
      const mockOrder = jest.fn().mockReturnValue({
        range: mockRange,
      });
      const mockEq = jest.fn().mockReturnValue({
        order: mockOrder,
      });
      const mockSelect = jest.fn().mockReturnValue({
        eq: mockEq,
      });
      mockSupabase.from.mockReturnValueOnce({
        select: mockSelect,
      });

      await service.getEventHistory('tenant-123');

      expect(mockRange).toHaveBeenCalledWith(0, 99); // limit=100, offset=0
    });
  });
});

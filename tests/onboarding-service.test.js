/**
 * Testes para OnboardingService
 *
 * Valida:
 * - Inicialização de progresso (step 1, trial 7 dias)
 * - Completamento de steps (1-5) com atomicidade
 * - Cálculo de daysRemaining (trial countdown)
 * - Rastreamento de eventos via analytics
 * - Mapeamento de events (step 4 = team_invited, etc)
 * - Expiração de trial e warnings
 *
 * Uso: npm test -- tests/onboarding-service.test.js
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { OnboardingService } from '../modules/billing/onboarding.service.js';
import { AnalyticsService } from '../modules/billing/analytics.service.js';

describe('OnboardingService', () => {
  let service;
  let mockSupabase;
  let mockAnalytics;

  beforeEach(() => {
    // Mock do Supabase com suporte a RPC
    mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null }),
      rpc: jest.fn().mockResolvedValue({ data: null, error: null }),
    };

    // Criar serviço com mock
    service = new OnboardingService(mockSupabase);

    // Mock do AnalyticsService
    mockAnalytics = {
      track: jest.fn().mockResolvedValue({ ok: true }),
    };
    service.analytics = mockAnalytics;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initializeProgress', () => {
    it('deve lançar erro se tenantId não for fornecido', async () => {
      await expect(service.initializeProgress(null)).rejects.toThrow('tenantId é obrigatório');
    });

    it('deve inicializar progresso com step 1 e trial de 7 dias', async () => {
      const tenantId = 'tenant-123';
      const now = new Date();
      const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      const mockInsertSelect = jest.fn().mockResolvedValue({
        data: [{
          tenant_id: tenantId,
          current_step: 1,
          status: 'in_progress',
          trial_starts_at: now.toISOString(),
          trial_ends_at: sevenDaysLater.toISOString(),
        }],
        error: null,
      });

      mockSupabase.insert.mockReturnValue({
        select: mockInsertSelect,
      });

      const result = await service.initializeProgress(tenantId);

      expect(result).toBeDefined();
      expect(result.tenant_id).toBe(tenantId);
      expect(result.current_step).toBe(1);
      expect(result.status).toBe('in_progress');

      // Verificar que analytics.track foi chamado com 'signup'
      expect(mockAnalytics.track).toHaveBeenCalledWith('signup', {
        tenantId,
      });
    });

    it('deve lançar erro se insert falhar', async () => {
      const tenantId = 'tenant-123';
      const mockError = new Error('Insert failed');

      mockSupabase.insert.mockReturnValue({
        select: jest.fn().mockResolvedValue({ data: null, error: mockError }),
      });

      await expect(service.initializeProgress(tenantId)).rejects.toThrow('Insert failed');
    });
  });

  describe('getProgress', () => {
    it('deve lançar erro se tenantId não for fornecido', async () => {
      await expect(service.getProgress(null)).rejects.toThrow('tenantId é obrigatório');
    });

    it('deve retornar progresso formatado', async () => {
      const tenantId = 'tenant-123';
      const now = new Date();
      const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      const mockProgressData = {
        tenant_id: tenantId,
        current_step: 2,
        status: 'in_progress',
        trial_starts_at: now.toISOString(),
        trial_ends_at: sevenDaysLater.toISOString(),
        steps_progress: {
          '1': { completed: true, completedAt: now.toISOString() },
        },
        created_at: now.toISOString(),
        completed_at: null,
      };

      mockSupabase.select.mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: mockProgressData, error: null }),
        }),
      });

      const result = await service.getProgress(tenantId);

      expect(result).toBeDefined();
      expect(result.tenantId).toBe(tenantId);
      expect(result.currentStep).toBe(2);
      expect(result.completedStepsCount).toBe(1);
    });

    it('deve inicializar progresso se não existir (PGRST116)', async () => {
      const tenantId = 'tenant-123';
      const notFoundError = { code: 'PGRST116', message: 'Not found' };

      // Primeira chamada retorna PGRST116
      mockSupabase.select.mockReturnValueOnce({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: null, error: notFoundError }),
        }),
      });

      // Após inicializar, o insert retorna dados
      const now = new Date();
      const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      const mockInsertSelect = jest.fn().mockResolvedValue({
        data: [{
          tenant_id: tenantId,
          current_step: 1,
          status: 'in_progress',
          trial_starts_at: now.toISOString(),
          trial_ends_at: sevenDaysLater.toISOString(),
          steps_progress: {},
          created_at: now.toISOString(),
          completed_at: null,
        }],
        error: null,
      });

      mockSupabase.insert = jest.fn().mockReturnValue({
        select: mockInsertSelect,
      });

      const result = await service.getProgress(tenantId);

      expect(result).toBeDefined();
      expect(mockAnalytics.track).toHaveBeenCalledWith('signup', { tenantId });
    });
  });

  describe('completeStep', () => {
    it('deve lançar erro se tenantId não for fornecido', async () => {
      await expect(service.completeStep(null, 1)).rejects.toThrow('tenantId é obrigatório');
    });

    it('deve lançar erro se stepId for inválido', async () => {
      await expect(service.completeStep('tenant-123', 0)).rejects.toThrow('stepId deve ser entre 1 e 5');
      await expect(service.completeStep('tenant-123', 6)).rejects.toThrow('stepId deve ser entre 1 e 5');
      await expect(service.completeStep('tenant-123', 2.5)).rejects.toThrow('stepId deve ser entre 1 e 5');
    });

    it('deve completar step 1 e rastrear evento "signup"', async () => {
      const tenantId = 'tenant-123';
      const now = new Date();
      const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      const updatedProgress = {
        tenant_id: tenantId,
        current_step: 2,
        status: 'in_progress',
        trial_starts_at: now.toISOString(),
        trial_ends_at: sevenDaysLater.toISOString(),
        steps_progress: {
          '1': { completed: true, completedAt: now.toISOString() },
        },
        created_at: now.toISOString(),
        completed_at: null,
      };

      // Mock RPC call
      mockSupabase.rpc.mockResolvedValue({
        data: [updatedProgress],
        error: null,
      });

      const result = await service.completeStep(tenantId, 1);

      expect(result).toBeDefined();
      expect(result.currentStep).toBe(2);
      expect(result.completedStepsCount).toBe(1);

      // Verificar que RPC foi chamado corretamente
      expect(mockSupabase.rpc).toHaveBeenCalledWith('complete_onboarding_step', {
        p_tenant_id: tenantId,
        p_step_id: 1,
        p_metadata: {},
      });

      // Verificar evento rastreado
      expect(mockAnalytics.track).toHaveBeenCalledWith('signup', expect.objectContaining({
        tenantId,
        step: 1,
      }));
    });

    it('deve completar step 4 e rastrear evento "team_invited"', async () => {
      const tenantId = 'tenant-123';
      const now = new Date();

      const updatedProgress = {
        tenant_id: tenantId,
        current_step: 5,
        status: 'in_progress',
        trial_starts_at: now.toISOString(),
        trial_ends_at: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        steps_progress: {
          '1': { completed: true },
          '2': { completed: true },
          '3': { completed: true },
          '4': { completed: true, completedAt: now.toISOString() },
        },
        created_at: now.toISOString(),
        completed_at: null,
      };

      mockSupabase.rpc.mockResolvedValue({
        data: [updatedProgress],
        error: null,
      });

      await service.completeStep(tenantId, 4);

      expect(mockSupabase.rpc).toHaveBeenCalledWith('complete_onboarding_step', {
        p_tenant_id: tenantId,
        p_step_id: 4,
        p_metadata: {},
      });

      expect(mockAnalytics.track).toHaveBeenCalledWith('team_invited', expect.anything());
    });

    it('deve completar step 5 e marcar status como "completed"', async () => {
      const tenantId = 'tenant-123';
      const now = new Date();

      const updatedProgress = {
        tenant_id: tenantId,
        current_step: 5,
        status: 'completed',
        trial_starts_at: now.toISOString(),
        trial_ends_at: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        steps_progress: {
          '1': { completed: true },
          '2': { completed: true },
          '3': { completed: true },
          '4': { completed: true },
          '5': { completed: true, completedAt: now.toISOString() },
        },
        created_at: now.toISOString(),
        completed_at: now.toISOString(),
      };

      mockSupabase.rpc.mockResolvedValue({
        data: [updatedProgress],
        error: null,
      });

      const result = await service.completeStep(tenantId, 5);

      expect(result.status).toBe('completed');
      expect(mockSupabase.rpc).toHaveBeenCalledWith('complete_onboarding_step', {
        p_tenant_id: tenantId,
        p_step_id: 5,
        p_metadata: {},
      });
      expect(mockAnalytics.track).toHaveBeenCalledWith('upgrade', expect.anything());
    });
  });

  describe('_formatProgress', () => {
    it('deve calcular daysRemaining corretamente (7 dias)', () => {
      const now = new Date();
      const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      const dbRow = {
        tenant_id: 'tenant-123',
        current_step: 1,
        status: 'in_progress',
        trial_starts_at: now.toISOString(),
        trial_ends_at: sevenDaysLater.toISOString(),
        steps_progress: {},
        created_at: now.toISOString(),
        completed_at: null,
      };

      const formatted = service._formatProgress(dbRow);

      expect(formatted.daysRemaining).toBe(7);
    });

    it('deve retornar 0 daysRemaining se trial expirou', () => {
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);

      const dbRow = {
        tenant_id: 'tenant-123',
        current_step: 1,
        status: 'in_progress',
        trial_starts_at: oneDayAgo.toISOString(),
        trial_ends_at: oneDayAgo.toISOString(),
        steps_progress: {},
        created_at: oneDayAgo.toISOString(),
        completed_at: null,
      };

      const formatted = service._formatProgress(dbRow);

      expect(formatted.daysRemaining).toBe(0);
    });

    it('deve calcular progressPercentage com base em steps completos', () => {
      const now = new Date();
      const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      const dbRow = {
        tenant_id: 'tenant-123',
        current_step: 3,
        status: 'in_progress',
        trial_starts_at: now.toISOString(),
        trial_ends_at: sevenDaysLater.toISOString(),
        steps_progress: {
          '1': { completed: true },
          '2': { completed: true },
        },
        created_at: now.toISOString(),
        completed_at: null,
      };

      const formatted = service._formatProgress(dbRow);

      expect(formatted.completedStepsCount).toBe(2);
      expect(formatted.progressPercentage).toBe(40); // 2/5 = 0.4 * 100
    });

    it('deve retornar null se dbRow for null', () => {
      const result = service._formatProgress(null);
      expect(result).toBeNull();
    });

    it('deve incluir todos os 5 steps formatados', () => {
      const now = new Date();
      const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      const dbRow = {
        tenant_id: 'tenant-123',
        current_step: 1,
        status: 'in_progress',
        trial_starts_at: now.toISOString(),
        trial_ends_at: sevenDaysLater.toISOString(),
        steps_progress: {
          '1': { completed: true, completedAt: now.toISOString() },
        },
        created_at: now.toISOString(),
        completed_at: null,
      };

      const formatted = service._formatProgress(dbRow);

      expect(formatted.steps).toHaveLength(5);
      expect(formatted.steps[0].id).toBe(1);
      expect(formatted.steps[0].completed).toBe(true);
      expect(formatted.steps[1].completed).toBe(false);
    });
  });

  describe('getTrialStatus', () => {
    it('deve lançar erro se tenantId não for fornecido', async () => {
      await expect(service.getTrialStatus(null)).rejects.toThrow('tenantId é obrigatório');
    });

    it('deve retornar status "not_found" se progresso não existir', async () => {
      const tenantId = 'tenant-123';
      const notFoundError = { code: 'PGRST116' };

      mockSupabase.select.mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: null, error: notFoundError }),
        }),
      });

      const result = await service.getTrialStatus(tenantId);

      expect(result.status).toBe('not_found');
    });

    it('deve retornar trial status formatado', async () => {
      const tenantId = 'tenant-123';

      const mockTrialData = {
        tenant_id: tenantId,
        trial_status: 'active',
        days_remaining: 5,
        trial_starts_at: new Date().toISOString(),
        trial_ends_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        onboarding_status: 'in_progress',
        completed_steps_count: 2,
        progress_percentage: 40,
        step1_completed: true,
        step2_completed: true,
        step3_completed: false,
        step4_completed: false,
        step5_completed: false,
      };

      mockSupabase.select.mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: mockTrialData, error: null }),
        }),
      });

      const result = await service.getTrialStatus(tenantId);

      expect(result.tenantId).toBe(tenantId);
      expect(result.trialStatus).toBe('active');
      expect(result.daysRemaining).toBe(5);
      expect(result.completedSteps).toBe(2);
      expect(result.stepsCompleted['1']).toBe(true);
      expect(result.stepsCompleted['3']).toBe(false);
    });
  });

  describe('markTrialExpired', () => {
    it('deve lançar erro se tenantId não for fornecido', async () => {
      await expect(service.markTrialExpired(null)).rejects.toThrow('tenantId é obrigatório');
    });

    it('deve rastrear evento "trial_expired" e atualizar status', async () => {
      const tenantId = 'tenant-123';

      mockSupabase.update.mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: null }),
      });

      await service.markTrialExpired(tenantId);

      expect(mockAnalytics.track).toHaveBeenCalledWith('trial_expired', {
        tenantId,
      });
      expect(mockSupabase.update).toHaveBeenCalled();
    });
  });

  describe('sendTrialWarning', () => {
    it('deve lançar erro se tenantId não for fornecido', async () => {
      await expect(service.sendTrialWarning(null, 2)).rejects.toThrow('tenantId é obrigatório');
    });

    it('deve rastrear evento "trial_warning" com daysRemaining', async () => {
      const tenantId = 'tenant-123';
      const daysRemaining = 2;

      await service.sendTrialWarning(tenantId, daysRemaining);

      expect(mockAnalytics.track).toHaveBeenCalledWith('trial_warning', {
        tenantId,
        daysRemaining,
      });
    });
  });

  describe('getTrialsExpiringToday', () => {
    it('deve retornar lista de trials expirando', async () => {
      const mockTrials = [
        { tenant_id: 'tenant-1', trial_ends_at: new Date().toISOString(), days_remaining: 0 },
        { tenant_id: 'tenant-2', trial_ends_at: new Date().toISOString(), days_remaining: 1 },
      ];

      mockSupabase.select.mockReturnValue({
        in: jest.fn().mockResolvedValue({ data: mockTrials, error: null }),
      });

      const result = await service.getTrialsExpiringToday();

      expect(result).toEqual(mockTrials);
      expect(result).toHaveLength(2);
    });

    it('deve retornar array vazio se nenhum trial expirar', async () => {
      mockSupabase.select.mockReturnValue({
        in: jest.fn().mockResolvedValue({ data: [], error: null }),
      });

      const result = await service.getTrialsExpiringToday();

      expect(result).toEqual([]);
    });
  });
});

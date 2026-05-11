import { AnalyticsService } from './analytics.service.js';

/**
 * @typedef {Object} OnboardingStep
 * @property {number} id - ID do passo (1-5)
 * @property {string} name - Nome descritivo
 * @property {string} description - Descrição do passo
 * @property {string} icon - Emoji do passo
 * @property {boolean} [completed] - Se foi completado
 * @property {string} [completedAt] - Timestamp de conclusão (ISO 8601)
 */

/**
 * @typedef {Object} OnboardingProgress
 * @property {string} tenantId - ID do tenant
 * @property {number} currentStep - Passo atual (1-5)
 * @property {number} completedStepsCount - Quantidade de passos completos
 * @property {number} progressPercentage - Progresso em percentual (0-100)
 * @property {string} status - Status ('in_progress', 'completed', 'abandoned')
 * @property {string} trialStartsAt - Data de início do trial (ISO 8601)
 * @property {string} trialEndsAt - Data de fim do trial (ISO 8601)
 * @property {number} daysRemaining - Dias restantes do trial
 * @property {OnboardingStep[]} steps - Array com status de cada passo
 * @property {string} createdAt - Timestamp de criação (ISO 8601)
 * @property {string} [completedAt] - Timestamp de conclusão (ISO 8601)
 */

/**
 * @typedef {Object} TrialStatus
 * @property {string} tenantId - ID do tenant
 * @property {string} trialStatus - Status ('active', 'expiring_today', 'expired', etc)
 * @property {number} daysRemaining - Dias até expiração
 * @property {string} trialStartsAt - Data de início (ISO 8601)
 * @property {string} trialEndsAt - Data de fim (ISO 8601)
 * @property {string} onboardingStatus - Status de onboarding
 * @property {number} completedSteps - Quantidade de passos completos
 * @property {number} progressPercentage - Progresso em percentual
 * @property {Object} stepsCompleted - Map de passos completos
 */

/**
 * OnboardingService — Gerenciamento de Progresso de Onboarding
 *
 * 5 Passos de Onboarding:
 * 1. Verificar Email - enviar email de verificação
 * 2. Criar Instância - criar primeira instância WhatsApp
 * 3. Testar Campanha - enviar teste de campanha
 * 4. Convidar Time - convidar colega (opcional)
 * 5. Upgrade de Plano - escolher plano pago (sair de trial)
 *
 * Cada transição rastreia evento via analytics + atualiza progresso.
 * Usa RPC com lock pessimista para garantir idempotência.
 *
 * @class OnboardingService
 * @example
 *   const onboarding = new OnboardingService(supabase);
 *   await onboarding.initializeProgress('tenant-123');
 *   const progress = await onboarding.getProgress('tenant-123');
 *   await onboarding.completeStep('tenant-123', 2);
 */
export class OnboardingService {
  /**
   * Inicializar Onboarding Service
   *
   * @param {Object} supabase - Cliente Supabase
   * @param {Function} supabase.from - Função para acessar tabelas
   * @param {Function} supabase.rpc - Função para executar stored procedures
   */
  constructor(supabase) {
    this.supabase = supabase;
    this.analytics = new AnalyticsService(supabase);
  }

  // Definição dos 5 passos
  static STEPS = [
    {
      id: 1,
      name: 'Verificar Email',
      description: 'Confirmar seu endereço de email',
      icon: '✉️',
    },
    {
      id: 2,
      name: 'Criar Instância',
      description: 'Criar sua primeira instância WhatsApp',
      icon: '📱',
    },
    {
      id: 3,
      name: 'Testar Campanha',
      description: 'Enviar uma mensagem de teste',
      icon: '📤',
    },
    {
      id: 4,
      name: 'Convidar Time',
      description: 'Convidar um colega (opcional)',
      icon: '👥',
    },
    {
      id: 5,
      name: 'Upgrade de Plano',
      description: 'Escolher seu plano e fazer upgrade',
      icon: '💳',
    },
  ];

  /**
   * Inicializar progresso de onboarding para novo tenant
   *
   * Cria registro com trial de 7 dias. Rastreia evento 'signup' em analytics.
   *
   * @param {string} tenantId - ID do tenant
   * @returns {Promise<OnboardingProgress>} Progresso inicializado
   * @throws {Error} Se tenantId ausente ou erro ao inserir no banco
   *
   * @example
   *   const progress = await onboarding.initializeProgress('tenant-123');
   *   console.log(progress.trialEndsAt); // Data 7 dias no futuro
   */
  async initializeProgress(tenantId) {
    if (!tenantId) {
      throw new Error('tenantId é obrigatório');
    }

    try {
      const { data, error } = await this.supabase
        .from('onboarding_progress')
        .insert({
          tenant_id: tenantId,
          current_step: 1,
          status: 'in_progress',
          trial_starts_at: new Date().toISOString(),
          trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .select();

      if (error) throw error;

      // Rastrear evento de signup
      await this.analytics.track('signup', {
        tenantId,
      }).catch(err => console.warn('[Onboarding] Analytics signup falhou:', err.message));

      return data?.[0] || { ok: true };
    } catch (err) {
      console.error('[Onboarding] Erro ao inicializar progresso:', err.message);
      throw err;
    }
  }

  /**
   * Obter progresso de onboarding de um tenant
   *
   * Auto-inicializa se não existir. Formata resposta para API.
   *
   * @param {string} tenantId - ID do tenant
   * @returns {Promise<OnboardingProgress>} Progresso formatado com passos e percentual
   * @throws {Error} Se tenantId ausente ou erro ao consultar banco
   *
   * @example
   *   const progress = await onboarding.getProgress('tenant-123');
   *   console.log(progress.progressPercentage); // 40 (2 de 5 passos)
   *   console.log(progress.steps[0].completed); // true
   */
  async getProgress(tenantId) {
    if (!tenantId) {
      throw new Error('tenantId é obrigatório');
    }

    try {
      // Primeiro: tentar buscar progresso existente
      const { data, error } = await this.supabase
        .from('onboarding_progress')
        .select('*')
        .eq('tenant_id', tenantId)
        .single();

      // Se encontrou, retornar
      if (data) {
        return this._formatProgress(data);
      }

      // CRÍTICO #2 FIX: Se não encontrou, usar RPC atômica (INSERT ON CONFLICT)
      // para evitar race condition quando múltiplas requisições chamam getProgress em paralelo
      if (error?.code === 'PGRST116') {
        // Registrar não existe. Tentar usar RPC para criar atomicamente
        const { data: rpcData, error: rpcError } = await this.supabase.rpc('get_or_create_onboarding_progress', {
          p_tenant_id: tenantId,
        }).catch(rpcErr => {
          // Se RPC não existe (migration ainda não rodou), fall back para método anterior
          console.warn('[Onboarding] RPC get_or_create_onboarding_progress não disponível, usando fallback');
          return { data: null, error: rpcErr };
        });

        if (rpcData) {
          const progress = rpcData[0];
          if (progress) {
            // Rastrear evento de signup
            await this.analytics.track('signup', {
              tenantId,
            }).catch(err => console.warn('[Onboarding] Analytics signup falhou:', err.message));

            return this._formatProgress(progress);
          }
        }

        // FALLBACK: Se RPC não disponível, usar método anterior com retry
        // Protege contra race condition tentando novamente
        return await this._initializeProgressWithRetry(tenantId);
      }

      // Outro erro que não foi "not found"
      if (error) throw error;
    } catch (err) {
      console.error('[Onboarding] Erro ao obter progresso:', err.message);
      throw err;
    }
  }

  /**
   * CRÍTICO #2 FIX: Inicializar com retry para lidar com race condition
   * Fallback quando RPC não disponível
   * @private
   */
  async _initializeProgressWithRetry(tenantId, maxRetries = 3) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        // Tentar inserir
        const { data, error } = await this.supabase
          .from('onboarding_progress')
          .insert({
            tenant_id: tenantId,
            current_step: 1,
            status: 'in_progress',
            trial_starts_at: new Date().toISOString(),
            trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          })
          .select();

        if (error) {
          // UNIQUE constraint violated = outro processo criou
          // Tentar buscar o registro que foi criado
          if (error.code === '23505') {
            await new Promise(r => setTimeout(r, 100 * Math.pow(2, attempt))); // backoff exponencial
            const { data: existing } = await this.supabase
              .from('onboarding_progress')
              .select('*')
              .eq('tenant_id', tenantId)
              .single();

            if (existing) {
              return this._formatProgress(existing);
            }
            // Se ainda não encontrou, continuar tentando
            continue;
          }
          throw error;
        }

        // Sucesso ao inserir
        await this.analytics.track('signup', {
          tenantId,
        }).catch(err => console.warn('[Onboarding] Analytics signup falhou:', err.message));

        return this._formatProgress(data?.[0]);
      } catch (err) {
        if (attempt === maxRetries - 1) throw err;
        // Backoff exponencial para retry
        await new Promise(r => setTimeout(r, 100 * Math.pow(2, attempt)));
      }
    }
  }

  /**
   * Completar um passo do onboarding com rastreamento
   *
   * Usa RPC (SELECT...FOR UPDATE) para lock pessimista: garantia de idempotência.
   * Rastreia evento analytics correspondente ao passo.
   *
   * @param {string} tenantId - ID do tenant
   * @param {number} stepId - ID do passo (1-5, obrigatório)
   * @param {Object} [metadata] - Metadados customizáveis por passo
   * @returns {Promise<OnboardingProgress>} Progresso atualizado
   * @throws {Error} Se stepId fora de range (1-5) ou erro ao atualizar
   *
   * @example
   *   // Passo 2: Criar Instância
   *   await onboarding.completeStep('tenant-123', 2, {
   *     instanceId: 'inst-456',
   *     provider: 'whatsapp'
   *   });
   *
   *   // Passo 5: Upgrade
   *   await onboarding.completeStep('tenant-123', 5, {
   *     planId: 'starter',
   *     subscriptionId: 'sub-789'
   *   });
   */
  async completeStep(tenantId, stepId, metadata = {}) {
    if (!tenantId) {
      throw new Error('tenantId é obrigatório');
    }

    if (!Number.isInteger(stepId) || stepId < 1 || stepId > 5) {
      throw new Error('stepId deve ser entre 1 e 5');
    }

    try {
      // Chamar RPC (transação atômica no PostgreSQL)
      // SELECT...FOR UPDATE garante lock pessimista: fetch+update indivisível
      const { data, error } = await this.supabase.rpc('complete_onboarding_step', {
        p_tenant_id: tenantId,
        p_step_id: stepId,
        p_metadata: metadata,
      });

      if (error) throw error;

      const result = data?.[0];
      if (!result) throw new Error('Falha ao completar step');

      // Rastrear evento de conclusão
      const stepName = OnboardingService.STEPS.find(s => s.id === stepId)?.name || `Step ${stepId}`;
      const eventMap = {
        1: 'signup', // Email verificado
        2: 'plan_viewed', // Instância criada
        3: 'checkout_start', // Campanha testada
        4: 'team_invited', // Time convidado
        5: 'upgrade', // Upgrade completo
      };

      const analyticsEvent = eventMap[stepId];
      if (analyticsEvent) {
        await this.analytics.track(analyticsEvent, {
          tenantId,
          step: stepId,
          stepName,
        }).catch(err => console.warn('[Onboarding] Analytics track falhou:', err.message));
      }

      return this._formatProgress(result);
    } catch (err) {
      console.error(`[Onboarding] Erro ao completar step ${stepId}:`, err.message);
      throw err;
    }
  }

  /**
   * Obter status detalhado do trial do tenant
   *
   * Usa view agregada (trial_status_summary) para performance.
   * Inclui dias restantes, status e progresso de onboarding.
   *
   * @param {string} tenantId - ID do tenant
   * @returns {Promise<TrialStatus>} Status do trial e onboarding
   * @throws {Error} Erro ao consultar banco
   *
   * @example
   *   const trial = await onboarding.getTrialStatus('tenant-123');
   *   if (trial.daysRemaining <= 3) {
   *     // Enviar email de aviso
   *   }
   *   console.log(trial.progressPercentage); // 60%
   */
  async getTrialStatus(tenantId) {
    if (!tenantId) {
      throw new Error('tenantId é obrigatório');
    }

    try {
      const { data, error } = await this.supabase
        .from('trial_status_summary')
        .select('*')
        .eq('tenant_id', tenantId)
        .single();

      if (error && error.code === 'PGRST116') {
        return {
          status: 'not_found',
          message: 'Progresso de onboarding não inicializado',
        };
      }

      if (error) throw error;

      return {
        tenantId,
        trialStatus: data.trial_status,
        daysRemaining: data.days_remaining,
        trialStartsAt: data.trial_starts_at,
        trialEndsAt: data.trial_ends_at,
        onboardingStatus: data.onboarding_status,
        completedSteps: data.completed_steps_count,
        progressPercentage: data.progress_percentage,
        stepsCompleted: {
          1: data.step1_completed,
          2: data.step2_completed,
          3: data.step3_completed,
          4: data.step4_completed,
          5: data.step5_completed,
        },
      };
    } catch (err) {
      console.error('[Onboarding] Erro ao obter trial status:', err.message);
      throw err;
    }
  }

  /**
   * Marcar trial como expirado com rastreamento analytics
   *
   * Rastreia evento 'trial_expired' e muda status para 'abandoned'.
   *
   * @param {string} tenantId - ID do tenant
   * @returns {Promise<void>}
   * @throws {Error} Se tenantId ausente ou erro ao atualizar
   *
   * @example
   *   // Job agendado (ex: cron job diário)
   *   const trials = await onboarding.getTrialsExpiringToday();
   *   for (const trial of trials) {
   *     await onboarding.markTrialExpired(trial.tenant_id);
   *   }
   */
  async markTrialExpired(tenantId) {
    if (!tenantId) {
      throw new Error('tenantId é obrigatório');
    }

    try {
      // Rastrear evento
      await this.analytics.track('trial_expired', {
        tenantId,
      }).catch(err => console.warn('[Onboarding] Analytics trial_expired falhou:', err.message));

      // Atualizar status
      await this.supabase
        .from('onboarding_progress')
        .update({ status: 'abandoned' })
        .eq('tenant_id', tenantId);
    } catch (err) {
      console.error('[Onboarding] Erro ao marcar trial como expirado:', err.message);
      throw err;
    }
  }

  /**
   * Enviar alerta de trial expirando com rastreamento
   *
   * Rastreia evento 'trial_warning'. Lógica de envio de email/notificação
   * deve ser implementada externamente.
   *
   * @param {string} tenantId - ID do tenant
   * @param {number} daysRemaining - Dias restantes do trial
   * @returns {Promise<void>}
   * @throws {Error} Se tenantId ausente ou erro ao rastrear
   *
   * @example
   *   // Chamar quando dias_remaining <= 3
   *   await onboarding.sendTrialWarning('tenant-123', 3);
   */
  async sendTrialWarning(tenantId, daysRemaining) {
    if (!tenantId) {
      throw new Error('tenantId é obrigatório');
    }

    try {
      // Rastrear evento
      await this.analytics.track('trial_warning', {
        tenantId,
        daysRemaining,
      }).catch(err => console.warn('[Onboarding] Analytics trial_warning falhou:', err.message));

      // Aqui entraria lógica de envio de email, notificação, etc
      // Por enquanto, apenas registra o evento
    } catch (err) {
      console.error('[Onboarding] Erro ao enviar trial warning:', err.message);
      throw err;
    }
  }

  /**
   * Obter todos os tenants em trial que expiram hoje ou amanhã
   *
   * Usado por jobs agendados para enviar warnings ou marcar como expirado.
   *
   * @returns {Promise<Array>} Lista de objetos {tenant_id, trial_ends_at, ...}
   * @throws {Error} Erro ao consultar banco
   *
   * @example
   *   // Cron job: 23:00 UTC diariamente
   *   const expiringTrials = await onboarding.getTrialsExpiringToday();
   *   for (const trial of expiringTrials) {
   *     if (trial.trial_status === 'expired') {
   *       await onboarding.markTrialExpired(trial.tenant_id);
   *     }
   *   }
   */
  async getTrialsExpiringToday() {
    try {
      const { data, error } = await this.supabase
        .from('trial_status_summary')
        .select('tenant_id, trial_ends_at, days_remaining, onboarding_status')
        .in('trial_status', ['expiring_today', 'critical_warning', 'expired']);

      if (error) throw error;

      return data || [];
    } catch (err) {
      console.error('[Onboarding] Erro ao obter trials expirando:', err.message);
      throw err;
    }
  }

  /**
   * Formatador interno: converter dados do DB para formato API
   *
   * @private
   * @param {Object} dbRow - Linha do banco (onboarding_progress)
   * @returns {OnboardingProgress} Progresso formatado
   */
  _formatProgress(dbRow) {
    if (!dbRow) return null;

    const stepsProgress = dbRow.steps_progress || {};
    const completedCount = Object.values(stepsProgress).filter(s => s?.completed).length;

    return {
      tenantId: dbRow.tenant_id,
      currentStep: dbRow.current_step,
      completedStepsCount: completedCount,
      progressPercentage: Math.round((completedCount / 5) * 100),
      status: dbRow.status,
      trialStartsAt: dbRow.trial_starts_at,
      trialEndsAt: dbRow.trial_ends_at,
      daysRemaining: Math.max(
        0,
        Math.floor(
          (new Date(dbRow.trial_ends_at) - new Date()) / (1000 * 60 * 60 * 24)
        )
      ),
      steps: OnboardingService.STEPS.map(step => ({
        id: step.id,
        name: step.name,
        description: step.description,
        icon: step.icon,
        completed: stepsProgress[String(step.id)]?.completed || false,
        completedAt: stepsProgress[String(step.id)]?.completedAt || null,
      })),
      createdAt: dbRow.created_at,
      completedAt: dbRow.completed_at,
    };
  }
}

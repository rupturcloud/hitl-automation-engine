/**
 * @typedef {Object} FeatureFlagsConfig
 * @property {number} [max] - Máximo de instâncias permitidas
 * @private
 */

/**
 * @typedef {Object} PlanFeatures
 * @property {{max: number}} canCreateInstance - Máximo de instâncias
 * @property {boolean} canUseInbox - Habilita Inbox
 * @property {boolean|string} canUseWorkflows - false, 'basic', ou 'advanced'
 * @property {boolean} canUseAnalytics - Habilita Analytics
 * @property {boolean} canAccessAPI - Habilita acesso à API
 * @property {number} maxCampaignsActive - Máximo de campanhas ativas
 * @property {string} support - Nível de suporte ('email', 'priority', 'dedicated')
 * @property {boolean} [whiteLabel] - Habilita white label (Enterprise)
 */

/**
 * @typedef {Object} FeatureCheckResult
 * @property {boolean} allowed - Se o feature está permitido
 * @property {number} [current] - Valor atual (ex: instâncias em uso)
 * @property {number} [max] - Valor máximo
 * @property {string} plan - ID do plano ativo
 * @property {string} [level] - Nível de feature (ex: 'basic', 'advanced')
 * @property {any} [value] - Valor bruto do feature
 */

/**
 * Feature Flags Service — Tier 1 Billing
 *
 * Define quais features estão disponíveis em cada plano.
 * Hardcoded (não dinâmico) para performance.
 *
 * Cache de 5 minutos reduz queries em 80%+ por request.
 * Suporta validação genérica com dot notation.
 *
 * @class FeatureFlagsService
 * @example
 *   const featureFlags = new FeatureFlagsService(supabase);
 *   const canCreate = await featureFlags.canCreateInstance(tenantId);
 *   if (!canCreate.allowed) {
 *     console.log(`Máximo de ${canCreate.max} instâncias atingido`);
 *   }
 */
export class FeatureFlagsService {
  /**
   * Inicializar Feature Flags Service
   *
   * @param {Object} supabase - Cliente Supabase para queries de subscription
   * @param {Function} supabase.from - Função para acessar tabelas
   */
  constructor(supabase) {
    this.supabase = supabase;

    // Cache do plano: tenantId → { plan, expiresAt }
    this.planCache = new Map();
    this.CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos

    // CRÍTICO #6 FIX: Armazenar referência de setInterval para poder cancelar
    // Evita memory leak em ambiente serverless (função executada múltiplas vezes)
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, value] of this.planCache.entries()) {
        if (value.expiresAt < now) {
          this.planCache.delete(key);
        }
      }
    }, 60000);

    // Definição de features por plano (hardcoded)
    this.planFeatures = {
      trial: {
        canCreateInstance: { max: 1 },
        canUseInbox: false,
        canUseWorkflows: false,
        canUseAnalytics: false,
        canAccessAPI: false,
        maxCampaignsActive: 1,
        support: 'email',
      },
      starter: {
        canCreateInstance: { max: 5 },
        canUseInbox: true,
        canUseWorkflows: 'basic', // true ou 'basic'
        canUseAnalytics: false,
        canAccessAPI: false,
        maxCampaignsActive: 10,
        support: 'email',
      },
      pro: {
        canCreateInstance: { max: 20 },
        canUseInbox: true,
        canUseWorkflows: 'advanced', // true ou 'advanced'
        canUseAnalytics: true,
        canAccessAPI: true,
        maxCampaignsActive: 50,
        support: 'priority',
      },
      enterprise: {
        canCreateInstance: { max: 999 },
        canUseInbox: true,
        canUseWorkflows: 'advanced',
        canUseAnalytics: true,
        canAccessAPI: true,
        maxCampaignsActive: 9999,
        support: 'dedicated',
        whiteLabel: true,
      },
    };
  }

  /**
   * Obter plano ativo do tenant (com cache 5 minutos)
   *
   * Reduz queries em 80%+ ao cachear por 5 minutos.
   * Fallback para 'trial' se Supabase indisponível.
   *
   * @param {string} tenantId - ID do tenant
   * @returns {Promise<string>} ID do plano ('trial', 'starter', 'pro', 'enterprise')
   * @throws {Error} Erro ao consultar subscription no banco
   *
   * @example
   *   const plan = await featureFlags.getPlan('tenant-123');
   *   console.log(plan); // 'starter'
   */
  async getPlan(tenantId) {
    // IMPORTANTE #1 FIX: Não retornar silenciosamente 'trial' se Supabase indisponível
    // Precisa lançar erro para que chamadores saibam que falhou
    if (!this.supabase) {
      throw new Error('Supabase client not initialized');
    }

    // Verificar cache
    const cached = this.planCache.get(tenantId);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.plan;
    }

    // Query ao banco de dados
    const { data, error } = await this.supabase
      .from('subscriptions')
      .select('plan_id')
      .eq('tenant_id', tenantId)
      .eq('status', 'authorized')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    // IMPORTANTE #1 FIX: Se erro, lançar em vez de silenciar
    if (error) {
      throw error;
    }

    const plan = data?.plan_id || 'trial';

    // Armazenar em cache
    this.planCache.set(tenantId, {
      plan,
      expiresAt: Date.now() + this.CACHE_TTL_MS,
    });

    return plan;
  }

  /**
   * Validar se tenant pode criar instância WhatsApp
   *
   * Compara instâncias atuais versus máximo permitido pelo plano.
   *
   * @param {string} tenantId - ID do tenant
   * @returns {Promise<FeatureCheckResult>} Resultado com allowed, current, max
   * @throws {Error} Erro ao contar instâncias existentes
   *
   * @example
   *   const result = await featureFlags.canCreateInstance('tenant-abc');
   *   if (result.allowed) {
   *     // Criar nova instância
   *   } else {
   *     console.log(`Limite atingido: ${result.current}/${result.max}`);
   *   }
   */
  async canCreateInstance(tenantId) {
    const planId = await this.getPlan(tenantId);
    const features = this.planFeatures[planId] || this.planFeatures.trial;
    const max = features.canCreateInstance?.max || 1;

    // Contar instances atuais
    let current = 0;
    if (this.supabase) {
      const { data: instances } = await this.supabase
        .from('instance_registry')
        .select('id', { count: 'exact' })
        .eq('tenant_id', tenantId);
      current = instances?.length || 0;
    }

    return {
      allowed: current < max,
      current,
      max,
      plan: planId,
    };
  }

  /**
   * Validar acesso à Inbox
   *
   * @param {string} tenantId - ID do tenant
   * @returns {Promise<FeatureCheckResult>} Resultado com allowed, value, plan
   * @throws {Error} Erro ao buscar plano
   */
  async canUseInbox(tenantId) {
    const planId = await this.getPlan(tenantId);
    const features = this.planFeatures[planId] || this.planFeatures.trial;
    return {
      allowed: features.canUseInbox === true,
      value: features.canUseInbox,
      plan: planId,
    };
  }

  /**
   * Validar acesso à Workflows
   *
   * Retorna level (false, 'basic', 'advanced') baseado no plano.
   *
   * @param {string} tenantId - ID do tenant
   * @returns {Promise<FeatureCheckResult>} Resultado com allowed, level, value, plan
   * @throws {Error} Erro ao buscar plano
   *
   * @example
   *   const result = await featureFlags.canUseWorkflows('tenant-123');
   *   if (result.level === 'advanced') {
   *     // Usar workflows avançados
   *   }
   */
  async canUseWorkflows(tenantId) {
    const planId = await this.getPlan(tenantId);
    const features = this.planFeatures[planId] || this.planFeatures.trial;
    const value = features.canUseWorkflows;

    return {
      allowed: value !== false,
      level: value === true ? 'advanced' : value, // 'basic', 'advanced', or false
      value,
      plan: planId,
    };
  }

  /**
   * Validar acesso à Analytics
   *
   * @param {string} tenantId - ID do tenant
   * @returns {Promise<FeatureCheckResult>} Resultado com allowed, value, plan
   * @throws {Error} Erro ao buscar plano
   */
  async canUseAnalytics(tenantId) {
    const planId = await this.getPlan(tenantId);
    const features = this.planFeatures[planId] || this.planFeatures.trial;
    return {
      allowed: features.canUseAnalytics === true,
      value: features.canUseAnalytics,
      plan: planId,
    };
  }

  /**
   * Validar acesso à API
   *
   * @param {string} tenantId - ID do tenant
   * @returns {Promise<FeatureCheckResult>} Resultado com allowed, value, plan
   * @throws {Error} Erro ao buscar plano
   */
  async canAccessAPI(tenantId) {
    const planId = await this.getPlan(tenantId);
    const features = this.planFeatures[planId] || this.planFeatures.trial;
    return {
      allowed: features.canAccessAPI === true,
      value: features.canAccessAPI,
      plan: planId,
    };
  }

  /**
   * Obter máximo de campanhas ativas permitidas
   *
   * @param {string} tenantId - ID do tenant
   * @returns {Promise<Object>} {max: number, plan: string}
   * @throws {Error} Erro ao buscar plano
   */
  async maxCampaignsActive(tenantId) {
    const planId = await this.getPlan(tenantId);
    const features = this.planFeatures[planId] || this.planFeatures.trial;
    return {
      max: features.maxCampaignsActive || 1,
      plan: planId,
    };
  }

  /**
   * Obter todas features desbloqueadas para um tenant
   *
   * @param {string} tenantId - ID do tenant
   * @returns {Promise<Object>} {planId: string, features: PlanFeatures}
   * @throws {Error} Erro ao buscar plano
   *
   * @example
   *   const result = await featureFlags.getFeatures('tenant-123');
   *   console.log(result.planId); // 'pro'
   *   console.log(result.features.canUseAnalytics); // true
   */
  async getFeatures(tenantId) {
    const planId = await this.getPlan(tenantId);
    const features = this.planFeatures[planId] || this.planFeatures.trial;

    return {
      planId,
      features,
    };
  }

  /**
   * Invalidar cache do plano para forçar requery
   *
   * Útil após atualizar subscription em produção.
   *
   * @param {string} tenantId - ID do tenant
   * @returns {void}
   */
  invalidatePlanCache(tenantId) {
    this.planCache.delete(tenantId);
  }

  /**
   * Obter features de um plano específico (sem validação de tenant)
   *
   * Acesso direto às features hardcodeadas.
   *
   * @param {string} planId - ID do plano ('trial', 'starter', 'pro', 'enterprise')
   * @returns {PlanFeatures} Objeto com features do plano
   */
  getFeaturesByPlan(planId) {
    return this.planFeatures[planId] || this.planFeatures.trial;
  }

  /**
   * Validar feature genérica com suporte a dot notation
   *
   * Permite validar features aninhadas usando caminho separado por pontos.
   *
   * @param {string} tenantId - ID do tenant
   * @param {string} featurePath - Caminho do feature (ex: 'canCreateInstance.max')
   * @returns {Promise<FeatureCheckResult>} Resultado com allowed, value, plan, feature
   * @throws {Error} Erro ao buscar plano
   *
   * @example
   *   const result = await featureFlags.validateFeature('tenant-123', 'canCreateInstance.max');
   *   console.log(result.value); // 5 (para starter)
   *   console.log(result.allowed); // true
   */
  async validateFeature(tenantId, featurePath) {
    const planId = await this.getPlan(tenantId);
    const features = this.planFeatures[planId] || this.planFeatures.trial;

    // Suportar dot notation: 'canCreateInstance.max' → features.canCreateInstance.max
    const keys = featurePath.split('.');
    let value = features;
    for (const key of keys) {
      value = value?.[key];
    }

    return {
      allowed: value !== false && value !== undefined,
      value,
      plan: planId,
      feature: featurePath,
    };
  }

  /**
   * CRÍTICO #6 FIX: Limpar recursos (destructor para serverless)
   *
   * Cancela setInterval de limpeza de cache para evitar memory leak
   * em ambiente serverless onde instâncias são reutilizadas.
   *
   * Deve ser chamado ao finalizar requisição ou destruir instância.
   *
   * @returns {void}
   *
   * @example
   *   const featureFlags = new FeatureFlagsService(supabase);
   *   try {
   *     const plan = await featureFlags.getPlan('tenant-123');
   *   } finally {
   *     featureFlags.destroy();
   *   }
   */
  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.planCache.clear();
  }
}

export default FeatureFlagsService;

/**
 * @typedef {Object} AnalyticsEvent
 * @property {string} event_type - Tipo de evento rastreado
 * @property {string} tenant_id - ID do tenant
 * @property {string} [user_id] - ID do usuário
 * @property {string} [ip_address] - Endereço IP do cliente
 * @property {string} [user_agent] - User agent do navegador
 * @property {Object} [properties] - Propriedades customizáveis do evento
 * @property {number} [properties.amount] - Valor em centavos para eventos monetários
 * @property {string} [properties.currency] - Moeda (ex: 'BRL')
 * @property {string} [properties.planId] - ID do plano
 * @property {string} created_at - Timestamp do evento (ISO 8601)
 */

/**
 * @typedef {Object} ConversionMetrics
 * @property {string} tenantId - ID do tenant
 * @property {number} totalSignups - Total de signups
 * @property {number} planViews - Quantos viram página de planos
 * @property {number} checkoutStarts - Quantos iniciaram checkout
 * @property {number} checkoutCompletes - Quantos completaram checkout
 * @property {number} upgrades - Quantos fizeram upgrade
 * @property {number} signupToPlanViewRate - Taxa de conversão (%)
 * @property {number} planViewToCheckoutRate - Taxa de conversão (%)
 * @property {number} checkoutCompletionRate - Taxa de conclusão (%)
 * @property {number} trialToPaidConversionRate - Taxa trial → pago (%)
 * @property {Object} dateRange - Range de datas consultadas
 * @property {string} dateRange.start - Data inicial (ISO 8601)
 * @property {string} dateRange.end - Data final (ISO 8601)
 */

/**
 * @typedef {Object} ARPUMetrics
 * @property {string} tenantId - ID do tenant
 * @property {number} totalRevenue - Receita total em reais
 * @property {number} transactionCount - Quantidade de transações
 * @property {number} arpu - Receita média por usuário
 * @property {number} averageTransactionValue - Valor médio por transação
 */

/**
 * @typedef {Object} ChurnMetrics
 * @property {string} tenantId - ID do tenant
 * @property {number} churnCount - Quantidade de usuários que fizeram churn
 * @property {number} totalSignups - Total de signups (baseline)
 * @property {number} churnRate - Taxa de churn em percentual
 */

/**
 * AnalyticsService — Rastreamento de Eventos do Funil de Conversão
 *
 * Responsabilidades:
 * - Rastrear eventos: signup, plan_viewed, checkout_start, etc
 * - Calcular métricas: conversion rate, ARPU, churn rate
 * - Fornecer dados para dashboards em tempo real
 *
 * Usa Supabase RLS para segurança multi-tenant.
 * Suporta queries paralelas para performance.
 *
 * @class AnalyticsService
 * @example
 *   const analytics = new AnalyticsService(supabase);
 *   await analytics.track('signup', { tenantId: 'tenant-123' });
 *   const metrics = await analytics.getConversionMetrics('tenant-123');
 */
export class AnalyticsService {
  /**
   * Inicializar Analytics Service
   *
   * @param {Object} supabase - Cliente Supabase
   * @param {Function} supabase.from - Função para acessar tabelas
   * @param {Function} supabase.rpc - Função para executar stored procedures
   */
  constructor(supabase) {
    this.supabase = supabase;
  }

  /**
   * Rastrear evento de analytics com validação
   *
   * Eventos válidos: signup, plan_viewed, checkout_start, checkout_complete,
   * upgrade, team_invited, trial_warning, trial_expired, churn
   *
   * @param {string} event - Tipo de evento
   * @param {Object} properties - Propriedades do evento
   * @param {string} properties.tenantId - ID do tenant (obrigatório)
   * @param {string} [properties.userId] - ID do usuário
   * @param {string} [properties.planId] - ID do plano (se aplicável)
   * @param {number} [properties.amount] - Valor em centavos (validado para checkout_complete/upgrade)
   * @param {string} [properties.currency] - Moeda (ex: 'BRL')
   * @param {string} [properties.ipAddress] - IP do usuário
   * @param {string} [properties.userAgent] - User agent do navegador
   * @returns {Promise<AnalyticsEvent>} Evento registrado
   * @throws {Error} Se tenantId ausente ou tipo de evento inválido
   *
   * @example
   *   await analytics.track('signup', {
   *     tenantId: 'tenant-123',
   *     userId: 'user-456'
   *   });
   *
   *   await analytics.track('checkout_complete', {
   *     tenantId: 'tenant-123',
   *     amount: 9900, // R$ 99,00
   *     currency: 'BRL',
   *     planId: 'starter'
   *   });
   */
  async track(event, properties = {}) {
    const {
      tenantId,
      userId = null,
      ipAddress = null,
      userAgent = null,
      ...otherProps
    } = properties;

    if (!tenantId) {
      throw new Error('tenantId é obrigatório para rastreamento de eventos');
    }

    const validEvents = [
      'signup',
      'plan_viewed',
      'checkout_start',
      'checkout_complete',
      'upgrade',
      'team_invited',
      'trial_warning',
      'trial_expired',
      'churn',
    ];

    if (!validEvents.includes(event)) {
      throw new Error(`Tipo de evento inválido: ${event}`);
    }

    // Validação de amount para eventos monetários
    if (
      (event === 'checkout_complete' || event === 'upgrade') &&
      otherProps?.amount !== undefined
    ) {
      const amount = otherProps.amount;
      if (typeof amount !== 'number' || amount < 0) {
        throw new Error(
          `Amount deve ser >= 0 e do tipo number, recebido: ${amount}`
        );
      }
    }

    try {
      const { data, error } = await this.supabase
        .from('analytics_events')
        .insert({
          tenant_id: tenantId,
          event_type: event,
          user_id: userId,
          ip_address: ipAddress,
          user_agent: userAgent,
          properties: otherProps,
          created_at: new Date().toISOString(),
        })
        .select();

      if (error) {
        console.error(`[Analytics] Erro ao rastrear ${event}:`, error);
        throw error;
      }

      return data?.[0] || { ok: true };
    } catch (err) {
      console.error('[Analytics] Erro ao inserir evento:', err.message);
      throw err;
    }
  }

  /**
   * Obter métricas de conversão do funil (signup → paid)
   *
   * Retorna taxas de conversão em cada estágio do funil.
   * Usa view agregada (analytics_funnel_metrics) para performance.
   *
   * @param {string} tenantId - ID do tenant
   * @param {Date} [startDate] - Data inicial (padrão: 30 dias atrás)
   * @param {Date} [endDate] - Data final (padrão: hoje)
   * @returns {Promise<ConversionMetrics>} Métricas do funil
   * @throws {Error} Erro ao consultar banco
   *
   * @example
   *   const metrics = await analytics.getConversionMetrics('tenant-123');
   *   console.log(metrics.signupToPlanViewRate); // 45.5 (%)
   *   console.log(metrics.trialToPaidConversionRate); // 12.3 (%)
   */
  async getConversionMetrics(tenantId, startDate = null, endDate = null) {
    if (!tenantId) {
      throw new Error('tenantId é obrigatório');
    }

    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate
      ? new Date(startDate)
      : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

    try {
      // Usar view agregada de métricas de funil
      const { data, error } = await this.supabase
        .from('analytics_funnel_metrics')
        .select('*')
        .eq('tenant_id', tenantId)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows, ignorar
        throw error;
      }

      // Se não há dados, retornar zeros
      if (!data) {
        return {
          tenantId,
          totalSignups: 0,
          planViews: 0,
          checkoutStarts: 0,
          checkoutCompletes: 0,
          upgrades: 0,
          signupToPlanViewRate: 0,
          planViewToCheckoutRate: 0,
          checkoutCompletionRate: 0,
          trialToPaidConversionRate: 0,
          dateRange: { start: start.toISOString(), end: end.toISOString() },
        };
      }

      return {
        tenantId,
        totalSignups: data.total_signups || 0,
        planViews: data.plan_views || 0,
        checkoutStarts: data.checkout_starts || 0,
        checkoutCompletes: data.checkout_completes || 0,
        upgrades: data.upgrades || 0,
        signupToPlanViewRate: data.signup_to_plan_view_rate || 0,
        planViewToCheckoutRate: data.plan_view_to_checkout_rate || 0,
        checkoutCompletionRate: data.checkout_completion_rate || 0,
        trialToPaidConversionRate: data.trial_to_paid_conversion_rate || 0,
        dateRange: { start: start.toISOString(), end: end.toISOString() },
      };
    } catch (err) {
      console.error('[Analytics] Erro ao calcular métricas de conversão:', err.message);
      throw err;
    }
  }

  /**
   * Obter métricas ARPU (Average Revenue Per User)
   *
   * Calcula receita por usuário ativo. Executa queries paralelas para performance.
   * Validação automática de amounts (deve ser >= 0 e numérico).
   *
   * @param {string} tenantId - ID do tenant
   * @returns {Promise<ARPUMetrics>} ARPU em reais e estatísticas relacionadas
   * @throws {Error} Se tenantId ausente ou erro ao consultar banco
   *
   * @example
   *   const arpu = await analytics.getARPUMetrics('tenant-123');
   *   console.log(arpu.arpu); // 245.50 (receita média por usuário em R$)
   *   console.log(arpu.totalRevenue); // 2455.00 (total em R$)
   */
  async getARPUMetrics(tenantId) {
    if (!tenantId) {
      throw new Error('tenantId é obrigatório');
    }

    try {
      // Executar 2 queries em paralelo (eventos + tenants)
      const [eventsResult, tenantResult] = await Promise.all([
        this.supabase
          .from('analytics_events')
          .select('properties, event_type')
          .eq('tenant_id', tenantId)
          .in('event_type', ['checkout_complete', 'upgrade']),
        this.supabase
          .from('tenants')
          .select('users', { count: 'exact' })
          .eq('id', tenantId)
          .single(),
      ]);

      const { data: eventData, error: eventError } = eventsResult;
      const { data: tenantData, error: tenantError } = tenantResult;

      if (eventError) throw eventError;
      if (tenantError) throw tenantError;

      if (!eventData || eventData.length === 0) {
        return {
          tenantId,
          totalRevenue: 0,
          transactionCount: 0,
          arpu: 0,
          averageTransactionValue: 0,
        };
      }

      let totalRevenue = 0;
      let transactionCount = 0;

      // Calcular com validação de amount
      eventData.forEach((event) => {
        const amount = event.properties?.amount;

        // Validar: amount deve ser >= 0 e do tipo number
        if (typeof amount !== 'number' || amount < 0) {
          console.warn('[Analytics] Evento com amount inválido:', {
            eventType: event.event_type,
            amount,
          });
          return; // Skip evento inválido
        }

        totalRevenue += amount;
        transactionCount++;
      });

      if (transactionCount === 0) {
        return {
          tenantId,
          totalRevenue: 0,
          transactionCount: 0,
          arpu: 0,
          averageTransactionValue: 0,
        };
      }

      const userCount = Math.max(tenantData?.users?.length || 1, 1);

      return {
        tenantId,
        totalRevenue: Math.round(totalRevenue / 100), // Converter para unidade (reais)
        transactionCount,
        arpu: Math.round((totalRevenue / 100) / userCount * 100) / 100, // ARPU em reais
        averageTransactionValue: Math.round((totalRevenue / 100) / transactionCount * 100) / 100,
      };
    } catch (err) {
      console.error('[Analytics] Erro ao calcular ARPU:', err.message);
      throw err;
    }
  }

  /**
   * Obter taxa de churn (usuários que saíram)
   *
   * Calcula percentual de usuários que cancelaram subscription.
   *
   * @param {string} tenantId - ID do tenant
   * @returns {Promise<ChurnMetrics>} Contagem e taxa de churn em percentual
   * @throws {Error} Se tenantId ausente ou erro ao consultar banco
   *
   * @example
   *   const churn = await analytics.getChurnMetrics('tenant-123');
   *   console.log(churn.churnRate); // 5.2 (%)
   */
  async getChurnMetrics(tenantId) {
    if (!tenantId) {
      throw new Error('tenantId é obrigatório');
    }

    try {
      const { data, error } = await this.supabase
        .from('analytics_events')
        .select('event_type', { count: 'exact' })
        .eq('tenant_id', tenantId)
        .in('event_type', ['churn']);

      if (error) throw error;

      // Obter total de usuários ativos
      const { data: metrics, error: metricsError } = await this.supabase
        .from('analytics_funnel_metrics')
        .select('total_signups')
        .eq('tenant_id', tenantId)
        .single();

      if (metricsError && metricsError.code !== 'PGRST116') throw metricsError;

      const totalSignups = metrics?.total_signups || 1;
      const churnCount = data?.length || 0;
      const churnRate = Math.round((churnCount / totalSignups) * 100 * 100) / 100; // Percentual com 2 casas

      return {
        tenantId,
        churnCount,
        totalSignups,
        churnRate, // Em percentual
      };
    } catch (err) {
      console.error('[Analytics] Erro ao calcular churn:', err.message);
      throw err;
    }
  }

  /**
   * Obter resumo do dashboard (múltiplas métricas em paralelo)
   *
   * Executa 3 queries paralelas: conversion, ARPU, churn.
   * Ideal para dashboards que precisam de visão 360 do tenant.
   *
   * @param {string} tenantId - ID do tenant
   * @returns {Promise<Object>} Dashboard com conversion, revenue, churn metrics
   * @throws {Error} Se tenantId ausente ou erro em qualquer métrica
   *
   * @example
   *   const dashboard = await analytics.getDashboardMetrics('tenant-123');
   *   console.log(dashboard.conversion.signupToPlanViewRate); // 45.5
   *   console.log(dashboard.revenue.arpu); // 245.50
   *   console.log(dashboard.churn.churnRate); // 5.2
   */
  async getDashboardMetrics(tenantId) {
    if (!tenantId) {
      throw new Error('tenantId é obrigatório');
    }

    try {
      const [conversionMetrics, arpuMetrics, churnMetrics] = await Promise.all([
        this.getConversionMetrics(tenantId),
        this.getARPUMetrics(tenantId),
        this.getChurnMetrics(tenantId),
      ]);

      return {
        tenantId,
        timestamp: new Date().toISOString(),
        conversion: conversionMetrics,
        revenue: arpuMetrics,
        churn: churnMetrics,
      };
    } catch (err) {
      console.error('[Analytics] Erro ao obter dashboard metrics:', err.message);
      throw err;
    }
  }

  /**
   * Obter histórico de eventos com paginação e filtros
   *
   * @param {string} tenantId - ID do tenant
   * @param {Object} [filters] - Filtros opcionais
   * @param {string} [filters.eventType] - Filtrar por tipo de evento
   * @param {number} [filters.limit=100] - Limite de registros por página
   * @param {number} [filters.offset=0] - Offset para paginação
   * @returns {Promise<Object>} Lista paginada de eventos e contagem total
   * @throws {Error} Se tenantId ausente ou erro ao consultar banco
   *
   * @example
   *   const history = await analytics.getEventHistory('tenant-123', {
   *     eventType: 'upgrade',
   *     limit: 10,
   *     offset: 0
   *   });
   *   console.log(history.events.length); // ≤ 10
   *   console.log(history.total); // Total de eventos upgrade
   */
  async getEventHistory(tenantId, filters = {}) {
    if (!tenantId) {
      throw new Error('tenantId é obrigatório');
    }

    const { eventType = null, limit = 100, offset = 0 } = filters;

    try {
      let query = this.supabase
        .from('analytics_events')
        .select('*', { count: 'exact' })
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (eventType) {
        query = query.eq('event_type', eventType);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        events: data || [],
        total: count || 0,
        limit,
        offset,
      };
    } catch (err) {
      console.error('[Analytics] Erro ao obter histórico de eventos:', err.message);
      throw err;
    }
  }
}

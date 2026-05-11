/**
 * @typedef {Object} Plan
 * @property {string} id - ID do plano ('trial', 'starter', 'pro', 'enterprise')
 * @property {string} name - Nome exibível
 * @property {string} description - Descrição do plano
 * @property {Object} price - Informação de preço
 * @property {string} price.currency - Moeda (ex: 'BRL')
 * @property {number|null} price.amount - Valor em centavos (null para enterprise)
 * @property {string} price.formatted - Preço formatado (ex: 'R$ 99,00')
 * @property {number|null} credits - Créditos mensais (null para enterprise)
 * @property {number} maxInstances - Máximo de instâncias
 * @property {Object} features - Features desbloqueadas do plano
 * @property {number} displayOrder - Ordem de exibição na página de planos
 */

/**
 * @typedef {Object} Subscription
 * @property {string} subscriptionId - ID da subscription
 * @property {string} status - Status ('authorized', 'pending', 'cancelled', etc)
 * @property {string} planId - ID do plano ativo
 * @property {string} currentPeriodStart - Início do período atual (ISO 8601)
 * @property {string} currentPeriodEnd - Fim do período atual (ISO 8601)
 */

/**
 * @typedef {Object} WebhookEvent
 * @property {string} external_event_id - ID externo do evento (idempotência)
 * @property {string} event_type - Tipo ('payment_status_update', 'chargeback', etc)
 * @property {string} tenant_id - ID do tenant
 * @property {Object} data - Payload do evento
 * @property {string} [data.transaction_id] - ID da transação
 * @property {string} [data.status] - Status da transação
 * @property {number} [data.amount] - Valor em centavos
 */

/**
 * Rotas de Billing — Integração Webhooks + Refunds + Métricas
 *
 * Funções exportadas para uso no gateway.mjs:
 * - handleWebhookGetnet() — Processar webhooks com validação HMAC
 * - getWebhookHistory() — Histórico de webhooks processados
 * - getRefundHistory() — Histórico de reembolsos
 * - getMetricsStats() — Estatísticas de webhooks e pagamentos
 * - getHealthCheck() — Status de saúde do sistema
 * - getAuditReport() — Relatório de auditoria
 * - subscribeUser() — Criar subscription
 * - getFeatures() — Features do plano ativo
 *
 * Todas as funções de GET aceitam query params de filtro.
 * Todas suportam multi-tenant via RLS Supabase.
 *
 * @module routes-billing
 */

/**
 * Processar webhook de pagamento com validação HMAC
 *
 * Valida assinatura via HMAC-SHA256. Processa idempotentemente.
 * Se event_type === 'payment_status_update', processa atualização de status.
 * Se event_type === 'chargeback', processa reembolso.
 *
 * @param {Object} req - Request HTTP Node.js
 * @param {Object} res - Response HTTP Node.js
 * @param {Object} webhookService - Instância de WebhookService
 * @param {Object} auditService - Instância de AuditService (opcional)
 * @param {string} pathname - Caminho da rota (ex: '/api/webhooks/getnet')
 * @param {Function} json - Função para serializar resposta
 * @returns {Promise<void>} Retorna 200 OK imediatamente, processa async
 *
 * @example
 *   // Em gateway.mjs
 *   await handleWebhookGetnet(
 *     req, res,
 *     webhookService,
 *     auditService,
 *     pathname,
 *     json
 *   );
 *
 * @throws {Error} Se GETNET_WEBHOOK_SECRET não configurado em produção
 */
export async function handleWebhookGetnet(req, res, webhookService, auditService, pathname, json) {
  if (pathname !== '/api/webhooks/getnet' || req.method !== 'POST') {
    return null;
  }

  const rawBodyChunks = [];
  req.on('data', c => rawBodyChunks.push(c));
  req.on('end', async () => {
    const rawBody = Buffer.concat(rawBodyChunks).toString();

    // Validação de autenticidade do webhook.
    // Preferência: HMAC via GETNET_WEBHOOK_SECRET, quando a adquirente enviar assinatura.
    // Mitigação para Getnet Plataforma Digital: o Portal Minha Conta permite configurar
    // URLs de callback, mas nem sempre expõe segredo/header de assinatura. Nesse caso,
    // aceitar callback sem assinatura apenas com flag explícita e auditar/idempotenciar.
    const WEBHOOK_SECRET = process.env.GETNET_WEBHOOK_SECRET || '';
    const allowUnsignedWebhook = process.env.GETNET_WEBHOOK_ALLOW_UNSIGNED === 'true';
    const signature = req.headers['x-getnet-signature'] || req.headers['x-signature'] || '';

    if (!WEBHOOK_SECRET && process.env.NODE_ENV === 'production' && !allowUnsignedWebhook) {
      return json(res, 503, { error: 'GETNET_WEBHOOK_SECRET não configurado' }, null);
    }

    let isValid = true;
    if (WEBHOOK_SECRET && !signature) {
      isValid = false;
    } else if (WEBHOOK_SECRET && signature) {
      const crypto = await import('node:crypto');
      const expected = crypto.createHmac('sha256', WEBHOOK_SECRET).update(rawBody).digest('hex');
      try {
        const sigBuf = Buffer.from(signature, 'hex');
        const expBuf = Buffer.from(expected, 'hex');
        if (sigBuf.length !== expBuf.length) isValid = false;
        else isValid = crypto.timingSafeEqual(sigBuf, expBuf);
      } catch {
        isValid = (signature === expected);
      }
    }

    if (!isValid) {
      return json(res, 401, { error: 'Invalid signature' }, null);
    }

    let parsedBody;
    try { parsedBody = JSON.parse(rawBody); } catch { parsedBody = {}; }

    json(res, 200, { ok: true }, null);

    try {
      const { external_event_id, event_type, data: payload } = parsedBody;
      const tenantId = parsedBody.tenant_id || payload?.tenant_id;

      if (!tenantId || !external_event_id) {
        console.warn('[Webhook] Missing tenantId or external_event_id');
        return;
      }

      // CRÍTICO #4 FIX: Usar RPC para processar webhook de forma atômica
      // process_webhook_transaction garante atomicidade: INSERT webhook + UPDATE subscription tudo ou nada
      // Substituiu: webhookService.processWebhookIdempotent() + processPaymentStatusUpdate() + processChargeback()
      //
      // Schema do RPC validado contra migration 010 + 019:
      //   - UNIQUE(tenant_id, external_event_id) ← composto
      //   - SECURITY DEFINER ignora RLS
      //   - Marca webhook_events.status='success' após UPDATE subscription
      //
      // Fallback: se RPC não existir (migration 019 não aplicada), usar caminho legado
      const sb = webhookService?.supabase;
      if (!sb) {
        console.error('[Webhook] webhookService.supabase indisponível, abortando');
        return;
      }

      const { data: result, error } = await sb.rpc('process_webhook_transaction', {
        p_tenant_id: tenantId,
        p_external_event_id: external_event_id,
        p_event_type: event_type || 'payment_status_update',
        p_payload: payload || {},
      });

      // Fallback para código legado se RPC não estiver disponível (migration não aplicada)
      if (error) {
        const isMissingRpc = error.code === 'PGRST202' || /function .* does not exist/i.test(error.message || '');
        if (isMissingRpc) {
          console.warn('[Webhook] RPC indisponível, usando caminho legado:', error.message);

          const webhook = await webhookService.processWebhookIdempotent(
            tenantId,
            external_event_id,
            event_type || 'payment_status_update',
            payload
          );

          if (webhook.status === 'success' && event_type === 'payment_status_update') {
            await webhookService.processPaymentStatusUpdate(
              tenantId,
              payload.transaction_id,
              payload.status,
              webhook.id
            );
          }

          if (event_type === 'chargeback' && webhook.status === 'success') {
            await webhookService.processChargeback(
              tenantId,
              payload.original_payment_id,
              payload.amount,
              webhook.id
            );
          }

          console.log('[Webhook] Processado (legado):', { tenantId, external_event_id, status: webhook.status });
          return;
        }

        console.error('[Webhook] RPC error:', error.message, error.code || '');
        return;
      }

      if (result && result.length > 0) {
        const { success, webhook_id, message } = result[0];
        console.log('[Webhook] Processado via RPC:', {
          tenantId,
          external_event_id,
          success,
          webhook_id,
          message,
        });
      }
    } catch (e) {
      console.error('[Webhook] Erro ao processar RPC:', e.message);
    }
  });
}

/**
 * Obter histórico de webhooks processados
 *
 * @param {Object} req - Request HTTP
 * @param {Object} res - Response HTTP
 * @param {Object} webhookService - Instância de WebhookService
 * @param {string} tenantId - ID do tenant (extraído de autenticação)
 * @param {Function} json - Função para serializar resposta
 * @returns {Promise<Object>} {webhooks: Array}
 *
 * @example
 *   GET /api/billing/webhooks?limit=20
 *   Response: {webhooks: [{id, status, event_type, ...}, ...]}
 */
export async function getWebhookHistory(req, res, webhookService, tenantId, json) {
  try {
    const limit = parseInt(new URL(req.url, 'http://localhost').searchParams.get('limit') || '50');
    const history = await webhookService.getWebhookHistory(tenantId, limit);
    return json(res, 200, { webhooks: history }, null);
  } catch (e) {
    return json(res, 500, { error: e.message }, null);
  }
}

/**
 * Obter histórico de reembolsos (refunds/chargebacks)
 *
 * @param {Object} req - Request HTTP
 * @param {Object} res - Response HTTP
 * @param {Object} webhookService - Instância de WebhookService
 * @param {string} tenantId - ID do tenant
 * @param {Function} json - Função para serializar resposta
 * @returns {Promise<Object>} {refunds: Array}
 *
 * @example
 *   GET /api/billing/refunds?limit=10
 *   Response: {refunds: [{id, original_payment_id, amount, ...}, ...]}
 */
export async function getRefundHistory(req, res, webhookService, tenantId, json) {
  try {
    const limit = parseInt(new URL(req.url, 'http://localhost').searchParams.get('limit') || '50');
    const refunds = await webhookService.getRefundHistory(tenantId, limit);
    return json(res, 200, { refunds }, null);
  } catch (e) {
    return json(res, 500, { error: e.message }, null);
  }
}

/**
 * Obter estatísticas de webhooks e pagamentos em período
 *
 * @param {Object} req - Request HTTP
 * @param {Object} res - Response HTTP
 * @param {Object} metricsService - Instância de MetricsService
 * @param {string} tenantId - ID do tenant
 * @param {Function} json - Função para serializar resposta
 * @returns {Promise<Object>} {webhookStats, paymentStats}
 *
 * @example
 *   GET /api/billing/metrics?startDate=2026-05-01&endDate=2026-05-08
 *   Response: {
 *     webhookStats: {received: 150, processed: 148, failed: 2, ...},
 *     paymentStats: {total: 15000, count: 10, average: 1500, ...}
 *   }
 */
export async function getMetricsStats(req, res, metricsService, tenantId, json) {
  try {
    const startDate = new URL(req.url, 'http://localhost').searchParams.get('startDate') || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const endDate = new URL(req.url, 'http://localhost').searchParams.get('endDate') || new Date().toISOString();

    const webhookStats = await metricsService.getWebhookStats(tenantId, startDate, endDate);
    const paymentStats = await metricsService.getPaymentStats(tenantId, startDate, endDate);

    return json(res, 200, { webhookStats, paymentStats }, null);
  } catch (e) {
    return json(res, 500, { error: e.message }, null);
  }
}

/**
 * Obter status de saúde do sistema de billing
 *
 * @param {Object} req - Request HTTP
 * @param {Object} res - Response HTTP
 * @param {Object} metricsService - Instância de MetricsService
 * @param {string} tenantId - ID do tenant
 * @param {Function} json - Função para serializar resposta
 * @returns {Promise<Object>} {status: 'healthy'|'degraded'|'critical', ...}
 *
 * @example
 *   GET /api/billing/health
 *   Response: {
 *     status: 'healthy',
 *     database: true,
 *     webhookQueue: true,
 *     lastCheck: '2026-05-08T...'
 *   }
 */
export async function getHealthCheck(req, res, metricsService, tenantId, json) {
  try {
    const health = await metricsService.getHealthCheck(tenantId);
    return json(res, 200, health, null);
  } catch (e) {
    return json(res, 500, { error: e.message }, null);
  }
}

/**
 * Obter relatório de auditoria de operações billing
 *
 * Inclui logs de todas as mudanças de subscription, refunds, etc.
 *
 * @param {Object} req - Request HTTP
 * @param {Object} res - Response HTTP
 * @param {Object} metricsService - Instância de MetricsService
 * @param {string} tenantId - ID do tenant
 * @param {Function} json - Função para serializar resposta
 * @returns {Promise<Object>} {auditReport: Array}
 *
 * @example
 *   GET /api/billing/audit?startDate=2026-04-08&endDate=2026-05-08
 *   Response: {
 *     auditReport: [
 *       {id, action, resource, timestamp, ...},
 *       ...
 *     ]
 *   }
 */
export async function getAuditReport(req, res, metricsService, tenantId, json) {
  try {
    const startDate = new URL(req.url, 'http://localhost').searchParams.get('startDate') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const endDate = new URL(req.url, 'http://localhost').searchParams.get('endDate') || new Date().toISOString();

    const report = await metricsService.getAuditReport(tenantId, startDate, endDate);
    return json(res, 200, { auditReport: report }, null);
  } catch (e) {
    return json(res, 500, { error: e.message }, null);
  }
}

/**
 * Obter status da fila de webhooks (admin only)
 *
 * Monitoramento de background jobs de processamento de webhooks.
 *
 * @param {Object} req - Request HTTP
 * @param {Object} res - Response HTTP
 * @param {Object} webhookQueueIntegration - Instância de WebhookQueueIntegration
 * @param {Function} json - Função para serializar resposta
 * @returns {Promise<Object>} {queueStatus, deadLetterQueue, timestamp}
 *
 * @example
 *   GET /api/billing/queue-status (admin only)
 *   Response: {
 *     queueStatus: {active: 45, pending: 12, failed: 2},
 *     deadLetterQueue: [{jobId, error, retries, ...}, ...],
 *     timestamp: '2026-05-08T...'
 *   }
 */
export async function getWebhookQueueStatus(req, res, webhookQueueIntegration, json) {
  try {
    if (!webhookQueueIntegration) {
      return json(res, 503, { error: 'Webhook queue not available' }, null);
    }

    const status = await webhookQueueIntegration.getQueueStatus();
    const dlq = await webhookQueueIntegration.getDeadLetterQueue();

    return json(res, 200, {
      queueStatus: status,
      deadLetterQueue: dlq,
      timestamp: new Date().toISOString(),
    }, null);
  } catch (e) {
    return json(res, 500, { error: e.message }, null);
  }
}

// ========================================================================
// PLANOS E SUBSCRIPTION — Tier 1 Billing (Trial, Starter, Pro)
// ========================================================================

/**
 * Obter lista completa de planos com preços e features
 *
 * Retorna 4 planos hardcodeados: trial (7 dias grátis), starter (R$99),
 * pro (R$299), enterprise (contato).
 *
 * @returns {Array<Plan>} Array de planos com features, preços e limites
 *
 * @example
 *   GET /api/billing/plans
 *   Response: [
 *     {
 *       id: 'trial',
 *       name: 'Trial',
 *       price: {currency: 'BRL', amount: 500, formatted: 'R$ 5,00'},
 *       features: {...},
 *       ...
 *     },
 *     ...
 *   ]
 */
export function getPlans() {
  return [
    {
      id: 'trial',
      name: 'Trial',
      description: 'Grátis por 7 dias',
      price: { currency: 'BRL', amount: 500, formatted: 'R$ 5,00' },
      credits: 100,
      maxInstances: 1,
      features: {
        canUseInbox: false,
        canUseWorkflows: false,
        canUseAnalytics: false,
        canAccessAPI: false,
        maxCampaignsActive: 1,
        support: 'email',
      },
      displayOrder: 0,
    },
    {
      id: 'starter',
      name: 'Starter',
      description: 'Ideal para começar com automação',
      price: { currency: 'BRL', amount: 9900, formatted: 'R$ 99,00' },
      credits: 10000,
      maxInstances: 5,
      features: {
        canUseInbox: true,
        canUseWorkflows: 'basic',
        canUseAnalytics: false,
        canAccessAPI: false,
        maxCampaignsActive: 10,
        support: 'email',
      },
      displayOrder: 1,
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Para quem quer escalar',
      price: { currency: 'BRL', amount: 29900, formatted: 'R$ 299,00' },
      credits: 50000,
      maxInstances: 20,
      features: {
        canUseInbox: true,
        canUseWorkflows: 'advanced',
        canUseAnalytics: true,
        canAccessAPI: true,
        maxCampaignsActive: 50,
        support: 'priority',
      },
      displayOrder: 2,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Solução customizada para grandes operações',
      price: { currency: 'BRL', amount: null, formatted: 'Personalizado' },
      credits: null,
      maxInstances: 999,
      features: {
        canUseInbox: true,
        canUseWorkflows: 'advanced',
        canUseAnalytics: true,
        canAccessAPI: true,
        maxCampaignsActive: 9999,
        support: 'dedicated',
        whiteLabel: true,
      },
      displayOrder: 3,
    },
  ];
}

/**
 * Criar nova subscription para tenant
 *
 * Para trial: cria subscription diretamente (7 dias).
 * Para outros: retorna URL de checkout (Stripe/Getnet).
 *
 * @param {Object} req - Request HTTP
 * @param {Object} res - Response HTTP
 * @param {string} tenantId - ID do tenant
 * @param {Object} supabase - Cliente Supabase
 * @param {Function} json - Função para serializar resposta
 * @returns {Promise<Subscription|Object>} Subscription criada ou redirect URL
 *
 * @example
 *   POST /api/billing/subscribe
 *   Body: {planId: 'starter'}
 *   Response: {
 *     redirect: true,
 *     checkoutUrl: '/checkout?plan=starter'
 *   }
 *
 * @example
 *   POST /api/billing/subscribe
 *   Body: {planId: 'trial'}
 *   Response: {
 *     subscriptionId: 'sub-123',
 *     status: 'authorized',
 *     planId: 'trial',
 *     currentPeriodEnd: '2026-05-15T...'
 *   }
 */
export async function subscribeUser(req, res, tenantId, supabase, json) {
  try {
    // IMPORTANTE #3 FIX: Usar req.body em vez de req.headers['x-body'] (anti-pattern)
    const body = req.body || {};
    const { planId, paymentMethodId } = body;

    if (!planId) {
      return json(res, 400, { error: 'planId é obrigatório' }, null);
    }

    const plans = getPlans();
    const plan = plans.find((p) => p.id === planId);
    if (!plan) {
      return json(res, 400, { error: 'Plano não encontrado' }, null);
    }

    // Se trial, criar subscription direto
    if (planId === 'trial') {
      const trialEnd = new Date();
      trialEnd.setDate(trialEnd.getDate() + 7);

      const { data, error } = await supabase
        .from('subscriptions')
        .insert([
          {
            tenant_id: tenantId,
            plan_id: planId,
            status: 'authorized',
            current_period_start: new Date().toISOString(),
            current_period_end: trialEnd.toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('[Subscribe] Erro ao criar trial subscription:', error);
        return json(res, 500, { error: 'Falha ao criar subscription' }, null);
      }

      return json(res, 201, {
        subscriptionId: data.id,
        status: data.status,
        planId: data.plan_id,
        currentPeriodStart: data.current_period_start,
        currentPeriodEnd: data.current_period_end,
      }, null);
    }

    // Se não trial, redireciona para checkout
    return json(res, 200, {
      redirect: true,
      checkoutUrl: `/checkout?plan=${planId}`,
      message: 'Redirecionar para checkout Stripe/Getnet',
    }, null);
  } catch (e) {
    console.error('[Subscribe] Erro:', e.message);
    return json(res, 500, { error: e.message }, null);
  }
}

/**
 * Obter subscription ativa do tenant
 *
 * Retorna plano e período atual. Vazio se nenhuma subscription.
 *
 * @param {Object} req - Request HTTP
 * @param {Object} res - Response HTTP
 * @param {string} tenantId - ID do tenant
 * @param {Object} supabase - Cliente Supabase
 * @param {Function} json - Função para serializar resposta
 * @returns {Promise<Object>} {subscription: Subscription|null}
 *
 * @example
 *   GET /api/billing/subscription
 *   Response: {
 *     subscription: {
 *       id: 'sub-123',
 *       plan_id: 'starter',
 *       status: 'authorized',
 *       current_period_start: '2026-05-01T...',
 *       current_period_end: '2026-06-01T...'
 *     }
 *   }
 */
export async function getSubscription(req, res, tenantId, supabase, json) {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('[GetSubscription] Erro:', error);
      return json(res, 500, { error: 'Falha ao buscar subscription' }, null);
    }

    if (!data) {
      return json(res, 200, { subscription: null }, null);
    }

    return json(res, 200, { subscription: data }, null);
  } catch (e) {
    return json(res, 500, { error: e.message }, null);
  }
}

/**
 * Obter features desbloqueadas para o tenant
 *
 * Baseado no plano ativo da subscription.
 *
 * @param {Object} req - Request HTTP
 * @param {Object} res - Response HTTP
 * @param {string} tenantId - ID do tenant
 * @param {Object} supabase - Cliente Supabase
 * @param {Function} json - Função para serializar resposta
 * @returns {Promise<Object>} {planId, features, maxInstances, credits}
 *
 * @example
 *   GET /api/billing/features
 *   Response: {
 *     planId: 'starter',
 *     features: {
 *       canUseInbox: true,
 *       canUseWorkflows: 'basic',
 *       canUseAnalytics: false,
 *       ...
 *     },
 *     maxInstances: 5,
 *     credits: 10000
 *   }
 */
export async function getFeatures(req, res, tenantId, supabase, json) {
  try {
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('plan_id')
      .eq('tenant_id', tenantId)
      .eq('status', 'authorized')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('[GetFeatures] Erro:', error);
      return json(res, 500, { error: 'Falha ao buscar features' }, null);
    }

    const planId = subscription?.plan_id || 'trial';
    const plans = getPlans();
    const plan = plans.find((p) => p.id === planId);

    if (!plan) {
      return json(res, 200, { features: {}, planId: 'trial' }, null);
    }

    return json(res, 200, {
      planId,
      features: plan.features,
      maxInstances: plan.maxInstances,
      credits: plan.credits,
    }, null);
  } catch (e) {
    return json(res, 500, { error: e.message }, null);
  }
}

/**
 * Validar acesso a um feature específico
 *
 * Retorna se feature está desbloqueado e motivo se negado.
 *
 * @param {Object} req - Request HTTP
 * @param {Object} res - Response HTTP
 * @param {string} tenantId - ID do tenant
 * @param {Object} supabase - Cliente Supabase
 * @param {Function} json - Função para serializar resposta
 * @returns {Promise<Object>} {allowed: boolean, feature, planId, value, reason?}
 *
 * @example
 *   POST /api/billing/validate-feature
 *   Body: {feature: 'canUseInbox'}
 *   Response: {
 *     allowed: true,
 *     feature: 'canUseInbox',
 *     planId: 'starter',
 *     value: true
 *   }
 *
 * @example
 *   POST /api/billing/validate-feature
 *   Body: {feature: 'canUseAnalytics'}
 *   Response: {
 *     allowed: false,
 *     feature: 'canUseAnalytics',
 *     planId: 'trial',
 *     value: false,
 *     reason: 'Feature canUseAnalytics não disponível no plano trial'
 *   }
 */
export async function validateFeature(req, res, tenantId, supabase, json) {
  try {
    // IMPORTANTE #3 FIX: Usar req.body em vez de req.headers['x-body'] (anti-pattern)
    const body = req.body || {};
    const { feature } = body;

    if (!feature) {
      return json(res, 400, { error: 'feature é obrigatório' }, null);
    }

    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('plan_id')
      .eq('tenant_id', tenantId)
      .eq('status', 'authorized')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      return json(res, 500, { error: 'Falha ao validar feature' }, null);
    }

    const planId = subscription?.plan_id || 'trial';
    const plans = getPlans();
    const plan = plans.find((p) => p.id === planId);

    if (!plan) {
      return json(res, 200, { allowed: false, reason: 'Plano não encontrado' }, null);
    }

    const featureValue = plan.features[feature];
    const allowed = featureValue !== false && featureValue !== undefined;

    return json(res, 200, {
      allowed,
      feature,
      planId,
      value: featureValue,
      reason: !allowed ? `Feature ${feature} não disponível no plano ${planId}` : undefined,
    }, null);
  } catch (e) {
    return json(res, 500, { error: e.message }, null);
  }
}

/**
 * Processar webhook com fila de jobs (versão com retry automático)
 *
 * Alternativa a handleWebhookGetnet que enfileira o job para processamento
 * assíncrono. Ideal para ambientes com alta carga ou processamento lento.
 *
 * @param {Object} req - Request HTTP
 * @param {Object} res - Response HTTP
 * @param {Object} webhookQueueIntegration - Instância de WebhookQueueIntegration
 * @param {string} pathname - Caminho da rota
 * @param {Function} json - Função para serializar resposta
 * @returns {Promise<void>} Retorna 202 Accepted imediatamente
 *
 * @example
 *   // Em gateway.mjs, para alta carga
 *   await handleWebhookGetnetWithQueue(
 *     req, res,
 *     webhookQueueIntegration,
 *     pathname,
 *     json
 *   );
 *
 * @throws {Error} Se não conseguir enfileirar o job
 */
export async function handleWebhookGetnetWithQueue(req, res, webhookQueueIntegration, pathname, json) {
  if (pathname !== '/api/webhooks/getnet' || req.method !== 'POST') {
    return null;
  }

  const rawBodyChunks = [];
  req.on('data', c => rawBodyChunks.push(c));
  req.on('end', async () => {
    const rawBody = Buffer.concat(rawBodyChunks).toString();

    const WEBHOOK_SECRET = process.env.GETNET_WEBHOOK_SECRET || '';
    const allowUnsignedWebhook = process.env.GETNET_WEBHOOK_ALLOW_UNSIGNED === 'true';
    const signature = req.headers['x-getnet-signature'] || req.headers['x-signature'] || '';

    if (!WEBHOOK_SECRET && process.env.NODE_ENV === 'production' && !allowUnsignedWebhook) {
      return json(res, 503, { error: 'GETNET_WEBHOOK_SECRET não configurado' }, null);
    }

    let isValid = true;
    if (WEBHOOK_SECRET && !signature) {
      isValid = false;
    } else if (WEBHOOK_SECRET && signature) {
      const crypto = await import('node:crypto');
      const expected = crypto.createHmac('sha256', WEBHOOK_SECRET).update(rawBody).digest('hex');
      try {
        const sigBuf = Buffer.from(signature, 'hex');
        const expBuf = Buffer.from(expected, 'hex');
        if (sigBuf.length !== expBuf.length) isValid = false;
        else isValid = crypto.timingSafeEqual(sigBuf, expBuf);
      } catch {
        isValid = (signature === expected);
      }
    }

    if (!isValid) {
      return json(res, 401, { error: 'Invalid signature' }, null);
    }

    let parsedBody;
    try { parsedBody = JSON.parse(rawBody); } catch { parsedBody = {}; }

    const { external_event_id, event_type, data: payload } = parsedBody;
    const tenantId = parsedBody.tenant_id || payload?.tenant_id;

    if (!tenantId || !external_event_id) {
      console.warn('[Webhook:Queue] Missing tenantId or external_event_id');
      return json(res, 400, { error: 'Missing tenantId or external_event_id' }, null);
    }

    try {
      const result = await webhookQueueIntegration.enqueuePaymentWebhook({
        tenantId,
        externalEventId: external_event_id,
        eventType: event_type || 'payment_status_update',
        payload,
        headers: {
          'x-signature': signature,
          'x-getnet-signature': req.headers['x-getnet-signature'],
        },
      });

      console.log('[Webhook:Queue] Enfileirado:', {
        tenantId,
        external_event_id,
        jobId: result.jobId,
      });

      return json(res, 202, {
        ok: true,
        received: true,
        queued: true,
        jobId: result.jobId,
        webhookId: result.webhookId,
        status: 'processing',
      }, null);
    } catch (error) {
      console.error('[Webhook:Queue] Erro ao enfileirar:', error.message);
      return json(res, 500, {
        ok: false,
        error: 'Failed to queue webhook',
        message: error.message,
      }, null);
    }
  });
}

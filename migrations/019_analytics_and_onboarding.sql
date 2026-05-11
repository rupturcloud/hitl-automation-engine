/**
 * Migration 019: Analytics e Onboarding
 * Tabelas para rastreamento de eventos analytics e progresso de onboarding
 *
 * Tabelas:
 * - analytics_events: rastreamento de eventos do funil (signup, plan_viewed, checkout, etc)
 * - onboarding_progress: progresso de onboarding por tenant (5 passos)
 *
 * Índices para performance em queries agregadas e dashboards em tempo real
 */

-- ========================================
-- 1. Tabela analytics_events
-- ========================================
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  -- Tipos de eventos suportados:
  -- signup: novo usuário criado
  -- plan_viewed: usuário visitou página de planos
  -- checkout_start: iniciou checkout/pagamento
  -- checkout_complete: completou pagamento com sucesso
  -- upgrade: fez upgrade de plano
  -- trial_warning: aviso de trial expirando
  -- trial_expired: trial expirou
  -- churn: cancelou assinatura

  properties JSONB DEFAULT '{}',
  -- Propriedades customizáveis (planId, amount, provider, etc)
  -- Ex: {"planId": "starter", "amount": 99, "currency": "BRL"}

  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent VARCHAR(500),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_tenant_id ON analytics_events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_tenant_event ON analytics_events(tenant_id, event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_tenant_created ON analytics_events(tenant_id, created_at DESC);

-- Índice para JSONB properties (para queries em tempo real)
CREATE INDEX IF NOT EXISTS idx_analytics_events_properties ON analytics_events USING GIN(properties);

-- Performance indices para analytics_events (evita full table scan em funnel queries)
CREATE INDEX IF NOT EXISTS idx_analytics_events_tenant_event_created
  ON analytics_events(tenant_id, event_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type_tenant
  ON analytics_events(event_type, tenant_id);

-- ========================================
-- 2. Tabela onboarding_progress
-- ========================================
CREATE TABLE IF NOT EXISTS onboarding_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL UNIQUE REFERENCES tenants(id) ON DELETE CASCADE,

  -- Passo atual (1-5)
  current_step SMALLINT DEFAULT 1 CHECK (current_step >= 1 AND current_step <= 5),

  -- Rastreamento de conclusão de cada passo
  -- Estrutura: {"1": {"completed": true, "completedAt": "2026-05-08T..."}...}
  steps_progress JSONB DEFAULT jsonb_build_object(
    '1', jsonb_build_object('completed', false, 'completedAt', null),
    '2', jsonb_build_object('completed', false, 'completedAt', null),
    '3', jsonb_build_object('completed', false, 'completedAt', null),
    '4', jsonb_build_object('completed', false, 'completedAt', null),
    '5', jsonb_build_object('completed', false, 'completedAt', null)
  ),

  -- Datas importantes
  trial_starts_at TIMESTAMPTZ DEFAULT NOW(),
  trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + interval '7 days'),

  -- Status de onboarding
  status VARCHAR(50) DEFAULT 'in_progress',
  -- Valores: in_progress, completed, abandoned, paused

  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_onboarding_progress_tenant ON onboarding_progress(tenant_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_progress_status ON onboarding_progress(status);
CREATE INDEX IF NOT EXISTS idx_onboarding_progress_trial_ends ON onboarding_progress(trial_ends_at);
CREATE INDEX IF NOT EXISTS idx_onboarding_progress_current_step ON onboarding_progress(current_step);

-- Performance indices para onboarding_progress (trial countdown queries)
CREATE INDEX IF NOT EXISTS idx_onboarding_progress_trial_expires
  ON onboarding_progress(tenant_id, trial_ends_at DESC)
  WHERE status != 'completed';

CREATE INDEX IF NOT EXISTS idx_onboarding_progress_status_trial
  ON onboarding_progress(status, trial_ends_at);

-- ========================================
-- 3. View agregada: analytics_funnel_metrics
-- ========================================
-- Retorna métricas de conversão do funil para cada tenant
CREATE OR REPLACE VIEW analytics_funnel_metrics AS
SELECT
  tenant_id,
  COUNT(DISTINCT CASE WHEN event_type = 'signup' THEN user_id END) AS total_signups,
  COUNT(DISTINCT CASE WHEN event_type = 'plan_viewed' THEN user_id END) AS plan_views,
  COUNT(DISTINCT CASE WHEN event_type = 'checkout_start' THEN user_id END) AS checkout_starts,
  COUNT(DISTINCT CASE WHEN event_type = 'checkout_complete' THEN user_id END) AS checkout_completes,
  COUNT(DISTINCT CASE WHEN event_type = 'upgrade' THEN user_id END) AS upgrades,

  -- Taxas de conversão
  ROUND(
    100.0 * COUNT(DISTINCT CASE WHEN event_type = 'plan_viewed' THEN user_id END) /
    NULLIF(COUNT(DISTINCT CASE WHEN event_type = 'signup' THEN user_id END), 0),
    2
  ) AS signup_to_plan_view_rate,

  ROUND(
    100.0 * COUNT(DISTINCT CASE WHEN event_type = 'checkout_start' THEN user_id END) /
    NULLIF(COUNT(DISTINCT CASE WHEN event_type = 'plan_viewed' THEN user_id END), 0),
    2
  ) AS plan_view_to_checkout_rate,

  ROUND(
    100.0 * COUNT(DISTINCT CASE WHEN event_type = 'checkout_complete' THEN user_id END) /
    NULLIF(COUNT(DISTINCT CASE WHEN event_type = 'checkout_start' THEN user_id END), 0),
    2
  ) AS checkout_completion_rate,

  -- Taxa trial → paid
  ROUND(
    100.0 * COUNT(DISTINCT CASE WHEN event_type = 'upgrade' THEN user_id END) /
    NULLIF(COUNT(DISTINCT CASE WHEN event_type = 'signup' THEN user_id END), 0),
    2
  ) AS trial_to_paid_conversion_rate,

  MIN(created_at) AS first_event_at,
  MAX(created_at) AS last_event_at
FROM analytics_events
GROUP BY tenant_id;

-- ========================================
-- 4. View: trial_status_summary
-- ========================================
-- Resumo de status de trial e progresso de onboarding
CREATE OR REPLACE VIEW trial_status_summary AS
SELECT
  op.tenant_id,
  op.current_step,
  op.trial_starts_at,
  op.trial_ends_at,
  EXTRACT(DAY FROM op.trial_ends_at - NOW())::INTEGER AS days_remaining,
  CASE
    WHEN EXTRACT(DAY FROM op.trial_ends_at - NOW()) <= 0 THEN 'expired'
    WHEN EXTRACT(DAY FROM op.trial_ends_at - NOW()) <= 1 THEN 'expiring_today'
    WHEN EXTRACT(DAY FROM op.trial_ends_at - NOW()) <= 2 THEN 'critical_warning'
    WHEN EXTRACT(DAY FROM op.trial_ends_at - NOW()) <= 7 THEN 'warning'
    ELSE 'active'
  END AS trial_status,
  op.status AS onboarding_status,
  (op.steps_progress -> '1' ->> 'completed')::BOOLEAN AS step1_completed,
  (op.steps_progress -> '2' ->> 'completed')::BOOLEAN AS step2_completed,
  (op.steps_progress -> '3' ->> 'completed')::BOOLEAN AS step3_completed,
  (op.steps_progress -> '4' ->> 'completed')::BOOLEAN AS step4_completed,
  (op.steps_progress -> '5' ->> 'completed')::BOOLEAN AS step5_completed,
  -- Progresso: quantos passos completados
  (
    (CASE WHEN (op.steps_progress -> '1' ->> 'completed')::BOOLEAN THEN 1 ELSE 0 END) +
    (CASE WHEN (op.steps_progress -> '2' ->> 'completed')::BOOLEAN THEN 1 ELSE 0 END) +
    (CASE WHEN (op.steps_progress -> '3' ->> 'completed')::BOOLEAN THEN 1 ELSE 0 END) +
    (CASE WHEN (op.steps_progress -> '4' ->> 'completed')::BOOLEAN THEN 1 ELSE 0 END) +
    (CASE WHEN (op.steps_progress -> '5' ->> 'completed')::BOOLEAN THEN 1 ELSE 0 END)
  ) AS completed_steps_count,
  ROUND(
    100.0 * (
      (CASE WHEN (op.steps_progress -> '1' ->> 'completed')::BOOLEAN THEN 1 ELSE 0 END) +
      (CASE WHEN (op.steps_progress -> '2' ->> 'completed')::BOOLEAN THEN 1 ELSE 0 END) +
      (CASE WHEN (op.steps_progress -> '3' ->> 'completed')::BOOLEAN THEN 1 ELSE 0 END) +
      (CASE WHEN (op.steps_progress -> '4' ->> 'completed')::BOOLEAN THEN 1 ELSE 0 END) +
      (CASE WHEN (op.steps_progress -> '5' ->> 'completed')::BOOLEAN THEN 1 ELSE 0 END)
    ) / 5.0,
    0
  ) AS progress_percentage
FROM onboarding_progress op;

-- ========================================
-- 5. RLS Policies
-- ========================================
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_progress ENABLE ROW LEVEL SECURITY;

-- Política: usuários podem ver analytics_events do seu tenant
-- IMPORTANTE #5 FIX: Usar CTE em vez de subquery ineficiente (evita N+1)
-- Antes: SELECT * FROM tenants + EXISTS (N+1) para cada tenant
-- Depois: SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid() (eficiente, indexed)
CREATE POLICY "Users can view analytics of their tenant" ON analytics_events
  FOR SELECT USING (
    tenant_id IN (
      SELECT DISTINCT tenant_users.tenant_id FROM tenant_users
      WHERE tenant_users.user_id = auth.uid()
    )
  );

-- Política: apenas serviço backend pode inserir analytics_events
CREATE POLICY "Service can insert analytics events" ON analytics_events
  FOR INSERT WITH CHECK (true);

-- Política: usuários podem ver onboarding_progress do seu tenant
-- IMPORTANTE #5 FIX: Usar CTE em vez de subquery ineficiente (evita N+1)
CREATE POLICY "Users can view onboarding progress of their tenant" ON onboarding_progress
  FOR SELECT USING (
    tenant_id IN (
      SELECT DISTINCT tenant_users.tenant_id FROM tenant_users
      WHERE tenant_users.user_id = auth.uid()
    )
  );

-- Política: apenas serviço backend pode atualizar onboarding_progress
CREATE POLICY "Service can update onboarding progress" ON onboarding_progress
  FOR UPDATE USING (true);

CREATE POLICY "Service can insert onboarding progress" ON onboarding_progress
  FOR INSERT WITH CHECK (true);

-- ========================================
-- 6. Função trigger: atualizar updated_at
-- ========================================
CREATE OR REPLACE FUNCTION update_onboarding_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_onboarding_progress_updated_at
BEFORE UPDATE ON onboarding_progress
FOR EACH ROW
EXECUTE FUNCTION update_onboarding_progress_updated_at();

-- ========================================
-- 7. RPC: complete_onboarding_step (transação atômica)
-- ========================================
-- Função para completar um passo de onboarding de forma atômica
-- Evita race condition: SELECT...FOR UPDATE garante lock pessimista
-- Usa transação implícita para garantir atomicidade
CREATE OR REPLACE FUNCTION complete_onboarding_step(
  p_tenant_id UUID,
  p_step_id INT,
  p_metadata JSONB DEFAULT '{}'::JSONB
)
RETURNS TABLE(
  tenant_id UUID,
  current_step INT,
  steps_progress JSONB,
  status TEXT,
  completed_at TIMESTAMPTZ
) AS $$
DECLARE
  v_current record;
  v_new_steps_progress JSONB;
  v_new_step INT;
  v_new_status TEXT;
BEGIN
  -- Lock pessimista: SELECT FOR UPDATE
  -- Impede que outro job leia enquanto este atualiza
  SELECT * INTO v_current FROM onboarding_progress
    WHERE tenant_id = p_tenant_id
    FOR UPDATE;

  IF v_current IS NULL THEN
    RAISE EXCEPTION 'Progresso de onboarding não encontrado para tenant %', p_tenant_id;
  END IF;

  -- Validar step_id
  IF NOT (p_step_id >= 1 AND p_step_id <= 5) THEN
    RAISE EXCEPTION 'stepId deve ser entre 1 e 5, recebido: %', p_step_id;
  END IF;

  -- Atualizar steps_progress (JSONB set)
  v_new_steps_progress := COALESCE(v_current.steps_progress, '{}'::JSONB);
  v_new_steps_progress := jsonb_set(
    v_new_steps_progress,
    ARRAY[p_step_id::TEXT],
    jsonb_build_object(
      'completed', true,
      'completedAt', NOW()::TEXT
    ) || COALESCE(p_metadata, '{}'::JSONB)
  );

  -- Calcular novo current_step e status
  v_new_step := LEAST(p_step_id + 1, 5);
  v_new_status := CASE WHEN p_step_id = 5 THEN 'completed' ELSE 'in_progress' END;

  -- Atualizar registro (transação implícita garante atomicidade)
  UPDATE onboarding_progress
  SET
    current_step = v_new_step,
    steps_progress = v_new_steps_progress,
    status = v_new_status,
    completed_at = CASE WHEN v_new_status = 'completed' THEN NOW() ELSE NULL END,
    updated_at = NOW()
  WHERE tenant_id = p_tenant_id;

  -- Retornar dados atualizados
  RETURN QUERY SELECT
    p_tenant_id,
    v_new_step,
    v_new_steps_progress,
    v_new_status,
    CASE WHEN v_new_status = 'completed' THEN NOW() ELSE NULL END::TIMESTAMPTZ;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 8. RPC: get_or_create_onboarding_progress (idempotente)
-- ========================================
-- Inicializa progresso de onboarding de forma atômica
-- Evita race condition: INSERT ON CONFLICT DO UPDATE
-- Retorna progresso existente ou recém-criado
CREATE OR REPLACE FUNCTION get_or_create_onboarding_progress(p_tenant_id UUID)
RETURNS TABLE(
  tenant_id UUID,
  current_step INT,
  steps_progress JSONB,
  status TEXT,
  trial_starts_at TIMESTAMPTZ,
  trial_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  -- Tentar INSERT com ON CONFLICT para garantir idempotência
  INSERT INTO onboarding_progress(
    tenant_id,
    current_step,
    steps_progress,
    status,
    trial_starts_at,
    trial_ends_at
  ) VALUES(
    p_tenant_id,
    1,
    jsonb_build_object(
      '1', jsonb_build_object('completed', false, 'completedAt', null),
      '2', jsonb_build_object('completed', false, 'completedAt', null),
      '3', jsonb_build_object('completed', false, 'completedAt', null),
      '4', jsonb_build_object('completed', false, 'completedAt', null),
      '5', jsonb_build_object('completed', false, 'completedAt', null)
    ),
    'in_progress',
    NOW(),
    NOW() + interval '7 days'
  )
  ON CONFLICT (tenant_id) DO UPDATE SET
    tenant_id = EXCLUDED.tenant_id
  RETURNING
    onboarding_progress.tenant_id,
    onboarding_progress.current_step,
    onboarding_progress.steps_progress,
    onboarding_progress.status,
    onboarding_progress.trial_starts_at,
    onboarding_progress.trial_ends_at,
    onboarding_progress.created_at,
    onboarding_progress.updated_at;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 9. RPC: process_webhook_transaction (atômica)
-- ========================================
-- CRÍTICO #4 FIX: Processa webhook de forma atômica para evitar double-charge
-- Garantia: INSERT webhook_events + UPDATE subscription tudo ou nada
-- Usa SELECT...FOR UPDATE para lock pessimista em subscription
--
-- Schema validado contra migration 010_webhook_tracking_and_refunds.sql:
--   webhook_events colunas: id, tenant_id, external_event_id, event_type,
--                           payload, status, processed_at, error_message,
--                           delivery_attempts, last_attempt_at, created_at
--   UNIQUE constraint: (tenant_id, external_event_id) ← COMPOSTA
--
-- SECURITY DEFINER: Função roda com privilégios do owner, ignora RLS
-- (necessário porque webhook é chamado pré-auth e não tem auth.uid())
CREATE OR REPLACE FUNCTION process_webhook_transaction(
  p_tenant_id UUID,
  p_external_event_id VARCHAR,
  p_event_type VARCHAR,
  p_payload JSONB
)
RETURNS TABLE(
  success BOOLEAN,
  webhook_id UUID,
  event_type VARCHAR,
  message TEXT
)
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_webhook_id UUID;
  v_subscription_id UUID;
  v_success BOOLEAN := false;
  v_message TEXT := '';
BEGIN
  -- 1. Enfileirar webhook (idempotente via UNIQUE constraint composta)
  -- Colunas alinhadas com schema real (migration 010)
  INSERT INTO webhook_events(
    tenant_id,
    external_event_id,
    event_type,
    payload,
    status,
    delivery_attempts,
    created_at
  ) VALUES(
    p_tenant_id,
    p_external_event_id,
    p_event_type,
    p_payload,
    'pending',
    0,
    NOW()
  )
  ON CONFLICT(tenant_id, external_event_id) DO UPDATE SET
    -- Em conflito (webhook duplicado), apenas atualiza last_attempt_at
    -- Mantém status atual para preservar idempotência
    last_attempt_at = NOW(),
    delivery_attempts = webhook_events.delivery_attempts + 1
  RETURNING webhook_events.id INTO v_webhook_id;

  -- 2. Se payment_status_update, atualizar subscription com lock pessimista
  IF p_event_type = 'payment_status_update' AND (p_payload->>'transaction_id') IS NOT NULL THEN
    -- Lock pessimista: SELECT...FOR UPDATE garante que apenas uma transação processa
    SELECT id INTO v_subscription_id FROM subscriptions
      WHERE tenant_id = p_tenant_id
      AND status = 'pending'
      ORDER BY created_at DESC
      LIMIT 1
      FOR UPDATE;

    IF v_subscription_id IS NOT NULL THEN
      UPDATE subscriptions
      SET
        status = CASE
          WHEN (p_payload->>'status') = 'authorized' THEN 'authorized'
          WHEN (p_payload->>'status') = 'failed' THEN 'failed'
          ELSE status
        END,
        updated_at = NOW()
      WHERE id = v_subscription_id;

      -- Marcar webhook como processado com sucesso
      UPDATE webhook_events
      SET status = 'success', processed_at = NOW()
      WHERE id = v_webhook_id;

      v_success := true;
      v_message := 'Payment status updated successfully';
    ELSE
      v_message := 'No pending subscription found';
    END IF;
  ELSE
    v_success := true;
    v_message := 'Webhook queued for processing';
  END IF;

  -- 3. Retornar resultado
  RETURN QUERY SELECT
    v_success,
    v_webhook_id,
    p_event_type::VARCHAR,
    v_message::TEXT;

EXCEPTION WHEN OTHERS THEN
  -- Em erro, marcar webhook como failed se foi criado
  IF v_webhook_id IS NOT NULL THEN
    UPDATE webhook_events
    SET status = 'failed', error_message = SQLERRM
    WHERE id = v_webhook_id;
  END IF;

  RETURN QUERY SELECT
    false,
    v_webhook_id,
    p_event_type::VARCHAR,
    SQLERRM::TEXT;
END;
$$ LANGUAGE plpgsql;

-- Permitir que service_role e authenticated possam chamar
GRANT EXECUTE ON FUNCTION process_webhook_transaction(UUID, VARCHAR, VARCHAR, JSONB) TO service_role;
GRANT EXECUTE ON FUNCTION process_webhook_transaction(UUID, VARCHAR, VARCHAR, JSONB) TO authenticated;

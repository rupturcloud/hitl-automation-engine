-- ============================================================================
-- Migration 025 — Hardening de Segurança Consolidado (Ruptur SaaS)
-- ============================================================================
-- Idempotente. Pode rodar múltiplas vezes com segurança (IF NOT EXISTS / OR REPLACE).
-- Cobre:
--   A) Tabelas que o código novo já espera (proposal_payments, uazapi_*, campaign_events)
--   B) Índice de status de tenant (middleware tenant-active)
--   C) Fix da recursão infinita de RLS em platform_admins
--   D) RPC atômica de crédito/débito de saldo (anti-race / anti-saldo-negativo)
--   E) Coluna de status paused_low_credits em campaigns
-- ----------------------------------------------------------------------------

-- ===== A1. proposal_payments (webhook InfinitePay + idempotência) ============
CREATE TABLE IF NOT EXISTS public.proposal_payments (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id     TEXT NOT NULL,
  customer_email TEXT,
  customer_name  TEXT,
  amount_str     TEXT,
  raw_payload    JSONB,
  confirmed_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_proposal_payments_invoice UNIQUE (invoice_id)  -- idempotência do upsert
);
ALTER TABLE public.proposal_payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS proposal_payments_service ON public.proposal_payments;
CREATE POLICY proposal_payments_service ON public.proposal_payments
  FOR ALL TO service_role USING (true) WITH CHECK (true);
-- (sem política para anon/authenticated: contém PII de pagamento — só backend acessa)

-- ===== A2. uazapi_events (log imutável de eventos do webhook UAZAPI) =========
CREATE TABLE IF NOT EXISTS public.uazapi_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id TEXT NOT NULL,
  tenant_id   UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  event_type  TEXT NOT NULL,
  payload     JSONB NOT NULL DEFAULT '{}',
  received_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_uazapi_events_tenant   ON public.uazapi_events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_uazapi_events_instance ON public.uazapi_events(instance_id);
CREATE INDEX IF NOT EXISTS idx_uazapi_events_received ON public.uazapi_events(received_at DESC);
ALTER TABLE public.uazapi_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS uazapi_events_service ON public.uazapi_events;
CREATE POLICY uazapi_events_service ON public.uazapi_events
  FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS uazapi_events_tenant ON public.uazapi_events;
CREATE POLICY uazapi_events_tenant ON public.uazapi_events
  FOR SELECT TO authenticated
  USING (tenant_id IN (SELECT tenant_id FROM public.user_tenant_memberships WHERE user_id = auth.uid()));

-- ===== A3. uazapi_messages (mensagens WhatsApp com deduplicação) =============
CREATE TABLE IF NOT EXISTS public.uazapi_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id TEXT NOT NULL,
  tenant_id   UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  chat_id     TEXT NOT NULL,
  message_id  TEXT NOT NULL,
  direction   TEXT NOT NULL CHECK (direction IN ('in','out')),
  body        TEXT,
  media_url   TEXT,
  media_type  TEXT,
  status      TEXT NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending','sent','delivered','read','failed')),
  raw_payload JSONB,
  timestamp   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_uazapi_messages_instance_msg UNIQUE (instance_id, message_id)
);
CREATE INDEX IF NOT EXISTS idx_uazapi_messages_tenant    ON public.uazapi_messages(tenant_id);
CREATE INDEX IF NOT EXISTS idx_uazapi_messages_inst_chat ON public.uazapi_messages(instance_id, chat_id, timestamp DESC);
ALTER TABLE public.uazapi_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS uazapi_messages_service ON public.uazapi_messages;
CREATE POLICY uazapi_messages_service ON public.uazapi_messages
  FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS uazapi_messages_tenant ON public.uazapi_messages;
CREATE POLICY uazapi_messages_tenant ON public.uazapi_messages
  FOR SELECT TO authenticated
  USING (tenant_id IN (SELECT tenant_id FROM public.user_tenant_memberships WHERE user_id = auth.uid()));

CREATE OR REPLACE FUNCTION public.update_uazapi_messages_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
DROP TRIGGER IF EXISTS trg_uazapi_messages_updated_at ON public.uazapi_messages;
CREATE TRIGGER trg_uazapi_messages_updated_at
  BEFORE UPDATE ON public.uazapi_messages
  FOR EACH ROW EXECUTE FUNCTION public.update_uazapi_messages_updated_at();

-- ===== A4. campaign_events (credit-guard: log de pausas por crédito) =========
CREATE TABLE IF NOT EXISTS public.campaign_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID,
  tenant_id   UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  event_type  TEXT NOT NULL,
  details     JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_campaign_events_campaign ON public.campaign_events(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_events_tenant   ON public.campaign_events(tenant_id);
ALTER TABLE public.campaign_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS campaign_events_service ON public.campaign_events;
CREATE POLICY campaign_events_service ON public.campaign_events
  FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS campaign_events_tenant ON public.campaign_events;
CREATE POLICY campaign_events_tenant ON public.campaign_events
  FOR SELECT TO authenticated
  USING (tenant_id IN (SELECT tenant_id FROM public.user_tenant_memberships WHERE user_id = auth.uid()));

-- ===== B. Índice de status de tenant (middleware tenant-active) ==============
CREATE INDEX IF NOT EXISTS idx_tenants_id_status ON public.tenants(id, status);

-- ===== C. Fix recursão infinita de RLS em platform_admins ====================
-- Causa: política que faz SELECT em platform_admins dentro da própria política.
-- Solução: função SECURITY DEFINER (roda como owner, bypassa RLS → sem recursão).
CREATE OR REPLACE FUNCTION public.is_active_platform_admin(uid UUID)
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE
SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.platform_admins
    WHERE user_id = uid AND status = 'active'
  );
$$;
-- Recriar as políticas usando a função (sem subquery recursiva)
DROP POLICY IF EXISTS platform_admins_read  ON public.platform_admins;
DROP POLICY IF EXISTS platform_admins_write ON public.platform_admins;
DROP POLICY IF EXISTS platform_admins_self  ON public.platform_admins;
-- service_role (backend) faz tudo:
DROP POLICY IF EXISTS platform_admins_service ON public.platform_admins;
CREATE POLICY platform_admins_service ON public.platform_admins
  FOR ALL TO service_role USING (true) WITH CHECK (true);
-- admin autenticado lê a lista (sem recursão, via função):
CREATE POLICY platform_admins_read ON public.platform_admins
  FOR SELECT TO authenticated
  USING (public.is_active_platform_admin(auth.uid()));

-- ===== D. RPC atômica de saldo (anti-race / anti-saldo-negativo) =============
-- Substitui o padrão read-then-write em getnet.js/wallet/index.js.
-- Crédito: incrementa atômico. Débito: só debita se houver saldo (RETURNING checa).
CREATE OR REPLACE FUNCTION public.adjust_tenant_credits(
  p_tenant_id UUID,
  p_delta     NUMERIC,
  p_reason    TEXT DEFAULT NULL,
  p_reference TEXT DEFAULT NULL
) RETURNS TABLE(new_balance NUMERIC, applied BOOLEAN)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_new NUMERIC;
BEGIN
  IF p_delta >= 0 THEN
    -- Crédito: sempre aplica
    UPDATE public.tenants
       SET credits_balance = COALESCE(credits_balance,0) + p_delta,
           updated_at = now()
     WHERE id = p_tenant_id
     RETURNING credits_balance INTO v_new;
    IF v_new IS NULL THEN RETURN QUERY SELECT NULL::NUMERIC, false; RETURN; END IF;
    RETURN QUERY SELECT v_new, true;
  ELSE
    -- Débito: só se saldo suficiente (operação atômica via WHERE)
    UPDATE public.tenants
       SET credits_balance = credits_balance + p_delta,  -- p_delta é negativo
           updated_at = now()
     WHERE id = p_tenant_id
       AND COALESCE(credits_balance,0) >= ABS(p_delta)
     RETURNING credits_balance INTO v_new;
    IF v_new IS NULL THEN
      RETURN QUERY SELECT (SELECT credits_balance FROM public.tenants WHERE id = p_tenant_id), false;
      RETURN;
    END IF;
    RETURN QUERY SELECT v_new, true;
  END IF;
END; $$;
REVOKE ALL ON FUNCTION public.adjust_tenant_credits(UUID,NUMERIC,TEXT,TEXT) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.adjust_tenant_credits(UUID,NUMERIC,TEXT,TEXT) TO service_role;

-- ===== E. Status paused_low_credits em campaigns =============================
-- (idempotente: tenta adicionar o valor ao CHECK; ignora se já existe)
DO $$
BEGIN
  ALTER TABLE public.campaigns DROP CONSTRAINT IF EXISTS campaigns_status_check;
  ALTER TABLE public.campaigns ADD CONSTRAINT campaigns_status_check
    CHECK (status IN ('draft','scheduled','running','paused','paused_low_credits','completed','failed','cancelled'));
EXCEPTION WHEN others THEN
  RAISE NOTICE 'campaigns_status_check não ajustado (coluna/tabela pode diferir): %', SQLERRM;
END $$;

-- ===== Realtime para o Inbox (opcional — descomente se quiser push automático)
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.uazapi_messages;

-- ============================================================================
-- FIM. Verifique com:
--   SELECT tablename FROM pg_tables WHERE tablename IN
--   ('proposal_payments','uazapi_events','uazapi_messages','campaign_events');
-- ============================================================================

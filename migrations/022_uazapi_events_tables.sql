-- Migration 022 — Tabelas nativas para eventos e mensagens UAZAPI
-- Substitui dependência do Bubble para storage de mensagens WhatsApp
-- Habilita Realtime no InboxV2 via Supabase Realtime

-- ─── uazapi_events — log imutável de todos os eventos UAZAPI ─────────────────
CREATE TABLE IF NOT EXISTS public.uazapi_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id TEXT NOT NULL,
  tenant_id   UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  event_type  TEXT NOT NULL,
  payload     JSONB NOT NULL DEFAULT '{}',
  received_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_uazapi_events_tenant     ON public.uazapi_events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_uazapi_events_instance   ON public.uazapi_events(instance_id);
CREATE INDEX IF NOT EXISTS idx_uazapi_events_type       ON public.uazapi_events(event_type);
CREATE INDEX IF NOT EXISTS idx_uazapi_events_received   ON public.uazapi_events(received_at DESC);

ALTER TABLE public.uazapi_events ENABLE ROW LEVEL SECURITY;

-- Service role pode inserir/ler tudo (webhooks e backend)
CREATE POLICY uazapi_events_service ON public.uazapi_events
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Authenticated só vê eventos do próprio tenant
CREATE POLICY uazapi_events_tenant ON public.uazapi_events
  FOR SELECT TO authenticated
  USING (tenant_id IN (
    SELECT tenant_id FROM public.user_tenant_memberships WHERE user_id = auth.uid()
  ));

-- ─── uazapi_messages — mensagens WhatsApp com deduplicação ────────────────────
CREATE TABLE IF NOT EXISTS public.uazapi_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id TEXT NOT NULL,
  tenant_id   UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  chat_id     TEXT NOT NULL,
  message_id  TEXT NOT NULL,
  direction   TEXT NOT NULL CHECK (direction IN ('in', 'out')),
  body        TEXT,
  media_url   TEXT,
  media_type  TEXT,
  status      TEXT NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending', 'sent', 'delivered', 'read', 'failed')),
  raw_payload JSONB,
  timestamp   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Deduplicação: mesmo instance + message_id nunca duplica
  CONSTRAINT uq_uazapi_messages_instance_msg UNIQUE (instance_id, message_id)
);

CREATE INDEX IF NOT EXISTS idx_uazapi_messages_tenant   ON public.uazapi_messages(tenant_id);
CREATE INDEX IF NOT EXISTS idx_uazapi_messages_instance ON public.uazapi_messages(instance_id);
CREATE INDEX IF NOT EXISTS idx_uazapi_messages_chat     ON public.uazapi_messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_uazapi_messages_ts       ON public.uazapi_messages(timestamp DESC);
-- Índice composto para InboxV2 (busca por instância + chat)
CREATE INDEX IF NOT EXISTS idx_uazapi_messages_inst_chat ON public.uazapi_messages(instance_id, chat_id, timestamp DESC);

ALTER TABLE public.uazapi_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY uazapi_messages_service ON public.uazapi_messages
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY uazapi_messages_tenant ON public.uazapi_messages
  FOR SELECT TO authenticated
  USING (tenant_id IN (
    SELECT tenant_id FROM public.user_tenant_memberships WHERE user_id = auth.uid()
  ));

-- Trigger: updated_at automático
CREATE OR REPLACE FUNCTION public.update_uazapi_messages_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS trg_uazapi_messages_updated_at ON public.uazapi_messages;
CREATE TRIGGER trg_uazapi_messages_updated_at
  BEFORE UPDATE ON public.uazapi_messages
  FOR EACH ROW EXECUTE FUNCTION public.update_uazapi_messages_updated_at();

-- Habilitar Realtime para InboxV2 receber novas mensagens sem polling
-- Execute manualmente se necessário (requer permissão de superuser no Supabase):
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.uazapi_messages;

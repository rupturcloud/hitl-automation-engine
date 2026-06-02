-- ============================================================
-- 024: campaign_status_low_credits + campaign_events
--
-- 1. Adiciona valor 'paused_low_credits' ao CHECK constraint
--    do campo `status` na tabela `campaigns`.
--    (Tabela criada na migration 005 com status TEXT + CHECK)
--
-- 2. Cria tabela `campaign_events` para log de eventos
--    auditáveis durante o ciclo de vida da campanha.
--
-- Idempotente: usa IF NOT EXISTS / DROP CONSTRAINT IF EXISTS.
-- ============================================================

-- ──────────────────────────────────────────────
-- 1. Estender CHECK constraint de campaigns.status
-- ──────────────────────────────────────────────
-- Remover constraint existente (o nome foi gerado pelo Postgres em 005)
ALTER TABLE campaigns
  DROP CONSTRAINT IF EXISTS campaigns_status_check;

-- Recriar com o novo valor
ALTER TABLE campaigns
  ADD CONSTRAINT campaigns_status_check
  CHECK (status IN (
    'draft',
    'scheduled',
    'sending',
    'paused',
    'paused_low_credits',
    'completed',
    'failed',
    'cancelled'
  ));

-- ──────────────────────────────────────────────
-- 2. Tabela campaign_events
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS campaign_events (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id  UUID        NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  tenant_id    UUID        NOT NULL REFERENCES tenants(id)   ON DELETE CASCADE,

  -- Tipo do evento (ex: 'insufficient_credits', 'paused', 'resumed', 'completed')
  event_type   TEXT        NOT NULL,

  -- Dados extras em JSON livre (saldo no momento, sent_count, etc.)
  payload      JSONB       DEFAULT '{}',

  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para consulta por campanha e por tenant
CREATE INDEX IF NOT EXISTS idx_campaign_events_campaign  ON campaign_events(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_events_tenant    ON campaign_events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_campaign_events_type      ON campaign_events(event_type);
CREATE INDEX IF NOT EXISTS idx_campaign_events_created   ON campaign_events(created_at DESC);

-- RLS: cada tenant vê apenas seus próprios eventos
ALTER TABLE campaign_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY campaign_events_isolation ON campaign_events
  FOR ALL USING (
    tenant_id IN (
      SELECT tenant_id FROM user_tenant_memberships
      WHERE user_id = auth.uid()
    )
  );

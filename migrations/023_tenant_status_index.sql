-- Migration 023 — Índice para lookup rápido de tenant status
-- Usado em cada request autenticada pelo middleware tenant-active.mjs
-- Evita seq scan na tabela tenants (mesmo com cache de 60s, é boa prática)

CREATE INDEX IF NOT EXISTS idx_tenants_id_status ON public.tenants(id, status);

-- Comentário: o middleware tenant-active.mjs faz:
-- SELECT id, status FROM tenants WHERE id = $tenantId LIMIT 1
-- Com cache de 60s, o hit rate é > 99% — o índice só é relevante em cache miss.

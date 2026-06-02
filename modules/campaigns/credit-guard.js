/**
 * Credit Guard — Verificação de créditos para campanhas
 *
 * Comportamento:
 * - PRÉ-LAUNCH: bloqueia início se créditos < mensagens_estimadas
 * - DURANTE: a cada N envios re-verifica saldo. Se insuficiente, pausa.
 * - NOTIFICAÇÃO: salva evento em `campaign_events` com motivo 'insufficient_credits'
 * - ESTADO: campanha vai para 'paused_low_credits' (não 'failed')
 *
 * Thresholds:
 *   < 20% para completar → alerta (não bloqueia)
 *   = 0 créditos         → pausa imediata
 */

/** Quantos envios entre cada re-verificação de saldo */
const RECHECK_INTERVAL = 10;

/** Percentual do custo restante abaixo do qual emite alerta (mas não bloqueia) */
const ALERT_PCT = 0.2;

// ============================================================
//  Helpers internos
// ============================================================

/**
 * Lê saldo fresco diretamente do Supabase (sem cache).
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} tenantId
 * @returns {Promise<number>}
 */
async function fetchBalance(supabase, tenantId) {
  const { data, error } = await supabase
    .from('tenants')
    .select('credits_balance')
    .eq('id', tenantId)
    .single();

  if (error || !data) {
    throw new Error(`[CreditGuard] Falha ao ler saldo do tenant ${tenantId}: ${error?.message}`);
  }
  return data.credits_balance ?? 0;
}

/**
 * Persiste evento da campanha em `campaign_events`.
 * Ignora erros para não bloquear o fluxo principal.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} campaignId
 * @param {string} tenantId
 * @param {string} eventType
 * @param {Record<string,unknown>} payload
 */
async function logCampaignEvent(supabase, campaignId, tenantId, eventType, payload = {}) {
  try {
    await supabase.from('campaign_events').insert({
      campaign_id: campaignId,
      tenant_id: tenantId,
      event_type: eventType,
      payload,
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn(`[CreditGuard] Falha ao registrar evento ${eventType}:`, err.message);
  }
}

// ============================================================
//  API pública
// ============================================================

/**
 * Verificação PRÉ-LAUNCH.
 *
 * Lança erro se créditos < estimatedMessages (bloqueia início).
 * Retorna { ok, balance, estimatedMessages, alertLowCredits }.
 *
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} tenantId
 * @param {number} estimatedMessages
 * @returns {Promise<{ ok: boolean, balance: number, estimatedMessages: number, alertLowCredits: boolean }>}
 */
export async function checkCreditsBefore(supabase, tenantId, estimatedMessages) {
  const balance = await fetchBalance(supabase, tenantId);

  if (balance < estimatedMessages) {
    const shortage = estimatedMessages - balance;
    const err = new Error(
      `Créditos insuficientes: necessário ${estimatedMessages}, disponível ${balance} (faltam ${shortage})`
    );
    err.code = 'INSUFFICIENT_CREDITS';
    err.balance = balance;
    err.required = estimatedMessages;
    throw err;
  }

  const alertLowCredits = balance < estimatedMessages * (1 + ALERT_PCT);

  if (alertLowCredits) {
    console.warn(
      `[CreditGuard] Alerta pré-launch: saldo (${balance}) < 120% do custo estimado (${estimatedMessages})`
    );
  }

  return { ok: true, balance, estimatedMessages, alertLowCredits };
}

/**
 * Verificação DURANTE envio.
 *
 * Deve ser chamada a cada RECHECK_INTERVAL envios.
 * Se saldo zerado, atualiza status da campanha para 'paused_low_credits'
 * e registra evento. Retorna { shouldContinue, balance }.
 *
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} tenantId
 * @param {string} campaignId
 * @param {number} sentCount - Quantos enviados até agora (para decidir se é hora de re-verificar)
 * @returns {Promise<{ shouldContinue: boolean, balance: number|null }>}
 */
export async function checkCreditsOnProgress(supabase, tenantId, campaignId, sentCount) {
  // Só re-verifica a cada RECHECK_INTERVAL envios
  if (sentCount % RECHECK_INTERVAL !== 0) {
    return { shouldContinue: true, balance: null };
  }

  const balance = await fetchBalance(supabase, tenantId);

  if (balance <= 0) {
    console.error(
      `[CreditGuard] Créditos esgotados durante campanha ${campaignId}. Pausando.`
    );

    // Atualizar status da campanha
    const { error: updateErr } = await supabase
      .from('campaigns')
      .update({
        status: 'paused_low_credits',
        updated_at: new Date().toISOString(),
      })
      .eq('id', campaignId);

    if (updateErr) {
      console.error(`[CreditGuard] Falha ao pausar campanha ${campaignId}:`, updateErr.message);
    }

    // Registrar evento auditável
    await logCampaignEvent(supabase, campaignId, tenantId, 'insufficient_credits', {
      balance_at_pause: balance,
      sent_count: sentCount,
      reason: 'Créditos esgotados durante envio',
    });

    return { shouldContinue: false, balance };
  }

  return { shouldContinue: true, balance };
}

export { RECHECK_INTERVAL, ALERT_PCT };

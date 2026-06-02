/**
 * Webhook UAZAPI — Handler Nativo
 *
 * POST /api/webhooks/uazapi
 *
 * Substitui o handler legado em /api/bubble/validate que dependia do Bubble
 * como storage. Agora persiste eventos diretamente no Supabase.
 *
 * Eventos UAZAPI suportados (ref: https://doc.uazapi.com.br/webhooks):
 *   messages          — nova mensagem recebida/enviada
 *   messages_update   — atualização de status: DELIVERY_ACK, READ, etc.
 *   connection        — mudança de status da instância (open, close, connecting)
 *   presence          — presença do contato (composing, available, unavailable)
 *
 * Design:
 *   1. Identificar tenant via instance_id → instance_registry
 *   2. Salvar log imutável em uazapi_events (debug)
 *   3. Para "messages": upsert em uazapi_messages (aciona Realtime pro InboxV2)
 *   4. Para "connection": atualizar instance_registry.status
 *   5. Retornar sempre HTTP 200 (UAZAPI retenta se não receber 200)
 */

/**
 * Resolver tenant_id a partir do instance_id UAZAPI.
 * O campo remote_instance_id em instance_registry armazena o ID externo da instância.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} instanceId
 * @returns {Promise<{tenant_id: string|null, registry_id: string|null}>}
 */
async function resolveTenant(supabase, instanceId) {
  try {
    const { data, error } = await supabase
      .from('instance_registry')
      .select('id, tenant_provider_id, tenant_providers(tenant_id)')
      .eq('remote_instance_id', instanceId)
      .maybeSingle();

    if (error || !data) return { tenant_id: null, registry_id: null };

    const tenantId = data.tenant_providers?.tenant_id || null;
    return { tenant_id: tenantId, registry_id: data.id };
  } catch {
    return { tenant_id: null, registry_id: null };
  }
}

/**
 * Persistir log imutável do evento bruto para debug/auditoria.
 * Falha silenciosa — não deve bloquear o processamento do evento.
 */
async function logEvent(supabase, instanceId, tenantId, eventType, payload) {
  try {
    await supabase.from('uazapi_events').insert({
      instance_id: instanceId,
      tenant_id: tenantId,
      event_type: eventType,
      payload,
      received_at: new Date().toISOString(),
    });
  } catch (e) {
    console.warn('[UAZAPI webhook] falha ao salvar log de evento:', e.message);
  }
}

/**
 * Processar evento "messages" — nova mensagem recebida ou enviada.
 * Faz upsert em uazapi_messages pelo message_id externo.
 * O insert aciona Supabase Realtime para o InboxV2 receber em tempo real.
 *
 * Estrutura esperada do payload UAZAPI (simplificado):
 *   { key: { id, remoteJid, fromMe }, message: { conversation, ... }, messageType, ... }
 */
async function handleMessages(supabase, instanceId, tenantId, data) {
  const key = data?.key || {};
  const messageId = key.id || null;
  const chatId = key.remoteJid || data?.remoteJid || null;
  const fromMe = Boolean(key.fromMe);
  const direction = fromMe ? 'out' : 'in';

  // Extrair corpo da mensagem (texto simples ou caption de mídia)
  const msgContent = data?.message || {};
  const body =
    msgContent.conversation ||
    msgContent.extendedTextMessage?.text ||
    msgContent.imageMessage?.caption ||
    msgContent.videoMessage?.caption ||
    msgContent.documentMessage?.fileName ||
    null;

  const mediaUrl =
    msgContent.imageMessage?.url ||
    msgContent.videoMessage?.url ||
    msgContent.documentMessage?.url ||
    msgContent.audioMessage?.url ||
    null;

  const messageTimestamp = data?.messageTimestamp
    ? new Date(Number(data.messageTimestamp) * 1000).toISOString()
    : new Date().toISOString();

  // Upsert pelo message_id externo para evitar duplicatas
  const { error } = await supabase.from('uazapi_messages').upsert(
    {
      instance_id: instanceId,
      tenant_id: tenantId,
      chat_id: chatId,
      message_id: messageId,
      direction,
      body,
      media_url: mediaUrl,
      status: fromMe ? 'sent' : 'received',
      raw_payload: data,
      timestamp: messageTimestamp,
    },
    { onConflict: 'instance_id,message_id' }
  );

  if (error) {
    console.error('[UAZAPI webhook] erro ao salvar mensagem:', error.message);
    return false;
  }
  return true;
}

/**
 * Processar evento "messages_update" — atualização de status de entrega.
 * Status UAZAPI: PENDING → SENT → DELIVERY_ACK → READ → PLAYED (áudio)
 *
 * Estrutura esperada: [{ key: { id, remoteJid }, update: { status } }]
 */
async function handleMessagesUpdate(supabase, instanceId, tenantId, data) {
  // UAZAPI envia array de updates
  const updates = Array.isArray(data) ? data : [data];

  const STATUS_MAP = {
    PENDING: 'pending',
    SERVER_ACK: 'sent',
    DELIVERY_ACK: 'delivered',
    READ: 'read',
    PLAYED: 'played',
    INACTIVE: 'inactive',
  };

  for (const update of updates) {
    const messageId = update?.key?.id;
    const rawStatus = update?.update?.status;
    const status = STATUS_MAP[rawStatus] || rawStatus?.toLowerCase() || null;

    if (!messageId || !status) continue;

    await supabase
      .from('uazapi_messages')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('instance_id', instanceId)
      .eq('message_id', messageId);
  }
  return true;
}

/**
 * Processar evento "connection" — mudança de status da instância WhatsApp.
 * Atualiza instance_registry.status para refletir o estado atual.
 *
 * Status UAZAPI: open (conectado), close (desconectado), connecting (reconectando)
 */
async function handleConnection(supabase, instanceId, registryId, tenantId, data) {
  const state = data?.state || data?.connection || null;

  const STATUS_MAP = {
    open: 'connected',
    close: 'disconnected',
    connecting: 'connecting',
  };

  const newStatus = STATUS_MAP[state] || state;

  if (newStatus && registryId) {
    const { error } = await supabase
      .from('instance_registry')
      .update({
        status: newStatus,
        last_seen_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', registryId);

    if (error) {
      console.warn('[UAZAPI webhook] falha ao atualizar status da instância:', error.message);
    }
  }

  console.log(`[UAZAPI webhook] connection | instance: ${instanceId} | state: ${state} → ${newStatus}`);
  return true;
}

/**
 * POST /api/webhooks/uazapi
 *
 * Endpoint principal. Recebe todos os eventos UAZAPI.
 * Sem autenticação por token — segurança via secret no path ou header (futuro).
 * UAZAPI espera sempre HTTP 200; qualquer outro código causa retentativa.
 *
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {Function} json - helper json(res, status, data, req)
 * @param {object} body - payload já parseado pelo gateway
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 */
export async function handleUAZAPIWebhookNative(req, res, json, body, supabase) {
  // Garantir sempre HTTP 200 para evitar retentativas do UAZAPI
  const ok = (extra = {}) => json(res, 200, { received: true, ...extra }, req);

  if (!supabase) {
    console.error('[UAZAPI webhook] Supabase não configurado');
    return ok({ warning: 'supabase_not_configured' });
  }

  const event = body?.event || body?.type || null;
  const instanceId = body?.instance_id || body?.instanceName || body?.instance || null;
  const data = body?.data ?? body;

  if (!event || !instanceId) {
    console.warn('[UAZAPI webhook] payload sem event ou instance_id:', JSON.stringify(body).slice(0, 200));
    return ok({ warning: 'missing_event_or_instance_id' });
  }

  // 1. Resolver tenant via instance_id
  const { tenant_id: tenantId, registry_id: registryId } = await resolveTenant(supabase, instanceId);

  if (!tenantId) {
    console.warn(`[UAZAPI webhook] instância não encontrada: ${instanceId}`);
    // Retornar 200 mesmo assim — não queremos loops de retentativa para instâncias desconhecidas
    return ok({ warning: 'instance_not_found', instance_id: instanceId });
  }

  // 2. Log imutável do evento bruto (fire-and-forget)
  logEvent(supabase, instanceId, tenantId, event, body);

  // 3. Despachar para handler específico
  try {
    switch (event) {
      case 'messages':
      case 'message.new':
        await handleMessages(supabase, instanceId, tenantId, data);
        break;

      case 'messages_update':
      case 'messages.update':
      case 'message.update':
        await handleMessagesUpdate(supabase, instanceId, tenantId, data);
        break;

      case 'connection':
      case 'connection.update':
        await handleConnection(supabase, instanceId, registryId, tenantId, data);
        break;

      case 'presence':
      case 'presence.update':
        // Presença é volátil — apenas logada em uazapi_events (feito acima).
        // O InboxV2 pode ouvir via Realtime se quiser mostrar "digitando...".
        break;

      default:
        console.log(`[UAZAPI webhook] evento ignorado: ${event} | instance: ${instanceId}`);
    }

    console.log(`[UAZAPI webhook] ok | event: ${event} | instance: ${instanceId} | tenant: ${tenantId}`);
    return ok({ event, instance_id: instanceId, tenant_id: tenantId });

  } catch (e) {
    // Erro de processamento — log e retornar 200 para não acionar retentativa
    console.error(`[UAZAPI webhook] erro ao processar ${event}:`, e.message);
    return ok({ warning: 'processing_error', event });
  }
}

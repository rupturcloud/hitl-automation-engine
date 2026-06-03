/**
 * routes-inbox.mjs — Proxy autenticado para endpoints de Inbox via UAZAPI
 *
 * Arquitetura:
 *   Frontend → Gateway (auth + tenant isolation) → UAZAPI
 *
 * O token da instância nunca é exposto ao frontend.
 * Toda request é validada por tenant antes de chegar ao UAZAPI.
 *
 * Referências da spec UAZAPI (uazapi-openapi-spec.yaml):
 *   /chat/find         — busca chats com filtros ricos (operador, sort, paginação, labels, lead_status, etc.)
 *   /message/find      — busca mensagens de um chat com paginação (chatid, limit, offset, hasMore)
 *   /send/text         — envia mensagem de texto simples
 *   /send/media        — envia mídia (imagem, vídeo, áudio, documento)
 *   /message/markread  — marca mensagens como lidas
 *   /message/react     — reação a mensagem
 *   /chat/labels       — lista etiquetas disponíveis da instância
 *   /chat/editLead     — edita dados do lead (atribuição, tags, status ticket, kanban)
 *   /sse               — Server-Sent Events para tempo real (eventos: messages, messages_update, connection)
 *   /group/list        — lista grupos da instância
 *
 * Conexão com Bubble (legada):
 *   O módulo modules/inbox/index.js ainda usa BubbleClient para storage.
 *   Esse proxy bypassa o Bubble e chama UAZAPI diretamente — é a nova arquitetura.
 *   A tabela uazapi_chats no Supabase (referenciada em InboxV2.jsx) pode ser
 *   alimentada via webhook UAZAPI → /api/bubble/validate → Supabase (já implementado).
 *
 * Auth:
 *   - Endpoints regulares UAZAPI: header 'token' com remote_instance_id
 *   - Endpoints admin UAZAPI: header 'admintoken'
 *   - Aqui usamos remote_instance_id como token de instância (spec: "token" header)
 */

import { decryptSecret } from '../modules/providers/uazapi-account.service.js';
import { createUazapiAdapter } from '../modules/provider-adapter/uazapi-adapter.js';

// ─── Helper: resolve instância por tenant isolation ────────────────────────────
/**
 * Busca instância no Supabase validando que pertence ao tenant do usuário.
 * Retorna { token, serverUrl } prontos para usar no UazapiAdapter.
 *
 * Segurança: sem essa validação, um usuário poderia passar qualquer instanceKey
 * e acessar dados de outro tenant.
 */
async function resolveInstance(supabase, tenantId, instanceKey) {
  // 1. Validar que a instância existe e pertence ao tenant
  const { data: instance, error: iErr } = await supabase
    .from('instance_registry')
    .select('id, remote_instance_id, provider_account_id, status, instance_name')
    .eq('tenant_id', tenantId)
    .eq('remote_instance_id', instanceKey)
    .maybeSingle();

  if (iErr) throw new Error(`Erro ao buscar instância: ${iErr.message}`);
  if (!instance) throw new Error('Instância não encontrada ou sem acesso neste tenant');

  // 2. Buscar provider_account para obter server_url e admin_token_enc
  const { data: account, error: aErr } = await supabase
    .from('provider_accounts')
    .select('id, server_url, admin_token_enc')
    .eq('id', instance.provider_account_id)
    .maybeSingle();

  if (aErr) throw new Error(`Erro ao buscar provider account: ${aErr.message}`);
  if (!account) throw new Error('Provider account não encontrado');

  return {
    // remote_instance_id É o token da instância no UAZAPI
    // Spec: "Endpoints regulares requerem um header 'token' com o token da instância"
    token: instance.remote_instance_id,
    serverUrl: account.server_url || 'https://free.uazapi.com',
    adminToken: decryptSecret(account.admin_token_enc),
    instanceName: instance.instance_name,
    instanceDbId: instance.id,
  };
}

// ─── Helper: criar adapter UAZAPI para uma instância ───────────────────────────
async function getAdapterForInstance(supabase, tenantId, instanceKey) {
  const resolved = await resolveInstance(supabase, tenantId, instanceKey);
  const adapter = createUazapiAdapter({
    serverUrl: resolved.serverUrl,
    adminToken: resolved.adminToken,
    instanceToken: resolved.token,
  });
  return { adapter, resolved };
}

// ─── ROTA: GET /api/inbox/instances ────────────────────────────────────────────
/**
 * Lista instâncias WhatsApp do tenant com status real-time do UAZAPI.
 * Cada instância inclui: id, name, phone, status, serverUrl.
 * Usado pela sidebar do Inbox para montar o seletor de números.
 */
export async function handleGetInstances(req, res, json, supabase) {
  const tenantId = req.user?.tenantId || req.tenantId;
  if (!tenantId) return json(res, 403, { error: 'Tenant não identificado' }, req);

  try {
    const { data: instances, error } = await supabase
      .from('instance_registry')
      .select('id, remote_instance_id, instance_name, phone, status, platform, is_business, token_last4')
      .eq('tenant_id', tenantId)
      .neq('status', 'deleted')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return json(res, 200, {
      instances: (instances || []).map(i => ({
        id: i.id,
        key: i.remote_instance_id,
        name: i.instance_name,
        phone: i.phone,
        status: i.status,        // connected | disconnected | connecting
        platform: i.platform,
        isBusiness: i.is_business,
        tokenLast4: i.token_last4,
      })),
    }, req);
  } catch (e) {
    return json(res, 500, { error: e.message }, req);
  }
}

// ─── ROTA: POST /api/inbox/chats ───────────────────────────────────────────────
/**
 * Busca lista de chats (conversas) de uma instância com filtros ricos.
 *
 * Spec UAZAPI: POST /chat/find
 * Filtros disponíveis:
 *   - wa_isGroup: boolean — filtra grupos
 *   - wa_archived: boolean — arquivadas
 *   - wa_isPinned: boolean — fixadas
 *   - wa_label: string — por etiqueta
 *   - lead_isTicketOpen: boolean — ticket aberto/fechado
 *   - lead_assignedAttendant_id: string — por atendente
 *   - lead_status: string — por status do lead (ex: "~novo" para LIKE)
 *   - lead_tags: string — por tag
 *   - sort: string — ex: "-wa_lastMsgTimestamp" (mais recentes primeiro)
 *   - limit / offset — paginação
 *
 * Body esperado: { instanceKey, filters?: {...}, sort?, limit?, offset? }
 */
export async function handleFindChats(req, res, json, supabase) {
  const tenantId = req.user?.tenantId || req.tenantId;
  if (!tenantId) return json(res, 403, { error: 'Tenant não identificado' }, req);

  const { instanceKey, filters = {}, sort = '-wa_lastMsgTimestamp', offset = 0 } = req.body || {};
  // Cap de limite: cliente não pode forçar resposta gigante (DoS de memória/banda)
  const limit = Math.min(Math.max(parseInt(req.body?.limit) || 30, 1), 100);
  if (!instanceKey) return json(res, 400, { error: 'instanceKey obrigatório' }, req);

  try {
    const { adapter, resolved } = await getAdapterForInstance(supabase, tenantId, instanceKey);

    // Spec /chat/find: payload completo com operador AND, sort e paginação
    const payload = {
      operator: 'AND',
      sort,
      limit,
      offset,
      ...filters,  // wa_isGroup, wa_archived, lead_isTicketOpen, lead_assignedAttendant_id, etc.
    };

    const result = await adapter.findChats(resolved.token, payload);

    return json(res, 200, {
      chats: result.chats || [],
      pagination: result.pagination || {},
      totalStats: result.totalChatsStats || {},
      instanceKey,
    }, req);
  } catch (e) {
    return json(res, e.message?.includes('não encontrada') ? 404 : 500, { error: e.message }, req);
  }
}

// ─── ROTA: POST /api/inbox/messages ────────────────────────────────────────────
/**
 * Busca histórico de mensagens de um chat específico.
 *
 * Spec UAZAPI: POST /message/find
 * Parâmetros:
 *   - chatid: string — ID do chat (ex: "5511999999999@s.whatsapp.net")
 *   - limit: integer — máximo de mensagens (padrão: 50)
 *   - offset: integer — paginação (0 = mensagens mais recentes)
 *   - hasMore / nextOffset — retornados para paginação lazy
 *
 * Body esperado: { instanceKey, chatId, limit?, offset? }
 */
export async function handleFindMessages(req, res, json, supabase) {
  const tenantId = req.user?.tenantId || req.tenantId;
  if (!tenantId) return json(res, 403, { error: 'Tenant não identificado' }, req);

  const { instanceKey, chatId, offset = 0 } = req.body || {};
  // Cap de limite (DoS)
  const limit = Math.min(Math.max(parseInt(req.body?.limit) || 50, 1), 100);
  if (!instanceKey) return json(res, 400, { error: 'instanceKey obrigatório' }, req);
  if (!chatId) return json(res, 400, { error: 'chatId obrigatório' }, req);

  try {
    const { adapter, resolved } = await getAdapterForInstance(supabase, tenantId, instanceKey);

    // Spec /message/find: busca por chatid com paginação
    const result = await adapter.findMessages(resolved.token, {
      chatid: chatId,
      limit,
      offset,
    });

    return json(res, 200, {
      messages: result.messages || [],
      hasMore: result.hasMore || false,
      nextOffset: result.nextOffset || 0,
      total: result.returnedMessages || 0,
    }, req);
  } catch (e) {
    return json(res, e.message?.includes('não encontrada') ? 404 : 500, { error: e.message }, req);
  }
}

// ─── ROTA: POST /api/inbox/send ────────────────────────────────────────────────
/**
 * Envia mensagem (texto ou mídia) em nome de uma instância.
 *
 * Spec UAZAPI:
 *   POST /send/text  — texto simples, suporta formatação WhatsApp (*bold*, _italic_, etc.)
 *   POST /send/media — imagem, vídeo, áudio, documento (base64 ou URL)
 *
 * Body esperado:
 *   { instanceKey, to, type: 'text'|'image'|'video'|'audio'|'document', content, mediaUrl?, caption?, filename? }
 */
export async function handleSendMessage(req, res, json, supabase) {
  const tenantId = req.user?.tenantId || req.tenantId;
  if (!tenantId) return json(res, 403, { error: 'Tenant não identificado' }, req);

  const { instanceKey, to, type = 'text', content, mediaUrl, caption, filename, ...rest } = req.body || {};
  if (!instanceKey) return json(res, 400, { error: 'instanceKey obrigatório' }, req);
  if (!to) return json(res, 400, { error: 'to (número destinatário) obrigatório' }, req);

  try {
    const { adapter, resolved } = await getAdapterForInstance(supabase, tenantId, instanceKey);

    let result;
    if (type === 'text') {
      // Spec /send/text
      result = await adapter.sendText(resolved.token, { number: to, text: content, ...rest });
    } else {
      // Spec /send/media: image | video | audio | document
      result = await adapter.sendMedia(resolved.token, {
        number: to,
        mediatype: type,   // image, video, audio, document
        media: mediaUrl,   // URL ou base64
        caption: caption || content || '',
        filename: filename || '',
        ...rest,
      });
    }

    return json(res, 200, { sent: true, result }, req);
  } catch (e) {
    return json(res, e.message?.includes('não encontrada') ? 404 : 500, { error: e.message }, req);
  }
}

// ─── ROTA: POST /api/inbox/markread ────────────────────────────────────────────
/**
 * Marca mensagens como lidas (atualiza status no WhatsApp).
 *
 * Spec UAZAPI: POST /message/markread
 * Body esperado: { instanceKey, messageIds: string[] }
 */
export async function handleMarkRead(req, res, json, supabase) {
  const tenantId = req.user?.tenantId || req.tenantId;
  if (!tenantId) return json(res, 403, { error: 'Tenant não identificado' }, req);

  const { instanceKey, messageIds } = req.body || {};
  if (!instanceKey) return json(res, 400, { error: 'instanceKey obrigatório' }, req);
  if (!Array.isArray(messageIds) || !messageIds.length) return json(res, 400, { error: 'messageIds[] obrigatório' }, req);

  try {
    const { adapter, resolved } = await getAdapterForInstance(supabase, tenantId, instanceKey);
    const result = await adapter.markMessageRead(resolved.token, { id: messageIds });
    return json(res, 200, { marked: true, result }, req);
  } catch (e) {
    return json(res, 500, { error: e.message }, req);
  }
}

// ─── ROTA: POST /api/inbox/react ───────────────────────────────────────────────
/**
 * Reação a uma mensagem com emoji.
 *
 * Spec UAZAPI: POST /message/react
 * Body esperado: { instanceKey, messageId, emoji }
 */
export async function handleReact(req, res, json, supabase) {
  const tenantId = req.user?.tenantId || req.tenantId;
  if (!tenantId) return json(res, 403, { error: 'Tenant não identificado' }, req);

  const { instanceKey, messageId, emoji } = req.body || {};
  if (!instanceKey || !messageId || !emoji) return json(res, 400, { error: 'instanceKey, messageId e emoji obrigatórios' }, req);

  try {
    const { adapter, resolved } = await getAdapterForInstance(supabase, tenantId, instanceKey);
    const result = await adapter.reactToMessage(resolved.token, { id: messageId, reaction: emoji });
    return json(res, 200, { reacted: true, result }, req);
  } catch (e) {
    return json(res, 500, { error: e.message }, req);
  }
}

// ─── ROTA: GET /api/inbox/labels/:instanceKey ──────────────────────────────────
/**
 * Lista etiquetas disponíveis na instância.
 * Usado pela sidebar do Inbox para montar filtros e tags de conversa.
 *
 * Spec UAZAPI: GET /chat/labels
 * Retorna: array de { id, name, color }
 */
export async function handleGetLabels(req, res, json, supabase) {
  const tenantId = req.user?.tenantId || req.tenantId;
  if (!tenantId) return json(res, 403, { error: 'Tenant não identificado' }, req);

  const instanceKey = req.params?.instanceKey;
  if (!instanceKey) return json(res, 400, { error: 'instanceKey obrigatório' }, req);

  try {
    const { adapter, resolved } = await getAdapterForInstance(supabase, tenantId, instanceKey);
    // Spec /chat/labels: GET com header token
    const result = await adapter.instanceRequest(resolved.token, '/chat/labels', {}, 'Failed to get labels');
    return json(res, 200, { labels: Array.isArray(result) ? result : (result.labels || []) }, req);
  } catch (e) {
    return json(res, 500, { error: e.message }, req);
  }
}

// ─── ROTA: POST /api/inbox/lead ────────────────────────────────────────────────
/**
 * Atualiza dados de lead de um chat: atribuição de atendente, tags, status do ticket, posição kanban.
 *
 * Spec UAZAPI: POST /chat/editLead
 * Campos disponíveis:
 *   - id: chatid (obrigatório)
 *   - lead_isTicketOpen: boolean
 *   - lead_assignedAttendant_id: string (atendente responsável)
 *   - lead_tags: string[] (tags do lead)
 *   - lead_kanbanOrder: integer
 *   - lead_name, lead_fullName, lead_email, lead_phone
 *   - chatbot_disableUntil: timestamp — pausa chatbot para este chat
 *
 * Body esperado: { instanceKey, chatId, ...leadFields }
 */
export async function handleEditLead(req, res, json, supabase) {
  const tenantId = req.user?.tenantId || req.tenantId;
  if (!tenantId) return json(res, 403, { error: 'Tenant não identificado' }, req);

  const { instanceKey, chatId, ...leadFields } = req.body || {};
  if (!instanceKey) return json(res, 400, { error: 'instanceKey obrigatório' }, req);
  if (!chatId) return json(res, 400, { error: 'chatId obrigatório' }, req);

  try {
    const { adapter, resolved } = await getAdapterForInstance(supabase, tenantId, instanceKey);
    // Spec /chat/editLead: id pode ser wa_chatid ou wa_fastid
    const result = await adapter.instanceRequest(resolved.token, '/chat/editLead', {
      method: 'POST',
      body: { id: chatId, ...leadFields },
    }, 'Failed to edit lead');
    return json(res, 200, { updated: true, result }, req);
  } catch (e) {
    return json(res, 500, { error: e.message }, req);
  }
}

// ─── ROTA: GET /api/inbox/groups/:instanceKey ──────────────────────────────────
/**
 * Lista grupos WhatsApp da instância.
 *
 * Spec UAZAPI: POST /group/list
 * Retorna grupos com: id, name, participants, isAdmin, description
 */
export async function handleGetGroups(req, res, json, supabase) {
  const tenantId = req.user?.tenantId || req.tenantId;
  if (!tenantId) return json(res, 403, { error: 'Tenant não identificado' }, req);

  const instanceKey = req.params?.instanceKey;
  if (!instanceKey) return json(res, 400, { error: 'instanceKey obrigatório' }, req);

  try {
    const { adapter, resolved } = await getAdapterForInstance(supabase, tenantId, instanceKey);
    const result = await adapter.instanceRequest(resolved.token, '/group/list', {
      method: 'POST',
      body: {},
    }, 'Failed to list groups');
    return json(res, 200, { groups: Array.isArray(result) ? result : (result.groups || []) }, req);
  } catch (e) {
    return json(res, 500, { error: e.message }, req);
  }
}

// ─── ROTA: GET /api/inbox/sse/:instanceKey ─────────────────────────────────────
/**
 * SSE Relay — faz bridge do Server-Sent Events do UAZAPI para o frontend.
 *
 * Spec UAZAPI: GET /sse
 *   Eventos: messages, messages_update, connection, presence, qrcode
 *   Auth: header 'token' com token da instância
 *
 * O frontend abre EventSource('/api/inbox/sse/INSTANCE_KEY?token=JWT').
 * O gateway valida o JWT, resolve a instância, abre SSE com UAZAPI e faz relay.
 *
 * Segurança: o token UAZAPI nunca é exposto ao cliente.
 *
 * Limitação: SSE é one-directional (servidor → cliente). Para envio, usar /api/inbox/send.
 */
export async function handleSSERelay(req, res, supabase, extractUser) {
  // Auth via query param (EventSource não suporta headers customizados)
  const url = new URL(req.url, `http://${req.headers.host}`);
  const jwtToken = url.searchParams.get('token');
  if (!jwtToken) { res.writeHead(401); return res.end('Unauthorized'); }

  // Validar JWT manualmente
  const { data: { user }, error: authErr } = await supabase.auth.getUser(jwtToken);
  if (authErr || !user) { res.writeHead(401); return res.end('Unauthorized'); }

  // Resolver tenant
  const { data: membership } = await supabase
    .from('user_tenant_memberships')
    .select('tenant_id')
    .eq('user_id', user.id)
    .maybeSingle();
  if (!membership) { res.writeHead(403); return res.end('Forbidden'); }

  const tenantId = membership.tenant_id;
  const instanceKey = req.params?.instanceKey;
  if (!instanceKey) { res.writeHead(400); return res.end('instanceKey obrigatório'); }

  try {
    const resolved = await resolveInstance(supabase, tenantId, instanceKey);

    // Configurar response como SSE
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'X-Accel-Buffering': 'no',  // desabilita buffer no Nginx/Traefik
    });

    // Keepalive a cada 25s para manter conexão via Cloudflare (timeout 90s)
    const keepalive = setInterval(() => {
      try { res.write(': keepalive\n\n'); } catch {}
    }, 25_000);

    // Abrir SSE com UAZAPI — spec: GET /sse com header 'token'
    const uazapiSSEUrl = `${resolved.serverUrl}/sse`;
    let upstreamReader;

    // Teto de 15 min por conexão (evita socket/memória presos indefinidamente).
    // O cliente (EventSource) reconecta automaticamente ao fechar.
    const SSE_MAX_MS = 15 * 60 * 1000;

    try {
      const upstream = await fetch(uazapiSSEUrl, {
        headers: { token: resolved.token },
        signal: AbortSignal.timeout(SSE_MAX_MS),
      });

      if (!upstream.ok) {
        clearInterval(keepalive);
        res.write(`event: error\ndata: ${JSON.stringify({ error: 'UAZAPI SSE indisponível' })}\n\n`);
        return res.end();
      }

      upstreamReader = upstream.body.getReader();
      const decoder = new TextDecoder();

      // Relay: lê chunks do UAZAPI e escreve no response do cliente
      const pump = async () => {
        try {
          while (true) {
            const { done, value } = await upstreamReader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            res.write(chunk);
          }
        } catch (streamErr) {
          // Conexão fechada pelo cliente ou UAZAPI
        } finally {
          clearInterval(keepalive);
          try { res.end(); } catch {}
        }
      };
      pump();

    } catch (fetchErr) {
      clearInterval(keepalive);
      res.write(`event: error\ndata: ${JSON.stringify({ error: fetchErr.message })}\n\n`);
      res.end();
    }

    // Limpar quando cliente desconectar
    req.on('close', () => {
      clearInterval(keepalive);
      try { upstreamReader?.cancel(); } catch {}
    });

  } catch (e) {
    res.writeHead(500);
    res.end(JSON.stringify({ error: e.message }));
  }
}

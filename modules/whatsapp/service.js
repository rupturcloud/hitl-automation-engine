/**
 * WhatsApp service — regras de negócio do domínio número de WhatsApp.
 *
 * Não conhece HTTP, não conhece UAZAPI, não conhece Supabase diretamente.
 * Recebe repository + adapter via construtor (DI).
 */

import { fusionBus } from './fusion.service.js';

export class WhatsappService {
  constructor({ repository, adapter }) {
    if (!repository) throw new Error('WhatsappService requer repository');
    if (!adapter) throw new Error('WhatsappService requer adapter');
    this.repo = repository;
    this.adapter = adapter;
    // Fusion bus: singleton de processo — sinais persistem entre requests
    this.fusion = fusionBus;
  }

  async listNumbers({ tenantId }) {
    const rows = await this.repo.listByTenant(tenantId);
    return rows.map(toNumberDTO);
  }

  async createNumber({ tenantId, name }) {
    if (!name || name.length < 2) {
      throw new BusinessError('ERR_INVALID_NAME', 'Dê um nome com pelo menos 2 letras pro seu número.');
    }
    const tp = await this.repo.ensureTenantProvider({ tenantId, provider: 'uazapi' });
    const dbRow = await this.repo.create({ tenantProviderId: tp.id, name });
    return toNumberDTO(dbRow);
  }

  async connect({ tenantId, id, phone = null }) {
    const row = await this.repo.findById({ tenantId, id });
    if (!row) throw new BusinessError('ERR_NOT_FOUND', 'Número não encontrado.', 404);

    // Se remote_instance_id ainda é "pending-...", precisa criar no UAZAPI primeiro.
    let remoteId = row.remote_instance_id;
    if (!remoteId || remoteId.startsWith('pending-')) {
      const created = await this.adapter.createInstance({ name: row.instance_name });
      // providerId === instanceToken (o campo `token` retornado pela UAZAPI)
      // É o valor usado como header `token:` em todas as chamadas subsequentes.
      remoteId = created.providerId;
      await this.repo.updateStatus({
        id,
        status: 'connecting',
        remoteInstanceId: remoteId,
        // Salva UUID interno no metadata para auditoria/debug
        metadata: { ...(row.metadata || {}), provider: { internalId: created.internalId } },
      });
    }

    // phone → pairing code; sem phone → QR code
    // Auto-recuperação: se token expirou no provider (free server 1h TTL),
    // cria nova instância e tenta de novo (transparent para o usuário).
    let session;
    try {
      session = await this.adapter.startSession(remoteId, { phone });
    } catch (err) {
      const msg = (err?.message || '').toLowerCase();
      const isInvalidToken = msg.includes('invalid token') || msg.includes('not found') ||
                             msg.includes('404') || msg.includes('401');
      if (!isInvalidToken) throw err;
      // Token inválido → instância expirou no provider → recriar
      console.warn(`[whatsapp.service] connect: token inválido (${remoteId?.slice(0, 16)}…) — recriando instância.`);
      const created = await this.adapter.createInstance({ name: row.instance_name });
      remoteId = created.providerId;
      await this.repo.updateStatus({
        id,
        status: 'connecting',
        remoteInstanceId: remoteId,
        metadata: { ...(row.metadata || {}), provider: { internalId: created.internalId } },
      });
      session = await this.adapter.startSession(remoteId, { phone });
    }

    await this.repo.updateStatus({ id, status: session.status?.toLowerCase() || 'connecting' });
    return {
      id,
      status: session.status,
      qrCode: session.qrCode,
      pairingCode: session.pairingCode,
      mode: phone ? 'pairing_code' : 'qr',
    };
  }

  async reconnect({ tenantId, id, phone = null }) {
    return this.connect({ tenantId, id, phone });
  }

  async getStatus({ tenantId, id }) {
    const row = await this.repo.findById({ tenantId, id });
    if (!row) throw new BusinessError('ERR_NOT_FOUND', 'Número não encontrado.', 404);

    // Carrega estado cacheado do banco como sinal S4 inicial (não começa "cego")
    const cachedFusedState = row.metadata?.fusedState;
    if (cachedFusedState) {
      this.fusion.loadCachedSignal(id, cachedFusedState);
    }

    if (!row.remote_instance_id || row.remote_instance_id.startsWith('pending-')) {
      return { id, status: row.status || 'connecting', confidence: null, trackingMode: null };
    }

    let remote;
    try {
      remote = await this.adapter.getStatus(row.remote_instance_id);
    } catch (err) {
      // Instância expirou no free server (TTL 1h) — retorna estado especial sem relançar
      if (err?.code === 'ERR_INSTANCE_EXPIRED') {
        console.warn(`[whatsapp.service] getStatus: instância expirada (${id}) — marcando freeTrialExpired.`);
        // Atualiza status local para 'disconnected' e registra expiração no metadata
        await this.repo.updateStatus({ id, status: 'disconnected' });
        await this.repo.mergeMetadata({ id, patch: { freeTrialExpired: true } }).catch(() => {});
        // Injeta sinal de desconexão no fusion bus
        this.fusion.injectSignal(id, { source: 'http_poll', state: 'disconnected', confidence: 1.0 });
        const fused = this.fusion.computeState(id);
        return {
          id,
          status: 'disconnected',
          freeTrialExpired: true,
          phone: null,
          lastSeen: null,
          confidence: fused.confidence,
          trackingMode: 'LOST',
          needsHITL: true,
          fusedState: { trackingMode: 'LOST' },
        };
      }
      throw err;
    }

    const normalized = (remote.status || '').toLowerCase();

    // S1: injeta sinal do HTTP poll no fusion bus
    if (normalized && normalized !== 'connecting') {
      const fusionState = normalized === 'connected' ? 'connected' : 'disconnected';
      this.fusion.injectSignal(id, { source: 'http_poll', state: fusionState, confidence: 1.0 });
    }

    // Computa estado fundido com todos os sinais disponíveis
    const fused = this.fusion.computeState(id);

    // Atualiza status E número de telefone quando conectado
    if (normalized && (normalized !== row.status || (remote.phone && remote.phone !== row.instance_number))) {
      const statusPatch = { id, status: normalized };
      if (remote.phone) statusPatch.instanceNumber = remote.phone;
      await this.repo.updateStatus(statusPatch);
    }

    // Persiste estado fundido no metadata (best-effort — non-fatal)
    if (fused.state !== 'unknown') {
      this.fusion.persistFusedState(id, fused, this.repo).catch(() => {/* ignorado */});
    }

    return {
      id,
      status: remote.status,
      phone: remote.phone || null,
      lastSeen: remote.lastSeen,
      // Campos do fusion bus
      confidence: fused.confidence,
      trackingMode: fused.trackingMode,
      needsHITL: fused.needsHITL ?? false,
    };
  }

  async getHealth({ tenantId, id }) {
    const row = await this.repo.findById({ tenantId, id });
    if (!row) throw new BusinessError('ERR_NOT_FOUND', 'Número não encontrado.', 404);
    if (!row.remote_instance_id || row.remote_instance_id.startsWith('pending-')) {
      return { id, score: null };
    }
    return { id, ...(await this.adapter.getHealth(row.remote_instance_id)) };
  }

  /**
   * Inicia aquecimento de uma instância.
   * Salva config e estado no metadata da instância (sem depender do warmup-core externo).
   *
   * @param {object} opts
   * @param {string} opts.tenantId
   * @param {string} opts.id
   * @param {object} opts.config — { msgsDay, startH, endH, content, speed }
   */
  async startWarmup({ tenantId, id, config = {} }) {
    const row = await this.repo.findById({ tenantId, id });
    if (!row) throw new BusinessError('ERR_NOT_FOUND', 'Número não encontrado.', 404);
    if (row.status !== 'connected') {
      throw new BusinessError('ERR_NOT_CONNECTED', 'O número precisa estar conectado para iniciar o aquecimento.', 400);
    }

    const current = row.metadata?.warmup || {};
    const warmupState = {
      enabled: true,
      startedAt: current.startedAt || new Date().toISOString(),
      config: {
        msgsDay: config.msgsDay ?? current.config?.msgsDay ?? 120,
        startH: config.startH ?? current.config?.startH ?? '08:00',
        endH: config.endH ?? current.config?.endH ?? '18:00',
        content: config.content ?? current.config?.content ?? ['text', 'image'],
        speed: config.speed ?? current.config?.speed ?? 'moderado',
      },
      pct: current.pct ?? 0,
      score: current.score ?? 32,
    };

    await this.repo.mergeMetadata({ id, patch: { warmup: warmupState } });
    return { id, warmup: warmupState };
  }

  /**
   * Para o aquecimento (pausa — mantém histórico de progresso).
   */
  async stopWarmup({ tenantId, id }) {
    const row = await this.repo.findById({ tenantId, id });
    if (!row) throw new BusinessError('ERR_NOT_FOUND', 'Número não encontrado.', 404);

    const current = row.metadata?.warmup || {};
    const warmupState = { ...current, enabled: false, stoppedAt: new Date().toISOString() };
    await this.repo.mergeMetadata({ id, patch: { warmup: warmupState } });
    return { id, warmup: warmupState };
  }

  /**
   * Retorna estado atual do aquecimento de uma instância.
   */
  async getWarmupStatus({ tenantId, id }) {
    const row = await this.repo.findById({ tenantId, id });
    if (!row) throw new BusinessError('ERR_NOT_FOUND', 'Número não encontrado.', 404);
    const warmup = row.metadata?.warmup || { enabled: false, pct: 0, score: 32 };
    return { id, warmup };
  }

  /**
   * Atualiza campos de configuração de um número (nome, webhook, delay, limite diário).
   * @param {object} opts
   * @param {string} opts.tenantId
   * @param {string} opts.id
   * @param {object} opts.patch — { name?, webhookUrl?, delay?, dailyLimit? }
   */
  async updateNumber({ tenantId, id, patch }) {
    const row = await this.repo.findById({ tenantId, id });
    if (!row) throw new BusinessError('ERR_NOT_FOUND', 'Número não encontrado.', 404);
    const updated = await this.repo.updateConfig({ id, patch });
    return toNumberDTO(updated);
  }

  /**
   * Exclui uma instância: desconecta + deleta no UAZAPI (best-effort) + remove do banco.
   */
  async deleteNumber({ tenantId, id }) {
    const row = await this.repo.findById({ tenantId, id });
    if (!row) throw new BusinessError('ERR_NOT_FOUND', 'Número não encontrado.', 404);

    const remoteId = row.remote_instance_id;
    if (remoteId && !remoteId.startsWith('pending-')) {
      try {
        await this.adapter.deleteInstance(remoteId);
      } catch (e) {
        // Ignora: instância pode ter expirado (free server: 1h) ou já deletada
        console.warn('[whatsapp.service] deleteInstance provider (ignorado):', e?.message);
      }
    }

    await this.repo.delete({ id, tenantId });
    return { id, deleted: true };
  }

  /**
   * Atualiza apenas a config do aquecimento sem alterar enabled/pct/score.
   */
  async updateWarmupConfig({ tenantId, id, config }) {
    const row = await this.repo.findById({ tenantId, id });
    if (!row) throw new BusinessError('ERR_NOT_FOUND', 'Número não encontrado.', 404);

    const current = row.metadata?.warmup || {};
    const warmupState = {
      ...current,
      config: { ...(current.config || {}), ...config },
    };
    await this.repo.mergeMetadata({ id, patch: { warmup: warmupState } });
    return { id, warmup: warmupState };
  }

  /**
   * Desconecta a instância do provider UAZAPI.
   * Atualiza o status local para 'disconnected'.
   */
  async disconnect({ tenantId, id }) {
    const row = await this.repo.findById({ tenantId, id });
    if (!row) throw new BusinessError('ERR_NOT_FOUND', 'Número não encontrado.', 404);
    if (!row.remote_instance_id || row.remote_instance_id.startsWith('pending-')) {
      // Sem remote — apenas marca como desconectado localmente
      await this.repo.updateStatus({ id, status: 'disconnected' });
      return { id, status: 'disconnected' };
    }
    try {
      await this.adapter.disconnect(row.remote_instance_id);
    } catch (e) {
      // Ignora erros do provider (pode já estar desconectado) e continua com atualização local
      console.warn('[whatsapp.service] disconnect provider error (ignorado):', e?.message);
    }
    await this.repo.updateStatus({ id, status: 'disconnected' });
    return { id, status: 'disconnected' };
  }

  /**
   * Retorna a configuração de webhook da instância.
   * Combina: config salva localmente no metadata + dados do provider (se disponível).
   */
  async getWebhook({ tenantId, id }) {
    const row = await this.repo.findById({ tenantId, id });
    if (!row) throw new BusinessError('ERR_NOT_FOUND', 'Número não encontrado.', 404);
    const localWebhook = row.metadata?.webhook || null;
    if (!row.remote_instance_id || row.remote_instance_id.startsWith('pending-')) {
      return { id, webhook: localWebhook };
    }
    try {
      const remote = await this.adapter.getWebhook(row.remote_instance_id);
      return { id, webhook: remote ?? localWebhook };
    } catch {
      return { id, webhook: localWebhook };
    }
  }

  /**
   * Configura webhook da instância.
   * Salva no metadata local + aplica no provider UAZAPI se já conectado.
   *
   * @param {object} config — { url, enabled, events, addUrlEvents, addUrlTypesMessages }
   */
  async setWebhook({ tenantId, id, config }) {
    const row = await this.repo.findById({ tenantId, id });
    if (!row) throw new BusinessError('ERR_NOT_FOUND', 'Número não encontrado.', 404);

    // Normaliza config seguindo padrão UAZAPI
    // ATENÇÃO: campo correto per spec é addUrlTypesMessages (plural) — não addUrlTypeMessages
    const webhookConfig = {
      url:                 config.url               ?? '',
      enabled:             config.enabled           ?? true,
      events:              config.events            ?? ['messages_update'],
      addUrlEvents:        config.addUrlEvents      ?? false,
      addUrlTypesMessages: config.addUrlTypesMessages ?? config.addUrlTypeMessages ?? false,
    };

    // Persiste localmente
    await this.repo.mergeMetadata({ id, patch: { webhook: webhookConfig } });

    // Aplica no provider se já tem remote_instance_id
    if (row.remote_instance_id && !row.remote_instance_id.startsWith('pending-')) {
      try {
        await this.adapter.setWebhook(row.remote_instance_id, webhookConfig);
      } catch (e) {
        console.warn('[whatsapp.service] setWebhook provider error:', e?.message);
        // Não falha — config salva localmente, será aplicada na próxima reconexão
      }
    }

    return { id, webhook: webhookConfig };
  }

  /**
   * Busca últimas conversas (chats) de uma instância.
   * Retorna lista vazia (sem erro) se a instância ainda não está conectada.
   *
   * @param {{ tenantId: string, id: string, limit?: number }} opts
   */
  async getChats({ tenantId, id, limit = 20 }) {
    const row = await this.repo.findById({ tenantId, id });
    if (!row) throw new BusinessError('ERR_NOT_FOUND', 'Número não encontrado.', 404);
    if (!row.remote_instance_id || row.remote_instance_id.startsWith('pending-')) {
      return { id, chats: [] };
    }
    try {
      const chats = await this.adapter.getChats(row.remote_instance_id, { limit });
      return { id, chats };
    } catch (e) {
      console.warn('[whatsapp.service] getChats falhou:', e.message);
      // Instância expirada no free server — detectada pelo código do adapter ou pela mensagem
      const isExpired = e?.code === 'ERR_INSTANCE_EXPIRED' ||
        (() => {
          const msg = (e?.message || '').toLowerCase();
          return msg.includes('invalid token') || msg.includes('not found') ||
                 msg.includes('401') || msg.includes('404') || msg.includes('unauthorized');
        })();
      if (isExpired) {
        return { id, chats: [], freeTrialExpired: true, error: 'INSTANCE_EXPIRED' };
      }
      return { id, chats: [] };
    }
  }

  /**
   * Busca mensagens de um chat específico.
   *
   * @param {{ tenantId: string, id: string, chatId: string, limit?: number }} opts
   */
  async getMessages({ tenantId, id, chatId, limit = 50 }) {
    const row = await this.repo.findById({ tenantId, id });
    if (!row) throw new BusinessError('ERR_NOT_FOUND', 'Número não encontrado.', 404);
    if (!row.remote_instance_id || row.remote_instance_id.startsWith('pending-')) {
      return { id, messages: [] };
    }
    const messages = await this.adapter.getMessages(row.remote_instance_id, { chatId, limit });
    return { id, messages };
  }

  /**
   * Envia mensagem de texto para um chat via UAZAPI.
   *
   * @param {{ tenantId: string, id: string, chatId: string, text: string }} opts
   * @returns {{ id: string, sent: boolean, timestamp: number }}
   */
  async sendMessage({ tenantId, id, chatId, text }) {
    const row = await this.repo.findById({ tenantId, id });
    if (!row) throw new BusinessError('ERR_NOT_FOUND', 'Número não encontrado.', 404);
    const remoteId = row.remote_instance_id;
    if (!remoteId || remoteId.startsWith('pending-')) {
      throw new BusinessError('ERR_NOT_CONNECTED', 'Instância não conectada ao provider.', 400);
    }
    await this.adapter.sendMessage(remoteId, { chatId, text });
    return { id, sent: true, timestamp: Date.now() };
  }

  /**
   * Proxy SSE — transmite eventos UAZAPI em tempo real para o cliente browser.
   * Ativa o S2 sensor da doutrina Anduril.
   */
  async streamSSE({ tenantId, id, req, res }) {
    const row = await this.repo.findById({ tenantId, id });
    if (!row) throw new BusinessError('ERR_NOT_FOUND', 'Número não encontrado.', 404);
    if (!row.remote_instance_id || row.remote_instance_id.startsWith('pending-')) {
      throw new BusinessError('ERR_NOT_CONNECTED', 'Instância não conectada ao provider.', 400);
    }
    await this.adapter.proxySSE(row.remote_instance_id, req, res);
  }
}

export class BusinessError extends Error {
  constructor(code, message, status = 400, details = {}) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

function toNumberDTO(row) {
  const warmupMeta  = row.metadata?.warmup     || {};
  const configMeta  = row.metadata?.config     || {};
  const webhookMeta = row.metadata?.webhook    || {};
  // fusedState: estado fundido pelo InstanceFusionService (persiste via mergeMetadata)
  const fusedMeta   = row.metadata?.fusedState || null;

  // Dados de free tier: account_kind vem do JOIN com provider_accounts
  const accountKind = row.provider_accounts?.account_kind || row.account_kind || 'free';
  // Usa first_seen_at (data de criação da instância) para calcular expiração do trial de 1h
  const createdAt = row.first_seen_at || row.created_at;
  const trialDurationMs = 60 * 60 * 1000; // 1 hora em ms
  const trialExpiresAt = accountKind === 'free' && createdAt
    ? new Date(new Date(createdAt).getTime() + trialDurationMs).toISOString()
    : null;
  const trialExpired = accountKind === 'free' && createdAt
    ? Date.now() > new Date(createdAt).getTime() + trialDurationMs
    : false;

  // freeTrialExpired: combinação do cálculo por data E da flag persistida pelo getStatus
  // quando o adapter confirma que a instância expirou no provider (401/404)
  const freeTrialExpired = trialExpired || (row.metadata?.freeTrialExpired === true);

  return {
    id: row.id,
    name: row.instance_name || row.name,
    phone: row.instance_number || null,
    status: row.status || 'connecting',
    isBusiness: row.is_business || false,
    platform: row.platform || null,
    lastSeenAt: row.last_seen_at,
    updatedAt: row.updated_at,
    accountKind,
    trialExpiresAt,
    trialExpired,
    freeTrialExpired,
    // Campos de configuração de envio (persistidos em metadata.config)
    delay:      configMeta.delay      ?? 3,
    dailyLimit: configMeta.dailyLimit ?? 500,
    webhookUrl: configMeta.webhookUrl ?? webhookMeta.url ?? '',
    // Webhook completo (para o drawer carregar os eventos configurados)
    webhookConfig: {
      url:                webhookMeta.url                ?? configMeta.webhookUrl ?? '',
      enabled:            webhookMeta.enabled            ?? true,
      events:             webhookMeta.events             ?? ['messages_update'],
      addUrlEvents:        webhookMeta.addUrlEvents        ?? false,
      // addUrlTypesMessages é o nome correto per spec (suporta legado addUrlTypeMessages)
      addUrlTypesMessages: webhookMeta.addUrlTypesMessages ?? webhookMeta.addUrlTypeMessages ?? false,
    },
    warmup: {
      enabled:   warmupMeta.enabled   || false,
      pct:       warmupMeta.pct       ?? 0,
      score:     warmupMeta.score     ?? 32,
      config:    warmupMeta.config    || null,
      startedAt: warmupMeta.startedAt || null,
    },
    // fusedState: estado fundido (doutrina Anduril) — null se ainda não calculado.
    // O InstanceCard faz fallback graceful quando null (comportamento igual ao anterior).
    fusedState: fusedMeta,
  };
}

export default WhatsappService;

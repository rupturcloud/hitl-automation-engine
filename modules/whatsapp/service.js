/**
 * WhatsApp service — regras de negócio do domínio número de WhatsApp.
 *
 * Não conhece HTTP, não conhece UAZAPI, não conhece Supabase diretamente.
 * Recebe repository + adapter via construtor (DI).
 */

export class WhatsappService {
  constructor({ repository, adapter }) {
    if (!repository) throw new Error('WhatsappService requer repository');
    if (!adapter) throw new Error('WhatsappService requer adapter');
    this.repo = repository;
    this.adapter = adapter;
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
      remoteId = created.providerId;
      await this.repo.updateStatus({ id, status: 'connecting', remoteInstanceId: remoteId });
    }

    // phone → pairing code; sem phone → QR code
    const session = await this.adapter.startSession(remoteId, { phone });
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
    if (!row.remote_instance_id || row.remote_instance_id.startsWith('pending-')) {
      return { id, status: row.status || 'connecting' };
    }
    const remote = await this.adapter.getStatus(row.remote_instance_id);
    const normalized = (remote.status || '').toLowerCase();
    if (normalized && normalized !== row.status) {
      await this.repo.updateStatus({ id, status: normalized });
    }
    return { id, status: remote.status, lastSeen: remote.lastSeen };
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
  const warmupMeta = row.metadata?.warmup || {};
  return {
    id: row.id,
    name: row.instance_name || row.name,
    phone: row.instance_number || null,
    status: row.status || 'connecting',
    isBusiness: row.is_business || false,
    platform: row.platform || null,
    lastSeenAt: row.last_seen_at,
    updatedAt: row.updated_at,
    warmup: {
      enabled: warmupMeta.enabled || false,
      pct: warmupMeta.pct ?? 0,
      score: warmupMeta.score ?? 32,
      config: warmupMeta.config || null,
      startedAt: warmupMeta.startedAt || null,
    },
  };
}

export default WhatsappService;

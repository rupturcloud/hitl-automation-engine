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

  async connect({ tenantId, id }) {
    const row = await this.repo.findById({ tenantId, id });
    if (!row) throw new BusinessError('ERR_NOT_FOUND', 'Número não encontrado.', 404);

    // Se remote_instance_id ainda é "pending-...", precisa criar no UAZAPI primeiro.
    let remoteId = row.remote_instance_id;
    if (!remoteId || remoteId.startsWith('pending-')) {
      const created = await this.adapter.createInstance({ name: row.instance_name });
      remoteId = created.providerId;
      await this.repo.updateStatus({ id, status: 'connecting', remoteInstanceId: remoteId });
    }

    const session = await this.adapter.startSession(remoteId);
    await this.repo.updateStatus({ id, status: session.status?.toLowerCase() || 'connecting' });
    return {
      id,
      status: session.status,
      qrCode: session.qrCode,
      pairingCode: session.pairingCode,
    };
  }

  async reconnect({ tenantId, id }) {
    return this.connect({ tenantId, id });
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
  return {
    id: row.id,
    name: row.instance_name || row.name,
    phone: row.instance_number || null,
    status: row.status || 'connecting',
    isBusiness: row.is_business || false,
    platform: row.platform || null,
    lastSeenAt: row.last_seen_at,
    updatedAt: row.updated_at,
  };
}

export default WhatsappService;

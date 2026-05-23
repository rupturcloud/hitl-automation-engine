/**
 * WhatsApp repository — única camada que toca o banco para o domínio.
 *
 * Schema real (migrations/001_instance_registry.sql):
 *   - tenant_providers (id, tenant_id, provider, account_id, credentials_ref, metadata, is_active)
 *   - instance_registry (id, tenant_provider_id, remote_instance_id, status,
 *                        instance_number, instance_name, is_business, platform, metadata)
 *
 * O "número de WhatsApp" do cliente final (P2 pilar) mapeia para uma linha em
 * instance_registry vinculada via tenant_provider ao tenant atual.
 */

export class WhatsappRepository {
  constructor({ supabase }) {
    if (!supabase) throw new Error('WhatsappRepository requer supabase client');
    this.db = supabase;
  }

  /** Lista todos os números do tenant (join com tenant_providers). */
  async listByTenant(tenantId) {
    const { data, error } = await this.db
      .from('instance_registry')
      .select(`
        id,
        remote_instance_id,
        status,
        instance_number,
        instance_name,
        is_business,
        platform,
        metadata,
        last_seen_at,
        updated_at,
        tenant_providers!inner ( id, tenant_id, provider, account_id )
      `)
      .eq('tenant_providers.tenant_id', tenantId)
      .order('updated_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async findById({ tenantId, id }) {
    const { data, error } = await this.db
      .from('instance_registry')
      .select(`
        *,
        tenant_providers!inner ( id, tenant_id, provider, account_id, credentials_ref )
      `)
      .eq('id', id)
      .eq('tenant_providers.tenant_id', tenantId)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  /** Resolve (ou cria) o tenant_provider default UAZAPI do tenant. */
  async ensureTenantProvider({ tenantId, provider = 'uazapi' }) {
    const { data: existing, error: e1 } = await this.db
      .from('tenant_providers')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('provider', provider)
      .eq('is_active', true)
      .maybeSingle();
    if (e1) throw e1;
    if (existing) return existing;

    const { data: created, error: e2 } = await this.db
      .from('tenant_providers')
      .insert({ tenant_id: tenantId, provider, metadata: {} })
      .select()
      .single();
    if (e2) throw e2;
    return created;
  }

  async create({ tenantProviderId, name, remoteInstanceId = null }) {
    const { data, error } = await this.db
      .from('instance_registry')
      .insert({
        tenant_provider_id: tenantProviderId,
        remote_instance_id: remoteInstanceId || `pending-${Date.now()}`,
        instance_name: name,
        status: 'connecting',
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async updateStatus({ id, status, remoteInstanceId, instanceNumber, metadata }) {
    const patch = { status, updated_at: new Date().toISOString(), last_seen_at: new Date().toISOString() };
    if (remoteInstanceId) patch.remote_instance_id = remoteInstanceId;
    if (instanceNumber)   patch.instance_number    = instanceNumber;
    if (metadata)         patch.metadata           = metadata;
    const { data, error } = await this.db
      .from('instance_registry')
      .update(patch)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  /**
   * Atualiza campos de configuração de uma instância.
   * - name → instance_name (campo direto)
   * - webhookUrl, delay, dailyLimit → metadata.config (merge parcial)
   *
   * @param {string} id
   * @param {object} patch — { name?, webhookUrl?, delay?, dailyLimit? }
   */
  async updateConfig({ id, patch }) {
    // Lê estado atual para fazer merge seguro
    const { data: row, error: e1 } = await this.db
      .from('instance_registry')
      .select('instance_name, metadata')
      .eq('id', id)
      .maybeSingle();
    if (e1) throw e1;

    const dbPatch = { updated_at: new Date().toISOString() };

    // Atualiza instance_name diretamente se fornecido
    if (patch.name != null) dbPatch.instance_name = patch.name;

    // Faz merge em metadata.config para os demais campos
    const current = row?.metadata || {};
    const currentConfig = current.config || {};
    const configPatch = {};
    if (patch.webhookUrl != null) configPatch.webhookUrl = patch.webhookUrl;
    if (patch.delay != null) configPatch.delay = patch.delay;
    if (patch.dailyLimit != null) configPatch.dailyLimit = patch.dailyLimit;

    if (Object.keys(configPatch).length > 0) {
      dbPatch.metadata = { ...current, config: { ...currentConfig, ...configPatch } };
    }

    const { data, error: e2 } = await this.db
      .from('instance_registry')
      .update(dbPatch)
      .eq('id', id)
      .select()
      .single();
    if (e2) throw e2;
    return data;
  }

  /**
   * Faz merge parcial em metadata (JSON) sem sobrescrever outros campos.
   * @param {string} id
   * @param {object} patch — chaves do nível raiz do metadata a mesclar
   */
  async mergeMetadata({ id, patch }) {
    // Lê o metadata atual primeiro
    const { data: row, error: e1 } = await this.db
      .from('instance_registry')
      .select('metadata')
      .eq('id', id)
      .maybeSingle();
    if (e1) throw e1;
    const current = row?.metadata || {};
    const merged = { ...current, ...patch };
    const { data, error: e2 } = await this.db
      .from('instance_registry')
      .update({ metadata: merged, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (e2) throw e2;
    return data;
  }
}

export default WhatsappRepository;

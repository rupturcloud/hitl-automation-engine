/**
 * WhatsApp → UAZAPI adapter.
 *
 * Doutrina (docs/ROUTING_API_ARCHITECTURE.md):
 *  - Única fronteira do domínio whatsapp com fornecedor externo (UAZAPI).
 *  - Nenhum controller/service/repository sabe que UAZAPI existe.
 *  - Reusa o UazapiAdapter de baixo nível (modules/provider-adapter/uazapi-adapter.js)
 *    pra não duplicar lógica de fetch/auth.
 *
 * Padrão UAZAPI:
 *  - Operações admin  → header `admintoken: <adminToken>`
 *  - Operações de instância → header `token: <instanceToken>`
 *  - O `token` retornado no createInstance é o identificador E credencial da instância.
 *    NÃO confundir com `id` (UUID interno) — o `token` é o que vai em todas as chamadas.
 */
import { UazapiAdapter as LowLevelUazapi } from '../../provider-adapter/uazapi-adapter.js';

export class UazapiWhatsappAdapter {
  constructor({ adminToken, serverUrl, instanceToken } = {}) {
    this._client = new LowLevelUazapi({ adminToken, serverUrl, instanceToken });
    this._serverUrl = serverUrl || 'https://free.uazapi.com';
    this._adminToken = adminToken;
  }

  /**
   * Cria instância UAZAPI.
   * Retorna { providerId, instanceToken, status } neutro.
   *
   * IMPORTANTE: providerId === instanceToken === o campo `token` do response UAZAPI.
   * Esse valor vai para remote_instance_id no banco e é usado em TODAS as chamadas
   * subsequentes como header `token`.
   */
  async createInstance({ name }) {
    const res = await this._client.createInstance({ name });
    // A UAZAPI retorna: { token, id, name, status, ... }
    // `token` é o identificador de autenticação da instância.
    // `id` é o UUID interno — NÃO serve para autenticar chamadas.
    const instanceToken = res?.token || res?.instance?.token;
    const internalId    = res?.id    || res?.instance?.id;
    if (!instanceToken) {
      throw new Error(`UAZAPI createInstance não retornou token. Response: ${JSON.stringify(res)}`);
    }
    return {
      providerId:    instanceToken,   // o que fica em remote_instance_id
      instanceToken: instanceToken,   // explícito para clareza
      internalId:    internalId,      // UUID interno (só para log/debug)
      status:        res?.status || res?.instance?.status || 'DISCONNECTED',
    };
  }

  /**
   * Inicia conexão e devolve QR + pairing code padronizado.
   * @param {string} instanceToken — valor de remote_instance_id (= token UAZAPI)
   * @param {{ phone?: string }} opts — phone → pairing code; omitido → QR code
   */
  async startSession(instanceToken, { phone } = {}) {
    const res = await this._client.connectInstance(instanceToken, phone ? { phone } : {});
    return {
      qrCode:      res?.qrcode      || res?.qr           || null,
      pairingCode: res?.pairingCode || res?.paircode     || null,
      status:      res?.status                           || 'PENDING',
    };
  }

  /**
   * Estado da sessão (CONNECTED / DISCONNECTED / PENDING / TIMEOUT…).
   * @param {string} instanceToken
   */
  async getStatus(instanceToken) {
    const res = await this._client.getInstanceStatus(instanceToken);
    return {
      status:   res?.status   || res?.state  || 'OFFLINE',
      lastSeen: res?.lastSeen || res?.last_seen || null,
      phone:    res?.status?.status?.jid?.user || res?.owner || null,
    };
  }

  /**
   * Métricas de saúde.
   * A UAZAPI free não tem endpoint dedicado de health — usamos /instance/status
   * e extraímos o que estiver disponível.
   * @param {string} instanceToken
   */
  async getHealth(instanceToken) {
    const res = await this._client.getInstanceStatus(instanceToken);
    return {
      uptime:       res?.uptime        ?? null,
      msgsToday:    res?.msgsToday     ?? res?.messagesToday ?? null,
      deliveryRate: res?.deliveryRate  ?? null,
      score:        res?.health        ?? null,
    };
  }

  /**
   * Configura webhook da instância.
   * @param {string} instanceToken
   * @param {object} config — { url, events? }
   */
  async setWebhook(instanceToken, { url, events } = {}) {
    return this._client.updateWebhook(instanceToken, {
      url,
      ...(events ? { events } : {}),
    });
  }

  /**
   * Desconecta instância.
   * @param {string} instanceToken
   */
  async disconnect(instanceToken) {
    return this._client.disconnectInstance(instanceToken);
  }

  /**
   * Deleta instância do provider.
   * @param {string} instanceToken
   */
  async deleteInstance(instanceToken) {
    return this._client.deleteInstance(instanceToken);
  }
}

export default UazapiWhatsappAdapter;

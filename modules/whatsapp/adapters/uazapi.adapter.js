/**
 * WhatsApp → UAZAPI adapter.
 *
 * Doutrina (docs/ROUTING_API_ARCHITECTURE.md):
 *  - Única fronteira do domínio whatsapp com fornecedor externo (UAZAPI).
 *  - Nenhum controller/service/repository sabe que UAZAPI existe.
 *  - Reusa o UazapiAdapter de baixo nível (modules/provider-adapter/uazapi-adapter.js)
 *    pra não duplicar lógica de fetch/auth.
 */
import { UazapiAdapter as LowLevelUazapi } from '../../provider-adapter/uazapi-adapter.js';

export class UazapiWhatsappAdapter {
  constructor({ adminToken, serverUrl, instanceToken } = {}) {
    this._client = new LowLevelUazapi({ adminToken, serverUrl, instanceToken });
  }

  /** Cria instância UAZAPI. Retorna { providerId, status, token? } neutro. */
  async createInstance({ name, label }) {
    const res = await this._client.createInstance({ name, label });
    return {
      providerId: res?.instance?.id || res?.id,
      status: res?.instance?.status || 'PENDING',
      token: res?.token,
    };
  }

  /** Inicia conexão e devolve QR + pairing code padronizado. */
  async startSession(providerId) {
    const res = await this._client.connectInstance(providerId);
    return {
      qrCode: res?.qrcode || res?.qr || null,
      pairingCode: res?.pairingCode || res?.paircode || null,
      status: res?.status || 'PENDING',
    };
  }

  /** Estado da sessão. */
  async getStatus(providerId) {
    const res = await this._client.getInstanceStatus(providerId);
    return {
      status: res?.status || 'OFFLINE',
      lastSeen: res?.lastSeen || res?.last_seen || null,
    };
  }

  /** Métricas de saúde (uptime, msgs/dia, deliveryRate). */
  async getHealth(providerId) {
    const res = await this._client.getInstanceHealth?.(providerId) || {};
    return {
      uptime: res.uptime ?? null,
      msgsToday: res.msgsToday ?? res.messagesToday ?? null,
      deliveryRate: res.deliveryRate ?? null,
      score: res.health ?? null,
    };
  }
}

export default UazapiWhatsappAdapter;

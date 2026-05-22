/**
 * WhatsApp controller — HTTP boundary.
 *
 * Recebe req/res do gateway, extrai input, chama service, formata response
 * no padrão Ruptur { ok, data, meta, error }.
 *
 * Não conhece UAZAPI, não conhece Supabase, não conhece regra de negócio.
 */
import { BusinessError } from './service.js';

export class WhatsappController {
  constructor({ service }) {
    if (!service) throw new Error('WhatsappController requer service');
    this.service = service;
  }

  async listNumbers(req, res) {
    return this._handle(res, async () => {
      const tenantId = req.tenantId;
      const data = await this.service.listNumbers({ tenantId });
      return { data };
    });
  }

  async createNumber(req, res) {
    return this._handle(res, async () => {
      const tenantId = req.tenantId;
      const { name, label } = req.body || {};
      const data = await this.service.createNumber({ tenantId, name, label });
      return { data, status: 201 };
    });
  }

  async connect(req, res) {
    return this._handle(res, async () => {
      const tenantId = req.tenantId;
      const { id } = req.params;
      // phone = número no formato internacional (ex: 5511999999999)
      // quando presente → pairing code; ausente → QR code
      const phone = req.body?.phone || null;
      const data = await this.service.connect({ tenantId, id, phone });
      return { data };
    });
  }

  async reconnect(req, res) {
    return this._handle(res, async () => {
      const tenantId = req.tenantId;
      const { id } = req.params;
      const phone = req.body?.phone || null;
      const data = await this.service.reconnect({ tenantId, id, phone });
      return { data };
    });
  }

  async getStatus(req, res) {
    return this._handle(res, async () => {
      const tenantId = req.tenantId;
      const { id } = req.params;
      const data = await this.service.getStatus({ tenantId, id });
      return { data };
    });
  }

  async getHealth(req, res) {
    return this._handle(res, async () => {
      const tenantId = req.tenantId;
      const { id } = req.params;
      const data = await this.service.getHealth({ tenantId, id });
      return { data };
    });
  }

  async _handle(res, fn) {
    try {
      const { data, meta = {}, status = 200 } = await fn();
      this._send(res, status, { ok: true, data, meta, error: null });
    } catch (e) {
      const code = e.code || 'ERR_INTERNAL';
      const status = e.status || 500;
      const message = e.message || 'Erro inesperado.';
      // P2 pilar: mensagem para o cliente é humana.
      // Loga código técnico no servidor.
      // eslint-disable-next-line no-console
      console.error(`[whatsapp.controller] ${code}: ${message}`, e.details || {});
      this._send(res, status, {
        ok: false, data: null, meta: {},
        error: { code, message, details: e.details || {} },
      });
    }
  }

  _send(res, status, body) {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(body));
  }
}

export default WhatsappController;

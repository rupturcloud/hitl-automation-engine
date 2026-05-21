/**
 * WhatsApp API — interface única entre páginas React e o domínio whatsapp.
 *
 * Doutrina: páginas chamam estas funções, NUNCA `fetch` direto.
 * Todo endpoint vive em /api/v1/whatsapp/* (ver ROUTING_API_ARCHITECTURE).
 *
 * Provider real (UAZAPI) fica escondido em modules/whatsapp/adapters/uazapi.adapter.js
 * — nenhum componente React sabe que ele existe.
 */
import { http } from './httpClient';

export const whatsappApi = {
  /** Lista todos os números do tenant atual. */
  listNumbers() {
    return http.get('/whatsapp/numbers');
  },

  /** Cria um novo número (sem conectar ainda). */
  createNumber({ name, label }) {
    return http.post('/whatsapp/numbers', { body: { name, label } });
  },

  /** Inicia conexão (gera QR / pairing code). */
  connect(id) {
    return http.post('/whatsapp/numbers/:id/connect', { params: { id } });
  },

  /** Força reconexão (sessão dropou). */
  reconnect(id) {
    return http.post('/whatsapp/numbers/:id/reconnect', { params: { id } });
  },

  /** Estado da sessão (CONNECTED, PENDING, OFFLINE...). */
  status(id) {
    return http.get('/whatsapp/numbers/:id/status', { params: { id } });
  },

  /** Saúde da instância (uptime, msgs/dia, deliveryRate). */
  health(id) {
    return http.get('/whatsapp/numbers/:id/health', { params: { id } });
  },
};

export default whatsappApi;

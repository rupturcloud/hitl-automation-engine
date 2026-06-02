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

  /** Inicia conexão QR code (sem phone). */
  connect(id) {
    return http.post('/whatsapp/numbers/:id/connect', { params: { id } });
  },

  /** Inicia conexão por pairing code — phone no formato internacional ex: 5511999999999. */
  connectWithPhone(id, phone) {
    return http.post('/whatsapp/numbers/:id/connect', { params: { id }, body: { phone } });
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

  /** Estado atual do aquecimento. */
  getWarmupStatus(id) {
    return http.get('/whatsapp/numbers/:id/warmup', { params: { id } });
  },

  /**
   * Inicia aquecimento.
   * @param {string} id
   * @param {object} config — { msgsDay, startH, endH, content, speed }
   */
  startWarmup(id, config = {}) {
    return http.post('/whatsapp/numbers/:id/warmup', { params: { id }, body: { config } });
  },

  /** Para o aquecimento (pausa, mantém progresso). */
  stopWarmup(id) {
    return http.delete('/whatsapp/numbers/:id/warmup', { params: { id } });
  },

  /**
   * Atualiza campos de configuração de uma instância (nome, webhook, delay, limite diário).
   * @param {string} id
   * @param {object} patch — { name?, webhookUrl?, delay?, dailyLimit? }
   */
  updateNumber(id, patch) {
    return http.patch('/whatsapp/numbers/:id', { params: { id }, body: patch });
  },

  /**
   * Atualiza só a config do aquecimento (não altera enabled/pct/score).
   * @param {string} id
   * @param {object} config
   */
  updateWarmupConfig(id, config) {
    return http.patch('/whatsapp/numbers/:id/warmup', { params: { id }, body: { config } });
  },

  /**
   * Exclui uma instância (remove do UAZAPI + banco).
   * @param {string} id
   */
  deleteNumber(id) {
    return http.delete('/whatsapp/numbers/:id', { params: { id } });
  },

  /**
   * Desconecta a instância do provider WhatsApp.
   * @param {string} id
   */
  disconnect(id) {
    return http.post('/whatsapp/numbers/:id/disconnect', { params: { id } });
  },

  /**
   * Retorna a configuração de webhook da instância.
   * @param {string} id
   */
  getWebhook(id) {
    return http.get('/whatsapp/numbers/:id/webhook', { params: { id } });
  },

  /**
   * Configura o webhook da instância no padrão UAZAPI.
   * @param {string} id
   * @param {object} config — { url, enabled, events, addUrlEvents, addUrlTypeMessages }
   */
  setWebhook(id, config) {
    return http.post('/whatsapp/numbers/:id/webhook', { params: { id }, body: { config } });
  },

  /**
   * Lista últimas conversas de uma instância WhatsApp.
   * @param {string} id — UUID do número no banco
   * @param {number} [limit=20]
   */
  getChats(id, limit = 20) {
    return http.get('/whatsapp/numbers/:id/chats', { params: { id }, query: { limit } });
  },

  /**
   * Busca mensagens de uma conversa específica.
   * @param {string} id — UUID do número no banco
   * @param {string} chatId — ID do chat no WhatsApp (ex: 5511999999999@s.whatsapp.net)
   * @param {number} [limit=50]
   */
  getMessages(id, chatId, limit = 50) {
    return http.get('/whatsapp/numbers/:id/messages', { params: { id }, query: { chatId, limit } });
  },

  /**
   * Envia mensagem de texto para um chat via UAZAPI POST /send/text.
   * @param {string} id — UUID do número no banco
   * @param {string} chatId — ID do chat no WhatsApp (ex: 5511999999999@s.whatsapp.net)
   * @param {string} text — texto da mensagem
   */
  sendMessage(id, chatId, text) {
    return http.post('/whatsapp/numbers/:id/messages', { params: { id }, body: { chatId, text } });
  },
};

export default whatsappApi;

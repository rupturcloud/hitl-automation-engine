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
 *
 * Resiliência:
 *  - Timeout de 8s em todas as chamadas HTTP via AbortSignal.timeout(8000)
 *  - Cache de último estado conhecido por instância (TTL 5 min)
 *  - Circuit breaker: abre após 3 falhas consecutivas em 30s
 */
import { UazapiAdapter as LowLevelUazapi } from '../../provider-adapter/uazapi-adapter.js';

const TIMEOUT_MS        = 8000;
const CACHE_TTL_MS      = 5 * 60 * 1000; // 5 minutos
const CB_THRESHOLD      = 3;             // falhas consecutivas para abrir circuito
const CB_RESET_MS       = 30 * 1000;    // 30s — janela do circuit breaker

export class UazapiWhatsappAdapter {
  constructor({ adminToken, serverUrl, instanceToken } = {}) {
    this._client = new LowLevelUazapi({ adminToken, serverUrl, instanceToken });
    this._serverUrl  = serverUrl || 'https://free.uazapi.com';
    this._adminToken = adminToken;

    // Cache de último estado conhecido: instanceToken → { status, phone, lastSeen, cachedAt }
    this._stateCache = new Map();

    // Circuit breaker por instância: instanceToken → { count, lastFailAt }
    this._failures = new Map();
  }

  // ─── helpers de resiliência ────────────────────────────────────────────────

  /**
   * Retorna true se o circuito está aberto para a instância (não tentar request).
   */
  _isCircuitOpen(instanceToken) {
    const f = this._failures.get(instanceToken);
    if (!f) return false;
    if (f.count < CB_THRESHOLD) return false;
    return (Date.now() - f.lastFailAt) < CB_RESET_MS;
  }

  /**
   * Registra falha e atualiza contador do circuit breaker.
   */
  _recordFailure(instanceToken) {
    const prev = this._failures.get(instanceToken) || { count: 0, lastFailAt: 0 };
    this._failures.set(instanceToken, {
      count:      prev.count + 1,
      lastFailAt: Date.now(),
    });
  }

  /**
   * Reseta o circuit breaker (chamado após sucesso).
   */
  _resetFailures(instanceToken) {
    this._failures.delete(instanceToken);
  }

  /**
   * Busca cache de estado com TTL de 5min.
   * @returns {object|null}
   */
  _getCached(instanceToken) {
    const cached = this._stateCache.get(instanceToken);
    if (!cached) return null;
    if ((Date.now() - cached.cachedAt) > CACHE_TTL_MS) return null;
    return cached;
  }

  /**
   * Persiste estado no cache.
   */
  _saveCache(instanceToken, state) {
    this._stateCache.set(instanceToken, { ...state, cachedAt: Date.now() });
  }

  /**
   * Aplica timeout de 8s ao fetch do cliente de baixo nível.
   * Sobrescreve temporariamente o método fetchJson do _client para injetar o signal.
   * Retorna a promise do callback, capturando AbortError.
   *
   * @param {() => Promise<any>} fn — função que chama this._client.*
   * @param {string} label — descrição para a mensagem de erro
   */
  async _withTimeout(fn, label = 'chamada UAZAPI') {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    // Injeta o signal no fetchJson do cliente de baixo nível para este request
    const originalFetchJson = this._client.fetchJson.bind(this._client);
    this._client.fetchJson = async (url, init = {}, fallbackMessage) => {
      return originalFetchJson(url, { ...init, signal: controller.signal }, fallbackMessage);
    };

    try {
      const result = await fn();
      return result;
    } catch (err) {
      if (err.name === 'AbortError' || err.name === 'TimeoutError') {
        throw new Error(`UAZAPI timeout após 8s (${label})`);
      }
      throw err;
    } finally {
      clearTimeout(timer);
      this._client.fetchJson = originalFetchJson;
    }
  }

  // ─── interface pública ─────────────────────────────────────────────────────

  /**
   * Cria instância UAZAPI.
   * Retorna { providerId, instanceToken, status } neutro.
   *
   * IMPORTANTE: providerId === instanceToken === o campo `token` do response UAZAPI.
   * Esse valor vai para remote_instance_id no banco e é usado em TODAS as chamadas
   * subsequentes como header `token`.
   */
  async createInstance({ name }) {
    const res = await this._withTimeout(
      () => this._client.createInstance({ name }),
      'createInstance'
    );
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
    const res = await this._withTimeout(
      () => this._client.connectInstance(instanceToken, phone ? { phone } : {}),
      'startSession'
    );
    // UAZAPI /instance/connect retorna { connected, loggedIn, jid, instance }
    // QR fica em instance.qrcode; paircode em instance.paircode
    const inst = res?.instance || {};
    return {
      qrCode:      inst.qrcode      || res?.qrcode      || res?.qr          || null,
      pairingCode: inst.paircode    || res?.paircode    || res?.pairingCode  || null,
      status:      res?.connected   ? 'connected' : (res?.loggedIn ? 'connected' : 'PENDING'),
    };
  }

  /**
   * Estado da sessão (CONNECTED / DISCONNECTED / PENDING / TIMEOUT…).
   *
   * Comportamento de resiliência:
   *  - Circuito aberto (≥3 falhas em <30s) → retorna cache sem tentar UAZAPI
   *  - Falha de rede ou timeout → tenta retornar cache (<5min) com fromCache: true
   *  - Sucesso → salva no cache e reseta circuit breaker
   *
   * @param {string} instanceToken
   * @returns {{ status, phone, lastSeen, fromCache?: boolean }}
   */
  async getStatus(instanceToken) {
    // Circuit breaker: circuito aberto — retorna cache diretamente
    if (this._isCircuitOpen(instanceToken)) {
      const cached = this._getCached(instanceToken);
      if (cached) {
        const { cachedAt: _c, ...state } = cached;
        return { ...state, fromCache: true };
      }
      // Sem cache e circuito aberto: relança para não suprimir silenciosamente
      throw new Error(`UAZAPI indisponível (circuit breaker aberto) e sem cache para ${instanceToken}`);
    }

    try {
      const res = await this._withTimeout(
        () => this._client.getInstanceStatus(instanceToken),
        'getStatus'
      );

      // O spec retorna: { instance: { status, owner, ... }, status: { connected, loggedIn, jid } }
      // - status textual fica em res.instance.status (ex: "connected", "disconnected", "connecting")
      // - status.connected/loggedIn são booleanos em res.status (nível raiz, não res.status.status)
      // - phone (número do usuário) fica em res.status.jid.user (não res.status.status.jid.user)
      const inst   = res?.instance || {};
      const statusObj = res?.status || {};     // { connected: bool, loggedIn: bool, jid: {...} }
      const textStatus = inst.status
        || (statusObj.connected ? 'connected' : statusObj.loggedIn ? 'connected' : null)
        || 'disconnected';
      const state = {
        status:   textStatus,
        lastSeen: inst.lastDisconnect || res?.lastSeen || res?.last_seen || null,
        phone:    statusObj?.jid?.user || inst.owner || null,
      };

      // Sucesso: persiste cache e reseta circuit breaker
      this._saveCache(instanceToken, state);
      this._resetFailures(instanceToken);

      return state;
    } catch (err) {
      // 401/404 → instância expirou no free server (TTL 1h) — não acumula como falha temporária
      const msg = (err?.message || '').toLowerCase();
      const isExpired = msg.includes('401') || msg.includes('404') ||
                        msg.includes('invalid token') || msg.includes('not found') ||
                        msg.includes('unauthorized');
      if (isExpired) {
        // Reseta circuito (não é falha de rede — é expiração conhecida)
        this._resetFailures(instanceToken);
        // Limpa cache stale para evitar servir estado antigo como válido
        this._stateCache.delete(instanceToken);
        const expiredErr = new Error(`Instância expirada no free server (token: ${instanceToken?.slice(0, 16)}…)`);
        expiredErr.code = 'ERR_INSTANCE_EXPIRED';
        throw expiredErr;
      }

      this._recordFailure(instanceToken);

      // Tenta servir do cache antes de relançar
      const cached = this._getCached(instanceToken);
      if (cached) {
        const { cachedAt: _c, ...state } = cached;
        return { ...state, fromCache: true };
      }

      throw err;
    }
  }

  /**
   * Métricas de saúde.
   * A UAZAPI free não tem endpoint dedicado de health — usamos /instance/status
   * e extraímos o que estiver disponível.
   * @param {string} instanceToken
   */
  async getHealth(instanceToken) {
    const res = await this._withTimeout(
      () => this._client.getInstanceStatus(instanceToken),
      'getHealth'
    );
    return {
      uptime:       res?.uptime        ?? null,
      msgsToday:    res?.msgsToday     ?? res?.messagesToday ?? null,
      deliveryRate: res?.deliveryRate  ?? null,
      score:        res?.health        ?? null,
    };
  }

  /**
   * Retorna configuração atual do webhook da instância.
   * @param {string} instanceToken
   */
  async getWebhook(instanceToken) {
    return this._withTimeout(
      () => this._client.getWebhook(instanceToken),
      'getWebhook'
    );
  }

  /**
   * Configura webhook da instância no padrão UAZAPI.
   * ATENÇÃO: o spec usa `addUrlTypesMessages` (com "s" em Types) — não confundir com
   * `addUrlTypeMessages`. O campo incorreto seria silenciosamente ignorado pela API.
   * @param {string} instanceToken
   * @param {object} config — { url, enabled, events, addUrlEvents, addUrlTypesMessages }
   */
  async setWebhook(instanceToken, config = {}) {
    return this._withTimeout(
      () => this._client.updateWebhook(instanceToken, {
        url:                 config.url                 ?? '',
        enabled:             config.enabled             ?? true,
        events:              config.events              ?? ['messages_update'],
        addUrlEvents:        config.addUrlEvents        ?? false,
        // Nome correto per spec: addUrlTypesMessages (plural "Types")
        addUrlTypesMessages: config.addUrlTypesMessages ?? config.addUrlTypeMessages ?? false,
      }),
      'setWebhook'
    );
  }

  /**
   * Desconecta instância.
   * @param {string} instanceToken
   */
  async disconnect(instanceToken) {
    return this._withTimeout(
      () => this._client.disconnectInstance(instanceToken),
      'disconnect'
    );
  }

  /**
   * Deleta instância do provider.
   * @param {string} instanceToken
   */
  async deleteInstance(instanceToken) {
    return this._withTimeout(
      () => this._client.deleteInstance(instanceToken),
      'deleteInstance'
    );
  }

  /**
   * Busca últimas conversas (chats) de uma instância.
   * Usa POST /chat/find com sort por timestamp decrescente.
   *
   * @param {string} instanceToken — valor de remote_instance_id
   * @param {{ limit?: number }} opts
   * @returns {Array} chats
   */
  async getChats(instanceToken, { limit = 20 } = {}) {
    const res = await this._withTimeout(
      () => this._client.instanceRequest(instanceToken, '/chat/find', {
        method: 'POST',
        body: {
          sort:  '-wa_lastMsgTimestamp',
          limit,
          offset: 0,
        },
      }),
      'getChats'
    );
    return res?.chats || res?.data || [];
  }

  /**
   * Busca mensagens de um chat específico.
   * Usa POST /message/find com chatid e limit.
   *
   * @param {string} instanceToken — valor de remote_instance_id
   * @param {{ chatId: string, limit?: number }} opts
   * @returns {Array} messages
   */
  async getMessages(instanceToken, { chatId, limit = 50 } = {}) {
    const res = await this._withTimeout(
      () => this._client.instanceRequest(instanceToken, '/message/find', {
        method: 'POST',
        body: {
          chatid: chatId,
          limit,
          offset: 0,
        },
      }),
      'getMessages'
    );
    return res?.messages || res?.data || [];
  }

  /**
   * Envia mensagem de texto para um chat via UAZAPI POST /send/text.
   *
   * @param {string} instanceToken — valor de remote_instance_id (= token UAZAPI)
   * @param {{ chatId: string, text: string }} opts
   * @returns {object} resposta da UAZAPI
   */
  async sendMessage(instanceToken, { chatId, text }) {
    return this._withTimeout(
      () => this._client.instanceRequest(instanceToken, '/send/text', {
        method: 'POST',
        body: {
          number: chatId,
          text,
        },
      }),
      'sendMessage'
    );
  }

  /**
   * Proxy SSE: faz pipe do endpoint GET /sse da UAZAPI para a resposta do cliente.
   * Necessário porque o browser não pode chamar free.uazapi.com diretamente (CORS).
   *
   * @param {string} instanceToken — valor de remote_instance_id (= token UAZAPI)
   * @param {object} req — Node.js IncomingMessage (para detectar close do cliente)
   * @param {object} res — Node.js ServerResponse (para enviar a stream SSE)
   */
  async proxySSE(instanceToken, req, res) {
    const url = `${this._serverUrl}/sse`;

    // Envia headers SSE para o cliente antes de qualquer dado
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    });

    const controller = new AbortController();
    req.on('close', () => controller.abort());

    try {
      const upstream = await fetch(url, {
        headers: { token: instanceToken },
        signal: controller.signal,
      });

      if (!upstream.ok) {
        res.write('event: error\ndata: {"error":"upstream failed"}\n\n');
        res.end();
        return;
      }

      // Pipe do reader de stream para a resposta HTTP
      const reader = upstream.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(decoder.decode(value, { stream: true }));
      }
    } catch (e) {
      if (e.name !== 'AbortError') {
        res.write(`event: error\ndata: ${JSON.stringify({ error: e.message })}\n\n`);
      }
    } finally {
      res.end();
    }
  }
}

export default UazapiWhatsappAdapter;

/**
 * WebPushService — Web Push Notifications via VAPID (Fase 7)
 *
 * Responsabilidades:
 * - subscribe(userId, subscription, ua, ip) → INSERT em push_subscriptions
 * - unsubscribe(userId, endpoint) → marca active=false
 * - sendToUser(userId, payload) → envia push pra todas subscriptions ativas, trata 410/404 (cleanup)
 *
 * Lib: web-push (já em node_modules, declarado em package.json)
 * VAPID keys: env VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY / VAPID_CLAIM_EMAIL
 * Tabela: public.push_subscriptions (RLS por user_id)
 */

import webpush from 'web-push';

// Leitura lazy — dotenv.config() do server.mjs roda antes do primeiro uso,
// mas DEPOIS da resolução dos imports.
function readVapidEnv() {
  return {
    publicKey: process.env.VAPID_PUBLIC_KEY || process.env.VITE_VAPID_PUBLIC_KEY || null,
    privateKey: process.env.VAPID_PRIVATE_KEY || null,
    subject: process.env.VAPID_CLAIM_EMAIL
      ? `mailto:${process.env.VAPID_CLAIM_EMAIL}`
      : 'mailto:ruptur.cloud@gmail.com',
  };
}

let vapidConfigured = false;
function ensureVapid() {
  if (vapidConfigured) return true;
  const { publicKey, privateKey, subject } = readVapidEnv();
  if (!publicKey || !privateKey) {
    console.error('[WebPush] VAPID_PUBLIC_KEY ou VAPID_PRIVATE_KEY ausentes em env');
    return false;
  }
  webpush.setVapidDetails(subject, publicKey, privateKey);
  vapidConfigured = true;
  console.log('[WebPush] VAPID configurado');
  return true;
}

export class WebPushService {
  /**
   * @param {object} supabaseAdmin - cliente Supabase com service role (bypass RLS pra cleanup)
   * @param {object} logger
   */
  constructor(supabaseAdmin, logger = console) {
    this.db = supabaseAdmin;
    this.logger = logger;
    // VAPID é configurado sob demanda (ensureVapid) — env pode ainda não
    // estar carregado em import-time.
  }

  /**
   * Salva (ou reativa) subscription do usuário.
   * Idempotente por (user_id, subscription->>'endpoint').
   */
  async subscribe(userId, subscription, userAgent = null, ipAddress = null) {
    if (!userId) throw new Error('userId obrigatório');
    if (!subscription?.endpoint) throw new Error('subscription.endpoint obrigatório');

    const endpoint = subscription.endpoint;

    // Se já existe pra esse user+endpoint, reativa e atualiza payload
    const { data: existing } = await this.db
      .from('push_subscriptions')
      .select('id')
      .eq('user_id', userId)
      .filter('subscription->>endpoint', 'eq', endpoint)
      .maybeSingle();

    if (existing) {
      const { error } = await this.db
        .from('push_subscriptions')
        .update({
          subscription,
          active: true,
          user_agent: userAgent,
          ip_address: ipAddress,
        })
        .eq('id', existing.id);
      if (error) throw new Error(`update failed: ${error.message}`);
      return { id: existing.id, status: 'updated' };
    }

    const { data, error } = await this.db
      .from('push_subscriptions')
      .insert({
        user_id: userId,
        subscription,
        active: true,
        user_agent: userAgent,
        ip_address: ipAddress,
      })
      .select('id')
      .single();

    if (error) throw new Error(`insert failed: ${error.message}`);
    return { id: data.id, status: 'created' };
  }

  /**
   * Desativa subscription (não deleta — preserva histórico).
   */
  async unsubscribe(userId, endpoint) {
    if (!userId || !endpoint) throw new Error('userId e endpoint obrigatórios');

    const { data, error } = await this.db
      .from('push_subscriptions')
      .update({ active: false })
      .eq('user_id', userId)
      .filter('subscription->>endpoint', 'eq', endpoint)
      .select('id');

    if (error) throw new Error(`unsubscribe failed: ${error.message}`);
    return { affected: data?.length ?? 0 };
  }

  /**
   * Lista subscriptions ativas do usuário.
   */
  async listActive(userId) {
    const { data, error } = await this.db
      .from('push_subscriptions')
      .select('id, subscription, created_at')
      .eq('user_id', userId)
      .eq('active', true);
    if (error) throw new Error(`list failed: ${error.message}`);
    return data ?? [];
  }

  /**
   * Envia notification pra todas subscriptions ativas do user.
   * Cleanup automático: 410/404 → marca active=false.
   *
   * @param {string} userId
   * @param {object} payload - { title, body, icon?, url?, data? }
   * @returns {Promise<{sent: number, failed: number, cleaned: number}>}
   */
  async sendToUser(userId, payload) {
    if (!ensureVapid()) {
      throw new Error('VAPID não configurado — defina VAPID_PUBLIC_KEY/VAPID_PRIVATE_KEY');
    }

    const subs = await this.listActive(userId);
    if (subs.length === 0) {
      this.logger.log(`[WebPush] Nenhuma subscription ativa para user ${userId}`);
      return { sent: 0, failed: 0, cleaned: 0 };
    }

    const body = JSON.stringify({
      title: payload.title ?? 'Ruptur',
      body: payload.body ?? '',
      icon: payload.icon ?? '/icon-192.png',
      badge: payload.badge ?? '/badge-72.png',
      url: payload.url ?? '/dashboard',
      data: payload.data ?? {},
      timestamp: Date.now(),
    });

    let sent = 0;
    let failed = 0;
    let cleaned = 0;

    for (const row of subs) {
      try {
        await webpush.sendNotification(row.subscription, body, { TTL: 60 });
        sent += 1;
      } catch (err) {
        failed += 1;
        const code = err.statusCode;
        if (code === 410 || code === 404) {
          // endpoint expirou ou foi retirado → cleanup
          await this.db
            .from('push_subscriptions')
            .update({ active: false })
            .eq('id', row.id);
          cleaned += 1;
          this.logger.log(`[WebPush] cleanup id=${row.id} (status=${code})`);
        } else {
          this.logger.error(`[WebPush] erro envio id=${row.id} status=${code} msg=${err.message}`);
        }
      }
    }

    return { sent, failed, cleaned };
  }

  /**
   * Notificação de teste (helper).
   */
  async sendTest(userId) {
    return this.sendToUser(userId, {
      title: '✅ Notificações ativadas',
      body: 'Você receberá alertas do Ruptur por aqui.',
      url: '/dashboard',
      data: { kind: 'test' },
    });
  }
}

export function getVapidPublicKey() {
  return readVapidEnv().publicKey;
}

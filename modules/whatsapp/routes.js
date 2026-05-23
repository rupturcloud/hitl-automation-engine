/**
 * WhatsApp routes — mapeia /api/v1/whatsapp/* para o controller.
 *
 * Plug no gateway.mjs:
 *   import { registerWhatsappRoutes } from './modules/whatsapp/routes.js';
 *   const matched = await registerWhatsappRoutes({ req, res, pathname, ... });
 *   if (matched) return;
 */
import { WhatsappController } from './controller.js';
import { WhatsappService } from './service.js';
import { WhatsappRepository } from './repository.js';
import { UazapiWhatsappAdapter } from './adapters/uazapi.adapter.js';

/**
 * Tenta resolver a request contra /api/v1/whatsapp/*.
 * Retorna true se a rota bateu (e a resposta foi enviada), false caso contrário.
 *
 * Espera no gateway:
 *  - req.tenantId já populado por middleware de auth
 *  - req.body já parseado (POST/PATCH)
 *  - ctx.supabase já com client tenant-scoped (RLS)
 *  - ctx.uazapiCredentials para construir o adapter
 */
export async function registerWhatsappRoutes({ req, res, pathname, method, ctx }) {
  if (!pathname.startsWith('/api/v1/whatsapp/')) return false;

  const controller = buildController(ctx);

  // GET /api/v1/whatsapp/numbers
  if (pathname === '/api/v1/whatsapp/numbers' && method === 'GET') {
    await controller.listNumbers(req, res);
    return true;
  }

  // POST /api/v1/whatsapp/numbers
  if (pathname === '/api/v1/whatsapp/numbers' && method === 'POST') {
    await controller.createNumber(req, res);
    return true;
  }

  // PATCH /api/v1/whatsapp/numbers/:id
  const m2 = pathname.match(/^\/api\/v1\/whatsapp\/numbers\/([^/]+)$/);
  if (m2 && method === 'PATCH') {
    req.params = { id: m2[1] };
    await controller.updateNumber(req, res);
    return true;
  }

  // /api/v1/whatsapp/numbers/:id/(connect|reconnect|status|health|warmup)
  // POST /api/v1/whatsapp/numbers/:id/disconnect
  const mDisc = pathname.match(/^\/api\/v1\/whatsapp\/numbers\/([^/]+)\/disconnect$/);
  if (mDisc && method === 'POST') {
    req.params = { id: mDisc[1] };
    await controller.disconnect(req, res);
    return true;
  }

  // GET|POST /api/v1/whatsapp/numbers/:id/webhook
  const mWh = pathname.match(/^\/api\/v1\/whatsapp\/numbers\/([^/]+)\/webhook$/);
  if (mWh) {
    req.params = { id: mWh[1] };
    if (method === 'GET')  { await controller.getWebhook(req, res); return true; }
    if (method === 'POST') { await controller.setWebhook(req, res);  return true; }
  }

  const m = pathname.match(/^\/api\/v1\/whatsapp\/numbers\/([^/]+)\/(connect|reconnect|status|health|warmup)$/);
  if (m) {
    req.params = { id: m[1] };
    const action = m[2];
    if (action === 'connect'   && method === 'POST')   { await controller.connect(req, res);           return true; }
    if (action === 'reconnect' && method === 'POST')   { await controller.reconnect(req, res);          return true; }
    if (action === 'status'    && method === 'GET')    { await controller.getStatus(req, res);          return true; }
    if (action === 'health'    && method === 'GET')    { await controller.getHealth(req, res);          return true; }
    if (action === 'warmup'    && method === 'GET')    { await controller.getWarmupStatus(req, res);    return true; }
    if (action === 'warmup'    && method === 'POST')   { await controller.startWarmup(req, res);        return true; }
    if (action === 'warmup'    && method === 'DELETE') { await controller.stopWarmup(req, res);         return true; }
    if (action === 'warmup'    && method === 'PATCH')  { await controller.updateWarmupConfig(req, res); return true; }
  }

  return false;
}

function buildController(ctx) {
  const repository = new WhatsappRepository({ supabase: ctx.supabase });
  const adapter = new UazapiWhatsappAdapter(ctx.uazapiCredentials || {});
  const service = new WhatsappService({ repository, adapter });
  return new WhatsappController({ service });
}

export default { registerWhatsappRoutes };

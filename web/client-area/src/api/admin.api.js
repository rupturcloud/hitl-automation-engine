/**
 * Ruptur Admin API Client
 * Endpoints /api/admin/* — protegidos por requirePlatformAdmin no gateway.
 *
 * Doutrina: mesmo padrão do httpClient.js, base /api/admin.
 */

import { ApiError } from './httpClient.js';

const ADMIN_BASE = '/api/admin';

function getAuthHeader() {
  const token = window.__ruptur?.auth?.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function adminRequest(method, path, { body, params, query } = {}) {
  let url = `${ADMIN_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      url = url.replace(`:${k}`, encodeURIComponent(v));
    }
  }
  if (query) {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null) qs.set(k, String(v));
    }
    const s = qs.toString();
    if (s) url += `?${s}`;
  }

  const init = {
    method,
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    credentials: 'include',
  };
  if (body !== undefined) init.body = JSON.stringify(body);

  let res;
  try {
    res = await fetch(url, init);
  } catch (e) {
    throw new ApiError({ code: 'ERR_NETWORK', message: 'Sem conexão com o servidor.', details: { cause: String(e) } });
  }

  let payload;
  try { payload = await res.json(); } catch {
    throw new ApiError({ code: 'ERR_BAD_RESPONSE', message: 'Resposta inesperada do servidor.', status: res.status });
  }

  if (!res.ok) {
    throw new ApiError({
      code: `HTTP_${res.status}`,
      message: payload?.error || payload?.message || `Erro ${res.status}`,
      status: res.status,
      details: payload,
    });
  }
  return payload;
}

// ─── Provider Accounts (UAZAPI) ───────────────────────────────────────────────

export const providerApi = {
  /** Lista contas de provedor UAZAPI da plataforma */
  listAccounts() {
    return adminRequest('GET', '/provider-accounts');
  },

  /** Cria nova conta UAZAPI
   * @param {{ label, serverUrl, adminToken, accountKind, capacityInstances }} payload
   */
  createAccount(payload) {
    return adminRequest('POST', '/provider-accounts', { body: payload });
  },

  /** Edita campos de uma conta (label, serverUrl, accountKind, capacityInstances, rotationPolicy) */
  updateAccount(id, patch) {
    return adminRequest('PATCH', `/provider-accounts/${id}`, { body: patch });
  },

  /** Exclui uma conta (bloqueia se houver instâncias ativas) */
  deleteAccount(id) {
    return adminRequest('DELETE', `/provider-accounts/${id}`);
  },

  /** Rotaciona o admin token de uma conta */
  rotateToken(id, adminToken) {
    return adminRequest('POST', `/provider-accounts/${id}/rotate`, { body: { adminToken } });
  },

  /** Atualiza status de uma conta: active | draining | disabled */
  updateStatus(id, status) {
    return adminRequest('POST', `/provider-accounts/${id}/status`, { body: { status } });
  },

  /** Sincroniza instâncias remotas de uma conta */
  syncAccount(id) {
    return adminRequest('POST', `/provider-accounts/${id}/sync`);
  },

  /** Lista presets de integrações conhecidas */
  listPresets(kind) {
    return adminRequest('GET', '/integration-presets', { query: kind ? { kind } : undefined });
  },
};

export default providerApi;

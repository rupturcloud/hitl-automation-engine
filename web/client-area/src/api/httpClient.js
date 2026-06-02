/**
 * Ruptur API HTTP Client — único ponto de saída do frontend para o gateway.
 *
 * Doutrina (docs/ROUTING_API_ARCHITECTURE.md):
 *  - Frontend nunca conhece IP, URL de provider, nome de fornecedor.
 *  - Toda chamada passa por aqui.
 *  - Base path = `/api/v1/` (proxy do Vite/gateway em dev e prod).
 *  - Response sempre { ok, data, meta, error }. Em erro, dispara ApiError.
 *
 * Uso:
 *   import { http } from '@/api/httpClient';
 *   const { data } = await http.get('/whatsapp/numbers');
 *   await http.post('/whatsapp/numbers/:id/connect', { id });
 */

const API_BASE = '/api/v1';

export class ApiError extends Error {
  constructor({ code, message, details, status }) {
    super(message || 'Erro de API');
    this.name = 'ApiError';
    this.code = code || 'ERR_UNKNOWN';
    this.details = details || {};
    this.status = status;
  }
}

// Hook de auth: cada chamada injeta token + tenantId do AuthContext via window.__ruptur.auth
// (setado por AuthContext.jsx ao logar). Evita dependência circular React → http.
function getAuthHeader() {
  const { token, tenantId } = window.__ruptur?.auth || {};
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (tenantId) headers['X-Tenant-Id'] = tenantId;
  return headers;
}

function buildPath(path, params = {}) {
  // Substitui :param na path com params
  let result = path;
  for (const [k, v] of Object.entries(params)) {
    result = result.replace(`:${k}`, encodeURIComponent(v));
  }
  return `${API_BASE}${result.startsWith('/') ? '' : '/'}${result}`;
}

async function request(method, path, { body, params, query, headers } = {}) {
  const url = new URL(buildPath(path, params), window.location.origin);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null) url.searchParams.set(k, v);
    }
  }

  const init = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...(headers || {}),
    },
    credentials: 'include',
  };
  if (body !== undefined) init.body = JSON.stringify(body);

  let res;
  try {
    res = await fetch(url.pathname + url.search, init);
  } catch (e) {
    // Erro de rede / CORS / DNS — virou texto humano (P2 pilar).
    throw new ApiError({
      code: 'ERR_NETWORK',
      message: 'Não conseguimos falar com o servidor agora.',
      details: { cause: String(e) },
    });
  }

  let payload;
  try {
    payload = await res.json();
  } catch {
    // Resposta não-JSON (HTML de erro, etc.)
    throw new ApiError({
      code: 'ERR_BAD_RESPONSE',
      message: 'Resposta inesperada do servidor.',
      status: res.status,
    });
  }

  // Padrão Ruptur: { ok, data, meta, error }
  if (payload && typeof payload.ok === 'boolean') {
    if (!payload.ok) {
      throw new ApiError({
        code: payload.error?.code,
        message: payload.error?.message,
        details: payload.error?.details,
        status: res.status,
      });
    }
    return { data: payload.data, meta: payload.meta || {} };
  }

  // Fallback durante migração: endpoint legacy ainda não normalizado.
  // Aceita { ...legacy } como data, marca meta.legacy=true.
  if (!res.ok) {
    throw new ApiError({
      code: `HTTP_${res.status}`,
      message: payload?.message || payload?.error || `Erro ${res.status}`,
      status: res.status,
      details: payload,
    });
  }
  return { data: payload, meta: { legacy: true } };
}

export const http = {
  get:    (path, opts) => request('GET',    path, opts),
  post:   (path, opts) => request('POST',   path, opts),
  patch:  (path, opts) => request('PATCH',  path, opts),
  put:    (path, opts) => request('PUT',    path, opts),
  delete: (path, opts) => request('DELETE', path, opts),
};

export default http;

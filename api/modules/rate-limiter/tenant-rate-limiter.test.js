/**
 * Unit Tests: tenant-rate-limiter
 * Jest — testa sliding window, limites por plano e rotas isentas.
 *
 * Mover para tests/unit/tenant-rate-limiter.test.js quando tiver permissão de escrita.
 */

import { describe, test, expect } from '@jest/globals';
import { rateLimitTenant, isExemptRoute, PLAN_LIMITS, WINDOW_MS } from './tenant-rate-limiter.js';

describe('rateLimitTenant — limites por plano', () => {
  test('plano trial: permite até 60 requests na janela', () => {
    const id = 'tenant-trial-allow';
    for (let i = 0; i < 60; i++) {
      const result = rateLimitTenant(id, 'trial');
      expect(result.allowed).toBe(true);
    }
    // 61ª deve ser bloqueada
    const blocked = rateLimitTenant(id, 'trial');
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  test('plano trial: remaining decrementa corretamente', () => {
    const id = 'tenant-trial-remaining';
    const first = rateLimitTenant(id, 'trial');
    expect(first.allowed).toBe(true);
    expect(first.remaining).toBe(PLAN_LIMITS.trial - 1);
  });

  test('plano starter: limite é 300', () => {
    const id = 'tenant-starter';
    let last;
    for (let i = 0; i < 300; i++) {
      last = rateLimitTenant(id, 'starter');
    }
    expect(last.allowed).toBe(true);
    expect(last.remaining).toBe(0);
    const blocked = rateLimitTenant(id, 'starter');
    expect(blocked.allowed).toBe(false);
  });

  test('plano custom: nunca bloqueia', () => {
    const id = 'tenant-custom';
    for (let i = 0; i < 5000; i++) {
      const result = rateLimitTenant(id, 'custom');
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(Infinity);
    }
  });

  test('plano desconhecido: cai no limite de trial (60)', () => {
    const id = 'tenant-unknown-plan';
    for (let i = 0; i < 60; i++) {
      rateLimitTenant(id, 'enterprise-legacy');
    }
    const blocked = rateLimitTenant(id, 'enterprise-legacy');
    expect(blocked.allowed).toBe(false);
  });
});

describe('rateLimitTenant — sliding window', () => {
  test('resetAt é uma Date válida no futuro', () => {
    const id = 'tenant-reset-date';
    const before = Date.now();
    const result = rateLimitTenant(id, 'trial');
    expect(result.resetAt).toBeInstanceOf(Date);
    expect(result.resetAt.getTime()).toBeGreaterThan(before);
    expect(result.resetAt.getTime()).toBeLessThanOrEqual(before + WINDOW_MS + 100);
  });

  test('tenantId recém-criado começa com limite cheio', () => {
    const id = `tenant-fresh-${Date.now()}`;
    const result = rateLimitTenant(id, 'trial');
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(PLAN_LIMITS.trial - 1);
  });
});

describe('rateLimitTenant — retorno estruturado', () => {
  test('retorna limit correto para cada plano', () => {
    const planos = ['trial', 'starter', 'pro', 'business'];
    planos.forEach((plano, i) => {
      const result = rateLimitTenant(`tenant-limit-check-${i}`, plano);
      expect(result.limit).toBe(PLAN_LIMITS[plano]);
    });
  });

  test('plano custom retorna limit Infinity e resetAt epoch', () => {
    const result = rateLimitTenant('tenant-custom-limit', 'custom');
    expect(result.limit).toBe(Infinity);
    expect(result.resetAt).toEqual(new Date(0));
  });
});

describe('isExemptRoute — rotas isentas', () => {
  test('/api/health é isenta', () => {
    expect(isExemptRoute('/api/health')).toBe(true);
  });

  test('/api/webhooks/* é isenta', () => {
    expect(isExemptRoute('/api/webhooks/mercadopago')).toBe(true);
    expect(isExemptRoute('/api/webhooks/')).toBe(true);
  });

  test('/api/inbox/sse/* é isenta', () => {
    expect(isExemptRoute('/api/inbox/sse/tenant-abc')).toBe(true);
  });

  test('/api/messages NÃO é isenta', () => {
    expect(isExemptRoute('/api/messages')).toBe(false);
  });

  test('/api/healthcheck NÃO é isenta (prefixo diferente de /api/health)', () => {
    expect(isExemptRoute('/api/healthcheck')).toBe(false);
  });

  test('/api/instances NÃO é isenta', () => {
    expect(isExemptRoute('/api/instances')).toBe(false);
  });
});

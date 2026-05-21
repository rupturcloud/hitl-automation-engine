/**
 * Testes de Segurança: Billing Multi-Tenant — Unitários com Mocks
 *
 * Valida as regras de negócio de:
 * - RBAC: Permissões por role (member/admin/owner)
 * - Auditoria: Logging de operações
 * - Isolamento: Validação de tenant_id
 * - Limites de Compra: max_purchase_amount / require_approval_above
 *
 * Todos os testes são unitários (sem dependência de Supabase real).
 *
 * Uso: npm test -- tests/billing.security.test.js
 */

import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { PermissionsService } from '../modules/billing/permissions.service.js';
import { AuditService } from '../modules/billing/audit.service.js';

// ============================================================
// Helpers de mock para o Supabase client
// ============================================================

/**
 * Cria um mock de query chainável que resolve com `response` ao final.
 */
function buildQuery(response = { data: null, error: null }) {
  const chain = {
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    lte: jest.fn().mockReturnThis(),
    maybeSingle: jest.fn().mockResolvedValue(response),
    single: jest.fn().mockResolvedValue(response),
    then: jest.fn((cb) => Promise.resolve(response).then(cb)),
  };
  return chain;
}

/**
 * Cria um Supabase client mock onde `from()` retorna o builder com a resposta desejada.
 */
function createMockSupabase(response = { data: null, error: null }) {
  return {
    from: jest.fn(() => buildQuery(response)),
  };
}

// ============================================================
// RBAC: Permissões de Billing
// ============================================================

describe('RBAC: Permissões de Billing', () => {
  let permService;

  beforeEach(() => {
    permService = new PermissionsService(createMockSupabase());
  });

  test('member não tem permissão de purchase (retorna false)', async () => {
    // Supabase retorna role=member e allowed_roles=['owner','admin']
    const mockSupabase = {
      from: jest.fn()
        .mockReturnValueOnce(buildQuery({ data: { role: 'member' }, error: null }))
        .mockReturnValueOnce(buildQuery({ data: { purchase_allowed_roles: ['owner', 'admin'] }, error: null })),
    };

    permService = new PermissionsService(mockSupabase);

    const hasPermission = await permService.checkBillingPermission(
      'user-member',
      'tenant-123',
      'purchase'
    );

    expect(hasPermission).toBe(false);
  });

  test('admin tem permissão de purchase (retorna true)', async () => {
    const mockSupabase = {
      from: jest.fn()
        .mockReturnValueOnce(buildQuery({ data: { role: 'admin' }, error: null }))
        .mockReturnValueOnce(buildQuery({ data: { purchase_allowed_roles: ['owner', 'admin'] }, error: null })),
    };

    permService = new PermissionsService(mockSupabase);

    const hasPermission = await permService.checkBillingPermission(
      'user-admin',
      'tenant-123',
      'purchase'
    );

    expect(hasPermission).toBe(true);
  });

  test('owner tem permissão de manage_subscription (retorna true)', async () => {
    const mockSupabase = {
      from: jest.fn()
        .mockReturnValueOnce(buildQuery({ data: { role: 'owner' }, error: null }))
        .mockReturnValueOnce(buildQuery({ data: { manage_subscription_allowed_roles: ['owner', 'admin'] }, error: null })),
    };

    permService = new PermissionsService(mockSupabase);

    const hasPermission = await permService.checkBillingPermission(
      'user-owner',
      'tenant-123',
      'manage_subscription'
    );

    expect(hasPermission).toBe(true);
  });

  test('member não tem permissão de manage_subscription (retorna false)', async () => {
    const mockSupabase = {
      from: jest.fn()
        .mockReturnValueOnce(buildQuery({ data: { role: 'member' }, error: null }))
        .mockReturnValueOnce(buildQuery({ data: { manage_subscription_allowed_roles: ['owner', 'admin'] }, error: null })),
    };

    permService = new PermissionsService(mockSupabase);

    const hasPermission = await permService.checkBillingPermission(
      'user-member',
      'tenant-123',
      'manage_subscription'
    );

    expect(hasPermission).toBe(false);
  });

  test('requireBillingPermission lança ForbiddenError para member', async () => {
    const mockSupabase = {
      from: jest.fn()
        .mockReturnValueOnce(buildQuery({ data: { role: 'member' }, error: null }))
        .mockReturnValueOnce(buildQuery({ data: { purchase_allowed_roles: ['owner', 'admin'] }, error: null })),
    };

    permService = new PermissionsService(mockSupabase);

    await expect(
      permService.requireBillingPermission('user-member', 'tenant-123', 'purchase')
    ).rejects.toThrow('not permitted to purchase');
  });

  test('requireBillingPermission não lança para admin', async () => {
    const mockSupabase = {
      from: jest.fn()
        .mockReturnValueOnce(buildQuery({ data: { role: 'admin' }, error: null }))
        .mockReturnValueOnce(buildQuery({ data: { purchase_allowed_roles: ['owner', 'admin'] }, error: null })),
    };

    permService = new PermissionsService(mockSupabase);

    await expect(
      permService.requireBillingPermission('user-admin', 'tenant-123', 'purchase')
    ).resolves.toBeUndefined();
  });

  test('action inválida lança erro', async () => {
    const hasPermission = await permService.checkBillingPermission(
      'user-123',
      'tenant-123',
      'acao_invalida'
    );

    // Retorna false (capturado no catch interno)
    expect(hasPermission).toBe(false);
  });

  test('usuário sem role no tenant retorna false', async () => {
    const mockSupabase = {
      from: jest.fn()
        .mockReturnValueOnce(buildQuery({ data: null, error: { message: 'not found' } })),
    };

    permService = new PermissionsService(mockSupabase);

    const hasPermission = await permService.checkBillingPermission(
      'user-sem-role',
      'tenant-123',
      'purchase'
    );

    expect(hasPermission).toBe(false);
  });
});

// ============================================================
// Auditoria: Logging de Operações
// ============================================================

describe('Auditoria: Logging de Operações', () => {
  let auditService;
  let mockFrom;

  beforeEach(() => {
    const mockInsertChain = {
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: { id: 'audit-log-001' }, error: null }),
    };

    mockFrom = jest.fn(() => mockInsertChain);
    auditService = new AuditService({ from: mockFrom });
  });

  test('log de compra retorna audit_log_id', async () => {
    const auditId = await auditService.log({
      tenantId: 'tenant-123',
      userId: 'user-admin',
      action: 'checkout_created',
      resourceType: 'payment',
      resourceId: 'pay-001',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0',
      actingAsRole: 'admin',
    });

    expect(auditId).toBe('audit-log-001');
  });

  test('log registra campos corretos no insert', async () => {
    let capturedPayload = null;
    const mockChain = {
      insert: jest.fn((rows) => {
        capturedPayload = rows[0];
        return mockChain;
      }),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: { id: 'audit-log-002' }, error: null }),
    };

    auditService = new AuditService({ from: jest.fn(() => mockChain) });

    await auditService.log({
      tenantId: 'tenant-123',
      userId: 'user-admin',
      action: 'checkout_created',
      ipAddress: '10.0.0.1',
      userAgent: 'TestAgent/1.0',
      actingAsRole: 'admin',
    });

    expect(capturedPayload.action).toBe('checkout_created');
    expect(capturedPayload.ip_address).toBe('10.0.0.1');
    expect(capturedPayload.user_agent).toBe('TestAgent/1.0');
    expect(capturedPayload.acting_as_role).toBe('admin');
    expect(capturedPayload.tenant_id).toBe('tenant-123');
    expect(capturedPayload.user_id).toBe('user-admin');
  });

  test('log de permissão negada registra action correta', async () => {
    let capturedAction = null;
    const mockChain = {
      insert: jest.fn((rows) => {
        capturedAction = rows[0].action;
        return mockChain;
      }),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: { id: 'audit-log-003' }, error: null }),
    };

    auditService = new AuditService({ from: jest.fn(() => mockChain) });

    await auditService.log({
      tenantId: 'tenant-123',
      userId: 'user-member',
      action: 'checkout_permission_denied',
      actingAsRole: 'member',
    });

    expect(capturedAction).toBe('checkout_permission_denied');
  });

  test('log sem userId lança erro', async () => {
    const auditId = await auditService.log({
      tenantId: 'tenant-123',
      action: 'checkout_created',
      // userId ausente
    });

    // AuditService captura o erro internamente e retorna null
    expect(auditId).toBeNull();
  });

  test('log sem action lança erro (retorna null)', async () => {
    const auditId = await auditService.log({
      tenantId: 'tenant-123',
      userId: 'user-123',
      // action ausente
    });

    expect(auditId).toBeNull();
  });

  test('getAuditHistory retorna array de logs do tenant', async () => {
    const mockLogs = [
      { id: '1', action: 'checkout_created', tenant_id: 'tenant-123' },
      { id: '2', action: 'checkout_permission_denied', tenant_id: 'tenant-123' },
    ];

    const mockChain = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({ data: mockLogs, error: null }),
    };

    auditService = new AuditService({ from: jest.fn(() => mockChain) });

    const logs = await auditService.getAuditHistory('tenant-123');

    expect(logs).toHaveLength(2);
    expect(logs[0].action).toBe('checkout_created');
  });
});

// ============================================================
// Isolamento Multi-Tenant
// ============================================================

describe('Isolamento: Validação de tenant_id', () => {
  let permService;

  test('getUserRole retorna null para usuário de outro tenant', async () => {
    // Supabase retorna null (RLS bloquearia em prod, aqui simulamos)
    const mockSupabase = {
      from: jest.fn(() => buildQuery({ data: null, error: { message: 'no rows' } })),
    };

    permService = new PermissionsService(mockSupabase);

    const role = await permService.getUserRole('user-tenant-a', 'tenant-b');

    expect(role).toBeNull();
  });

  test('getTenantBillingPermissions retorna defaults quando tenant não tem config', async () => {
    const mockSupabase = {
      from: jest.fn(() => buildQuery({ data: null, error: { message: 'not found' } })),
    };

    permService = new PermissionsService(mockSupabase);

    const perms = await permService.getTenantBillingPermissions('tenant-sem-config');

    expect(perms.purchase_allowed_roles).toContain('owner');
    expect(perms.purchase_allowed_roles).toContain('admin');
    expect(perms.view_billing_allowed_roles).toContain('member');
  });

  test('checkBillingPermission isola por tenant (user de outro tenant não tem acesso)', async () => {
    // Role não encontrada porque tenant_id não bate
    const mockSupabase = {
      from: jest.fn(() => buildQuery({ data: null, error: { message: 'not found' } })),
    };

    permService = new PermissionsService(mockSupabase);

    const hasPermission = await permService.checkBillingPermission(
      'user-tenant-a',
      'tenant-b',
      'purchase'
    );

    expect(hasPermission).toBe(false);
  });
});

// ============================================================
// Limites de Compra
// ============================================================

describe('Limites de Compra', () => {
  let permService;

  test('compra acima de max_purchase_amount é bloqueada', async () => {
    const mockSupabase = {
      from: jest.fn(() =>
        buildQuery({
          data: {
            max_purchase_amount: 100,
            require_approval_above: null,
          },
          error: null,
        })
      ),
    };

    permService = new PermissionsService(mockSupabase);

    // 500 BRL = 50000 centavos
    const result = await permService.validatePurchaseLimit('tenant-123', 50000);

    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('exceeds max');
  });

  test('compra dentro do limite é permitida', async () => {
    const mockSupabase = {
      from: jest.fn(() =>
        buildQuery({
          data: {
            max_purchase_amount: 500,
            require_approval_above: null,
          },
          error: null,
        })
      ),
    };

    permService = new PermissionsService(mockSupabase);

    // 100 BRL = 10000 centavos
    const result = await permService.validatePurchaseLimit('tenant-123', 10000);

    expect(result.allowed).toBe(true);
    expect(result.requiresApproval).toBeFalsy();
  });

  test('compra acima de require_approval_above precisa aprovação', async () => {
    const mockSupabase = {
      from: jest.fn(() =>
        buildQuery({
          data: {
            max_purchase_amount: null,
            require_approval_above: 1000,
          },
          error: null,
        })
      ),
    };

    permService = new PermissionsService(mockSupabase);

    // 1500 BRL = 150000 centavos
    const result = await permService.validatePurchaseLimit('tenant-123', 150000);

    expect(result.allowed).toBe(true);
    expect(result.requiresApproval).toBe(true);
    expect(result.reason).toContain('approval threshold');
  });

  test('sem config de limite = permite compra sem aprovação', async () => {
    const mockSupabase = {
      from: jest.fn(() => buildQuery({ data: null, error: { message: 'not found' } })),
    };

    permService = new PermissionsService(mockSupabase);

    const result = await permService.validatePurchaseLimit('tenant-sem-config', 99999999);

    expect(result.allowed).toBe(true);
    expect(result.requiresApproval).toBe(false);
  });
});

// ============================================================
// Contexto de Segurança em Logs
// ============================================================

describe('Contexto de Segurança em Logs', () => {
  test('audit log registra ip_address, user_agent e acting_as_role', async () => {
    let capturedRow = null;

    const mockChain = {
      insert: jest.fn((rows) => {
        capturedRow = rows[0];
        return mockChain;
      }),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: { id: 'audit-ctx-001' }, error: null }),
    };

    const auditService = new AuditService({ from: jest.fn(() => mockChain) });

    await auditService.log({
      tenantId: 'tenant-123',
      userId: 'user-admin',
      action: 'checkout_created',
      ipAddress: '203.0.113.5',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)',
      actingAsRole: 'admin',
    });

    expect(capturedRow.ip_address).toBe('203.0.113.5');
    expect(capturedRow.user_agent).toContain('Mozilla');
    expect(capturedRow.acting_as_role).toBe('admin');
  });

  test('logPurchaseCredits usa action=purchase_credits e resourceType=payment', async () => {
    let capturedRow = null;

    const mockChain = {
      insert: jest.fn((rows) => {
        capturedRow = rows[0];
        return mockChain;
      }),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: { id: 'audit-ctx-002' }, error: null }),
    };

    const auditService = new AuditService({ from: jest.fn(() => mockChain) });

    await auditService.logPurchaseCredits({
      tenantId: 'tenant-123',
      userId: 'user-admin',
      actingAsRole: 'admin',
    });

    expect(capturedRow.action).toBe('purchase_credits');
    expect(capturedRow.resource_type).toBe('payment');
  });

  test('updateTenantBillingPermissions lança erro se usuário não é owner', async () => {
    const mockSupabase = {
      from: jest.fn(() => buildQuery({ data: { role: 'admin' }, error: null })),
    };

    const permService = new PermissionsService(mockSupabase);

    await expect(
      permService.updateTenantBillingPermissions('user-admin', 'tenant-123', {
        purchase_allowed_roles: ['owner'],
      })
    ).rejects.toThrow('Only tenant owner can update billing permissions');
  });
});

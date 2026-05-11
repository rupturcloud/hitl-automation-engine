// Setup global jest environment for tests
// Jest globals (describe, it, expect, beforeEach, afterEach, etc.) are automatically available
// in Node.js test environment, no additional setup needed

/**
 * Helper para setup de tenant de teste
 * @param {Object} supabase - Cliente Supabase
 * @returns {Promise<{tenantId: string, cleanup: Function}>}
 */
export async function setupTestTenant(supabase) {
  const tenantId = `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Criar tenant e usuário padrão
  const { data: tenant, error: tenantError } = await supabase
    .from('tenants')
    .insert({ id: tenantId, name: `Test Tenant ${Date.now()}` })
    .select()
    .single();

  if (tenantError) {
    console.error('Failed to create test tenant:', tenantError);
  }

  // Função de cleanup
  const cleanup = async () => {
    // Deletar registros de teste (ordem importa por foreign keys)
    const tables = ['subscriptions', 'webhook_events', 'analytics_events', 'onboarding_progress', 'users', 'tenants'];
    for (const table of tables) {
      try {
        if (table === 'tenants') {
          await supabase.from(table).delete().eq('id', tenantId);
        } else {
          await supabase.from(table).delete().eq('tenant_id', tenantId);
        }
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  };

  return { tenantId, cleanup };
}

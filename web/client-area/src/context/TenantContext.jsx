/* eslint-disable react-refresh/only-export-components -- múltiplos exports necessários para o contexto */
/**
 * TenantContext — contexto do tenant ativo
 * Provê tenantId, userRole e helpers para uso em componentes de time/admin
 */
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export const TenantContext = createContext({
  tenantId: null,
  userRole: null,
  tenant: null,
  loading: true,
});

export function TenantProvider({ children }) {
  const { session } = useAuth();
  const [tenantId, setTenantId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- early return síncrono intencional
    if (!session?.user?.id) { setLoading(false); return; }

    const load = async () => {
      try {
        // Buscar membership do usuário logado
        const { data } = await supabase
          .from('user_tenant_memberships')
          .select('tenant_id, role, tenants(id, slug, name, plan, status)')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (data) {
          setTenantId(data.tenant_id);
          setUserRole(data.role);
          setTenant(data.tenants);
        }
      } catch {
        // sem tenant ainda
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [session?.user?.id]);

  return (
    <TenantContext.Provider value={{ tenantId, userRole, tenant, loading }}>
      {children}
    </TenantContext.Provider>
  );
}

export const useTenant = () => useContext(TenantContext);

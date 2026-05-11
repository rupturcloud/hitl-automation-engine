/**
 * AuthContext — Contexto global de autenticação
 *
 * Gerencia sessão Supabase + dados do tenant logado.
 * Substitui completamente o login por string e localStorage.
 */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../services/supabase';
import { logger } from '../utils/logger';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [isPlatformAdmin, setIsPlatformAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const bootstrappedRef = useRef(false);

  const finishInitialAuth = useCallback(() => {
    bootstrappedRef.current = true;
    setAuthReady(true);
    setLoading(false);
  }, []);

  // Busca dados do tenant vinculado ao user
  const fetchTenant = useCallback(async (userId) => {
    try {
      logger.debug('[Auth] Iniciando fetchTenant', { userId });

      const { data: memberships, error: membError } = await supabase
        .from('user_tenant_memberships')
        .select('tenant_id, role')
        .eq('user_id', userId);

      if (membError) {
        logger.error('[Auth] Erro ao buscar memberships', membError, { userId });
        setTenant(null);
        return;
      }

      if (!memberships || memberships.length === 0) {
        logger.info('[Auth] Usuário sem tenant vinculado', { userId });
        setTenant(null);
        return;
      }

      logger.debug('[Auth] Memberships encontradas', { count: memberships.length, memberships });
      let selectedMembership = memberships[0];

      const { data: rupturTenant, error: rupturError } = await supabase
        .from('tenants')
        .select('id, name, created_at, updated_at')
        .eq('name', 'Ruptur (PROD)')
        .maybeSingle();

      if (rupturError) {
        logger.warn('[Auth] Erro ao buscar Ruptur tenant', rupturError, { userId });
      }

      if (rupturTenant) {
        const rupturMembership = memberships.find(m => m.tenant_id === rupturTenant.id);
        if (rupturMembership) {
          selectedMembership = { ...rupturMembership, tenantData: rupturTenant };
          logger.info('[Auth] Ruptur tenant encontrado e selecionado', { tenantId: rupturTenant.id });
        } else if (!selectedMembership.tenantData) {
          const { data: tenantData, error: tenantError } = await supabase
            .from('tenants')
            .select('id, name, created_at, updated_at')
            .eq('id', selectedMembership.tenant_id)
            .maybeSingle();

          if (tenantError) {
            logger.warn('[Auth] Erro ao buscar tenant data', tenantError, { tenantId: selectedMembership.tenant_id });
          }
          selectedMembership.tenantData = tenantData;
        }
      }

      if (selectedMembership.tenantData) {
        logger.info('[Auth] Tenant carregado com sucesso', {
          tenantId: selectedMembership.tenantData.id,
          tenantName: selectedMembership.tenantData.name,
          userRole: selectedMembership.role,
        });
        setTenant({
          ...selectedMembership.tenantData,
          userRole: selectedMembership.role,
        });
      } else {
        logger.warn('[Auth] Nenhum tenant data disponível após queries', { selectedMembership });
        setTenant(null);
      }
    } catch (err) {
      logger.error('[Auth] Erro inesperado em fetchTenant', err, { userId });
      setTenant(null);
    }
  }, []);

  // Verifica se o usuário é superadmin
  const checkPlatformAdmin = useCallback(async (token) => {
    try {
      const res = await fetch('/api/admin/platform/check', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setIsPlatformAdmin(data.isPlatformAdmin === true);
      } else {
        setIsPlatformAdmin(false);
      }
    } catch (err) {
      console.warn('[Auth] Erro ao verificar status de superadmin:', err);
      setIsPlatformAdmin(false);
    }
  }, []);

  // Carrega sessão existente e escuta mudanças
  useEffect(() => {
    let isMounted = true;

    async function initializeSession() {
      setLoading(true);

      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.warn('[Auth] Falha ao verificar sessão:', error.message);
          if (!isMounted) return;
          setSession(null);
          setUser(null);
          setTenant(null);
          finishInitialAuth();
          return;
        }

        const currentSession = data?.session ?? null;
        if (!isMounted) return;

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          await fetchTenant(currentSession.user.id);
          if (currentSession.access_token) {
            await checkPlatformAdmin(currentSession.access_token);
          }
          if (isMounted) finishInitialAuth();
        } else {
          setTenant(null);
          setIsPlatformAdmin(false);
          finishInitialAuth();
        }
      } catch (err) {
        console.error('[Auth] Erro inesperado ao verificar sessão:', err);
        if (!isMounted) return;
        setSession(null);
        setUser(null);
        setTenant(null);
        finishInitialAuth();
      }
    }

    initializeSession();

    // Listener de mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        const isInitialAuthEvent = !bootstrappedRef.current;
        if (isInitialAuthEvent) setLoading(true);
        setSession(newSession);
        setUser(newSession?.user ?? null);

        try {
          if (newSession?.user) {
            await fetchTenant(newSession.user.id);
            if (newSession.access_token) {
              await checkPlatformAdmin(newSession.access_token);
            }
            if (isInitialAuthEvent) finishInitialAuth();
          } else {
            setTenant(null);
            setIsPlatformAdmin(false);
            if (isInitialAuthEvent) finishInitialAuth();
          }
        } catch (err) {
          console.error('[Auth] Erro ao processar mudança de sessão:', err);
          setTenant(null);
          setIsPlatformAdmin(false);
          if (isInitialAuthEvent) finishInitialAuth();
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchTenant, checkPlatformAdmin, finishInitialAuth]);

  // Sign Up — cria conta + provisiona tenant
  const signUp = useCallback(async (email, password, tenantName) => {
    setLoading(true);

    // 1. Cria user no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { tenant_name: tenantName }, // Metadata custom
      },
    });

    if (authError) {
      setLoading(false);
      throw authError;
    }

    // 2. Provisiona tenant via API do backend (com service_role)
    //    O backend escuta o webhook de auth ou fazemos via API
    if (authData.user) {
      try {
        const res = await fetch('/api/tenants/provision', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authData.session?.access_token}`,
          },
          body: JSON.stringify({
            userId: authData.user.id,
            email,
            tenantName,
          }),
        });

        if (!res.ok) {
          console.warn('[Auth] Falha no provisionamento, tentará no próximo login');
        }
      } catch (err) {
        console.warn('[Auth] Provisionamento offline:', err.message);
      }
    }

    return authData;
  }, []);

  // Sign In com email + password
  const signIn = useCallback(async (email, password) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      throw error;
    }

    return data;
  }, []);

  // Sign Out
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setTenant(null);
  }, []);

  // Helpers derivados
  const isAuthenticated = !!session && !!user;
  const isAdmin = user?.email === 'admin@ruptur.cloud' || tenant?.userRole === 'owner';
  const tenantId = tenant?.id ?? null;

  const value = {
    // Estado
    session,
    user,
    tenant,
    tenantId,
    loading,
    authReady,

    // Auth flags
    isAuthenticated,
    isAdmin,
    isPlatformAdmin,

    // Actions
    signUp,
    signIn,
    signOut,
    fetchTenant,
    checkPlatformAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook de acesso ao contexto de autenticação
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  }
  return context;
}

export default AuthContext;

/**
 * WalletContext — Estado global da carteira do tenant
 *
 * Centraliza saldo, transações e operações de crédito.
 * Consome dados via API autenticada (não mais Bubble).
 */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { authFetch } from '../services/api';

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const { tenantId, isAuthenticated } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Atualiza saldo e transações
  const refreshWallet = useCallback(async () => {
    if (!tenantId) return;
    setLoading(true);
    try {
      const data = await authFetch(`/api/wallet?tenantId=${tenantId}`);
      setBalance(data.balance ?? 0);
      setTransactions(data.transactions ?? []);
    } catch (err) {
      console.error('[Wallet] Erro ao atualizar:', err);
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  // Carrega dados da wallet quando tenant está disponível
  useEffect(() => {
    if (isAuthenticated && tenantId) {
      Promise.resolve().then(() => refreshWallet());
    }
  }, [isAuthenticated, tenantId, refreshWallet]);

  // Criar preferência de checkout no Mercado Pago (créditos avulsos)
  const purchaseCredits = useCallback(async (packageId) => {
    if (!tenantId) throw new Error('Sem tenant ativo');
    const data = await authFetch('/api/billing/checkout', {
      method: 'POST',
      body: JSON.stringify({
        tenantId,
        packageId,
        type: 'credit_purchase',
      }),
    });
    return data; // { checkoutUrl, preferenceId }
  }, [tenantId]);

  // Criar assinatura recorrente no Mercado Pago
  const subscribeToPlan = useCallback(async (planId) => {
    if (!tenantId) throw new Error('Sem tenant ativo');
    const data = await authFetch('/api/billing/subscribe', {
      method: 'POST',
      body: JSON.stringify({
        tenantId,
        planId,
      }),
    });
    return data; // { subscriptionUrl, subscriptionId }
  }, [tenantId]);

  const value = {
    balance,
    transactions,
    loading,
    refreshWallet,
    purchaseCredits,
    subscribeToPlan,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

/**
 * Hook de acesso ao contexto de carteira
 */
export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet deve ser usado dentro de <WalletProvider>');
  }
  return context;
}

export default WalletContext;

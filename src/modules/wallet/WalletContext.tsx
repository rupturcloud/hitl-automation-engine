import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface Transaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAW' | 'BET' | 'WIN';
  amount: number;
  timestamp: number;
  description: string;
}

interface WalletContextType {
  balance: number;
  history: Transaction[];
  deposit: (amount: number) => void;
  withdraw: (amount: number) => boolean;
  processBet: (amount: number, gameId: string) => boolean;
  processWin: (amount: number, gameId: string) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const STORAGE_KEY = 'betia_wallet_data';

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Erro ao carregar carteira:", e);
      }
    }
    return { balance: 1000, history: [] };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const deposit = useCallback((amount: number) => {
    setData((prev: any) => ({
      ...prev,
      balance: prev.balance + amount,
      history: [{
        id: crypto.randomUUID(),
        type: 'DEPOSIT',
        amount,
        timestamp: Date.now(),
        description: 'Depósito Realizado'
      }, ...prev.history].slice(0, 50)
    }));
  }, []);

  const withdraw = useCallback((amount: number) => {
    if (amount > data.balance) return false;
    setData((prev: any) => ({
      ...prev,
      balance: prev.balance - amount,
      history: [{
        id: crypto.randomUUID(),
        type: 'WITHDRAW',
        amount,
        timestamp: Date.now(),
        description: 'Saque Realizado'
      }, ...prev.history].slice(0, 50)
    }));
    return true;
  }, [data.balance]);

  const processBet = useCallback((amount: number, gameId: string) => {
    if (amount > data.balance) return false;
    setData((prev: any) => ({
      ...prev,
      balance: prev.balance - amount,
      history: [{
        id: crypto.randomUUID(),
        type: 'BET',
        amount,
        timestamp: Date.now(),
        description: `Aposta: ${gameId}`
      }, ...prev.history].slice(0, 50)
    }));
    return true;
  }, [data.balance]);

  const processWin = useCallback((amount: number, gameId: string) => {
    setData((prev: any) => ({
      ...prev,
      balance: prev.balance + amount,
      history: [{
        id: crypto.randomUUID(),
        type: 'WIN',
        amount,
        timestamp: Date.now(),
        description: `Vitória: ${gameId}`
      }, ...prev.history].slice(0, 50)
    }));
  }, []);

  return (
    <WalletContext.Provider value={{ 
      balance: data.balance, 
      history: data.history, 
      deposit, 
      withdraw, 
      processBet, 
      processWin 
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

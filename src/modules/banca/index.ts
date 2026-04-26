import { useState, useCallback } from 'react';
import { BetType } from '../../types';

interface BancaOptions {
  initialBalance: number;
  minBet?: number;
}

export function useBanca({ initialBalance, minBet = 10 }: BancaOptions) {
  const [balance, setBalance] = useState(initialBalance);
  const [isBankActive, setIsBankActive] = useState(true);
  const [currentBets, setCurrentBets] = useState<{ [key in BetType]: number }>({
    PLAYER: 0,
    BANKER: 0,
    TIE: 0,
  });

  const placeBet = useCallback((type: BetType, amount: number = minBet) => {
    if (!isBankActive) return false;
    
    if (balance < amount) {
      return { success: false, message: "SALDO INSUFICIENTE" };
    }

    setBalance((prev) => prev - amount);
    setCurrentBets((prev) => ({ ...prev, [type]: prev[type] + amount }));
    return { success: true, message: "APOSTA ACEITA" };
  }, [balance, isBankActive, minBet]);

  const clearBets = useCallback(() => {
    const totalBet = Object.values(currentBets).reduce((a, b) => a + b, 0);
    setBalance((prev) => prev + totalBet);
    setCurrentBets({ PLAYER: 0, BANKER: 0, TIE: 0 });
  }, [currentBets]);

  const confirmWin = useCallback((winner: BetType, payout: number) => {
    const winnings = currentBets[winner] * payout;
    if (winnings > 0) {
      setBalance((prev) => prev + winnings);
    }
    return winnings;
  }, [currentBets]);

  const resetBets = useCallback(() => {
    setCurrentBets({ PLAYER: 0, BANKER: 0, TIE: 0 });
  }, []);

  return {
    balance,
    currentBets,
    isBankActive,
    setIsBankActive,
    placeBet,
    clearBets,
    confirmWin,
    resetBets
  };
}

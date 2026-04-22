import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ResultType = 'PLAYER' | 'BANKER' | 'TIE';

export interface DiceResult {
  p1: number;
  p2: number;
  b1: number;
  b2: number;
}

export interface GameHistory {
  id: string;
  playerTotal: number;
  bankerTotal: number;
  winner: ResultType;
  timestamp: number;
}

export type BetType = 'PLAYER' | 'BANKER' | 'TIE';

export interface Bet {
  type: BetType;
  amount: number;
}

export const PAYOUTS = {
  PLAYER: 2, // 1:1
  BANKER: 2, // 1:1
  TIE: 8,   // Simple 8:1 (can vary in real game)
};

import React from 'react';
import { motion } from 'motion/react';
import { cn, BetType, ResultType } from '../types';
import { Trophy } from 'lucide-react';

interface BettingTableProps {
  onPlaceBet: (type: BetType) => void;
  currentBets: { [key in BetType]: number };
  lastWinner: ResultType | null;
  isActive: boolean;
}

const BettingTable: React.FC<BettingTableProps> = ({ onPlaceBet, currentBets, lastWinner, isActive }) => {
  return (
    <div className="w-full max-w-6xl mx-auto p-4 flex items-stretch gap-2 h-72">
      {/* Player Section */}
      <motion.button
        whileHover={isActive ? { scale: 1.01 } : {}}
        whileTap={isActive ? { scale: 0.99 } : {}}
        onClick={() => isActive && onPlaceBet('PLAYER')}
        disabled={!isActive}
        className={cn(
          "flex-1 rounded-l-[40px] relative overflow-hidden transition-all duration-500 border border-white/10",
          "bg-player-evo flex flex-col items-center justify-center group",
          lastWinner === 'PLAYER' && "ring-4 ring-yellow-400 shadow-[0_0_50px_rgba(59,130,246,0.5)]",
          !isActive && "opacity-40 grayscale-[0.5]"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
        <div className="text-[10px] font-black tracking-[0.4em] text-white/50 mb-2">1:1</div>
        <div className="editorial-title italic text-6xl text-white tracking-widest uppercase group-hover:scale-110 transition-transform duration-700">
          Player
        </div>
        
        {currentBets['PLAYER'] > 0 && (
          <div className="absolute top-4 right-4 animate-in fade-in zoom-in duration-300">
            <div className="w-12 h-12 rounded-full bg-blue-400 border-2 border-white flex items-center justify-center shadow-2xl">
              <span className="text-[10px] font-black text-black">R$ {currentBets['PLAYER']}</span>
            </div>
          </div>
        )}
      </motion.button>

      {/* Tie Section (Center) */}
      <motion.button
        whileHover={isActive ? { scale: 1.01 } : {}}
        whileTap={isActive ? { scale: 0.99 } : {}}
        onClick={() => isActive && onPlaceBet('TIE')}
        disabled={!isActive}
        className={cn(
          "w-[30%] relative overflow-hidden transition-all duration-500 border-x border-white/5",
          "bg-tie-evo flex flex-col items-center justify-center p-4 group",
          lastWinner === 'TIE' && "ring-4 ring-yellow-400 shadow-[0_0_50px_rgba(197,160,89,0.5)]",
          !isActive && "opacity-40"
        )}
      >
        <div className="text-[10px] font-black tracking-[0.4em] text-gold/60 mb-2 uppercase italic">Multipliers</div>
        <div className="text-gold-gradient text-4xl font-bold tracking-tighter uppercase mb-4">Tie</div>
        
        {/* Dynamic Tie Payouts visualization */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[8px] font-black tracking-widest text-gold/40 border-t border-gold/10 pt-4 w-full px-4">
          <div className="flex justify-between"><span>2/12</span> <span className="text-gold">88:1</span></div>
          <div className="flex justify-between"><span>3/11</span> <span className="text-gold">25:1</span></div>
          <div className="flex justify-between"><span>4/10</span> <span className="text-gold">10:1</span></div>
          <div className="flex justify-between"><span>5/9</span> <span className="text-gold">6:1</span></div>
          <div className="col-span-2 flex justify-between border-t border-gold/5 mt-1 pt-1 opacity-100">
            <span>6-8</span> <span className="text-gold">4:1</span>
          </div>
        </div>

        {currentBets['TIE'] > 0 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 animate-in fade-in zoom-in duration-300">
            <div className="w-12 h-12 rounded-full bg-gold border-2 border-white flex items-center justify-center shadow-2xl">
              <span className="text-[10px] font-black text-black">R$ {currentBets['TIE']}</span>
            </div>
          </div>
        )}
      </motion.button>

      {/* Banker Section */}
      <motion.button
        whileHover={isActive ? { scale: 1.01 } : {}}
        whileTap={isActive ? { scale: 0.99 } : {}}
        onClick={() => isActive && onPlaceBet('BANKER')}
        disabled={!isActive}
        className={cn(
          "flex-1 rounded-r-[40px] relative overflow-hidden transition-all duration-500 border border-white/10",
          "bg-banker-evo flex flex-col items-center justify-center group",
          lastWinner === 'BANKER' && "ring-4 ring-yellow-400 shadow-[0_0_50px_rgba(239,68,68,0.5)]",
          !isActive && "opacity-40 grayscale-[0.5]"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-tl from-black/20 to-transparent pointer-events-none" />
        <div className="text-[10px] font-black tracking-[0.4em] text-white/50 mb-2">1:1</div>
        <div className="editorial-title italic text-6xl text-white tracking-widest uppercase group-hover:scale-110 transition-transform duration-700">
          Banker
        </div>

        {currentBets['BANKER'] > 0 && (
          <div className="absolute top-4 left-4 animate-in fade-in zoom-in duration-300">
            <div className="w-12 h-12 rounded-full bg-red-400 border-2 border-white flex items-center justify-center shadow-2xl">
              <span className="text-[10px] font-black text-black">R$ {currentBets['BANKER']}</span>
            </div>
          </div>
        )}
      </motion.button>
    </div>
  );
};

export default BettingTable;

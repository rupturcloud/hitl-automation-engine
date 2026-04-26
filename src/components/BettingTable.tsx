import React from 'react';
import { motion } from 'motion/react';
import { cn, BetType, ResultType } from '../types';

interface BettingTableProps {
  onBet: (type: BetType) => void;
  activeBets: { type: BetType; amount: number }[];
  lastWinner: ResultType | null;
  disabled: boolean;
  status: 'BETTING' | 'ROLLING' | 'RESULT' | 'WAITING_HOST';
}

const BettingTable: React.FC<BettingTableProps> = ({ onBet, activeBets, lastWinner, disabled, status }) => {
  const isActive = !disabled;

  const getBetAmount = (type: BetType) => {
    return activeBets.filter(b => b.type === type).reduce((acc, b) => acc + b.amount, 0);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-1 md:gap-2">
      {/* Percentage Bar Above Table */}
      <div className="flex w-full h-1 md:h-1.5 rounded-full overflow-hidden mb-1 md:mb-2 bg-white/5 border border-white/5">
        <div className="bg-blue-600 transition-all duration-1000" style={{ width: '44%' }} />
        <div className="bg-amber-500 transition-all duration-1000" style={{ width: '12%' }} />
        <div className="bg-red-600 transition-all duration-1000" style={{ width: '44%' }} />
      </div>

      <div className="flex items-stretch gap-0.5 md:gap-1 h-32 md:h-44">
        {/* PLAYER */}
        <motion.button
          whileTap={isActive ? { scale: 0.98 } : {}}
          animate={lastWinner === 'PLAYER' ? { scale: [1, 1.02, 1] } : { scale: 1 }}
          transition={lastWinner === 'PLAYER' ? { duration: 2, repeat: Infinity } : {}}
          onClick={() => isActive && onBet('PLAYER')}
          disabled={!isActive}
          className={cn(
            "flex-1 bg-blue-900/60 backdrop-blur-xl rounded-l-2xl md:rounded-l-[2rem] border border-blue-500/20 relative overflow-hidden group transition-all",
            lastWinner === 'PLAYER' && "ring-4 ring-blue-400 ring-inset shadow-[0_0_50px_rgba(37,99,235,0.6)] z-10",
            !isActive && status !== 'RESULT' && "opacity-50"
          )}
        >
          {lastWinner === 'PLAYER' && (
            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent pointer-events-none" />
          )}
          <div className="absolute top-1 md:top-2 left-2 md:left-4 text-[7px] md:text-[8px] font-black text-blue-400/60 uppercase">1:1</div>
          <div className="flex flex-col items-center justify-center h-full gap-1">
             {lastWinner === 'PLAYER' && (
               <motion.span initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-1">Vencedor</motion.span>
             )}
             <span className="text-lg md:text-2xl font-black italic tracking-tighter text-white uppercase">Jogador</span>
             {getBetAmount('PLAYER') > 0 && (
               <div className="px-2 md:px-3 py-0.5 md:py-1 bg-blue-500 rounded-full text-[8px] md:text-[10px] font-black shadow-lg animate-in zoom-in">
                 R$ {getBetAmount('PLAYER')}
               </div>
             )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 md:h-1 bg-blue-500/20" />
        </motion.button>

        {/* TIE */}
        <motion.button
          whileTap={isActive ? { scale: 0.98 } : {}}
          animate={lastWinner === 'TIE' ? { scale: [1, 1.02, 1] } : { scale: 1 }}
          transition={lastWinner === 'TIE' ? { duration: 2, repeat: Infinity } : {}}
          onClick={() => isActive && onBet('TIE')}
          disabled={!isActive}
          className={cn(
            "w-[28%] md:w-[25%] bg-amber-900/40 backdrop-blur-xl border-x border-amber-500/20 relative overflow-hidden group transition-all",
            lastWinner === 'TIE' && "ring-4 ring-amber-400 ring-inset shadow-[0_0_50px_rgba(245,158,11,0.6)] z-10",
            !isActive && status !== 'RESULT' && "opacity-50"
          )}
        >
          {lastWinner === 'TIE' && (
            <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent pointer-events-none" />
          )}
          <div className="flex flex-col items-center justify-center h-full py-2 md:py-4">
             {lastWinner === 'TIE' && (
               <motion.span initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-[10px] font-black text-amber-300 uppercase tracking-widest mb-1">Vencedor</motion.span>
             )}
             <span className="text-sm md:text-xl font-black italic tracking-tighter text-amber-500 uppercase">Empate</span>
             <div className="hidden md:grid grid-cols-2 gap-x-4 gap-y-0.5 text-[7px] font-black text-amber-500/40 mt-2 uppercase">
                <div className="flex justify-between gap-2"><span>2,12</span> <span>88:1</span></div>
                <div className="flex justify-between gap-2"><span>3,11</span> <span>25:1</span></div>
                <div className="flex justify-between gap-2"><span>4,10</span> <span>10:1</span></div>
                <div className="flex justify-between gap-2"><span>5,9</span> <span>8:1</span></div>
             </div>
             <span className="md:hidden text-[8px] font-black text-amber-500/40 mt-1 uppercase">8:1</span>
             {getBetAmount('TIE') > 0 && (
               <div className="mt-1 md:mt-2 px-2 md:px-3 py-0.5 md:py-1 bg-amber-500 rounded-full text-[8px] md:text-[10px] font-black text-black shadow-lg animate-in zoom-in">
                 R$ {getBetAmount('TIE')}
               </div>
             )}
          </div>
        </motion.button>

        {/* BANKER */}
        <motion.button
          whileTap={isActive ? { scale: 0.98 } : {}}
          animate={lastWinner === 'BANKER' ? { scale: [1, 1.02, 1] } : { scale: 1 }}
          transition={lastWinner === 'BANKER' ? { duration: 2, repeat: Infinity } : {}}
          onClick={() => isActive && onBet('BANKER')}
          disabled={!isActive}
          className={cn(
            "flex-1 bg-red-900/60 backdrop-blur-xl rounded-r-2xl md:rounded-r-[2rem] border border-red-500/20 relative overflow-hidden group transition-all",
            lastWinner === 'BANKER' && "ring-4 ring-red-400 ring-inset shadow-[0_0_50px_rgba(220,38,38,0.6)] z-10",
            !isActive && status !== 'RESULT' && "opacity-50"
          )}
        >
          {lastWinner === 'BANKER' && (
            <div className="absolute inset-0 bg-gradient-to-t from-red-500/20 to-transparent pointer-events-none" />
          )}
          <div className="absolute top-1 md:top-2 right-2 md:right-4 text-[7px] md:text-[8px] font-black text-red-400/60 uppercase text-right">1:1</div>
          <div className="flex flex-col items-center justify-center h-full gap-1">
             {lastWinner === 'BANKER' && (
               <motion.span initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-[10px] font-black text-red-300 uppercase tracking-widest mb-1">Vencedor</motion.span>
             )}
             <span className="text-lg md:text-2xl font-black italic tracking-tighter text-white uppercase">Banca</span>
             {getBetAmount('BANKER') > 0 && (
               <div className="px-2 md:px-3 py-0.5 md:py-1 bg-red-500 rounded-full text-[8px] md:text-[10px] font-black shadow-lg animate-in zoom-in">
                 R$ {getBetAmount('BANKER')}
               </div>
             )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 md:h-1 bg-red-500/20" />
        </motion.button>
      </div>
    </div>
  );
};

export default BettingTable;



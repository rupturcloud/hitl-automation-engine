import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Target, Wallet as WalletIcon, History, PlusCircle, MinusCircle, Settings2, Trophy, Coins, UserCheck, ShieldAlert, Cpu, Undo2, Copy, Play, BarChart3 } from 'lucide-react';

// Microserviços
import { useWallet } from '../wallet';
import { Dealer } from '../dealer/DealerView';
import { useCountdown } from '../../core/countdown';

// Tipos e Componentes
import { cn, ResultType, DiceResult, GameHistory, PAYOUTS, BetType, Bet } from '../../types';
import Dice from '../../components/Dice';
import BettingTable from '../../components/BettingTable';
import { BeadPlate, BigRoad } from './components/BacBoRoadmaps';
import ChipSelector from '../../components/ChipSelector';

export function BancaView() {
  const wallet = useWallet();
  
  const [status, setStatus] = useState<'BETTING' | 'ROLLING' | 'RESULT' | 'WAITING_HOST'>('BETTING');
  const [dice, setDice] = useState<DiceResult>({ p1: 1, p2: 1, b1: 1, b2: 1 });
  const [lastWinner, setLastWinner] = useState<ResultType | null>(null);
  const [history, setHistory] = useState<GameHistory[]>([]);
  const [dealerMsg, setDealerMsg] = useState("Bem-vindos à Bet IA Studio!");
  
  const [activeBets, setActiveBets] = useState<Bet[]>([]);
  const [selectedChip, setSelectedChip] = useState(10);
  const [isHostMode, setIsHostMode] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [lastWinAmount, setLastWinAmount] = useState<number | null>(null);

  // Countdown Unificado
  const { seconds: timeLeft, start: startTimer, reset: resetTimer, stop: stopTimer } = useCountdown({
    initialSeconds: 15,
    autoStart: true,
    onTick: (s) => {
      if (s === 5) setDealerMsg("Últimas apostas!");
      if (s === 0) {
        setDealerMsg("Apostas encerradas!");
        if (isHostMode) setStatus('WAITING_HOST');
        else startRoll();
      }
    }
  });

  const startRoll = useCallback(() => {
    setStatus('ROLLING');
    setDealerMsg("Dados em movimento...");
    
    setTimeout(() => {
      const result: DiceResult = {
        p1: Math.floor(Math.random() * 6) + 1,
        p2: Math.floor(Math.random() * 6) + 1,
        b1: Math.floor(Math.random() * 6) + 1,
        b2: Math.floor(Math.random() * 6) + 1
      };
      finishRound(result);
    }, 3000);
  }, []);

  const finishRound = useCallback((result: DiceResult) => {
    const pTotal = result.p1 + result.p2;
    const bTotal = result.b1 + result.b2;
    let winner: ResultType = 'TIE';
    if (pTotal > bTotal) winner = 'PLAYER';
    else if (bTotal > pTotal) winner = 'BANKER';

    setDice(result);
    setLastWinner(winner);
    setStatus('RESULT');

    // Processamento de ganhos
    const winningBets = activeBets.filter(bet => bet.type === winner);
    const winAmount = winningBets.reduce((acc, bet) => acc + (bet.amount * (PAYOUTS[winner] || 1)), 0);

    if (winAmount > 0) {
      setLastWinAmount(winAmount);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: winner === 'PLAYER' ? ['#3b82f6', '#ffffff'] : (winner === 'BANKER' ? ['#ef4444', '#ffffff'] : ['#f59e0b', '#ffffff'])
      });
      
      // Delay para processar na carteira após animação começar
      setTimeout(() => wallet.processWin(winAmount, "BAC_BO"), 1000);
    } else {
      setLastWinAmount(null);
    }

    setHistory(prev => [{ 
      id: crypto.randomUUID(), 
      playerTotal: pTotal, 
      bankerTotal: bTotal, 
      winner, 
      timestamp: Date.now() 
    }, ...prev].slice(0, 50));

    setTimeout(() => {
      setStatus('BETTING');
      resetTimer(15);
      startTimer();
      setLastWinAmount(null);
      setActiveBets([]);
      setDealerMsg("Nova rodada iniciada!");
    }, 5000);
  }, [activeBets, wallet, resetTimer, startTimer]);

  const handleBet = (type: BetType) => {
    if (status !== 'BETTING' || timeLeft <= 0) return;
    if (wallet.processBet(selectedChip, "BAC_BO")) {
      setActiveBets(prev => [...prev, { type, amount: selectedChip }]);
    }
  };

  const handleUndo = () => {
    if (activeBets.length === 0 || status !== 'BETTING') return;
    const lastBet = activeBets[activeBets.length - 1];
    wallet.processWin(lastBet.amount, "BAC_BO_REFUND");
    setActiveBets(prev => prev.slice(0, -1));
  };

  const handleDouble = () => {
    if (activeBets.length === 0 || status !== 'BETTING') return;
    const totalCurrentBet = activeBets.reduce((acc, b) => acc + b.amount, 0);
    if (wallet.processBet(totalCurrentBet, "BAC_BO")) {
      setActiveBets(prev => [...prev, ...prev]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#050507] text-white overflow-hidden font-sans relative select-none">
      {/* Background Studio Simulation */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#1e3a8a_0%,transparent_60%)]" />
        <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black to-transparent" />
      </div>

      {/* Top Bar */}
      <header className="relative z-50 flex justify-between items-center px-4 py-3 bg-black/40 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-black italic tracking-tighter text-white/90">BAC BO <span className="text-amber-500">R$ 5 - 25.000</span></span>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button onClick={() => setShowStats(!showStats)} className="p-2 hover:bg-white/5 rounded-lg transition-colors lg:hidden">
             <BarChart3 className={cn("w-5 h-5", showStats ? "text-amber-500" : "text-white/40")} />
           </button>
           <button onClick={() => setIsHostMode(!isHostMode)} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
             <Settings2 className="w-5 h-5 text-white/40" />
           </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 flex flex-col items-center p-2 md:p-4 overflow-y-auto no-scrollbar">
        {/* Dealer Area - Compact on Mobile */}
        <div className="relative w-full max-w-4xl flex flex-col items-center pt-2 md:pt-4">
          <div className="scale-75 md:scale-100 origin-top">
             <Dealer gender="GIRL" message={dealerMsg} isSpeaking={status === 'BETTING'} />
          </div>

          <div className="flex gap-6 md:gap-24 items-end pb-4 md:pb-8 mt-4 md:mt-0">
            {/* Player Dice */}
            <div className="flex flex-col items-center gap-2 md:gap-3">
              <div className="flex gap-2 md:gap-3 p-2 md:p-4 bg-blue-600/10 rounded-xl md:rounded-2xl border border-blue-500/20 backdrop-blur-xl">
                <Dice value={dice.p1} rolling={status === 'ROLLING'} color="blue" />
                <Dice value={dice.p2} rolling={status === 'ROLLING'} color="blue" />
              </div>
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-blue-400">Player</span>
            </div>

            {/* Timer / Result Center */}
            <div className="relative w-16 h-16 md:w-24 md:h-24 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {status === 'BETTING' && (
                  <motion.div key="timer" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.5, opacity: 0 }} className="relative">
                    <div className="w-14 h-14 md:w-20 md:h-20 rounded-full border-2 md:border-4 border-amber-500/30 flex items-center justify-center">
                       <span className="text-2xl md:text-4xl font-black italic">{timeLeft}</span>
                    </div>
                    <svg className="absolute inset-0 w-14 h-14 md:w-20 md:h-20 -rotate-90">
                      <circle cx="28" cy="28" r="26" fill="none" stroke="#f59e0b" strokeWidth="2" className="md:hidden" strokeDasharray={163} strokeDashoffset={163 - (163 * timeLeft) / 15} />
                      <circle cx="40" cy="40" r="38" fill="none" stroke="#f59e0b" strokeWidth="4" className="hidden md:block" strokeDasharray={238} strokeDashoffset={238 - (238 * timeLeft) / 15} />
                    </svg>
                  </motion.div>
                )}
                {status === 'RESULT' && (
                  <motion.div 
                    key="result" 
                    initial={{ scale: 0.5, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    className="flex flex-col items-center gap-4 relative"
                  >
                    {/* Glow Background for Winner */}
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={cn(
                        "absolute inset-0 blur-[60px] rounded-full -z-10",
                        lastWinner === 'PLAYER' ? "bg-blue-500" :
                        lastWinner === 'BANKER' ? "bg-red-500" :
                        "bg-amber-500"
                      )}
                    />

                    <motion.div 
                      className="flex gap-4 md:gap-8 items-center bg-black/60 px-6 md:px-10 py-3 md:py-5 rounded-[2rem] border border-white/10 backdrop-blur-3xl shadow-2xl"
                    >
                       <div className="flex flex-col items-center">
                         <span className={cn("text-3xl md:text-5xl font-black italic", lastWinner === 'PLAYER' ? "text-blue-500" : "text-white/40")}>{dice.p1 + dice.p2}</span>
                         <span className="text-[8px] font-black uppercase tracking-widest text-white/20 mt-1">Player</span>
                       </div>
                       
                       <div className="w-px h-10 bg-white/10" />
                       
                       <div className="flex flex-col items-center">
                         <span className={cn("text-3xl md:text-5xl font-black italic", lastWinner === 'BANKER' ? "text-red-500" : "text-white/40")}>{dice.b1 + dice.b2}</span>
                         <span className="text-[8px] font-black uppercase tracking-widest text-white/20 mt-1">Banker</span>
                       </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className={cn(
                        "px-6 py-2 rounded-full border text-xs md:text-sm font-black uppercase tracking-[0.3em] italic shadow-lg",
                        lastWinner === 'PLAYER' ? "bg-blue-600 border-blue-400 text-white shadow-blue-500/20" :
                        lastWinner === 'BANKER' ? "bg-red-600 border-red-400 text-white shadow-red-500/20" :
                        "bg-amber-600 border-amber-400 text-white shadow-amber-500/20"
                      )}
                    >
                      {lastWinner === 'PLAYER' ? 'Jogador Vence' : lastWinner === 'BANKER' ? 'Banca Vence' : 'Empate'}
                    </motion.div>

                    {lastWinAmount && (
                      <motion.div
                        initial={{ scale: 0, y: 50, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                        className="absolute -top-40 md:-top-52 whitespace-nowrap z-[100]"
                      >
                        <div className="relative">
                          {/* Rays / Sparkle Effect */}
                          <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 bg-[radial-gradient(circle,rgba(245,158,11,0.2)_0%,transparent_70%)] scale-[4]"
                          />
                          
                          <div className="flex flex-col items-center">
                            <span className="text-sm md:text-xl font-black uppercase tracking-[0.5em] text-amber-500/80 mb-2 animate-pulse">VOCÊ GANHOU</span>
                            <span className="text-5xl md:text-8xl font-black italic text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-200 to-amber-500 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                              R$ {lastWinAmount.toLocaleString('pt-BR')}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Banker Dice */}
            <div className="flex flex-col items-center gap-2 md:gap-3">
              <div className="flex gap-2 md:gap-3 p-2 md:p-4 bg-red-600/10 rounded-xl md:rounded-2xl border border-red-500/20 backdrop-blur-xl">
                <Dice value={dice.b1} rolling={status === 'ROLLING'} color="red" />
                <Dice value={dice.b2} rolling={status === 'ROLLING'} color="red" />
              </div>
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-red-400">Banker</span>
            </div>
          </div>
        </div>

        {/* Roadmaps & Betting Area */}
        <div className="w-full max-w-6xl flex flex-col gap-2 md:gap-4 mt-auto pb-4 md:pb-6">
           {/* Mobile Roadmaps (Collapsible) */}
           <AnimatePresence>
             {(showStats || window.innerWidth > 1024) && (
               <motion.div 
                 initial={{ height: 0, opacity: 0 }} 
                 animate={{ height: 'auto', opacity: 1 }} 
                 exit={{ height: 0, opacity: 0 }}
                 className="flex flex-col lg:flex-row items-center gap-2 overflow-hidden"
               >
                 <div className="w-full lg:w-72">
                   <BeadPlate history={history} />
                 </div>
                 <div className="w-full lg:w-96">
                   <BigRoad history={history} />
                 </div>
               </motion.div>
             )}
           </AnimatePresence>

           <div className="w-full">
             <BettingTable 
              onBet={handleBet} 
              activeBets={activeBets} 
              lastWinner={lastWinner} 
              status={status}
              disabled={status !== 'BETTING' || timeLeft <= 0} 
             />
           </div>
        </div>
      </main>

      {/* Footer Controls */}
      <footer className="relative z-[60] bg-[#0a0a0c]/95 backdrop-blur-3xl border-t border-white/10 px-2 md:px-4 py-2 md:py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
          {/* Balance Group (Top on Mobile) */}
          <div className="flex items-center justify-between w-full md:w-auto gap-3 px-2 md:px-0">
            <div className="flex flex-col">
              <p className="text-[7px] md:text-[8px] font-black text-white/30 uppercase tracking-widest">Saldo</p>
              <p className="text-xs md:text-sm font-black text-amber-500 italic">R$ {wallet.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="flex flex-col text-right md:text-left">
              <p className="text-[7px] md:text-[8px] font-black text-white/30 uppercase tracking-widest">Aposta Total</p>
              <p className="text-xs md:text-sm font-black text-white italic">R$ {activeBets.reduce((acc, b) => acc + b.amount, 0).toLocaleString('pt-BR')}</p>
            </div>
          </div>

          {/* Central Controls */}
          <div className="w-full md:flex-1 flex justify-center">
             <ChipSelector 
              selectedAmount={selectedChip} 
              onSelect={setSelectedChip}
              onUndo={handleUndo}
              onDouble={handleDouble}
              disabled={status !== 'BETTING' || timeLeft <= 0}
             />
          </div>

          {/* Utility Buttons (Bottom or side) */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-center md:justify-end">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all group">
              <PlusCircle className="w-4 h-4 text-white/40 group-hover:text-white" />
              <span className="text-[9px] font-black uppercase tracking-widest text-white/40 group-hover:text-white">Mesa</span>
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600/20 to-emerald-600/40 hover:from-emerald-600/40 hover:to-emerald-600/60 rounded-xl border border-emerald-500/20 transition-all group">
              <Play className="w-4 h-4 text-emerald-400" />
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Lobby</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Host Mode Sidebar */}
      <AnimatePresence>
        {isHostMode && (
          <motion.aside initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }} className="fixed top-0 right-0 w-full md:w-80 h-full bg-[#0a0a0c] border-l border-white/10 z-[100] p-6 shadow-2xl flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-black italic uppercase">Dealer Panel</h3>
              <button onClick={() => setIsHostMode(false)} className="p-2 bg-white/5 rounded-full"><X2 className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 space-y-6">
               <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                  <p className="text-[10px] font-black uppercase text-white/40">Entrada Manual</p>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="number" id="hp1" placeholder="P1" className="bg-black border border-white/10 rounded-xl p-3 text-center font-black" />
                    <input type="number" id="hp2" placeholder="P2" className="bg-black border border-white/10 rounded-xl p-3 text-center font-black" />
                    <input type="number" id="hb1" placeholder="B1" className="bg-black border border-white/10 rounded-xl p-3 text-center font-black" />
                    <input type="number" id="hb2" placeholder="B2" className="bg-black border border-white/10 rounded-xl p-3 text-center font-black" />
                  </div>
                  <button onClick={() => {
                    const res = {
                      p1: Number((document.getElementById('hp1') as HTMLInputElement).value || 1),
                      p2: Number((document.getElementById('hp2') as HTMLInputElement).value || 1),
                      b1: Number((document.getElementById('hb1') as HTMLInputElement).value || 1),
                      b2: Number((document.getElementById('hb2') as HTMLInputElement).value || 1),
                    };
                    finishRound(res);
                  }} className="w-full py-4 bg-amber-500 rounded-xl text-black font-black uppercase tracking-widest text-xs">Forçar Resultado</button>
               </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}



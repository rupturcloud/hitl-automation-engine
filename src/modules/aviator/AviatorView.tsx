import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, TrendingUp, History, Coins, PlusCircle, MinusCircle, Info, Zap, Settings2, Cpu, ShieldAlert, Trophy } from 'lucide-react';
import { useWallet } from '../wallet';

export function AviatorView() {
  const wallet = useWallet();
  const [multiplier, setMultiplier] = useState(1.0);
  const [status, setStatus] = useState<'IDLE' | 'FLYING' | 'CRASHED'>('IDLE');
  const [betAmount, setBetAmount] = useState(10);
  const [hasBet, setHasBet] = useState(false);
  const [history, setHistory] = useState<number[]>([1.45, 12.3, 2.1, 4.5, 1.05, 3.2]);
  const [isAutoCashout, setIsAutoCashout] = useState(false);
  const [autoCashoutValue, setAutoCashoutValue] = useState(2.0);
  const [isHostMode, setIsHostMode] = useState(false);
  const [manualCrashPoint, setManualCrashPoint] = useState(2.0);

  const requestRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const crashPointRef = useRef<number>();

  const startNewRound = useCallback(() => {
    setStatus('FLYING');
    setMultiplier(1.0);
    
    let crashPoint: number;
    if (isHostMode) {
      crashPoint = manualCrashPoint;
    } else {
      const random = Math.random();
      crashPoint = random < 0.05 ? 1.0 : Math.max(1.0, Math.floor(100 / (Math.random() * 100)) / 10 + 0.1);
    }
    
    crashPointRef.current = crashPoint;
    startTimeRef.current = performance.now();
    animate();
  }, [isHostMode, manualCrashPoint]);

  const animate = useCallback(() => {
    if (!startTimeRef.current) return;
    const now = performance.now();
    const elapsed = (now - startTimeRef.current) / 1000;
    
    // Curva de crescimento do multiplicador: e^(0.12 * t)
    const currentMult = Math.pow(Math.E, 0.12 * elapsed);
    
    if (currentMult >= crashPointRef.current!) {
      setStatus('CRASHED');
      setHistory(prev => [Number(crashPointRef.current!.toFixed(2)), ...prev].slice(0, 10));
      setHasBet(false);
      setTimeout(() => {
        setStatus('IDLE');
        setMultiplier(1.0);
      }, 3000);
      return;
    }

    setMultiplier(currentMult);
    requestRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    // Emitir estado para o Robô (Bridge Interna)
    window.postMessage({
      type: 'GAME_STATE_UPDATE',
      lastResult: history[0]?.toString() || '---',
      timer: multiplier.toFixed(2),
      balance: `R$ ${wallet.balance.toFixed(2)}`,
      status: status
    }, '*');

    if (hasBet && isAutoCashout && multiplier >= autoCashoutValue && status === 'FLYING') {
      handleCashout();
    }
  }, [multiplier, hasBet, isAutoCashout, autoCashoutValue, status, wallet.balance, history]);

  // Tesla Override: Qualquer clique na área de jogo interrompe o robô
  const handleManualAction = useCallback(() => {
    window.postMessage({ type: 'MANUAL_OVERRIDE_TRIGGERED' }, '*');
  }, []);

  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const handlePlaceBet = () => {
    if (wallet.processBet(betAmount, "AVIATOR")) {
      setHasBet(true);
      if (status === 'IDLE') {
        startNewRound();
      }
    }
  };

  const handleCashout = () => {
    if (!hasBet || status !== 'FLYING') return;
    const winAmount = betAmount * multiplier;
    wallet.processWin(winAmount, "AVIATOR");
    setHasBet(false);
  };

  return (
    <div className="flex-1 flex bg-[#070709] text-white overflow-hidden font-sans relative">
      {/* Main Game Area */}
      <div className={`flex-1 flex flex-col transition-all duration-500 ${isHostMode ? 'mr-96' : ''}`}>
        {/* Header */}
        <header className="p-4 border-b border-white/5 flex justify-between items-center bg-[#0a0a0c]/80 backdrop-blur-2xl z-50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.3)]">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-tighter uppercase italic">Aviator <span className="text-red-500">Premium</span></h2>
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                <p className="text-[9px] text-white/30 uppercase tracking-widest font-black">Live Studio Connected</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 bg-white/[0.03] px-6 py-2 rounded-2xl border border-white/5 shadow-inner">
              <div className="text-right">
                <p className="text-[9px] text-white/30 uppercase font-black tracking-widest">Saldo Disponível</p>
                <p className="text-lg font-mono font-black text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">
                  R$ {wallet.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <Coins className="w-4 h-4 text-yellow-500/50" />
            </div>

            <button 
              onClick={() => setIsHostMode(!isHostMode)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border transition-all ${isHostMode ? 'bg-red-500 text-white border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}
            >
              <Settings2 className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Host Mode</span>
            </button>
          </div>
        </header>

        <main 
          className="flex-1 p-6 flex flex-col gap-8 overflow-y-auto pb-32"
          onClickCapture={handleManualAction}
        >
          {/* Multiplier Display Area */}
          <div className="relative aspect-[21/9] w-full rounded-[3.5rem] overflow-hidden border border-white/10 bg-[#0d0d12] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] flex items-center justify-center">
            <div className="absolute inset-0 opacity-5" 
                 style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
            
            <AnimatePresence mode="wait">
              {status === 'FLYING' ? (
                <motion.div key="flying" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center z-10">
                  <h1 className="text-[10rem] font-black italic tracking-tighter text-white drop-shadow-[0_0_50px_rgba(255,255,255,0.2)] leading-none">
                    {multiplier.toFixed(2)}x
                  </h1>
                  <div className="mt-6 flex items-center justify-center gap-3">
                     <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
                     <span className="text-xs font-black uppercase tracking-[0.3em] text-white/40">O avião está subindo...</span>
                  </div>
                </motion.div>
              ) : status === 'CRASHED' ? (
                <motion.div key="crashed" initial={{ scale: 1.2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center z-10">
                  <h1 className="text-[8rem] font-black italic tracking-tighter text-red-500 drop-shadow-[0_0_50px_rgba(239,68,68,0.4)] leading-none">
                    FLEW AWAY!
                  </h1>
                  <p className="text-4xl font-mono font-black text-white/60 mt-4 italic">{multiplier.toFixed(2)}x</p>
                </motion.div>
              ) : (
                <motion.div key="idle" className="text-center opacity-20">
                  <Plane className="w-32 h-32 mx-auto mb-6 animate-bounce" />
                  <p className="text-lg font-black uppercase tracking-[0.4em]">Aguardando Decolagem</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Plane Animation */}
            {status === 'FLYING' && (
               <motion.div 
                  animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute left-20 bottom-20 text-red-500"
                  style={{ scale: 1 + (multiplier - 1) * 0.05 }}
               >
                  <Plane className="w-20 h-20 rotate-[-15deg] drop-shadow-[0_0_30px_rgba(239,68,68,0.6)]" />
               </motion.div>
            )}
          </div>

          {/* History Bar */}
          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
             {history.map((val, i) => (
               <div key={i} className={`px-6 py-3 rounded-2xl border text-[11px] font-black whitespace-nowrap transition-all hover:scale-105 ${
                 val >= 2 ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-white/5 border-white/10 text-white/40'
               }`}>
                 {val.toFixed(2)}x
               </div>
             ))}
          </div>

          {/* Betting Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-[#0d0d12] border border-white/10 rounded-[3rem] p-10 space-y-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/5 blur-[80px]" />
                <div className="flex justify-between items-center relative z-10">
                   <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Configuração de Aposta</span>
                   <div className="flex gap-2">
                      {[10, 50, 100, 500].map(v => (
                        <button key={v} onClick={() => setBetAmount(v)} className={`px-4 py-2 rounded-xl text-[10px] font-black border transition-all ${betAmount === v ? 'bg-white/10 border-white/20 text-white' : 'bg-transparent border-white/5 text-white/20 hover:text-white/40'}`}>
                          {v}
                        </button>
                      ))}
                   </div>
                </div>

                <div className="flex items-center gap-6 relative z-10">
                   <button onClick={() => setBetAmount(Math.max(1, betAmount - 10))} className="w-16 h-16 bg-white/5 border border-white/10 rounded-[1.5rem] hover:bg-white/10 flex items-center justify-center transition-all">
                     <MinusCircle className="w-6 h-6 text-white/40" />
                   </button>
                   <div className="flex-1 bg-black/40 border border-white/5 rounded-[1.5rem] py-6 text-center font-mono text-3xl font-black italic shadow-inner">
                     R$ {betAmount.toFixed(2)}
                   </div>
                   <button onClick={() => setBetAmount(betAmount + 10)} className="w-16 h-16 bg-white/5 border border-white/10 rounded-[1.5rem] hover:bg-white/10 flex items-center justify-center transition-all">
                     <PlusCircle className="w-6 h-6 text-white/40" />
                   </button>
                </div>

                {!hasBet ? (
                  <button onClick={handlePlaceBet} disabled={status === 'CRASHED'} className="w-full py-8 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-[2rem] text-sm font-black uppercase tracking-widest transition-all shadow-[0_20px_40px_rgba(16,185,129,0.25)] relative z-10 group/btn overflow-hidden">
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform" />
                    <span className="relative">APOSTAR AGORA</span>
                  </button>
                ) : (
                  <button onClick={handleCashout} disabled={status !== 'FLYING'} className="w-full py-8 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-[2rem] text-sm font-black uppercase tracking-widest transition-all shadow-[0_20px_40px_rgba(234,179,8,0.3)] text-black relative z-10 font-black">
                    SACAR R$ {(betAmount * multiplier).toFixed(2)}
                  </button>
                )}
             </div>

             <div className="bg-[#0d0d12] border border-white/10 rounded-[3rem] p-10 space-y-8 shadow-2xl relative overflow-hidden">
                <div className="flex justify-between items-center">
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-white/30">Auto Cashout Inteligente</h3>
                   <button onClick={() => setIsAutoCashout(!isAutoCashout)} className={`w-14 h-7 rounded-full relative transition-colors ${isAutoCashout ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]' : 'bg-white/10'}`}>
                     <motion.div animate={{ x: isAutoCashout ? 28 : 4 }} className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-lg" />
                   </button>
                </div>

                <div className="space-y-6">
                   <div className="flex items-center gap-4">
                      <button onClick={() => setAutoCashoutValue(Math.max(1.1, autoCashoutValue - 0.1))} className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center font-black">-</button>
                      <div className="flex-1 bg-black/40 border border-white/5 rounded-2xl py-6 text-center font-mono text-4xl font-black text-yellow-500 italic drop-shadow-[0_0_10px_rgba(234,179,8,0.4)]">
                        {autoCashoutValue.toFixed(2)}x
                      </div>
                      <button onClick={() => setAutoCashoutValue(autoCashoutValue + 0.1)} className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center font-black">+</button>
                   </div>
                   <div className="pt-6 border-t border-white/5 flex items-center gap-4 text-white/20">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                        <Info className="w-5 h-5" />
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                        O sistema realizará o saque automaticamente assim que o multiplicador atingir o valor configurado.
                      </p>
                   </div>
                </div>
             </div>
          </div>
        </main>
      </div>

      {/* Host Mode Sidebar */}
      <AnimatePresence>
        {isHostMode && (
          <motion.aside 
            initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }}
            className="fixed top-0 right-0 w-96 h-full bg-[#0a0a0c] border-l border-white/10 z-[60] flex flex-col p-10 shadow-[-20px_0_60px_rgba(0,0,0,0.6)]"
          >
            <div className="mb-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-purple-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-red-500/20">
                <Cpu className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-black italic tracking-tighter uppercase">Host Dashboard</h3>
              <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-bold mt-2">Controle de Algoritmo</p>
            </div>

            <div className="flex-1 space-y-12">
              <div className="space-y-6">
                <div className="flex items-center justify-between text-white/40">
                  <span className="text-[10px] font-black uppercase tracking-widest">Ponto de Crash</span>
                  <span className="text-2xl font-mono font-black text-white">{manualCrashPoint.toFixed(2)}x</span>
                </div>
                
                <input 
                  type="range" 
                  min="1.0" 
                  max="10.0" 
                  step="0.1" 
                  value={manualCrashPoint} 
                  onChange={(e) => setManualCrashPoint(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-full appearance-none accent-red-500 cursor-pointer"
                />

                <div className="grid grid-cols-3 gap-3">
                  {[1.1, 2.0, 5.0, 10.0, 50.0, 100.0].map(v => (
                    <button key={v} onClick={() => setManualCrashPoint(v)} className="py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black hover:bg-red-500/10 hover:border-red-500/30 transition-all">
                      {v}x
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-10 border-t border-white/5 space-y-6">
                <div className="flex items-center gap-4 text-red-400/60 bg-red-500/5 p-6 rounded-3xl border border-red-500/10">
                  <ShieldAlert className="w-6 h-6 shrink-0" />
                  <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                    Você está operando em modo manual. O algoritmo randômico foi suspenso para priorizar suas entradas.
                  </p>
                </div>
                
                {status === 'IDLE' && (
                  <button onClick={startNewRound} className="w-full py-6 bg-red-600 hover:bg-red-500 rounded-2xl text-sm font-black uppercase tracking-widest shadow-2xl shadow-red-500/20 transition-all hover:scale-105 active:scale-95">
                    Forçar Decolagem
                  </button>
                )}
              </div>
            </div>

            <div className="mt-auto flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Sessão Ativa</span>
              </div>
              <span className="text-[10px] font-mono font-black">ID: #AV-9921</span>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}

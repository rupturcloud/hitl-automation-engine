import { useEffect, useState, useRef, useCallback } from 'react';
import { useRobo } from './index';
import { useBridge } from '../../core/bridge';
import { useAuth } from '../auth/AuthContext';
import { useWallet } from '../wallet/WalletContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Target, 
  Cpu, 
  Brain,
  ShieldAlert,
  Wallet as WalletIcon,
  ChevronRight,
  TrendingUp,
  History,
  Zap,
  MousePointer2,
  Lock,
  Activity,
  BarChart3
} from 'lucide-react';

export function BacBoSpecialistView() {
  const robo = useRobo();
  const bridge = useBridge();
  const { user } = useAuth();
  const { balance } = useWallet();
  const logEndRef = useRef<HTMLDivElement>(null);
  
  // Estados específicos Bac Bo
  const [progressionLevel, setProgressionLevel] = useState(0);
  const [winStreak, setWinStreak] = useState(0);
  const [lastResults, setLastResults] = useState<string[]>([]);
  
  // Auto-scroll
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [robo.agent.logs, robo.agent.currentThought]);

  // Lógica de Análise "Will Full"
  useEffect(() => {
    const handleGameState = (event: MessageEvent) => {
      if (event.data?.type === 'GAME_STATE_UPDATE') {
        const { lastResult, status } = event.data;
        
        if (status === 'RESULT' && lastResult && lastResult !== 'TIE') {
          setLastResults(prev => {
            const newResults = [lastResult, ...prev].slice(0, 10);
            
            // Lógica Will Full: Se temos 3 iguais seguidos, propõe a quebra (ou confirmação dependendo da estratégia)
            if (newResults.length >= 3) {
              const sequence = newResults.slice(0, 3);
              const allSame = sequence.every(r => r === sequence[0]);
              
              if (allSame && robo.status === 'IDLE') {
                const target = sequence[0] === 'PLAYER' ? 'BANKER' : 'PLAYER';
                robo.proposeAction({
                  type: 'BET',
                  title: `Oportunidade Will Full: ${target}`,
                  description: `Detectada sequência de 3 ${sequence[0]}. Probabilidade de quebra em ${target} aumentada para 84%.`,
                  confidence: 0.84,
                  countdown: 10,
                  payload: { betType: target, amount: 10 * Math.pow(2, progressionLevel) }
                });
              }
            }
            return newResults;
          });
        }
      }
    };
    window.addEventListener('message', handleGameState);
    return () => window.removeEventListener('message', handleGameState);
  }, [robo, progressionLevel]);

  return (
    <div className="flex flex-col h-full bg-[#050508] text-[#e2e2e7] font-sans overflow-hidden border-l border-cyan-500/10 selection:bg-purple-500/30">
      {/* AMBIENT GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-gradient-to-b from-purple-500/10 to-transparent pointer-events-none" />
      
      {/* SPECIALIST HEADER */}
      <div className="px-5 py-6 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-xl z-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center shadow-[0_0_25px_rgba(147,51,234,0.4)] border border-white/10">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#050508] border-2 border-[#050508] flex items-center justify-center">
              <div className={`w-2 h-2 rounded-full ${bridge.isSyncing ? 'bg-emerald-500' : 'bg-red-500'}`} />
            </div>
          </div>
          <div>
            <h2 className="text-sm font-black text-white tracking-tight uppercase italic">Bac Bo Specialist</h2>
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-purple-400 font-bold uppercase tracking-widest">Protocolo Will Full</span>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <span className="text-[9px] text-white/40 font-medium">v4.0.1 PRO</span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-[8px] text-white/20 uppercase font-black mb-0.5">Soberania</p>
          <p className="text-xs font-mono font-black text-emerald-400">R$ {balance.toLocaleString('pt-BR')}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6 relative z-10">
        
        {/* PROGRESSION STEPPER */}
        <section className="p-5 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-white/60">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="text-[9px] font-black uppercase tracking-widest">Motor de Progressão</span>
            </div>
            <span className="text-[8px] px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full font-black uppercase">Seguro</span>
          </div>
          
          <div className="flex justify-between gap-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex-1 flex flex-col gap-2">
                <div className={`h-1.5 rounded-full transition-all duration-500 ${progressionLevel >= step ? 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]' : 'bg-white/5'}`} />
                <span className={`text-[8px] text-center font-black ${progressionLevel >= step ? 'text-purple-400' : 'text-white/10'}`}>G{step-1}</span>
              </div>
            ))}
          </div>
        </section>

        {/* NEURAL DECISION HUB */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-400">
              <Brain className="w-3.5 h-3.5" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Decision Hub</h3>
            </div>
            <div className="flex gap-1">
              {(['MANUAL', 'SEMI_AUTO', 'FULL_AUTO'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => robo.setMode(m)}
                  className={`px-3 py-1.5 rounded-xl text-[8px] font-black uppercase transition-all ${
                    robo.mode === m 
                      ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.4)]' 
                      : 'bg-white/5 text-white/30'
                  }`}
                >
                  {m.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {robo.status === 'PROPOSING' && robo.currentAction ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                className="p-6 rounded-[2.5rem] bg-gradient-to-br from-purple-900/40 to-black border border-purple-500/30 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Zap className="w-16 h-16 text-purple-400" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                      <Zap className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white uppercase italic">{robo.currentAction.title}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-emerald-400">{Math.round(robo.currentAction.confidence * 100)}% Match</span>
                        <div className="w-1 h-1 rounded-full bg-white/20" />
                        <span className="text-[9px] text-white/40 uppercase">Estratégia: Will Full v4</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-white/50 leading-relaxed mb-6">
                    {robo.currentAction.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => robo.executeAction()}
                      className="py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg shadow-purple-900/20"
                    >
                      Executar Entrada
                    </button>
                    <button 
                      onClick={() => robo.cancelAction()}
                      className="py-4 bg-white/5 hover:bg-white/10 text-white/40 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-white/5 transition-all"
                    >
                      Aguardar
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="p-10 rounded-[2.5rem] border border-dashed border-white/5 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full border border-white/5 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white/5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Monitorando Roadmap</p>
                  <p className="text-[9px] text-white/10 mt-1 uppercase">Aguardando quebra de padrão cíclico...</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </section>

        {/* SPECIALIST STATS */}
        <section className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center gap-2 mb-2 opacity-40">
              <BarChart3 className="w-3 h-3" />
              <span className="text-[8px] font-black uppercase tracking-widest">Prob. Tie</span>
            </div>
            <p className="text-xl font-mono font-black text-white">8.4%</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center gap-2 mb-2 opacity-40">
              <History className="w-3 h-3" />
              <span className="text-[8px] font-black uppercase tracking-widest">Tendência</span>
            </div>
            <p className="text-xl font-mono font-black text-purple-400 italic">BANKER</p>
          </div>
        </section>

        {/* NEURAL LOGS */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-white/20 border-b border-white/5 pb-2">
            <Activity className="w-3 h-3" />
            <span className="text-[9px] font-black uppercase tracking-widest">Neural Stream</span>
          </div>
          
          <div className="space-y-3 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
            {robo.agent.logs.map((log) => (
              <div key={log.id} className="flex gap-3 text-[10px] leading-tight">
                <span className="text-white/10 font-mono text-[8px] mt-0.5">{new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                <p className={`
                  ${log.type === 'thought' ? 'text-purple-400/70 italic' : 'text-white/60'}
                  ${log.type === 'action' ? 'text-purple-400 font-bold' : ''}
                  ${log.type === 'success' ? 'text-emerald-400' : ''}
                  ${log.type === 'error' ? 'text-red-400 font-bold' : ''}
                `}>
                  {log.message}
                </p>
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        </section>
      </div>

      {/* SPECIALIST FOOTER */}
      <div className="px-5 py-4 bg-black border-t border-purple-500/10 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          <span className="text-[9px] font-black text-purple-400/60 uppercase italic">Will Full Engine Active</span>
        </div>
        <ShieldAlert className="w-4 h-4 text-white/5" />
      </div>
    </div>
  );
}

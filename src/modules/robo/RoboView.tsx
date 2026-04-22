import { useEffect, useState, useRef } from 'react';
import { useRobo } from './index';
import { useBridge } from '../../core/bridge';
import { useAuth } from '../auth/AuthContext';
import { useWallet } from '../wallet/WalletContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Cpu, 
  Brain,
  ShieldAlert,
  Wallet as WalletIcon,
  User as UserIcon,
  ChevronRight,
  Eye,
  EyeOff,
  History,
  ArrowUpRight,
  ArrowDownRight,
  Lock,
  Activity,
  MousePointer2
} from 'lucide-react';

export function RoboView() {
  const robo = useRobo();
  const bridge = useBridge();
  const { user } = useAuth();
  const { balance, history } = useWallet();
  const [showPassword, setShowPassword] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll para logs neurais
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [robo.agent.logs, robo.agent.currentThought]);

  // Efeito de Execução Automática (Tesla Mode)
  useEffect(() => {
    if (robo.status === 'PROPOSING' && robo.mode === 'FULL_AUTO' && robo.remainingSeconds === 0) {
      robo.executeAction();
    }
  }, [robo.remainingSeconds, robo.status, robo.mode]);

  return (
    <div className="flex flex-col h-full bg-[#020203] text-[#e2e2e7] font-sans overflow-hidden border-l border-white/5 selection:bg-cyan-500/30">
      {/* GLOW BACKGROUND EFFECTS */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* HEADER: PROFILE & STATUS */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <UserIcon className="w-5 h-5 text-black" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#020203] border-2 border-[#020203] flex items-center justify-center">
              <div className={`w-2 h-2 rounded-full ${bridge.isSyncing ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
            </div>
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">{user?.name || 'Operador'}</h2>
            <p className="text-[10px] text-white/40 font-medium uppercase tracking-widest">{user?.email || 'conexao_estavel@betia.ai'}</p>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/5">
            <Activity className="w-3 h-3 text-cyan-400" />
            <span className="text-[9px] font-black text-cyan-400/80 uppercase tracking-tighter">Latência: 14ms</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">
        
        {/* WALLET SECTION */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/60">
              <WalletIcon className="w-3.5 h-3.5" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Soberania Financeira</h3>
            </div>
            <span className="text-[9px] text-cyan-400/60 font-bold">WALLET_v4.2</span>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <div className="relative p-5 rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap className="w-12 h-12 text-white" />
              </div>
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">Saldo Disponível</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white tracking-tighter">R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                <div className="flex items-center gap-1 text-emerald-400 text-[10px] font-bold bg-emerald-400/10 px-1.5 py-0.5 rounded">
                  <ArrowUpRight className="w-3 h-3" />
                  +12.4%
                </div>
              </div>
            </div>

            {/* Quick History Overlay */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex items-center gap-2 text-white/40">
                  <History className="w-3 h-3" />
                  <span className="text-[9px] font-black uppercase">Fluxo Recente</span>
                </div>
                <button className="text-[8px] text-cyan-400 font-black uppercase hover:underline">Ver Tudo</button>
              </div>
              <div className="space-y-2">
                {history.slice(0, 3).map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-2">
                      <div className={`p-1 rounded ${tx.type === 'WIN' || tx.type === 'DEPOSIT' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {tx.type === 'WIN' || tx.type === 'DEPOSIT' ? <ArrowDownRight className="w-2.5 h-2.5" /> : <ArrowUpRight className="w-2.5 h-2.5" />}
                      </div>
                      <span className="text-white/70 font-medium">{tx.description}</span>
                    </div>
                    <span className={`font-bold ${tx.type === 'WIN' || tx.type === 'DEPOSIT' ? 'text-emerald-400' : 'text-white/40'}`}>
                      {tx.type === 'WIN' || tx.type === 'DEPOSIT' ? '+' : '-'} R$ {tx.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PROFILE/SECURITY SECTION */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-white/60">
            <Lock className="w-3.5 h-3.5" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Credenciais & Segurança</h3>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[8px] text-white/20 uppercase font-bold mb-1">ID de Operador</p>
                <p className="text-[11px] text-white font-mono">#{user?.id?.slice(0, 8) || 'AGENT_001'}</p>
              </div>
              <div>
                <p className="text-[8px] text-white/20 uppercase font-bold mb-1">Chave de Acesso</p>
                <div className="flex items-center justify-between bg-white/[0.03] px-2 py-1 rounded border border-white/5">
                  <p className="text-[11px] text-white font-mono">{showPassword ? '*********' : '********'}</p>
                  <button onClick={() => setShowPassword(!showPassword)} className="text-white/20 hover:text-white transition-colors">
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TESLA ACTION GATE (PROPOSALS) */}
        <section className="space-y-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-400">
              <Brain className="w-3.5 h-3.5" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Núcleo de Decisão</h3>
            </div>
            <div className="flex gap-1">
              {(['MANUAL', 'SEMI_AUTO', 'FULL_AUTO'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => robo.setMode(m)}
                  className={`px-2 py-1 rounded-md text-[7px] font-black uppercase transition-all ${
                    robo.mode === m 
                      ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                      : 'bg-white/5 text-white/30 hover:bg-white/10'
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
                key={robo.currentAction.id}
                initial={{ opacity: 0, scale: 0.95, y: 10 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative overflow-hidden p-5 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/30 shadow-[0_20px_50px_rgba(6,182,212,0.15)]"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl -mr-12 -mt-12" />
                
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                      {robo.currentAction.type === 'BET' ? <Zap className="w-5 h-5 text-cyan-400" /> : <Lock className="w-5 h-5 text-cyan-400" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">{robo.currentAction.title}</h4>
                      <p className="text-[10px] text-white/40">{robo.currentAction.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">{Math.round(robo.currentAction.confidence * 100)}% Confiança</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => robo.executeAction()}
                    className="relative group overflow-hidden py-3 bg-cyan-500 hover:bg-cyan-400 text-black rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Confirmar
                      {robo.mode === 'FULL_AUTO' && (
                        <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center text-[8px]">
                          {robo.remainingSeconds}s
                        </span>
                      )}
                    </span>
                    {robo.mode === 'FULL_AUTO' && (
                      <motion.div 
                        initial={{ width: '100%' }}
                        animate={{ width: '0%' }}
                        transition={{ duration: robo.currentAction.countdown, ease: 'linear' }}
                        className="absolute inset-0 bg-black/5 pointer-events-none"
                      />
                    )}
                  </button>
                  <button 
                    onClick={() => robo.cancelAction()}
                    className="py-3 bg-white/5 hover:bg-white/10 text-white/60 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5"
                  >
                    Abortar
                  </button>
                </div>
              </motion.div>
            ) : robo.status === 'EXECUTING' ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center space-y-4"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-2 border-cyan-500/20 border-t-cyan-500 animate-spin" />
                  <MousePointer2 className="absolute inset-0 m-auto w-6 h-6 text-cyan-500 animate-pulse" />
                </div>
                <p className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em] animate-pulse">Agente em Ação</p>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="p-8 rounded-3xl bg-white/[0.01] border border-dashed border-white/5 flex flex-col items-center justify-center text-center space-y-2"
              >
                <Cpu className="w-6 h-6 text-white/5" />
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Aguardando Próxima Oportunidade</p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* NEURAL ACTIVITY LOGS (REPLACED TERMINAL) */}
        <section className="space-y-3 pb-10">
          <div className="flex items-center justify-between text-white/40 border-b border-white/5 pb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-3 h-3" />
              <span className="text-[9px] font-black uppercase tracking-widest">Atividade Neural</span>
            </div>
            <div className={`w-1.5 h-1.5 rounded-full ${robo.agent.status === 'THINKING' ? 'bg-purple-500 animate-ping' : 'bg-white/10'}`} />
          </div>
          
          <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
            {robo.agent.logs.map((log) => (
              <div key={log.id} className="flex gap-3 text-[10px] leading-tight">
                <span className="text-white/10 font-mono text-[8px] mt-0.5">{new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                <p className={`
                  ${log.type === 'thought' ? 'text-purple-400/70 italic' : 'text-white/60'}
                  ${log.type === 'action' ? 'text-cyan-400 font-bold' : ''}
                  ${log.type === 'success' ? 'text-emerald-400' : ''}
                  ${log.type === 'error' ? 'text-red-400 font-bold' : ''}
                `}>
                  {log.message}
                </p>
              </div>
            ))}
            {robo.agent.currentThought && (
              <div className="flex gap-3 text-[10px] animate-pulse">
                <span className="text-white/10 font-mono text-[8px] mt-0.5">--:--:--</span>
                <p className="text-purple-400/40 italic">{robo.agent.currentThought}...</p>
              </div>
            )}
            <div ref={logEndRef} />
          </div>
        </section>
      </div>

      {/* FOOTER BAR */}
      <div className="px-5 py-3 bg-black border-t border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-white/20">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
            <span className="text-[8px] font-bold uppercase tracking-tighter">Sistemas Operacionais</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-3 h-3 text-yellow-500/40" />
          <span className="text-[8px] font-black text-white/20 uppercase italic">Tesla Control Layer v2</span>
        </div>
      </div>
    </div>
  );
}

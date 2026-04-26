import React from 'react';
import { 
  Zap, 
  Wallet as WalletIcon, 
  Trophy, 
  ArrowUpRight, 
  Download, 
  Target, 
  Plane,
  ShieldCheck,
  TrendingUp,
  Activity,
  Cpu as CpuIcon
} from 'lucide-react';
import { motion } from 'motion/react';
import { useWallet } from '../wallet';

export function HomeView({ onViewChange }: { onViewChange: (view: string) => void }) {
  const wallet = useWallet();
  const currentVersion = "v2.0.4-stable";

  const recentWins = wallet.history.filter(tx => tx.type === 'WIN').slice(0, 3);

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-[#070709] text-white space-y-10">
      <header className="max-w-6xl mx-auto flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter italic uppercase">Bet IA Studio</h1>
          <p className="text-white/40 text-xs uppercase tracking-[0.3em] font-bold mt-2">Elite Gaming Ecosystem & Autonomous Agents</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">All Systems Nominal</span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Wallet Overview */}
        <div className="md:col-span-8 bg-[#0d0d12] border border-white/5 rounded-[3rem] p-10 relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[120px] -mr-20 -mt-20 group-hover:bg-cyan-500/20 transition-colors" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                <WalletIcon className="w-5 h-5 text-white/40" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Saldo Consolidado</span>
            </div>
            
            <div className="flex items-end gap-6">
              <h2 className="text-7xl font-mono font-black italic tracking-tighter">
                R$ {wallet.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h2>
              <button 
                onClick={() => onViewChange('wallet')}
                className="mb-2 p-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all group/btn"
              >
                <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
              </button>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6">
               <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5">
                  <p className="text-[8px] text-white/20 uppercase font-black tracking-widest mb-1">Volume 24h</p>
                  <p className="text-xl font-mono font-black text-white/60">R$ 12.430</p>
               </div>
               <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5">
                  <p className="text-[8px] text-white/20 uppercase font-black tracking-widest mb-1">Taxa de Win</p>
                  <p className="text-xl font-mono font-black text-emerald-400">74.2%</p>
               </div>
               <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5">
                  <p className="text-[8px] text-white/20 uppercase font-black tracking-widest mb-1">Status</p>
                  <p className="text-xl font-mono font-black text-cyan-400 italic">VIP_ELITE</p>
               </div>
            </div>
          </div>
        </div>

        {/* Elite Robots Section */}
        <div className="md:col-span-12">
          <div className="flex items-center gap-3 mb-8">
            <Zap className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-black uppercase tracking-[0.2em] italic">Agentes Autônomos & Extensões</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Generic Robot Card */}
            <div className="bg-gradient-to-br from-[#0d0d12] to-[#16161d] border border-white/5 rounded-[3rem] p-10 relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] -mr-20 -mt-20 group-hover:bg-cyan-500/10 transition-colors" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-8">
                  <div className="w-16 h-16 bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-center">
                    <CpuIcon className="w-8 h-8 text-white/40" />
                  </div>
                  <span className="px-3 py-1 bg-white/5 text-white/40 text-[8px] font-black uppercase rounded-full">v2.0.4 - Estável</span>
                </div>
                
                <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-tight mb-4">
                  Robô <span className="text-white/60">Genérico</span><br/>
                  <span className="text-cyan-400">Bet IA Studio</span>
                </h3>
                
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest leading-relaxed mb-10 max-w-[280px]">
                  Automação universal adaptável. Ideal para logins, saques e monitoramento de múltiplas bancas.
                </p>
                
                <button 
                  onClick={() => window.open('https://betia.cloud/extension/latest-generic.zip', '_blank')}
                  className="mt-auto w-full py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Agente Genérico
                </button>
              </div>
            </div>

            {/* Bac Bo Specialist Card */}
            <div className="bg-gradient-to-br from-[#0d0d12] to-[#1a1321] border border-cyan-500/10 rounded-[3rem] p-10 relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] -mr-20 -mt-20 group-hover:bg-purple-500/20 transition-colors" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-8">
                  <div className="w-16 h-16 bg-purple-500/10 rounded-[2rem] border border-purple-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                    <Target className="w-8 h-8 text-purple-400" />
                  </div>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-[8px] font-black uppercase rounded-full">PRO SPECIALIST</span>
                </div>
                
                <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-tight mb-4">
                  Especialista <span className="text-purple-400">Bac Bo</span><br/>
                  <span className="text-white/60">Método Will Full</span>
                </h3>
                
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest leading-relaxed mb-10 max-w-[280px]">
                  Motor otimizado para Bac Bo Live. Implementa progressão neural e análise de roadmap em tempo real.
                </p>
                
                <button 
                  onClick={() => window.open('https://betia.cloud/extension/latest-bacbo-specialist.zip', '_blank')}
                  className="mt-auto w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-[0_10px_30px_rgba(147,51,234,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Agente Especialista
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Games Suite */}
        <div className="md:col-span-12">
          <div className="flex items-center gap-3 mb-8">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h3 className="text-sm font-black uppercase tracking-[0.2em] italic">Gaming Suite Premium</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Bac Bo Card */}
             <div 
               onClick={() => onViewChange('bacbo')}
               className="bg-[#0d0d12] border border-white/5 rounded-[3rem] p-10 flex items-center justify-between group cursor-pointer hover:border-cyan-500/30 transition-all hover:bg-white/[0.03]"
             >
                <div className="flex items-center gap-8">
                   <div className="w-20 h-20 bg-blue-600/10 rounded-[2rem] border border-blue-500/20 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3">
                      <Target className="w-10 h-10 text-blue-500" />
                   </div>
                   <div>
                      <h4 className="text-2xl font-black italic uppercase tracking-tighter">Bac Bo Live</h4>
                      <p className="text-[10px] text-white/20 uppercase tracking-widest font-black mt-1">Evolução dos Dados</p>
                   </div>
                </div>
                <div className="flex flex-col items-end">
                   <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase rounded-full mb-2">Operacional</span>
                   <TrendingUp className="w-6 h-6 text-white/10 group-hover:text-white transition-colors" />
                </div>
             </div>

             {/* Aviator Card */}
             <div 
               onClick={() => onViewChange('aviator')}
               className="bg-[#0d0d12] border border-white/5 rounded-[3rem] p-10 flex items-center justify-between group cursor-pointer hover:border-red-500/30 transition-all hover:bg-white/[0.03]"
             >
                <div className="flex items-center gap-8">
                   <div className="w-20 h-20 bg-red-600/10 rounded-[2rem] border border-red-500/20 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:-rotate-3">
                      <Plane className="w-10 h-10 text-red-500" />
                   </div>
                   <div>
                      <h4 className="text-2xl font-black italic uppercase tracking-tighter">Aviator</h4>
                      <p className="text-[10px] text-white/20 uppercase tracking-widest font-black mt-1">High Speed Multiplier</p>
                   </div>
                </div>
                <div className="flex flex-col items-end">
                   <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase rounded-full mb-2">Operacional</span>
                   <TrendingUp className="w-6 h-6 text-white/10 group-hover:text-white transition-colors" />
                </div>
             </div>
          </div>
        </div>

        {/* Security / System Footer */}
        <div className="md:col-span-12 p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-4">
              <ShieldCheck className="w-8 h-8 text-cyan-400/40" />
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest">Protocolo Tesla Mode</p>
                 <p className="text-[11px] font-bold text-white/40 italic">Intervenção manual detectada em tempo real em todas as mesas.</p>
              </div>
           </div>
           <div className="flex gap-4">
              <div className="text-right">
                 <p className="text-[8px] text-white/20 uppercase font-black tracking-widest">Latência de Rede</p>
                 <p className="text-[10px] font-black text-emerald-400 font-mono">14ms</p>
              </div>
              <div className="text-right">
                 <p className="text-[8px] text-white/20 uppercase font-black tracking-widest">Região</p>
                 <p className="text-[10px] font-black text-cyan-400 font-mono">SA-EAST-1</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}

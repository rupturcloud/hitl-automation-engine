import React, { useState } from 'react';
import { useWallet } from './index';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  History, 
  CreditCard, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Search,
  Filter,
  Plus,
  ArrowRightLeft,
  X,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function WalletView() {
  const wallet = useWallet();
  const [activeTab, setActiveTab] = useState<'ALL' | 'DEPOSIT' | 'WITHDRAW' | 'BET' | 'WIN'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState<'DEPOSIT' | 'WITHDRAW' | null>(null);
  const [amount, setAmount] = useState('');

  const filteredHistory = wallet.history.filter(tx => 
    activeTab === 'ALL' ? true : tx.type === activeTab
  );

  const handleAction = () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return;

    if (isModalOpen === 'DEPOSIT') {
      wallet.deposit(val);
    } else {
      wallet.withdraw(val);
    }
    
    setIsModalOpen(null);
    setAmount('');
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-[#070709] text-white">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase italic">Central Financeira</h1>
            <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mt-1">Gestão de ativos e fluxo de caixa live</p>
          </div>
          <div className="flex gap-3">
             <button onClick={() => setIsModalOpen('DEPOSIT')} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl shadow-emerald-500/10">
               <Plus className="w-4 h-4" /> Novo Depósito
             </button>
             <button onClick={() => setIsModalOpen('WITHDRAW')} className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2">
               Solicitar Saque
             </button>
          </div>
        </header>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="md:col-span-2 bg-[#0d0d12] border border-white/5 rounded-[3rem] p-10 flex flex-col justify-between relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px]" />
              <div className="relative z-10">
                 <p className="text-[10px] text-white/30 uppercase font-black tracking-[0.3em] mb-4">Saldo Consolidado</p>
                 <h2 className="text-6xl font-mono font-black tracking-tighter text-white italic drop-shadow-2xl">
                    R$ {wallet.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                 </h2>
                 <div className="flex items-center gap-4 mt-8">
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                       <TrendingUp className="w-3 h-3 text-emerald-400" />
                       <span className="text-[10px] font-black text-emerald-400">ATIVO</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                       <CreditCard className="w-3 h-3 text-white/30" />
                       <span className="text-[10px] font-black text-white/30 tracking-widest uppercase">Conta Verificada</span>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[3rem] p-10 flex flex-col justify-between relative shadow-2xl group cursor-pointer hover:scale-[1.02] transition-transform">
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                 <DollarSign className="w-10 h-10 text-white/40 mb-6" />
                 <h3 className="text-xl font-black leading-tight">Volume de Operações</h3>
                 <p className="text-3xl font-mono font-black mt-4">R$ {wallet.history.reduce((acc, tx) => acc + tx.amount, 0).toLocaleString('pt-BR')}</p>
              </div>
              <div className="relative z-10 flex justify-between items-center pt-6 border-t border-white/10 mt-6">
                 <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Status: Operacional</span>
                 <ArrowUpRight className="w-4 h-4" />
              </div>
           </div>
        </div>

        {/* Transaction History Section */}
        <div className="bg-[#0d0d12] border border-white/5 rounded-[3rem] shadow-2xl overflow-hidden">
           <div className="px-10 py-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/[0.01]">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                    <History className="w-5 h-5 text-white/40" />
                 </div>
                 <h3 className="text-sm font-black uppercase tracking-widest">Extrato de Operações</h3>
              </div>

              <div className="flex gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/5">
                 {(['ALL', 'DEPOSIT', 'WITHDRAW', 'BET', 'WIN'] as const).map(tab => (
                    <button 
                       key={tab}
                       onClick={() => setActiveTab(tab)}
                       className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all ${activeTab === tab ? 'bg-white/10 text-white' : 'text-white/20 hover:text-white/40'}`}
                    >
                       {tab === 'ALL' ? 'Todos' : tab === 'DEPOSIT' ? 'Depósitos' : tab === 'WITHDRAW' ? 'Saques' : tab === 'BET' ? 'Apostas' : 'Ganhos'}
                    </button>
                 ))}
              </div>
           </div>

           <div className="p-4 overflow-y-auto max-h-[600px] no-scrollbar">
              <div className="space-y-2">
                 <AnimatePresence mode="popLayout">
                    {filteredHistory.length > 0 ? (
                       filteredHistory.map((tx) => (
                          <motion.div 
                             key={tx.id}
                             initial={{ opacity: 0, x: -20 }}
                             animate={{ opacity: 1, x: 0 }}
                             exit={{ opacity: 0, scale: 0.95 }}
                             className="flex items-center justify-between p-6 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.03] rounded-[1.5rem] transition-all group"
                          >
                             <div className="flex items-center gap-6">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-transform group-hover:scale-110 ${
                                   tx.type === 'WIN' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                   tx.type === 'BET' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                                   tx.type === 'DEPOSIT' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' :
                                   'bg-red-500/10 border-red-500/20 text-red-400'
                                }`}>
                                   {tx.type === 'WIN' ? <TrendingUp className="w-6 h-6" /> :
                                    tx.type === 'BET' ? <ArrowRightLeft className="w-6 h-6" /> :
                                    tx.type === 'DEPOSIT' ? <ArrowDownLeft className="w-6 h-6" /> :
                                    <ArrowUpRight className="w-6 h-6" />}
                                </div>
                                <div>
                                   <p className="text-sm font-black text-white italic">{tx.description}</p>
                                   <div className="flex items-center gap-3 mt-1">
                                      <span className="text-[10px] text-white/20 font-black uppercase tracking-widest">{new Date(tx.timestamp).toLocaleString()}</span>
                                      <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${
                                         tx.type === 'WIN' ? 'text-emerald-400 border-emerald-500/30' :
                                         tx.type === 'BET' ? 'text-blue-400 border-blue-500/30' :
                                         tx.type === 'DEPOSIT' ? 'text-cyan-400 border-cyan-500/30' :
                                         'text-red-400 border-red-500/30'
                                      }`}>{tx.type}</span>
                                   </div>
                                </div>
                             </div>
                             <div className="text-right">
                                <p className={`text-xl font-mono font-black ${
                                   (tx.type === 'WIN' || tx.type === 'DEPOSIT') ? 'text-emerald-400' : 'text-red-400'
                                }`}>
                                   {(tx.type === 'WIN' || tx.type === 'DEPOSIT') ? '+' : '-'} R$ {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </p>
                                <p className="text-[9px] text-white/10 font-bold uppercase tracking-widest">ID: {tx.id.split('-')[0].toUpperCase()}</p>
                             </div>
                          </motion.div>
                       ))
                    ) : (
                       <div className="py-20 text-center flex flex-col items-center opacity-20">
                          <Search className="w-12 h-12 mb-4" />
                          <p className="text-xs font-black uppercase tracking-[0.3em]">Nenhuma transação encontrada</p>
                       </div>
                    )}
                 </AnimatePresence>
              </div>
           </div>
        </div>
      </div>

      {/* Action Modal */}
      <AnimatePresence>
         {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
               <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="bg-[#0f0f15] border border-white/10 p-10 rounded-[3rem] max-w-md w-full shadow-2xl"
               >
                  <div className="flex justify-between items-center mb-8">
                     <h3 className="text-xl font-black uppercase tracking-tighter italic">
                        {isModalOpen === 'DEPOSIT' ? 'Novo Depósito' : 'Solicitar Saque'}
                     </h3>
                     <button onClick={() => setIsModalOpen(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <X className="w-5 h-5 text-white/40" />
                     </button>
                  </div>

                  <div className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Valor da Operação (R$)</label>
                        <input 
                           type="number" 
                           value={amount}
                           onChange={(e) => setAmount(e.target.value)}
                           placeholder="0.00"
                           className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-6 px-6 text-2xl font-mono font-black focus:border-cyan-500/50 outline-none transition-all placeholder:text-white/5"
                        />
                     </div>

                     <div className="p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-2xl flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                        <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">
                           Sua transação será processada instantaneamente através da nossa rede segura.
                        </p>
                     </div>

                     <button 
                        onClick={handleAction}
                        className={`w-full py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl ${
                           isModalOpen === 'DEPOSIT' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/10' : 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-500/10'
                        }`}
                     >
                        Confirmar {isModalOpen === 'DEPOSIT' ? 'Depósito' : 'Saque'}
                     </button>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
}

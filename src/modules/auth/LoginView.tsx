import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Mail, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from './AuthContext';

export function LoginView() {
  const { login } = useAuth();
  const [email, setEmail] = useState('diego@ruptur.cloud');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const success = await login(email, password);
      if (!success) {
        setError('Credenciais inválidas. Verifique seu e-mail e chave de acesso.');
      }
    } catch (err) {
      setError('Ocorreu um erro ao tentar acessar o sistema.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] flex items-center justify-center p-6 overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-[#0d0d12]/80 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 shadow-2xl shadow-cyan-500/5">
          <header className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-cyan-500 to-indigo-600 p-[1px] mb-6 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-[#0d0d12] rounded-[1.4rem] flex items-center justify-center">
                <Shield className="w-8 h-8 text-cyan-400" />
              </div>
            </div>
            <h1 className="text-3xl font-black tracking-tighter uppercase italic text-white">Bet IA <span className="text-cyan-400">Studio</span></h1>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-2">Acesso Restrito ao Painel de Automação</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-bold uppercase tracking-tight"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">E-mail de Operador</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-cyan-400 transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-cyan-500/50 focus:bg-white/[0.06] transition-all text-white placeholder:text-white/10"
                  placeholder="ex: diego@ruptur.cloud"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Chave de Segurança</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-cyan-400 transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-cyan-500/50 focus:bg-white/[0.06] transition-all text-white placeholder:text-white/10"
                  placeholder="••••••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-black uppercase tracking-widest py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-cyan-500/10 group disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Entrar no Sistema
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <footer className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest">
              Protegido por Criptografia de Ponta a Ponta Ruptur Cloud
            </p>
          </footer>
        </div>

        <p className="text-center mt-8 text-white/10 text-[9px] font-black uppercase tracking-widest">
          v2.4.0-stable | build 2024.04.22
        </p>
      </motion.div>
    </div>
  );
}

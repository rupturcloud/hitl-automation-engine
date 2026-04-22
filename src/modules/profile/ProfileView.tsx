import React, { useState } from 'react';
import { User, Mail, Lock, ShieldCheck, Camera, Bell, Shield, Save, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../auth/AuthContext';

export function ProfileView() {
  const { user, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Como o useAuth não expõe a senha por segurança no objeto user da sessão, 
  // buscamos do storage de perfil apenas para edição visual neste protótipo
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('betia_user_profile');
    return saved ? JSON.parse(saved) : { ...user, password: 'password123' };
  });

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-[#070709] text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">Meu Perfil</h1>
          <p className="text-white/40 text-xs uppercase tracking-widest font-bold mt-1">Gerencie sua identidade digital na Bet IA</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Avatar Card */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-[#0d0d12] border border-white/5 rounded-[2.5rem] p-8 flex flex-col items-center text-center shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-32 h-32 mb-6">
                <div className="absolute inset-0 bg-cyan-500 blur-2xl opacity-20 animate-pulse" />
                <div className="relative w-full h-full rounded-full border-2 border-cyan-500/30 p-1">
                  <div className="w-full h-full rounded-full bg-[#16161c] flex items-center justify-center overflow-hidden">
                    <User className="w-16 h-16 text-white/10" />
                  </div>
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-cyan-500 rounded-full border-4 border-[#0d0d12] hover:scale-110 transition-transform">
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>
              <h2 className="text-xl font-black tracking-tight truncate w-full">{user.name}</h2>
              <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-1">Membro Platinum</p>
              
              <div className="mt-6 pt-6 border-t border-white/5 w-full space-y-4">
                 <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/20">
                    <span>Integridade da Conta</span>
                    <span className="text-emerald-400">100%</span>
                 </div>
                 <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                 </div>
              </div>
            </div>

            <div className="bg-[#0d0d12] border border-white/5 rounded-[2.5rem] p-6 space-y-4">
               <div className="flex items-center gap-3 text-white/40 hover:text-white transition-colors cursor-pointer group">
                  <Bell className="w-4 h-4 group-hover:text-cyan-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Central de Notificações</span>
               </div>
               <div className="flex items-center gap-3 text-white/40 hover:text-white transition-colors cursor-pointer group">
                  <Shield className="w-4 h-4 group-hover:text-cyan-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Segurança Avançada</span>
               </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="md:col-span-2">
            <div className="bg-[#0d0d12] border border-white/5 rounded-[3rem] p-10 space-y-8 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] pointer-events-none" />
               
               <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-sm font-black uppercase tracking-widest">Dados de Acesso</h3>
                  </div>
                  {!isEditing ? (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="text-[9px] font-black uppercase tracking-widest text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      Editar Dados
                    </button>
                  ) : (
                    <button 
                      onClick={handleSave}
                      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                    >
                      <Save className="w-3 h-3" /> Salvar
                    </button>
                  )}
               </div>

               <div className="space-y-6 relative z-10">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Nome de Exibição</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input 
                        type="text" 
                        value={isEditing ? formData.name : user.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className={`w-full bg-white/[0.02] border rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none transition-all ${isEditing ? 'border-cyan-500/50 bg-white/5' : 'border-white/10'}`}
                        readOnly={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">E-mail Corporativo</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input 
                        type="email" 
                        value={isEditing ? formData.email : user.email} 
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className={`w-full bg-white/[0.02] border rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none transition-all ${isEditing ? 'border-cyan-500/50 bg-white/5' : 'border-white/10'}`}
                        readOnly={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Chave de Acesso (Senha)</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input 
                        type={showPassword || isEditing ? "text" : "password"} 
                        value={isEditing ? formData.password : user.password} 
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className={`w-full bg-white/[0.02] border rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none transition-all ${isEditing ? 'border-cyan-500/50 bg-white/5' : 'border-white/10'}`}
                        readOnly={!isEditing}
                      />
                      {!isEditing && (
                        <button 
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase tracking-widest text-white/20 hover:text-white"
                        >
                          {showPassword ? 'Ocultar' : 'Mostrar'}
                        </button>
                      )}
                    </div>
                  </div>
               </div>

                <div className="pt-6 border-t border-white/5 flex gap-4">
                  <div className="flex-1 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                     <p className="text-[8px] text-white/20 uppercase font-black tracking-widest mb-1">Último Acesso</p>
                     <p className="text-[10px] font-bold">Hoje, às 14:32 - IP: 189.12.43.11</p>
                  </div>
                  <div className="flex-1 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                     <p className="text-[8px] text-white/20 uppercase font-black tracking-widest mb-1">Status 2FA</p>
                     <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Ativo e Seguro</p>
                  </div>
               </div>

               <div className="mt-8">
                  <button 
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    <LogOut className="w-4 h-4" /> Encerrar Sessão
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

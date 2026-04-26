import React from 'react';
import { 
  LayoutDashboard, 
  Wallet as WalletIcon, 
  User, 
  Zap, 
  CircleDot, 
  Download,
  Settings,
  LogOut,
  ChevronRight,
  Plane
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarItemProps {
  icon: any;
  label: string;
  active?: boolean;
  onClick: () => void;
  badge?: string;
}

function SidebarItem({ icon: Icon, label, active, onClick, badge }: SidebarItemProps) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group relative ${
        active ? 'bg-cyan-500/10 text-cyan-400' : 'text-white/40 hover:bg-white/5 hover:text-white'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`transition-transform group-hover:scale-110 ${active ? 'text-cyan-400' : 'text-white/20 group-hover:text-white/60'}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
      </div>
      {badge ? (
        <span className="bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase">{badge}</span>
      ) : active && (
        <motion.div layoutId="active-pill" className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
      )}
    </button>
  );
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeView: string;
  onViewChange: (view: string) => void;
}

export function DashboardLayout({ children, activeView, onViewChange }: DashboardLayoutProps) {
  const currentVersion = "v2.0.4-stable";

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#050505] text-white overflow-hidden font-sans">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-6 border-b border-white/5 bg-[#0a0a0c] z-50">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Zap className="w-5 h-5 text-white" />
           </div>
           <h1 className="text-lg font-black tracking-tighter italic">BET IA</h1>
        </div>
        <div className="text-[8px] font-black uppercase text-white/20 tracking-widest">{currentVersion}</div>
      </header>

      {/* Premium Sidebar (Desktop) */}
      <aside className="hidden md:flex w-72 border-r border-white/5 bg-[#0a0a0c] flex-col p-6 z-50">
        <div className="mb-10 px-4">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Zap className="w-6 h-6 text-white" />
             </div>
             <div>
                <h1 className="text-xl font-black tracking-tighter italic">BET IA</h1>
                <p className="text-[8px] text-white/20 uppercase tracking-[0.3em] font-black">Elite Ecosystem</p>
             </div>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
           <p className="px-4 text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-4">Central de Comando</p>
           <SidebarItem 
             icon={LayoutDashboard} 
             label="Dashboard" 
             active={activeView === 'home'} 
             onClick={() => onViewChange('home')} 
           />
           <SidebarItem 
             icon={CircleDot} 
             label="Bac Bo Live" 
             active={activeView === 'bacbo'} 
             onClick={() => onViewChange('bacbo')} 
           />
           <SidebarItem 
             icon={Plane} 
             label="Aviator" 
             active={activeView === 'aviator'} 
             onClick={() => onViewChange('aviator')} 
           />
           <SidebarItem 
             icon={WalletIcon} 
             label="Carteira" 
             active={activeView === 'wallet'} 
             onClick={() => onViewChange('wallet')} 
           />
           <SidebarItem 
             icon={User} 
             label="Perfil" 
             active={activeView === 'profile'} 
             onClick={() => onViewChange('profile')} 
           />

           <div className="pt-8">
              <p className="px-4 text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-4">Ferramentas</p>
              <SidebarItem 
                icon={Download} 
                label="Extensões" 
                onClick={() => window.open('https://betia.cloud/extensions', '_blank')} 
              />
              <SidebarItem 
                icon={Settings} 
                label="Ajustes" 
                onClick={() => {}} 
              />
           </div>
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5 px-4">
           <button className="flex items-center gap-3 text-white/20 hover:text-red-400 transition-colors group">
              <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">Encerrar Sessão</span>
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden flex flex-col relative">
        {children}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden flex items-center justify-around p-4 bg-[#0a0a0c]/80 backdrop-blur-2xl border-t border-white/5 z-50">
        <button onClick={() => onViewChange('home')} className={`p-2 transition-all ${activeView === 'home' ? 'text-cyan-400' : 'text-white/20'}`}>
          <LayoutDashboard className="w-6 h-6" />
        </button>
        <button onClick={() => onViewChange('bacbo')} className={`p-2 transition-all ${activeView === 'bacbo' ? 'text-cyan-400' : 'text-white/20'}`}>
          <CircleDot className="w-6 h-6" />
        </button>
        <button onClick={() => onViewChange('wallet')} className={`p-2 transition-all ${activeView === 'wallet' ? 'text-cyan-400' : 'text-white/20'}`}>
          <WalletIcon className="w-6 h-6" />
        </button>
        <button onClick={() => onViewChange('profile')} className={`p-2 transition-all ${activeView === 'profile' ? 'text-cyan-400' : 'text-white/20'}`}>
          <User className="w-6 h-6" />
        </button>
      </nav>
    </div>
  );
}

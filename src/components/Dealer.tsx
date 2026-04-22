import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../types';

export interface Professional {
  name: string;
  image: string;
  gender: 'male' | 'female';
}

export const PROFESSIONALS: Professional[] = [
  { name: 'Isabella', image: 'https://images.unsplash.com/photo-1614292233181-79750058b8d8?q=80&w=800&auto=format&fit=crop', gender: 'female' },
  { name: 'Ricardo', image: 'https://images.unsplash.com/photo-1550741111-c80715d3dc9c?q=80&w=800&auto=format&fit=crop', gender: 'male' },
  { name: 'Sophia', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop', gender: 'female' },
  { name: 'Gabriel', image: 'https://images.unsplash.com/photo-1545987796-200f16247993?q=80&w=800&auto=format&fit=crop', gender: 'male' },
];

interface DealerProps {
  status: 'BETTING' | 'ROLLING' | 'RESULT';
  isBankActive: boolean;
  currentProfessional: Professional;
}

const Dealer: React.FC<DealerProps> = ({ status, isBankActive, currentProfessional }) => {
  const getDealerMessage = () => {
    if (!isBankActive) return "Mesa de Dados Fechada";
    switch (status) {
      case 'BETTING': return "Façam suas apostas nos dados!";
      case 'ROLLING': return "Dados vibrando! Boa sorte!";
      case 'RESULT': return "Resultado na mesa!";
      default: return "";
    }
  };

  return (
    <div className="relative flex flex-col items-center z-10 p-4">
      {/* Name Identification Tag - Positioned like a TV Broadcast badge */}
      <motion.div
        key={currentProfessional.name}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute -top-8 bg-black/80 border border-gold/30 px-4 py-1 rounded-full z-30 flex items-center gap-2"
      >
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        <span className="text-[9px] font-black tracking-widest text-gold">
          LIVE: {currentProfessional.name.toUpperCase()}
        </span>
      </motion.div>

      {/* Presenter/Dealer Animated Representation */}
      <motion.div 
        key={currentProfessional.image}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative w-64 h-80 md:w-80 md:h-96"
      >
        {/* Glow behind the presenter */}
        <div className="absolute inset-0 bg-gold/5 blur-[100px] rounded-full" />
        
        {/* Presenter Figure - Integrated into the scene */}
        <div 
          className="w-full h-full object-cover transition-all duration-1000 grayscale-[0.2] contrast-[1.1]"
          style={{
            maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
            backgroundImage: `url(${currentProfessional.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top'
          }}
        />

        {/* Floating Table UI Elements around the presenter */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full flex justify-center gap-24 pointer-events-none">
           <motion.div 
             animate={status === 'ROLLING' ? { y: [0, -2, 0], opacity: [0.3, 1, 0.3] } : { opacity: 0 }}
             className="w-12 h-1 bg-blue-500 blur-sm rounded-full"
           />
           <motion.div 
             animate={status === 'ROLLING' ? { y: [0, -2, 0], opacity: [0.3, 1, 0.3] } : { opacity: 0 }}
             className="w-12 h-1 bg-red-500 blur-sm rounded-full"
           />
        </div>
      </motion.div>

      {/* Presenter Speech Bubble */}
      <AnimatePresence mode="wait">
        <motion.div
          key={getDealerMessage()}
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.1, y: -10 }}
          className="absolute -top-12 bg-white text-black px-6 py-2 rounded-full shadow-2xl glass-panel border-none font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 whitespace-nowrap"
        >
          <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
          {getDealerMessage()}
          {/* Bubble Tail */}
          <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Dealer;

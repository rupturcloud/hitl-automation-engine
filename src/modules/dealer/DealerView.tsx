import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Bot } from 'lucide-react';

export type DealerGender = 'BOY' | 'GIRL';

interface DealerProps {
  gender?: DealerGender;
  message: string;
  isSpeaking: boolean;
}

export function Dealer({ gender = 'GIRL', message, isSpeaking }: DealerProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 pt-2 space-y-4">
      {/* AI Avatar Frame */}
      <div className="relative group">
        {/* Glowing Rings */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500" />
        
        <motion.div
          animate={isSpeaking ? { 
            boxShadow: [
              "0 0 20px rgba(6, 182, 212, 0.2)",
              "0 0 40px rgba(168, 85, 247, 0.4)",
              "0 0 20px rgba(6, 182, 212, 0.2)"
            ]
          } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
          className={`relative w-28 h-28 rounded-full border-2 border-white/10 bg-[#0d0d12]/80 backdrop-blur-2xl flex items-center justify-center z-10`}
        >
          {/* Inner Glow */}
          <div className="absolute inset-2 rounded-full border border-white/5 bg-gradient-to-b from-white/5 to-transparent" />
          
          <div className={`w-20 h-20 rounded-full flex items-center justify-center ${gender === 'GIRL' ? 'bg-purple-500/10' : 'bg-cyan-500/10'}`}>
            <Bot className={`w-12 h-12 ${gender === 'GIRL' ? 'text-purple-400' : 'text-cyan-400'} drop-shadow-[0_0_8px_currentColor]`} />
          </div>

          {/* AI Particles */}
          {isSpeaking && (
            <>
              <motion.div 
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute inset-0 border-2 border-cyan-500/30 rounded-full"
              />
              <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-yellow-400 animate-pulse" />
            </>
          )}
        </motion.div>
        
        {/* Live Indicator */}
        <div className="absolute bottom-1 right-2 z-20 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
          <span className="text-[8px] font-black text-white/90 tracking-tighter">LIVE</span>
        </div>
      </div>

      {/* Speech Bubble Premium */}
      <AnimatePresence>
        {isSpeaking && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-30"
          >
             <div className="bg-gradient-to-b from-white/10 to-transparent border border-white/10 backdrop-blur-xl px-5 py-2.5 rounded-[1.25rem] max-w-[220px] shadow-2xl overflow-hidden">
                {/* Scanning Effect */}
                <motion.div 
                  animate={{ top: ['-100%', '200%'] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                  className="absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent z-0 pointer-events-none"
                />
                
                <p className="relative z-10 text-[11px] font-bold text-white leading-relaxed tracking-tight text-center">
                  {message}
                </p>
             </div>
             {/* Bubble Tail */}
             <div className="w-4 h-4 bg-[#1a1a24] border-l border-t border-white/10 absolute -top-2 left-1/2 -translate-x-1/2 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


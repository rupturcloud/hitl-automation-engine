import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../types';

interface DiceProps {
  value: number;
  isRolling: boolean;
  color?: 'gold' | 'white' | 'red';
  className?: string;
}

const Dice: React.FC<DiceProps> = ({ value, isRolling, color = 'white', className }) => {
  const getPips = (val: number) => {
    switch (val) {
      case 1: return [4];
      case 2: return [0, 8];
      case 3: return [0, 4, 8];
      case 4: return [0, 2, 6, 8];
      case 5: return [0, 2, 4, 6, 8];
      case 6: return [0, 2, 3, 5, 6, 8];
      default: return [];
    }
  };

  const pips = getPips(value);

  const colorClasses = {
    white: "bg-blue-600/30 text-white border-blue-400/50 shadow-[0_0_30px_rgba(59,130,246,0.3)]",
    gold: "bg-amber-600/30 text-amber-100 border-amber-400/50 shadow-[0_0_30px_rgba(197,160,89,0.3)]",
    red: "bg-red-600/30 text-white border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.3)]",
  };

  return (
    <div className="relative group">
      {/* Vibration Table Base */}
      <motion.div
        animate={isRolling ? {
          x: [-1, 2, -2, 1],
          y: [-1, 1, -0.5, 0.5]
        } : {}}
        transition={{ repeat: Infinity, duration: 0.08 }}
        className="absolute -bottom-2 -left-2 -right-2 h-8 bg-gradient-to-b from-[#222] to-[#0a0a0a] rounded-xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
      />
      
      {/* Glow effect on base during roll */}
      <AnimatePresence>
        {isRolling && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "absolute -bottom-6 -left-6 -right-6 h-12 blur-2xl z-0",
              color === 'white' ? "bg-blue-500/40" : color === 'red' ? "bg-red-600/40" : "bg-amber-500/40"
            )}
          />
        )}
      </AnimatePresence>

      <motion.div
        animate={isRolling ? {
          rotate: [0, 90, 180, 270, 360],
          scale: [1, 1.1, 0.95, 1.05, 1],
          y: [0, -10, 5, -5, 0],
        } : { rotate: 0, scale: 1 }}
        transition={isRolling ? {
          duration: 0.2,
          repeat: Infinity,
          ease: "linear"
        } : { type: "spring", stiffness: 300, damping: 20 }}
        className={cn(
          "relative w-28 h-28 rounded-3xl border-2 flex items-center justify-center p-4 shadow-2xl backdrop-blur-xl z-10 transition-all",
          colorClasses[color],
          className
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
        <div className="grid grid-cols-3 grid-rows-3 gap-2 w-full h-full">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="flex items-center justify-center">
              {pips.includes(i) && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={cn(
                    "w-4 h-4 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]",
                    color === 'gold' ? "bg-amber-100" : "bg-white"
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dice;

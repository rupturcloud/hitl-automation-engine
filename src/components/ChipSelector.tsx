import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../types';
import { RotateCcw, X2 } from 'lucide-react';

interface ChipSelectorProps {
  selectedAmount: number;
  onSelect: (amount: number) => void;
  onUndo?: () => void;
  onDouble?: () => void;
  disabled?: boolean;
}

const CHIPS = [1, 5, 10, 25, 50, 100, 500];

const ChipSelector: React.FC<ChipSelectorProps> = ({ 
  selectedAmount, 
  onSelect, 
  onUndo, 
  onDouble, 
  disabled 
}) => {
  return (
    <div className="flex items-center gap-2 md:gap-4 bg-black/60 backdrop-blur-3xl px-3 md:px-6 py-2 rounded-full border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
      {/* Undo Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onUndo}
        disabled={disabled}
        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors disabled:opacity-20"
        title="Desfazer"
      >
        <RotateCcw className="w-5 h-5 text-white/70" />
      </motion.button>

      {/* Chips List */}
      <div className="flex items-center gap-1 md:gap-3 overflow-x-auto no-scrollbar py-2 px-1 max-w-[280px] md:max-w-none">
        {CHIPS.map((amount) => (
          <motion.button
            key={amount}
            whileHover={!disabled ? { scale: 1.1, y: -8 } : {}}
            whileTap={!disabled ? { scale: 0.9 } : {}}
            onClick={() => !disabled && onSelect(amount)}
            disabled={disabled}
            className={cn(
              "relative w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300",
              "border-[3px] md:border-[4px] border-dashed shadow-[0_8px_16px_rgba(0,0,0,0.6)]",
              selectedAmount === amount 
                ? "scale-110 md:scale-125 -translate-y-2 border-white ring-4 ring-white/20 z-10" 
                : "border-white/10 opacity-80 hover:opacity-100",
              getChipColor(amount),
              disabled && "opacity-20 cursor-not-allowed grayscale"
            )}
          >
            {/* 3D Inner Shadow Effect */}
            <div className="absolute inset-0 rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-2px_4px_rgba(0,0,0,0.4)]" />
            
            {/* Center Area */}
            <div className="absolute inset-1.5 md:inset-2 rounded-full border border-white/10 flex items-center justify-center bg-black/40 backdrop-blur-sm shadow-inner">
              <span className="text-[8px] md:text-[11px] font-black text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                {amount >= 1000 ? `${amount/1000}K` : amount}
              </span>
            </div>
            
            {/* Detail Rings */}
            <div className="absolute inset-0 rounded-full border border-black/20 pointer-events-none" />
          </motion.button>
        ))}
      </div>

      {/* Double Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onDouble}
        disabled={disabled}
        className="h-10 px-4 rounded-full bg-gradient-to-b from-amber-400/20 to-amber-600/40 border border-amber-500/30 flex items-center justify-center hover:from-amber-400/40 hover:to-amber-600/60 transition-all gap-1 disabled:opacity-20 shadow-lg"
        title="Dobrar"
      >
        <span className="text-[10px] md:text-xs font-black text-amber-400 uppercase italic">2x</span>
      </motion.button>
    </div>
  );
};

function getChipColor(amount: number): string {
  if (amount < 5) return "bg-gray-400";
  if (amount < 10) return "bg-red-500";
  if (amount < 25) return "bg-blue-500";
  if (amount < 50) return "bg-green-500";
  if (amount < 100) return "bg-black";
  if (amount < 500) return "bg-purple-600";
  return "bg-amber-600";
}

export default ChipSelector;



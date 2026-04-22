import React from 'react';
import { cn, GameHistory, ResultType } from '../types';

interface RoadmapProps {
  history: GameHistory[];
}

const Roadmap: React.FC<RoadmapProps> = ({ history }) => {
  // Generate Big Road Data
  const generateBigRoad = () => {
    if (history.length === 0) return [];
    const columns: { winner: ResultType; count: number }[][] = [[]];
    let currentCol = 0;
    let lastWinner: ResultType | null = null;

    history.forEach((h) => {
      // In Big Road, Ties usually don't break the column, they are marked on the last node.
      // But for simplicity in this visualization, we treat them as individual nodes if needed or skip.
      // Official Bac Bo Big Road: Ties are green slashes on the previous P/B circle.
      if (h.winner === 'TIE') {
        // Find last non-tie or just skip for this simple version
        return; 
      }

      if (!lastWinner || h.winner === lastWinner) {
        if (columns[currentCol].length < 6) {
          columns[currentCol].push({ winner: h.winner, count: 1 });
        } else {
          // Dragon tail logic: if column full, move to next
          currentCol++;
          columns[currentCol] = [{ winner: h.winner, count: 1 }];
        }
      } else {
        currentCol++;
        columns[currentCol] = [{ winner: h.winner, count: 1 }];
      }
      lastWinner = h.winner;
    });

    return columns;
  };

  const bigRoad = generateBigRoad();

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-4">
      <div className="flex gap-4 items-stretch h-48">
        {/* Bead Plate */}
        <div className="glass-panel rounded-2xl p-4 flex-1 flex flex-col min-w-0">
          <p className="text-[9px] uppercase tracking-[0.3em] text-gold/40 mb-3 font-black">Bead Plate</p>
          <div className="flex-1 overflow-hidden">
            <div className="grid grid-rows-6 grid-flow-col gap-1.5 h-full">
              {Array.from({ length: 66 }).map((_, i) => {
                const h = history[i];
                return (
                  <div
                    key={i}
                    className={cn(
                      "w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-black transition-all",
                      !h ? "bg-white/5 border border-white/5" : 
                      h.winner === 'PLAYER' ? "bead-blue shadow-[0_0_10px_rgba(59,130,246,0.3)]" : 
                      h.winner === 'BANKER' ? "bead-red shadow-[0_0_10px_rgba(239,68,68,0.3)]" : 
                      "bead-gold"
                    )}
                  >
                    {h?.winner === 'PLAYER' ? 'P' : h?.winner === 'BANKER' ? 'B' : h?.winner === 'TIE' ? 'T' : ''}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Big Road */}
        <div className="glass-panel rounded-2xl p-4 w-[60%] flex flex-col min-w-0">
          <p className="text-[9px] uppercase tracking-[0.3em] text-gold/40 mb-3 font-black">Big Road</p>
          <div className="flex-1 overflow-x-auto no-scrollbar">
            <div className="grid grid-rows-6 grid-flow-col gap-1 h-full min-w-full">
               {Array.from({ length: 40 }).map((_, colIdx) => {
                 const col = bigRoad[colIdx] || [];
                 return Array.from({ length: 6 }).map((_, rowIdx) => {
                   const cell = col[rowIdx];
                   return (
                     <div key={`${colIdx}-${rowIdx}`} className="w-4 h-4 rounded-full flex items-center justify-center border border-white/5 relative">
                       {cell && (
                         <div className={cn(
                           "w-3 h-3 rounded-full border-2",
                           cell.winner === 'PLAYER' ? "border-blue-500 bg-transparent" : "border-red-500 bg-transparent"
                         )} />
                       )}
                     </div>
                   );
                 });
               })}
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="glass-panel rounded-2xl p-4 w-48 flex flex-col justify-between">
           <div>
             <p className="text-[9px] uppercase tracking-[0.3em] text-gold/40 mb-3 font-black">Estatísticas</p>
             <div className="space-y-3">
               <div className="flex justify-between items-center">
                 <div className="w-2 h-2 rounded-full bg-blue-500" />
                 <span className="text-[10px] font-bold text-white/60">PLAYER</span>
                 <span className="text-[10px] font-black text-blue-400">
                   {history.filter(h => h.winner === 'PLAYER').length}
                 </span>
               </div>
               <div className="flex justify-between items-center">
                 <div className="w-2 h-2 rounded-full bg-red-500" />
                 <span className="text-[10px] font-bold text-white/60">BANKER</span>
                 <span className="text-[10px] font-black text-red-400">
                   {history.filter(h => h.winner === 'BANKER').length}
                 </span>
               </div>
               <div className="flex justify-between items-center">
                 <div className="w-2 h-2 rounded-full bg-gold" />
                 <span className="text-[10px] font-bold text-white/60">TIE</span>
                 <span className="text-[10px] font-black text-gold">
                   {history.filter(h => h.winner === 'TIE').length}
                 </span>
               </div>
             </div>
           </div>
           <div className="pt-3 border-t border-white/5 text-center">
             <span className="text-[10px] font-black text-white/20 tracking-widest italic">ROUNDS: {history.length}</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;

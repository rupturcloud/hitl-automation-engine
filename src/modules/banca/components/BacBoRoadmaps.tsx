import React from 'react';
import { ResultType, GameHistory } from '../../../types';

interface RoadmapProps {
  history: GameHistory[];
}

export const BeadPlate: React.FC<RoadmapProps> = ({ history }) => {
  // Grid 6x10 para o Bead Plate
  const rows = 6;
  const cols = 15;
  const grid = Array(rows * cols).fill(null);

  // Preenche de cima para baixo, esquerda para direita
  const reversedHistory = [...history].reverse();
  reversedHistory.forEach((item, index) => {
    if (index < grid.length) {
      grid[index] = item.winner;
    }
  });

  return (
    <div className="bg-black/40 backdrop-blur-md rounded-xl p-2 border border-white/5 overflow-hidden">
      <div 
        className="grid grid-flow-col gap-1"
        style={{ 
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` 
        }}
      >
        {grid.map((winner, i) => (
          <div key={i} className="w-4 h-4 rounded-full bg-white/5 flex items-center justify-center text-[8px] font-black">
            {winner === 'PLAYER' && <div className="w-full h-full rounded-full bg-blue-600 flex items-center justify-center text-white">P</div>}
            {winner === 'BANKER' && <div className="w-full h-full rounded-full bg-red-600 flex items-center justify-center text-white">B</div>}
            {winner === 'TIE' && <div className="w-full h-full rounded-full bg-emerald-500 flex items-center justify-center text-white">T</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export const BigRoad: React.FC<RoadmapProps> = ({ history }) => {
  // Lógica simplificada do Big Road (círculos vazios)
  const rows = 6;
  const cols = 20;
  
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-2 border border-white/5 overflow-hidden">
       <div 
        className="grid grid-flow-col gap-0.5"
        style={{ 
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` 
        }}
      >
        {Array(rows * cols).fill(null).map((_, i) => (
          <div key={i} className="w-3 h-3 border border-white/5 flex items-center justify-center">
            {/* Simulação de Big Road */}
            {i % 7 === 0 && <div className="w-2 h-2 rounded-full border-2 border-blue-500" />}
            {i % 11 === 0 && <div className="w-2 h-2 rounded-full border-2 border-red-500" />}
          </div>
        ))}
      </div>
    </div>
  );
};

import React, { useEffect, useState } from "react";
import { cn } from "../types";

type RoadResult = "P" | "B" | "T";

type HistoryItemType = {
  result: RoadResult;
  timestamp: number;
};

type MockSource = {
  sourceName: string;
  online: boolean;
  synced: boolean;
  countdown: number;
  balance: number;
  totalBet: number;
  dice: {
    player: [number, number];
    banker: [number, number];
  };
  score: {
    player: number;
    tie: number;
    banker: number;
    playerPct: number;
    tiePct: number;
    bankerPct: number;
  };
  history: HistoryItemType[];
};

function HistoryDot({ result }: { result: RoadResult; key?: string }) {
  const styles = {
    P: "border-blue-500/50 text-blue-400 bg-blue-500/10",
    B: "border-red-500/50 text-red-400 bg-red-500/10",
    T: "border-gold text-gold bg-gold/10",
  };

  return (
    <div className={cn("flex h-5 w-5 items-center justify-center rounded-full border text-[9px] font-black shadow-lg", styles[result])}>
      {result}
    </div>
  );
}

function SmallDie({ value, color }: { value: number; color: 'blue' | 'red' }) {
  const dots = Array(value).fill(0);
  const colorStyles = color === 'blue' ? 'bg-blue-600 border-blue-400 text-white' : 'bg-red-600 border-red-400 text-white';
  
  return (
    <div className={cn("w-10 h-10 rounded-lg border-2 flex items-center justify-center font-black text-lg shadow-xl", colorStyles)}>
      {value}
    </div>
  );
}

function MockBetAiBank({ source, blocked }: { source: MockSource; blocked: boolean }) {
  const road = source.history.slice(0, 56);

  return (
    <div className="relative overflow-hidden rounded-[2.4rem] border border-white/5 bg-[#050505] shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/5 bg-black/40 px-6 py-4 text-xs font-bold uppercase tracking-widest">
        <div className="flex items-center gap-3">
          <div className={cn("h-2 w-2 rounded-full", source.online ? "bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.8)]" : "bg-red-500")} />
          <span className="text-white/40">{source.sourceName} • TELEMETRIA DE DADOS AO VIVO</span>
        </div>
        <div className="rounded-full bg-gold/10 px-4 py-1.5 text-gold border border-gold/20 animate-pulse">
          {source.online && source.synced ? "SINAL SINCRONIZADO" : "AGUARDANDO SINAL"}
        </div>
      </div>

      <div className="relative aspect-[16/9] bg-[radial-gradient(circle_at_50%_0%,_#1a2a1f_0%,_#050505_100%)]">
        {/* Background Visuals */}
        <div className="absolute inset-0 flex items-center justify-around px-16 pointer-events-none opacity-20">
           <div className="flex flex-col items-center gap-8">
              <div className="editorial-title text-8xl italic text-blue-500/20 tracking-tighter">PLAYER</div>
              <div className="flex gap-4">
                 <SmallDie value={source.dice.player[0]} color="blue" />
                 <SmallDie value={source.dice.player[1]} color="blue" />
              </div>
           </div>
           <div className="flex flex-col items-center gap-8">
              <div className="editorial-title text-8xl italic text-red-500/20 tracking-tighter">BANKER</div>
              <div className="flex gap-4">
                 <SmallDie value={source.dice.banker[0]} color="red" />
                 <SmallDie value={source.dice.banker[1]} color="red" />
              </div>
           </div>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] select-none whitespace-nowrap">
          <span className="editorial-title text-[15vw] leading-none text-white italic tracking-tighter font-black uppercase">BACBO DATA</span>
        </div>

        {/* Real-time Dice Feed */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-12">
            <div className="flex flex-col items-center gap-4">
               <div className="flex gap-4">
                  <div className="animate-bounce" style={{ animationDelay: '0ms' }}>
                    <SmallDie value={source.dice.player[0]} color="blue" />
                  </div>
                  <div className="animate-bounce" style={{ animationDelay: '150ms' }}>
                    <SmallDie value={source.dice.player[1]} color="blue" />
                  </div>
               </div>
               <div className="text-3xl font-black text-blue-400 drop-shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                  TOTAL: {source.dice.player[0] + source.dice.player[1]}
               </div>
            </div>

            <div className="h-24 w-px bg-white/10" />

            <div className="flex flex-col items-center gap-4">
               <div className="flex gap-4">
                  <div className="animate-bounce" style={{ animationDelay: '300ms' }}>
                    <SmallDie value={source.dice.banker[0]} color="red" />
                  </div>
                  <div className="animate-bounce" style={{ animationDelay: '450ms' }}>
                    <SmallDie value={source.dice.banker[1]} color="red" />
                  </div>
               </div>
               <div className="text-3xl font-black text-red-400 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                  TOTAL: {source.dice.banker[0] + source.dice.banker[1]}
               </div>
            </div>
        </div>

        <div className="absolute inset-x-0 bottom-12 flex items-end justify-between px-12">
          <div className="glass-panel p-4 rounded-xl shadow-xl w-64 border-white/5">
             <div className="text-[8px] font-black text-white/30 tracking-[0.2em] mb-4 uppercase">Tendência Global</div>
             <div className="grid grid-cols-10 gap-1.5">
               {road.map((item, idx) => (
                 <HistoryDot key={`${item.timestamp}-${idx}`} result={item.result} />
               ))}
             </div>
          </div>

          <div className="relative glass-panel rounded-full p-1 w-72 h-14 border-gold/20 flex items-center justify-between px-8">
             <div className="text-xl font-black text-blue-400">{source.score.player} <span className="text-[10px] text-white/40 font-bold ml-1">P</span></div>
             <div className="text-xl font-black text-gold">{source.score.tie} <span className="text-[10px] text-white/40 font-bold ml-1">T</span></div>
             <div className="text-xl font-black text-red-400">{source.score.banker} <span className="text-[10px] text-white/40 font-bold ml-1">B</span></div>
          </div>

          <div className="glass-panel p-4 rounded-xl shadow-xl w-64 border-white/5">
            <div className="flex justify-between items-center text-[10px] font-black mb-3">
              <span className="text-blue-400">{source.score.playerPct}%</span>
              <span className="text-gold">{source.score.tiePct}%</span>
              <span className="text-red-400">{source.score.bankerPct}%</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden flex">
              <div className="h-full bg-blue-500" style={{ width: `${source.score.playerPct}%` }} />
              <div className="h-full bg-gold" style={{ width: `${source.score.tiePct}%` }} />
              <div className="h-full bg-red-500" style={{ width: `${source.score.bankerPct}%` }} />
            </div>
          </div>
        </div>

        {/* Status Panels */}
        <div className="absolute top-8 left-8 flex gap-4">
          <div className="glass-panel px-6 py-2 rounded-full border-gold/10">
            <div className="text-[8px] font-black tracking-widest text-white/30 uppercase mb-1">Saldo Telemetria</div>
            <div className="text-xl font-black text-gold">R$ {source.balance.toFixed(2)}</div>
          </div>
          <div className="glass-panel px-6 py-2 rounded-full border-white/5">
            <div className="text-[8px] font-black tracking-widest text-white/30 uppercase mb-1">Mão Atual</div>
            <div className="text-xl font-black text-white/60">LVL {source.history.length}</div>
          </div>
        </div>

        <div className="absolute right-8 top-8 rounded-full glass-panel border-gold/20 px-6 py-2 text-sm font-black text-gold tracking-widest flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
          {source.countdown}S
        </div>

        {blocked && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-md">
            <div className="glass-panel border-red-500/20 px-12 py-10 text-center shadow-2xl">
              <div className="text-6xl mb-6">⚠️</div>
              <div className="editorial-title italic text-4xl text-red-400 mb-4 tracking-tighter">Conexão Perdida</div>
              <div className="text-sm font-bold tracking-widest text-white/40 uppercase opacity-60">Sincronizando com a mesa da Bet A.I. Gamming...</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function createInitialMockSource(): MockSource {
  const seed: RoadResult[] = ["P", "B", "P", "P", "B", "T", "B", "P", "B", "P", "T", "B", "P", "P", "B", "B", "P", "T", "P", "B", "P", "B", "T", "P", "B", "P", "P", "B"];
  const history = seed.map((result, index) => ({ result, timestamp: Date.now() - index * 1000 })).reverse();
  return {
    sourceName: "Bet A.I.",
    online: true,
    synced: true,
    countdown: 44,
    balance: 1250.75,
    totalBet: 0,
    dice: {
        player: [3, 4],
        banker: [1, 2]
    },
    score: { player: 12, tie: 2, banker: 14, playerPct: 45, tiePct: 10, bankerPct: 45 },
    history,
  };
}

export default function BacBoMiniplayerDashboard() {
  const [mockSource, setMockSource] = useState<MockSource>(createInitialMockSource);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setMockSource((prev) => {
        const nextCountdown = prev.countdown <= 0 ? 44 : prev.countdown - 1;
        let nextHistory = prev.history;
        let nextScore = prev.score;
        let nextDice = prev.dice;

        if (prev.online && prev.synced && nextCountdown === 44) {
          const results: RoadResult[] = ["P", "B", "T"];
          const nextResult = results[Math.floor(Math.random() * results.length)];
          
          // Generate new dice
          const d1 = Math.floor(Math.random() * 6) + 1;
          const d2 = Math.floor(Math.random() * 6) + 1;
          const d3 = Math.floor(Math.random() * 6) + 1;
          const d4 = Math.floor(Math.random() * 6) + 1;
          nextDice = { player: [d1, d2], banker: [d3, d4] };

          nextHistory = [{ result: nextResult, timestamp: Date.now() }, ...prev.history].slice(0, 80);
          const player = nextHistory.filter((item) => item.result === "P").length;
          const tie = nextHistory.filter((item) => item.result === "T").length;
          const banker = nextHistory.filter((item) => item.result === "B").length;
          const total = Math.max(1, player + tie + banker);
          const playerPct = Math.round((player / total) * 100);
          const tiePct = Math.round((tie / total) * 100);
          nextScore = { player, tie, banker, playerPct, tiePct, bankerPct: Math.max(0, 100 - playerPct - tiePct) };
        }

        return { 
            ...prev, 
            countdown: nextCountdown, 
            history: nextHistory, 
            score: nextScore,
            dice: nextDice
        };
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="w-full space-y-8">
      <div className="flex flex-col gap-2 mb-4">
          <h2 className="editorial-title text-4xl text-gold">Strategic Telemetry Dashboard</h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Monitoramento Raw de Fluxo e Análise de Dados</p>
      </div>
      <MockBetAiBank source={mockSource} blocked={!mockSource.online} />
    </div>
  );
}

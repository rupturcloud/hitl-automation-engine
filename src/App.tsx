import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Info } from 'lucide-react';
import Dice from './components/Dice';
import BettingTable from './components/BettingTable';
import Roadmap from './components/HistoryRoadmap';
import Dealer, { PROFESSIONALS, Professional } from './components/Dealer';
import MiniplayerDashboard from './components/MiniplayerDashboard';
import { MiniplayerView, BacBoMiniplayer, MiniplayerState, BetTarget, RoadResult } from './components/MiniplayerView';
import { ResultType, DiceResult, GameHistory, BetType, PAYOUTS, cn } from './types';

type GameStatus = 'BETTING' | 'ROLLING' | 'RESULT';
type ViewMode = 'STUDIO' | 'TELEMETRY';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('STUDIO');
  const [showMiniplayer, setShowMiniplayer] = useState(true);
  const [isBankActive, setIsBankActive] = useState(true);
  const [currentProfessional, setCurrentProfessional] = useState<Professional>(PROFESSIONALS[0]);
  const [balance, setBalance] = useState(1000);
  const [currentBets, setCurrentBets] = useState<{ [key in BetType]: number }>({
    PLAYER: 0,
    BANKER: 0,
    TIE: 0,
  });
  const [dice, setDice] = useState<DiceResult>({ p1: 1, p2: 1, b1: 1, b2: 1 });
  const [status, setStatus] = useState<GameStatus>('BETTING');
  const [history, setHistory] = useState<GameHistory[]>([]);
  const [lastWinner, setLastWinner] = useState<ResultType | null>(null);
  const [message, setMessage] = useState("PLACE YOUR BETS");
  const [timer, setTimer] = useState(15);

  // Cursors & Miniplayer Refs
  const miniInstanceRef = useRef<BacBoMiniplayer | null>(null);
  const miniBoardRef = useRef<HTMLDivElement | null>(null);
  const miniSelectedChipRef = useRef<HTMLDivElement | null>(null);
  const miniPlayerRef = useRef<HTMLDivElement | null>(null);
  const miniTieRef = useRef<HTMLDivElement | null>(null);
  const miniBankerRef = useRef<HTMLDivElement | null>(null);
  const miniAnimFrameRef = useRef<number | null>(null);

  const [miniState, setMiniState] = useState<MiniplayerState>({
    history: [],
    stats: { player: 0, banker: 0, tie: 0, balance: 1000, totalBet: 0 },
    connection: { online: true, synced: true, sourceName: "Bet A.I. Gamming", lastSyncAt: Date.now() },
    visionSync: { 
      active: true, 
      integrityScore: 100, 
      lastCaptureAt: Date.now(),
      visualTruth: { statusText: "Aguardando Prime... ", detectedCards: [] },
      logs: []
    },
    betStacks: { player: [], tie: [], banker: [] },
    selectedChip: 5,
    multiplier: 1,
    countdown: 0,
    fullBetWindow: 15,
    activityPhase: 'WAIT',
    confidence: 0,
    pendingAutoBet: null,
    lastAnimation: null,
    isMinimized: false,
    isClosed: false,
    isPinned: false,
    position: { x: 200, y: 150 },
    percentages: { player: 0, tie: 0, banker: 0 },
  });
  
  const [myCursor, setMyCursor] = useState({ x: 24, y: 24 });
  const [robotCursor, setRobotCursor] = useState({ x: 90, y: 250 });
  const [trail, setTrail] = useState<{ x: number; y: number }[]>([]);

  // Main Betting Actions
  const placeBet = useCallback((type: BetType) => {
    if (!isBankActive) return;
    const amount = 10;
    if (balance < amount) {
      setMessage("NOT ENOUGH BALANCE");
      return;
    }
    setBalance(b => b - amount);
    setCurrentBets(prev => ({ ...prev, [type]: prev[type] + amount }));
    setMessage("BETS ACCEPTED");
    miniInstanceRef.current?.addLog(`Aposta manual detectada: ${type} - R$ ${amount}`);
  }, [isBankActive, balance]);

  // Sync Main Board state to Miniplayer
  useEffect(() => {
    if (miniInstanceRef.current) {
      miniInstanceRef.current.syncFromSource({
        balance: balance,
        history: history.map(h => (h.winner === 'PLAYER' ? 'P' : h.winner === 'BANKER' ? 'B' : 'T') as RoadResult),
        countdown: timer,
        stats: {
          player: currentBets.PLAYER,
          tie: currentBets.TIE,
          banker: currentBets.BANKER
        }
      });
    }
  }, [balance, history, timer, currentBets]);

  const clearBetsMain = useCallback(() => {
    if (status !== 'BETTING' || !isBankActive) return;
    const totalBet = Object.values(currentBets).reduce((a: number, b: number) => a + Number(b), 0);
    setBalance(b => b + totalBet);
    setCurrentBets({ PLAYER: 0, BANKER: 0, TIE: 0 });
    setMessage("BETS CLEARED");
  }, [status, isBankActive, currentBets]);

  // Stable Actions Ref to avoid recreating the Miniplayer instance
  const actionsRef = useRef({ placeBet, miniInstanceRef });
  actionsRef.current = { placeBet, miniInstanceRef };

  // Miniplayer Action Bridge
  const miniActions = useMemo(() => ({
    selectChip: (amount: number) => miniInstanceRef.current?.selectChip(amount),
    placeBetFromSelection: (target: BetTarget, isAuto = false) => {
      // Find targets on main board for robot animation
      const boardElement = document.querySelector(`[data-bet-target="${target.toUpperCase()}"]`);
      const tEl = target === "player" ? miniPlayerRef.current : target === "banker" ? miniBankerRef.current : miniTieRef.current;
      
      if (!isAuto) {
        const betType = target.toUpperCase() as BetType;
        actionsRef.current.placeBet(betType);
      }

      // Robot Animation Logic
      if (boardElement) {
        const rect = boardElement.getBoundingClientRect();
        const dest = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        
        // Start position could be current robot pos or miniplayer chip pos
        const start = robotCursor; 
        
        // Trigger the visual movement in the miniplayer as well
        miniInstanceRef.current?.placeBet(target, { 
          start: { x: robotCursor.x, y: robotCursor.y }, 
          end: dest, 
          target, 
          amount: 10, // Default for now
          startedAt: Date.now() 
        });
      } else {
        miniInstanceRef.current?.placeBet(target);
      }
    },
    increaseMultiplier: () => miniInstanceRef.current?.increaseMultiplier(),
    decreaseMultiplier: () => miniInstanceRef.current?.decreaseMultiplier(),
    undoLastBet: () => miniInstanceRef.current?.undoLastBet(),
    close: () => miniInstanceRef.current?.close(),
    reopen: () => miniInstanceRef.current?.reopen(),
    toggle: () => miniInstanceRef.current?.toggle(),
    togglePin: () => miniInstanceRef.current?.togglePin(),
    updatePosition: (x: number, y: number) => miniInstanceRef.current?.updatePosition(x, y),
    refreshSource: () => {
      if (miniInstanceRef.current) {
        miniInstanceRef.current.syncFromSource({ balance: miniInstanceRef.current.stats.balance + 0.5, online: true, synced: true });
      }
    },
    clearBets: () => miniInstanceRef.current?.clearBets(),
    cancelAutoBet: () => miniInstanceRef.current?.cancelAutoBet(),
  }), [robotCursor]);

  // Game Logic Functions
  const finishRound = useCallback((result: DiceResult) => {
    const pTotal = result.p1 + result.p2;
    const bTotal = result.b1 + result.b2;
    let winner: ResultType = 'TIE';
    if (pTotal > bTotal) winner = 'PLAYER';
    else if (bTotal > pTotal) winner = 'BANKER';

    setDice(result);
    setLastWinner(winner);
    setStatus('RESULT');

    const winnings = currentBets[winner] * PAYOUTS[winner];
      if (winnings > 0) {
        setBalance(b => b + winnings);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: winner === 'PLAYER' ? ['#2563eb'] : winner === 'BANKER' ? ['#dc2626'] : ['#16a34a']
        });
        setMessage(`YOU WON $${winnings}!`);
        miniInstanceRef.current?.addLog(`Vitória detectada! Pagamento: R$ ${winnings}`, "info");
      } else {
        setMessage(winner === 'TIE' ? "TIE! BETTER LUCK NEXT TIME" : `${winner} WINS!`);
        miniInstanceRef.current?.addLog(`Rodada finalizada: ${winner} venceu.`);
      }

    const roundHistory: GameHistory = {
      id: crypto.randomUUID(),
      playerTotal: pTotal,
      bankerTotal: bTotal,
      winner,
      timestamp: Date.now(),
    };
    const newHistory = [...history, roundHistory];
    setHistory(newHistory);

    if (newHistory.length % 5 === 0) {
      const nextIndex = (PROFESSIONALS.indexOf(currentProfessional) + 1) % PROFESSIONALS.length;
      setCurrentProfessional(PROFESSIONALS[nextIndex]);
      setMessage(`TROCA DE TURNO: ${PROFESSIONALS[nextIndex].name}`);
    }

    setTimeout(() => {
      setStatus('BETTING');
      setTimer(15);
      setCurrentBets({ PLAYER: 0, BANKER: 0, TIE: 0 });
      setLastWinner(null);
      if (newHistory.length % 5 !== 0) {
        setMessage("PLACE YOUR BETS");
      }
    }, 4000);
  }, [currentBets, history, currentProfessional]);

  const startRoll = useCallback(async () => {
    if (!isBankActive) return;
    const totalBet = Object.values(currentBets).reduce((a: number, b: number) => a + Number(b), 0);
    if (totalBet === 0) {
      setTimer(5);
      setMessage("PLEASE PLACE A BET");
      return;
    }

    setStatus('ROLLING');
    setMessage("ROLLING DICE...");

    const result: DiceResult = {
      p1: Math.floor(Math.random() * 6) + 1,
      p2: Math.floor(Math.random() * 6) + 1,
      b1: Math.floor(Math.random() * 6) + 1,
      b2: Math.floor(Math.random() * 6) + 1,
    };

    await new Promise(r => setTimeout(r, 800));
    setDice(prev => ({ ...prev, p1: result.p1 }));
    await new Promise(r => setTimeout(r, 600));
    setDice(prev => ({ ...prev, b1: result.b1 }));
    await new Promise(r => setTimeout(r, 600));
    setDice(prev => ({ ...prev, p2: result.p2 }));
    await new Promise(r => setTimeout(r, 600));
    setDice(prev => ({ ...prev, b2: result.b2 }));

    finishRound(result);
  }, [isBankActive, currentBets, finishRound]);

  // Effects
  useEffect(() => {
    // Visual Integrity Loop (FFmpeg/OCR Simulation)
    const visionInterval = setInterval(() => {
      const integrity = 98 + Math.random() * 2;
      const statuses = ["Analyzing Dice", "Verifying Table", "Syncing HUD", "OCR Verification"];
      const statusText = status === 'BETTING' ? statuses[Math.floor(Date.now() / 2000) % statuses.length] : "Waiting Round End";
      
      miniInstanceRef.current?.updateVisionSync({
        integrityScore: Math.floor(integrity),
        lastCaptureAt: Date.now(),
        statusText
      });
    }, 1500);

    return () => clearInterval(visionInterval);
  }, [status]);

  // Initializing the Miniplayer once
  useEffect(() => {
    if (miniInstanceRef.current) return;

    const inst = new BacBoMiniplayer({ 
      maxHistoryItems: 100,
      initialBalance: balance,
      onStateChange: (newState) => setMiniState(newState),
      onAutoBetTriggered: (target) => {
        if (miniInstanceRef.current && miniInstanceRef.current.visionSync.integrityScore < 95) {
          console.warn("[Vision Guard] Aposta bloqueada: Integridade visual insuficiente para execução.");
          miniInstanceRef.current?.addLog("Execução bloqueada: Integridade visual instável.", "error");
          return;
        }

        const betType = target.toUpperCase() as BetType;
        actionsRef.current.placeBet(betType);
        
        miniInstanceRef.current?.placeBet(target, undefined);
        miniInstanceRef.current?.addLog(`IA Robot executando entrada: ${target.toUpperCase()}`, "warn");
      }
    });

    miniInstanceRef.current = inst;
    inst.addLog("Sistema de Automação Inicializado.");
    return () => inst.destroy();
  }, []);

  useEffect(() => {
    if (status === 'BETTING' && timer === 5 && !miniState.pendingAutoBet) {
      const results: RoadResult[] = ['P', 'B'];
      const suggested = results[Math.floor(Math.random() * results.length)] === 'P' ? 'player' : 'banker';
      miniInstanceRef.current?.setPendingAutoBet(suggested as BetTarget, 4);
    } else if (status !== 'BETTING' && miniState.pendingAutoBet) {
      miniInstanceRef.current?.cancelAutoBet();
    }
  }, [timer, status, miniState.pendingAutoBet]);

  useEffect(() => {
    if (!miniState.lastAnimation) return;
    const { start, end } = miniState.lastAnimation;
    const control = { x: (start.x + end.x) / 2, y: Math.min(start.y, end.y) - 60 };
    const duration = 520;
    const startedAt = performance.now();

    const step = (now: number) => {
      const raw = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - raw, 3);
      const x = (1 - eased) * (1 - eased) * start.x + 2 * (1 - eased) * eased * control.x + eased * eased * end.x;
      const y = (1 - eased) * (1 - eased) * start.y + 2 * (1 - eased) * eased * control.y + eased * eased * end.y;
      setRobotCursor({ x, y });
      setTrail((prev) => [{ x, y }, ...prev].slice(0, 8));

      if (raw < 1) {
        miniAnimFrameRef.current = window.requestAnimationFrame(step);
      } else {
        setRobotCursor(prev => ({ ...prev }));
        window.setTimeout(() => setTrail([]), 120);
      }
    };

    if (miniAnimFrameRef.current != null) window.cancelAnimationFrame(miniAnimFrameRef.current);
    miniAnimFrameRef.current = window.requestAnimationFrame(step);
  }, [miniState.lastAnimation]);

  useEffect(() => {
    if (status !== 'BETTING' || !isBankActive) return;
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    } else {
      startRoll();
    }
  }, [status, timer, isBankActive, startRoll]);

  return (
    <div className={cn(
      "min-h-screen bg-[#050505] text-white flex flex-row items-stretch selection:bg-gold/30 font-sans relative overflow-hidden transition-all duration-500",
      miniState.uiMode === 'SIDEBAR' ? "pr-80 md:pr-96" : ""
    )}>
      <div className="fixed inset-0 opacity-20 pointer-events-none z-0 bg-[radial-gradient(circle_at_50%_50%,#1a1a1a_0%,transparent_100%)]" />
      
      <div className="flex-1 flex flex-col items-center relative z-10 w-full overflow-hidden">
        <header className="w-full p-6 flex justify-between items-center z-40 relative backdrop-blur-sm bg-black/20 border-b border-white/5">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <h1 className="editorial-title text-4xl text-gold-gradient leading-none mb-1">Bac Bo IA</h1>
            <span className="text-[9px] tracking-[0.4em] uppercase opacity-30 font-black">Live Premium Suite</span>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", isBankActive ? "bg-green-500 animate-pulse" : "bg-red-500")} />
            <span className="text-[10px] uppercase tracking-widest font-bold opacity-60">
              {isBankActive ? 'Transmissão Ativa' : 'Banca Offline'}
            </span>
          </div>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 flex bg-black/40 p-1 rounded-full border border-white/10 shadow-2xl">
          <button onClick={() => setViewMode('STUDIO')} className={cn("px-6 py-2 rounded-full text-[10px] font-black tracking-widest transition-all", viewMode === 'STUDIO' ? "bg-gold text-black shadow-lg" : "text-white/40 hover:text-white")}>STUDIO</button>
          <button onClick={() => setViewMode('TELEMETRY')} className={cn("px-6 py-2 rounded-full text-[10px] font-black tracking-widest transition-all", viewMode === 'TELEMETRY' ? "bg-gold text-black shadow-lg" : "text-white/40 hover:text-white")}>ROBÔ IA</button>
        </div>

        <div className="flex gap-8 items-center">
          <div className="text-right">
             <p className="text-[9px] uppercase tracking-widest opacity-30 mb-1 font-black">Seu Saldo</p>
             <p className="font-bold text-xl text-gold-gradient">R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
          <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
            <Info size={16} className="text-gold" />
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col pt-8 pb-12 px-8 gap-8 z-20" onMouseMove={(e) => { if (showMiniplayer) setMyCursor({ x: e.clientX, y: e.clientY }); }}>
        {viewMode === 'STUDIO' ? (
          <>
            <div className="flex-1 flex gap-8 items-center justify-center">
              <div className="flex-1 flex flex-col items-center bg-gradient-to-b from-red-950/20 to-transparent p-6 rounded-[3rem] border border-red-500/10 backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.5)]" />
                <div className="w-full flex justify-between items-center mb-10">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black tracking-widest text-red-500 mb-1 uppercase">Saldo Acumulado</span>
                    <span className="editorial-title text-5xl text-red-100 italic">Banker</span>
                  </div>
                  <div className="text-right">
                    <span className="text-4xl font-black text-white block">R$ {miniState.stats.balance.toFixed(0)}</span>
                    <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Total Robô</span>
                  </div>
                </div>
                <div className="relative mb-8">
                  <div className="grid grid-cols-2 gap-4 relative z-10 scale-110">
                    <Dice value={dice.b1} isRolling={status === 'ROLLING'} color="red" />
                    <Dice value={dice.b2} isRolling={status === 'ROLLING'} color="red" />
                  </div>
                </div>
                <div className="text-7xl font-black text-red-500/20 tabular-nums">{status === 'ROLLING' ? '??' : (dice.b1 + dice.b2).toString().padStart(2, '0')}</div>
              </div>

              <div className="relative z-30">
                <Dealer status={status} isBankActive={isBankActive} currentProfessional={currentProfessional} />
                {status === 'BETTING' && (
                  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-4 border-gold/20 flex items-center justify-center bg-black/60 shadow-2xl">
                    <span className={cn("text-3xl font-black tabular-nums", timer <= 5 ? "text-red-500 animate-pulse scale-125" : "text-gold")}>{timer}</span>
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col items-center bg-gradient-to-b from-blue-950/20 to-transparent p-6 rounded-[3rem] border border-blue-500/10 backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
                <div className="w-full flex justify-between items-center mb-10">
                  <div className="text-left">
                    <span className="text-4xl font-black text-white block">R$ {miniState.stats.totalBet.toFixed(0)}</span>
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Entradas IA</span>
                  </div>
                  <div className="flex flex-col items-end text-right">
                    <span className="text-[10px] font-black tracking-widest text-blue-500 mb-1 uppercase">Monitoramento</span>
                    <span className="editorial-title text-5xl text-blue-100 italic">Player</span>
                  </div>
                </div>
                <div className="relative mb-8">
                  <div className="grid grid-cols-2 gap-4 relative z-10 scale-110">
                    <Dice value={dice.p1} isRolling={status === 'ROLLING'} color="white" />
                    <Dice value={dice.p2} isRolling={status === 'ROLLING'} color="white" />
                  </div>
                </div>
                <div className="text-7xl font-black text-blue-500/20 tabular-nums">{status === 'ROLLING' ? '??' : (dice.p1 + dice.p2).toString().padStart(2, '0')}</div>
              </div>
            </div>

            <div className="h-12 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p key={message} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-gold text-sm font-black tracking-[0.5em] uppercase text-center">{message}</motion.p>
              </AnimatePresence>
            </div>

            <BettingTable onPlaceBet={placeBet} currentBets={currentBets} lastWinner={lastWinner} isActive={status === 'BETTING'} />

            <div className="flex justify-center gap-4 mt-4">
              <button onClick={clearBetsMain} disabled={status !== 'BETTING' || !isBankActive || Object.values(currentBets).every(v => v === 0)} className="px-8 py-3 rounded-xl glass-panel text-[10px] font-black tracking-widest uppercase hover:bg-white/5 transition-all text-white/40 hover:text-white border-white/5">Limpar Apostas</button>
              <button onClick={startRoll} disabled={status !== 'BETTING' || !isBankActive || Object.values(currentBets).every(v => v === 0)} className="px-12 py-3 rounded-xl bg-gold text-black text-[10px] font-black tracking-widest uppercase hover:brightness-110 transition-all shadow-[0_0_30px_rgba(197,160,89,0.3)] border border-white/20">Confirmar Aposta</button>
            </div>

            <Roadmap history={history} />
          </>
        ) : (
          <div className="w-full h-full"><MiniplayerDashboard /></div>
        )}
      </main>
      </div>

      {showMiniplayer && !miniState.isClosed && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            borderColor: miniState.activityPhase === 'EXECUTE' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(197, 160, 89, 0.1)',
            boxShadow: miniState.activityPhase === 'EXECUTE' 
              ? 'inset 0 0 150px rgba(239, 68, 68, 0.2)' 
              : 'inset 0 0 100px rgba(197, 160, 89, 0.1)'
          }}
          exit={{ opacity: 0 }}
          className={cn(
            "fixed inset-0 z-[90] pointer-events-auto backdrop-blur-[1px] border-[12px] transition-colors duration-500",
            miniState.activityPhase === 'EXECUTE' && "animate-pulse"
          )}
        >
          <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <div className={cn(
              "flex items-center gap-3 px-6 py-2 bg-black border rounded-full shadow-[0_0_30px_rgba(197,160,89,0.2)] transition-colors duration-500",
              miniState.activityPhase === 'EXECUTE' ? "border-red-500/50" : "border-gold/40"
            )}>
              <div className={cn(
                "w-2 h-2 rounded-full animate-pulse",
                miniState.activityPhase === 'EXECUTE' ? "bg-red-500" : "bg-gold"
              )} />
              <span className={cn(
                "text-[10px] font-black tracking-[0.3em] uppercase",
                miniState.activityPhase === 'EXECUTE' ? "text-red-500" : "text-gold"
              )}>
                {miniState.activityPhase === 'EXECUTE' ? "IA EXECUTION IN PROGRESS" : "Controle de Automação Ativo"}
              </span>
            </div>
            <p className="text-[8px] font-medium text-gold/40 tracking-wider">Intervenção bloqueada - Sistema assumido pela IA</p>
          </div>
        </motion.div>
      )}

      {showMiniplayer && (
        <>
          <MouseOverlay myCursor={myCursor} robotCursor={robotCursor} trail={trail} visible={true} />
          <MiniplayerView 
             state={miniState}
             actions={miniActions}
             boardRefs={{ boardRef: miniBoardRef, selectedChipRef: miniSelectedChipRef, playerRef: miniPlayerRef, tieRef: miniTieRef, bankerRef: miniBankerRef }}
             overlay={{ myCursor, robotCursor, trail, visible: true, handleMouseMove: (e: any) => { setMyCursor({ x: e.clientX, y: e.clientY }); } }}
          />
        </>
      )}
    </div>
  );
}

function MouseOverlay({ myCursor, robotCursor, trail, visible }: { myCursor: { x: number; y: number }; robotCursor: { x: number; y: number }; trail: { x: number; y: number }[]; visible: boolean; }) {
  if (!visible) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-[200] overflow-hidden">
      {trail.map((point, index) => (
        <div key={`${point.x}-${point.x}-${index}`} className="absolute rounded-full bg-gold/30 blur-[1px]" style={{ left: point.x - 6, top: point.y - 6, width: Math.max(3, 12 - index * 0.7), height: Math.max(3, 12 - index * 0.7), opacity: Math.max(0.08, 0.52 - index * 0.04) }} />
      ))}
      <div className="absolute transition-transform duration-75" style={{ transform: `translate(${myCursor.x}px, ${myCursor.y}px)` }}>
        <div className="rounded-full border border-blue-400 bg-black/80 px-2 py-0.5 text-[8px] font-black text-blue-400 uppercase tracking-widest whitespace-nowrap -translate-x-1/2 -translate-y-1/2">Eu</div>
      </div>
      <div className="absolute transition-transform duration-75" style={{ transform: `translate(${robotCursor.x}px, ${robotCursor.y}px)` }}>
        <div className="relative">
          <div className="rounded-full border border-gold bg-black/80 px-2 py-0.5 text-[8px] font-black text-gold uppercase tracking-widest whitespace-nowrap -translate-x-1/2 -translate-y-1/2 relative z-10">IA Robot</div>
          <motion.div key={`${robotCursor.x}-${robotCursor.y}`} initial={{ scale: 0.8, opacity: 0.8 }} animate={{ scale: 2.5, opacity: 0 }} className="absolute left-0 top-0 w-8 h-8 rounded-full border-2 border-gold -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
    </div>
  );
}

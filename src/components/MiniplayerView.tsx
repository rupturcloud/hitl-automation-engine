import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { X, Minus, Undo2, Plus, RotateCcw, RefreshCw, Pin, PinOff, Play, Square, Eye, Maximize2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "../types";

export type BetTarget = "player" | "tie" | "banker";
export type RoadResult = "P" | "B" | "T";

type HistoryItemType = {
  result: RoadResult;
  timestamp: number;
};

type BetItem = {
  amount: number;
  base: number;
  multiplier: number;
  timestamp: number;
};

export type UiMode = "FLOATING" | "SIDEBAR" | "MINI";

export type MiniplayerState = {
  uiMode: UiMode;
  history: HistoryItemType[];
  stats: {
    player: number;
    tie: number;
    banker: number;
    balance: number;
    totalBet: number;
  };
  connection: {
    online: boolean;
    synced: boolean;
    sourceName: string;
    lastSyncAt: number;
  };
  betStacks: {
    player: BetItem[];
    tie: BetItem[];
    banker: BetItem[];
  };
  selectedChip: number;
  multiplier: number;
  countdown: number;
  fullBetWindow: number;
  activityPhase: 'ANALYZE' | 'SELECT' | 'EXECUTE' | 'WAIT';
  confidence: number;
  pendingAutoBet: {
    target: BetTarget;
    secondsLeft: number;
    isActive: boolean;
  } | null;
  lastAnimation: null | {
    start: { x: number; y: number };
    end: { x: number; y: number };
    target: BetTarget;
    amount: number;
    startedAt: number;
  };
  isMinimized: boolean;
  isClosed: boolean;
  isPinned: boolean;
  position: { x: number; y: number };
  percentages: {
    player: number;
    tie: number;
    banker: number;
  };
  visionSync: {
    active: boolean;
    integrityScore: number;
    lastCaptureAt: number;
    visualTruth: {
      statusText: string;
      detectedCards: string[];
    };
    logs: { timestamp: string; message: string; type: "info" | "warn" | "error" }[];
  };
};

export class BacBoMiniplayer {
  maxHistoryItems: number;
  onStateChange: (state: MiniplayerState) => void;
  onAutoBetTriggered: (target: BetTarget) => void;
  history: HistoryItemType[];
  betStacks: { player: BetItem[]; tie: BetItem[]; banker: BetItem[] };
  selectedChip: number;
  multiplier: number;
  bankCountdown: number; // The actual source timer
  internalCountdown: number; // Phase-specific timer
  fullBetWindow: number; // Total window for current phase
  activityPhase: 'ANALYZE' | 'SELECT' | 'EXECUTE' | 'WAIT';
  confidence: number;
  pendingAutoBet: MiniplayerState["pendingAutoBet"];
  lastAnimation: MiniplayerState["lastAnimation"];
  stats: { player: number; tie: number; banker: number; balance: number };
  connection: MiniplayerState["connection"];
  visionSync: MiniplayerState["visionSync"];
  isMinimized: boolean;
  isClosed: boolean;
  isPinned: boolean;
  uiMode: UiMode;
  position: { x: number; y: number };
  updateTimer: number | null;
  smoothTimer: number | null;

  constructor(options: { 
    maxHistoryItems?: number; 
    initialBalance?: number;
    onStateChange?: (state: MiniplayerState) => void;
    onAutoBetTriggered?: (target: BetTarget) => void;
  } = {}) {
    this.maxHistoryItems = options.maxHistoryItems || 100;
    this.onStateChange = options.onStateChange || (() => {});
    this.onAutoBetTriggered = options.onAutoBetTriggered || (() => {});
    this.history = [];
    this.betStacks = { player: [], tie: [], banker: [] };
    this.selectedChip = 5;
    this.multiplier = 1;
    this.bankCountdown = 0;
    this.internalCountdown = 0;
    this.fullBetWindow = 15;
    this.activityPhase = 'WAIT';
    this.confidence = 0;
    this.pendingAutoBet = null;
    this.lastAnimation = null;
    this.stats = { player: 0, tie: 0, banker: 0, balance: options.initialBalance ?? 1000 };
    this.uiMode = "SIDEBAR"; // Defaulting to sidebar as requested
    this.connection = {
      online: true,
      synced: true,
      sourceName: "Bet A.I. Gamming",
      lastSyncAt: Date.now(),
    };
    this.visionSync = {
      active: true,
      integrityScore: 100,
      lastCaptureAt: Date.now(),
      visualTruth: {
        statusText: "Analyzing Table...",
        detectedCards: []
      },
      logs: []
    };
    this.isMinimized = false;
    this.isClosed = false;
    this.isPinned = false;
    this.position = { x: 200, y: 150 };
    this.updateTimer = null;
    this.smoothTimer = window.setInterval(() => this.tick(), 100);
    this.init();
  }

  tick() {
    if (this.internalCountdown > 0) {
      this.internalCountdown = Math.max(0, this.internalCountdown - 0.1);
      this.emit();
    }
  }

  init() {
    this.startUpdates();
    this.emit();
  }

  emit() {
    this.onStateChange(this.getState());
  }

  getTotals() {
    return {
      player: this.betStacks.player.reduce((sum, item) => sum + item.amount, 0),
      tie: this.betStacks.tie.reduce((sum, item) => sum + item.amount, 0),
      banker: this.betStacks.banker.reduce((sum, item) => sum + item.amount, 0),
    };
  }

  getPercentages() {
    const totals = this.getTotals();
    const total = totals.player + totals.tie + totals.banker;
    if (!total) return { player: 0, tie: 0, banker: 0 };

    const player = Math.round((totals.player / total) * 100);
    const tie = Math.round((totals.tie / total) * 100);
    const banker = Math.max(0, 100 - player - tie);
    return { player, tie, banker };
  }

  getState(): MiniplayerState {
    const totals = this.getTotals();
    return {
      history: [...this.history],
      stats: {
        player: totals.player,
        tie: totals.tie,
        banker: totals.banker,
        balance: this.stats.balance,
        totalBet: totals.player + totals.tie + totals.banker,
      },
      connection: { ...this.connection },
      betStacks: {
        player: [...this.betStacks.player],
        tie: [...this.betStacks.tie],
        banker: [...this.betStacks.banker],
      },
      selectedChip: this.selectedChip,
      multiplier: this.multiplier,
      countdown: this.internalCountdown,
      fullBetWindow: this.fullBetWindow,
      activityPhase: this.activityPhase,
      confidence: this.confidence,
      pendingAutoBet: this.pendingAutoBet ? { ...this.pendingAutoBet } : null,
      lastAnimation: this.lastAnimation,
      isMinimized: this.isMinimized,
      isClosed: this.isClosed,
      isPinned: this.isPinned,
      uiMode: this.uiMode,
      position: { ...this.position },
      percentages: this.getPercentages(),
      visionSync: { ...this.visionSync },
    };
  }

  selectChip(amount: number) {
    this.selectedChip = amount;
    this.emit();
  }

  increaseMultiplier() {
    this.multiplier = this.multiplier >= 10 ? 1 : this.multiplier + 1;
    this.emit();
  }

  decreaseMultiplier() {
    this.multiplier = this.multiplier <= 1 ? 10 : this.multiplier - 1;
    this.emit();
  }

  undoLastBet() {
    const keys: BetTarget[] = ["player", "tie", "banker"];
    let lastKey: BetTarget | null = null;
    let lastTime = -1;

    keys.forEach((key) => {
      const last = this.betStacks[key][this.betStacks[key].length - 1];
      if (last && last.timestamp > lastTime) {
        lastTime = last.timestamp;
        lastKey = key;
      }
    });

    if (!lastKey) return;
    const removed = this.betStacks[lastKey].pop();
    if (!removed) return;
    this.stats.balance += removed.amount;
    this.lastAnimation = null;
    this.emit();
  }

  placeBet(target: BetTarget, animation: MiniplayerState["lastAnimation"] = null) {
    if (!this.connection.online || !this.connection.synced) return;
    const amount = this.selectedChip * this.multiplier;
    if (this.stats.balance < amount) return;

    this.stats.balance -= amount;
    this.betStacks[target].push({
      amount,
      base: this.selectedChip,
      multiplier: this.multiplier,
      timestamp: Date.now(),
    });
    this.lastAnimation = animation
      ? { ...animation, target, amount, startedAt: Date.now() }
      : null;
    this.emit();
  }

  clearBets() {
    const refund = [...this.betStacks.player, ...this.betStacks.tie, ...this.betStacks.banker].reduce(
      (sum, bet) => sum + bet.amount,
      0
    );
    this.stats.balance += refund;
    this.betStacks = { player: [], tie: [], banker: [] };
    this.lastAnimation = null;
    this.emit();
  }

  close() {
    this.isClosed = true;
    this.stopUpdates();
    this.emit();
  }

  setUiMode(mode: UiMode) {
    this.uiMode = mode;
    this.emit();
  }

  reopen() {
    this.isClosed = false;
    this.startUpdates();
    this.emit();
  }

  togglePin() {
    this.isPinned = !this.isPinned;
    this.emit();
  }

  updatePosition(x: number, y: number) {
    if (this.isPinned) return;
    this.position = { x, y };
    this.emit();
  }

  addLog(message: string, type: "info" | "warn" | "error" = "info") {
    const timestamp = new Date().toLocaleTimeString('pt-BR', { hour12: false });
    this.visionSync.logs = [{ timestamp, message, type }, ...this.visionSync.logs.slice(0, 19)];
    this.emit();
  }

  syncFromSource(data: { balance?: number; history?: RoadResult[]; countdown?: number; stats?: { player: number; tie: number; banker: number } }) {
    if (data.balance !== undefined) this.stats.balance = data.balance;
    if (data.history !== undefined) {
      this.history = data.history.map((h, i) => ({ result: h, timestamp: Date.now() - (data.history!.length - i) * 60000 }));
    }
    
    if (data.countdown !== undefined) {
      const oldBankValue = this.bankCountdown;
      this.bankCountdown = data.countdown;
      
      // AI Window: Total 15s. 
      // Phases: 15-10 (ANALYZE), 10-5 (SELECT), 5-1 (EXECUTE), <1 (WAIT)
      
      if (this.bankCountdown > oldBankValue && this.bankCountdown >= 13) {
        this.activityPhase = 'ANALYZE';
        this.fullBetWindow = 5; 
        this.internalCountdown = 5;
        this.confidence = 0;
        this.addLog(`[AI Cycle] Novo ciclo iniciado. Janela de análise aberta.`);
        this.addLog(`[Vision] Capturando instantâneo da mesa... Verificando OCR.`, "info");
      } else if (this.bankCountdown <= 0) {
        this.activityPhase = 'WAIT';
        this.internalCountdown = 0;
        this.confidence = 0;
      } else {
        // Deterministic internal transitions based on Bank context but showing phase progress
        if (this.bankCountdown > 10) {
          this.activityPhase = 'ANALYZE';
          this.internalCountdown = this.bankCountdown - 10;
          this.fullBetWindow = 5;
          // Simulated increasing confidence
          this.confidence = Math.min(100, (1 - (this.internalCountdown / 5)) * 80 + Math.random() * 20);
        } else if (this.bankCountdown > 5) {
          if (this.activityPhase === 'ANALYZE') {
            this.addLog(`[AI Decision] Análise completa. Bloqueando decisão IA.`, "warn");
          }
          this.activityPhase = 'SELECT';
          this.internalCountdown = this.bankCountdown - 5;
          this.fullBetWindow = 5;
          this.confidence = 90 + Math.random() * 10;
        } else if (this.bankCountdown > 1) {
          if (this.activityPhase === 'SELECT') {
            this.addLog(`[AI Execution] Ponto de não-retorno. Executando disparadores.`, "error");
          }
          this.activityPhase = 'EXECUTE';
          this.internalCountdown = this.bankCountdown - 1;
          this.fullBetWindow = 4;
        } else {
          this.activityPhase = 'WAIT';
          this.internalCountdown = 0;
          this.confidence = 0;
        }
      }
    }

    if (data.stats !== undefined) {
      this.stats.player = data.stats.player;
      this.stats.tie = data.stats.tie;
      this.stats.banker = data.stats.banker;
    }
    this.emit();
  }

  updateVisionSync(updates: Partial<{ integrityScore: number; lastCaptureAt: number; statusText: string }>) {
    if (updates.integrityScore !== undefined) this.visionSync.integrityScore = updates.integrityScore;
    if (updates.lastCaptureAt !== undefined) this.visionSync.lastCaptureAt = updates.lastCaptureAt;
    if (updates.statusText !== undefined) {
      if (this.visionSync.visualTruth.statusText !== updates.statusText) {
        this.addLog(`[Vision] Status: ${updates.statusText}`);
      }
      this.visionSync.visualTruth.statusText = updates.statusText;
    }
    this.emit();
  }

  setPendingAutoBet(target: BetTarget | null, seconds: number = 5) {
    if (!target) {
      this.pendingAutoBet = null;
    } else {
      this.pendingAutoBet = { target, secondsLeft: seconds, isActive: true };
    }
    this.emit();
  }

  cancelAutoBet() {
    this.pendingAutoBet = null;
    this.emit();
  }

  startUpdates() {
    this.stopUpdates();
    this.updateTimer = window.setInterval(() => {
      if (this.pendingAutoBet && this.pendingAutoBet.isActive) {
        this.pendingAutoBet.secondsLeft -= 1;
        if (this.pendingAutoBet.secondsLeft <= 0) {
          const target = this.pendingAutoBet.target;
          this.pendingAutoBet = null;
          this.onAutoBetTriggered(target);
        }
      }
      this.emit();
    }, 1000);
  }

  stopUpdates() {
    if (this.updateTimer == null) return;
    window.clearInterval(this.updateTimer);
    this.updateTimer = null;
  }

  destroy() {
    this.stopUpdates();
    if (this.smoothTimer) clearInterval(this.smoothTimer);
  }
}

function HistoryDot({ result }: { result: RoadResult }) {
  const styles = {
    P: "border-blue-500/50 text-blue-400 bg-blue-500/10 shadow-[0_0_8px_rgba(59,130,246,0.2)]",
    B: "border-red-500/50 text-red-400 bg-red-500/10 shadow-[0_0_8px_rgba(239,68,68,0.2)]",
    T: "border-gold text-gold bg-gold/10 shadow-[0_0_8px_rgba(197,160,89,0.2)]",
  };

  return (
    <div className={cn("flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-black", styles[result])}>
      {result}
    </div>
  );
}

function CasinoChip({ amount, selected, onClick, small = false }: { amount: number; selected?: boolean; onClick?: () => void; small?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex items-center justify-center rounded-full transition-all flex-shrink-0 cursor-pointer overflow-hidden backdrop-blur-md",
        small ? "h-10 w-10" : "h-14 w-14",
        selected ? "scale-110 ring-4 ring-gold" : "hover:scale-105"
      )}
      style={{
        background: "radial-gradient(circle at 30% 30%, #f7d57a 0%, #d89a2d 36%, #b76b11 68%, #8f4707 100%)",
        boxShadow: selected
          ? "0 0 20px rgba(197, 160, 89, 0.5)"
          : "0 8px 18px rgba(0,0,0,.35)",
      }}
    >
      <div className="absolute inset-[4px] rounded-full border border-white/20" />
      <div className="absolute inset-[8px] rounded-full border border-black/10" />
      <span className={cn("relative z-10 font-black text-amber-950", small ? "text-[10px]" : "text-sm")}>{amount}</span>
    </button>
  );
}

function BetStack({ bets, positionClass }: { bets: BetItem[]; positionClass: string }) {
  if (!bets.length) return null;

  return (
    <div className={cn("pointer-events-none absolute bottom-4 z-50", positionClass)}>
      {bets.slice(-5).map((bet, idx) => (
        <div key={`${bet.timestamp}-${idx}`} className="absolute" style={{ bottom: idx * 5, left: idx * 2 }}>
          <CasinoChip amount={bet.amount} small />
        </div>
      ))}
    </div>
  );
}

function BettingBoard({
  state,
  actions,
  boardRefs,
}: {
  state: MiniplayerState;
  actions: { 
    placeBetFromSelection: (target: BetTarget) => void;
    cancelAutoBet: () => void;
  };
  boardRefs: {
    playerRef: React.RefObject<HTMLDivElement | null>;
    tieRef: React.RefObject<HTMLDivElement | null>;
    bankerRef: React.RefObject<HTMLDivElement | null>;
  };
}) {
  const playerActive = state.betStacks.player.length > 0;
  const tieActive = state.betStacks.tie.length > 0;
  const bankerActive = state.betStacks.banker.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex flex-col">
          <span className="text-[10px] font-black tracking-widest text-white/20 uppercase">Contagem Regressiva</span>
          {state.pendingAutoBet && (
            <span className="text-[10px] font-black tracking-widest text-gold animate-pulse uppercase">Auto-Aposta ativa</span>
          )}
        </div>
        <div className="rounded-full bg-gold/10 border border-gold/30 px-5 py-1 text-xl font-black text-gold shadow-lg tabular-nums transition-colors duration-300">
          {state.countdown}s
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[1.5rem] border border-white/5 bg-black p-1 shadow-2xl h-48 md:h-52">
        {/* Auto Bet Overlay */}
        <AnimatePresence>
          {state.pendingAutoBet && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm p-8"
            >
              <div className="text-center space-y-4">
                <div className="editorial-title italic text-2xl text-gold">Confirmando Aposta IA</div>
                <div className="text-sm font-black tracking-widest text-white/40 uppercase">
                  Alvo: <span className={cn(
                    "font-bold",
                    state.pendingAutoBet.target === 'player' ? 'text-blue-400' : 
                    state.pendingAutoBet.target === 'banker' ? 'text-red-400' : 'text-gold'
                  )}>{state.pendingAutoBet.target.toUpperCase()}</span>
                </div>
                <div className="relative h-16 w-16 mx-auto flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="text-white/10"
                    />
                    <motion.circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="text-gold"
                      strokeDasharray="175.9"
                      initial={{ strokeDashoffset: 0 }}
                      animate={{ strokeDashoffset: 175.9 * (1 - state.pendingAutoBet.secondsLeft / 5) }}
                      transition={{ duration: 1, ease: "linear" }}
                    />
                  </svg>
                  <span className="text-2xl font-black text-gold">{state.pendingAutoBet.secondsLeft}</span>
                </div>
                <Button variant="outline" size="sm" className="rounded-full border-red-500/50 text-red-400" onClick={actions.cancelAutoBet}>
                  Cancelar
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-3 h-full gap-1 overflow-hidden rounded-[2.2rem]">
          <div
            ref={boardRefs.playerRef}
            role="button"
            tabIndex={0}
            onClick={() => actions.placeBetFromSelection("player")}
            onKeyDown={(e) => e.key === 'Enter' && actions.placeBetFromSelection("player")}
            className={cn(
              "relative bg-player-evo flex flex-col justify-center items-center transition-all cursor-pointer border-r border-white/5 group",
              playerActive ? "ring-inset ring-2 ring-white/20 z-10" : "grayscale-[0.4] opacity-80"
            )}
          >
            <div className="text-[8px] font-black text-white/40 tracking-[0.2em] pointer-events-none mb-1">1:1</div>
            <div className="editorial-title italic text-xl md:text-2xl text-white tracking-widest pointer-events-none uppercase">P</div>
            <div className="text-lg font-black text-white/50 mt-1 pointer-events-none">{state.percentages.player}%</div>
            <BetStack bets={state.betStacks.player} positionClass="left-1/2 -translate-x-1/2" />
          </div>

          <div
            ref={boardRefs.tieRef}
            role="button"
            tabIndex={0}
            onClick={() => actions.placeBetFromSelection("tie")}
            onKeyDown={(e) => e.key === 'Enter' && actions.placeBetFromSelection("tie")}
            className={cn(
              "relative bg-tie-evo flex flex-col justify-center items-center transition-all cursor-pointer group",
              tieActive ? "ring-inset ring-2 ring-gold/40 z-10" : "grayscale-[0.4] opacity-90"
            )}
          >
            <div className="text-[8px] font-black text-gold/40 tracking-[0.2em] pointer-events-none mb-1">8:1</div>
            <div className="editorial-title italic text-xl md:text-2xl text-gold-gradient tracking-widest pointer-events-none uppercase">Tie</div>
            <div className="text-lg font-black text-gold/30 mt-1 pointer-events-none">{state.percentages.tie}%</div>
            <BetStack bets={state.betStacks.tie} positionClass="left-1/2 -translate-x-1/2" />
          </div>

          <div
            ref={boardRefs.bankerRef}
            role="button"
            tabIndex={0}
            onClick={() => actions.placeBetFromSelection("banker")}
            onKeyDown={(e) => e.key === 'Enter' && actions.placeBetFromSelection("banker")}
            className={cn(
              "relative bg-banker-evo flex flex-col justify-center items-center transition-all cursor-pointer border-l border-white/5 group",
              bankerActive ? "ring-inset ring-2 ring-white/20 z-10" : "grayscale-[0.4] opacity-80"
            )}
          >
            <div className="text-[8px] font-black text-white/40 tracking-[0.2em] pointer-events-none mb-1">1:1</div>
            <div className="editorial-title italic text-xl md:text-2xl text-white tracking-widest pointer-events-none uppercase">B</div>
            <div className="text-lg font-black text-white/50 mt-1 pointer-events-none">{state.percentages.banker}%</div>
            <BetStack bets={state.betStacks.banker} positionClass="left-1/2 -translate-x-1/2" />
          </div>
        </div>
      </div>
    </div>
  );
}

export const MiniplayerView = ({
  state,
  actions,
  boardRefs,
  overlay,
}: {
  state: MiniplayerState;
  actions: {
    reopen: () => void;
    toggle: () => void;
    close: () => void;
    undoLastBet: () => void;
    selectChip: (amount: number) => void;
    increaseMultiplier: () => void;
    decreaseMultiplier: () => void;
    clearBets: () => void;
    refreshSource: () => void;
    placeBetFromSelection: (target: BetTarget) => void;
    cancelAutoBet: () => void;
    togglePin: () => void;
    setUiMode: (mode: UiMode) => void;
    updatePosition: (x: number, y: number) => void;
  };
  boardRefs: {
    boardRef: React.RefObject<HTMLDivElement | null>;
    selectedChipRef: React.RefObject<HTMLDivElement | null>;
    playerRef: React.RefObject<HTMLDivElement | null>;
    tieRef: React.RefObject<HTMLDivElement | null>;
    bankerRef: React.RefObject<HTMLDivElement | null>;
  };
  overlay: {
    myCursor: { x: number; y: number };
    robotCursor: { x: number; y: number };
    trail: { x: number; y: number }[];
    visible: boolean;
    handleMouseMove: (e: any) => void;
  };
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const isMini = state.uiMode === "MINI";
  const isSidebar = state.uiMode === "SIDEBAR";
  const isFloating = state.uiMode === "FLOATING";

  const handleMouseDown = (e: React.MouseEvent) => {
    if (state.isPinned || !state.position) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - state.position.x,
      y: e.clientY - state.position.y,
    });
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging || state.isPinned) return;
      actions.updatePosition(e.clientX - dragOffset.x, e.clientY - dragOffset.y);
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleGlobalMouseMove);
      window.addEventListener("mouseup", handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging, dragOffset, actions, state.isPinned]);


  if (state.isClosed) {
    return (
      <div className="fixed bottom-10 right-10 z-[100]">
        <Button variant="primary" className="rounded-2xl shadow-2xl" onClick={actions.reopen}>Reabrir Miniplayer IA</Button>
      </div>
    );
  }
  const containerStyle: React.CSSProperties = isFloating 
    ? { left: `${state.position?.x || 200}px`, top: `${state.position?.y || 150}px` }
    : {};

  return (
    <div 
      className={cn(
        "z-[200] transition-all duration-500",
        isSidebar ? "fixed top-0 right-0 h-full w-80 md:w-96 shadow-2xl overflow-hidden" : 
        isFloating ? "fixed shadow-2xl" : 
        "fixed bottom-6 right-6 w-80 md:w-96 shadow-2xl"
      )}
      style={containerStyle}
      onMouseDown={(e) => {
        if (!isFloating || isMini) return;
        const target = e.target as HTMLElement;
        if (target.closest('button')) return;

        const startX = e.clientX - state.position.x;
        const startY = e.clientY - state.position.y;
        
        const move = (e: MouseEvent) => {
          actions.updatePosition(e.clientX - startX, e.clientY - startY);
        };
        const up = () => {
          document.removeEventListener("mousemove", move);
          document.removeEventListener("mouseup", up);
        };
        document.addEventListener("mousemove", move);
        document.addEventListener("mouseup", up);
      }}
    >
      <Card className={cn(
        "glass-panel border-gold/10 overflow-hidden flex flex-col h-full shadow-2xl",
        isSidebar ? "rounded-none rounded-l-[2rem] border-y-0 border-r-0" : "rounded-[2rem] border"
      )}>
        <CardHeader className={cn(
          "relative flex flex-row items-center justify-between p-4 md:p-6 pb-2 transition-all shrink-0",
          isMini ? "pb-4 h-24" : "border-b border-white/5"
        )}>
          {isMini ? (
            <div className="flex items-center gap-4 w-full">
              <div className="relative h-12 w-12 rounded-xl flex items-center justify-center shrink-0 overflow-hidden group">
                <div className="absolute inset-0 bg-gold/10 group-hover:bg-gold/20 transition-all" />
                <RotateCcw className={cn("h-6 w-6 text-gold transition-all", state.activityPhase === 'WAIT' ? 'opacity-20' : 'animate-spin-slow')} />
                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] border border-black" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black tracking-widest text-gold uppercase truncate">IA Robot Active</span>
                  <span className="text-[10px] font-mono text-white/40">{state.countdown.toFixed(0)}s</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative">
                  <motion.div 
                    className={cn(
                      "absolute inset-y-0 left-0 transition-colors duration-500",
                      state.activityPhase === 'EXECUTE' ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "bg-gold shadow-[0_0_8px_rgba(197,160,89,0.5)]"
                    )}
                    initial={false}
                    animate={{ width: `${(state.countdown / (state.fullBetWindow || 1)) * 100}%` }}
                    transition={{ duration: 1, ease: "linear" }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => actions.setUiMode("SIDEBAR")} className="h-9 w-9 rounded-full glass-panel border-white/10 text-white/40 flex items-center justify-center hover:bg-white/10 transition-all">
                  <Maximize2 className="h-4 w-4" />
                </button>
                <button onClick={() => actions.close()} className="h-9 w-9 rounded-full glass-panel border-red-500/40 text-red-500/60 flex items-center justify-center hover:bg-red-500/10 transition-all">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col">
                <CardTitle className="tracking-tighter !text-xl md:!text-2xl flex items-center gap-2">
                  {isSidebar && <Badge variant="outline" className="border-gold/30 text-gold bg-gold/10 text-[8px] tracking-[0.2em] px-2 py-0">SIDEBAR</Badge>}
                  Bac Bo IA Control
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <div className={cn(
                    "flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-widest",
                    state.visionSync.integrityScore > 90 ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-gold/10 border-gold/20 text-gold"
                  )}>
                    <Eye className="h-2.5 w-2.5" />
                    Truth: {state.visionSync.integrityScore}%
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-black/40 p-1 rounded-full border border-white/10 mr-2">
                   <button 
                    onClick={() => actions.setUiMode('SIDEBAR')} 
                    className={cn("w-7 h-7 rounded-sm flex items-center justify-center transition-all", isSidebar ? "bg-gold text-black" : "text-white/20 hover:text-white/40")}
                    title="Modo Lateral"
                   >
                     <Pin className="h-3 w-3" />
                   </button>
                   <button 
                    onClick={() => actions.setUiMode('FLOATING')} 
                    className={cn("w-7 h-7 rounded-sm flex items-center justify-center transition-all", isFloating ? "bg-gold text-black" : "text-white/20 hover:text-white/40")}
                    title="Modo Janela"
                   >
                     <Maximize2 className="h-3 w-3" />
                   </button>
                </div>

                <button onClick={() => actions.setUiMode("MINI")} className="w-8 h-8 rounded-full glass-panel hover:bg-white/10 flex items-center justify-center transition-colors">
                  <Minus className="h-4 w-4 text-white/40" />
                </button>
                <button onClick={() => actions.close()} className="w-8 h-8 rounded-full glass-panel border-red-500/20 hover:bg-red-500/10 flex items-center justify-center transition-colors">
                  <X className="h-4 w-4 text-red-500/60" />
                </button>
              </div>
            </>
          )}
        </CardHeader>

        {!isMini && (
          <CardContent className="space-y-5 p-5 md:p-6 overflow-y-auto custom-scrollbar flex-1 pb-10">
            {isSidebar && (
               <div className="flex items-center gap-3 bg-gold/5 p-4 rounded-2xl border border-gold/10 mb-2">
                  <div className="h-10 w-10 glass-panel rounded-lg flex items-center justify-center border-gold/20 relative overflow-hidden shrink-0">
                      <span className="text-xl font-black text-gold tabular-nums z-10">{state.countdown.toFixed(0)}</span>
                      <motion.div 
                        className="absolute bottom-0 left-0 right-0 bg-gold/20"
                        animate={{ height: `${(state.countdown / (state.fullBetWindow || 1)) * 100}%` }}
                      />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-black text-gold uppercase tracking-[0.2em] leading-none mb-1">AI Action Window</div>
                    <div className="text-[8px] text-white/40 font-bold uppercase truncate">{state.visionSync.visualTruth.statusText}</div>
                  </div>
                  <Badge className="bg-gold text-black font-black text-[9px]">{state.activityPhase}</Badge>
               </div>
            )}

            {!isSidebar && (
              <div className="flex flex-col items-end gap-1 absolute top-20 right-6 pointer-events-none">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end">
                      <span className={cn(
                        "text-[10px] font-black italic tracking-[0.2em] uppercase",
                        state.activityPhase === 'EXECUTE' ? "text-red-400" : state.activityPhase === 'SELECT' ? "text-gold" : "text-white/40"
                      )}>
                        {state.activityPhase} Phase
                      </span>
                    </div>
                    <div className="h-10 w-10 glass-panel rounded-lg flex items-center justify-center border-gold/20 relative overflow-hidden shadow-2xl">
                       <span className="text-xl font-black text-gold tabular-nums z-10">{state.countdown.toFixed(0)}</span>
                       <motion.div 
                          className="absolute bottom-0 left-0 right-0 bg-gold/10"
                          animate={{ height: `${(state.countdown / (state.fullBetWindow || 1)) * 100}%` }}
                       />
                    </div>
                  </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="glass-panel p-3 border-gold/10">
                <div className="text-[7px] font-black uppercase tracking-widest text-gold/20 mb-1">Saldo Acumulado</div>
                <div className="text-xl md:text-2xl font-black text-gold leading-none">R$ {state.stats.balance.toFixed(2)}</div>
              </div>
              <div className="glass-panel p-3 border-white/5">
                <div className="text-[7px] font-black uppercase tracking-widest text-white/20 mb-1">Entradas IA</div>
                <div className="text-xl md:text-2xl font-black text-white leading-none">R$ {state.stats.totalBet.toFixed(2)}</div>
              </div>
            </div>

            <div ref={boardRefs.boardRef} className="relative mt-1">
              <BettingBoard state={state} actions={actions} boardRefs={boardRefs} />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Fichas</span>
                <Badge variant="outline" className="border-gold/20 text-gold text-[9px] tracking-widest">
                  SELEÇÃO: {state.selectedChip} × {state.multiplier}
                </Badge>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-1 items-center">
                  <button type="button" onClick={actions.undoLastBet} className="h-10 w-10 flex items-center justify-center rounded-full glass-panel border-white/10 text-white/40 hover:text-white transition-all" title="Desfazer">
                    <Undo2 className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={actions.decreaseMultiplier} className="h-10 w-10 flex items-center justify-center rounded-full glass-panel border-gold/10 text-gold/40 hover:text-gold transition-all" title="Diminuir Multiplicador">
                    <Minus className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex-1 flex items-center justify-between gap-2 overflow-x-auto pb-2 scrollbar-hide py-1">
                  {[5, 10, 25, 50, 100].map((chip) => (
                    <div key={chip} ref={state.selectedChip === chip ? boardRefs.selectedChipRef : null}>
                      <CasinoChip amount={chip} selected={state.selectedChip === chip} onClick={() => actions.selectChip(chip)} />
                    </div>
                  ))}
                </div>

                <button type="button" onClick={actions.increaseMultiplier} className="flex-shrink-0 h-12 w-12 md:h-14 md:w-14 flex items-center justify-center rounded-full glass-panel border-gold/20 text-gold hover:text-white transition-all" title="Aumentar Multiplicador">
                  <Plus className="h-5 w-5 md:h-6 md:w-6" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Histórico Flow</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-full !text-[8px] md:!text-[9px]" onClick={actions.clearBets}>
                    Limpar
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-10 gap-2">
                {state.history.slice(0, 40).map((item, idx) => (
                  <div key={`${item.timestamp}-${idx}`} className="flex justify-center">
                    <HistoryDot result={item.result} />
                  </div>
                ))}
              </div>
            </div>

            {/* Automation Terminal (Debug Console) */}
            <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-gold/40 uppercase tracking-[0.3em] flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                  Automation Terminal
                </span>
                <Badge variant="outline" className="border-gold/10 text-gold/40 text-[7px] font-mono">
                  v2.4.0-debug
                </Badge>
              </div>
              <div className="h-24 overflow-y-auto bg-black/40 rounded-lg border border-white/5 p-2 font-mono text-[9px] space-y-1 custom-scrollbar">
                {state.visionSync.logs.length === 0 && (
                  <div className="text-white/10 italic">Initializing vision analysis engine...</div>
                )}
                {state.visionSync.logs.map((log, idx) => (
                  <div key={idx} className={cn(
                    "flex gap-2",
                    log.type === 'warn' ? "text-gold" : log.type === 'error' ? "text-red-400" : "text-white/40"
                  )}>
                    <span className="text-white/20 whitespace-nowrap">[{log.timestamp}]</span>
                    <span>{log.message}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Minus, RotateCcw, Undo2, Plus, RefreshCw } from "lucide-react";

type BetTarget = "player" | "tie" | "banker";
type RoadResult = "P" | "B" | "T";

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

type MockSource = {
  sourceName: string;
  online: boolean;
  synced: boolean;
  countdown: number;
  balance: number;
  totalBet: number;
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

type MiniplayerState = {
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
  lastAnimation: null | {
    start: { x: number; y: number };
    end: { x: number; y: number };
    target: BetTarget;
    amount: number;
    startedAt: number;
  };
  isMinimized: boolean;
  isClosed: boolean;
  percentages: {
    player: number;
    tie: number;
    banker: number;
  };
};

class BacBoMiniplayer {
  maxHistoryItems: number;
  onStateChange: (state: MiniplayerState) => void;
  history: HistoryItemType[];
  betStacks: { player: BetItem[]; tie: BetItem[]; banker: BetItem[] };
  selectedChip: number;
  multiplier: number;
  countdown: number;
  lastAnimation: MiniplayerState["lastAnimation"];
  stats: { balance: number };
  connection: MiniplayerState["connection"];
  isMinimized: boolean;
  isClosed: boolean;
  updateTimer: number | null;

  constructor(options: { maxHistoryItems?: number; onStateChange?: (state: MiniplayerState) => void } = {}) {
    this.maxHistoryItems = options.maxHistoryItems || 100;
    this.onStateChange = options.onStateChange || (() => {});
    this.history = [];
    this.betStacks = { player: [], tie: [], banker: [] };
    this.selectedChip = 5;
    this.multiplier = 1;
    this.countdown = 44;
    this.lastAnimation = null;
    this.stats = { balance: 1500.5 };
    this.connection = {
      online: true,
      synced: true,
      sourceName: "Bet Ai",
      lastSyncAt: Date.now(),
    };
    this.isMinimized = false;
    this.isClosed = false;
    this.updateTimer = null;
    this.init();
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
      countdown: this.countdown,
      lastAnimation: this.lastAnimation,
      isMinimized: this.isMinimized,
      isClosed: this.isClosed,
      percentages: this.getPercentages(),
    };
  }

  syncFromSource(payload: Partial<MockSource>) {
    if (typeof payload.balance === "number") this.stats.balance = payload.balance;
    if (typeof payload.countdown === "number") this.countdown = payload.countdown;
    if (Array.isArray(payload.history)) this.history = payload.history.slice(0, this.maxHistoryItems);
    if (typeof payload.online === "boolean") this.connection.online = payload.online;
    if (typeof payload.synced === "boolean") this.connection.synced = payload.synced;
    if (payload.sourceName) this.connection.sourceName = payload.sourceName;
    this.connection.lastSyncAt = Date.now();
    this.emit();
  }

  selectChip(amount: number) {
    this.selectedChip = amount;
    this.emit();
  }

  increaseMultiplier() {
    this.multiplier = this.multiplier >= 10 ? 1 : this.multiplier + 1;
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

  reopen() {
    this.isClosed = false;
    this.startUpdates();
    this.emit();
  }

  toggle() {
    this.isMinimized = !this.isMinimized;
    this.emit();
  }

  startUpdates() {
    this.stopUpdates();
    this.updateTimer = window.setInterval(() => {
      this.countdown = this.countdown <= 0 ? 44 : this.countdown - 1;
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
  }
}

function HistoryDot({ result }: { result: RoadResult }) {
  const styles = {
    P: "border-blue-500 text-blue-600",
    B: "border-red-500 text-red-600",
    T: "border-emerald-500 text-emerald-600",
  };

  return (
    <div className={`flex h-4 w-4 items-center justify-center rounded-full border bg-white text-[8px] font-bold ${styles[result]}`}>
      {result}
    </div>
  );
}

function CasinoChip({ amount, selected, onClick, small = false }: { amount: number; selected?: boolean; onClick?: () => void; small?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-center justify-center rounded-full transition-all ${small ? "h-10 w-10" : "h-14 w-14"} ${selected ? "scale-110 ring-4 ring-white/70" : "hover:scale-105"}`}
      style={{
        background: "radial-gradient(circle at 30% 30%, #f7d57a 0%, #d89a2d 36%, #b76b11 68%, #8f4707 100%)",
        boxShadow: selected
          ? "0 0 0 2px rgba(255,255,255,.8), 0 10px 22px rgba(0,0,0,.45)"
          : "0 8px 18px rgba(0,0,0,.35)",
      }}
    >
      <div className="absolute inset-[4px] rounded-full border border-[#ffe7a4]/70" />
      <div className="absolute inset-[8px] rounded-full border border-[#8e4f10]/60" />
      <span className={`relative z-10 font-black text-[#4f2200] ${small ? "text-[11px]" : "text-sm"}`}>{amount}</span>
    </button>
  );
}

function BetStack({ bets, positionClass }: { bets: BetItem[]; positionClass: string }) {
  if (!bets.length) return null;

  return (
    <div className={`pointer-events-none absolute bottom-4 ${positionClass}`}>
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
  actions: { placeBetFromSelection: (target: BetTarget) => void };
  boardRefs: {
    playerRef: React.RefObject<HTMLButtonElement | null>;
    tieRef: React.RefObject<HTMLButtonElement | null>;
    bankerRef: React.RefObject<HTMLButtonElement | null>;
  };
}) {
  const playerActive = state.betStacks.player.length > 0;
  const tieActive = state.betStacks.tie.length > 0;
  const bankerActive = state.betStacks.banker.length > 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-sm font-medium tracking-wide text-slate-200">Tempo da rodada</span>
        <div className="rounded-full bg-[#0b49b9] px-4 py-1 text-lg font-black text-white shadow-lg">{state.countdown}s</div>
      </div>

      <div className="relative overflow-hidden rounded-[2.2rem] border border-[#b28a3c]/50 bg-gradient-to-b from-[#c6a26a] via-[#aa8455] to-[#4b2f12] p-2 shadow-2xl">
        <div className="grid grid-cols-2 overflow-hidden rounded-[2rem]">
          <button
            ref={boardRefs.playerRef}
            type="button"
            onClick={() => actions.placeBetFromSelection("player")}
            className={`relative min-h-[182px] bg-gradient-to-b from-[#3e71db] via-[#0f3ca8] to-[#07256b] p-5 pr-16 text-white transition-all ${playerActive ? "shadow-[inset_0_0_0_2px_rgba(255,255,255,.18),0_0_28px_rgba(49,104,255,.42)] brightness-110" : ""}`}
          >
            <div className="text-right text-5xl font-black leading-none drop-shadow">{state.stats.player}</div>
            <div className="mt-10 text-center text-[1.55rem] font-black tracking-[0.14em] text-white/95">PLAYER</div>
            <div className="mt-2 text-center text-xl font-semibold opacity-90">{state.percentages.player}%</div>
            <div className="absolute bottom-8 left-8 text-xl font-black tracking-[0.08em]">1:1</div>
            <BetStack bets={state.betStacks.player} positionClass="left-8" />
          </button>

          <button
            ref={boardRefs.bankerRef}
            type="button"
            onClick={() => actions.placeBetFromSelection("banker")}
            className={`relative min-h-[182px] bg-gradient-to-b from-[#b64538] via-[#8f1610] to-[#5a0503] p-5 pl-16 text-white transition-all ${bankerActive ? "shadow-[inset_0_0_0_2px_rgba(255,255,255,.18),0_0_28px_rgba(181,43,32,.42)] brightness-110" : ""}`}
          >
            <div className="text-left text-5xl font-black leading-none drop-shadow">{state.stats.banker}</div>
            <div className="mt-10 text-center text-[1.55rem] font-black tracking-[0.14em] text-white/95">BANKER</div>
            <div className="mt-2 text-center text-xl font-semibold opacity-90">{state.percentages.banker}%</div>
            <div className="absolute bottom-8 right-8 text-xl font-black tracking-[0.08em]">1:1</div>
            <BetStack bets={state.betStacks.banker} positionClass="right-16" />
          </button>
        </div>

        <button
          ref={boardRefs.tieRef}
          type="button"
          onClick={() => actions.placeBetFromSelection("tie")}
          className={`absolute left-1/2 top-1/2 z-10 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-4 border-[#d8bd72] bg-gradient-to-b from-[#d7ae5a] via-[#bb8832] to-[#8c611f] text-white shadow-2xl transition-all ${tieActive ? "shadow-[0_0_0_2px_rgba(255,255,255,.18),0_0_28px_rgba(226,181,87,.38)] brightness-110" : ""}`}
        >
          <div className="text-sm font-black tracking-[0.25em] text-[#fff4cf]">TIE</div>
          <div className="mt-1 text-4xl font-black leading-none">{state.stats.tie}</div>
          <div className="mt-1 text-sm font-semibold">{state.percentages.tie}%</div>
          <div className="mt-3 text-[10px] leading-4 text-[#ffe7b3]">
            <div>TOTAL &nbsp;&nbsp; PAGAMENTO</div>
            <div>2, 12 .............. 88:1</div>
            <div>3, 11 .............. 25:1</div>
            <div>4, 10 .............. 10:1</div>
          </div>
          <div className="mt-2 text-[1.55rem] font-black tracking-[0.08em]">EMPATE</div>
          <BetStack bets={state.betStacks.tie} positionClass="left-1/2 -translate-x-1/2" />
        </button>
      </div>
    </div>
  );
}

function MouseOverlay({
  myCursor,
  robotCursor,
  trail,
  visible,
}: {
  myCursor: { x: number; y: number };
  robotCursor: { x: number; y: number };
  trail: { x: number; y: number }[];
  visible: boolean;
}) {
  if (!visible) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-[60] overflow-hidden rounded-[2rem]">
      {trail.map((point, index) => (
        <div
          key={`${point.x}-${point.y}-${index}`}
          className="absolute rounded-full bg-amber-300/35 blur-[1px]"
          style={{
            left: point.x - 6,
            top: point.y - 6,
            width: Math.max(3, 12 - index * 0.7),
            height: Math.max(3, 12 - index * 0.7),
            opacity: Math.max(0.08, 0.52 - index * 0.04),
          }}
        />
      ))}

      <div className="absolute transition-transform duration-75" style={{ transform: `translate(${myCursor.x}px, ${myCursor.y}px)` }}>
        <div className="rounded-full border border-cyan-300/50 bg-slate-950/90 px-2 py-0.5 text-[10px] font-bold text-cyan-200">Meu</div>
      </div>

      <div className="absolute transition-transform duration-75" style={{ transform: `translate(${robotCursor.x}px, ${robotCursor.y}px)` }}>
        <div className="rounded-full border border-amber-300/50 bg-slate-950/90 px-2 py-0.5 text-[10px] font-bold text-amber-200">Robo</div>
      </div>
    </div>
  );
}

function MockBetAiBank({ source, blocked }: { source: MockSource; blocked: boolean }) {
  const road = source.history.slice(0, 56);

  return (
    <div className="relative overflow-hidden rounded-[2.4rem] border border-[#2c2a24] bg-[#0a0c0f] shadow-2xl">
      <div className="flex items-center justify-between border-b border-[#23211b] bg-[#0b0f14] px-5 py-3 text-sm">
        <div className="flex items-center gap-3">
          <div className={`h-2.5 w-2.5 rounded-full ${source.online ? "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.8)]" : "bg-red-400 shadow-[0_0_12px_rgba(248,113,113,.8)]"}`} />
          <span className="font-semibold text-slate-200">{source.sourceName} • mesa simulada</span>
        </div>
        <div className="rounded-full bg-[#10161f] px-3 py-1 font-bold text-sky-300">
          {source.online && source.synced ? "ONLINE + SYNC" : "AGUARDANDO SINAL"}
        </div>
      </div>

      <div className="relative aspect-[16/9] bg-[radial-gradient(circle_at_50%_8%,rgba(38,133,93,.45),transparent_24%),linear-gradient(180deg,#0f2f1f_0%,#16140f_16%,#5d4524_38%,#9f7b4c_62%,#6d4f2a_100%)]">
        <div className="absolute inset-x-0 top-0 flex justify-center pt-8 text-[4.8rem] font-black tracking-[0.18em] text-white/82">
          <span className="mr-24">PLAYER</span>
          <span>BANKER</span>
        </div>

        <div className="absolute inset-x-0 top-[22%] flex items-center justify-center gap-24">
          <div className="h-28 w-28 rounded-full border-[6px] border-[#c39533] bg-[radial-gradient(circle_at_40%_38%,#d6b38f_0,#b48f6e_48%,#6f5338_100%)] shadow-[inset_0_0_24px_rgba(0,0,0,.35)]" />
          <div className="h-28 w-28 rounded-full border-[6px] border-[#c39533] bg-[radial-gradient(circle_at_40%_38%,#d6b38f_0,#b48f6e_48%,#6f5338_100%)] shadow-[inset_0_0_24px_rgba(0,0,0,.35)]" />
        </div>

        <div className="absolute inset-x-0 top-[40%] flex items-center justify-center gap-24">
          <div className="h-32 w-32 rounded-full border-[6px] border-[#c39533] bg-[radial-gradient(circle_at_40%_38%,#d6b38f_0,#b48f6e_48%,#6f5338_100%)] shadow-[inset_0_0_26px_rgba(0,0,0,.35)]" />
          <div className="h-32 w-32 rounded-full border-[6px] border-[#c39533] bg-[radial-gradient(circle_at_40%_38%,#d6b38f_0,#b48f6e_48%,#6f5338_100%)] shadow-[inset_0_0_26px_rgba(0,0,0,.35)]" />
        </div>

        <div className="absolute inset-x-0 bottom-16 flex items-end justify-between px-10">
          <div className="w-[26%] rounded-2xl border border-white/10 bg-white/85 p-2 shadow-xl">
            <div className="grid grid-cols-14 gap-1">
              {road.map((item, idx) => (
                <HistoryDot key={`${item.timestamp}-${idx}`} result={item.result} />
              ))}
            </div>
          </div>

          <div className="relative w-[31%] overflow-hidden rounded-[2rem] border border-[#7e5a2a] bg-black/15 shadow-2xl">
            <div className="grid grid-cols-2">
              <div className="relative min-h-[110px] bg-gradient-to-b from-[#3e71db] via-[#0f3ca8] to-[#07256b] p-4 text-white">
                <div className="text-4xl font-black">{source.score.player}</div>
                <div className="absolute bottom-3 left-4 text-xl font-black">JOGADOR</div>
              </div>
              <div className="relative min-h-[110px] bg-gradient-to-b from-[#b64538] via-[#8f1610] to-[#5a0503] p-4 text-right text-white">
                <div className="text-4xl font-black">{source.score.banker}</div>
                <div className="absolute bottom-3 right-4 text-xl font-black">BANCA</div>
              </div>
            </div>
            <div className="absolute left-1/2 top-1/2 z-10 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-4 border-[#d8bd72] bg-gradient-to-b from-[#d7ae5a] via-[#bb8832] to-[#8c611f] text-white">
              <div className="text-xs font-black">EMPATE</div>
              <div className="text-2xl font-black">{source.score.tie}</div>
            </div>
          </div>

          <div className="w-[26%] rounded-2xl border border-white/10 bg-white/85 p-2 shadow-xl">
            <div className="mb-2 flex items-center justify-between text-[11px] font-bold text-slate-700">
              <span>{source.score.playerPct}%</span>
              <span>{source.score.tiePct}%</span>
              <span>{source.score.bankerPct}%</span>
            </div>
            <div className="grid grid-cols-14 gap-1">
              {road.map((item, idx) => (
                <HistoryDot key={`${item.timestamp}-right-${idx}`} result={item.result} />
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 left-6 rounded-full border border-[#5e4825] bg-[#24180f]/95 px-5 py-2 text-[#f5cf75] shadow-lg">
          <div className="text-[10px] uppercase tracking-[0.18em] text-slate-300">Saldo</div>
          <div className="text-xl font-black">R$ {source.balance.toFixed(2)}</div>
        </div>

        <div className="absolute bottom-4 left-44 rounded-full border border-[#5e4825] bg-[#24180f]/95 px-5 py-2 text-[#f5cf75] shadow-lg">
          <div className="text-[10px] uppercase tracking-[0.18em] text-slate-300">Aposta total</div>
          <div className="text-xl font-black">R$ {source.totalBet.toFixed(2)}</div>
        </div>

        <div className="absolute right-8 top-5 flex items-center gap-2 rounded-full bg-black/45 px-4 py-2 text-sm font-bold text-white">
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-300" />
          {source.countdown}s
        </div>

        <div className="absolute right-10 bottom-6 h-40 w-24 rounded-t-[999px] rounded-b-[28px] bg-[linear-gradient(180deg,#39241d_0%,#8e5a4d_22%,#e4b49e_52%,#d18c79_70%,#4b2620_100%)] opacity-75" />

        {blocked && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/45 backdrop-blur-[2px]">
            <div className="rounded-3xl border border-red-400/40 bg-[#110f10]/95 px-8 py-6 text-center shadow-2xl">
              <div className="text-4xl">⛔</div>
              <div className="mt-3 text-xl font-black text-white">Aguardando sinal</div>
              <div className="mt-2 text-sm text-slate-300">Interações com a mesa bloqueadas até o sync voltar.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MiniplayerView({
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
    clearBets: () => void;
    refreshSource: () => void;
    placeBetFromSelection: (target: BetTarget) => void;
  };
  boardRefs: {
    boardRef: React.RefObject<HTMLDivElement | null>;
    selectedChipRef: React.RefObject<HTMLDivElement | null>;
    playerRef: React.RefObject<HTMLButtonElement | null>;
    tieRef: React.RefObject<HTMLButtonElement | null>;
    bankerRef: React.RefObject<HTMLButtonElement | null>;
  };
  overlay: {
    myCursor: { x: number; y: number };
    robotCursor: { x: number; y: number };
    trail: { x: number; y: number }[];
    visible: boolean;
    handleMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
  };
}) {
  if (state.isClosed) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button className="rounded-2xl shadow-xl" onClick={actions.reopen}>Reabrir miniplayer</Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[470px] max-w-[calc(100vw-2rem)]" onMouseMove={overlay.handleMouseMove}>
      <Card className="overflow-hidden rounded-3xl border-[#433321] bg-[#0c0c0f]/95 text-slate-100 shadow-2xl backdrop-blur">
        <CardHeader className="border-b border-[#2f2519] pb-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-xl font-bold tracking-tight">Bac Bo Miniplayer</CardTitle>
              <p className="mt-1 text-sm text-slate-400">Clique na chip e depois em Player, Tie ou Banker</p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`rounded-full border px-3 py-1 text-xs font-black ${state.connection.online && state.connection.synced ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-300" : "border-amber-400/30 bg-amber-500/15 text-amber-300"}`}>
                {state.connection.online && state.connection.synced ? "ONLINE + SYNC" : "AGUARDANDO SINAL"}
              </div>
              <button onClick={actions.toggle} className="rounded-xl border border-slate-700 bg-slate-900 p-2 text-slate-300 transition hover:bg-slate-800" aria-label="Minimizar">
                <Minus className="h-4 w-4" />
              </button>
              <button onClick={actions.close} className="rounded-xl border border-slate-700 bg-slate-900 p-2 text-slate-300 transition hover:bg-slate-800" aria-label="Fechar">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </CardHeader>

        {!state.isMinimized && (
          <CardContent className="space-y-5 p-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-[#35291f] bg-[#17120f] p-4">
                <div className="text-xs uppercase tracking-wide text-slate-400">Saldo total</div>
                <div className="mt-2 text-2xl font-bold">R$ {state.stats.balance.toFixed(2)}</div>
              </div>
              <div className="rounded-2xl border border-[#35291f] bg-[#17120f] p-4">
                <div className="text-xs uppercase tracking-wide text-slate-400">Aposta total</div>
                <div className="mt-2 text-2xl font-bold">R$ {state.stats.totalBet.toFixed(2)}</div>
              </div>
            </div>

            <div ref={boardRefs.boardRef} className="relative">
              <BettingBoard state={state} actions={actions} boardRefs={boardRefs} />
              <MouseOverlay myCursor={overlay.myCursor} robotCursor={overlay.robotCursor} trail={overlay.trail} visible={overlay.visible} />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-300">Chips</span>
                <Badge variant="secondary" className="rounded-full bg-[#1a1613] text-[#efdfbf]">
                  Selecionada: {state.selectedChip} × {state.multiplier}
                </Badge>
              </div>

              <div className="grid grid-cols-[48px_1fr_48px] items-center gap-3">
                <button type="button" onClick={actions.undoLastBet} className="flex h-12 w-12 items-center justify-center rounded-full border border-[#6b532d] bg-[#20160f] text-[#f2ddb0] shadow-lg transition hover:scale-105">
                  <Undo2 className="h-5 w-5" />
                </button>

                <div className="flex items-center justify-center gap-3 rounded-3xl border border-[#4e3a23] bg-gradient-to-b from-[#3a2a18] to-[#1b130d] px-3 py-3">
                  {[5, 10, 15, 25, 50].map((chip) => (
                    <div key={chip} ref={state.selectedChip === chip ? boardRefs.selectedChipRef : null}>
                      <CasinoChip amount={chip} selected={state.selectedChip === chip} onClick={() => actions.selectChip(chip)} />
                    </div>
                  ))}
                </div>

                <button type="button" onClick={actions.increaseMultiplier} className="flex h-12 w-12 items-center justify-center rounded-full border border-[#6b532d] bg-[#20160f] text-[#f2ddb0] shadow-lg transition hover:scale-105">
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-300">Histórico</span>
                <div className="flex gap-2">
                  <Button variant="outline" className="rounded-xl border-slate-700 bg-transparent text-slate-200 hover:bg-slate-800" onClick={actions.clearBets}>
                    <RotateCcw className="mr-2 h-4 w-4" /> Limpar apostas
                  </Button>
                  <Button variant="outline" className="rounded-xl border-slate-700 bg-transparent text-slate-200 hover:bg-slate-800" onClick={actions.refreshSource}>
                    <RefreshCw className="mr-2 h-4 w-4" /> Atualizar
                  </Button>
                </div>
              </div>
              <div className="grid min-h-[132px] grid-cols-8 gap-2 rounded-2xl border border-slate-800 bg-slate-900 p-3">
                {state.history.slice(0, 80).map((item) => (
                  <HistoryDot key={item.timestamp} result={item.result} />
                ))}
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

function createInitialMockSource(): MockSource {
  const seed: RoadResult[] = ["P", "B", "P", "P", "B", "T", "B", "P", "B", "P", "T", "B", "P", "P", "B", "B", "P", "T", "P", "B", "P", "B", "T", "P", "B", "P", "P", "B"];
  const history = seed.map((result, index) => ({ result, timestamp: Date.now() - index * 1000 })).reverse();
  return {
    sourceName: "Bet Ai",
    online: true,
    synced: true,
    countdown: 44,
    balance: 347,
    totalBet: 0,
    score: { player: 3, tie: 1, banker: 7, playerPct: 48, tiePct: 8, bankerPct: 44 },
    history,
  };
}

export default function BacBoMiniplayerPreview() {
  const instanceRef = useRef<BacBoMiniplayer | null>(null);
  const boardRef = useRef<HTMLDivElement | null>(null);
  const selectedChipRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<HTMLButtonElement | null>(null);
  const tieRef = useRef<HTMLButtonElement | null>(null);
  const bankerRef = useRef<HTMLButtonElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [state, setState] = useState<MiniplayerState>({
    history: [],
    stats: { player: 0, banker: 0, tie: 0, balance: 1500.5, totalBet: 0 },
    connection: { online: true, synced: true, sourceName: "Bet Ai", lastSyncAt: Date.now() },
    betStacks: { player: [], tie: [], banker: [] },
    selectedChip: 5,
    multiplier: 1,
    countdown: 44,
    lastAnimation: null,
    isMinimized: false,
    isClosed: false,
    percentages: { player: 0, tie: 0, banker: 0 },
  });
  const [myCursor, setMyCursor] = useState({ x: 24, y: 24 });
  const [robotCursor, setRobotCursor] = useState({ x: 90, y: 250 });
  const [trail, setTrail] = useState<{ x: number; y: number }[]>([]);
  const [mockSource, setMockSource] = useState<MockSource>(createInitialMockSource);

  useEffect(() => {
    const instance = new BacBoMiniplayer({ maxHistoryItems: 100, onStateChange: setState });
    instance.syncFromSource(mockSource);
    instanceRef.current = instance;

    return () => {
      if (animationFrameRef.current != null) window.cancelAnimationFrame(animationFrameRef.current);
      instance.destroy();
    };
  }, []);

  useEffect(() => {
    instanceRef.current?.syncFromSource(mockSource);
  }, [mockSource]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setMockSource((prev) => {
        const nextCountdown = prev.countdown <= 0 ? 44 : prev.countdown - 1;
        let nextHistory = prev.history;
        let nextScore = prev.score;

        if (prev.online && prev.synced && nextCountdown === 44) {
          const results: RoadResult[] = ["P", "B", "T"];
          const nextResult = results[Math.floor(Math.random() * results.length)];
          nextHistory = [{ result: nextResult, timestamp: Date.now() }, ...prev.history].slice(0, 80);
          const player = nextHistory.filter((item) => item.result === "P").length;
          const tie = nextHistory.filter((item) => item.result === "T").length;
          const banker = nextHistory.filter((item) => item.result === "B").length;
          const total = Math.max(1, player + tie + banker);
          const playerPct = Math.round((player / total) * 100);
          const tiePct = Math.round((tie / total) * 100);
          nextScore = { player, tie, banker, playerPct, tiePct, bankerPct: Math.max(0, 100 - playerPct - tiePct) };
        }

        return { ...prev, countdown: nextCountdown, history: nextHistory, score: nextScore };
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!state.lastAnimation) return;
    const { start, end } = state.lastAnimation;
    const control = { x: (start.x + end.x) / 2, y: Math.min(start.y, end.y) - 48 };
    const duration = 520;
    const startedAt = performance.now();

    const step = (now: number) => {
      const raw = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - raw, 3);
      const x = (1 - eased) * (1 - eased) * start.x + 2 * (1 - eased) * eased * control.x + eased * eased * end.x;
      const y = (1 - eased) * (1 - eased) * start.y + 2 * (1 - eased) * eased * control.y + eased * eased * end.y;
      setRobotCursor({ x, y });
      setTrail((prev) => [{ x, y }, ...prev].slice(0, 12));

      if (raw < 1) {
        animationFrameRef.current = window.requestAnimationFrame(step);
      } else {
        window.setTimeout(() => setTrail([]), 120);
      }
    };

    if (animationFrameRef.current != null) window.cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = window.requestAnimationFrame(step);
  }, [state.lastAnimation]);

  const actions = useMemo(
    () => ({
      selectChip: (amount: number) => instanceRef.current?.selectChip(amount),
      placeBetFromSelection: (target: BetTarget) => {
        const boardEl = boardRef.current;
        const chipEl = selectedChipRef.current;
        const targetEl = target === "player" ? playerRef.current : target === "banker" ? bankerRef.current : tieRef.current;

        if (!boardEl || !chipEl || !targetEl) {
          instanceRef.current?.placeBet(target);
          return;
        }

        const boardRect = boardEl.getBoundingClientRect();
        const chipRect = chipEl.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();
        const start = { x: chipRect.left - boardRect.left + chipRect.width / 2, y: chipRect.top - boardRect.top + chipRect.height / 2 };
        const end = { x: targetRect.left - boardRect.left + targetRect.width / 2, y: targetRect.top - boardRect.top + targetRect.height / 2 };
        instanceRef.current?.placeBet(target, { start, end, target, amount: 0, startedAt: Date.now() });
      },
      increaseMultiplier: () => instanceRef.current?.increaseMultiplier(),
      undoLastBet: () => instanceRef.current?.undoLastBet(),
      close: () => instanceRef.current?.close(),
      reopen: () => instanceRef.current?.reopen(),
      toggle: () => instanceRef.current?.toggle(),
      refreshSource: () => {
        setMockSource((prev) => ({
          ...prev,
          online: true,
          synced: true,
          countdown: 44,
          balance: Number((prev.balance + 0.5).toFixed(2)),
        }));
      },
      toggleSignal: () => {
        setMockSource((prev) => ({ ...prev, online: !prev.online, synced: prev.online ? false : true }));
      },
      clearBets: () => instanceRef.current?.clearBets(),
    }),
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d0d10] via-[#1b1510] to-[#0f0c09] p-6 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <MockBetAiBank source={mockSource} blocked={!mockSource.online || !mockSource.synced} />
          </div>

          <div className="space-y-6">
            <Card className="rounded-3xl border-[#2e2319] bg-[#100e0c]/85 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl">Telemetria da extensão</CardTitle>
                <p className="text-sm text-slate-400">Fonte mock viva: Bet Ai simulada. O miniplayer consome daqui.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">status: {mockSource.online ? "online" : "offline"}</div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">sync: {mockSource.synced ? "ativo" : "aguardando"}</div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">countdown: {mockSource.countdown}s</div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">histórico: {mockSource.history.length} itens</div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={actions.refreshSource}>Atualizar e sincronizar</Button>
                  <Button variant="outline" onClick={actions.toggleSignal}>Alternar sinal</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-[#2e2319] bg-[#100e0c]/85 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl">Estado atual</CardTitle>
                <p className="text-sm text-slate-400">Espelho do miniplayer</p>
              </CardHeader>
              <CardContent>
                <pre className="max-h-[420px] overflow-auto rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-200">{JSON.stringify(state, null, 2)}</pre>
              </CardContent>
            </Card>
          </div>
        </div>

        <MiniplayerView
          state={state}
          actions={actions}
          boardRefs={{ boardRef, selectedChipRef, playerRef, tieRef, bankerRef }}
          overlay={{
            myCursor,
            robotCursor,
            trail,
            visible: !state.isMinimized,
            handleMouseMove: (event) => {
              const rect = boardRef.current?.getBoundingClientRect();
              if (!rect) return;
              setMyCursor({
                x: Math.max(8, Math.min(rect.width - 8, event.clientX - rect.left)),
                y: Math.max(8, Math.min(rect.height - 8, event.clientY - rect.top)),
              });
            },
          }}
        />
      </div>
    </div>
  );
}

// panel.js — Will Dados Pró (sincronizado com will_dados_pro.py via HTTP)

const state = {
  running: false,
  timer: 0,
  maxTimer: 60,
  driveState: 'idle',
  wins: 0,
  losses: 0,
  balance: 0,
  pnl: 0,
  lastResult: null,
  history: [], // últimos 10 resultados
};

// Elementos
const btnPower = document.getElementById('btn-power');
const btnCancel = document.getElementById('btn-cancel');
const cancelSection = document.getElementById('cancel-section');
const countdownBar = document.getElementById('countdown-bar');
const countdownNumber = document.getElementById('countdown-number');
const countdownTime = document.getElementById('countdown-time');
const driveStateEl = document.getElementById('drive-state');
const driveIcon = document.getElementById('drive-icon');
const driveText = document.getElementById('drive-text');
const driveSubtext = document.getElementById('drive-subtext');
const activityLog = document.getElementById('activity-log');
const valBalance = document.getElementById('val-balance');
const valPnL = document.getElementById('val-pnl');
const valWins = document.getElementById('val-wins');
const valLosses = document.getElementById('val-losses');
const valWinrate = document.getElementById('val-winrate');
const historyGrid = document.getElementById('history-grid');

// Configuração de estados
const stateConfig = {
  idle: { icon: '💤', text: 'Aguardando ativação', subtext: 'Clique em Ligar para iniciar' },
  detecting: { icon: '🔍', text: 'Detectando padrão', subtext: 'Analisando sequência' },
  betting: { icon: '🎯', text: 'Apostando', subtext: 'Enviando aposta' },
  waiting: { icon: '⏳', text: 'Aguardando resultado', subtext: 'Processando mesa' },
  win: { icon: '🏆', text: 'Ganhou!', subtext: 'Resultado positivo' },
  loss: { icon: '💀', text: 'Perdeu', subtext: 'Resultado negativo' },
  gale: { icon: '↗', text: 'Gale ativo', subtext: 'Dobrando aposta' },
};

function log(msg, type = '') {
  const div = document.createElement('div');
  div.className = `log-entry ${type}`;
  const ts = new Date().toLocaleTimeString('pt-BR', { hour12: false }).slice(0, 8);
  div.textContent = `[${ts}] ${msg}`;

  // Adiciona no início (FIFO - novas mensagens no topo)
  activityLog.insertBefore(div, activityLog.firstChild);

  // Mantém apenas 6 linhas visíveis
  while (activityLog.children.length > 6) {
    activityLog.removeChild(activityLog.lastChild);
  }
}

function updateDriveState(newState) {
  state.driveState = newState;
  const cfg = stateConfig[newState] || stateConfig.idle;

  // Remove todas as classes de estado
  Object.keys(stateConfig).forEach(s => driveStateEl.classList.remove(s));
  // Adiciona a nova classe
  driveStateEl.classList.add(newState);

  driveIcon.textContent = cfg.icon;
  driveText.textContent = cfg.text;
  driveSubtext.textContent = cfg.subtext;
}

function updateCountdown(current, max) {
  state.timer = current;
  state.maxTimer = max;

  const pct = Math.max(0, Math.min(100, (current / max) * 100));
  countdownBar.style.width = pct + '%';
  countdownNumber.textContent = Math.ceil(current);
  countdownTime.textContent = `${Math.ceil(current)}s`;

  // Animação de scanning quando ativo
  if (state.running && current > 0 && current < 5) {
    countdownBar.classList.add('scanning');
  } else {
    countdownBar.classList.remove('scanning');
  }
}

function updateStats(wins, losses, balance, pnl) {
  state.wins = wins;
  state.losses = losses;
  state.balance = balance;
  state.pnl = pnl;

  valWins.textContent = wins;
  valLosses.textContent = losses;
  valBalance.textContent = `R$ ${balance.toFixed(2).replace('.', ',')}`;

  // P&L com cor
  const pnlText = pnl >= 0 ? `R$ ${pnl.toFixed(2).replace('.', ',')}` : `-R$ ${Math.abs(pnl).toFixed(2).replace('.', ',')}`;
  valPnL.textContent = pnlText;
  valPnL.classList.remove('green', 'red');
  valPnL.classList.add(pnl >= 0 ? 'green' : 'red');

  // Win rate
  const total = wins + losses;
  const wr = total > 0 ? Math.round((wins / total) * 100) : 0;
  valWinrate.textContent = `${wr}%`;
}

function addToHistory(result) {
  // P = Player (azul), B = Banker (vermelho), T = Tie (laranja)
  state.history.unshift(result);
  if (state.history.length > 10) state.history.pop();

  // Renderiza grid
  historyGrid.innerHTML = state.history.map(r => {
    const cellClass = r === 'P' ? 'P' : (r === 'B' ? 'B' : 'T');
    return `<div class="h-cell ${cellClass}">${r}</div>`;
  }).join('');
}

async function syncWithServer() {
  if (!state.running) return;

  try {
    const res = await fetch('http://localhost:9999/sync', { method: 'GET' });
    if (!res.ok) return;

    const data = await res.json();

    // Atualiza countdown
    if (data.timer !== undefined) {
      updateCountdown(data.timer, data.maxTimer || 60);
    }

    // Atualiza estado do drive
    if (data.state) {
      updateDriveState(data.state);
    }

    // Atualiza stats
    if (data.wins !== undefined) {
      updateStats(data.wins, data.losses, data.balance, data.pnl);
    }

    // Atualiza histórico
    if (data.history && data.history.length > 0) {
      data.history.forEach(r => {
        if (!state.history.includes(r)) {
          addToHistory(r);
        }
      });
    }

  } catch (e) {
    console.error('[sync]', e.message);
  }
}

// Event Listeners
btnPower.addEventListener('click', async () => {
  if (state.running) return;

  state.running = true;
  btnPower.disabled = true;
  cancelSection.classList.add('active');

  log('🚀 Iniciando robô...', 'success');
  updateDriveState('detecting');

  try {
    const res = await fetch('http://localhost:9999/start', { method: 'POST' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    log('✅ Robô iniciado', 'success');

    // Inicia polling a cada 500ms
    pollInterval = setInterval(syncWithServer, 500);

  } catch (err) {
    log(`❌ Erro: ${err.message}`, 'error');
    state.running = false;
    btnPower.disabled = false;
    cancelSection.classList.remove('active');
    updateDriveState('idle');
  }
});

btnCancel.addEventListener('click', async () => {
  if (!state.running) return;

  state.running = false;
  btnPower.disabled = false;
  cancelSection.classList.remove('active');

  log('⏹ Parado pelo usuário', 'warn');
  updateDriveState('idle');
  updateCountdown(0, 60);

  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
  }

  try {
    await fetch('http://localhost:9999/stop', { method: 'POST' });
  } catch (e) {
    console.error('[stop]', e.message);
  }
});

// Inicialização
let pollInterval = null;

log('🟢 Painel pronto', 'success');
updateStats(0, 0, 0, 0);
updateCountdown(0, 60);
updateDriveState('idle');

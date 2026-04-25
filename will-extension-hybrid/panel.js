// Estado global
const state = {
  running: false,
  sessionWins: 0,
  sessionLosses: 0,
  sessionBalance: 0,
  currentTimer: 0,
  maxTimer: 60,
  driveState: 'idle', // idle, detecting, betting, waiting, win, loss, gale
};

// Elementos DOM
const goBtn = document.getElementById('go-btn');
const cancelBtn = document.getElementById('cancel-btn');
const logEl = document.getElementById('log');
const countdownProgress = document.getElementById('countdown-progress');
const countdownTime = document.getElementById('countdown-time');
const countdownStatus = document.getElementById('countdown-status');
const stateIcon = document.getElementById('state-icon');
const stateValue = document.getElementById('state-value');
const statSaldo = document.getElementById('stat-saldo');
const statPnL = document.getElementById('stat-pnl');
const statWins = document.getElementById('stat-wins');
const statLosses = document.getElementById('stat-losses');

const LOG_LIMIT = 4;
let logLines = [];

// Configuração de estados
const stateConfig = {
  idle: { icon: '💤', label: 'Aguardando...', color: '#888' },
  detecting: { icon: '🔍', label: 'Detectando padrão', color: '#0088ff' },
  betting: { icon: '🎯', label: 'Apostando', color: '#ffaa00' },
  waiting: { icon: '⏳', label: 'Aguardando resultado', color: '#aa00ff' },
  win: { icon: '🏆', label: 'Ganhou!', color: '#00dd00' },
  loss: { icon: '💀', label: 'Perdeu', color: '#ff4444' },
  gale: { icon: '↗', label: 'Gale ativo', color: '#ff8800' },
};

function log(msg, type = 'info') {
  const ts = new Date().toLocaleTimeString('pt-BR', { hour12: false }).slice(0, 8);
  const line = `[${ts}] ${msg}`;
  logLines.unshift(line);
  logLines = logLines.slice(0, LOG_LIMIT);

  logEl.innerHTML = logLines.map(l => {
    let cls = 'info';
    if (l.includes('✅') || l.includes('🏆')) cls = 'ok';
    else if (l.includes('❌') || l.includes('💀')) cls = 'error';
    else if (l.includes('⚠️')) cls = 'warn';
    return `<div class="log-line ${cls}">${escapeHtml(l)}</div>`;
  }).join('');
}

function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, m => map[m]);
}

function updateDriveState(newState, extra = '') {
  state.driveState = newState;
  const cfg = stateConfig[newState] || stateConfig.idle;
  stateIcon.textContent = cfg.icon;
  stateValue.textContent = cfg.label + (extra ? ` (${extra})` : '');
  stateValue.style.color = cfg.color;
}

function updateCountdown(current, max) {
  state.currentTimer = current;
  state.maxTimer = max || 60;
  const pct = Math.max(0, Math.min(100, (current / state.maxTimer) * 100));
  countdownProgress.style.width = pct + '%';

  const mins = Math.floor(current / 60);
  const secs = current % 60;
  countdownTime.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
  countdownTime.style.color = current > 20 ? '#00ff00' : (current > 10 ? '#ffaa00' : '#ff4444');
}

function updateStats(wins, losses, balance, pnl) {
  state.sessionWins = wins;
  state.sessionLosses = losses;
  state.sessionBalance = balance;

  statWins.textContent = wins;
  statLosses.textContent = losses;
  statSaldo.textContent = `R$ ${balance.toFixed(2)}`;

  const pnlText = pnl >= 0 ? `+R$ ${pnl.toFixed(2)}` : `-R$ ${Math.abs(pnl).toFixed(2)}`;
  statPnL.textContent = pnlText;
  statPnL.style.color = pnl >= 0 ? '#00dd00' : '#ff4444';
}

// Listeners de botões
goBtn.addEventListener('click', () => {
  if (state.running) return;

  state.running = true;
  goBtn.disabled = true;
  cancelBtn.classList.add('active');

  log('🚀 Iniciando robô...', 'info');
  updateDriveState('detecting', 'conectando');

  fetch('http://localhost:9999/start', { method: 'POST' })
    .then(() => {
      log('✅ Robô iniciado', 'ok');
      updateDriveState('detecting', 'aguardando dados');
      startPolling();
    })
    .catch(err => {
      log(`❌ Erro: ${err.message}`, 'error');
      state.running = false;
      goBtn.disabled = false;
      cancelBtn.classList.remove('active');
      updateDriveState('idle');
    });
});

cancelBtn.addEventListener('click', () => {
  if (!state.running) return;

  state.running = false;
  goBtn.disabled = false;
  cancelBtn.classList.remove('active');

  log('⏹ Robô parado pelo usuário', 'warn');
  updateDriveState('idle');
  updateCountdown(0, 60);

  fetch('http://localhost:9999/stop', { method: 'POST' }).catch(() => {});
});

// Simula recebimento de dados (em produção virá do servidor)
let pollInterval = null;
function startPolling() {
  let timerCounter = 50;
  let phase = 0;

  pollInterval = setInterval(() => {
    if (!state.running) {
      clearInterval(pollInterval);
      return;
    }

    timerCounter--;
    if (timerCounter < 0) {
      timerCounter = 60;
      phase = (phase + 1) % 4;
    }

    updateCountdown(timerCounter, 60);

    // Simula fases diferentes
    if (phase === 0) updateDriveState('detecting', 'Reversão 3x');
    else if (phase === 1) updateDriveState('betting', 'R$ 50 em BANKER');
    else if (phase === 2) updateDriveState('waiting', 'resultado...');
    else {
      const win = Math.random() > 0.3;
      if (win) {
        updateDriveState('win', '+R$ 45');
        updateStats(state.sessionWins + 1, state.sessionLosses, state.sessionBalance + 45, 45);
        log('🏆 Ganhou R$ 45', 'ok');
      } else {
        updateDriveState('loss', '-R$ 50');
        updateStats(state.sessionWins, state.sessionLosses + 1, state.sessionBalance - 50, -50);
        log('💀 Perdeu R$ 50', 'error');
      }
    }
  }, 1000);
}

// Inicialização
log('🟢 Painel pronto', 'ok');
updateStats(0, 0, 0, 0);
updateCountdown(0, 60);

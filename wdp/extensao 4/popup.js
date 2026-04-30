// popup.js — interface compacta. O painel lateral continua sendo a UI principal.
let intervalId = null;

function money(v) { return `R$ ${Math.floor(Number(v) || 0).toLocaleString('pt-BR')}`; }

async function send(action, payload = {}) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action, ...payload }, (response) => {
      if (chrome.runtime.lastError) resolve({ success: false, message: chrome.runtime.lastError.message });
      else resolve(response || { success: false, message: 'Sem resposta.' });
    });
  });
}

function setHidden(id, hidden) {
  document.getElementById(id)?.classList.toggle('hidden', hidden);
}

function renderWsBet(status) {
  const ws = Number(status.wsHistoryCount || 0);
  const betting = status.bettingOpen;
  const cls = betting === true ? 'on' : betting === false ? 'off' : 'warn';
  const label = betting === true ? 'aberta' : betting === false ? 'fechada' : 'n/d';
  return `<span class="pill ${ws ? 'on' : 'warn'}">WS ${ws}</span> <span class="pill ${cls}">${label}</span>`;
}

function calcularTela(status) {
  const bridgeFrames = Number(status.bridgeFrames) || 0;
  const historyCount = Number(status.historyCount) || 0;
  const wsHistoryCount = Number(status.wsHistoryCount) || 0;
  const temMesa = Boolean(status.isBacBo || bridgeFrames || historyCount || wsHistoryCount);
  const historico = historyCount > 0 || wsHistoryCount > 0;

  if (!status.success) return { text: 'Aguardando Padrões do Will...', hint: status.message || 'Abra/recarregue a mesa Bac Bo para sincronizar.', tone: 'off', showMetrics: false };
  if (!temMesa) return { text: '1/7 • Aguardando mesa', hint: 'Abra a mesa Bac Bo para sincronizar.', tone: 'off', showMetrics: false };
  if (!historico) return { text: '2/7 • Mesa detectada', hint: `Aguardando histórico. Bridge ${bridgeFrames}.`, tone: 'alert', showMetrics: false };
  if (/stop/i.test(status.ultimaAcao || '')) return { text: '7/7 • Stop atingido', hint: status.ultimaAcao, tone: 'alert', showMetrics: true };
  if (/ganhou|perdeu|empate/i.test(status.ultimaAcao || '') || ['GANHOU','PERDEU','EMPATE'].includes(status.ultimaApostaStatus)) return { text: '6/7 • Resultado processado', hint: status.ultimaAcao || 'Resultado atualizado.', tone: 'on', showMetrics: true };
  if (/simulação|simulacao|aposta/i.test(status.ultimaAcao || '') || status.ultimaApostaStatus === 'PENDENTE') return { text: status.shadowMode ? '5/7 • Entrada simulada' : '5/7 • Entrada apostada', hint: status.ultimaAcao || 'Aguardando resultado.', tone: 'on', showMetrics: true };
  if (status.ativo) return { text: '4/7 • Analisando padrões', hint: 'Histórico conectado. Observando padrões do Will.', tone: 'on', showMetrics: true };
  return { text: '3/7 • Histórico conectado', hint: 'Clique em Ligar para iniciar.', tone: 'off', showMetrics: true };
}

async function atualizar() {
  const status = await send('GET_STATUS');
  const ui = calcularTela(status || {});
  const statusEl = document.getElementById('status');
  const btnToggle = document.getElementById('btn-toggle');

  statusEl.textContent = ui.text;
  statusEl.classList.toggle('off', ui.tone === 'off');
  statusEl.classList.toggle('alert', ui.tone === 'alert');
  document.getElementById('hint').textContent = ui.hint;

  btnToggle.textContent = status?.ativo ? 'Desligar' : 'Ligar';
  btnToggle.classList.toggle('disabled', !status?.success);

  setHidden('metrics', !ui.showMetrics);
  setHidden('btn-export', !ui.showMetrics);
  setHidden('logs-title', !ui.showMetrics);
  setHidden('logs', !ui.showMetrics);

  if (!ui.showMetrics) {
    document.getElementById('ultimo-padrao').textContent = status?.success ? 'Último padrão: --' : 'Abra/recarregue a mesa Bac Bo para sincronizar.';
    return;
  }

  document.getElementById('mode').textContent = status.shadowMode ? 'Shadow' : 'Auto real';
  document.getElementById('bankroll').textContent = money(status.bankroll);
  const lucro = document.getElementById('lucro');
  lucro.textContent = `${Number(status.lucro || 0) >= 0 ? '+' : ''}${money(status.lucro)}`;
  lucro.className = `value ${Number(status.lucro || 0) >= 0 ? 'pos' : 'neg'}`;
  document.getElementById('stake').textContent = `${money(status.stake)} / G${status.gale || 0}`;
  document.getElementById('meta-stop').textContent = `${money(status.metaSaldoAlvo || 0)} / ${money(status.stopLossSaldo || 0)}`;
  document.getElementById('ws-bet').innerHTML = renderWsBet(status);
  document.getElementById('ultimo-padrao').textContent = `Último padrão: ${status.ultimoPadrao || status.ultimaAcao || '--'} | Histórico: ${status.historyCount || 0} | WS: ${status.wsHistoryCount || 0}`;

  const logs = await send('GET_LOGS');
  const logsEl = document.getElementById('logs');
  if (Array.isArray(logs) && logs.length) {
    logsEl.innerHTML = logs.slice(0, 10).map((l) => `<div class="log">[${l.timestamp}] <b>${l.tipo}</b>: ${l.mensagem}</div>`).join('');
  } else {
    logsEl.innerHTML = '<div class="log">Sem logs ainda.</div>';
  }
}

async function exportarCsv() {
  const res = await send('EXPORT_LOGS_CSV');
  if (!res?.csv) return alert('Não foi possível exportar os logs desta aba.');
  const blob = new Blob([res.csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `will-dados-logs-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

async function abrirSidePanel() {
  const res = await send('OPEN_SIDE_PANEL');
  if (!res?.success) alert(res?.message || 'Não foi possível abrir o painel lateral.');
  else window.close();
}

async function abrirOverlay() {
  const res = await send('ENTER_OVERLAY_MODE');
  if (!res?.success) alert(res?.message || 'Não foi possível abrir o overlay.');
  else window.close();
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-toggle').addEventListener('click', async () => {
    if (document.getElementById('btn-toggle').classList.contains('disabled')) {
      alert('Recarregue a página da mesa Bac Bo para conectar o robô.');
      return;
    }
    await send('TOGGLE_ROBO');
    await atualizar();
  });
  document.getElementById('btn-sidepanel').addEventListener('click', abrirSidePanel);
  document.getElementById('btn-overlay').addEventListener('click', abrirOverlay);
  document.getElementById('btn-options').addEventListener('click', () => chrome.runtime.openOptionsPage());
  document.getElementById('btn-export').addEventListener('click', exportarCsv);
  atualizar();
  intervalId = setInterval(atualizar, 1200);
});

window.addEventListener('unload', () => { if (intervalId) clearInterval(intervalId); });

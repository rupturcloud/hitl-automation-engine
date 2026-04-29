// popup.js
let intervalId = null;

const DEFAULT_CONFIG = {
  bankrollInicial: 30000,
  bankrollAtual: 30000,
  stakeBase: 150,
  metaLucro: 4000,
  stopLoss: 2000,
  maxGales: 2,
  multiplicadorGale: 2,
  protecaoEmpate: true,
  valorProtecao: 10,
  shadowMode: true,
  autoStart: false,
  showOverlay: false,
  minConfianca: 58,
  limiteStakePercentualBankroll: 10,
  padroesAtivos: {
    oficiais18: true,
    xadrez: true,
    quebraXadrez: true,
    casadinho: true,
    empateLado: true,
    linhaDevedora: true,
    posEmpate: true,
    surf: true,
    quatroCasas: true,
    trasParaFrente: true
  }
};

const PADROES_CONFIG = [
  ['oficiais18', '18 padrões oficiais das mensagens', 'Sequências WMSG-001 a WMSG-018.'],
  ['xadrez', 'Xadrez', 'Alternância Player/Banker.'],
  ['quebraXadrez', 'Quebra de xadrez', 'Detecta quebra na alternância.'],
  ['casadinho', 'Casadinho', 'Dois iguais seguidos.'],
  ['empateLado', 'Empate ao lado / diagonal', 'Usa empate recente como contexto.'],
  ['linhaDevedora', 'Linha devedora', 'Desequilíbrio entre cores recentes.'],
  ['posEmpate', 'Pós-empate', 'Contexto logo após Tie.'],
  ['surf', 'Surf / trava de mesa ruim', 'Evita streak extremo não oficial.'],
  ['quatroCasas', 'Análise 4 casas', 'Alternância nas últimas 4 casas.'],
  ['trasParaFrente', 'Trás para frente', 'Heurística reversa citada na transcrição.']
];

function el(id) { return document.getElementById(id); }

async function carregarConfigPainel() {
  const result = await chrome.storage.local.get(['willDadosConfig']);
  const stored = result.willDadosConfig || {};
  return {
    ...DEFAULT_CONFIG,
    ...stored,
    padroesAtivos: {
      ...DEFAULT_CONFIG.padroesAtivos,
      ...(stored.padroesAtivos || {})
    }
  };
}

function renderPadroesConfig(config) {
  const box = el('cfg-padroes');
  if (!box) return;
  box.innerHTML = PADROES_CONFIG.map(([id, nome, desc]) => `
    <label class="check">
      <input id="cfg-p-${id}" type="checkbox" ${config.padroesAtivos?.[id] ? 'checked' : ''}/>
      <div><b>${nome}</b><small>${desc}</small></div>
    </label>
  `).join('');
}

function preencherConfigPainel(config) {
  ['bankrollInicial','stakeBase','metaSaldoAlvo','stopLossSaldo','metaLucro','stopLoss','maxGales','minConfianca','limiteStakePercentualBankroll','valorProtecao'].forEach((key) => {
    const input = el(`cfg-${key}`);
    if (input) input.value = config[key];
  });
  ['shadowMode','autoStart','showOverlay','protecaoEmpate'].forEach((key) => {
    const input = el(`cfg-${key}`);
    if (input) input.checked = Boolean(config[key]);
  });
  renderPadroesConfig(config);
}

async function coletarConfigPainel() {
  const padroesAtivos = {};
  PADROES_CONFIG.forEach(([id]) => {
    padroesAtivos[id] = Boolean(el(`cfg-p-${id}`)?.checked);
  });
  const stakeBase = Math.min(150, Math.max(5, Number(el('cfg-stakeBase')?.value || DEFAULT_CONFIG.stakeBase)));
  const maxGales = Math.min(9, Math.max(0, Number(el('cfg-maxGales')?.value || DEFAULT_CONFIG.maxGales)));
  const valorProtecao = Math.min(150, Math.max(0, Number(el('cfg-valorProtecao')?.value || DEFAULT_CONFIG.valorProtecao)));
  const atual = await carregarConfigPainel();
  const bankrollInicial = Number(el('cfg-bankrollInicial')?.value || DEFAULT_CONFIG.bankrollInicial);
  const bankrollAtual = Number.isFinite(Number(atual.bankrollAtual)) ? Number(atual.bankrollAtual) : bankrollInicial;
  return {
    ...DEFAULT_CONFIG,
    bankrollInicial,
    bankrollAtual,
    stakeBase,
    stakeMin: 5,
    stakeMax: 150,
    metaSaldoAlvo: Number(el('cfg-metaSaldoAlvo')?.value || DEFAULT_CONFIG.metaSaldoAlvo),
    stopLossSaldo: Number(el('cfg-stopLossSaldo')?.value || DEFAULT_CONFIG.stopLossSaldo),
    metaLucro: Number(el('cfg-metaLucro')?.value || DEFAULT_CONFIG.metaLucro),
    stopLoss: Number(el('cfg-stopLoss')?.value || DEFAULT_CONFIG.stopLoss),
    maxGales,
    minConfianca: Number(el('cfg-minConfianca')?.value || DEFAULT_CONFIG.minConfianca),
    limiteStakePercentualBankroll: Number(el('cfg-limiteStakePercentualBankroll')?.value || DEFAULT_CONFIG.limiteStakePercentualBankroll),
    valorProtecao,
    valorProtecaoMax: 150,
    shadowMode: Boolean(el('cfg-shadowMode')?.checked),
    autoStart: Boolean(el('cfg-autoStart')?.checked),
    showOverlay: Boolean(el('cfg-showOverlay')?.checked),
    protecaoEmpate: Boolean(el('cfg-protecaoEmpate')?.checked),
    padroesAtivos
  };
}

async function salvarConfigPainel() {
  const config = await coletarConfigPainel();
  await chrome.storage.local.set({ willDadosConfig: config });
  if (config.showOverlay) {
    await abrirOverlayFlutuante();
    return;
  }
  await send('UPDATE_CONFIG', { config });
  await atualizar();
  alert('Configurações salvas.');
}

async function restaurarConfigPainel() {
  await chrome.storage.local.set({ willDadosConfig: DEFAULT_CONFIG });
  preencherConfigPainel(DEFAULT_CONFIG);
  await send('UPDATE_CONFIG', { config: DEFAULT_CONFIG });
  await atualizar();
  alert('Configurações restauradas para o padrão.');
}

async function inicializarConfigPainel() {
  preencherConfigPainel(await carregarConfigPainel());
  el('cfg-save')?.addEventListener('click', salvarConfigPainel);
  el('cfg-reset')?.addEventListener('click', restaurarConfigPainel);
}


async function activeTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
}

function money(v) { return `R$ ${Math.floor(Number(v) || 0).toLocaleString('pt-BR')}`; }

async function send(action, payload = {}) {
  const tab = await activeTab();
  if (!tab?.id) return null;
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tab.id, { action, ...payload }, (response) => {
      if (chrome.runtime.lastError) resolve(null);
      else resolve(response);
    });
  });
}

async function atualizar() {
  const status = await send('GET_STATUS');
  const statusEl = document.getElementById('status');
  const btnToggle = document.getElementById('btn-toggle');
  const metricsEl = document.getElementById('metrics');
  const logsEl = document.getElementById('logs');
  const exportBtn = document.getElementById('btn-export');
  const optionsBtn = document.getElementById('btn-options');
  const cfgPanel = document.getElementById('cfg-panel');
  const logsTitle = document.getElementById('logs-title');

  if (!status?.success) {
    statusEl.textContent = 'Aguardando Padrões do Will...';
    statusEl.classList.add('off');
    btnToggle.textContent = 'Ligar';
    btnToggle.classList.add('disabled');
    metricsEl.classList.add('hidden');
    logsEl.classList.add('hidden');
    exportBtn.classList.add('hidden');
    optionsBtn?.classList.add('hidden');
    cfgPanel?.classList.add('hidden');
    logsTitle?.classList.add('hidden');
    document.getElementById('ultimo-padrao').textContent = 'Abra/recarregue a mesa Bac Bo para sincronizar.';
    return;
  }

  const bridgeFrames = Number(status.bridgeFrames) || 0;
  const historyCount = Number(status.historyCount) || 0;
  const temContent = Boolean(status.success);
  const temMesaReal = bridgeFrames > 0 || historyCount > 0;
  const historicoConectado = historyCount > 0;
  const mostrarOperacao = historicoConectado;

  metricsEl.classList.toggle('hidden', !mostrarOperacao);
  logsEl.classList.toggle('hidden', !mostrarOperacao);
  exportBtn.classList.toggle('hidden', !mostrarOperacao);
  optionsBtn?.classList.toggle('hidden', !mostrarOperacao);
  cfgPanel?.classList.toggle('hidden', !mostrarOperacao);
  logsTitle?.classList.toggle('hidden', !mostrarOperacao);
  document.getElementById('btn-float')?.classList.toggle('hidden', !mostrarOperacao);
  btnToggle.classList.toggle('disabled', !temContent);

  if (!temMesaReal) {
    statusEl.textContent = '1/7 • Aguardando mesa';
    document.getElementById('hint').textContent = 'Abra a mesa Bac Bo ou clique em Jogar para sincronizar os padrões.';
  } else if (!historicoConectado) {
    statusEl.textContent = `2/7 • Mesa detectada`;
    document.getElementById('hint').textContent = 'Mesa detectada. Aguardando o Bead Road carregar para liberar banca, stake e logs.';
  } else if (/stop/i.test(status.ultimaAcao || '')) {
    statusEl.textContent = '7/7 • Stop atingido';
    document.getElementById('hint').textContent = status.ultimaAcao;
  } else if (/ganhou|perdeu|empate/i.test(status.ultimaAcao || '') || status.ultimaApostaStatus === 'GANHOU' || status.ultimaApostaStatus === 'PERDEU' || status.ultimaApostaStatus === 'EMPATE') {
    statusEl.textContent = '6/7 • Resultado processado';
    document.getElementById('hint').textContent = status.ultimaAcao || 'Resultado da rodada atualizado.';
  } else if (/simulação|aposta/i.test(status.ultimaAcao || '') || status.ultimaApostaStatus === 'PENDENTE') {
    statusEl.textContent = status.shadowMode ? '5/7 • Entrada simulada' : '5/7 • Entrada apostada';
    document.getElementById('hint').textContent = status.ultimaAcao || 'Entrada enviada e aguardando resultado.';
  } else if (status.ativo) {
    statusEl.textContent = '4/7 • Analisando padrões';
    document.getElementById('hint').textContent = 'Histórico conectado. O robô está observando os padrões do Will.';
  } else {
    statusEl.textContent = '3/7 • Histórico conectado';
    document.getElementById('hint').textContent = 'Banca, lucro e stake aparecem apenas depois que o histórico da mesa está conectado.';
  }

  statusEl.classList.toggle('off', !status.ativo);
  statusEl.classList.toggle('alert', temMesaReal && !historicoConectado);
  btnToggle.textContent = status.ativo ? 'Desligar' : 'Ligar';

  if (!mostrarOperacao) {
    document.getElementById('ultimo-padrao').textContent = temMesaReal
      ? `Último padrão: sincronizando... | Bridge: ${bridgeFrames}`
      : 'Último padrão: --';
    return;
  }

  document.getElementById('mode').textContent = status.shadowMode ? 'Shadow' : 'Auto';
  document.getElementById('bankroll').textContent = money(status.bankroll);
  const lucro = document.getElementById('lucro');
  lucro.textContent = `${status.lucro >= 0 ? '+' : ''}${money(status.lucro)}`;
  lucro.className = `value ${status.lucro >= 0 ? 'pos' : 'neg'}`;
  document.getElementById('stake').textContent = `${money(status.stake)} / G${status.gale}`;
  document.getElementById('meta-stop').textContent = `${money(status.metaSaldoAlvo || 0)} / ${money(status.stopLossSaldo || 0)}`;
  const bridgeInfo = ` | Bridge: ${bridgeFrames} | Histórico: ${historyCount}`;
  document.getElementById('ultimo-padrao').textContent = `Último padrão: ${status.ultimoPadrao || status.ultimaAcao || '--'}${bridgeInfo}`;

  const logs = await send('GET_LOGS');
  if (Array.isArray(logs) && logs.length) {
    logsEl.innerHTML = logs.slice(0, 10).map((l) => `<div class="log">[${l.timestamp}] <b>${l.tipo}</b>: ${l.mensagem}</div>`).join('');
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


function renderOverlayAtivo() {
  document.body.innerHTML = `
    <div style="font-family:Arial,sans-serif;padding:18px;background:#f5f5f5;color:#111;min-height:100vh">
      <div style="height:38px;line-height:38px;text-align:center;font-weight:800;background:linear-gradient(#eee,#cfcfcf);border:1px solid #999;margin:-18px -18px 18px">
        Painel de Configuração (Bac Bo)
      </div>
      <div style="background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:14px;text-align:center">
        <div style="font-weight:900;color:#07910b;margin-bottom:8px">Overlay flutuante ativo</div>
        <div style="font-size:13px;color:#555;line-height:1.35">
          O painel lateral foi enviado para o modo overlay. Use o botão <b>Voltar painel</b> no overlay flutuante para retornar.
        </div>
      </div>
    </div>`;
}

async function abrirOverlayFlutuante() {
  renderOverlayAtivo();
  const res = await new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: 'ENTER_OVERLAY_MODE' }, (response) => {
      if (chrome.runtime.lastError) resolve({ success: false, message: chrome.runtime.lastError.message });
      else resolve(response || { success: false });
    });
  });
  if (!res?.success) {
    alert(res?.message || 'Não foi possível abrir o overlay flutuante.');
    return;
  }
  // Em versões compatíveis do Chrome, o background desabilita o side panel desta aba e ele fecha.
  // Se o navegador mantiver o painel aberto, deixamos apenas esta tela mínima para não duplicar UI.
  try { window.close(); } catch (_) {}
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-toggle').addEventListener('click', async () => {
    if (document.getElementById('btn-toggle').classList.contains('disabled')) {
      alert('Recarregue a página da mesa Bac Bo para conectar o robô.');
      return;
    }
    const res = await send('TOGGLE_ROBO');
    if (res?.message) console.log(res.message);
    await atualizar();
  });
  document.getElementById('btn-float')?.addEventListener('click', abrirOverlayFlutuante);
  document.getElementById('btn-options').addEventListener('click', () => document.getElementById('cfg-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  document.getElementById('btn-export').addEventListener('click', exportarCsv);
  inicializarConfigPainel();
  atualizar();
  intervalId = setInterval(atualizar, 1200);
});

window.addEventListener('unload', () => { if (intervalId) clearInterval(intervalId); });

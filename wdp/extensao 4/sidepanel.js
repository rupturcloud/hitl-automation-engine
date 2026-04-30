// popup.js
let intervalId = null;

const DEFAULT_CONFIG = {
  bankrollInicial: 30000,
  bankrollAtual: 30000,
  stakeBase: 150,
  desabilitarLimiteStake: false,
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
  ['shadowMode','autoStart','showOverlay','protecaoEmpate','desabilitarLimiteStake'].forEach((key) => {
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
  const desabilitarLimite = Boolean(el('cfg-desabilitarLimiteStake')?.checked);
  const stakeMax = desabilitarLimite ? 999999 : 150;
  const stakeBase = Math.min(stakeMax, Math.max(5, Number(el('cfg-stakeBase')?.value || DEFAULT_CONFIG.stakeBase)));
  const maxGales = Math.min(9, Math.max(0, Number(el('cfg-maxGales')?.value || DEFAULT_CONFIG.maxGales)));
  const valorProtecao = Math.min(150, Math.max(0, Number(el('cfg-valorProtecao')?.value || DEFAULT_CONFIG.valorProtecao)));
  const atual = await carregarConfigPainel();

  let bankrollInicial = Number(el('cfg-bankrollInicial')?.value || DEFAULT_CONFIG.bankrollInicial);
  if (!Number.isFinite(bankrollInicial) || bankrollInicial < 100) {
    console.warn('[CONFIG] Bankroll inválido detectado:', bankrollInicial, '→ resetando para', DEFAULT_CONFIG.bankrollInicial);
    bankrollInicial = DEFAULT_CONFIG.bankrollInicial;
    el('cfg-bankrollInicial').value = bankrollInicial;
  }
  const bankrollAtual = Number.isFinite(Number(atual.bankrollAtual)) ? Number(atual.bankrollAtual) : bankrollInicial;
  return {
    ...DEFAULT_CONFIG,
    bankrollInicial,
    bankrollAtual,
    stakeBase,
    desabilitarLimiteStake,
    stakeMin: 5,
    stakeMax: desabilitarLimite ? 999999 : 150,
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

function money(v) { return `R$ ${Number(v || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; }

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

  // Preencher Semáforo
  const semaforoEl = document.getElementById('semaforo');
  if (semaforoEl) {
    semaforoEl.classList.toggle('hidden', !mostrarOperacao);
    if (status.semaforo) {
      document.getElementById('semaforo-luz').style.background = status.semaforo.cor;
      document.getElementById('semaforo-texto').textContent = status.semaforo.status;
      document.getElementById('semaforo-score').textContent = `Confiança: ${status.semaforo.confianca}% (Pts P:${status.semaforo.p} B:${status.semaforo.b})`;

      document.querySelectorAll('.m-btn').forEach(btn => {
        const isIndicated = status.semaforo.status === 'INDICADO' && btn.getAttribute('data-side') === status.semaforo.acao;
        btn.classList.toggle('indicated', isIndicated);
      });
    }
  }

  // Atualizar Janela de Entrada
  const entryWindowEl = document.getElementById('entry-window');
  if (entryWindowEl && status.janelaEntrada) {
    const janelaAtiva = status.janelaEntrada.aberta || status.janelaEntrada.fase !== 'aguardando';
    entryWindowEl.classList.toggle('hidden', !janelaAtiva);

    if (janelaAtiva) {
      document.getElementById('entry-dot').style.background = status.janelaEntrada.cor;
      document.getElementById('entry-title').textContent = status.janelaEntrada.titulo;
      document.getElementById('entry-count').textContent =
        status.janelaEntrada.segundos > 0 ? `${status.janelaEntrada.segundos}s` : '--';
      document.getElementById('entry-msg').textContent = status.janelaEntrada.mensagem;
    }
  }

  // Mostrar painel manual
  document.getElementById('manual-panel')?.classList.toggle('hidden', !mostrarOperacao);

  // Atualizar painel automático (Executar Agora)
  const autoExecPanel = document.getElementById('auto-exec-panel');
  if (autoExecPanel) {
    const temSugestao = Boolean(status.ultimaAnalise && status.ultimaAnalise.acao && ['P', 'B', 'T'].includes(status.ultimaAnalise.acao));
    const autoExecBtn = document.getElementById('btn-auto-exec');

    autoExecPanel.classList.toggle('hidden', !temSugestao || !mostrarOperacao);

    if (temSugestao) {
      const { acao, motivo, confianca = 0, lucroEstimado = 0 } = status.ultimaAnalise;
      const acaoLabel = {
        'P': 'AZUL (Player)',
        'B': 'VERMELHO (Banker)',
        'T': 'EMPATE (Tie)'
      }[acao] || acao;

      const infoDiv = document.getElementById('auto-exec-info');
      infoDiv.innerHTML = `
        <div style="font-weight:900;color:#111;margin-bottom:6px;">✓ Padrão Detectado</div>
        <div style="font-size:12px;line-height:1.4;color:#333;margin-bottom:4px;">
          <b>Ação:</b> ${acaoLabel}<br>
          <b>Confiança:</b> ${confianca}%<br>
          <b>Motivo:</b> ${motivo || 'Padrão confiável detectado'}<br>
          ${lucroEstimado > 0 ? `<b>Lucro Est.:</b> +${money(lucroEstimado)}<br>` : ''}
        </div>
      `;

      autoExecBtn.disabled = false;
      autoExecBtn.classList.remove('disabled');
      autoExecBtn.textContent = `EXECUTAR AGORA - ${acaoLabel}`;
    }
  }
}

// LOGICA PAINEL MANUAL
let manualSide = null;
let manualStake = 5;
let manualCountdown = null;

function resetManualPanel() {
  clearTimeout(manualCountdown);
  manualCountdown = null;
  manualSide = null;
  document.querySelectorAll('.m-btn').forEach(b => b.classList.remove('selected'));
  document.getElementById('btn-manual-bet').disabled = true;
  document.getElementById('btn-manual-bet').classList.add('disabled');
  document.getElementById('btn-manual-cancel').disabled = true;
  document.getElementById('btn-manual-cancel').classList.add('disabled');
  document.getElementById('btn-manual-cancel').textContent = 'CANCELAR';
  document.getElementById('manual-status').textContent = 'Selecione cor e valor para apostar manualmente.';
}

function inicializarManualPanel() {
  // Seleção de Stake
  document.querySelectorAll('.m-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.m-chip').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      manualStake = Number(btn.getAttribute('data-val'));
    });
  });
  // Stake padrao 5
  document.querySelector('.m-chip[data-val="5"]')?.classList.add('selected');

  // Seleção de Cor (Modo SMOKE TEST - Gatilho Imediato)
  document.querySelectorAll('.m-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (manualCountdown) return; // Proteção
      
      document.querySelectorAll('.m-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      manualSide = btn.getAttribute('data-side');
      const sideName = manualSide === 'P' ? 'AZUL' : manualSide === 'B' ? 'VERMELHO' : 'EMPATE';
      
      // Feedback imediato no painel
      document.getElementById('manual-status').innerHTML = `<span style="color:#10b981;font-weight:bold">SMOKE TEST: Disparando aposta R$ ${manualStake} para ${sideName}!</span>`;
      
      // Dispara diretamente o comando de aposta para a ponte/iframe
      await send('MANUAL_BET', { acao: manualSide, stake: manualStake, gale: 0 });
      
      // Volta ao estado inicial após 2.5s
      setTimeout(resetManualPanel, 2500);
    });
  });

  // Botão Apostar original agora é desnecessário no modo de teste, mas manteremos o listener sem o countdown apenas por segurança
  document.getElementById('btn-manual-bet')?.addEventListener('click', () => {
    if (!manualSide) return;
    document.getElementById('manual-status').innerHTML = `<span style="color:#ef4444;font-weight:bold">Use os botões de cor (Azul/Tie/Vermelho) para testar os cliques diretamente!</span>`;
  });

  // Botão Cancelar
  document.getElementById('btn-manual-cancel')?.addEventListener('click', () => {
    if (manualCountdown) clearInterval(manualCountdown);
    resetManualPanel();
  });
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
  try { window.close(); } catch (_) {}
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-toggle').addEventListener('click', async () => {
    console.log(`[PAINEL] Botão Ligar/Desligar clicado`);
    if (document.getElementById('btn-toggle').classList.contains('disabled')) {
      alert('Recarregue a página da mesa Bac Bo para conectar o robô.');
      return;
    }
    console.log(`[PAINEL] Enviando TOGGLE_ROBO...`);
    const res = await send('TOGGLE_ROBO');
    console.log(`[PAINEL] Resposta recebida:`, res);
    if (res?.message) console.log(`[PAINEL] Mensagem:`, res.message);
    if (!res?.success) console.error(`[PAINEL] ✗ Erro ao toggle: falha de resposta`);
    else console.log(`[PAINEL] ✓ Toggle bem-sucedido, robô agora:`, res.ativo ? 'ATIVO' : 'INATIVO');
    console.log(`[PAINEL] Atualizando status...`);
    await atualizar();
    console.log(`[PAINEL] ✓ Status atualizado`);
  });
  document.getElementById('btn-float')?.addEventListener('click', abrirOverlayFlutuante);
  document.getElementById('btn-options').addEventListener('click', () => document.getElementById('cfg-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  document.getElementById('btn-export').addEventListener('click', exportarCsv);

  document.getElementById('btn-auto-exec')?.addEventListener('click', async () => {
    const btn = document.getElementById('btn-auto-exec');
    btn.disabled = true;
    btn.textContent = 'Enviando...';

    const status = await send('GET_STATUS');
    if (status?.ultimaAnalise) {
      const { acao, motivo, confianca } = status.ultimaAnalise;
      const res = await send('EXECUTAR_SUGESTAO_AGORA', {
        sugestao: { acao, motivo, confianca }
      });

      if (res?.success) {
        const acaoLabel = { 'P': 'AZUL', 'B': 'VERMELHO', 'T': 'EMPATE' }[acao];
        document.getElementById('auto-exec-status').innerHTML = `<span style="color:#10b981;font-weight:bold">✓ Aposta ${acaoLabel} executada!</span>`;
      } else {
        document.getElementById('auto-exec-status').innerHTML = `<span style="color:#ef4444;font-weight:bold">✗ Erro ao executar aposta</span>`;
      }
    }

    setTimeout(async () => {
      await atualizar();
    }, 1500);
  });

  // Painel diagnóstico de seletores
  let diagPanelOpen = false;
  document.getElementById('btn-diag-toggle')?.addEventListener('click', () => {
    diagPanelOpen = !diagPanelOpen;
    const diagPanel = document.getElementById('diag-panel');
    if (diagPanelOpen) {
      diagPanel.classList.remove('hidden');
      document.getElementById('btn-diag-toggle').textContent = 'Esconder Diagnóstico';
    } else {
      diagPanel.classList.add('hidden');
      document.getElementById('btn-diag-toggle').textContent = 'Abrir Diagnóstico';
    }
  });

  document.querySelectorAll('[data-diag-val]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const valor = Number(btn.getAttribute('data-diag-val'));
      const statusDiv = document.getElementById('diag-status');
      btn.disabled = true;
      btn.style.opacity = '0.5';
      statusDiv.innerHTML = `<span style="color:#f59e0b;font-weight:bold">Testando R$ ${valor}...</span>`;

      // Executa aposta de teste com valor pequeno (apenas teste de seletor)
      const res = await send('MANUAL_BET', { acao: 'P', stake: valor, gale: 0 });

      if (res?.success) {
        statusDiv.innerHTML = `<span style="color:#10b981;font-weight:bold">✓ Chip R$ ${valor} selecionado com sucesso!</span>`;
      } else {
        statusDiv.innerHTML = `<span style="color:#ef4444;font-weight:bold">✗ Chip R$ ${valor} falhou: problemas com seletor</span>`;
      }

      btn.disabled = false;
      btn.style.opacity = '1';
      setTimeout(() => {
        statusDiv.innerHTML = 'Clique em um chip para testar se consegue encontrá-lo (aposta de teste em AZUL).';
      }, 4000);
    });
  });

  inicializarConfigPainel();
  inicializarManualPanel();
  atualizar();
  intervalId = setInterval(atualizar, 1200);
});

window.addEventListener('unload', () => { if (intervalId) clearInterval(intervalId); });

// options.js — Lógica de Configurações (usa chrome.storage.local para consistência com o resto da extensão)

const DEFAULT_CONFIG = {
  bankrollInicial: 30000,
  bankrollAtual: 30000,
  stakeBase: 150,
  stakeMin: 5,
  stakeMax: 150,
  metaLucro: 4000,
  metaSaldoAlvo: 34000,
  stopLoss: 2000,
  stopLossSaldo: 30000,
  maxGales: 2,
  multiplicadorGale: 2,
  protecaoEmpate: true,
  valorProtecao: 10,
  valorProtecaoMax: 150,
  shadowMode: true,
  autoStart: false,
  hitlCountdownSegundos: 8,
  wsUrl: 'ws://localhost:8765',
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

document.addEventListener('DOMContentLoaded', () => {
  const btnSalvar = document.getElementById('btnSalvar');
  const msgSuccess = document.getElementById('msgSuccess');

  // Carregar configurações salvas
  chrome.storage.local.get(['willDadosConfig', 'willDadosProxyConfig'], (result) => {
    const config = { ...DEFAULT_CONFIG, ...(result.willDadosConfig || {}) };
    config.padroesAtivos = { ...DEFAULT_CONFIG.padroesAtivos, ...(config.padroesAtivos || {}) };
    const proxyConfig = result.willDadosProxyConfig || { enabled: false };

    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
    const setChk = (id, val) => { const el = document.getElementById(id); if (el) el.checked = Boolean(val); };

    setVal('bankroll', config.bankrollAtual);
    setVal('stakeBase', config.stakeBase);
    setVal('metaLucro', config.metaLucro);
    setVal('stopLoss', config.stopLoss);
    setVal('maxGales', config.maxGales);
    setVal('valorProtecao', config.valorProtecao);
    setChk('protecaoEmpate', config.protecaoEmpate);

    setChk('padraoXadrez', config.padroesAtivos.xadrez);
    setChk('padraoCasadinho', config.padroesAtivos.casadinho);
    setChk('padraoDiagonal', config.padroesAtivos.empateLado);
    setChk('padraoLinhaDevedora', config.padroesAtivos.linhaDevedora);
    setChk('padraoPosEmpate', config.padroesAtivos.posEmpate);
    setChk('padraoTrasPraFrente', config.padroesAtivos.trasParaFrente);
    setChk('padraoSurf', config.padroesAtivos.surf);

    // Carregar proxy config
    setChk('proxyEnabled', proxyConfig.enabled);
    setVal('proxyHost', proxyConfig.host || '');
    setVal('proxyPort', proxyConfig.port || 9595);
    setVal('proxyUsername', proxyConfig.username || '');
    setVal('proxyPassword', proxyConfig.password || '');
  });

  // Salvar configurações
  btnSalvar.addEventListener('click', () => {
    // Buscar config atual para preservar campos que não estão na options page
    chrome.storage.local.get(['willDadosConfig'], (result) => {
      const anterior = result.willDadosConfig || {};
      const padroesAnteriores = anterior.padroesAtivos || DEFAULT_CONFIG.padroesAtivos;

      const config = {
        ...DEFAULT_CONFIG,
        ...anterior,
        bankrollAtual: parseInt(document.getElementById('bankroll').value) || DEFAULT_CONFIG.bankrollAtual,
        bankrollInicial: parseInt(document.getElementById('bankroll').value) || DEFAULT_CONFIG.bankrollInicial,
        stakeBase: Math.min(150, Math.max(5, parseInt(document.getElementById('stakeBase').value) || DEFAULT_CONFIG.stakeBase)),
        metaLucro: parseInt(document.getElementById('metaLucro').value) || DEFAULT_CONFIG.metaLucro,
        stopLoss: parseInt(document.getElementById('stopLoss').value) || DEFAULT_CONFIG.stopLoss,
        maxGales: Math.min(9, Math.max(0, parseInt(document.getElementById('maxGales').value) || DEFAULT_CONFIG.maxGales)),
        protecaoEmpate: document.getElementById('protecaoEmpate').checked,
        valorProtecao: Math.min(150, Math.max(0, parseInt(document.getElementById('valorProtecao').value) || DEFAULT_CONFIG.valorProtecao)),
        padroesAtivos: {
          ...padroesAnteriores,
          xadrez: document.getElementById('padraoXadrez').checked,
          casadinho: document.getElementById('padraoCasadinho').checked,
          empateLado: document.getElementById('padraoDiagonal').checked,
          linhaDevedora: document.getElementById('padraoLinhaDevedora').checked,
          posEmpate: document.getElementById('padraoPosEmpate').checked,
          trasParaFrente: document.getElementById('padraoTrasPraFrente').checked,
          surf: document.getElementById('padraoSurf').checked
        }
      };

      // Salvar configurações de proxy separadamente
      const proxyConfig = {
        enabled: document.getElementById('proxyEnabled').checked,
        host: document.getElementById('proxyHost').value || '',
        port: parseInt(document.getElementById('proxyPort').value) || 9595,
        username: document.getElementById('proxyUsername').value || '',
        password: document.getElementById('proxyPassword').value || '',
        scheme: 'socks5'
      };

      // Validar se proxy está ativado e tem credenciais
      if (proxyConfig.enabled && (!proxyConfig.host || !proxyConfig.username || !proxyConfig.password)) {
        alert('⚠️ Proxy ativado mas faltam credenciais (host, usuário ou senha)');
        return;
      }

      chrome.storage.local.set({
        willDadosConfig: config,
        willDadosProxyConfig: proxyConfig
      }, () => {
        // Notificar background.js para reconfigurar proxy
        chrome.runtime.sendMessage({ action: 'RECONFIG_PROXY' }, () => void chrome.runtime.lastError);

        // Notifica o content script para atualizar configurações em tempo real
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, {
              action: 'UPDATE_CONFIG',
              config: config
            }, () => void chrome.runtime.lastError);
          }
        });

        msgSuccess.style.display = 'block';
        setTimeout(() => { msgSuccess.style.display = 'none'; }, 2500);
      });
    });
  });
});
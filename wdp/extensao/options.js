// options.js - Lógica de Configurações

document.addEventListener('DOMContentLoaded', () => {
  const btnSalvar = document.getElementById('btnSalvar');
  const msgSuccess = document.getElementById('msgSuccess');

  // Carregar configurações salvas
  chrome.storage.sync.get(['willDadosConfig'], (result) => {
    const config = result.willDadosConfig || getDefaultConfig();

    document.getElementById('bankroll').value = config.bankrollAtual || 30000;
    document.getElementById('stakeBase').value = config.stakeBase || 25;
    document.getElementById('metaLucro').value = config.metaLucro || 1500;
    document.getElementById('stopLoss').value = config.stopLoss || 800;
    document.getElementById('maxGales').value = config.maxGales || 2;
    document.getElementById('protecaoEmpate').checked = config.protecaoEmpate !== false;
    document.getElementById('valorProtecao').value = config.valorProtecao || 5;

    document.getElementById('padraoXadrez').checked = config.padroesAtivos?.xadrez !== false;
    document.getElementById('padraoCasadinho').checked = config.padroesAtivos?.casadinho !== false;
    document.getElementById('padraoDiagonal').checked = config.padroesAtivos?.diagonal !== false;
    document.getElementById('padraoLinhaDevedora').checked = config.padroesAtivos?.linhaDevedora !== false;
    document.getElementById('padraoPosEmpate').checked = config.padroesAtivos?.posEmpate !== false;
    document.getElementById('padraoTrasPraFrente').checked = config.padroesAtivos?.trasPraFrente !== false;
    document.getElementById('padraoSurf').checked = config.padroesAtivos?.surf === true;
  });

  // Salvar configurações
  btnSalvar.addEventListener('click', () => {
    const config = {
      bankrollAtual: parseInt(document.getElementById('bankroll').value) || 30000,
      stakeBase: parseInt(document.getElementById('stakeBase').value) || 25,
      metaLucro: parseInt(document.getElementById('metaLucro').value) || 1500,
      stopLoss: parseInt(document.getElementById('stopLoss').value) || 800,
      maxGales: parseInt(document.getElementById('maxGales').value) || 2,
      protecaoEmpate: document.getElementById('protecaoEmpate').checked,
      valorProtecao: parseInt(document.getElementById('valorProtecao').value) || 5,
      padroesAtivos: {
        xadrez: document.getElementById('padraoXadrez').checked,
        casadinho: document.getElementById('padraoCasadinho').checked,
        diagonal: document.getElementById('padraoDiagonal').checked,
        linhaDevedora: document.getElementById('padraoLinhaDevedora').checked,
        posEmpate: document.getElementById('padraoPosEmpate').checked,
        trasPraFrente: document.getElementById('padraoTrasPraFrente').checked,
        surf: document.getElementById('padraoSurf').checked
      }
    };

    chrome.storage.sync.set({ willDadosConfig: config }, () => {
      // Notifica o content script para atualizar configurações em tempo real
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: "UPDATE_CONFIG",
            config: config
          });
        }
      });

      msgSuccess.style.display = 'block';
      setTimeout(() => { msgSuccess.style.display = 'none'; }, 2500);
    });
  });
});

function getDefaultConfig() {
  return {
    bankrollAtual: 30000,
    stakeBase: 25,
    metaLucro: 1500,
    stopLoss: 800,
    maxGales: 2,
    protecaoEmpate: true,
    valorProtecao: 5,
    padroesAtivos: {
      xadrez: true,
      casadinho: true,
      diagonal: true,
      linhaDevedora: true,
      posEmpate: true,
      trasPraFrente: true,
      surf: false
    }
  };
}
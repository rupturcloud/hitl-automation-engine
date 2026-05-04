// Content Script Bridge para a Banca Bet AI
// Este script é agnóstico à interface visual e depende apenas do contrato data-betia-id

// 1. Pulsação (Heartbeat) - Avisa a banca que o robô está conectado
setInterval(() => {
  window.postMessage({ type: "BETIA_HEARTBEAT", timestamp: Date.now() }, "*");
}, 1000);

// 2. Listener para mensagens vindo do Robô (via window.postMessage)
window.addEventListener('message', (event) => {
  // Filtra mensagens que não são do Bet IA
  if (!event.data || !event.data.type) return;

  const request = event.data;
  console.log("[Bet IA Content] Mensagem via Window:", request.type);

  // Executa comandos diretamente se vierem do robô
  handleBetiaCommands(request, (response) => {
    // Opcional: Enviar resposta de volta via window.postMessage
    window.postMessage({ type: `${request.type}_RESPONSE`, ...response }, "*");
  });
});

// 3. Listener para mensagens vindo da Extensão (Background/Popup)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("[Bet IA Content] Mensagem via Runtime:", request.type);
  handleBetiaCommands(request, sendResponse);
  return true;
});

// 4. Lógica centralizada de comandos
function handleBetiaCommands(request, sendResponse) {
  if (request.type === "GET_GAME_DATA") {
    const timerElement = document.querySelector('[data-betia-id="timer"]');
    const balanceElement = document.querySelector('[data-betia-id="balance"]');
    const lastResultElement = document.querySelector('[data-betia-result]');
    const lastResult = lastResultElement ? lastResultElement.getAttribute('data-betia-result') : "NONE";

    const gameData = {
      lastResult: lastResult,
      timer: timerElement?.innerText || "0",
      balance: balanceElement?.innerText || "R$ 0,00",
      status: timerElement?.innerText === "0" ? "RESULT" : "BETTING"
    };
    sendResponse(gameData);
    
    // Sincroniza via window.postMessage também para o robô na mesma página
    window.postMessage({ type: 'GAME_STATE_UPDATE', ...gameData }, "*");
  }

  if (request.type === "CLEAR_BETS") {
    const clearButton = document.querySelector('[data-betia-id="bet-clear"]');
    if (clearButton) {
      clearButton.click();
      sendResponse({ success: true });
    } else {
      sendResponse({ success: false, message: "Botão de limpar não encontrado." });
    }
  }

  if (request.type === "MANUAL_BET_MULTIPLE") {
    const { bets } = request;
    console.log("[Bet IA Content] Executando múltiplas apostas:", bets);
    
    const selectChip = (value) => {
      const chipBtn = document.querySelector(`[data-betia-id="chip-${value}"]`);
      if (chipBtn) {
        chipBtn.click();
        return true;
      }
      return false;
    };

    Object.entries(bets).forEach(([target, amount]) => {
      let remaining = Number(amount);
      if (remaining <= 0) return;

      const actionId = `bet-${target.toLowerCase()}`;
      const targetButton = document.querySelector(`[data-betia-id="${actionId}"]`);
      
      console.log(`[Bet IA Content] Apostando ${amount} em ${target} (Botão: ${actionId})`);

      if (targetButton) {
        const availableChips = [500, 100, 50, 25, 10, 5];
        availableChips.forEach(chipValue => {
          while (remaining >= chipValue) {
            if (selectChip(chipValue)) {
              console.log(`[Bet IA Content] Clicando com ficha ${chipValue} em ${target}`);
              targetButton.click();
              remaining -= chipValue;
            } else {
              break;
            }
          }
        });
      } else {
        console.error(`[Bet IA Content] Botão de aposta ${actionId} não encontrado!`);
      }
    });

    // Clica no botão de CONFIRMAR da banca se existir
    const confirmButton = document.querySelector('[data-betia-id="bet-confirm"]');
    if (confirmButton) {
      console.log("[Bet IA Content] Clicando no botão de CONFIRMAÇÃO AUTOMÁTICA");
      setTimeout(() => confirmButton.click(), 500);
    } else {
      console.warn("[Bet IA Content] Botão de confirmação 'bet-confirm' não encontrado.");
    }
    
    sendResponse({ success: true });
  }

  if (request.type === "EXECUTE_BET") {
    const actionId = `bet-${request.target.toLowerCase()}`;
    const targetButton = document.querySelector(`[data-betia-id="${actionId}"]`);
    if (targetButton) {
      targetButton.click();
      sendResponse({ success: true });
    } else {
      sendResponse({ success: false });
    }
  }
}


// Content Script Bridge para a Banca Bet AI
// Este script é agnóstico à interface visual e depende apenas do contrato data-betia-id

// 1. Pulsação (Heartbeat) - Avisa a banca que o robô está conectado
setInterval(() => {
  window.postMessage({ type: "BETIA_HEARTBEAT", timestamp: Date.now() }, "*");
}, 1000);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("[Bet IA Content] Comando recebido:", request.type);

  if (request.type === "GET_GAME_DATA") {
    // Captura dados via atributos semânticos data-betia-id
    const timerElement = document.querySelector('[data-betia-id="timer"]');
    const balanceElement = document.querySelector('[data-betia-id="balance"]');
    
    // Captura o último resultado via data-betia-result
    const lastResultElement = document.querySelector('[data-betia-result]');
    const lastResult = lastResultElement ? lastResultElement.getAttribute('data-betia-result') : "NONE";

    const gameData = {
      lastResult: lastResult,
      timer: timerElement?.innerText || "0",
      balance: balanceElement?.innerText || "R$ 0,00"
    };
    sendResponse(gameData);
  }

  if (request.type === "EXECUTE_BET") {
    // Busca o botão específico pelo ID de ação semântica
    const actionId = `bet-${request.target.toLowerCase()}`; // bet-player, bet-banker, bet-tie
    const targetButton = document.querySelector(`[data-betia-id="${actionId}"]`);
    
    if (targetButton) {
      targetButton.click();
      sendResponse({ success: true, message: `Ação ${actionId} executada com sucesso.` });
    } else {
      // Fallback para login ou outras áreas se necessário
      const genericButton = document.querySelector(`[data-betia-id="login-btn"]`);
      if (genericButton && request.target === "LOGIN") {
        genericButton.click();
        sendResponse({ success: true, message: "Login acionado." });
      } else {
        sendResponse({ success: false, message: `Elemento ${request.target} não encontrado.` });
      }
    }
  }

  return true;
});

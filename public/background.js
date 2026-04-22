// Garante que o Side Panel abra ao clicar no ícone da extensão
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

// Escuta a instalação para configurar regras iniciais se necessário
chrome.runtime.onInstalled.addListener(() => {
  console.log("[Bet IA] Extensão instalada com sucesso.");
});

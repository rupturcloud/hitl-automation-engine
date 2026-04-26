/**
 * J.A.R.V.I.S. Extension - Background Service Worker
 * Gerencia ciclo de vida da extensão e comunicação persistente
 */

// Estado da extensão
const extensionState = {
    connected: false,
    daemon: null,
};

/**
 * Ao instalar/atualizar a extensão
 */
chrome.runtime.onInstalled.addListener((details) => {
    console.log('[Background] Extension installed/updated:', details.reason);

    if (details.reason === 'install') {
        // Abrir página de boas-vindas
        chrome.tabs.create({ url: 'popup.html' });
    }
});

/**
 * Mensagens do popup ou content scripts
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('[Background] Message received:', request.type);

    switch (request.type) {
        case 'UPDATE_BANKROLL':
            // Mensagem do content.js - repassar para popup
            console.log('[Background] Bankroll atualizado:', request.bankroll);
            console.log('[Background] Histórico:', request.history);

            chrome.runtime.sendMessage({
                type: 'UPDATE_BANKROLL',
                bankroll: request.bankroll,
                roundId: request.roundId,
                history: request.history,
                timestamp: request.timestamp
            }).catch(() => {
                // Popup pode não estar aberto - ignorar erro
                console.warn('[Background] Popup não está aberto, tentando novamente em 500ms');
                setTimeout(() => {
                    chrome.runtime.sendMessage({
                        type: 'UPDATE_BANKROLL',
                        bankroll: request.bankroll,
                        roundId: request.roundId,
                        history: request.history,
                        timestamp: request.timestamp
                    }).catch(() => {
                        console.warn('[Background] Impossível alcançar popup');
                    });
                }, 500);
            });
            sendResponse({ success: true });
            break;

        case 'CHECK_STATUS':
            sendResponse({
                status: 'ok',
                connected: extensionState.connected,
                timestamp: new Date().toISOString()
            });
            break;

        case 'GET_CONFIG':
            chrome.storage.local.get(['daemonUrl'], (result) => {
                sendResponse({
                    daemonUrl: result.daemonUrl || 'ws://localhost:8765'
                });
            });
            // Retorna true para manter o canal aberto
            return true;

        case 'SAVE_CONFIG':
            chrome.storage.local.set(request.data, () => {
                sendResponse({ success: true });
            });
            return true;

        default:
            sendResponse({ error: 'Unknown message type' });
    }
});

/**
 * Handler para ações do ícone da extensão
 */
chrome.action.onClicked.addListener((tab) => {
    console.log('[Background] Action clicked');
    chrome.action.openPopup();
});

/**
 * Limpar estado ao desinstalar
 */
chrome.runtime.onSuspend.addListener(() => {
    console.log('[Background] Service worker suspending');
    // Cleanup se necessário
});

console.log('[Background] Service Worker initialized');

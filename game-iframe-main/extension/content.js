/**
 * J.A.R.V.I.S. Content Script
 * Extrai dados do Betboom e envia para popup
 */

const DEBUG = true; // Toggle para debug detalhado

function log(msg, data = null) {
    const prefix = '[JARVIS:Content]';
    if (data) {
        console.log(`${prefix} ${msg}`, data);
    } else {
        console.log(`${prefix} ${msg}`);
    }
}

function debug(msg, data = null) {
    if (!DEBUG) return;
    const prefix = '[JARVIS:Content:DEBUG]';
    if (data) {
        console.log(`${prefix} ${msg}`, data);
    } else {
        console.log(`${prefix} ${msg}`);
    }
}

// Extrair saldo da página - com múltiplas estratégias
function extractBankroll() {
    try {
        log('=== INICIANDO EXTRAÇÃO DE SALDO ===');

        // Estratégia 1: Procurar por "R$" no texto da página
        debug('Estratégia 1: Regex /R\\$\\s*([\\d.,]+)/ no pageText');
        const pageText = document.body.innerText;
        debug('Tamanho do pageText:', pageText.length);

        let match = pageText.match(/R\$\s*([\d.,]+)/);
        if (match) {
            debug('Match encontrado na Estratégia 1:', match[0]);
            const value = match[1].replace(/\./g, '').replace(',', '.');
            const parsed = parseFloat(value);
            if (!isNaN(parsed) && parsed > 0 && parsed < 1000000) {
                log(`✅ Estratégia 1 SUCESSO: R$ ${parsed.toFixed(2)}`);
                return parsed;
            } else {
                debug(`❌ Estratégia 1: valor inválido ou muito grande: ${parsed}`);
            }
        } else {
            debug('❌ Estratégia 1: Nenhum match encontrado');
        }

        // Estratégia 2: Procurar em seletores específicos
        debug('Estratégia 2: Testando seletores CSS específicos');
        const selectors = [
            // Betboom específico
            '[class*="Header"]',
            '[class*="UserBalance"]',
            '[class*="Balance"]',

            // Genérico
            '.bankroll',
            '.balance',
            '.saldo',
            '[data-bankroll]',
            '[data-balance]',
            '[data-saldo]',
            '.account-balance',
            '.player-balance',

            // Por conteúdo
            '[class*="balance"]',
            '[class*="bankroll"]',
            '[class*="saldo"]',
            '[class*="user"]'
        ];

        for (let selector of selectors) {
            const elements = document.querySelectorAll(selector);
            debug(`Seletor "${selector}": ${elements.length} elementos`);

            for (let element of elements) {
                const text = element.innerText || element.textContent;
                const elementMatch = text.match(/R?\$?\s*([\d.,]+)/);

                if (elementMatch) {
                    const value = elementMatch[1].replace(/\./g, '').replace(',', '.');
                    const parsed = parseFloat(value);

                    if (!isNaN(parsed) && parsed > 0 && parsed < 1000000) {
                        log(`✅ Estratégia 2 SUCESSO (${selector}): R$ ${parsed.toFixed(2)}`);
                        debug('Elemento HTML:', element.outerHTML.substring(0, 200));
                        return parsed;
                    }
                }
            }
        }
        debug('❌ Estratégia 2: Nenhum seletor retornou valor válido');

        // Estratégia 3: Busca agressiva por iframes
        debug('Estratégia 3: Procurando em iframes');
        const iframes = document.querySelectorAll('iframe');
        debug(`Total de iframes: ${iframes.length}`);

        for (let i = 0; i < iframes.length; i++) {
            try {
                const iframeDoc = iframes[i].contentDocument || iframes[i].contentWindow?.document;
                if (!iframeDoc) {
                    debug(`  Iframe ${i}: não conseguiu acessar document (CORS?)`);
                    continue;
                }

                const iframeText = iframeDoc.body.innerText;
                const iframeMatch = iframeText.match(/R\$\s*([\d.,]+)/);

                if (iframeMatch) {
                    const value = iframeMatch[1].replace(/\./g, '').replace(',', '.');
                    const parsed = parseFloat(value);

                    if (!isNaN(parsed) && parsed > 0 && parsed < 1000000) {
                        log(`✅ Estratégia 3 SUCESSO (iframe ${i}): R$ ${parsed.toFixed(2)}`);
                        return parsed;
                    }
                }
            } catch (e) {
                debug(`  Iframe ${i}: Erro ao acessar -`, e.message);
            }
        }
        debug('❌ Estratégia 3: Iframes não contêm dados válidos');

        // Estratégia 4: Procurar por atributos data-*
        debug('Estratégia 4: Procurando em atributos data-* globalmente');
        const allElements = document.querySelectorAll('[data-*]');
        for (let el of allElements) {
            for (let attr of el.attributes) {
                if (attr.name.startsWith('data-')) {
                    const match = attr.value.match(/R?\$?\s*([\d.,]+)/);
                    if (match) {
                        const value = match[1].replace(/\./g, '').replace(',', '.');
                        const parsed = parseFloat(value);

                        if (!isNaN(parsed) && parsed > 0 && parsed < 1000000) {
                            log(`✅ Estratégia 4 SUCESSO (${attr.name}): R$ ${parsed.toFixed(2)}`);
                            return parsed;
                        }
                    }
                }
            }
        }
        debug('❌ Estratégia 4: Nenhum atributo data-* contém saldo válido');

        log('❌ TODAS AS ESTRATÉGIAS FALHARAM - Saldo não encontrado');
        return null;
    } catch (error) {
        console.error('[JARVIS:Content] ERRO CRÍTICO ao extrair saldo:', error);
        return null;
    }
}

// Extrair round ID se estiver em jogo
function extractRoundId() {
    // Procurar por padrão de round nas mensagens
    const text = document.body.innerText;
    const match = text.match(/round[_-]?(\d+)/i);
    return match ? match[0] : 'round-unknown';
}

// Extrair histórico de rodadas (BLUE, RED, TIE)
function extractRoundHistory() {
    try {
        debug('Tentando extrair histórico de rodadas...');

        // Tentar procurar por contadores visuais
        // Betboom geralmente mostra: "BLUE: 44  RED: 46  TIE: 10" ou similar

        const pageText = document.body.innerText;

        // Padrão 1: "BLUE: 44 RED: 46 TIE: 10"
        let match = pageText.match(/BLUE[:\s]+(\d+)[^R]*RED[:\s]+(\d+)[^T]*TIE[:\s]+(\d+)/i);
        if (match) {
            debug('Padrão 1 encontrado');
            return {
                blue: parseInt(match[1]),
                red: parseInt(match[2]),
                tie: parseInt(match[3])
            };
        }

        // Padrão 2: "44 46 10" próximo a "BLUE RED TIE"
        match = pageText.match(/(?:BLUE|azul)[^0-9]*(\d+)[^0-9]+(?:RED|vermelho)[^0-9]*(\d+)[^0-9]+(?:TIE|empate)[^0-9]*(\d+)/i);
        if (match) {
            debug('Padrão 2 encontrado');
            return {
                blue: parseInt(match[1]),
                red: parseInt(match[2]),
                tie: parseInt(match[3])
            };
        }

        debug('Nenhum padrão de histórico encontrado no texto');
        return null;
    } catch (error) {
        debug('Erro ao extrair histórico:', error.message);
        return null;
    }
}

// Enviar dados para o popup
function sendDataToPopup() {
    const bankroll = extractBankroll();
    const roundId = extractRoundId();
    const history = extractRoundHistory();

    if (bankroll !== null) {
        debug(`Enviando dados: bankroll=${bankroll}, roundId=${roundId}, history=${JSON.stringify(history)}`);

        // Enviar mensagem para o background script
        chrome.runtime.sendMessage({
            type: 'UPDATE_BANKROLL',
            bankroll: bankroll,
            roundId: roundId,
            history: history,
            timestamp: new Date().toISOString()
        }, (response) => {
            if (chrome.runtime.lastError) {
                debug('Popup não está aberto ou erro na resposta');
            } else {
                log(`✅ Dados enviados: R$ ${bankroll.toFixed(2)}`);
            }
        });
    }
}

// Monitorar mudanças na página
let mutationDebounce = null;
const observer = new MutationObserver(() => {
    // Debounce para não enviar muitas vezes
    clearTimeout(mutationDebounce);
    mutationDebounce = setTimeout(() => {
        sendDataToPopup();
    }, 500);
});

log('Iniciando MutationObserver...');

// Configurar observador
observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: false // Desativar para menos eventos
});

// Enviar dados iniciais (com delay para página carregar)
setTimeout(() => {
    log('Enviando dados iniciais (após 1s)');
    sendDataToPopup();
}, 1000);

// Enviar a cada 2 segundos também
let lastBankroll = null;
setInterval(() => {
    const bankroll = extractBankroll();
    // Só enviar se mudou
    if (bankroll !== lastBankroll) {
        debug('Saldo mudou, reenviando dados');
        sendDataToPopup();
        lastBankroll = bankroll;
    }
}, 2000);

log('🤖 Content script J.A.R.V.I.S. ativado com sucesso!');
debug(`URL: ${window.location.href}`);
debug(`Hostname: ${window.location.hostname}`);

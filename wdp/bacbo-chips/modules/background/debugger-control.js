// modules/background/debugger-control.js
// Responsabilidade: Gerenciar o Chrome DevTools Protocol (CDP).
// Permite controle total do navegador, pausar JS e simular cliques de hardware.

const DEBUGGER_VERSION = "1.3";

export async function attachDebugger(tabId) {
  if (!tabId || typeof tabId !== 'number') {
    console.warn(`[Bet IA Debugger] tabId inválido: ${tabId}`);
    return false;
  }

  try {
    const target = { tabId };
    
    // Verifica se já está anexado (getTargets pode falhar silenciosamente)
    let isAttached = false;
    try {
      const targets = await new Promise((resolve) =>
        chrome.debugger.getTargets((t) => resolve(t || [])),
      );
      isAttached = targets.some((t) => t.tabId === tabId && t.attached);
    } catch (_) {
      // Se getTargets falhar, prossegue tentando attach
    }
    
    if (isAttached) {
      console.log(`[Bet IA Debugger] Já anexado à tab ${tabId}`);
      return true;
    }

    await new Promise((resolve, reject) => {
      chrome.debugger.attach(target, DEBUGGER_VERSION, () => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message || 'Falha ao anexar debugger'));
        } else {
          resolve();
        }
      });
    });

    console.log(`[Bet IA Debugger] Anexado com sucesso à tab ${tabId}`);
    
    // Habilita domínios necessários
    await sendCommand(tabId, "Debugger.enable");
    await sendCommand(tabId, "Runtime.enable");
    
    return true;
  } catch (error) {
    const msg = error?.message || JSON.stringify(error) || 'Erro desconhecido';
    console.error(`[Bet IA Debugger] Erro ao anexar tab ${tabId}: ${msg}`);
    return false;
  }
}

export async function detachDebugger(tabId) {
  if (!tabId) return;
  try {
    await new Promise(resolve => chrome.debugger.detach({ tabId }, resolve));
    console.log(`[Bet IA Debugger] Desconectado da tab ${tabId}`);
  } catch (error) {
    // Ignora erros se já estiver desconectado
  }
}

export function sendCommand(tabId, method, params = {}) {
  return new Promise((resolve, reject) => {
    chrome.debugger.sendCommand({ tabId }, method, params, (result) => {
      if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
      else resolve(result);
    });
  });
}

// ─── Ações de Intervenção de Alta Precisão ────────────────────────────────────

// Pausa a execução de JS na página
export async function pauseExecution(tabId) {
  return sendCommand(tabId, "Debugger.pause");
}

// Retoma a execução de JS na página
export async function resumeExecution(tabId) {
  return sendCommand(tabId, "Debugger.resume");
}

// Obtém um snapshot estruturado da página (DOM + Layout)
// É assim que agentes de elite "enxergam" a página sem interferência de JS
export async function getSnapshot(tabId) {
  try {
    const document = await sendCommand(tabId, "DOM.getFlattenedDocument", { depth: -1, pierce: true });
    const layout = await sendCommand(tabId, "Page.getLayoutMetrics");
    
    return {
      document,
      layout,
      ts: Date.now()
    };
  } catch (error) {
    console.error(`[Bet IA Debugger] Erro ao obter snapshot:`, error);
    return null;
  }
}

// Executa um clique de hardware (ignora camadas de JS/Overlay)
export async function preciseClick(tabId, x, y) {
  // Move o mouse primeiro
  await sendCommand(tabId, "Input.dispatchMouseEvent", {
    type: "mouseMoved",
    x, y
  });

  await sendCommand(tabId, "Input.dispatchMouseEvent", {
    type: "mousePressed",
    x, y,
    button: "left",
    clickCount: 1
  });
  
  await sendCommand(tabId, "Input.dispatchMouseEvent", {
    type: "mouseReleased",
    x, y,
    button: "left",
    clickCount: 1
  });
}

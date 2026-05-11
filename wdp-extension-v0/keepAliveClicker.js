// keepAliveClicker.js — Mantém sessão viva com clicks periódicos leves
// Evita timeout de sessão em Evolution/Betboom

let keepAliveInterval = null;
let keepAliveEnabled = true;
const KEEP_ALIVE_INTERVAL = 45000; // 45 segundos

function startKeepAliveClicker() {
  if (keepAliveInterval) return; // Já rodando

  console.log('[Keep Alive] Iniciando clickzinho periódico (45s)');

  keepAliveInterval = setInterval(() => {
    if (!keepAliveEnabled) return;

    try {
      // Estratégia 1: Click leve em elemento body (não vai clicar em botões)
      const clickTarget = document.body;

      // Pegar posição segura (canto superior esquerdo, longe de botões)
      const rect = clickTarget.getBoundingClientRect();
      const x = Math.max(10, rect.left + 10);
      const y = Math.max(10, rect.top + 10);

      // Simular click real mas leve
      const mouseEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: x,
        clientY: y,
        buttons: 0
      });

      clickTarget.dispatchEvent(mouseEvent);

      console.log(`[Keep Alive] ✓ Click leve (${x}, ${y})`);
    } catch (error) {
      console.warn('[Keep Alive] Erro ao fazer click:', error.message);
    }
  }, KEEP_ALIVE_INTERVAL);

  console.log('[Keep Alive] ✓ Clickzinho ativado');
}

function stopKeepAliveClicker() {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
    console.log('[Keep Alive] Parado');
  }
}

function toggleKeepAliveClicker(enabled) {
  keepAliveEnabled = enabled;
  console.log(`[Keep Alive] ${enabled ? '✓ Ativado' : '✗ Desativado'}`);
}

// Iniciar automaticamente quando a página carregar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startKeepAliveClicker);
} else {
  startKeepAliveClicker();
}

// Parar se a aba for fechada ou desativada
window.addEventListener('beforeunload', stopKeepAliveClicker);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    console.log('[Keep Alive] Página oculta, pausando clicks');
    toggleKeepAliveClicker(false);
  } else {
    console.log('[Keep Alive] Página visível, resumindo clicks');
    toggleKeepAliveClicker(true);
  }
});

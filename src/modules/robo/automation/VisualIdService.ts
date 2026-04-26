
/**
 * VisualIdService - O "Olho" do Robô
 * Responsável por identificar elementos na tela via análise de DOM e visual.
 * Prioriza o contrato semântico 'data-betia-id' para garantir desacoplamento.
 */

export interface VisualElement {
  id: string;
  label: string;
  selector: string;
  confidence: number;
  type: 'button' | 'input' | 'frame' | 'indicator';
}

export type PageContext = 'LOGIN' | 'BAC_BO' | 'AVIATOR' | 'UNKNOWN';

export const VisualIdService = {
  /**
   * Identifica o contexto atual da página baseado no DOM.
   */
  async detectContext(): Promise<PageContext> {
    // 1. Prioridade: Contrato semântico interno
    if (document.querySelector('[data-betia-id="bet-player"]')) return 'BAC_BO';
    if (document.querySelector('[data-betia-id="aviator-main"]')) return 'AVIATOR';
    if (document.querySelector('[data-betia-id="login-form"]')) return 'LOGIN';

    // 2. Fallback: Estrutura genérica (para bancos externos)
    if (document.querySelector('form input[type="password"]')) return 'LOGIN';
    
    // 3. Fallback: URL
    const path = window.location.pathname;
    if (path.includes('bacbo')) return 'BAC_BO';
    if (path.includes('aviator')) return 'AVIATOR';
    
    return 'UNKNOWN';
  },

  /**
   * Analisa a página atual em busca de padrões de autenticação.
   */
  async identifyAuthElements(): Promise<VisualElement[]> {
    return [
      { 
        id: 'user_field', 
        label: 'Usuário', 
        selector: '[data-betia-id="login-user"], input[type="text"], input[type="email"]', 
        confidence: 0.95, 
        type: 'input' 
      },
      { 
        id: 'pass_field', 
        label: 'Senha', 
        selector: '[data-betia-id="login-pass"], input[type="password"]', 
        confidence: 0.98, 
        type: 'input' 
      },
      { 
        id: 'login_btn', 
        label: 'Entrar', 
        selector: '[data-betia-id="login-btn"], button[type="submit"]', 
        confidence: 0.92, 
        type: 'button' 
      }
    ];
  },

  /**
   * Identifica áreas do jogo
   */
  async identifyGameArea(gameName: string): Promise<VisualElement | null> {
    const selector = `[data-betia-id="${gameName.toLowerCase()}-area"], canvas, iframe`;
    return { id: 'game_canvas', label: `Área de ${gameName}`, selector, confidence: 0.85, type: 'frame' };
  }
};

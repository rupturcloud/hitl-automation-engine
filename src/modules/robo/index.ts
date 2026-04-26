import { useState, useCallback, useRef, useEffect } from 'react';
import { useAutomationAgent } from './automation/useAutomationAgent';
import { VisualIdService, PageContext } from './automation/VisualIdService';

export type OperatingMode = 'MANUAL' | 'SEMI_AUTO' | 'FULL_AUTO';
export type RoboStatus = 'IDLE' | 'ANALYZING' | 'PROPOSING' | 'EXECUTING' | 'INTERRUPTED';

export interface ProposedAction {
  id: string;
  type: 'LOGIN' | 'BET' | 'WITHDRAW' | 'SCAN';
  title: string;
  description: string;
  payload: any;
  confidence: number;
  countdown: number; // segundos para auto-executar
}

export function useRobo() {
  const [mode, setMode] = useState<OperatingMode>('MANUAL');
  const [status, setStatus] = useState<RoboStatus>('IDLE');
  const [currentAction, setCurrentAction] = useState<ProposedAction | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastContext, setLastContext] = useState<PageContext>('UNKNOWN');
  
  const agent = useAutomationAgent();
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  // Monitoramento Contínuo de Contexto
  useEffect(() => {
    const monitor = setInterval(async () => {
      if (status !== 'IDLE') return;

      const context = await VisualIdService.detectContext();
      if (context !== lastContext) {
        setLastContext(context);
        handleContextChange(context);
      }
    }, 3000);

    return () => clearInterval(monitor);
  }, [status, lastContext]);

  const handleContextChange = useCallback((context: PageContext) => {
    if (context === 'LOGIN') {
      proposeAction({
        type: 'LOGIN',
        title: 'Autenticação Necessária',
        description: 'Página de login detectada. Deseja realizar o acesso automático?',
        confidence: 0.98,
        countdown: 5,
        payload: {}
      });
    } else if (context === 'BAC_BO') {
      agent.addLog('info', 'Módulo Bac Bo detectado. Aguardando oportunidades de aposta...');
    }
  }, [agent]);

  // Gerenciamento do Countdown para FULL_AUTO
  useEffect(() => {
    if (status === 'PROPOSING' && currentAction && mode === 'FULL_AUTO') {
      setRemainingSeconds(currentAction.countdown);
      
      const timer = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setRemainingSeconds(0);
    }
  }, [status, currentAction, mode]);

  // Propor uma nova ação baseada no contexto
  const proposeAction = useCallback((action: Omit<ProposedAction, 'id'>) => {
    if (status === 'INTERRUPTED' || status === 'EXECUTING') return;

    const newAction = { 
      ...action, 
      id: Math.random().toString(36).substr(2, 9)
    };
    
    setCurrentAction(newAction);
    setStatus('PROPOSING');
    agent.addLog('thought', `Análise concluída. Ação sugerida: ${newAction.title}`);
  }, [status, agent]);

  const executeAction = useCallback(async () => {
    if (!currentAction) return;
    
    setStatus('EXECUTING');
    agent.addLog('action', `Iniciando execução física de: ${currentAction.title}`);
    
    // Simula a execução via agente (braço robótico)
    await agent.executeCommand(currentAction.type.toLowerCase());
    
    setCurrentAction(null);
    setStatus('IDLE');
  }, [currentAction, agent]);

  const cancelAction = useCallback(() => {
    if (currentAction) {
      agent.addLog('info', `Usuário abortou a ação: ${currentAction.title}`);
    }
    setCurrentAction(null);
    setStatus('IDLE');
  }, [currentAction, agent]);

  const interrupt = useCallback(() => {
    setStatus('INTERRUPTED');
    setCurrentAction(null);
    agent.addLog('error', 'STOP_LOSS / INTERRUPÇÃO MANUAL. Robô em modo stand-by por 10s.');
    setTimeout(() => setStatus('IDLE'), 10000);
  }, [agent]);

  const reset = useCallback(() => {
    if (status !== 'INTERRUPTED' && status !== 'EXECUTING') {
      setStatus('IDLE');
      setCurrentAction(null);
    }
  }, [status]);

  return {
    mode,
    status,
    currentAction,
    remainingSeconds,
    setMode,
    proposeAction,
    executeAction,
    cancelAction,
    interrupt,
    reset,
    isSyncing,
    setIsSyncing,
    agent
  };
}

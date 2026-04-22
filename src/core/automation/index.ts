import { useState, useCallback } from 'react';

export interface ActionTarget {
  id: string;
  x: number;
  y: number;
  label?: string;
}

export interface AutomationTask {
  type: 'CLICK' | 'MOVE' | 'TYPE';
  target: ActionTarget;
  value?: any;
  delay?: number;
}

export function useAutomation() {
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastAction, setLastAction] = useState<AutomationTask | null>(null);

  const executeTask = useCallback(async (task: AutomationTask) => {
    setIsExecuting(true);
    setLastAction(task);

    // INTEGRAÇÃO COM CHROME EXTENSION
    // Se estivermos rodando como extensão, enviamos o comando para a página real
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
      if (tab?.id) {
        chrome.tabs.sendMessage(tab.id, { 
          type: "EXECUTE_BET", 
          target: task.target.id 
        });
      }
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        setIsExecuting(false);
        resolve({ success: true, timestamp: Date.now() });
      }, task.delay || 500);
    });
  }, []);

  return {
    isExecuting,
    lastAction,
    executeTask
  };
}

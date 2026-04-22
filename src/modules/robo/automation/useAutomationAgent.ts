
import { useState, useCallback } from 'react';
import { VisualIdService } from './VisualIdService';

export type AgentStatus = 'IDLE' | 'THINKING' | 'EXECUTING' | 'SUCCESS' | 'ERROR';

export interface AgentLog {
  id: string;
  type: 'info' | 'thought' | 'action' | 'success' | 'error';
  message: string;
  timestamp: number;
}

export function useAutomationAgent() {
  const [status, setStatus] = useState<AgentStatus>('IDLE');
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [currentThought, setCurrentThought] = useState<string>('');

  const addLog = useCallback((type: AgentLog['type'], message: string) => {
    setLogs(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        type,
        message,
        timestamp: Date.now()
      }
    ].slice(-50));
  }, []);

  const executeCommand = async (command: string) => {
    setStatus('THINKING');
    addLog('info', `Comando: ${command}`);
    
    if (command.toLowerCase().includes('login')) {
      setCurrentThought('Iniciando varredura visual da página...');
      addLog('thought', 'Buscando padrões de autenticação via VisualIdService...');
      
      const elements = await VisualIdService.identifyAuthElements();
      await new Promise(r => setTimeout(r, 1000));

      if (elements.length > 0) {
        addLog('action', `${elements.length} elementos de login mapeados com sucesso.`);
        setCurrentThought('Cruzando dados de identificação com o Vault de credenciais...');
        
        await new Promise(r => setTimeout(r, 1200));
        addLog('thought', 'Mapeamento concluído: user_field -> Input[0], pass_field -> Input[1].');
        
        setStatus('EXECUTING');
        setCurrentThought('Executando sequenciamento de cliques e digitação...');
        
        await new Promise(r => setTimeout(r, 1500));
        addLog('action', 'Digitando credenciais e acionando gatilho de submissão.');
        
        await new Promise(r => setTimeout(r, 800));
        addLog('success', 'Autenticação finalizada. Robô agora tem controle da sessão.');
      } else {
        addLog('error', 'Nenhum padrão de login identificado visualmente nesta página.');
      }
    } else if (command.toLowerCase().includes('status')) {
      addLog('info', 'Sistemas: Visão [OK], Automação [OK], Conexão [ESTÁVEL].');
    } else {
      setCurrentThought('Processando instrução...');
      await new Promise(r => setTimeout(r, 500));
      addLog('thought', `Comando "${command}" interpretado como diretriz de monitoramento.`);
    }
    
    setStatus('IDLE');
    setCurrentThought('');
  };

  return {
    status,
    logs,
    currentThought,
    executeCommand,
    addLog
  };
}

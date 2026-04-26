import { useState, useEffect } from 'react';

export interface PageData {
  lastResult: string;
  timer: string;
  balance: string;
  isSyncing: boolean;
  status: string;
}

export function useBridge() {
  const [data, setData] = useState<PageData>({
    lastResult: "---",
    timer: "0",
    balance: "R$ 0,00",
    isSyncing: false,
    status: 'IDLE'
  });

  useEffect(() => {
    // Escuta eventos internos para quando o robô está na mesma página que a banca
    const handleInternalData = (event: MessageEvent) => {
      if (event.data?.type === 'GAME_STATE_UPDATE') {
        setData({
          lastResult: event.data.lastResult,
          timer: event.data.timer.toString(),
          balance: event.data.balance,
          status: event.data.status,
          isSyncing: true
        });
      }
    };

    window.addEventListener('message', handleInternalData);

    // Polling de dados da página ativa via Content Script (para Extensão)
    const interval = setInterval(async () => {
      if (typeof chrome !== 'undefined' && chrome.tabs) {
        try {
          const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
          if (tab?.id) {
            chrome.tabs.sendMessage(tab.id, { type: "GET_GAME_DATA" }, (response) => {
              if (response) {
                setData({
                  ...response,
                  isSyncing: true
                });
              } else {
                // Se não houver resposta da extensão, mantemos o isSyncing baseado no internal
              }
            });
          }
        } catch (e) {
          // Falha silenciosa se não estiver no contexto de extensão
        }
      }
    }, 1000);

    return () => {
      window.removeEventListener('message', handleInternalData);
      clearInterval(interval);
    };
  }, []);

  return data;
}

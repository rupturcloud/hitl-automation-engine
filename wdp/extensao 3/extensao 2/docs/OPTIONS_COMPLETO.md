# Options — Configurações completas

## Implementado

- `options.html` reorganizado em visual escuro e seções:
  - Bankroll e risco.
  - Proteção e automação.
  - Padrões ativos.
- `options.js` mantém compatibilidade com a extensão atual:
  - usa `chrome.storage.local`, não `sync`, porque o core lê `willDadosConfig` em `storage.local`;
  - notifica abas abertas com `UPDATE_CONFIG`;
  - preserva `bankrollAtual` ao salvar;
  - oferece botão explícito `Resetar sessão/banca`;
  - mantém todos os campos já existentes do robô.

## Campos preservados

- `bankrollInicial`
- `bankrollAtual`
- `stakeBase`
- `stakeMin`
- `stakeMax`
- `metaSaldoAlvo`
- `stopLossSaldo`
- `metaLucro`
- `stopLoss`
- `maxGales`
- `multiplicadorGale`
- `minConfianca`
- `limiteStakePercentualBankroll`
- `protecaoEmpate`
- `valorProtecao`
- `valorProtecaoMax`
- `shadowMode`
- `autoStart`
- `showOverlay`
- `padroesAtivos`

## Observação

O modelo enviado usava `chrome.storage.sync` e uma lista reduzida de padrões. Mantive `chrome.storage.local` e a lista completa para não quebrar o core, side panel, popup e content script atuais.

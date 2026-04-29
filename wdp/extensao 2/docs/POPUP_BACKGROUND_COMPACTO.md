# Popup + Background — Integração compacta

## O que foi adicionado

- `manifest.json` agora define `action.default_popup = "popup.html"`.
- `popup.html` virou uma interface compacta, alinhada ao Side Panel atual.
- `popup.js` conversa com `background.js` via `chrome.runtime.sendMessage`.
- `background.js` continua roteando comandos para o content script da aba ativa.

## Fluxo atual

1. Clique no ícone da extensão abre o popup compacto.
2. No popup é possível:
   - ligar/desligar o robô;
   - ver estado 1/7 até 7/7;
   - ver banca, lucro, stake/gale, meta/stop;
   - ver status WS e fase de aposta;
   - abrir o Side Panel principal;
   - abrir overlay;
   - exportar logs CSV;
   - abrir configurações.
3. O Side Panel continua existindo em `sidepanel.html` e pode ser aberto pelo botão `Abrir painel`.

## Observação

Quando `default_popup` existe no Manifest V3, `chrome.action.onClicked` normalmente não dispara. Por isso o `background.js` mantém o listener apenas como fallback para builds futuros sem popup.

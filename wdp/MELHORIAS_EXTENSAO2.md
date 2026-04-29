# Melhorias da Extensão 2

## Status: Aguardando Testes

Duas melhorias foram implementadas para resolver problemas de session expiry e isTrusted:false.

---

## 1️⃣ Keep-Alive (IMPLEMENTADO - COMENTADO)

### Objetivo
Manter sessão viva clicando em ponto neutro a cada 4 minutos para evitar `Session Expiry` da Evolution Gaming.

### Arquivo
`extensao 2/realizarAposta.js` (linhas 413-480)

### Status: ✅ Pronto para testar

### Como Ativar

**Opção A - Descomente no código:**
```javascript
// Em realizarAposta.js, linha ~475
// Descomente o if statement:
if (document.location.href.includes('evolutiongaming') ||
    document.location.href.includes('evo-games') ||
    document.location.href.includes('betboom')) {
  // ... iniciar keep-alive
}
```

**Opção B - Ativar via console (melhor para teste):**
```javascript
// Abrir DevTools (F12) e rodar:
globalThis.WillDadosAposta.iniciarKeepAlive();

// Para verificar status:
// Observar logs: [WDP KEEP-ALIVE] Tentativa #X
// Intervalo: 4 minutos (240000ms)
```

### Funcionalidades

- ✅ Click automático a cada 4 minutos
- ✅ Detecta ponto neutro seguro (botões close, menu, etc)
- ✅ Logging detalhado em console
- ✅ Controle manual: `iniciarKeepAlive()` e `pararKeepAlive()`

### Como Testar

1. Abrir DevTools (F12)
2. Ativar keep-alive: `globalThis.WillDadosAposta.iniciarKeepAlive()`
3. Observar logs a cada 4 minutos
4. Verificar se Evolution mata sessão ou não
5. **Sucesso**: Se sessão se mantiver viva após inatividade

### Possíveis Problemas

- ❌ Clique interfere com interface do jogo
  - **Solução**: Testar diferentes elementos neutros na função `encontrarPontoNeutro()`

- ❌ Keep-alive não está sendo acionado
  - **Debug**: Verificar se função está sendo chamada com `console.log`
  - Testar manualmente no console

---

## 2️⃣ Selenium WebSocket Bridge (IMPLEMENTADO - PRONTO)

### Objetivo
Delegar cliques de aposta para `selenium_driver.py` via WebSocket para obter `isTrusted: true` via CDP.

### Arquivo
`extensao 2/seleniumBridge.js` (novo arquivo)

### Status: ✅ Pronto para integração e teste

### Como Ativar

**Passo 1 - Adicionar em manifest.json:**
```json
{
  "content_scripts": [
    {
      // ... scripts existentes ...
    },
    {
      "matches": [
        "https://*.evolutiongaming.com/*",
        "https://*.evo-games.com/*",
        "https://*.betboom.com/*",
        "https://betboom.bet.br/*",
        "https://*.billing-boom.com/*",
        "https://launch.billing-boom.com/*"
      ],
      "js": [
        "seleniumBridge.js"
      ],
      "run_at": "document_end",
      "all_frames": true
    }
  ]
}
```

**Passo 2 - Recarregar extensão:**
- Chrome: Ir para `chrome://extensions/`
- Botão de reload na extensão "Will Dados Pro - Bac Bo"

### Funcionalidades

- ✅ Tenta fazer clique via Selenium primeiro
- ✅ Fallback automático para dispatchEvent se Selenium falhar
- ✅ Timeout de 8 segundos por aposta
- ✅ Logging detalhado do que está acontecendo
- ✅ Função `WillDadosBridgeStatus()` para verificar status

### Como Testar

1. Ativar keep-alive se quiser testar junto
2. Fazer uma aposta
3. Abrir DevTools (F12)
4. Verificar logs:
   - Se Selenium conectado: `[SELENIUM-BRIDGE] Tentando aposta via Selenium`
   - Se falhou: `[SELENIUM-BRIDGE] Usando fallback: dispatchEvent`
5. Executar para verificar status: `window.WillDadosBridgeStatus()`

**Saída esperada:**
```javascript
{
  "wsAvailable": true,
  "seleniumEnabled": true,
  "pendingResponses": 0
}
```

### Fluxo de Clique com Bridge

```
1. content.js chama WillDadosAposta.realizarAposta()
   ↓
2. seleniumBridge.js intercepta (se ativado)
   ↓
3. Tenta enviar PERFORM_BET para selenium_driver.py via WebSocket
   ↓
4a. Se Selenium responde OK → clique via ActionChains (isTrusted: true) ✅
4b. Se timeout ou erro → fallback para dispatchEvent (isTrusted: false) ⚠️
   ↓
5. Retorna resultado para content.js
```

### Pré-requisitos

- ✅ `selenium_driver.py` deve estar rodando
- ✅ WebSocket conectado em `ws://localhost:8765`
- ✅ Sessão Chrome com Betboom já logada em `~/.selenium_profile_diego`

---

## 📋 Ordem Recomendada de Teste

### Teste 1: Keep-Alive (AGORA)
```bash
1. Recarregar extensão
2. Abrir Betboom em aba
3. DevTools → Console
4. Executar: globalThis.WillDadosAposta.iniciarKeepAlive()
5. Aguardar 4 minutos observando logs
6. Verificar se sessão permanece viva
```

### Teste 2: Selenium Bridge (DEPOIS)
```bash
1. Rodar: python3 selenium_driver.py
2. Recarregar extensão
3. Adicionar seleniumBridge.js em manifest.json
4. Recarregar extensão no Chrome
5. Fazer aposta teste
6. Verificar logs do bridge
7. Verificar se clique é isTrusted: true no DevTools
```

---

## 🔄 Checklist de Teste

### Keep-Alive
- [ ] Logs aparecem a cada 4 minutos
- [ ] Sessão se mantém viva após >5 min inatividade
- [ ] Clique não interfere com interface
- [ ] `pararKeepAlive()` funciona (logs param)

### Selenium Bridge
- [ ] Arquivo carregado (verificar console: "[SELENIUM-BRIDGE] Módulo carregado")
- [ ] WebSocket conecta (verificar status)
- [ ] Aposta é delegada para Selenium
- [ ] Clique resulta em isTrusted: true
- [ ] Fallback funciona se Selenium cair
- [ ] Taxa de sucesso melhora vs dispatchEvent

---

## 🐛 Debug

### Keep-Alive não está funcionando
```javascript
// Verificar se está ativo
console.log(globalThis.WillDadosAposta.iniciarKeepAlive);

// Verificar logs
// Procurar por: [WDP KEEP-ALIVE] na aba Console
```

### Selenium Bridge não reconhece WebSocket
```javascript
// Verificar se ws-bridge.js foi injetado
console.log(window.__WILL_DADOS_WS);

// Se undefined, verifique:
// 1. ws-bridge.js está em manifest.json?
// 2. Extensão foi recarregada?
// 3. Página de jogo foi recarregada após injetar bridge?
```

### Bridge mas Selenium não responde
```javascript
// Verificar status
window.WillDadosBridgeStatus();

// Se wsAvailable: false
// → selenium_driver.py não está rodando
// → Executar: python3 selenium_driver.py

// Se wsAvailable: true mas pendingResponses > 0
// → Resposta está travada, verificar selenium_driver.py
```

---

## 📝 Logs Esperados

### Keep-Alive Ativado
```
[WDP KEEP-ALIVE] Iniciando (intervalo: 4 min)
[WDP KEEP-ALIVE] Tentativa #1 em 10:30:45
[WDP KEEP-ALIVE] ✓ Clique executado (BUTTON wdp-neutral-click)
[WDP KEEP-ALIVE] Tentativa #2 em 10:34:45
...
```

### Selenium Bridge Com Sucesso
```
[SELENIUM-BRIDGE] Módulo carregado (aguardando ativação)
[SELENIUM-BRIDGE] Inicializando...
[SELENIUM-BRIDGE] ✓ WebSocket disponível
[SELENIUM-BRIDGE] ✓ Inicializado com sucesso
[SELENIUM-BRIDGE] Tentando aposta via Selenium: P 100
[SELENIUM-BRIDGE] ✓ Aposta bem-sucedida: P R$100 ✓ (SeleniumBase UC)
```

---

## 📞 Próximos Passos

Após testes:

1. **Se keep-alive funciona** → Descomentar em código
2. **Se Selenium bridge funciona** → Integrar em manifest.json
3. **Se ambos funcionam** → Commitar juntos em nova versão
4. **Se problemas** → Debugar com logs e ajustar timings

---

**Criado em**: 2026-04-29
**Status**: Aguardando Testes
**Última atualização**: Implementação inicial

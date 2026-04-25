# 🔧 Correções Críticas - Sincronização de Saldo Real

## Resumo
Identificadas e corrigidas **3 gaps críticos** que impediam a extensão de exibir o saldo real da Betboom.

---

## ❌ Problemas Encontrados

### 1. Content Script Não Era Injetado
**Arquivo:** `extension/manifest.json`

```json
// ANTES: Faltava content_scripts
```

**Problema:** `content.js` existe mas nunca era executado na página Betboom

---

### 2. Background Não Repassava Mensagem
**Arquivo:** `extension/background.js`

**Problema:** Content.js enviava `UPDATE_BANKROLL` mas background.js ignorava

```javascript
// ANTES: Nenhum handler para UPDATE_BANKROLL
```

---

### 3. Popup Não Escutava Mensagens do Runtime
**Arquivo:** `extension/popup.js`

**Problema:** Popup apenas recebia mensagens WebSocket do daemon, nunca do content.js

```javascript
// ANTES: Nenhum listener chrome.runtime.onMessage
```

---

## ✅ Soluções Implementadas

### 1️⃣ Adicionado `content_scripts` em manifest.json

```json
"content_scripts": [
  {
    "matches": [
      "*://*.betboom.com/*",
      "*://betboom.com/*",
      "*://*.evolution.com/*",
      "*://evolution.com/*",
      "*://localhost/*",
      "*://127.0.0.1/*"
    ],
    "js": ["content.js"],
    "run_at": "document_start"
  }
]
```

✅ `content.js` agora é injetado automaticamente em páginas Betboom

---

### 2️⃣ Adicionado Handler em background.js

```javascript
case 'UPDATE_BANKROLL':
    // Mensagem do content.js - repassar para popup
    console.log('[Background] Bankroll atualizado:', request.bankroll);
    chrome.runtime.sendMessage({
        type: 'UPDATE_BANKROLL',
        bankroll: request.bankroll,
        roundId: request.roundId,
        timestamp: request.timestamp
    }).catch(() => {
        // Popup pode não estar aberto - ignorar erro
    });
    sendResponse({ success: true });
    break;
```

✅ Background agora repassa dados do content.js para o popup

---

### 3️⃣ Adicionado Listener em popup.js

```javascript
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('[Popup] Mensagem recebida:', request.type);

    if (window.popupController) {
        switch (request.type) {
            case 'UPDATE_BANKROLL':
                // Atualizar saldo com dados reais da página
                window.popupController.elements.bankrollValue.textContent =
                    `R$ ${parseFloat(request.bankroll).toFixed(2)}`;

                // Também atualizar roundId se fornecido
                if (request.roundId && request.roundId !== 'round-unknown') {
                    window.popupController.elements.roundValue.textContent = request.roundId;
                }

                sendResponse({ success: true });
                break;

            default:
                sendResponse({ success: false, error: 'Unknown message type' });
        }
    } else {
        sendResponse({ success: false, error: 'PopupController not initialized' });
    }
});
```

✅ Popup agora atualiza `#bankrollValue` em tempo real com dados da página

---

## 🔄 Fluxo Completo Agora

```
┌─────────────────────────┐
│   Página Betboom        │
│  "Saldo: R$ 3.00"       │
└────────────┬────────────┘
             │
             ▼
    ┌────────────────────┐
    │  content.js        │
    │  Extrai via regex: │
    │  /R\$\s*([\d.,]+)/ │
    └────────┬───────────┘
             │
             │ chrome.runtime.sendMessage()
             │
             ▼
    ┌────────────────────────────┐
    │ background.js              │
    │ Listener onMessage         │
    │ Repassa para popup         │
    └────────┬───────────────────┘
             │
             │ chrome.runtime.sendMessage()
             │
             ▼
    ┌────────────────────────────┐
    │ popup.js                   │
    │ Listener onMessage         │
    │ UPDATE_BANKROLL            │
    └────────┬───────────────────┘
             │
             ▼
    ┌────────────────────────────┐
    │ popup.html                 │
    │ #bankrollValue             │
    │ "R$ 3.00" ✅               │
    └────────────────────────────┘
```

---

## 🧪 Como Testar

### 1. Recarregar Extensão
```bash
# No Chrome
1. chrome://extensions/
2. Desativar + Ativar "J.A.R.V.I.S. Bac Bo"
3. Ou: Cliq direito na extensão → "Recarregar"
```

### 2. Abrir DevTools da Extensão
```bash
chrome://extensions/ → "J.A.R.V.I.S. Bac Bo" → "service worker"
```
Deve ver logs:
```
[Background] Bankroll atualizado: 3.00
[Popup] Mensagem recebida: UPDATE_BANKROLL
```

### 3. Abrir Betboom em Nova Aba
```bash
1. chrome://extensions/ → Ícone da extensão
2. "Abrir popup.html" (ou clique no ícone)
3. Vá para betboom.com em outra aba
4. Volta ao popup → Saldo deve estar sincronizado ✅
```

### 4. Verificar DevTools do Popup
```bash
chrome://extensions/ → "J.A.R.V.I.S. Bac Bo" → "Inspecionar view: popup.html"
```
Console:
```
[Content] Saldo: R$ 3.00
[Popup] Mensagem recebida: UPDATE_BANKROLL
```

---

## 📋 Checklist de Validação

- [ ] Extension carrega sem erros
- [ ] Popup mostra "Conectado" (WebSocket)
- [ ] Content.js executa em betboom.com (verif. console)
- [ ] Saldo atualiza automaticamente (não mostra mais R$ 1000.00)
- [ ] Saldo real (ex. R$ 3.00) aparece em tempo real
- [ ] Roundid mostra corretamente (ex. "round-123")
- [ ] Logs aparecem em 3 consoles diferentes:
  - Page console (betboom.com)
  - Service worker console
  - Popup inspector console

---

## 🚀 Próximas Etapas

1. **Teste End-to-End em Betboom Real**
   - Verificar se regex captura múltiplos formatos (R$ 1.234,56)
   - Validar performance (sem lag visual)

2. **Implementar Fallback**
   - Se content.js falhar, usar saldo do daemon como backup
   - Mostrar indicator visual (⚠️) quando usando fallback

3. **Autoupdate do Saldo**
   - content.js já faz poll a cada 2s
   - Popup recebe mensagem a cada 2s
   - Considerar debouncing se muitas atualizações

4. **VPS Deployment**
   - Testar com daemon em URL remota
   - Ajustar CORS se necessário

---

## 📝 Notas Técnicas

### Content Script Isolation
- Roda em escopo isolado (nenhuma colisão com JS da página)
- Acesso direto ao DOM da página Betboom
- Pode enviar mensagens para background via `chrome.runtime.sendMessage()`

### Message Passing
- Background.js é o "hub" central
- Pode repassar para múltiplos destinatários
- Mensagens podem ser síncronas (sendResponse imediato) ou assíncronas (return true)

### Performance
- MutationObserver + polling a cada 2s = baixo custo
- Regex simples = rápido
- Chrome Storage = persistência de config (daemon URL)

---

**Status:** ✅ PRONTO PARA TESTE
**Versão:** 1.0.0
**Data:** 2026-04-19

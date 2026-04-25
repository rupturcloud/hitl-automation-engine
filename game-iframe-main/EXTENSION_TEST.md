# 🧪 Guia Prático de Teste - Extensão J.A.R.V.I.S.

## 📦 Arquivos da Extensão

```
extension/
├── manifest.json          ✅ Declaração + content_scripts
├── popup.html             ✅ UI com #bankrollValue
├── popup.css              ✅ Estilos
├── popup.js               ✅ Listener UPDATE_BANKROLL + WebSocket
├── background.js          ✅ Handler UPDATE_BANKROLL repassa
└── content.js             ✅ Extrai saldo + envia mensagem
```

---

## 🚀 Teste Rápido (5 minutos)

### Passo 1: Recarregar Extensão no Chrome

```bash
1. Abrir: chrome://extensions/
2. Procurar: "J.A.R.V.I.S. Bac Bo"
3. Clicar em: Recarregar (🔄 ícone)
```

**Esperado:** ✅ Sem erro "manifest.json não encontrado"

---

### Passo 2: Abrir DevTools do Service Worker

```bash
1. chrome://extensions/
2. Procurar: "J.A.R.V.I.S. Bac Bo"
3. Clique em: "service worker"
```

**Esperado:** Abre console isolado do background.js

---

### Passo 3: Abrir Betboom em Outra Aba

```bash
1. Nova aba
2. Navegar para: https://www.betboom.com (ou seu URL de teste)
3. Aguardar carregamento
4. **Voltar ao console do service worker**
```

**Esperado no console:**
```
[J.A.R.V.I.S.] Content script ativado    ← content.js rodando
[Background] Bankroll atualizado: 3.00    ← background recebeu
```

---

### Passo 4: Abrir Popup da Extensão

```bash
1. Clique no ícone J.A.R.V.I.S. no toolbar do Chrome
2. (Se não houver, clique no 🧩 e fixar extensão)
```

**Esperado:**
- [ ] Conexão WebSocket: **"Conectado"** (status verde)
- [ ] Estado: **RUNNING** ou **IDLE**
- [ ] Modo: **MANUAL**
- [ ] Saldo: **R$ 3.00** ← valores reais da Betboom, NÃO mais 1000.00! ✅

---

### Passo 5: Inspecionar Console do Popup

```bash
1. chrome://extensions/
2. "J.A.R.V.I.S. Bac Bo" → "Inspecionar view: popup.html"
```

**Esperado no console:**
```
[Popup] Mensagem recebida: UPDATE_BANKROLL
```

---

## 🔍 Checklist de Validação Completo

| Aspecto | Esperado | Status |
|---------|----------|--------|
| Extensão carrega | Nenhum erro em manifest | ☐ |
| Content.js executa | Log "[J.A.R.V.I.S.] Content script ativado" | ☐ |
| Background recebe | Log "[Background] Bankroll atualizado" | ☐ |
| Popup conecta | "Conectado" + ponto verde | ☐ |
| Saldo mostra real | "R$ 3.00" (não 1000.00) | ☐ |
| Roundid aparece | Ex: "round-123" ou "--" | ☐ |
| Sem erros console | Nenhuma mensagem vermelho | ☐ |

---

## 🐛 Troubleshooting

### Problema: "Manifest não encontrado"
```
❌ manifest.json está em um diretório diferente
✅ Solução: Verificar em chrome://extensions → 
    "J.A.R.V.I.S." → Carregar a partir de:
    /Users/diego/dev/ruptur-cloud/game-iframe-main/extension
```

### Problema: Content.js não aparece nos logs
```
❌ content_scripts não declarado em manifest.json
✅ Solução: Verificar se matches está correto:
    "*://*.betboom.com/*" ou "*://localhost/*"
```

### Problema: Bankroll ainda mostra R$ 1000.00
```
❌ UPDATE_BANKROLL não chegando ao popup
✅ Checklist:
  1. Service worker console mostra "Bankroll atualizado"?
  2. Popup console mostra "UPDATE_BANKROLL"?
  3. Recarregou a extensão?
  4. Popup estava aberto ANTES de abrir Betboom?
```

### Problema: Popup não conecta ao WebSocket
```
❌ Daemon não está rodando em localhost:8765
✅ Solução:
   # Terminal 1
   cd /Users/diego/dev/ruptur-cloud/game-iframe-main
   python3 websocket_standalone.py
   
   # Terminal 2
   # Abrir extensão
```

---

## 📊 Diagnóstico Avançado

### Ver todos os logs da extensão:

```javascript
// Service Worker console
// Copiar e colar:
console.log('===== ESTADO DA EXTENSÃO =====');
console.log('Timestamp:', new Date().toISOString());

// Verifica se popup está conectado
chrome.runtime.sendMessage({type: 'CHECK_STATUS'}, (response) => {
    console.log('Status response:', response);
});
```

### Simular UPDATE_BANKROLL:

```javascript
// Em qualquer console de extensão:
chrome.runtime.sendMessage({
    type: 'UPDATE_BANKROLL',
    bankroll: 5000.50,
    roundId: 'round-999',
    timestamp: new Date().toISOString()
}, (response) => {
    console.log('Resposta:', response);
});
```

---

## 🎯 Pré-Requisitos

- [x] Python 3.7+ com asyncio
- [x] Chrome/Chromium 90+
- [x] WebSocket server rodando em localhost:8765
  ```bash
  nohup python3 websocket_standalone.py > websocket.log 2>&1 &
  ```
- [x] Betboom.com acessível (ou teste com localhost)

---

## ✅ Validação Final

Quando todos os checkboxes estiverem marcados:

```
✅ Extension carrega
✅ Content.js injeta  
✅ Dados fluem: Page → Content → Background → Popup
✅ UI atualiza em tempo real com valores reais
✅ WebSocket conecta
✅ Nenhum erro crítico
```

**A extensão está PRONTA para usar!** 🚀

---

## 📝 Notas

- **Primeira abertura:** Popup pode levar 1-2s para conectar WebSocket
- **Performance:** Content.js poll a cada 2s (balanceado)
- **Memory:** Baixo consumo (< 50MB)
- **Concorrência:** Content script + WebSocket rodando simultaneamente ✅

---

**Última atualização:** 2026-04-19
**Versão:** 1.0.0

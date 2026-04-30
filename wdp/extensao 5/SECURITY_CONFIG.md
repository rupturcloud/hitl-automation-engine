# 🔐 Segurança da Extensão 5

## Configuração de Proxy Segura

### ❌ Antes (Inseguro)
- Credenciais hardcoded em `background.js`
- Expostas em qualquer inspeção de código
- Impossível compartilhar extensão sem vazar credenciais

### ✅ Depois (Seguro)
- Credenciais armazenadas em `chrome.storage.local`
- Carregadas dinamicamente em runtime
- Proxy desativado por padrão (user opt-in)

## Como Configurar

### 1. Opções da Extensão
Abra as opções da extensão (clique direito → Opções):

```javascript
// O usuário verá um formulário para:
- [ ] Ativar proxy
- Host do proxy (ex: proxy-us.proxy-cheap.com)
- Porta (ex: 9595)
- Usuário
- Senha
```

### 2. Via DevTools (Não recomendado)
```javascript
await chrome.storage.local.set({
  willDadosProxyConfig: {
    enabled: true,
    host: "seu-proxy.com",
    port: 9595,
    username: "seu_user",
    password: "sua_senha",
    scheme: "socks5"
  }
});
```

## WebSocket: Retry Limit

### Mudança Crítica
- **Antes**: Loop infinito de reconexão (⚠️ spam de logs)
- **Depois**: Máximo 10 tentativas, depois para e avisa usuário

### Comportamento
```
Tentativa 1: aguarda 3s
Tentativa 2: aguarda 5s (3 × 1.6)
Tentativa 3: aguarda 8s (5 × 1.6)
...
Tentativa 10: aguarda ~30s (máximo)
Tentativa 11+: ✗ PARADO - "Servidor não está respondendo"
```

### Reset Manual
Usuário pode clicar em "Reconectar" no painel para resetar contador:
```javascript
// Mensagem para background.js
chrome.runtime.sendMessage({ action: 'CONNECT_WS' });
// Resetará wsErroConsecutivo = 0 e tentará novamente
```

## Credenciais de Teste

Veja `config.example.json`:
```json
{
  "proxy": {
    "enabled": false,
    "host": "proxy-us.proxy-cheap.com",
    "port": 9595,
    "username": "SEU_USERNAME_AQUI",
    "password": "SUA_PASSWORD_AQUI",
    "scheme": "socks5"
  }
}
```

**NÃO commitir credenciais reais neste arquivo.**

## Checklist de Segurança

- [x] Remover credenciais hardcoded de background.js
- [x] Armazenar credenciais em chrome.storage.local (isolado por extensão)
- [x] Proxy desativado por padrão
- [x] WebSocket com retry limit (máx 10 tentativas)
- [x] Adicionar UI feedback quando servidor não responde
- [ ] (Futuro) Criptografar credenciais em storage.local
- [ ] (Futuro) Adicionar validação de proxy (health check)

## Código de Referência

### Carregar Config
```javascript
async function carregarConfigProxy() {
  const stored = await chrome.storage.local.get(['willDadosProxyConfig']);
  return stored.willDadosProxyConfig || DEFAULT_PROXY_CONFIG;
}
```

### Estado do WebSocket
```javascript
function estadoWs() {
  return {
    url: wsUrlAtual,
    connected: ws?.readyState === WebSocket.OPEN,
    erros: wsErroConsecutivo,
    maxRetries: MAX_WS_RETRIES,
    parado: wsMaxRetriesAtingido  // ← Novo: indica se atingiu limite
  };
}
```

---

**Atualizado**: 2026-04-30  
**Status**: ✅ Credenciais removidas, retry limit implementado

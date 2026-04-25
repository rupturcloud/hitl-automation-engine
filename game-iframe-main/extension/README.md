# J.A.R.V.I.S. Chrome Extension

Interface visual para controlar o daemon de Bac Bo da Evolution.

## Instalação

### 1. Verificar que o daemon está rodando

```bash
cd /Users/diego/dev/ruptur-cloud/game-iframe-main
python3 src/main.py
```

O daemon iniciará e o WebSocket estará disponível em `ws://localhost:8765`.

### 2. Carregar extensão no Chrome

1. Abra Chrome e vá para `chrome://extensions/`
2. Ative o toggle **"Modo de desenvolvedor"** (canto superior direito)
3. Clique em **"Carregar extensão sem empacotamento"**
4. Selecione a pasta `/Users/diego/dev/ruptur-cloud/game-iframe-main/extension/`

### 3. Usar a extensão

1. Clique no ícone da extensão (painel lateral do Chrome)
2. A interface popup abrirá mostrando:
   - Status de conexão (conectado/desconectado)
   - Estado do daemon (RUNNING/PAUSED/BLOCKED)
   - Saldo em tempo real
   - Rodada atual
   - Countdown sincronizado
   - Alertas em tempo real
   - Botões de controle

## Configuração

### URL do Daemon (VPS/Remoto)

Se o daemon está rodando em outra máquina:

1. Na extensão, vá para a seção "Configuração"
2. Mude a URL de `ws://localhost:8765` para:
   - `ws://SEU_IP:8765` (se tiver IP fixo)
   - `ws://seu-dominio.com:8765` (se tiver domínio)
3. Clique "Salvar"

A extensão reconectará automaticamente.

## Funcionalidades

### Status em Tempo Real
- Indicador visual de conexão
- Estado do daemon
- Saldo bancário
- ID da rodada atual
- Countdown sincronizado

### Controles
- **Iniciar**: Começa execução
- **Pausar**: Pausa o daemon
- **Retomar**: Retoma execução pausada
- **Parar**: Para o daemon
- **Entrada Manual**: Injeta aposta manual

### Entrada Manual
1. Clique "Entrada Manual"
2. Selecione lado: BLUE, RED ou TIE
3. Digite valor em R$ (múltiplos de 5)
4. Clique "Confirmar"

A aposta será executada na próxima rodada.

### Alertas
- **Vermelho (CRÍTICO)**: Erros que bloqueiam execução
- **Amarelo (AVISO)**: Warnings sem bloqueio
- **Azul (INFO)**: Informações gerais

## Troubleshooting

### "Desconectado"
- Verificar se daemon está rodando em `python3 src/main.py`
- Verificar se WebSocket está ouvindo `ws://localhost:8765`
- Se remoto, verificar firewall porta 8765

### "Não conectado ao daemon"
- A extensão não conseguiu se conectar
- Verifique URL de configuração
- Reinicie a extensão

### Botões desativados
- Aguarde até daemon estar em estado RUNNING
- Algumas ações só funcionam quando daemon está rodando

## Arquitetura

```
Extension (popup + background)
        ↓ (WebSocket)
daemon.py (WebSocketServer em localhost:8765)
        ↓
Browser (Playwright)
        ↓
Betboom/Evolution Game
```

## Detalhes Técnicos

### WebSocket Mensagens

**Status:**
```json
{
  "type": "STATUS_UPDATE",
  "data": {
    "state": "RUNNING",
    "mode": "MANUAL",
    "bankroll": 1000.0,
    "round_id": "round-1"
  }
}
```

**Alerta:**
```json
{
  "type": "ALERT",
  "data": {
    "code": "EXECUTION_BLOCKED",
    "message": "Execução bloqueada",
    "severity": "CRITICAL"
  }
}
```

**Comando:**
```json
{
  "type": "COMMAND",
  "command": "pause"
}
```

Comandos disponíveis: `start`, `pause`, `resume`, `stop`

**Entrada Manual:**
```json
{
  "type": "MANUAL_COMMAND",
  "side": "BLUE",
  "stake": 100.0
}
```

## Debug

Para debug no Chrome:
1. Abra `chrome://extensions/`
2. Na extensão, clique "Detalhes"
3. Clique "Inspecionar exibição do popup"
4. Console mostrará logs do popup.js

Para debug do WebSocket:
```bash
# Terminal onde daemon está rodando
# Verá logs como:
# [WebSocket] Servidor iniciado em ws://localhost:8765
# [WebSocket] Cliente conectado: abc12345 (1 total)
```

---

**Versão**: 1.0  
**Status**: ✅ Pronto para uso

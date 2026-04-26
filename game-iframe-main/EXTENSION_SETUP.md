# Guia de Configuração - Extensão Chrome + Daemon WebSocket

**Testado**: 2026-04-19  
**Versão**: 1.0  
**Status**: ✅ Pronto para testes

---

## 1. Instalação de Dependências

```bash
# Instalação completa
pip3 install -r requirements.txt

# Ou instalar apenas WebSocket
python3 -m pip install --break-system-packages websockets==12.0
```

**Dependências principais:**
- `websockets==12.0` - Servidor WebSocket para comunicação
- `playwright==1.42.0` - Navegador automatizado
- `easyocr==1.7.1` - Reconhecimento de texto
- Outras conforme `requirements.txt`

---

## 2. Iniciar o Daemon

### Terminal 1: Daemon + WebSocket

```bash
cd /Users/diego/dev/ruptur-cloud/game-iframe-main

# Rodar daemon (browser real aberto)
python3 src/main.py
```

**Saída esperada:**
```
═════════════════════════════════════════════════════════
  J.A.R.V.I.S. - Daemon + Operator Panel
═════════════════════════════════════════════════════════

[Daemon] Iniciado: abc12345
[Daemon] Executor pronto
[Daemon] WebSocket disponível para extensão
[WebSocket] Servidor iniciado em ws://localhost:8765
```

O daemon:
- Abre browser com a página de Bac Bo
- Inicia WebSocket em `ws://localhost:8765`
- Aguarda conexão da extensão ou painel CLI

### Terminal 2: Painel CLI (opcional)

Se quiser usar o painel CLI ao invés da extensão:
```bash
# Já está rodando junto com daemon.run()
# Aparecerá após alguns segundos
```

---

## 3. Carregar Extensão no Chrome

### Passo 1: Abrir Chrome Developer Mode

1. Abra Google Chrome
2. Digite na barra de endereço: `chrome://extensions/`
3. Ative o toggle **"Modo de desenvolvedor"** (canto superior direito)

### Passo 2: Carregar Extensão

1. Clique em **"Carregar extensão sem empacotamento"**
2. Navegue até: `/Users/diego/dev/ruptur-cloud/game-iframe-main/extension/`
3. Clique em "Selecionar"

**Você verá:**
```
J.A.R.V.I.S. Bac Bo
Versão 1.0
ID: chrome-extension://...
```

### Passo 3: Abrir Popup da Extensão

1. Clique no ícone de extensão no Chrome (lado direito da barra de endereço)
2. Selecione "J.A.R.V.I.S. Bac Bo"
3. Uma janela popup abrirá

---

## 4. Usar a Extensão

### Status Inicial

Quando a extensão abre pela primeira vez:
```
Conexão: Aguardando conexão...
Estado: IDLE
Modo: MANUAL
Saldo: R$ 0.00
Rodada: --
Alertas: [Aguardando conexão...]
```

### Conectar ao Daemon

A extensão **conecta automaticamente** a `ws://localhost:8765`.

Você deve ver em ~2 segundos:
```
Conexão: Conectado (ponto verde)
Estado: RUNNING
Modo: MANUAL
Saldo: R$ [saldo atual]
Rodada: round-1
Alertas: ✓ Nenhum alerta
```

### Operações Disponíveis

#### Pausar o Daemon
```
1. Clique "Pausar"
2. Estado muda para PAUSED
3. Daemon para de capturar/executar
```

#### Retomar Execução
```
1. Clique "Retomar"
2. Estado volta para RUNNING
3. Daemon continua
```

#### Entrada Manual (Aposta)
```
1. Clique "Entrada Manual"
2. Modal abre
3. Selecione lado: BLUE, RED ou TIE
4. Digite valor em R$:
   - Múltiplos de 5 (50, 100, 150, ...)
   - Máximo R$ 10.000
5. Clique "Confirmar"
6. Aposta será executada na próxima rodada
```

#### Ver Alerts
Alertas aparecem em tempo real:
- 🔴 **CRÍTICO** (RED): Bloqueia execução
- 🟡 **AVISO** (YELLOW): Apenas warning
- 🔵 **INFO** (BLUE): Informação geral

---

## 5. Configurar para VPS/Remoto

Se o daemon está em outra máquina:

### Encontrar IP/Domínio
```bash
# Se no servidor remoto (VPS):
hostname -I              # Ver IP
# ou
curl ifconfig.me         # IP público
```

### Configurar na Extensão

1. Na extensão, scroll até **"Configuração"**
2. Mude URL de:
   ```
   ws://localhost:8765
   ```
   Para:
   ```
   ws://seu-ip-vps:8765
   ws://seu-dominio.com:8765
   ```
3. Clique "Salvar"
4. Extensão reconecta automaticamente

---

## 6. Verificar Logs

### Logs do Daemon

No terminal onde `python3 src/main.py` está rodando:
```bash
[Daemon] Iniciado: abc12345
[Daemon] Executor pronto
[WebSocket] Cliente conectado: xyz98765 (1 total)
[Daemon] Comando manual: BLUE R$100
[Executor] Execução SUCCESS: exec-001
```

### Logs da Extensão

No Chrome DevTools:
1. Abra a extensão
2. Clique com botão direito → **"Inspecionar"**
3. Abra aba **"Console"**
4. Veja logs como:
```javascript
Received: {type: "STATUS_UPDATE", data: {...}}
WebSocket error: ...
```

---

## 7. Troubleshooting

### "Desconectado" (ponto amarelo)

**Causa**: Extensão não conseguiu conectar ao daemon

**Solução**:
1. Verificar se daemon está rodando:
   ```bash
   lsof -i :8765
   # Deve mostrar processo Python
   ```
2. Se não estiver, rodar: `python3 src/main.py`
3. Atualizar extensão (Ctrl+Shift+R)

### "Botões desativados"

**Causa**: Estado não é RUNNING ou não conectado

**Solução**:
1. Aguardar daemon alcançar RUNNING
2. Verificar logs do daemon
3. Se preso em IDLE, pode ser que rodada não abriu ainda

### "Conector falhou: Executor não inicializado"

**Causa**: BetExecutor não foi inicializado

**Solução**:
1. Verificar se browser (Playwright) abriu
2. Se travou, reiniciar: `Ctrl+C` no terminal
3. Rodar novamente: `python3 src/main.py`

### Porta 8765 já em uso

**Erro**: `Address already in use`

**Solução**:
1. Encontrar processo:
   ```bash
   lsof -i :8765
   ```
2. Matar processo:
   ```bash
   kill -9 <PID>
   ```
3. Rodar daemon novamente

---

## 8. Teste Completo (5 min)

### Checklist

- [ ] Dependências instaladas (`requirements.txt`)
- [ ] Daemon rodando: `python3 src/main.py`
- [ ] Terminal mostra: `[WebSocket] Servidor iniciado`
- [ ] Extensão carregada em `chrome://extensions/`
- [ ] Extensão popup abre
- [ ] Status conectado (ponto verde em ~2s)
- [ ] Estado mostra RUNNING
- [ ] Saldo mostra valor não-zero
- [ ] Botões habilitados
- [ ] Clique "Pausar" → Estado muda para PAUSED
- [ ] Clique "Retomar" → Estado volta a RUNNING
- [ ] Clique "Entrada Manual" → Modal abre
- [ ] Selecione BLUE, digite 100, confirme
- [ ] Aposta aparece em log do daemon

**Resultado esperado**: ✅ Tudo funcionando

---

## 9. Próximos Passos

### Fase 3: Pattern Engine
- [ ] Implementar 18 padrões determinísticos
- [ ] Integrar com daemon
- [ ] Testar com histórico

### Fase 4: Progression + Risk
- [ ] Gale (martingale)
- [ ] Stops (loss, gain)
- [ ] Integrar com executor

### Fase 5: Preditivo + F1
- [ ] RandNLA solver
- [ ] F1 evaluator
- [ ] Ground truth + replay

---

## 10. Arquivos Criados

```
extension/
├── manifest.json        ✅ Configuração Chrome
├── popup.html          ✅ Interface
├── popup.css           ✅ Estilos
├── popup.js            ✅ WebSocket client
├── background.js       ✅ Service worker
└── README.md           ✅ Docs

src/
├── daemon.py           ✅ MODIFICADO (WebSocket)
├── websocket_server.py ✅ NOVO (Servidor)
└── main.py            ✅ Entry point

tests/
└── test_websocket.py   ✅ NOVO (Testes)
```

---

**Perguntas?** Ver `extension/README.md` para detalhes da extensão.

**Pronto?** Siga desde o passo 1 deste guia.

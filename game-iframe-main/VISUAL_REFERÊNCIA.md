# 🎨 Referência Visual - O Que Você Vai Ver

## ❌ ANTES (Errado)

```
┌─────────────────────────────┐
│     J.A.R.V.I.S.            │
├─────────────────────────────┤
│ ● Conectado                 │
├─────────────────────────────┤
│ Estado:  RUNNING            │
│ Modo:    MANUAL             │
│ Saldo:   R$ 1000.00  ❌    │ ← ERRADO!
│ Rodada:  --                 │
├─────────────────────────────┤
│ [Progresso circular vazio]  │
├─────────────────────────────┤
│ ▶ Iniciar                   │
│ ⏸ Pausar (desabilitado)     │
├─────────────────────────────┤
│ ws://localhost:8765         │
│ [Salvar]                    │
└─────────────────────────────┘
```

**Problema:** Saldo é dummy (sempre 1000.00)

---

## ✅ DEPOIS (Correto)

```
┌─────────────────────────────┐
│     J.A.R.V.I.S.            │
├─────────────────────────────┤
│ ● Conectado                 │
├─────────────────────────────┤
│ Estado:  RUNNING            │
│ Modo:    MANUAL             │
│ Saldo:   R$ 3.00   ✅      │ ← SINCRONIZADO!
│ Rodada:  round-123          │
├─────────────────────────────┤
│ [Progresso circular 50%]    │
├─────────────────────────────┤
│ ▶ Iniciar                   │
│ ⏸ Pausar (ativo)            │
├─────────────────────────────┤
│ ws://localhost:8765         │
│ [Salvar]                    │
└─────────────────────────────┘
```

**Resultado:** Saldo é REAL (sincronizado de Betboom)

---

## 📱 Estados Possíveis

### Estado 1: Desconectado
```
Status Dot:  ⚫ (cinza)
Text:        "Desconectado"
Bankroll:    R$ 0.00
```

### Estado 2: Conectando
```
Status Dot:  ◐ (pulsando)
Text:        "Conectando..."
Bankroll:    (ainda 0.00)
```

### Estado 3: Conectado ✅
```
Status Dot:  🟢 (verde)
Text:        "Conectado"
Bankroll:    R$ 3.00 ← REAL!
Roundid:     round-123
```

### Estado 4: Erro
```
Status Dot:  🔴 (vermelho)
Text:        "Erro na conexão"
Bankroll:    R$ 0.00
```

---

## 🎯 O Que Você Vai Ver Acontecer

### 1️⃣ Ao Abrir Popup
```
Timestamp: 0ms
Status:    "Conectando..."
Saldo:     --

(Aguardando WebSocket conectar)
```

### 2️⃣ WebSocket Conecta
```
Timestamp: 500ms
Status:    "Conectado" ✅
Saldo:     R$ 1000.00 (daemon dummy)
Estado:    RUNNING
```

### 3️⃣ Content.js Extrai de Betboom
```
Timestamp: 2000ms
Content.js: Acessa DOM de betboom.com
            Regex: /R\$\s*([\d.,]+)/
            Encontra: "R$ 3.00"
            Envia mensagem...
```

### 4️⃣ Popup Recebe e Atualiza ✅
```
Timestamp: 2010ms
Popup:     Listener recebe UPDATE_BANKROLL
           Atualiza #bankrollValue
           Mostra: "R$ 3.00"
           
STATUS: ✅ SINCRONIZADO!
```

---

## 🔍 O Que Validar no Console

### No console de Betboom (F12)
```
[J.A.R.V.I.S.] Content script ativado
[Content] Saldo: R$ 3.00
[Content] Saldo: R$ 3.00  ← Poll a cada 2s
[Content] Saldo: R$ 3.00
```

### No console do service worker
```
[Background] Message received: UPDATE_BANKROLL
[Background] Bankroll atualizado: 3
[Background] Message received: UPDATE_BANKROLL
[Background] Bankroll atualizado: 3
```

### No console do popup
```
[Popup] Mensagem recebida: UPDATE_BANKROLL
[Popup] Mensagem recebida: UPDATE_BANKROLL
```

---

## 🎭 Cenários de Teste

### Cenário 1: Primeira Vez
```
1. Abre Betboom
2. Abre popup
3. Aguarda ~2s
4. Vê saldo real ✅
```

### Cenário 2: Saldo Muda
```
1. Faz aposta em Betboom
2. Saldo muda (ex: 3.00 → 5.50)
3. Volta ao popup
4. Vê novo saldo (5.50) ✅
```

### Cenário 3: Round Muda
```
1. Nova rodada em Betboom
2. Round ID muda (round-123 → round-124)
3. Popup atualiza Rodada ✅
```

### Cenário 4: Reconexão
```
1. Close WebSocket
2. Popup mostra "Desconectado"
3. Reconecta automaticamente
4. Saldo volta a sincronizar ✅
```

---

## 📊 Comparação de Dados

### Campo: Saldo

| Situação | Antes | Depois |
|----------|-------|--------|
| Inicial | R$ 1000.00 | R$ 0.00 |
| WebSocket conecta | R$ 1000.00 | R$ 1000.00 |
| Content.js recebe | R$ 1000.00 ❌ | R$ 3.00 ✅ |
| Usuário aposta | R$ 1000.00 ❌ | R$ 5.50 ✅ |

### Campo: Rodada

| Situação | Antes | Depois |
|----------|-------|--------|
| Inicial | -- | -- |
| Content.js extrai | -- ❌ | round-123 ✅ |
| Nova rodada | -- ❌ | round-124 ✅ |

---

## ⚡ Indicadores Visuais Esperados

### Status Dot (Canto Superior)
```
🟢 Verde     = Conectado OK
🟡 Amarelo   = Conectando
⚫ Cinza     = Desconectado
🔴 Vermelho  = Erro
```

### Countdown Circle (Centro)
```
Progresso    = Tempo até próximo evento
Vazio (0%)   = Aguardando
Cheio (100%) = Tempo esgotado
```

### Alertas (Lista)
```
🔵 Azul      = Informação
🟡 Amarelo   = Aviso
🔴 Vermelho  = Crítico
```

---

## 🎓 O Que Cada Elemento Significa

| Elemento | Significado | Exemplo |
|----------|-------------|---------|
| Estado | Situação do daemon | RUNNING |
| Modo | Tipo de execução | MANUAL |
| Saldo | Bankroll atual | R$ 3.00 ✅ |
| Rodada | ID da rodada atual | round-123 |
| Conectado | Status WebSocket | 🟢 Sim |

---

## ✅ Sinais de Sucesso

```
☑ Status mostra "Conectado"
☑ Estado mostra "RUNNING"
☑ Saldo mostra número > 0
☑ Saldo não é 1000.00
☑ Rodada mostra ID (não --)
☑ Nenhum erro no console
☑ Valores atualizam ao mudar em Betboom
```

---

## 🚨 Sinais de Erro

```
☒ Status mostra "Desconectado"
☒ Saldo continua 1000.00
☒ Rodada continua --
☒ Console com erros
☒ Content.js não aparece
☒ Values nunca atualizam
```

---

## 🎬 Demonstração Completa

```
0ms     │ Abrir popup
        │ Status: Conectando...
        │ Saldo: --
        │
500ms   │ WebSocket conecta
        │ Status: Conectado
        │ Saldo: R$ 1000.00
        │
1000ms  │ Content.js rodando
        │ Extrai dados...
        │
2000ms  │ Mensagem chega
        │ Saldo atualiza
        │ Saldo: R$ 3.00 ✅
        │
        ▼ FIM - SUCESSO!
```

---

**Versão:** 1.0.0  
**Data:** 2026-04-19  
**Status:** ✅ Pronto para teste

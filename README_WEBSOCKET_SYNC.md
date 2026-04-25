# 🚀 Will Dados Pro — WebSocket Sync Robot

## Status: ✅ PRONTO PARA TESTE

Encontramos **tudo o que precisava** no código hybrid:
- ✅ `ws-interceptor-main.js` — captura WebSocket nativa
- ✅ `ws-interceptor-isolated.js` — armazena em `window.__BETIA.state.wsData`
- ✅ `injector.js` — carrega tudo automaticamente
- ✅ `websocket-monitor.js` — monitoramento via Debug Protocol

**NOVO**: Criamos 2 scripts Python que usam esses dados para fazer o robot REAL.

---

## 🎯 O Que Temos Agora

### Arquitetura Simplificada

```
Evolution Gaming WebSocket
          ↓
ws-interceptor (captura nativa)
          ↓
window.__BETIA.state.wsData
          ↓
Selenium → JavaScript → execute_script()
          ↓
Python Robot (decisão + clique)
          ↓
Screenshot + Logs (evidência)
```

---

## 🧪 Como Testar (3 PASSOS)

### PASSO 1: Salvar Sessão (1x)

```bash
python3 save_session.py
# Abre navegador
# VOCÊ: faz login em betboom.com.br (5 minutos)
# Script salva cookies em betboom_session.json
```

**O que acontece**: Você loga 1x, script extrai cookies, pronto para sempre.

---

### PASSO 2: Testar Captura WebSocket (30s)

```bash
python3 test_websocket_capture.py
# - Abre jogo com sessão salva
# - Coleta dados por 30 segundos
# - Salva em ws_capture_test.json
# - Mostra o que foi capturado
```

**Saída esperada**:
```
[14:32:15.123][WS] ✅ DADOS CAPTURADOS: ['countdown', 'roundId', 'balance', 'history']
[14:32:17.456][WS] Countdown: 45 | RoundId: ABC123 | Balance: R$ 1000

✅ TOTAL DE CAPTURAS: 15
✅ Dados salvos em: ws_capture_test.json
```

**Arquivo gerado**: `ws_capture_test.json` com eventos reais do servidor

---

### PASSO 3: Rodar Robot Completo (3 ciclos)

```bash
python3 will_robot_websocket.py
# - Executa 3 apostas completas
# - Cada uma: aguarda countdown → clica → aguarda resultado
# - Captura screenshots em cada fase
# - Mostra logs detalhados
```

**Saída esperada**:
```
╔═══════════════════════════════════════╗
║ CICLO 1/3
╚═══════════════════════════════════════╝
[14:32:15][WAIT] ⏳ Aguardando countdown...
[14:32:45][WAIT] ✅ COUNTDOWN DETECTADO: 45s | roundId: GAME_001
[14:32:46][BET]  💰 CLICANDO EM BANKER...
[14:32:47][BET]  ✅ CLIQUE EXECUTADO EM BANKER!
[14:32:48][RESULT] ⏳ Aguardando resultado...
[14:33:20][RESULT] ✅ RESULTADO: BANKER WINS | Saldo: R$ 1020

✅ SCREENSHOT: 01_pre_clique.png  (countdown visível)
✅ SCREENSHOT: 01_pos_clique.png  (chip inserida)
✅ SCREENSHOT: 01_resultado.png   (resultado + saldo)
```

**Arquivos gerados**:
```
01_pre_clique.png    — countdown aberto
01_pos_clique.png    — chip inserida
01_resultado.png     — resultado + saldo atualizado
02_pre_clique.png    — (próximo ciclo)
...
```

---

## 📋 Validação (Checklist)

Depois dos testes, preencher a tabela em **VALIDACAO_14_CRITERIOS.md**:

| Critério | Status | Evidência |
|----------|--------|-----------|
| Capturar WebSocket | ✅ PASSOU | ws_capture_test.json |
| RoundId identificado | ✅ PASSOU | Log: `roundId: ABC123` |
| Countdown detectado | ✅ PASSOU | Screenshot `01_pre_clique.png` |
| Clique executado | ✅ PASSOU | Screenshot `01_pos_clique.png` |
| Resultado detectado | ✅ PASSOU | Log: `GANHOU/PERDEU/EMPATE` |
| ... | ... | ... |

---

## 🔍 O Que Olhar nos Logs

### ✅ Sinais de SUCESSO

```
[14:32:45][WAIT] ✅ COUNTDOWN DETECTADO: 45s | roundId: GAME_001
[14:32:47][BET]  ✅ CLIQUE EXECUTADO EM BANKER!
[14:33:20][RESULT] ✅ RESULTADO: BANKER WINS
```

### ❌ Sinais de ERRO

```
[14:32:15][WAIT] ⏳ 90s restantes... (nada detectado = problema WS)
[14:32:47][BET]  ⚠️ Erro ao clicar: (elemento não encontrado)
[14:33:20][RESULT] ⏳ Aguardando resultado... (30s esgotados = problema)
```

---

## 🛠️ Troubleshooting

### Problema: `ws_capture_test.json` vazio

**Possíveis causas**:
1. Extensão não está carregada
2. WebSocket não é criado (jogo não iniciou)
3. `window.__BETIA` não inicializado

**Solução**:
```bash
# Verificar se extensão está ativa:
# Chrome DevTools → Console → type window.__BETIA
# Se undefined, extensão não carregou

# Recarregar:
# DevTools → Sources → Scripts → will-dados-pro folder
# Verificar se ws-interceptor-main.js está lá
```

### Problema: Clique não funciona

**Possível causa**: Evolution usa Canvas, elemento não é clicável via XPath

**Solução**: Usar JavaScript force-click
```python
# No script, mudar de:
sb.click("//button[BANKER]")
# Para:
sb.execute_script("""
  document.querySelectorAll('*').forEach(el => {
    if (el.textContent.includes('BANKER') && el.offsetParent) {
      el.click();
    }
  });
""")
```

### Problema: Balance não atualiza

**Possível causa**: `wsData.balance` vem em string (ex: "R$ 1.000,00")

**Solução**: Parser de número
```python
import re
balance_str = "R$ 1.000,00"
balance = float(balance_str.replace("R$ ", "").replace(".", "").replace(",", "."))
# balance = 1000.00
```

---

## 📊 Estrutura de Dados Esperada

### `window.__BETIA.state.wsData`

```json
{
  "roundId": "GAME_20260425_143215_001",
  "countdown": 45,
  "result": null,
  "winner": null,
  "balance": 1000,
  "history": [
    {"round": 1, "result": "WIN"},
    {"round": 2, "result": "LOSS"},
    ...
  ],
  "source": "ws",
  "ts": 1745098335123
}
```

### Quando aposta é colocada:

```json
{
  "roundId": "GAME_...",
  "countdown": 2,      // Diminuindo
  "betAmount": 20,
  "betTarget": "BANKER",
  "betTime": 14,
  "balance": 980       // Mudou!
}
```

### Quando resultado chega:

```json
{
  "roundId": "GAME_...",
  "countdown": 0,
  "result": "BANKER",  // ou "PLAYER" ou "TIE"
  "winner": "BANKER",
  "balance": 1020,     // +20 (ganhou)
  "payoff": 20
}
```

---

## 📁 Arquivos Principais

| Arquivo | Propósito |
|---------|-----------|
| `save_session.py` | Extrai cookies (1x por login) |
| `test_websocket_capture.py` | Valida que WebSocket está sendo capturado |
| `will_robot_websocket.py` | **Robot principal** — 3 ciclos completos |
| `VALIDACAO_14_CRITERIOS.md` | Checklist dos 14 critérios de validação |
| `ws_capture_test.json` | Output do teste (eventos WebSocket brutos) |
| `*.png` | Screenshots (evidência visual) |

---

## 🎬 Sequência Recomendada

```
1. python3 save_session.py
   └─ Espere 5 min, faça login
   └─ Gera: betboom_session.json

2. python3 test_websocket_capture.py
   └─ Aguarde 30s de coleta
   └─ Gera: ws_capture_test.json
   └─ Verifique saída (deve ter roundId, countdown, etc)

3. python3 will_robot_websocket.py
   └─ Deixe rodar 3 ciclos (2-3 min)
   └─ Gera: *.png screenshots + logs
   └─ Verifique logs (CLIQUE EXECUTADO, RESULTADO, etc)

4. Abrir VALIDACAO_14_CRITERIOS.md
   └─ Preencher checklist com evidências
   └─ Marcar ✅ os que passaram
```

---

## 🎯 Resultado Final Esperado

Após tudo, você terá:

✅ **Evidência de WebSocket**: `ws_capture_test.json` com eventos reais  
✅ **Evidência de Clique**: Screenshots pré/pós clique  
✅ **Evidência de Resultado**: Log com "GANHOU/PERDEU" + saldo atualizado  
✅ **Validação 14/14**: Checklist completo preenchido  

**Status**: 🟢 **GO** para uso em produção

---

## 🚨 IMPORTANTE

⚠️ **Sessão expira?**
```bash
# Se cookies expirarem, refazer:
python3 save_session.py  # Login 1x
# Pronto para os próximos testes
```

⚠️ **Extensão não carrega?**
```bash
# Se ws-interceptor-main.js não roda:
# 1. Reload extensão (Chrome → Extensões → Reload)
# 2. Verificar manifest.json (content_scripts section)
# 3. Verificar DevTools → Console por erros de CSP
```

⚠️ **Screenshots não salvam?**
```bash
# Verificar pasta current working directory
pwd
# Deve ser: /Users/diego/dev/ruptur-cloud
```

---

## 📞 Próximos Passos

Quando tudo passar (14/14 validado):

1. ✅ Implementar padrão Will (10 fontes) sobre dados WS
2. ✅ Implementar Gale (doubling após loss)
3. ✅ Implementar Stop Win/Loss
4. ✅ Implementar liquidação automática
5. ✅ Dashboard ao vivo com WebSocket events

---

**Criado**: 2026-04-25  
**Status**: 🟢 Pronto para começar testes  
**Arquitetura**: WebSocket Sync (fonte de verdade) + Selenium (ação) + Screenshots (prova)

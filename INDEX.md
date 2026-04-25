# 📚 Will Dados Pro — Índice Completo

## 🎯 Comece Aqui

### Para entender rápido (5 min)
1. **[QUICK_START.txt](QUICK_START.txt)** — 3 passos, saída esperada, troubleshooting
2. **[STATUS_FINAL.txt](STATUS_FINAL.txt)** — Resumo executivo, o que foi encontrado

### Para entender tecnicamente (20 min)
1. **[ARQUITETURA_VISUAL.txt](ARQUITETURA_VISUAL.txt)** — Diagrama fluxo + validação
2. **[README_WEBSOCKET_SYNC.md](README_WEBSOCKET_SYNC.md)** — Guia completo com exemplos

---

## 🚀 Scripts Python

| Script | Propósito | Tempo | Quando usar |
|--------|-----------|-------|------------|
| **save_session.py** | Extrair cookies BetBoom | 5 min | 1x ao fazer login |
| **test_websocket_capture.py** | Validar captura WebSocket | 1 min | Antes de rodar robot |
| **will_robot_websocket.py** | **ROBOT PRINCIPAL** | 3-5 min | Teste completo (3 ciclos) |

### Como rodar (ordem)

```bash
# 1. Se cookies expirados (a cada ~24h)
python3 save_session.py
# → Você faz login (5 min)
# → Output: betboom_session.json

# 2. Validar WebSocket (30s coleta)
python3 test_websocket_capture.py
# → Output: ws_capture_test.json

# 3. Rodar robot (3 ciclos, 5 min)
python3 will_robot_websocket.py
# → Output: 9 screenshots (*.png) + logs
```

---

## 📋 Validação (14 Critérios)

**[VALIDACAO_14_CRITERIOS.md](VALIDACAO_14_CRITERIOS.md)**

Preencha este checklist após rodar `will_robot_websocket.py`:

| # | Critério | Status | Evidência |
|-|-|-|-|
| 1 | Capturar WebSocket | ✅/❌ | ws_capture_test.json |
| 2 | RoundId identificado | ✅/❌ | Log: `roundId: GAME_001` |
| ... | ... | ... | ... |
| 14 | Sem inconsistência | ✅/❌ | 3 ciclos completados |

**Resultado Final:**
- ✅ **GO** — Todos os 14 critérios passaram
- ❌ **NO-GO** — Algum critério falhou

---

## 📁 Arquivos Gerados

Após rodar os testes, você terá:

### 1. Cookies (permanente)
```
betboom_session.json  ← Use em todos os testes
```

### 2. Evidência WebSocket
```
ws_capture_test.json  ← Eventos brutos do servidor (JSON)
```

### 3. Evidência Visual (9 screenshots)
```
01_pre_clique.png
01_pos_clique.png
01_resultado.png
02_pre_clique.png
02_pos_clique.png
02_resultado.png
03_pre_clique.png
03_pos_clique.png
03_resultado.png
```

### 4. Logs (no terminal)
```
[HH:MM:SS.mmm][TAG] Mensagem com timestamp e contexto
```

---

## 🏗️ Arquitetura

### Fluxo de Dados
```
Evolution Gaming WebSocket
     ↓ (captura nativa)
ws-interceptor-main.js (MAIN world)
     ↓ (postMessage)
ws-interceptor-isolated.js (ISOLATED world)
     ↓ (armazenamento)
window.__BETIA.state.wsData
     ↓ (JavaScript)
Selenium execute_script()
     ↓ (Python)
will_robot_websocket.py (decisão + clique)
     ↓ (evidência)
Screenshots + Logs + JSON
```

### Componentes Principais

**Extensão (já existe):**
- `ws-interceptor-main.js` — captura WebSocket nativa
- `ws-interceptor-isolated.js` — armazena dados
- `injector.js` — carrega automaticamente
- `state.js` — inicializa `window.__BETIA`

**Scripts Python (novos):**
- `save_session.py` — extrai cookies
- `test_websocket_capture.py` — valida captura
- `will_robot_websocket.py` — **robot principal**

---

## 🔍 Troubleshooting

### Problema: Nenhum dado capturado

```
❌ PROBLEMA:
   test_websocket_capture.py mostra "❌ NENHUM DADO CAPTURADO!"

CAUSA:
   Extensão não está ativa ou carregada

SOLUÇÃO:
   1. Chrome → chrome://extensions
   2. Procurar "Will Dados Pro"
   3. Garantir que está ATIVADA (azul)
   4. Clicar em "Reload"
   5. Reabrir BetBoom
   6. Rodar teste novamente
```

### Problema: Clique não funciona

```
❌ PROBLEMA:
   will_robot_websocket.py mostra "⚠️ Erro ao clicar"

CAUSA:
   Evolution usa Canvas, elemento não é clicável via XPath

SOLUÇÃO:
   Script já tem fallback JavaScript
   Se ainda não funcionar, usar force-click via JavaScript
```

### Problema: Sessão expirada

```
❌ PROBLEMA:
   Erro de autenticação ao abrir jogo

CAUSA:
   Cookies do BetBoom expiraram (~24h)

SOLUÇÃO:
   python3 save_session.py  # Fazer login novamente (1x)
   Pronto para próximos testes
```

---

## 📊 Saída Esperada

### test_websocket_capture.py
```
[14:32:15.123][WS] ✅ DADOS CAPTURADOS: ['countdown', 'roundId', 'balance']
[14:32:17.456][WS] Countdown: 45 | RoundId: ABC123 | Balance: 1000.00

✅ TOTAL DE CAPTURAS: 15
✅ Dados salvos em: ws_capture_test.json
```

### will_robot_websocket.py
```
╔═══════════════════════════════════════════╗
║ CICLO 1/3
╚═══════════════════════════════════════════╝
[14:32:45][WAIT] ✅ COUNTDOWN DETECTADO: 45s | roundId: GAME_001
[14:32:46][BET]  💰 CLICANDO EM BANKER...
[14:32:47][BET]  ✅ CLIQUE EXECUTADO EM BANKER!
[14:33:20][RESULT] ✅ RESULTADO: BANKER WINS | Saldo: R$ 1020

✅ SCREENSHOT: 01_pre_clique.png
✅ SCREENSHOT: 01_pos_clique.png
✅ SCREENSHOT: 01_resultado.png

... (ciclos 2 e 3)

🏆 3 ciclos completados!
```

---

## 🎯 Validação Final

### Checklist Rápido
- [ ] `ws_capture_test.json` contém eventos? (critérios 1-4)
- [ ] Screenshots mostram countdown? (critério 3)
- [ ] Screenshots mostram chip/bet? (critérios 7, 9)
- [ ] Screenshots mostram resultado? (critérios 10, 11)
- [ ] Logs mostram "CLIQUE EXECUTADO"? (critério 7)
- [ ] Logs mostram "GANHOU/PERDEU/EMPATE"? (critério 10)
- [ ] 3 ciclos completados sem erro? (critério 14)

### Resultado
- ✅ **GO** — Rodar em produção
- ❌ **NO-GO** — Investigar qual critério falhou

---

## 📞 Próximos Passos (após GO)

1. Implementar padrão Will (10 fontes) sobre `wsData.history`
2. Implementar Gale (doubling após loss)
3. Implementar Stop Win/Loss
4. Implementar liquidação automática
5. Dashboard ao vivo com eventos WebSocket

---

## 📚 Leitura Recomendada (por perfil)

### Para desenvolvimento rápido
1. [QUICK_START.txt](QUICK_START.txt)
2. [will_robot_websocket.py](will_robot_websocket.py) (ler código)

### Para entender tudo
1. [STATUS_FINAL.txt](STATUS_FINAL.txt)
2. [ARQUITETURA_VISUAL.txt](ARQUITETURA_VISUAL.txt)
3. [README_WEBSOCKET_SYNC.md](README_WEBSOCKET_SYNC.md)
4. [VALIDACAO_14_CRITERIOS.md](VALIDACAO_14_CRITERIOS.md)

### Para troubleshooting
1. [README_WEBSOCKET_SYNC.md](README_WEBSOCKET_SYNC.md) → seção "Troubleshooting"
2. [QUICK_START.txt](QUICK_START.txt) → seção "⚡ TROUBLESHOOTING"

---

## 🎬 Timeline Típico

```
T+0min    → python3 save_session.py (já tem cookies? pule)
T+5min    → python3 test_websocket_capture.py
T+6min    → Verificar ws_capture_test.json (tem dados?)
T+7min    → python3 will_robot_websocket.py
T+12min   → Verificar screenshots (*.png)
T+14min   → Preencher VALIDACAO_14_CRITERIOS.md
T+16min   → Resultado: ✅ GO ou ❌ NO-GO
```

---

## ✅ Checklist Antes de Começar

- [ ] Extensão "Will Dados Pro" ativada no Chrome
- [ ] SeleniumBase instalado: `pip install seleniumbase`
- [ ] CWD = `/Users/diego/dev/ruptur-cloud/`
- [ ] Cookies válidos (se > 24h, rodar `save_session.py`)
- [ ] BetBoom acessível
- [ ] Python 3.8+ disponível

---

## 🆘 Precisa de Ajuda?

1. **Erro de captura WebSocket** → Ver troubleshooting no [README_WEBSOCKET_SYNC.md](README_WEBSOCKET_SYNC.md)
2. **Erro de clique** → Ver troubleshooting no [STATUS_FINAL.txt](STATUS_FINAL.txt)
3. **Não entende a arquitetura** → Ler [ARQUITETURA_VISUAL.txt](ARQUITETURA_VISUAL.txt)
4. **Quer começar agora** → Seguir [QUICK_START.txt](QUICK_START.txt)

---

## 📄 Lista de Arquivos

```
📂 /Users/diego/dev/ruptur-cloud/
├── 📄 INDEX.md                          ← Este arquivo
├── 📄 QUICK_START.txt                   ← Comece aqui (5 min)
├── 📄 STATUS_FINAL.txt                  ← Resumo executivo
├── 📄 ARQUITETURA_VISUAL.txt            ← Diagrama técnico
├── 📄 README_WEBSOCKET_SYNC.md          ← Guia completo
├── 📄 VALIDACAO_14_CRITERIOS.md         ← Checklist (preencher)
│
├── 🐍 save_session.py                   ← Extrair cookies (1x)
├── 🐍 test_websocket_capture.py         ← Validar WebSocket
├── 🐍 will_robot_websocket.py           ← ROBOT PRINCIPAL
│
├── 💾 betboom_session.json              ← Cookies (gerado)
├── 📊 ws_capture_test.json              ← WebSocket events (gerado)
├── 🖼️  01_pre_clique.png                ← Evidência (gerado)
├── 🖼️  01_pos_clique.png
├── 🖼️  01_resultado.png
├── ...
└── 🖼️  03_resultado.png
```

---

**Criado**: 2026-04-25  
**Status**: ✅ Pronto para começar  
**Tempo estimado**: ~15 minutos para validação completa

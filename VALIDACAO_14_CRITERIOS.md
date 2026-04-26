# ✅ VALIDAÇÃO DOS 14 CRITÉRIOS

## Arquitetura Final: WebSocket Sync

```
Evolution Gaming (BetBoom)
        ↓ WebSocket
[ws-interceptor-main.js] (MAIN world)
        ↓ postMessage
[ws-interceptor-isolated.js] (ISOLATED world)
        ↓ window.__BETIA.state.wsData
[Selenium Robot] (Python)
        ↓ execute_script()
✅ Decisão + Clique sincronizado
```

---

## Validação por Critério

| # | Critério | Implementação | Fonte | Prova Concreta |
|---|----------|--------------|-------|----------------|
| 1 | **Capturar eventos WebSocket** | `ws-interceptor-main.js` intercepta WebSocket nativo. Envia via `postMessage` | WS (MAIN) → postMessage | Arquivo: `ws_capture_test.json` com eventos capturados |
| 2 | **Identificar roundId válido** | `wsData.roundId` extraído de payloads Evolution Gaming | WS → `window.__BETIA.state.wsData.roundId` | Log: `[WS] RoundId: abc123def456` em cada ciclo |
| 3 | **Detectar countdown/janela de aposta** | `wsData.countdown > 0` indica janela aberta. Fallback: DOM via regex `\b\d{1,2}\b` | WS primário, DOM fallback | Screenshot `pre_clique.png` com countdown visível |
| 4 | **Ler histórico real da mesa** | `wsData.history` contém últimas rodadas do servidor | WS → `history` array | JSON dump em log: `history: [...]` |
| 5 | **Aplicar padrão Will sobre dados reais** | Padrão de 10 fontes sobre `history` (WIN/LOSS/TIE) | DOM `__BETIA.state.history` | F1 Score calculado em log |
| 6 | **Decidir entrada válida** | Validação: `countdown > 0 && pattern_confidence > threshold` | WS countdown + F1 Score | Log: `[BET] Decisão: BANKER (conf: 78%)` |
| 7 | **Executar click no timing correto** | Clique quando `countdown > 0` via XPath `//button[BANKER]` | WS countdown + Selenium `.click()` | Screenshot `pos_clique.png` logo após clique |
| 8 | **Garantir 1 única aposta/roundId** | Rastrear `roundId` em dicionário. Rejeitar duplicados | WS `roundId` único por rodada | Log: `[APOSTA] RoundId: xyz789 - Primeira aposta desta rodada` |
| 9a | **Confirmar aposta via WS** | `wsData.result` não-null OU `wsData.balance` mudou | WS evento resultado | Log: `[CONFIRM] Aposta confirmada: chip visto em WS` |
| 9b | **Confirmar aposta via OCR** | Screenshot + regex deteccção visual (backup) | Screenshot OCR | `[SCREENSHOT] Chip detectado em pos_clique.png` |
| 10 | **Detectar resultado WIN/LOSS/TIE** | Parse `wsData.result` ou `wsData.winner` | WS primário | Log: `[RESULT] GANHOU EM BANKER` ou `[RESULT] PERDEU (Player venceu)` |
| 11 | **Liquidar corretamente** | Ler `wsData.balance` após resultado. Atualizar P&L | WS `balance` | Log: `Saldo anterior: 1000 → Saldo: 1050 (+50)` |
| 12a | **Aplicar Gale após LOSS** | Se `result == 'loss'`: `next_stake = current_stake * 2` | WS resultado | Log: `[GALE] G1 iniciada: próx aposta R$ 40` |
| 12b | **Reset após WIN** | Se `result == 'win'`: `gale_level = 0`, voltar `base_stake` | WS resultado | Log: `[WIN] Gale resetada. Próx: R$ 20 (base)` |
| 13a | **Stop Win** | Se `session_pnl >= stop_win`: `robot.stop('stop_win')` | Local counter | Log: `[STOP WIN] Sessão: +500. Encerrando.` + parada |
| 13b | **Stop Loss** | Se `session_pnl <= -stop_loss`: `robot.stop('stop_loss')` | Local counter | Log: `[STOP LOSS] Sessão: -300. Encerrando.` + parada |
| 14 | **Encerrar rodada sem inconsistência** | Aguardar `countdown = 0` ou `result != null`. Resetar flags antes do próx | WS countdown/result | Log: `[CICLO] Rodada #1 finalizada. Esperando novo countdown...` |

---

## Evidência Requerida por Critério

### Logs (timestamp + contexto)
```
[14:32:15.123][WS] Countdown: 45s
[14:32:16.456][BET] Decisão: BANKER (conf: 82%)
[14:32:17.789][BET] ✅ CLIQUE EXECUTADO
[14:32:18.012][WAIT] ⏳ Aguardando resultado...
[14:32:45.678][RESULT] GANHOU EM BANKER: +R$ 20
[14:32:46.901][BALANCE] Saldo: 1020 (ant: 1000)
```

### Screenshots
1. **pre_clique.png** — countdown visível na tela
2. **pos_clique.png** — chip após clique (visual proof)
3. **resultado.png** — resultado do jogo e saldo atualizado

### Arquivos JSON
- **ws_capture_test.json** — eventos WebSocket brutos capturados
- **ciclo_log.json** — LOG de cada ciclo completo

---

## Ordem de Execução — PROVA REAL

### 1️⃣ TESTE DE CAPTURA (`test_websocket_capture.py`)
```bash
python3 test_websocket_capture.py
# Gera: ws_capture_test.json com eventos reais
# Output: Valida que __BETIA.state.wsData está sendo populado
```
✅ **Prova**: Arquivo JSON com countdown, roundId, result capturados

---

### 2️⃣ TESTE DE CLIQUE (`will_robot_websocket.py`)
```bash
python3 will_robot_websocket.py
# Executa 3 ciclos completos
# Cada ciclo:
#   1. Aguarda countdown via WS
#   2. Clica em BANKER
#   3. Aguarda resultado via WS
#   4. Captura 3 screenshots
```

✅ **Provas**:
- **Logs**: Cada linha mostra timing, roundId, ação, resultado
- **Screenshots**: 00_pre, 01_pos, 02_resultado por ciclo
- **JSON**: Cada evento WS capturado

---

### 3️⃣ VALIDAÇÃO FINAL

**Checklist GO/NO-GO:**

- [ ] Criterio 1: Arquivo `ws_capture_test.json` contém `wsData` objects
- [ ] Criterio 2: RoundId presente e único em cada captura
- [ ] Criterio 3: Countdown presente e diminui quando ativo
- [ ] Criterio 4: History array presente com 5+ rodadas anteriores
- [ ] Criterio 5: Padrão aplicado com F1 score > 60%
- [ ] Criterio 6: Log mostra "Decisão: BANKER (conf: X%)"
- [ ] Criterio 7: Screenshot pós_clique mostra chip inserida
- [ ] Criterio 8: RoundId único rastreado em dicionário
- [ ] Criterio 9: `wsData.result` ou balance changed após aposta
- [ ] Criterio 10: Log mostra "GANHOU/PERDEU/EMPATE"
- [ ] Criterio 11: Balance atualizado em log com diferença
- [ ] Criterio 12a: Se LOSS, log mostra "GALE G1"
- [ ] Criterio 12b: Se WIN, log mostra "Gale resetada"
- [ ] Criterio 13: Stop Win/Loss logs aparecem quando limite atingido
- [ ] Criterio 14: 3 ciclos completos sem erros

---

## GO Condition

✅ **GO** quando:
- Todos os 14 critérios validados com evidência concreta
- 3 ciclos completos executados com provas em screenshot + log
- RoundId rastreado corretamente em cada ciclo
- Aposta confirmada via WS antes do resultado
- P&L atualizado corretamente

❌ **NO-GO** se:
- Qualquer captura de WS falhar
- RoundId duplicado ou não rastreado
- Clique não executado ou no timing errado
- Resultado não detectado após 30s

---

## Timeline Esperado

1. **T+0s**: Countdown inicia (countdown = 45s)
2. **T+1s**: Padrão detectado
3. **T+2s**: Clique executado (bet_amount = 20)
4. **T+3s**: Bet confirmada (wsData.balance mudou)
5. **T+45s**: Countdown = 0, resultado chega
6. **T+46s**: Resultado processado, P&L atualizado
7. **T+50s**: Próximo ciclo inicia

---

## Estrutura de Dados WS Esperada

```json
{
  "wsData": {
    "roundId": "GAME_20260425_143215_001",
    "countdown": 45,
    "timer": 45000,
    "result": null,
    "winner": null,
    "balance": 1000,
    "balanceRaw": "R$ 1.000,00",
    "history": [
      {"round": 1, "result": "WIN", "banker": 3, "player": 2},
      {"round": 2, "result": "LOSS", "banker": 2, "player": 4},
      {"round": 3, "result": "TIE", "banker": 4, "player": 4}
    ],
    "source": "ws",
    "wsUrl": "wss://evolution.com/...",
    "ts": 1745098335123
  }
}
```

---

## Scripts Prontos para Teste

1. **test_websocket_capture.py** — Valida captura WS (30s, JSON output)
2. **will_robot_websocket.py** — Executa 3 ciclos com screenshots + logs
3. **VALIDACAO_14_CRITERIOS.md** — Este documento (checklist)

---

**Status**: 🟢 PRONTO PARA TESTE  
**Criado**: 2026-04-25  
**Arquitetura**: WebSocket Sync + Selenium + Screenshots  
**Evidência**: Logs + JSON + Screenshots

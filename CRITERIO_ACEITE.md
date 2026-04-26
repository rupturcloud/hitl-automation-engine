# ✅ CRITÉRIO DE ACEITE — ROBO WILL

**Versão:** 1.0  
**Data:** 2026-04-25  
**Status:** Definido

---

## 📋 DEFINIÇÃO DO OBJETIVO

O ROBO WILL é considerado **OPERACIONAL** e **ACEITO** quando:

### Requisito 1: Click Executado
- ✅ Mouse se move para a cor (PLAYER/BANKER/TIE)
- ✅ Click é enviado para a coordenada correta
- ✅ Visualização mostra movimento (screenshot antes/depois)

**Métrica:** 1+ clicks executados sem erro

---

### Requisito 2: Aposta Registrada
- ✅ Saldo **DIMINUI** imediatamente após o click
- ✅ Sistema mostra "aposta pendente" ou similar
- ✅ Interface muda (botões desabilitados, countdown inicia)

**Métrica:** Saldo muda ≥ 1 click executado

---

### Requisito 3: Resultado Recebido
- ✅ Mesa executa o jogo (dealer revela cartas)
- ✅ Resultado é exibido (WIN/LOSS/TIE)
- ✅ Saldo é atualizado com ganho/perda

**Métrica:** ≥ 1 resultado por click

---

### Requisito 4: Ciclo Completo
- ✅ click PLAYER → aposta registrada → resultado → saldo muda
- ✅ click BANKER → aposta registrada → resultado → saldo muda
- ✅ click TIE → aposta registrada → resultado → saldo muda

**Métrica:** 3 ciclos (PLAYER, BANKER, TIE) × 100% sucesso

---

## 📊 MATRIZ DE ACEITE

| Requisito | Métrica | Esperado | Status |
|-----------|---------|----------|--------|
| 1. Click Executado | Clicks > 0 | ≥ 1 | ⏳ |
| 2. Aposta Registrada | ΔSaldo > 0 | ≥ 1 | ⏳ |
| 3. Resultado Recebido | Results > 0 | ≥ 1 | ⏳ |
| 4. Ciclo Completo | Clicks = Bets = Results | 3/3 | ⏳ |

**Taxa Mínima de Aceite:** 80%

---

## 🎯 CRITÉRIOS DE REJEIÇÃO (NÃO ACEITO)

Se **QUALQUER** um destes ocorrer:
- ❌ Saldo não muda após 3+ clicks
- ❌ Click é enviado mas aposta não é registrada
- ❌ Resultado não aparece após aposta
- ❌ Synchronization: Clicks ≠ Bets ≠ Results

---

## 📈 TELEMETRIA OBRIGATÓRIA

Para cada teste, capturar:

```json
{
  "test_id": "ABC123",
  "timestamp": "2026-04-25T21:16:00Z",
  "metrics": {
    "total_clicks": 3,
    "registered_clicks": 3,
    "balance_changes": 3,
    "confirmed_bets": 3,
    "received_results": 3
  },
  "baseline_balance": 5.28,
  "final_balance": 7.50,
  "criteria_acceptance": {
    "clicks_executed": true,
    "bets_registered": true,
    "balance_changed": true,
    "results_received": true,
    "sync": true,
    "acceptance_rate": "100%",
    "status": "ACEITO"
  }
}
```

---

## 🎬 EVIDÊNCIA VISUAL OBRIGATÓRIA

3 screenshots por click:
1. **ANTES:** Estado inicial (saldo, cores, buttons)
2. **APÓS CLICK:** Click foi executado (movimento do mouse visível)
3. **RESULTADO:** Resultado final (saldo atualizado, resultado mostrado)

**Total:** 3 cores × 3 screenshots = 9 screenshots mínimo

---

## ⏱️ TIMING ESPERADO

- Cada click: 1-2 segundos
- Cada resultado: 3-5 segundos
- Ciclo completo: 15-20 segundos
- 3 ciclos (PLAYER/BANKER/TIE): 45-60 segundos

---

## 🔍 VALIDAÇÃO AUTOMÁTICA

Sistema valida automaticamente:
```python
acceptance = {
    'clicks_executed': total_clicks > 0,
    'bets_registered': balance_changes > 0,
    'balance_changed': balance_final ≠ balance_baseline,
    'results_received': results > 0,
    'sync': (clicks == bets == results),
}
```

**Taxa de Aceite:**
- 100%: ACEITO ✅
- 80-99%: PARCIAL (revisar)
- <80%: REJEITADO ❌

---

## 📝 ASSINATURA

**Critério definido por:** Claude Code  
**Data:** 2026-04-25  
**Versão:** 1.0

**Proxima revisão:** Após primeiro teste com telemetria

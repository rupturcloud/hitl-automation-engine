# QuickStart — J.A.R.V.I.S. Game iFrame

**Status**: ✅ Pronto para Fase 2+ (Executor implementado, testado)

---

## 1. Instalação

```bash
cd /Users/diego/dev/ruptur-cloud/game-iframe-main

# Instalar dependências
pip install -r requirements.txt

# Instalar Playwright browsers
playwright install chromium
```

---

## 2. Testes Unitários (Validação)

```bash
# Schemas (contratos)
python3 tests/test_schemas.py

# Componentes (codes, events, reconciler)
python3 tests/test_components.py

# Integração (pipeline completo)
python3 tests/test_integration.py

# Executor (chip resolver, clique)
python3 tests/test_executor.py

# Todos de uma vez
pytest tests/ -v
```

**Resultado esperado**: ✅ 20+ testes passando

---

## 3. Execução do Sistema Completo

### Opção A: Daemon + Panel (Produção)

```bash
# Inicia daemon (agent contínuo) + panel (CLI interativa)
python3 src/main.py
```

**O que acontece:**
1. Daemon abre navegador e começa a capturar
2. Panel exibe status em tempo real
3. Alertas vermelhos bloqueiam entrada automaticamente
4. Você pode:
   - Ver countdown sincronizado
   - Digitar comando manual
   - Pausar/retomar
   - Parar completamente

### Opção B: Core Loop Só (Debug)

```bash
python3 -c "
import asyncio
from src.core_loop import CoreObservationLoop

async def main():
    core = CoreObservationLoop(debug=True)
    await core.run('https://betboom.com/pt-br/casino/game/evolution-bac-bo')

asyncio.run(main())
"
```

---

## 4. Verificação de Dataset

Após executar, verificar dataset:

```bash
# Ver últimas rodadas
ls -lh dataset/*/rounds.jsonl

# Verificar conteúdo (primeiras 2 rodadas)
head -2 dataset/*/rounds.jsonl | python3 -m json.tool | head -50

# Contar rounds gravados
wc -l dataset/*/rounds.jsonl
```

---

## 5. Checklist de Funcionalidade

- [x] **Observação Visual** — Captura screenshots com OCR
- [x] **WebSocket Hybrid** — Tenta direto, fallback Playwright
- [x] **Reconciliação** — Visual-first + corroboration
- [x] **Dataset JSONL** — Imutável, replayável, auditável
- [x] **Códigos de Alerta** — 50+ codes, severidade COLOR-CODED
- [x] **Daemon Agent** — Roda indefinidamente, respeitando pausas
- [x] **Operator Panel** — CLI com countdown, alertas, input manual
- [x] **Event Queue** — Comunicação daemon ↔ panel async
- [x] **Bet Executor** — ChipResolver + click determinístico + validação
- [x] **Exception Handling** — Específico, não engole bugs
- [x] **Timeouts** — 5s por iteração, 5min inatividade, gather timeout

---

## 6. Fluxo de Operação Manual

### Cenário: Entrar com 100 reais em BLUE quando a rodada abrir

1. **Sistema inicia**
   ```
   [Daemon] Iniciado: abc12345
   [Daemon] Executor pronto
   ```

2. **Painel aparece**
   ```
   ════════════════════════════
   J.A.R.V.I.S. OPERATOR PANEL
   ════════════════════════════
   
   [RUNNING] Mode: MANUAL
   Bankroll: R$ 1000.00
   Round: round-1
   
   ⏱  Countdown: 8s
   ███████░░░
   
   ─ ALERTAS ─
   ✓ Nenhum alerta crítico
   
   ─ CONTROLES ─
   [1] Iniciar        [2] Pausar         [3] Retomar
   [4] Parar          [5] Manual Entry   [q] Sair
   ```

3. **Você digita `5` (Manual Entry)**
   ```
   MANUAL ENTRY MODE
   Lado (BLUE/RED/TIE): BLUE
   Stake (R$): 100
   ✓ Comando injetado para round-1
   ```

4. **Sistema executa na próxima rodada**
   ```
   [Executor] Chip plan: [100] (soma=100)
   [Executor] Clique em BLUE com stake 100
   [Executor] Execução SUCCESS: exec-abc123
   ✓ Round round-1 gravado ao dataset
   ```

5. **Dataset registra tudo**
   ```json
   {
     "round_id": "round-1",
     "mode": "MANUAL",
     "manual_command": {
       "side": "BLUE",
       "stake": 100.0
     },
     "execution_result": {
       "status": "SUCCESS",
       "click_side_rendered": "BLUE",
       "click_stake_rendered": 100.0
     },
     "alerts": []
   }
   ```

---

## 7. Próximos Passos (Fase 3+)

| Fase | Componente | Status |
|------|-----------|--------|
| 1 | Core Loop + Panel | ✅ Completo |
| 2 | Bet Executor | ✅ Completo |
| 3 | Pattern Engine (Determinístico) | ⏳ Próximo |
| 4 | Progression + Risk | ⏳ Depois |
| 5 | Pattern Engine (Preditivo) + F1 | ⏳ Final |

---

## 8. Troubleshooting

### "Nenhuma captura há 5 minutos"
**Causa**: Vision observer travou
**Solução**: Verificar se navegador está respondendo, reiniciar

### "Saldo visual e saldo interno divergentes"
**Causa**: Intervenção manual na UI durante execução
**Solução**: Deixar o robô executar sem interferência

### "Botões de aposta não visíveis"
**Causa**: Seletor desatualizado (Evolution mudou layout)
**Solução**: Atualizar seletor em `bet_executor.py`

### "Stake não montável com fichas"
**Causa**: Valor solicitado não é combinação possível
**Solução**: Usar múltiplos de 5 (ex: 50, 75, 100)

---

## 9. Métricas

Após executar por 1 hora:

```
Snapshots capturados:     ~3600 (1 por segundo)
Rounds processados:       ~60 (1 min por rodada)
Dataset tamanho:          ~10-20 MB (comprimível para <1 MB)
Tempo medio/iteração:     50ms
Taxa bloqueio:            0-5% (normal)
```

---

## 10. Segurança

✅ **Sem secrets no código** — Nenhuma credencial  
✅ **Input validado** — Panel rejeita valores inválidos  
✅ **Exception handling** — Não engole silenciosamente  
✅ **Timeouts obrigatórios** — Previne travamentos  
✅ **Auditoria total** — Cada ação está em dataset JSONL  
⚠️ **TODO**: Circuit breaker WebSocket (Fase 3)  
⚠️ **TODO**: Logging estruturado JSON (Fase 3)  

---

**Perguntas?** Ver `ARQUITETURA.md` para detalhes completos.

**Pronto?** `python3 src/main.py`

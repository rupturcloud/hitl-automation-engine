# Arquitetura J.A.R.V.I.S. — Game iFrame

## Visão Geral

Sistema de observação + automação de Bac Bo da Evolution com:
- **Agent contínuo** (daemon) capturando visual + WebSocket
- **Panel CLI** para controle em tempo real
- **Comunicação assíncrona** via event queue
- **Dataset estruturado** em JSONL para replay

```
┌─────────────────────────────────────────────────────────┐
│                  main.py (entry point)                  │
├─────────────────┬───────────────────────────────────────┤
│                 │                                       │
│  Daemon         │        Operator Panel                 │
│  ┌───────────┐  │      ┌──────────────────┐            │
│  │core_loop  │  │      │ CLI Interactive  │            │
│  │ vision    │  │      │ Status + Controls│            │
│  │ websocket │  │      │ Countdown        │            │
│  │ reconcile │  │      │ Alerts (RED)     │            │
│  │ record    │  │      └──────────────────┘            │
│  └───────────┘  │                                       │
│                 │                                       │
└─────────────────┴───────────────────────────────────────┘
                          │
                 global_event_queue
               (comunicação daemon ↔ panel)
```

## Componentes

### Daemon (`daemon.py`)
Agent contínuo que:
- Roda em background indefinidamente
- Captura visual via Playwright
- Observa WebSocket (híbrido)
- Reconcilia fontes
- Grava RoundRecords no dataset
- Emite eventos para o panel

**Estados:**
- `IDLE` — aguardando inicialização
- `RUNNING` — capturando e processando
- `PAUSED` — pausado, aguardando retomada
- `BLOCKED` — divergência crítica
- `ERROR` — erro operacional

### Panel (`operator_panel.py`)
CLI interativa que:
- Exibe status do daemon em tempo real
- Mostra countdown sincronizado
- Alerta críticos em **VERMELHO**
- Permite start/pause/stop
- Aceita entrada manual (lado + stake)

### Core Loop (`core_loop.py`)
Orquestra:
- Captura visual (VisionObserver)
- Observação WebSocket (WebSocketObserver)
- Reconciliação de fontes (StateReconciler)
- Gravação em dataset (DatasetRecorder)

### Reconciliador (`state_reconciler.py`)
Cruza múltiplas fontes em ordem de prioridade:

1. **VISUAL** (source of truth) — o que o humano vê
2. **WEBSOCKET** (corroboration + timing) — eventos da Evolution
3. **DOM** (auxiliary) — leitura de elementos

Bloqueios críticos:
- Divergência de banca > tolerância
- Confiança visual < limiar
- UI inconsistente

### Dataset (`dataset_recorder.py`)
Grava RoundRecords em JSONL:
```
dataset/
└── {session_id}/
    └── rounds.jsonl  (cada linha = um round completo + auditoria)
```

Estrutura de round replayável:
- Snapshots visuais
- Eventos WebSocket
- Reconciliação
- Decisões
- Execuções
- Resultados
- Alertas

## Fluxo de Dados

```
1. Vision Capture
   └─> VisualSnapshot (frame hash, confidence, dados)

2. WebSocket Events
   └─> WebSocketState (eventos da Evolution)

3. Reconciliation
   └─> ReconciledSnapshot (visual-first, com corroboration)

4. Round Recording
   └─> RoundRecord (JSONL no dataset)

5. Panel Events
   └─> Operator vê status em tempo real
```

## Como Usar

### Iniciar Sistema

```bash
cd /Users/diego/dev/ruptur-cloud/game-iframe-main/src
python3 main.py
```

Isso inicia:
1. Daemon rodando em background (capture + record)
2. Panel CLI exibindo status em tempo real

### Controles Disponíveis (no painel)

- **[1]** Iniciar daemon
- **[2]** Pausar execução
- **[3]** Retomar execução
- **[4]** Parar completamente
- **[5]** Entrada manual (escolhe lado + stake)
- **[q]** Sair

### Modo Manual

Panel prompta:
```
Lado (BLUE/RED/TIE): BLUE
Stake (R$): 50
```

Comando é injetado no daemon e executado na próxima rodada.

## Dataset e Replay

Cada sessão gera um arquivo JSONL:

```bash
# Ver últimas rodadas
cat dataset/{session_id}/rounds.jsonl | tail -5 | jq .

# Carregar para análise/F1 score
python3 -c "
import json
with open('dataset/{session_id}/rounds.jsonl') as f:
    for line in f:
        round_record = json.loads(line)
        print(f\"Round {round_record['round_id']}: {round_record['mode']}\")
"
```

## Alertas e Bloqueios

Alertas são categorizados por severidade:

### 🔴 CRÍTICOS (RED) — Bloqueiam entrada

- `BANCA_COM_DIVERGENCIA_DE_DADOS` — saldo visual divergiu
- `SEM_CONFIANCA_VISUAL_MINIMA` — OCR/detecção fraca
- `STAKE_RENDERIZADA_DIFERENTE` — stake não bateu
- `JANELA_ENTRADA_EXPIRADA` — rodada fechou
- etc.

### 🟡 AVISOS (YELLOW) — Informam sem bloquear

- `CONFIANCA_VISUAL_REDUZIDA` — confiança em queda
- `DESSINCRONIA_VISUAL_WEBSOCKET` — fontes divergindo
- `MODO_DEBUG_ATIVO` — debug ligado
- etc.

### 🔵 INFO (BLUE) — Logs

- `SNAPSHOT_CAPTURADO`
- `ROUND_ABERTO`
- `RECONCILIACAO_OK`
- etc.

## Configuração

### `config.py`

```python
DATASET_DIR = "dataset/"
CAPTURE_INTERVAL = 1.0  # segundos entre captures
VISUAL_CONFIDENCE_MIN = 0.6  # manual
VISUAL_CONFIDENCE_MIN_AUTO = 0.85  # automático
BANKROLL_DIVERGENCE_TOLERANCE = 1.0  # %
```

### `codes.py`

Adicione novos códigos aqui se precisar de novos alertas/erros.

## Debugging

Ativar debug (padrão ligado):

```python
daemon = RobotDaemon(url, debug=True)
```

Aparece:
- Timestamp de cada captura
- Latência de operação
- Eventos emitidos
- Status do reconciliador

## Próximas Fases

**Fase 2:** Bet Executor
- Manual clique (determinístico)
- Validação pré/pós-clique
- Chip resolver

**Fase 3:** Pattern Engine
- Determinístico (18 padrões)
- Preditivo (RandNLA + score)

**Fase 4:** Progression + Risk
- Galé (dobra em loss, reseta em win, mantém em tie)
- Stops (loss, gain, sequência, divergência)

**Fase 5:** F1 Evaluator
- Ground truth
- TP/FP/FN/TN
- Baseline determinístico

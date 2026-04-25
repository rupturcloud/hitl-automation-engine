# 🧬 J.A.R.V.I.S. - Round & Snapshot Schemas
# Estruturas imutáveis para replayabilidade

from dataclasses import dataclass, asdict
from typing import List, Dict, Optional
from datetime import datetime
import json

@dataclass
class VisualSnapshot:
    """Captura do que o humano vê na tela."""
    snapshot_id: str
    captured_at: str  # ISO 8601
    frame_hash: str  # SHA256 do frame para auditoria
    confidence: float  # 0.0-1.0

    # Dados extraídos visualmente
    history: List[str]  # ["BLUE", "RED", "TIE", ...]
    bankroll_visual: float
    timer_remaining_ms: int
    phase: str  # "BETTING_OPEN" | "BETTING_CLOSING" | "LOCKED" | "RESULT"
    last_result: Optional[str]  # "BLUE" | "RED" | "TIE" | None

    # Saúde da leitura
    ui_issues: List[str] = None  # lista de problemas detectados

@dataclass
class WebSocketState:
    """Estado recebido via eventos do broker (Evolution)."""
    connected: bool
    phase: str
    event_timestamp: str  # ISO 8601
    sequence: int  # contador de eventos
    data: Dict = None  # payload bruto


@dataclass
class ReconciledSnapshot:
    """Snapshot final após cruzamento de fontes."""
    snapshot_id: str
    round_id: str
    reconciled_at: str  # ISO 8601

    source_of_truth: str  # "VISUAL"
    visual_snapshot: VisualSnapshot
    websocket_state: Optional[WebSocketState]

    # Resultado da reconciliação
    visual_confidence: float
    visual_vs_websocket_match: bool
    visual_vs_dom_match: bool
    bankroll_divergent: bool
    history_divergent: bool
    window_divergent: bool

    # Estado efetivo (o que realmente vale)
    effective_phase: str
    effective_time_remaining_ms: int
    effective_bankroll: float
    effective_history: List[str]


@dataclass
class ManualCommand:
    """Comando do usuário."""
    command_id: str
    issued_at: str  # ISO 8601
    target_round_id: str
    side: str  # "BLUE" | "RED" | "TIE"
    stake: float
    expires_at: str  # ISO 8601


@dataclass
class DecisionEnvelope:
    """Decisão estruturada (saída do analisador)."""
    decision_id: str
    round_id: str
    decided_at: str  # ISO 8601

    status: str  # "ENTER" | "SKIP" | "WAIT" | "BLOCK" | "CANCEL_PENDING"
    origin: str  # "MANUAL" | "SEMI_AUTO" | "DETERMINISTIC" | "PREDICTIVE" | "HYBRID"

    side: Optional[str]  # "BLUE" | "RED" | "TIE" | None
    stake: Optional[float]
    progression_step: int  # qual nível de galé
    confidence: float  # 0.0-1.0

    # Rastreabilidade
    matched_patterns: List[Dict] = None  # [{"pattern_id": "P1", "engine": "DETERMINISTIC", "score": 0.95}]
    reasons: List[str] = None  # ["padrão P3 acionado", "banca válida"]

    # Validações checadas
    constraints_checked: Dict = None  # {"window_ok": true, "bankroll_ok": true, ...}

    expires_at: str = None  # ISO 8601


@dataclass
class ExecutionCommand:
    """Comando que vai para o executor."""
    execution_id: str
    decision_id: str
    round_id: str
    issued_at: str  # ISO 8601

    side: str  # "BLUE" | "RED" | "TIE"
    stake: float
    chips_plan: List[int]  # [100, 25, 25] para somar stake

    must_verify_ui_before_submit: bool = True
    must_verify_ui_after_submit: bool = True
    expires_at: str = None  # ISO 8601


@dataclass
class ExecutionResult:
    """Resultado da execução."""
    execution_id: str
    executed_at: str  # ISO 8601

    status: str  # "SUCCESS" | "FAILED" | "EXPIRED" | "CANCELLED"

    # Verificações pré-clique
    pre_click_ui_valid: bool
    pre_click_verification: Dict = None

    # Clique
    click_timestamp: Optional[str] = None
    click_side_rendered: Optional[str] = None
    click_stake_rendered: Optional[float] = None

    # Verificações pós-clique
    post_click_ui_valid: bool = False
    post_click_verification: Dict = None

    error_code: Optional[str] = None
    error_message: Optional[str] = None


@dataclass
class RoundOutcome:
    """Resultado da rodada após resolução."""
    round_id: str
    result_at: str  # ISO 8601

    result: str  # "BLUE" | "RED" | "TIE"
    execution_id: Optional[str]  # qual execução foi nesta rodada

    bankroll_before: float
    bankroll_after: float

    entry_was_correct: Optional[bool]  # se havia entrada, acertou?
    financial_outcome: float  # bankroll_after - bankroll_before


@dataclass
class RoundRecord:
    """Registro COMPLETO de uma rodada para replay."""
    session_id: str
    round_id: str

    # Timeline
    round_opened_at: str  # ISO 8601
    round_closed_at: Optional[str]
    result_confirmed_at: Optional[str]

    # Observação
    visual_snapshots: List[VisualSnapshot]  # múltiplas capturas por rodada
    websocket_events: List[WebSocketState]
    reconciled_snapshot: Optional[ReconciledSnapshot]

    # Decisão
    manual_command: Optional[ManualCommand]
    decision_envelope: Optional[DecisionEnvelope]

    # Execução
    execution_command: Optional[ExecutionCommand]
    execution_result: Optional[ExecutionResult]

    # Resultado
    round_outcome: Optional[RoundOutcome]

    # Metadados
    mode: str  # "MANUAL" | "SEMI_AUTO" | "DETERMINISTIC" | "PREDICTIVE" | "HYBRID"
    model_version: str  # versão dos padrões/modelos usados
    config_hash: str  # hash da configuração para auditoria

    # Alertas levantados nesta rodada
    alerts: List[Dict] = None  # [{"code": "CRIT_...", "message": "...", "timestamp": "..."}]


class RoundRecordEncoder(json.JSONEncoder):
    """JSON encoder para dataclasses."""
    def default(self, obj):
        if hasattr(obj, "__dataclass_fields__"):
            return asdict(obj)
        # Para outros tipos que não são JSON-serializáveis
        return str(obj)


def round_record_to_json(record: RoundRecord) -> str:
    return json.dumps(record, cls=RoundRecordEncoder, indent=2)


def round_record_from_json(json_str: str) -> RoundRecord:
    data = json.loads(json_str)
    # Reconstruct dataclasses from nested dicts if needed
    return RoundRecord(**data)

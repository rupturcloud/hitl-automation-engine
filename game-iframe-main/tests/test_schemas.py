"""Testes dos schemas (contratos)."""
import sys
import json
from pathlib import Path
from datetime import datetime

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from schemas import (
    VisualSnapshot, WebSocketState, ReconciledSnapshot,
    ManualCommand, DecisionEnvelope, ExecutionCommand,
    ExecutionResult, RoundOutcome, RoundRecord,
    RoundRecordEncoder
)

def test_visual_snapshot():
    """Testa criação e serialização de VisualSnapshot."""
    snap = VisualSnapshot(
        snapshot_id="snap-001",
        captured_at=datetime.utcnow().isoformat(),
        frame_hash="abc123",
        confidence=0.95,
        history=["BLUE", "RED", "TIE"],
        bankroll_visual=1000.0,
        timer_remaining_ms=5000,
        phase="BETTING_OPEN",
        last_result="RED",
        ui_issues=[]
    )

    assert snap.snapshot_id == "snap-001"
    assert snap.confidence == 0.95
    assert len(snap.history) == 3
    print("✓ VisualSnapshot OK")

def test_websocket_state():
    """Testa WebSocketState."""
    ws = WebSocketState(
        connected=True,
        phase="BETTING_OPEN",
        event_timestamp=datetime.utcnow().isoformat(),
        sequence=1,
        data={"type": "phase_change"}
    )

    assert ws.connected is True
    assert ws.sequence == 1
    print("✓ WebSocketState OK")

def test_decision_envelope():
    """Testa DecisionEnvelope."""
    decision = DecisionEnvelope(
        decision_id="dec-001",
        round_id="round-1",
        decided_at=datetime.utcnow().isoformat(),
        status="ENTER",
        origin="MANUAL",
        side="BLUE",
        stake=50.0,
        progression_step=0,
        confidence=1.0,
        matched_patterns=[],
        reasons=["usuario manual"],
        constraints_checked={"window_ok": True, "bankroll_ok": True}
    )

    assert decision.status == "ENTER"
    assert decision.side == "BLUE"
    print("✓ DecisionEnvelope OK")

def test_round_record_serialization():
    """Testa serialização de RoundRecord em JSON."""
    visual = VisualSnapshot(
        snapshot_id="snap-001",
        captured_at=datetime.utcnow().isoformat(),
        frame_hash="abc",
        confidence=0.9,
        history=["BLUE"],
        bankroll_visual=1000.0,
        timer_remaining_ms=5000,
        phase="BETTING_OPEN",
        last_result=None,
        ui_issues=[]
    )

    record = RoundRecord(
        session_id="sess-001",
        round_id="round-1",
        round_opened_at=datetime.utcnow().isoformat(),
        round_closed_at=None,
        result_confirmed_at=None,
        visual_snapshots=[visual],
        websocket_events=[],
        reconciled_snapshot=None,
        manual_command=None,
        decision_envelope=None,
        execution_command=None,
        execution_result=None,
        round_outcome=None,
        mode="MANUAL",
        model_version="v1.0",
        config_hash="hash123",
        alerts=[]
    )

    # Serializar
    json_str = json.dumps(record, cls=RoundRecordEncoder)
    data = json.loads(json_str)

    assert data["session_id"] == "sess-001"
    assert len(data["visual_snapshots"]) == 1
    print("✓ RoundRecord Serialization OK")

if __name__ == "__main__":
    test_visual_snapshot()
    test_websocket_state()
    test_decision_envelope()
    test_round_record_serialization()
    print("\n✅ Todos os testes de schemas passaram!")

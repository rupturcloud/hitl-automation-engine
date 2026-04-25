"""Testes dos componentes individuais."""
import sys
import asyncio
from pathlib import Path
from datetime import datetime

sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from codes import Codes, CodeSeverity, AlertLevel, format_alert
from communication import EventQueue, EventType, Event
from state_reconciler import StateReconciler
from schemas import VisualSnapshot

def test_codes():
    """Testa catálogo de códigos."""
    # Testa códigos críticos
    severity = Codes.get_severity(Codes.BANCA_COM_DIVERGENCIA_DE_DADOS)
    assert severity == CodeSeverity.CRITICAL
    print("✓ Critical codes OK")

    # Testa códigos de aviso
    severity = Codes.get_severity(Codes.CONFIANCA_VISUAL_REDUZIDA)
    assert severity == CodeSeverity.WARNING
    print("✓ Warning codes OK")

    # Testa info
    severity = Codes.get_severity(Codes.SNAPSHOT_CAPTURADO)
    assert severity == CodeSeverity.INFO
    print("✓ Info codes OK")

def test_alert_formatting():
    """Testa formatação de alertas."""
    alert = format_alert(
        Codes.BANCA_COM_DIVERGENCIA_DE_DADOS,
        "Saldo divergiu",
        "visual=1000 internal=950"
    )

    assert alert["code"] == Codes.BANCA_COM_DIVERGENCIA_DE_DADOS
    assert alert["severity"] == CodeSeverity.CRITICAL
    assert alert["alert_level"] == AlertLevel.RED
    assert "visual=1000" in alert["technical"]
    print("✓ Alert formatting OK")

async def test_event_queue():
    """Testa fila de eventos."""
    queue = EventQueue()

    # Adicionar eventos
    event1 = Event(
        event_type=EventType.SNAPSHOT_CAPTURED,
        timestamp=datetime.utcnow().isoformat(),
        data={"snapshot_id": "snap-001"},
        severity="INFO"
    )
    await queue.put(event1)

    event2 = Event(
        event_type=EventType.ALERT_CRITICAL,
        timestamp=datetime.utcnow().isoformat(),
        data={"code": "CRIT_BANK_DIV"},
        severity="CRITICAL"
    )
    await queue.put(event2)

    # Recuperar eventos
    got_event1 = await queue.get(timeout=1.0)
    assert got_event1.event_type == EventType.SNAPSHOT_CAPTURED
    print("✓ EventQueue: put/get OK")

    got_event2 = await queue.get(timeout=1.0)
    assert got_event2.event_type == EventType.ALERT_CRITICAL
    print("✓ EventQueue: multiple events OK")

    # Histórico
    history = queue.get_latest(limit=5)
    assert len(history) == 2
    print("✓ EventQueue: history OK")

def test_reconciler():
    """Testa StateReconciler básico."""
    reconciler = StateReconciler(debug=False)

    # Snapshot válido
    visual = VisualSnapshot(
        snapshot_id="snap-001",
        captured_at=datetime.utcnow().isoformat(),
        frame_hash="abc",
        confidence=0.95,
        history=["BLUE", "RED"],
        bankroll_visual=1000.0,
        timer_remaining_ms=5000,
        phase="BETTING_OPEN",
        last_result=None,
        ui_issues=[]
    )

    reconciled, is_valid = reconciler.reconcile(visual, websocket=None)
    assert is_valid is True
    assert reconciled is not None
    assert reconciled.effective_bankroll == 1000.0
    print("✓ Reconciler: valid snapshot OK")

    # Snapshot com confiança baixa
    visual_low = VisualSnapshot(
        snapshot_id="snap-002",
        captured_at=datetime.utcnow().isoformat(),
        frame_hash="def",
        confidence=0.3,  # Muito baixa
        history=[],
        bankroll_visual=0.0,
        timer_remaining_ms=0,
        phase="UNKNOWN",
        last_result=None,
        ui_issues=["BANKROLL_NOT_DETECTED", "TIMER_NOT_DETECTED"]
    )

    reconciled, is_valid = reconciler.reconcile(visual_low, websocket=None)
    assert is_valid is False
    print("✓ Reconciler: low confidence rejection OK")

    # Divergência de banca
    reconciler.last_bankroll = 1000.0
    visual_div = VisualSnapshot(
        snapshot_id="snap-003",
        captured_at=datetime.utcnow().isoformat(),
        frame_hash="ghi",
        confidence=0.9,
        history=["BLUE"],
        bankroll_visual=900.0,  # Divergiu 100 (10%)
        timer_remaining_ms=3000,
        phase="BETTING_OPEN",
        last_result=None,
        ui_issues=[]
    )

    reconciled, is_valid = reconciler.reconcile(visual_div, websocket=None)
    assert is_valid is False  # Bloqueado por divergência
    assert reconciler.is_blocked is True
    print("✓ Reconciler: bankroll divergence blocking OK")

if __name__ == "__main__":
    test_codes()
    test_alert_formatting()

    # Testes async
    asyncio.run(test_event_queue())

    test_reconciler()

    print("\n✅ Todos os testes de componentes passaram!")

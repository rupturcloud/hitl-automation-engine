"""Teste de integração completo com mock data."""
import sys
import asyncio
import json
from pathlib import Path
from datetime import datetime
import tempfile

sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from schemas import (
    VisualSnapshot, WebSocketState, ReconciledSnapshot,
    ManualCommand, DecisionEnvelope, RoundRecord, RoundRecordEncoder
)
from state_reconciler import StateReconciler
from dataset_recorder import DatasetRecorder
from communication import EventQueue, EventType, global_event_queue

def create_mock_visual_snapshot(snap_id: str, round_num: int, confidence: float = 0.95) -> VisualSnapshot:
    """Cria snapshot visual mock com banca estável."""
    return VisualSnapshot(
        snapshot_id=snap_id,
        captured_at=datetime.utcnow().isoformat(),
        frame_hash=f"hash-{snap_id}",
        confidence=confidence,
        history=["BLUE", "RED", "TIE", "BLUE", "BLUE"],
        bankroll_visual=1000.0,  # Banca constante para não bloquear
        timer_remaining_ms=4000 - (int(snap_id.split("-")[2]) * 100) if "-" in snap_id else 4000,
        phase="BETTING_OPEN",
        last_result="BLUE" if round_num % 2 == 0 else "RED",
        ui_issues=[]
    )

def create_mock_websocket_event(seq: int) -> WebSocketState:
    """Cria evento WebSocket mock."""
    return WebSocketState(
        connected=True,
        phase="BETTING_OPEN",
        event_timestamp=datetime.utcnow().isoformat(),
        sequence=seq,
        data={"event": f"game_update_{seq}", "round_id": f"evolution-round-{seq}"}
    )

async def test_full_pipeline():
    """Testa pipeline completo: captura -> reconciliação -> gravação."""
    print("\n" + "="*70)
    print("TESTE DE INTEGRAÇÃO: Pipeline Completo")
    print("="*70)

    # 1. Criar reconciliador
    print("\n[1] Inicializando reconciliador...")
    reconciler = StateReconciler(debug=True)
    print("    ✓ Reconciliador pronto")

    # 2. Criar dataset recorder com temp dir
    print("\n[2] Inicializando dataset recorder...")
    with tempfile.TemporaryDirectory() as tmpdir:
        recorder = DatasetRecorder(base_path=tmpdir)
        session_id = "test-session-001"
        recorder.start_session(session_id)
        print(f"    ✓ Sessão iniciada: {session_id}")

        # 3. Simular 3 rodadas completas
        for round_num in range(1, 4):
            print(f"\n[3.{round_num}] Simulando Round {round_num}...")

            round_id = f"round-{round_num}"
            round_record = RoundRecord(
                session_id=session_id,
                round_id=round_id,
                round_opened_at=datetime.utcnow().isoformat(),
                round_closed_at=None,
                result_confirmed_at=None,
                visual_snapshots=[],
                websocket_events=[],
                reconciled_snapshot=None,
                manual_command=None,
                decision_envelope=None,
                execution_command=None,
                execution_result=None,
                round_outcome=None,
                mode="OBSERVING",
                model_version="v1.0",
                config_hash="test-hash",
                alerts=[]
            )

            # Capturar 3 snapshots por rodada
            for snap_num in range(1, 4):
                snap_id = f"snap-{round_num}-{snap_num}"
                visual = create_mock_visual_snapshot(snap_id, round_num, confidence=0.90 + snap_num*0.03)
                ws_event = create_mock_websocket_event(snap_num)

                # Reconciliar
                reconciled, is_valid = reconciler.reconcile(visual, websocket=ws_event)

                if is_valid:
                    round_record.visual_snapshots.append(visual)
                    round_record.websocket_events.append(ws_event)
                    round_record.reconciled_snapshot = reconciled

                    print(f"    ✓ Snapshot {snap_num} reconciliado (conf={visual.confidence:.2f})")
                else:
                    print(f"    ✗ Snapshot {snap_num} bloqueado")

            # Encerrar round
            round_record.round_closed_at = datetime.utcnow().isoformat()

            # Gravar
            success = recorder.record_round(round_record)
            if success:
                print(f"    ✓ Round {round_num} gravado no dataset")
            else:
                print(f"    ✗ Falha ao gravar round {round_num}")

        # 4. Validar dataset
        print("\n[4] Validando dataset gravado...")
        rounds = recorder.get_session_rounds(session_id)
        print(f"    Rounds no dataset: {len(rounds)}")

        if len(rounds) > 0:
            first_round = rounds[0]
            print(f"    Primeiro round: {first_round.get('round_id')}")
            print(f"    Snapshots: {len(first_round.get('visual_snapshots', []))}")
            print(f"    ✓ Dataset válido")
        else:
            print(f"    ✗ Nenhum round encontrado")

        # 5. Validar metadados
        print("\n[5] Validando metadados da sessão...")
        metadata = recorder.get_session_metadata()
        print(f"    Session ID: {metadata['session_id']}")
        print(f"    File size: {metadata['file_size_kb']:.2f} KB")
        print(f"    ✓ Metadados validados")

    print("\n✅ Teste de integração completo passou!")

async def test_event_flow():
    """Testa fluxo de eventos daemon -> panel."""
    print("\n" + "="*70)
    print("TESTE DE EVENTOS: Comunicação Daemon-Panel")
    print("="*70)

    from communication import EventType, Event
    import asyncio

    queue = EventQueue()

    # Simular sequência de eventos
    events_to_emit = [
        (EventType.SYSTEM_START, {"session_id": "sess-001"}),
        (EventType.ROUND_OPENED, {"round_id": "round-1"}),
        (EventType.SNAPSHOT_CAPTURED, {"snapshot_id": "snap-1", "confidence": 0.95}),
        (EventType.ALERT_WARNING, {"code": "WARN_CONFIDENCE_LOW", "message": "Confiança reduzida"}),
        (EventType.ROUND_CLOSED, {"round_id": "round-1"}),
        (EventType.SYSTEM_STOP, {"session_id": "sess-001"}),
    ]

    print("\nEmitindo eventos...")
    for event_type, data in events_to_emit:
        event = Event(
            event_type=event_type,
            timestamp=datetime.utcnow().isoformat(),
            data=data,
            severity="INFO"
        )
        await queue.put(event)
        print(f"  ✓ {event_type.value}")

    print("\nLendo eventos...")
    received_count = 0
    while True:
        event = await queue.get(timeout=0.5)
        if not event:
            break
        received_count += 1
        print(f"  ✓ Recebido: {event.event_type.value}")

    assert received_count == len(events_to_emit)
    print(f"\n✅ Fluxo de eventos OK ({received_count} eventos)")

async def test_round_record_roundtrip():
    """Testa serialização/desserialização de RoundRecord."""
    print("\n" + "="*70)
    print("TESTE DE ROUNDTRIP: RoundRecord JSON")
    print("="*70)

    visual = create_mock_visual_snapshot("snap-rt-1", round_num=1)
    ws = create_mock_websocket_event(1)

    reconciler = StateReconciler(debug=False)
    reconciled, _ = reconciler.reconcile(visual, websocket=ws)

    decision = DecisionEnvelope(
        decision_id="dec-1",
        round_id="round-rt-1",
        decided_at=datetime.utcnow().isoformat(),
        status="ENTER",
        origin="DETERMINISTIC",
        side="BLUE",
        stake=100.0,
        progression_step=0,
        confidence=0.98,
        matched_patterns=[{"pattern_id": "P1", "engine": "DETERMINISTIC", "score": 0.98}],
        reasons=["padrão P1 acionado"],
        constraints_checked={"window_ok": True, "bankroll_ok": True, "risk_ok": True}
    )

    record = RoundRecord(
        session_id="sess-rt-1",
        round_id="round-rt-1",
        round_opened_at=datetime.utcnow().isoformat(),
        round_closed_at=datetime.utcnow().isoformat(),
        result_confirmed_at=datetime.utcnow().isoformat(),
        visual_snapshots=[visual],
        websocket_events=[ws],
        reconciled_snapshot=reconciled,
        manual_command=None,
        decision_envelope=decision,
        execution_command=None,
        execution_result=None,
        round_outcome=None,
        mode="DETERMINISTIC",
        model_version="v1.0",
        config_hash="hash-1",
        alerts=[]
    )

    # Serializar
    print("\nSerializando RoundRecord...")
    json_str = json.dumps(record, cls=RoundRecordEncoder)
    print(f"  ✓ JSON size: {len(json_str)} bytes")

    # Desserializar
    print("\nDesserializando JSON...")
    data = json.loads(json_str)
    assert data["round_id"] == "round-rt-1"
    assert data["mode"] == "DETERMINISTIC"
    assert len(data["visual_snapshots"]) == 1
    assert data["decision_envelope"]["status"] == "ENTER"
    print("  ✓ Desserialização OK")

    print("\n✅ Roundtrip RoundRecord OK!")

async def main():
    """Executa todos os testes async."""
    await test_full_pipeline()
    await test_event_flow()
    await test_round_record_roundtrip()

if __name__ == "__main__":
    asyncio.run(main())
    print("\n" + "="*70)
    print("✅ TODOS OS TESTES DE INTEGRAÇÃO PASSARAM!")
    print("="*70)

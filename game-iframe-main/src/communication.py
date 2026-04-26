# Communication - Event Queue Between Daemon and Panel
import asyncio
from dataclasses import dataclass
from typing import Optional
from datetime import datetime
from enum import Enum

class EventType(Enum):
    SYSTEM_START = "system_start"
    SYSTEM_STOP = "system_stop"
    ROUND_OPENED = "round_opened"
    ROUND_CLOSED = "round_closed"
    SNAPSHOT_CAPTURED = "snapshot_captured"
    DECISION_EMITTED = "decision_emitted"
    EXECUTION_AUTHORIZED = "execution_authorized"
    EXECUTION_BLOCKED = "execution_blocked"
    ALERT_CRITICAL = "alert_critical"
    ALERT_WARNING = "alert_warning"
    ALERT_INFO = "alert_info"
    OPERATOR_COMMAND = "operator_command"
    DAEMON_STATUS = "daemon_status"

@dataclass
class Event:
    event_type: EventType
    timestamp: str
    data: dict
    severity: str = "INFO"  # INFO, WARNING, CRITICAL

class EventQueue:
    """Fila thread-safe de eventos entre daemon e panel."""

    def __init__(self):
        self.queue = asyncio.Queue()
        self.history = []
        self.max_history = 100

    async def put(self, event: Event):
        """Coloca evento na fila."""
        event.timestamp = datetime.utcnow().isoformat()
        await self.queue.put(event)

        # Manter histórico
        self.history.append(event)
        if len(self.history) > self.max_history:
            self.history.pop(0)

    async def get(self, timeout: float = 1.0) -> Optional[Event]:
        """Pega próximo evento com timeout."""
        try:
            event = await asyncio.wait_for(self.queue.get(), timeout=timeout)
            return event
        except asyncio.TimeoutError:
            return None

    def get_latest(self, event_type: EventType = None, limit: int = 10) -> list:
        """Retorna últimos eventos (opcional filtrado por tipo)."""
        results = self.history[-limit:]
        if event_type:
            results = [e for e in results if e.event_type == event_type]
        return results

    async def clear(self):
        """Limpa fila."""
        while not self.queue.empty():
            try:
                self.queue.get_nowait()
            except asyncio.QueueEmpty:
                break

# Global queue singleton
global_event_queue = EventQueue()

async def emit_event(event_type: EventType, data: dict, severity: str = "INFO"):
    """Helper para emitir evento globalmente."""
    event = Event(
        event_type=event_type,
        timestamp=datetime.utcnow().isoformat(),
        data=data,
        severity=severity
    )
    await global_event_queue.put(event)

async def emit_critical_alert(code: str, message: str, technical: str = ""):
    """Emite alerta crítico."""
    await emit_event(
        EventType.ALERT_CRITICAL,
        {
            "code": code,
            "message": message,
            "technical": technical
        },
        severity="CRITICAL"
    )

async def emit_warning_alert(code: str, message: str, technical: str = ""):
    """Emite alerta de aviso."""
    await emit_event(
        EventType.ALERT_WARNING,
        {
            "code": code,
            "message": message,
            "technical": technical
        },
        severity="WARNING"
    )

async def emit_snapshot_captured(snapshot_id: str, confidence: float):
    """Emite captura de snapshot."""
    await emit_event(
        EventType.SNAPSHOT_CAPTURED,
        {
            "snapshot_id": snapshot_id,
            "confidence": confidence
        },
        severity="INFO"
    )

async def emit_round_opened(round_id: str):
    """Emite abertura de rodada."""
    await emit_event(
        EventType.ROUND_OPENED,
        {"round_id": round_id},
        severity="INFO"
    )

async def emit_round_closed(round_id: str):
    """Emite fechamento de rodada."""
    await emit_event(
        EventType.ROUND_CLOSED,
        {"round_id": round_id},
        severity="INFO"
    )

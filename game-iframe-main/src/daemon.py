# Daemon - Continuous Agent Loop
import asyncio
import uuid
from datetime import datetime
from core_loop import CoreObservationLoop
from communication import (
    global_event_queue, EventType,
    emit_event, emit_critical_alert, emit_round_opened, emit_round_closed
)
from bet_executor import BetExecutor
from schemas import ExecutionCommand, ManualCommand
from websocket_server import WebSocketServer

class RobotDaemon:
    """Agent contínuo que roda em background."""

    def __init__(self, url: str, session_id: str = None, debug=True, ws_host: str = "localhost", ws_port: int = 8765):
        self.url = url
        self.session_id = session_id or str(uuid.uuid4())[:8]
        self.debug = debug

        self.core_loop = CoreObservationLoop(session_id=self.session_id, debug=debug)
        self.executor = None  # Será inicializado quando page estiver pronto
        self.state = "IDLE"
        self.mode = "MANUAL"
        self.is_running = False
        self.is_paused = False

        # WebSocket server para extensão Chrome
        self.ws_server = WebSocketServer(host=ws_host, port=ws_port, debug=debug)
        self.ws_server.daemon = self  # Referência ao daemon

    async def emit_status(self):
        """Emite status atual para o painel."""
        await emit_event(
            EventType.DAEMON_STATUS,
            {
                "state": self.state,
                "mode": self.mode,
                "countdown_ms": self.core_loop.reconciler.last_bankroll or 0,
                "bankroll": self.core_loop.reconciler.last_bankroll or 0.0,
            }
        )

    async def run(self):
        """Executa daemon contínuo."""
        self.state = "RUNNING"
        self.is_running = True

        await emit_event(
            EventType.SYSTEM_START,
            {"session_id": self.session_id}
        )

        await self.core_loop.initialize(self.url)

        # Iniciar WebSocket server
        await self.ws_server.start()

        try:
            from playwright.async_api import async_playwright

            async with async_playwright() as p:
                browser = await p.chromium.launch(headless=False)
                context = await browser.new_context(viewport={'width': 1280, 'height': 720})
                page = await context.new_page()

                await page.goto(self.url)

                # Inicializar executor
                self.executor = BetExecutor(page, debug=self.debug)

                if self.debug:
                    print(f"[Daemon] Iniciado: {self.session_id}")
                    print(f"[Daemon] Executor pronto")
                    print(f"[Daemon] WebSocket disponível para extensão")

                # Inicializar vision + websocket
                vision_task = asyncio.create_task(
                    self.core_loop.vision_observer.run(self.url)
                )

                iteration = 0
                while self.is_running:
                    iteration += 1

                    # Respeitar pausa
                    if self.is_paused:
                        self.state = "PAUSED"
                        await asyncio.sleep(1)
                        continue

                    self.state = "RUNNING"

                    # Iniciar novo round
                    if not self.core_loop.current_round_record:
                        await self.core_loop.start_new_round()
                        await emit_round_opened(self.core_loop.current_round_id)
                        await self.ws_server.send_round_opened(self.core_loop.current_round_id)

                    # Capturar + reconciliar
                    result = await self.core_loop.capture_and_reconcile_iteration(page)

                    # Emitir eventos baseado no resultado
                    if result["status"] == "OK":
                        await emit_event(
                            EventType.SNAPSHOT_CAPTURED,
                            {
                                "snapshot_id": result["snapshot_id"],
                                "confidence": result["confidence"]
                            }
                        )
                        await self.ws_server.send_snapshot(
                            result["snapshot_id"],
                            result["confidence"]
                        )
                    elif result["status"] == "BLOCKED":
                        self.state = "BLOCKED"
                        await emit_critical_alert(
                            "EXECUTION_BLOCKED",
                            result["reason"],
                            ""
                        )
                        await self.ws_server.send_alert(
                            "EXECUTION_BLOCKED",
                            result["reason"],
                            "CRITICAL"
                        )

                    # Status periódico
                    if iteration % 10 == 0:
                        await self.emit_status()
                        await self.ws_server.send_status()

                    await asyncio.sleep(0.1)

        except KeyboardInterrupt:
            if self.debug:
                print("\n[Daemon] Encerrando por KeyboardInterrupt...")
            self.is_running = False
        except Exception as e:
            await emit_critical_alert(
                "DAEMON_ERROR",
                f"Erro no daemon: {str(e)}",
                str(e)
            )
            await self.ws_server.send_alert(
                "DAEMON_ERROR",
                f"Erro no daemon: {str(e)}",
                "CRITICAL",
                str(e)
            )
            self.state = "ERROR"
        finally:
            if self.core_loop.current_round_record:
                await self.core_loop.end_round(reason="daemon_shutdown")
                await self.ws_server.send_round_closed(self.core_loop.current_round_id)

            await emit_event(
                EventType.SYSTEM_STOP,
                {"session_id": self.session_id}
            )

            await self.ws_server.stop()

            self.is_running = False
            if self.debug:
                print(f"[Daemon] Encerrado: {self.session_id}")

    async def pause(self):
        """Pausa execução."""
        self.is_paused = True
        if self.debug:
            print("[Daemon] Pausado")

    async def resume(self):
        """Retoma execução."""
        self.is_paused = False
        if self.debug:
            print("[Daemon] Retomado")

    async def stop(self):
        """Para daemon."""
        self.is_running = False
        if self.debug:
            print("[Daemon] Parando...")

    async def submit_manual_command(self, side: str, stake: float):
        """Injeta comando manual na próxima rodada."""
        if not self.core_loop.current_round_record:
            await emit_critical_alert(
                "NO_ROUND_ACTIVE",
                "Nenhuma rodada ativa para comando manual",
                ""
            )
            return

        command = ManualCommand(
            command_id=f"cmd-{uuid.uuid4().hex[:8]}",
            issued_at=datetime.utcnow().isoformat(),
            target_round_id=self.core_loop.current_round_id,
            side=side,
            stake=stake,
            expires_at=str(datetime.utcnow().timestamp() + 5)  # 5s de TTL
        )

        self.core_loop.current_round_record.manual_command = command

        await emit_event(
            EventType.OPERATOR_COMMAND,
            {
                "command_id": command.command_id,
                "side": side,
                "stake": stake,
                "round_id": self.core_loop.current_round_id
            }
        )

        if self.debug:
            print(f"[Daemon] Comando manual: {side} R${stake}")

    async def execute_bet_command(self, execution_command: ExecutionCommand):
        """Executa aposta via executor."""
        if not self.executor:
            await emit_critical_alert(
                "EXECUTOR_NOT_READY",
                "Executor não inicializado",
                ""
            )
            await self.ws_server.send_alert(
                "EXECUTOR_NOT_READY",
                "Executor não inicializado",
                "CRITICAL"
            )
            return

        result = await self.executor.execute_bet(execution_command)

        # Registrar resultado na rodada
        if self.core_loop.current_round_record:
            self.core_loop.current_round_record.execution_command = execution_command
            self.core_loop.current_round_record.execution_result = result

        # Emitir evento
        if result.status == "SUCCESS":
            await emit_event(
                EventType.EXECUTION_AUTHORIZED,
                {
                    "execution_id": result.execution_id,
                    "side": execution_command.side,
                    "stake": execution_command.stake,
                    "confirmed": result.post_click_ui_valid
                }
            )
            await self.ws_server.send_execution_result(
                "SUCCESS",
                execution_command.side,
                execution_command.stake
            )
        else:
            await emit_critical_alert(
                result.error_code or "EXECUTION_FAILED",
                f"Execução falhou: {result.error_message}",
                f"execution_id={result.execution_id}"
            )
            await self.ws_server.send_execution_result(
                "FAILED",
                execution_command.side,
                execution_command.stake,
                result.error_message
            )
            await self.ws_server.send_alert(
                result.error_code or "EXECUTION_FAILED",
                f"Execução falhou: {result.error_message}",
                "CRITICAL"
            )

        if self.debug:
            print(f"[Daemon] Execução {result.status}: {result.execution_id}")


async def run_daemon(url: str, session_id: str = None, debug=True, ws_host: str = "localhost", ws_port: int = 8765):
    """Entry point para RobotDaemon."""
    daemon = RobotDaemon(url, session_id=session_id, debug=debug, ws_host=ws_host, ws_port=ws_port)
    await daemon.run()

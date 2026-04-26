# Core Loop - Main Observation Pipeline
# Vision + WebSocket + Reconciliation + Recording

import asyncio
import uuid
import time
from datetime import datetime
from vision_observer import VisionObserver
from state_reconciler import StateReconciler
from dataset_recorder import DatasetRecorder
from schemas import RoundRecord
from codes import Codes, format_alert

class CoreObservationLoop:
    """
    Pipeline principal: Captura visual + WebSocket -> Reconcilia -> Grava dataset
    """

    def __init__(self, session_id: str = None, debug=True):
        self.session_id = session_id or str(uuid.uuid4())[:8]
        self.debug = debug

        self.vision_observer = VisionObserver(debug=debug)
        self.reconciler = StateReconciler(debug=debug)
        self.recorder = DatasetRecorder()
        self.recorder.start_session(self.session_id)

        self.current_round_id = None
        self.current_round_record = None
        self.snapshot_count = 0
        self.round_count = 0

    async def initialize(self, url: str):
        """Inicializa browsers e observers."""
        alert = format_alert(
            Codes.SISTEMA_INICIALIZADO,
            f"Core Loop inicializado",
            f"session_id={self.session_id}, url={url}"
        )
        print(alert["formatted"])

    async def capture_and_reconcile_iteration(self, page) -> dict:
        """
        Uma iteração: captura visual + ws + reconcilia.
        Returns status da iteração.
        """
        # 1. Capturar snapshot visual
        visual_snapshot = await self.vision_observer._capture_snapshot(page)
        if not visual_snapshot:
            return {"status": "SKIP", "reason": "Visual capture failed"}

        self.snapshot_count += 1

        # 2. Pegar último evento WebSocket
        ws_event = None
        if self.vision_observer.ws_observer:
            ws_event = await self.vision_observer.ws_observer.get_latest_event(timeout=0.1)

        # 3. Reconciliar
        reconciled, is_valid = self.reconciler.reconcile(visual_snapshot, ws_event)
        if not is_valid:
            return {"status": "BLOCKED", "reason": "Reconciliation failed"}

        # 4. Atualizar round record em progresso
        if self.current_round_record:
            self.current_round_record.visual_snapshots.append(visual_snapshot)
            if ws_event:
                self.current_round_record.websocket_events.append(ws_event)
            self.current_round_record.reconciled_snapshot = reconciled

        return {
            "status": "OK",
            "snapshot_id": visual_snapshot.snapshot_id,
            "reconciled_id": reconciled.snapshot_id if reconciled else None,
            "confidence": visual_snapshot.confidence
        }

    async def start_new_round(self):
        """Inicia novo round record."""
        self.current_round_id = f"round-{self.round_count}"
        self.round_count += 1

        self.current_round_record = RoundRecord(
            session_id=self.session_id,
            round_id=self.current_round_id,
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
            config_hash="",
            alerts=[]
        )

        if self.debug:
            print(f"[Core] Novo round iniciado: {self.current_round_id}")

    async def end_round(self, reason: str = "normal"):
        """Encerra round e grava no dataset."""
        if not self.current_round_record:
            return

        self.current_round_record.round_closed_at = datetime.utcnow().isoformat()

        # Gravar no dataset
        success = self.recorder.record_round(self.current_round_record)
        if success:
            if self.debug:
                print(f"[Core] Round {self.current_round_id} gravado (reason={reason})")
        else:
            alert = format_alert(
                Codes.SISTEMA_ENCERRADO,
                f"Falha ao gravar round {self.current_round_id}",
                reason
            )
            print(alert["formatted"])

        self.current_round_record = None

    async def run(self, url: str):
        """Executa core loop com timeout."""
        from playwright.async_api import async_playwright

        await self.initialize(url)

        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=False)
            context = await browser.new_context(viewport={'width': 1280, 'height': 720})
            page = await context.new_page()

            await page.goto(url)
            print("[Core] Navegado. Iniciando WebSocket observer...")

            # Iniciar vision + websocket em background
            await self.vision_observer.run(url)

            # Main loop com timeout de inatividade
            try:
                iteration = 0
                last_capture_time = None
                inactivity_timeout_seconds = 300  # 5 minutos

                while True:
                    iteration += 1

                    # Iniciar round
                    if not self.current_round_record:
                        await self.start_new_round()

                    # Capturar + reconciliar
                    try:
                        result = await asyncio.wait_for(
                            self.capture_and_reconcile_iteration(page),
                            timeout=5.0  # 5 segundos por iteração
                        )
                    except asyncio.TimeoutError:
                        alert = format_alert(
                            Codes.LATENCIA_OPERACIONAL_ACIMA_DO_LIMITE,
                            "Iteração levou > 5s",
                            f"iteration={iteration}"
                        )
                        print(alert["formatted"])
                        result = {"status": "TIMEOUT"}

                    # Detectar inatividade
                    if result['status'] == 'OK':
                        last_capture_time = time.time()

                    if last_capture_time and (time.time() - last_capture_time) > inactivity_timeout_seconds:
                        alert = format_alert(
                            Codes.DAEMON_ERROR,
                            "Inatividade por 5 minutos — assumindo travamento",
                            f"last_capture={inactivity_timeout_seconds}s atrás"
                        )
                        print(alert["formatted"])
                        break

                    if self.debug and iteration % 10 == 0:
                        print(
                            f"[Core] Iteração {iteration} | Snapshots: {self.snapshot_count} | "
                            f"Rounds: {self.round_count} | Status: {result['status']}"
                        )

                    await asyncio.sleep(0.1)

            except KeyboardInterrupt:
                print("\n[Core] Encerrando...")
                await self.end_round(reason="keyboard_interrupt")
            except Exception as e:
                alert = format_alert(
                    Codes.DAEMON_ERROR,
                    "Erro crítico no core loop",
                    str(e)
                )
                print(alert["formatted"])
                await self.end_round(reason="error")
            finally:
                await context.close()
                await browser.close()


async def run_core_loop(url: str, session_id: str = None, debug=True):
    """Entry point."""
    core = CoreObservationLoop(session_id=session_id, debug=debug)
    await core.run(url)


if __name__ == "__main__":
    import asyncio
    TARGET_URL = "https://betboom.com/pt-br/casino/game/evolution-bac-bo"
    asyncio.run(run_core_loop(TARGET_URL))

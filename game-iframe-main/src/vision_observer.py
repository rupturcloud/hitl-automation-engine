# Vision Observer - Structured Snapshot Capture
import asyncio
import os
import time
import hashlib
import uuid
from datetime import datetime
from typing import Optional
import cv2
import numpy as np
from playwright.async_api import async_playwright
from config import DATASET_DIR, ROIS, CAPTURE_INTERVAL
from vision_extractor import BacBoVisionExtractor
from websocket_observer import WebSocketObserver, start_hybrid_websocket_observer
from schemas import VisualSnapshot, ReconciledSnapshot, WebSocketState
from codes import Codes, format_alert

class VisionObserver:
    def __init__(self, debug=True):
        self.extractor = BacBoVisionExtractor()
        self.debug = debug
        self.snapshot_count = 0
        self.last_snapshot = None
        self.ws_observer = None

    def _compute_frame_hash(self, frame) -> str:
        """Computa SHA256 do frame para auditoria."""
        return hashlib.sha256(cv2.imencode('.jpg', frame)[1]).hexdigest()[:16]

    async def _capture_snapshot(self, page) -> VisualSnapshot:
        """Captura um snapshot estruturado."""
        start_time = time.time()

        try:
            # Captura em memória
            screenshot_bytes = await page.screenshot(type="jpeg", quality=90)
            nparr = np.frombuffer(screenshot_bytes, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            if frame is None:
                alert = format_alert(
                    Codes.SEM_CONFIANCA_VISUAL_MINIMA,
                    "Frame decode falhou",
                    "cv2.imdecode retornou None"
                )
                print(alert["formatted"])
                return None

            # Extrair dados
            banca_str = self.extractor.extract_banca(frame) or "0"
            try:
                banca = float(banca_str.replace(',', '.'))
            except ValueError as ve:
                alert = format_alert(
                    Codes.SEM_CONFIANCA_VISUAL_MINIMA,
                    "Parsing de banca falhou",
                    f"value={banca_str}, error={ve}"
                )
                print(alert["formatted"])
                banca = 0.0

            timer = self.extractor.extract_timer(frame) or 0
            history = self.extractor.extract_history(frame) or []
            latency_ms = (time.time() - start_time) * 1000

            # Validar confiança
            has_banca = banca > 0
            has_timer = timer > 0
            has_history = len(history) > 0

            confidence = sum([has_banca, has_timer, has_history]) / 3.0

            # Criar snapshot
            snapshot_id = f"snap-{uuid.uuid4().hex[:8]}"
            frame_hash = self._compute_frame_hash(frame)

            snapshot = VisualSnapshot(
                snapshot_id=snapshot_id,
                captured_at=datetime.utcnow().isoformat(),
                frame_hash=frame_hash,
                confidence=confidence,
                history=history,
                bankroll_visual=banca,
                timer_remaining_ms=timer,
                phase="UNKNOWN",
                last_result=None,
                ui_issues=[]
            )

            # Marcar problemas de qualidade
            if not has_banca:
                snapshot.ui_issues.append("BANKROLL_NOT_DETECTED")
            if not has_timer:
                snapshot.ui_issues.append("TIMER_NOT_DETECTED")
            if not has_history:
                snapshot.ui_issues.append("HISTORY_NOT_DETECTED")

            self.snapshot_count += 1
            self.last_snapshot = snapshot

            if self.debug:
                print(
                    f"[Vision] #{self.snapshot_count} | conf={confidence:.2f} | "
                    f"banca={banca} | timer={timer}ms | latency={latency_ms:.1f}ms"
                )

            return snapshot

        except asyncio.TimeoutError:
            alert = format_alert(
                Codes.SEM_CONFIANCA_VISUAL_MINIMA,
                "Timeout ao capturar screenshot",
                "page.screenshot() excedeu timeout"
            )
            print(alert["formatted"])
            return None
        except Exception as e:
            # Inesperado — não engolir silenciosamente
            raise RuntimeError(f"Unexpected error in _capture_snapshot: {type(e).__name__}: {e}") from e

    async def run(self, url: str, ws_url: Optional[str] = None):
        """Inicia observador visual + websocket."""
        async with async_playwright() as p:
            print(f"[Vision] Iniciando navegador...")
            browser = await p.chromium.launch(headless=False)
            context = await browser.new_context(viewport={'width': 1280, 'height': 720})
            page = await context.new_page()

            await page.goto(url)
            print(f"[Vision] Navegado para {url}")

            # Iniciar WebSocket observer em background
            self.ws_observer = await start_hybrid_websocket_observer(
                page, ws_url=ws_url, debug=self.debug
            )

            print("[Vision] Modo observador ativo. Capturando snapshots...")

            try:
                while True:
                    loop_start = time.time()
                    snapshot = await self._capture_snapshot(page)

                    if snapshot:
                        # TODO: gravar no dataset_recorder
                        pass

                    elapsed = time.time() - loop_start
                    wait_time = max(0.1, CAPTURE_INTERVAL - elapsed)
                    await asyncio.sleep(wait_time)

            except KeyboardInterrupt:
                print("\n[Vision] Encerrando...")
            finally:
                if self.ws_observer:
                    await self.ws_observer.stop()
                await context.close()
                await browser.close()


async def run_vision_observer(url: str, debug=True):
    """Entry point para VisionObserver."""
    observer = VisionObserver(debug=debug)
    await observer.run(url)


if __name__ == "__main__":
    TARGET_URL = "https://betboom.com/pt-br/casino/game/evolution-bac-bo"
    asyncio.run(run_vision_observer(TARGET_URL))

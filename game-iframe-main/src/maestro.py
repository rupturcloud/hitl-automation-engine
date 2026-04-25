# 🧬 J.A.R.V.I.S. - Maestro (Main Orchestrator)
import asyncio
from vision_observer import run_vision_observer
from strategy_engine import StrategyEngine
from state_reconciler import StateReconciler
from dataset_recorder import DatasetRecorder
from codes import Codes, format_alert
import uuid

class Maestro:
    def __init__(self, debug=True):
        self.session_id = str(uuid.uuid4())[:8]
        self.strategy = StrategyEngine()
        self.reconciler = StateReconciler()
        self.recorder = DatasetRecorder()
        self.debug = debug

        self.internal_state = {
            "expected_banca": 0.0,
            "is_betting": False,
            "current_round_id": None,
            "mode": "MANUAL"
        }

    async def run(self, url):
        # Inicializar sessão e recorder
        self.recorder.start_session(self.session_id)

        alert = format_alert(
            Codes.SISTEMA_INICIALIZADO,
            "Sistema J.A.R.V.I.S. iniciado",
            f"session_id={self.session_id}, mode=DEBUG"
        )
        print(alert["formatted"])

        if self.debug:
            print(f"Metadados da sessão: {self.recorder.get_session_metadata()}")

        try:
            await run_vision_observer(url)
        except KeyboardInterrupt:
            alert = format_alert(
                Codes.SISTEMA_ENCERRADO,
                "Encerramento gracioso iniciado",
                f"session_id={self.session_id}"
            )
            print(alert["formatted"])

if __name__ == "__main__":
    maestro = Maestro(debug=True)
    TARGET_URL = "https://betboom.com/pt-br/casino/game/evolution-bac-bo"
    try:
        asyncio.run(maestro.run(TARGET_URL))
    except Exception as e:
        alert = format_alert(
            "CRIT_SYSTEM_ERROR",
            "Erro crítico no sistema",
            str(e)
        )
        print(alert["formatted"])

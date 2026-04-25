# State Reconciler - Visual-First + WebSocket Corroboration
import time
import uuid
from datetime import datetime
from typing import Optional, Tuple
from schemas import VisualSnapshot, WebSocketState, ReconciledSnapshot
from codes import Codes, format_alert

class StateReconciler:
    """
    Cruza múltiplas fontes de observação em ordem de prioridade:
    1. Visual (source of truth)
    2. WebSocket (corroboration + timing)
    3. DOM (auxiliary)

    Valida consistência e bloqueia se divergência crítica.
    """

    def __init__(self, tolerance_bankroll_pct=1.0, debug=True):
        self.tolerance_bankroll_pct = tolerance_bankroll_pct  # % de divergência tolerada
        self.last_bankroll = None
        self.last_phase = None
        self.is_blocked = False
        self.block_reason = None
        self.debug = debug

    def reconcile(
        self,
        visual: VisualSnapshot,
        websocket: Optional[WebSocketState] = None,
    ) -> Tuple[Optional[ReconciledSnapshot], bool]:
        """
        Reconcilia visual + websocket em snapshot final.
        Returns (reconciled_snapshot, is_valid)
        """

        # 1. Validação de fonte primária (VISUAL)
        if not visual:
            alert = format_alert(
                Codes.SEM_CONFIANCA_VISUAL_MINIMA,
                "Snapshot visual não disponível",
                ""
            )
            print(alert["formatted"])
            return None, False

        if visual.confidence < 0.5:
            alert = format_alert(
                Codes.CONFIANCA_VISUAL_REDUZIDA,
                f"Confiança visual muito baixa: {visual.confidence:.2f}",
                f"snapshot_id={visual.snapshot_id}"
            )
            print(alert["formatted"])
            return None, False

        # 2. Cruzamento visual vs websocket
        visual_vs_ws_match = True
        visual_vs_dom_match = True  # placeholder, DOM não está aqui
        bankroll_divergent = False
        history_divergent = False
        window_divergent = False

        # Se houver WebSocket, comparar com visual
        if websocket:
            ws_phase = websocket.phase
            visual_phase = visual.phase

            if ws_phase and visual_phase and ws_phase != visual_phase:
                visual_vs_ws_match = False
                alert = format_alert(
                    Codes.DESSINCRONIA_VISUAL_WEBSOCKET,
                    f"Fase divergente: visual={visual_phase} vs ws={ws_phase}",
                    f"snapshot_id={visual.snapshot_id}, seq={websocket.sequence}"
                )
                print(alert["formatted"])

        # 3. Validação de banca (divergência crítica)
        if self.last_bankroll is not None:
            divergence = abs(visual.bankroll_visual - self.last_bankroll)
            tolerance = self.last_bankroll * (self.tolerance_bankroll_pct / 100.0)

            if divergence > tolerance:
                bankroll_divergent = True
                self.is_blocked = True
                self.block_reason = f"Banca divergiu: {self.last_bankroll} -> {visual.bankroll_visual}"

                alert = format_alert(
                    Codes.BANCA_COM_DIVERGENCIA_DE_DADOS,
                    f"Divergência de banca detectada",
                    f"anterior={self.last_bankroll} | atual={visual.bankroll_visual} | "
                    f"diff={divergence} | tolerância={tolerance}"
                )
                print(alert["formatted"])
                return None, False

        # 4. Atualizar estado interno
        self.last_bankroll = visual.bankroll_visual
        self.last_phase = visual.phase

        # 5. Criar snapshot reconciliado
        reconciled = ReconciledSnapshot(
            snapshot_id=f"recon-{uuid.uuid4().hex[:8]}",
            round_id="",  # será preenchido pelo executor
            reconciled_at=datetime.utcnow().isoformat(),
            source_of_truth="VISUAL",
            visual_snapshot=visual,
            websocket_state=websocket,
            visual_confidence=visual.confidence,
            visual_vs_websocket_match=visual_vs_ws_match,
            visual_vs_dom_match=visual_vs_dom_match,
            bankroll_divergent=bankroll_divergent,
            history_divergent=history_divergent,
            window_divergent=window_divergent,
            effective_phase=visual.phase or (websocket.phase if websocket else "UNKNOWN"),
            effective_time_remaining_ms=visual.timer_remaining_ms,
            effective_bankroll=visual.bankroll_visual,
            effective_history=visual.history
        )

        if self.debug:
            print(
                f"[Reconciler] snapshot={reconciled.snapshot_id} | "
                f"visual_conf={visual.confidence:.2f} | "
                f"phase={reconciled.effective_phase} | "
                f"ws_match={visual_vs_ws_match}"
            )

        return reconciled, True

    def reset_block(self):
        """Reset manual de bloqueio (operador autoriza)."""
        self.is_blocked = False
        self.block_reason = None
        print("[Reconciler] Bloqueio resetado manualmente")

    def get_status(self) -> dict:
        """Status atual do reconciliador."""
        return {
            "is_blocked": self.is_blocked,
            "block_reason": self.block_reason,
            "last_bankroll": self.last_bankroll,
            "last_phase": self.last_phase
        }

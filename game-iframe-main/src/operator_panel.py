# Operator Panel - Interactive CLI Control
import asyncio
import sys
from datetime import datetime
from enum import Enum
from communication import global_event_queue, EventType, emit_event

class RobotState(Enum):
    IDLE = "IDLE"
    RUNNING = "RUNNING"
    PAUSED = "PAUSED"
    BLOCKED = "BLOCKED"
    WAITING_WINDOW = "WAITING_WINDOW"
    DESYNC = "DESYNC"
    STOPPED = "STOPPED"

class OperatorPanel:
    """CLI Panel para controlar o robô em tempo real."""

    def __init__(self, debug=True):
        self.debug = debug
        self.state = RobotState.IDLE
        self.mode = "MANUAL"
        self.countdown_ms = 0
        self.bankroll = 0.0
        self.round_id = None
        self.alert_buffer = []
        self.last_alert_code = None

    def _clear_screen(self):
        """Limpa tela."""
        sys.stdout.write("\033[2J\033[H")
        sys.stdout.flush()

    def _color(self, text: str, color: str) -> str:
        """Colore texto."""
        colors = {
            "RED": "\033[91m",
            "GREEN": "\033[92m",
            "YELLOW": "\033[93m",
            "BLUE": "\033[94m",
            "RESET": "\033[0m",
            "BOLD": "\033[1m"
        }
        return f"{colors.get(color, '')}{text}{colors['RESET']}"

    def render_header(self):
        """Header do painel."""
        print(self._color("=" * 70, "BOLD"))
        print(self._color("  J.A.R.V.I.S. OPERATOR PANEL", "BOLD"))
        print(self._color("=" * 70, "RESET"))

    def render_status(self):
        """Status do robô."""
        state_color = {
            RobotState.RUNNING: "GREEN",
            RobotState.PAUSED: "YELLOW",
            RobotState.BLOCKED: "RED",
            RobotState.IDLE: "BLUE",
        }.get(self.state, "BLUE")

        state_str = self._color(f"[{self.state.value}]", state_color)

        print(f"\n{state_str} Mode: {self.mode}")
        print(f"Bankroll: R$ {self.bankroll:.2f}")
        print(f"Round: {self.round_id or 'N/A'}")

    def render_countdown(self):
        """Countdown sincronizado com a banca."""
        if self.countdown_ms > 0:
            seconds = self.countdown_ms // 1000
            print(f"\n{self._color(f'⏱  Countdown: {seconds}s', 'BOLD')}")
            print(f"   {self._color('█' * (seconds // 2), 'GREEN')}")
        else:
            print(f"\n{self._color('⏱  Janela fechada', 'YELLOW')}")

    def render_alerts(self):
        """Últimos alertas."""
        print(f"\n{self._color('─ ALERTAS ─', 'BOLD')}")

        if not self.alert_buffer:
            print("  ✓ Nenhum alerta crítico")
            return

        for alert in self.alert_buffer[-5:]:  # Mostrar últimos 5
            code = alert["code"]
            message = alert["message"]

            if alert["severity"] == "CRITICAL":
                print(self._color(f"  🔴 {code}: {message}", "RED"))
            elif alert["severity"] == "WARNING":
                print(self._color(f"  🟡 {code}: {message}", "YELLOW"))
            else:
                print(f"  🔵 {code}: {message}")

    def render_controls(self):
        """Controles disponíveis."""
        print(f"\n{self._color('─ CONTROLES ─', 'BOLD')}")
        print("  [1] Iniciar        [2] Pausar         [3] Retomar")
        print("  [4] Parar          [5] Manual Entry   [q] Sair")

    def render_manual_entry_prompt(self):
        """Prompt para entrada manual com validação."""
        print(f"\n{self._color('MANUAL ENTRY MODE', 'BOLD')}")

        valid_sides = {"BLUE", "RED", "TIE"}
        side = None
        stake = None

        # Validar lado
        while side is None:
            side_input = input("  Lado (BLUE/RED/TIE): ").upper()
            if side_input not in valid_sides:
                print(self._color("  ❌ Lado inválido. Escolha BLUE, RED ou TIE", "RED"))
                continue
            side = side_input

        # Validar stake
        while stake is None:
            try:
                stake_input = input("  Stake (R$): ")
                stake_val = float(stake_input)

                if stake_val <= 0:
                    print(self._color("  ❌ Stake deve ser > 0", "RED"))
                    continue

                if stake_val > 10000:
                    print(self._color(f"  ⚠️  Stake muito alta (R$ {stake_val:.2f}). Máximo R$ 10.000", "YELLOW"))
                    confirm = input("  Confirmar? (s/n): ").lower()
                    if confirm != 's':
                        continue

                stake = stake_val

            except ValueError:
                print(self._color("  ❌ Valor inválido. Use número (ex: 50.00)", "RED"))

        return {"side": side, "stake": stake}

    async def handle_input(self):
        """Processa entrada do usuário (não-bloqueante)."""
        # Ler stdin sem bloquear
        loop = asyncio.get_event_loop()

        # Para simplificar, aqui seria implementado input assíncrono
        # Por enquanto, placeholder
        pass

    async def update_from_events(self):
        """Atualiza painel a partir de eventos da fila."""
        event = await global_event_queue.get(timeout=0.1)

        if not event:
            return

        # Processar evento
        if event.event_type == EventType.ALERT_CRITICAL:
            self.alert_buffer.append({
                "code": event.data.get("code"),
                "message": event.data.get("message"),
                "severity": "CRITICAL"
            })
            self.state = RobotState.BLOCKED
            self.last_alert_code = event.data.get("code")

        elif event.event_type == EventType.ALERT_WARNING:
            self.alert_buffer.append({
                "code": event.data.get("code"),
                "message": event.data.get("message"),
                "severity": "WARNING"
            })

        elif event.event_type == EventType.ROUND_OPENED:
            self.round_id = event.data.get("round_id")
            self.state = RobotState.WAITING_WINDOW

        elif event.event_type == EventType.ROUND_CLOSED:
            self.countdown_ms = 0

        elif event.event_type == EventType.DAEMON_STATUS:
            self.state = RobotState(event.data.get("state", "IDLE"))
            self.countdown_ms = event.data.get("countdown_ms", 0)
            self.bankroll = event.data.get("bankroll", 0.0)
            self.mode = event.data.get("mode", "MANUAL")

        # Manter apenas últimos 10 alertas
        if len(self.alert_buffer) > 10:
            self.alert_buffer = self.alert_buffer[-10:]

    async def render_loop(self):
        """Loop de renderização do painel."""
        while True:
            # Atualizar a partir de eventos
            await self.update_from_events()

            # Limpar e re-renderizar
            self._clear_screen()
            self.render_header()
            self.render_status()
            self.render_countdown()
            self.render_alerts()
            self.render_controls()

            await asyncio.sleep(0.5)

    async def start(self):
        """Inicia o painel."""
        print(self._color("Operador Panel iniciado. Aguardando daemon...", "BOLD"))
        await self.render_loop()


async def run_operator_panel(debug=True):
    """Entry point para OperatorPanel."""
    panel = OperatorPanel(debug=debug)
    await panel.start()


if __name__ == "__main__":
    asyncio.run(run_operator_panel())

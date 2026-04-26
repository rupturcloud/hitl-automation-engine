# Main Entry Point - Daemon + Panel
import asyncio
import sys
from daemon import RobotDaemon
from operator_panel import OperatorPanel

async def main(url: str, debug=True):
    """
    Inicia daemon (agent contínuo) + panel (controle CLI) simultaneamente.
    Ambos compartilham global_event_queue para comunicação.
    """

    print("═" * 70)
    print("  J.A.R.V.I.S. - Daemon + Operator Panel")
    print("═" * 70)
    print(f"\nURL: {url}")
    print(f"Debug: {debug}")
    print("\nIniciando daemon + panel...\n")

    # Criar daemon e panel
    daemon = RobotDaemon(url, debug=debug)
    panel = OperatorPanel(debug=debug)

    # Executar ambos concorrentemente
    try:
        await asyncio.gather(
            daemon.run(),
            panel.start(),
            return_exceptions=True
        )
    except KeyboardInterrupt:
        print("\n\nEncerrando...")
        await daemon.stop()
        sys.exit(0)

if __name__ == "__main__":
    TARGET_URL = "https://betboom.com/pt-br/casino/game/evolution-bac-bo"

    try:
        asyncio.run(main(TARGET_URL, debug=True))
    except KeyboardInterrupt:
        print("\nEncerrando sistema...")
        sys.exit(0)

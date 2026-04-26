#!/usr/bin/env python3
"""
Daemon Simplificado - Roda sem Playwright
Para testes da extensão com WebSocket funcional
"""

import sys
import asyncio
import uuid
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent / "src"))

from websocket_server import WebSocketServer

class SimplifiedDaemon:
    def __init__(self, ws_host="localhost", ws_port=8765, debug=True):
        self.session_id = str(uuid.uuid4())[:8]
        self.debug = debug
        self.state = "IDLE"
        self.mode = "MANUAL"
        self.is_running = False
        self.is_paused = False
        self.bankroll = 1000.0
        self.round_id = "round-1"

        # WebSocket server
        self.ws_server = WebSocketServer(host=ws_host, port=ws_port, debug=debug)
        self.ws_server.daemon = self

    async def run(self):
        """Executa daemon simplificado"""
        self.state = "RUNNING"
        self.is_running = True

        # Iniciar WebSocket
        await self.ws_server.start()

        if self.debug:
            print(f"[Daemon] Iniciado: {self.session_id}")
            print(f"[Daemon] WebSocket disponível para extensão")

        try:
            iteration = 0
            while self.is_running:
                iteration += 1

                # Respeitar pausa
                if self.is_paused:
                    self.state = "PAUSED"
                    await asyncio.sleep(1)
                    continue

                self.state = "RUNNING"

                # Simular atividade (a cada 10 iterações)
                if iteration % 10 == 0:
                    await self.emit_status()

                # Simular variação de saldo
                if iteration % 50 == 0:
                    self.bankroll += (iteration % 5 - 2) * 10
                    await self.ws_server.send_status()

                await asyncio.sleep(0.5)

        except KeyboardInterrupt:
            if self.debug:
                print("\n[Daemon] Encerrando por KeyboardInterrupt...")
            self.is_running = False
        except Exception as e:
            await self.ws_server.send_alert(
                "DAEMON_ERROR",
                f"Erro no daemon: {str(e)}",
                "CRITICAL"
            )
            self.state = "ERROR"
        finally:
            await self.ws_server.stop()
            self.is_running = False
            if self.debug:
                print(f"[Daemon] Encerrado: {self.session_id}")

    async def emit_status(self):
        """Emite status para extensão"""
        await self.ws_server.send_status()

    async def pause(self):
        """Pausa execução"""
        self.is_paused = True
        if self.debug:
            print("[Daemon] Pausado")

    async def resume(self):
        """Retoma execução"""
        self.is_paused = False
        if self.debug:
            print("[Daemon] Retomado")

    async def stop(self):
        """Para daemon"""
        self.is_running = False
        if self.debug:
            print("[Daemon] Parando...")

    async def submit_manual_command(self, side: str, stake: float):
        """Recebe aposta manual"""
        if self.debug:
            print(f"[Daemon] Aposta manual: {side} R${stake}")

        await self.ws_server.send_execution_result(
            "SUCCESS",
            side,
            stake
        )


async def main():
    print("=" * 70)
    print("  J.A.R.V.I.S. - Daemon Simplificado (Teste)")
    print("=" * 70)
    print()

    daemon = SimplifiedDaemon(debug=True)
    await daemon.run()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nEncerrando...")

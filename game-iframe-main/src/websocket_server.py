# WebSocket Server - Comunicação com extensão Chrome
import asyncio
import json
import uuid
from datetime import datetime
from typing import Set, Dict, Any

try:
    import websockets
except ImportError:
    print("⚠️  websockets não instalado. Instale com: pip install websockets")
    websockets = None


class WebSocketServer:
    """Servidor WebSocket para comunicação com extensão Chrome."""

    def __init__(self, host: str = "localhost", port: int = 8765, debug: bool = True):
        self.host = host
        self.port = port
        self.debug = debug
        self.clients: Set[websockets.WebSocketServerProtocol] = set()
        self.server = None
        self.daemon = None  # Referência ao daemon para controle

    async def start(self):
        """Inicia servidor WebSocket."""
        if not websockets:
            if self.debug:
                print("[WebSocket] websockets não disponível, pulando...")
            return

        try:
            self.server = await websockets.serve(
                self.handle_client,
                self.host,
                self.port,
                # Configurações para melhor performance
                max_size=2**20,  # 1MB max message
                max_queue=32,
                compression=None,
            )

            if self.debug:
                print(f"[WebSocket] Servidor iniciado em ws://{self.host}:{self.port}")
        except OSError as e:
            if self.debug:
                print(f"[WebSocket] Erro ao iniciar servidor: {e}")
            # Não falhar o daemon se o WebSocket não iniciar
            pass

    async def stop(self):
        """Para servidor WebSocket."""
        if self.server:
            self.server.close()
            await self.server.wait_closed()
            if self.debug:
                print("[WebSocket] Servidor parado")

    async def handle_client(self, websocket, path):
        """Manipula nova conexão de cliente."""
        client_id = str(uuid.uuid4())[:8]
        self.clients.add(websocket)

        try:
            if self.debug:
                print(f"[WebSocket] Cliente conectado: {client_id} ({len(self.clients)} total)")

            # Enviar status inicial
            await self.send_status(websocket)

            # Aguardar mensagens do cliente
            async for message in websocket:
                try:
                    data = json.loads(message)
                    await self.handle_message(websocket, data, client_id)
                except json.JSONDecodeError as e:
                    if self.debug:
                        print(f"[WebSocket] Erro ao decodificar JSON de {client_id}: {e}")
                except Exception as e:
                    if self.debug:
                        print(f"[WebSocket] Erro ao processar mensagem de {client_id}: {e}")

        except websockets.exceptions.ConnectionClosed:
            if self.debug:
                print(f"[WebSocket] Cliente desconectado: {client_id}")
        finally:
            self.clients.discard(websocket)

    async def handle_message(self, websocket, data: Dict[str, Any], client_id: str):
        """Processa mensagem recebida do cliente."""
        msg_type = data.get("type")

        if self.debug:
            print(f"[WebSocket] Mensagem de {client_id}: {msg_type}")

        # REQUEST_STATUS
        if msg_type == "REQUEST_STATUS":
            await self.send_status(websocket)

        # COMMAND (start, pause, resume, stop)
        elif msg_type == "COMMAND":
            command = data.get("command")
            if self.daemon:
                await self.handle_daemon_command(command)

        # MANUAL_COMMAND (entrada manual)
        elif msg_type == "MANUAL_COMMAND":
            side = data.get("side")
            stake = data.get("stake")
            if self.daemon and side and stake:
                await self.daemon.submit_manual_command(side, stake)

        else:
            if self.debug:
                print(f"[WebSocket] Tipo de mensagem desconhecido: {msg_type}")

    async def handle_daemon_command(self, command: str):
        """Envia comando para o daemon."""
        if not self.daemon:
            return

        if command == "start":
            # Daemon já está rodando, ignorar
            pass
        elif command == "pause":
            await self.daemon.pause()
        elif command == "resume":
            await self.daemon.resume()
        elif command == "stop":
            await self.daemon.stop()

    async def broadcast(self, message: Dict[str, Any]):
        """Envia mensagem para todos os clientes conectados."""
        if not self.clients:
            return

        message_json = json.dumps(message)

        # Enviar para todos os clientes em paralelo
        tasks = [
            self.send_message_safe(client, message_json)
            for client in list(self.clients)
        ]

        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)

    async def send_message_safe(self, websocket, message: str):
        """Envia mensagem com tratamento de erro."""
        try:
            await websocket.send(message)
        except websockets.exceptions.ConnectionClosed:
            # Cliente desconectou
            pass
        except Exception as e:
            if self.debug:
                print(f"[WebSocket] Erro ao enviar: {e}")

    async def send_status(self, websocket=None):
        """Envia status do daemon."""
        if not self.daemon:
            return

        status_msg = {
            "type": "STATUS_UPDATE",
            "data": {
                "state": self.daemon.state,
                "mode": self.daemon.mode,
                "bankroll": getattr(self.daemon.core_loop.reconciler, 'last_bankroll', 0.0),
                "round_id": self.daemon.core_loop.current_round_id,
                "session_id": self.daemon.session_id,
            },
            "timestamp": datetime.utcnow().isoformat(),
        }

        if websocket:
            # Enviar para um cliente específico
            await self.send_message_safe(websocket, json.dumps(status_msg))
        else:
            # Broadcast para todos
            await self.broadcast(status_msg)

    async def send_alert(self, code: str, message: str, severity: str, technical_details: str = ""):
        """Envia alerta para todos os clientes."""
        alert_msg = {
            "type": "ALERT",
            "data": {
                "code": code,
                "message": message,
                "severity": severity,
                "technical_details": technical_details,
            },
            "timestamp": datetime.utcnow().isoformat(),
        }

        await self.broadcast(alert_msg)

    async def send_snapshot(self, snapshot_id: str, confidence: float):
        """Envia notificação de snapshot capturado."""
        msg = {
            "type": "SNAPSHOT_CAPTURED",
            "data": {
                "snapshot_id": snapshot_id,
                "confidence": confidence,
            },
            "timestamp": datetime.utcnow().isoformat(),
        }

        await self.broadcast(msg)

    async def send_round_opened(self, round_id: str):
        """Envia notificação de rodada aberta."""
        msg = {
            "type": "ROUND_OPENED",
            "round_id": round_id,
            "timestamp": datetime.utcnow().isoformat(),
        }

        await self.broadcast(msg)

    async def send_round_closed(self, round_id: str):
        """Envia notificação de rodada fechada."""
        msg = {
            "type": "ROUND_CLOSED",
            "round_id": round_id,
            "timestamp": datetime.utcnow().isoformat(),
        }

        await self.broadcast(msg)

    async def send_countdown(self, countdown_ms: int, total_ms: int):
        """Envia atualização de countdown."""
        msg = {
            "type": "COUNTDOWN_UPDATE",
            "countdown_ms": countdown_ms,
            "total_ms": total_ms,
            "timestamp": datetime.utcnow().isoformat(),
        }

        await self.broadcast(msg)

    async def send_execution_result(self, status: str, side: str, stake: float, error_message: str = ""):
        """Envia resultado de execução."""
        msg = {
            "type": "EXECUTION_RESULT",
            "data": {
                "status": status,
                "side": side,
                "stake": stake,
                "error_message": error_message,
            },
            "timestamp": datetime.utcnow().isoformat(),
        }

        await self.broadcast(msg)

    def get_client_count(self) -> int:
        """Retorna número de clientes conectados."""
        return len(self.clients)

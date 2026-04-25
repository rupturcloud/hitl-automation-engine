#!/usr/bin/env python3
"""
WebSocket Server Standalone - Apenas para testes da extensão
Roda sem dependência do daemon ou navegador
"""

import asyncio
import websockets
import json
from datetime import datetime

# Estado simulado
daemon_state = {
    "state": "RUNNING",
    "mode": "MANUAL",
    "bankroll": 1000.0,
    "round_id": "round-1",
    "session_id": "test-session"
}

clients = set()

async def handle_client(websocket, path):
    """Gerencia conexão de cliente"""
    clients.add(websocket)
    print(f"✅ Cliente conectado ({len(clients)} total)")

    try:
        # Enviar status inicial
        msg = {
            "type": "STATUS_UPDATE",
            "data": daemon_state,
            "timestamp": datetime.utcnow().isoformat()
        }
        await websocket.send(json.dumps(msg))

        # Aguardar mensagens
        async for message in websocket:
            try:
                data = json.loads(message)
                print(f"📨 Mensagem recebida: {data['type']}")

                # Responder a REQUEST_STATUS
                if data['type'] == 'REQUEST_STATUS':
                    msg = {
                        "type": "STATUS_UPDATE",
                        "data": daemon_state,
                        "timestamp": datetime.utcnow().isoformat()
                    }
                    await websocket.send(json.dumps(msg))

                # Responder a COMMAND
                elif data['type'] == 'COMMAND':
                    print(f"  → Comando: {data['command']}")

                # Responder a MANUAL_COMMAND
                elif data['type'] == 'MANUAL_COMMAND':
                    print(f"  → Aposta manual: {data['side']} R${data['stake']}")

            except json.JSONDecodeError:
                print(f"❌ JSON inválido: {message}")

    except websockets.exceptions.ConnectionClosed:
        print(f"❌ Cliente desconectado ({len(clients)-1} restantes)")
    finally:
        clients.discard(websocket)

async def main():
    print("=" * 60)
    print("  J.A.R.V.I.S. - WebSocket Server (Standalone)")
    print("=" * 60)

    server = await websockets.serve(
        handle_client,
        "localhost",
        8765,
        max_size=2**20,
        max_queue=32
    )

    print("\n✅ Servidor iniciado em ws://localhost:8765")
    print("✅ Pronto para conexões da extensão!")
    print("\nPressione Ctrl+C para parar...\n")

    try:
        await asyncio.Future()  # Roda indefinidamente
    except KeyboardInterrupt:
        print("\n\n⏹️  Encerrando...")
        server.close()
        await server.wait_closed()

if __name__ == "__main__":
    asyncio.run(main())

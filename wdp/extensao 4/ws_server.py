#!/usr/bin/env python3
"""
Servidor WebSocket local para a extensão Will Dados Pro.
Roda em ws://localhost:8765 e atua como hub de mensagens.

Uso:
  python3 ws_server.py

O servidor:
  - Recebe conexões da extensão Chrome (background.js)
  - Exibe mensagens recebidas no terminal
  - Permite enviar comandos interativos para a extensão
  - Comandos disponíveis no terminal:
      cancel   → envia CANCEL_BET (cancela HITL em andamento)
      on       → liga o robô
      off      → desliga o robô
      status   → solicita status
      quit     → encerra o servidor
"""

import asyncio
import json
import sys
from datetime import datetime

try:
    import websockets
except ImportError:
    print("❌ Instale websockets: pip3 install websockets")
    sys.exit(1)

clients = set()

async def handler(websocket):
    clients.add(websocket)
    remote = websocket.remote_address
    print(f"\n🟢 [{datetime.now().strftime('%H:%M:%S')}] Extensão conectada: {remote}")
    try:
        async for message in websocket:
            try:
                data = json.loads(message)
                tipo = data.get("type", "?")
                print(f"📩 [{datetime.now().strftime('%H:%M:%S')}] {tipo}: {json.dumps(data, ensure_ascii=False, indent=2)}")
            except json.JSONDecodeError:
                print(f"📩 [{datetime.now().strftime('%H:%M:%S')}] Raw: {message[:200]}")
    except websockets.ConnectionClosed:
        pass
    finally:
        clients.discard(websocket)
        print(f"🔴 [{datetime.now().strftime('%H:%M:%S')}] Extensão desconectada: {remote}")

async def broadcast(data):
    if not clients:
        print("⚠️  Nenhuma extensão conectada.")
        return
    msg = json.dumps(data)
    for ws in clients.copy():
        try:
            await ws.send(msg)
        except:
            clients.discard(ws)
    print(f"📤 Enviado para {len(clients)} cliente(s)")

async def input_loop():
    loop = asyncio.get_event_loop()
    print("\n📋 Comandos: cancel | on | off | status | quit")
    print("─" * 50)
    while True:
        cmd = await loop.run_in_executor(None, lambda: input("cmd> ").strip().lower())
        if cmd == "quit":
            print("👋 Encerrando servidor...")
            for ws in clients.copy():
                await ws.close()
            sys.exit(0)
        elif cmd == "cancel":
            await broadcast({"action": "CANCEL_BET", "source": "ws_server"})
        elif cmd == "on":
            await broadcast({"action": "TOGGLE_ROBO", "ativo": True, "source": "ws_server"})
        elif cmd == "off":
            await broadcast({"action": "TOGGLE_ROBO", "ativo": False, "source": "ws_server"})
        elif cmd == "status":
            await broadcast({"action": "GET_STATUS", "source": "ws_server"})
        elif cmd:
            # Tenta enviar como JSON arbitrário
            try:
                data = json.loads(cmd)
                await broadcast(data)
            except json.JSONDecodeError:
                print(f"❓ Comando desconhecido: {cmd}")

async def main():
    print("=" * 50)
    print("🎲 Will Dados Pro — WebSocket Server")
    print(f"🔗 ws://localhost:8765")
    print("=" * 50)
    async with websockets.serve(handler, "localhost", 8765):
        await input_loop()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n👋 Servidor encerrado.")

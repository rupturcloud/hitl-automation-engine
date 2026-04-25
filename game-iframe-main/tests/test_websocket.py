"""Testes do WebSocket Server."""
import sys
import asyncio
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from websocket_server import WebSocketServer


async def test_websocket_server_creation():
    """Testa criação do servidor WebSocket."""
    server = WebSocketServer(host="localhost", port=8765, debug=True)
    assert server is not None
    assert server.host == "localhost"
    assert server.port == 8765
    print("✓ Servidor WebSocket criado com sucesso")


async def test_websocket_server_start():
    """Testa inicialização do servidor."""
    server = WebSocketServer(host="localhost", port=9876, debug=False)
    await server.start()

    assert server.server is not None
    print("✓ Servidor WebSocket iniciado")

    await server.stop()
    print("✓ Servidor WebSocket parado")


async def test_websocket_broadcast():
    """Testa broadcast de mensagem."""
    server = WebSocketServer(host="localhost", port=9877, debug=False)

    # Testar sem clientes conectados (não deve falhar)
    message = {
        "type": "TEST",
        "data": "test"
    }
    await server.broadcast(message)
    print("✓ Broadcast funcionando (sem clientes)")


async def test_websocket_alert():
    """Testa envio de alerta."""
    server = WebSocketServer(host="localhost", port=9878, debug=False)

    await server.send_alert(
        "TEST_CODE",
        "Test message",
        "CRITICAL"
    )
    print("✓ Método send_alert funcionando")


async def test_websocket_status():
    """Testa envio de status."""
    server = WebSocketServer(host="localhost", port=9879, debug=False)

    # Mock de daemon
    class MockReconciler:
        last_bankroll = 1000.0

    class MockCoreLoop:
        current_round_id = "round-1"
        reconciler = MockReconciler()

    class MockDaemon:
        state = "RUNNING"
        mode = "MANUAL"
        session_id = "test-123"
        core_loop = MockCoreLoop()

    server.daemon = MockDaemon()
    await server.send_status()
    print("✓ Método send_status funcionando")


async def test_websocket_countdown():
    """Testa envio de countdown."""
    server = WebSocketServer(host="localhost", port=9880, debug=False)

    await server.send_countdown(5000, 10000)
    print("✓ Método send_countdown funcionando")


async def test_websocket_round_events():
    """Testa eventos de rodada."""
    server = WebSocketServer(host="localhost", port=9881, debug=False)

    await server.send_round_opened("round-test-1")
    print("✓ send_round_opened funcionando")

    await server.send_round_closed("round-test-1")
    print("✓ send_round_closed funcionando")


async def test_websocket_execution_result():
    """Testa envio de resultado de execução."""
    server = WebSocketServer(host="localhost", port=9882, debug=False)

    await server.send_execution_result("SUCCESS", "BLUE", 100.0)
    print("✓ send_execution_result funcionando")


async def run_all_tests():
    """Executa todos os testes."""
    print("╔════════════════════════════════════╗")
    print("║   TESTES DO WEBSOCKET SERVER       ║")
    print("╚════════════════════════════════════╝\n")

    await test_websocket_server_creation()
    await test_websocket_server_start()
    await test_websocket_broadcast()
    await test_websocket_alert()
    await test_websocket_status()
    await test_websocket_countdown()
    await test_websocket_round_events()
    await test_websocket_execution_result()

    print("\n✅ Todos os testes do WebSocket passaram!")


if __name__ == "__main__":
    try:
        asyncio.run(run_all_tests())
    except Exception as e:
        print(f"\n❌ Erro: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

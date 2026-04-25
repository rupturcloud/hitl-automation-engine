# WebSocket Observer - Hybrid
# Tenta WebSocket direto + fallback para Playwright interception

import asyncio
import json
from datetime import datetime
from typing import Optional, Callable, List
import websockets
from schemas import WebSocketState
from codes import Codes, format_alert

class WebSocketObserver:
    def __init__(self, debug=True):
        self.debug = debug
        self.ws_url = None
        self.ws_connection = None
        self.fallback_mode = False
        self.event_queue = asyncio.Queue()
        self.last_event_timestamp = None
        self.event_sequence = 0
        self.is_connected = False

        # Callbacks
        self.on_event_callback: Optional[Callable] = None

    async def start_websocket(self, ws_url: str):
        """Tenta conexão WebSocket direto."""
        self.ws_url = ws_url
        self.fallback_mode = False

        try:
            async with websockets.connect(ws_url, ping_interval=30) as ws:
                self.ws_connection = ws
                self.is_connected = True

                if self.debug:
                    print(f"✓ WebSocket conectado: {ws_url}")

                async for message in ws:
                    await self._process_websocket_message(message)

        except Exception as e:
            alert = format_alert(
                Codes.WS_DESSINCRONIA,
                "WebSocket direto falhou, ativando fallback via Playwright",
                str(e)
            )
            print(alert["formatted"])
            self.fallback_mode = True
            self.is_connected = False

    async def _process_websocket_message(self, raw_message: str):
        """Processa mensagem WebSocket bruta."""
        try:
            data = json.loads(raw_message)

            # Inferir tipo de evento baseado no payload
            event_type = data.get("type") or data.get("eventType") or "unknown"
            phase = data.get("phase") or data.get("gamePhase")

            ws_state = WebSocketState(
                connected=True,
                phase=phase or "unknown",
                event_timestamp=datetime.utcnow().isoformat(),
                sequence=self.event_sequence,
                data=data
            )

            self.event_sequence += 1
            self.last_event_timestamp = ws_state.event_timestamp

            if self.on_event_callback:
                await self.on_event_callback(ws_state)

            await self.event_queue.put(ws_state)

            if self.debug:
                print(f"[WS Event #{self.event_sequence}] {event_type} | phase={phase}")

        except json.JSONDecodeError:
            if self.debug:
                print(f"[WS] Mensagem não-JSON: {raw_message[:100]}")

    async def start_playwright_fallback(self, page):
        """Fallback: Intercepta eventos via Playwright Network/Console."""
        self.fallback_mode = True
        self.is_connected = True

        if self.debug:
            print("📡 Playwright fallback ativado. Monitorando Network/Console...")

        # Listener de Network Response (para APIs REST)
        async def on_response(response):
            if "game" in response.url.lower() or "evolution" in response.url.lower():
                try:
                    json_body = await response.json()
                    await self._process_network_event(json_body, response.url)
                except Exception as e:
                    pass

        page.on("response", on_response)

        # Listener de Console Messages (debug info)
        def on_console_msg(msg):
            try:
                if "game" in msg.text.lower() or msg.args:
                    if self.debug:
                        print(f"[Console] {msg.text[:80]}")
            except:
                pass

        page.on("console", on_console_msg)

        # Manter listener ativo indefinidamente
        while True:
            await asyncio.sleep(1)

    async def _process_network_event(self, data: dict, url: str):
        """Processa eventos capturados via Network (Playwright)."""
        # Tentar extrair informações relevantes
        phase = data.get("phase") or data.get("gamePhase") or "network_event"

        ws_state = WebSocketState(
            connected=True,
            phase=phase,
            event_timestamp=datetime.utcnow().isoformat(),
            sequence=self.event_sequence,
            data=data
        )

        self.event_sequence += 1
        self.last_event_timestamp = ws_state.event_timestamp

        if self.on_event_callback:
            await self.on_event_callback(ws_state)

        await self.event_queue.put(ws_state)

        if self.debug:
            print(f"[Network Event #{self.event_sequence}] {url[:60]} | phase={phase}")

    async def get_latest_event(self, timeout: float = 1.0) -> Optional[WebSocketState]:
        """Retorna o próximo evento com timeout."""
        try:
            event = await asyncio.wait_for(self.event_queue.get(), timeout=timeout)
            return event
        except asyncio.TimeoutError:
            return None

    def get_connection_status(self) -> dict:
        """Status atual da conexão."""
        return {
            "is_connected": self.is_connected,
            "fallback_mode": self.fallback_mode,
            "ws_url": self.ws_url,
            "last_event": self.last_event_timestamp,
            "event_count": self.event_sequence,
            "queue_size": self.event_queue.qsize()
        }

    async def stop(self):
        """Encerra conexão."""
        if self.ws_connection:
            await self.ws_connection.close()
        self.is_connected = False


# Wrapper para iniciar em modo hybrid
async def start_hybrid_websocket_observer(
    page,
    ws_url: Optional[str] = None,
    debug=True
) -> WebSocketObserver:
    """
    Inicia observer WebSocket em modo hybrid.
    Tenta WebSocket primeiro, fallback para Playwright se falhar.
    """
    observer = WebSocketObserver(debug=debug)

    if ws_url:
        # Tentar WebSocket direto em background
        ws_task = asyncio.create_task(observer.start_websocket(ws_url))
    else:
        ws_task = None

    # Aguardar até 2s para dar chance ao WebSocket de conectar antes de checar
    if ws_task:
        await asyncio.sleep(2)

    if not observer.is_connected:
        # Executar fallback em background — start_playwright_fallback tem loop
        # infinito e nunca retorna, por isso não pode ser aguardado diretamente.
        asyncio.create_task(observer.start_playwright_fallback(page))

    return observer

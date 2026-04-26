#!/usr/bin/env python3
"""
WEBSOCKET LISTENER — Sincronização REAL com a mesa
Ouve eventos da banca em tempo real
"""

import sys
import os
import json
import time
import asyncio
import websockets
from datetime import datetime
from seleniumbase import SB

BASE_PATH = '/Users/diego/dev/ruptur-cloud'
OUT_DIR = f'{BASE_PATH}/websocket_output'
os.makedirs(OUT_DIR, exist_ok=True)

def log(msg, tag='WS'):
    ts = datetime.now().strftime('%H:%M:%S.%f')[:-3]
    print(f'[{ts}][{tag}] {msg}')

# Endpoints WebSocket conhecidos
WS_URLS = [
    'wss://betboom.bet.br/socket.io/?transport=websocket',
    'wss://api.betboom.bet.br/ws',
    'wss://live.betboom.bet.br/ws',
]

usuario = 'diego'
session_file = f'{BASE_PATH}/betboom_session_{usuario}.json'
profile_dir = os.path.expanduser(f'~/.selenium_profile_{usuario}')

if not os.path.exists(session_file):
    log('❌ Sessão não encontrada', 'ERR')
    sys.exit(1)

with open(session_file, 'r') as f:
    cookies = json.load(f)

log(f'✅ {len(cookies)} cookies carregados', 'LOAD')

print()
print('═' * 70)
print('WEBSOCKET LISTENER — Sincronização com Bac Bo')
print('═' * 70)
print()

with SB(uc=True, headless=False, block_images=False, user_data_dir=profile_dir) as sb:
    log('✅ Selenium iniciado', 'SETUP')

    sb.open('https://betboom.bet.br')
    time.sleep(2)

    for cookie in cookies:
        try:
            sb.add_cookie(cookie)
        except:
            pass

    sb.open('https://betboom.bet.br')
    time.sleep(2)

    log('🎰 Abrindo Bac Bo...', 'SETUP')
    sb.open('https://betboom.bet.br/casino/game/bac_bo-26281/')
    time.sleep(5)

    log('✅ Mesa aberta', 'SETUP')
    print()

    # Inspeciona network em tempo real via browser dev tools
    log('🔍 Capturando eventos WebSocket da página...', 'INSPECT')

    # JavaScript para capturar WebSocket events
    WS_CAPTURE_JS = """
    window.wsEvents = [];
    window.wsMaxEvents = 100;

    // Override WebSocket
    const OriginalWS = window.WebSocket;
    window.WebSocket = function(url, protocols) {
        console.log('[WS] Connecting to:', url);
        const ws = new OriginalWS(url, protocols);

        const originalSend = ws.send;
        ws.send = function(data) {
            console.log('[WS] Send:', data);
            return originalSend.call(ws, data);
        };

        ws.addEventListener('message', (event) => {
            const msg = {
                timestamp: new Date().toISOString(),
                type: 'message',
                data: event.data.substring(0, 500)  // Primeiros 500 chars
            };
            window.wsEvents.push(msg);
            console.log('[WS] Message:', msg.data);
        });

        return ws;
    };

    // Captura fetch também
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const url = args[0];
        if (url.includes('bet') || url.includes('game') || url.includes('bac')) {
            console.log('[FETCH]', url);
        }
        return originalFetch.apply(this, args);
    };

    console.log('✅ WebSocket listener ativo');
    """

    try:
        sb.execute_script(WS_CAPTURE_JS)
        log('✅ Listener WebSocket injetado', 'INJECT')
    except Exception as e:
        log(f'⚠️ Erro ao injetar: {e}', 'WARN')

    # Aguarda eventos
    log('⏳ Aguardando 30 segundos de eventos WebSocket...', 'WAIT')
    time.sleep(30)

    # Recupera eventos capturados
    try:
        events = sb.execute_script('return window.wsEvents || [];')
        log(f'📡 {len(events)} eventos capturados', 'CAPTURE')

        if events:
            print()
            print('═' * 70)
            print('EVENTOS WEBSOCKET CAPTURADOS')
            print('═' * 70)
            for i, event in enumerate(events[:20], 1):
                print(f'{i}. [{event["timestamp"]}]')
                print(f'   {event["data"][:200]}')
                print()

            # Salva em JSON
            json_file = f'{OUT_DIR}/websocket_events.json'
            with open(json_file, 'w') as f:
                json.dump(events, f, indent=2)
            log(f'💾 Eventos salvos: {json_file}', 'SAVE')
        else:
            log('⚠️ Nenhum evento WebSocket capturado', 'WARN')
            log('Isto significa que a página pode usar polling ou diferente padrão', 'INFO')

    except Exception as e:
        log(f'❌ Erro ao capturar eventos: {e}', 'ERR')

    # Screenshot final
    ss = f'{OUT_DIR}/websocket_capture.png'
    sb.save_screenshot(ss)
    log(f'📸 Screenshot: {ss}', 'SS')

    print()
    print('═' * 70)
    print('✅ WEBSOCKET LISTENER COMPLETO')
    print('═' * 70)
    print()
    print('PRÓXIMOS PASSOS:')
    print('1. Analisar eventos capturados em websocket_events.json')
    print('2. Identificar padrão de "betting window" nos eventos')
    print('3. Sincronizar clicks com timing da mesa')
    print()

log('✅ Finalizado', 'DONE')

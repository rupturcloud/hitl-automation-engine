#!/usr/bin/env python3
"""
WILL SERVER V8 — Sincronização em Tempo Real
==============================================

Expõe estado do jogo via API:
- /api/game/state  → Estado atual da mesa
- /api/game/balance → Saldo do jogador
- /api/game/countdown → Tempo restante para apostar
- /api/game/history → Histórico de rodadas
- /api/bet/place  → Colocar aposta (POST)
- /api/bet/result → Resultado da última aposta
"""

import json
import http.server
import socketserver
import threading
import time
import os
from urllib.parse import urlparse, parse_qs
from datetime import datetime
from pathlib import Path

PORT = 5555
STATS_FILE = Path('/tmp/will_server_stats.json')

# ═══════════════════════════════════════════════════════════════
# ESTADO GLOBAL
# ═══════════════════════════════════════════════════════════════

GAME_STATE = {
    'timestamp': datetime.now().isoformat(),
    'status': 'IDLE',  # IDLE, BETTING_OPEN, BETTING_CLOSED, PROCESSING, RESULT
    'phase': 'waiting',  # waiting, betting, spinning, paying
    'countdown': 0,  # Segundos restantes na betting window
    'balance': 5.28,  # Saldo do player
    'last_bet': None,  # Última aposta colocada
    'last_result': None,  # Resultado da última rodada
    'round_number': 0,
    'history': [],  # Últimas 20 rodadas
}

BETTING_WINDOW = {
    'open': False,
    'opened_at': None,
    'closes_at': None,
    'duration': 13,  # segundos
}

# ═══════════════════════════════════════════════════════════════
# LOGGING
# ═══════════════════════════════════════════════════════════════

def log(msg):
    ts = datetime.now().strftime('%H:%M:%S.%f')[:-3]
    print(f'[{ts}] [V8] {msg}')

# ═══════════════════════════════════════════════════════════════
# SIMULADOR DE JOGO
# ═══════════════════════════════════════════════════════════════

def simular_jogo():
    """
    Simula o ciclo do jogo Bac Bo:
    1. BETTING OPEN (13s)
    2. BETTING CLOSED
    3. SPINNING (dados sendo lançados)
    4. RESULT (resultado anunciado)
    5. PAYING (prêmios pagos)
    """
    log('🎲 Iniciando simulador de jogo...')

    rodada = 0

    while True:
        rodada += 1
        GAME_STATE['round_number'] = rodada
        log(f'Rodada {rodada} iniciada')

        # ─────────────────────────────────────────────────────────
        # PHASE 1: BETTING OPEN (13 segundos)
        # ─────────────────────────────────────────────────────────

        GAME_STATE['status'] = 'BETTING_OPEN'
        GAME_STATE['phase'] = 'betting'
        BETTING_WINDOW['open'] = True
        BETTING_WINDOW['opened_at'] = time.time()
        BETTING_WINDOW['closes_at'] = time.time() + BETTING_WINDOW['duration']

        for i in range(BETTING_WINDOW['duration']):
            GAME_STATE['countdown'] = BETTING_WINDOW['duration'] - i
            GAME_STATE['timestamp'] = datetime.now().isoformat()
            time.sleep(1)

        # ─────────────────────────────────────────────────────────
        # PHASE 2: BETTING CLOSED
        # ─────────────────────────────────────────────────────────

        GAME_STATE['status'] = 'BETTING_CLOSED'
        BETTING_WINDOW['open'] = False
        GAME_STATE['countdown'] = 0
        log(f'  ⏹ Betting window fechada')
        time.sleep(2)

        # ─────────────────────────────────────────────────────────
        # PHASE 3: SPINNING (Dealer lança dados)
        # ─────────────────────────────────────────────────────────

        GAME_STATE['phase'] = 'spinning'
        GAME_STATE['status'] = 'PROCESSING'
        log(f'  🎲 Dados sendo lançados...')
        time.sleep(3)

        # ─────────────────────────────────────────────────────────
        # PHASE 4: RESULT (Resultado)
        # ─────────────────────────────────────────────────────────

        GAME_STATE['phase'] = 'result'
        resultado = {
            'player_score': (rodada * 3) % 10,
            'banker_score': (rodada * 5) % 10,
            'result': 'PLAYER' if (rodada % 2) == 0 else 'BANKER',
        }

        GAME_STATE['last_result'] = resultado
        GAME_STATE['history'].append({
            'round': rodada,
            'result': resultado['result'],
            'timestamp': datetime.now().isoformat(),
        })
        if len(GAME_STATE['history']) > 20:
            GAME_STATE['history'] = GAME_STATE['history'][-20:]

        log(f'  ✅ Resultado: {resultado["result"]} ({resultado["player_score"]} vs {resultado["banker_score"]})')

        # ─────────────────────────────────────────────────────────
        # PHASE 5: PAYING (Prêmios)
        # ─────────────────────────────────────────────────────────

        GAME_STATE['phase'] = 'paying'
        GAME_STATE['status'] = 'PAYING'

        # Se havia aposta, processar resultado
        if GAME_STATE['last_bet']:
            aposta = GAME_STATE['last_bet']
            tipo = aposta['type']
            valor = aposta['amount']

            if tipo == resultado['result']:
                # Ganhou
                GAME_STATE['balance'] += valor
                resultado['status'] = 'WIN'
                log(f'  🎉 Aposta vencida! Novo saldo: {GAME_STATE["balance"]:.2f}')
            else:
                # Perdeu
                GAME_STATE['balance'] -= valor
                resultado['status'] = 'LOSS'
                log(f'  💔 Aposta perdida. Novo saldo: {GAME_STATE["balance"]:.2f}')

            GAME_STATE['last_bet'] = None

        time.sleep(2)

        # Próxima rodada
        GAME_STATE['status'] = 'IDLE'
        GAME_STATE['phase'] = 'waiting'
        time.sleep(2)

# ═══════════════════════════════════════════════════════════════
# HTTP SERVER
# ═══════════════════════════════════════════════════════════════

class ReuseAddrTCPServer(socketserver.TCPServer):
    allow_reuse_address = True

class GameHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        path = urlparse(self.path).path

        # ─────────────────────────────────────────────────────────
        # Health Check
        # ─────────────────────────────────────────────────────────

        if path == '/health':
            self._respond(200, {'status': 'OK', 'version': '8.0'})

        # ─────────────────────────────────────────────────────────
        # Estado da Mesa
        # ─────────────────────────────────────────────────────────

        elif path == '/api/game/state':
            self._respond(200, GAME_STATE)
            log(f'✅ GET {path}')

        elif path == '/api/game/balance':
            self._respond(200, {'balance': GAME_STATE['balance']})

        elif path == '/api/game/countdown':
            self._respond(200, {
                'countdown': GAME_STATE['countdown'],
                'betting_open': BETTING_WINDOW['open'],
            })

        elif path == '/api/game/history':
            self._respond(200, {'history': GAME_STATE['history']})

        elif path == '/api/bet/result':
            self._respond(200, {
                'result': GAME_STATE['last_result'],
                'balance': GAME_STATE['balance'],
            })

        else:
            self._respond(404, {'error': 'Not found'})

    def do_POST(self):
        path = urlparse(self.path).path

        # ─────────────────────────────────────────────────────────
        # Colocar Aposta
        # ─────────────────────────────────────────────────────────

        if path == '/api/bet/place':
            try:
                content_length = int(self.headers.get('Content-Length', 0))
                body = self.rfile.read(content_length).decode()
                data = json.loads(body)

                tipo = data.get('type')  # PLAYER, BANKER, TIE
                valor = float(data.get('amount', 1.0))

                if tipo not in ['PLAYER', 'BANKER', 'TIE']:
                    self._respond(400, {'error': 'Invalid bet type'})
                    return

                if not BETTING_WINDOW['open']:
                    self._respond(400, {'error': 'Betting window closed'})
                    return

                # Registrar aposta
                GAME_STATE['last_bet'] = {
                    'type': tipo,
                    'amount': valor,
                    'timestamp': datetime.now().isoformat(),
                }
                GAME_STATE['balance'] -= valor  # Deduzir imediatamente

                log(f'💰 Aposta registrada: {tipo} R${valor}')
                self._respond(200, {
                    'ok': True,
                    'bet': GAME_STATE['last_bet'],
                    'balance': GAME_STATE['balance'],
                })

            except json.JSONDecodeError:
                self._respond(400, {'error': 'Invalid JSON'})
            except Exception as e:
                self._respond(500, {'error': str(e)})

        else:
            self._respond(404, {'error': 'Not found'})

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def _respond(self, status, data):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def log_message(self, format, *args):
        pass  # Silenciar logs

# ═══════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════

if __name__ == '__main__':
    log('═' * 70)
    log('WILL SERVER V8 — Real-Time Game Synchronization')
    log('═' * 70)

    # Iniciar simulador em thread
    simulator_thread = threading.Thread(target=simular_jogo, daemon=True)
    simulator_thread.start()
    log('🎲 Simulador iniciado')

    # Iniciar servidor
    with ReuseAddrTCPServer(('127.0.0.1', PORT), GameHandler) as httpd:
        log(f'✅ Servidor rodando em http://127.0.0.1:{PORT}')
        log('')
        log('Endpoints:')
        log('  GET  /health              — Health check')
        log('  GET  /api/game/state      — Estado da mesa')
        log('  GET  /api/game/balance    — Saldo atual')
        log('  GET  /api/game/countdown  — Countdown e betting window')
        log('  GET  /api/game/history    — Histórico de rodadas')
        log('  POST /api/bet/place       — Colocar aposta')
        log('  GET  /api/bet/result      — Resultado último bet')
        log('')

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            log('⏹ Servidor parado')

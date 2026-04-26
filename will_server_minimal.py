#!/usr/bin/env python3
"""WILL SERVER MINIMAL — Sem dependências (stdlib apenas)"""

import json, http.server, socketserver, threading, time, os, re, subprocess
from urllib.parse import urlparse, parse_qs
from datetime import datetime
import pyautogui, webbrowser

PORT = 5555  # Private - Behind Bridge V2
STATE = {'status': 'IDLE', 'saldo': 0, 'ciclo': 0, 'historico': []}

# Socket reutilizável (permite restart rápido)
class ReuseAddrTCPServer(socketserver.TCPServer):
    allow_reuse_address = True

def log(msg):
    ts = datetime.now().strftime('%H:%M:%S.%f')[:-3]
    print(f'[{ts}] {msg}')

class ServerHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        path = urlparse(self.path).path

        if path == '/api/start':
            thread = threading.Thread(target=run_robo, daemon=True)
            thread.start()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'ok': True, 'msg': 'Robo iniciado'}).encode())
            log('🚀 POST /api/start')

        elif path == '/api/stop':
            STATE['status'] = 'STOPPED'
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'ok': True}).encode())
            log('⏹ POST /api/stop')

        else:
            self.send_response(404)
            self.end_headers()

    def do_GET(self):
        path = urlparse(self.path).path

        if path == '/health':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'OK', 'version': '7.0'}).encode())
            log(f'✅ {path}')

        elif path == '/api/state':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(STATE).encode())
            log(f'✅ {path}')

        elif path == '/api/start':
            # Inicia robo em thread
            thread = threading.Thread(target=run_robo, daemon=True)
            thread.start()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'ok': True, 'msg': 'Robo iniciado'}).encode())
            log('🚀 /api/start')

        elif path == '/api/stop':
            STATE['status'] = 'STOPPED'
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'ok': True}).encode())
            log('⏹ /api/stop')

        else:
            self.send_response(404)
            self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def log_message(self, format, *args):
        pass  # Silenciar logs

def run_robo():
    """Versão simplificada do robo"""
    log('🤖 Robo iniciando...')
    STATE['status'] = 'RUNNING'

    try:
        # Simulação de 3 ciclos rápidos pra demo
        for ciclo in range(1, 4):
            if STATE['status'] != 'RUNNING':
                break

            STATE['ciclo'] = ciclo
            log(f'CICLO {ciclo}')

            # Simula timing
            time.sleep(5)

            # Simula aposta e resultado
            resultado = 'GANHOU' if ciclo % 2 == 0 else 'PERDEU'
            diferenca = 1.0 if ciclo % 2 == 0 else -1.0

            STATE['saldo'] += diferenca
            STATE['historico'].append({'ciclo': ciclo, 'resultado': resultado})

            log(f'{resultado} - Saldo: {STATE["saldo"]}')

            if resultado == 'GANHOU':
                webbrowser.open('https://www.youtube.com/watch?v=Ocn2Py0NXaU')  # Vaca mugindo REAL

        STATE['status'] = 'IDLE'
        log('✅ Robo finalizado')

    except Exception as e:
        STATE['status'] = 'ERROR'
        log(f'❌ {str(e)}')

def run_server():
    log('═'*70)
    log('WILL SERVER MINIMAL v7.0')
    log('═'*70)

    with ReuseAddrTCPServer(('127.0.0.1', PORT), ServerHandler) as httpd:
        log(f'✅ Servidor rodando em http://127.0.0.1:{PORT}')
        log('Endpoints:')
        log('  GET  /health      — Health check')
        log('  GET  /api/state   — Estado atual')
        log('  GET  /api/start   — Iniciar robo')
        log('  GET  /api/stop    — Parar robo')

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            log()
            log('🛑 Servidor parado')

if __name__ == '__main__':
    run_server()

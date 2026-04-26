#!/usr/bin/env python3
"""
BRIDGE V2 — Proxy Professional pra V7
- Roda em localhost:5000 (porta pública)
- Roteia pra V7 em localhost:5555 (porta privada)
- Logging, health checks, retry logic
"""

import http.server
import socketserver
import json
import urllib.request
import urllib.error
from urllib.parse import urlparse, parse_qs
from datetime import datetime
from threading import Thread
import time

BRIDGE_PORT = 5000
V7_URL = 'http://127.0.0.1:5555'
MAX_RETRIES = 3
RETRY_DELAY_MS = 500

# Stats
STATS = {
    'requests': 0,
    'success': 0,
    'errors': 0,
    'last_v7_check': 0,
    'v7_healthy': False,
}

def log(msg):
    ts = datetime.now().strftime('%H:%M:%S.%f')[:-3]
    print(f'[{ts}] [BRIDGE V2] {msg}')

def check_v7_health():
    """Verifica se V7 tá online"""
    try:
        response = urllib.request.urlopen(f'{V7_URL}/health', timeout=2)
        STATS['v7_healthy'] = response.status == 200
        STATS['last_v7_check'] = int(time.time())
        if STATS['v7_healthy']:
            log('✅ V7 healthy')
        else:
            log('⚠️ V7 unhealthy')
    except Exception as e:
        STATS['v7_healthy'] = False
        log(f'❌ V7 offline: {str(e)[:50]}')

def proxy_request(method, path, body=None):
    """Roteia request pra V7 com retry"""
    url = f'{V7_URL}{path}'

    for attempt in range(MAX_RETRIES):
        try:
            if method == 'GET':
                response = urllib.request.urlopen(url, timeout=5)
            else:  # POST
                req = urllib.request.Request(
                    url,
                    data=body.encode() if body else None,
                    method=method,
                    headers={'Content-Type': 'application/json'}
                )
                response = urllib.request.urlopen(req, timeout=5)

            result = response.read().decode()
            STATS['success'] += 1
            log(f'✅ {method} {path} → 200')
            return 200, result

        except urllib.error.HTTPError as e:
            log(f'⚠️ {method} {path} → {e.code}')
            return e.code, e.read().decode()

        except Exception as e:
            if attempt < MAX_RETRIES - 1:
                log(f'⏱️ Retry {attempt + 1}/{MAX_RETRIES} ({RETRY_DELAY_MS}ms)...')
                time.sleep(RETRY_DELAY_MS / 1000)
            else:
                log(f'❌ {method} {path} → {str(e)[:50]}')
                STATS['errors'] += 1
                return 503, json.dumps({'ok': False, 'error': str(e)}).encode()

    return 503, json.dumps({'ok': False, 'error': 'Max retries exceeded'}).encode()

class BridgeHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        path = urlparse(self.path).path
        STATS['requests'] += 1

        # Bridge health
        if path == '/bridge/health':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            data = {
                'bridge': 'V2',
                'status': 'OK',
                'v7_healthy': STATS['v7_healthy'],
                'requests': STATS['requests'],
                'success': STATS['success'],
                'errors': STATS['errors'],
            }
            self.wfile.write(json.dumps(data).encode())
            log(f'📊 /bridge/health')
            return

        # Proxy outros requests pra V7
        status, response = proxy_request('GET', path)
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(response.encode() if isinstance(response, str) else response)

    def do_POST(self):
        path = urlparse(self.path).path
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length).decode() if content_length > 0 else None

        STATS['requests'] += 1

        # Proxy pra V7
        status, response = proxy_request('POST', path, body)
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(response.encode() if isinstance(response, str) else response)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def log_message(self, format, *args):
        pass  # Silenciar logs default

class ReuseAddrTCPServer(socketserver.TCPServer):
    allow_reuse_address = True

def health_monitor():
    """Monitora V7 periodicamente"""
    while True:
        time.sleep(5)
        check_v7_health()

def run_bridge():
    print()
    print('═'*70)
    print('BRIDGE V2 — Proxy Professional')
    print('═'*70)
    print()
    print(f'🌉 Bridge rodando em: http://127.0.0.1:{BRIDGE_PORT}')
    print(f'🔗 Roteia pra V7 em: {V7_URL}')
    print()
    print('Endpoints:')
    print(f'  GET  http://127.0.0.1:{BRIDGE_PORT}/bridge/health')
    print(f'  GET  http://127.0.0.1:{BRIDGE_PORT}/health (proxy → V7)')
    print(f'  GET  http://127.0.0.1:{BRIDGE_PORT}/api/state (proxy → V7)')
    print(f'  POST http://127.0.0.1:{BRIDGE_PORT}/api/start (proxy → V7)')
    print(f'  POST http://127.0.0.1:{BRIDGE_PORT}/api/stop (proxy → V7)')
    print()
    print('═'*70)
    print()

    # Monitor em thread
    monitor_thread = Thread(target=health_monitor, daemon=True)
    monitor_thread.start()

    # Check V7 logo
    check_v7_health()

    try:
        with ReuseAddrTCPServer(('127.0.0.1', BRIDGE_PORT), BridgeHandler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        log('🛑 Bridge parado')

if __name__ == '__main__':
    run_bridge()

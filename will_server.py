#!/usr/bin/env python3
from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import subprocess
import os
from datetime import datetime
import threading
import time

logging_in = {}

def log(tag, msg):
    ts = datetime.now().strftime('%H:%M:%S')
    print(f'[{ts}][{tag}] {msg}')

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            diego_session = os.path.exists('/Users/diego/dev/ruptur-cloud/betboom_session_diego.json')
            leticia_session = os.path.exists('/Users/diego/dev/ruptur-cloud/betboom_session_leticia.json')
            
            diego_logging = logging_in.get('diego', False)
            leticia_logging = logging_in.get('leticia', False)
            
            self.send_response(200)
            self.send_header('Content-type', 'text/html; charset=utf-8')
            self.end_headers()
            
            html = f"""
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Will Hybrid Bot</title>
    <style>
        * {{ box-sizing: border-box; margin: 0; padding: 0; }}
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
            color: #fff;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }}
        .container {{ max-width: 500px; width: 100%; }}
        .card {{
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }}
        .logo {{
            text-align: center;
            margin-bottom: 30px;
        }}
        .logo h1 {{
            font-size: 32px;
            margin-bottom: 5px;
        }}
        .logo p {{
            color: #888;
            font-size: 13px;
        }}
        
        .account {{
            background: #0f0f0f;
            border: 1px solid #333;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
        }}
        
        .account-header {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }}
        
        .account-name {{
            font-size: 14px;
            color: #aaa;
        }}
        
        .status {{
            display: inline-block;
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
        }}
        
        .status-ok {{
            background: #00aa00;
            color: #fff;
        }}
        
        .status-waiting {{
            background: #ffaa00;
            color: #000;
            animation: pulse 1s infinite;
        }}
        
        .status-empty {{
            background: #ff4444;
            color: #fff;
        }}
        
        @keyframes pulse {{
            0%, 100% {{ opacity: 1; }}
            50% {{ opacity: 0.6; }}
        }}
        
        .message {{
            font-size: 12px;
            color: #ffdd00;
            background: #3a3a00;
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 15px;
            border-left: 3px solid #ffaa00;
        }}
        
        .button {{
            width: 100%;
            padding: 12px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }}
        
        .btn-login {{
            background: #ff6600;
            color: #fff;
        }}
        .btn-login:hover {{ background: #ff7722; }}
        .btn-login:disabled {{ background: #666; cursor: not-allowed; }}
        
        .btn-run {{
            background: #00aa00;
            color: #fff;
        }}
        .btn-run:hover {{ background: #00dd00; }}
        .btn-run:disabled {{ background: #666; cursor: not-allowed; }}
        
        .divider {{
            height: 1px;
            background: #333;
            margin: 20px 0;
        }}
        
        .footer {{
            text-align: center;
            font-size: 12px;
            color: #666;
            margin-top: 20px;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="logo">
                <h1>⚡ Will Bot</h1>
                <p>Automação Bac Bo</p>
            </div>
            
            <!-- DIEGO -->
            <div class="account">
                <div class="account-header">
                    <span class="account-name">👤 diegoizac@gmail.com</span>
                    <span class="status {'status-waiting' if diego_logging else ('status-ok' if diego_session else 'status-empty')}">
                        {'⏳ Logando...' if diego_logging else ('✅ Pronto' if diego_session else '❌ Sem acesso')}
                    </span>
                </div>
                
                {f'<div class="message">📍 Navegador aberto! Faça login (vai salvar em 120s)</div>' if diego_logging else ''}
                
                <button class="button btn-login" onclick="login('diego')" {'disabled' if diego_logging else ''} style="{'display:none' if diego_session else ''}">
                    🔓 Fazer Login
                </button>
                
                <button class="button btn-run" onclick="rodarRobot('diego')" {'' if diego_session else 'disabled'} style="{'display:none' if diego_logging else ''}">
                    🚀 Rodar Robot
                </button>
            </div>
            
            <div class="divider"></div>
            
            <!-- LETICIA -->
            <div class="account">
                <div class="account-header">
                    <span class="account-name">👤 leticiavoglcosta@gmail.com</span>
                    <span class="status {'status-waiting' if leticia_logging else ('status-ok' if leticia_session else 'status-empty')}">
                        {'⏳ Logando...' if leticia_logging else ('✅ Pronto' if leticia_session else '❌ Sem acesso')}
                    </span>
                </div>
                
                {f'<div class="message">📍 Navegador aberto! Faça login (vai salvar em 120s)</div>' if leticia_logging else ''}
                
                <button class="button btn-login" onclick="login('leticia')" {'disabled' if leticia_logging else ''} style="{'display:none' if leticia_session else ''}">
                    🔓 Fazer Login
                </button>
                
                <button class="button btn-run" onclick="rodarRobot('leticia')" {'' if leticia_session else 'disabled'} style="{'display:none' if leticia_logging else ''}">
                    🚀 Rodar Robot
                </button>
            </div>
            
            <div class="footer">
                Server rodando • localhost:9999
            </div>
        </div>
    </div>
    
    <script>
        function login(conta) {{
            fetch(`/api/login/${{conta}}`)
                .then(r => r.json())
                .then(d => {{
                    console.log(d.message);
                    // Recarrega a cada 10 segundos para verificar se terminou
                    setTimeout(() => location.reload(), 10000);
                }})
                .catch(e => alert('Erro: ' + e.message));
        }}
        
        function rodarRobot(conta) {{
            fetch(`/api/robot/${{conta}}`)
                .then(r => r.json())
                .then(d => alert(d.message || 'Robot iniciado!'))
                .catch(e => alert('Erro: ' + e.message));
        }}
    </script>
</body>
</html>
"""
            self.wfile.write(html.encode())
        
        elif self.path.startswith('/api/login/'):
            conta = self.path.split('/')[-1]
            self.handle_login(conta)
        
        elif self.path.startswith('/api/robot/'):
            conta = self.path.split('/')[-1]
            self.handle_robot(conta)
    
    def handle_login(self, conta):
        base_path = '/Users/diego/dev/ruptur-cloud'
        
        logging_in[conta] = True
        script = f'save_session_{conta}.py'
        
        # Inicia o script de login em background
        subprocess.Popen(['python3', f'{base_path}/{script}'])
        log('LOGIN', f'Abrindo navegador para {conta}')
        
        # Responde imediatamente
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({
            "message": f"Navegador aberto! Faça login e aguarde 120s para salvar..."
        }).encode())
        
        # Verifica a cada 10s se a sessão foi salva
        def check_session():
            for i in range(24):  # 240 segundos = 4 minutos
                time.sleep(10)
                session_file = f'{base_path}/betboom_session_{conta}.json'
                if os.path.exists(session_file):
                    logging_in[conta] = False
                    log('LOGIN', f'Sessão {conta} salva!')
                    return
            logging_in[conta] = False
        
        threading.Thread(target=check_session, daemon=True).start()
    
    def handle_robot(self, conta):
        base_path = '/Users/diego/dev/ruptur-cloud'
        
        session_file = f'{base_path}/betboom_session_{conta}.json'
        if not os.path.exists(session_file):
            self.send_response(400)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "error": f"Sessão de {conta} não encontrada"
            }).encode())
            return
        
        subprocess.Popen(['python3', f'{base_path}/will_robot_hybrid.py', conta])
        log('ROBOT', f'Robot {conta} iniciado')
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({
            "message": f"🚀 Robot {conta} em execução! Clique [GO] na extensão"
        }).encode())
    
    def log_message(self, format, *args):
        pass

log('SERVER', '⚡ Will Bot Server iniciando...')
log('SERVER', '✅ Acesse: http://localhost:9999')

server = HTTPServer(('localhost', 9999), Handler)

try:
    server.serve_forever()
except KeyboardInterrupt:
    log('SERVER', '⏹ Servidor parado')

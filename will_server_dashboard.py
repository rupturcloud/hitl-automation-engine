#!/usr/bin/env python3
from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import subprocess
import os
from datetime import datetime
import time

# Armazena estado dos scripts
saving_state = {}

def log(tag, msg):
    ts = datetime.now().strftime('%H:%M:%S')
    print(f'[{ts}][{tag}] {msg}')

class DashboardHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'text/html; charset=utf-8')
            self.end_headers()
            
            diego_session = os.path.exists('/Users/diego/dev/ruptur-cloud/betboom_session_diego.json')
            leticia_session = os.path.exists('/Users/diego/dev/ruptur-cloud/betboom_session_leticia.json')
            
            diego_saving = saving_state.get('diego', False)
            leticia_saving = saving_state.get('leticia', False)
            
            html = f"""
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Will Hybrid Bot - Dashboard</title>
    <style>
        * {{ box-sizing: border-box; margin: 0; padding: 0; }}
        body {{ 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #0f0f0f;
            color: #fff;
            padding: 20px;
        }}
        .container {{ max-width: 1000px; margin: 0 auto; }}
        header {{ 
            background: #1a1a1a;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #00aa00;
            margin-bottom: 30px;
        }}
        h1 {{ font-size: 28px; margin-bottom: 5px; }}
        
        .section {{
            background: #1a1a1a;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }}
        .section h2 {{
            font-size: 18px;
            margin-bottom: 15px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
        }}
        
        .account-card {{
            background: #0a0a0a;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 15px;
            border: 1px solid #333;
        }}
        
        .account-header {{
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid #333;
        }}
        
        .account-name {{
            font-size: 16px;
            font-weight: 600;
        }}
        
        .status-badge {{
            display: inline-block;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
        }}
        .status-ok {{ background: #00aa00; color: #fff; }}
        .status-missing {{ background: #ff4444; color: #fff; }}
        .status-saving {{ background: #ffaa00; color: #000; }}
        
        .button-group {{
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            align-items: center;
        }}
        
        button {{
            padding: 12px 20px;
            font-size: 14px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            text-align: center;
            font-weight: 500;
            transition: all 0.3s;
        }}
        
        .btn-save {{
            background: #ff6600;
            color: #fff;
        }}
        .btn-save:hover {{ background: #ff7722; }}
        .btn-save:disabled {{ background: #666; cursor: not-allowed; }}
        
        .btn-confirm {{
            background: #00aa00;
            color: #fff;
            animation: pulse 1s infinite;
        }}
        .btn-confirm:hover {{ background: #00dd00; }}
        
        .btn-run {{
            background: #00aa00;
            color: #fff;
        }}
        .btn-run:hover {{ background: #00dd00; }}
        .btn-run:disabled {{ background: #666; cursor: not-allowed; }}
        
        @keyframes pulse {{
            0%, 100% {{ opacity: 1; }}
            50% {{ opacity: 0.7; }}
        }}
        
        .saving-message {{
            padding: 10px 15px;
            background: #3a3a00;
            border-left: 4px solid #ffaa00;
            border-radius: 4px;
            font-size: 13px;
            color: #ffdd00;
        }}
        
        .log-area {{
            background: #0a0a0a;
            padding: 15px;
            border-radius: 6px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            color: #0f0;
            max-height: 200px;
            overflow-y: auto;
            line-height: 1.4;
        }}
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>⚡ Will Hybrid Bot Dashboard</h1>
            <p style="color: #888; font-size: 14px;">🟢 Server rodando em localhost:9999</p>
        </header>
        
        <!-- DIEGO -->
        <div class="section">
            <h2>👤 Conta Diego</h2>
            
            <div class="account-card">
                <div class="account-header">
                    <span class="account-name">diegoizac@gmail.com</span>
                    <span class="status-badge {'status-saving' if diego_saving else ('status-ok' if diego_session else 'status-missing')}">
                        {'⏳ Salvando...' if diego_saving else ('✅ Sessão Salva' if diego_session else '❌ Sem Sessão')}
                    </span>
                </div>
                
                {f'<div class="saving-message">📍 Navegador aberto! Faça login e clique "Confirmar" quando terminar</div>' if diego_saving else ''}
                
                <div class="button-group">
                    <button class="btn-save" onclick="salvar('diego')" {'disabled' if diego_saving else ''}>
                        💾 {'Atualizar' if diego_session else 'Salvar'} Sessão
                    </button>
                    {f'<button class="btn-confirm" onclick="confirmar('diego')">✅ Confirmar Sessão</button>' if diego_saving else ''}
                    <button class="btn-run" onclick="executar('robot_diego')" {'' if diego_session else 'disabled'}>
                        🚀 Rodar Robot
                    </button>
                </div>
            </div>
        </div>
        
        <!-- LETICIA -->
        <div class="section">
            <h2>👤 Conta Leticia</h2>
            
            <div class="account-card">
                <div class="account-header">
                    <span class="account-name">leticiavoglcosta@gmail.com</span>
                    <span class="status-badge {'status-saving' if leticia_saving else ('status-ok' if leticia_session else 'status-missing')}">
                        {'⏳ Salvando...' if leticia_saving else ('✅ Sessão Salva' if leticia_session else '❌ Sem Sessão')}
                    </span>
                </div>
                
                {f'<div class="saving-message">📍 Navegador aberto! Faça login e clique "Confirmar" quando terminar</div>' if leticia_saving else ''}
                
                <div class="button-group">
                    <button class="btn-save" onclick="salvar('leticia')" {'disabled' if leticia_saving else ''}>
                        💾 {'Atualizar' if leticia_session else 'Salvar'} Sessão
                    </button>
                    {f'<button class="btn-confirm" onclick="confirmar('leticia')">✅ Confirmar Sessão</button>' if leticia_saving else ''}
                    <button class="btn-run" onclick="executar('robot_leticia')" {'' if leticia_session else 'disabled'}>
                        🚀 Rodar Robot
                    </button>
                </div>
            </div>
        </div>
        
        <!-- STATUS -->
        <div class="section">
            <h2>📊 Status</h2>
            <div class="log-area" id="log">
                [INIT] Dashboard ativo...
            </div>
        </div>
    </div>
    
    <script>
        function salvar(conta) {{
            addLog(`▶️  Abrindo navegador para ${{conta.toUpperCase()}}...`);
            fetch(`/api/salvar_${{conta}}`)
                .then(r => r.json())
                .then(d => {{
                    addLog('✅ ' + d.message);
                    setTimeout(() => location.reload(), 1000);
                }})
                .catch(e => addLog('❌ Erro: ' + e.message));
        }}
        
        function confirmar(conta) {{
            addLog(`💾 Salvando sessão de ${{conta.toUpperCase()}}...`);
            fetch(`/api/confirmar_${{conta}}`)
                .then(r => r.json())
                .then(d => {{
                    addLog('✅ ' + d.message);
                    setTimeout(() => location.reload(), 1500);
                }})
                .catch(e => addLog('❌ Erro: ' + e.message));
        }}
        
        function executar(acao) {{
            const acoes = {{
                'robot_diego': 'Iniciando robot Diego...',
                'robot_leticia': 'Iniciando robot Leticia...'
            }};
            addLog('▶️  ' + acoes[acao]);
            fetch(`/api/${{acao}}`)
                .then(r => r.json())
                .then(d => addLog('✅ ' + d.message))
                .catch(e => addLog('❌ Erro: ' + e.message));
        }}
        
        function addLog(msg) {{
            const log = document.getElementById('log');
            const ts = new Date().toLocaleTimeString();
            log.innerHTML += `<div>[${{ts}}] ${{msg}}</div>`;
            log.scrollTop = log.scrollHeight;
        }}
    </script>
</body>
</html>
"""
            self.wfile.write(html.encode())
            
        elif self.path.startswith('/api/'):
            action = self.path.split('/')[-1]
            response = self.handle_api_call(action)
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode())
    
    def handle_api_call(self, action):
        base_path = '/Users/diego/dev/ruptur-cloud'
        
        if action == 'salvar_diego':
            saving_state['diego'] = True
            subprocess.Popen(['python3', f'{base_path}/save_session_diego.py'])
            log('API', 'save_session_diego.py iniciado')
            return {"message": "Navegador aberto! Faça login e clique 'Confirmar' quando terminar"}
        
        elif action == 'salvar_leticia':
            saving_state['leticia'] = True
            subprocess.Popen(['python3', f'{base_path}/save_session_leticia.py'])
            log('API', 'save_session_leticia.py iniciado')
            return {"message": "Navegador aberto! Faça login e clique 'Confirmar' quando terminar"}
        
        elif action == 'confirmar_diego':
            saving_state['diego'] = False
            log('API', 'Sessão Diego confirmada')
            return {"message": "Sessão Diego salva com sucesso!"}
        
        elif action == 'confirmar_leticia':
            saving_state['leticia'] = False
            log('API', 'Sessão Leticia confirmada')
            return {"message": "Sessão Leticia salva com sucesso!"}
        
        elif action == 'robot_diego':
            subprocess.Popen(['python3', f'{base_path}/will_robot_hybrid.py', 'diego'])
            log('API', 'robot diego iniciado')
            return {"message": "Robot Diego em execução! Clique [GO] na extensão"}
        
        elif action == 'robot_leticia':
            subprocess.Popen(['python3', f'{base_path}/will_robot_hybrid.py', 'leticia'])
            log('API', 'robot leticia iniciado')
            return {"message": "Robot Leticia em execução! Clique [GO] na extensão"}
        
        return {"message": "❌ Ação inválida"}
    
    def log_message(self, format, *args):
        pass

log('DASHBOARD', '🌐 Iniciando Will Hybrid Bot Dashboard')
log('DASHBOARD', '✅ Acesse: http://localhost:9999')

server = HTTPServer(('localhost', 9999), DashboardHandler)

try:
    server.serve_forever()
except KeyboardInterrupt:
    log('DASHBOARD', '⏹ Servidor parado')

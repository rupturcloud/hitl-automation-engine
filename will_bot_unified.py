#!/usr/bin/env python3
"""
Will Bot - Unified Experience
Um comando, tudo integrado. Simples como Claude Code.
"""
import sys
import os
import json
import threading
from http.server import HTTPServer, BaseHTTPRequestHandler
from seleniumbase import SB
from datetime import datetime
import time
import subprocess

class Config:
    def __init__(self, usuario):
        self.usuario = usuario
        self.base_path = '/Users/diego/dev/ruptur-cloud'
        self.profile_dir = os.path.expanduser(f'~/.selenium_profile_{usuario}')
        self.session_file = f'{self.base_path}/betboom_session_{usuario}.json'
        self.extension_path = f'{self.base_path}/will-extension-hybrid'
        self.porta = 9999
        
        os.makedirs(self.profile_dir, exist_ok=True)

def log(msg):
    ts = datetime.now().strftime('%H:%M:%S')
    print(f'[{ts}] {msg}')

class ServerHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/start':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "OK"}).encode())
            log('✅ [GO] acionado na extensão!')
        else:
            self.send_response(404)
            self.end_headers()
    
    def log_message(self, format, *args):
        pass

def rodar_server(config):
    """Roda servidor HTTP em background"""
    try:
        server = HTTPServer(('localhost', config.porta), ServerHandler)
        log(f'🌐 Server HTTP pronto (localhost:{config.porta})')
        server.serve_forever()
    except Exception as e:
        log(f'❌ Erro no server: {e}')

def main(usuario):
    config = Config(usuario)
    
    # Inicia server em thread background
    server_thread = threading.Thread(target=rodar_server, args=(config,), daemon=True)
    server_thread.start()
    time.sleep(1)  # Aguarda server iniciar
    
    log('🤖 Will Bot - Experiência Unificada')
    log('')
    
    # Verifica se já tem sessão salva
    has_session = os.path.exists(config.session_file)
    
    if has_session:
        log(f'✅ Sessão {usuario} encontrada!')
        log('📍 Abrindo BetBoom com sessão salva...')
    else:
        log(f'📝 Primeira vez? Vamos criar sua sessão!')
        log('👉 Você terá 120 segundos para fazer login')
    
    log('')
    
    try:
        with SB(uc=True, headless=False, block_images=False, user_data_dir=config.profile_dir) as sb:
            log(f'✅ Navegador aberto com extensão!')
            log(f'📍 Abrindo BetBoom...')
            
            sb.open('https://betboom.bet.br')
            
            if not has_session:
                log('')
                log('╔════════════════════════════════════════╗')
                log('║  FAÇA LOGIN COM SUA CONTA               ║')
                log('║  ⏳ Você tem 120 SEGUNDOS               ║')
                log('║  Sessão será salva automaticamente      ║')
                log('╚════════════════════════════════════════╝')
                log('')
                
                time.sleep(120)
                
                log('✅ SALVANDO SESSÃO...')
                cookies = sb.get_cookies()
                
                with open(config.session_file, 'w') as f:
                    json.dump(cookies, f, indent=2)
                
                log(f'✅ {len(cookies)} cookies salvos!')
                log('')
            
            log('╔════════════════════════════════════════╗')
            log('║  ✅ PRONTO PARA RODAR!                  ║')
            log('║                                        ║')
            log('║  Clique [GO] na extensão               ║')
            log('║  (ícone no canto superior direito)     ║')
            log('║                                        ║')
            log('║  Robot começará automaticamente        ║')
            log('╚════════════════════════════════════════╝')
            log('')
            log('⏳ Deixe o navegador aberto enquanto o robot executa...')
            log('   Pressione Ctrl+C no terminal para parar')
            log('')
            
            # Mantém aberto enquanto usuário usa
            try:
                while True:
                    time.sleep(1)
            except KeyboardInterrupt:
                log('\n⏹ Encerrando...')
                log('✅ Sessão salva! Próxima vez será mais rápido.')
    
    except Exception as e:
        log(f'❌ Erro: {e}')
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('❌ Use: python3 will_bot_unified.py <usuario>\n')
        print('Exemplos:')
        print('   python3 will_bot_unified.py diego')
        print('   python3 will_bot_unified.py leticia\n')
        sys.exit(1)
    
    usuario = sys.argv[1].lower()
    
    if not usuario.isalnum():
        print(f'❌ Nome inválido: "{usuario}"\n')
        sys.exit(1)
    
    try:
        main(usuario)
    except KeyboardInterrupt:
        print('\n\n✅ Até logo!')
        sys.exit(0)

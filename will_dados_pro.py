#!/usr/bin/env python3
"""
Will Dados Pro - Automação Bac Bo
Um comando. Tudo resolvido aqui dentro.
Sessão salva automaticamente.
"""
import sys
import os
import json
import threading
import time
import subprocess
from http.server import HTTPServer, BaseHTTPRequestHandler
from seleniumbase import SB
from datetime import datetime

BASE_PATH = '/Users/diego/dev/ruptur-cloud'
USUARIOS_FILE = f'{BASE_PATH}/.usuarios'

# Estado do robot (compartilhado entre threads)
class RobotState:
    def __init__(self):
        self.running = False
        self.timer = 0
        self.max_timer = 60
        self.drive_state = 'idle'  # idle, detecting, betting, waiting, win, loss, gale
        self.wins = 0
        self.losses = 0
        self.balance = 0
        self.pnl = 0
        self.history = []  # últimos 10 resultados
        self.lock = threading.Lock()

    def update(self, **kwargs):
        with self.lock:
            for key, value in kwargs.items():
                if hasattr(self, key):
                    setattr(self, key, value)

    def to_dict(self):
        with self.lock:
            return {
                'running': self.running,
                'timer': self.timer,
                'maxTimer': self.max_timer,
                'state': self.drive_state,
                'wins': self.wins,
                'losses': self.losses,
                'balance': self.balance,
                'pnl': self.pnl,
                'history': self.history,
            }

robot_state = RobotState()

# Variáveis globais
sb_global = None
session_file_global = None
usuario_global = None
auto_save_ativo = False

def log(msg):
    ts = datetime.now().strftime('%H:%M:%S')
    print(f'[{ts}] {msg}')

def limpar_tela():
    os.system('clear')

class ServerHandler(BaseHTTPRequestHandler):
    usuario = None  # Atributo da classe

    def do_POST(self):
        global robot_state

        if self.path == '/start':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "OK"}).encode())

            if self.usuario and not robot_state.running:
                robot_state.running = True
                log('✅ [GO] acionado!')
                log('🚀 Executando robot...')
                subprocess.Popen(['python3', f'{BASE_PATH}/will_robot_hybrid.py', self.usuario])

        elif self.path == '/stop':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "stopped"}).encode())

            robot_state.running = False
            log('⏹ Robot parado')

    def do_GET(self):
        global robot_state

        if self.path == '/sync':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(robot_state.to_dict()).encode())
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        pass

def iniciar_server(usuario):
    """Inicia servidor com usuario definido"""
    try:
        ServerHandler.usuario = usuario  # Define o usuário na classe
        server = HTTPServer(('localhost', 9999), ServerHandler)
        server.serve_forever()
    except:
        pass

def auto_salvar_sessao():
    """Salva sessão automaticamente a cada 30 segundos"""
    global sb_global, session_file_global, auto_save_ativo
    
    while auto_save_ativo:
        try:
            if sb_global and session_file_global:
                cookies = sb_global.get_cookies()
                with open(session_file_global, 'w') as f:
                    json.dump(cookies, f, indent=2)
                log('💾 Sessão salva automaticamente')
        except:
            pass
        
        time.sleep(30)

def carregar_usuarios():
    if os.path.exists(USUARIOS_FILE):
        with open(USUARIOS_FILE, 'r') as f:
            return json.load(f)
    return {}

def salvar_usuarios(usuarios):
    with open(USUARIOS_FILE, 'w') as f:
        json.dump(usuarios, f, indent=2)

def criar_usuario(nome):
    usuarios = carregar_usuarios()
    
    if nome in usuarios:
        return True
    
    profile_dir = os.path.expanduser(f'~/.selenium_profile_{nome}')
    os.makedirs(profile_dir, exist_ok=True)
    
    usuarios[nome] = {
        'criado': datetime.now().isoformat(),
        'profile': profile_dir,
        'sessao': f'{BASE_PATH}/betboom_session_{nome}.json'
    }
    
    salvar_usuarios(usuarios)
    return True

def rodar_bot(usuario, config):
    """Executa o bot para um usuário"""
    
    global sb_global, session_file_global, auto_save_ativo
    
    profile_dir = config['profile']
    session_file = config['sessao']
    has_session = os.path.exists(session_file)
    
    # Inicia server com usuario
    server_thread = threading.Thread(target=iniciar_server, args=(usuario,), daemon=True)
    server_thread.start()
    time.sleep(0.5)
    
    log('🌐 Server pronto (localhost:9999)')
    
    extension_path = f'{BASE_PATH}/will-extension-hybrid'
    
    if not os.path.exists(extension_path):
        print('❌ Extensão não encontrada!')
        return
    
    print()
    
    try:
        with SB(uc=True, headless=False, block_images=False, user_data_dir=profile_dir) as sb:
            
            sb_global = sb
            session_file_global = session_file
            auto_save_ativo = True
            
            # Inicia thread de auto-save
            save_thread = threading.Thread(target=auto_salvar_sessao, daemon=True)
            save_thread.start()
            
            log('✅ Navegador aberto')
            log('📍 Abrindo BetBoom...')
            
            sb.open('https://betboom.bet.br')
            
            print()
            
            if not has_session:
                print('╔════════════════════════════════════════╗')
                print('║  FAÇA LOGIN COM SUA CONTA              ║')
                print('║  ⏳ Você tem 120 SEGUNDOS              ║')
                print('║  Sessão será salva automaticamente     ║')
                print('╚════════════════════════════════════════╝')
                print()
                
                log('⏳ Aguardando login...')
                time.sleep(120)
                
                log('✅ SALVANDO SESSÃO...')
                cookies = sb.get_cookies()
                
                with open(session_file, 'w') as f:
                    json.dump(cookies, f, indent=2)
                
                log(f'✅ {len(cookies)} cookies salvos!')
            else:
                log('✅ Sessão carregada')
            
            print()
            print('╔════════════════════════════════════════╗')
            print('║  ✅ PRONTO!                            ║')
            print('║                                        ║')
            print('║  Clique [GO] na extensão              ║')
            print('║  (canto superior direito)              ║')
            print('║                                        ║')
            print('║  Robot será executado automaticamente  ║')
            print('║                                        ║')
            print('║  💾 Sessão salva a cada 30 segundos    ║')
            print('╚════════════════════════════════════════╝')
            print()
            log('⏳ Deixe o navegador aberto...')
            log('   Ctrl+C para sair')
            print()
            
            try:
                while True:
                    time.sleep(1)
            except KeyboardInterrupt:
                print()
                print()
                auto_save_ativo = False
                log('✅ Encerrando...')
                log('✅ Sessão final salva!')
                print()
    
    except Exception as e:
        print(f'\n❌ Erro: {e}')
        auto_save_ativo = False

def main():
    limpar_tela()
    
    print('\n')
    print('╔════════════════════════════════════════╗')
    print('║   ⚡ WILL DADOS PRO - Bac Bo Bot      ║')
    print('╚════════════════════════════════════════╝')
    print()
    
    usuarios = carregar_usuarios()
    
    if usuarios:
        print(f'📋 Usuários salvos:\n')
        
        for i, (nome, info) in enumerate(usuarios.items(), 1):
            print(f'   {i}. {nome}')
        
        print()
        escolha = input('Usar um desses? (1-' + str(len(usuarios)) + ') ou [s] para Onboarding novo: ').strip()
        
        if escolha.lower() == 's':
            usuario = input('\nDigite o nome do novo usuário: ').strip().lower()
            if not usuario or not usuario.isalnum():
                print('❌ Nome inválido!')
                return
            
            print(f'\n✅ Criando {usuario}...\n')
            criar_usuario(usuario)
            usuarios = carregar_usuarios()
            rodar_bot(usuario, usuarios[usuario])
        
        else:
            try:
                opcao = int(escolha)
                nomes = list(usuarios.keys())
                if 1 <= opcao <= len(usuarios):
                    usuario = nomes[opcao - 1]
                    print(f'\n✅ Usando {usuario}...\n')
                    rodar_bot(usuario, usuarios[usuario])
                else:
                    print('❌ Opção inválida!')
            except:
                print('❌ Opção inválida!')
    
    else:
        print('👋 Primeira vez? Vamos fazer seu onboarding!\n')
        
        usuario = input('Digite seu nome: ').strip().lower()
        
        if not usuario or not usuario.isalnum():
            print('❌ Nome inválido!')
            return
        
        print(f'\n✅ Criando {usuario}...\n')
        criar_usuario(usuario)
        usuarios = carregar_usuarios()
        rodar_bot(usuario, usuarios[usuario])

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('\n✅ Até logo!')
        sys.exit(0)

#!/usr/bin/env python3
import sys
import json
import os
from datetime import datetime

def criar_usuario(nome_usuario):
    base_path = '/Users/diego/dev/ruptur-cloud'
    usuarios_file = f'{base_path}/usuarios.json'
    
    if os.path.exists(usuarios_file):
        with open(usuarios_file, 'r') as f:
            usuarios = json.load(f)
    else:
        usuarios = {}
    
    if nome_usuario in usuarios:
        print(f'❌ Usuário "{nome_usuario}" já existe!')
        return False
    
    profile_dir = os.path.expanduser(f'~/.selenium_profile_{nome_usuario}')
    os.makedirs(profile_dir, exist_ok=True)
    
    script_content = '''#!/usr/bin/env python3
from seleniumbase import SB
import json
import os
from datetime import datetime
import time

USUARIO = "USER_NAME"
BASE_PATH = "BASE_PATH_VAL"
PROFILE_DIR = "PROFILE_DIR_VAL"

def log(msg):
    ts = datetime.now().strftime('%H:%M:%S')
    print(f'[{ts}][{USUARIO.upper()}] {msg}')

def main():
    log('🤖 Iniciando navegador...')
    
    extension_path = os.path.abspath(f'{BASE_PATH}/will-extension-hybrid')
    if not os.path.exists(extension_path):
        log('❌ Extensão não encontrada!')
        return
    
    try:
        with SB(uc=True, headless=False, block_images=False, user_data_dir=PROFILE_DIR) as sb:
            log('✅ Navegador aberto!')
            log('📍 Abrindo BetBoom...')
            sb.open('https://betboom.bet.br')
            
            log('')
            log('╔══════════════════════════════════════╗')
            log('║  FAÇA LOGIN COM SUA CONTA            ║')
            log('║  Sessão será salva automaticamente   ║')
            log('║  Aguardando 120 segundos...          ║')
            log('╚══════════════════════════════════════╝')
            log('')
            
            time.sleep(120)
            
            log('✅ SALVANDO SESSÃO...')
            cookies = sb.get_cookies()
            
            session_file = f'{BASE_PATH}/betboom_session_{USUARIO}.json'
            with open(session_file, 'w') as f:
                json.dump(cookies, f, indent=2)
            
            log(f'✅ {len(cookies)} cookies salvos')
            log('')
            log('╔══════════════════════════════════════╗')
            log('║  ✅ PRONTO PARA RODAR!               ║')
            log('║                                      ║')
            log('║  Clique [GO] na extensão            ║')
            log('║  Robot executará automaticamente!    ║')
            log('╚══════════════════════════════════════╝')
            log('')
            
            while True:
                time.sleep(1)
    
    except KeyboardInterrupt:
        log('⏹ Parado')
    except Exception as e:
        log(f'❌ Erro: {e}')

if __name__ == '__main__':
    main()
'''
    
    script_content = script_content.replace('USER_NAME', nome_usuario)
    script_content = script_content.replace('BASE_PATH_VAL', base_path)
    script_content = script_content.replace('PROFILE_DIR_VAL', profile_dir)
    
    bot_script = f'{base_path}/will_bot_{nome_usuario}.py'
    with open(bot_script, 'w') as f:
        f.write(script_content)
    os.chmod(bot_script, 0o755)
    
    usuarios[nome_usuario] = {
        'criado': datetime.now().isoformat(),
        'script': bot_script,
    }
    
    with open(usuarios_file, 'w') as f:
        json.dump(usuarios, f, indent=2)
    
    print(f'\n✅ Usuário "{nome_usuario}" criado!\n')
    print('═' * 50)
    print(f'  👤 {nome_usuario.upper()}')
    print('═' * 50)
    print(f'\n▶️  Para rodar:\n   python3 {bot_script}\n')
    print('📋 Fluxo:')
    print('   1. Roda o comando acima')
    print('   2. Navegador abre betboom')
    print('   3. Você faz login (120 segundos)')
    print('   4. Sessão salva automaticamente')
    print('   5. Clique [GO] na extensão')
    print('   6. Robot executa!\n')
    
    return True

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('❌ Use: python3 criar_usuario.py <nome>\n')
        exit(1)
    
    nome = sys.argv[1].lower()
    if not nome.isalnum():
        print(f'❌ Nome inválido\n')
        exit(1)
    
    criar_usuario(nome)

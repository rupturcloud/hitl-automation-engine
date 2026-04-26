#!/usr/bin/env python3
import os
import sys
import json
from datetime import datetime
import subprocess

BASE_PATH = '/Users/diego/dev/ruptur-cloud'
USUARIOS_FILE = f'{BASE_PATH}/usuarios.json'

def limpar_tela():
    os.system('clear')

def log_titulo(texto):
    print(f'\n{"=" * 50}')
    print(f'  {texto}')
    print(f'{"=" * 50}\n')

def pergunta(msg, default=None):
    if default:
        resp = input(f'{msg} [{default}]: ').strip() or default
    else:
        resp = input(f'{msg}: ').strip()
    return resp

def carregar_usuarios():
    if os.path.exists(USUARIOS_FILE):
        with open(USUARIOS_FILE, 'r') as f:
            return json.load(f)
    return {}

def salvar_usuarios(usuarios):
    with open(USUARIOS_FILE, 'w') as f:
        json.dump(usuarios, f, indent=2)

def criar_usuario_novo(nome):
    """Cria um novo usuário"""
    print(f'\n⏳ Criando usuário "{nome}"...\n')
    
    usuarios = carregar_usuarios()
    if nome in usuarios:
        print(f'⚠️  Usuário já existe!')
        return False
    
    profile_dir = os.path.expanduser(f'~/.selenium_profile_{nome}')
    os.makedirs(profile_dir, exist_ok=True)
    
    script_content = f'''#!/usr/bin/env python3
from seleniumbase import SB
import json
import os
from datetime import datetime
import time

USUARIO = "{nome}"
BASE_PATH = "{BASE_PATH}"
PROFILE_DIR = "{profile_dir}"

def log(msg):
    ts = datetime.now().strftime('%H:%M:%S')
    print(f'[{{ts}}][{{USUARIO.upper()}}] {{msg}}')

try:
    with SB(uc=True, headless=False, block_images=False, user_data_dir=PROFILE_DIR) as sb:
        log('🤖 Navegador aberto!')
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
        
        session_file = f'{{BASE_PATH}}/betboom_session_{{USUARIO}}.json'
        with open(session_file, 'w') as f:
            json.dump(cookies, f, indent=2)
        
        log(f'✅ {{len(cookies)}} cookies salvos')
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
    log(f'❌ Erro: {{e}}')
'''
    
    bot_script = f'{BASE_PATH}/will_bot_{nome}.py'
    with open(bot_script, 'w') as f:
        f.write(script_content)
    os.chmod(bot_script, 0o755)
    
    usuarios[nome] = {
        'criado': datetime.now().isoformat(),
        'script': bot_script,
    }
    salvar_usuarios(usuarios)
    
    print(f'✅ Usuário "{nome}" criado com sucesso!\n')
    return True

def main():
    limpar_tela()
    log_titulo('⚡ WILL BOT - WIZARD')
    
    print('Bem-vindo ao Will Bot!\n')
    print('Este é seu assistente para rodar o robot BetBoom.\n')
    
    usuarios = carregar_usuarios()
    
    if usuarios:
        print(f'Usuários existentes: {", ".join(usuarios.keys())}\n')
        novo = input('Quer criar um novo usuário? (s/n) [n]: ').strip().lower() or 'n'
        
        if novo == 's':
            nome = pergunta('Qual é seu nome?').lower()
            if not nome.isalnum():
                print('❌ Nome inválido! Use apenas letras e números.')
                return
            if not criar_usuario_novo(nome):
                return
        else:
            nome = pergunta('Qual usuário quer rodar?').lower()
            if nome not in usuarios:
                print(f'❌ Usuário "{nome}" não encontrado!')
                return
    else:
        print('📝 Vamos criar seu usuário!\n')
        nome = pergunta('Qual é seu nome?').lower()
        if not nome.isalnum():
            print('❌ Nome inválido!')
            return
        if not criar_usuario_novo(nome):
            return
    
    # Confirma antes de rodar
    limpar_tela()
    log_titulo('🚀 PRONTO PARA RODAR')
    
    print(f'Usuário: {nome}')
    print('\nQuando você rodar, vai:\n')
    print('1. ✅ Abrir um navegador com BetBoom')
    print('2. ✅ Você faz login (120 segundos)')
    print('3. ✅ Sessão salva automaticamente')
    print('4. ✅ Clica [GO] na extensão')
    print('5. ✅ Robot executa!\n')
    
    confirma = input('Quer rodar agora? (s/n) [s]: ').strip().lower() or 's'
    
    if confirma == 's':
        limpar_tela()
        print('\n🚀 Iniciando...\n')
        
        usuarios = carregar_usuarios()
        script = usuarios[nome]['script']
        
        print(f'Rodando: {script}\n')
        print('=' * 50)
        print()
        
        subprocess.run(['python3', script])
    else:
        print('\n✅ Tudo pronto! Execute quando quiser:')
        print(f'   python3 {BASE_PATH}/will_bot_{nome}.py\n')

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('\n\n⏹ Cancelado pelo usuário')
        sys.exit(0)
    except Exception as e:
        print(f'\n❌ Erro: {e}')
        sys.exit(1)

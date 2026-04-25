#!/usr/bin/env python3
from seleniumbase import SB
import json
import os
from datetime import datetime
import time

USUARIO = "leticia"
BASE_PATH = "/Users/diego/dev/ruptur-cloud"
PROFILE_DIR = "/Users/diego/.selenium_profile_leticia"

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

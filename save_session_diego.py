#!/usr/bin/env python3
from seleniumbase import SB
import json
import time
from datetime import datetime
import os

def log(tag, msg):
    ts = datetime.now().strftime('%H:%M:%S')
    print(f'[{ts}][{tag}] {msg}')

log('DIEGO', '🔐 SALVANDO SESSÃO - CONTA DIEGO')

profile_dir = os.path.expanduser('~/.selenium_profile_diego')
if not os.path.exists(profile_dir):
    os.makedirs(profile_dir, exist_ok=True)

try:
    with SB(uc=True, headless=False, block_images=False, user_data_dir=profile_dir) as sb:
        log('DIEGO', '✅ Navegador aberto!')
        log('DIEGO', '📍 Abrindo BetBoom...')
        sb.open('https://betboom.bet.br')
        
        log('DIEGO', '')
        log('DIEGO', '👤 FAÇA LOGIN COM CONTA DIEGO (diegoizac@gmail.com)')
        log('DIEGO', '⏳ Quando terminar de logar, pressione ENTER no terminal...')
        log('DIEGO', '')
        
        input('>>> Pressione ENTER quando tiver logado: ')
        
        log('DIEGO', '✅ SALVANDO SESSÃO...')
        cookies = sb.get_cookies()
        
        session_file = '/Users/diego/dev/ruptur-cloud/betboom_session_diego.json'
        with open(session_file, 'w') as f:
            json.dump(cookies, f, indent=2)
        
        log('DIEGO', f'✅ SESSÃO DIEGO SALVA!')
        log('DIEGO', f'✅ {len(cookies)} cookies gravados')
        log('DIEGO', f'📁 Arquivo: betboom_session_diego.json')
        log('DIEGO', '')
        log('DIEGO', '⏳ Fechando em 10 segundos...')
        time.sleep(10)

except Exception as e:
    log('ERROR', f'{e}')
    import traceback
    traceback.print_exc()

log('DIEGO', '✅ COMPLETO!')

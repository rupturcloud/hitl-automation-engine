#!/usr/bin/env python3
from seleniumbase import SB
import json
import time
from datetime import datetime
import os

def log(tag, msg):
    ts = datetime.now().strftime('%H:%M:%S')
    print(f'[{ts}][{tag}] {msg}')

log('LETICIA', '🔐 SALVANDO SESSÃO - CONTA LETICIA')

profile_dir = os.path.expanduser('~/.selenium_profile_leticia')
if not os.path.exists(profile_dir):
    os.makedirs(profile_dir, exist_ok=True)

try:
    with SB(uc=True, headless=False, block_images=False, user_data_dir=profile_dir) as sb:
        log('LETICIA', '✅ Navegador aberto!')
        log('LETICIA', '📍 Abrindo BetBoom...')
        sb.open('https://betboom.bet.br')
        
        log('LETICIA', '')
        log('LETICIA', '👤 FAÇA LOGIN COM CONTA LETICIA (leticiavoglcosta@gmail.com)')
        log('LETICIA', '⏳ Quando terminar de logar, pressione ENTER no terminal...')
        log('LETICIA', '')
        
        input('>>> Pressione ENTER quando tiver logado: ')
        
        log('LETICIA', '✅ SALVANDO SESSÃO...')
        cookies = sb.get_cookies()
        
        session_file = '/Users/diego/dev/ruptur-cloud/betboom_session_leticia.json'
        with open(session_file, 'w') as f:
            json.dump(cookies, f, indent=2)
        
        log('LETICIA', f'✅ SESSÃO LETICIA SALVA!')
        log('LETICIA', f'✅ {len(cookies)} cookies gravados')
        log('LETICIA', f'📁 Arquivo: betboom_session_leticia.json')
        log('LETICIA', '')
        log('LETICIA', '⏳ Fechando em 10 segundos...')
        time.sleep(10)

except Exception as e:
    log('ERROR', f'{e}')
    import traceback
    traceback.print_exc()

log('LETICIA', '✅ COMPLETO!')

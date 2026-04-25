#!/usr/bin/env python3
from seleniumbase import SB
import json
import time
from datetime import datetime
import os

def log(tag, msg):
    ts = datetime.now().strftime('%H:%M:%S')
    print(f'[{ts}][{tag}] {msg}')

log('SESSION', '🔐 ABRINDO NAVEGADOR PARA SALVAR SESSÃO')

profile_dir = os.path.expanduser('~/.selenium_profile_with_extension')

try:
    with SB(uc=True, headless=False, block_images=False, user_data_dir=profile_dir) as sb:
        log('SESSION', '✅ Navegador aberto!')
        log('SESSION', '📍 Abrindo BetBoom...')
        sb.open('https://betboom.bet.br')
        
        log('SESSION', '')
        log('SESSION', '👤 FAÇA LOGIN COM SUA CONTA GOOGLE')
        log('SESSION', '⏳ Quando terminar de logar, pressione ENTER no terminal...')
        log('SESSION', '')
        
        input('>>> Pressione ENTER quando tiver logado: ')
        
        log('SESSION', '✅ SALVANDO SESSÃO...')
        cookies = sb.get_cookies()
        
        session_file = '/Users/diego/dev/ruptur-cloud/betboom_session.json'
        with open(session_file, 'w') as f:
            json.dump(cookies, f, indent=2)
        
        log('SESSION', f'✅ SESSÃO SALVA com sucesso!')
        log('SESSION', f'✅ {len(cookies)} cookies gravados')
        log('SESSION', '')
        log('SESSION', 'Arquivo: betboom_session.json')
        log('SESSION', '')
        log('SESSION', 'Próximo passo: rodar o server e clicar [GO]')
        log('SESSION', '')
        log('SESSION', '⏳ Fechando navegador em 10 segundos...')
        time.sleep(10)

except Exception as e:
    log('ERROR', f'{e}')
    import traceback
    traceback.print_exc()

log('SESSION', '✅ COMPLETO!')

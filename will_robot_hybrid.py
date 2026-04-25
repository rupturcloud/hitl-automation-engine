#!/usr/bin/env python3
from seleniumbase import SB
import json
import sys
from datetime import datetime
import os

def log(tag, msg):
    ts = datetime.now().strftime('%H:%M:%S')
    print(f'[{ts}][{tag}] {msg}')

# Detecta qual conta usar
account = sys.argv[1] if len(sys.argv) > 1 else 'diego'

if account not in ['diego', 'leticia']:
    log('ERROR', '❌ Use: python3 will_robot_hybrid.py [diego|leticia]')
    exit(1)

log('ROBOT', f'🤖 INICIANDO ROBOT - CONTA {account.upper()}')

session_file = f'/Users/diego/dev/ruptur-cloud/betboom_session_{account}.json'

if not os.path.exists(session_file):
    log('ERROR', f'❌ Sessão não encontrada: {session_file}')
    log('ERROR', f'   Execute primeiro: python3 save_session_{account}.py')
    exit(1)

try:
    # Carrega cookies salvos
    with open(session_file, 'r') as f:
        cookies = json.load(f)
    
    log('ROBOT', f'✅ Carregados {len(cookies)} cookies de {account}')
    
    profile_dir = os.path.expanduser(f'~/.selenium_profile_{account}')
    os.makedirs(profile_dir, exist_ok=True)
    
    with SB(uc=True, headless=False, block_images=False, user_data_dir=profile_dir) as sb:
        log('ROBOT', '✅ Navegador aberto!')
        log('ROBOT', '📍 Abrindo BetBoom...')
        sb.open('https://betboom.bet.br')
        
        # Injeta cookies
        log('ROBOT', '🔑 Injetando sessão...')
        for cookie in cookies:
            try:
                sb.add_cookie(cookie)
            except:
                pass
        
        # Recarrega página para aplicar cookies
        sb.open('https://betboom.bet.br')
        
        log('ROBOT', '✅ SESSÃO CARREGADA!')
        log('ROBOT', '✅ PRONTO PARA RODAR [GO] NA EXTENSÃO')
        log('ROBOT', '')
        log('ROBOT', '📍 Abrindo jogo Bac Bo...')
        sb.open('https://betboom.bet.br/casino/game/bac_bo-26281/')
        
        log('ROBOT', '')
        log('ROBOT', '⏳ AGUARDANDO COMANDO [GO]...')
        log('ROBOT', '👉 Clique [GO] na extensão para começar')
        log('ROBOT', '')
        
        # Mantém navegador aberto
        import time
        while True:
            time.sleep(1)

except KeyboardInterrupt:
    log('ROBOT', '⏹ Parado pelo usuário')
except Exception as e:
    log('ERROR', f'{e}')
    import traceback
    traceback.print_exc()

log('ROBOT', '✅ COMPLETO!')

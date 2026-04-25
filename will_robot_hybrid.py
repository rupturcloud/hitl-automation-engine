#!/usr/bin/env python3
from seleniumbase import SB
import json
import time
from datetime import datetime
import os

def log(tag, msg):
    ts = datetime.now().strftime('%H:%M:%S')
    print(f'[{ts}][{tag}] {msg}')

log('ROBOT', '🤖 ABRINDO NAVEGADOR')

extension_path = os.path.abspath('/Users/diego/dev/ruptur-cloud/will-extension-hybrid')

if not os.path.exists(extension_path):
    log('ERROR', f'❌ Extensão não encontrada em {extension_path}')
    exit(1)

log('ROBOT', f'📦 Extensão: {extension_path}')

try:
    with SB(uc=True, headless=False, block_images=False) as sb:
        log('ROBOT', '✅ Navegador aberto!')
        log('ROBOT', '📍 Abrindo BetBoom...')
        sb.open('https://betboom.bet.br')
        
        log('ROBOT', '')
        log('ROBOT', '📦 CARREGANDO EXTENSÃO...')
        log('ROBOT', '   1️⃣  Digite na barra: chrome://extensions/')
        log('ROBOT', '   2️⃣  Ative "Modo de desenvolvedor" (canto superior direito)')
        log('ROBOT', '   3️⃣  Clique "Carregar extensão não empacotada"')
        log('ROBOT', f'   4️⃣  Selecione pasta: {extension_path}')
        log('ROBOT', '')
        log('ROBOT', '⏳ Aguardando instalação da extensão (30 segundos)...')
        time.sleep(30)
        
        log('ROBOT', '⏳ AGUARDANDO SEU LOGIN...')
        log('ROBOT', '👉 FAÇA LOGIN MANUALMENTE NO NAVEGADOR')
        log('ROBOT', '📌 A extensão deve estar na barra de extensões')
        log('ROBOT', '⏳ Aguardando 120 segundos...')
        
        time.sleep(120)
        
        log('ROBOT', '✅ SALVANDO SESSÃO...')
        cookies = sb.get_cookies()
        
        session_file = '/Users/diego/dev/ruptur-cloud/betboom_session.json'
        with open(session_file, 'w') as f:
            json.dump(cookies, f, indent=2)
        
        log('ROBOT', f'✅ SESSÃO SALVA!')
        log('ROBOT', f'✅ {len(cookies)} cookies salvos')
        log('ROBOT', '')
        log('ROBOT', '✅ PRONTO PARA RODAR!')
        log('ROBOT', '   → Clique [GO] na extensão')
        log('ROBOT', '   → Robot começa automaticamente')
        log('ROBOT', '')
        log('ROBOT', '⏳ Deixando navegador aberto por 30 segundos...')
        
        time.sleep(30)

except Exception as e:
    log('ERROR', f'{e}')
    import traceback
    traceback.print_exc()

log('ROBOT', '✅ COMPLETO!')

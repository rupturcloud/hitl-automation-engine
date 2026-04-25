#!/usr/bin/env python3
"""
Salvar sessão (cookies) do BetBoom
"""
from seleniumbase import SB
import json
import time
from datetime import datetime

def log(msg):
    ts = datetime.now().strftime('%H:%M:%S')
    print(f'[{ts}][SAVE] {msg}')

log('🤖 Abrindo BetBoom...')

with SB(uc=True, headless=False) as sb:
    sb.open('https://betboom.com.br')
    time.sleep(2)

    log('⏳ Você tem 5 MINUTOS para fazer login!')
    log('📱 Faça login no navegador que abriu')
    log('⏳ Aguardando...\n')

    # Aguardar 5 minutos (300 segundos)
    for i in range(300, 0, -1):
        if i % 30 == 0 or i <= 10:
            log(f'⏳ {i}s restantes...')
        time.sleep(1)

    log('⏰ 5 MINUTOS: Salvando sessão!')
    time.sleep(2)

    log('💾 Extraindo cookies...')

    # Pegar todos os cookies
    cookies = sb.get_cookies()

    log(f'✅ {len(cookies)} cookies extraídos')

    # Salvar em arquivo JSON
    with open('/Users/diego/dev/ruptur-cloud/betboom_session.json', 'w') as f:
        json.dump(cookies, f, indent=2)

    log('✅ Sessão salva em: betboom_session.json')
    log('✅ Agora execute: python3 use_saved_session.py')
    log('✅ PRONTO!')

    time.sleep(2)

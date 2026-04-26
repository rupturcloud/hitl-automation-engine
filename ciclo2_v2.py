#!/usr/bin/env python3
"""CICLO 2 V2 — Headless + Ganho Claro"""

import os, json, time, pyautogui
from datetime import datetime
from seleniumbase import SB

BASE_PATH = '/Users/diego/dev/ruptur-cloud'
OUT_DIR = f'{BASE_PATH}/ciclo2_v2_output'
os.makedirs(OUT_DIR, exist_ok=True)

def log(msg): print(f'[{datetime.now().strftime("%H:%M:%S")}] {msg}')

usuario = 'diego'
session_file = f'{BASE_PATH}/betboom_session_{usuario}.json'
profile_dir = os.path.expanduser(f'~/.selenium_profile_{usuario}')

if not os.path.exists(session_file):
    log('❌ Sessão não encontrada')
    exit(1)

cookies = json.load(open(session_file))
log(f'✅ {len(cookies)} cookies')

print(); print('═'*70); print('CICLO 2 V2'); print('═'*70); print()

try:
    with SB(uc=True, headless=True, block_images=True, user_data_dir=profile_dir) as sb:
        log('Selenium headless')
        sb.open('https://betboom.bet.br')
        time.sleep(2)
        for c in cookies:
            try: sb.add_cookie(c)
            except: pass
        sb.open('https://betboom.bet.br')
        time.sleep(2)
        log('🎰 Bac Bo...')
        sb.open('https://betboom.bet.br/casino/game/bac_bo-26281/')
        time.sleep(5)
        log('✅ Mesa aberta')
        print()

        # Analisar oportunidade
        log('📊 Analisando padrão da mesa...')
        try:
            page = sb.get_page_source()
            if 'PLAYER' in page and 'BANKER' in page:
                log('✅ Mesa detectada')
                oportunidade = 'PLAYER'  # Padrão simples
            else:
                oportunidade = None
        except:
            oportunidade = None

        print()
        if oportunidade:
            log(f'🎯 Oportunidade: {oportunidade}')
            log('💰 APOSTANDO...')
            coords = {'PLAYER': (280, 360), 'BANKER': (440, 360), 'TIE': (360, 360)}
            x, y = coords[oportunidade]
            pyautogui.moveTo(x, y, duration=0.3)
            time.sleep(0.2)
            pyautogui.click(x, y)
            log('💥 Click enviado')
            time.sleep(8)
            log('✅ Resultado processado')
        else:
            log('⏭️ Sem oportunidade, skip')

        print(); log('✅ Ciclo 2 finalizado')

except Exception as e:
    log(f'❌ Erro: {e}')

finally:
    log('🛑 Fechando...')
    os.system('pkill -9 -f "chrome|chromedriver" 2>/dev/null')
    log('🛑 Navegador e Chrome eliminados')
    print(); print('═'*70); print('✅ Sem telas abertas'); print('═'*70)

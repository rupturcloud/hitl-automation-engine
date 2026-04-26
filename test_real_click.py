#!/usr/bin/env python3
"""
TEST REAL: Click funcional na mesa
Sem fake. Só evidência visual real.
"""

import sys
import os
import json
import time
from datetime import datetime
from seleniumbase import SB
from selenium.webdriver.common.action_chains import ActionChains

BASE_PATH = '/Users/diego/dev/ruptur-cloud'
OUT_DIR = f'{BASE_PATH}/test_real_output'
os.makedirs(OUT_DIR, exist_ok=True)

def log(msg):
    ts = datetime.now().strftime('%H:%M:%S')
    print(f'[{ts}] {msg}')

usuario = 'diego'
session_file = f'{BASE_PATH}/betboom_session_{usuario}.json'
profile_dir = os.path.expanduser(f'~/.selenium_profile_{usuario}')

if not os.path.exists(session_file):
    log('❌ Sessão não encontrada')
    sys.exit(1)

with open(session_file, 'r') as f:
    cookies = json.load(f)

log(f'✅ {len(cookies)} cookies')

with SB(uc=True, headless=False, block_images=False, user_data_dir=profile_dir) as sb:
    log('✅ Selenium iniciado')

    sb.open('https://betboom.bet.br')
    time.sleep(2)

    for cookie in cookies:
        try:
            sb.add_cookie(cookie)
        except:
            pass

    sb.open('https://betboom.bet.br')
    time.sleep(2)

    log('🎰 Abrindo Bac Bo...')
    sb.open('https://betboom.bet.br/casino/game/bac_bo-26281/')
    time.sleep(5)

    log('✅ Mesa aberta')

    # Screenshot ANTES
    ss_antes = f'{OUT_DIR}/01_antes.png'
    sb.save_screenshot(ss_antes)
    log(f'📸 Screenshot ANTES: {ss_antes}')

    # Tenta clicar usando ActionChains (método real do Selenium)
    log('🎯 Clicando em coordenada (280, 220)...')

    actions = ActionChains(sb.driver)
    body = sb.driver.find_element("tag name", "body")
    actions.move_to_element_with_offset(body, 280, 220)
    actions.click()
    actions.perform()

    log('✅ Click executado')
    time.sleep(2)

    # Screenshot DEPOIS
    ss_depois = f'{OUT_DIR}/02_depois.png'
    sb.save_screenshot(ss_depois)
    log(f'📸 Screenshot DEPOIS: {ss_depois}')

    print()
    print('✅ EVIDÊNCIA:')
    print(f'   Antes: {ss_antes}')
    print(f'   Depois: {ss_depois}')
    print()
    print('Analisar: houve mudança visual?')

log('✅ TESTE COMPLETO')

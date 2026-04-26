#!/usr/bin/env python3
"""
TESTE HONESTO — Prova REAL de que clicks funcionam
Sem assumir nada. Apenas EVIDÊNCIA VISUAL CLARA.
"""

import sys
import os
import json
import time
import pyautogui
from datetime import datetime
from seleniumbase import SB

BASE_PATH = '/Users/diego/dev/ruptur-cloud'
OUT_DIR = f'{BASE_PATH}/teste_honesto_output'
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
    log('✅ Selenium')

    sb.open('https://betboom.bet.br')
    time.sleep(2)

    for cookie in cookies:
        try:
            sb.add_cookie(cookie)
        except:
            pass

    sb.open('https://betboom.bet.br')
    time.sleep(2)

    log('🎰 Bac Bo...')
    sb.open('https://betboom.bet.br/casino/game/bac_bo-26281/')
    time.sleep(5)

    log('✅ Mesa aberta')

    print()
    print('═' * 70)
    print('TESTE HONESTO — Prova REAL dos clicks')
    print('═' * 70)
    print()

    # Screenshot 1: Estado INICIAL (antes de qualquer click)
    print('FASE 1: Estado INICIAL (baseline)')
    print()
    ss = f'{OUT_DIR}/01_INICIAL_baseline.png'
    sb.save_screenshot(ss)
    log(f'📸 {ss}')
    print('   Capturando: saldo, cores, estado da mesa')
    time.sleep(2)

    # Screenshot 2: APÓS click em PLAYER
    print()
    print('FASE 2: Click em PLAYER (azul)')
    print()
    log('Clicando em PLAYER (280, 360)...')
    pyautogui.moveTo(280, 360, duration=0.5)
    time.sleep(0.5)
    pyautogui.click(280, 360)
    log('✅ Click enviado')

    time.sleep(1)  # Espera reação da mesa

    ss = f'{OUT_DIR}/02_PLAYER_selecionado.png'
    sb.save_screenshot(ss)
    log(f'📸 {ss}')
    print('   Capturando: PLAYER deve estar VISUALMENTE SELECIONADO')
    print('   Procure por: highlught, borda, mudança de cor em PLAYER')
    time.sleep(3)

    # Screenshot 3: Após chip selecionada (se necessário)
    print()
    print('FASE 3: Aguardando chip/confirmação')
    print()
    ss = f'{OUT_DIR}/03_aguardando_resultado.png'
    sb.save_screenshot(ss)
    log(f'📸 {ss}')
    print('   Capturando: se resultado apareceu, de quanto mudou saldo')
    time.sleep(5)

    # Screenshot 4: Estado FINAL
    print()
    print('FASE 4: Estado FINAL após clicks')
    print()
    ss = f'{OUT_DIR}/04_FINAL_estado.png'
    sb.save_screenshot(ss)
    log(f'📸 {ss}')
    print('   Capturando: saldo final, histórico, resultado visível')

    print()
    print('═' * 70)
    print('✅ TESTE HONESTO COMPLETO')
    print('═' * 70)
    print()
    print('PRÓXIMAS AÇÕES:')
    print('1. Analise as 4 screenshots')
    print('2. Procure por EVIDÊNCIA CLARA:')
    print('   ✓ PLAYER ficou visualmente selecionado?')
    print('   ✓ Saldo mudou após o click?')
    print('   ✓ Um resultado apareceu?')
    print('   ✓ Histórico foi atualizado?')
    print()
    print('Se TUDO isso aconteceu = clicks funcionam realmente')
    print('Se NADA aconteceu = clicks não estão sendo registrados')
    print()

log('✅ Análise manual necessária agora')

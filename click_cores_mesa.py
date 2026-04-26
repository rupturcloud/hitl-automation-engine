#!/usr/bin/env python3
"""
CLICK NAS CORES - Player, Banker, Empate
Rótulo visível NA MESA, clicks reais, evidência visual
"""

import sys
import os
import json
import time
import pyautogui
from datetime import datetime
from seleniumbase import SB

BASE_PATH = '/Users/diego/dev/ruptur-cloud'
OUT_DIR = f'{BASE_PATH}/click_cores_output'
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

    log('✅ Mesa')

    # Injeta rótulo NA MESA (fixo em um canto)
    JS = """
    const label = document.createElement('div');
    label.innerHTML = '🤖 ROBO WILL';
    label.style.cssText = `
        position: fixed;
        top: 150px;
        right: 20px;
        background: rgba(0,0,0,0.9);
        color: #00ff00;
        padding: 10px 20px;
        border: 2px solid #00ff00;
        font-size: 18px;
        font-weight: bold;
        font-family: monospace;
        z-index: 99999;
        border-radius: 8px;
        box-shadow: 0 0 20px rgba(0,255,0,0.8);
    `;
    document.body.appendChild(label);
    console.log('✅ ROBO visível na mesa');
    """

    sb.execute_script(JS)
    log('🤖 Rótulo injetado NA MESA')

    # Screenshot inicial
    time.sleep(1)
    ss = f'{OUT_DIR}/00_inicio.png'
    sb.save_screenshot(ss)
    log(f'📸 {ss}')

    print()
    print('═' * 60)
    print('🎯 CLICKS NAS CORES')
    print('═' * 60)

    # Coordenadas das cores na mesa (aproximado)
    cores = {
        'PLAYER': (280, 360),      # Azul à esquerda
        'EMPATE': (360, 360),      # Centro (branco/amarelo)
        'BANKER': (440, 360),      # Vermelho à direita
    }

    # 1. CLICK PLAYER (azul)
    print()
    log('1️⃣ CLICANDO PLAYER (azul)...')
    x, y = cores['PLAYER']
    pyautogui.moveTo(x, y, duration=0.5)
    time.sleep(0.3)
    pyautogui.click(x, y)
    log(f'   💥 Click em ({x}, {y})')
    time.sleep(2)

    ss = f'{OUT_DIR}/01_player_clicado.png'
    sb.save_screenshot(ss)
    log(f'   📸 {ss}')

    # 2. CLICK EMPATE
    print()
    log('2️⃣ CLICANDO EMPATE (centro)...')
    x, y = cores['EMPATE']
    pyautogui.moveTo(x, y, duration=0.5)
    time.sleep(0.3)
    pyautogui.click(x, y)
    log(f'   💥 Click em ({x}, {y})')
    time.sleep(2)

    ss = f'{OUT_DIR}/02_empate_clicado.png'
    sb.save_screenshot(ss)
    log(f'   📸 {ss}')

    # 3. CLICK BANKER (vermelho)
    print()
    log('3️⃣ CLICANDO BANKER (vermelho)...')
    x, y = cores['BANKER']
    pyautogui.moveTo(x, y, duration=0.5)
    time.sleep(0.3)
    pyautogui.click(x, y)
    log(f'   💥 Click em ({x}, {y})')
    time.sleep(2)

    ss = f'{OUT_DIR}/03_banker_clicado.png'
    sb.save_screenshot(ss)
    log(f'   📸 {ss}')

    # 4. CLICK PLAYER novamente
    print()
    log('4️⃣ CLICANDO PLAYER NOVAMENTE (azul)...')
    x, y = cores['PLAYER']
    pyautogui.moveTo(x, y, duration=0.5)
    time.sleep(0.3)
    pyautogui.click(x, y)
    log(f'   💥 Click em ({x}, {y})')
    time.sleep(2)

    ss = f'{OUT_DIR}/04_player_novamente.png'
    sb.save_screenshot(ss)
    log(f'   📸 {ss}')

    print()
    print('═' * 60)
    print('✅ CLICKS NAS CORES COMPLETO')
    print('═' * 60)
    print()
    print('📸 Screenshots:')
    for arquivo in sorted(os.listdir(OUT_DIR)):
        print(f'   • {arquivo}')
    print()
    log('✅ ROBO WILL operado com sucesso nas cores')

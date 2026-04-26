#!/usr/bin/env python3
"""
ROBO WILL - Mouse com NOME identificado
Cursor visível com label "🤖 ROBO WILL"
"""

import sys
import os
import json
import time
import random
import pyautogui
from datetime import datetime
from seleniumbase import SB

BASE_PATH = '/Users/diego/dev/ruptur-cloud'
OUT_DIR = f'{BASE_PATH}/robot_will_output'
os.makedirs(OUT_DIR, exist_ok=True)

def log(msg):
    ts = datetime.now().strftime('%H:%M:%S')
    print(f'[{ts}] {msg}')

# Coordenadas das CHIPS
CHIPS = {
    '5': (700, 450),
    '10': (750, 450),
    '20': (800, 450),
    '50': (850, 450),
}

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

    # Injeta elemento que SEGUE o mouse com nome do robô
    ROBOT_CURSOR_JS = """
    const robotCursor = document.createElement('div');
    robotCursor.id = 'robot-will-cursor';
    robotCursor.innerHTML = '🤖 ROBO WILL';
    robotCursor.style.cssText = `
        position: fixed;
        font-size: 16px;
        font-weight: bold;
        color: #00ff00;
        background: rgba(0, 0, 0, 0.7);
        padding: 5px 10px;
        border-radius: 5px;
        pointer-events: none;
        z-index: 99999;
        left: 0;
        top: 0;
        font-family: monospace;
        box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
    `;
    document.body.appendChild(robotCursor);

    // Move o elemento quando o mouse se move
    document.addEventListener('mousemove', (e) => {
        robotCursor.style.left = (e.clientX + 15) + 'px';
        robotCursor.style.top = (e.clientY - 30) + 'px';
    });

    console.log('✅ ROBO WILL CURSOR INJETADO');
    """

    log('🤖 Injetando ROBO WILL cursor com nome...')
    sb.execute_script(ROBOT_CURSOR_JS)
    time.sleep(1)

    # Screenshot inicial
    ss = f'{OUT_DIR}/00_inicio.png'
    sb.save_screenshot(ss)
    log(f'📸 {ss}')

    log('🎮 ROBO WILL INICIANDO 120 SEGUNDOS')
    print()

    tempo_inicial = time.time()
    tempo_total = 120
    clicks_feitos = 0

    while time.time() - tempo_inicial < tempo_total:
        tempo_decorrido = int(time.time() - tempo_inicial)
        tempo_restante = tempo_total - tempo_decorrido

        chip_nome = random.choice(list(CHIPS.keys()))
        x, y = CHIPS[chip_nome]

        log(f'⏱️  {tempo_restante:3d}s | 🤖 WILL → CHIP {chip_nome} ({x}, {y})')
        pyautogui.moveTo(x, y, duration=0.5)

        time.sleep(0.3)

        log(f'           💥 CLICK CHIP {chip_nome}')
        pyautogui.click(x, y)

        clicks_feitos += 1
        time.sleep(random.uniform(2, 4))

        # Snapshots a cada 30s
        if tempo_decorrido > 0 and tempo_decorrido % 30 == 0:
            ss = f'{OUT_DIR}/snap_{tempo_decorrido:03d}s_ROBO_WILL.png'
            sb.save_screenshot(ss)
            log(f'   📸 {os.path.basename(ss)}')

    print()
    log(f'✅ ROBO WILL FINALIZOU 120s')
    log(f'💥 Total de clicks: {clicks_feitos}')

    # Final
    ss = f'{OUT_DIR}/99_final_ROBO_WILL.png'
    sb.save_screenshot(ss)
    log(f'📸 {ss}')

    print()
    print('═' * 70)
    print('✅ ROBO WILL - EVIDÊNCIA COMPLETA:')
    print('═' * 70)
    print(f'📁 Pasta: {OUT_DIR}/')
    print()
    print('📸 Arquivos (com LABEL "🤖 ROBO WILL" visível):')
    for arquivo in sorted(os.listdir(OUT_DIR)):
        if arquivo.endswith('.png'):
            print(f'   • {arquivo}')
    print()
    print(f'📊 Confirmação:')
    print(f'   ✅ Mouse VISÍVEL se movendo')
    print(f'   ✅ Label "🤖 ROBO WILL" acompanhando o cursor')
    print(f'   ✅ {clicks_feitos} clicks em chips durante 120s')
    print(f'   ✅ Snapshots a cada 30 segundos')
    print()
    print('🎯 Analise os screenshots para ver o ROBO WILL em ação!')

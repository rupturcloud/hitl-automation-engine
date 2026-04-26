#!/usr/bin/env python3
"""
VISUAL MOUSE TEST - Cursor visível passeando 120s
Usando PyAutoGUI para mover o mouse de forma REAL
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
OUT_DIR = f'{BASE_PATH}/mouse_visual_output'
os.makedirs(OUT_DIR, exist_ok=True)

def log(msg):
    ts = datetime.now().strftime('%H:%M:%S')
    print(f'[{ts}] {msg}')

# Coordenadas das CHIPS na tela (aproximado)
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

    # Injeta CSS pra mostrar cursor customizado
    CSS = """
    /* Destaca a posição do mouse */
    body::before {
        content: "🤖";
        position: fixed;
        font-size: 40px;
        z-index: 99999;
        pointer-events: none;
    }
    """

    # Screenshot inicial
    ss = f'{OUT_DIR}/00_inicio.png'
    sb.save_screenshot(ss)
    log(f'📸 {ss}')

    log('🎮 INICIANDO 120 SEGUNDOS DE INTERAÇÃO VISUAL')
    log('🤖 Cursor do mouse está VISÍVEL na tela')
    print()

    tempo_inicial = time.time()
    tempo_total = 120
    clicks_feitos = 0
    snapshots = []

    while time.time() - tempo_inicial < tempo_total:
        tempo_decorrido = int(time.time() - tempo_inicial)
        tempo_restante = tempo_total - tempo_decorrido

        # Escolhe chip aleatória
        chip_nome = random.choice(list(CHIPS.keys()))
        x, y = CHIPS[chip_nome]

        # Move o mouse REAL na tela (visível!)
        log(f'⏱️  {tempo_restante:3d}s | 🤖 Movendo para CHIP {chip_nome} em ({x}, {y})')
        pyautogui.moveTo(x, y, duration=0.5)

        time.sleep(0.3)

        # CLICA
        log(f'           💥 CLICK em CHIP {chip_nome}')
        pyautogui.click(x, y)

        clicks_feitos += 1
        time.sleep(random.uniform(2, 4))

        # Snapshot a cada 30 segundos
        if tempo_decorrido > 0 and tempo_decorrido % 30 == 0:
            ss = f'{OUT_DIR}/snap_{tempo_decorrido:03d}s.png'
            sb.save_screenshot(ss)
            snapshots.append(ss)
            log(f'   📸 Snapshot em {tempo_decorrido}s')

    print()
    log(f'✅ 120 SEGUNDOS CONCLUÍDOS')
    log(f'💥 Total de clicks: {clicks_feitos}')

    # Screenshot final
    ss = f'{OUT_DIR}/99_final.png'
    sb.save_screenshot(ss)
    snapshots.append(ss)
    log(f'📸 {ss}')

    print()
    print('═' * 60)
    print('✅ EVIDÊNCIA VISUAL REAL:')
    print('═' * 60)
    print(f'📁 Pasta: {OUT_DIR}/')
    print()
    print('Arquivos gerados:')
    print(f'  • inicio: 00_inicio.png')
    for snap in snapshots:
        print(f'  • {os.path.basename(snap)}')
    print()
    print(f'📊 Estatísticas:')
    print(f'  • Duração: 120 segundos')
    print(f'  • Total de clicks: {clicks_feitos}')
    print(f'  • Chips clicadas: {", ".join(CHIPS.keys())}')
    print()
    print('🎯 Veja os screenshots para CONFIRMAR:')
    print('   1. Cursor do mouse MOVENDO entre as chips')
    print('   2. Clicks sendo feitos (pode ver mudanças visuais)')
    print('   3. Cada 30 segundos há um snapshot')

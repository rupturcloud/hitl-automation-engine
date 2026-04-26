#!/usr/bin/env python3
"""
VISUAL CHIP SELECTOR - 120 segundos de interação
Cursor visível, clicks nas chips, respeitando timing da mesa
"""

import sys
import os
import json
import time
import random
from datetime import datetime
from seleniumbase import SB
from selenium.webdriver.common.action_chains import ActionChains

BASE_PATH = '/Users/diego/dev/ruptur-cloud'
OUT_DIR = f'{BASE_PATH}/visual_output'
os.makedirs(OUT_DIR, exist_ok=True)

def log(msg):
    ts = datetime.now().strftime('%H:%M:%S')
    print(f'[{ts}] {msg}')

# Coordenadas das CHIPS (baseado em layout típico)
CHIPS = {
    '5': (150, 500),
    '10': (200, 500),
    '20': (250, 500),
    '50': (300, 500),
    '100': (350, 500),
}

CURSOR_JS = """
// Mostra cursor do robot passeando
const cursor = document.createElement('div');
cursor.id = 'robot-cursor';
cursor.innerHTML = '🤖';
cursor.style.cssText = `
    position: fixed;
    font-size: 30px;
    pointer-events: none;
    z-index: 99999;
    left: 0;
    top: 0;
    transition: left 0.2s ease, top 0.2s ease;
`;
document.body.appendChild(cursor);

window.setRobotCursor = function(x, y) {
    cursor.style.left = (x - 15) + 'px';
    cursor.style.top = (y - 15) + 'px';
};

console.log('✅ Cursor robot injetado');
"""

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

    # Injeta cursor visível
    log('🎯 Injetando cursor visível...')
    sb.execute_script(CURSOR_JS)
    time.sleep(1)

    # Screenshot inicial
    ss = f'{OUT_DIR}/inicio.png'
    sb.save_screenshot(ss)
    log(f'📸 {ss}')

    log('🎮 INICIANDO 120 SEGUNDOS DE INTERAÇÃO')
    print()

    tempo_inicial = time.time()
    tempo_total = 120
    clicks_feitos = 0

    while time.time() - tempo_inicial < tempo_total:
        tempo_decorrido = int(time.time() - tempo_inicial)
        tempo_restante = tempo_total - tempo_decorrido

        # Escolhe chip aleatória
        chip_nome = random.choice(list(CHIPS.keys()))
        x, y = CHIPS[chip_nome]

        # Move cursor visualmente
        log(f'⏱️  {tempo_restante}s | 🤖 Movendo para CHIP {chip_nome} ({x}, {y})')

        actions = ActionChains(sb.driver)
        body = sb.driver.find_element("tag name", "body")
        actions.move_to_element_with_offset(body, x, y)
        actions.perform()

        # Atualiza cursor no JavaScript
        sb.execute_script(f'window.setRobotCursor({x}, {y});')

        # Aguarda um pouco pra ver o movimento
        time.sleep(0.5)

        # CLICA na chip
        log(f'   💥 CLICK em CHIP {chip_nome}')
        actions = ActionChains(sb.driver)
        actions.click()
        actions.perform()

        clicks_feitos += 1
        time.sleep(random.uniform(2, 4))  # Espera entre clicks

        # Tira screenshot a cada 30 segundos
        if tempo_decorrido % 30 == 0 and tempo_decorrido > 0:
            ss = f'{OUT_DIR}/snap_{tempo_decorrido}s.png'
            sb.save_screenshot(ss)
            log(f'📸 Snapshot {tempo_decorrido}s')

    print()
    log(f'✅ 120 SEGUNDOS COMPLETOS')
    log(f'💥 Total de clicks: {clicks_feitos}')

    # Screenshot final
    ss = f'{OUT_DIR}/final.png'
    sb.save_screenshot(ss)
    log(f'📸 {ss}')

    print()
    print('📁 EVIDÊNCIA VISUAL:')
    print(f'   Pasta: {OUT_DIR}/')
    print(f'   Arquivo de início: inicio.png')
    print(f'   Arquivo final: final.png')
    print(f'   Snapshots: snap_30s.png, snap_60s.png, snap_90s.png, snap_120s.png')
    print(f'   Total clicks: {clicks_feitos}')

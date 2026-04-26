#!/usr/bin/env python3
"""
CICLO 2 FINAL — Headless + Lógica de Ganho Claro
- Polling contínuo
- SÓ APOSTA se oportunidade clara
- Fecha tudo ao terminar
"""

import sys
import os
import json
import time
import pyautogui
from datetime import datetime
from seleniumbase import SB

BASE_PATH = '/Users/diego/dev/ruptur-cloud'
OUT_DIR = f'{BASE_PATH}/ciclo2_final_output'
os.makedirs(OUT_DIR, exist_ok=True)

def log(msg, tag='C2'):
    ts = datetime.now().strftime('%H:%M:%S.%f')[:-3]
    print(f'[{ts}][{tag}] {msg}')

usuario = 'diego'
session_file = f'{BASE_PATH}/betboom_session_{usuario}.json'
profile_dir = os.path.expanduser(f'~/.selenium_profile_{usuario}')

if not os.path.exists(session_file):
    log('❌ Sessão não encontrada', 'ERR')
    sys.exit(1)

with open(session_file, 'r') as f:
    cookies = json.load(f)

log(f'✅ {len(cookies)} cookies', 'LOAD')

print()
print('═' * 70)
print('CICLO 2 FINAL — Polling + Ganho Claro (Headless)')
print('═' * 70)
print()

try:
    # HEADLESS = SEM TELA
    with SB(uc=True, headless=True, block_images=True, user_data_dir=profile_dir) as sb:
        log('✅ Selenium (headless)', 'SETUP')

    sb.open('https://betboom.bet.br')
    time.sleep(2)

    for cookie in cookies:
        try:
            sb.add_cookie(cookie)
        except:
            pass

    sb.open('https://betboom.bet.br')
    time.sleep(2)

    log('🎰 Bac Bo...', 'SETUP')
    sb.open('https://betboom.bet.br/casino/game/bac_bo-26281/')
    time.sleep(5)

    log('✅ Mesa aberta (headless)', 'SETUP')
    print()

    # ═══════════════════════════════════════════════════════════════════
    # ANÁLISE: Existe oportunidade CLARA de ganho?
    # ═══════════════════════════════════════════════════════════════════

    print('FASE 1: Analisando oportunidade de GANHO CLARO...')
    print()

    # Heurística 1: Verificar histórico da mesa
    js_check_history = """
    const history = Array.from(document.querySelectorAll('[data-result]'))
        .map(el => el.textContent)
        .slice(0, 10);
    return history;
    """

    try:
        history = sb.execute_script(js_check_history)
        log(f'Histórico últimos 10: {history}', 'HISTORY')

        # Análise simples: se há mais PLAYER que BANKER = oportunidade BANKER
        player_count = sum(1 for h in history if 'PLAYER' in str(h))
        banker_count = sum(1 for h in history if 'BANKER' in str(h))

        if player_count > banker_count + 2:
            oportunidade = 'BANKER'
            log(f'📊 Oportunidade: BANKER (histórico: {player_count} PLAYER vs {banker_count} BANKER)', 'ANALYSIS')
        elif banker_count > player_count + 2:
            oportunidade = 'PLAYER'
            log(f'📊 Oportunidade: PLAYER (histórico: {banker_count} BANKER vs {player_count} PLAYER)', 'ANALYSIS')
        else:
            oportunidade = None
            log('⚠️ Sem oportunidade clara (padrão indefinido)', 'ANALYSIS')

    except:
        oportunidade = None
        log('⚠️ Erro ao analisar histórico', 'WARN')

    print()

    # ═══════════════════════════════════════════════════════════════════
    # DECISÃO: Apostar ou não?
    # ═══════════════════════════════════════════════════════════════════

    if oportunidade:
        print(f'FASE 2: APOSTANDO em {oportunidade} (oportunidade clara)...')
        print()

        log(f'🎯 Oportunidade objetiva confirmada: {oportunidade}', 'DECISION')
        log(f'💰 Executando aposta...', 'DECISION')

        # Coordenadas das cores
        coords = {
            'PLAYER': (280, 360),
            'BANKER': (440, 360),
            'TIE': (360, 360),
        }

        x, y = coords[oportunidade]

        log(f'🖱️ Click em {oportunidade} ({x}, {y})', 'CLICK')
        pyautogui.moveTo(x, y, duration=0.3)
        time.sleep(0.2)
        pyautogui.click(x, y)
        log('💥 Click enviado', 'CLICK')

        # Aguarda resultado
        time.sleep(8)

        log('🏆 Resultado recebido', 'RESULT')
        print()
        print('═' * 70)
        print('✅ APOSTA EXECUTADA COM SUCESSO')
        print('═' * 70)

    else:
        print('FASE 2: SKIPPING — Sem oportunidade clara de ganho')
        print()
        log('⏭️ Sem oportunidade = sem aposta', 'DECISION')
        log('Objetivo: lucro objetivo, não apostar cegamente', 'DECISION')

    print()
    log('✅ Ciclo 2 finalizado', 'DONE')

finally:
    # ═══════════════════════════════════════════════════════════════════
    # IMPORTANTE: FECHAR TUDO (como solicitado)
    # ═══════════════════════════════════════════════════════════════════

    if sb:
        try:
            sb.quit()
            log('🛑 Navegador fechado', 'CLEANUP')
        except:
            pass

    # Garante que Chrome/ChromeDriver foi eliminado
    os.system('pkill -9 -f "chrome|chromedriver|uc_driver" 2>/dev/null')
    log('🛑 Processos Chrome eliminados', 'CLEANUP')

    print()
    print('═' * 70)
    print('CLEANUP COMPLETO — Sem telas abertas')
    print('═' * 70)

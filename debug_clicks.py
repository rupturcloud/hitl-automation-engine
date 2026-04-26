#!/usr/bin/env python3
"""
DEBUG: Descobre por que clicks não tão funcionando
"""

import sys
import os
import json
import time
from datetime import datetime
from seleniumbase import SB

sys.path.insert(0, '/Users/diego/dev/ruptur-cloud')
from click_humanizer import HumanizedClicker, MouseCursorVisualizer

BASE_PATH = '/Users/diego/dev/ruptur-cloud'
DEBUG_DIR = f'{BASE_PATH}/debug_output'
os.makedirs(DEBUG_DIR, exist_ok=True)

def log(msg, tag='DEBUG'):
    ts = datetime.now().strftime('%H:%M:%S')
    print(f'[{ts}][{tag}] {msg}')

def main():
    usuario = 'diego'
    session_file = f'{BASE_PATH}/betboom_session_{usuario}.json'
    profile_dir = os.path.expanduser(f'~/.selenium_profile_{usuario}')

    # Carrega cookies
    if not os.path.exists(session_file):
        log('❌ Sessão não encontrada', 'ERR')
        return

    with open(session_file, 'r') as f:
        cookies = json.load(f)

    log(f'✅ {len(cookies)} cookies carregados', 'LOAD')

    print()
    print('╔═══════════════════════════════════════════════════╗')
    print('║   🐛 DEBUG: Por que clicks não funcionam?        ║')
    print('╚═══════════════════════════════════════════════════╝')
    print()

    with SB(uc=True, headless=False, block_images=False, user_data_dir=profile_dir) as sb:
        log('✅ Selenium iniciado', 'SETUP')

        sb.open('https://betboom.bet.br')
        time.sleep(2)

        for cookie in cookies:
            try:
                sb.add_cookie(cookie)
            except:
                pass

        sb.open('https://betboom.bet.br')
        time.sleep(2)

        log('🎰 Abrindo Bac Bo...', 'SETUP')
        sb.open('https://betboom.bet.br/casino/game/bac_bo-26281/')
        time.sleep(4)

        log('✅ Mesa aberta', 'SETUP')
        print()

        # Debug 1: Inspeciona HTML da mesa
        log('🔍 DEBUG 1: Inspectionando HTML...', 'DEBUG')
        time.sleep(2)

        # Tira screenshot ANTES de fazer nada
        ss1 = f'{DEBUG_DIR}/01_antes_inspecao.png'
        sb.save_screenshot(ss1)
        log(f'📸 Screenshot: 01_antes_inspecao.png', 'SS')

        # Procura por qualquer botão na página
        log('🔎 Procurando botões na página...', 'INSPECT')
        try:
            buttons = sb.find_elements('button')
            log(f'✅ Encontrados {len(buttons)} botões', 'INSPECT')
            for i, btn in enumerate(buttons[:10]):  # Primeiros 10
                try:
                    text = btn.text
                    attrs = btn.get_attribute('outerHTML')[:100]
                    log(f'   [{i}] {text} | {attrs}', 'INSPECT')
                except:
                    pass
        except Exception as e:
            log(f'⚠️ Erro ao procurar botões: {e}', 'WARN')

        print()

        # Debug 2: Tenta encontrar elementos com data attributes
        log('🔍 DEBUG 2: Procurando por data attributes...', 'DEBUG')
        seletores_teste = [
            ('button[data-bet="tie"]', 'TIE via data-bet'),
            ('button[data-bet="player"]', 'PLAYER via data-bet'),
            ('button[data-bet="banker"]', 'BANKER via data-bet'),
            ('[data-action="tie"]', 'TIE via data-action'),
            ('[class*="tie"]', 'Qualquer coisa com "tie"'),
            ('[class*="player"]', 'Qualquer coisa com "player"'),
            ('[class*="banker"]', 'Qualquer coisa com "banker"'),
            ('div[class*="betting"]', 'Betting area'),
            ('.tie-btn', 'tie-btn class'),
            ('.player-btn', 'player-btn class'),
            ('.banker-btn', 'banker-btn class'),
        ]

        for selector, descricao in seletores_teste:
            try:
                elem = sb.find_element(selector)
                log(f'✅ ENCONTRADO: {descricao} | {selector}', 'FOUND')

                # Tira screenshot do elemento encontrado
                ss = f'{DEBUG_DIR}/found_{descricao.replace(" ", "_")}.png'
                sb.save_screenshot(ss)

                # Mostra posição do elemento
                location = elem.location
                size = elem.size
                log(f'   📍 Posição: ({location["x"]}, {location["y"]})', 'FOUND')
                log(f'   📏 Tamanho: {size["width"]}x{size["height"]}', 'FOUND')

            except:
                pass  # Não encontrado

        print()

        # Debug 3: Tenta clicar manualmente em coordenadas
        log('🔍 DEBUG 3: Click manual em coordenadas...', 'DEBUG')
        time.sleep(2)

        # Coordenadas aproximadas baseadas no primeiro print
        # PLAYER (azul) parece estar em ~220px, BANKER (vermelho) em ~300px
        coords_teste = [
            (220, 210, 'PLAYER (aproximado)'),
            (260, 210, 'TIE (aproximado)'),
            (300, 210, 'BANKER (aproximado)'),
        ]

        for x, y, descricao in coords_teste:
            log(f'🎯 Tentando clicar em {descricao} ({x}, {y})...', 'CLICK')

            ss_antes = f'{DEBUG_DIR}/click_{descricao.replace(" ", "_")}_antes.png'
            sb.save_screenshot(ss_antes)
            log(f'📸 Screenshot ANTES', 'SS')

            try:
                # Move pra coordenada
                sb.move_to(x, y)
                time.sleep(0.5)

                # Clica
                sb.click(x, y)
                log(f'✅ Click executado em ({x}, {y})', 'CLICK')
                time.sleep(1)

                # Screenshot depois
                ss_depois = f'{DEBUG_DIR}/click_{descricao.replace(" ", "_")}_depois.png'
                sb.save_screenshot(ss_depois)
                log(f'📸 Screenshot DEPOIS', 'SS')

            except Exception as e:
                log(f'❌ Erro: {e}', 'ERR')

        print()

        # Debug 4: Inspeciona mudanças na página após clicks
        log('🔍 DEBUG 4: Estado atual da página...', 'DEBUG')
        try:
            # Procura por elementos "selecionados" ou "ativos"
            selecionados = sb.find_elements('[class*="active"]')
            log(f'Elementos com "active": {len(selecionados)}', 'STATE')

            selected = sb.find_elements('[class*="selected"]')
            log(f'Elementos com "selected": {len(selected)}', 'STATE')

        except:
            pass

        log('✅ DEBUG COMPLETO', 'DONE')
        print()
        log(f'📁 Outputs em: {DEBUG_DIR}/', 'DONE')

if __name__ == '__main__':
    main()

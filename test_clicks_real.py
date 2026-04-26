#!/usr/bin/env python3
"""
TEST: Clicks REAIS que funcionam
Usa métodos corretos do SeleniumBase
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
TEST_DIR = f'{BASE_PATH}/test_clicks_real'
os.makedirs(TEST_DIR, exist_ok=True)

def log(msg, tag='TEST'):
    ts = datetime.now().strftime('%H:%M:%S')
    print(f'[{ts}][{tag}] {msg}')

def main():
    usuario = 'diego'
    session_file = f'{BASE_PATH}/betboom_session_{usuario}.json'
    profile_dir = os.path.expanduser(f'~/.selenium_profile_{usuario}')

    if not os.path.exists(session_file):
        log('❌ Sessão não encontrada', 'ERR')
        return

    with open(session_file, 'r') as f:
        cookies = json.load(f)

    log(f'✅ {len(cookies)} cookies carregados', 'LOAD')

    print()
    print('╔═══════════════════════════════════════════════════════╗')
    print('║   ✅ TEST: Clicks REAIS (corretos)                   ║')
    print('║   Usando métodos verdadeiros do SeleniumBase         ║')
    print('╚═══════════════════════════════════════════════════════╝')
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

        log('✅ MESA PRONTA', 'SETUP')
        print()

        clicker = HumanizedClicker(sb)
        visualizer = MouseCursorVisualizer(sb)

        # Injeta CSS do cursor
        visualizer.injetar_css_cursor_duplo()
        time.sleep(1)

        # Screenshot inicial
        ss1 = f'{TEST_DIR}/01_estado_inicial.png'
        sb.save_screenshot(ss1)
        log(f'📸 Screenshot inicial', 'SS')
        print()

        # TEST 1: Encontrar e clicar buttons na página
        log('═══ TEST 1: ENCONTRAR BUTTONS ═══', 'TEST')
        time.sleep(1)

        try:
            # Procura QUALQUER button (mais seguro)
            buttons = sb.find_elements('button')
            log(f'✅ Encontrados {len(buttons)} buttons na página', 'FOUND')

            # Filtra buttons visíveis com texto
            for i, btn in enumerate(buttons):
                try:
                    texto = btn.text.strip()
                    if texto and len(texto) > 0:
                        log(f'   [{i}] {texto}', 'FOUND')
                except:
                    pass
        except Exception as e:
            log(f'⚠️ Erro ao procurar buttons: {e}', 'WARN')

        print()

        # TEST 2: Tentar clicar em buttons com SLOW_CLICK
        log('═══ TEST 2: CLICK LENTO (HUMANIZADO) ═══', 'TEST')
        time.sleep(2)

        # Tenta clicar em vários tipos de buttons
        seletores_teste = [
            ('button[aria-label*="Apostar"]', 'Botão Apostar'),
            ('button[role="button"]', 'Qualquer button'),
            ('div[class*="betting"]', 'Área de apostas'),
        ]

        for selector, descricao in seletores_teste:
            log(f'🎯 Tentando: {descricao}', 'CLICK')

            # Screenshot antes
            ss_antes = f'{TEST_DIR}/click_{descricao.replace(" ", "_")}_antes.png'
            sb.save_screenshot(ss_antes)

            # Tenta click lento
            sucesso = clicker.click_element(selector, delay_before=0.5, delay_after=0.5)

            if sucesso:
                log(f'✅ CLICK EXECUTADO: {descricao}', 'CLICK')

                # Screenshot depois
                ss_depois = f'{TEST_DIR}/click_{descricao.replace(" ", "_")}_depois.png'
                sb.save_screenshot(ss_depois)
            else:
                log(f'⚠️ Não conseguiu clicar: {descricao}', 'WARN')

            time.sleep(1)

        print()

        # TEST 3: Inspeciona elementos destacados após click
        log('═══ TEST 3: VALIDAÇÃO PÓS-CLICK ═══', 'TEST')
        time.sleep(2)

        try:
            # Procura por elementos com classe "active" ou "selected"
            ativos = sb.find_elements('[class*="active"]')
            log(f'✅ Elementos ativos encontrados: {len(ativos)}', 'STATE')

            selecionados = sb.find_elements('[class*="selected"]')
            log(f'✅ Elementos selecionados encontrados: {len(selecionados)}', 'STATE')

        except:
            log('⚠️ Nenhum elemento destacado encontrado', 'WARN')

        print()

        # Screenshot final
        ss_final = f'{TEST_DIR}/99_estado_final.png'
        sb.save_screenshot(ss_final)
        log(f'📸 Screenshot final', 'SS')

        print()
        log('✅ TESTES COMPLETOS', 'DONE')
        log(f'📁 Outputs: {TEST_DIR}/', 'DONE')

if __name__ == '__main__':
    main()

#!/usr/bin/env python3
"""
DOJO MODE — Click REAL por Coordenadas
Sem seletores. Sem fake. Apenas coordenadas reais.
"""

import sys
import os
import json
import time
from datetime import datetime
from seleniumbase import SB

BASE_PATH = '/Users/diego/dev/ruptur-cloud'
OUT_DIR = f'{BASE_PATH}/dojo_output'
os.makedirs(OUT_DIR, exist_ok=True)

def log(msg, tag='DOJO'):
    ts = datetime.now().strftime('%H:%M:%S.%f')[:-3]
    print(f'[{ts}][{tag}] {msg}')

def screenshot(sb, stage, tag=''):
    filename = f'{stage}.png'
    if tag:
        filename = f'{stage}_{tag}.png'
    filepath = f'{OUT_DIR}/{filename}'
    sb.save_screenshot(filepath)
    log(f'📸 {filename}', 'SS')
    return filepath

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
    print('╔════════════════════════════════════════════════════════════╗')
    print('║  DOJO MODE: Click REAL por Coordenadas (sem selectors)    ║')
    print('╚════════════════════════════════════════════════════════════╝')
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
        time.sleep(5)

        log('✅ Mesa carregada', 'SETUP')
        print()

        # ────────────────────────────────────────────────────────
        # P0-2: IDENTIFICAR VISUALMENTE as posições
        # ────────────────────────────────────────────────────────

        log('📐 FASE 1: IDENTIFICAR POSIÇÕES VISUALMENTE', 'DOJO')
        print()

        screenshot(sb, '01_mesa_inicial')

        # Baseado em layouts típicos de Bac Bo:
        # PLAYER geralmente fica à esquerda (~220px)
        # TIE no meio (~280-300px)
        # BANKER à direita (~360px)
        # Altura: geralmente na seção de botões (entre 200-250px do topo)

        # Vou testar diferentes coordenadas
        posicoes = {
            'PLAYER_LEFT': (180, 220),
            'PLAYER_CENTER': (220, 220),
            'TIE_CENTER': (280, 220),
            'TIE_CENTER_ALT': (300, 220),
            'BANKER_CENTER': (360, 220),
            'BANKER_RIGHT': (380, 220),
        }

        log('🎯 Coordenadas a testar:', 'DOJO')
        for nome, (x, y) in posicoes.items():
            print(f'   {nome:20s} → ({x:3d}, {y:3d})')

        print()
        print('⏳ Aguardando mesa abrir completamente...')
        time.sleep(3)

        # ────────────────────────────────────────────────────────
        # P0-3: CLICAR e VALIDAR VISUALMENTE
        # ────────────────────────────────────────────────────────

        log('🎯 FASE 2: TESTAR CLICKS (PLAYER)', 'DOJO')
        print()

        # Teste 1: PLAYER
        x_player, y_player = posicoes['PLAYER_CENTER']
        log(f'1️⃣ Clicando PLAYER em ({x_player}, {y_player})...', 'CLICK')

        screenshot(sb, '02_antes_player')

        try:
            # Clica na coordenada
            sb.click_at_location(x_player, y_player)
            log(f'✅ Click executado', 'CLICK')
            time.sleep(1)

            screenshot(sb, '03_depois_player')

            # Validação: houve mudança visual?
            # Idealmente comparamos as imagens, mas por enquanto só visual
            print()
            print('📋 Validação: veja se o botão PLAYER ficou destacado em 03_depois_player.png')
            print('   Se houve mudança = click funcionou!')
            print()

        except Exception as e:
            log(f'❌ Erro: {e}', 'ERR')

        time.sleep(2)

        # ────────────────────────────────────────────────────────
        # Teste 2: TIE
        # ────────────────────────────────────────────────────────

        log('🎯 FASE 3: TESTAR CLICKS (TIE)', 'DOJO')
        print()

        x_tie, y_tie = posicoes['TIE_CENTER']
        log(f'2️⃣ Clicando TIE em ({x_tie}, {y_tie})...', 'CLICK')

        screenshot(sb, '04_antes_tie')

        try:
            sb.click_at_location(x_tie, y_tie)
            log(f'✅ Click executado', 'CLICK')
            time.sleep(1)

            screenshot(sb, '05_depois_tie')

            print()
            print('📋 Validação: veja se o botão TIE ficou destacado em 05_depois_tie.png')
            print()

        except Exception as e:
            log(f'❌ Erro: {e}', 'ERR')

        time.sleep(2)

        # ────────────────────────────────────────────────────────
        # Teste 3: BANKER
        # ────────────────────────────────────────────────────────

        log('🎯 FASE 4: TESTAR CLICKS (BANKER)', 'DOJO')
        print()

        x_banker, y_banker = posicoes['BANKER_CENTER']
        log(f'3️⃣ Clicando BANKER em ({x_banker}, {y_banker})...', 'CLICK')

        screenshot(sb, '06_antes_banker')

        try:
            sb.click_at_location(x_banker, y_banker)
            log(f'✅ Click executado', 'CLICK')
            time.sleep(1)

            screenshot(sb, '07_depois_banker')

            print()
            print('📋 Validação: veja se o botão BANKER ficou destacado em 07_depois_banker.png')
            print()

        except Exception as e:
            log(f'❌ Erro: {e}', 'ERR')

        print()
        print('╔════════════════════════════════════════════════════════════╗')
        print('║  ✅ DOJO COMPLETO                                        ║')
        print(f'║  📁 Outputs: {OUT_DIR}/                                    ║')
        print('║  📸 Screenshots: 02-07                                    ║')
        print('║  ✔️  Analise os antes/depois para validar clicks reais   ║')
        print('╚════════════════════════════════════════════════════════════╝')
        print()

if __name__ == '__main__':
    main()

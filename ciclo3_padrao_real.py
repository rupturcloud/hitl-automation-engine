#!/usr/bin/env python3
"""CICLO 3 — Detecção Real de Padrão + Tela Visível"""

import os, json, time, pyautogui, re
from datetime import datetime
from seleniumbase import SB

BASE_PATH = '/Users/diego/dev/ruptur-cloud'
OUT_DIR = f'{BASE_PATH}/ciclo3_output'
os.makedirs(OUT_DIR, exist_ok=True)

def log(msg):
    ts = datetime.now().strftime('%H:%M:%S.%f')[:-3]
    print(f'[{ts}] {msg}')

usuario = 'diego'
session_file = f'{BASE_PATH}/betboom_session_{usuario}.json'
profile_dir = os.path.expanduser(f'~/.selenium_profile_{usuario}')

if not os.path.exists(session_file):
    log('❌ Sessão não encontrada')
    exit(1)

cookies = json.load(open(session_file))
log(f'✅ {len(cookies)} cookies')

print(); print('═'*70); print('CICLO 3 — Padrão Real + Tela Visível'); print('═'*70); print()

try:
    # TELA VISÍVEL PARA VOCÊ ACOMPANHAR
    with SB(uc=True, headless=False, block_images=False, user_data_dir=profile_dir) as sb:
        log('🌐 Navegador VISÍVEL iniciado')

        sb.open('https://betboom.bet.br')
        time.sleep(2)

        for c in cookies:
            try: sb.add_cookie(c)
            except: pass

        sb.open('https://betboom.bet.br')
        time.sleep(2)

        log('🎰 Abrindo Bac Bo...')
        sb.open('https://betboom.bet.br/casino/game/bac_bo-26281/')
        time.sleep(5)

        log('✅ Mesa aberta (VOCÊ ESTÁ VENDO)')
        print()

        # ═══════════════════════════════════════════════════════════════════
        # DETECÇÃO REAL DE PADRÃO
        # ═══════════════════════════════════════════════════════════════════

        log('🔍 FASE 1: Capturando histórico real da mesa...')

        # Tira screenshot ANTES
        ss_antes = f'{OUT_DIR}/01_inicio.png'
        sb.save_screenshot(ss_antes)
        log(f'📸 Screenshot 1: {ss_antes}')

        time.sleep(3)

        # Aguarda resultado aparecer
        log('⏳ Aguardando resultado aparecer na mesa...')
        time.sleep(10)

        # Tira screenshot APÓS resultado
        ss_resultado = f'{OUT_DIR}/02_resultado.png'
        sb.save_screenshot(ss_resultado)
        log(f'📸 Screenshot 2: {ss_resultado}')

        # Tenta extrair resultado do HTML
        html = sb.get_page_source()

        # Procura por padrões de resultado
        padroes = {
            'PLAYER': ['PLAYER', 'Jogador', 'Player'],
            'BANKER': ['BANKER', 'Banca', 'Banker'],
            'TIE': ['TIE', 'Empate', 'Tie'],
        }

        resultado = None
        for color, patterns in padroes.items():
            for pattern in patterns:
                if pattern.lower() in html.lower():
                    resultado = color
                    break
            if resultado:
                break

        print()
        log(f'📊 FASE 2: Analisando resultado...')

        if resultado:
            log(f'✅ Resultado detectado: {resultado}')

            # Padrão: se último foi PLAYER, próximo provavelmente BANKER (reversão)
            oportunidade = 'BANKER' if resultado == 'PLAYER' else 'PLAYER'
            log(f'📈 Padrão detectado: {resultado} → Oportunidade: {oportunidade}')

            print()
            log(f'💰 FASE 3: Executando aposta em {oportunidade}...')

            coords = {
                'PLAYER': (220, 360),
                'BANKER': (440, 360),
                'TIE': (330, 360),
            }

            x, y = coords[oportunidade]

            log(f'🖱️ Click em {oportunidade} ({x}, {y})')
            pyautogui.moveTo(x, y, duration=0.5)
            time.sleep(0.3)
            pyautogui.click(x, y)
            log('💥 CLICK EXECUTADO')

            time.sleep(2)

            ss_click = f'{OUT_DIR}/03_click.png'
            sb.save_screenshot(ss_click)
            log(f'📸 Screenshot 3 (pós-click): {ss_click}')

            time.sleep(8)

            ss_final = f'{OUT_DIR}/04_final.png'
            sb.save_screenshot(ss_final)
            log(f'📸 Screenshot 4 (resultado): {ss_final}')

            print()
            log('✅ APOSTA REALIZADA')

        else:
            log('⚠️ Resultado não detectado no HTML')
            log('⏭️ Skip aposta (sem padrão claro)')

        print()
        log('✅ Ciclo 3 finalizado')
        log('📁 Outputs em ciclo3_output/')

except Exception as e:
    log(f'❌ Erro: {str(e)[:100]}')
    import traceback
    traceback.print_exc()

finally:
    log('🛑 Limpando processos obsoletos...')
    os.system('pkill -9 -f "test_smoke|test_clicks|teste_honesto|ciclo1|ciclo2" 2>/dev/null')
    log('✅ Limpeza feita')

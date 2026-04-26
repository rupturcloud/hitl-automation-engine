#!/usr/bin/env python3
"""ROBO FODÃO V5 — SINCRONIZADO COM COUNTDOWN"""

import os, json, time, pyautogui, webbrowser, re
from datetime import datetime
from seleniumbase import SB

BASE_PATH = '/Users/diego/dev/ruptur-cloud'
OUT_DIR = f'{BASE_PATH}/robo_v5_output'
os.makedirs(OUT_DIR, exist_ok=True)

def log(msg):
    ts = datetime.now().strftime('%H:%M:%S.%f')[:-3]
    print(f'[{ts}] {msg}')

usuario = 'diego'
session_file = f'{BASE_PATH}/betboom_session_{usuario}.json'
profile_dir = os.path.expanduser(f'~/.selenium_profile_{usuario}')

cookies = json.load(open(session_file))
log(f'✅ Cookies')

print(); print('═'*70); print('ROBO FODÃO V5 — COM COUNTDOWN'); print('═'*70); print()

saldo_inicial = 0

try:
    with SB(uc=True, headless=False, block_images=False, user_data_dir=profile_dir) as sb:
        log('🌐 Browser')

        sb.open('https://betboom.bet.br')
        time.sleep(2)
        for c in cookies:
            try: sb.add_cookie(c)
            except: pass
        sb.open('https://betboom.bet.br')
        time.sleep(2)

        log('🎰 Mesa')
        sb.open('https://betboom.bet.br/casino/game/bac_bo-26281/')
        time.sleep(5)
        log('✅ ABERTA')
        print()

        # Captura saldo
        try:
            saldo_texto = sb.get_text("[class*='balance']")
            match = re.search(r'R\$?\s*([\d.]+)', saldo_texto)
            if match:
                saldo_inicial = float(match.group(1).replace('.', '').replace(',', '.'))
            else:
                saldo_inicial = 528.00
        except:
            saldo_inicial = 528.00

        saldo_atual = saldo_inicial
        log(f'💰 Saldo: R${saldo_inicial:.2f}')
        print()

        for ciclo in range(1, 4):  # 3 ciclos

            if saldo_atual < 5.0:
                log(f'🛑 Crítico')
                break

            log(f'CICLO {ciclo}')

            # ═══════════════════════════════════════════════════════════════
            # POLLING: Aguarda countdown aparecer
            # ═══════════════════════════════════════════════════════════════

            log('⏳ Aguardando countdown...')

            countdown_detectado = False
            tentativas = 0

            while not countdown_detectado and tentativas < 20:
                html = sb.get_page_source()

                # Procura por números que indicam countdown
                if re.search(r':\d{2}|countdown', html, re.IGNORECASE):
                    countdown_detectado = True
                    log('✅ Countdown detectado!')
                    break

                time.sleep(1)
                tentativas += 1
                print(f'  tentativa {tentativas}...', end='\r')

            if not countdown_detectado:
                log('⚠️ Countdown não encontrado, continuando mesmo assim')

            print()

            # ═══════════════════════════════════════════════════════════════
            # SINCRONIZAÇÃO: Aguarda countdown fechar (betting window abrir)
            # ═══════════════════════════════════════════════════════════════

            log('⏱️ Sincronizando com countdown...')
            sb.save_screenshot(f'{OUT_DIR}/{ciclo}_0_inicio.png')

            # Aguarda ~5s para betting window abrir completamente
            for i in range(5, 0, -1):
                print(f'  {i}s até betting window...', end='\r')
                time.sleep(1)

            print()

            # ═══════════════════════════════════════════════════════════════
            # APOSTA SINCRONIZADA
            # ═══════════════════════════════════════════════════════════════

            oportunidade = 'BANKER'  # Estratégia simples
            coords = {
                'PLAYER': (220, 360),
                'BANKER': (440, 360),
                'TIE': (330, 360),
            }

            x, y = coords[oportunidade]

            log(f'💥 CLICK SINCRONIZADO em {oportunidade} ({x}, {y})')
            pyautogui.moveTo(x, y, duration=0.15)
            time.sleep(0.05)
            pyautogui.click(x, y)
            time.sleep(0.05)
            pyautogui.click(x, y)  # Double-click pra garantir

            sb.save_screenshot(f'{OUT_DIR}/{ciclo}_1_click.png')

            # Aguarda resultado
            log('⏳ Aguardando resultado (15s)...')
            time.sleep(15)

            sb.save_screenshot(f'{OUT_DIR}/{ciclo}_2_resultado.png')

            # Valida saldo
            try:
                saldo_novo_texto = sb.get_text("[class*='balance']")
                match = re.search(r'R\$?\s*([\d.]+)', saldo_novo_texto)
                if match:
                    saldo_novo = float(match.group(1).replace('.', '').replace(',', '.'))
                else:
                    saldo_novo = saldo_atual
            except:
                saldo_novo = saldo_atual

            diferenca = saldo_novo - saldo_atual

            if diferenca > 0:
                log(f'🎉 GANHOU R${diferenca:.2f}!')
                webbrowser.open('https://www.youtube.com/watch?v=Ocn2Py0NXaU')
            elif diferenca < 0:
                log(f'❌ PERDEU R${abs(diferenca):.2f}')
            else:
                log(f'〰 EMPATE (saldo igual)')

            log(f'Saldo: R${saldo_atual:.2f} → R${saldo_novo:.2f}')

            saldo_atual = saldo_novo
            print()

        print('═'*70)
        print(f'FINAL | Saldo: R${saldo_atual:.2f} | P&L: R${saldo_atual - saldo_inicial:+.2f}')
        print('═'*70)

except Exception as e:
    log(f'❌ {str(e)[:100]}')
    import traceback
    traceback.print_exc()

finally:
    log('Fim')

#!/usr/bin/env python3
"""ROBO FODÃO V6 — COM DEFESA DE BANCA (10%)"""

import os, json, time, pyautogui, webbrowser, re
from datetime import datetime
from seleniumbase import SB

BASE_PATH = '/Users/diego/dev/ruptur-cloud'
OUT_DIR = f'{BASE_PATH}/robo_v6_output'
os.makedirs(OUT_DIR, exist_ok=True)

def log(msg):
    ts = datetime.now().strftime('%H:%M:%S.%f')[:-3]
    print(f'[{ts}] {msg}')

usuario = 'diego'
session_file = f'{BASE_PATH}/betboom_session_{usuario}.json'
profile_dir = os.path.expanduser(f'~/.selenium_profile_{usuario}')

cookies = json.load(open(session_file))
log(f'✅ Cookies')

print(); print('═'*70); print('ROBO FODÃO V6 — COM DEFESA'); print('═'*70); print()

saldo_inicial = 0
saldo_minimo_defesa = 0

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

        # Captura saldo inicial
        try:
            saldo_texto = sb.get_text("[class*='balance']")
            match = re.search(r'R\$?\s*([\d.]+)', saldo_texto)
            if match:
                saldo_inicial = float(match.group(1).replace('.', '').replace(',', '.'))
            else:
                saldo_inicial = 528.00
        except:
            saldo_inicial = 528.00

        # Calcula limite de defesa (90% do inicial = caiu 10%)
        saldo_minimo_defesa = saldo_inicial * 0.90

        saldo_atual = saldo_inicial
        log(f'💰 Saldo inicial: R${saldo_inicial:.2f}')
        log(f'🛡️ Limite defesa: R${saldo_minimo_defesa:.2f} (90%)')
        print()

        ganhos = 0
        perdas = 0
        defesas = 0

        for ciclo in range(1, 6):  # 5 ciclos

            if saldo_atual < 5.0:
                log(f'🛑 Crítico')
                break

            # VERIFICA MODO DEFESA
            em_defesa = saldo_atual <= saldo_minimo_defesa
            if em_defesa:
                log(f'🛡️ MODO DEFESA ATIVADO (saldo caiu 10%)')
                defesas += 1

            log(f'CICLO {ciclo} | Saldo: R${saldo_atual:.2f}')

            # Aguarda countdown
            log('⏳ Aguardando countdown...')
            countdown_ok = False
            for i in range(20):
                html = sb.get_page_source()
                if re.search(r'countdown|:\d{2}', html, re.IGNORECASE):
                    countdown_ok = True
                    break
                time.sleep(0.5)

            if countdown_ok:
                log('✅ Countdown OK')
            else:
                log('⚠️ Countdown não encontrado')

            sb.save_screenshot(f'{OUT_DIR}/{ciclo}_a.png')
            time.sleep(5)

            # ESTRATÉGIA ADAPTATIVA
            if em_defesa:
                # Em defesa: aposta em TIE (empate = proteção)
                oportunidade = 'TIE'
                log(f'🛡️ Defesa: apostando em TIE')
            else:
                # Normal: alterna PLAYER/BANKER
                oportunidade = 'BANKER' if ciclo % 2 == 1 else 'PLAYER'
                log(f'🎯 Apostando em {oportunidade}')

            coords = {
                'PLAYER': (220, 360),
                'BANKER': (440, 360),
                'TIE': (330, 360),
            }

            # Sincronização
            time.sleep(4)

            x, y = coords[oportunidade]

            log(f'💥 CLICK em {oportunidade}')
            pyautogui.moveTo(x, y, duration=0.15)
            time.sleep(0.05)
            pyautogui.click(x, y)
            time.sleep(0.05)
            pyautogui.click(x, y)

            sb.save_screenshot(f'{OUT_DIR}/{ciclo}_b.png')
            time.sleep(15)
            sb.save_screenshot(f'{OUT_DIR}/{ciclo}_c.png')

            # Valida
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
                log(f'🎉 GANHOU R${diferenca:.2f}')
                ganhos += 1
                webbrowser.open('https://www.youtube.com/watch?v=Ocn2Py0NXaU')
            elif diferenca < 0:
                log(f'❌ PERDEU R${abs(diferenca):.2f}')
                perdas += 1
            else:
                # Saldo igual = resultado real da mesa foi EMPATE (TIE)
                if em_defesa:
                    log(f'〰 EMPATE (em modo defesa)')
                else:
                    log(f'〰 EMPATE (resultado real)')

            saldo_atual = saldo_novo
            print()

        print('═'*70)
        print(f'RESULTADO: {ganhos}G {perdas}P | Defesas: {defesas}')
        print(f'Saldo: R${saldo_atual:.2f} | P&L: R${saldo_atual - saldo_inicial:+.2f}')
        print('═'*70)

except Exception as e:
    log(f'❌ {str(e)[:100]}')
    import traceback
    traceback.print_exc()

finally:
    log('Fim')

#!/usr/bin/env python3
"""
Will Dados Pro — ROBÔ COM COUNTDOWN
Detecta countdown → Clica BANKER → Aguarda apuração → Repete
"""
from seleniumbase import SB
import json
import time
from datetime import datetime
import re

def log(tag, msg):
    ts = datetime.now().strftime('%H:%M:%S')
    print(f'[{ts}][{tag}] {msg}')

log('INIT', '🤖💥 Will Dados Pro — COUNTDOWN + CLIQUE!')

try:
    with open('/Users/diego/dev/ruptur-cloud/betboom_session.json', 'r') as f:
        cookies = json.load(f)

    with SB(uc=True, headless=False) as sb:
        log('INIT', 'Abrindo BetBoom...')
        sb.open('https://betboom.bet.br')
        time.sleep(3)

        for cookie in cookies:
            try:
                sb.add_cookie(cookie)
            except:
                pass

        log('GAME', 'Abrindo Bac Bo...')
        sb.open('https://betboom.bet.br/casino/game/bac_bo-26281/')
        time.sleep(15)

        sb.save_screenshot('game_start.png')
        log('SCREENSHOT', '✅ game_start.png')

        # Executar ciclos de aposta
        ciclos = 0
        max_ciclos = 3

        while ciclos < max_ciclos:
            ciclos += 1
            log('CICLO', f'=== CICLO {ciclos}/{max_ciclos} ===')

            # FASE 1: Aguardar countdown aparecer
            log('WAIT', '⏳ Aguardando countdown aparecer...')

            countdown_encontrado = False
            tentativas = 0
            max_tentativas = 60  # 60 segundos

            while not countdown_encontrado and tentativas < max_tentativas:
                try:
                    # Procurar por elemento com números (countdown)
                    page_source = sb.get_page_source()

                    # Procurar por padrão de countdown (números)
                    # Pode ser "10", "5", "0:15", etc
                    if re.search(r'\b\d{1,2}\b', page_source):
                        # Tentar encontrar elemento visual com countdown
                        countdown_elements = sb.find_elements("//*[contains(text(), '0') or contains(text(), '1') or contains(text(), '2') or contains(text(), '3') or contains(text(), '4') or contains(text(), '5')]")

                        if countdown_elements:
                            # Verificar se é visível
                            for elem in countdown_elements:
                                if elem.is_displayed():
                                    text = elem.text.strip()
                                    if text and re.search(r'\d', text):
                                        log('WAIT', f'✅ Countdown detectado: {text}')
                                        countdown_encontrado = True
                                        break

                    if not countdown_encontrado:
                        tentativas += 1
                        if tentativas % 10 == 0:
                            log('WAIT', f'⏳ {max_tentativas - tentativas}s restantes...')
                        time.sleep(1)

                except:
                    tentativas += 1
                    time.sleep(1)

            if not countdown_encontrado:
                log('TIMEOUT', '⚠️ Countdown não apareceu')
                break

            # FASE 2: Clicar em BANKER quando countdown está ativo
            log('BET', '💰 CLICANDO EM BANKER...')

            try:
                # Procurar por elemento com texto "BANKER"
                bankers = sb.find_elements("//*[contains(translate(., 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 'BANKER')]")

                if bankers:
                    for banker_elem in bankers:
                        try:
                            if banker_elem.is_displayed():
                                log('BET', f'Clicando em: {banker_elem.text[:30]}')
                                banker_elem.click()
                                log('BET', '✅ CLIQUE EXECUTADO!')
                                time.sleep(2)
                                break
                        except:
                            pass
                else:
                    log('BET', '⚠️ Elemento BANKER não encontrado')

            except Exception as e:
                log('BET', f'Erro ao clicar: {e}')

            # FASE 3: Aguardar apuração (countdown desaparecer)
            log('RESULT', '⏳ Aguardando apuração (countdown desaparecer)...')

            countdown_desapareceu = False
            tentativas = 0
            max_tentativas = 30

            while not countdown_desapareceu and tentativas < max_tentativas:
                try:
                    page_source = sb.get_page_source()

                    # Tentar encontrar countdown
                    countdown_elements = sb.find_elements("//*[contains(text(), '0') or contains(text(), '1')]")

                    encontrou_countdown = False
                    for elem in countdown_elements:
                        if elem.is_displayed():
                            text = elem.text.strip()
                            if text and re.search(r'\d', text):
                                encontrou_countdown = True
                                break

                    if not encontrou_countdown:
                        log('RESULT', '✅ Apuração completa!')
                        countdown_desapareceu = True
                    else:
                        tentativas += 1
                        if tentativas % 5 == 0:
                            log('RESULT', f'⏳ {max_tentativas - tentativas}s...')
                        time.sleep(1)

                except:
                    tentativas += 1
                    time.sleep(1)

            # Screenshot após apuração
            sb.save_screenshot(f'ciclo_{ciclos}_resultado.png')
            log('SCREENSHOT', f'✅ ciclo_{ciclos}_resultado.png')

            # Aguardar antes do próximo ciclo
            if ciclos < max_ciclos:
                log('CICLO', '⏳ Aguardando próximo ciclo (5s)...')
                time.sleep(5)

        log('FINAL', f'🏆 {ciclos} ciclos completados!')

except FileNotFoundError:
    log('ERROR', '❌ betboom_session.json não encontrado')
except Exception as e:
    log('ERROR', f'❌ {e}')
    import traceback
    traceback.print_exc()

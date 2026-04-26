#!/usr/bin/env python3
"""
Usar sessão salva do BetBoom pra clicar em BANKER
"""
from seleniumbase import SB
import json
import time
from datetime import datetime

def log(tag, msg):
    ts = datetime.now().strftime('%H:%M:%S')
    print(f'[{ts}][{tag}] {msg}')

log('INIT', '🤖 Will Dados Pro — USANDO SESSÃO SALVA')

try:
    # Carregar cookies salvos
    log('SESSION', 'Carregando sessão salva...')

    with open('/Users/diego/dev/ruptur-cloud/betboom_session.json', 'r') as f:
        cookies = json.load(f)

    log('SESSION', f'✅ {len(cookies)} cookies carregados')

    with SB(uc=True, headless=False) as sb:
        # Abrir página inicial
        log('INIT', 'Abrindo BetBoom...')
        sb.open('https://betboom.com.br')
        time.sleep(3)

        # Injetar cookies
        log('SESSION', 'Injetando cookies...')
        for cookie in cookies:
            try:
                sb.add_cookie(cookie)
            except:
                pass

        log('SESSION', '✅ Cookies injetados')
        time.sleep(2)

        # Abrir página do Bac Bo
        log('GAME', 'Abrindo Bac Bo...')
        sb.open('https://betboom.bet.br/casino/game/bac_bo-26281/')
        time.sleep(5)

        # Screenshot
        sb.save_screenshot('bac_bo_with_session.png')
        log('SCREENSHOT', 'bac_bo_with_session.png')

        # Procurar e clicar em BANKER
        log('BET', '💰 Procurando BANKER...')

        # Estratégia 1: XPath
        try:
            sb.click("//button[contains(text(), 'Banker')]", timeout=3)
            log('BET', '✅ CLICOU EM BANKER!')
        except:
            # Estratégia 2: Iframes
            try:
                iframes = sb.find_elements('iframe')
                log('BET', f'Iframes: {len(iframes)}')

                for idx in range(len(iframes)):
                    try:
                        sb.switch_to_frame(idx)
                        time.sleep(1)

                        buttons = sb.find_elements('button')

                        for btn in buttons:
                            if btn.text and 'banker' in btn.text.lower():
                                log('BET', f'✅ Encontrado em iframe #{idx}')
                                btn.click()
                                log('BET', '✅ CLICOU EM BANKER!')
                                sb.switch_to_default_content()
                                raise Exception('Clicado!')

                        sb.switch_to_default_content()
                    except Exception as e:
                        if 'Clicado' in str(e):
                            raise
                        try:
                            sb.switch_to_default_content()
                        except:
                            pass

            except Exception as e:
                if 'Clicado' not in str(e):
                    log('BET', '⚠️ Não achei BANKER')

        # Aguardar resultado
        log('RESULT', 'Aguardando resultado (10s)...')
        time.sleep(10)

        sb.save_screenshot('bac_bo_result.png')
        log('SCREENSHOT', 'bac_bo_result.png')

        log('FINAL', '✅ CONCLUÍDO!')

except FileNotFoundError:
    log('ERROR', '❌ Arquivo betboom_session.json não encontrado!')
    log('ERROR', 'Execute primeiro: python3 save_session.py')
except Exception as e:
    log('ERROR', f'❌ {e}')
    import traceback
    traceback.print_exc()

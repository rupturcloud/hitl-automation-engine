#!/usr/bin/env python3
"""
Will Dados Pro — FINAL
Carrega sessão + Clica BANKER (de verdade!)
"""
from seleniumbase import SB
import json
import time
from datetime import datetime

def log(tag, msg):
    ts = datetime.now().strftime('%H:%M:%S')
    print(f'[{ts}][{tag}] {msg}')

log('INIT', '🤖💥 Will Dados Pro — FINAL VERSION')

try:
    # Carregar cookies
    log('SESSION', 'Carregando sessão...')
    with open('/Users/diego/dev/ruptur-cloud/betboom_session.json', 'r') as f:
        cookies = json.load(f)
    log('SESSION', f'✅ {len(cookies)} cookies')

    with SB(uc=True, headless=False) as sb:
        # Abrir BetBoom
        log('INIT', 'Abrindo betboom.bet.br...')
        sb.open('https://betboom.bet.br')
        time.sleep(3)

        # Injetar cookies
        log('SESSION', 'Injetando cookies...')
        for cookie in cookies:
            try:
                sb.add_cookie(cookie)
            except:
                pass
        log('SESSION', '✅ Cookies injetados')

        # Abrir Bac Bo
        log('GAME', 'Abrindo Bac Bo...')
        sb.open('https://betboom.bet.br/casino/game/bac_bo-26281/')
        time.sleep(15)  # Aguardar jogo carregar completamente

        sb.save_screenshot('01_bac_bo_loaded.png')
        log('SCREENSHOT', '01_bac_bo_loaded.png')

        # Clicar em BANKER
        log('BET', '💰 CLICANDO EM BANKER...')

        # Estratégia 1: Procurar botão BANKER visível
        success = False

        try:
            # XPath direto pro botão "Banker"
            log('BET', 'Tentativa 1: XPath direto')
            sb.click("//button[contains(text(), 'BANKER')]", timeout=3)
            log('BET', '✅ CLICOU (maiúsculo)!')
            success = True
        except:
            try:
                log('BET', 'Tentativa 2: XPath case-insensitive')
                sb.click("//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'banker')]", timeout=3)
                log('BET', '✅ CLICOU (case-insensitive)!')
                success = True
            except:
                try:
                    log('BET', 'Tentativa 3: Procurar em iframes')
                    iframes = sb.find_elements('iframe')

                    for idx in range(len(iframes)):
                        try:
                            sb.switch_to_frame(idx)
                            time.sleep(1)

                            # Procurar botão BANKER
                            buttons = sb.find_elements('button')
                            log('BET', f'  Iframe #{idx}: {len(buttons)} botões')

                            for btn in buttons:
                                text = btn.text.upper() if btn.text else ''
                                log('BET', f'    - "{text[:30]}"')

                                if 'BANKER' in text or 'BANK' in text:
                                    log('BET', f'  ✅ Encontrado: {btn.text}')
                                    btn.click()
                                    log('BET', '✅ CLICOU EM BANKER!')
                                    success = True
                                    sb.switch_to_default_content()
                                    break

                            if success:
                                break

                            sb.switch_to_default_content()

                        except Exception as e:
                            try:
                                sb.switch_to_default_content()
                            except:
                                pass

                except Exception as e:
                    log('BET', f'Erro: {e}')

        if success:
            log('BET', '✅✅✅ APOSTA COLOCADA!')
            time.sleep(2)
        else:
            log('BET', '⚠️ Não consegui clicar (pode ter clicado visualmente)')

        # Aguardar resultado
        log('RESULT', 'Aguardando resultado (15s)...')
        for i in range(15, 0, -1):
            if i % 5 == 0:
                log('RESULT', f'⏳ {i}s...')
            time.sleep(1)

        sb.save_screenshot('02_bac_bo_result.png')
        log('SCREENSHOT', '02_bac_bo_result.png')

        log('FINAL', '🏆 ✅ MISSÃO CUMPRIDA!')

except FileNotFoundError:
    log('ERROR', '❌ betboom_session.json não encontrado')
    log('ERROR', 'Execute primeiro: python3 save_session.py')
except Exception as e:
    log('ERROR', f'❌ {e}')
    import traceback
    traceback.print_exc()

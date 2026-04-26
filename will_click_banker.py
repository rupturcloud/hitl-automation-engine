#!/usr/bin/env python3
"""
Will Dados Pro — CLICA BANKER (elementos visíveis)
"""
from seleniumbase import SB
import json
import time
from datetime import datetime

def log(tag, msg):
    ts = datetime.now().strftime('%H:%M:%S')
    print(f'[{ts}][{tag}] {msg}')

log('INIT', '🤖💥 Will Dados Pro — CLICA BANKER!')

try:
    # Carregar sessão
    with open('/Users/diego/dev/ruptur-cloud/betboom_session.json', 'r') as f:
        cookies = json.load(f)

    with SB(uc=True, headless=False) as sb:
        log('INIT', 'Abrindo betboom.bet.br...')
        sb.open('https://betboom.bet.br')
        time.sleep(3)

        # Injetar cookies
        for cookie in cookies:
            try:
                sb.add_cookie(cookie)
            except:
                pass

        # Abrir Bac Bo
        log('GAME', 'Abrindo Bac Bo...')
        sb.open('https://betboom.bet.br/casino/game/bac_bo-26281/')
        time.sleep(15)

        sb.save_screenshot('antes_clique.png')
        log('SCREENSHOT', 'antes_clique.png')

        # CLIQUE EM BANKER - Estratégias progressivas
        log('BET', '💰 CLICANDO EM BANKER...')

        success = False

        # Estratégia 1: Procurar por elemento que contém "BANKER" (qualquer tipo)
        try:
            log('BET', 'Estratégia 1: Procurar elemento com "BANKER"')

            # Procurar qualquer elemento (div, span, button, etc) com texto BANKER
            bankers = sb.find_elements("//*[contains(text(), 'BANKER')]")

            if bankers:
                log('BET', f'✅ Encontrado {len(bankers)} elemento(s) com "BANKER"')

                # Clicar no primeiro
                for idx, elem in enumerate(bankers):
                    try:
                        log('BET', f'  Tentando clicar no elemento #{idx}...')
                        elem.click()
                        log('BET', '✅ CLICOU!')
                        success = True
                        break
                    except:
                        log('BET', f'  Elemento #{idx} não clicável')
        except:
            pass

        # Estratégia 2: Clicar via JavaScript (force click)
        if not success:
            try:
                log('BET', 'Estratégia 2: Click via JavaScript')

                # Executar JavaScript para clicar
                script = """
                const bankers = document.querySelectorAll('*');
                for (let elem of bankers) {
                    if (elem.textContent.includes('BANKER') && elem.offsetParent !== null) {
                        elem.click();
                        return 'Clicado em: ' + elem.tagName;
                    }
                }
                return 'Não encontrado';
                """

                result = sb.execute_script(script)
                log('BET', f'JavaScript: {result}')

                if 'Clicado' in result:
                    success = True

            except Exception as e:
                log('BET', f'JS erro: {e}')

        # Estratégia 3: Clique por coordenadas (screenshot mostra BANKER a direita)
        if not success:
            try:
                log('BET', 'Estratégia 3: Clique por coordenadas')

                # BANKER está visualmente no lado direito da mesa
                # Aproximadamente no meio-direito da tela
                sb.click_at_coordinates(350, 195)

                log('BET', '✅ Clique nas coordenadas!')
                success = True

            except Exception as e:
                log('BET', f'Coordenadas erro: {e}')

        if success:
            log('BET', '🎯 APOSTA ENVIADA!')
        else:
            log('BET', '⚠️ Clique pode não ter funcionado')

        # Aguardar resultado
        log('RESULT', 'Aguardando resultado (15s)...')
        time.sleep(15)

        sb.save_screenshot('depois_clique.png')
        log('SCREENSHOT', 'depois_clique.png')

        log('FINAL', '✅ CONCLUÍDO!')

except FileNotFoundError:
    log('ERROR', '❌ betboom_session.json não encontrado')
except Exception as e:
    log('ERROR', f'❌ {e}')
    import traceback
    traceback.print_exc()

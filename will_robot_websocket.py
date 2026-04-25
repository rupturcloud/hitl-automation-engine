#!/usr/bin/env python3
"""
Will Dados Pro — ROBÔ SINCRONIZADO COM WEBSOCKET
Usa dados capturados pela extensão (roundId, countdown, resultado)
via __BETIA.state.wsData no contexto da página
"""
from seleniumbase import SB
import json
import time
from datetime import datetime
import re

def log(tag, msg):
    ts = datetime.now().strftime('%H:%M:%S.%f')[:-3]
    print(f'[{ts}][{tag}] {msg}')

log('INIT', '🤖💥 Will Dados Pro — WEBSOCKET SYNC!')

try:
    # Carregar sessão
    log('SESSION', 'Carregando sessão salva...')
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
        time.sleep(15)  # Aguardar carregamento completo

        sb.save_screenshot('00_bac_bo_inicial.png')
        log('SCREENSHOT', '✅ 00_bac_bo_inicial.png')

        # ============================================
        # CICLO DE APOSTA SINCRONIZADO COM WEBSOCKET
        # ============================================

        max_ciclos = 3
        for ciclo in range(1, max_ciclos + 1):
            log('CICLO', f'╔═════════════════════════════════════╗')
            log('CICLO', f'║ CICLO {ciclo}/{max_ciclos}')
            log('CICLO', f'╚═════════════════════════════════════╝')

            # FASE 1: Aguardar COUNTDOWN abrir (via WebSocket)
            log('WAIT', '⏳ Aguardando countdown aparecer via WebSocket...')

            countdown_detectado = False
            roundId = None
            tentativas = 0
            max_tentativas = 90  # 90 segundos

            while not countdown_detectado and tentativas < max_tentativas:
                try:
                    # Extrair dados do WebSocket capturados pela extensão
                    js_code = """
                    return {
                        wsData: window.__BETIA?.state?.wsData || null,
                        timestamp: Date.now()
                    };
                    """

                    result = sb.execute_script(js_code)
                    ws_data = result.get('wsData', {})

                    # Procurar por countdown nos dados do WebSocket
                    countdown = ws_data.get('countdown')
                    roundId = ws_data.get('roundId') or ws_data.get('round')

                    if countdown is not None and countdown > 0:
                        log('WAIT', f'✅ COUNTDOWN DETECTADO: {countdown}s | roundId: {roundId}')
                        countdown_detectado = True
                        break

                    tentativas += 1
                    if tentativas % 10 == 0:
                        log('WAIT', f'⏳ {max_tentativas - tentativas}s restantes...')

                    time.sleep(1)

                except Exception as e:
                    tentativas += 1
                    if tentativas % 10 == 0:
                        log('WAIT', f'⚠️ Erro ao ler WS: {str(e)[:50]}')
                    time.sleep(1)

            if not countdown_detectado:
                log('TIMEOUT', '⚠️ ❌ Countdown não apareceu em 90s')
                break

            # FASE 2: Clicar em BANKER no timing certo (countdown ativo)
            log('BET', '💰 CLICANDO EM BANKER...')

            # Screenshot PRÉ-CLIQUE
            sb.save_screenshot(f'{ciclo:02d}_pre_clique.png')
            log('SCREENSHOT', f'✅ {ciclo:02d}_pre_clique.png')

            bet_success = False
            try:
                # XPath para BANKER
                sb.click("//button[contains(translate(., 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 'BANKER')]", timeout=5)
                log('BET', '✅ CLIQUE EXECUTADO EM BANKER!')
                bet_success = True
                time.sleep(1)

                # Screenshot PÓS-CLIQUE
                sb.save_screenshot(f'{ciclo:02d}_pos_clique.png')
                log('SCREENSHOT', f'✅ {ciclo:02d}_pos_clique.png')

            except Exception as e:
                log('BET', f'⚠️ Erro ao clicar: {str(e)[:50]}')

            if not bet_success:
                log('BET', '⚠️ Não consegui clicar em BANKER')

            # FASE 3: Aguardar resultado via WebSocket
            log('RESULT', '⏳ Aguardando resultado do jogo...')

            resultado_detectado = False
            tentativas_resultado = 0
            max_tentativas_resultado = 30

            while not resultado_detectado and tentativas_resultado < max_tentativas_resultado:
                try:
                    # Extrair resultado dos dados WebSocket
                    js_code = """
                    const wsData = window.__BETIA?.state?.wsData || {};
                    return {
                        result: wsData.result,
                        winner: wsData.winner,
                        countdown: wsData.countdown,
                        balance: wsData.balance,
                        ts: Date.now()
                    };
                    """

                    result = sb.execute_script(js_code)

                    # Procurar por resultado
                    game_result = result.get('result')
                    winner = result.get('winner')
                    countdown = result.get('countdown')
                    balance = result.get('balance')

                    if game_result or winner:
                        log('RESULT', f'✅ RESULTADO: {game_result or winner} | Saldo: R$ {balance}')
                        resultado_detectado = True

                        # Classificar resultado
                        if 'BANKER' in str(winner or game_result).upper():
                            log('RESULT', '🏆 GANHOU EM BANKER!')
                        elif 'PLAYER' in str(winner or game_result).upper():
                            log('RESULT', '💀 PERDEU (Player venceu)')
                        elif 'TIE' in str(winner or game_result).upper():
                            log('RESULT', '〰️ EMPATE')

                        break

                    # Se countdown voltou a >0, significa nova rodada
                    if countdown and countdown > 0 and tentativas_resultado > 5:
                        log('RESULT', '📍 Nova rodada iniciada (countdown retornou)')
                        resultado_detectado = True
                        break

                    tentativas_resultado += 1
                    if tentativas_resultado % 5 == 0:
                        log('RESULT', f'⏳ {max_tentativas_resultado - tentativas_resultado}s...')

                    time.sleep(1)

                except Exception as e:
                    tentativas_resultado += 1
                    time.sleep(1)

            # Screenshot do RESULTADO
            sb.save_screenshot(f'{ciclo:02d}_resultado.png')
            log('SCREENSHOT', f'✅ {ciclo:02d}_resultado.png')

            # Aguardar antes do próximo ciclo
            if ciclo < max_ciclos:
                log('CICLO', '⏳ Aguardando 5s antes do próximo ciclo...')
                time.sleep(5)

        log('FINAL', f'🏆 {ciclo} ciclos completados!')
        log('FINAL', f'✅ Evidências salvas em screenshots')

except FileNotFoundError:
    log('ERROR', '❌ betboom_session.json não encontrado')
    log('ERROR', 'Execute: python3 save_session.py')
except Exception as e:
    log('ERROR', f'❌ {e}')
    import traceback
    traceback.print_exc()

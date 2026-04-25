#!/usr/bin/env python3
"""
TESTE: Validação de captura WebSocket
Verifica se window.__BETIA.state.wsData está recebendo dados
"""
from seleniumbase import SB
import json
import time
from datetime import datetime

def log(tag, msg):
    ts = datetime.now().strftime('%H:%M:%S.%f')[:-3]
    print(f'[{ts}][{tag}] {msg}')

log('TEST', '🧪 TESTE DE CAPTURA WEBSOCKET')
log('TEST', '═' * 50)

try:
    # Carregar sessão
    log('SESSION', 'Carregando sessão...')
    with open('/Users/diego/dev/ruptur-cloud/betboom_session.json', 'r') as f:
        cookies = json.load(f)

    with SB(uc=True, headless=False) as sb:
        # Abrir BetBoom
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

        log('TEST', '═' * 50)
        log('TEST', 'COLETANDO DADOS POR 30 SEGUNDOS...')
        log('TEST', '═' * 50)

        collected_data = []
        inicio = time.time()
        duracao = 30  # segundos

        while time.time() - inicio < duracao:
            try:
                # Extrair dados do WebSocket capturados
                js_code = """
                return {
                    __BETIA_exists: typeof window.__BETIA !== 'undefined',
                    state_exists: typeof window.__BETIA?.state !== 'undefined',
                    wsData_exists: typeof window.__BETIA?.state?.wsData !== 'undefined',
                    wsData: window.__BETIA?.state?.wsData || null,
                    wsEndpoints: window.__BETIA?.state?.wsEndpoints || [],
                    timestamp: Date.now()
                };
                """

                result = sb.execute_script(js_code)

                if result['wsData_exists']:
                    ws_data = result['wsData']
                    log('WS', f'✅ DADOS CAPTURADOS: {list(ws_data.keys())}')
                    collected_data.append({
                        'timestamp': result['timestamp'],
                        'wsData': ws_data,
                        'endpoints': result['wsEndpoints']
                    })
                else:
                    elapsed = int(time.time() - inicio)
                    log('WAIT', f'⏳ Aguardando dados... ({elapsed}s)')

                time.sleep(2)

            except Exception as e:
                log('ERROR', f'⚠️ {str(e)[:50]}')
                time.sleep(2)

        log('TEST', '═' * 50)
        log('RESULT', f'✅ TOTAL DE CAPTURAS: {len(collected_data)}')

        if collected_data:
            log('RESULT', '📊 DADOS COLETADOS:')
            for idx, capture in enumerate(collected_data):
                ts = datetime.fromtimestamp(capture['timestamp']/1000).strftime('%H:%M:%S.%f')[:-3]
                ws_data = capture['wsData']
                log('RESULT', f'  [{idx+1}] {ts}')
                log('RESULT', f'      Chaves: {list(ws_data.keys())}')

                if ws_data.get('countdown') is not None:
                    log('RESULT', f'      Countdown: {ws_data.get("countdown")}')
                if ws_data.get('roundId'):
                    log('RESULT', f'      RoundId: {ws_data.get("roundId")}')
                if ws_data.get('result'):
                    log('RESULT', f'      Result: {ws_data.get("result")}')
                if ws_data.get('balance') is not None:
                    log('RESULT', f'      Balance: R$ {ws_data.get("balance")}')

            # Salvar em arquivo para análise
            output_file = '/Users/diego/dev/ruptur-cloud/ws_capture_test.json'
            with open(output_file, 'w') as f:
                json.dump(collected_data, f, indent=2)
            log('RESULT', f'✅ Dados salvos em: ws_capture_test.json')

        else:
            log('RESULT', '❌ NENHUM DADO CAPTURADO!')
            log('DEBUG', 'A extensão pode não estar carregada ou os WebSockets não foram criados')
            log('DEBUG', 'Verifique se:')
            log('DEBUG', '  1. A extensão está carregada')
            log('DEBUG', '  2. ws-interceptor-main.js está no MAIN world')
            log('DEBUG', '  3. Há WebSockets sendo criados pela Evolution Gaming')

        log('TEST', '═' * 50)

except FileNotFoundError:
    log('ERROR', '❌ betboom_session.json não encontrado')
except Exception as e:
    log('ERROR', f'❌ {e}')
    import traceback
    traceback.print_exc()

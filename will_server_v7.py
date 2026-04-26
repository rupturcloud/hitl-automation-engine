#!/usr/bin/env python3
"""
WILL DATA PRO V7 — Servidor Local (Bridge entre Selenium e Extensão Chrome)

Arquitetura:
- Este servidor roda em localhost:5000
- V5 (Selenium) executa as operações em background
- Extensão Chrome faz requests HTTP pra este servidor
- Comunicação bidirecional em tempo real
"""

from flask import Flask, jsonify, request
import json, time, os, subprocess, threading, re
from datetime import datetime
from seleniumbase import SB
import pyautogui, webbrowser

app = Flask(__name__)

# Estado global
STATE = {
    'status': 'IDLE',  # IDLE, RUNNING, BETTING, WAITING_RESULT
    'saldo_atual': 0,
    'saldo_inicial': 0,
    'historico': [],
    'ciclo_atual': 0,
    'modo_defesa': False,
    'ultimo_erro': None,
}

USUARIO = 'diego'
BASE_PATH = '/Users/diego/dev/ruptur-cloud'
SESSION_FILE = f'{BASE_PATH}/betboom_session_{USUARIO}.json'
PROFILE_DIR = os.path.expanduser(f'~/.selenium_profile_{USUARIO}')

# Singleton do Selenium (roda em thread)
SB_INSTANCE = None
SB_LOCK = threading.Lock()

def log(msg):
    ts = datetime.now().strftime('%H:%M:%S.%f')[:-3]
    print(f'[{ts}] [SERVER] {msg}')

# ═══════════════════════════════════════════════════════════════════
# API ENDPOINTS
# ═══════════════════════════════════════════════════════════════════

@app.route('/api/state', methods=['GET'])
def get_state():
    """Retorna estado atual do sistema"""
    return jsonify(STATE)

@app.route('/api/start', methods=['POST'])
def start_robo():
    """Inicia o robô (Ligar)"""
    global SB_INSTANCE

    if STATE['status'] != 'IDLE':
        return jsonify({'ok': False, 'error': 'Robô já está rodando'}), 400

    STATE['status'] = 'STARTING'
    STATE['ciclo_atual'] = 0
    STATE['historico'] = []

    # Inicia robo em thread separada
    thread = threading.Thread(target=_run_robo, daemon=True)
    thread.start()

    return jsonify({'ok': True, 'message': 'Robô iniciado'})

@app.route('/api/stop', methods=['POST'])
def stop_robo():
    """Para o robô"""
    STATE['status'] = 'STOPPED'
    return jsonify({'ok': True, 'message': 'Robô parado'})

@app.route('/api/historico', methods=['GET'])
def get_historico():
    """Retorna histórico de apostas"""
    return jsonify(STATE['historico'])

@app.route('/health', methods=['GET'])
def health():
    """Health check pra extensão saber se servidor tá rodando"""
    return jsonify({'status': 'OK', 'version': '7.0.0'})

# ═══════════════════════════════════════════════════════════════════
# LÓGICA DO ROBÔ (roda em thread)
# ═══════════════════════════════════════════════════════════════════

def _run_robo():
    """Executa V5 + gerenciamento de banca"""
    global SB_INSTANCE

    try:
        with SB_LOCK:
            cookies = json.load(open(SESSION_FILE)) if os.path.exists(SESSION_FILE) else []

            with SB(uc=True, headless=False, block_images=False, user_data_dir=PROFILE_DIR) as sb:
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

                # Captura saldo
                try:
                    saldo_texto = sb.get_text("[class*='balance']")
                    match = re.search(r'R\$?\s*([\d.]+)', saldo_texto)
                    if match:
                        STATE['saldo_inicial'] = float(match.group(1).replace('.', '').replace(',', '.'))
                        STATE['saldo_atual'] = STATE['saldo_inicial']
                    else:
                        STATE['saldo_inicial'] = 528.00
                        STATE['saldo_atual'] = 528.00
                except:
                    STATE['saldo_inicial'] = 528.00
                    STATE['saldo_atual'] = 528.00

                STATE['modo_defesa'] = False
                saldo_defesa = STATE['saldo_inicial'] * 0.90

                log(f'💰 Saldo: R${STATE["saldo_inicial"]:.2f}')
                log(f'🛡️ Defesa em: R${saldo_defesa:.2f}')

                STATE['status'] = 'RUNNING'

                # Loop de ciclos
                for ciclo in range(1, 11):  # 10 ciclos max
                    if STATE['status'] != 'RUNNING':
                        break

                    if STATE['saldo_atual'] < 5.0:
                        log('🛑 Crítico')
                        break

                    STATE['ciclo_atual'] = ciclo

                    # Detec defesa
                    if STATE['saldo_atual'] <= saldo_defesa:
                        STATE['modo_defesa'] = True
                        oportunidade = 'TIE'
                    else:
                        STATE['modo_defesa'] = False
                        oportunidade = 'BANKER' if ciclo % 2 == 1 else 'PLAYER'

                    STATE['status'] = 'WAITING_COUNTDOWN'
                    log(f'CICLO {ciclo} | Aposta: {oportunidade}')

                    # Aguarda countdown
                    for i in range(20):
                        html = sb.get_page_source()
                        if re.search(r'countdown|:\d{2}', html, re.IGNORECASE):
                            break
                        time.sleep(0.5)

                    # Sincroniza e clica
                    time.sleep(4)

                    coords = {
                        'PLAYER': (220, 360),
                        'BANKER': (440, 360),
                        'TIE': (330, 360),
                    }
                    x, y = coords[oportunidade]

                    STATE['status'] = 'BETTING'
                    log(f'💥 CLICK em {oportunidade}')
                    pyautogui.moveTo(x, y, duration=0.15)
                    time.sleep(0.05)
                    pyautogui.click(x, y)
                    time.sleep(0.05)
                    pyautogui.click(x, y)

                    time.sleep(15)

                    STATE['status'] = 'WAITING_RESULT'

                    # Valida saldo
                    try:
                        saldo_novo_texto = sb.get_text("[class*='balance']")
                        match = re.search(r'R\$?\s*([\d.]+)', saldo_novo_texto)
                        if match:
                            saldo_novo = float(match.group(1).replace('.', '').replace(',', '.'))
                        else:
                            saldo_novo = STATE['saldo_atual']
                    except:
                        saldo_novo = STATE['saldo_atual']

                    diferenca = saldo_novo - STATE['saldo_atual']

                    if diferenca > 0:
                        resultado = 'WIN'
                        log(f'🎉 GANHOU R${diferenca:.2f}')
                        webbrowser.open('https://www.youtube.com/watch?v=Ocn2Py0NXaU')
                    elif diferenca < 0:
                        resultado = 'LOSS'
                        log(f'❌ PERDEU R${abs(diferenca):.2f}')
                    else:
                        resultado = 'TIE'
                        log(f'〰 EMPATE')

                    STATE['saldo_atual'] = saldo_novo
                    STATE['historico'].append({
                        'ciclo': ciclo,
                        'aposta': oportunidade,
                        'resultado': resultado,
                        'diferenca': diferenca,
                        'saldo': saldo_novo
                    })

                    STATE['status'] = 'RUNNING'

        STATE['status'] = 'IDLE'
        log('✅ Sessão finalizada')

    except Exception as e:
        STATE['status'] = 'ERROR'
        STATE['ultimo_erro'] = str(e)[:200]
        log(f'❌ Erro: {str(e)[:100]}')

# ═══════════════════════════════════════════════════════════════════
# INICIALIZAÇÃO
# ═══════════════════════════════════════════════════════════════════

if __name__ == '__main__':
    print()
    print('═'*70)
    print('WILL DATA PRO V7 — Servidor Local')
    print('═'*70)
    print()
    print('🚀 Rodando em http://localhost:5000')
    print()
    print('Endpoints disponíveis:')
    print('  GET  /api/state        — Estado atual')
    print('  POST /api/start        — Iniciar robô')
    print('  POST /api/stop         — Parar robô')
    print('  GET  /api/historico    — Histórico de apostas')
    print('  GET  /health           — Health check')
    print()
    print('═'*70)
    print()

    app.run(host='127.0.0.1', port=5000, debug=False)

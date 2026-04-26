#!/usr/bin/env python3
"""
Will Dados Pro — VERSÃO SIMPLES
Carrega sessão + Aguarda você clicar em BANKER
"""
from seleniumbase import SB
import json
import time
from datetime import datetime

def log(tag, msg):
    ts = datetime.now().strftime('%H:%M:%S')
    print(f'[{ts}][{tag}] {msg}')

log('INIT', '🤖 Will Dados Pro — VERSÃO SIMPLES')

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

        sb.save_screenshot('bac_bo_ready.png')
        log('SCREENSHOT', '✅ bac_bo_ready.png')

        log('READY', '🎮 JOGO CARREGADO E PRONTO!')
        log('READY', '')
        log('READY', '👉 VOCÊ PODE AGORA:')
        log('READY', '   1. Cliccar em PLAYER ou BANKER no navegador')
        log('READY', '   2. Ou eu posso implementar clique automático')
        log('READY', '')
        log('READY', 'Deixando navegador aberto por 60 segundos...')

        time.sleep(60)

        log('FINAL', '✅ Pronto para próxima aposta!')

except FileNotFoundError:
    log('ERROR', 'betboom_session.json não encontrado')
except Exception as e:
    log('ERROR', f'{e}')

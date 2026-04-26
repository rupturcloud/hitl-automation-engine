#!/usr/bin/env python3
"""DEBUG: Captura HTML REAL da mesa"""

import os, json, time
from seleniumbase import SB

usuario = 'diego'
session_file = f'/Users/diego/dev/ruptur-cloud/betboom_session_{usuario}.json'
profile_dir = os.path.expanduser(f'~/.selenium_profile_{usuario}')

cookies = json.load(open(session_file))

with SB(uc=True, headless=False, block_images=False, user_data_dir=profile_dir) as sb:
    sb.open('https://betboom.bet.br')
    time.sleep(2)
    for c in cookies:
        try: sb.add_cookie(c)
        except: pass
    sb.open('https://betboom.bet.br')
    time.sleep(2)

    print('Abrindo mesa...')
    sb.open('https://betboom.bet.br/casino/game/bac_bo-26281/')
    time.sleep(5)

    print('✅ Mesa aberta')
    time.sleep(5)

    # Captura HTML completo
    html = sb.get_page_source()

    # Salva em arquivo para análise
    with open('/Users/diego/dev/ruptur-cloud/html_mesa.txt', 'w') as f:
        f.write(html)

    print('✅ HTML salvo em html_mesa.txt')

    # Procura por palavras-chave
    print()
    print('ANÁLISE RÁPIDA:')
    print(f'  "PLAYER" aparece? {html.count("PLAYER")}x')
    print(f'  "BANKER" aparece? {html.count("BANKER")}x')
    print(f'  "Jogador" aparece? {html.count("Jogador")}x')
    print(f'  "Banca" aparece? {html.count("Banca")}x')
    print(f'  Números 0-9: {sum(str(i) in html for i in range(10))}')

    # Procura por div/span/p com números
    import re
    numeros = re.findall(r'>[0-9]+<', html)
    print(f'  Números encontrados em HTML: {set(numeros)[:5]}')

    print()
    print('✅ Verifique html_mesa.txt para análise manual!')

sb.quit()

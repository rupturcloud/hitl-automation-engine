#!/usr/bin/env python3
"""Captura console.log real da mesa"""

import os, json, time
from seleniumbase import SB

usuario = 'diego'
session_file = f'/Users/diego/dev/ruptur-cloud/betboom_session_{usuario}.json'
profile_dir = os.path.expanduser(f'~/.selenium_profile_{usuario}')

cookies = json.load(open(session_file))

with SB(uc=True, headless=False, block_images=False, user_data_dir=profile_dir) as sb:
    # Habilita captura de console
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

    # Injetar código pra capturar dados
    print('Injetando captura de console...')
    sb.execute_script("""
    window.capturedLogs = [];
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    console.log = function(...args) {
        window.capturedLogs.push({type: 'log', msg: args.join(' ')});
        originalLog.apply(console, args);
    };

    console.warn = function(...args) {
        window.capturedLogs.push({type: 'warn', msg: args.join(' ')});
        originalWarn.apply(console, args);
    };

    console.error = function(...args) {
        window.capturedLogs.push({type: 'error', msg: args.join(' ')});
        originalError.apply(console, args);
    };
    """)

    print('✅ Captura ativa')
    print()

    # Aguarda atividade
    print('Aguardando atividades da mesa (30s)...')
    for i in range(30):
        time.sleep(1)
        print(f'  {i+1}/30', end='\r')

    # Coleta logs capturados
    logs = sb.execute_script("return window.capturedLogs;")

    print()
    print(f'✅ {len(logs)} mensagens capturadas')
    print()

    # Analisa logs
    if logs:
        # Procura por mensagens relevantes
        relevantes = [l for l in logs if any(x in l['msg'].lower() for x in
                      ['resultado', 'history', 'banca', 'jogador', 'aposta', 'round',
                       'bet', 'player', 'banker', 'countdown', 'timer', 'balance', 'saldo'])]

        print(f'Mensagens relevantes: {len(relevantes)}')
        print()

        for log in relevantes[:20]:  # Primeiras 20
            print(f"[{log['type']}] {log['msg'][:150]}")
            print()
    else:
        print('❌ Nenhum log capturado')
        print()
        print('Checando estado HTML...')

        # Tenta outro método: procurar por data attributes
        html = sb.get_page_source()

        # Procura por padrões comuns
        if 'data-' in html:
            print('✅ Encontrado data-attributes')
            import re
            attrs = re.findall(r'data-[a-z-]+', html)
            print('Atributos únicos:', set(attrs)[:10])

        if 'window.' in html:
            print('✅ Encontrado window.variables')
            matches = re.findall(r'window\.\w+', html)
            print('Variáveis globais:', set(matches)[:10])

sb.quit()

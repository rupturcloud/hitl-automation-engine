#!/usr/bin/env python3
"""Encontra elementos reais da mesa usando Selenium"""

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

    print('Procurando elementos...')
    print('='*70)
    print()

    # Procura elementos por padrões comuns
    searches = {
        'por texto "Saldo"': "//text()[contains(., 'Saldo')]/..",
        'por texto "Jogador"': "//text()[contains(., 'Jogador')]/..",
        'por texto "Banca"': "//text()[contains(., 'Banca')]/..",
        'por texto "Resultado"': "//text()[contains(., 'Resultado')]/..",
        'por classe com "balance"': "//*[contains(@class, 'balance')]",
        'por classe com "result"': "//*[contains(@class, 'result')]",
        'por classe com "bet"': "//*[contains(@class, 'bet')]",
        'por classe com "score"': "//*[contains(@class, 'score')]",
        'botões (button)': "//button",
        'inputs (input)': "//input",
        'divs com data-': "//*[@data-*]",
    }

    for desc, xpath in searches.items():
        try:
            elements = sb.find_elements(xpath)
            if elements:
                print(f'✅ {desc}')
                print(f'   Encontrados: {len(elements)}')

                # Mostra primeiros 3
                for i, el in enumerate(elements[:3]):
                    texto = el.text[:60] if el.text else '(sem texto)'
                    classe = el.get_attribute('class')[:60] if el.get_attribute('class') else ''
                    print(f'   [{i+1}] {texto}')
                    if classe:
                        print(f'       class: {classe}')
                print()
            else:
                print(f'❌ {desc} — não encontrado')
                print()
        except Exception as e:
            print(f'❌ {desc} — erro: {str(e)[:50]}')
            print()

    print('='*70)
    print()

    # Teste direto: procura por números de saldo
    print('Procurando padrões de saldo (R$ XX.XX)...')
    result = sb.execute_script("""
    // Procura por elementos que contenham saldo
    let elements = document.querySelectorAll('*');
    let sabidosPorTexto = [];

    elements.forEach(el => {
        if (el.textContent && /R\\$\\s*\\d+[.,]\\d{2}/.test(el.textContent)) {
            sabidosPorTexto.push({
                texto: el.textContent.substring(0, 100),
                classe: el.className,
                tag: el.tagName
            });
        }
    });

    return sabidosPorTexto.slice(0, 10);  // Primeiros 10
    """)

    if result:
        print(f'Encontrados {len(result)} elementos com saldo:')
        for i, item in enumerate(result):
            print(f'  [{i+1}] {item["texto"][:60]}')
            print(f'       TAG: {item["tag"]}, CLASS: {item["classe"][:50]}')
    else:
        print('Nenhum elemento com padrão R$ encontrado')

sb.quit()

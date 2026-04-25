#!/usr/bin/env python3
"""
Inspecionar DOM do BetBoom pra encontrar seletores corretos
"""
from seleniumbase import SB
import time
import json

with SB(uc=True, headless=False) as sb:
    print('[INSPECT] Abrindo BetBoom Bac Bo...')
    sb.open('https://betboom.bet.br/casino/game/bac_bo-26281/')
    time.sleep(5)

    print('[INSPECT] Inspecionando DOM...')

    # Buscar TODOS os botões
    script = """
    const buttons = document.querySelectorAll('button, [role="button"], div[class*="btn"], div[onclick]');
    const info = {
        total_buttons: buttons.length,
        buttons: []
    };

    buttons.forEach((btn, idx) => {
        if (idx < 30) {  // Primeiros 30
            info.buttons.push({
                text: btn.textContent?.slice(0, 50),
                class: btn.className,
                id: btn.id,
                html: btn.outerHTML?.slice(0, 100)
            });
        }
    });

    return info;
    """

    buttons_info = sb.execute_script(script)
    print(json.dumps(buttons_info, indent=2))

    # Procurar por "bet", "player", "banker", "tie"
    print('\n[INSPECT] Procurando por keywords...')

    script2 = """
    const keywords = ['bet', 'player', 'banker', 'tie', 'place', 'stake'];
    const results = {};

    keywords.forEach(kw => {
        results[kw] = {
            buttons: [],
            divs: [],
            any: []
        };

        // Procurar em buttons
        document.querySelectorAll('button').forEach(btn => {
            if (btn.textContent.toLowerCase().includes(kw) ||
                btn.className.toLowerCase().includes(kw)) {
                results[kw].buttons.push({
                    text: btn.textContent?.slice(0, 30),
                    class: btn.className
                });
            }
        });

        // Procurar em divs
        document.querySelectorAll('div').forEach(div => {
            if ((div.textContent.toLowerCase().includes(kw) ||
                 div.className.toLowerCase().includes(kw)) &&
                div.textContent.length < 100) {
                results[kw].divs.push({
                    text: div.textContent?.slice(0, 30),
                    class: div.className
                });
            }
        });
    });

    return results;
    """

    keywords_results = sb.execute_script(script2)
    print(json.dumps(keywords_results, indent=2))

    # Procurar por iframes
    print('\n[INSPECT] Inspecionando iframes...')

    script3 = """
    const iframes = document.querySelectorAll('iframe');
    const info = {
        count: iframes.length,
        iframes: []
    };

    iframes.forEach((iframe, idx) => {
        info.iframes.push({
            id: iframe.id,
            class: iframe.className,
            src: iframe.src?.slice(0, 100),
            title: iframe.title
        });
    });

    return info;
    """

    iframes_info = sb.execute_script(script3)
    print(json.dumps(iframes_info, indent=2))

    # Tirar screenshot
    sb.save_screenshot('dom_inspect.png')
    print('\n[INSPECT] Screenshot: dom_inspect.png')

    time.sleep(2)

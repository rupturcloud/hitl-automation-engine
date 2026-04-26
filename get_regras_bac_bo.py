#!/usr/bin/env python3
"""
Extrai o conteúdo "Como Jogar" / "Regras" do Bac Bo
"""

import os
import json
import time
import re
from datetime import datetime
from seleniumbase import SB
from bs4 import BeautifulSoup

BASE_PATH = '/Users/diego/dev/ruptur-cloud'
USUARIO = 'diego'
SESSION_FILE = f'{BASE_PATH}/betboom_session_{USUARIO}.json'
PROFILE_DIR = os.path.expanduser(f'~/.selenium_profile_{USUARIO}')

def log(msg):
    ts = datetime.now().strftime('%H:%M:%S')
    print(f'[{ts}] {msg}')

print(); print('='*70)
print('EXTRATOR — Regras e Como Jogar Bac Bo')
print('='*70); print()

try:
    cookies = json.load(open(SESSION_FILE)) if os.path.exists(SESSION_FILE) else []
    log(f'✅ {len(cookies)} cookies')

    with SB(uc=True, headless=False, block_images=False, user_data_dir=PROFILE_DIR) as sb:
        log('🌐 Abrindo BetBoom...')
        sb.open('https://betboom.bet.br')
        time.sleep(2)

        # Adiciona cookies
        for c in cookies:
            try:
                sb.add_cookie(c)
            except:
                pass

        log('🎰 Abrindo Bac Bo...')
        sb.open('https://betboom.bet.br/casino/game/bac_bo-26281/')
        time.sleep(6)

        # Procura por botão de regras/help
        # Evolution geralmente usa botões com atributos aria-label
        log('🔍 Procurando botão de regras...')

        # Lista de possíveis seletores para button de ajuda/regras
        selectors = [
            "[aria-label*='Rules']",
            "[aria-label*='rules']",
            "[aria-label*='Help']",
            "[aria-label*='help']",
            "[aria-label*='Info']",
            "[aria-label*='info']",
            "button[class*='help']",
            "button[class*='info']",
            "button[class*='rules']",
            "button:contains('?')",
            "[class*='HelpButton']",
            "[class*='InfoButton']",
        ]

        clicked = False
        for selector in selectors:
            try:
                if sb.is_element_present(selector):
                    log(f'✅ Clicando: {selector}')
                    sb.click(selector)
                    time.sleep(2)
                    clicked = True
                    break
            except Exception as e:
                pass

        if not clicked:
            log('⚠️ Botão não encontrado, tentando JavaScript...')
            # Tenta encontrar qualquer elemento com texto "Rules"
            js = """
            let btns = document.querySelectorAll('button');
            for (let btn of btns) {
                if (btn.textContent.toLowerCase().includes('rules') ||
                    btn.textContent.toLowerCase().includes('help') ||
                    btn.textContent.includes('?') ||
                    btn.getAttribute('aria-label')?.toLowerCase().includes('rule')) {
                    btn.click();
                    break;
                }
            }
            """
            sb.execute_script(js)
            time.sleep(2)

        # Tira screenshot
        sb.save_screenshot('/tmp/bac_bo_regras.png')
        log('📸 Screenshot capturado')

        # Extrai texto
        text = sb.get_page_source()
        soup = BeautifulSoup(text, 'html.parser')

        # Procura por divs com texto sobre regras
        regras_encontradas = []

        # Procura por elementos com classe que contenha "rule", "info", "help"
        for elem in soup.find_all(['div', 'p', 'span']):
            class_str = ' '.join(elem.get('class', []))
            text_content = elem.get_text(strip=True)

            if any(keyword in class_str.lower() or keyword in text_content.lower()
                   for keyword in ['rule', 'how', 'play', 'como', 'jogar', 'info']):
                if len(text_content) > 20:  # Só textos significativos
                    regras_encontradas.append(text_content)

        # Remove duplicatas e ordena
        regras_unicas = list(dict.fromkeys(regras_encontradas))

        log(f'✅ Encontrados {len(regras_unicas)} segmentos de texto')

        # Salva em arquivo
        with open('/tmp/regras_extraidas.txt', 'w', encoding='utf-8') as f:
            f.write('REGRAS E COMO JOGAR BAC BO\n')
            f.write('='*70 + '\n\n')
            for i, regra in enumerate(regras_unicas[:20], 1):
                f.write(f'{i}. {regra}\n\n')

        log('✅ Arquivo salvo: /tmp/regras_extraidas.txt')

except Exception as e:
    log(f'❌ Erro: {str(e)}')
    import traceback
    traceback.print_exc()

print(); print('='*70)

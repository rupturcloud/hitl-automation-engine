#!/usr/bin/env python3
"""
Extrai regras do Bac Bo — procura diretamente na interface Evolution
"""

import os
import json
import time
from datetime import datetime
from seleniumbase import SB

BASE_PATH = '/Users/diego/dev/ruptur-cloud'
SESSION_FILE = f'{BASE_PATH}/betboom_session_diego.json'
PROFILE_DIR = os.path.expanduser(f'~/.selenium_profile_diego')

def log(msg):
    ts = datetime.now().strftime('%H:%M:%S')
    print(f'[{ts}] {msg}')

print(); print('='*70)
print('EXTRATOR — Regras direto do Evolution Bac Bo')
print('='*70); print()

try:
    cookies = json.load(open(SESSION_FILE)) if os.path.exists(SESSION_FILE) else []
    log(f'✅ {len(cookies)} cookies')

    with SB(uc=True, headless=False, block_images=False, user_data_dir=PROFILE_DIR) as sb:
        log('🌐 Abrindo BetBoom...')
        sb.open('https://betboom.bet.br')
        time.sleep(2)

        for c in cookies:
            try:
                sb.add_cookie(c)
            except:
                pass

        log('🎰 Abrindo Bac Bo...')
        sb.open('https://betboom.bet.br/casino/game/bac_bo-26281/')
        time.sleep(8)

        log('📍 Fechando aviso de cookies...')
        try:
            sb.click("button:contains('OK')")
            time.sleep(1)
        except:
            pass

        # Procura por padrão: botão ? ou info que fica normalmente no canto superior direito
        log('🔍 Procurando botão Info/Help/Rules...')

        # Tenta vários seletores comuns em Evolution
        info_selectors = [
            "button[aria-label='Game Info']",
            "button[aria-label='Information']",
            "button[aria-label='Rules']",
            "button[class*='infoIcon']",
            "button[class*='info-icon']",
            "[aria-label*='info' i]",
            "[aria-label*='rules' i]",
            "[aria-label*='help' i]",
            "span:contains('?'):parent",
            "svg[role='button']",
        ]

        clicked = False
        for selector in info_selectors:
            try:
                if sb.is_element_visible(selector):
                    log(f'✅ Clicando: {selector}')
                    sb.click(selector)
                    time.sleep(2)
                    clicked = True
                    break
            except:
                pass

        if not clicked:
            log('⚠️ Nenhum botão encontrado, tentando Tab/teclas...')
            # Tenta usar tab para navegar até encontrar
            sb.send_keys('Tab Tab Tab')
            time.sleep(1)
            sb.send_keys('Return')
            time.sleep(2)

        log('📸 Screenshot com modal/painel')
        sb.save_screenshot('/tmp/regras_encontradas.png')

        # Aguarda modal abrir completamente
        time.sleep(2)

        log('📸 Screenshot 2')
        sb.save_screenshot('/tmp/regras_encontradas2.png')

        # Tenta scroll dentro do modal
        log('↓ Fazendo scroll...')
        sb.execute_script('window.scrollBy(0, 500);')
        time.sleep(1)

        log('📸 Screenshot 3 (com scroll)')
        sb.save_screenshot('/tmp/regras_encontradas3.png')

        # Extrai HTML inteiro para análise
        html = sb.get_page_source()
        with open('/tmp/regras_html_completo.html', 'w', encoding='utf-8') as f:
            f.write(html)

        log('✅ Extração concluída!')

except Exception as e:
    log(f'❌ Erro: {str(e)}')
    import traceback
    traceback.print_exc()

print(); print('='*70)

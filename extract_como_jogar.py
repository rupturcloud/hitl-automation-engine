#!/usr/bin/env python3
"""
Extrai seção "Como Jogar" do Bac Bo da Evolution
"""

import os
import json
import time
import re
from datetime import datetime
from seleniumbase import SB

BASE_PATH = '/Users/diego/dev/ruptur-cloud'
USUARIO = 'diego'
SESSION_FILE = f'{BASE_PATH}/betboom_session_{USUARIO}.json'
PROFILE_DIR = os.path.expanduser(f'~/.selenium_profile_{USUARIO}')

def log(msg):
    ts = datetime.now().strftime('%H:%M:%S.%f')[:-3]
    print(f'[{ts}] {msg}')

print()
print('='*70)
print('EXTRATOR — Como Jogar Bac Bo')
print('='*70)
print()

try:
    # Carrega cookies
    cookies = json.load(open(SESSION_FILE)) if os.path.exists(SESSION_FILE) else []
    log(f'✅ {len(cookies)} cookies carregados')

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

        log('🎰 Abrindo mesa Bac Bo...')
        sb.open('https://betboom.bet.br/casino/game/bac_bo-26281/')
        time.sleep(5)

        log('🔍 Procurando seção "Como Jogar"...')

        # Tira screenshot inicial
        sb.save_screenshot('/tmp/bac_bo_inicial.png')
        log('📸 Screenshot inicial salvo')

        # Procura por elementos com "regra", "como jogar", "help", "?"
        search_terms = [
            "[aria-label*='help' i]",
            "[aria-label*='regra' i]",
            "[aria-label*='Como' i]",
            "[aria-label*='Info' i]",
            "[class*='help']",
            "[class*='info']",
            "[class*='rules']",
            "button:has-text('?')",
            "button:has-text('Help')",
            "button:has-text('Regras')",
            "button:has-text('Como Jogar')",
        ]

        found = False
        for term in search_terms:
            try:
                if sb.is_element_present(term):
                    log(f'✅ Encontrado: {term}')
                    sb.click(term)
                    time.sleep(2)
                    found = True
                    break
            except:
                pass

        if not found:
            # Procura por ícone de interrogação na interface
            log('⚠️ Procurando por padrão visual...')

            # Tira screenshot para análise manual
            sb.save_screenshot('/tmp/bac_bo_interface.png')

            # Tenta usar F1 ou ?
            try:
                sb.send_keys('?')
                time.sleep(2)
            except:
                pass

        # Captura HTML da página
        html = sb.get_page_source()

        # Procura por texto relacionado a regras
        patterns = [
            r'como\s+jogar|how\s+to\s+play|baccarat\s+rules|regra',
            r'player|banker|tie|empate|apostador|banqueiro',
            r'pontuação|scoring|pontos|contagem',
        ]

        matches = []
        for pattern in patterns:
            found_matches = re.findall(pattern, html, re.IGNORECASE)
            if found_matches:
                matches.extend(found_matches)

        if matches:
            log(f'✅ Encontrados {len(set(matches))} termos relevantes')

        log('📸 Tira screenshot final...')
        sb.save_screenshot('/tmp/bac_bo_final.png')

        log('💾 Salvando HTML...')
        with open('/tmp/bac_bo_rules.html', 'w') as f:
            f.write(html)

        log('✅ Extração completa')
        log('')
        log('Arquivos gerados:')
        log('  /tmp/bac_bo_inicial.png')
        log('  /tmp/bac_bo_interface.png')
        log('  /tmp/bac_bo_final.png')
        log('  /tmp/bac_bo_rules.html')

except Exception as e:
    log(f'❌ Erro: {str(e)[:100]}')
    import traceback
    traceback.print_exc()

print()
print('='*70)

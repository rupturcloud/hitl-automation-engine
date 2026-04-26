#!/usr/bin/env python3
"""
Extrai a seção "Como Jogar" / "Regras" exata do Bac Bo na BetBoom
"""

import os
import json
import time
from datetime import datetime
from seleniumbase import SB

BASE_PATH = '/Users/diego/dev/ruptur-cloud'
USUARIO = 'diego'
SESSION_FILE = f'{BASE_PATH}/betboom_session_{USUARIO}.json'
PROFILE_DIR = os.path.expanduser(f'~/.selenium_profile_{USUARIO}')

def log(msg):
    ts = datetime.now().strftime('%H:%M:%S')
    print(f'[{ts}] {msg}')

print(); print('='*70)
print('EXTRATOR REGRAS BAC BO — BetBoom (Evolution Gaming)')
print('='*70); print()

try:
    # Carrega cookies
    if os.path.exists(SESSION_FILE):
        cookies = json.load(open(SESSION_FILE))
        log(f'✅ {len(cookies)} cookies carregados')
    else:
        cookies = []
        log('⚠️ Nenhum cookie encontrado — será necessário fazer login')

    with SB(uc=True, headless=False, block_images=False, user_data_dir=PROFILE_DIR) as sb:
        log('🌐 Abrindo BetBoom...')
        sb.open('https://betboom.bet.br')
        time.sleep(3)

        # Adiciona cookies
        for c in cookies:
            try:
                sb.add_cookie(c)
            except:
                pass

        log('🔄 Recarregando com cookies...')
        sb.open('https://betboom.bet.br')
        time.sleep(3)

        log('🎰 Abrindo mesa Bac Bo...')
        sb.open('https://betboom.bet.br/casino/game/bac_bo-26281/')
        time.sleep(7)

        log('📸 Screenshot 1 — Estado inicial')
        sb.save_screenshot('/tmp/bac_bo_step1.png')

        # Procura por botão de ajuda/regras/info
        log('🔍 Procurando seção "Como Jogar" / "Rules"...')

        # Lista extensa de seletores possíveis
        selectors = [
            "button[aria-label*='Rules']",
            "button[aria-label*='Help']",
            "button[aria-label*='Info']",
            "button[aria-label*='rule']",
            "button[aria-label*='help']",
            "button[aria-label*='info']",
            "[class*='RulesButton']",
            "[class*='HelpButton']",
            "[class*='InfoButton']",
            "button:contains('Rules')",
            "button:contains('Help')",
            "a[href*='rules']",
        ]

        found = False
        for selector in selectors:
            try:
                if sb.is_element_present(selector):
                    log(f'✅ Encontrado elemento: {selector}')
                    sb.click(selector)
                    time.sleep(2)
                    found = True
                    break
            except:
                pass

        if not found:
            log('⚠️ Tentando buscar por JavaScript...')
            # Tenta encontrar qualquer botão com "rules", "help", "info"
            js = """
            let buttons = document.querySelectorAll('button');
            for (let btn of buttons) {
                let text = btn.textContent.toLowerCase();
                let aria = (btn.getAttribute('aria-label') || '').toLowerCase();
                if (text.includes('rules') || text.includes('help') || text.includes('info') ||
                    aria.includes('rules') || aria.includes('help') || aria.includes('info')) {
                    console.log('Encontrado: ' + btn.textContent);
                    btn.click();
                    break;
                }
            }
            """
            sb.execute_script(js)
            time.sleep(2)

        log('📸 Screenshot 2 — Após clique')
        sb.save_screenshot('/tmp/bac_bo_step2.png')

        # Aguarda abertura de modal/painel
        time.sleep(2)

        # Tira screenshot do modal/painel
        log('📸 Screenshot 3 — Modal/Painel aberto')
        sb.save_screenshot('/tmp/bac_bo_step3.png')

        # Extrai todo o HTML
        html = sb.get_page_source()

        # Procura por texto específico de regras
        log('🔍 Procurando texto de regras no HTML...')

        # Salva HTML completo para análise
        with open('/tmp/bac_bo_full_html.html', 'w', encoding='utf-8') as f:
            f.write(html)

        log('💾 HTML salvo em: /tmp/bac_bo_full_html.html')

        # Tenta extrair text content
        text_content = sb.get_text('body')
        with open('/tmp/bac_bo_text.txt', 'w', encoding='utf-8') as f:
            f.write(text_content)

        log('💾 Texto extraído em: /tmp/bac_bo_text.txt')

        log('✅ Extração completa!')

except Exception as e:
    log(f'❌ Erro: {str(e)}')
    import traceback
    traceback.print_exc()

print(); print('='*70)
log('Arquivos gerados:')
log('  /tmp/bac_bo_step1.png — Estado inicial')
log('  /tmp/bac_bo_step2.png — Após clique')
log('  /tmp/bac_bo_step3.png — Modal aberto')
log('  /tmp/bac_bo_full_html.html — HTML completo')
log('  /tmp/bac_bo_text.txt — Texto extraído')
print('='*70)

#!/usr/bin/env python3
"""
MAP SELECTORS: Descobre os seletores REAIS da mesa
"""

import sys
import os
import json
import time
from datetime import datetime
from seleniumbase import SB

BASE_PATH = '/Users/diego/dev/ruptur-cloud'
OUT_DIR = f'{BASE_PATH}/selector_map'
os.makedirs(OUT_DIR, exist_ok=True)

def log(msg):
    ts = datetime.now().strftime('%H:%M:%S')
    print(f'[{ts}][MAP] {msg}')

def main():
    usuario = 'diego'
    session_file = f'{BASE_PATH}/betboom_session_{usuario}.json'
    profile_dir = os.path.expanduser(f'~/.selenium_profile_{usuario}')

    if not os.path.exists(session_file):
        log('❌ Sessão não encontrada')
        return

    with open(session_file, 'r') as f:
        cookies = json.load(f)

    log(f'✅ {len(cookies)} cookies')

    with SB(uc=True, headless=False, block_images=False, user_data_dir=profile_dir) as sb:
        log('✅ Selenium iniciado')

        sb.open('https://betboom.bet.br')
        time.sleep(2)

        for cookie in cookies:
            try:
                sb.add_cookie(cookie)
            except:
                pass

        sb.open('https://betboom.bet.br')
        time.sleep(2)

        log('🎰 Abrindo Bac Bo...')
        sb.open('https://betboom.bet.br/casino/game/bac_bo-26281/')
        time.sleep(5)

        log('🔍 Inspecionando a página...')

        # Salva HTML completo pra analisar
        html = sb.get_page_source()
        html_file = f'{OUT_DIR}/page_source.html'
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(html)
        log(f'📄 HTML salvo: {html_file}')

        # Screenshot pra referência visual
        ss = f'{OUT_DIR}/mesa_visual.png'
        sb.save_screenshot(ss)
        log(f'📸 Screenshot: {ss}')

        # Executa JavaScript pra mapear elementos
        log('🔎 Procurando elementos interativos...')

        js_map = """
        const result = {
            buttons: [],
            divs_with_class: [],
            elements_with_data: [],
            clickable_elements: []
        };

        // Todos os buttons
        document.querySelectorAll('button').forEach((btn, i) => {
            result.buttons.push({
                index: i,
                text: btn.textContent.trim(),
                classes: btn.className,
                id: btn.id,
                ariaLabel: btn.getAttribute('aria-label'),
                outerHTML: btn.outerHTML.substring(0, 200)
            });
        });

        // DIVs com classes relevantes
        document.querySelectorAll('div[class*="bet"], div[class*="player"], div[class*="banker"], div[class*="tier"], div[class*="tie"], div[class*="chip"]').forEach((div, i) => {
            result.divs_with_class.push({
                index: i,
                text: div.textContent.substring(0, 50),
                classes: div.className,
                id: div.id,
                outerHTML: div.outerHTML.substring(0, 200)
            });
        });

        // Elementos com data attributes
        document.querySelectorAll('[data-*]').forEach((elem, i) => {
            if (i < 20) {  // Limita a 20
                const attrs = {};
                elem.attributes.forEach(attr => {
                    if (attr.name.startsWith('data-')) {
                        attrs[attr.name] = attr.value;
                    }
                });
                result.elements_with_data.push({
                    tag: elem.tagName,
                    text: elem.textContent.substring(0, 30),
                    dataAttrs: attrs,
                    outerHTML: elem.outerHTML.substring(0, 200)
                });
            }
        });

        // Elementos onclick
        document.querySelectorAll('[onclick]').forEach((elem, i) => {
            result.clickable_elements.push({
                tag: elem.tagName,
                text: elem.textContent.substring(0, 50),
                classes: elem.className,
                onclick: elem.getAttribute('onclick').substring(0, 100)
            });
        });

        return result;
        """

        try:
            mapping = sb.execute_script(js_map)

            # Salva resultado em JSON
            json_file = f'{OUT_DIR}/element_mapping.json'
            with open(json_file, 'w', encoding='utf-8') as f:
                json.dump(mapping, f, indent=2, ensure_ascii=False)

            log(f'✅ Mapping salvo: {json_file}')
            log(f'   - {len(mapping["buttons"])} buttons encontrados')
            log(f'   - {len(mapping["divs_with_class"])} divs relevantes')
            log(f'   - {len(mapping["elements_with_data"])} elementos com data attrs')
            log(f'   - {len(mapping["clickable_elements"])} elementos onclick')

            # Imprime os primeiros buttons pra referência
            log('🎯 PRIMEIROS BUTTONS ENCONTRADOS:')
            for btn in mapping['buttons'][:15]:
                print(f'   [{btn["index"]}] {btn["text"][:40]:40s} | class: {btn["classes"][:50]}')

        except Exception as e:
            log(f'❌ Erro ao mapear: {e}')

        print()
        log(f'✅ MAPEAMENTO COMPLETO')
        log(f'📁 Outputs: {OUT_DIR}/')
        log(f'   - Abra page_source.html no navegador')
        log(f'   - Inspecione element_mapping.json pra seletores reais')

if __name__ == '__main__':
    main()

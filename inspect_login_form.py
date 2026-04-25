#!/usr/bin/env python3
from seleniumbase import SB
import time
import json

with SB(uc=True, headless=False) as sb:
    print('[INSPECT] Abrindo link...')
    sb.open('https://betboom.bet.br/casino/game/bac_bo-26281/')
    time.sleep(5)

    print('[INSPECT] Clicando em "Fazer login"...')

    try:
        sb.click("//*[contains(text(), 'Fazer login')]", timeout=5)
        print('[INSPECT] ✅ Clicado em Fazer login')
    except:
        print('[INSPECT] ❌ Erro ao clicar')

    time.sleep(3)

    print('[INSPECT] Inspecionando formulário...')

    script = """
    return {
        inputs: Array.from(document.querySelectorAll('input')).map((inp, idx) => ({
            idx: idx,
            type: inp.type,
            name: inp.name,
            id: inp.id,
            placeholder: inp.placeholder,
            class: inp.className,
            html: inp.outerHTML.slice(0, 150)
        })),

        buttons: Array.from(document.querySelectorAll('button')).map((btn, idx) => ({
            idx: idx,
            text: btn.textContent?.slice(0, 50),
            type: btn.type,
            class: btn.className
        })),

        forms: document.querySelectorAll('form').length,

        all_visible_text: document.body.innerText.slice(0, 500)
    }
    """

    try:
        info = sb.execute_script(script)
        print(json.dumps(info, indent=2))
    except Exception as e:
        print(f'Erro ao executar script: {e}')

    print('[INSPECT] Tirando screenshot...')
    sb.save_screenshot('login_form_inspect.png')
    print('[INSPECT] Screenshot: login_form_inspect.png')

    time.sleep(3)

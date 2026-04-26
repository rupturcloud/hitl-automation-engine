#!/usr/bin/env python3
from seleniumbase import SB
import time
import json

with SB(uc=True, headless=False) as sb:
    print('[INSPECT] Abrindo BetBoom...')
    sb.open('https://betboom.com.br')
    time.sleep(5)

    print('[INSPECT] Inspecionando formulário de login...')

    script = """
    return {
        url: window.location.href,
        inputs: Array.from(document.querySelectorAll('input')).map((inp, idx) => ({
            idx: idx,
            type: inp.type,
            name: inp.name,
            id: inp.id,
            class: inp.className,
            placeholder: inp.placeholder
        })),
        buttons: Array.from(document.querySelectorAll('button')).slice(0, 10).map((btn, idx) => ({
            idx: idx,
            text: btn.textContent?.slice(0, 50),
            type: btn.type,
            class: btn.className
        })),
        forms: document.querySelectorAll('form').length
    }
    """

    info = sb.execute_script(script)
    print(json.dumps(info, indent=2))

    sb.save_screenshot('login_page.png')
    print('[INSPECT] Screenshot: login_page.png')

    time.sleep(2)

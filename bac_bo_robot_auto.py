#!/usr/bin/env python3
"""
Will Dados Pro — Robô Bac Bo AUTOMÁTICO
Modo headless: extrai iframe, encontra botões, clica automaticamente
"""
from seleniumbase import SB
import time
import json
from datetime import datetime

class BacBoRobotAuto:
    def __init__(self):
        self.url = 'https://betboom.bet.br/casino/game/bac_bo-26281/'
        self.session = []

    def log(self, tag, msg):
        ts = datetime.now().strftime('%H:%M:%S')
        print(f'[{ts}][{tag}] {msg}')
        self.session.append({'ts': ts, 'tag': tag, 'msg': msg})

    def run(self):
        self.log('INIT', '🤖 Will Dados Pro — AUTO MODE')

        try:
            with SB(uc=True, headless=True) as sb:
                self.log('INIT', 'Abrindo BetBoom Bac Bo...')
                sb.open(self.url)
                time.sleep(5)

                # Tirar screenshot
                sb.save_screenshot('bac_bo_page.png')
                self.log('SCREENSHOT', 'Screenshot salvo: bac_bo_page.png')

                # Extrair informações da página
                page_source = sb.get_page_source()

                # Procurar iframes
                self.log('IFRAME', 'Analisando estrutura...')
                script_iframes = """
                return {
                    total_iframes: document.querySelectorAll('iframe').length,
                    iframes: Array.from(document.querySelectorAll('iframe')).map((el, idx) => ({
                        id: el.id,
                        src: el.src?.slice(0, 100),
                        title: el.title
                    }))
                }
                """

                try:
                    iframe_info = sb.execute_script(script_iframes)
                    self.log('IFRAME', f'Encontrados {iframe_info["total_iframes"]} iframes')
                    for idx, iframe in enumerate(iframe_info['iframes']):
                        self.log('IFRAME', f'  #{idx}: {iframe}')
                except Exception as e:
                    self.log('IFRAME', f'Erro ao analisar iframes: {e}')

                # Procurar botões na página
                self.log('BUTTONS', 'Procurando botões...')
                script_buttons = """
                const buttons = document.querySelectorAll('button');
                return {
                    total: buttons.length,
                    buttons: Array.from(buttons).slice(0, 10).map(btn => ({
                        text: btn.textContent?.slice(0, 50),
                        class: btn.className,
                        visible: btn.offsetParent !== null
                    }))
                }
                """

                try:
                    buttons_info = sb.execute_script(script_buttons)
                    self.log('BUTTONS', f'Encontrados {buttons_info["total"]} botões')
                    for idx, btn in enumerate(buttons_info['buttons']):
                        self.log('BUTTONS', f'  #{idx}: {btn["text"][:30]} | visible: {btn["visible"]}')
                except Exception as e:
                    self.log('BUTTONS', f'Erro ao procurar botões: {e}')

                # Tentar encontrar e clicar em botão BANKER/PLAYER
                self.log('BET', 'Tentando clicar em aposta...')

                try:
                    # Estratégia 1: Procurar por xpath direto
                    sb.click("//button[contains(text(), 'Banker')]", timeout=3)
                    self.log('BET', '✅ CLICOU EM BANKER!')
                except:
                    self.log('BET', 'Xpath 1 falhou')
                    try:
                        # Estratégia 2: Switch pra iframe e tentar
                        iframes = sb.find_elements('iframe')
                        if iframes:
                            self.log('BET', f'Tentando dentro de iframe...')
                            sb.switch_to_frame(0)
                            time.sleep(1)

                            # Tirar screenshot dentro do iframe
                            sb.save_screenshot('bac_bo_iframe.png')
                            self.log('SCREENSHOT', 'Screenshot do iframe: bac_bo_iframe.png')

                            # Procurar botões dentro do iframe
                            buttons_in_iframe = sb.find_elements('button')
                            self.log('BUTTONS', f'Botões dentro do iframe: {len(buttons_in_iframe)}')

                            for idx, btn in enumerate(buttons_in_iframe[:5]):
                                self.log('BUTTONS', f'  #{idx}: {btn.text[:30]}')

                                # Tentar clicar se for "Banker"
                                if 'banker' in btn.text.lower():
                                    self.log('BET', f'Clicando em: {btn.text}')
                                    btn.click()
                                    self.log('BET', '✅ CLICOU EM BANKER (iframe)!')
                                    time.sleep(2)
                                    break
                    except Exception as e:
                        self.log('BET', f'Erro ao clicar: {e}')

                self.log('FINAL', '✅ Execução concluída')
                self.save_report()

                return True

        except Exception as e:
            self.log('ERROR', f'❌ Erro fatal: {e}')
            return False

    def save_report(self):
        """Salvar relatório"""
        with open('/Users/diego/dev/ruptur-cloud/robot_auto_report.json', 'w') as f:
            json.dump({'session': self.session}, f, indent=2)
        self.log('REPORT', 'Relatório salvo: robot_auto_report.json')

if __name__ == '__main__':
    robot = BacBoRobotAuto()
    robot.run()

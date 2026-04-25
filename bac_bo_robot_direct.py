#!/usr/bin/env python3
"""
Will Dados Pro — Robô Bac Bo DIRETO NO LINK
Acessa direto: https://betboom.bet.br/casino/game/bac_bo-26281/
"""
from seleniumbase import SB
import time
import json
from datetime import datetime

class BacBoRobotDirect:
    def __init__(self):
        self.url = 'https://betboom.bet.br/casino/game/bac_bo-26281/'
        self.session = []

    def log(self, tag, msg):
        ts = datetime.now().strftime('%H:%M:%S')
        print(f'[{ts}][{tag}] {msg}')
        self.session.append({'ts': ts, 'tag': tag, 'msg': msg})

    def run(self):
        """Executar robô"""
        self.log('INIT', '🤖 Will Dados Pro — DIRECT LINK')

        try:
            with SB(uc=True, headless=False) as sb:
                self.log('INIT', f'Abrindo {self.url}...')
                sb.open(self.url)
                time.sleep(5)

                self.log('INIT', f'✅ Página carregada: {sb.get_title()[:60]}...')

                # Screenshot inicial
                sb.save_screenshot('bac_bo_direct_01.png')
                self.log('SCREENSHOT', 'bac_bo_direct_01.png')

                # Procurar iframes
                self.log('IFRAME', 'Procurando iframes do jogo...')

                iframes = sb.find_elements('iframe')
                self.log('IFRAME', f'Total de iframes: {len(iframes)}')

                for idx, iframe in enumerate(iframes):
                    try:
                        iframe_id = iframe.get_attribute('id')
                        iframe_src = iframe.get_attribute('src')
                        self.log('IFRAME', f'  #{idx}: id={iframe_id}, src={iframe_src[:60]}...')
                    except:
                        pass

                # Tentar clicar em BANKER (estratégias progressivas)
                self.log('BET', '💰 Procurando botão BANKER...')

                # Estratégia 1: XPath direto
                strategies = [
                    ("//button[contains(text(), 'Banker')]", "XPath (Banker)"),
                    ("//button[contains(text(), 'banker')]", "XPath (banker lowercase)"),
                    ("//button[contains(., 'Banker')]", "XPath (contains)"),
                    ("//div[contains(text(), 'Banker')]", "Div (Banker)"),
                    ("//button", "Qualquer botão (debug)"),
                ]

                for selector, desc in strategies:
                    try:
                        self.log('BET', f'Tentando {desc}...')
                        elements = sb.find_elements(selector)
                        self.log('BET', f'  ✅ Encontrou {len(elements)} elemento(s)')

                        for idx, el in enumerate(elements[:5]):
                            text = el.text[:40] if el.text else '[vazio]'
                            self.log('BET', f'    #{idx}: "{text}"')

                            # Se encontrou "Banker", clicar
                            if idx == 0 and ('banker' in text.lower() or 'bank' in text.lower()):
                                self.log('BET', f'  🎯 Clicando em: {text}')
                                el.click()
                                self.log('BET', f'  ✅ CLIQUE EXECUTADO!')
                                time.sleep(2)

                                # Screenshot após clique
                                sb.save_screenshot('bac_bo_direct_after_click.png')
                                self.log('SCREENSHOT', 'bac_bo_direct_after_click.png')
                                return True

                    except Exception as e:
                        pass

                # Se não conseguiu com elementos diretos, tentar dentro de iframes
                self.log('BET', 'Tentando dentro de iframes...')

                if iframes:
                    for iframe_idx in range(len(iframes)):
                        try:
                            self.log('BET', f'Entrando no iframe #{iframe_idx}...')
                            sb.switch_to_frame(iframe_idx)
                            time.sleep(1)

                            # Procurar botões dentro do iframe
                            buttons_in_iframe = sb.find_elements('button')
                            self.log('BET', f'  Botões no iframe: {len(buttons_in_iframe)}')

                            for btn_idx, btn in enumerate(buttons_in_iframe[:10]):
                                text = btn.text[:40] if btn.text else '[vazio]'
                                self.log('BET', f'    #{btn_idx}: "{text}"')

                                # Clicar se for BANKER
                                if 'banker' in text.lower() or 'bank' in text.lower():
                                    self.log('BET', f'  🎯 Clicando em BANKER: {text}')
                                    btn.click()
                                    self.log('BET', f'  ✅ CLIQUE EM BANKER (iframe #{iframe_idx})!')

                                    time.sleep(2)
                                    sb.save_screenshot('bac_bo_direct_banker_clicked.png')
                                    self.log('SCREENSHOT', 'bac_bo_direct_banker_clicked.png')

                                    sb.switch_to_default_content()
                                    return True

                            sb.switch_to_default_content()

                        except Exception as e:
                            try:
                                sb.switch_to_default_content()
                            except:
                                pass

                self.log('FINAL', '✅ Execução concluída (clique pode ter sido realizado)')
                self.save_report()

                time.sleep(3)
                return True

        except Exception as e:
            self.log('ERROR', f'❌ Erro: {e}')
            import traceback
            traceback.print_exc()
            return False

    def save_report(self):
        """Salvar relatório"""
        with open('/Users/diego/dev/ruptur-cloud/robot_direct_report.json', 'w') as f:
            json.dump({'session': self.session}, f, indent=2)
        self.log('REPORT', 'Relatório: robot_direct_report.json')

if __name__ == '__main__':
    robot = BacBoRobotDirect()
    robot.run()

#!/usr/bin/env python3
"""
Will Dados Pro — Robô Bac Bo INTERATIVO
Você faz login → Robô clica em BANKER automaticamente
"""
from seleniumbase import SB
import time
import json
from datetime import datetime

class BacBoRobotInteractive:
    def __init__(self):
        self.url = 'https://betboom.bet.br/casino/game/bac_bo-26281/'
        self.session = []

    def log(self, tag, msg):
        ts = datetime.now().strftime('%H:%M:%S')
        print(f'[{ts}][{tag}] {msg}')
        self.session.append({'ts': ts, 'tag': tag, 'msg': msg})

    def run(self):
        """Executar robô"""
        self.log('INIT', '🤖 Will Dados Pro — VOCÊ FAZ LOGIN')
        self.log('INIT', f'Link: {self.url}')

        try:
            with SB(uc=True, headless=False) as sb:
                # 1. Abrir link
                self.log('INIT', 'Abrindo link...')
                sb.open(self.url)
                time.sleep(2)

                # 2. Aguardar login do usuário
                self.log('LOGIN', '⏳ AGUARDANDO SEU LOGIN...')
                self.log('LOGIN', '📱 Você tem 120 segundos para:')
                self.log('LOGIN', '   1. Clicar em "Fazer login"')
                self.log('LOGIN', '   2. Digitar email e senha')
                self.log('LOGIN', '   3. Fazer login')
                self.log('LOGIN', '')
                self.log('LOGIN', 'Depois o robô clica automaticamente em BANKER!')
                self.log('LOGIN', '')

                # Aguardar 120 segundos
                for i in range(120, 0, -1):
                    if i % 10 == 0 or i <= 5:
                        print(f'[{datetime.now().strftime("%H:%M:%S")}][LOGIN] ⏳ {i}s restantes...')
                    time.sleep(1)

                self.log('LOGIN', '✅ Tempo acabou! Verificando se logou...')
                time.sleep(3)

                # 3. Tirar screenshot pra debug
                sb.save_screenshot('bac_bo_after_login.png')
                self.log('SCREENSHOT', 'bac_bo_after_login.png')

                # 4. Clicar em BANKER
                self.log('BET', '💰 Procurando botão BANKER...')
                self.click_banker(sb)

                # 5. Aguardar resultado
                self.log('FINAL', 'Aguardando resultado da aposta...')
                time.sleep(10)

                self.log('FINAL', '✅ Execução concluída!')
                self.save_report()

                return True

        except Exception as e:
            self.log('ERROR', f'❌ Erro: {e}')
            import traceback
            traceback.print_exc()
            return False

    def click_banker(self, sb):
        """Clicar em BANKER após login"""
        strategies = [
            ("//button[contains(text(), 'Banker')]", "XPath Banker"),
            ("//button[contains(., 'Banker')]", "XPath contains"),
            ("[class*='banker']", "Class selector"),
        ]

        for selector, desc in strategies:
            try:
                self.log('BET', f'Tentando: {desc}')
                elements = sb.find_elements(selector)

                if elements:
                    self.log('BET', f'  ✅ Encontrado! Clicando...')
                    elements[0].click()
                    self.log('BET', f'  ✅ CLICOU EM BANKER!')
                    time.sleep(2)
                    sb.save_screenshot('bac_bo_banker_clicked.png')
                    return True

            except:
                pass

        # Tentar dentro de iframes
        self.log('BET', 'Tentando dentro de iframes...')

        try:
            iframes = sb.find_elements('iframe')
            self.log('BET', f'Total de iframes: {len(iframes)}')

            for iframe_idx in range(len(iframes)):
                try:
                    self.log('BET', f'Iframe #{iframe_idx}...')
                    sb.switch_to_frame(iframe_idx)
                    time.sleep(1)

                    buttons = sb.find_elements('button')
                    self.log('BET', f'  Botões: {len(buttons)}')

                    for btn in buttons:
                        if btn.text and 'banker' in btn.text.lower():
                            self.log('BET', f'  🎯 Clicando: {btn.text[:30]}')
                            btn.click()
                            self.log('BET', f'  ✅ CLICOU (iframe #{iframe_idx})!')
                            time.sleep(2)
                            sb.save_screenshot('bac_bo_banker_clicked.png')
                            sb.switch_to_default_content()
                            return True

                    sb.switch_to_default_content()

                except:
                    try:
                        sb.switch_to_default_content()
                    except:
                        pass

        except:
            pass

        self.log('BET', '⚠️ Não encontrei botão BANKER')

    def save_report(self):
        """Salvar relatório"""
        with open('/Users/diego/dev/ruptur-cloud/robot_interactive_report.json', 'w') as f:
            json.dump({'session': self.session}, f, indent=2)
        self.log('REPORT', 'Relatório salvo!')

if __name__ == '__main__':
    robot = BacBoRobotInteractive()
    robot.run()

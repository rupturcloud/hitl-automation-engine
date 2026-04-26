#!/usr/bin/env python3
"""
Will Dados Pro — Robô Bac Bo GO!
Login (você) + Carrega jogo + Clica BANKER (automático)
"""
from seleniumbase import SB
import time
import json
from datetime import datetime

class BacBoRobotGo:
    def __init__(self):
        self.url = 'https://betboom.bet.br/casino/game/bac_bo-26281/'
        self.session = []

    def log(self, tag, msg):
        ts = datetime.now().strftime('%H:%M:%S')
        print(f'[{ts}][{tag}] {msg}')
        self.session.append({'ts': ts, 'tag': tag, 'msg': msg})

    def run(self):
        self.log('INIT', '🤖🚀 Will Dados Pro — GO!')

        try:
            with SB(uc=True, headless=False) as sb:
                # FASE 1: Abrir link + Aguardar login
                self.log('FASE1', '📱 FASE 1: Login')
                sb.open(self.url)
                time.sleep(2)

                self.log('LOGIN', '⏳ VOCÊ TEM 120 SEGUNDOS PARA FAZER LOGIN')
                for i in range(120, 0, -1):
                    if i % 20 == 0 or i <= 5:
                        self.log('LOGIN', f'⏳ {i}s restantes...')
                    time.sleep(1)

                self.log('LOGIN', '✅ Tempo: FIM! Continuando...')
                time.sleep(3)

                # FASE 2: Recarregar link (com sessão logada)
                self.log('FASE2', '🎮 FASE 2: Carregando jogo')
                self.log('RELOAD', 'Recarregando link com sessão autenticada...')
                sb.open(self.url)
                time.sleep(5)

                sb.save_screenshot('bac_bo_game_loaded.png')
                self.log('SCREENSHOT', 'bac_bo_game_loaded.png')

                # FASE 3: Clicar em BANKER
                self.log('FASE3', '💰 FASE 3: Clicando BANKER')
                self.click_banker(sb)

                # FASE 4: Aguardar resultado
                self.log('PHASE4', '⏳ Aguardando resultado (10s)...')
                time.sleep(10)

                self.log('FINAL', '🏆 ✅ EXECUÇÃO COMPLETA!')
                self.save_report()

                return True

        except Exception as e:
            self.log('ERROR', f'❌ {e}')
            import traceback
            traceback.print_exc()
            return False

    def click_banker(self, sb):
        """Clicar em BANKER"""
        self.log('BET', '🔍 Procurando BANKER...')

        # Estratégia 1: XPath direto
        xpaths = [
            "//button[contains(text(), 'Banker')]",
            "//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'banker')]",
            "//*[contains(text(), 'Banker')]//button",
            "//div[contains(text(), 'Banker')]/ancestor::button",
        ]

        for xpath in xpaths:
            try:
                self.log('BET', f'XPath: {xpath[:50]}...')
                sb.click(xpath, timeout=3)
                self.log('BET', '✅ CLICOU EM BANKER!')
                time.sleep(2)
                sb.save_screenshot('bac_bo_banker_clicked.png')
                return True
            except:
                pass

        # Estratégia 2: Dentro de iframes
        self.log('BET', '🔎 Procurando em iframes...')

        try:
            iframes = sb.find_elements('iframe')
            self.log('BET', f'Total iframes: {len(iframes)}')

            for idx in range(len(iframes)):
                try:
                    self.log('BET', f'Iframe #{idx}...')
                    sb.switch_to_frame(idx)
                    time.sleep(1)

                    # Procurar botão
                    buttons = sb.find_elements('button')

                    for btn in buttons:
                        text = btn.text.lower() if btn.text else ''

                        if 'banker' in text or 'bank' in text:
                            self.log('BET', f'✅ Encontrado: {btn.text}')
                            btn.click()
                            self.log('BET', '✅ CLICOU EM BANKER!')
                            time.sleep(2)
                            sb.save_screenshot('bac_bo_banker_clicked.png')
                            sb.switch_to_default_content()
                            return True

                        # Debug: show first 5 buttons
                        if len(buttons) <= 5:
                            self.log('BET', f'  Botão: {text[:40]}')

                    sb.switch_to_default_content()

                except Exception as e:
                    try:
                        sb.switch_to_default_content()
                    except:
                        pass

        except Exception as e:
            self.log('BET', f'Erro em iframes: {e}')

        self.log('BET', '⚠️ Não consegui clicar BANKER')

    def save_report(self):
        with open('/Users/diego/dev/ruptur-cloud/robot_go_report.json', 'w') as f:
            json.dump({'session': self.session}, f, indent=2)
        self.log('REPORT', '✅ robot_go_report.json')

if __name__ == '__main__':
    robot = BacBoRobotGo()
    robot.run()

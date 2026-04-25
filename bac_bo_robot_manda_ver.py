#!/usr/bin/env python3
"""
Will Dados Pro — MANDA VER!
Login automático + Clica BANKER + Aguarda resultado
"""
from seleniumbase import SB
import time
import json
from datetime import datetime

class BacBoRobotMandaVer:
    def __init__(self, email, password):
        self.email = email
        self.password = password
        self.url = 'https://betboom.bet.br/casino/game/bac_bo-26281/'
        self.session = []

    def log(self, tag, msg):
        ts = datetime.now().strftime('%H:%M:%S')
        print(f'[{ts}][{tag}] {msg}')
        self.session.append({'ts': ts, 'tag': tag, 'msg': msg})

    def run(self):
        self.log('INIT', '🤖💥 Will Dados Pro — MANDA VER!')

        try:
            with SB(uc=True, headless=False) as sb:
                # FASE 1: Abrir jogo
                self.log('FASE1', '🎮 Abrindo Bac Bo...')
                sb.open(self.url)
                time.sleep(3)

                # FASE 2: Fazer login automático
                self.log('FASE2', '🔐 Fazendo login...')
                if not self.make_login(sb):
                    self.log('ERROR', 'Login falhou!')
                    return False

                time.sleep(5)

                # FASE 3: Recarregar jogo (com sessão logada)
                self.log('FASE3', '♻️ Recarregando jogo...')
                sb.open(self.url)
                time.sleep(5)

                sb.save_screenshot('bac_bo_ready.png')
                self.log('SCREENSHOT', '✅ bac_bo_ready.png')

                # FASE 4: Clicar em BANKER
                self.log('FASE4', '💰 MANDA VER EM BANKER!')
                if self.click_banker(sb):
                    self.log('BET', '✅✅✅ APOSTA COLOCADA!')
                else:
                    self.log('BET', '⚠️ Clique pode não ter funcionado')

                # FASE 5: Aguardar resultado
                self.log('FINAL', '⏳ Aguardando resultado (15s)...')
                time.sleep(15)

                sb.save_screenshot('bac_bo_result.png')
                self.log('SCREENSHOT', '✅ bac_bo_result.png')

                self.log('FINAL', '🏆 EXECUÇÃO CONCLUÍDA!')
                self.save_report()

                return True

        except Exception as e:
            self.log('ERROR', f'❌ {e}')
            import traceback
            traceback.print_exc()
            return False

    def make_login(self, sb):
        """Fazer login automático"""
        self.log('LOGIN', 'Procurando formulário...')

        try:
            # Clicar em "Fazer login" se houver modal
            try:
                self.log('LOGIN', 'Procurando botão "Fazer login"...')
                sb.click("//*[contains(text(), 'Fazer login')]", timeout=3)
                self.log('LOGIN', '✅ Modal aberto')
                time.sleep(2)
            except:
                self.log('LOGIN', '⚠️ Sem modal (talvez já logado?)')

            # Preencher email - múltiplas estratégias
            self.log('LOGIN', f'Email: {self.email[:20]}...')

            email_found = False
            email_selectors = [
                'input[type="email"]',
                'input[type="text"]',
                'input[placeholder*="email"]',
                'input[placeholder*="Email"]',
                'input[name*="email"]',
                'input[id*="email"]',
                'input',  # Último recurso: primeiro input
            ]

            for selector in email_selectors:
                try:
                    inputs = sb.find_elements(selector)
                    if inputs:
                        self.log('LOGIN', f'Encontrado input: {selector}')
                        inputs[0].click()
                        time.sleep(0.5)
                        inputs[0].clear()
                        inputs[0].send_keys(self.email)
                        self.log('LOGIN', '✅ Email preenchido')
                        email_found = True
                        time.sleep(1)
                        break
                except:
                    pass

            if not email_found:
                self.log('LOGIN', '❌ Não achei campo de email')
                return False

            # Preencher senha
            self.log('LOGIN', 'Preenchendo senha...')

            password_found = False
            password_selectors = [
                'input[type="password"]',
                'input[placeholder*="senha"]',
                'input[placeholder*="Senha"]',
                'input[placeholder*="password"]',
                'input[name*="password"]',
            ]

            for selector in password_selectors:
                try:
                    inputs = sb.find_elements(selector)
                    if inputs:
                        self.log('LOGIN', f'Encontrado: {selector}')
                        inputs[0].click()
                        time.sleep(0.5)
                        inputs[0].clear()
                        inputs[0].send_keys(self.password)
                        self.log('LOGIN', '✅ Senha preenchida')
                        password_found = True
                        time.sleep(1)
                        break
                except:
                    pass

            if not password_found:
                self.log('LOGIN', '❌ Não achei campo de senha')
                return False

            # Clicar em botão de submit
            self.log('LOGIN', 'Procurando botão de submit...')

            submit_buttons = [
                'button[type="submit"]',
                "//button[contains(text(), 'Entrar')]",
                "//button[contains(text(), 'entrar')]",
                "//button[contains(text(), 'Login')]",
                "//button",  # Último: primeiro botão
            ]

            for selector in submit_buttons:
                try:
                    buttons = sb.find_elements(selector)
                    if buttons:
                        self.log('LOGIN', f'Clicando: {selector[:40]}...')
                        buttons[0].click()
                        self.log('LOGIN', '✅ Botão submit clicado')
                        return True
                except:
                    pass

            self.log('LOGIN', '❌ Não achei botão de submit')
            return False

        except Exception as e:
            self.log('LOGIN', f'❌ Erro: {e}')
            return False

    def click_banker(self, sb):
        """Clicar em BANKER"""
        self.log('BET', '🔍 Procurando BANKER...')

        # Estratégia 1: XPath
        xpaths = [
            "//button[contains(text(), 'Banker')]",
            "//button[contains(., 'Banker')]",
            "//*[contains(text(), 'Banker')]",
        ]

        for xpath in xpaths:
            try:
                elements = sb.find_elements(xpath)
                if elements:
                    self.log('BET', f'✅ Encontrado BANKER!')
                    elements[0].click()
                    self.log('BET', '✅ CLICOU!')
                    return True
            except:
                pass

        # Estratégia 2: Iframes
        try:
            iframes = sb.find_elements('iframe')
            self.log('BET', f'Iframes: {len(iframes)}')

            for idx in range(len(iframes)):
                try:
                    sb.switch_to_frame(idx)
                    time.sleep(1)

                    buttons = sb.find_elements('button')

                    for btn in buttons:
                        if btn.text and 'banker' in btn.text.lower():
                            self.log('BET', f'✅ Iframe #{idx}: {btn.text}')
                            btn.click()
                            self.log('BET', '✅ CLICOU!')
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

        self.log('BET', '⚠️ Não achei BANKER')
        return False

    def save_report(self):
        with open('/Users/diego/dev/ruptur-cloud/robot_manda_ver_report.json', 'w') as f:
            json.dump({'session': self.session}, f, indent=2)
        self.log('REPORT', '✅ Salvo!')

if __name__ == '__main__':
    email = 'leticiavoglcosta@gmail.com'
    password = '151327Wil#'

    robot = BacBoRobotMandaVer(email, password)
    robot.run()

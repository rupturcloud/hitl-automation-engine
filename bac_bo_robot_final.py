#!/usr/bin/env python3
"""
Will Dados Pro — Robô Bac Bo FINAL
Link único: faz login automático + clica em BANKER
"""
from seleniumbase import SB
import time
import json
from datetime import datetime

class BacBoRobotFinal:
    def __init__(self, email, password):
        self.email = email
        self.password = password
        self.url = 'https://betboom.bet.br/casino/game/bac_bo-26281/'
        self.session = []

    def log(self, tag, msg):
        ts = datetime.now().strftime('%H:%M:%S')
        print(f'[{ts}][{tag}] {msg}')
        self.session.append({'ts': ts, 'tag': tag, 'msg': msg})

    def handle_login_modal(self, sb):
        """Detectar e fazer login pelo modal"""
        self.log('LOGIN', 'Verificando se há modal de login...')
        time.sleep(2)

        try:
            # Procurar botão "Fazer login" ou "Sign in"
            self.log('LOGIN', 'Procurando botão de login...')

            # Estratégias pra encontrar o botão de login
            login_buttons = [
                ("//button[contains(text(), 'Fazer login')]", "Fazer login (PT)"),
                ("//button[contains(text(), 'fazer login')]", "fazer login (lowercase)"),
                ("//button[contains(., 'login')]", "contém 'login'"),
                ("//*[contains(text(), 'Fazer login')]", "Fazer login (div/span)"),
            ]

            for selector, desc in login_buttons:
                try:
                    self.log('LOGIN', f'Tentando: {desc}')
                    sb.click(selector, timeout=3)
                    self.log('LOGIN', f'✅ Clicou em botão de login')
                    time.sleep(3)
                    return True
                except:
                    pass

            self.log('LOGIN', '⚠️ Não encontrou botão de login, continuando...')
            return False

        except Exception as e:
            self.log('LOGIN', f'Erro ao detectar modal: {e}')
            return False

    def fill_login_form(self, sb):
        """Preencher formulário de login"""
        self.log('LOGIN', 'Preenchendo formulário...')

        try:
            # Estratégias pra encontrar campo de email
            email_selectors = [
                'input[type="email"]',
                'input[name="email"]',
                'input[id*="email"]',
                'input[placeholder*="email"]',
                'input[placeholder*="Email"]',
                'input[placeholder*="mail"]',
            ]

            email_found = False
            for selector in email_selectors:
                try:
                    self.log('LOGIN', f'Tentando preencher email via: {selector}')
                    sb.click(selector, timeout=2)
                    sb.clear(selector)
                    sb.type(selector, self.email, interval=0.05)
                    self.log('LOGIN', f'✅ Email preenchido')
                    email_found = True
                    break
                except:
                    pass

            if not email_found:
                self.log('LOGIN', '❌ Não consegui preencher email')
                return False

            time.sleep(1)

            # Estratégias pra encontrar campo de senha
            password_selectors = [
                'input[type="password"]',
                'input[name="password"]',
                'input[id*="password"]',
                'input[placeholder*="password"]',
                'input[placeholder*="Senha"]',
            ]

            password_found = False
            for selector in password_selectors:
                try:
                    self.log('LOGIN', f'Tentando preencher senha via: {selector}')
                    sb.click(selector, timeout=2)
                    sb.clear(selector)
                    sb.type(selector, self.password, interval=0.05)
                    self.log('LOGIN', f'✅ Senha preenchida')
                    password_found = True
                    break
                except:
                    pass

            if not password_found:
                self.log('LOGIN', '❌ Não consegui preencher senha')
                return False

            time.sleep(1)

            # Procurar botão de submit
            submit_buttons = [
                'button[type="submit"]',
                "//button[contains(text(), 'Entrar')]",
                "//button[contains(text(), 'entrar')]",
                "//button[contains(., 'login')]",
            ]

            for selector in submit_buttons:
                try:
                    self.log('LOGIN', f'Tentando submit via: {selector}')
                    sb.click(selector, timeout=2)
                    self.log('LOGIN', f'✅ Botão submit clicado')
                    return True
                except:
                    pass

            self.log('LOGIN', '❌ Não encontrei botão de submit')
            return False

        except Exception as e:
            self.log('LOGIN', f'Erro ao preencher form: {e}')
            return False

    def click_banker(self, sb):
        """Clicar em BANKER após login"""
        self.log('BET', '💰 Procurando botão BANKER...')

        try:
            # Aguardar página carregar após login
            time.sleep(3)

            # Screenshot pra debug
            sb.save_screenshot('bac_bo_logged_in.png')
            self.log('SCREENSHOT', 'bac_bo_logged_in.png')

            # Estratégias progressivas
            strategies = [
                ("//button[contains(text(), 'Banker')]", "XPath Banker direto"),
                ("//button[contains(., 'Banker')]", "XPath contains Banker"),
                ("[class*='banker'] button", "Selector class banker"),
                ("//button", "Qualquer botão (debug)"),
            ]

            for selector, desc in strategies:
                try:
                    self.log('BET', f'Tentando: {desc}')
                    elements = sb.find_elements(selector)

                    if selector == "//button":  # Debug mode
                        self.log('BET', f'  Encontrados {len(elements)} botões')
                        for idx, el in enumerate(elements[:10]):
                            text = el.text[:40] if el.text else '[vazio]'
                            self.log('BET', f'    #{idx}: "{text}"')
                        continue

                    if elements:
                        self.log('BET', f'  ✅ Encontrou {len(elements)} elemento(s)')
                        elements[0].click()
                        self.log('BET', f'  ✅ CLICOU EM BANKER!')
                        return True

                except Exception as e:
                    pass

            # Tentar dentro de iframes
            self.log('BET', 'Tentando dentro de iframes...')

            iframes = sb.find_elements('iframe')
            self.log('BET', f'Total de iframes: {len(iframes)}')

            for iframe_idx in range(len(iframes)):
                try:
                    self.log('BET', f'Entrando iframe #{iframe_idx}...')
                    sb.switch_to_frame(iframe_idx)
                    time.sleep(1)

                    buttons = sb.find_elements('button')
                    self.log('BET', f'  Botões no iframe: {len(buttons)}')

                    for btn_idx, btn in enumerate(buttons[:15]):
                        text = btn.text[:40] if btn.text else '[vazio]'
                        self.log('BET', f'    #{btn_idx}: "{text}"')

                        if 'banker' in text.lower():
                            self.log('BET', f'  🎯 Clicando em: {text}')
                            btn.click()
                            self.log('BET', f'  ✅ CLICOU EM BANKER (iframe #{iframe_idx})!')

                            time.sleep(2)
                            sb.save_screenshot('bac_bo_banker_clicked.png')
                            self.log('SCREENSHOT', 'bac_bo_banker_clicked.png')

                            sb.switch_to_default_content()
                            return True

                    sb.switch_to_default_content()

                except Exception as e:
                    try:
                        sb.switch_to_default_content()
                    except:
                        pass

            self.log('BET', '⚠️ Não consegui clicar em BANKER')
            return False

        except Exception as e:
            self.log('BET', f'Erro: {e}')
            return False

    def run(self):
        """Executar fluxo completo"""
        self.log('INIT', '🤖 Will Dados Pro — FINAL VERSION')
        self.log('INIT', f'Link: {self.url}')

        try:
            with SB(uc=True, headless=False) as sb:
                # 1. Abrir link
                self.log('INIT', 'Abrindo link...')
                sb.open(self.url)
                time.sleep(3)

                # Screenshot inicial
                sb.save_screenshot('bac_bo_initial.png')
                self.log('SCREENSHOT', 'bac_bo_initial.png')

                # 2. Detectar e fazer login
                if self.handle_login_modal(sb):
                    self.log('LOGIN', 'Modal de login detectado')

                    if self.fill_login_form(sb):
                        self.log('LOGIN', '✅ Login realizado')
                        time.sleep(5)
                    else:
                        self.log('LOGIN', '❌ Erro ao fazer login')
                        return False
                else:
                    self.log('LOGIN', 'Nenhum modal de login (talvez já logado?)')

                # 3. Clicar em BANKER
                self.click_banker(sb)

                # 4. Aguardar resultado
                self.log('FINAL', 'Aguardando resultado...')
                time.sleep(10)

                self.log('FINAL', '✅ Execução concluída!')
                self.save_report()

                return True

        except Exception as e:
            self.log('ERROR', f'❌ Erro fatal: {e}')
            import traceback
            traceback.print_exc()
            return False

    def save_report(self):
        """Salvar relatório"""
        with open('/Users/diego/dev/ruptur-cloud/robot_final_report.json', 'w') as f:
            json.dump({'session': self.session}, f, indent=2)
        self.log('REPORT', 'Relatório salvo!')

if __name__ == '__main__':
    # Credenciais
    email = 'leticiavoglcosta@gmail.com'
    password = '151327Wil#'

    robot = BacBoRobotFinal(email, password)
    robot.run()

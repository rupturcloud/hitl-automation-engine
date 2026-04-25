#!/usr/bin/env python3
"""
Will Dados Pro — Robô Bac Bo COM LOGIN AUTOMÁTICO
Faz login, abre Bac Bo, clica em BANKER automaticamente
"""
from seleniumbase import SB
import time
import json
from datetime import datetime

class BacBoRobotLogin:
    def __init__(self, email, password):
        self.email = email
        self.password = password
        self.url = 'https://betboom.bet.br/casino/game/bac_bo-26281/'
        self.session = []

    def log(self, tag, msg):
        ts = datetime.now().strftime('%H:%M:%S')
        print(f'[{ts}][{tag}] {msg}')
        self.session.append({'ts': ts, 'tag': tag, 'msg': msg})

    def login(self, sb):
        """Fazer login no BetBoom"""
        self.log('LOGIN', 'Abrindo página de login...')

        # Ir pra home
        sb.open('https://betboom.com.br')
        time.sleep(3)

        self.log('LOGIN', 'Procurando campo de email...')

        try:
            # Procurar campo de email/login
            # Pode estar em input[type="email"], input[name="email"], etc
            sb.click('input[type="email"]', timeout=2)
            sb.type(self.email)
            self.log('LOGIN', f'✅ Email digitado')
        except:
            try:
                # Alternativa: Procurar input de text
                sb.click('input[type="text"]', timeout=2)
                sb.type(self.email)
                self.log('LOGIN', f'✅ Email digitado (alternativo)')
            except Exception as e:
                self.log('LOGIN', f'❌ Erro ao digitar email: {e}')
                return False

        time.sleep(1)

        self.log('LOGIN', 'Procurando campo de senha...')

        try:
            # Procurar campo de senha
            sb.click('input[type="password"]', timeout=2)
            sb.type(self.password)
            self.log('LOGIN', f'✅ Senha digitada')
        except Exception as e:
            self.log('LOGIN', f'❌ Erro ao digitar senha: {e}')
            return False

        time.sleep(1)

        self.log('LOGIN', 'Procurando botão de Login...')

        try:
            # Procurar botão de submit
            sb.click('button[type="submit"]', timeout=3)
            self.log('LOGIN', '✅ Botão clicado - aguardando...')
            time.sleep(5)
        except:
            try:
                # Alternativa: procurar por texto
                sb.click("//button[contains(text(), 'Entrar')]", timeout=3)
                self.log('LOGIN', '✅ Botão clicado (alternativo)')
                time.sleep(5)
            except Exception as e:
                self.log('LOGIN', f'❌ Erro ao clicar login: {e}')
                return False

        self.log('LOGIN', '✅ Login concluído!')
        return True

    def open_bac_bo(self, sb):
        """Abrir Bac Bo após login"""
        self.log('BAC_BO', f'Abrindo {self.url}...')
        sb.open(self.url)
        time.sleep(5)
        self.log('BAC_BO', f'Título: {sb.get_title()}')
        return True

    def click_banker(self, sb):
        """Clicar em BANKER"""
        self.log('BET', '💰 Procurando botão BANKER...')

        strategies = [
            ("//button[contains(text(), 'Banker')]", "xpath direto"),
            ("//button[contains(., 'Banker')]", "xpath alternativo"),
            ("[class*='banker'] button", "class selector"),
        ]

        for selector, desc in strategies:
            try:
                self.log('BET', f'Tentando: {desc}')
                sb.click(selector, timeout=3)
                self.log('BET', f'✅ CLICOU EM BANKER! ({desc})')
                return True
            except:
                pass

        # Tentar dentro de iframe
        self.log('BET', 'Tentando dentro de iframe...')

        try:
            iframes = sb.find_elements('iframe')
            if iframes:
                self.log('BET', f'Encontrados {len(iframes)} iframes')

                for idx in range(len(iframes)):
                    try:
                        self.log('BET', f'Tentando iframe #{idx}...')
                        sb.switch_to_frame(idx)
                        time.sleep(1)

                        # Procurar botão dentro do iframe
                        buttons = sb.find_elements('button')
                        self.log('BET', f'Botões no iframe: {len(buttons)}')

                        for btn in buttons:
                            if 'banker' in btn.text.lower() or 'bank' in btn.text.lower():
                                self.log('BET', f'Clicando em: {btn.text}')
                                btn.click()
                                self.log('BET', f'✅ CLICOU EM BANKER (iframe #{idx})!')
                                return True

                        # Voltar pro default content
                        sb.switch_to_default_content()

                    except:
                        sb.switch_to_default_content()

        except Exception as e:
            self.log('BET', f'Erro ao tentar iframe: {e}')

        self.log('BET', '❌ Não consegui clicar em BANKER')
        return False

    def run(self):
        """Executar robô completo"""
        self.log('INIT', '🤖 Will Dados Pro — LOGIN + BET')

        try:
            with SB(uc=True, headless=False) as sb:
                # 1. Login
                if not self.login(sb):
                    self.log('FATAL', 'Login falhou')
                    return False

                time.sleep(3)

                # 2. Abrir Bac Bo
                if not self.open_bac_bo(sb):
                    self.log('FATAL', 'Erro ao abrir Bac Bo')
                    return False

                time.sleep(3)

                # 3. Clicar em BANKER
                self.click_banker(sb)

                time.sleep(5)

                self.log('FINAL', '✅ Execução completa!')
                self.save_report()

                return True

        except Exception as e:
            self.log('ERROR', f'❌ Erro fatal: {e}')
            import traceback
            traceback.print_exc()
            return False

    def save_report(self):
        """Salvar relatório"""
        with open('/Users/diego/dev/ruptur-cloud/robot_login_report.json', 'w') as f:
            json.dump({'session': self.session}, f, indent=2)
        self.log('REPORT', 'Relatório salvo!')

if __name__ == '__main__':
    # Credenciais (NÃO salvar em código final!)
    email = 'leticiavoglcosta@gmail.com'
    password = '151327Wil#'

    robot = BacBoRobotLogin(email, password)
    robot.run()

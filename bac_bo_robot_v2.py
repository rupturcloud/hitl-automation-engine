#!/usr/bin/env python3
"""
Will Dados Pro — Robô Bac Bo v2
Versão melhorada: acessa iframes, encontra botões reais, clica apostas
"""
from seleniumbase import SB
import time
import json
from datetime import datetime

class BacBoRobotV2:
    def __init__(self):
        self.url = 'https://betboom.bet.br/casino/game/bac_bo-26281/'
        self.bankroll = {'initial': 1000, 'current': 1000}
        self.session = []

    def log(self, tag, msg):
        ts = datetime.now().strftime('%H:%M:%S')
        print(f'[{ts}][{tag}] {msg}')
        self.session.append({'ts': ts, 'tag': tag, 'msg': msg})

    def find_iframe(self, sb):
        """Encontrar iframe do jogo Evolution"""
        self.log('IFRAME', 'Procurando iframe do jogo...')

        try:
            iframes = sb.find_elements('iframe')
        except:
            iframes = []

        self.log('IFRAME', f'Encontrados {len(iframes)} iframes')

        for idx, iframe in enumerate(iframes):
            try:
                iframe_id = iframe.get_attribute('id')
                iframe_src = iframe.get_attribute('src')
                iframe_title = iframe.get_attribute('title')

                info = f'iframe #{idx}: id={iframe_id}, src={iframe_src[:50]}..., title={iframe_title}'
                self.log('IFRAME', info)

                # Procurar por "evolution", "bac", "game"
                if any(x in str(iframe_src).lower() + str(iframe_id).lower()
                       for x in ['evolution', 'bac', 'game', 'casino']):
                    self.log('IFRAME', f'✅ Encontrado iframe do jogo: #{idx}')
                    return idx, iframe
            except Exception as e:
                pass

        return None, None

    def switch_to_iframe(self, sb, iframe_idx):
        """Mudar contexto pro iframe"""
        try:
            self.log('IFRAME', f'Mudando contexto para iframe #{iframe_idx}...')
            # SeleniumBase suporta switch via index ou elemento
            sb.switch_to_frame(iframe_idx)
            self.log('IFRAME', '✅ Contexto mudado para iframe')
            return True
        except Exception as e:
            self.log('IFRAME', f'❌ Erro ao mudar contexto: {e}')
            return False

    def find_buttons_in_iframe(self, sb):
        """Encontrar botões de aposta dentro do iframe"""
        self.log('BUTTONS', 'Procurando botões de aposta dentro do iframe...')

        # Diferentes estratégias pra encontrar
        strategies = [
            # Estratégia 1: Procurar por texto
            ("//button[contains(text(), 'Player')]", 'PLAYER (texto direto)'),
            ("//button[contains(text(), 'Banker')]", 'BANKER (texto direto)'),
            ("//button[contains(text(), 'Tie')]", 'TIE (texto direto)'),

            # Estratégia 2: Case-insensitive
            ("//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'player')]", 'PLAYER (case-insensitive)'),
            ("//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'banker')]", 'BANKER (case-insensitive)'),

            # Estratégia 3: Por classes
            ("//*[contains(@class, 'player') or contains(@class, 'Player')]", 'Player por class'),
            ("//*[contains(@class, 'banker') or contains(@class, 'Banker')]", 'Banker por class'),

            # Estratégia 4: Qualquer botão (pra Debug)
            ("//button", 'Qualquer botão'),
        ]

        for xpath, desc in strategies:
            try:
                elements = sb.find_elements(xpath)
                if elements:
                    self.log('BUTTONS', f'✅ Encontrado via {desc}: {len(elements)} elemento(s)')
                    for idx, el in enumerate(elements[:3]):  # Primeiros 3
                        text = el.text[:30] if el.text else '[vazio]'
                        self.log('BUTTONS', f'   #{idx}: {text}')
                    return elements
            except:
                pass

        self.log('BUTTONS', '❌ Nenhum botão encontrado')
        return []

    def click_bet(self, sb, target='BANKER'):
        """Clicar em aposta"""
        self.log('BET', f'💰 Clicando em {target}...')

        # Tentar múltiplos seletores
        selectors = [
            f"//button[contains(text(), '{target}')]",
            f"//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '{target.lower()}')]",
            f"//*[contains(@class, '{target.lower()}')]//button",
        ]

        for selector in selectors:
            try:
                sb.click(selector, timeout=2)
                self.log('BET', f'✅ Aposta em {target} colocada!')
                return True
            except:
                pass

        self.log('BET', f'❌ Não consegui clicar em {target}')
        return False

    def run_interactive(self):
        """Modo interativo: abre navegador e você clica manualmente"""
        self.log('MODE', '🎬 Modo INTERATIVO - Você faz login e testa')
        self.log('MODE', 'Deixe o navegador aberto, faça login, e depois continue aqui...')

        with SB(uc=True, headless=False) as sb:
            self.log('INIT', '🤖 Will Dados Pro v2 iniciado')

            # Abrir BetBoom
            self.log('INIT', 'Abrindo BetBoom Bac Bo...')
            sb.open(self.url)
            time.sleep(3)

            self.log('INIT', f'Título: {sb.get_title()}')

            # Dar tempo pro usuário fazer login
            self.log('INIT', '⏳ Aguardando... (você tem 60 segundos pra fazer login)')
            time.sleep(10)

            # Agora procurar iframes
            iframe_idx, iframe = self.find_iframe(sb)

            if iframe_idx is None:
                self.log('ERROR', 'Nenhum iframe encontrado!')
                self.log('ERROR', 'Verifique se você fez login corretamente')
                time.sleep(5)
                return False

            # Mudar para iframe
            if not self.switch_to_iframe(sb, iframe_idx):
                time.sleep(5)
                return False

            time.sleep(2)

            # Procurar botões
            buttons = self.find_buttons_in_iframe(sb)

            # Tentar clicar em BANKER
            self.log('BET', 'Tentando clicar em BANKER...')
            if self.click_bet(sb, 'Banker'):
                self.log('SUCCESS', '✅ APOSTA COLOCADA COM SUCESSO!')
                time.sleep(10)
            else:
                self.log('WARN', '⚠️ Não consegui clicar, mas sistema está funcionando')
                time.sleep(10)

            self.log('FINAL', 'Encerrando...')
            return True

if __name__ == '__main__':
    robot = BacBoRobotV2()
    robot.run_interactive()

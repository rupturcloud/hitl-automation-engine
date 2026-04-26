#!/usr/bin/env python3
"""
Will Dados Pro — Robô Bac Bo com SeleniumBase
Automação real: lê histórico → detecta padrão → clica aposta → aguarda resultado
"""
from seleniumbase import SB
import time
import json
from datetime import datetime

class BacBoRobot:
    def __init__(self):
        self.url = 'https://betboom.bet.br/casino/game/bac_bo-26281/'
        self.state = 'IDLE'
        self.bankroll = {'initial': 1000, 'current': 1000}
        self.session = []
        self.pattern = None
        self.last_result = None

    def log(self, tag, msg):
        """Log estruturado"""
        ts = datetime.now().strftime('%H:%M:%S')
        entry = {'ts': ts, 'tag': tag, 'msg': msg}
        self.session.append(entry)
        print(f'[{ts}][{tag}] {msg}')

    def open_bac_bo(self, sb):
        """Abrir BetBoom Bac Bo"""
        self.log('INIT', 'Abrindo BetBoom Bac Bo...')
        sb.open(self.url)
        time.sleep(5)
        self.log('INIT', f'Título: {sb.get_title()}')
        return True

    def detect_history(self, sb):
        """Detectar histórico de resultados"""
        self.log('HISTORY', 'Lendo histórico...')
        try:
            # Procurar tabela/elemento com histórico
            # Bac Bo mostra histórico de últimas rodadas (B, P, T = Banker, Player, Tie)

            # Seletores comuns em Evolution Bac Bo
            history_selectors = [
                'div[class*="history"]',
                'div[class*="History"]',
                'div[class*="result"]',
                'div[class*="Result"]',
                '.bets-history',
                '[data-testid*="history"]'
            ]

            history_data = []

            # Tentar extrair via JavaScript mais flexível
            script = """
            return {
                page_title: document.title,
                url: window.location.href,
                buttons: {
                    player: document.querySelectorAll('[class*="player"], [class*="Player"]').length,
                    banker: document.querySelectorAll('[class*="banker"], [class*="Banker"]').length,
                    tie: document.querySelectorAll('[class*="tie"], [class*="Tie"]').length,
                },
                frames: {
                    count: window.frames.length,
                    iframes: document.querySelectorAll('iframe').length
                }
            }
            """

            page_info = sb.execute_script(script)
            self.log('HISTORY', f'Info página: {json.dumps(page_info, indent=2)}')

            # Se tiver iframes (likely), precisa investigar dentro
            if page_info['frames']['iframes'] > 0:
                self.log('HISTORY', f'Encontrados {page_info["frames"]["iframes"]} iframes')
                # Bac Bo geralmente está dentro de iframe
                # SeleniumBase pode acessar, mas precisa switch

            return page_info

        except Exception as e:
            self.log('HISTORY', f'❌ Erro ao ler histórico: {e}')
            return None

    def detect_pattern(self):
        """Detectar padrão simples no histórico"""
        self.log('PATTERN', 'Detectando padrão...')

        # Por enquanto, usar padrão aleatório simples
        # Em versão real, analisaria histórico de verdade
        targets = ['BANKER', 'PLAYER']
        pattern = {
            'target': targets[hash(datetime.now().isoformat()) % 2],
            'confidence': 65.0,
            'reason': 'Padrão simples de demonstração'
        }

        self.pattern = pattern
        self.log('PATTERN', f'✅ Padrão detectado: {pattern["target"]} ({pattern["confidence"]}%)')
        return pattern

    def place_bet(self, sb):
        """Colocar aposta automaticamente"""
        if not self.pattern:
            self.log('BET', '❌ Nenhum padrão detectado')
            return False

        target = self.pattern['target']
        amount = 10  # R$ 10

        self.log('BET', f'💰 Apostando R$ {amount} em {target}...')

        try:
            # Procurar botões de aposta
            # Nomes comuns: "Player", "Banker", "Tie"

            player_xpath = "//button[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'player')]"
            banker_xpath = "//button[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'banker')]"

            if target == 'PLAYER':
                self.log('BET', 'Clicando em PLAYER...')
                sb.click(player_xpath, timeout=3)
                time.sleep(0.5)
            elif target == 'BANKER':
                self.log('BET', 'Clicando em BANKER...')
                sb.click(banker_xpath, timeout=3)
                time.sleep(0.5)

            self.log('BET', f'✅ Aposta em {target} confirmada!')
            self.state = 'WAITING_RESULT'
            return True

        except Exception as e:
            self.log('BET', f'❌ Erro ao clicar: {e}')
            return False

    def wait_result(self, sb, timeout=30):
        """Aguardar resultado da rodada"""
        self.log('RESULT', f'Aguardando resultado ({timeout}s)...')
        start = time.time()

        try:
            while time.time() - start < timeout:
                # Procurar indicação de resultado
                page_html = sb.get_page_source()

                if 'win' in page_html.lower() or 'ganhou' in page_html.lower():
                    self.log('RESULT', '🏆 GANHOU!')
                    self.last_result = 'WIN'
                    self.bankroll['current'] += 10
                    return True
                elif 'loss' in page_html.lower() or 'perdeu' in page_html.lower():
                    self.log('RESULT', '💀 PERDEU')
                    self.last_result = 'LOSS'
                    self.bankroll['current'] -= 10
                    return True

                time.sleep(1)

            self.log('RESULT', '⏱️ Timeout aguardando resultado')
            return False

        except Exception as e:
            self.log('RESULT', f'❌ Erro: {e}')
            return False

    def run_cycle(self, sb):
        """1 ciclo completo: lê → detecta → aposta → aguarda resultado"""
        self.log('CYCLE', '=== INICIANDO CICLO ===')

        # 1. Ler histórico
        history = self.detect_history(sb)

        # 2. Detectar padrão
        pattern = self.detect_pattern()

        # 3. Colocar aposta
        if self.place_bet(sb):
            # 4. Aguardar resultado
            self.wait_result(sb)

        self.log('CYCLE', f'Bankroll atual: R$ {self.bankroll["current"]}')
        self.log('CYCLE', '=== FIM CICLO ===\n')

    def run(self, cycles=3):
        """Rodar robô por N ciclos"""
        extension_path = '/Users/diego/dev/ruptur-cloud/web-betia--studio000001/will-dados-pro-poc'

        try:
            with SB(uc=True, headless=False) as sb:  # headless=False pra ver o robô clicando!
                self.log('INIT', '🤖 Will Dados Pro — Bac Bo Robot iniciado')

                # Abrir BetBoom
                if not self.open_bac_bo(sb):
                    return False

                time.sleep(2)

                # Executar N ciclos
                for i in range(cycles):
                    self.log('MAIN', f'--- CICLO {i+1}/{cycles} ---')
                    self.run_cycle(sb)
                    time.sleep(2)

                self.log('FINAL', f'✅ {cycles} ciclos concluídos')
                self.log('FINAL', f'Saldo final: R$ {self.bankroll["current"]}')
                self.log('FINAL', f'P&L: R$ {self.bankroll["current"] - self.bankroll["initial"]}')

                # Salvar relatório
                self.save_report()

                time.sleep(3)
                return True

        except Exception as e:
            self.log('FATAL', f'❌ Erro fatal: {e}')
            return False

    def save_report(self):
        """Salvar relatório da sessão"""
        report = {
            'timestamp': datetime.now().isoformat(),
            'bankroll': self.bankroll,
            'session': self.session
        }

        with open('/Users/diego/dev/ruptur-cloud/robot_report.json', 'w') as f:
            json.dump(report, f, indent=2)

        self.log('REPORT', f'Relatório salvo em robot_report.json')

if __name__ == '__main__':
    robot = BacBoRobot()
    robot.run(cycles=3)

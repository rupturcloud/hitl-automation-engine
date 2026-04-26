#!/usr/bin/env python3
"""
Teste: Verificar se módulos Will foram carregados
"""
from seleniumbase import SB
import time

def test_modules():
    extension_path = '/Users/diego/dev/ruptur-cloud/web-betia--studio000001/will-dados-pro-poc'

    with SB(uc=True, extension_dir=extension_path) as sb:
        print('[TEST] Extensão carregada!')

        # Abrir BetBoom
        print('[TEST] Abrindo BetBoom...')
        sb.open('https://www.betboom.com.br')
        time.sleep(5)

        # Verificar módulos carregados
        modules_to_check = [
            'window.WillRobot',
            'window.WillPanel',
            'window.BalanceDetector',
            'window.HistoryReader'
        ]

        print('[TEST] Verificando módulos...')
        for module in modules_to_check:
            try:
                result = sb.execute_script(f'return typeof {module}')
                status = '✅' if result != 'undefined' else '❌'
                print(f'[TEST] {status} {module}: {result}')
            except Exception as e:
                print(f'[TEST] ❌ {module}: Erro - {e}')

        # Verificar console de erros
        print('[TEST] Verificando console...')
        logs = sb.execute_script('return window.__will_logs || []')
        print(f'[TEST] Logs Will: {logs}')

        # Screenshot
        sb.save_screenshot('test_modules.png')
        print('[TEST] Screenshot salvo!')
        time.sleep(2)

if __name__ == '__main__':
    test_modules()
    print('[TEST] ✅ Verificação concluída!')

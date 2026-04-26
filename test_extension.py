#!/usr/bin/env python3
"""
Teste rápido: Carregar extensão Will Dados Pro POC + abrir BetBoom
"""
from seleniumbase import SB
import time

def test_extension_loading():
    extension_path = '/Users/diego/dev/ruptur-cloud/web-betia--studio000001/will-dados-pro-poc'

    with SB(uc=True, extension_dir=extension_path) as sb:
        print('[TEST] Extensão carregada com sucesso!')

        # Abrir BetBoom
        print('[TEST] Abrindo BetBoom...')
        sb.open('https://www.betboom.com.br')
        time.sleep(3)

        print('[TEST] Título da página:', sb.get_title())

        # Procurar por Bac Bo
        try:
            sb.wait_for_text('Bac Bo', timeout=5)
            print('[TEST] ✅ Bac Bo encontrado na página!')
        except:
            print('[TEST] ⚠️ Bac Bo não encontrado')

        # Tirar screenshot
        sb.save_screenshot('betboom_with_extension.png')
        print('[TEST] Screenshot salvo!')

        # Verificar extensão no console
        print('[TEST] Verificando se extensão está injetada...')
        try:
            result = sb.execute_script('return window.WILL_POC_STATE || "NOT_LOADED"')
            print('[TEST] Estado da extensão:', result)
        except Exception as e:
            print('[TEST] Erro ao verificar extensão:', e)

        time.sleep(2)

if __name__ == '__main__':
    test_extension_loading()
    print('[TEST] ✅ Teste concluído!')

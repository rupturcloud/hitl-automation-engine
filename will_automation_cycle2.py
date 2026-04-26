#!/usr/bin/env python3
"""
CICLO 2 — AUTOMAÇÃO COM SINCRONIZAÇÃO
=======================================

Problema do Ciclo 1: Clicks fora da betting window (ignorados)
Solução do Ciclo 2: Polling + sincronização com countdown

Fluxo:
1. Monitor de DOM: Detecta quando betting window abre
2. Sincronização: Clica APENAS durante a janela
3. Validação: Confirma que saldo mudou
4. Telemetria: Registra cada aposta e resultado
"""

import json
import time
import requests
import pyautogui
import threading
from datetime import datetime
from pathlib import Path
import subprocess
import sys

# ═══════════════════════════════════════════════════════════════
# CONFIGURAÇÃO
# ═══════════════════════════════════════════════════════════════

BRIDGE_URL = 'http://127.0.0.1:5000'
SCREENSHOT_DIR = Path('/tmp/ciclo2_screenshots')
SCREENSHOT_DIR.mkdir(exist_ok=True)
TELEMETRIA_FILE = Path('/Users/diego/dev/ruptur-cloud/ciclo2_telemetria.json')

# Configuração de cliques
CLIQUES_POR_CICLO = 3  # PLAYER, BANKER, TIE
CICLOS_DESEJADOS = 5   # 5 ciclos = 15 apostas total
TIMEOUT_APOSTA = 30    # Segundos para aposta ser processada
DELAY_ENTRE_CLIQUES = 2  # Segundos entre cliques

# Mapa de posições (será ajustado conforme necessário)
POSITIONS = {
    'PLAYER': (400, 600),   # Esquerda
    'BANKER': (800, 600),   # Direita
    'TIE': (600, 600),      # Centro
}

# ═══════════════════════════════════════════════════════════════
# LOGGING
# ═══════════════════════════════════════════════════════════════

def log(tag, msg, level='INFO'):
    ts = datetime.now().strftime('%H:%M:%S.%f')[:-3]
    icon = '✅' if level == 'OK' else '❌' if level == 'ERROR' else '⏳' if level == 'WAIT' else 'ℹ️'
    print(f'[{ts}][{tag:15}] {icon} {msg}')

# ═══════════════════════════════════════════════════════════════
# ESTADO GLOBAL
# ═══════════════════════════════════════════════════════════════

class State:
    def __init__(self):
        self.saldo_inicial = None
        self.saldo_atual = None
        self.total_clicks = 0
        self.total_apostas = 0
        self.total_resultados = 0
        self.ciclo = 0
        self.apostas = []
        self.rodando = True

    def registrar_aposta(self, tipo, saldo_antes, saldo_depois):
        self.total_apostas += 1
        self.apostas.append({
            'numero': self.total_apostas,
            'tipo': tipo,
            'saldo_antes': saldo_antes,
            'saldo_depois': saldo_depois,
            'diferenca': saldo_antes - saldo_depois,
            'timestamp': datetime.now().isoformat(),
        })

    def relatorio(self):
        return {
            'timestamp': datetime.now().isoformat(),
            'ciclo': self.ciclo,
            'saldo_inicial': self.saldo_inicial,
            'saldo_atual': self.saldo_atual,
            'total_clicks': self.total_clicks,
            'total_apostas': self.total_apostas,
            'total_resultados': self.total_resultados,
            'taxa_sucesso': f"{(self.total_apostas / self.total_clicks * 100):.1f}%" if self.total_clicks > 0 else "0%",
            'apostas': self.apostas,
        }

STATE = State()

# ═══════════════════════════════════════════════════════════════
# STEP 1: CAPTURAR SALDO ATUAL (FUNÇÃO CRÍTICA)
# ═══════════════════════════════════════════════════════════════

def capturar_saldo_via_screenshot():
    """
    Usa OCR ou procura por padrão visual para capturar saldo
    Alternativa: use o campo HTML se conseguir acessar
    """
    try:
        # Tirar screenshot
        screenshot = pyautogui.screenshot()
        screenshot.save(SCREENSHOT_DIR / f'saldo_{datetime.now().strftime("%H%M%S%f")[:-3]}.png')

        # TODO: Implementar OCR ou parsing de saldo
        # Por agora, retorna valor fake para teste
        log('SALDO', 'Screenshot capturado (OCR: IMPLEMENTAR)', 'WAIT')
        return None

    except Exception as e:
        log('SALDO', f'Erro ao capturar: {e}', 'ERROR')
        return None

def obter_saldo_via_dom():
    """
    Obtém saldo via API do Will Server V8
    """
    try:
        response = requests.get(f'{BRIDGE_URL}/api/game/balance', timeout=2)
        if response.status_code == 200:
            data = response.json()
            saldo = data.get('balance')
            log('SALDO', f'Saldo: R${saldo:.2f}', 'OK')
            return saldo
        return None
    except Exception as e:
        log('SALDO', f'Erro ao buscar: {e}', 'ERROR')
        return None

# ═══════════════════════════════════════════════════════════════
# STEP 2: DETECTAR COUNTDOWN E BETTING WINDOW
# ═══════════════════════════════════════════════════════════════

def aguardar_betting_window_abrir(timeout=40):
    """
    Aguarda a betting window abrir (polling a cada 500ms)

    Retorna: True se abriu dentro do timeout, False caso contrário
    """
    log('DETECTOR', 'Aguardando betting window abrir...', 'WAIT')
    start = time.time()

    while time.time() - start < timeout:
        try:
            response = requests.get(f'{BRIDGE_URL}/api/game/countdown', timeout=1)
            if response.status_code == 200:
                data = response.json()
                betting_open = data.get('betting_open', False)
                countdown = data.get('countdown', 0)

                if betting_open and countdown > 0:
                    log('DETECTOR', f'🟢 BETTING WINDOW ABERTA! (countdown: {countdown}s)', 'OK')
                    return True

        except Exception as e:
            log('DETECTOR', f'Erro ao verificar: {e}', 'ERROR')

        time.sleep(0.5)

    log('DETECTOR', '❌ Timeout esperando betting window', 'ERROR')
    return False

# ═══════════════════════════════════════════════════════════════
# STEP 3: CLICAR DURANTE A JANELA
# ═══════════════════════════════════════════════════════════════

def fazer_aposta(tipo_aposta):
    """
    Coloca uma aposta via API do Will Server V8

    Retorna: True se aposta foi registrada, False caso contrário
    """
    try:
        log('APOSTA', f'Colocando aposta em {tipo_aposta}...', 'WAIT')

        # Capturar saldo ANTES
        saldo_antes = obter_saldo_via_dom()
        STATE.saldo_inicial = saldo_antes or STATE.saldo_inicial

        STATE.total_clicks += 1

        # Colocar aposta via API
        payload = {
            'type': tipo_aposta,
            'amount': 1.0  # R$ 1 por aposta
        }

        response = requests.post(
            f'{BRIDGE_URL}/api/bet/place',
            json=payload,
            timeout=2
        )

        if response.status_code == 200:
            log('APOSTA', f'✅ Aposta registrada!', 'OK')

            # Aguardar processamento
            time.sleep(2)

            # Capturar saldo DEPOIS
            saldo_depois = obter_saldo_via_dom()

            # Validar
            if saldo_antes is not None and saldo_depois is not None:
                diferenca = saldo_antes - saldo_depois
                if diferenca != 0:
                    log('APOSTA', f'Saldo mudou: R${saldo_antes:.2f} → R${saldo_depois:.2f} (Δ={diferenca:.2f})', 'OK')
                    STATE.registrar_aposta(tipo_aposta, saldo_antes, saldo_depois)
                    return True
                else:
                    log('APOSTA', f'⚠️ Saldo não mudou', 'WAIT')
                    return False
            else:
                log('APOSTA', f'Aposta aceita (saldo=None para validação)', 'WAIT')
                return True

        elif response.status_code == 400:
            error = response.json().get('error', 'Unknown')
            log('APOSTA', f'❌ Erro: {error}', 'ERROR')
            return False
        else:
            log('APOSTA', f'❌ Erro HTTP {response.status_code}', 'ERROR')
            return False

    except requests.Timeout:
        log('APOSTA', f'❌ Timeout ao colocar aposta', 'ERROR')
        return False
    except Exception as e:
        log('APOSTA', f'❌ Erro: {e}', 'ERROR')
        return False

# ═══════════════════════════════════════════════════════════════
# STEP 4: CICLO PRINCIPAL
# ═══════════════════════════════════════════════════════════════

def rodar_ciclo_completo():
    """
    Executa CICLOS_DESEJADOS com 3 cliques cada (PLAYER, BANKER, TIE)
    """

    log('MAIN', '═' * 70, 'OK')
    log('MAIN', 'CICLO 2 — AUTOMAÇÃO COM SINCRONIZAÇÃO', 'OK')
    log('MAIN', '═' * 70, 'OK')
    log('MAIN', f'Objetivo: {CICLOS_DESEJADOS} ciclos × 3 cliques = {CICLOS_DESEJADOS * 3} apostas', 'WAIT')
    log('MAIN', '', 'OK')

    # Aguardar 5 segundos pra user ver a tela
    log('MAIN', 'Iniciando em 5s...', 'WAIT')
    for i in range(5, 0, -1):
        print(f'\r  {i}...', end='', flush=True)
        time.sleep(1)
    print('\n')

    try:
        # Loop de ciclos
        for ciclo in range(1, CICLOS_DESEJADOS + 1):
            if not STATE.rodando:
                break

            STATE.ciclo = ciclo
            log('CICLO', f'Ciclo {ciclo}/{CICLOS_DESEJADOS}', 'OK')

            # 3 apostas: PLAYER, BANKER, TIE
            for tipo in ['PLAYER', 'BANKER', 'TIE']:
                if not STATE.rodando:
                    break

                log('', f'  [{ciclo}.{tipo[0]}] Aguardando betting window...', 'WAIT')

                # Aguardar betting window abrir
                if aguardar_betting_window_abrir():
                    # Colocar aposta
                    sucesso = fazer_aposta(tipo)
                    if sucesso:
                        STATE.total_resultados += 1
                else:
                    log('CICLO', f'  ⏰ Timeout esperando betting window', 'ERROR')

                # Aguardar resultado (1 rodada = ~30s)
                log('ESPERA', 'Aguardando resultado (15s)...', 'WAIT')
                time.sleep(15)

                # Delay antes da próxima aposta
                if tipo != 'TIE':
                    time.sleep(DELAY_ENTRE_CLIQUES)

            log('CICLO', f'✓ Ciclo {ciclo} completo', 'OK')
            log('', '', 'OK')

        # Salvar telemetria
        with open(TELEMETRIA_FILE, 'w') as f:
            json.dump(STATE.relatorio(), f, indent=2)

        log('FINAL', 'Telemetria salva em ciclo2_telemetria.json', 'OK')

    except KeyboardInterrupt:
        log('MAIN', 'Interrompido pelo usuário', 'ERROR')
        STATE.rodando = False
    except Exception as e:
        log('MAIN', f'Erro fatal: {e}', 'ERROR')
        import traceback
        traceback.print_exc()

    # Imprimir relatório final
    relatorio = STATE.relatorio()
    print('\n')
    print('╔════════════════════════════════════════════════════════╗')
    print('║              RELATÓRIO FINAL — CICLO 2                ║')
    print('╚════════════════════════════════════════════════════════╝')
    print()
    print(f'  Saldo inicial:    {relatorio["saldo_inicial"]}')
    print(f'  Saldo final:      {relatorio["saldo_atual"]}')
    print(f'  Diferença:        {(relatorio["saldo_atual"] - relatorio["saldo_inicial"]) if relatorio["saldo_inicial"] else "?"}')
    print()
    print(f'  Clicks executados:  {relatorio["total_clicks"]}')
    print(f'  Apostas registradas: {relatorio["total_apostas"]}')
    print(f'  Resultados recebidos: {relatorio["total_resultados"]}')
    print(f'  Taxa de sucesso:    {relatorio["taxa_sucesso"]}')
    print()
    print(f'  Status: {"✅ ACEITO" if relatorio["total_apostas"] >= CICLOS_DESEJADOS * 2 else "❌ PRECISA DE AJUSTES"}')
    print()

# ═══════════════════════════════════════════════════════════════
# ENTRY POINT
# ═══════════════════════════════════════════════════════════════

if __name__ == '__main__':
    rodar_ciclo_completo()

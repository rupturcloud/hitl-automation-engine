#!/usr/bin/env python3
"""
selenium_driver.py — Orquestrador SeleniumBase para o Will Dados Pro (extensao 3).

Fluxo:
  1. Abre o Chrome com a extensão carregada (UC mode, isTrusted: true).
  2. Conecta ao ws_server.py em ws://localhost:8765.
  3. Aguarda mensagens {type: "PERFORM_BET", id, acao, stake, options}.
  4. Executa clique real via SeleniumBase no iframe correto da mesa.
  5. Envia {type: "BET_RESULT", id, ok, motivo} de volta ao ws_server.py.
     O ws_server.py repassa para a extensão, que resolve o pendingBets[id].

Uso:
  python3 selenium_driver.py [url_do_jogo]

  Exemplo:
    python3 selenium_driver.py https://betboom.bet.br

Dependências:
  pip install seleniumbase websockets
"""

import asyncio
import json
import sys
import time
import threading
from pathlib import Path

def _verificar_dependencias():
    faltando = []
    for pkg in ("websockets", "seleniumbase"):
        try:
            __import__(pkg)
        except ImportError:
            faltando.append(pkg)
    if not faltando:
        return
    print(f"[WDP] Instalando dependências faltando: {' '.join(faltando)}")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", *faltando])
    print("[WDP] Instalação concluída. Recarregando...")
    import importlib
    for pkg in faltando:
        globals()[pkg] = importlib.import_module(pkg)

_verificar_dependencias()

import websockets
from seleniumbase import SB

WS_SERVER = "ws://localhost:8765"
BAC_BO_CHIPS = [2500, 500, 125, 25, 10, 5]
EXTENSION_PATH = str(Path(__file__).parent.resolve())


def decompor_stake(stake: float) -> list[int]:
    restante = round(stake)
    chips = []
    for chip in BAC_BO_CHIPS:
        while restante >= chip:
            chips.append(chip)
            restante -= chip
    return chips if restante == 0 else []


class SeleniumBridge:
    """Gerencia o browser SeleniumBase e executa apostas com cliques reais."""

    def __init__(self):
        self._sb_ctx = None
        self.sb = None
        self._lock = threading.Lock()

    def iniciar(self, url_jogo: str):
        print(f"[WDP] Abrindo Chrome com extensão: {EXTENSION_PATH}")
        self._sb_ctx = SB(
            uc=True,
            extension_dir=EXTENSION_PATH,
            headed=True,
        )
        self.sb = self._sb_ctx.__enter__()
        self.sb.open(url_jogo)
        print("[WDP] Navegador pronto. Aguardando comandos...")

    def executar_aposta(self, acao: str, stake: float, options: dict) -> dict:
        if not self.sb:
            return {"ok": False, "motivo": "Driver não iniciado"}
        with self._lock:
            try:
                return self._realizar_aposta(acao, stake, options)
            except Exception as e:
                return {"ok": False, "motivo": f"Exceção SeleniumBase: {e}"}

    def _realizar_aposta(self, acao: str, stake: float, options: dict) -> dict:
        sb = self.sb
        em_frame = self._entrar_frame_jogo()

        r = self._selecionar_chip(stake)
        if not r["ok"]:
            if em_frame:
                sb.switch_to_default_content()
            return r

        r2 = self._clicar_area(acao)
        if not r2["ok"]:
            if em_frame:
                sb.switch_to_default_content()
            return r2

        # Proteção de empate
        if options.get("protecaoEmpate") and acao != "T":
            val = float(options.get("valorProtecao") or 0)
            if val >= 5:
                self._selecionar_chip(val)
                self._clicar_area("T")

        if em_frame:
            sb.switch_to_default_content()

        return {"ok": True, "motivo": f"{acao} R${stake:.0f} ✓ (SeleniumBase)"}

    def _entrar_frame_jogo(self) -> bool:
        """Entra no iframe da mesa Evolution. Retorna True se entrou em algum frame."""
        sb = self.sb
        try:
            iframes = sb.find_elements("css selector", "iframe")
            for iframe in iframes:
                src = (iframe.get_attribute("src") or "").lower()
                if any(k in src for k in ["bacbo", "bac-bo", "evo-games", "evolutiongaming", "billing-boom"]):
                    sb.switch_to_frame(iframe)
                    return True
        except Exception:
            pass
        return False

    def _selecionar_chip(self, stake: float) -> dict:
        sb = self.sb
        valor = round(stake)

        # Seletores diretos por atributo de valor (mais confiáveis)
        for sel in [f'[data-value="{valor}"]', f'[data-amount="{valor}"]', f'button[value="{valor}"]']:
            try:
                sb.wait_for_element_visible(sel, timeout=3)
                sb.uc_click(sel)
                time.sleep(0.35)
                return {"ok": True, "motivo": f"Chip R${valor}"}
            except Exception:
                pass

        # XPath por texto exato no botão
        for xpath in [
            f'//button[normalize-space(text())="{valor}"]',
            f'//*[contains(@class,"chip") and normalize-space(text())="{valor}"]',
        ]:
            try:
                sb.wait_for_element_visible(xpath, timeout=2)
                sb.uc_click(xpath)
                time.sleep(0.35)
                return {"ok": True, "motivo": f"Chip R${valor} (xpath)"}
            except Exception:
                pass

        # Decomposição em chips menores
        chips = decompor_stake(valor)
        if not chips:
            return {"ok": False, "motivo": f"Não foi possível compor R${valor} com os chips disponíveis"}

        for chip in chips:
            clicou = False
            for sel in [f'[data-value="{chip}"]', f'[data-amount="{chip}"]',
                        f'//button[normalize-space(text())="{chip}"]']:
                try:
                    sb.wait_for_element_visible(sel, timeout=3)
                    sb.uc_click(sel)
                    time.sleep(0.28)
                    clicou = True
                    break
                except Exception:
                    pass
            if not clicou:
                return {"ok": False, "motivo": f"Chip R${chip} não encontrado para compor R${valor}"}

        return {"ok": True, "motivo": f"Chips compostos: {chips}"}

    def _clicar_area(self, acao: str) -> dict:
        sb = self.sb
        data_bet = {"P": "player", "B": "banker", "T": "tie"}.get(acao, "")
        termos = {
            "P": ["player", "jogador"],
            "B": ["banker", "banca"],
            "T": ["tie", "empate"],
        }.get(acao, [])

        # Seletores diretos por data-bet (mais estáveis entre versões da UI)
        for sel in [
            f'[data-bet="{data_bet}"]',
            f'[data-role*="{data_bet}" i]',
        ]:
            try:
                sb.wait_for_element_visible(sel, timeout=2)
                sb.uc_click(sel)
                time.sleep(0.45)
                return {"ok": True, "motivo": f"Área {acao} ({sel})"}
            except Exception:
                pass

        # XPath por texto — exclui elementos de histórico/road
        for termo in termos:
            xpath = (
                f'//*['
                f'contains(translate(normalize-space(.),"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz"),"{termo}")'
                f' and not(contains(@class,"history"))'
                f' and not(contains(@class,"road"))'
                f' and not(contains(@class,"score"))'
                f']'
            )
            try:
                sb.wait_for_element_visible(xpath, timeout=2)
                sb.uc_click(xpath)
                time.sleep(0.45)
                return {"ok": True, "motivo": f"Área {acao} (texto '{termo}')"}
            except Exception:
                pass

        return {"ok": False, "motivo": f"Área {acao} não encontrada na UI"}

    def fechar(self):
        if self._sb_ctx:
            try:
                self._sb_ctx.__exit__(None, None, None)
            except Exception:
                pass


async def loop_ws(bridge: SeleniumBridge):
    """Loop de reconexão ao ws_server.py. Processa PERFORM_BET e responde BET_RESULT."""
    while True:
        try:
            print(f"[WDP] Conectando ao ws_server em {WS_SERVER}...")
            async with websockets.connect(WS_SERVER) as ws:
                print("[WDP] ✓ Conectado. Aguardando PERFORM_BET...")
                await ws.send(json.dumps({
                    "type": "SELENIUM_HELLO",
                    "source": "selenium_driver",
                    "timestamp": time.time()
                }))

                async for message in ws:
                    try:
                        data = json.loads(message)
                    except json.JSONDecodeError:
                        continue

                    # Ignora mensagens que não são PERFORM_BET
                    if data.get("type") != "PERFORM_BET":
                        continue

                    cmd_id = data.get("id")
                    acao = data.get("acao", "")
                    stake = float(data.get("stake", 0))
                    options = data.get("options") or {}

                    print(f"[WDP] ► {acao} R${stake:.0f}  id={cmd_id}")

                    # Executa em thread separada para não bloquear o loop asyncio
                    result = await asyncio.get_event_loop().run_in_executor(
                        None,
                        lambda: bridge.executar_aposta(acao, stake, options)
                    )

                    print(f"[WDP] {'✓' if result['ok'] else '✗'} {result['motivo']}")

                    try:
                        await ws.send(json.dumps({
                            "type": "BET_RESULT",
                            "id": cmd_id,
                            "ok": result["ok"],
                            "motivo": result["motivo"],
                            "timestamp": time.time()
                        }))
                    except Exception:
                        pass  # Se perdeu conexão, o timeout no content.js resolve

        except (websockets.ConnectionClosed, OSError) as e:
            print(f"[WDP] WebSocket caiu: {e}. Reconectando em 5s...")
            await asyncio.sleep(5)
        except Exception as e:
            print(f"[WDP] Erro inesperado: {e}. Reconectando em 5s...")
            await asyncio.sleep(5)


def main():
    url_jogo = sys.argv[1] if len(sys.argv) > 1 else "https://betboom.bet.br"

    bridge = SeleniumBridge()
    bridge.iniciar(url_jogo)

    print("\n" + "=" * 55)
    print("  Will Dados Pro — SeleniumBase Driver")
    print(f"  Browser: aberto | WS: {WS_SERVER}")
    print("  Cliques: isTrusted=true via WebDriver")
    print("  Ctrl+C para encerrar")
    print("=" * 55 + "\n")

    try:
        asyncio.run(loop_ws(bridge))
    except KeyboardInterrupt:
        print("\n[WDP] Encerrando...")
        bridge.fechar()


if __name__ == "__main__":
    main()

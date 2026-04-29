#!/usr/bin/env python3
"""
selenium_driver.py — SeleniumBase clicker para Will Dados Pro (extensao 3).

Abre o Chrome com a extensão carregada (UC mode) e conecta ao ws_server.py.
Quando chega um PERFORM_BET, executa o clique real via SeleniumBase
(isTrusted: true) e devolve o BET_RESULT para a extensão.

Uso:
  python3 selenium_driver.py [url]
  python3 selenium_driver.py https://betboom.bet.br/casino/game/bac_bo-26281/

Dependências instaladas automaticamente se faltarem:
  seleniumbase  websockets
"""

import asyncio
import json
import os
import queue
import sys
import threading
import time
from pathlib import Path

BAC_BO_CHIPS = [2500, 500, 125, 25, 10, 5]
WS_SERVER    = "ws://localhost:8765"
EXT_PATH     = str(Path(__file__).parent.resolve())
URL_PADRAO   = "https://betboom.bet.br"
PROFILE_NAME = os.environ.get("WDP_PROFILE", "diegoizac")
PROFILE_DIR  = Path(__file__).resolve().parents[1] / ".wdp_chrome_profiles" / PROFILE_NAME


# ── dependências ──────────────────────────────────────────────────────────────

def _garantir_deps():
    import subprocess
    needed = {"seleniumbase": "seleniumbase", "websockets": "websockets"}
    faltando = [pkg for mod, pkg in needed.items() if not _importavel(mod)]
    if not faltando:
        return
    print(f"[WDP] Instalando: {' '.join(faltando)} ...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", *faltando], stdout=subprocess.DEVNULL)
    print("[WDP] Instalação concluída.")

def _importavel(nome):
    try:
        __import__(nome)
        return True
    except ImportError:
        return False

_garantir_deps()

import websockets
from seleniumbase import Driver


# ── helpers ───────────────────────────────────────────────────────────────────

def decompor_stake(stake: float) -> list:
    restante = round(stake)
    chips = []
    for chip in BAC_BO_CHIPS:
        while restante >= chip:
            chips.append(chip)
            restante -= chip
    return chips if restante == 0 else []


# ── clicker SeleniumBase ──────────────────────────────────────────────────────

class BacBoClicker:
    def __init__(self, url: str):
        print(f"[WDP] Abrindo Chrome com extensão: {EXT_PATH}")
        PROFILE_DIR.mkdir(parents=True, exist_ok=True)
        print(f"[WDP] Perfil persistente: {PROFILE_DIR}")
        self.driver = Driver(
            uc=True,
            headed=True,
            extension_dir=EXT_PATH,
            user_data_dir=str(PROFILE_DIR),
        )
        self.driver.open(url)
        print(f"[WDP] ✓ Chrome aberto → {url}")

    # ── ponto de entrada ──────────────────────────────────────────────────────

    def realizar_aposta(self, acao: str, stake: float, options: dict) -> dict:
        try:
            return self._realizar(acao, stake, options)
        except Exception as e:
            self._sair_frame()
            return {"ok": False, "motivo": f"Exceção: {e}"}

    def _realizar(self, acao, stake, options):
        self._entrar_frame_jogo()

        r = self._selecionar_chip(stake)
        if not r["ok"]:
            self._sair_frame()
            return r

        r2 = self._clicar_area(acao)
        if not r2["ok"]:
            self._sair_frame()
            return r2

        if options.get("protecaoEmpate") and acao != "T":
            val = float(options.get("valorProtecao") or 0)
            if val >= 5:
                self._selecionar_chip(val)
                self._clicar_area("T")

        self._sair_frame()
        return {"ok": True, "motivo": f"{acao} R${stake:.0f} ✓ (SeleniumBase UC)"}

    # ── navegação de frame ────────────────────────────────────────────────────

    def _entrar_frame_jogo(self) -> bool:
        d = self.driver
        d.switch_to.default_content()
        try:
            for iframe in d.find_elements("tag name", "iframe"):
                src = (iframe.get_attribute("src") or "").lower()
                if any(k in src for k in ["bacbo", "bac-bo", "evo-games", "evolutiongaming", "billing-boom"]):
                    d.switch_to.frame(iframe)
                    return True
        except Exception:
            pass
        return False

    def _sair_frame(self):
        try:
            self.driver.switch_to.default_content()
        except Exception:
            pass

    # ── seleção de chip ───────────────────────────────────────────────────────

    def _selecionar_chip(self, stake: float) -> dict:
        valor = round(stake)

        # atributo direto
        for sel in [f'[data-value="{valor}"]', f'[data-amount="{valor}"]', f'button[value="{valor}"]']:
            if self._uc_click_safe(sel):
                time.sleep(0.32)
                return {"ok": True, "motivo": f"Chip R${valor}"}

        # XPath por texto exato
        for xp in [
            f'//button[normalize-space(text())="{valor}"]',
            f'//*[contains(@class,"chip") and normalize-space(text())="{valor}"]',
        ]:
            if self._uc_click_safe(xp):
                time.sleep(0.32)
                return {"ok": True, "motivo": f"Chip R${valor} (xpath)"}

        # decomposição
        chips = decompor_stake(valor)
        if not chips:
            return {"ok": False, "motivo": f"Não compõe R${valor} com chips Bac Bo"}
        for chip in chips:
            ok = False
            for sel in [f'[data-value="{chip}"]', f'[data-amount="{chip}"]',
                        f'//button[normalize-space(text())="{chip}"]']:
                if self._uc_click_safe(sel):
                    time.sleep(0.26)
                    ok = True
                    break
            if not ok:
                return {"ok": False, "motivo": f"Chip R${chip} não encontrado (compondo R${valor})"}
        return {"ok": True, "motivo": f"Chips compostos: {chips}"}

    # ── clique na área ────────────────────────────────────────────────────────

    def _clicar_area(self, acao: str) -> dict:
        data_bet = {"P": "player", "B": "banker", "T": "tie"}.get(acao, "")
        termos   = {"P": ["player","jogador"], "B": ["banker","banca"], "T": ["tie","empate"]}.get(acao, [])

        for sel in [f'[data-bet="{data_bet}"]', f'[data-role*="{data_bet}" i]']:
            if self._uc_click_safe(sel):
                time.sleep(0.42)
                return {"ok": True, "motivo": f"Área {acao} ({sel})"}

        for termo in termos:
            xp = (
                f'//*[contains('
                f'translate(normalize-space(.),"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz")'
                f',"{termo}")'
                f' and not(contains(@class,"history"))'
                f' and not(contains(@class,"road"))'
                f' and not(contains(@class,"score"))]'
            )
            if self._uc_click_safe(xp):
                time.sleep(0.42)
                return {"ok": True, "motivo": f"Área {acao} ('{termo}')"}

        return {"ok": False, "motivo": f"Área {acao} não encontrada"}

    # ── click helper ─────────────────────────────────────────────────────────

    def _uc_click_safe(self, selector: str, timeout: int = 4) -> bool:
        try:
            self.driver.wait_for_element_visible(selector, timeout=timeout)
            self.driver.uc_click(selector)
            return True
        except Exception:
            return False

    def fechar(self):
        try:
            self.driver.quit()
        except Exception:
            pass


# ── WebSocket loop (thread separada) ─────────────────────────────────────────

async def _ws_loop(to_selenium: queue.Queue, from_selenium: queue.Queue):
    while True:
        try:
            print(f"[WDP] Conectando ao ws_server em {WS_SERVER} ...")
            async with websockets.connect(WS_SERVER) as ws:
                print("[WDP] ✓ ws_server conectado. Aguardando PERFORM_BET...\n")
                await ws.send(json.dumps({
                    "type": "SB_HELLO", "source": "selenium_driver",
                    "timestamp": time.time()
                }))

                async def sender():
                    while True:
                        try:
                            res = from_selenium.get_nowait()
                            await ws.send(json.dumps(res))
                        except queue.Empty:
                            pass
                        await asyncio.sleep(0.05)

                asyncio.create_task(sender())

                async for raw in ws:
                    try:
                        data = json.loads(raw)
                    except Exception:
                        continue
                    if data.get("type") == "PERFORM_BET":
                        to_selenium.put(data)

        except (websockets.ConnectionClosed, OSError) as e:
            print(f"[WDP] WS perdeu conexão ({e}). Reconectando em 5 s...")
            await asyncio.sleep(5)
        except Exception as e:
            print(f"[WDP] Erro WS: {e}. Reconectando em 5 s...")
            await asyncio.sleep(5)


def _ws_thread(to_selenium, from_selenium):
    asyncio.run(_ws_loop(to_selenium, from_selenium))


# ── main ──────────────────────────────────────────────────────────────────────

def main():
    url = sys.argv[1] if len(sys.argv) > 1 else URL_PADRAO

    print("=" * 58)
    print("  Will Dados Pro — SeleniumBase Driver")
    print(f"  Extensão : {EXT_PATH}")
    print(f"  WS server: {WS_SERVER}")
    print(f"  URL jogo : {url}")
    print("  Ctrl+C para encerrar")
    print("=" * 58 + "\n")

    clicker = BacBoClicker(url)

    to_selenium   = queue.Queue()
    from_selenium = queue.Queue()

    t = threading.Thread(target=_ws_thread, args=(to_selenium, from_selenium), daemon=True)
    t.start()

    print("[WDP] Loop principal ativo. Aguardando comandos...\n")
    try:
        while True:
            try:
                cmd = to_selenium.get(timeout=0.5)
            except queue.Empty:
                continue

            cmd_id = cmd.get("id")
            acao   = cmd.get("acao", "")
            stake  = float(cmd.get("stake", 0))
            opts   = cmd.get("options") or {}

            print(f"[WDP] ► {acao} R${stake:.0f}  id={cmd_id}")
            result = clicker.realizar_aposta(acao, stake, opts)
            mark   = "✓" if result["ok"] else "✗"
            print(f"[WDP] {mark} {result['motivo']}")

            from_selenium.put({
                "type": "BET_RESULT",
                "id": cmd_id,
                "ok": result["ok"],
                "motivo": result["motivo"],
                "timestamp": time.time()
            })

    except KeyboardInterrupt:
        print("\n[WDP] Encerrando...")
        clicker.fechar()


if __name__ == "__main__":
    main()

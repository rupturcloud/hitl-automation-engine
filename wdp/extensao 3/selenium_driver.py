#!/usr/bin/env python3
"""
selenium_driver.py — Clicker CDP para Will Dados Pro (extensao 3).

Conecta ao Chrome JÁ ABERTO via remote debugging port (9222) e executa
cliques reais (isTrusted=true) via Input.dispatchMouseEvent do CDP.

NÃO abre uma nova janela — usa o Chrome do usuário com o jogo aberto.

━━━ SETUP (uma vez só) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Feche o Chrome completamente e reabra com a flag de debug:

  macOS:
    open -a "Google Chrome" --args --remote-debugging-port=9222

  Windows:
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --remote-debugging-port=9222

Depois abra o jogo normalmente. Então rode este script:

  python3 selenium_driver.py
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dependências:
  pip install selenium websockets
  (chromedriver será baixado automaticamente pelo selenium-manager)
"""

import asyncio
import json
import sys
import time
import urllib.request

BAC_BO_CHIPS = [2500, 500, 125, 25, 10, 5]
WS_SERVER = "ws://localhost:8765"
CDP_HOST = "localhost"
CDP_PORT = 9222


def _instalar_se_precisar(pkgs: list[str]):
    import importlib, subprocess
    faltando = [p for p in pkgs if not _pode_importar(p)]
    if not faltando:
        return
    print(f"[WDP] Instalando: {' '.join(faltando)}")
    subprocess.check_call([sys.executable, "-m", "pip", "install", *faltando])


def _pode_importar(nome: str) -> bool:
    try:
        __import__(nome)
        return True
    except ImportError:
        return False


_instalar_se_precisar(["selenium", "websockets"])

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import websockets


def decompor_stake(stake: float) -> list[int]:
    restante = round(stake)
    chips = []
    for chip in BAC_BO_CHIPS:
        while restante >= chip:
            chips.append(chip)
            restante -= chip
    return chips if restante == 0 else []


def conectar_chrome() -> webdriver.Chrome:
    """Conecta ao Chrome já aberto com --remote-debugging-port=9222."""
    try:
        with urllib.request.urlopen(f"http://{CDP_HOST}:{CDP_PORT}/json/version", timeout=3) as r:
            info = json.loads(r.read())
        print(f"[WDP] Chrome encontrado: {info.get('Browser', '?')}")
    except Exception:
        print(f"\n[WDP] ✗ Chrome não encontrado em localhost:{CDP_PORT}")
        print("[WDP] Feche o Chrome e reabra com:")
        print('[WDP]   macOS:   open -a "Google Chrome" --args --remote-debugging-port=9222')
        print('[WDP]   Windows: chrome.exe --remote-debugging-port=9222')
        sys.exit(1)

    opts = Options()
    opts.add_experimental_option("debuggerAddress", f"{CDP_HOST}:{CDP_PORT}")
    # Suprime logs do chromedriver
    opts.add_experimental_option("excludeSwitches", ["enable-logging"])

    driver = webdriver.Chrome(options=opts)
    print(f"[WDP] ✓ Conectado ao Chrome | Aba atual: {driver.title[:60]}")
    return driver


class BacBoClicker:
    """Executa apostas reais no iframe da mesa via Selenium + CDP."""

    def __init__(self, driver: webdriver.Chrome):
        self.driver = driver

    def realizar_aposta(self, acao: str, stake: float, options: dict) -> dict:
        try:
            return self._realizar(acao, stake, options)
        except Exception as e:
            return {"ok": False, "motivo": f"Exceção: {e}"}

    def _realizar(self, acao: str, stake: float, options: dict) -> dict:
        driver = self.driver

        # Entra no iframe da mesa
        em_frame = self._entrar_frame_jogo()

        r = self._selecionar_chip(stake)
        if not r["ok"]:
            if em_frame:
                driver.switch_to.default_content()
            return r

        r2 = self._clicar_area(acao)
        if not r2["ok"]:
            if em_frame:
                driver.switch_to.default_content()
            return r2

        # Proteção de empate
        if options.get("protecaoEmpate") and acao != "T":
            val = float(options.get("valorProtecao") or 0)
            if val >= 5:
                self._selecionar_chip(val)
                self._clicar_area("T")

        if em_frame:
            driver.switch_to.default_content()

        return {"ok": True, "motivo": f"{acao} R${stake:.0f} ✓ (isTrusted)"}

    def _entrar_frame_jogo(self) -> bool:
        driver = self.driver
        driver.switch_to.default_content()
        try:
            iframes = driver.find_elements(By.TAG_NAME, "iframe")
            for iframe in iframes:
                src = (iframe.get_attribute("src") or "").lower()
                if any(k in src for k in ["bacbo", "bac-bo", "evo-games", "evolutiongaming", "billing-boom"]):
                    driver.switch_to.frame(iframe)
                    return True
        except Exception:
            pass
        return False

    def _selecionar_chip(self, stake: float) -> dict:
        driver = self.driver
        valor = round(stake)
        wait = WebDriverWait(driver, 4)

        # Seletores por atributo de valor
        for sel in [f'[data-value="{valor}"]', f'[data-amount="{valor}"]', f'button[value="{valor}"]']:
            try:
                el = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, sel)))
                el.click()
                time.sleep(0.3)
                return {"ok": True, "motivo": f"Chip R${valor}"}
            except Exception:
                pass

        # XPath por texto exato
        for xpath in [
            f'//button[normalize-space(text())="{valor}"]',
            f'//*[contains(@class,"chip") and normalize-space(text())="{valor}"]',
        ]:
            try:
                el = wait.until(EC.element_to_be_clickable((By.XPATH, xpath)))
                el.click()
                time.sleep(0.3)
                return {"ok": True, "motivo": f"Chip R${valor} (xpath)"}
            except Exception:
                pass

        # Decomposição em chips menores
        chips = decompor_stake(valor)
        if not chips:
            return {"ok": False, "motivo": f"Não foi possível compor R${valor}"}

        for chip in chips:
            ok = False
            for sel in [f'[data-value="{chip}"]', f'[data-amount="{chip}"]',
                        f'//button[normalize-space(text())="{chip}"]']:
                by = By.XPATH if sel.startswith("//") else By.CSS_SELECTOR
                try:
                    el = wait.until(EC.element_to_be_clickable((by, sel)))
                    el.click()
                    time.sleep(0.25)
                    ok = True
                    break
                except Exception:
                    pass
            if not ok:
                return {"ok": False, "motivo": f"Chip R${chip} não encontrado para compor R${valor}"}

        return {"ok": True, "motivo": f"Chips compostos: {chips}"}

    def _clicar_area(self, acao: str) -> dict:
        driver = self.driver
        wait = WebDriverWait(driver, 4)
        data_bet = {"P": "player", "B": "banker", "T": "tie"}.get(acao, "")
        termos = {"P": ["player", "jogador"], "B": ["banker", "banca"], "T": ["tie", "empate"]}.get(acao, [])

        # data-bet (mais estável entre versões de UI)
        for sel in [f'[data-bet="{data_bet}"]', f'[data-role*="{data_bet}" i]']:
            try:
                el = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, sel)))
                el.click()
                time.sleep(0.4)
                return {"ok": True, "motivo": f"Área {acao} ({sel})"}
            except Exception:
                pass

        # XPath por texto, excluindo histórico/road
        for termo in termos:
            xpath = (
                f'//*['
                f'contains(translate(normalize-space(.),'
                f'"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz"),"{termo}")'
                f' and not(contains(@class,"history"))'
                f' and not(contains(@class,"road"))'
                f' and not(contains(@class,"score"))'
                f']'
            )
            try:
                el = wait.until(EC.element_to_be_clickable((By.XPATH, xpath)))
                el.click()
                time.sleep(0.4)
                return {"ok": True, "motivo": f"Área {acao} ('{termo}')"}
            except Exception:
                pass

        return {"ok": False, "motivo": f"Área {acao} não encontrada na UI"}


async def loop_ws(clicker: BacBoClicker):
    """Conecta ao ws_server.py e processa PERFORM_BET com retry automático."""
    while True:
        try:
            print(f"[WDP] Conectando ao ws_server em {WS_SERVER}...")
            async with websockets.connect(WS_SERVER) as ws:
                print("[WDP] ✓ Conectado ao ws_server. Aguardando PERFORM_BET...\n")
                await ws.send(json.dumps({
                    "type": "CDP_CLICKER_HELLO",
                    "source": "selenium_driver",
                    "timestamp": time.time()
                }))

                async for message in ws:
                    try:
                        data = json.loads(message)
                    except json.JSONDecodeError:
                        continue

                    if data.get("type") != "PERFORM_BET":
                        continue

                    cmd_id = data.get("id")
                    acao   = data.get("acao", "")
                    stake  = float(data.get("stake", 0))
                    opts   = data.get("options") or {}

                    print(f"[WDP] ► PERFORM_BET {acao} R${stake:.0f}  id={cmd_id}")

                    # Executa em thread para não bloquear o loop asyncio
                    result = await asyncio.get_event_loop().run_in_executor(
                        None,
                        lambda: clicker.realizar_aposta(acao, stake, opts)
                    )

                    status = "✓" if result["ok"] else "✗"
                    print(f"[WDP] {status} {result['motivo']}")

                    try:
                        await ws.send(json.dumps({
                            "type": "BET_RESULT",
                            "id": cmd_id,
                            "ok": result["ok"],
                            "motivo": result["motivo"],
                            "timestamp": time.time()
                        }))
                    except Exception:
                        pass

        except (websockets.ConnectionClosed, OSError) as e:
            print(f"[WDP] WS caiu ({e}). Reconectando em 5s...")
            await asyncio.sleep(5)
        except Exception as e:
            print(f"[WDP] Erro: {e}. Reconectando em 5s...")
            await asyncio.sleep(5)


def main():
    print("=" * 58)
    print("  Will Dados Pro — CDP Clicker")
    print(f"  Chrome: localhost:{CDP_PORT} | WS: {WS_SERVER}")
    print("  Cliques: isTrusted=true via Selenium WebDriver")
    print("=" * 58)

    driver = conectar_chrome()
    clicker = BacBoClicker(driver)

    try:
        asyncio.run(loop_ws(clicker))
    except KeyboardInterrupt:
        print("\n[WDP] Encerrando.")
        try:
            driver.quit()
        except Exception:
            pass


if __name__ == "__main__":
    main()

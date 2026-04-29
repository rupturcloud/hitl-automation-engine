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
import queue
import random
import sys
import threading
import time
from pathlib import Path

BAC_BO_CHIPS = [2500, 500, 125, 25, 10, 5]
WS_SERVER    = "ws://localhost:8765"
EXT_PATH     = str(Path(__file__).parent.resolve())
URL_PADRAO   = "https://betboom.bet.br/casino/game/bac_bo-26281/"
# Perfil Selenium dedicado com sessão betboom do Diego já salva
PROFILE_DIR  = Path.home() / ".selenium_profile_diego"


def _preparar_perfil():
    """Cria o diretório e remove lock files do Chrome (evita erro se fechou sem sair corretamente)."""
    PROFILE_DIR.mkdir(parents=True, exist_ok=True)
    for lock in ["SingletonLock", "SingletonCookie", "SingletonSocket"]:
        p = PROFILE_DIR / lock
        if p.exists():
            try:
                p.unlink()
                print(f"[WDP] Lock removido: {lock}")
            except Exception:
                pass


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
from selenium.webdriver import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
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
        self._url = url
        self.driver = self._abrir_driver()

    def _abrir_driver(self):
        _preparar_perfil()
        print(f"[WDP] Abrindo Chrome com extensão: {EXT_PATH}")
        print(f"[WDP] Perfil persistente: {PROFILE_DIR}")
        d = Driver(
            uc=True,
            headed=True,
            extension_dir=EXT_PATH,
            user_data_dir=str(PROFILE_DIR),
        )
        d.open(self._url)
        print(f"[WDP] ✓ Chrome aberto → {self._url}")
        return d

    def _driver_vivo(self) -> bool:
        try:
            self.driver.current_url  # noqa: B018
            return True
        except Exception:
            return False

    def _reconectar(self) -> bool:
        print("[WDP] Chrome desconectado — tentando reabrir...")
        try:
            self.driver.quit()
        except Exception:
            pass
        try:
            self.driver = self._abrir_driver()
            return True
        except Exception as e:
            print(f"[WDP] ✗ Falha ao reabrir Chrome: {e}")
            return False

    # ── ponto de entrada ──────────────────────────────────────────────────────

    def realizar_aposta(self, acao: str, stake: float, options: dict) -> dict:
        if not self._driver_vivo():
            if not self._reconectar():
                return {"ok": False, "motivo": "Chrome desconectado e não foi possível reabrir."}
            time.sleep(2)  # aguarda página carregar após reconexão
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
            if self._human_click_safe(sel):
                time.sleep(0.32)
                return {"ok": True, "motivo": f"Chip R${valor}"}

        # XPath por texto exato
        for xp in [
            f'//button[normalize-space(text())="{valor}"]',
            f'//*[contains(@class,"chip") and normalize-space(text())="{valor}"]',
        ]:
            if self._human_click_safe(xp):
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
                if self._human_click_safe(sel):
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
            if self._human_click_safe(sel):
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
            if self._human_click_safe(xp):
                time.sleep(0.42)
                return {"ok": True, "motivo": f"Área {acao} ('{termo}')"}

        return {"ok": False, "motivo": f"Área {acao} não encontrada"}

    # ── click helper ─────────────────────────────────────────────────────────

    def _human_click_safe(self, selector: str, timeout: int = 4) -> bool:
        """Move + clique via ActionChains (CDP → isTrusted: true). Funciona em iframes cross-origin."""
        try:
            by = By.XPATH if selector.startswith("//") else By.CSS_SELECTOR
            el = WebDriverWait(self.driver, timeout).until(
                EC.element_to_be_clickable((by, selector))
            )

            # Scroll suave para o centro
            self.driver.execute_script(
                "arguments[0].scrollIntoView({block:'center',inline:'center'});", el
            )
            time.sleep(0.08)

            sz = el.size
            w = max(sz.get("width", 10), 1)
            h = max(sz.get("height", 10), 1)

            # Movimento humanizado: vai ao elemento → leve overshoot → corrige → clica
            ac = ActionChains(self.driver)
            ac.move_to_element(el)
            ac.pause(random.uniform(0.10, 0.22))
            # overshoot pequeno
            ac.move_to_element_with_offset(
                el,
                random.uniform(-w * 0.18, w * 0.18),
                random.uniform(-h * 0.18, h * 0.18),
            )
            ac.pause(random.uniform(0.04, 0.10))
            # corrige para centro
            ac.move_to_element(el)
            ac.pause(random.uniform(0.03, 0.07))
            ac.click()
            ac.perform()

            # Ripple visual injetado no DOM do frame
            self._ripple(el)
            return True
        except Exception as e:
            print(f"[WDP]   ✗ selector {selector!r}: {e}")
            return False

    def _ripple(self, el) -> None:
        """Injeta animação de clique no elemento (círculo que expande e some)."""
        try:
            self.driver.execute_script(
                """
                (function(el){
                    var r = el.getBoundingClientRect();
                    var cx = r.left + r.width/2, cy = r.top + r.height/2;
                    [
                        {s:'8px',  e:'64px',  ms:450, c:'rgba(239,68,68,0.0)',  b:'2px solid rgba(239,68,68,0.85)'},
                        {s:'6px',  e:'22px',  ms:220, c:'rgba(239,68,68,0.55)', b:'none'}
                    ].forEach(function(cfg){
                        var d = document.createElement('div');
                        var half = parseInt(cfg.s)/2;
                        d.style.cssText =
                            'position:fixed;pointer-events:none;z-index:2147483647;border-radius:50%;' +
                            'left:'+(cx-half)+'px;top:'+(cy-half)+'px;' +
                            'width:'+cfg.s+';height:'+cfg.s+';' +
                            'background:'+cfg.c+';border:'+cfg.b+';' +
                            'transition:all '+cfg.ms+'ms ease-out;';
                        document.body.appendChild(d);
                        requestAnimationFrame(function(){
                            var eHalf = parseInt(cfg.e)/2;
                            d.style.left=(cx-eHalf)+'px'; d.style.top=(cy-eHalf)+'px';
                            d.style.width=cfg.e; d.style.height=cfg.e; d.style.opacity='0';
                        });
                        setTimeout(function(){ d.remove(); }, cfg.ms);
                    });
                })(arguments[0]);
                """,
                el,
            )
        except Exception:
            pass

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

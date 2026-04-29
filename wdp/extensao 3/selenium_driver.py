#!/usr/bin/env python3
"""
selenium_driver.py — CDP Clicker para Will Dados Pro (extensao 3).

Conecta ao Chrome JÁ ABERTO via remote debugging port (9222) e executa
cliques reais (isTrusted=true) via Input.dispatchMouseEvent do CDP.

NÃO abre nova janela — usa o Chrome do usuário com o jogo já aberto.

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
  pip install websockets
  (nenhum selenium / seleniumbase necessário)
"""

import asyncio
import json
import sys
import time
import urllib.request
import urllib.error

# ── configurações ─────────────────────────────────────────────────────────────

BAC_BO_CHIPS = [2500, 500, 125, 25, 10, 5]
WS_SERVER    = "ws://localhost:8765"
CDP_HOST     = "localhost"
CDP_PORT     = 9222

# ── instalação automática de dependências ─────────────────────────────────────

def _pode_importar(pkg: str) -> bool:
    try:
        __import__(pkg)
        return True
    except ImportError:
        return False


def _instalar_se_precisar(pkgs: list):
    import subprocess
    faltando = [p for p in pkgs if not _pode_importar(p.split("==")[0].replace("-", "_"))]
    if not faltando:
        return
    print(f"[WDP] Instalando: {' '.join(faltando)} ...")
    subprocess.check_call(
        [sys.executable, "-m", "pip", "install", *faltando],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    print("[WDP] Instalação concluída.")


_instalar_se_precisar(["websockets"])

import websockets  # noqa: E402

# ── helpers CDP ───────────────────────────────────────────────────────────────

def _cdp_listar_abas() -> list:
    """Retorna lista de abas abertas no Chrome (via /json/list)."""
    try:
        url = f"http://{CDP_HOST}:{CDP_PORT}/json/list"
        with urllib.request.urlopen(url, timeout=3) as r:
            return json.loads(r.read())
    except Exception:
        return []


def _cdp_aba_jogo(abas: list) -> dict | None:
    """Encontra a aba com o jogo de Bac Bo aberta."""
    keywords = ["bacbo", "bac-bo", "bac_bo", "betboom", "evolution"]
    for aba in abas:
        url = (aba.get("url") or "").lower()
        titulo = (aba.get("title") or "").lower()
        if any(k in url or k in titulo for k in keywords):
            return aba
    # fallback: primeira aba com conteúdo
    for aba in abas:
        if aba.get("type") == "page" and aba.get("webSocketDebuggerUrl"):
            return aba
    return None


async def _cdp_enviar(ws, method: str, params: dict = None) -> dict:
    """Envia um comando CDP e aguarda a resposta."""
    cmd_id = int(time.time() * 1000) % 999999
    await ws.send(json.dumps({"id": cmd_id, "method": method, "params": params or {}}))
    async for raw in ws:
        msg = json.loads(raw)
        if msg.get("id") == cmd_id:
            return msg.get("result", {})


async def _cdp_clique(ws_url: str, x: float, y: float):
    """Executa um clique real (mousePressed + mouseReleased) via CDP."""
    async with websockets.connect(ws_url) as ws:
        base = {
            "x": x, "y": y,
            "button": "left", "buttons": 1,
            "clickCount": 1, "modifiers": 0,
        }
        await _cdp_enviar(ws, "Input.dispatchMouseEvent", {**base, "type": "mousePressed"})
        await asyncio.sleep(0.08)
        await _cdp_enviar(ws, "Input.dispatchMouseEvent", {**base, "type": "mouseReleased"})


async def _cdp_avaliar(ws_url: str, js: str) -> any:
    """Executa JavaScript na página e retorna o resultado."""
    async with websockets.connect(ws_url) as ws:
        res = await _cdp_enviar(ws, "Runtime.evaluate", {
            "expression": js,
            "returnByValue": True,
            "awaitPromise": False,
        })
        return (res.get("result") or {}).get("value")


# ── seleção de coordenadas por ação ──────────────────────────────────────────

# Script JS que busca o elemento de aposta na página e retorna {x, y, ok, motivo}
_JS_FIND_AREA = """
(function(acao) {
  const mapa = {
    P: {data: 'player', termos: ['player','jogador','joueur']},
    B: {data: 'banker', termos: ['banker','banca','banquier']},
    T: {data: 'tie',    termos: ['tie','empate','égalité']},
  };
  const cfg = mapa[acao];
  if (!cfg) return {ok: false, motivo: 'ação desconhecida: ' + acao};

  // Tenta via data-bet / data-role
  const sels = [
    '[data-bet="' + cfg.data + '"]',
    '[data-role*="' + cfg.data + '" i]',
    '[data-side="' + cfg.data + '"]',
    '[data-testid*="' + cfg.data + '" i]',
  ];
  for (const sel of sels) {
    const el = document.querySelector(sel);
    if (el) {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0)
        return {ok: true, x: r.left + r.width/2, y: r.top + r.height/2, motivo: 'selector: ' + sel};
    }
  }

  // Tenta via texto
  const todos = Array.from(document.querySelectorAll('button, [role="button"], [class*="bet"], [class*="area"]'));
  for (const el of todos) {
    const txt = (el.innerText || '').toLowerCase().trim();
    if (cfg.termos.some(t => txt.includes(t))) {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0)
        return {ok: true, x: r.left + r.width/2, y: r.top + r.height/2, motivo: 'texto: ' + txt};
    }
  }

  return {ok: false, motivo: 'área ' + acao + ' não encontrada no DOM'};
})("%s")
"""

_JS_FIND_CHIP = """
(function(valor) {
  const v = String(valor);
  const sels = [
    '[data-value="' + v + '"]',
    '[data-amount="' + v + '"]',
    'button[value="' + v + '"]',
  ];
  for (const sel of sels) {
    const el = document.querySelector(sel);
    if (el) {
      const r = el.getBoundingClientRect();
      if (r.width > 0) return {ok: true, x: r.left + r.width/2, y: r.top + r.height/2, sel};
    }
  }
  // XPath via texto
  const chips = Array.from(document.querySelectorAll('[class*="chip"], [class*="Chip"]'));
  for (const el of chips) {
    if ((el.innerText || '').trim() === v) {
      const r = el.getBoundingClientRect();
      if (r.width > 0) return {ok: true, x: r.left + r.width/2, y: r.top + r.height/2, sel: 'text:' + v};
    }
  }
  return {ok: false, motivo: 'chip ' + v + ' não encontrado'};
})(%s)
"""


def decompor_stake(stake: float) -> list:
    """Decompõe o valor em chips disponíveis no Bac Bo."""
    restante = round(stake)
    chips = []
    for chip in BAC_BO_CHIPS:
        while restante >= chip:
            chips.append(chip)
            restante -= chip
    return chips if restante == 0 else []


# ── lógica de aposta ──────────────────────────────────────────────────────────

async def realizar_aposta(ws_url: str, acao: str, stake: float, options: dict) -> dict:
    """
    Executa uma aposta completa via CDP:
      1. Encontra e clica no chip correto.
      2. Encontra e clica na área de aposta (Player / Banker / Tie).
      3. Se houver proteção de empate, repete para Tie.
    """
    # ── selecionar chip ──
    valor = round(stake)
    js_chip = _JS_FIND_CHIP % valor
    res_chip = await _cdp_avaliar(ws_url, js_chip)

    if not res_chip or not res_chip.get("ok"):
        # tenta decomposição
        chips = decompor_stake(valor)
        if not chips:
            return {"ok": False, "motivo": f"Chip R${valor} não encontrado e não decomponível"}
        for chip in chips:
            js_c = _JS_FIND_CHIP % chip
            rc = await _cdp_avaliar(ws_url, js_c)
            if not rc or not rc.get("ok"):
                return {"ok": False, "motivo": f"Chip R${chip} não encontrado (compondo R${valor})"}
            await _cdp_clique(ws_url, rc["x"], rc["y"])
            await asyncio.sleep(0.28)
    else:
        await _cdp_clique(ws_url, res_chip["x"], res_chip["y"])
        await asyncio.sleep(0.28)

    # ── clicar área ──
    js_area = _JS_FIND_AREA % acao
    res_area = await _cdp_avaliar(ws_url, js_area)
    if not res_area or not res_area.get("ok"):
        return {"ok": False, "motivo": res_area.get("motivo", f"Área {acao} não encontrada") if res_area else f"Área {acao} não encontrada"}
    await _cdp_clique(ws_url, res_area["x"], res_area["y"])
    await asyncio.sleep(0.42)

    # ── proteção de empate ──
    if options.get("protecaoEmpate") and acao != "T":
        val_prot = float(options.get("valorProtecao") or 0)
        if val_prot >= 5:
            js_c = _JS_FIND_CHIP % round(val_prot)
            rc = await _cdp_avaliar(ws_url, js_c)
            if rc and rc.get("ok"):
                await _cdp_clique(ws_url, rc["x"], rc["y"])
                await asyncio.sleep(0.28)
            js_t = _JS_FIND_AREA % "T"
            rt = await _cdp_avaliar(ws_url, js_t)
            if rt and rt.get("ok"):
                await _cdp_clique(ws_url, rt["x"], rt["y"])
                await asyncio.sleep(0.42)

    return {"ok": True, "motivo": f"{acao} R${valor:.0f} ✓ (CDP isTrusted=true)"}


# ── WebSocket loop (conecta ao ws_server.py) ──────────────────────────────────

async def ws_loop(ws_url_cdp: str):
    """Aguarda PERFORM_BET do ws_server e devolve BET_RESULT."""
    while True:
        try:
            print(f"[WDP] Conectando ao ws_server em {WS_SERVER} ...")
            async with websockets.connect(WS_SERVER) as ws:
                print("[WDP] ✓ ws_server conectado. Aguardando PERFORM_BET...\n")
                await ws.send(json.dumps({
                    "type": "SB_HELLO",
                    "source": "selenium_driver_cdp",
                    "timestamp": time.time(),
                }))

                async for raw in ws:
                    try:
                        data = json.loads(raw)
                    except Exception:
                        continue

                    if data.get("type") != "PERFORM_BET":
                        continue

                    cmd_id = data.get("id")
                    acao   = data.get("acao", "")
                    stake  = float(data.get("stake", 0))
                    opts   = data.get("options") or {}

                    print(f"[WDP] ► {acao} R${stake:.0f}  id={cmd_id}")
                    try:
                        result = await realizar_aposta(ws_url_cdp, acao, stake, opts)
                    except Exception as e:
                        result = {"ok": False, "motivo": f"Exceção: {e}"}

                    mark = "✓" if result["ok"] else "✗"
                    print(f"[WDP] {mark} {result['motivo']}")

                    await ws.send(json.dumps({
                        "type": "BET_RESULT",
                        "id": cmd_id,
                        "ok": result["ok"],
                        "motivo": result["motivo"],
                        "timestamp": time.time(),
                    }))

        except (websockets.ConnectionClosed, OSError) as e:
            print(f"[WDP] WS perdeu conexão ({e}). Reconectando em 5 s...")
            await asyncio.sleep(5)
        except Exception as e:
            print(f"[WDP] Erro WS: {e}. Reconectando em 5 s...")
            await asyncio.sleep(5)


# ── main ──────────────────────────────────────────────────────────────────────

async def main_async():
    print("=" * 58)
    print("  Will Dados Pro — CDP Clicker")
    print(f"  Chrome: {CDP_HOST}:{CDP_PORT} | WS: {WS_SERVER}")
    print("  Cliques: isTrusted=true via CDP Input.dispatchMouseEvent")
    print("=" * 58 + "\n")

    # Descobre o webSocketDebuggerUrl da aba do jogo
    abas = _cdp_listar_abas()
    if not abas:
        print(f"[WDP] ✗ Chrome não encontrado em {CDP_HOST}:{CDP_PORT}")
        print("[WDP] Feche o Chrome e reabra com:")
        print('[WDP]   macOS:   open -a "Google Chrome" --args --remote-debugging-port=9222')
        print('[WDP]   Windows: chrome.exe --remote-debugging-port=9222')
        sys.exit(1)

    aba = _cdp_aba_jogo(abas)
    if not aba:
        print(f"[WDP] ✗ Nenhuma aba de jogo encontrada. Abas disponíveis:")
        for a in abas:
            print(f"     • {a.get('title', '?')} — {a.get('url', '?')[:80]}")
        print("[WDP] Abra o jogo no Chrome e tente novamente.")
        sys.exit(1)

    ws_url_cdp = aba.get("webSocketDebuggerUrl")
    print(f"[WDP] ✓ Aba encontrada: {aba.get('title', '?')}")
    print(f"[WDP]   URL  : {aba.get('url', '?')[:70]}")
    print(f"[WDP]   WS   : {ws_url_cdp}\n")

    await ws_loop(ws_url_cdp)


def main():
    try:
        asyncio.run(main_async())
    except KeyboardInterrupt:
        print("\n[WDP] Encerrado pelo usuário.")


if __name__ == "__main__":
    main()

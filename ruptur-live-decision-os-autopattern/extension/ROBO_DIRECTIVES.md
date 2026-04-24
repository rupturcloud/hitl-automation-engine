# DIRETRIZES RÍGIDAS PARA O AGENTE BETIA (EXTENSÃO)

> [!IMPORTANT]
> Estas diretrizes são mandatórias e devem ser seguidas por qualquer agente AI operando via Extensão Chrome ou Bridge Externa.

## 1. Comunicação via Bridge
- O robô opera exclusivamente através do barramento de mensagens `chrome.runtime` ou `window.postMessage`.
- Toda entrada deve ser precedida por uma validação de `GAME_STATE_UPDATE`.

## 2. Protocolo AutoDrive (Tesla Mode)
- **Override Humano**: Se o usuário interagir com o DOM da banca, a extensão deve suspender qualquer ação automatizada pendente.
- **Fail-safe**: Se a bridge perder a pulsação (heartbeat) com o studio por mais de 5 segundos, o robô deve entrar em modo de segurança e cessar operações.

## 3. Lógica de Apostas (Pseudo-Real)
- O robô clica nos elementos visuais da banca (Simulação de hardware-level click).
- A banca processa as apostas como se fossem manuais, consumindo a `Wallet` central via micro-serviço.

## 4. Auditoria
- Cada decisão tomada pelo robô na extensão deve ser enviada de volta ao studio para registro nos `Neural Logs`.

---
*Assinado: BetIA Core Architecture*

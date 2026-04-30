# Implementação — Bac Bo com foco em clique real assertivo

## Objetivo

Fortalecer a extensão para Bac Bo Evolution/BetBoom mantendo a arquitetura atual: Side Panel, Overlay, Bridge iframe, Shadow Mode, padrões Will Dados e automação conservadora.

## Implementado

### 1. Histórico híbrido DOM + WebSocket

- `content.js` injeta um wrapper de `window.WebSocket` no contexto real da página.
- Mensagens de WS relacionadas a `bacbo`, `bac-bo`, `BacBo` e `evo-games` são repassadas para o content script por `CustomEvent`.
- O parser tenta extrair:
  - Bead Road / histórico.
  - Resultado mais recente.
  - `roundId` / `gameId` / número de rodada.
  - Saldo/balance.
  - Fase de aposta aberta/fechada.
- O histórico via WS entra como fallback quando for maior/mais útil que o DOM.

### 2. Deduplicação do Bead Road via DOM

- A extração DOM agora compacta células por posição/tamanho/resultado.
- Isso reduz duplicatas de pai/filho comuns em SVG e componentes aninhados da Evolution.

### 3. Janela de apostas

- Antes de registrar ou clicar uma entrada, `content.js` chama `estaEmFaseDeAposta()`.
- A função usa:
  - Sinal do WS quando disponível.
  - Texto da página (`place your bets`, `faça suas apostas`, `no more bets`, etc.).
  - Heurística visual por elementos de timer/bet/traffic e cores verde/vermelho.
- Se não estiver em fase de aposta, a entrada é ignorada para evitar clique inválido.

### 4. Rastreamento de rodada/resultado

- Ao registrar uma aposta, o content salva `historyHash` e `roundId` na aposta pendente.
- Uma aposta pendente só é processada quando o histórico muda ou o `roundId` muda.
- O resultado preferencial vem do WS; se não existir, usa o último item do histórico.

### 5. Composição de chips reais

- `realizarAposta.js` agora conhece chips Bac Bo: `2500, 500, 125, 25, 10, 5`.
- Se não existir chip exato, monta o stake por composição.
- Exemplos:
  - `150 = 125 + 25`
  - `40 = 25 + 10 + 5`
  - `75 = 25 + 25 + 25`

### 6. Clique mais humano

- `humanClick()` agora dispara `pointermove`, `pointerdown`, `pointerup`, `mousemove`, `mousedown`, `mouseup`, `click` com jitter.

### 7. Risco e banca

- `bankrollAtual` não é mais resetado automaticamente ao salvar configuração.
- Reset explícito ainda restaura o padrão.
- `aplicarGale()` passa a respeitar `stakeMax`.
- `deveApostar()` limita stake pelo menor entre `stakeMax` e percentual da banca.

### 8. Manifest

- `run_at` mudou para `document_start` para permitir interceptação WebSocket mais cedo.

## Ainda precisa validar em mesa real

1. Se os seletores de área Player/Banker/Tie batem na BetBoom/Evolution atual.
2. Se o parser WS encontra o formato exato de `beadRoad`, `roundId`, `balance` e `bettingOpen` nos payloads reais.
3. Se a fase de aposta detectada pelo DOM/WS coincide com o semáforo visual.
4. Se a aposta composta por chips é aceita como valor desejado pela mesa.

## Regra operacional

- Testar primeiro com `shadowMode=true`.
- Só usar `shadowMode=false` depois de confirmar nos logs:
  - Histórico correto.
  - Fase de aposta aberta.
  - Chip composto correto.
  - Área de aposta correta.

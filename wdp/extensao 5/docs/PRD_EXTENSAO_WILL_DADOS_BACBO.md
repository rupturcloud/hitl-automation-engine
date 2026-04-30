# PRD — Will Dados Robô Bac Bo

## Objetivo
Extensão Chrome MV3 para apoio à decisão no Bac Bo, baseada nos 18 padrões oficiais recebidos por mensagem e nas heurísticas avançadas extraídas da transcrição.

## Segurança do produto
- `shadowMode=true` por padrão: detecta, simula e registra logs sem clicar.
- Auto clique só deve ser ativado depois de validar seletores reais da mesa.
- Stop Win, Stop Loss, limite de stake percentual e logs são obrigatórios.

## Dados lidos
- Caminho de Contas / Bead Road: P/B/T.
- Estado visual/textual da página para detectar mesa provável.
- Resultado mais recente para fechar aposta pendente.

## Decisão
- Primeiro verifica os 18 padrões oficiais WMSG-001 a WMSG-018.
- Depois aplica heurísticas: xadrez, quebra de xadrez, casadinho, empate ao lado, linha devedora, pós-empate, 4 casas, trás para frente e surf.
- Saída: `{ acao, motivo, confianca, padraoId, galeMax, scoreP, scoreB }`.

## Telas
- Overlay in-game: status, modo, bankroll, lucro, stake/gale, padrão e alerta de risco.
- Popup: status em tempo real, logs e exportação CSV.
- Options: banca, risco, shadow mode, auto start, proteção empate e toggles de padrões.

## Próximas validações
1. Carregar a extensão no Chrome.
2. Abrir mesa Bac Bo.
3. Validar se o overlay detecta histórico.
4. Se histórico vier vazio ou incorreto, inspecionar Bead Road com DevTools/SeleniumBase e ajustar `classifyResultElement()` / seletores.
5. Só depois avaliar `shadowMode=false`.

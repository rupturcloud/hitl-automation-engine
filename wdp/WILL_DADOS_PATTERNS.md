# Will Dados — Padrões Oficiais

Referência raiz do projeto para preservar os padrões recebidos do Will/Gabriel e do PDF `padrões Atualizado 2025 (1) (1).pdf`.

## Origem

- Mensagens do Will Cliente Cassino Gabriel em 16/04/2026.
- PDF enviado no chat: `padrões Atualizado 2025 (1) (1).pdf`.

## Mapeamento operacional

Conforme material Will Dados:

- Azul = Casa / Player
- Vermelho = Fora / Banker
- Amarelo = Empate / Tie

## Disclaimer de produto

Ferramenta privada de análise estatística, replay histórico, monitoramento visual e apoio à decisão. Não realiza apostas, não garante resultados e não substitui julgamento humano.

---

## Padrões enviados por mensagem — Lote 1

| ID | Sequência | Entrar em |
|---|---|---|
| WMSG-001 | azul, azul, azul, azul, vermelho | vermelho |
| WMSG-002 | vermelho, vermelho, vermelho, vermelho, azul | azul |
| WMSG-003 | azul, amarelo, vermelho | vermelho |
| WMSG-004 | vermelho, amarelo, azul | azul |
| WMSG-005 | azul, azul, azul, vermelho, vermelho | azul |
| WMSG-006 | vermelho, vermelho, vermelho, azul, azul | vermelho |
| WMSG-007 | azul, azul, azul, azul, azul, azul, azul | vermelho |
| WMSG-008 | vermelho, vermelho, vermelho, vermelho, vermelho, vermelho, vermelho | azul |

## Padrões enviados por mensagem — Lote 2

| ID | Sequência | Entrar em |
|---|---|---|
| WMSG-009 | azul, azul, vermelho, vermelho, azul, vermelho, vermelho | azul |
| WMSG-010 | vermelho, vermelho, azul, azul, vermelho, azul, azul | vermelho |
| WMSG-011 | vermelho, azul, azul, vermelho, vermelho | azul |
| WMSG-012 | azul, vermelho, vermelho, azul, azul | vermelho |
| WMSG-013 | amarelo, amarelo, azul | vermelho |
| WMSG-014 | amarelo, amarelo, vermelho | azul |
| WMSG-015 | azul, vermelho, azul, vermelho, azul | azul |
| WMSG-016 | vermelho, azul, vermelho, azul, vermelho | vermelho |
| WMSG-017 | amarelo, azul, amarelo, vermelho | azul |
| WMSG-018 | amarelo, vermelho, amarelo, azul | vermelho |

## Padrões extraídos do PDF — Até G1

| ID | Nome | Sequência | Entrar em |
|---|---|---|---|
| WPDF-001 | Padrão de 2 para azul | vermelho, vermelho, azul | azul |
| WPDF-002 | Padrão de ponta para azul | azul, vermelho, vermelho | azul |
| WPDF-003 | Padrão de ponta para vermelho | vermelho, azul, azul | vermelho |
| WPDF-004 | Padrão de 2 para vermelho | azul, azul, vermelho | vermelho |
| WPDF-005 | Padrão quadrante para vermelho | vermelho, vermelho, vermelho | vermelho |
| WPDF-006 | Padrão quadrante para azul | azul, azul, azul | azul |
| WPDF-007 | Padrão xadrez para vermelho | azul, vermelho, azul | vermelho |
| WPDF-008 | Padrão xadrez para azul | vermelho, azul, vermelho | azul |

---

## Representação técnica normalizada

```ts
type WillColor = 'BLUE' | 'RED' | 'YELLOW';
type WillTarget = 'BLUE' | 'RED' | 'YELLOW';

type WillPattern = {
  id: string;
  name: string;
  source: 'gabriel-message' | 'will-pdf';
  sequence: WillColor[];
  enter: WillTarget;
  enabled: boolean;
};
```

## Regra de match

O matcher deve comparar o final do histórico observado com cada `sequence` ativa.

Exemplo:

```txt
Histórico final: BLUE BLUE BLUE BLUE RED
Padrão:         BLUE BLUE BLUE BLUE RED
Entrada:        RED
```

## Persistência

A extensão deve salvar customizações do usuário em `chrome.storage.local`, preservando estes padrões como defaults restauráveis.

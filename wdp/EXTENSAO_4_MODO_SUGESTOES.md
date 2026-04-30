# Extensão 4: Modo Sugestões Apenas

## Resumo

Extensão 4 foi configurada para funcionar como um **recomendador puro** de entradas de apostas. Ela detecta padrões, lê a banca em tempo real, exibe sugestões na UI, mas **nunca executa cliques automaticamente**.

---

## Configuração Principal

### Flag de Controle

```javascript
// extensao 4/content.js - Linha 13
const SUGESTOES_APENAS = true; // Extensão 4: apenas recomendações, sem cliques automáticos
```

Essa flag é hardcoded e controla o comportamento do `cicloPrincipal()`.

### Fluxo em `cicloPrincipal()` (Linhas 901-908)

```javascript
if (Core.estadoRobo.config.shadowMode || SUGESTOES_APENAS) {
  const msg = SUGESTOES_APENAS ? 'Sugestão de entrada' : 'Shadow mode: entrada simulada';
  atualizarOverlay(msg, resultado);
  publicarStatusWsExterno(SUGESTOES_APENAS ? 'SUGESTAO_EXIBIDA' : 'ENTRADA_SIMULADA', resultado, best);
  return; // ← NUNCA executa clique
}
```

**Explicação:**
- Se `SUGESTOES_APENAS=true`, retorna **antes** de chamar `executarApostaNoMelhorFrame()`
- A sugestão é exibida na UI (via `atualizarOverlay`)
- Status é publicado para WebSocket externo com tipo `SUGESTAO_EXIBIDA`
- Nenhuma aposta é registrada, nenhum clique é feito

---

## Comportamento Esperado

### Cenário: Detecção de Padrão WMSG-005

**Histórico:** P, P, B, P, P, B

**Detecção:**
```
Padrão: WMSG-005 (Player + Streaker Banco)
Ação Sugerida: P (Player/Azul)
Confiança: 75%
Score P: 75
Score B: 25
```

**Resultado em Extensão 4:**
1. `cicloPrincipal()` roda a cada 1200ms
2. Detecta padrão com `Core.detectarPadrao(history)`
3. Verifica `SUGESTOES_APENAS=true`
4. Retorna com mensagem "Sugestão de entrada"
5. **UI Overlay exibe:** "Azul — Padrão WMSG-005 | Confiança 75% | P:75 B:25"
6. **Histórico de apostas:** vazio (nenhuma aposta registrada)
7. **Cliques:** zero

---

## Leitura de Banca

Extensão 4 adiciona leitura avançada de saldo da tela como fallback:

### `lerBancaDaTela()` (Linhas 91-110)

```javascript
function lerBancaDaTela() {
  const candidates = Array.from(document.querySelectorAll(
    '[class*="balance" i], [class*="bankroll" i], [class*="credit" i], ' +
    '[class*="wallet" i], [class*="cash" i], [id*="balance" i], ' +
    '[data-balance], [data-bankroll], [aria-label*="balance" i], ' +
    '[title*="balance" i], span, div'
  ))
  // ... busca por regex: saldo|balance|crédito|bankroll|wallet|cash|caixa
  // Retorna: { value: 2500.00, source: 'DOM' } ou null
}
```

**Estratégia:**
1. Busca por classes/IDs com "balance", "bankroll", "credit", etc.
2. Filtra elementos com regex: `/(?:saldo|balance|crédito|bankroll|wallet|cash|caixa).*?(R\$|\d+(?:\.|,)\d+)/i`
3. Extrai primeiro valor numérico encontrado
4. Retorna como fallback se WebSocket não fornecer saldo

### `monitorarBancaTela()` (Linhas 147-170)

```javascript
function monitorarBancaTela() {
  const bancaAtual = lerBancaDaTela();
  if (!bancaAtual) return;
  
  if (Math.abs(bancaAtual.value - (ultimaBancaLida?.value || 0)) > 1) {
    // Mudança significativa de saldo (> R$1)
    Core.adicionarLog('BANCA_MUDOU', `${ultimaBancaLida?.value || '?'} → ${bancaAtual.value}`, {
      anterior: ultimaBancaLida,
      atual: bancaAtual,
      source: 'DOM'
    });
    ultimaBancaLida = bancaAtual;
  }
}
```

**Frequência:** A cada 2.5s (linha 924: `window.setInterval(monitorarBancaTela, 2500)`)

**Objetivo:** Rastrear mudanças de saldo independentemente do WebSocket

---

## Atualização de Indicações em Tempo Real

### `atualizarIndicacoesDeEntrada()` (Linhas 765-785)

```javascript
function atualizarIndicacoesDeEntrada() {
  const best = getBestHistory();
  const history = best.history || [];
  const historyHash = history.join('');

  if (historyHash !== ultimoHashAnalisado && history.length >= 3) {
    ultimoHashAnalisado = historyHash;
    const resultado = Core.detectarPadrao(history);

    if (overlay && resultado) {
      const padraoEl = overlay.querySelector('#wd-padrao');
      if (padraoEl && resultado.acao !== 'SKIP') {
        const acaoLabel = resultado.acao === 'P' ? 'Azul' : resultado.acao === 'B' ? 'Vermelho' : resultado.acao === 'T' ? 'Empate' : 'Aguardar';
        const scoreText = `P:${resultado.scoreP || 0} B:${resultado.scoreB || 0}`;
        padraoEl.innerHTML = `<b>${acaoLabel}</b> — ${resultado.motivo}<br><small>Confiança ${resultado.confianca}% | ${scoreText}</small>`;
      } else if (padraoEl && resultado.acao === 'SKIP') {
        padraoEl.textContent = `⏸️ ${resultado.motivo}`;
      }
    }
  }
}
```

**Frequência:** A cada 800ms (linha 922)

**Resultado na UI:**
```
┌─────────────────────────────┐
│ Azul — Padrão WMSG-005      │
│ Confiança 75% | P:75 B:25   │
└─────────────────────────────┘
```

ou se for padrão SKIP:

```
┌─────────────────────────────┐
│ ⏸️ Insuficiente histórico    │
└─────────────────────────────┘
```

---

## Diferenças com Extensão 2

| Aspecto | Extensão 2 | Extensão 4 |
|---------|-----------|-----------|
| **Modo Principal** | Clicking automático | Sugestões apenas |
| **Flag de Controle** | `roboAtivo`, `shadowMode` | `SUGESTOES_APENAS=true` |
| **Detecção** | ✓ Completa | ✓ Completa |
| **Exibição de Sugestões** | Overlay (opcional) | Overlay + Indicações (800ms) |
| **Execução de Apostas** | ✓ Sim (se ativado) | ❌ Nunca |
| **Leitura de Banca** | WebSocket apenas | WebSocket + DOM fallback |
| **Monitoramento de Banca** | Não | ✓ Sim (2.5s) |
| **Histórico de Apostas** | ✓ Registrado | ❌ Vazio sempre |
| **HITL (Human-in-the-Loop)** | ✓ Configurável | N/A (não aplica) |

---

## Como Testar Extensão 4

### Setup

1. Carregue extensão 4 em `chrome://extensions`
2. Abra mesa de Bac Bo em betboom.bet.br
3. Deixe histórico acumular (mín. 3-5 rodadas)
4. Abra DevTools (F12) → Console

### Verificação

```javascript
// No console, verifique status
window.WillDadosBridgeStatus()
// Deve retornar: { wsAvailable: true, seleniumEnabled: false, pendingResponses: 0 }

// Verifique última sugestão
Core.estadoRobo.ultimaAnalise
// Deve retornar: { acao: 'P', motivo: '...', confianca: 75, ... }

// Verifique que histórico de apostas está vazio
Core.estadoRobo.ultimaAposta
// Deve retornar: null ou undefined

// Verifique última banca lida
Core.estadoRobo.bancaAtual || 'Não lida ainda'
```

### Verificação Visual

- [ ] Overlay exibe sugestão (ex: "Azul — Padrão WMSG-005")
- [ ] UI atualiza a cada rodada (~800ms)
- [ ] Nenhum clique acontece automaticamente
- [ ] Saldo da banca é lido e monitorado (verificar logs)

### Logs Esperados

```
[BANCA_LIDA] Saldo: R$ 2500.00 | Source: DOM
[PADRÃO_DETECTADO] WMSG-005 (Player Streak) | Confiança: 75%
[SUGESTAO_EXIBIDA] Acao: P | Motivo: Player + Streaker Banco
[BANCA_MUDOU] 2500.00 → 2400.00 (mudança manual via UI)
```

---

## Mudanças Realizadas

### commit: feat(extensao 4): modo sugestões apenas

- Adicionado `const SUGESTOES_APENAS = true` na linha 13
- Modificado `cicloPrincipal()` para respeitar flag (linhas 901-908)
- Mantidas todas as outras funcionalidades (detecção, overlay, leitura de banca)
- Garantido que nenhum `executarApostaNoMelhorFrame()` é chamado

### Status

✅ Extensão 4 configurada e pronta para testes

---

## Próximas Versões (Opcional)

Se necessário, extensão 4 pode ser expandida com:

1. **Histórico de Sugestões** — log persistente de todas as sugestões exibidas
2. **Botão "Aplicar Sugestão"** — permitir que usuário execute a sugestão com um clique
3. **Notificações** — alerta visual/sonoro quando sugestão de alta confiança (>80%) aparece
4. **Comparação com Padrões Anteriores** — mostrar qual sugestão teria sido correta em cada rodada
5. **Integração com OCR (extensão 3)** — adicionar leitura visual de elementos

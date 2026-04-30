# 📋 Extensão 2 - Documentação Completa

## Status
✅ **PRODUÇÃO** - Sistema confiável, clicando apostas com proteção automática

---

## O Que Funciona

### 1. Cliques Automáticos em Chips
- **Arquivo**: `realizarAposta.js` (linha 23)
- **Função**: `candidatosArea(acao)`
  - Estratégia 3-níveis para encontrar elementos:
    1. **Nível 1**: Busca exata por `data-bet="P"`, `data-bet="B"`, `data-bet="T"`
    2. **Nível 2**: Heurística com scoring (word-boundary regex, pontos por match)
    3. **Nível 3**: Traversal de iframes para elementos aninhados
  - Retorna array de candidatos ordenados por score
  - Log detalhado: "Tentativa 1: não encontrou, aguardando..."

- **Função**: `clicarNaArea(acao)`
  - Valida visibilidade e tamanho do elemento (`rect.width > 10 && rect.height > 10`)
  - Suporte a múltiplos candidatos (tenta top 3)
  - PointerEvent + MouseEvent com jitter realista (~50-200ms)
  - Fallback automático se clique falhar

- **Função**: `selecionarChip(stake)`
  - Procura chip de R$ X na tela
  - Estratégia similar à de áreas (multi-level)
  - Log de cada tentativa

### 2. Proteção Automática Obrigatória
- **Arquivo**: `realizarAposta.js` (linha 23-60)
- **Função**: `realizarAposta(acao, stake, options)`
- **Comportamento**:
  ```
  Apostar em PLAYER (R$ 100)
    ↓
  Clicar chip R$ 100
    ↓
  Clicar área PLAYER
    ↓
  Clicar chip R$ 5 (AUTOMÁTICO)
    ↓
  Clicar área EMPATE (AUTOMÁTICO)
    ↓
  ✓ Resultado: R$ 100 PLAYER + R$ 5 EMPATE
  ```

- **Lógica**:
  - Se ação !== 'T': sempre adiciona R$ 5 no empate
  - Se ação === 'T': não adiciona proteção (já é empate)

- **Logs**:
  ```
  [REALIZAR-APOSTA] Etapa 1: Selecionando chip de R$ 100...
  [REALIZAR-APOSTA] Etapa 2: Clicando na área de PLAYER...
  [REALIZAR-APOSTA] Etapa 3: Adicionando PROTEÇÃO AUTOMÁTICA...
  [REALIZAR-APOSTA] ✓ APOSTA COMPLETA: P R$ 100 + PROTEÇÃO
  ```

### 3. Detecção de Padrões em Tempo Real
- **Arquivo**: `lib/will-dados-robo.js` (linha 234)
- **Função**: `detectarPadrao(history)`
- **18 Padrões Oficiais**:
  - WMSG-001 a WMSG-018 (4 azuis+vermelho, 7 azuis contra, xadrez, etc)
  - Cada padrão tem: peso (confiança), ação recomendada, gales máximos

- **Indicações de Entrada**:
  - Exibidas no overlay em tempo real
  - Atualizam a cada 800ms
  - Mostram: Lado (Azul/Vermelho), Padrão, Confiança%, Scores P/B

### 4. Histórico de Rodadas
- **Arquivo**: `content.js` (linha 279)
- **Origem**: WebSocket do Betboom
- **Update**: Automático a cada nova rodada
- **Estrutura**: Array `['P', 'B', 'T', 'P', ...]` com últimas 80 rodadas
- **Uso**: Passado para `detectarPadrao()` para análise

---

## Arquitetura de Scripts

### Manifest.json - Carregamento em 3 Etapas

**Etapa 1 (MAIN world, document_start)**:
```json
{
  "js": ["ws-bridge.js"],
  "world": "MAIN",
  "run_at": "document_start"
}
```
- Intercepta WebSocket do Betboom
- Envia eventos para content.js via `postMessage`

**Etapa 2 (ISOLATED world, document_end)**:
```json
{
  "js": ["chipCalibrator.js", "sessionMonitor.js", "seleniumBridge.js", "realizarAposta.js"],
  "run_at": "document_end"
}
```
- Scripts de clique e monitoramento
- Acessa DOM da página normalmente
- Pode ser re-injetado em iframes

**Etapa 3 (ISOLATED world, document_end)**:
```json
{
  "js": ["lib/will-dados-robo.js", "content.js"],
  "run_at": "document_end"
}
```
- Core com padrões e lógica de aposta
- UI principal e bridge entre frames

### Fluxo de Dados

```
ws-bridge.js (MAIN)
  ↓ postMessage
content.js (ISOLATED)
  ↓ wsState.history
getBestHistory()
  ↓ history
detectarPadrao(history)
  ↓ resultado
overlay (wd-padrao)
```

---

## Como Testar

### Teste Mínimo (3 apostas)
```javascript
// Cole no console do Betboom
await globalThis.WillDadosAposta.realizarAposta('P', 50);
// Resultado: R$ 50 PLAYER + R$ 5 EMPATE

await globalThis.WillDadosAposta.realizarAposta('B', 50);
// Resultado: R$ 50 BANKER + R$ 5 EMPATE

await globalThis.WillDadosAposta.realizarAposta('T', 50);
// Resultado: R$ 50 EMPATE (sem proteção extra)
```

### Teste Automático Completo (4 apostas + relatório)
Veja arquivo: `EXECUTAR_TESTE_AGORA.md`

---

## Leitura do Código

### Arquivos Principais

**`content.js`** (~1000 linhas):
- Line 21-30: wsState (histórico, balance, betting status)
- Line 90-97: `isLikelyBacBoPage()` - detecção do site
- Line 380-394: `getBestHistory()` - melhor fonte de histórico
- Line 520-603: UI overlay (painel principal)
- Line 715-735: `atualizarIndicacoesDeEntrada()` - monitor de padrões
- Line 753-830: `cicloPrincipal()` - loop principal do robô
- Line 1060: `setInterval(atualizarIndicacoesDeEntrada, 800)` - atualiza UI a cada 800ms

**`realizarAposta.js`** (~500 linhas):
- Line 23-60: `realizarAposta(acao, stake, options)` - FUNÇÃO PRINCIPAL
- Line 80-120: `candidatosArea(acao)` - busca smart de elementos
- Line 135-180: `clicarNaArea(acao)` - executa clique com retry
- Line 200-250: `selecionarChip(stake)` - seleciona chip

**`lib/will-dados-robo.js`** (~500 linhas):
- Line 8-27: PADROES_OFICIAIS array
- Line 234-350: `detectarPadrao(history)` - core de detecção
- Line 65-78: estadoRobo (estado global do robô)

---

## Debugging

### Se os Cliques não Funcionarem

1. **Abra DevTools (F12) → Console**
2. **Verifique se a função existe**:
   ```javascript
   globalThis.WillDadosAposta.realizarAposta
   // Deve retornar: ƒ realizarAposta(acao, stake, options)
   ```

3. **Teste um clique simples**:
   ```javascript
   await globalThis.WillDadosAposta.realizarAposta('P', 10);
   // Veja os logs: [REALIZAR-APOSTA] ✓ ou [REALIZAR-APOSTA] ✗
   ```

4. **Copie os logs**:
   ```javascript
   copy(globalThis.WillDadosRobo.estadoRobo.logs);
   // Ctrl+V em um editor de texto
   ```

### Se os Padrões não Aparecerem

1. **Verifique se o histórico existe**:
   ```javascript
   copy(globalThis.WillDadosRobo.estadoRobo.ultimaAnalise);
   // Deve ter resultado com 'acao', 'motivo', 'confianca'
   ```

2. **Force uma detecção**:
   ```javascript
   const resultado = globalThis.WillDadosRobo.detectarPadrao(['P','P','P','B','B']);
   console.log(resultado);
   ```

---

## Logs Importantes

### Ao Iniciar
```
[WillDados:INFO] Robô ativado
[WS] Histórico WS atualizado (15)
[BANCA] Balance atualizado: R$ 30.000
```

### Ao Apostar
```
[REALIZAR-APOSTA] ═══════════════════════════════════
[REALIZAR-APOSTA] Etapa 1: Selecionando chip de R$ 100...
[REALIZAR-APOSTA] ✓ Chip selecionado: Chip R$ 100 selecionado
[REALIZAR-APOSTA] Etapa 2: Clicando na área de PLAYER...
[REALIZAR-APOSTA] ✓ Área clicada: Clique em P [<button...>]
[REALIZAR-APOSTA] Etapa 3: Adicionando PROTEÇÃO AUTOMÁTICA de empate R$ 5...
[REALIZAR-APOSTA] ✓ PROTEÇÃO AUTOMÁTICA adicionada: R$ 5 em EMPATE
[REALIZAR-APOSTA] ═══════════════════════════════════
[REALIZAR-APOSTA] ✓ APOSTA COMPLETA: P R$ 100 + PROTEÇÃO
```

---

## Próximas Melhorias (Extensão 4)

- ✅ Monitor de banca via tela (fallback WebSocket)
- 🔄 Integração com histórico de saldo/lucro
- 🔄 Alertas em tempo real de padrões críticos
- 🔄 Sistema de gale automático melhorado

---

**Versão**: 1.4.1  
**Status**: ✅ Pronto para produção  
**Última atualização**: 2026-04-29

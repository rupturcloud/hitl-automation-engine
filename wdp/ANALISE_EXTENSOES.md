# Análise Comparativa de Extensões Will Dados

## Resumo Executivo

Cada extensão tem um papel específico no desenvolvimento e testes:

| Extensão | Descrição | Modo Padrão | WebSocket | Indicações | Cliques |
|----------|-----------|-------------|-----------|-----------|---------|
| **1** | Prototipo original | shadowMode=true | Inline (manual) | ✓ Tempo real | Simulados apenas |
| **2** | Versão estável com clicking | shadowMode=true | Manifest v3 | ✓ Tempo real | Funcionais (com proteção) |
| **3** | Teste com visualizador OCR | shadowMode=true | Manifest v3 | ✓ Tempo real | Funcionais (com proteção) |
| **4** | Recomendador puro (sugestões) | SUGESTOES_APENAS=true | Manifest v3 | ✓ Tempo real | ❌ Desabilitados |

---

## Extensão 1: Protótipo Original (`extensao/`)

**Propósito**: Arquitetura base e desenvolvimento inicial

### Características:
- WebSocket injetado **inline** no content.js (instalarWebSocketBridgeMainWorld)
- Não usa manifest para carregar ws-bridge.js
- Sistema completo de pattern detection
- HITL (Human-in-the-Loop) com countdown configurável
- Modo shadow padrão (não faz cliques reais)

### Diferencial:
- Implementação manual do WebSocket wrapper
- Serve como referência para integração

### Estado Atual:
- Funcional para análise (não clicka)
- Útil para debug de WebSocket

---

## Extensão 2: Versão Estável (`extensao 2/`)

**Propósito**: Versão confiável com clicking automático habilitado

### Características:
- WebSocket carregado via **manifest.json** (ws-bridge.js)
- Clicker funcional com **3-tier strategy** para encontrar elementos
- **Proteção automática R$5 Tie** em toda aposta que não seja Tie
- Pattern detection com 18 padrões oficiais (WMSG-001 a WMSG-018)
- HITL disponível (pode estar ativo ou inativo)
- `atualizarIndicacoesDeEntrada()` roda a cada 800ms

### Fluxo de Aposta:
1. `cicloPrincipal()` roda a cada 1200ms
2. Detecta padrão com `Core.detectarPadrao(history)`
3. Verifica se `Core.deveApostar(resultado)` retorna verdadeiro
4. Se shadowMode=false, executa `executarApostaNoMelhorFrame()`
5. Aposta inclui: chip selecionado → clique na cor → auto-adiciona R$5 no Tie

### Estado Atual:
- ✅ Robô clicando funcionando
- ✅ Proteção automática aplicada
- ✅ Histórico e indicações exibindo corretamente
- ❌ Erro seleniumBridge ainda em avisos (FIXADO: remover de manifest)

### Segurança de Teste:
- `roboAtivo=false` por padrão (precisa ligar manualmente)
- `shadowMode=true` por padrão (cliques são simulados até ligado)
- HITL ativo para confirmar cada aposta antes de executar

---

## Extensão 3: Teste com Visualizador OCR (`extensao 3/`)

**Propósito**: Integração com OCR visual e análise avançada de banca

### Características:
- Herda toda estrutura de extensão 2
- Adiciona capacidade de **leitura visual de elementos** via OCR
- Possibilita análise de imagens em tempo real
- Mesma lógica de clicking e proteção

### Estado Atual:
- Similar a extensão 2, com recursos visuais adicionais

---

## Extensão 4: Recomendador Puro (`extensao 4/`) 🎯 ATUAL

**Propósito**: Sugestões de entrada em tempo real, sem execução automática

### Características Principais:
- **`SUGESTOES_APENAS = true`** — hardcoded para nunca fazer cliques
- Leitura avançada de banca da tela (`lerBancaDaTela()`)
- Monitoramento contínuo de saldo (`monitorarBancaTela()` a cada 2.5s)
- `atualizarIndicacoesDeEntrada()` a cada 800ms com sugestões
- Pattern detection idêntica às outras (18 padrões)

### Fluxo em Extensão 4:
1. `cicloPrincipal()` roda a cada 1200ms
2. Detecta padrão normalmente
3. **MAS**: Se `SUGESTOES_APENAS=true`, retorna com msg "Sugestão de entrada"
4. **Nunca** executa `executarApostaNoMelhorFrame()`
5. UI mostra:
   - Cor sugerida (Azul/Vermelho/Empate)
   - Motivo do padrão
   - Confiança (0-100%)
   - Scores P e B

### Implementação da Flag:
```javascript
// Linha 13
const SUGESTOES_APENAS = true; // Extensão 4: apenas recomendações

// Linhas 901-908 no cicloPrincipal
if (Core.estadoRobo.config.shadowMode || SUGESTOES_APENAS) {
  const msg = SUGESTOES_APENAS ? 'Sugestão de entrada' : 'Shadow mode: entrada simulada';
  atualizarOverlay(msg, resultado);
  publicarStatusWsExterno(SUGESTOES_APENAS ? 'SUGESTAO_EXIBIDA' : 'ENTRADA_SIMULADA', resultado, best);
  return; // ← NUNCA executa clique
}
```

### Leitura de Banca:
- `lerBancaDaTela()`: busca saldo no DOM como fallback de WebSocket
- `monitorarBancaTela()`: monitora mudanças de saldo a cada 2.5s
- Útil quando WebSocket de banca não está disponível

---

## Comparação de Modos de Execução

### Cenário: Detecção de padrão "WMSG-005 (Player + Streaker Banco)"

#### Extensão 1 (Protótipo)
```
Padrão detectado: WMSG-005
Confiança: 75%
Ação: P (Player/Azul)
Modo: shadowMode=true → Clique SIMULADO
Resultado: Log apenas, UI atualizada, nenhum click real
```

#### Extensão 2 (Estável com Clicking)
```
Padrão detectado: WMSG-005
Confiança: 75%
Ação: P (Player/Azul)
Aposta: R$100 + R$5 no Tie (proteção automática)
Modo: roboAtivo=true, shadowMode=false → Clique REAL
Resultado: 
  1. Seleciona chip R$100
  2. Clica em "Player" (Azul)
  3. Clica automaticamente R$5 no Tie
Histório: Registra aposta no estadoRobo
```

#### Extensão 4 (Sugestões Apenas)
```
Padrão detectado: WMSG-005
Confiança: 75%
Ação: P (Player/Azul)
UI Overlay: "Azul — Padrão WMSG-005 | Confiança 75% | P:75 B:25"
Modo: SUGESTOES_APENAS=true → Retorna ANTES do clique
Resultado: 
  - Exibe sugestão na UI
  - NÃO faz nenhum clique
  - Usuário pode clicar manualmente se desejar
```

---

## Checklist de Diferenças Implementadas

- [x] Extensão 4 tem flag `SUGESTOES_APENAS = true`
- [x] Modificado `cicloPrincipal` para respeitar flag
- [x] Retorna com mensagem "Sugestão de entrada" (não executa clique)
- [x] Mantém detecção e overlay funcionando
- [x] Leitura de banca implementada (lerBancaDaTela + monitorarBancaTela)
- [x] WebSocket via manifest (não inline)

---

## Próximos Passos Opcionais

Se necessário:
1. **Adicionar histórico de sugestões** em extensão 4 (log de todas as sugestões exibidas)
2. **Adicionar botão "Aplicar Sugestão"** para usuário clicar facilmente se aprovar
3. **Comparar extensão 4 com extensão 3** para ver features do OCR a adicionar
4. **Documentar padrões** (WMSG-001 a WMSG-018) em separado

---

## Testes Recomendados

### Para Extensão 4 (Sugestões):
1. Abrir mesa em betboom.bet.br
2. Deixar histórico acumular (mín. 3 rodadas)
3. Verificar se sugestões aparecem na UI a cada rodada
4. Confirmar que **nenhum clique automático** acontece
5. Verificar se banca é lida corretamente via `lerBancaDaTela()`

### Para Extensão 2 (Clicking):
1. Mesmo setup
2. Ligar `roboAtivo` e `shadowMode=false`
3. Confirmar que cliques acontecem
4. Verificar se proteção R$5 Tie é aplicada
5. Checar se histórico de apostas é registrado corretamente

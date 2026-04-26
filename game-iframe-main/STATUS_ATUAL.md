# 📋 STATUS ATUAL - J.A.R.V.I.S. Bac Bo Extension

## ✅ COMPLETO

### Controle Remoto da Banca (100%)
- ✅ Interface com 6 chips (5, 10, 25, 50, 100, 500)
- ✅ Botões REDUZIR / DOBRAR aposta
- ✅ Seleção de lado (BLUE, RED, TIE)
- ✅ Botão ENVIAR APOSTA / LIMPAR
- ✅ Estilos visuais matcher do Betboom
- ✅ Estados de habilitação/desabilitação baseado em daemon
- ✅ Comunicação com daemon via WebSocket

### Barra de Probabilidade Histórica (70%)
- ✅ Interface visual com 3 segmentos (BLUE, RED, TIE)
- ✅ Método `updateProbabilities()` funcional
- ✅ Estilos com cores e degradés
- ❌ **Falta**: Captura automática de histórico do Betboom
- ❌ **Falta**: Integração com eventos de rodada

### Comunicação Chrome Extension (80%)
- ✅ Manifest.json com content_scripts configurado
- ✅ Content.js injetado no Betboom
- ✅ Background.js gerenciando mensagens
- ✅ Popup.js com listeners para UPDATE_BANKROLL
- ❌ **Falta**: Validação se content.js está realmente funcionando

---

## ❌ PROBLEMAS CRÍTICOS

### 1️⃣ Saldo ainda mostrando R$ 1000.00 (CRITICAL)

**Status**: Não resolvido
**Symptoma**: `bankrollValue` mostra R$ 1000.00 (dummy do daemon) em vez de R$ 3.00 (real do Betboom)

**Possíveis causas**:
1. Content.js não consegue acessar o DOM do Betboom (iframe issue?)
2. Regex `/R\$\s*([\d.,]+)/` não está capturando o valor correto
3. Seletor CSS não bate com estrutura HTML do Betboom
4. Content script não é executado (mas manifest está correto)
5. Página carrega dinamicamente e content.js roda antes de completar

**Código afetado**:
```
/extension/content.js (linhas 7-70)
```

**Próximo debug**: Verificar console do content.js no Betboom

---

### 2️⃣ Histórico de rodadas não é capturado

**Status**: Não implementado
**Symptoma**: Barra de probabilidade sempre mostra valores fixos (44%, 10%, 46%)

**O que está faltando**:
1. Método para extrair histórico de rodadas do Betboom
2. Integração com eventos ROUND_CLOSED para atualizar probabilidade
3. Lógica para determinar qual lado ganhou em cada rodada

**Ideias**:
- Betboom mostra histórico visual na página (cards/chips de rodadas anteriores)
- Precisa fazer parsing visual dessa tabela
- Ou capturar via WebSocket do daemon (se envia resultado)

---

## 🔧 ARQUITETURA ATUAL

```
Betboom Website
    │
    ├─→ content.js (injetado, extrai saldo)
    │       │
    │       └─→ chrome.runtime.sendMessage() → UPDATE_BANKROLL
    │
    ├─→ background.js (recebe UPDATE_BANKROLL)
    │       │
    │       └─→ chrome.runtime.sendMessage() → popup.js
    │
    └─→ popup.html/js (exibe UI)
            │
            ├─ Listener para UPDATE_BANKROLL
            ├─ WebSocket para daemon
            └─ Interface de apostas

Daemon (ws://localhost:8765)
    ├─→ STATUS_UPDATE
    ├─→ ROUND_CLOSED ← OPORTUNIDADE: extrair resultado daqui
    └─→ COUNTDOWN_UPDATE
```

---

## 📊 CHECKLIST DE DEPURAÇÃO

### Para você testar agora:

```
1. Abrir Betboom em uma aba
2. Clicar no ícone da extensão (deve abrir popup)
3. Abrir DevTools do popup (direita: inspect)
4. Verificar:
   - console.log mostra "[Content] Estratégia 1 - Saldo encontrado"?
   - bankrollValue mostra valor real ou 1000?
   - Há mensagens de erro no console?

5. Se não tiver saldo:
   - Ir para Betboom
   - Abrir DevTools (F12)
   - Console
   - Procurar por "[J.A.R.V.I.S.]" ou "[Content]"
   - Ver se há erros ou warnings
```

---

## 🎯 PRÓXIMOS PASSOS (Prioridade)

### 1. FIX - Saldo (CRITICAL)
- [ ] Validar se content.js está sendo executado
- [ ] Testar cada estratégia de extração manualmente
- [ ] Ajustar seletores/regex para Betboom real
- [ ] Adicionar mais logging para debug

### 2. FEATURE - Histórico automático
- [ ] Identificar onde Betboom mostra histórico de rodadas
- [ ] Criar extrator de histórico (parsing visual ou API)
- [ ] Integrar com ROUND_CLOSED evento do daemon
- [ ] Atualizar probabilidade automaticamente

### 3. UX/Validação
- [ ] Teste ponta-a-ponta (saldo → histórico → aposta)
- [ ] Feedback visual sobre qual chip/lado está selecionado
- [ ] Mensagens de erro mais claras

---

## 📁 ARQUIVOS ENVOLVIDOS

| Arquivo | Status | Ação |
|---------|--------|------|
| `manifest.json` | ✅ | Pronto (content_scripts OK) |
| `content.js` | ⚠️ | Precisa debug + melhorias |
| `background.js` | ✅ | Pronto |
| `popup.html` | ✅ | Pronto |
| `popup.js` | ⚠️ | Falta integração histórico |
| `popup.css` | ✅ | Pronto |

---

## 💡 OBSERVAÇÕES

1. **Content script isolation**: O Betboom pode usar iframes, o que impede acesso ao DOM real
2. **Regex frágil**: A regex atual pode capturar valores errados (ex: preços de produtos)
3. **Sem persistência**: Histórico desaparece ao recarregar (precisa de storage?)

---

**Data**: 2026-04-19  
**Versão**: 1.0  
**Responsável**: J.A.R.V.I.S.

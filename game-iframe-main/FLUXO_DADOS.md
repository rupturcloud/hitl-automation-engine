# 🔄 FLUXO DE DADOS - J.A.R.V.I.S.

## Visão Geral

```
┌──────────────────────────────────────────────────────────────────────┐
│                        BETBOOM WEBSITE                               │
│  (Página no navegador com dados reais: saldo R$ 3.00, histórico)    │
└────────────────────────┬─────────────────────────────────────────────┘
                         │
                         │ DOM access (document.body, querySelector, etc)
                         │
                         ▼
        ┌────────────────────────────────────────┐
        │   content.js (injetado)                │
        │                                        │
        │  ✅ extractBankroll() → R$ 3.00        │
        │  ✅ extractRoundHistory() → BLUE/RED/TIE
        │  ✅ extractRoundId()                   │
        │                                        │
        │  sendDataToPopup()                     │
        │  └─→ chrome.runtime.sendMessage({      │
        │       type: 'UPDATE_BANKROLL',         │
        │       bankroll: 3.00,                  │
        │       history: {blue, red, tie},       │
        │       timestamp: ...                   │
        │     })                                 │
        └────────┬─────────────────────────────┘
                 │
                 │ chrome.runtime messaging
                 │
                 ▼
        ┌────────────────────────────────────┐
        │   background.js                    │
        │                                    │
        │  chrome.runtime.onMessage          │
        │  └─→ Recebe UPDATE_BANKROLL        │
        │      └─→ Repassa para popup        │
        │          chrome.runtime.sendMessage│
        └────────┬─────────────────────────┘
                 │
                 │ chrome.runtime messaging
                 │
                 ▼
        ┌────────────────────────────────────┐
        │   popup.js                         │
        │                                    │
        │  chrome.runtime.onMessage          │
        │  └─→ Recebe UPDATE_BANKROLL        │
        │      ├─→ updateBankroll()          │
        │      │   Saldo: R$ 3.00 ✅         │
        │      │                             │
        │      └─→ updateProbabilities()     │
        │          Barra: [=50%=][25%][25%] │
        │                                    │
        │  USER INTERFACE (popup.html)       │
        │  ├─ Status: R$ 3.00 ✅            │
        │  ├─ Probabilidade: BLUE/RED/TIE   │
        │  ├─ Controle Remoto:              │
        │  │  ├─ Chips [5][10][25]...       │
        │  │  ├─ REDUZIR / DOBRAR           │
        │  │  ├─ BLUE / RED / TIE           │
        │  │  └─ ENVIAR APOSTA              │
        │  │      │                          │
        │  │      └─→ confirmBet()          │
        │  │          WebSocket.send({      │
        │  │            type: MANUAL_CMD... │
        │  │          })                    │
        │  └─→ WebSocket para daemon        │
        │      (controle do estrategista)   │
        └────────────────────────────────────┘
```

---

## 📡 Fluxo 1: Extração e Sincronização de Dados

### Timeline
```
T=0s:    Page loads (Betboom)
         └─→ content.js injetado pelo manifest

T=0.5s:  content.js detecta document.readyState
         └─→ MutationObserver ativado
         └─→ Aguardando DOM carregar

T=1s:    sendDataToPopup() PRIMEIRA VEZ
         ├─→ extractBankroll() → Tenta 4 estratégias
         │   ├─ Estratégia 1: Regex no texto → R$ 3.00 ✅
         │   ├─ Estratégia 2: Seletores CSS
         │   ├─ Estratégia 3: Iframes
         │   └─ Estratégia 4: Atributos data-*
         │
         ├─→ extractRoundHistory() → Procura padrões
         │   ├─ Padrão 1: "BLUE: 44 RED: 46 TIE: 10"
         │   └─ Padrão 2: "azul 44 vermelho 46 empate 10"
         │
         ├─→ extractRoundId() → "round-12345"
         │
         └─→ chrome.runtime.sendMessage({
             type: 'UPDATE_BANKROLL',
             bankroll: 3.00,
             history: {blue: 44, red: 46, tie: 10},
             roundId: 'round-12345',
             timestamp: '2026-04-19T...'
           })

T=1.1s:  background.js recebe UPDATE_BANKROLL
         └─→ chrome.runtime.sendMessage() ao popup

T=1.2s:  popup.js recebe UPDATE_BANKROLL
         ├─→ updateBankroll(): elements.bankrollValue = "R$ 3.00"
         ├─→ updateProbabilities(44, 46, 10)
         │   ├─ Barra visual: [====44%====][===10%===][===46%===]
         │   └─ Labels: 🔵 44% | ⚪ 10% | 🔴 46%
         │
         └─→ UI atualizada ✅

T=2s:    MutationObserver detecta mudança de DOM
         └─→ sendDataToPopup() novamente

T=2s+:   A cada 2 segundos, verifica se saldo mudou
         ├─ Se mudou: envia novos dados
         └─ Se igual: ignora (evita mensagens desnecessárias)
```

---

## 📱 Fluxo 2: Colocando Uma Aposta

### Sequence Diagram
```
User                     Popup          Daemon         Betboom
 │                        │              │              │
 │ Clica [50] chip        │              │              │
 ├─────────────────────→  │              │              │
 │                     selectChip(50)    │              │
 │                     remoteState.     │              │
 │                     betAmount = 50    │              │
 │                     Display: R$ 50    │              │
 │◄─────────────────────  │              │              │
 │                        │              │              │
 │ Clica 🔴 RED           │              │              │
 ├─────────────────────→  │              │              │
 │                     selectSide('RED') │              │
 │                     remoteState.     │              │
 │                     selectedSide=RED  │              │
 │                     Botão dourado    │              │
 │◄─────────────────────  │              │              │
 │                        │              │              │
 │ Clica ENVIAR APOSTA    │              │              │
 ├─────────────────────→  │              │              │
 │                     confirmBet()      │              │
 │                     WebSocket.send()  │              │
 │                     {type: MANUAL_CMD │              │
 │                      side: 'RED'      │              │
 │                      stake: 50}       │              │
 │                        │              │              │
 │                        ├─────────────→│              │
 │                        │              │              │
 │                        │         Executa             │
 │                        │         estratégia         │
 │                        │              │──────────→   │ Copia aposta
 │                        │              │              │ para o jogo
 │                        │              │              │
 │                        │              │         Aposta confirmada
 │                        │              │◄──────────   │ no Betboom
 │◄────────────────────────┬──────────────┤              │
 │  Alert: ✅ RED R$50    │              │              │
 │  enviado!              │              │              │
 │                        │              │              │
 │ clearBet()             │              │              │
 │ Limpa UI               │              │              │
 │ Display: R$ 0          │              │              │
```

---

## 🔁 Fluxo 3: Atualização de Probabilidade em Tempo Real

### Cenário: Nova rodada fechada, resultado é RED

```
Betboom:                  Content.js:               Popup.js:
└─ Rodada 5 fecha        └─ MutationObserver      └─ Atualiza UI
   RED venceu             detecta mudança
   │                      │
   ├─ Histórico            ├─→ extractRoundHistory()
   │  muda para            │   Novo histórico:
   │  BLUE: 44             │   BLUE: 44 (igual)
   │  RED: 47 (↑1)         │   RED: 47 (↑1) ✅
   │  TIE: 10              │   TIE: 10 (igual)
   │  (total: 101)         │
   │                       ├─→ sendDataToPopup()
   │                       │   UPDATE_BANKROLL +
   │                       │   history: {44,47,10}
   │                       │
   │                       └──→ background.js
   │                           └─→ popup.js
   │                               └─→ UPDATE_BANKROLL
   │                                   ├─ Bankroll (pode ter mudado)
   │                                   ├─ updateProbabilities(44,47,10)
   │                                   │  Barra atualiza:
   │                                   │  BLUE: 44% → 43.5%
   │                                   │  RED:  46% → 46.5% ↑
   │                                   │  TIE:  10% → 9.9%
   │                                   │
   │                                   └─ UI atualizada
   │
   └─ Usuário vê barra
      mudou ligeiramente
      RED cresceu 0.5%
```

---

## 🚨 Fluxo de Erro: Content.js não consegue extrair

```
Content.js:
├─ Estratégia 1: FALHA
│  └─ Regex não encontra "R$"
│     (página usa HTML complexo)
│
├─ Estratégia 2: FALHA
│  └─ Nenhum seletor CSS retorna elemento válido
│
├─ Estratégia 3: FALHA
│  └─ Betboom em iframe, CORS bloqueia acesso
│
├─ Estratégia 4: FALHA
│  └─ Sem atributos data-*
│
└─ console.error: "❌ TODAS AS ESTRATÉGIAS FALHARAM"

Result:
└─ extractBankroll() retorna null
   └─ sendDataToPopup() não envia mensagem
      └─ Popup continua com saldo anterior (R$ 1000 dummy)
         └─ PROBLEMA! ❌
```

**Solução**:
1. Abrir DevTools do Betboom (F12)
2. Procurar manualmente onde está o saldo
3. Copiar HTML do elemento
4. Adicionar novo seletor CSS a estratégia 2
5. Ou adicionar nova estratégia específica para a estrutura HTML real

---

## 📊 Estados de Sincronização

```
┌─────────────────────────────────────────────────────┐
│ ESTADO 1: INICIAL (Page load)                       │
├─────────────────────────────────────────────────────┤
│ Content.js:                                         │
│ ├─ Injetado ✅                                      │
│ ├─ MutationObserver ativo ✅                        │
│ ├─ Aguardando DOM (T<1s)                            │
│                                                     │
│ Popup.js:                                           │
│ ├─ Carregado                                        │
│ ├─ Listener ativo ✅                                │
│ ├─ Mostrando dados dummy (R$ 1000.00)              │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│ ESTADO 2: SINCRONIZADO (T≥1s)                       │
├─────────────────────────────────────────────────────┤
│ Content.js:                                         │
│ ├─ Extraiu saldo real ✅                           │
│ ├─ Extraiu histórico ✅                            │
│ ├─ Enviando dados periodicamente                   │
│                                                     │
│ Popup.js:                                           │
│ ├─ Recebendo UPDATE_BANKROLL ✅                     │
│ ├─ Mostrando saldo real (R$ 3.00) ✅               │
│ ├─ Mostrando histórico (BLUE/RED/TIE %) ✅         │
│ ├─ Pronto para apostas ✅                          │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│ ESTADO 3: APOSTANDO                                 │
├─────────────────────────────────────────────────────┤
│ User:                                               │
│ ├─ Vê probabilidade histórica                       │
│ ├─ Clica em chips                                   │
│ ├─ Seleciona lado (BLUE/RED/TIE)                    │
│ ├─ Clica ENVIAR APOSTA                              │
│                                                     │
│ Popup:                                              │
│ ├─ Envia MANUAL_CMD ao daemon                       │
│ ├─ Limpa interface                                  │
│ ├─ Aguarda resultado                                │
│                                                     │
│ Daemon:                                             │
│ ├─ Recebe comando                                   │
│ ├─ Executa no Betboom                               │
│ ├─ Retorna resultado                                │
└─────────────────────────────────────────────────────┘
```

---

## 🔍 Como Validar Cada Etapa

| Etapa | O que verificar | Onde | Sucesso |
|-------|------------------|------|---------|
| 1. Content injection | `[JARVIS:Content]` aparece | Betboom console | Logs aparecem |
| 2. Extração saldo | `Estratégia X SUCESSO` | Betboom console | Mostra R$ correto |
| 3. Extração histórico | `Padrão X encontrado` | Betboom console | Mostra BLUE/RED/TIE |
| 4. Mensagem enviada | `UPDATE_BANKROLL` no background | Betboom console | Não há erro |
| 5. Popup recebe | `[Popup] ✅ Saldo atualizado` | Popup console | Mensagem aparece |
| 6. UI atualizada | Saldo = valor real + histórico | Popup UI | Valores corretos |
| 7. Aposta funciona | `✅ RED R$50 enviado` | Popup console | Alert aparece |

---

**Versão**: 1.0  
**Status**: 🔄 Em validação de fluxo  
**Data**: 2026-04-19

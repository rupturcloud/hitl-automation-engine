# 🎯 Próximos Passos - Ação Imediata

## ⚡ 3 Coisas Para Fazer AGORA

---

## 1️⃣ Recarregar Extensão (5 segundos)

```
Chrome → chrome://extensions/
       → Procurar: "J.A.R.V.I.S. Bac Bo"
       → Clicar em: 🔄 Recarregar
```

✅ **Resultado esperado:** Extension reloada com novo design

---

## 2️⃣ Testar Novo Layout (30 segundos)

```
Chrome → Clicar ícone J.A.R.V.I.S. no toolbar
       → Você deve VER:

       ┌──────────────────────────┐
       │ Status/Saldo/Rodada      │
       │ ──────────────────────── │
       │ [Iniciar] [Pausar] ...   │
       │ ──────────────────────── │
       │  APOSTA RÁPIDA           │
       │                          │
       │  🔵 BLUE 🔴 RED ⚪ TIE  │ ← NOVOS BOTÕES!
       │                          │
       │  Valor: [100  ]          │ ← INPUT
       │ ──────────────────────── │
       │ Configuração             │
       └──────────────────────────┘
```

✅ **Teste:**
- Hover nos botões → Devem brilhar (glow effect)
- Mude o valor para 250
- Clique no botão 🔵 BLUE
- Veja o alert: "✅ BLUE R$ 250 enviado!"

---

## 3️⃣ Debugar Saldo (CRÍTICO)

O saldo ainda está R$ 1000.00 em vez de R$ 3.00

### Abra este arquivo:
```
/Users/diego/dev/ruptur-cloud/game-iframe-main/DEBUG_SALDO.md
```

### Siga o checklist:

**Passo 1:** Abra Betboom (nova aba)
```
F12 → Console
Procure por: "[J.A.R.V.I.S.] Content script ativado"
Apareceu? _____ (SIM / NÃO)
```

**Passo 2:** Procure por logs do content.js
```
Console do Betboom
Procure por: "[Content] Estratégia"
Qual linha apareceu? _____________________
```

**Passo 3:** Verifique o service worker
```
chrome://extensions/
→ J.A.R.V.I.S. Bac Bo
→ Service Worker (link azul)
Procure por: "[Background] Bankroll"
Qual valor? ________________
```

**Passo 4:** Verifique o popup
```
chrome://extensions/
→ J.A.R.V.I.S. Bac Bo
→ "Inspecionar view: popup.html"
→ Console
Procure por: "[Popup] Mensagem"
Apareceu? _____ (SIM / NÃO)
```

### Me envie EXATAMENTE:

```
[ ] Content.js ativo? (SIM/NÃO)
[ ] Qual estratégia funcionou? (1/2/3)
[ ] Qual saldo foi extraído? R$ _____
[ ] Background recebeu? (SIM/NÃO)
[ ] Popup atualizou? (SIM/NÃO)
```

---

## 📊 Checklist Rápido

| Item | Status |
|------|--------|
| Extensão recarregada | ☐ |
| Novo layout visível | ☐ |
| Botões 🔵🔴⚪ aparecem | ☐ |
| Hover effect funciona | ☐ |
| Input com valor 100 | ☐ |
| DEBUG_SALDO.md lido | ☐ |
| Checklist preenchido | ☐ |

---

## 🚨 Se Algo Não Funcionar

### Problema: "Botões não aparecem"
```
Solução:
1. Recarregue a extensão (chrome://extensions/ → 🔄)
2. Feche e abra o popup novamente
3. Se ainda não funcionar, abra popup.html direto:
   chrome://extensions/ → J.A.R.V.I.S.
   → "Inspecionar view: popup.html"
```

### Problema: "Saldo ainda 1000"
```
Solução:
Siga DEBUG_SALDO.md passo-a-passo
Identifique em qual etapa falha
Me envie exatamente o que aparece
```

### Problema: "Botões desabilitados"
```
Causa: Daemon não está RUNNING
Solução:
1. Verifique se daemon está rodando
   python3 websocket_standalone.py
2. Abra popup
3. Vê "Conectado"?
```

---

## 📞 O Que Me Enviar

Quando tiver feito tudo, envie:

```
1. Novo layout funciona?     SIM / NÃO
2. Quick Bet buttons visíveis? SIM / NÃO
3. Saldo agora é real?       SIM / NÃO
4. Se NÃO é real, qual é o resultado do checklist debug?
   [Cole exatamente o que viu nos consoles]
```

---

## 🎯 Ordem Recomendada

```
1️⃣  Recarregar extensão (5 seg)
2️⃣  Testar novo layout (30 seg)
3️⃣  Se layout OK → Debug saldo (5 min)
4️⃣  Me enviar resultados
```

---

## ⏱️ Tempo Total Estimado

```
Recarregar:     5 segundos
Testar:         30 segundos
Debug:          5 minutos
Relatório:      2 minutos
─────────────────────────
Total:          ~6 minutos
```

---

## 📚 Documentação Importante

```
✅ UX_MELHORIAS.md       → Entender o redesign
✅ DEBUG_SALDO.md        → Como debugar
✅ PRÓXIMOS_PASSOS.md    → Você está aqui!
```

---

## 💡 Lembre-se

```
✨ Quick Bet funciona APENAS com daemon rodando
✨ Use Ctrl+Shift+J para console em qualquer aba
✨ Chrome extensions guardam cache - às vezes precisa reload
✨ Se vir "[J.A.R.V.I.S.] Content script ativado" = está funcionando!
```

---

## 🚀 Quando Tudo Funcionar

```
✅ Layout novo visível
✅ 3 botões coloridos funcionando
✅ Saldo sincronizado (R$ real, não 1000)
✅ 1-click betting funcionando

→ Você está PRONTO para usar!
```

---

**Comece AGORA! 👉 chrome://extensions/ → 🔄**

Data: 2026-04-19
Status: PRONTO PARA AÇÃO

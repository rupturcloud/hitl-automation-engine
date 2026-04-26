# 🔴 DEBUG - Saldo Ainda Mostra R$ 1000.00

## 🎯 Problema

Extensão mostra R$ 1000.00 (dummy) em vez de R$ 3.00 (real)

---

## 🔍 Passo 1: Verificar se Content Script Executa

### No Betboom (F12 → Console)
```javascript
// Cole isso no console e veja o resultado:
console.log(document.body.innerText.substring(0, 500))

// Procure por "R$" e um número
// Se vir "R$ 3.00" na output, a página TEM o saldo
```

**Esperado:** Vê "R$ 3.00" ou similar em algum lugar

---

## 🔍 Passo 2: Verificar se Content.js Está Ativo

### No Console do Betboom
```
Procure por: "[J.A.R.V.I.S.] Content script ativado"
```

**Se VÊ:** ✅ Content.js está rodando
**Se NÃO VÊ:** ❌ Problema na injeção

---

## 🔍 Passo 3: Verificar Logs do Content.js

### No Console do Betboom
```
Procure por: "[Content] Estratégia 1 -"
Procure por: "[Content] Estratégia 2 -"
Procure por: "[Content] Estratégia 3 -"
```

**Se VÊ algum:** ✅ Content.js está extraindo
**Se NÃO VÊ:** ❌ Problema na extração

---

## 🔍 Passo 4: Verificar Logs do Background

### chrome://extensions/ → Service Worker (J.A.R.V.I.S.)
```
Procure por: "[Background] Bankroll atualizado:"
```

**Se VÊ:** ✅ Background recebeu dados
**Se NÃO VÊ:** ❌ Problema no fluxo de mensagens

---

## 🔍 Passo 5: Verificar Logs do Popup

### chrome://extensions/ → Inspecionar view: popup.html → Console
```
Procure por: "[Popup] Mensagem recebida: UPDATE_BANKROLL"
```

**Se VÊ:** ✅ Popup recebeu dados
**Se NÃO VÊ:** ❌ Popup não está escutando

---

## ⚙️ Checklist de Diagnóstico

```
[ ] Recarregou extensão?                    (chrome://extensions/ → 🔄)
[ ] Betboom.com está aberto?
[ ] Saldo é visível na página?
[ ] Content.js está ativo no console?
[ ] Background está recebendo?
[ ] Popup está escutando?
[ ] WebSocket está conectado?
```

---

## 🚨 Cenários Comuns

### Cenário 1: Content.js Não Executa
```
Sintoma:  "[J.A.R.V.I.S.] Content script ativado" NÃO aparece
Causa:    Extensão não foi recarregada após alterações
Solução:  chrome://extensions/ → 🔄 Recarregar
```

### Cenário 2: Regex Não Encontra Saldo
```
Sintoma:  Content.js ativo mas "[Content] Estratégia" não aparece
Causa:    Página usa formato diferente de "R$ 3.00"
Solução:  Veja qual é o formato real na página
          Avise o formato (ex: "$3.00" ou "3.00 R$")
```

### Cenário 3: Background Não Recebe
```
Sintoma:  "[Background] Bankroll" não aparece no service worker
Causa:    Chrome não permitiu comunicação entre contextos
Solução:  Verifique permissions em manifest.json
          Verifique se content_scripts está declarado
```

### Cenário 4: Popup Não Atualiza
```
Sintoma:  "[Popup] Mensagem" não aparece
Causa:    Popup não estava aberto quando content.js tentou enviar
Solução:  Abra popup DEPOIS de abrir Betboom
```

---

## 🛠️ Teste Manual Rápido

### 1. Abra Betboom
```bash
# Nova aba
# Ir para betboom.com
```

### 2. Abra DevTools (F12)
```
Console → Procure por "[J.A.R.V.I.S.]"
```

### 3. Abra Popup
```
Clique ícone J.A.R.V.I.S.
```

### 4. Inspecione Popup
```bash
chrome://extensions/
→ J.A.R.V.I.S. Bac Bo
→ Inspecionar view: popup.html
→ Console
→ Procure por "[Popup] Mensagem"
```

---

## 📝 Relatório para Debugar

Se ainda não funcionar, me mostre EXATAMENTE:

1. **Que você vê no console do Betboom:**
   ```
   [J.A.R.V.I.S.] Content script ativado  ← Aparece?
   [Content] Estratégia X -               ← Qual aparece?
   [Content] Saldo: R$ ?                  ← Qual valor?
   ```

2. **Que você vê no service worker:**
   ```
   [Background] Bankroll atualizado: ?    ← Qual valor?
   ```

3. **Que você vê no popup console:**
   ```
   [Popup] Mensagem recebida:             ← Aparece?
   ```

4. **Qual é o formato do saldo no site:**
   ```
   Ex: "R$ 3.00"
   Ex: "$3.00"
   Ex: "3.00 R$"
   Ex: "Saldo: R$ 3.00"
   ```

---

## 📊 Árvore de Decisão

```
Content script ativo?
├─ NÃO → Recarregue extensão
└─ SIM
    ├─ Estratégia funcionou?
    │  ├─ NÃO → Diga qual é o formato real do saldo
    │  └─ SIM → Background recebeu?
    │      ├─ NÃO → Verifique permissions
    │      └─ SIM → Popup escutou?
    │          ├─ NÃO → Abra popup DEPOIS de Betboom
    │          └─ SIM → ✅ FUNCIONA!
```

---

## 🎯 Próximo Passo

1. Execute o checklist acima
2. Diga-me EXATAMENTE o que aparece (ou não aparece) em cada console
3. Vou ajustar o regex ou a estratégia

---

**Data:** 2026-04-19
**Status:** Debug ativo
**Urgência:** 🔴 Alto

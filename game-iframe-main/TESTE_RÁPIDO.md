# ⚡ Teste Rápido - 5 Minutos

## O que foi corrigido

**Problema:** Extensão mostrava R$ 1000.00 (valor dummy) em vez de R$ 3.00 (saldo real)

**Solução:** Adicionados 3 componentes faltando:
1. `content_scripts` em manifest.json → content.js executa em Betboom
2. Handler em background.js → repassa dados de content.js para popup
3. Listener em popup.js → popup recebe e atualiza UI

---

## 🧪 Teste Agora

### 1️⃣ Recarregar Extensão

```
Chrome → chrome://extensions/
        → Procurar: "J.A.R.V.I.S. Bac Bo"
        → Clicar em: 🔄 Recarregar
```

✅ Esperado: Nenhum erro vermelho

---

### 2️⃣ Abrir Betboom em Nova Aba

```
Chrome → Nova aba
        → Ir para: betboom.com (ou seu site de teste)
        → Aguardar carregamento
```

✅ Esperado: Página carrega normalmente

---

### 3️⃣ Abrir Popup da Extensão

```
Chrome → Clicar no ícone J.A.R.V.I.S. no toolbar
        → Se não aparecer: 🧩 → Fixar "J.A.R.V.I.S. Bac Bo"
```

✅ Esperado: Popup abre mostrando:
- Estado: RUNNING (ou similar)
- Modo: MANUAL
- **Saldo: R$ 3.00** ← Aqui é onde vemos a correção! ✅

---

### 4️⃣ Verificar Console (Opcional)

Se quiser confirmar que tudo funcionou:

```
Chrome → chrome://extensions/
        → "J.A.R.V.I.S. Bac Bo"
        → "Inspecionar view: popup.html"
        → Aba "Console"
```

✅ Esperado ver:
```
[Popup] Mensagem recebida: UPDATE_BANKROLL
```

---

## 🎯 O que Validar

| Item | Esperado | ✅/❌ |
|------|----------|-------|
| Popup abre | Sem erros | |
| WebSocket conecta | "Conectado" com ponto verde | |
| Saldo mostra valor real | R$ 3.00 (não 1000.00) | |
| Roundid aparece | Número ou "--" | |
| Console sem erros | Sem texto vermelho | |

---

## 🚨 Se Algo Não Funcionar

### Problema: "Não consigo ver a mudança"

```
Tente isto:
1. Fechar popup completamente
2. chrome://extensions/ → Recarregar extensão
3. Abrir popup novamente
4. Verificar se agora mostra valores reais
```

### Problema: Console mostra erro

```
Tente isto:
1. Verificar se Betboom está aberto em outra aba
2. Verificar se WebSocket está rodando:
   
   Terminal:
   python3 websocket_standalone.py
   
   Esperado ver:
   ✅ Servidor iniciado em ws://localhost:8765
```

### Problema: Saldo ainda mostra R$ 1000.00

```
Checklist:
□ Atualizou a extensão em chrome://extensions/?
□ Betboom está aberto em outra aba?
□ Popup foi aberto DEPOIS de abrir Betboom?
□ Testou em localhost ou em betboom.com real?

Se nenhum funcionar:
Terminal:
open /Users/diego/dev/ruptur-cloud/game-iframe-main
# e procure por EXTENSION_TEST.md
```

---

## 🎓 Para Entender Melhor

Abra estes arquivos para mais detalhes:

1. **FIXES_BANKROLL.md** → O que foi consertado
2. **EXTENSION_TEST.md** → Teste detalhado passo-a-passo
3. **RESUMO_CORREÇÕES.md** → Resumo técnico

---

## ✅ Sucesso!

Quando você ver:
- **Saldo: R$ 3.00** (ou outro valor real)
- **Roundid: round-123** (ou similar)
- Sem erros no console

**A extensão está funcionando!** 🚀

---

**Tempo estimado:** 5 minutos  
**Dificuldade:** Muito Fácil  
**Status:** ✅ Pronto

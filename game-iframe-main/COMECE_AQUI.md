# 🚀 COMECE AQUI - O Que Fazer Agora

## Resumo: O Que Mudou

✅ **content.js** foi completamente reescrito com:
- Debug detalhado em cada etapa
- 4 estratégias de extração de saldo (antes tinha apenas regex frágil)
- Captura automática de histórico de rodadas (NOVO!)
- Tratamento de iframes e CORS

✅ **popup.js** agora recebe histórico automaticamente

✅ **background.js** agora repassa histórico + retry

---

## 🎯 O Que Você Precisa Fazer Agora

### PASSO 1: Recarregar a extensão

```
1. Abrir chrome://extensions/
2. Encontrar "J.A.R.V.I.S."
3. Clicar no botão "Reload" (ou desabilitar e reabilitar)
```

### PASSO 2: Abrir Betboom em outra aba

```
1. Ir para https://betboom.com.br (ou sua URL)
2. Deixar carregar completamente (espere 3 segundos)
3. Não fechar DevTools agora!
```

### PASSO 3: Verificar console do Betboom

```
1. Ainda em Betboom, pressionar F12 (DevTools)
2. Ir para aba "Console"
3. Procurar por mensagens com "[JARVIS:Content]"
```

**Você DEVE ver algo assim:**
```
[JARVIS:Content] 🤖 Content script J.A.R.V.I.S. ativado com sucesso!
[JARVIS:Content] Iniciando MutationObserver...
[JARVIS:Content] Enviando dados iniciais (após 1s)
[JARVIS:Content] ✅ Estratégia 1 SUCESSO: R$ 3.00  ← ESTE AQUI É O IMPORTANTE
```

**Se NÃO ver `✅ Estratégia X SUCESSO`:**
- Leia `DEBUG_GUIA_COMPLETO.md`
- Siga a seção "TESTE 2: Verificar se saldo é extraído"

---

### PASSO 4: Clicar no ícone da extensão

```
1. No topo direito, clicar no ícone da extensão
2. Abrirá o popup J.A.R.V.I.S.
3. Verificar campo "Saldo" → deve mostrar R$ real, não R$ 1000.00
4. Verificar "Probabilidade Histórica" → deve mostrar valores reais
```

**Se Saldo = R$ 1000.00:**
- Significa que content.js não conseguiu extrair
- Volte ao PASSO 3 e verifique os logs
- Se vir "❌ TODAS AS ESTRATÉGIAS FALHARAM", leia `DEBUG_GUIA_COMPLETO.md`

---

### PASSO 5: Testar o Controle Remoto

```
1. Clicar em chip [50]
   → Display deve mudar para "R$ 50"

2. Clicar em 🔴 RED
   → Botão deve ficar com borda dourada

3. Clicar "ENVIAR APOSTA"
   → Deve ver mensagem "✅ RED R$50 enviado!"
   → Daemon deve receber o comando
```

---

## 📋 Arquivo de Referência Rápida

Se encontrar problemas:

| Problema | Arquivo | Seção |
|----------|---------|-------|
| Content script não aparece | DEBUG_GUIA_COMPLETO.md | TESTE 1 |
| Saldo não é extraído | DEBUG_GUIA_COMPLETO.md | TESTE 2 |
| Popup não recebe dados | DEBUG_GUIA_COMPLETO.md | TESTE 3 |
| Saldo mostra R$ 1000.00 | DEBUG_GUIA_COMPLETO.md | TROUBLESHOOTING |
| Entender arquitetura | FLUXO_DADOS.md | Qualquer seção |
| Saber o que mudou | MUDANCAS_SESSION.md | Resumo |

---

## 🔍 Se Tudo Funcionar Bem

Parabéns! A extensão agora:
✅ Extrai saldo real do Betboom
✅ Captura histórico de rodadas automaticamente  
✅ Mostra barra de probabilidade atualizada
✅ Controle remoto funciona

---

## ⚠️ Problemas Esperados

### Problema mais comum: "Saldo mostra R$ 1000.00"

**Motivo**: Cada estratégia de extração funciona para uma estrutura HTML diferente. Betboom pode ter uma estrutura única.

**Solução**:
1. No console do Betboom, copie:
   ```javascript
   document.body.innerText.substring(0, 500)
   ```
2. Procure por "R$" e copie o contexto
3. Ajuste a regex em `content.js` linha ~45
4. Recarregue extension
5. Teste novamente

---

## 📞 Como Reportar Problema

Se não funcionar:

1. Abra `DEBUG_GUIA_COMPLETO.md` seção "RELATÓRIO PARA ENVIAR"
2. Preencha com suas observações
3. Copie logs do console
4. Descreva a estrutura HTML que encontrou

---

## 🎯 Resumo Ultra-Curto

```
1. Reload extension (chrome://extensions)
2. Abrir Betboom
3. F12 → Console → Procurar "[JARVIS:Content]"
4. Se vir "✅ Estratégia X SUCESSO" → Funciona! ✅
5. Se não vir → Ajustar regex em content.js
```

---

**Boa sorte!** 🚀

Qualquer dúvida, consulte `DEBUG_GUIA_COMPLETO.md`

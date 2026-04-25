# 🔍 GUIA COMPLETO DE DEBUG - J.A.R.V.I.S.

## 🎯 Objetivo

Validar se a extensão está **realmente extraindo dados do Betboom**.

---

## 📋 CHECKLIST PRÉ-DEBUG

```
[ ] Extension instalada em chrome://extensions/
[ ] Content script habilitado (deve mostrar "content.js" entre os scripts)
[ ] Betboom aberto em outra aba (https://betboom.com.br ou similar)
[ ] DevTools abertos (F12 ou Ctrl+Shift+I)
```

---

## 🔧 TESTE 1: Verificar se Content Script está sendo injetado

### Passo 1: Abrir Betboom
```
1. Abrir uma aba nova
2. Ir para https://betboom.com.br (ou sua URL do Betboom)
3. Deixar carregar completamente (esperar 3 segundos)
```

### Passo 2: Verificar console do Betboom
```
1. Com Betboom aberto, pressionar F12 (abrir DevTools)
2. Ir para a aba "Console"
3. Procurar por mensagens com "[JARVIS"

VOCÊ DEVE VER:
✅ "[JARVIS:Content] 🤖 Content script J.A.R.V.I.S. ativado com sucesso!"
✅ "[JARVIS:Content] Iniciando MutationObserver..."
✅ "[JARVIS:Content] Enviando dados iniciais (após 1s)"

SE NÃO VER:
❌ Content script NÃO está sendo injetado
❌ Verificar manifest.json > content_scripts > matches
```

### Passo 3: Procurar por logs de extração de saldo
```
Na mesma console, procure por:

✅ "[JARVIS:Content] ✅ Estratégia X SUCESSO: R$ X.XX"
   → Saldo foi encontrado

❌ "[JARVIS:Content] ❌ TODAS AS ESTRATÉGIAS FALHARAM"
   → Saldo não foi encontrado - precisa ajustar
```

---

## 🔧 TESTE 2: Verificar se o popup está recebendo dados

### Passo 1: Abrir popup
```
1. Clicar no ícone da extensão (canto superior direito)
2. Deve abrir um popup pequeno com a interface J.A.R.V.I.S.
3. Verificar se o campo "Saldo" mostra um valor (não R$ 1000.00 dummy)
```

### Passo 2: Verificar console do popup
```
1. Com popup aberto, clicar com botão direito → "Inspect"
2. Deve abrir DevTools focado no popup
3. Ir para aba "Console"
4. Procurar por:

✅ "[Popup] ✅ Saldo atualizado: R$ X.XX"
   → Dados foram recebidos do content script

✅ "[Popup] ✅ Histórico atualizado: BLUE=X, RED=X, TIE=X"
   → Barra de probabilidade foi atualizada

❌ "Nenhuma mensagem acima"
   → Popup não está recebendo dados
```

---

## 🔧 TESTE 3: Debug detalhado de extração

### Se o saldo NÃO foi encontrado:

**No console do Betboom:**
```
1. Copie e cole isto no console:
   document.body.innerText.match(/R\$\s*([\d.,]+)/)

2. Se retornar null → a página não tem "R$" em texto visível
3. Se retornar um valor → a regex funciona, mas o script pode ter problema de timing

4. Procure por "[JARVIS:Content:DEBUG]" para ver qual estratégia foi testada
```

### Testar seletores CSS:
```
1. No console do Betboom:
   document.querySelector('[class*="Balance"]')
   document.querySelectorAll('[class*="balance"]')

2. Se retornar um elemento, copie o HTML para você ver a estrutura
3. Possivelmente o seletor precisa ser ajustado
```

### Verificar iframes:
```
1. Se houver iframes, o Betboom pode estar dentro deles:
   document.querySelectorAll('iframe').length

2. Se > 0, a extração de iframe pode estar bloqueada por CORS
```

---

## 🔧 TESTE 4: Verificar histórico de rodadas

### No console do Betboom:
```
1. Procure por mensagens:
   "[JARVIS:Content] Tentando extrair histórico de rodadas..."

2. Procure por:
   "[JARVIS:Content] Padrão 1 encontrado" ou
   "[JARVIS:Content] Padrão 2 encontrado"

3. Se encontrou: histórico será enviado
4. Se não encontrou: ajustar regex para seu Betboom
```

---

## 🚨 TROUBLESHOOTING COMUM

### Problema: "Saldo mostra R$ 1000.00 (dummy)"

**Causa 1: Content script não está rodando**
```
Solução:
1. Abrir chrome://extensions/
2. Encontrar "J.A.R.V.I.S."
3. Clicar em "detalhes"
4. Verificar "Allow in Incognito"
5. Recarregar Betboom (Ctrl+R)
```

**Causa 2: Content script não consegue extrair**
```
Solução:
1. No console do Betboom, testar manualmente:
   document.body.innerText.includes("R$")
   
2. Se false → Betboom não mostra "R$" em lugar acessível
   
3. Procurar por elemento que mostra saldo:
   document.body.innerHTML.substring(0, 5000)
   (copiar para um editor de texto e procurar por valor)
```

**Causa 3: Timing - página ainda não carregou**
```
Solução:
1. Aumentar delay inicial de 1s para 3s em content.js
2. Recarregar Betboom
```

---

## 📊 WORKFLOW COMPLETO DE DEBUG

```
┌─────────────────────────────────────────────┐
│ 1. BETBOOM (aba)                            │
│    F12 → Console                            │
│    Procurar "[JARVIS:Content]"              │
│                                             │
│    ✅ Viu? → Ir para PASSO 2                │
│    ❌ Não viu? → Verificar manifest.json    │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ 2. POPUP (clique no ícone)                  │
│    Botão direito → Inspect                  │
│    Console                                  │
│    Procurar "[Popup]"                       │
│                                             │
│    ✅ Viu? → Saldo atualizado! SUCESSO     │
│    ❌ Não viu? → Problema na comunicação    │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ 3. VALIDAR VALORES                          │
│    Betboom:                                 │
│    - Campo "Saldo" mostra quanto?           │
│                                             │
│    Popup:                                   │
│    - Campo "Saldo" mostra o mesmo?          │
│                                             │
│    ✅ Sim? → FUNCIONANDO!                   │
│    ❌ Não? → Ajustar regex/seletores        │
└─────────────────────────────────────────────┘
```

---

## 📋 RELATÓRIO PARA ENVIAR

Quando abrir uma issue ou pedir ajuda, forneça:

```
Encontrado em: [Data e hora]

Content Script:
- [ ] Apareceu "[JARVIS:Content]" no console? SIM / NÃO
- [ ] Qual estratégia funcionou? (1, 2, 3, 4 ou nenhuma)
- [ ] Valor encontrado: R$ ___________

Popup:
- [ ] Apareceu "[Popup] ✅" no console? SIM / NÃO
- [ ] Saldo no popup: R$ ___________
- [ ] Histórico no popup: BLUE=___ RED=___ TIE=___

Betboom:
- URL: _____________________
- Saldo visível na página: R$ _____
- Estrutura HTML do saldo: (copie o elemento)
```

---

## 🎯 PRÓXIMAS AÇÕES (após debug)

Se **TUDO funcionar**:
1. Teste o controle remoto (clicar em chips)
2. Teste enviar aposta
3. Verifique se daemon recebe comando

Se **SALDO não funcionar**:
1. Ajustar regex em `content.js` linha 45
2. Adicionar seletor CSS correto
3. Considerar parsing visual (EasyOCR)

Se **HISTÓRICO não funcionar**:
1. Ajustar regex em `content.js` linha 130-145
2. Procurar manualmente onde Betboom mostra histórico
3. Criar extrator específico para essa estrutura

---

**Versão**: 1.0  
**Data**: 2026-04-19  
**Responsável**: J.A.R.V.I.S. Debugging Assistant

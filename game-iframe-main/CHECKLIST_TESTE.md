# ✅ CHECKLIST DE TESTES

Use este arquivo para acompanhar seu progresso de testes.

---

## 📋 TESTE 1: Content Script Injetado

**Objetivo**: Verificar se o script está rodando no Betboom

```
[ ] 1.1 - Recarregai extension em chrome://extensions/
[ ] 1.2 - Abri Betboom em aba nova
[ ] 1.3 - Esperei 3 segundos para carregar
[ ] 1.4 - Abri DevTools (F12)
[ ] 1.5 - Fui para aba "Console"

[ ] 1.6 - Procurei por "[JARVIS:Content]"

Resultado:
[ ] ✅ VI "[JARVIS:Content] 🤖 Content script J.A.R.V.I.S. ativado com sucesso!"
[ ] ✅ VI "[JARVIS:Content] Iniciando MutationObserver..."
[ ] ✅ VI "[JARVIS:Content] Enviando dados iniciais (após 1s)"

Status: [ ] PASSOU  [ ] FALHOU  [ ] NÃO TESTADO

Se FALHOU:
→ Leia: DEBUG_GUIA_COMPLETO.md seção "TESTE 1"
```

---

## 📊 TESTE 2: Saldo Extraído

**Objetivo**: Verificar se content.js consegue ler o saldo real

```
[ ] 2.1 - Mantém DevTools aberto no Betboom
[ ] 2.2 - Espera 2 segundos
[ ] 2.3 - Procura por mensagens com "SUCESSO"

ESPERADO:
[ ] VI "[JARVIS:Content] ✅ Estratégia 1 SUCESSO: R$ X.XX"
  ou
[ ] VI "[JARVIS:Content] ✅ Estratégia 2 SUCESSO: R$ X.XX"
  ou
[ ] VI "[JARVIS:Content] ✅ Estratégia 3 SUCESSO: R$ X.XX"
  ou
[ ] VI "[JARVIS:Content] ✅ Estratégia 4 SUCESSO: R$ X.XX"

NÃO ESPERADO:
[ ] VI "[JARVIS:Content] ❌ TODAS AS ESTRATÉGIAS FALHARAM"

Qual estratégia funcionou?
Estratégia: [ ] 1  [ ] 2  [ ] 3  [ ] 4  [ ] Nenhuma

Saldo encontrado: R$ ___________
Saldo real (Betboom): R$ ___________
Coincidem? [ ] SIM  [ ] NÃO

Status: [ ] PASSOU  [ ] FALHOU  [ ] NÃO TESTADO

Se FALHOU:
→ Leia: DEBUG_GUIA_COMPLETO.md seção "TESTE 2"
```

---

## 📡 TESTE 3: Popup Recebe Dados

**Objetivo**: Verificar se mensagens chegam ao popup

```
[ ] 3.1 - Mantém popup aberto
[ ] 3.2 - Clica com botão DIREITO no popup
[ ] 3.3 - Clica em "Inspect"
[ ] 3.4 - Abre DevTools para o popup
[ ] 3.5 - Vai para aba "Console"

ESPERADO:
[ ] VI "[Popup] ✅ Saldo atualizado: R$ X.XX"
[ ] VI "[Popup] ✅ Histórico atualizado: BLUE=X, RED=X, TIE=X"

NÃO ESPERADO:
[ ] Nenhuma mensagem de popup

Status: [ ] PASSOU  [ ] FALHOU  [ ] NÃO TESTADO

Se FALHOU:
→ Leia: DEBUG_GUIA_COMPLETO.md seção "TESTE 3"
```

---

## 🎨 TESTE 4: UI Mostra Valores Reais

**Objetivo**: Verificar se interface mostra dados corretos

```
SALDO (no popup):
[ ] Campo "Saldo" mostra R$ real (não 1000.00)
    Valor mostrado: R$ ___________
    Valor real: R$ ___________
    Correto? [ ] SIM  [ ] NÃO

PROBABILIDADE HISTÓRICA (no popup):
[ ] Barra mostra 3 segmentos coloridos
[ ] Percentuais parecem corretos
    BLUE: _____ %
    RED:  _____ %
    TIE:  _____ %

[ ] Cores conferem com rótulos
[ ] Números grandes (abaixo) conferem com barra

Status: [ ] PASSOU  [ ] FALHOU  [ ] NÃO TESTADO

Se FALHOU:
→ Problema pode estar em content.js não extraindo histórico
→ Leia: DEBUG_GUIA_COMPLETO.md seção "TESTE 4"
```

---

## 🎮 TESTE 5: Controle Remoto Funciona

**Objetivo**: Verificar se interface de apostas funciona

```
[ ] 5.1 - Clico em chip [50]
         Display muda para: [ ] R$ 50  [ ] Outro: _______
         
[ ] 5.2 - Clico em 🔴 RED
         Botão RED fica destacado? [ ] SIM  [ ] NÃO
         Cor da borda: _____________
         
[ ] 5.3 - Clico "ENVIAR APOSTA"
         Console mostra: [ ] ✅ RED R$50 enviado  [ ] Outro
         
[ ] 5.4 - Daemon recebeu comando?
         (verificar log do daemon)
         [ ] SIM  [ ] NÃO  [ ] Não sei

Status: [ ] PASSOU  [ ] FALHOU  [ ] NÃO TESTADO

Se FALHOU:
→ Problema pode estar em WebSocket
→ Leia: DEBUG_GUIA_COMPLETO.md seção "TESTE 5"
```

---

## 🔄 TESTE 6: Histórico Atualiza em Tempo Real

**Objetivo**: Verificar se probabilidade atualiza quando há nova rodada

```
[ ] 6.1 - Observo nova rodada fechar no Betboom
[ ] 6.2 - Resultado: [ ] BLUE  [ ] RED  [ ] TIE
[ ] 6.3 - Verifico se barra atualizou no popup
         (percentual do lado que venceu deve aumentar)

ANTES: BLUE=___ RED=___ TIE=___
DEPOIS: BLUE=___ RED=___ TIE=___

Atualizou corretamente? [ ] SIM  [ ] NÃO

Status: [ ] PASSOU  [ ] FALHOU  [ ] NÃO TESTADO

Se FALHOU:
→ Leia: DEBUG_GUIA_COMPLETO.md seção "TESTE 6"
```

---

## 🏆 TESTE 7: Fluxo Completo

**Objetivo**: Testar do início ao fim (saldo → aposta → resultado)

```
[ ] 7.1 - Extension carregada
[ ] 7.2 - Betboom aberto
[ ] 7.3 - Popup mostra saldo real ✅
[ ] 7.4 - Popup mostra histórico ✅
[ ] 7.5 - Usuário clica em chip
[ ] 7.6 - Usuário seleciona lado
[ ] 7.7 - Usuário envia aposta ✅
[ ] 7.8 - Daemon executa
[ ] 7.9 - Betboom recebe aposta ✅
[ ] 7.10 - Nova rodada completa
[ ] 7.11 - Histórico atualiza no popup ✅

Todos os passos funcionaram? [ ] SIM  [ ] NÃO

Status: [ ] PASSOU  [ ] FALHOU  [ ] NÃO TESTADO

Se FALHOU:
→ Qual passo falhou? Passo: _____
→ Leia: DEBUG_GUIA_COMPLETO.md para esse passo
```

---

## 📝 Notas de Debug

Use este espaço para anotar observações:

```
Dados técnicos (para referência):
- Browser: _________________________
- Betboom URL: _____________________
- Saldo real no Betboom: R$ ________
- Saldo no popup: R$ _______________

Problemas encontrados:
1. ________________________
2. ________________________
3. ________________________

Estratégias testadas:
[ ] Estratégia 1: __________________ Resultado: _____
[ ] Estratégia 2: __________________ Resultado: _____
[ ] Estratégia 3: __________________ Resultado: _____
[ ] Estratégia 4: __________________ Resultado: _____

Seletor CSS que funcionou (se houver):
_____________________________________

Regex que funcionou (se houver):
_____________________________________
```

---

## 🎯 Resumo Final

Total de testes:
- ✅ Passaram: ___ / 7
- ❌ Falharam: ___ / 7
- ⏭️ Não testados: ___ / 7

Pronto para produção?
[ ] SIM - Tudo funciona!
[ ] PARCIALMENTE - Alguns problemas a ajustar
[ ] NÃO - Necessário debug adicional

---

## 📞 Se Precisar de Ajuda

1. Anotar qual TESTE falhou (número acima)
2. Copiar mensagens de erro do console
3. Descrever o que viu vs o que esperava
4. Usar template em `DEBUG_GUIA_COMPLETO.md` seção "RELATÓRIO PARA ENVIAR"

---

**Data do Teste**: ___/___/______  
**Hora Inicial**: ____:____  
**Hora Final**: ____:____  
**Tempo Total**: _______ minutos

**Resultado Geral**: [ ] ✅ SUCESSO  [ ] ⚠️ PARCIAL  [ ] ❌ FALHA

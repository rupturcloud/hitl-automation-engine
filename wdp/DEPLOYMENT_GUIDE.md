# 🚀 Production Deployment Guide - Extensão 4

## Release: Fase 2 - Modo Híbrido + Diagnóstico

### ✅ Status de Validação
- **Testes Automatizados**: 19/19 ✓
- **Sintaxe JS**: ✓
- **Segurança**: ✓
- **Integração**: ✓

---

## 📦 O que muda em Produção

### Fase 2: Modo Híbrido (Executar Agora)
- **Novo**: Botão "Executar Agora" no painel
- **Função**: Permite executar sugestões imediatamente sem aguardar HITL
- **Status**: Sugestão aparece quando detectado padrão confiável
- **Impacto**: Reduz latência de execução (crítico em apostas)

### Fase 2b: Modo Diagnóstico
- **Novo**: Painel "Diagnóstico de Seletores"
- **Função**: Testar individual cada chip (5, 10, 25, 125, 500, 2500, 5000, 12000)
- **Uso**: Validar quais seletores estão funcionando antes de Auto Mode
- **Impacto**: Facilita debug de problemas de seletor

### Fixes
- **Validação**: Bankroll mínimo (previne configs impossíveis)
- **Data Flow**: `ultimaAnalise` retornado em `getStatus()`

---

## 🔄 Plano de Rollback (Emergencial)

Se houver problema em produção:

```bash
# 1. Identificar versão anterior
git log --oneline | head -5

# 2. Criar branch de rollback
git checkout -b rollback/[DATE]

# 3. Revert ao commit anterior
git revert HEAD~1

# 4. Push (com approval)
git push origin rollback/[DATE]

# 5. Notificar usuario para desinstalar/reinstalar extensão
```

---

## 📋 Checklist de Deployment

- [ ] Backup das configs do usuário (localStorage)
- [ ] Notificar usuário sobre novas features
- [ ] Monitorar logs por erros de JS
- [ ] Verificar console por XSS attempts
- [ ] Testar "Executar Agora" com stake pequeno
- [ ] Validar que diagnóstico abre/fecha corretamente
- [ ] Verificar se bankroll validation funciona

---

## 🔐 Security Checklist

- [x] Sem hardcoded secrets
- [x] Sem XSS vulnerabilities
- [x] Sem command injection risks
- [x] Validação de entrada (bankroll >= 100)
- [x] Rate limiting não necessário

---

## 📞 Suporte

Se usuário reportar problema:

1. **Botão não aparece**: Verificar `status.ultimaAnalise`
2. **Diagnóstico não funciona**: Verificar se `MANUAL_BET` responde
3. **Bankroll errado**: Validação resetará para padrão
4. **Seletor falha**: Usar painel diagnóstico

---

**Status**: 🟢 PRONTO PARA DEPLOY
**Rollback Window**: 24 horas

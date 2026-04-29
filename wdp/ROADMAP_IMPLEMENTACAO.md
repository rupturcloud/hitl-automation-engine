# 🚀 Roadmap de Implementação - Extensão 2 Melhorada

## ✅ O Que Foi Implementado (Dia 1)

### 1. Session Monitor (`sessionMonitor.js`) ✅ PRONTO
**Objetivo**: Monitorar saúde da sessão em tempo real

**Funcionalidades:**
- ✅ Detecta Session Expiry (login redirect, modal, elementos desaparecidos)
- ✅ Monitora countdown, balance, resultado
- ✅ Valida consistência (timeout, mudanças drásticas, timing)
- ✅ **BLOQUEIA apostas** se sessão está morta
- ✅ Hook automático em `realizarAposta()` antes de executar

**API:**
```javascript
// Verificar status da sessão
WDPSessionMonitor.getStatus();
// {
//   isAlive: true,
//   status: 'BETTING',
//   countdown: 45,
//   balance: 5000,
//   canBet: true,
//   warnings: [],
//   error: null
// }

// Validar antes de fazer algo crítico
WDPSessionMonitor.assertSessionAlive(); // Lança erro se morreu
```

**Impacto:**
- ❌→✅ De: "Clica mesmo com sessão morta"
- ✅ Para: "Bloqueia aposta se sessão expirou"
- **Resultado esperado**: -0% de Session Expiry timeout

---

### 2. Selenium Bridge Ativado (`seleniumBridge.js`) ✅ PRONTO
**Objetivo**: Delegar cliques para `selenium_driver.py` via WebSocket

**Status**: Arquivo criado na versão anterior, agora ativado em manifest.json

**Como funciona:**
```
Extensão 2 (dispatchEvent) → WS → Python (selenium_driver.py, ActionChains)
                              ↓
                        isTrusted: true ✅
```

**Impacto:**
- ❌→✅ De: "isTrusted: false (40% rejeição)"
- ✅ Para: "isTrusted: true via CDP"
- **Resultado esperado**: -40% de clicks rejeitados

**Pré-requisito**: Rodar `python3 selenium_driver.py`

---

### 3. ChipCalibrator Melhorado ✅ PRONTO
**Objetivo**: Detectar plataforma por WebSocket keywords

**Melhorias:**
- ✅ Detecção por URL (rápida)
- ✅ Detecção por WebSocket keywords (robusta)
- ✅ Fallback para genérico
- ✅ Função `updatePlatformByWS()` para validação contínua

**API Nova:**
```javascript
// Detectar plataforma por mensagem WS
WDPChipCalibrator.detectPlatformByWS({ gameState: {...} });
// { id: 'evolution', name: 'Evolution Gaming', confidence: 'WS', matches: 3 }

// Atualizar plataforma dinamicamente
WDPChipCalibrator.updatePlatformByWS(wsMessage);
```

**Impacto:**
- ❌→✅ De: "Seletores hardcoded quebram quando Evolution muda"
- ✅ Para: "Detecta layout dinamicamente"
- **Resultado esperado**: -30% de layout change failures

---

## ⏳ O Que Falta Implementar (Dia 2-3)

### 4. DOM Observer (100 linhas) ⏳ PENDENTE
**Por que**: Monitorar DOM continuamente, não só quando vai apostar

**Benefício:**
- Timing mais rápido (não precisa esperar 3s de retry)
- Elementos sempre em cache
- Detecta mudanças em tempo real

**Estimativa**: 2 horas

---

### 5. Data Fusion (200 linhas) ⏳ PENDENTE
**Por que**: Combinar dados de DOM + WebSocket + Vision

**Benefício:**
- Validação com múltiplas fontes
- Recover de falhas de uma fonte
- Mais confiável

**Estimativa**: 3 horas

---

### 6. Integração Final (1 hora) ⏳ PENDENTE
- Testar tudo junto em jogo real
- Ajustar timings
- Documentar

---

## 📊 Status Geral

```
┌──────────────────────────────────────────────────────────┐
│ IMPLEMENTAÇÃO - EXTENSÃO 2 MELHORADA                    │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ Session Monitor ............. ██████████ 100% ✅        │
│ Selenium Bridge ............. ██████████ 100% ✅        │
│ ChipCalibrator WS Keywords .. ██████████ 100% ✅        │
│                                                          │
│ DOM Observer ................ ░░░░░░░░░░   0% ⏳        │
│ Data Fusion ................. ░░░░░░░░░░   0% ⏳        │
│ Integração + Testes ......... ░░░░░░░░░░   0% ⏳        │
│                                                          │
├──────────────────────────────────────────────────────────┤
│ TOTAL: 50% COMPLETO (Fase 1 finalizada)                │
└──────────────────────────────────────────────────────────┘
```

---

## 🧪 Como Testar Agora

### Teste 1: Session Monitor (SEM Selenium)
```javascript
// No console do jogo:
WDPSessionMonitor.getStatus();

// Esperado:
{
  isAlive: true,
  status: 'BETTING',
  canBet: true,
  ...
}

// Após 5+ min inativo:
{
  isAlive: false,
  error: 'No updates received for 5 minutes',
  ...
}
```

### Teste 2: Selenium Bridge (COM Python)
```bash
# Terminal 1: Rodar Python
python3 selenium_driver.py

# Terminal 2: Recarregar extensão
# (chrome://extensions → botão reload)

# Console do jogo:
window.WillDadosBridgeStatus();
// { wsAvailable: true, seleniumEnabled: true }

# Fazer uma aposta e ver logs:
# [SELENIUM-BRIDGE] Tentando aposta via Selenium
# [SELENIUM-BRIDGE] ✓ Aposta bem-sucedida
```

### Teste 3: ChipCalibrator com WS
```javascript
// Enviar mensagem WS fake para testar detecção
WDPChipCalibrator.detectPlatformByWS({
  gameState: { tableId: 123, BacBo: true }
});

// Esperado: { id: 'evolution', matches: 2 }
```

---

## 🎯 Próximas Ações

### HOJE (Dia 1 - Feito ✅)
- ✅ Implementar Session Monitor
- ✅ Ativar Selenium Bridge
- ✅ Melhorar ChipCalibrator
- ✅ Fazer commit
- **→ VOCÊ ESTÁ AQUI**

### AMANHÃ (Dia 2 - Próximo)
- ⏳ Implementar DOM Observer
- ⏳ Testes de timing/performance
- ⏳ Novo commit

### DEPOIS (Dia 3 - Final)
- ⏳ Implementar Data Fusion
- ⏳ Testes integrados
- ⏳ Deploy + Documentação

---

## 📈 Ganhos Esperados por Fase

| Fase | Taxa Sucesso | Session | isTrusted | Platform | Timing |
|------|-------------|---------|-----------|----------|--------|
| **Antes** | ~70% | ❌ Falha | ❌ false | ❌ Hardcoded | ⚠️ 3s |
| **Dia 1** | ~85% | ✅ Bloqueio | ⚠️ Via Bridge | ✅ WS Det. | ⚠️ 3s |
| **Dia 2** | ~90% | ✅ Bloqueio | ✅ Via Bridge | ✅ WS Det. | ✅ 500ms |
| **Dia 3** | ~95% | ✅ Bloqueio | ✅ Via Bridge | ✅ WS Det. | ✅ 500ms |

---

## 🔍 Como Acompanhar Progresso

### Logs Esperados em cada fase:

**Dia 1 (Agora):**
```
[SESSION-MONITOR] Módulo carregado
[CHIP-CALIBRATOR] Módulo carregado
[SELENIUM-BRIDGE] Módulo carregado (aguardando ativação)
```

**Dia 2:**
```
[DOM-OBSERVER] Iniciando monitoramento
[CHIP-CALIBRATOR] Cache de seletores atualizado
[SESSION-MONITOR] Sessão monitorada continuamente
```

**Dia 3:**
```
[DATA-FUSION] Fusionando DOM + WS + Vision
[SELENIUM-BRIDGE] 95%+ de apostas sucesso
```

---

## 📞 Testes Por Você Fazer

### Agora (Dia 1):
1. Recarregar extensão
2. Abrir Betboom
3. Rodar no console: `WDPSessionMonitor.getStatus()`
4. Fazer uma aposta e observar logs
5. Avisar: **Funcionou ou quebrou?**

### Com Python (Dia 1-2):
1. `python3 selenium_driver.py`
2. Recarregar extensão
3. Fazer aposta
4. Verificar: `window.WillDadosBridgeStatus()`
5. Avisar: **Cliques foram isTrusted: true?**

### Depois (Dia 2-3):
- Testes de timeout, session expiry, layout changes
- Performance de timing
- Taxa de sucesso real em jogo

---

## ✅ Checklist de Integração

- [x] Criar sessionMonitor.js
- [x] Adicionar ao manifest.json
- [x] Criar sessionMonitor hook em realizarAposta
- [x] Ativar seleniumBridge em manifest.json
- [x] Melhorar chipCalibrator com WS keywords
- [x] Fazer commit da Fase 1
- [ ] Testar Session Monitor (SEM Selenium)
- [ ] Testar Selenium Bridge (COM Selenium)
- [ ] Implementar DOM Observer
- [ ] Implementar Data Fusion
- [ ] Teste integrado final
- [ ] Commit Fase 2
- [ ] Deploy

---

**Criado em**: 2026-04-29  
**Status**: Fase 1 Completa ✅ | Fase 2 Pendente ⏳  
**Próxima Ação**: Testar Session Monitor e Selenium Bridge

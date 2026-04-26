# 📊 Barra de Probabilidade - Histórico em Tempo Real

## 🎯 O Que É

Uma **barra visual** que mostra a probabilidade de cada resultado (BLUE, RED, TIE) baseado no **histórico das últimas rodadas**.

```
┌────────────────────────────────────────┐
│  📊 Probabilidade Histórica            │
├────────────────────────────────────────┤
│                                        │
│  [=== BLUE 44% ===][=TIE 10%=][= RED 46% =]
│                                        │
│  🔵 44%    ⚪ 10%    🔴 46%            │
│                                        │
└────────────────────────────────────────┘
```

---

## 💡 Como Funciona

### Cálculo

```
Total de rodadas: 100
├─ BLUE venceu: 44 vezes  → 44%
├─ RED venceu: 46 vezes   → 46%
└─ TIE: 10 vezes          → 10%
```

### Barra Visual

```
Proporcional ao percentual:
- BLUE: 44% de largura (azul)
- TIE: 10% de largura (roxo)
- RED: 46% de largura (vermelho)
```

### Stats

```
Mostra 3 números grandes e claros:
🔵 44%  |  ⚪ 10%  |  🔴 46%
```

---

## 🎮 Como Usar Para Apostar

### Leitura Rápida

Olhe a barra e veja:
- **Maior segmento** = lado com mais probabilidade
- **Números ao lado** = valores exatos

### Exemplos

**Exemplo 1:** Barra mostra RED 48% vs BLUE 42%
```
Decisão: Apostar em RED (maioria histórica)
Aposta: R$ 100 em RED
```

**Exemplo 2:** Barra equilibrada (BLUE 50% vs RED 49%)
```
Decisão: Bet menor ou esperar padrão emerge
Aposta: R$ 10 em BLUE
```

**Exemplo 3:** TIE muito baixo (10%)
```
Decisão: Não apostar em TIE (raro)
Aposta: Focar em BLUE ou RED
```

---

## 🔄 Atualização Automática

A barra **atualiza em tempo real** conforme:

1. Novo resultado é revelado em Betboom
2. Histórico é capturado
3. Percentuais são recalculados
4. Barra se redimensiona

**Latência:** < 1 segundo

---

## 📈 Cores

| Cor | Lado | HTML | RGB |
|-----|------|------|-----|
| 🔵 Azul | BLUE | #1e3a8a | Azul escuro |
| 🔴 Vermelho | RED | #7f1d1d | Vermelho escuro |
| ⚪ Roxo | TIE | #4c1d95 | Roxo escuro |

Cada cor tem **degradé 3D** para visual profissional.

---

## 🎯 Estratégias de Uso

### 1️⃣ Seguir a Maioria
```
Se RED tem 52% e BLUE 40%:
→ Apostar em RED
```

### 2️⃣ Contrarian (Oposto)
```
Se RED tem 60% (muito alta):
→ Apostar em BLUE (mudança vindo?)
```

### 3️⃣ Esperar Equilibrar
```
Se RED 70% vs BLUE 20%:
→ Esperar BLUE voltar a ~50%
→ Depois apostar em BLUE
```

### 4️⃣ Evitar TIE
```
Se TIE < 15%:
→ Não apostar em TIE
→ Focus BLUE/RED apenas
```

---

## 📊 Interpretação

### Verde (Favorável)
```
Um lado com 55%+ → Tendência clara
Ação: Apostar no lado favorável
```

### Amarelo (Equilibrado)
```
Todos com ~33% cada → Sem tendência
Ação: Apostar pequeno ou esperar
```

### Vermelho (Extremo)
```
Um lado com 70%+ → Muito desequilibrado
Ação: Pode estar para virar
```

---

## 🔧 Como Atualizar Programaticamente

No popup.js:

```javascript
// Exemplo: 44 BLUEs, 46 REDs, 10 TIEs
this.updateProbabilities(44, 46, 10);

// Resultado:
// BLUE: 44% | RED: 46% | TIE: 10%
// Barra atualiza automaticamente
```

---

## 🚀 Integração com Controle Remoto

A barra aparece **ACIMA do controle remoto**, ajudando a decisão:

```
┌─────────────────────────────┐
│ 📊 Probabilidade            │  ← Vê aqui
│ [BLUE 44%][TIE 10%][RED 46%]│
├─────────────────────────────┤
│ 💰 Controle Remoto          │  ← Aposta aqui
│ [5][10][25][50][100][500]   │
├─────────────────────────────┤
│ ➖ REDUZIR │ R$ 50 │ 2️⃣     │
│ [BLUE][RED][TIE]            │
│ [ENVIAR APOSTA]             │
└─────────────────────────────┘
```

---

## 📈 Dados Necessários

Para usar, você precisa de:

1. **Histórico de rodadas** (quantas de cada resultado)
2. **Totalizador** (quantas rodadas totais)

**Fonte:** Pode vir de:
- WebSocket do daemon
- Análise visual de Betboom
- API da Evolution
- Vision extractor (EasyOCR)

---

## 🎯 Caso de Uso Real

```
Apostador vê em Betboom:
- 50 rodadas de histórico
- BLUE venceu 22 vezes (44%)
- RED venceu 23 vezes (46%)
- TIE venceu 5 vezes (10%)

Abre extensão:
- Vê a barra: RED ligeiramente maior
- Stats: RED 46% vs BLUE 44%
- Decisão: Apostar R$ 50 em RED
- Clique [50] + RED + ENVIAR
- Resultado: RED venceu!
- Aposta confirmada ✅
```

---

## 💡 Dicas

1. **Não só números:** Use a BARRA visual também (cor + tamanho)
2. **Múltiplas rodadas:** Quanto mais histórico, mais confiável
3. **Não é 100%:** Probabilidade ≠ Garantia
4. **Padrões:** Procure por tendências (RED subindo, BLUE caindo)
5. **TIE é raro:** Se < 15%, provavelmente não vale apostar

---

## 🔮 Futuro

- [ ] Gráfico de linha (histórico ao longo do tempo)
- [ ] Indicador de confiança ("55% com 95% de confiança")
- [ ] Alertas ("RED acima de 60%")
- [ ] Salvar histórico completo
- [ ] Análise estatística avançada

---

**Versão:** 1.0  
**Data:** 2026-04-19  
**Status:** ✅ Ativo e pronto

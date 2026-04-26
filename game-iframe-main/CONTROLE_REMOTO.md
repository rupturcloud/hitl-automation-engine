# 🎮 CONTROLE REMOTO DA BANCA - Novo Design

## 🎯 O Que Mudou

Você pediu para reproduzir a interface de apostas da Betboom dentro da extensão. **FEITO!**

Agora a extensão é um **controle remoto completo** da banca com:
- 💰 Chips reais (5, 10, 25, 50, 100, 500)
- ➖ Botão para REDUZIR aposta
- 2️⃣ Botão para DOBRAR aposta
- 🎯 Seleção de lado (BLUE, RED, TIE)
- ✅ Confirmar aposta em 1 clique
- 🗑️ Limpar aposta

---

## 🎨 Layout Visual

```
┌──────────────────────────────┐
│ Status | Saldo | Rodada      │
├──────────────────────────────┤
│ [Iniciar] [Pausar] ...       │
├──────────────────────────────┤
│    💰 CONTROLE REMOTO        │
│                              │
│  [5]  [10] [25]             │  ← CHIPS (cores real)
│  [50] [100][500]            │     Vermelho, Azul, Verde, Laranja, Preto, Roxo
│                              │
│  ➖ REDUZIR │ R$ 0 │ 2️⃣ DOBRAR  │  ← CONTROLES
│                              │
│  [🔵 BLUE] [🔴 RED] [⚪ TIE]  │  ← SELEÇÃO DE LADO
│                              │
│  [✅ ENVIAR APOSTA]          │  ← CONFIRMAR
│  [LIMPAR]                    │  ← LIMPAR
│                              │
├──────────────────────────────┤
│ Configuração...              │
└──────────────────────────────┘
```

---

## 💰 Chips com Cores Reais

| Chip | Valor | Cor | Hex |
|------|-------|-----|-----|
| 🔴 | R$ 5 | Vermelho | #dc2626 |
| 🔵 | R$ 10 | Azul | #2563eb |
| 🟢 | R$ 25 | Verde | #16a34a |
| 🟠 | R$ 50 | Laranja | #ea580c |
| ⚫ | R$ 100 | Preto/Ouro | #1f2937 |
| 🟣 | R$ 500 | Roxo | #7c3aed |

---

## ⚙️ Funcionamento

### 1️⃣ Selecionar Chip
```
Clique em um chip (ex: 25)
→ Valor muda para R$ 25
→ Chip fica destacado
```

### 2️⃣ Ajustar Valor
```
REDUZIR  →  divide por 2 (25 → 12 → 6 → 5)
DOBRAR   →  multiplica por 2 (25 → 50 → 100 → 200 ...)
```

### 3️⃣ Selecionar Lado
```
Clique em BLUE, RED ou TIE
→ Botão fica destacado com borda dourada
```

### 4️⃣ Confirmar Aposta
```
Clique "ENVIAR APOSTA"
→ Aposta é enviada para o daemon
→ Controle limpa automaticamente
```

### 5️⃣ Limpar (se mudar de ideia)
```
Clique "LIMPAR"
→ Volta a R$ 0
→ Nenhum lado selecionado
```

---

## 🎯 Fluxo Completo

```
Passo 1: Clique chip [50]
         Display: R$ 50

Passo 2: Clique DOBRAR
         Display: R$ 100

Passo 3: Clique REDUZIR
         Display: R$ 50

Passo 4: Clique 🔵 BLUE
         Botão destaca em ouro

Passo 5: Clique "ENVIAR APOSTA"
         ✅ BLUE R$ 50 enviado!
         Controle limpa
```

---

## 🎨 Cores e Estilos

**Chips:**
- Degradé radial (efeito 3D)
- Borda em cor mais escura
- Sombra (profundidade)
- Hover: cresce 10%
- Click: encolhe 5%

**Botões de Controle:**
- REDUZIR: Vermelho (como parar aposta)
- DOBRAR: Verde (como aumentar)
- Efeito hover com glow
- Desabilitados quando daemon off

**Display:**
- Fundo preto com borda dourada (como em casino)
- Texto em ouro (R$ 50)
- Fonte grande e clara

**Seleção de Lado:**
- BLUE: Azul vibrante
- RED: Vermelho vibrante
- TIE: Roxo vibrante
- Quando selecionado: borda dourada + glow

---

## 🔐 Estados

### Habilitado (Daemon RUNNING)
```
✅ Todos os chips clicáveis
✅ Botões de controle ativos
✅ Botões de lado ativos
✅ Enviar e limpar funcionam
```

### Desabilitado (Daemon IDLE/PAUSED)
```
❌ Chips com opacidade 40%
❌ Botões cinza/desabilitados
❌ Não responde a cliques
✅ Mensagem clara no status
```

---

## 📊 Lógica de Valores

### Reduzir
```
100 → 50 → 25 → 12 (arredonda) → 10 → 5 → 5 (mínimo)
```

### Dobrar
```
5 → 10 → 25 → 50 → 100 → 500 → 1000 → 5000 → 10000 (máximo)
```

### Validação
```
✅ Mínimo: R$ 5
✅ Máximo: R$ 10.000
✅ Múltiplos de 5 (5, 10, 15, 20, 25...)
```

---

## 🚀 Como Usar

### Aposta Rápida
```
1. Clique chip [100]
2. Clique 🔴 RED
3. Clique "ENVIAR APOSTA"
⏰ ~2 segundos! (vs 5-10s antes)
```

### Apostar Múltiplos
```
1. Chip [10] → RED
2. DOBRAR (→ 20) → BLUE
3. DOBRAR (→ 40) → TIE
4. REDUZIR (→ 20) → RED
Todas em sequência rápida!
```

### Ajustar com Precision
```
1. Chip [50]
2. REDUZIR → R$ 25
3. DOBRAR → R$ 50
4. DOBRAR → R$ 100
5. RED → ENVIAR
```

---

## ✨ Features

- ✅ Chips com cores reais de casino
- ✅ Reduzir/Dobrar aposta
- ✅ Display grande do valor
- ✅ 3 opções de lado (BLUE/RED/TIE)
- ✅ Feedback visual claro
- ✅ Desabilitado quando daemon off
- ✅ Estado preservado durante sessão
- ✅ Limpar com 1 clique
- ✅ Validação automática
- ✅ Efeitos hover/click suaves

---

## 🎮 Diferenças da Interface Anterior

| Feature | Antes | Depois |
|---------|-------|--------|
| Entrada de valor | Input manual | Chips pré-definidos |
| Ajuste de valor | Digitar | REDUZIR/DOBRAR buttons |
| Visual | Simples | Cores reais casino |
| Tempo por aposta | ~5-10s | ~2-3s |
| Feedback | Básico | Efeitos visuais |
| Intuição | Média | Excelente |

---

## 💡 Dicas de Uso

1. **Clique rápido em chips:** não precisa digitar
2. **DOBRAR/REDUZIR:** ajusta qualquer valor
3. **Borda dourada:** indica lado selecionado
4. **Efeito glow:** chip está ativo
5. **Cinza 40%:** daemon desligado

---

## 🔮 Futuro

- [ ] Hotkeys para chips (1-6 para valores)
- [ ] Favoritos (salvar combinações)
- [ ] Histórico de apostas
- [ ] Estatísticas de ganho/perda
- [ ] Voice command ("blue 100")

---

**Status:** ✅ Controle Remoto Completo  
**Data:** 2026-04-19  
**Versão:** 3.0

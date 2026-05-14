# BetBoom Auto Pattern — Extensão Will Dados Pro

**Versão**: 2.3.1  
**Data**: 2026-05-13  
**Status**: POC Funcional com 18 Padrões WMSG

## 📋 Descrição

Extensão Chrome MV3 que automatiza detecção e execução de padrões visuais no Bac Bo (BetBoom/Evolution) baseado na estratégia do Will Dados Pro.

Implementa **18 padrões WMSG** (sequências exatas) com matching em:
- ✅ Sequência (últimas 4 casas sequenciais)
- ✅ Linha (qualquer uma das 6 linhas do tabuleiro)
- ✅ Diagonal (diagonal ↘ e ↙)

## 🎯 18 Padrões WMSG

| ID | Sequência | Entrada | Descrição |
|---|---|---|---|
| WMSG-001 | [A,A,A,V] | FORA | 3 azuis e 1 vermelho |
| WMSG-002 | [V,V,V,A] | CASA | 3 vermelhos e 1 azul |
| WMSG-003 | [A,V,A,V] | CASA | Zigue-zague terminando em V |
| WMSG-004 | [V,A,V,A] | FORA | Zigue-zague terminando em A |
| WMSG-005 | [A,A,V,V] | CASA | Espelho: 2 azuis e 2 vermelhos |
| WMSG-006 | [V,V,A,A] | FORA | Espelho: 2 vermelhos e 2 azuis |
| WMSG-007 | [A,A,V,A] | FORA | AABA — quebra com vermelho |
| WMSG-008 | [V,V,A,V] | CASA | VVAV — quebra com azul |
| WMSG-009 | [A,V,V,A] | FORA | AVVA — sanduiche |
| WMSG-010 | [V,A,A,V] | CASA | VAAV — sanduiche |
| WMSG-011 | [A,V,V,V] | CASA | Após 3 V seguidos |
| WMSG-012 | [V,A,A,A] | FORA | Após 3 A seguidos |
| WMSG-013 | [E,A,A,A] | FORA | Empate + 3 azuis |
| WMSG-014 | [E,V,V,V] | CASA | Empate + 3 vermelhos |
| WMSG-015 | [A,E,A,A] | FORA | Empate entre azuis |
| WMSG-016 | [V,E,V,V] | CASA | Empate entre vermelhos |
| WMSG-017 | [A,A,E,A] | FORA | 3 azuis com empate |
| WMSG-018 | [V,V,E,V] | CASA | 3 vermelhos com empate |

## 🔧 Instalação

### 1. Baixar e extrair a extensão
```bash
unzip betboom-extension-v2.3.1.zip
cd betboom-extension-v2.3.1
```

### 2. Carregar em Chrome
1. Abrir `chrome://extensions/`
2. Ativar "Modo de desenvolvedor" (canto superior direito)
3. Clicar em "Carregar extensão não compactada"
4. Selecionar a pasta da extensão

## 📊 Arquitetura

### Fluxo de Execução
```
1. COLLECTOR (lê mesa via DOM)
   ↓
2. PATTERN ENGINE (detecta padrões WMSG)
   ├─ Sequencial (85%)
   ├─ Linha (82%)
   └─ Diagonal (79%)
   ↓
3. DECISION MODEL (aplica F1 Score)
   ↓
4. EXECUTOR (executa click real)
   ↓
5. CONFIRMATION (valida aposta)
   ↓
6. BANKROLL MANAGER (gale/reset/stop win/loss)
```

### Módulos Principais

| Arquivo | Responsabilidade |
|---------|------------------|
| `patterns.js` | 18 WMSG + matching sequencial/linha/diagonal |
| `decision.js` | FSM (OFF→OBSERVING→SIGNAL_FOUND→EXECUTE→CONFIRM) |
| `executor.js` | Click real + confirmação |
| `chip-detector.js` | Detecção de fichas no DOM |
| `safety-governance.js` | Circuit breaker + rate limiting |
| `f1-scorer.js` | Confiança da decisão |
| `overlay.js` | UI: sidebar + tabuleiro visual |

## 🚀 Uso

1. **Ligar extensão**: Clique no ícone → "Ligar"
2. **Configurar**: Ajuste Stake, Gale, Empate, Stop Win/Loss
3. **Monitorar**: Tabuleiro visual mostra padrões detectados
4. **Automático**: Robô entra automaticamente quando padrão casa

## ⚙️ Configuração

### Bankroll Management
- **Stake Base**: Valor inicial por aposta (padrão: 5.00)
- **Gale**: Martingale — dobra após loss
- **Stop Win**: Para quando lucro ≥ limite
- **Stop Loss**: Para quando perda ≥ limite

### Padrões Dinâmicos
Adicione suas próprias estratégias via painel:
- Sequência customizada (ex: [A,V,A,V])
- Casa/Fora
- Limite de Gale
- Proteção Empate

## 🧪 Testes

Abrir `test-wmsg-patterns.html` em navegador:
- Valida carregamento dos 18 padrões
- Testa matching em 5 sequências
- Verifica confiança e ação esperada

## 📝 Logs

Console mostra:
- `[PatternEngine]` → Padrões detectados
- `[Executor]` → Click confirmado
- `[Safety]` → Estado do sistema
- `[F1Scorer]` → Confiança da decisão

## ⚠️ Limitações Conhecidas

1. **Jogo em iframe**: Requer content_script em all_frames
2. **Cross-origin**: Evolution games podem ter restrições CORS
3. **Sincronização**: Latência de rede pode afetar timing
4. **Visual**: Padrão diagonal requer 6 linhas × 4+ colunas

## 🔐 Segurança

- ✅ Sem dados sensíveis transmitidos
- ✅ Apenas automação de click DOM
- ✅ Circuit breaker contra falhas
- ✅ Validação de aposta antes execute
- ✅ Event Store para auditoria

## 📞 Suporte

- Logs detalhados em DevTools → Console
- Teste manual com `test-wmsg-patterns.html`
- Verifique manifest.json para permissions

---

**Desenvolvido com**: Chrome MV3, JavaScript vanilla, sem dependências externas

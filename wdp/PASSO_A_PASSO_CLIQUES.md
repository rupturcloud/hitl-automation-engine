# 🔧 Passo a Passo - Consertar Cliques em Player/Banker/Tie

## Problema
Quando você clica em Player, Banker ou Tie no painel, nada acontece na mesa de aposta.

## Solução - 3 Passos Simples

### PASSO 1: Abrir Console do Navegador

1. Vá para **https://betboom.bet.br** (ou qualquer mesa de Bac Bo)
2. Pressione **F12** (ou Cmd+Option+J no Mac)
3. Clique na aba **Console** (lado direito)

---

### PASSO 2: Descobrir a Estrutura de Clique

1. No console, **copie e cole** isto inteiro:

```javascript
window.Calibrador = (function() {
  let clicksRegistrados = [];
  let monitorAtivo = false;

  function descobrir() {
    console.log('=== CALIBRADOR DE CLIQUES ===\n');

    const allButtons = document.querySelectorAll('button, [role="button"], [onclick], [class*="bet" i], [class*="player" i], [class*="banker" i], [class*="tie" i]');
    console.log(`✓ Encontrado ${allButtons.length} elementos clicáveis`);

    console.log('\nBuscando seletores conhecidos...\n');

    const selectors = {
      'data-bet="player"': document.querySelector('[data-bet="player"]'),
      'data-bet="banker"': document.querySelector('[data-bet="banker"]'),
      'data-bet="tie"': document.querySelector('[data-bet="tie"]'),
      '[class*="player" i]': document.querySelector('[class*="player" i]'),
      '[class*="banker" i]': document.querySelector('[class*="banker" i]'),
      '[class*="tie" i]': document.querySelector('[class*="tie" i]'),
    };

    for (const [seletor, el] of Object.entries(selectors)) {
      if (el) {
        console.log(`✓ ${seletor}`);
        console.log(`  → <${el.tagName} class="${el.className}">`);
      }
    }

    console.log('\n\nAgora clique em Player, Banker e Tie abaixo...');

    iniciarMonitor();
  }

  function iniciarMonitor() {
    if (monitorAtivo) return;
    monitorAtivo = true;
    clicksRegistrados = [];

    document.addEventListener('click', function capturar(e) {
      const target = e.target;
      const closest = e.target.closest('button, [role="button"]');
      const el = closest || target;

      const info = {
        textContent: (el.textContent || '').substring(0, 30),
        tagName: el.tagName,
        className: el.className,
        dataBet: el.getAttribute('data-bet') || 'N/A',
        ariaaLabel: el.getAttribute('aria-label') || 'N/A',
      };

      clicksRegistrados.push(info);

      const num = clicksRegistrados.length;
      console.log(`\n[CLIQUE ${num}] ${info.textContent}`);
      console.log(`  - Tag: ${info.tagName}`);
      console.log(`  - Class: ${info.className}`);
      console.log(`  - data-bet: ${info.dataBet}`);
    }, true);

    console.log('✓ Monitor ativo!\n');
  }

  function relatorio() {
    console.log('\n=== RELATORIO ===\n');
    console.log(`Total de cliques: ${clicksRegistrados.length}\n`);

    clicksRegistrados.forEach((info, i) => {
      console.log(`[${i + 1}] ${info.textContent}`);
      console.log(`    data-bet: ${info.dataBet}`);
      console.log(`    class: ${info.className}\n`);
    });

    console.log('=== ANALISE ===\n');
    const temDataBet = clicksRegistrados.every(c => c.dataBet !== 'N/A');
    const temClasse = clicksRegistrados.every(c => c.className);
    
    console.log(temDataBet ? '✓ Todos têm data-bet' : '✗ Falta data-bet em alguns');
    console.log(temClasse ? '✓ Todos têm classe' : '✗ Falta classe em alguns');
  }

  return { descobrir, relatorio, cliques: () => clicksRegistrados };
})();

Calibrador.descobrir();
```

2. Pressione **Enter**

---

### PASSO 3: Clicar nos Botões

1. Na página de aposta (Betboom), clique em **Player**
2. Clique em **Banker**
3. Clique em **Tie**

Você verá logs no console para cada clique.

---

### PASSO 4: Ver o Relatório

No console, digite:

```javascript
Calibrador.relatorio()
```

Pressione **Enter**.

Você verá algo como:

```
=== RELATORIO ===

Total de cliques: 3

[1] Player
    data-bet: player
    class: bet-spot-player

[2] Banker
    data-bet: banker
    class: bet-spot-banker

[3] Tie
    data-bet: tie
    class: bet-spot-tie

=== ANALISE ===

✓ Todos têm data-bet
✓ Todos têm classe
```

---

### PASSO 5: Me Enviar o Relatório

**Copie e me envie a saída completa do Calibrador.relatorio()!**

Preciso de:
- Quantos cliques registrou
- Qual é o `data-bet` de cada um
- Qual é a `class` de cada um
- Se aparece "✓ Todos têm data-bet" ou não

---

## Exemplos de Possíveis Resultados

### Cenário 1: Perfeito (com data-bet)
```
[1] Player
    data-bet: player
    class: betting-area-player

✓ Todos têm data-bet
✓ Todos têm classe
```
→ **Solução**: Usar `[data-bet="player"]`

### Cenário 2: Sem data-bet (só classe)
```
[1] Player
    data-bet: N/A
    class: player-betting-zone

✗ Falta data-bet em alguns
✓ Todos têm classe
```
→ **Solução**: Usar `[class*="player"]`

### Cenário 3: Diferente
```
[1] Player
    data-bet: N/A
    class: area-player
    aria-label: Aposte em Player

[2] Banker
    data-bet: N/A
    class: area-banker
    aria-label: Aposte em Banker
```
→ **Solução**: Usar `[aria-label*="Aposte"]`

---

## Se Não Conseguir Clicar no Betboom

Se ao clicar em Player/Banker/Tie nada acontece nem no console:

1. Verifique se está em uma página de **mesa viva** (não em histórico)
2. Tente clicar em um **chip** primeiro (para ver se elementos clicáveis funcionam)
3. Se nada funcionar, o Betboom pode estar bloqueando cliques de extensão

---

## Próximas Ações Após Enviar

Quando você me enviar o relatório, vou:
1. Ver qual seletor funciona
2. Atualizar `realizarAposta.js` com os seletores corretos
3. Testar de novo

**Envie o relatório agora!**

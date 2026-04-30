# 🎯 O QUE FAZER AGORA

## Problema
Cliques em Player/Banker/Tie não funcionam. Preciso descobrir por que.

## Solução em 5 Minutos

### 1. Abra o Betboom
```
https://betboom.bet.br
```
Ou qualquer outro site com mesa viva de Bac Bo (Evolution, etc)

### 2. Pressione F12
Abre o Developer Tools. Clique na aba **Console**.

### 3. Copie e Cole Isto

Cole **tudo isso** no console de uma vez:

```javascript
window.Calibrador = (function() {
  let clicksRegistrados = [];
  let monitorAtivo = false;

  function descobrir() {
    console.log('=== CALIBRADOR DE CLIQUES ===\n');
    const allButtons = document.querySelectorAll('button, [role="button"], [onclick], [class*="bet" i], [class*="player" i], [class*="banker" i], [class*="tie" i]');
    console.log(`✓ Encontrado ${allButtons.length} elementos clicáveis`);
    console.log('\nBuscando seletores...\n');
    const selectors = {
      '[data-bet="player"]': document.querySelector('[data-bet="player"]'),
      '[data-bet="banker"]': document.querySelector('[data-bet="banker"]'),
      '[data-bet="tie"]': document.querySelector('[data-bet="tie"]'),
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
      };
      clicksRegistrados.push(info);
      console.log(`\n[CLIQUE ${clicksRegistrados.length}] ${info.textContent}`);
      console.log(`  data-bet: ${info.dataBet}`);
      console.log(`  class: ${info.className}`);
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
    const temDataBet = clicksRegistrados.every(c => c.dataBet !== 'N/A');
    console.log(temDataBet ? '✓ Todos têm data-bet' : '✗ Falta data-bet');
  }

  return { descobrir, relatorio, cliques: () => clicksRegistrados };
})();

Calibrador.descobrir();
```

### 4. Clique nos Botões
Na mesa de aposta do Betboom, clique em:
- **Player** (uma vez)
- **Banker** (uma vez)
- **Tie** (uma vez)

Você verá logs no console para cada clique.

### 5. Gere o Relatório
No console, digite:
```javascript
Calibrador.relatorio()
```

Pressione Enter.

### 6. Copie a Saída Inteira e Me Envie
Selecione toda a saída do console (Ctrl+A), copie e envie.

---

## O Que Vou Receber

Algo como:

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

✓ Todos têm data-bet
```

---

## Depois Que Você Enviar

Com essa informação, vou:
1. Saber qual é a estrutura HTML do Betboom
2. Corrigir `realizarAposta.js` com os seletores certos
3. Testar novamente

---

## Dúvidas?

Se não conseguir clicar:
1. Verifique se está em uma **mesa viva** (não no histórico)
2. Verifique se está em uma **página de aposta** (com Player/Banker/Tie visíveis)
3. Tente clicar em um **chip** para ver se cliques funcionam

---

**AÇÃO IMEDIATA**: Abra o Betboom, cole o código e clique nos botões! 🎯

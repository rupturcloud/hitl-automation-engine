# 🎯 Diagnóstico de Cliques - Player/Banker/Tie

## Teste 1: Encontrar elementos de aposta

Abra F12 → Console e execute:

```javascript
console.log('=== DIAGNOSTICO DE CLIQUES ===\n');

// Procura por elementos que possam ser Player/Banker/Tie
const selectors = [
  '[data-bet="player"]',
  '[data-bet="banker"]',
  '[data-bet="tie"]',
  '[class*="player" i]',
  '[class*="banker" i]',
  '[class*="tie" i]',
  '[aria-label*="player" i]',
  '[aria-label*="banker" i]',
  '[aria-label*="tie" i]',
  'button',
  '[role="button"]'
];

console.log('Procurando por seletores...\n');

for (const sel of selectors) {
  const els = document.querySelectorAll(sel);
  if (els.length > 0) {
    console.log(`✓ ${sel}: ${els.length} elementos`);
    // Mostra o primeiro
    const first = els[0];
    console.log(`  Exemplo: <${first.tagName} class="${first.className}" id="${first.id}" data-bet="${first.getAttribute('data-bet')}">`);
    console.log(`  Text: "${first.textContent?.substring(0, 40)}"`);
    console.log(`  Visible: ${first.offsetParent !== null}`);
  }
}
```

**Esperado**: Encontra elementos com classes ou data-attributes que indicam Player/Banker/Tie

---

## Teste 2: Procura específica por termos

```javascript
console.log('\n=== PROCURA POR TERMOS ===\n');

const terms = {
  player: ['player', 'jogador', 'azul', 'blue'],
  banker: ['banker', 'banca', 'vermelho', 'red'],
  tie: ['tie', 'empate', 'amarelo', 'yellow', 'gold']
};

for (const [acao, keywords] of Object.entries(terms)) {
  console.log(`\n${acao.toUpperCase()}:`);
  
  // Procura por button/role=button que contenham os termos
  const allElements = document.querySelectorAll('button, [role="button"]');
  const matches = Array.from(allElements).filter(el => {
    const text = `${el.textContent || ''} ${el.className || ''} ${el.getAttribute('aria-label') || ''}`.toLowerCase();
    return keywords.some(k => text.includes(k));
  });
  
  if (matches.length > 0) {
    console.log(`  ✓ Encontrou ${matches.length} elementos`);
    matches.slice(0, 3).forEach((el, i) => {
      console.log(`    [${i}] ${el.tagName} "${el.textContent?.substring(0, 30)}" class="${el.className}"`);
    });
  } else {
    console.log(`  ✗ Nenhum elemento encontrado`);
  }
}
```

**Esperado**: Encontra elementos para player, banker e tie

---

## Teste 3: Clicar manualmente em um elemento

```javascript
console.log('\n=== TESTE DE CLIQUE MANUAL ===\n');

// Encontrar um elemento de Player
const playerEl = document.querySelector('[class*="player" i]') || 
                 Array.from(document.querySelectorAll('button, [role="button"]'))
                   .find(el => el.textContent?.toLowerCase().includes('player'));

if (playerEl) {
  console.log('✓ Elemento Player encontrado:', playerEl.className);
  console.log('Clicando...');
  
  // Fazer clique simples
  playerEl.click();
  console.log('✓ Clique executado');
  
  // Verificar se houve efeito visual
  setTimeout(() => {
    const hasSelection = playerEl.classList.contains('selected') || 
                        playerEl.classList.contains('active') ||
                        playerEl.style.backgroundColor !== '';
    console.log('Elemento tem seleção visual?', hasSelection);
  }, 500);
} else {
  console.log('✗ Elemento Player não encontrado');
}
```

---

## Teste 4: Simular clique humanizado

```javascript
console.log('\n=== TESTE DE CLIQUE HUMANIZADO ===\n');

async function testHumanClick() {
  // Encontrar elemento Player
  const playerEl = document.querySelector('[class*="player" i]') || 
                   Array.from(document.querySelectorAll('button, [role="button"]'))
                     .find(el => el.textContent?.toLowerCase().includes('player'));

  if (!playerEl) {
    console.log('✗ Elemento não encontrado');
    return;
  }

  console.log('✓ Testando clique humanizado...');
  
  const rect = playerEl.getBoundingClientRect();
  const x = Math.round(rect.left + rect.width / 2);
  const y = Math.round(rect.top + rect.height / 2);

  console.log(`Alvo: (${x}, ${y}) - ${playerEl.className}`);

  // Simular eventos
  const opts = {
    bubbles: true,
    cancelable: true,
    view: window,
    clientX: x,
    clientY: y
  };

  playerEl.dispatchEvent(new PointerEvent('pointermove', opts));
  await new Promise(r => setTimeout(r, 50));
  
  playerEl.dispatchEvent(new PointerEvent('pointerdown', { ...opts, button: 0, buttons: 1 }));
  await new Promise(r => setTimeout(r, 100));
  
  playerEl.dispatchEvent(new PointerEvent('pointerup', { ...opts, button: 0, buttons: 0 }));
  playerEl.dispatchEvent(new MouseEvent('click', opts));

  console.log('✓ Clique humanizado executado');

  // Verificar resposta
  setTimeout(() => {
    console.log('Verificar se Player está selecionado...');
  }, 300);
}

testHumanClick();
```

---

## Teste 5: Verificar o que está no painel de aposta

```javascript
console.log('\n=== CONTEUDO DO PAINEL DE APOSTA ===\n');

// Procura por elementos que pareçam ser a mesa de aposta
const possibleBettingAreas = document.querySelectorAll(
  '[class*="bet" i], [class*="area" i], [class*="table" i], [class*="board" i]'
);

console.log(`Encontrou ${possibleBettingAreas.length} áreas potenciais`);

possibleBettingAreas.forEach((area, i) => {
  if (area.offsetParent !== null) { // Visível
    console.log(`\n[${i}] Área visível:`);
    console.log(`  Tag: <${area.tagName.toLowerCase()}>`);
    console.log(`  Class: "${area.className}"`);
    console.log(`  Size: ${Math.round(area.offsetWidth)}x${Math.round(area.offsetHeight)}px`);
    
    // Procura por botões dentro desta área
    const buttons = area.querySelectorAll('button, [role="button"]');
    console.log(`  Botões dentro: ${buttons.length}`);
    buttons.forEach((btn, j) => {
      if (j < 3) {
        console.log(`    [${j}] "${btn.textContent?.substring(0, 20)}" - class="${btn.className}"`);
      }
    });
  }
});
```

---

## Teste 6: Verificar eventos sendo disparados

```javascript
console.log('\n=== MONITORAR EVENTOS DE CLIQUE ===\n');

let clickCount = 0;

document.addEventListener('click', (e) => {
  clickCount++;
  const target = e.target;
  const className = target.className || 'sem classe';
  const text = target.textContent?.substring(0, 30) || 'sem texto';
  
  console.log(`[${clickCount}] Clique em: <${target.tagName}> "${text}" class="${className}"`);
}, true); // Captura na fase true para pegar todos os cliques

console.log('✓ Monitor ativado. Clique em Player/Banker/Tie e veja o log...');
console.log('(Será logado cada clique detectado)');
```

---

## Resultado Esperado

Se tudo funcionar:
- **Teste 1**: Encontra elementos com classes ou data-attributes
- **Teste 2**: Encontra elementos que contêm termos "player", "banker", "tie"
- **Teste 3**: Clique simples é executado e elemento muda de aparência
- **Teste 4**: Clique humanizado é executado sem erros
- **Teste 5**: Mostra a estrutura do painel de aposta
- **Teste 6**: Logs aparecem quando você clica

---

## Se Falhar

### Se não encontra elementos:
1. A página do Betboom pode ter estrutura diferente
2. Os elementos podem estar em um iframe (verificar content.js)
3. Os elementos podem estar sendo renderizados dinamicamente

### Se encontra mas clique não funciona:
1. O Betboom pode estar ignorando eventos `dispatchEvent`
2. O Betboom pode exigir `isTrusted: true` (eventos do usuário)
3. Os eventos podem estar sendo bloqueados por event listeners

### Solução para isTrusted:
Se o Betboom exige `isTrusted: true`:
- Usar Selenium para clicar (precisa rodar `selenium_driver.py`)
- Usar CDP (Chrome DevTools Protocol) para clicar
- Usar outro método de simulação

---

## Próximas Ações

1. Execute Teste 1-6 e copie toda a saída
2. Me avise se encontra os elementos
3. Me avise se os cliques funcionam
4. Se não funcionar, vamos investigar a estrutura da página

**Cole a saída completa dos testes acima!**

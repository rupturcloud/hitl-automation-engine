/**
 * CALIBRADOR_CLIQUES.js
 *
 * Cole isto no console do navegador para descobrir e calibrar os seletores de clique.
 *
 * Uso:
 * 1. Abra F12 → Console
 * 2. Cole este arquivo inteiro
 * 3. Execute: Calibrador.descobrir()
 * 4. Clique em Player, Banker, Tie
 * 5. Execute: Calibrador.relatorio()
 */

window.Calibrador = (function() {
  let clicksRegistrados = [];
  let monitorAtivo = false;

  function descobrir() {
    console.log('=== CALIBRADOR DE CLIQUES ===\n');

    // 1. Procura todo tipo de elemento
    console.log('PASSO 1: Procurando todos os botões e áreas clicáveis...\n');

    const allButtons = document.querySelectorAll('button, [role="button"], [onclick], [class*="bet" i], [class*="player" i], [class*="banker" i], [class*="tie" i]');
    console.log(`✓ Encontrado ${allButtons.length} elementos clicáveis`);

    // 2. Procura por elementos específicos
    console.log('\nPASSO 2: Procurando seletores conhecidos...\n');

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

    // 3. Procura por texto que contenha os termos
    console.log('\nPASSO 3: Procurando por texto contendo "player", "banker", "tie"...\n');

    const allElements = document.querySelectorAll('*');
    const playerEls = [];
    const bankerEls = [];
    const tieEls = [];

    for (const el of allElements) {
      const text = (el.textContent || '').toLowerCase();
      const aria = (el.getAttribute('aria-label') || '').toLowerCase();
      const clase = (el.className || '').toLowerCase();
      const haystack = text + aria + clase;

      if (haystack.includes('player') && el.offsetParent !== null) playerEls.push(el);
      if (haystack.includes('banker') && el.offsetParent !== null) bankerEls.push(el);
      if (haystack.includes('tie') && el.offsetParent !== null) tieEls.push(el);
    }

    console.log(`Player elements: ${playerEls.length}`);
    if (playerEls[0]) console.log(`  Exemplo: <${playerEls[0].tagName} class="${playerEls[0].className}">`);

    console.log(`Banker elements: ${bankerEls.length}`);
    if (bankerEls[0]) console.log(`  Exemplo: <${bankerEls[0].tagName} class="${bankerEls[0].className}">`);

    console.log(`Tie elements: ${tieEls.length}`);
    if (tieEls[0]) console.log(`  Exemplo: <${tieEls[0].tagName} class="${tieEls[0].className}">`);

    // 4. Inicia monitor de cliques
    console.log('\n\nPASSO 4: Iniciando monitor de cliques...');
    console.log('Clique em Player, Banker e Tie abaixo. Vamos registrar os elementos.\n');

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
        timestamp: new Date().toLocaleTimeString(),
        tagName: el.tagName,
        className: el.className || '(sem classe)',
        id: el.id || '(sem id)',
        textContent: (el.textContent || '(sem texto)').substring(0, 50),
        ariaaLabel: el.getAttribute('aria-label') || '(sem aria-label)',
        dataBet: el.getAttribute('data-bet') || '(sem data-bet)',
        selector: gerarSelector(el),
      };

      clicksRegistrados.push(info);

      const num = clicksRegistrados.length;
      console.log(`[CLIQUE ${num}] ${info.textContent}`);
      console.log(`  Selector: ${info.selector}`);
    }, true);

    console.log('✓ Monitor ativo. Clique em Player, Banker, Tie agora!');
  }

  function gerarSelector(el) {
    // Tentar gerar um seletor único
    if (el.id) return `#${el.id}`;
    if (el.className) return `.${el.className.split(' ')[0]}`;
    if (el.getAttribute('data-bet')) return `[data-bet="${el.getAttribute('data-bet')}"]`;
    if (el.getAttribute('aria-label')) return `[aria-label="${el.getAttribute('aria-label')}"]`;
    return `<${el.tagName}>`;
  }

  function relatorio() {
    console.log('\n=== RELATORIO DE CLIQUES CAPTURADOS ===\n');

    if (clicksRegistrados.length === 0) {
      console.log('Nenhum clique registrado. Clique em Player/Banker/Tie primeiro!');
      return;
    }

    clicksRegistrados.forEach((info, i) => {
      console.log(`\n[${i + 1}] ${info.timestamp}`);
      console.log(`  Texto: "${info.textContent}"`);
      console.log(`  Tag: ${info.tagName}`);
      console.log(`  Class: "${info.className}"`);
      console.log(`  ID: "${info.id}"`);
      console.log(`  data-bet: "${info.dataBet}"`);
      console.log(`  aria-label: "${info.ariaaLabel}"`);
      console.log(`  Seletor sugerido: ${info.selector}`);
    });

    // Análise de padrões
    console.log('\n=== ANALISE ===\n');

    const patterns = {
      'Todos têm data-bet?': clicksRegistrados.every(c => c.dataBet !== '(sem data-bet)'),
      'Todos têm classe?': clicksRegistrados.every(c => c.className !== '(sem classe)'),
      'Todos têm aria-label?': clicksRegistrados.every(c => c.ariaaLabel !== '(sem aria-label)'),
      'Mesmo tagName?': new Set(clicksRegistrados.map(c => c.tagName)).size === 1,
    };

    for (const [padrão, resultado] of Object.entries(patterns)) {
      console.log(`${resultado ? '✓' : '✗'} ${padrão}`);
    }

    // Sugestões de seletor
    console.log('\n=== SELETORES RECOMENDADOS ===\n');

    if (patterns['Todos têm data-bet?']) {
      console.log('Usar: [data-bet="player"], [data-bet="banker"], [data-bet="tie"]');
    } else if (patterns['Todos têm aria-label?']) {
      console.log('Usar: [aria-label*="player"], [aria-label*="banker"], [aria-label*="tie"]');
    } else if (patterns['Todos têm classe?']) {
      console.log('Usar: [class*="player"], [class*="banker"], [class*="tie"]');
    } else {
      console.log('Estrutura varia. Usar combinação de seletores.');
    }

    // Exportar para atualizar realizarAposta.js
    console.log('\n=== COPIAR PARA REALIZARAPOSTA.JS ===\n');
    console.log('Cliques capturados:');
    console.log(JSON.stringify(clicksRegistrados, null, 2));
  }

  function parar() {
    monitorAtivo = false;
    console.log('Monitor parado.');
  }

  return {
    descobrir,
    relatorio,
    parar,
    cliques: () => clicksRegistrados
  };
})();

console.log(`
╔════════════════════════════════════════╗
║  CALIBRADOR DE CLIQUES - BETBOOM      ║
╚════════════════════════════════════════╝

INSTRUÇÕES:
1. Execute: Calibrador.descobrir()
2. Clique em Player, Banker, Tie
3. Execute: Calibrador.relatorio()

COMANDOS:
- Calibrador.descobrir()      → Iniciar descoberta
- Calibrador.relatorio()      → Ver análise dos cliques
- Calibrador.parar()          → Parar de monitorar
- Calibrador.cliques()        → Ver cliques brutos
`);

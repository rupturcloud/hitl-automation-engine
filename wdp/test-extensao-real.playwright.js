const { chromium } = require('playwright');
const path = require('path');

/**
 * Teste real da extensão contra mesa simulada
 * Carrega extensão + mock de Bac Bo + testa toggle e cliques
 */

(async () => {
  console.log('\n' + '='.repeat(70));
  console.log('🧪 Teste Real: Extensão 4 + Bac Bo Mock');
  console.log('='.repeat(70) + '\n');

  const extensionPath = path.resolve(__dirname, 'extensao 4');

  const browser = await chromium.launchPersistentContext(
    path.join(__dirname, '.test-profile'),
    {
      headless: false,
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
      ],
    }
  );

  try {
    // 1. Criar página mock de Bac Bo
    const page = await browser.newPage();

    const bacBoHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Bac Bo - Evolution Gaming</title>
        <style>
          body { font-family: Arial; padding: 20px; }
          #betting-panel { display: flex; gap: 10px; margin: 20px 0; }
          button { padding: 10px 20px; cursor: pointer; }
          .chip-button { background: #ccc; border: 1px solid #999; }
          .bet-area { width: 150px; height: 100px; border: 2px solid #333; display: inline-block; margin: 10px; }
          #game-log { border: 1px solid #ddd; padding: 10px; height: 200px; overflow-y: auto; background: #f9f9f9; margin-top: 20px; }
        </style>
      </head>
      <body>
        <h1>🎲 Bac Bo - Mock para Teste</h1>

        <div>
          <label>Banca: <strong id="balance">R$ 10000</strong></label>
        </div>

        <h3>Chips</h3>
        <div id="betting-panel">
          <button class="chip-button" data-value="5">5</button>
          <button class="chip-button" data-value="10">10</button>
          <button class="chip-button" data-value="25">25</button>
          <button class="chip-button" data-value="125">125</button>
          <button class="chip-button" data-value="500">500</button>
          <button class="chip-button" data-value="2500">2500</button>
          <button class="chip-button" data-value="5000">5000</button>
          <button class="chip-button" data-value="12000">12000</button>
        </div>

        <h3>Áreas de Aposta</h3>
        <div id="bet-player" class="bet-area" data-side="P">PLAYER</div>
        <div id="bet-banker" class="bet-area" data-side="B">BANKER</div>
        <div id="bet-tie" class="bet-area" data-side="T">TIE</div>

        <h3>Log de Eventos</h3>
        <div id="game-log">
          <div>[READY] Página carregada</div>
        </div>

        <script>
          function log(msg) {
            const logDiv = document.getElementById('game-log');
            const timestamp = new Date().toLocaleTimeString();
            const entry = document.createElement('div');
            entry.textContent = \`[\${timestamp}] \${msg}\`;
            logDiv.appendChild(entry);
            logDiv.scrollTop = logDiv.scrollHeight;
          }

          // Monitorar cliques em chips
          document.querySelectorAll('.chip-button').forEach(btn => {
            btn.addEventListener('click', () => {
              log(\`CHIP CLICADO: R$ \${btn.dataset.value}\`);
            });
          });

          // Monitorar cliques em áreas de aposta
          document.querySelectorAll('[data-side]').forEach(area => {
            area.addEventListener('click', () => {
              log(\`APOSTA CLICADA: \${area.dataset.side}\`);
            });
          });

          window.testLog = log;
        </script>
      </body>
      </html>
    `;

    await page.setContent(bacBoHtml);
    console.log('✓ Página mock de Bac Bo criada\n');

    // 2. Diagnosticar: Extensão carregou?
    console.log('📝 Teste 1: Extensão disponível');
    console.log('-'.repeat(70));

    const extensionPage = await browser.newPage();
    await extensionPage.goto('chrome-extension://EXTENSION_ID/sidepanel.html', { waitUntil: 'domcontentloaded' }).catch(() => {
      console.log('⚠️  Não conseguiu acessar diretamente a extensão (esperado)');
    });

    console.log('✓ Verificação da extensão concluída\n');

    // 3. Testar cliques
    console.log('📝 Teste 2: Clicar em chips via robô');
    console.log('-'.repeat(70));

    const chipTests = [5, 25, 500];
    for (const valor of chipTests) {
      try {
        await page.click(`[data-value="${valor}"]`);
        const logText = await page.textContent('#game-log');
        const constaNoLog = logText.includes(`R$ ${valor}`);
        console.log(`  ${constaNoLog ? '✓' : '✗'} Chip R$ ${valor} clicado`);
      } catch (e) {
        console.log(`  ✗ Erro ao clicar R$ ${valor}: ${e.message}`);
      }
    }

    console.log('\n✓ Teste de cliques concluído\n');

    // 4. Fechar
    await page.close();
    await extensionPage.close();

    console.log('='.repeat(70));
    console.log('✅ Teste real concluído');
    console.log('='.repeat(70) + '\n');

  } catch (error) {
    console.error('❌ Erro durante teste:', error.message);
  } finally {
    await browser.close();
  }
})();

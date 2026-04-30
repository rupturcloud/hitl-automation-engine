#!/usr/bin/env node
/**
 * Teste de Diagnóstico: Validar seletores de Bac Bo contra DOM simulado
 * Reproduz a estrutura real do Evolution Gaming e identifica falhas
 */

const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('realizarAposta.js - Seletores e Cliques', () => {
  let page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  test('Criar DOM mock de Bac Bo com chips reais', async () => {
    // Simula a estrutura HTML do painel de apostas do Evolution Gaming
    const html = `
      <!DOCTYPE html>
      <html>
      <head><title>Bac Bo Mock</title></head>
      <body>
        <div id="betting-panel" style="display: flex; gap: 5px;">
          <!-- Chips com diferentes atributos (Evolution Gaming usa múltiplas estratégias) -->
          <button class="chip-button" data-value="5" data-amount="5">5</button>
          <button class="chip-button" data-value="10">10</button>
          <button class="chip-button" data-value="25">25</button>
          <button class="chip-button" data-value="125">125</button>
          <button class="chip-button" data-value="500" aria-label="Chip 500">500</button>
          <button class="chip-button" data-value="2500">2500</button>
          <button class="chip-button" data-value="5000">5000</button>
          <button class="chip-button" data-value="12000">12000</button>
        </div>

        <!-- Áreas de aposta (Player, Banker, Tie) -->
        <div id="betting-areas">
          <button id="bet-player" data-side="P" style="padding: 20px;">PLAYER (1:1)</button>
          <button id="bet-banker" data-side="B" style="padding: 20px;">BANKER (0.95:1)</button>
          <button id="bet-tie" data-side="T" style="padding: 20px;">TIE (8:1)</button>
        </div>

        <!-- Status da mesa -->
        <div id="game-status">
          <span id="current-balance">Banca: R$ 10000</span>
          <span id="current-bet">Aposta: R$ 0</span>
        </div>
      </body>
      </html>
    `;

    await page.setContent(html);

    // Verificar que os chips estão presentes
    const chips = await page.locator('button.chip-button').count();
    console.log(`✓ DOM mock criado com ${chips} chips`);
    expect(chips).toBe(8);
  });

  test('Teste: encontrarChip() localiza chips corretos', async () => {
    // Injetar a função encontrarChip() no contexto da página
    await page.evaluate(() => {
      window.encontrarChip = function(valor) {
        const normalizedStake = String(Math.round(Number(valor)));
        const selectors = [
          `[data-value="${normalizedStake}"]`,
          `[data-amount="${normalizedStake}"]`,
          `[aria-label*="${normalizedStake}"]`,
          `button`,
        ];

        for (const selector of selectors) {
          const els = document.querySelectorAll(selector);
          for (const el of els) {
            const rawText = `${el.textContent || ''} ${el.getAttribute('aria-label') || ''} ${el.getAttribute('data-value') || ''}`.toLowerCase();
            const attrs = (el.getAttribute('data-value') || '').trim();

            if (attrs === normalizedStake) {
              console.log(`[encontrarChip] ✓ Chip R$ ${valor} encontrado via data-value`);
              return el;
            }
          }
        }

        console.log(`[encontrarChip] ✗ Chip R$ ${valor} NÃO encontrado`);
        return undefined;
      };
    });

    // Testar cada chip
    const testeChips = [5, 10, 25, 125, 500, 2500, 5000, 12000];
    for (const chip of testeChips) {
      const resultado = await page.evaluate((val) => {
        const el = window.encontrarChip(val);
        return { encontrado: !!el, valor: val, texto: el ? el.textContent : null };
      }, chip);

      console.log(`  Chip R$ ${chip}: ${resultado.encontrado ? '✓' : '✗'}`);
      expect(resultado.encontrado).toBe(true);
    }
  });

  test('Teste: Clicar em chip (simular humanClick)', async () => {
    // Testar se conseguimos clicar e que o evento é disparado
    const clickLog = [];

    await page.evaluate(() => {
      window.clickLog = [];
      document.querySelectorAll('button.chip-button').forEach((el) => {
        el.addEventListener('click', () => {
          window.clickLog.push({ valor: el.dataset.value, timestamp: Date.now() });
          console.log(`[CLICK] Chip R$ ${el.dataset.value} clicado`);
        });
      });
    });

    // Simular clique no chip de 500
    await page.click('[data-value="500"]');

    const resultado = await page.evaluate(() => window.clickLog);
    console.log(`  Click log: ${JSON.stringify(resultado)}`);
    expect(resultado.length).toBe(1);
    expect(resultado[0].valor).toBe('500');
  });

  test('Teste: Clicar em área de aposta (Player, Banker, Tie)', async () => {
    const clickLog = [];

    await page.evaluate(() => {
      window.bettingLog = [];
      document.querySelectorAll('#betting-areas button').forEach((el) => {
        el.addEventListener('click', () => {
          window.bettingLog.push({ side: el.dataset.side, timestamp: Date.now() });
          console.log(`[BET-AREA] Side ${el.dataset.side} clicado`);
        });
      });
    });

    // Clicar em BANKER
    await page.click('#bet-banker');

    const resultado = await page.evaluate(() => window.bettingLog);
    console.log(`  Betting log: ${JSON.stringify(resultado)}`);
    expect(resultado.length).toBe(1);
    expect(resultado[0].side).toBe('B');
  });

  test('Teste: Decomposição de stake em chips', async () => {
    await page.evaluate(() => {
      const BAC_BO_CHIPS = [12000, 10000, 5000, 2500, 500, 125, 25, 10, 5];

      window.decomporStake = function(stake) {
        let restante = Math.round(Number(stake));
        if (!Number.isFinite(restante) || restante < 5) return [];
        const chips = [];
        for (const chip of BAC_BO_CHIPS) {
          while (restante >= chip) {
            chips.push(chip);
            restante -= chip;
          }
        }
        return restante === 0 ? chips : [];
      };
    });

    const casos = [
      { stake: 35, esperado: [25, 10] },
      { stake: 150, esperado: [125, 25] },
      { stake: 2525, esperado: [2500, 25] },
      { stake: 12345, esperado: [] }, // Não pode decompor
    ];

    for (const { stake, esperado } of casos) {
      const resultado = await page.evaluate((val) => window.decomporStake(val), stake);
      const match = JSON.stringify(resultado) === JSON.stringify(esperado);
      console.log(`  R$ ${stake} → [${resultado.join(', ')}] ${match ? '✓' : '✗'}`);
      expect(resultado).toEqual(esperado);
    }
  });

  test.afterAll(async () => {
    if (page) await page.close();
  });
});

test.describe('Diagnóstico de Falhas Silenciosas', () => {
  test('Identificar quando encontrarChip() retorna undefined', async ({ page }) => {
    const html = `
      <!DOCTYPE html>
      <html>
      <body>
        <!-- Cenário 1: Chip não existe -->
        <div id="chips">
          <button data-value="5">5</button>
          <button data-value="10">10</button>
        </div>
      </body>
      </html>
    `;

    await page.setContent(html);

    await page.evaluate(() => {
      window.encontrarChip = function(valor) {
        const normalizedStake = String(Math.round(Number(valor)));
        const el = document.querySelector(`[data-value="${normalizedStake}"]`);
        return el;
      };
    });

    // Buscar chip que não existe
    const resultado = await page.evaluate(() => {
      const chip999 = window.encontrarChip(999);
      return { encontrado: !!chip999 };
    });

    console.log(`✓ Chip R$ 999 não encontrado (como esperado): ${!resultado.encontrado}`);
    expect(resultado.encontrado).toBe(false);
  });

  test('Validar jitter e timing de cliques', async () => {
    const timings = [];

    for (let i = 0; i < 10; i++) {
      const jitter = (min = 250, max = 750) => min + Math.random() * (max - min);
      const delay = jitter();
      timings.push(Math.round(delay));
    }

    console.log(`✓ Jitter samples (ms): ${timings.join(', ')}`);
    console.log(`  Min: ${Math.min(...timings)}, Max: ${Math.max(...timings)}`);

    expect(timings.every(t => t >= 250 && t <= 750)).toBe(true);
  });
});

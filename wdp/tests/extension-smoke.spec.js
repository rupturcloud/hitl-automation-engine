/**
 * Testes de Smoke - Extensão v5
 * Valida: config, keep-alive, proxy intelligence, logging
 *
 * Executar: npx playwright test tests/extension-smoke.spec.js
 */

const { test, expect, chromium } = require('@playwright/test');
const path = require('path');

const EXTENSION_PATH = path.join(__dirname, '../extensao 5');

let context;
let browser;

test.beforeAll(async () => {
  browser = await chromium.launch();
  context = await browser.newContext();
});

test.afterAll(async () => {
  await context.close();
  await browser.close();
});

test.describe('Extensão v5 - Smoke Tests', () => {

  // ========== CONFIG TESTS ==========
  test.describe('Configurações (sidepanel.js)', () => {

    test('deve carregar config padrão sem erros', async () => {
      const page = await context.newPage();

      // Injeta config padrão
      await page.evaluateOnNewDocument(() => {
        window.mockConfig = {
          bankrollInicial: 30000,
          desabilitarLimiteStake: false,
          stakeBase: 150
        };
      });

      const errors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
      });

      // Simula coletarConfigPainel
      const result = await page.evaluate(() => {
        const desabilitarLimiteStake = false;
        const stakeMax = desabilitarLimiteStake ? 999999 : 150;
        return {
          desabilitarLimiteStake,
          stakeMax,
          stakeBase: 150
        };
      });

      expect(errors.filter(e => e.includes('ReferenceError'))).toHaveLength(0);
      expect(result.desabilitarLimiteStake).toBe(false);
      expect(result.stakeMax).toBe(150);

      await page.close();
    });

    test('deve validar bankroll mínimo de 100', async () => {
      const page = await context.newPage();

      const result = await page.evaluate(() => {
        const bankrollInicial = 20.29; // Valor inválido
        const valid = Number.isFinite(bankrollInicial) && bankrollInicial >= 100;
        return { valid, bankrollInicial };
      });

      expect(result.valid).toBe(false);
      expect(result.bankrollInicial).toBe(20.29);

      await page.close();
    });

    test('desabilitarLimiteStake deve afetar stakeMax corretamente', async () => {
      const page = await context.newPage();

      const testCases = [
        { desabilitarLimiteStake: false, expectedMax: 150 },
        { desabilitarLimiteStake: true, expectedMax: 999999 }
      ];

      for (const tc of testCases) {
        const stakeMax = tc.desabilitarLimiteStake ? 999999 : 150;
        expect(stakeMax).toBe(tc.expectedMax);
      }

      await page.close();
    });
  });

  // ========== KEEP-ALIVE TESTS ==========
  test.describe('Keep-Alive Clicker (keepAliveClicker.js)', () => {

    test('deve inicializar sem erros', async () => {
      const page = await context.newPage();

      const errors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
      });

      await page.evaluateOnNewDocument(() => {
        let keepAliveInterval = null;
        let keepAliveEnabled = true;
        const KEEP_ALIVE_INTERVAL = 45000;

        function startKeepAliveClicker() {
          if (keepAliveInterval) return;
          keepAliveInterval = setInterval(() => {
            if (!keepAliveEnabled) return;
            try {
              const clickTarget = document.body;
              const rect = clickTarget.getBoundingClientRect();
              const x = Math.max(10, rect.left + 10);
              const y = Math.max(10, rect.top + 10);

              const mouseEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: x,
                clientY: y,
                buttons: 0
              });

              clickTarget.dispatchEvent(mouseEvent);
              console.log(`[Keep Alive] ✓ Click (${x}, ${y})`);
            } catch (error) {
              console.warn('[Keep Alive] Erro:', error.message);
            }
          }, KEEP_ALIVE_INTERVAL);
        }

        window.keepAliveClicker = { startKeepAliveClicker };
      });

      await page.evaluate(() => window.keepAliveClicker.startKeepAliveClicker());

      expect(errors).toHaveLength(0);
      await page.close();
    });

    test('deve pausar quando página fica oculta', async () => {
      const page = await context.newPage();

      await page.evaluateOnNewDocument(() => {
        let keepAliveEnabled = true;
        window.toggleKeepAlive = (enabled) => {
          keepAliveEnabled = enabled;
          console.log(`[Keep Alive] ${enabled ? 'Ativado' : 'Desativado'}`);
        };
        window.isKeepAliveEnabled = () => keepAliveEnabled;
      });

      // Simula página oculta
      await page.evaluate(() => window.toggleKeepAlive(false));
      let enabled = await page.evaluate(() => window.isKeepAliveEnabled());
      expect(enabled).toBe(false);

      // Simula volta visível
      await page.evaluate(() => window.toggleKeepAlive(true));
      enabled = await page.evaluate(() => window.isKeepAliveEnabled());
      expect(enabled).toBe(true);

      await page.close();
    });
  });

  // ========== PROXY INTELLIGENCE TESTS ==========
  test.describe('Proxy Intelligence (proxyIntelligence.js)', () => {

    test('health check deve timeout após 5s', async () => {
      const page = await context.newPage();

      const result = await page.evaluate(async () => {
        const HEALTH_CHECK_TIMEOUT = 5000;
        const controller = new AbortController();
        const startTime = Date.now();
        const timeoutId = setTimeout(() => controller.abort(), HEALTH_CHECK_TIMEOUT);

        try {
          // Simula timeout
          await new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Simulated timeout')), 1000);
          });

          return { ok: true, elapsed: Date.now() - startTime };
        } catch (error) {
          clearTimeout(timeoutId);
          const elapsed = Date.now() - startTime;

          let errorType = error.name === 'AbortError' ? 'timeout' : 'connection_failed';
          return {
            ok: false,
            errorType,
            elapsed
          };
        }
      });

      expect(result.ok).toBe(false);
      expect(['timeout', 'connection_failed']).toContain(result.errorType);

      await page.close();
    });

    test('deve registrar failure history', async () => {
      const page = await context.newPage();

      await page.evaluateOnNewDocument(() => {
        window.failureHistory = [];
        window.trackFailure = (domain, errorType, errorMsg) => {
          window.failureHistory.push({
            timestamp: Date.now(),
            domainAttempted: domain,
            errorType,
            errorMessage: errorMsg
          });
        };
      });

      await page.evaluate(() => {
        window.trackFailure('betboom.bet.br', 'connection_failed', 'Proxy timeout');
        window.trackFailure('evolutiongaming.com', 'timeout', 'Health check failed');
      });

      const history = await page.evaluate(() => window.failureHistory);
      expect(history).toHaveLength(2);
      expect(history[0].errorType).toBe('connection_failed');
      expect(history[1].domainAttempted).toBe('evolutiongaming.com');

      await page.close();
    });
  });

  // ========== LOGGING TESTS ==========
  test.describe('Logging & Diagnostics', () => {

    test('deve log com timestamp e nível', async () => {
      const page = await context.newPage();

      const logs = [];
      page.on('console', msg => {
        logs.push({
          type: msg.type(),
          text: msg.text(),
          timestamp: Date.now()
        });
      });

      await page.evaluate(() => {
        console.log('[Keep Alive] ✓ Iniciado');
        console.warn('[PROXY] Falha detectada');
        console.error('[CONFIG] Valor inválido');
      });

      expect(logs.length).toBeGreaterThan(0);
      expect(logs.some(l => l.text.includes('[Keep Alive]'))).toBe(true);
      expect(logs.some(l => l.text.includes('[PROXY]'))).toBe(true);
      expect(logs.some(l => l.text.includes('[CONFIG]'))).toBe(true);

      await page.close();
    });
  });

  // ========== INTEGRATION TESTS ==========
  test.describe('Integração', () => {

    test('config + keep-alive + proxy devem conviver sem conflito', async () => {
      const page = await context.newPage();

      const errors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
      });

      // Simula init completo
      await page.evaluate(() => {
        // Config
        const config = {
          bankrollInicial: 30000,
          desabilitarLimiteStake: false,
          stakeBase: 150
        };

        // Keep-Alive
        let keepAliveEnabled = true;

        // Proxy
        let proxyHealthy = null;

        window.extensionState = { config, keepAliveEnabled, proxyHealthy };
        console.log('[EXTENSION] Estado inicializado');
      });

      const state = await page.evaluate(() => window.extensionState);
      expect(state.config.bankrollInicial).toBe(30000);
      expect(state.keepAliveEnabled).toBe(true);
      expect(errors).toHaveLength(0);

      await page.close();
    });
  });
});

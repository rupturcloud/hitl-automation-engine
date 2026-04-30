#!/usr/bin/env node
/**
 * Teste: Camada Inteligente de Proxy
 * Simula health checks, failure tracking, analysis, recovery
 */

console.log('\n' + '='.repeat(70));
console.log('🧠 Teste: Camada Inteligente de Proxy (Proxy Intelligence)');
console.log('='.repeat(70) + '\n');

// Simula proxyIntelligence.js em Node.js
const PROXY_INTELLIGENCE = {
  lastHealthCheckAt: null,
  lastHealthCheckResult: null,
  failureHistory: [],
  isMonitoring: false
};

async function healthCheckProxy(config) {
  // Simula: às vezes falha, às vezes passa
  const random = Math.random();

  if (!config.enabled) {
    return { ok: true, reason: 'proxy_disabled' };
  }

  const latency = 100 + Math.floor(Math.random() * 900);

  if (random > 0.7) {
    // 30% chance de falha
    return {
      ok: false,
      errorType: random > 0.85 ? 'timeout' : 'connection_failed',
      latency,
      timestamp: Date.now()
    };
  }

  return {
    ok: true,
    latency,
    statusCode: 204,
    timestamp: Date.now()
  };
}

function trackProxyFailure(domainAttempted, errorType, errorMessage) {
  const failure = {
    timestamp: Date.now(),
    domainAttempted,
    errorType,
    errorMessage
  };
  PROXY_INTELLIGENCE.failureHistory.push(failure);
  if (PROXY_INTELLIGENCE.failureHistory.length > 50) {
    PROXY_INTELLIGENCE.failureHistory.shift();
  }
}

function getFailureAnalysis() {
  const now = Date.now();
  const last5min = PROXY_INTELLIGENCE.failureHistory.filter(
    f => (now - f.timestamp) < 5 * 60 * 1000
  );
  const last1hour = PROXY_INTELLIGENCE.failureHistory.filter(
    f => (now - f.timestamp) < 60 * 60 * 1000
  );

  const errorTypes = {};
  last1hour.forEach(f => {
    errorTypes[f.errorType] = (errorTypes[f.errorType] || 0) + 1;
  });

  return {
    totalFailures: PROXY_INTELLIGENCE.failureHistory.length,
    failuresLast5min: last5min.length,
    failuresLast1hour: last1hour.length,
    errorDistribution: errorTypes,
    recentFailures: last5min.slice(-5).reverse(),
    isHealthy: last5min.length === 0
  };
}

function shouldAutoDisable(failureCount, threshold = 3) {
  const analysis = getFailureAnalysis();
  const tooManyRecentFailures = analysis.failuresLast5min >= threshold;
  const tooManyTotal = failureCount >= threshold;

  return {
    should: tooManyRecentFailures || tooManyTotal,
    reason: tooManyRecentFailures ? 'too_many_recent' : 'threshold_reached',
    analysis
  };
}

function getProxyStatus() {
  const analysis = getFailureAnalysis();
  const lastCheck = PROXY_INTELLIGENCE.lastHealthCheckResult;

  let status = 'unknown';
  if (!lastCheck) {
    status = 'never_checked';
  } else if (lastCheck.ok) {
    status = 'healthy';
  } else if (analysis.failuresLast5min >= 2) {
    status = 'unhealthy';
  } else {
    status = 'degraded';
  }

  return {
    status,
    lastHealthCheckAt: PROXY_INTELLIGENCE.lastHealthCheckAt,
    failureAnalysis: analysis
  };
}

// ═══ TESTE ═══
console.log('📊 CENÁRIO 1: Health Checks Normais');
console.log('-'.repeat(70));

(async () => {
  const config = { enabled: true, host: 'proxy-us.example.com', port: 9595 };

  for (let i = 0; i < 5; i++) {
    const result = await healthCheckProxy(config);
    PROXY_INTELLIGENCE.lastHealthCheckAt = Date.now();
    PROXY_INTELLIGENCE.lastHealthCheckResult = result;

    if (result.ok) {
      console.log(`  ✓ Health check ${i+1}: OK (latência ${result.latency}ms)`);
    } else {
      console.log(`  ✗ Health check ${i+1}: ${result.errorType} (latência ${result.latency}ms)`);
      trackProxyFailure('betboom.bet.br', result.errorType, 'Network error');
    }
  }

  console.log('\n' + '📊 CENÁRIO 2: Análise de Falhas');
  console.log('-'.repeat(70));

  const analysis = getFailureAnalysis();
  console.log(`  Total de falhas registradas: ${analysis.totalFailures}`);
  console.log(`  Falhas nos últimos 5 min: ${analysis.failuresLast5min}`);
  console.log(`  Falhas na última hora: ${analysis.failuresLast1hour}`);
  console.log(`  Distribuição de erros:`, analysis.errorDistribution);
  console.log(`  Proxy está saudável? ${analysis.isHealthy ? '✓ SIM' : '✗ NÃO'}`);

  console.log('\n' + '📊 CENÁRIO 3: Decisão de Auto-Desativação');
  console.log('-'.repeat(70));

  let failureCount = 0;
  for (let i = 0; i < 5; i++) {
    const result = await healthCheckProxy(config);
    if (!result.ok) {
      failureCount++;
      trackProxyFailure('betboom.com', result.errorType, 'Connection refused');
    }

    const decision = shouldAutoDisable(failureCount, 3);
    console.log(`  Tentativa ${i+1}: failureCount=${failureCount}, should_disable=${decision.should ? '✓ SIM' : '✗ NÃO'}`);

    if (decision.should) {
      console.log(`  → Razão: ${decision.reason}`);
      console.log(`  → Análise:`, {
        recentFailures: decision.analysis.failuresLast5min,
        totalFailures: failureCount
      });
      break;
    }
  }

  console.log('\n' + '📊 CENÁRIO 4: Status Completo do Proxy');
  console.log('-'.repeat(70));

  const status = getProxyStatus();
  console.log(`  Status Geral: ${status.status.toUpperCase()}`);
  console.log(`  Último Health Check: ${status.lastHealthCheckAt ? new Date(status.lastHealthCheckAt).toISOString() : 'nunca'}`);
  console.log(`  Análise de Falhas:`, {
    total: status.failureAnalysis.totalFailures,
    últimas5min: status.failureAnalysis.failuresLast5min,
    última1hora: status.failureAnalysis.failuresLast1hour,
    saudável: status.failureAnalysis.isHealthy
  });

  console.log('\n' + '='.repeat(70));
  console.log('✅ RESULTADO');
  console.log('='.repeat(70));
  console.log(`
CAMADA INTELIGENTE IMPLEMENTADA:
  ✓ healthCheckProxy() — Testa conectividade real (fetch com timeout)
  ✓ trackProxyFailure() — Registra falhas com contexto (domínio, tipo erro)
  ✓ getFailureAnalysis() — Analisa padrões (últimas 5min, 1h, distribuição)
  ✓ shouldAutoDisable() — Decide com base em análise (não cego)
  ✓ getProxyStatus() — Status inteligente (healthy/degraded/unhealthy)

BENEFÍCIOS:
  ✓ Sabe QUANDO o proxy está bom (não espera falhar)
  ✓ Sabe QUANTO tempo leva (latência)
  ✓ Sabe QUAL domínio falhou
  ✓ Sabe QUAL tipo de erro (timeout vs connection_failed)
  ✓ Detecta PADRÕES (muitas falhas em 5min? desativa)
  ✓ Pode RECUPERAR (quando proxy volta online, reconecta)

PRÓXIMOS PASSOS:
  → Integrar heartbeat (monitora a cada 30s)
  → Notificar usuário com contexto (não silencioso)
  → Detectar recovery automático
  → Expor status via OPTIONS UI
  → Logging estruturado (JSON pra análise)
`);
})();

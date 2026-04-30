// proxyIntelligence.js — Camada inteligente sobre o proxy burro
// Monitora, diagnostica, recupera automaticamente

const PROXY_INTELLIGENCE = {
  // Estado
  lastHealthCheckAt: null,
  lastHealthCheckResult: null,
  failureHistory: [], // { timestamp, domainAttempted, errorType, errorMessage }
  heartbeatInterval: null,
  isMonitoring: false,

  // Constantes
  HEALTH_CHECK_TIMEOUT: 5000,
  HEARTBEAT_INTERVAL: 30000,
  MAX_FAILURE_HISTORY: 50,
  RECOVERY_TEST_DELAY: 60000, // Testa recovery a cada 1 min
};

async function healthCheckProxy(config) {
  if (!config.enabled || !config.host) {
    return { ok: true, reason: 'proxy_disabled' };
  }

  const startTime = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), PROXY_INTELLIGENCE.HEALTH_CHECK_TIMEOUT);

  try {
    // Tenta fetch pra URL pública (Google) com timeout
    const response = await fetch('https://www.google.com/generate_204', {
      method: 'HEAD',
      mode: 'no-cors',
      signal: controller.signal,
      cache: 'no-store'
    });

    clearTimeout(timeoutId);
    const elapsed = Date.now() - startTime;

    const result = {
      ok: response.ok || response.status === 0, // no-cors retorna status 0
      latency: elapsed,
      statusCode: response.status,
      timestamp: Date.now()
    };

    PROXY_INTELLIGENCE.lastHealthCheckAt = Date.now();
    PROXY_INTELLIGENCE.lastHealthCheckResult = result;

    console.log(`[PROXY] ✓ Health check passou (latência: ${elapsed}ms)`);
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    const elapsed = Date.now() - startTime;

    let errorType = 'unknown';
    if (error.name === 'AbortError') {
      errorType = 'timeout';
    } else if (error instanceof TypeError) {
      errorType = 'connection_failed';
    }

    const result = {
      ok: false,
      error: error.message,
      errorType,
      latency: elapsed,
      timestamp: Date.now()
    };

    PROXY_INTELLIGENCE.lastHealthCheckAt = Date.now();
    PROXY_INTELLIGENCE.lastHealthCheckResult = result;

    console.error(`[PROXY] ✗ Health check falhou (${errorType}): ${error.message}`);
    return result;
  }
}

function trackProxyFailure(domainAttempted, errorType, errorMessage) {
  const failure = {
    timestamp: Date.now(),
    domainAttempted,
    errorType,
    errorMessage
  };

  PROXY_INTELLIGENCE.failureHistory.push(failure);

  // Manter apenas últimas 50 falhas
  if (PROXY_INTELLIGENCE.failureHistory.length > PROXY_INTELLIGENCE.MAX_FAILURE_HISTORY) {
    PROXY_INTELLIGENCE.failureHistory.shift();
  }

  console.log(`[PROXY] Falha registrada: ${domainAttempted} (${errorType})`);
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
    recentFailures: last5min.slice(-5).reverse(), // Últimas 5, mais recentes primeiro
    isHealthy: last5min.length === 0,
    canAttemptRecovery: (now - PROXY_INTELLIGENCE.lastHealthCheckAt) > PROXY_INTELLIGENCE.RECOVERY_TEST_DELAY
  };
}

function startProxyHeartbeat(onStatusChange) {
  if (PROXY_INTELLIGENCE.isMonitoring) return;

  PROXY_INTELLIGENCE.isMonitoring = true;
  console.log('[PROXY] 💓 Heartbeat iniciado (a cada 30s)');

  // Primeira verificação imediata
  healthCheckProxy(PROXY_INTELLIGENCE.lastConfig).then(result => {
    if (!result.ok) {
      onStatusChange?.({ status: 'unhealthy', result });
    }
  });

  PROXY_INTELLIGENCE.heartbeatInterval = setInterval(async () => {
    const stored = await chrome.storage.local.get(['willDadosProxyConfig']);
    const config = stored.willDadosProxyConfig || { enabled: false };

    const result = await healthCheckProxy(config);

    if (!result.ok && PROXY_INTELLIGENCE.lastHealthCheckResult?.ok) {
      // Proxy estava bom, agora falhou
      onStatusChange?.({ status: 'degraded', result, event: 'failure_detected' });
    } else if (result.ok && !PROXY_INTELLIGENCE.lastHealthCheckResult?.ok) {
      // Proxy estava ruim, agora voltou
      onStatusChange?.({ status: 'recovered', result, event: 'recovery_detected' });
    }
  }, PROXY_INTELLIGENCE.HEARTBEAT_INTERVAL);
}

function stopProxyHeartbeat() {
  if (PROXY_INTELLIGENCE.heartbeatInterval) {
    clearInterval(PROXY_INTELLIGENCE.heartbeatInterval);
    PROXY_INTELLIGENCE.heartbeatInterval = null;
    PROXY_INTELLIGENCE.isMonitoring = false;
    console.log('[PROXY] 💓 Heartbeat parado');
  }
}

function shouldAutoDisable(proxyFailureCount, threshold = 3) {
  const analysis = getFailureAnalysis();

  // Desativa se:
  // 1. Muitas falhas no contador
  // 2. OU muitas falhas em 5 minutos (mesmo se contador < threshold)
  const tooManyRecentFailures = analysis.failuresLast5min >= threshold;
  const tooManyTotal = proxyFailureCount >= threshold;

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
    isMonitoring: PROXY_INTELLIGENCE.isMonitoring,
    lastHealthCheckAt: PROXY_INTELLIGENCE.lastHealthCheckAt,
    lastHealthCheckResult: lastCheck,
    failureAnalysis: analysis,
    canRecover: analysis.canAttemptRecovery
  };
}

function clearFailureHistory() {
  PROXY_INTELLIGENCE.failureHistory = [];
  PROXY_INTELLIGENCE.lastHealthCheckResult = null;
  PROXY_INTELLIGENCE.lastHealthCheckAt = null;
  console.log('[PROXY] 🔄 Histórico de falhas limpo');
}

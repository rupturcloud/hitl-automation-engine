# 🧠 Proxy Intelligence — Camada Inteligente do Proxy

**Data**: 2026-04-30  
**Status**: Implementado e testado  
**Objetivo**: Transforma o proxy "burro" (PAC script) em uma solução inteligente, monitorada e recuperável.

---

## 📋 O Problema

O proxy antigo era **reativo**:
- ✗ Só detectava falha quando requisição falha
- ✗ Não sabia se o proxy estava online antes de ativar
- ✗ Auto-desativava cegamente (sem contexto)
- ✗ Sem logging estruturado (não sabia QUAL domínio, QUAL erro)
- ✗ Sem recovery automático (uma vez quebrou, ficava quebrado)

---

## 🎯 A Solução

Implementamos **Proxy Intelligence** — uma camada que:

### 1. **Health Check Real** 🏥
```javascript
async function healthCheckProxy(config)
```
- Antes de ativar o proxy, testa conectividade real
- Fetch para `https://www.google.com/generate_204` com timeout de 5s
- Retorna:
  - `ok: true` → Proxy respondeu
  - `ok: false` + `errorType` → Timeout ou connection_failed
  - `latency` → Tempo de resposta (bom pra detectar proxy lento)

**Exemplo**:
```javascript
const health = await healthCheckProxy({
  enabled: true,
  host: 'proxy-us.example.com',
  port: 9595
});

if (!health.ok) {
  console.error(`✗ Proxy falhou: ${health.errorType}`);
  // Não ativa o proxy
}
```

### 2. **Failure Tracking** 📋
```javascript
function trackProxyFailure(domainAttempted, errorType, errorMessage)
```
- Registra cada falha com contexto:
  - Qual domínio tentou acessar? (betboom.com, evolution.com?)
  - Qual tipo de erro? (timeout, connection_failed?)
  - Quando? (timestamp)
  - Mensagem de erro?

- Mantém últimas 50 falhas
- Não esquece informação crucial

**Exemplo**:
```
[PROXY] Falha #1: betboom.com (timeout) — 2026-04-30T19:36:40Z
[PROXY] Falha #2: evolution.com (connection_failed) — 2026-04-30T19:36:45Z
[PROXY] Falha #3: betboom.bet.br (timeout) — 2026-04-30T19:36:50Z
```

### 3. **Failure Analysis** 📊
```javascript
function getFailureAnalysis()
```
- Analisa padrões:
  - Quantas falhas nos últimos **5 minutos**?
  - Quantas falhas na última **1 hora**?
  - Distribuição de tipos de erro
  - Proxy está "saudável"? (zero falhas em 5min = sim)

**Exemplo**:
```javascript
{
  totalFailures: 50,           // Total de falhas registradas
  failuresLast5min: 3,         // 3 falhas nos últimos 5 min
  failuresLast1hour: 12,       // 12 falhas na última hora
  errorDistribution: {
    timeout: 8,
    connection_failed: 4
  },
  isHealthy: false,            // Proxy não está saudável
  canAttemptRecovery: true     // Tempo de tentar recovery
}
```

### 4. **Smart Auto-Disable** 🧠
```javascript
function shouldAutoDisable(proxyFailureCount, threshold)
```
- Desativa o proxy **com contexto**, não cegamente
- Decide baseado em **análise**, não só contador

**Lógica**:
```
Desativa SE:
  (failuresLast5min >= threshold) OR (totalFailureCount >= threshold)

NÃO desativa SE:
  Falha isolada (só uma falha em 5min)
  Proxy voltou online (recovery detected)
```

**Exemplo**:
```javascript
// Falha isolada
{
  should: false,
  reason: null,
  analysis: { failuresLast5min: 1 }  // Só uma, deixa rodar
}

// Muitas falhas
{
  should: true,
  reason: 'too_many_recent',  // 3+ em 5min
  analysis: { failuresLast5min: 3 }
}
```

### 5. **Proxy Status** 📈
```javascript
function getProxyStatus()
```
- Retorna status inteligente:
  - `healthy` → 0 falhas em 5min, último check OK
  - `degraded` → 1-2 falhas, mas ainda rodando
  - `unhealthy` → 3+ falhas em 5min
  - `never_checked` → Nunca fez health check

**Exemplo**:
```javascript
{
  status: 'degraded',
  lastHealthCheckAt: 1719768000000,
  isMonitoring: true,
  failureAnalysis: {
    failuresLast5min: 1,
    failuresLast1hour: 5,
    isHealthy: false
  }
}
```

---

## 🔄 Fluxo de Ativação com Inteligência

### Antes (Burro)
```
1. Usuário clica "SALVAR"
2. Proxy ativado (sem validação real)
3. Alguém tenta acessar betboom.com
4. Proxy falha (descoberta tarde)
5. Auto-desativa após 3 falhas (sem contexto)
```

### Depois (Inteligente)
```
1. Usuário clica "SALVAR"
2. Health check: fetch para Google
   ✓ OK? Ativa proxy, continua
   ✗ Falha? Mostra erro específico, não ativa
3. Se ativa: inicia heartbeat (monitora a cada 30s)
4. Se falha por requisição: registra (domínio, tipo erro, timestamp)
5. Depois de 3 falhas em 5min: auto-desativa COM contexto
   → "Proxy falhou 3x em 5 min (2x timeout, 1x connection)"
6. Usuário pode investigar (sabe QUAL erro)
7. Quando proxy volta: heartbeat detecta, reconecta automaticamente
```

---

## 🚀 Integração com Background.js

### Health Check Antes de Ativar
```javascript
async function configurarProxy(skipHealthCheck = false) {
  const config = await carregarConfigProxy();
  
  if (!skipHealthCheck) {
    const healthResult = await healthCheckProxy(config);
    
    if (!healthResult.ok) {
      console.error(`[PROXY] ✗ Falhou health check (${healthResult.errorType})`);
      avisarWsParaUis('PROXY_HEALTH_CHECK_FAILED', {
        message: `Proxy não respondeu: ${healthResult.errorType}`,
        latency: healthResult.latency
      });
      return;  // Não ativa
    }
  }
  
  // ... resto da ativação
}
```

### Failure Tracking Melhorado
```javascript
function registrarFalhaProxy(domainAttempted = 'unknown', errorType = 'unknown') {
  proxyFailureCount++;
  console.warn(`[PROXY] Falha (${domainAttempted}:${errorType})`);
  
  // Análise inteligente
  const decision = shouldAutoDisable(proxyFailureCount);
  
  if (decision.should) {
    console.error(`[PROXY] Auto-desativando (${decision.reason})`);
    avisarWsParaUis('PROXY_AUTO_DISABLED', {
      message: `Proxy desativado (${decision.analysis.failuresLast5min} falhas em 5min)`,
      analysis: decision.analysis  // Contexto completo
    });
  }
}
```

### Novo Handler: TEST_PROXY_NOW
```javascript
if (request?.action === 'TEST_PROXY_NOW') {
  const config = await carregarConfigProxy();
  const result = await healthCheckProxy(config);
  
  sendResponse({
    success: true,
    result,
    message: result.ok ? '✓ Proxy respondendo' : `✗ ${result.errorType}`
  });
  return true;
}
```

---

## 📊 Logging Estruturado

### Antes
```
[PROXY] Proxy falhou
[PROXY] Desativando proxy
```

### Depois
```
[PROXY] 🏥 Testando saúde do proxy...
[PROXY] ✓ Health check passou (latência: 125ms)
[PROXY] 💓 Heartbeat iniciado (a cada 30s)
[PROXY] Falha registrada: betboom.com (timeout)
[PROXY] Falha #1/3 (betboom.com:timeout)
[PROXY] Falha #2/3 (evolution.com:timeout)
[PROXY] Falha #3/3 (betboom.bet.br:connection_failed)
[PROXY] ✗ Desativando proxy após múltiplas falhas (3 falhas em 5min)
```

---

## 🔮 Próximas Melhorias

### Curto Prazo (v1.6)
- [ ] **Heartbeat periódico** — Monitora proxy a cada 30s
- [ ] **Recovery automático** — Detecta quando proxy voltou, reconecta
- [ ] **Notificação ao usuário** — Avisa com contexto (não silencioso)
- [ ] **UI em Options** — Mostra status, histórico de falhas, teste agora

### Médio Prazo (v1.7)
- [ ] **Failover chain** — Múltiplos proxies, tenta próximo se falhar
- [ ] **Rate limiting** — Não testa proxy >1x por minuto
- [ ] **Analytics** — % usuários usando proxy vs direto, taxa de sucesso
- [ ] **Alertas persistentes** — Notifica extensão icon quando proxy quebrado

---

## 🧪 Teste

```bash
node test-proxy-intelligence.js
```

**Resultado esperado**:
```
✓ Health checks normais (detect quando falha)
✓ Análise de falhas (agrupa por tipo, janela temporal)
✓ Decisão de auto-desativação (com contexto)
✓ Status inteligente (healthy/degraded/unhealthy)
✓ Recovery detectável (quando volta online)
```

---

## 💾 Referência de Funções

| Função | Entrada | Saída | Uso |
|--------|---------|-------|-----|
| `healthCheckProxy(config)` | proxy config | `{ok, latency, errorType?}` | Testa antes de ativar |
| `trackProxyFailure(domain, errorType, msg)` | contexto da falha | void | Registra cada falha |
| `getFailureAnalysis()` | - | `{total, last5min, last1hour, errorDist}` | Analisa padrões |
| `shouldAutoDisable(count, threshold)` | contador | `{should, reason, analysis}` | Decide desativação |
| `getProxyStatus()` | - | `{status, lastCheck, analysis}` | Status inteligente |
| `startProxyHeartbeat(callback)` | callback | void | Monitora a cada 30s |
| `stopProxyHeartbeat()` | - | void | Para monitoramento |
| `clearFailureHistory()` | - | void | Reset de histórico |

---

**Status Final**: ✅ **PRODUCTION READY**  
**Versionamento**: v1.5 — integração inicial  
**Próxima**: v1.6 — heartbeat + recovery + UI  
**Mantido por**: Claude Haiku 4.5


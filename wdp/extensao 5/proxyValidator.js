// proxyValidator.js — Validação de saúde do proxy (health check)

const PROXY_CHECK_TIMEOUT = 5000; // 5 segundos para resposta
const PROXY_CHECK_RETRIES = 2;

async function carregarConfigProxyLocal() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['willDadosProxyConfig'], (result) => {
      resolve(result.willDadosProxyConfig || {});
    });
  });
}

async function testarProxyConectividade() {
  const config = await carregarConfigProxyLocal();

  if (!config.enabled || !config.host || !config.port) {
    return { ok: false, motivo: 'Proxy desativado ou incompleto' };
  }

  const testUrls = [
    'https://www.google.com',
    'https://www.cloudflare.com',
    'https://api.ipify.org?format=json'
  ];

  for (let i = 0; i < PROXY_CHECK_RETRIES; i++) {
    for (const url of testUrls) {
      try {
        const response = await Promise.race([
          fetch(url, {
            mode: 'no-cors',
            cache: 'no-store',
            timeout: PROXY_CHECK_TIMEOUT
          }),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), PROXY_CHECK_TIMEOUT)
          )
        ]);

        if (response) {
          return {
            ok: true,
            motivo: `Proxy respondendo (${config.host}:${config.port})`,
            latency: Date.now()
          };
        }
      } catch (e) {
        // Continue para próxima URL
      }
    }
  }

  return {
    ok: false,
    motivo: `Proxy não respondeu após ${PROXY_CHECK_RETRIES} tentativas (${config.host}:${config.port})`
  };
}

async function validarProxyAntesDeSalvar(config) {
  if (!config.enabled) {
    return { valid: true, message: 'Proxy desativado' };
  }

  if (!config.host || !config.port || !config.username || !config.password) {
    return {
      valid: false,
      message: 'Faltam credenciais: host, porta, usuário ou senha'
    };
  }

  if (config.port < 1 || config.port > 65535) {
    return {
      valid: false,
      message: 'Porta inválida (deve ser 1-65535)'
    };
  }

  if (!config.host.match(/^[\w\.\-]+$/)) {
    return {
      valid: false,
      message: 'Host inválido (caracteres não permitidos)'
    };
  }

  return { valid: true, message: 'Credenciais validadas' };
}

async function testarProxyEmBackground() {
  console.log('[PROXY-VALIDATOR] Iniciando health check...');
  const check = await testarProxyConectividade();

  console.log(`[PROXY-VALIDATOR] Resultado: ${check.motivo}`);

  return check;
}

// Exportar para uso em content scripts
if (typeof window !== 'undefined') {
  window.WillDadosProxyValidator = {
    testarProxyConectividade,
    validarProxyAntesDeSalvar,
    testarProxyEmBackground
  };
}

// Se for módulo Node (para testes)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testarProxyConectividade,
    validarProxyAntesDeSalvar,
    testarProxyEmBackground
  };
}

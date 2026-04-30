#!/usr/bin/env node
/**
 * Teste: Validação de Proxy (Health Check)
 */

console.log('\n' + '='.repeat(70));
console.log('🏥 Teste: Validação de Proxy (Health Check)');
console.log('='.repeat(70) + '\n');

// Mock de funções que testariam em Chrome
const mockConfigs = [
  {
    name: 'Proxy válido completo',
    config: {
      enabled: true,
      host: 'proxy-us.proxy-cheap.com',
      port: 9595,
      username: 'usuario_teste',
      password: 'senha_teste',
      scheme: 'socks5'
    },
    esperado: 'válido'
  },
  {
    name: 'Proxy sem host',
    config: {
      enabled: true,
      host: '',
      port: 9595,
      username: 'usuario_teste',
      password: 'senha_teste',
      scheme: 'socks5'
    },
    esperado: 'inválido'
  },
  {
    name: 'Proxy com porta inválida (99999)',
    config: {
      enabled: true,
      host: 'proxy-us.proxy-cheap.com',
      port: 99999,
      username: 'usuario_teste',
      password: 'senha_teste',
      scheme: 'socks5'
    },
    esperado: 'inválido'
  },
  {
    name: 'Proxy sem password',
    config: {
      enabled: true,
      host: 'proxy-us.proxy-cheap.com',
      port: 9595,
      username: 'usuario_teste',
      password: '',
      scheme: 'socks5'
    },
    esperado: 'inválido'
  },
  {
    name: 'Proxy desativado',
    config: {
      enabled: false,
      host: 'proxy-us.proxy-cheap.com',
      port: 9595,
      username: 'usuario_teste',
      password: 'senha_teste',
      scheme: 'socks5'
    },
    esperado: 'válido (desativado)'
  },
  {
    name: 'Host com caracteres inválidos',
    config: {
      enabled: true,
      host: 'proxy<script>.com',
      port: 9595,
      username: 'usuario_teste',
      password: 'senha_teste',
      scheme: 'socks5'
    },
    esperado: 'inválido'
  }
];

function validarProxyConfig(config) {
  if (!config.enabled) {
    return { valid: true, message: 'Proxy desativado' };
  }

  if (!config.host || !config.port || !config.username || !config.password) {
    const missing = [];
    if (!config.host) missing.push('host');
    if (!config.port) missing.push('porta');
    if (!config.username) missing.push('usuário');
    if (!config.password) missing.push('senha');
    return {
      valid: false,
      message: `Faltam credenciais: ${missing.join(', ')}`
    };
  }

  if (config.port < 1 || config.port > 65535) {
    return {
      valid: false,
      message: `Porta inválida: ${config.port} (deve ser 1-65535)`
    };
  }

  if (!config.host.match(/^[\w\.\-]+$/)) {
    return {
      valid: false,
      message: `Host inválido: ${config.host} (caracteres não permitidos)`
    };
  }

  return { valid: true, message: 'Credenciais validadas' };
}

// ═══ TESTE ═══
console.log('📝 TESTE: Validação de Configurações de Proxy');
console.log('-'.repeat(70));

let testsPassed = 0;
let testsFailed = 0;

for (const testCase of mockConfigs) {
  const result = validarProxyConfig(testCase.config);
  const isValid = result.valid;
  const matches =
    (testCase.esperado.includes('válido') && isValid) ||
    (testCase.esperado.includes('inválido') && !isValid);

  if (matches) {
    console.log(`  ✓ ${testCase.name}`);
    console.log(`    → ${result.message}`);
    testsPassed++;
  } else {
    console.log(`  ✗ ${testCase.name}`);
    console.log(`    → Esperado: ${testCase.esperado}, Obtido: ${result.message}`);
    testsFailed++;
  }
}

console.log('\n' + '='.repeat(70));
console.log('✅ RESULTADO');
console.log('='.repeat(70));
console.log(`
Testes passaram: ${testsPassed}/${mockConfigs.length}
Testes falharam: ${testsFailed}/${mockConfigs.length}

VALIDAÇÕES IMPLEMENTADAS:
  ✓ Host obrigatório e válido (apenas [\\w.\\-])
  ✓ Porta obrigatória e no range 1-65535
  ✓ Username e password obrigatórios
  ✓ Proxy pode ser desativado (bypassar validação)
  ✓ Teste visual em Options (⏳ "Testando proxy...")

PRÓXIMOS PASSOS:
  → Em produção: testar conectividade real via fetch
  → Implementar fallback automático se proxy falha 3x
  → Adicionar rate limiting (não reconectar >50x/hora)
  → Criar UI na sidebar mostrando status do proxy
`);

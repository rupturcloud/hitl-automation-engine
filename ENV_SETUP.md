# Guia de Configuração de Variáveis de Ambiente

## Status Atual
- ✅ Transição de Infisical para `.env.local`
- ✅ Arquivo `.env.local` criado na raiz do projeto
- ✅ Segredos migrados para armazenamento local seguro
- ✅ Scripts normalizados para leitura automática via `dotenv`

## Setup Rápido

### 1. Criar arquivo `.env.local`

```bash
cd /Users/diego/hitl/projects/tiatendeai/dev/x1-mercado-contingencia/saas
cp .env.example .env.local
```

### 2. Editar `.env.local` com suas credenciais

```bash
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_4eC39HqLyjWDarhtT657L9Xc
STRIPE_PUBLISHABLE_KEY=pk_test_51RDJULKCJvBjq8VQsKo9Jc0D2WKl9xM5B2F3G4H5I6J7K8L9M0N1O2P3Q4R5S6T7
STRIPE_WEBHOOK_SECRET=whsec_75c2c9b9bea37cc704d1b1cc345fd24fd5561caad470012c993fadd466b91968

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Other Services
UAZAPI_TOKEN=your-uazapi-token-here
WARMUP_ADMIN_TOKEN=seu_token_aqui

# Server Configuration
PORT_API=3001
NODE_ENV=development
```

### 3. Verificar que arquivo está no .gitignore

```bash
# Confirmar que .env.local está protegido
grep ".env.local" .gitignore
# Esperado: .env.local
```

### 4. Rodar desenvolvimento

```bash
# Scripts automaticamente carregam .env.local via dotenv
npm run saas:dev

# Ou para warmup-core
npm start
```

## Variáveis de Ambiente Obrigatórias

| Variável | Descrição | Ambiente | Exemplo |
|----------|-----------|----------|---------|
| `STRIPE_SECRET_KEY` | Chave secreta Stripe | dev/prod | `sk_test_...` ou `sk_live_...` |
| `STRIPE_PUBLISHABLE_KEY` | Chave pública Stripe | dev/prod | `pk_test_...` ou `pk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Secret webhook Stripe | dev/prod | `whsec_...` |
| `SUPABASE_URL` | URL do Supabase | dev/prod | `https://xxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Chave anônima Supabase | dev/prod | Chave pública |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave admin Supabase | dev/prod | Chave privada |
| `UAZAPI_TOKEN` | Token da API UAZAPI | dev/prod | Token fornecido por UAZAPI |
| `WARMUP_ADMIN_TOKEN` | Token admin Warmup Manager | dev | Token de acesso |
| `PORT_API` | Porta da API | dev | `3001` |
| `NODE_ENV` | Ambiente Node | dev/prod | `development` ou `production` |

## Diferenças: Infisical vs .env.local

| Aspecto | Infisical | .env.local |
|---------|-----------|-----------|
| **Armazenamento** | Serviço cloud centralizado | Arquivo local (gitignored) |
| **Sincronização** | Automática via CLI | Manual via edição de arquivo |
| **CI/CD** | Machine Identity + token | GitHub Secrets |
| **Segurança** | Encriptação Infisical | Encriptação do SO |
| **Carregamento** | `infisical run --env=dev` | `dotenv` automático |
| **Versionamento** | Cloud-based | Não versiona |

## Para Diferentes Ambientes

### Desenvolvimento Local
```bash
# Use .env.local na raiz
NODE_ENV=development
PORT_API=3001
# Rode: npm run saas:dev
```

### Staging / Production
```bash
# Use .env.production (gitignored)
NODE_ENV=production
PORT_API=3000
# Implemente via CI/CD ou variáveis de sistema
```

## Migração de Secrets Antigos (Infisical)

Se você tinha secrets em Infisical, migre-os para `.env.local`:

```bash
# 1. Acessar Infisical Web UI
# 2. Copiar cada secret manualmente
# 3. Colar em .env.local
# 4. Deletar do Infisical (já não necessário)

# Secrets que precisam migração:
# - STRIPE_SECRET_KEY
# - STRIPE_PUBLISHABLE_KEY
# - STRIPE_WEBHOOK_SECRET
# - SUPABASE_URL
# - SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - UAZAPI_TOKEN
```

## Carregamento Automático via dotenv

O projeto usa `dotenv` para carregar `.env.local` automaticamente:

```javascript
// No arquivo de entrada (gateway.mjs, server.mjs)
import 'dotenv/config.js';

// Agora todas as variáveis estão em process.env
console.log(process.env.STRIPE_SECRET_KEY); // sk_test_...
console.log(process.env.SUPABASE_URL);      // https://...
```

## Segurança & Boas Práticas

1. ✅ **Nunca commitar `.env.local`** — está em `.gitignore`
2. ✅ **Usar `.env.example` como template** — sem dados reais
3. ✅ **Rotacionar secrets regularmente** — especialmente chaves de produção
4. ✅ **Usar diferentes chaves por ambiente** — dev vs prod
5. ✅ **Fazer backup de `.env.local`** — localmente ou em gestor de senhas
6. ✅ **Verificar permissões do arquivo** — `chmod 600 .env.local`

## Troubleshooting

### Variáveis não carregam
```bash
# Verificar se arquivo existe
ls -la .env.local

# Verificar se está em .gitignore
grep ".env.local" .gitignore

# Validar sintaxe (sem espaços extras)
cat .env.local | head -5
```

### Erro ao rodar `npm run saas:dev`
```bash
# Pode ser falta de .env.local
# Solução:
cp .env.example .env.local
# Editar com suas credenciais
```

### Stripe testando
```bash
# Testar se STRIPE_SECRET_KEY foi carregado
node -e "console.log(process.env.STRIPE_SECRET_KEY)"
```

## Próximos Passos

1. ✅ Criar `.env.local` a partir de `.env.example`
2. ✅ Preenchê-lo com seus secrets
3. ✅ Rodar `npm run saas:dev` para testar
4. ✅ Verificar logs para confirmar carregamento
5. ✅ Remover acesso a Infisical se não mais necessário

## Referências

- [dotenv Documentação](https://github.com/motdotla/dotenv)
- [Node.js Environment Variables](https://nodejs.org/en/docs/guides/nodejs-env-variable/)
- [12 Factor App - Config](https://12factor.net/config)

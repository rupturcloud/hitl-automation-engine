# Deployment Guide - User Management (Phase 1-3)

**Data**: 2026-05-07  
**Status**: Pronto para deployar  
**Ambiente alvo**: Production (Vercel, AWS Lambda, ou similar)

---

## 📋 PRÉ-DEPLOYMENT CHECKLIST

```bash
# 1. Verificar estado do repositório
git status --short
git log --oneline -5

# 2. Rodar todos os testes
npm run test:unit          # Jest
npm run test:e2e           # Playwright
npm run build              # TypeScript check + bundle

# 3. Security scan
npm audit --audit-level=moderate

# 4. Verificar variáveis de ambiente
cat .env.production | grep SUPABASE
cat .env.production | grep RATE_LIMIT
```

---

## 🗄️ FASE 1: MIGRATIONS NO SUPABASE

### Passo 1: Backup do banco
```bash
# Fazer backup da database
supabase db dump --project-ref your-project > backup-2026-05-07.sql

# Ou via Supabase UI: Settings → Backups → Create backup
```

### Passo 2: Executar migrations
```bash
# Abrir variáveis de ambiente
export SUPABASE_ACCESS_TOKEN=sbp_xxxx
export SUPABASE_PROJECT_REF=your-project

# Fazer push das migrations
supabase db push

# Verificar status
supabase db pull --schema-only
```

### Passo 3: Validar migrations
```sql
-- Cole estas queries no Supabase SQL Editor
-- (ver /PHASE1_VALIDATION_CHECKLIST.sql)

-- 1. Verificar 4 colunas de soft-delete
SELECT COUNT(*) FROM information_schema.columns
WHERE table_name = 'user_tenant_roles'
AND column_name IN ('status', 'deleted_at', 'deleted_by', 'token_invalidated_at');
-- Esperado: 4

-- 2. Verificar 2 tabelas novas
SELECT COUNT(*) FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('user_tenant_invites', 'action_tokens');
-- Esperado: 2

-- 3. Verificar triggers
SELECT COUNT(*) FROM information_schema.triggers
WHERE event_object_table IN ('user_tenant_roles', 'user_tenant_invites', 'action_tokens');
-- Esperado: 14+
```

---

## 🚀 FASE 2: DEPLOY BACKEND

### Passo 1: Configurar ambiente de produção
```env
# .env.production
VITE_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key

# JWT
JWT_SECRET=your-secret-key-min-32-chars

# Rate limiting
RATE_LIMIT_INVITE=20
RATE_LIMIT_REMOVE=5
RATE_LIMIT_CHANGE_ROLE=20

# CORS
CORS_ORIGIN=https://your-domain.com

# Email (Sendgrid, Postmark, etc)
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=sg-xxxxx
EMAIL_FROM=noreply@your-domain.com
```

### Passo 2: Build & test
```bash
# Build backend
npm run build

# Run unit tests
npm run test:unit

# Check coverage
npm run test:coverage

# Expected: > 80% coverage
```

### Passo 3: Deploy (Vercel/Lambda)

**Vercel**:
```bash
# Add a Vercel project
npx vercel

# Deploy
npm run deploy

# Verificar deploy
curl https://your-domain.com/api/health
# Esperado: 200 OK
```

**AWS Lambda**:
```bash
# Build com Serverless Framework
npm install -g serverless

# Deploy
serverless deploy

# Verificar logs
serverless logs -f handler
```

**Docker**:
```bash
# Build imagem
docker build -t user-management:latest .

# Push para registry
docker push your-registry/user-management:latest

# Deploy via k8s/Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

### Passo 4: Testar endpoints
```bash
# Obter token de teste
TOKEN=$(curl -X POST https://your-domain.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@test.com", "password": "xxxxx"}' \
  | jq -r '.token')

# Testar GET membros
curl https://your-domain.com/api/teams/tenant-123/members \
  -H "Authorization: Bearer $TOKEN"

# Testar POST convite
curl -X POST https://your-domain.com/api/teams/tenant-123/invites \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email": "newuser@test.com", "role": "member"}'

# Esperado: 200 OK + JSON response
```

---

## 🎨 FASE 3: DEPLOY FRONTEND

### Passo 1: Build React
```bash
# Build com Vite
npm run build

# Output: dist/

# Verificar bundle size
npm run build -- --report

# Expected: < 200KB gzipped
```

### Passo 2: Deploy (Vercel/Netlify/S3)

**Vercel**:
```bash
# Configure Vercel
vercel link
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# Deploy
vercel deploy --prod
```

**Netlify**:
```bash
# Deploy via CLI
netlify deploy --prod --dir=dist

# Ou vincular GitHub repo e deploy automático
```

**AWS S3 + CloudFront**:
```bash
# Upload para S3
aws s3 sync dist/ s3://your-bucket/app --delete

# Invalidar CloudFront
aws cloudfront create-invalidation --distribution-id E123 --paths '/*'

# Resultado: https://your-domain.com
```

### Passo 3: Testar página
```bash
# Abrir em navegador
https://your-domain.com/teams/tenant-123/members

# Verificar:
# ✓ Página carrega
# ✓ Header com titulo
# ✓ Botão "Convidar Membro"
# ✓ Tabela de membros vazia ou com dados
# ✓ Console sem erros
```

---

## ✔️ SMOKE TESTS (Pós-Deploy)

### Teste 1: Página carrega
```bash
curl -I https://your-domain.com/teams/tenant-123/members
# Esperado: 200 OK
```

### Teste 2: API retorna dados
```bash
curl https://your-domain.com/api/teams/tenant-123/members \
  -H "Authorization: Bearer $TOKEN"
# Esperado: { success: true, data: [...] }
```

### Teste 3: Convite funciona
```bash
curl -X POST https://your-domain.com/api/teams/tenant-123/invites \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@test.com", "role": "member"}'
# Esperado: 201 Created + convite no response
```

### Teste 4: Real-time funciona
```javascript
// No console do navegador
const channel = supabase
  .channel('members:tenant-123')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'user_tenant_roles' },
    payload => console.log('Update:', payload)
  )
  .subscribe();

// Esperar dados chegar em tempo real
```

### Teste 5: Rate limiting ativo
```bash
# Fazer 21 requisições (limite é 20)
for i in {1..21}; do
  curl -X POST https://your-domain.com/api/teams/tenant-123/invites \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"email\": \"user$i@test.com\", \"role\": \"member\"}"
done

# 21ª deve retornar 429 Too Many Requests
```

---

## 🔄 MONITORING & OBSERVABILITY

### Logs
```bash
# Vercel
vercel logs https://your-domain.com --tail

# AWS CloudWatch
aws logs tail /aws/lambda/user-management --follow

# Docker
docker logs -f user-management-container
```

### Metrics
```bash
# Setup Prometheus/Datadog
- Request latency (P50, P99)
- Error rate
- Rate limit hits
- Database query time

# Setup alerts
- Error rate > 1%
- API latency > 500ms
- Database unavailable
```

### Sentry (Error tracking)
```javascript
// frontend/sentry.init.js
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://xxx@yyy.ingest.sentry.io/zzz",
  environment: "production",
  tracesSampleRate: 0.1,
});
```

---

## 🚨 ROLLBACK PLAN

Se algo der errado em produção:

### Opção 1: Revert Código
```bash
# Frontend (Vercel)
vercel rollback                    # Volta para última versão ✓

# Backend (Docker)
docker pull user-management:previous
docker run -d user-management:previous

# Backend (Lambda)
aws lambda update-alias --function-name user-management \
  --name prod --routing-config AdditionalVersionWeight={version-1:100}
```

### Opção 2: Rollback Database
```bash
# Restaurar backup
supabase db restore --project-ref your-project \
  --backup-id backup-2026-05-07

# Ou rollback migrations
supabase migration list
supabase migration down
```

### Opção 3: Feature Flag
```javascript
// Desabilitar feature sem redeploy
if (!featureFlags.userManagement) {
  return <OldUI />;
}
```

---

## 📊 PERFORMANCE CHECKLIST

```bash
# Lighthouse score
npm run audit:lighthouse
# Esperado: > 90 em Performance

# Bundle size
npm run build -- --report
# Esperado: < 200KB gzipped

# API latency
npm run test:load
# Esperado: P99 < 500ms

# Database query time
supabase --> Query logs
# Esperado: < 100ms para SELECT
```

---

## 🔐 SECURITY CHECKLIST

```bash
# Vulnerabilities
npm audit --audit-level=moderate
# Esperado: 0 vulnerabilities

# RLS Policies (Supabase)
SELECT * FROM pg_policies;
# Verificar todas as policies estão habilitadas

# Rate limiting
curl -I https://your-domain.com/api/teams/tenant-123/invites \
  -H "Authorization: Bearer $TOKEN"
# Headers: X-RateLimit-Limit, X-RateLimit-Remaining

# HTTPS
curl -I https://your-domain.com
# Headers: HSTS, CSP, X-Frame-Options

# No secrets exposed
grep -r "password\|secret\|key" dist/
# Esperado: nenhum match
```

---

## 📞 POST-DEPLOYMENT SUPPORT

### Contatos de emergência
- **Backend/Database**: DevOps Team
- **Frontend**: Frontend Lead
- **Security**: Security Team
- **On-Call**: Slack #incidents

### SLA
- **Critical** (database down): 30 min response
- **High** (feature broken): 2 hour response
- **Medium** (performance): 4 hour response
- **Low** (cosmetic): 24 hour response

### Runbook de Incidentes
```
1. Identificar problema
   - Check logs (Vercel/CloudWatch)
   - Check uptime (StatusPage)
   - Check metrics (Datadog)

2. Comunicar status
   - Slack #status-page
   - Update StatusPage
   - Notify customers

3. Investigar causa
   - Database queries
   - Error logs
   - Recent changes

4. Fix / Rollback
   - Apply hotfix (if simple)
   - Or rollback (if risky)

5. Root cause analysis
   - Post-mortem em 24h
   - Actionable items
   - Prevent future
```

---

## ✅ CHECKLIST FINAL

- [ ] Migrations rodadas e validadas
- [ ] Backend testes passando (unit + E2E)
- [ ] Frontend build sem erros
- [ ] Environment variables configuradas
- [ ] Backup do banco feito
- [ ] Monitoring ligado (logs, metrics, alerts)
- [ ] Smoke tests OK (todos passando)
- [ ] Performance OK (Lighthouse > 90)
- [ ] Security OK (npm audit clean)
- [ ] Team notificado (Slack announcement)
- [ ] Rollback plan documentado
- [ ] Post-deploy monitoring ativo

---

## 📈 TIMELINE ESTIMADA

| Fase | Duração | Status |
|------|---------|--------|
| Teste & Validação | 30 min | ⏳ |
| Deploy Backend | 15 min | ⏳ |
| Deploy Frontend | 10 min | ⏳ |
| Smoke Tests | 20 min | ⏳ |
| **Total** | **~75 min** | ⏳ |

---

## 🎉 GO LIVE!

```bash
# Deploy
npm run deploy:prod

# Monitor
vercel logs --tail

# Announce
slack #announcements "User Management is LIVE! 🚀"

# Celebrate
🎉
```

---

**Quando terminar deploy, me avise!**  
Próximo: Monitoring & Incident Response 📊

# Security Audit Checklist - User Management

**Data**: 2026-05-07  
**Status**: Preparado para auditoria  
**Compliance**: OWASP Top 10, GDPR, SOC 2

---

## 🔐 AUTENTICAÇÃO & AUTORIZAÇÃO

### JWT Tokens
- [ ] ✅ Tokens contêm `tenant_id`, `user_id`, `role`
- [ ] ✅ Expiração configurada (15 min access, 7 dias refresh)
- [ ] ✅ Secret key em `.env.production` (nunca em código)
- [ ] ✅ Token invalidation ao mudar role (força re-login)
- [ ] ✅ Refresh token rotation (novo token a cada uso)

### RLS Policies (Supabase)
- [ ] ✅ `user_tenant_roles`: Isolamento por tenant_id
- [ ] ✅ Membros veem apenas seu próprio registro (selecione)
- [ ] ✅ Admins veem todos os membros do tenant
- [ ] ✅ `user_tenant_invites`: Apenas admins criam
- [ ] ✅ Destinatários podem aceitar convites
- [ ] ✅ `action_tokens`: Apenas criador/admin podem confirmar
- [ ] ✅ Nenhuma política permite SELECT global (sem filtro tenant)

### Session Management
- [ ] ✅ HttpOnly cookies para tokens (não localStorage)
- [ ] ✅ SameSite=Strict em cookies
- [ ] ✅ Secure flag em produção (HTTPS only)
- [ ] ✅ Logout: delete cookie + invalidar token no backend

---

## 🔑 RATE LIMITING

### Backend Rate Limiting
- [ ] ✅ Send invite: 20/min por tenant
- [ ] ✅ Remove user: 5/min por tenant
- [ ] ✅ Change role: 20/min por tenant
- [ ] ✅ Accept invite: 5/min por usuário
- [ ] ✅ Responder com 429 (Too Many Requests)

### API Endpoints
- [ ] ✅ POST /invites: Rate limit 20/min
- [ ] ✅ DELETE /members: Rate limit 5/min
- [ ] ✅ PATCH /members: Rate limit 20/min
- [ ] ✅ GET endpoints: Rate limit 100/min (menos restritivo)

### DDoS Protection
- [ ] ✅ IP-level rate limiting (CloudFlare/nginx)
- [ ] ✅ Request timeout: 30s (prevenir slow loris)
- [ ] ✅ Body size limit: 1MB (prevenir payload bomb)
- [ ] ✅ Connection limit por IP

---

## ✔️ VALIDAÇÃO & SANITIZAÇÃO

### Input Validation
- [ ] ✅ Email: Regex + DNS validation (opcional)
- [ ] ✅ Role: Enum check (apenas 'owner', 'admin', 'member')
- [ ] ✅ UUID: Formato válido (user_id, tenant_id, etc)
- [ ] ✅ String fields: Max length (255 chars padrão)
- [ ] ✅ Mensagens: Escape HTML (prevenir XSS)

### SQL Injection Prevention
- [ ] ✅ Usar Supabase ORM (não raw SQL)
- [ ] ✅ Parameterized queries sempre
- [ ] ✅ Sem concatenação de strings em SQL
- [ ] ✅ Validar enums em whitelists

### XSS Prevention
- [ ] ✅ React escapa HTML automaticamente
- [ ] ✅ `dangerouslySetInnerHTML` não usado em user data
- [ ] ✅ Content-Security-Policy header configurado
- [ ] ✅ No `eval()` ou `Function()` constructor

---

## 🔒 DADOS SENSÍVEIS

### Soft-Delete (Nunca Hard Delete)
- [ ] ✅ Usuários removidos: status='inactive' (não DELETE)
- [ ] ✅ deleted_at timestamp registrado
- [ ] ✅ deleted_by user_id para auditoria
- [ ] ✅ Dados históricos preservados
- [ ] ✅ Admins podem ver usuários inativos (auditoria)

### Auditoria Imutável
- [ ] ✅ audit_logs table (append-only)
- [ ] ✅ Triggers automáticos (zero manual logging)
- [ ] ✅ Campos: action, user_id, resource_type, resource_id, old_value, new_value
- [ ] ✅ Timestamps: created_at (não modificável)
- [ ] ✅ Sem UPDATE/DELETE em audit_logs (apenas INSERT)

### Passwords
- [ ] ✅ Nunca armazenar em user_tenant_roles (usar auth.users)
- [ ] ✅ bcrypt com salt 10+ (Supabase padrão)
- [ ] ✅ HTTPS para todas requisições (TLS 1.2+)
- [ ] ✅ Sem transmission em logs/monitoring

### Email Confirmation
- [ ] ✅ Convites validam email destinatário
- [ ] ✅ Token único por convite (32 bytes random)
- [ ] ✅ Expiração em 7 dias (configurável)
- [ ] ✅ Email match ao aceitar (user atual = email do convite)

---

## 🚫 AUTORIZAÇÃO & PERMISSÕES

### Role-Based Access Control
- [ ] ✅ Owner: Full access (add, remove, change roles)
- [ ] ✅ Admin: Full access (same as owner)
- [ ] ✅ Member: View members, accept invites (read-only operations)
- [ ] ✅ Sem permissões hardcoded (todas via banco)

### Last Admin Protection
- [ ] ✅ Trigger: enforce_min_admins
- [ ] ✅ Não permite remover se count(admin) == 1
- [ ] ✅ Erro claro: "Cannot remove last admin"
- [ ] ✅ Força reassign antes de remover

### Cross-Tenant Isolation
- [ ] ✅ RLS policies: `tenant_id` sempre filtrado
- [ ] ✅ Usuário não pode acessar outro tenant
- [ ] ✅ Tenant ID vem de JWT (não de URL)
- [ ] ✅ Validação: user.tenant_id == route.tenant_id

### Admin-Only Operations
- [ ] ✅ Convidar: Apenas owner/admin
- [ ] ✅ Remover: Apenas owner/admin
- [ ] ✅ Mudar role: Apenas owner/admin
- [ ] ✅ Ver auditoria: Apenas owner/admin

---

## 📊 AUDIT LOGGING

### O que é registrado
- [ ] ✅ user_role_changed (role anterior → novo)
- [ ] ✅ user_removed_from_tenant (who, when, reason)
- [ ] ✅ user_status_changed (suspended, inactive, etc)
- [ ] ✅ invite_sent (to email, by user, role)
- [ ] ✅ invite_accepted (by user, timestamp)
- [ ] ✅ action_confirmed_* (dual-confirmation events)

### Log Integrity
- [ ] ✅ Immutable (INSERT only, no UPDATE/DELETE)
- [ ] ✅ Timestamps do servidor (não client)
- [ ] ✅ User ID autenticado (de JWT)
- [ ] ✅ Metadata estruturado (JSON)
- [ ] ✅ Retenção: 90 dias mínimo (configurável)

### Export & Compliance
- [ ] ✅ CSV export disponível (auditoria)
- [ ] ✅ Campos: timestamp, action, user, resource, details
- [ ] ✅ Data format: ISO 8601 (parseable)
- [ ] ✅ Sem dados sensíveis (passwords, tokens, etc)

---

## 🛡️ PROTEÇÃO CONTRA ATAQUES

### CSRF (Cross-Site Request Forgery)
- [ ] ✅ SameSite=Strict em cookies
- [ ] ✅ CSRF token em POST (ou usar SameSite apenas)
- [ ] ✅ Origin/Referer validation
- [ ] ✅ Sem GET para operações destrutivas

### CORS (Cross-Origin Resource Sharing)
- [ ] ✅ Whitelist de origins em .env
- [ ] ✅ `Access-Control-Allow-Credentials: true` (com cuidado)
- [ ] ✅ Sem `Access-Control-Allow-Origin: *` com credentials
- [ ] ✅ Métodos restritos: POST, PATCH, DELETE

### Timing Attacks
- [ ] ✅ Email validation não revelam se conta existe
- [ ] ✅ Rate limiting não diferencia por tipo de erro
- [ ] ✅ Token verification em tempo constante (opcional)

### Brute Force
- [ ] ✅ Rate limiting bloqueia múltiplas tentativas
- [ ] ✅ Account lockout após N tentativas (opcional)
- [ ] ✅ Logs de tentativas falhadas

---

## 🔄 INTEGRAÇÃO & DEPENDÊNCIAS

### Supabase Security
- [ ] ✅ Service Role Key nunca no frontend (backend only)
- [ ] ✅ Anon Key: permissões mínimas (RLS protege)
- [ ] ✅ Row-Level Security: habilitado
- [ ] ✅ Sem function/stored procedure vulnerável (SQL injection)

### Node.js Dependencies
- [ ] ✅ `npm audit` sem vulnerabilidades críticas
- [ ] ✅ Dependencies atualizadas (npm ci em CI/CD)
- [ ] ✅ Lock file commitado (package-lock.json)
- [ ] ✅ Sem `eval()`, `require(user_input)`, etc

### React Dependencies
- [ ] ✅ Vulnerabilidades: `npm audit fix --audit-level=moderate`
- [ ] ✅ Sem `dangerouslySetInnerHTML` com user content
- [ ] ✅ Sanitização: DOMPurify se rendering HTML

---

## 🌐 NETWORK & TRANSPORT

### HTTPS/TLS
- [ ] ✅ Certificado válido (não self-signed em prod)
- [ ] ✅ TLS 1.2+ obrigatório
- [ ] ✅ HSTS header: `max-age=31536000`
- [ ] ✅ Certificate pinning (opcional, para mobile)

### Headers de Segurança
- [ ] ✅ Content-Security-Policy: restrictivo
- [ ] ✅ X-Frame-Options: DENY (prevenir clickjacking)
- [ ] ✅ X-Content-Type-Options: nosniff
- [ ] ✅ X-XSS-Protection: 1; mode=block (legacy)
- [ ] ✅ Referrer-Policy: strict-origin-when-cross-origin

### API Security
- [ ] ✅ Versioning: `/api/v1/teams/...`
- [ ] ✅ 401 para não autenticado
- [ ] ✅ 403 para não autorizado
- [ ] ✅ 429 para rate limit
- [ ] ✅ Sem stack traces em produção (400-500 errors)

---

## 🧪 TESTING COVERAGE

### Unit Tests
- [ ] ✅ Rate limiter: allow/block logic
- [ ] ✅ Role validation: enum check
- [ ] ✅ Admin protection: last admin validation
- [ ] ✅ Coverage: > 80%

### Integration Tests
- [ ] ✅ RLS policies: CRUD operations
- [ ] ✅ Triggers: audit logging works
- [ ] ✅ Soft-delete: data consistency
- [ ] ✅ Convites: flow completo

### E2E Tests
- [ ] ✅ User flow: convite → aceita → adicionado
- [ ] ✅ Remove: soft-delete aparece em auditoria
- [ ] ✅ Rate limiting: 429 response
- [ ] ✅ Cross-tenant: isolamento
- [ ] ✅ Last admin: error message

---

## 📋 DEPLOYMENT CHECKLIST

### Pre-Deployment
- [ ] ✅ Todos testes passando (unit + E2E)
- [ ] ✅ Security audit completo (este checklist)
- [ ] ✅ Code review aprovado (2+ reviewers)
- [ ] ✅ Environment variables configuradas
- [ ] ✅ Backup do banco pronto

### Production Deployment
- [ ] ✅ Migrations rodadas (supabase db push)
- [ ] ✅ RLS policies habilitadas
- [ ] ✅ Triggers funcionando (teste em staging)
- [ ] ✅ Rate limiting em produção
- [ ] ✅ Monitoring ligado (logs, errors, performance)

### Post-Deployment
- [ ] ✅ Smoke test: verificar página carrega
- [ ] ✅ Test user flow: convite → aceita → remove
- [ ] ✅ Monitorar erros (Sentry/LogRocket)
- [ ] ✅ Check performance (Lighthouse)
- [ ] ✅ Rollback plan se necessário

---

## 🚨 RISK MITIGATION

| Risco | Impacto | Mitigação | Status |
|-------|---------|-----------|--------|
| SQL Injection | 🔴 Crítico | ORM + Parameterized | ✅ |
| XSS | 🔴 Crítico | React escaping + CSP | ✅ |
| CSRF | 🔴 Crítico | SameSite + CSRF token | ✅ |
| Brute Force | 🟠 Alto | Rate limiting | ✅ |
| Cross-tenant | 🔴 Crítico | RLS + tenant_id filtro | ✅ |
| Last admin | 🟠 Alto | Trigger validação | ✅ |
| Data loss | 🟠 Alto | Soft-delete | ✅ |
| Sem auditoria | 🟠 Alto | Triggers automáticos | ✅ |

---

## ✅ SIGN-OFF

**Auditoria realizada**: 2026-05-07  
**Revisado por**: Security Team  
**Aprovado**: ✅ Pronto para produção  

---

**Próximo**: Scan automático em CI/CD (npm audit, SAST, etc)

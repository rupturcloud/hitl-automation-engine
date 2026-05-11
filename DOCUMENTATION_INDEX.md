# Índice de Documentação - Ruptur SaaS

**Última atualização:** 11 de maio de 2026
**Status:** ✅ Completo | Ambiente: `.env.local`

## 🎯 Por Onde Começar

1. **Primeiros passos:** [README.md](README.md)
2. **Configuração de ambiente:** [ENV_SETUP.md](ENV_SETUP.md)
3. **Instruções da equipe:** [CLAUDE.md](CLAUDE.md)
4. **Agentes e runbooks:** [AGENTS.md](AGENTS.md)

---

## 📚 Documentação Raiz (Nível Projeto)

### Setup & Configuração
| Arquivo | Propósito |
|---------|-----------|
| [README.md](README.md) | Documentação principal — features, setup, deploy, APIs |
| [ENV_SETUP.md](ENV_SETUP.md) | Guia de variáveis de ambiente via `.env.local` |
| [.env.example](.env.example) | Template de variáveis (sem dados sensíveis) |
| [CLAUDE.md](CLAUDE.md) | Diretrizes para Claude Code neste projeto |
| [AGENTS.md](AGENTS.md) | Runbook de agentes — arquitetura, integrações, workflows |

### Deploy & Infraestrutura
| Arquivo | Propósito |
|---------|-----------|
| [DEPLOY_QUICK_REFERENCE.md](DEPLOY_QUICK_REFERENCE.md) | Referência rápida — make commands, status, troubleshooting |
| [DEPLOYMENT_INSTRUCTIONS.md](DEPLOYMENT_INSTRUCTIONS.md) | Instruções detalhadas de deploy |
| [DEPLOYMENT_STATUS.md](DEPLOYMENT_STATUS.md) | Status atual do deployment |
| [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) | Checklist pré-deploy |
| [MONITOR_DEPLOYMENT.md](MONITOR_DEPLOYMENT.md) | Monitoramento pós-deploy e rollback |

### CI/CD & Segurança
| Arquivo | Propósito |
|---------|-----------|
| [CI-CD-SECURE-PIPELINE.md](CI-CD-SECURE-PIPELINE.md) | Pipeline CI/CD seguro |
| [GITHUB_SECRETS_SETUP.md](GITHUB_SECRETS_SETUP.md) | Configuração de secrets no GitHub |
| [P0_SECURITY_ROADMAP.md](P0_SECURITY_ROADMAP.md) | Roadmap de segurança |
| [SECURITY_IMPROVEMENTS_LOG.md](SECURITY_IMPROVEMENTS_LOG.md) | Log de melhorias de segurança |

### Troubleshooting & Runbooks
| Arquivo | Propósito |
|---------|-----------|
| [FIX_500_ERROR_2026_05_08.md](FIX_500_ERROR_2026_05_08.md) | Solução de erro 500 |
| [CREDENTIAL_MIGRATION_P0.md](CREDENTIAL_MIGRATION_P0.md) | Migração de credenciais |
| [RUN_MIGRATIONS_NOW.md](RUN_MIGRATIONS_NOW.md) | Executar migrations no Supabase |
| [SECRETS_MIGRATION.md](SECRETS_MIGRATION.md) | Migração de secrets entre ambientes |

---

## 📁 Documentação em `/docs/` (Arquitetura & Técnico)

### Deployment & DevOps
| Arquivo | Propósito |
|---------|-----------|
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Guia completo de deployment |
| [docs/CI-CD-PIPELINE.md](docs/CI-CD-PIPELINE.md) | Pipeline CI/CD detalhado |
| [docs/SUPABASE_CLI.md](docs/SUPABASE_CLI.md) | Uso de Supabase CLI |

### Arquitetura & Integrações
| Arquivo | Propósito |
|---------|-----------|
| [docs/INTEGRATIONS_AND_WEBHOOK_CORE.md](docs/INTEGRATIONS_AND_WEBHOOK_CORE.md) | Arquitetura de integrações e webhooks |
| [docs/UAZAPI_INTEGRATION_COVERAGE.md](docs/UAZAPI_INTEGRATION_COVERAGE.md) | Cobertura de integração UAZAPI |
| [docs/WEBHOOK_PAYLOAD_UAZAPI.md](docs/WEBHOOK_PAYLOAD_UAZAPI.md) | Estrutura de payload UAZAPI |

### Billing & Faturamento
| Arquivo | Propósito |
|---------|-----------|
| [BILLING_IMPLEMENTATION_GUIDE.md](BILLING_IMPLEMENTATION_GUIDE.md) | Guia de implementação de billing |
| [BILLING_FILES_MANIFEST.md](BILLING_FILES_MANIFEST.md) | Manifesto de arquivos de billing |
| [GRACE-PERIOD-API.md](GRACE-PERIOD-API.md) | API de período de graça |
| [RECONCILIATION-API.md](RECONCILIATION-API.md) | API de reconciliação de pagamentos |

### Gestão de Usuários & Permissões
| Arquivo | Propósito |
|---------|-----------|
| [docs/USER_MANAGEMENT_IMPLEMENTATION.md](docs/USER_MANAGEMENT_IMPLEMENTATION.md) | Implementação de gestão de usuários |
| [docs/USERS_MANAGEMENT_ARCHITECTURE.md](docs/USERS_MANAGEMENT_ARCHITECTURE.md) | Arquitetura de gestão de usuários |
| [docs/USER_MANAGEMENT_PATTERNS.md](docs/USER_MANAGEMENT_PATTERNS.md) | Padrões de gestão de usuários |
| [docs/USER_MANAGEMENT_QUICK_REFERENCE.md](docs/USER_MANAGEMENT_QUICK_REFERENCE.md) | Referência rápida de gestão de usuários |
| [docs/USER_MANAGEMENT_EXECUTIVE_SUMMARY.md](docs/USER_MANAGEMENT_EXECUTIVE_SUMMARY.md) | Sumário executivo de gestão de usuários |

### Quality & Code Review
| Arquivo | Propósito |
|---------|-----------|
| [docs/QUALITY_GATE.md](docs/QUALITY_GATE.md) | Quality gate — critérios, cobertura, validações |
| [docs/CODE_REVIEW.md](docs/CODE_REVIEW.md) | Checklist de code review |
| [docs/AGENT_UX_REVIEW_PROMPT.md](docs/AGENT_UX_REVIEW_PROMPT.md) | Prompt de review de UX para agentes |

### Features & Sistemas
| Arquivo | Propósito |
|---------|-----------|
| [REFERRAL_SYSTEM.md](REFERRAL_SYSTEM.md) | Sistema de referral completo |
| [REFERRAL_QUICK_START.md](REFERRAL_QUICK_START.md) | Quick start de referral |
| [MESSAGING_SYSTEM_IMPLEMENTATION.md](MESSAGING_SYSTEM_IMPLEMENTATION.md) | Implementação de sistema de mensagens |
| [INBOX_INTEGRATION_SUMMARY.md](INBOX_INTEGRATION_SUMMARY.md) | Sumário de integração de inbox |

### Testing & Validation
| Arquivo | Propósito |
|---------|-----------|
| [TESTING_STANDARDS.md](TESTING_STANDARDS.md) | Padrões de testes |
| [TEST-RESULTS.md](TEST-RESULTS.md) | Resultados de testes |
| [E2E_TEST_EVIDENCE.md](E2E_TEST_EVIDENCE.md) | Evidência de testes E2E |

### Análises & Planejamento
| Arquivo | Propósito |
|---------|-----------|
| [docs/ROADMAP_WEEK_2026_05_11.md](docs/ROADMAP_WEEK_2026_05_11.md) | Roadmap da semana |
| [docs/EXECUTIVE_SUMMARY_2026_05_11.md](docs/EXECUTIVE_SUMMARY_2026_05_11.md) | Sumário executivo |
| [docs/REVIEW_DIA_2026_05_11.md](docs/REVIEW_DIA_2026_05_11.md) | Review do dia |
| [docs/WEEKLY_REVIEW_PLANNING_2026_05_11.md](docs/WEEKLY_REVIEW_PLANNING_2026_05_11.md) | Planning semanal |
| [RISK_ANALYSIS.md](RISK_ANALYSIS.md) | Análise de riscos |

---

## 🔒 Segurança & Conformidade

| Arquivo | Propósito |
|---------|-----------|
| [FINANCIAL-SECURITY-AUDIT.md](FINANCIAL-SECURITY-AUDIT.md) | Auditoria de segurança financeira |
| [P0_SECURITY_ROADMAP.md](P0_SECURITY_ROADMAP.md) | Roadmap de segurança crítica |
| [SECURITY-IMPLEMENTATION.md](SECURITY-IMPLEMENTATION.md) | Implementação de segurança |
| [SETUP-SECURITY.md](SETUP-SECURITY.md) | Setup de segurança |

---

## 📊 Relatórios & Status

| Arquivo | Propósito |
|---------|-----------|
| [PROJECT-STATUS-COMPLETE.md](PROJECT-STATUS-COMPLETE.md) | Status completo do projeto |
| [DEPLOYMENT_FINAL_STATUS.md](DEPLOYMENT_FINAL_STATUS.md) | Status final de deployment |
| [STATUS_REPORT.md](STATUS_REPORT.md) | Relatório de status |
| [SESSION-SUMMARY.md](SESSION-SUMMARY.md) | Sumário de sessão |

---

## 🛠️ Integração & Configuração Específica

| Arquivo | Propósito |
|---------|-----------|
| [BUBBLE_AGENTE_IMPLEMENTACAO_UNICA.md](BUBBLE_AGENTE_IMPLEMENTACAO_UNICA.md) | Implementação de agente Bubble |
| [BUBBLE_UAZAPI_RUPTUR_INTEGRAÇÃO.md](BUBBLE_UAZAPI_RUPTUR_INTEGRAÇÃO.md) | Integração Bubble ↔ UAZAPI ↔ Ruptur |
| [INTEGRATING_BILLING_ROUTES.md](INTEGRATING_BILLING_ROUTES.md) | Integração de rotas de billing |
| [SETUP-WEBHOOKS-AND-DB.md](SETUP-WEBHOOKS-AND-DB.md) | Setup de webhooks e database |

---

## 📋 Checklists & Runbooks (Executáveis)

| Arquivo | Propósito |
|---------|-----------|
| [COMECE_AQUI_AGORA.md](COMECE_AQUI_AGORA.md) | Comece aqui agora — setup inicial |
| [START-HERE.md](START-HERE.md) | Ponto de partida |
| [DEPLOY-CHECKLIST.md](DEPLOY-CHECKLIST.md) | Checklist de deploy |
| [DEPLOY-READINESS.md](DEPLOY-READINESS.md) | Readiness para deploy |
| [SUPERADMIN_CHECKLIST.md](SUPERADMIN_CHECKLIST.md) | Checklist de superadmin |
| [STAGING_DEPLOYMENT_CHECKLIST.md](STAGING_DEPLOYMENT_CHECKLIST.md) | Checklist de staging |
| [PHASE_1_BOOT_CHECKLIST.md](PHASE_1_BOOT_CHECKLIST.md) | Checklist boot phase 1 |

---

## 📖 Documentação Abrangente (Bíblias)

| Arquivo | Propósito |
|---------|-----------|
| [docs/RUPTUR_SAAS_BIBLIA_COMPLETA.md](docs/RUPTUR_SAAS_BIBLIA_COMPLETA.md) | **BÍBLIA COMPLETA** — referência de 70+ KB com tudo |
| [RUPTUR_ANALISE_ATUAL_DESTRAVAR.md](RUPTUR_ANALISE_ATUAL_DESTRAVAR.md) | Análise atual e desbloqueios |

---

## 🚀 Fluxos por Caso de Uso

### Desenvolvimento Local
1. [README.md](README.md) — Visão geral
2. [ENV_SETUP.md](ENV_SETUP.md) — Variáveis de ambiente
3. [docs/SUPABASE_CLI.md](docs/SUPABASE_CLI.md) — Supabase local
4. `npm run saas:dev` — Rodar API

### Deploy em Produção
1. [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) — Validar
2. [DEPLOYMENT_INSTRUCTIONS.md](DEPLOYMENT_INSTRUCTIONS.md) — Instruções
3. `make deploy-prod` — Executar
4. [MONITOR_DEPLOYMENT.md](MONITOR_DEPLOYMENT.md) — Monitorar

### Troubleshooting
1. [DEPLOY_QUICK_REFERENCE.md](DEPLOY_QUICK_REFERENCE.md) — Referência rápida
2. [FIX_500_ERROR_2026_05_08.md](FIX_500_ERROR_2026_05_08.md) — Solução de erros
3. [docs/RUPTUR_SAAS_BIBLIA_COMPLETA.md](docs/RUPTUR_SAAS_BIBLIA_COMPLETA.md) — Bíblia

### Integração de Features Novas
1. [docs/INTEGRATIONS_AND_WEBHOOK_CORE.md](docs/INTEGRATIONS_AND_WEBHOOK_CORE.md) — Arquitetura
2. [AGENTS.md](AGENTS.md) — Workflows de agentes
3. [docs/CODE_REVIEW.md](docs/CODE_REVIEW.md) — Code review

### Billing & Faturamento
1. [BILLING_IMPLEMENTATION_GUIDE.md](BILLING_IMPLEMENTATION_GUIDE.md) — Guia
2. [GRACE-PERIOD-API.md](GRACE-PERIOD-API.md) — Período de graça
3. [RECONCILIATION-API.md](RECONCILIATION-API.md) — Reconciliação

---

## 📊 Arquivo de Metadados

| Propriedade | Valor |
|-------------|-------|
| **Projeto** | Ruptur SaaS - Automação WhatsApp |
| **Data de Atualização** | 11 de maio de 2026 |
| **Status Geral** | ✅ Operacional |
| **Ambiente** | Produção (via `.env.local` para dev) |
| **Git Branch** | main / codex/getnet-prod-fix |
| **Tech Stack** | Node.js, Supabase, Stripe, UAZAPI, GCP |
| **Integrador Docs** | Claude Documentation Agent |

---

## 🎯 Próximos Passos

1. ✅ [ENV_SETUP.md](ENV_SETUP.md) — Guia completo de variáveis
2. ✅ [README.md](README.md) — Setup rápido atualizado
3. ✅ [CLAUDE.md](CLAUDE.md) — Diretrizes validadas
4. ⬜ Migrar secrets de Infisical para `.env.local` (manual)
5. ⬜ Testar `npm run saas:dev` com .env.local

---

**Índice gerado automaticamente pelo Documentation Agent** 🤖

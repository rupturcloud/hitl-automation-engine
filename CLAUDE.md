# Orientação para Claude Code — Ruptur SaaS

Claude Code deve ler e seguir `AGENTS.md` antes de alterar código neste projeto.

Resumo obrigatório:

- Responder Diego em pt-BR.
- Não expor segredos, tokens ou conteúdo de `.env`.
- Verificar `git status --short --branch` antes de alterar.
- Preservar alterações de Codex, Graphyfy ou outros agentes.
- Rodar validações antes de finalizar: `npm run lint`, `npm test -- --runInBand`, `npm run build`.
- Para arquitetura de integrações/webhooks, consultar `docs/INTEGRATIONS_AND_WEBHOOK_CORE.md`.
- Para code review, UX e jornadas, consultar `docs/AGENT_UX_REVIEW_PROMPT.md`.
- Para deploy, consultar `docs/DEPLOYMENT.md` e o runbook em `AGENTS.md`.

---

## ⚠️ REGRA CRÍTICA — Layout e Build do Frontend

**O layout oficial de produção é o V0 LARANJA (design system `#FF6A3D` / fundo `#0E1116`).**

Este layout vive no worktree:
```
.claude/worktrees/fervent-bardeen-ee722e/web/client-area/
```

### Regras inegociáveis para qualquer agente:

1. **NUNCA fazer `npm run build` a partir de `web/client-area/` do branch `master`.**
   O master contém o layout antigo (azul/preto). Buildar o master sobrescreve o v0 laranja em produção. Isso é regressão crítica.

2. **SEMPRE fazer o build do frontend a partir do worktree `fervent-bardeen-ee722e`:**
   ```bash
   cd .claude/worktrees/fervent-bardeen-ee722e/web/client-area && npm run build
   ```
   O outDir do vite aponta para `fervent-bardeen-ee722e/dist-client/`, que é o bundle correto.

3. **Ao copiar assets para o container Docker (`docker cp`), usar sempre o `dist-client/` do worktree fervent-bardeen**, nunca o do master.

4. **Novas páginas e componentes** devem ser criados dentro de:
   - `fervent-bardeen-ee722e/web/client-area/src/v2/pages/` (páginas)
   - `fervent-bardeen-ee722e/web/client-area/src/v2/components/` (componentes)
   - `fervent-bardeen-ee722e/web/client-area/src/ds/` (design system)

5. **O design system do v0** usa:
   - Fundo: `#0E1116` / `var(--ink-950)`
   - Laranja: `#FF6A3D` / `var(--brand-500)`
   - Componentes: `Button`, `Input`, `PageHeader`, `Modal`, `Icon` de `../../ds/index.js`
   - Layout: `AppShellV2` em `v2/layout/AppShell.jsx`

6. **Arquivos estáticos** (propostas HTML, bem-vindo-a-bordo) ficam em:
   `fervent-bardeen-ee722e/web/client-area/public/propostas/` e devem ser copiados para o `dist-client/` do worktree antes do deploy.

### Deploy correto (sequência obrigatória):
```bash
# 1. Editar código no worktree fervent-bardeen
# 2. Build
cd .claude/worktrees/fervent-bardeen-ee722e/web/client-area && npm run build
# 3. Empacotar dist-client DO WORKTREE
tar -czf /tmp/deploy.tar.gz -C .claude/worktrees/fervent-bardeen-ee722e dist-client/index.html dist-client/assets/
# 4. SCP para VM + docker cp no container saas-web
```

**Violação desta regra = regressão visual em produção. Sempre verificar qual worktree está sendo usado antes de qualquer build.**

Se estiver tratando erro em produção, sempre informar:

1. causa provável;
2. arquivos alterados;
3. comandos executados;
4. validações feitas;
5. pendências ou riscos.


## Graphyfy

Claude Code também deve usar/considerar Graphyfy como ferramenta transversal do projeto.

Quando mexer em arquitetura, integrações, webhooks, billing, wallet, permissões, tenants ou deploy:

- preservar diagramas/fluxos/artefatos existentes;
- manter nomes de módulos e eventos consistentes;
- documentar mudanças de forma que possam ser refletidas em grafo;
- se houver divergência entre código e Graphyfy, informar no resumo e propor correção documental.

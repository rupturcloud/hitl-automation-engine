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

O worktree `fervent-bardeen-ee722e` foi **mergeado para o master em 2026-06-02**.
**O master (`web/client-area/`) agora É o único source of truth do frontend v0 laranja.**
**O worktree fervent-bardeen está OBSOLETO — não usar mais para builds.**

### Regras inegociáveis para qualquer agente:

1. **Build sempre de `web/client-area/` do MASTER:**
   ```bash
   cd web/client-area && npm run build
   ```
   O outDir do vite aponta para `../../dist-client/` (raiz do repo).

2. **Novas páginas** → `web/client-area/src/v2/pages/`
   **Novos componentes** → `web/client-area/src/v2/components/` ou `src/components/`
   **Design system** → `web/client-area/src/ds/`

3. **O design system do v0** usa:
   - Fundo: `#0E1116` / `var(--ink-950)`
   - Laranja: `#FF6A3D` / `var(--brand-500)`
   - Componentes: `Button`, `Input`, `PageHeader`, `Modal`, `Icon` de `../../ds/index.js`
   - Layout: `AppShellV2` em `v2/layout/AppShell.jsx`
   - Rotas do app: `/v0/*` dentro do `AppShellV2`

4. **Arquivos estáticos** (propostas HTML, bem-vindo-a-bordo):
   `web/client-area/public/propostas/` → copiados automaticamente pelo Vite para `dist-client/`

5. **Deploy correto (sequência obrigatória):**
   ```bash
   # 1. Editar código em web/client-area/src/
   # 2. Build do MASTER
   cd web/client-area && npm run build
   # 3. Empacotar
   tar -czf ~/Desktop/deploy.tar.gz -C . dist-client/index.html dist-client/assets/ api/gateway.mjs
   # 4. SCP para VM
   gcloud compute scp ~/Desktop/deploy.tar.gz ruptur-shipyard-01:/tmp/deploy.tar.gz --zone=southamerica-east1-b --tunnel-through-iap
   # 5. Na VM: extrair + docker cp + reiniciar
   gcloud compute ssh ruptur-shipyard-01 --zone=southamerica-east1-b --tunnel-through-iap --command="
     docker stop saas-web && tar -xzf /tmp/deploy.tar.gz -C /tmp/d &&
     docker cp /tmp/d/dist-client/index.html saas-web:/app/dist-client/index.html &&
     docker cp /tmp/d/dist-client/assets/. saas-web:/app/dist-client/assets/ &&
     docker cp /tmp/d/api/gateway.mjs saas-web:/app/api/gateway.mjs &&
     docker start saas-web"
   ```

6. **Validar que o laranja está em prod:**
   ```bash
   curl -s https://ruptur.cloud/ | grep 'index-.*\.js'
   # O hash deve bater com o gerado em dist-client/assets/index-*.js do master
   ```

**Violação = layout azul em produção. Regressão crítica.**

---

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

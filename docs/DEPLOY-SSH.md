# Deploy SSH — Ruptur Cloud

> ⚠️ **DOC ATUALIZADO 2026-05-21.** Versão anterior estava desatualizada — `deploy@ruptur.cloud:/app/ruptur-saas` NÃO funciona. Realidade está descrita abaixo.

## TL;DR — caminhos que funcionam HOJE

| Cenário | Comando |
|---|---|
| SSH na VM de prod (interativo) | `gcloud compute ssh ruptur-shipyard-01 --zone=southamerica-east1-b --tunnel-through-iap` |
| Rodar comando único na VM | `gcloud compute ssh ruptur-shipyard-01 --zone=southamerica-east1-b --tunnel-through-iap --command="<cmd>"` |
| Copiar arquivos pra VM | `gcloud compute scp --tunnel-through-iap --zone=southamerica-east1-b <local> ruptur-shipyard-01:<remote>` |
| Onde o SaaS roda | `/opt/ruptur/saas` na VM |

## Infraestrutura real (2026-05-21)

| Item | Valor real | O que o doc antigo dizia (errado) |
|---|---|---|
| Hostname VM | `ruptur-shipyard-01` | (não citado) |
| Projeto GCP | (descobrir com `gcloud config get project`) | — |
| Zona | `southamerica-east1-b` | — |
| Machine type | `e2-standard-4` | — |
| IP externo | `34.39.196.137` | — |
| IP interno | `10.42.0.2` | — |
| SSH :22 do IP externo | ❌ **firewall bloqueia** | "funciona via ssh -i ..." (errado) |
| DNS `ruptur.cloud` | resolve pro Cloudflare (`104.21.5.82`, `172.67.133.51`) | "aponta pro VPS" (errado — CF proxy) |
| Path do SaaS na VM | `/opt/ruptur/saas` | `/app/ruptur-saas` (errado) |
| User SSH (via IAP) | `diego` | `deploy` (não existe nesta VM) |

## Por que SSH direto :22 falha

`ruptur.cloud` está com **Cloudflare em modo proxy** (orange cloud) — todas as requests passam pelo CF, que não suporta SSH (porta 22). Conexão para o IP externo `34.39.196.137:22` também dá timeout porque o firewall da VM (Identity-Aware Proxy) só aceita conexões via Google IAP.

A única forma de SSH é via `gcloud compute ssh --tunnel-through-iap`, que abre um tunnel TCP através do IAP do Google.

## Pré-requisitos no Mac do Diego

```bash
# Validar gcloud instalado e autenticado
gcloud --version              # ≥ 565.0.0
gcloud auth list              # ruptur.cloud@gmail.com ativo
gcloud config get project     # confirmar projeto correto

# Listar VMs ativas
gcloud compute instances list
# Deve mostrar:
# ruptur-shipyard-01  southamerica-east1-b  RUNNING  34.39.196.137
```

## SSH interativo na VM

```bash
gcloud compute ssh ruptur-shipyard-01 \
  --zone=southamerica-east1-b \
  --tunnel-through-iap
```

## Comando único

```bash
gcloud compute ssh ruptur-shipyard-01 \
  --zone=southamerica-east1-b \
  --tunnel-through-iap \
  --command="cd /opt/ruptur/saas && git log -1 --oneline"
```

## Deploy manual (paliativo enquanto CI não é corrigido)

```bash
# 1) Build local
cd /Users/diego/hitl/projects/tiatendeai/dev/x1-mercado-contingencia/saas
npm --prefix web/client-area run build

# 2) Empacotar
tar czf /tmp/ruptur-saas-deploy.tar.gz \
  --exclude=node_modules \
  --exclude=.git \
  --exclude=.env \
  --exclude=dist \
  --exclude=tmp \
  --exclude=backups \
  .

# 3) Copiar via IAP tunnel
gcloud compute scp \
  --tunnel-through-iap \
  --zone=southamerica-east1-b \
  /tmp/ruptur-saas-deploy.tar.gz \
  ruptur-shipyard-01:/tmp/

# 4) Extrair e reiniciar na VM
gcloud compute ssh ruptur-shipyard-01 \
  --zone=southamerica-east1-b \
  --tunnel-through-iap \
  --command="
    set -e
    cd /opt/ruptur/saas
    BACKUP=backups/backup-\$(date +%Y%m%d-%H%M%S)
    mkdir -p backups && cp -r . \"\$BACKUP\" 2>/dev/null || true
    tar xzf /tmp/ruptur-saas-deploy.tar.gz
    npm ci --omit=dev
    # restart conforme o método de execução em prod (pm2 / systemd / docker compose)
  "
```

> ⚠️ Antes de rodar o deploy manual em produção, confirme COMO o gateway está rodando em prod (pm2? systemd? docker compose? supervisord?). Sem isso, o restart do passo final é chute.

## CI / GitHub Actions — status: **QUEBRADO**

O workflow `.github/workflows/deploy-rsync.yml` dispara em `push` para branch `main` e tenta:

```bash
ssh deploy@ruptur.cloud "echo OK"   # ← timeout: CF bloqueia
rsync ... deploy@ruptur.cloud:/app/ruptur-saas/   # ← mesmo problema
```

**Provavelmente está falhando há tempos.** Para corrigir:

| Opção | Como | Esforço |
|---|---|---|
| A. Adaptar workflow pra IAP | Usar `google-github-actions/auth` + `gcloud compute scp --tunnel-through-iap` em vez de rsync direto | médio (~2h) |
| B. Abrir firewall pra IPs do GitHub Actions | Whitelist em GCP firewall (mas IPs do GH mudam, manutenção alta) | baixo mas frágil |
| C. Cloud Build trigger | Substituir workflow por Cloud Build (roda dentro do GCP, já tem permissão) | alto (~4h) |
| D. Self-hosted runner na VM | Runner do GH dentro da VM, sem precisar SSH externo | médio (~3h), risco de segurança |

Recomendação: **A** (adaptar workflow pra IAP).

## Chave SSH `ruptur_deploy_ci`

Mantida pra uso futuro quando o deploy CI for corrigido, OU pra eventual VM sem IAP. **Hoje não tem efeito prático.**

- **Algoritmo:** ed25519 (sem passphrase)
- **Fingerprint:** `SHA256:xAbRt27jfWqhh2+jQ1W4eLLft82HjLaQ4cLdMWrtBK8`
- **Local:** `~/.ssh/ruptur_deploy_ci` (Mac do Diego) + secret `DEPLOY_SSH_KEY` no repo `rupturcloud/hitl-automation-engine`

### Re-plantar chave pública num user `deploy` (quando criar)

```bash
PUBKEY="ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEbkvIuXzhMlyQ35VEOKzEneXq2rgjN8TSar3ZAkkDU8 ruptur-deploy-ci@github-actions"

gcloud compute ssh ruptur-shipyard-01 \
  --zone=southamerica-east1-b \
  --tunnel-through-iap \
  --command="
    sudo useradd -m -s /bin/bash deploy 2>/dev/null || true
    sudo mkdir -p /home/deploy/.ssh
    echo '$PUBKEY' | sudo tee -a /home/deploy/.ssh/authorized_keys
    sudo chown -R deploy:deploy /home/deploy/.ssh
    sudo chmod 700 /home/deploy/.ssh
    sudo chmod 600 /home/deploy/.ssh/authorized_keys
  "
```

### Revogar (se vazar)

```bash
# 1) Apagar a linha do authorized_keys
gcloud compute ssh ruptur-shipyard-01 \
  --zone=southamerica-east1-b --tunnel-through-iap \
  --command="sudo sed -i.bak '/ruptur-deploy-ci@github-actions/d' /home/deploy/.ssh/authorized_keys"

# 2) Apagar secret no GitHub
gh secret delete DEPLOY_SSH_KEY --repo rupturcloud/hitl-automation-engine

# 3) Apagar local
rm ~/.ssh/ruptur_deploy_ci ~/.ssh/ruptur_deploy_ci.pub

# 4) Gerar novo par
ssh-keygen -t ed25519 -f ~/.ssh/ruptur_deploy_ci -N "" -C "ruptur-deploy-ci@github-actions"
```

## Próximos passos recomendados

1. Confirmar como o gateway roda em prod (pm2/systemd/docker) — ler `/opt/ruptur/saas` na VM
2. Decidir estratégia de deploy CI (recomendado: A — adaptar workflow pra IAP)
3. Atualizar `infra/scripts/deploy-rsync.sh` pra usar `gcloud compute scp --tunnel-through-iap`
4. Validar fluxo completo: build local → deploy → smoke test em `https://app.ruptur.cloud/api/local/health`

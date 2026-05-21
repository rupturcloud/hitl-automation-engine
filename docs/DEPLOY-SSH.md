# Deploy SSH — Chave dedicada Ruptur Cloud (CI + local)

Documento de **operação** sobre a chave SSH dedicada usada pelo `deploy-rsync.yml`
do GitHub Actions e por deploys manuais via `infra/scripts/deploy-rsync.sh`.

## Identificação

- **Algoritmo:** ed25519 (sem passphrase, requerido pra automação CI)
- **Comentário:** `ruptur-deploy-ci@github-actions`
- **Fingerprint:** `SHA256:xAbRt27jfWqhh2+jQ1W4eLLft82HjLaQ4cLdMWrtBK8`
- **Criada em:** 2026-05-21
- **Uso exclusivo:** deploy rsync para `deploy@ruptur.cloud:/app/ruptur-saas`

## Chave pública

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEbkvIuXzhMlyQ35VEOKzEneXq2rgjN8TSar3ZAkkDU8 ruptur-deploy-ci@github-actions
```

Plantada em `~/.ssh/authorized_keys` do usuário `deploy@ruptur.cloud`.

## Chave privada — onde mora

| Local | Caminho | Acesso |
|---|---|---|
| Mac do Diego | `~/.ssh/ruptur_deploy_ci` | só dono (chmod 600) |
| GitHub Actions | secret `DEPLOY_SSH_KEY` no repo `rupturcloud/hitl-automation-engine` | masked nos logs |

**Nunca commitar** a chave privada. Nunca exportar. Se vazar, revogar imediatamente
removendo a linha correspondente do `authorized_keys` no VPS e regerar nova chave.

## Como usar

### Local (deploy manual do Mac)

```bash
# Adicionar a chave ao agente SSH (opcional, simplifica)
ssh-add ~/.ssh/ruptur_deploy_ci

# Testar conexão
ssh -i ~/.ssh/ruptur_deploy_ci -o ConnectTimeout=5 deploy@ruptur.cloud "echo OK"

# Deploy completo (do repo principal, com master atualizado)
cd /Users/diego/hitl/projects/tiatendeai/dev/x1-mercado-contingencia/saas
git pull origin master
ENVIRONMENT=production ./infra/scripts/deploy-rsync.sh
```

### CI (GitHub Actions — automático no merge para master)

O workflow `.github/workflows/deploy-rsync.yml` consome `secrets.DEPLOY_SSH_KEY`
via `webfactory/ssh-agent@v0.8.0` no step "Setup SSH for deployment". Nada precisa
ser feito além de manter o secret atualizado.

Pra re-disparar manualmente após config:

```bash
gh workflow run deploy-rsync.yml --ref master
gh run watch  # acompanhar
```

## Como (re)configurar o secret no GitHub

```bash
# A partir da chave privada local
gh secret set DEPLOY_SSH_KEY \
  --repo rupturcloud/hitl-automation-engine \
  < ~/.ssh/ruptur_deploy_ci

# Verificar que foi configurado (mostra só metadata, nunca o valor)
gh secret list --repo rupturcloud/hitl-automation-engine
```

## Como (re)plantar a chave pública no VPS

```bash
cat <<'EOF' | ssh deploy@ruptur.cloud 'mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys'
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEbkvIuXzhMlyQ35VEOKzEneXq2rgjN8TSar3ZAkkDU8 ruptur-deploy-ci@github-actions
EOF
```

Se o usuário `deploy@` ainda não existe ou não permite login direto, acessar via
sudo/root e adicionar manualmente em `/home/deploy/.ssh/authorized_keys`.

## Como revogar (se chave vazar)

```bash
# 1) No VPS — remover a linha do authorized_keys
ssh deploy@ruptur.cloud "sed -i.bak '/ruptur-deploy-ci@github-actions/d' ~/.ssh/authorized_keys"

# 2) No GitHub — apagar o secret
gh secret delete DEPLOY_SSH_KEY --repo rupturcloud/hitl-automation-engine

# 3) Local — apagar o par antigo
rm ~/.ssh/ruptur_deploy_ci ~/.ssh/ruptur_deploy_ci.pub

# 4) Gerar nova chave e refazer todo o setup deste documento
ssh-keygen -t ed25519 -f ~/.ssh/ruptur_deploy_ci -N "" -C "ruptur-deploy-ci@github-actions"
```

## Por que chave dedicada (não a pessoal)

- **Blast radius mínimo:** se a chave do CI vazar, revogamos só ela — chave
  pessoal do Diego continua intacta pra acesso administrativo.
- **Auditoria:** logs do `sshd` no VPS mostram qual chave abriu cada sessão.
- **Sem passphrase é seguro nesse contexto:** a privada nunca sai do Mac
  (autorizada pelo dono) nem do GitHub (secret encriptado). Tentativa de
  passphrase quebraria a automação do CI sem ganho real de segurança.

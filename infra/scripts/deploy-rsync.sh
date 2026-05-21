#!/bin/bash

# Ruptur SaaS — Deploy via gcloud IAP tunnel
#
# Substituiu rsync direto (quebrado: ruptur.cloud atrás do Cloudflare proxy,
# firewall GCP bloqueia SSH externo). Usa gcloud compute scp + ssh --tunnel-through-iap.
#
# Pré-requisitos:
#   - gcloud CLI autenticado (SA key ou Workload Identity)
#   - build do web/client-area já executado antes de chamar este script
#
# Variáveis de ambiente esperadas (defaults seguros para prod):
#   GCP_PROJECT   — projeto GCP (default: ruptur-jarvis-v1-68358)
#   GCP_ZONE      — zona da VM    (default: southamerica-east1-b)
#   GCP_VM        — nome da VM    (default: ruptur-shipyard-01)
#   APP_PATH      — path na VM    (default: /opt/ruptur/saas)
#   ENVIRONMENT   — label do env  (default: production)
#   SLACK_WEBHOOK — URL do webhook (opcional)

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info()    { echo -e "${BLUE}[DEPLOY]${NC} $1"; }
log_success() { echo -e "${GREEN}[DEPLOY]${NC} $1"; }
log_error()   { echo -e "${RED}[DEPLOY]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[DEPLOY]${NC} $1"; }

GCP_PROJECT=${GCP_PROJECT:-ruptur-jarvis-v1-68358}
GCP_ZONE=${GCP_ZONE:-southamerica-east1-b}
GCP_VM=${GCP_VM:-ruptur-shipyard-01}
APP_PATH=${APP_PATH:-/opt/ruptur/saas}
ENVIRONMENT=${ENVIRONMENT:-production}

BRANCH_NAME=${GITHUB_REF_NAME:-$(git branch --show-current 2>/dev/null || echo "local")}
COMMIT_SHA=${GITHUB_SHA:-$(git rev-parse HEAD 2>/dev/null || echo "unknown")}
BUILD_NUMBER=${GITHUB_RUN_NUMBER:-local}

TAR_FILE="/tmp/ruptur-saas-deploy-${BUILD_NUMBER}.tar.gz"
TAR_BASENAME="$(basename "$TAR_FILE")"

main() {
    echo -e "${BLUE}=========================================${NC}"
    echo -e "${BLUE}  Ruptur SaaS — Deploy via GCP IAP${NC}"
    echo -e "${BLUE}=========================================${NC}"
    echo -e "Branch:      ${YELLOW}${BRANCH_NAME}${NC}"
    echo -e "Commit:      ${YELLOW}${COMMIT_SHA}${NC}"
    echo -e "Build:       ${YELLOW}#${BUILD_NUMBER}${NC}"
    echo -e "Environment: ${YELLOW}${ENVIRONMENT}${NC}"
    echo -e "Destino:     ${YELLOW}${GCP_VM}:${APP_PATH}${NC}"
    echo -e "Projeto GCP: ${YELLOW}${GCP_PROJECT}${NC}"
    echo ""

    # Step 1: Verificar gcloud disponível
    log_info "Verificando gcloud CLI..."
    if ! command -v gcloud &>/dev/null; then
        log_error "gcloud CLI não encontrado. Instale google-cloud-cli."
        exit 1
    fi
    log_success "gcloud disponível: $(gcloud --version | head -1)"

    # Step 2: Empacotar arquivos (web/client-area/dist deve já existir do build anterior)
    log_info "Empacotando source para deploy..."
    tar czf "$TAR_FILE" \
        --exclude='node_modules' \
        --exclude='.git' \
        --exclude='.env' \
        --exclude='.env.*' \
        --exclude='runtime-data/warmup-state.json' \
        --exclude='runtime-data/instance-dna' \
        --exclude='.next' \
        --exclude='dist' \
        --exclude='artifacts' \
        --exclude='.DS_Store' \
        --exclude='backups' \
        --exclude='coverage' \
        --exclude='*.tar.gz' \
        .
    log_success "Pacote criado: ${TAR_FILE} ($(du -sh "$TAR_FILE" | cut -f1))"

    # Step 3: Copiar pacote via IAP tunnel
    log_info "Copiando pacote para ${GCP_VM} via IAP..."
    gcloud compute scp \
        --tunnel-through-iap \
        --zone="$GCP_ZONE" \
        --project="$GCP_PROJECT" \
        "$TAR_FILE" \
        "${GCP_VM}:/tmp/"
    log_success "Pacote transferido"

    # Step 4: Extrair, instalar deps e reiniciar via IAP SSH
    log_info "Aplicando deploy na VM (backup → extract → npm ci → restart)..."
    gcloud compute ssh "$GCP_VM" \
        --zone="$GCP_ZONE" \
        --project="$GCP_PROJECT" \
        --tunnel-through-iap \
        --command="
            set -e
            BACKUP_NAME=backup-\$(date +%Y%m%d-%H%M%S)
            cd ${APP_PATH}

            echo '[DEPLOY] Criando backup: '\$BACKUP_NAME
            mkdir -p backups
            tar czf backups/\${BACKUP_NAME}.tar.gz \
                --exclude=backups \
                --exclude=node_modules \
                . 2>/dev/null || echo '[DEPLOY] Aviso: backup parcial (primeira vez?)'

            echo '[DEPLOY] Extraindo pacote...'
            tar xzf /tmp/${TAR_BASENAME}

            echo '[DEPLOY] Instalando dependências de produção...'
            npm ci --omit=dev

            echo '[DEPLOY] Reiniciando container saas-web...'
            docker compose up -d saas-web

            rm -f /tmp/${TAR_BASENAME}
            echo '[DEPLOY] Deploy aplicado com sucesso — backup: '\$BACKUP_NAME
        "
    log_success "Deploy aplicado na VM"

    # Step 5: Health check
    log_info "Aguardando serviço estabilizar (15s)..."
    sleep 15
    HEALTH_URL="https://app.ruptur.cloud/api/local/health"
    if curl -sf --max-time 10 "$HEALTH_URL" > /dev/null 2>&1; then
        log_success "Health check OK: ${HEALTH_URL}"
    else
        log_warning "Health check não respondeu — app pode ainda estar subindo. Verifique manualmente."
    fi

    # Step 6: Notificar Slack
    if [ -n "${SLACK_WEBHOOK:-}" ]; then
        log_info "Notificando Slack..."
        curl -sf -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"🚀 Ruptur SaaS deployed to ${ENVIRONMENT} (build #${BUILD_NUMBER}) — ${COMMIT_SHA}\"}" \
            "$SLACK_WEBHOOK" \
            || log_warning "Slack notification falhou (não crítico)"
    fi

    echo ""
    log_success "Deploy concluído com sucesso!"
    echo -e "${BLUE}=========================================${NC}"
    echo ""
    echo "Para verificar logs na VM:"
    echo "  gcloud compute ssh ${GCP_VM} --zone=${GCP_ZONE} --tunnel-through-iap \\"
    echo "    --command='docker compose -f ${APP_PATH}/docker-compose.yml logs -f saas-web'"
    echo ""
    echo "Para rollback manual:"
    echo "  gcloud compute ssh ${GCP_VM} --zone=${GCP_ZONE} --tunnel-through-iap \\"
    echo "    --command='cd ${APP_PATH} && tar xzf backups/<BACKUP_NAME>.tar.gz && docker compose up -d saas-web'"
    echo ""
}

main "$@"

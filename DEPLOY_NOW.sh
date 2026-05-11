#!/bin/bash
# Deploy rápido para produção
# Execute: bash DEPLOY_NOW.sh

set -e

echo "🚀 Deploying Ruptur SaaS to production..."
echo ""

REMOTE_USER="diego"
REMOTE_HOST="34.176.34.240"
REMOTE_PATH="/opt/ruptur/saas"
SSH_KEY="$HOME/.ssh/google_compute_engine"

# Validar SSH key
if [ ! -f "$SSH_KEY" ]; then
  echo "❌ SSH key não encontrada: $SSH_KEY"
  exit 1
fi

echo "📦 Sincronizando dist-client/ para produção..."
rsync -avzR -e "ssh -i $SSH_KEY" dist-client/ $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/ || {
  echo "❌ Rsync falhou"
  exit 1
}

echo ""
echo "🔄 Reiniciando container saas-web..."
ssh -i $SSH_KEY $REMOTE_USER@$REMOTE_HOST "cd $REMOTE_PATH && docker compose restart saas-web" || {
  echo "❌ Restart falhou"
  exit 1
}

echo ""
echo "⏳ Aguardando container ficar pronto (15s)..."
sleep 15

echo ""
echo "✅ Validando deployment..."
ssh -i $SSH_KEY $REMOTE_USER@$REMOTE_HOST "curl -f https://app.ruptur.cloud/api/health > /dev/null 2>&1" && {
  echo "✅ SITE ONLINE E RESPONDENDO!"
  echo ""
  echo "🎉 Deploy completo!"
  echo "📍 https://app.ruptur.cloud"
  exit 0
} || {
  echo "⚠️  Health check falhou, mas docker compose pode estar iniciando..."
  echo "Verifique logs: ssh $REMOTE_USER@$REMOTE_HOST 'docker logs saas-web --tail 50'"
  exit 1
}

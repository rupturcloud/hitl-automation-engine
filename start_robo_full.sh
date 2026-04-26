#!/bin/bash
# ═══════════════════════════════════════════════════════════════════
# START ROBO FULL — Solução Agnóstica (Sessão Nova ou Salva)
# ═══════════════════════════════════════════════════════════════════

set -e

BASE="/Users/diego/dev/ruptur-cloud"
BRIDGE_PID=""
V7_PID=""
CHROME_PID=""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║     ROBO FODÃO FULL — Agnóstico (Sessão Nova ou Salva)      ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# ═══════════════════════════════════════════════════════════════════
# Cleanup
# ═══════════════════════════════════════════════════════════════════

cleanup() {
    echo ""
    echo -e "${YELLOW}⏹ Parando...${NC}"

    if [ ! -z "$BRIDGE_PID" ]; then
        kill $BRIDGE_PID 2>/dev/null || true
    fi

    if [ ! -z "$V7_PID" ]; then
        kill $V7_PID 2>/dev/null || true
    fi

    pkill -f "will_server|bridge_v2" 2>/dev/null || true

    echo -e "${GREEN}✅ Limpo${NC}"
}

trap cleanup EXIT INT TERM

# ═══════════════════════════════════════════════════════════════════
# ETAPA 1: Iniciar infraestrutura
# ═══════════════════════════════════════════════════════════════════

echo -e "${BLUE}[1/4]${NC} Iniciando infraestrutura..."
pkill -9 -f "will_server|bridge_v2" 2>/dev/null || true
sleep 2

cd "$BASE"
python3 will_server_minimal.py > /tmp/v7.log 2>&1 &
V7_PID=$!
sleep 2

python3 bridge_v2.py > /tmp/bridge.log 2>&1 &
BRIDGE_PID=$!
sleep 2

if curl -s http://127.0.0.1:5000/bridge/health &>/dev/null; then
    echo -e "${GREEN}✅ Bridge + V7 online${NC}"
else
    echo -e "${RED}❌ Infraestrutura falhou!${NC}"
    exit 1
fi
echo ""

# ═══════════════════════════════════════════════════════════════════
# ETAPA 2: Detectar Chrome (Sessão Salva ou Nova)
# ═══════════════════════════════════════════════════════════════════

echo -e "${BLUE}[2/4]${NC} Detectando Chrome..."

CHROME_USER_DATA="$HOME/Library/Application Support/Google/Chrome"
EXTENSION_PATH="$BASE/will-dados-pro"

# Verifica se sessão Chrome existe
if [ -d "$CHROME_USER_DATA" ]; then
    echo -e "${GREEN}✅ Sessão Chrome encontrada${NC}"
    SESSION_MODE="salva"
else
    echo -e "${YELLOW}⚠️ Sessão Chrome nova${NC}"
    SESSION_MODE="nova"
fi

echo ""

# ═══════════════════════════════════════════════════════════════════
# ETAPA 3: Verificar se extensão já tá carregada
# ═══════════════════════════════════════════════════════════════════

echo -e "${BLUE}[3/4]${NC} Verificando extensão..."

# Procura por extensão no diretório Chrome
EXTENSION_LOADED=false

if [ -d "$CHROME_USER_DATA/Default/Extensions" ]; then
    # Verifica se tem referência à extensão
    if grep -r "will-dados-pro\|will_dados_pro" "$CHROME_USER_DATA" 2>/dev/null || grep -r "$EXTENSION_PATH" "$CHROME_USER_DATA" 2>/dev/null; then
        EXTENSION_LOADED=true
    fi
fi

if [ "$EXTENSION_LOADED" = true ]; then
    echo -e "${GREEN}✅ Extensão já carregada${NC}"
else
    echo -e "${YELLOW}⚠️ Extensão será carregada na primeira abertura${NC}"
fi

echo ""

# ═══════════════════════════════════════════════════════════════════
# ETAPA 4: Abrir Chrome com extensão
# ═══════════════════════════════════════════════════════════════════

echo -e "${BLUE}[4/4]${NC} Abrindo Chrome..."

# Chrome arguments
CHROME_ARGS=(
    "--app=http://127.0.0.1:5000"
    "--no-first-run"
    "--no-default-browser-check"
    "--disable-background-networking"
    "--disable-breakpad"
    "--disable-client-side-phishing-detection"
    "--disable-default-apps"
    "--disable-hang-monitor"
    "--disable-popup-blocking"
    "--disable-prompt-on-repost"
    "--disable-extensions-except=$EXTENSION_PATH"
    "--load-extension=$EXTENSION_PATH"
)

# Abre Chrome
if [ -x "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" ]; then
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" "${CHROME_ARGS[@]}" > /dev/null 2>&1 &
    CHROME_PID=$!
    echo -e "${GREEN}✅ Chrome aberto${NC}"
    echo ""
    echo -e "${GREEN}Extensão: ${EXTENSION_PATH}${NC}"
    echo -e "${GREEN}Sessão: $SESSION_MODE${NC}"
    echo ""
else
    echo -e "${RED}❌ Chrome não encontrado em /Applications${NC}"
    exit 1
fi

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║            🚀 ROBO FODÃO PRONTO — CLIQUE LIGAR!             ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}Chrome aberto com:${NC}"
echo "  ✅ Extensão carregada"
echo "  ✅ Bridge V2 rodando (localhost:5000)"
echo "  ✅ V7 rodando (localhost:5555)"
echo ""
echo -e "${YELLOW}Próximo:${NC}"
echo "  1. Chrome abre → Clica ícone extensão (canto superior direito)"
echo "  2. Sidepanel abre à direita"
echo "  3. Clica botão verde 🤖 LIGAR"
echo "  4. Robô executa automaticamente!"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo -e "${GREEN}Sistema rodando! Pressione CTRL+C pra parar.${NC}"
echo ""

# Fica rodando
wait

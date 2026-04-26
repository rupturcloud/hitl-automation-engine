#!/bin/bash
# ═══════════════════════════════════════════════════════════════════
# START ROBO FODÃO — One Command to Rule Them All
# ═══════════════════════════════════════════════════════════════════

set -e

BASE="/Users/diego/dev/ruptur-cloud"
BRIDGE_PID=""
V7_PID=""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║         ROBO FODÃO — One Command Startup                     ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# ═══════════════════════════════════════════════════════════════════
# FUNÇÃO: Cleanup ao sair
# ═══════════════════════════════════════════════════════════════════

cleanup() {
    echo ""
    echo -e "${YELLOW}⏹ Parando processos...${NC}"

    if [ ! -z "$BRIDGE_PID" ]; then
        kill $BRIDGE_PID 2>/dev/null || true
    fi

    if [ ! -z "$V7_PID" ]; then
        kill $V7_PID 2>/dev/null || true
    fi

    pkill -f "will_server|bridge_v2" 2>/dev/null || true

    echo -e "${GREEN}✅ Limpo${NC}"
    exit 0
}

trap cleanup EXIT INT TERM

# ═══════════════════════════════════════════════════════════════════
# ETAPA 1: Limpar processos antigos
# ═══════════════════════════════════════════════════════════════════

echo -e "${BLUE}[1/5]${NC} Limpando processos antigos..."
pkill -9 -f "will_server|bridge_v2" 2>/dev/null || true
sleep 2
echo -e "${GREEN}✅ Limpo${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════════
# ETAPA 2: Iniciar V7 (Selenium Server)
# ═══════════════════════════════════════════════════════════════════

echo -e "${BLUE}[2/5]${NC} Iniciando V7 (Selenium Server em 5555)..."
cd "$BASE"
python3 will_server_minimal.py > /tmp/v7.log 2>&1 &
V7_PID=$!
sleep 3

# Verifica se V7 tá online
if curl -s http://127.0.0.1:5555/health &>/dev/null; then
    echo -e "${GREEN}✅ V7 online em localhost:5555${NC}"
else
    echo -e "${RED}❌ V7 não respondeu!${NC}"
    echo "Log:"
    tail -20 /tmp/v7.log
    exit 1
fi
echo ""

# ═══════════════════════════════════════════════════════════════════
# ETAPA 3: Iniciar Bridge V2
# ═══════════════════════════════════════════════════════════════════

echo -e "${BLUE}[3/5]${NC} Iniciando Bridge V2 (Proxy em 5000)..."
python3 bridge_v2.py > /tmp/bridge.log 2>&1 &
BRIDGE_PID=$!
sleep 2

# Verifica se Bridge tá online
if curl -s http://127.0.0.1:5000/bridge/health &>/dev/null; then
    echo -e "${GREEN}✅ Bridge V2 online em localhost:5000${NC}"
else
    echo -e "${RED}❌ Bridge não respondeu!${NC}"
    echo "Log:"
    tail -20 /tmp/bridge.log
    exit 1
fi
echo ""

# ═══════════════════════════════════════════════════════════════════
# ETAPA 4: Verificar saúde completa
# ═══════════════════════════════════════════════════════════════════

echo -e "${BLUE}[4/5]${NC} Verificando saúde do sistema..."

HEALTH=$(curl -s http://127.0.0.1:5000/bridge/health)
V7_HEALTH=$(echo $HEALTH | grep -o '"v7_healthy":true' || echo "")

if [ ! -z "$V7_HEALTH" ]; then
    echo -e "${GREEN}✅ V7: Healthy${NC}"
    echo -e "${GREEN}✅ Bridge: OK${NC}"
    echo -e "${GREEN}✅ Sistema: 100% Operacional${NC}"
else
    echo -e "${YELLOW}⚠️ V7 pode não estar saudável${NC}"
fi
echo ""

# ═══════════════════════════════════════════════════════════════════
# ETAPA 5: Instruções finais
# ═══════════════════════════════════════════════════════════════════

echo -e "${BLUE}[5/5]${NC} Configuração completa!"
echo ""

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                    🚀 PRONTO PRA RODAR!                      ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

echo -e "${GREEN}ENDPOINTS:${NC}"
echo "  Bridge:     http://127.0.0.1:5000"
echo "  V7 (Priv):  http://127.0.0.1:5555"
echo ""

echo -e "${GREEN}TESTE RÁPIDO (CLI):${NC}"
echo ""
echo "  # Ver estado:"
echo "  curl -s http://127.0.0.1:5000/api/state | python3 -m json.tool"
echo ""
echo "  # Iniciar robô:"
echo "  curl -s -X POST http://127.0.0.1:5000/api/start"
echo ""
echo "  # Parar robô:"
echo "  curl -s -X POST http://127.0.0.1:5000/api/stop"
echo ""

echo -e "${YELLOW}EXTENSÃO CHROME:${NC}"
echo "  1. chrome://extensions/"
echo "  2. Modo desenvolvedor (canto superior direito)"
echo "  3. Carregar extensão sem empacotamento"
echo "  4. Seleciona: /Users/diego/dev/ruptur-cloud/will-dados-pro"
echo "  5. Clica ícone extensão → Sidepanel abre"
echo "  6. Clica 🤖 LIGAR e acompanha em tempo real"
echo ""

echo -e "${BLUE}LOGS EM TEMPO REAL:${NC}"
echo "  V7:     tail -f /tmp/v7.log"
echo "  Bridge: tail -f /tmp/bridge.log"
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo ""
echo -e "${GREEN}Sistema rodando! Pressione CTRL+C pra parar.${NC}"
echo ""

# Fica rodando
wait

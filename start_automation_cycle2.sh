#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# START AUTOMATION CYCLE 2 — Teste de Automação Completa
# ═══════════════════════════════════════════════════════════════

set -e

BASE="/Users/diego/dev/ruptur-cloud"
BRIDGE_PID=""
V8_PID=""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║           CICLO 2 — AUTOMAÇÃO COM SINCRONIZAÇÃO              ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# ─────────────────────────────────────────────────────────────────
# CLEANUP
# ─────────────────────────────────────────────────────────────────

cleanup() {
    echo ""
    echo -e "${YELLOW}⏹ Parando servidores...${NC}"

    if [ ! -z "$BRIDGE_PID" ]; then
        kill $BRIDGE_PID 2>/dev/null || true
    fi

    if [ ! -z "$V8_PID" ]; then
        kill $V8_PID 2>/dev/null || true
    fi

    pkill -f "will_server|bridge_v2" 2>/dev/null || true

    echo -e "${GREEN}✅ Limpo${NC}"
}

trap cleanup EXIT INT TERM

# ─────────────────────────────────────────────────────────────────
# ETAPA 1: Parar servidores antigos
# ─────────────────────────────────────────────────────────────────

echo -e "${BLUE}[1/4]${NC} Limpando servidores antigos..."
pkill -9 -f "will_server|bridge_v2" 2>/dev/null || true
sleep 2
echo -e "${GREEN}✅ Limpo${NC}"
echo ""

# ─────────────────────────────────────────────────────────────────
# ETAPA 2: Iniciar Will Server V8 (novo, com simulação)
# ─────────────────────────────────────────────────────────────────

echo -e "${BLUE}[2/4]${NC} Iniciando Will Server V8..."
cd "$BASE"
python3 will_server_v8.py > /tmp/v8.log 2>&1 &
V8_PID=$!
sleep 2

if curl -s http://127.0.0.1:5555/health &>/dev/null; then
    echo -e "${GREEN}✅ Will Server V8 online (localhost:5555)${NC}"
else
    echo -e "${RED}❌ Will Server V8 falhou!${NC}"
    cat /tmp/v8.log
    exit 1
fi
echo ""

# ─────────────────────────────────────────────────────────────────
# ETAPA 3: Iniciar Bridge V2
# ─────────────────────────────────────────────────────────────────

echo -e "${BLUE}[3/4]${NC} Iniciando Bridge V2..."
python3 bridge_v2.py > /tmp/bridge.log 2>&1 &
BRIDGE_PID=$!
sleep 2

if curl -s http://127.0.0.1:5000/bridge/health &>/dev/null; then
    echo -e "${GREEN}✅ Bridge V2 online (localhost:5000)${NC}"
else
    echo -e "${RED}❌ Bridge V2 falhou!${NC}"
    cat /tmp/bridge.log
    exit 1
fi
echo ""

# ─────────────────────────────────────────────────────────────────
# ETAPA 4: Rodar Automação (Cycle 2)
# ─────────────────────────────────────────────────────────────────

echo -e "${BLUE}[4/4]${NC} Iniciando automação (Cycle 2)..."
echo ""

python3 will_automation_cycle2.py

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                   CICLO 2 COMPLETADO                         ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Mostrar relatório
if [ -f /Users/diego/dev/ruptur-cloud/ciclo2_telemetria.json ]; then
    echo -e "${GREEN}📊 Telemetria salva em: ciclo2_telemetria.json${NC}"
    cat /Users/diego/dev/ruptur-cloud/ciclo2_telemetria.json | python3 -m json.tool
    echo ""
fi

echo -e "${GREEN}✅ Tudo completo! Verifique os logs acima.${NC}"
echo ""

# Manter servidores rodando um pouco mais
sleep 5

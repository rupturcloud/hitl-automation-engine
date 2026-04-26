# 🧬 J.A.R.V.I.S. CONFIG - Bac Bo Robot
import os

# Caminhos
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_DIR = os.path.join(BASE_DIR, "src")
DATASET_DIR = os.path.join(BASE_DIR, "dataset")

# Configurações de Resolução (Target: 1280x720 no monitor)
# As ROIs precisam ser calibradas manualmente
ROIS = {
    "timer": (580, 50, 60, 40),      # (x, y, w, h) - Tempo restante
    "bankroll": (10, 680, 200, 30),  # (x, y, w, h) - Saldo atual
    "history": (1000, 600, 250, 100), # (x, y, w, h) - Últimas 10 rodadas
    "bet_player": (450, 500, 80, 80), # Coordenada de clique/observação
    "bet_banker": (750, 500, 80, 80), # Coordenada de clique/observação
    "bet_tie": (600, 500, 80, 80)     # Coordenada de clique/observação
}

# Configurações de Captura
CAPTURE_INTERVAL = 1.0  # segundos
FRAME_QUALITY = 90

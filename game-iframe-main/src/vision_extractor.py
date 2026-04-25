# 🧬 J.A.R.V.I.S. VISION - Bac Bo Extractor (STUB para WebSocket)
import cv2
import numpy as np
import os
import glob
import json
from typing import List
from config import ROIS, DATASET_DIR

# OCR desabilitado temporariamente para testar WebSocket
try:
    import easyocr
    HAS_EASYOCR = True
except ImportError:
    HAS_EASYOCR = False

class BacBoVisionExtractor:
    def __init__(self):
        # Inicializa o EasyOCR para Inglês (mais rápido para números)
        # GPU=False por padrão para garantir compatibilidade no Mac do Diego
        if HAS_EASYOCR:
            self.reader = easyocr.Reader(['en'], gpu=False)
            print("🧬 J.A.R.V.I.S.: Engine EasyOCR inicializada.")
        else:
            self.reader = None
            print("⚠️  EasyOCR não disponível - usando stubs para testes")

    def _ocr_numbers(self, roi):
        """Helper para extração de números via EasyOCR"""
        if not self.reader:
            return "1000.00"  # Valor dummy para testes
        # Aumentar o contraste ajuda o OCR
        roi_gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
        results = self.reader.readtext(roi_gray, allowlist='0123456789,.')
        if results:
            return results[0][1]
        return ""

    def extract_banca(self, frame):
        x, y, w, h = ROIS["bankroll"]
        roi = frame[y:y+h, x:x+w]
        return self._ocr_numbers(roi)

    def extract_timer(self, frame):
        x, y, w, h = ROIS["timer"]
        roi = frame[y:y+h, x:x+w]
        return self._ocr_numbers(roi)

    def extract_history(self, frame) -> List[str]:
        """
        Analisa o painel de histórico e retorna lista de resultados detectados.
        Cada item é "BANKER", "PLAYER" ou "TIE", alinhado com VisualSnapshot.history.
        Detecção baseada em cores HSV (vermelho=Banker, azul=Player).
        """
        x, y, w, h = ROIS["history"]
        roi = frame[y:y+h, x:x+w]

        # O Bac Bo usa círculos Vermelhos (Banker) e Azuis (Player)
        hsv = cv2.cvtColor(roi, cv2.COLOR_BGR2HSV)

        # Banker (Red)
        mask_red1 = cv2.inRange(hsv, np.array([0, 100, 100]), np.array([10, 255, 255]))
        mask_red2 = cv2.inRange(hsv, np.array([160, 100, 100]), np.array([180, 255, 255]))
        mask_red = mask_red1 | mask_red2

        # Player (Blue)
        mask_blue = cv2.inRange(hsv, np.array([100, 150, 0]), np.array([140, 255, 255]))

        red_pixels = cv2.countNonZero(mask_red)
        blue_pixels = cv2.countNonZero(mask_blue)

        results: List[str] = []
        if red_pixels > 100:
            results.append("BANKER")
        if blue_pixels > 100:
            results.append("PLAYER")
        return results

    def process_latest(self):
        # Para debug offline
        files = glob.glob(os.path.join(DATASET_DIR, "*.jpg"))
        if not files: return None
        latest_file = max(files, key=os.path.getctime)
        frame = cv2.imread(latest_file)
        if frame is None: return None
        
        return {
            "timestamp": os.path.basename(latest_file),
            "banca": self.extract_banca(frame),
            "timer": self.extract_timer(frame),
            "signals": self.extract_history(frame)
        }

if __name__ == "__main__":
    extractor = BacBoVisionExtractor()
    result = extractor.process_latest()
    print(f"🧬 J.A.R.V.I.S. EXTRACTION: {json.dumps(result, indent=2)}")

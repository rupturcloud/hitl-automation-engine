# 🧬 J.A.R.V.I.S. - ROI Calibration Tool
import cv2
import glob
import os
from config import ROIS, DATASET_DIR

def calibrate():
    files = glob.glob(os.path.join(DATASET_DIR, "*.jpg"))
    if not files:
        print("❌ Nenhum frame encontrado em dataset/. Rode o vision_observer primeiro.")
        return
    
    latest_file = max(files, key=os.path.getctime)
    frame = cv2.imread(latest_file)
    
    print(f"🧬 Calibrando baseado em: {latest_file}")
    
    for name, (x, y, w, h) in ROIS.items():
        # Desenha o retângulo da ROI
        color = (0, 255, 0) # Verde
        if "bet" in name: color = (255, 0, 0) # Azul para botões
        
        cv2.rectangle(frame, (x, y), (x+w, y+h), color, 2)
        cv2.putText(frame, name, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 1)

    cv2.imshow("Calibrador de ROIs J.A.R.V.I.S.", frame)
    print("Pressione qualquer tecla para fechar...")
    cv2.waitKey(0)
    cv2.destroyAllWindows()

if __name__ == "__main__":
    calibrate()

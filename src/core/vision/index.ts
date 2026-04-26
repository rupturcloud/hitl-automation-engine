import { useState, useCallback } from 'react';

export interface VisionData {
  statusText: string;
  integrityScore: number; // 0-100
  lastCaptureAt: number;
  detectedData?: any;
}

export function useVision() {
  const [visionState, setVisionState] = useState<VisionData>({
    statusText: "Aguardando sinal...",
    integrityScore: 100,
    lastCaptureAt: Date.now(),
  });

  // Função abstrata que seria conectada ao seu serviço de FFmpeg/BFF
  const syncVisualTruth = useCallback((data: Partial<VisionData>) => {
    setVisionState((prev) => ({
      ...prev,
      ...data,
      lastCaptureAt: Date.now()
    }));
  }, []);

  const isDataReliable = visionState.integrityScore > 90;

  return {
    visionState,
    syncVisualTruth,
    isDataReliable
  };
}

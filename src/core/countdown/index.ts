import { useState, useEffect, useCallback, useRef } from 'react';

interface CountdownOptions {
  initialSeconds: number;
  onComplete?: () => void;
  onTick?: (seconds: number) => void;
  autoStart?: boolean;
}

export const useCountdown = ({
  initialSeconds,
  onComplete,
  onTick,
  autoStart = false,
}: CountdownOptions) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(autoStart);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => setIsActive(true), []);
  const stop = useCallback(() => setIsActive(false), []);
  const reset = useCallback((newSeconds?: number) => {
    setIsActive(false);
    setSeconds(newSeconds ?? initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (isActive && seconds > 0) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => {
          const next = prev - 1;
          if (onTick) onTick(next);
          return next;
        });
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      if (onComplete) onComplete();
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, seconds, onComplete, onTick]);

  return {
    seconds,
    isActive,
    start,
    stop,
    reset,
    setSeconds,
  };
};

/**
 * useIdleTimer — logout automático por inatividade
 *
 * - IDLE_MS      : tempo sem atividade para deslogar (default 30 min)
 * - WARNING_MS   : aviso antes do logout (default 2 min antes)
 *
 * Detecta: mousemove, keydown, mousedown, touchstart, scroll, visibilitychange
 * Ao atingir o warning: chama onWarning(secondsLeft)
 * Ao atingir o timeout: chama onIdle()
 */
import { useEffect, useRef, useCallback } from 'react';

const IDLE_MS    = 30 * 60 * 1000; // 30 minutos
const WARNING_MS =  2 * 60 * 1000; //  2 minutos antes

const ACTIVITY_EVENTS = [
  'mousemove', 'mousedown', 'keydown',
  'touchstart', 'scroll', 'visibilitychange',
];

export function useIdleTimer({ onIdle, onWarning, onActive, enabled = true }) {
  const idleTimer    = useRef(null);
  const warnTimer    = useRef(null);
  const isWarning    = useRef(false);

  const clearTimers = useCallback(() => {
    clearTimeout(idleTimer.current);
    clearTimeout(warnTimer.current);
  }, []);

  const resetTimers = useCallback(() => {
    clearTimers();

    if (!enabled) return;

    // Se estava em modo de aviso, notifica que voltou a ser ativo
    if (isWarning.current) {
      isWarning.current = false;
      onActive?.();
    }

    // Aviso: (IDLE_MS - WARNING_MS) após última atividade
    warnTimer.current = setTimeout(() => {
      isWarning.current = true;
      onWarning?.(Math.round(WARNING_MS / 1000));
    }, IDLE_MS - WARNING_MS);

    // Logout: IDLE_MS após última atividade
    idleTimer.current = setTimeout(() => {
      isWarning.current = false;
      onIdle?.();
    }, IDLE_MS);
  }, [enabled, onIdle, onWarning, onActive, clearTimers]);

  useEffect(() => {
    if (!enabled) return;

    // Inicia ao montar
    resetTimers();

    ACTIVITY_EVENTS.forEach(e => window.addEventListener(e, resetTimers, { passive: true }));

    return () => {
      clearTimers();
      ACTIVITY_EVENTS.forEach(e => window.removeEventListener(e, resetTimers));
    };
  }, [enabled, resetTimers, clearTimers]);
}

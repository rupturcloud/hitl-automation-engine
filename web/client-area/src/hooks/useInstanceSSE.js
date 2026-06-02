/**
 * useInstanceSSE — S2 sensor da doutrina Anduril.
 *
 * Subscreve ao endpoint SSE do UAZAPI para receber eventos em tempo real.
 * Hoje: skeleton com connection lifecycle + event parsing.
 * Próximo: injetar sinais no fusion bus quando backend expor o endpoint.
 *
 * UAZAPI SSE endpoint: GET /sse (header token: <instanceToken>)
 * Eventos esperados: connection_update, qr-code-updated, messages_update
 *
 * NOTA: O free.uazapi.com pode ter restrições de CORS para SSE direto do browser.
 * A implementação final fará proxy via nosso backend:
 *   GET /api/v1/whatsapp/numbers/:id/sse
 * Por ora: documenta a interface, implementa o lifecycle, marca TODO para o proxy.
 */
// eslint-disable-next-line react-hooks/immutability
import { useEffect, useRef, useCallback } from 'react';

export function useInstanceSSE(instanceId, { onStateChange, onQRUpdate, enabled = true } = {}) {
  const esRef = useRef(null);
  const reconnectRef = useRef(null);
  const attemptsRef = useRef(0); // eslint-disable-line no-unused-vars

  // eslint-disable-next-line react-hooks/immutability
  const connect = useCallback(() => {
    if (!instanceId || !enabled) return;

    // TODO: trocar para proxy backend quando implementado
    // const url = `/api/v1/whatsapp/numbers/${instanceId}/sse`;
    // Por ora: documenta a intenção, não conecta (evita CORS error em prod)
    console.debug(`[useInstanceSSE] S2 sensor pendente para instância ${instanceId}`);
    console.debug('[useInstanceSSE] Proxy backend /sse não implementado ainda — sensor inativo');

    // Quando o proxy existir, o código será:
    // esRef.current = new EventSource(url, { withCredentials: true });
    // esRef.current.addEventListener('connection_update', (e) => {
    //   try {
    //     const data = JSON.parse(e.data);
    //     onStateChange?.({ source: 'sse_event', state: data.state, confidence: 0.9 });
    //   } catch {}
    // });
    // esRef.current.addEventListener('qr-code-updated', (e) => {
    //   try {
    //     const data = JSON.parse(e.data);
    //     onQRUpdate?.(data.qrcode);
    //   } catch {}
    // });
    // esRef.current.onerror = () => {
    //   esRef.current?.close();
    //   attemptsRef.current++;
    //   const backoff = Math.min(30_000, 1_000 * Math.pow(2, attemptsRef.current));
    //   reconnectRef.current = setTimeout(connect, backoff);
    // };
  }, [instanceId, enabled, onStateChange, onQRUpdate]);

  useEffect(() => {
    connect();
    return () => {
      clearTimeout(reconnectRef.current);
      esRef.current?.close();
    };
  }, [connect]);

  return {
    sseActive: false, // será true quando proxy backend implementado
    sensor: 'sse_event',
    status: 'PENDING_BACKEND_PROXY',
  };
}

export default useInstanceSSE;

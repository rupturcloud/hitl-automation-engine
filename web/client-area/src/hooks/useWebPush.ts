/**
 * React Hook para Web Push Notifications
 * Gerencia: registro de SW, subscription, permissões, testes
 * Vite project (não Next.js "use client")
 */

import { useState, useEffect, useCallback } from "react";

export interface UseWebPushReturn {
  isSupported: boolean;
  isRegistered: boolean;
  isSubscribed: boolean;
  isPending: boolean;
  error: string | null;
  subscribe: () => Promise<void>;
  unsubscribe: () => Promise<void>;
  sendTest: () => Promise<void>;
  getSubscription: () => Promise<PushSubscription | null>;
}

export function useWebPush(authToken?: string): UseWebPushReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verificar suporte do navegador
  useEffect(() => {
    const supported =
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "PushManager" in window;

    setIsSupported(supported);

    if (supported) {
      // Registrar Service Worker
      registerServiceWorker();
    }
  }, []);

  const registerServiceWorker = async () => {
    try {
      if (!("serviceWorker" in navigator)) {
        setError("Service Workers não suportados");
        return;
      }

      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });

      console.log("✓ Service Worker registrado:", registration.scope);
      setIsRegistered(true);

      // Verificar se já tem subscription ativa
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        console.log("✓ Subscription ativa encontrada");
        setIsSubscribed(true);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("❌ Erro ao registrar SW:", message);
      setError(message);
    }
  };

  const subscribe = useCallback(async () => {
    setIsPending(true);
    setError(null);

    try {
      if (!isRegistered) {
        throw new Error("Service Worker não registrado");
      }

      // Solicitar permissão
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        throw new Error("Permissão de notificações negada pelo usuário");
      }

      // Obter registro do SW
      const registration = await navigator.serviceWorker.ready;

      // VAPID public key:
      // 1) busca via API pública (fonte canônica do servidor — permite rotação sem rebuild),
      // 2) fallback build-time (import.meta.env), 3) fallback window global.
      let vapidPublicKey: string | undefined;
      try {
        const r = await fetch("/api/fase7/notifications/vapid-public-key");
        if (r.ok) {
          const j = await r.json();
          vapidPublicKey = j.publicKey;
        }
      } catch {
        /* ignora — usa fallback */
      }
      if (!vapidPublicKey) {
        vapidPublicKey =
          import.meta.env.VITE_VAPID_PUBLIC_KEY ||
          (window as any).VAPID_PUBLIC_KEY;
      }
      if (!vapidPublicKey) {
        throw new Error("VAPID public key não configurada (servidor + env vazios)");
      }

      // Subscribe a push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      console.log("✓ Push subscription criada");

      // Enviar subscription ao servidor
      await sendSubscriptionToServer(subscription, authToken);

      setIsSubscribed(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("❌ Erro ao subscribir:", message);
      setError(message);
    } finally {
      setIsPending(false);
    }
  }, [isRegistered, authToken]);

  const unsubscribe = useCallback(async () => {
    setIsPending(true);
    setError(null);

    try {
      if (!isRegistered) {
        throw new Error("Service Worker não registrado");
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        throw new Error("Nenhuma subscription ativa");
      }

      await subscription.unsubscribe();
      console.log("✓ Subscription removida");
      setIsSubscribed(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("❌ Erro ao unsubscribe:", message);
      setError(message);
    } finally {
      setIsPending(false);
    }
  }, [isRegistered]);

  const sendTest = useCallback(async () => {
    setIsPending(true);
    setError(null);

    try {
      if (!authToken) {
        throw new Error("Token de autenticação não fornecido");
      }

      const response = await fetch("/api/fase7/notifications/test", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Erro ao enviar notificação teste");
      }

      console.log("✓ Notificação teste enviada");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("❌ Erro ao enviar teste:", message);
      setError(message);
    } finally {
      setIsPending(false);
    }
  }, [authToken]);

  const getSubscription = useCallback(async (): Promise<PushSubscription | null> => {
    try {
      const registration = await navigator.serviceWorker.ready;
      return await registration.pushManager.getSubscription();
    } catch (err) {
      console.error("Erro ao obter subscription:", err);
      return null;
    }
  }, []);

  return {
    isSupported,
    isRegistered,
    isSubscribed,
    isPending,
    error,
    subscribe,
    unsubscribe,
    sendTest,
    getSubscription,
  };
}

// ============ HELPER FUNCTIONS ============

/**
 * Converter VAPID public key (base64) para Uint8Array
 * Necessário para applicationServerKey do PushManager
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

/**
 * Enviar subscription object ao servidor
 * Servidor salva em database para uso posterior
 */
async function sendSubscriptionToServer(
  subscription: PushSubscription,
  authToken?: string
): Promise<void> {
  if (!authToken) {
    console.warn("Token não fornecido, subscription não será salva no servidor");
    return;
  }

  const response = await fetch("/api/fase7/notifications/subscribe", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subscription),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || "Erro ao salvar subscription");
  }

  const result = await response.json();
  console.log("✓ Subscription salva no servidor:", result);
}

// ============ COMPONENT EXAMPLE ============

/**
 * Exemplo de componente que usa o hook
 *
 * export function NotificationButton() {
 *   const { session } = useSession();
 *   const { isSubscribed, isPending, error, subscribe, sendTest } = useWebPush(session?.user?.token);
 *
 *   return (
 *     <div>
 *       <button
 *         onClick={subscribe}
 *         disabled={isPending || isSubscribed}
 *       >
 *         {isSubscribed ? "✓ Notificações ativadas" : "Ativar notificações"}
 *       </button>
 *
 *       {isSubscribed && (
 *         <button onClick={sendTest} disabled={isPending}>
 *           📬 Teste
 *         </button>
 *       )}
 *
 *       {error && <p style={{ color: "red" }}>{error}</p>}
 *     </div>
 *   );
 * }
 */

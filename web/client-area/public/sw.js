/**
 * Service Worker — Ruptur OS
 * Handles:
 * - Push notifications
 * - Notification clicks
 * - Offline fallback
 *
 * Estratégia de cache:
 *   /assets/**  → cache-first (URLs com hash imutável, seguro cachear para sempre)
 *   index.html  → network-first (sempre busca versão fresh; fallback offline)
 *   /api/**     → bypass (nunca intercepta chamadas de API)
 */

// Versão do SW (increment para force update e limpar cache antigo)
const SW_VERSION = "2.1.0-ruptur-os";
const CACHE_NAME = `ruptur-os-${SW_VERSION}`;

console.log(`✓ Service Worker v${SW_VERSION} loaded`);

// ============ INSTALL EVENT ============
self.addEventListener("install", (event) => {
  console.log(`🔧 Installing Service Worker ${SW_VERSION}`);
  // Não pré-cachea index.html: é network-first.
  // Apenas garante que o cache existe.
  event.waitUntil(caches.open(CACHE_NAME));
  // Força ativação imediata sem esperar recarregamento
  self.skipWaiting();
});

// ============ ACTIVATE EVENT ============
self.addEventListener("activate", (event) => {
  console.log(`⚡ Activating Service Worker ${SW_VERSION}`);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old caches
          if (cacheName !== CACHE_NAME) {
            console.log(`🗑️  Deletando cache antigo: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Claim all clients immediately
  return self.clients.claim();
});

// ============ PUSH EVENT (Notificações) ============
self.addEventListener("push", (event) => {
  console.log("📬 Push event recebido");

  if (!event.data) {
    console.warn("Push recebido sem dados");
    return;
  }

  try {
    const data = event.data.json();
    console.log("📨 Dados de notificação:", data);

    const options = {
      body: data.body || "Nova notificação do Jarvis",
      icon: data.icon || "/logo.png",
      badge: data.badge || "/badge.png",
      tag: data.tag || "jarvis-notification",
      requireInteraction: false,
      vibrate: [200, 100, 200],
      timestamp: data.timestamp ? new Date(data.timestamp).getTime() : Date.now(),

      // Actions (buttons na notificação)
      actions: data.actions || [
        { action: "open", title: "Abrir" },
        { action: "close", title: "Fechar" },
      ],

      // Custom data
      data: data.data || {},

      // Comportamento visual
      silent: false,
    };

    // Se tem badge color, adicionar
    if (data.badgeColor) {
      options.badgeColor = data.badgeColor;
    }

    // Mostrar notificação
    event.waitUntil(
      self.registration.showNotification(data.title || "Jarvis", options)
        .then(() => {
          console.log("✓ Notificação exibida com sucesso");
        })
        .catch((err) => {
          console.error("❌ Erro ao exibir notificação:", err);
        })
    );
  } catch (err) {
    console.error("❌ Erro ao processar push event:", err);
    // Fallback: mostrar notificação genérica
    event.waitUntil(
      self.registration.showNotification("Jarvis", {
        body: "Nova notificação (erro ao processar dados)",
        icon: "/logo.png",
      })
    );
  }
});

// ============ NOTIFICATION CLICK EVENT ============
self.addEventListener("notificationclick", (event) => {
  console.log("👆 Notification click:", event.action);

  event.notification.close();

  const action = event.action;
  const notificationData = event.notification.data || {};

  // URL base da aplicação
  const baseUrl = "https://jarvis.ruptur.cloud";

  let targetUrl = baseUrl;

  // Determinar URL baseado na ação clicada
  if (action === "open" || !action) {
    // Clique no corpo da notificação (default)
    if (notificationData.agent) {
      targetUrl = `${baseUrl}/agent/${notificationData.agent}`;
    } else if (notificationData.voice_url) {
      targetUrl = `${baseUrl}/voice?playback=${encodeURIComponent(notificationData.voice_url)}`;
    } else {
      targetUrl = baseUrl;
    }
  } else if (action === "play" && notificationData.voice_url) {
    // Clique em "Reproduzir" (se tiver som)
    targetUrl = `${baseUrl}/voice?playback=${encodeURIComponent(notificationData.voice_url)}`;
  } else if (action === "close") {
    // Clique em "Fechar" - não abrir nada
    console.log("Notificação fechada pelo usuário");
    return;
  }

  console.log(`📍 Abrindo URL: ${targetUrl}`);

  // Procurar por cliente existente
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Procurar janela já aberta com Jarvis
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === baseUrl + "/" && "focus" in client) {
            // Já tem Jarvis aberta, focar nela
            return client.focus();
          }
        }
        // Não tem Jarvis aberta, abrir nova janela
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});

// ============ NOTIFICATION CLOSE EVENT ============
self.addEventListener("notificationclose", (event) => {
  console.log("✕ Notificação fechada pelo usuário:", event.notification.tag);
  // Opcionalmente: enviar evento ao servidor
});

// ============ FETCH EVENT ============
self.addEventListener("fetch", (event) => {
  // Apenas GET
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Nunca interceptar API, chrome-extension ou outras origens
  if (
    url.pathname.startsWith("/api/") ||
    url.protocol === "chrome-extension:" ||
    url.origin !== self.location.origin
  ) {
    return;
  }

  // ── ASSETS com hash no nome → cache-first (imutáveis) ──────────────
  // Ex: /assets/index-Dc65VI_s.js  /assets/index-RGn7YH-T.css
  if (url.pathname.startsWith("/assets/")) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) {
          console.log(`📦 Cache hit (asset): ${url.pathname}`);
          return cached;
        }
        return fetch(event.request).then((res) => {
          if (res.ok) {
            caches.open(CACHE_NAME).then((c) => c.put(event.request, res.clone()));
          }
          return res;
        });
      })
    );
    return;
  }

  // ── HTML / navegação → network-first (sempre fresh) ────────────────
  // index.html muda a cada deploy (novo hash de bundle).
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        // Cache manifest.json e logo (estáticos, mudam raramente)
        if (res.ok && (url.pathname === "/manifest.json" || url.pathname.endsWith(".png"))) {
          caches.open(CACHE_NAME).then((c) => c.put(event.request, res.clone()));
        }
        return res;
      })
      .catch(() => {
        // Offline: tentar cache como fallback
        return caches.match(event.request).then((cached) => {
          if (cached) {
            console.log(`📦 Offline fallback: ${url.pathname}`);
            return cached;
          }
          console.warn(`❌ Offline sem cache: ${url.pathname}`);
          return new Response("Offline — recarregue quando tiver conexão.", {
            status: 503,
            statusText: "Service Unavailable",
            headers: { "Content-Type": "text/plain;charset=UTF-8" },
          });
        });
      })
  );
});

// ============ MESSAGE EVENT (Comunicação com client) ============
self.addEventListener("message", (event) => {
  console.log("💬 Mensagem recebida do cliente:", event.data);

  if (event.data && event.data.type === "SKIP_WAITING") {
    console.log("⚡ Pulando wait, ativando novo SW");
    self.skipWaiting();
    return;
  }

  if (event.data && event.data.type === "CACHE_URLS") {
    // Client quer cachear URLs adicionais
    const urls = event.data.urls || [];
    if (event.ports && event.ports[0]) {
      caches.open(CACHE_NAME).then((cache) => {
        cache.addAll(urls)
          .then(() => {
            event.ports[0].postMessage({ type: "CACHED", urls });
          })
          .catch((err) => {
            console.error("❌ Erro ao cachear URLs:", err);
            event.ports[0].postMessage({ type: "CACHE_ERROR", error: err.message });
          });
      });
    } else {
      console.warn("⚠️  Tentativa de responder sem ports disponíveis");
    }
    return;
  }
});

console.log(`✓ Service Worker ready to handle: push, notifications, fetch, messages`);

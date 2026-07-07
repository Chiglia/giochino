const CACHE_NAME = "platform-game-v3";
const PRECACHE_ASSETS = ["./", "./index.html", "./manifest.json", "./app_icon.jpg"];

// Installa il service worker e mette in cache le risorse di base
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting()),
  );
});

// Attiva e rimuove i vecchi cache per evitare conflitti con la vecchia versione
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          }),
        );
      })
      .then(() => self.clients.claim()),
  );
});

// Strategia Cache-First con dynamic caching per gli asset bundled di Vite
self.addEventListener("fetch", (e) => {
  // Gestiamo solo richieste GET
  if (e.request.method !== "GET") return;

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(e.request)
        .then((networkResponse) => {
          // Mettiamo in cache dinamicamente solo i file locali (stessa origine) o gli asset di gioco
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            (e.request.url.startsWith(self.location.origin) || e.request.url.includes("assets"))
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(e.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Opzionale: fallback offline se necessario
        });
    }),
  );
});

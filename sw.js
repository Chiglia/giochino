const CACHE_NAME = "platform-game-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./app_icon.jpg",
  "./src/main.js",
  "./src/scenes/GameScene.js",
  "./src/scenes/MenuScene.js",
  "./src/scenes/GameOverScene.js",
  "./src/systems/player.js",
  "./src/systems/levels.js",
  "./src/systems/camera.js",
  "./src/systems/platforms.js",
  "./src/systems/coins.js",
  "./src/systems/ui.js",
  "https://cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser.min.js",
];

// Installa il service worker e mette in cache le risorse
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting()),
  );
});

// Attiva e rimuove i vecchi cache
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

// Strategia Cache-First (con ripiego su rete) per caricamenti istantanei
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(e.request).then((networkResponse) => {
        // Opzionalmente possiamo salvare nuove richieste in cache se necessario
        return networkResponse;
      });
    }),
  );
});

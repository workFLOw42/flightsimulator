/* Flugspiel Service Worker – Offline-Cache
   Version bei jedem Inhalts-Update hochzaehlen, damit alte Caches ersetzt werden. */
const CACHE = 'flugspiel-v49';

/* Kern-Dateien: klein genug, um sie sofort bei der Installation zu cachen. */
const CORE = [
  './',
  './Flugspiel.html',
  './manifest.json',
  './three.min.js',
  './GLTFLoader.js',
  './sounds.js',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png'
];

/* Grosse Modelle werden NICHT vorab, sondern erst beim ersten Laden gecacht
   (zusammen ~80 MB – ein Vorab-Cache wuerde die Installation riskant machen). */

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Strategie: Cache-first mit Nachfuellen (auch fuer die grossen *_glb.js). */
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res && res.ok && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => cached);
    })
  );
});

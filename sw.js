/* Flugspiel Service Worker – Offline-Cache
   Version bei jedem Inhalts-Update hochzaehlen, damit alte Caches ersetzt werden. */
const CACHE = 'flugspiel-v139';

/* Kern-Dateien: klein genug, um sie sofort bei der Installation zu cachen. */
const CORE = [
  './',
  './Flugspiel.html',
  './manifest.json',
  './three.min.js',
  './GLTFLoader.js',
  './sounds.js',
  // ambient.js fehlte hier, und das war der Grund, warum der Sonar-Ping stumm blieb: die Datei
  // wurde beim ersten Besuch NEBENBEI gecacht (die fetch-Strategie fuellt nach), danach aber nie
  // wieder geholt. Nach dem Einbau des Pings lieferte der Cache also weiter die alte ambient.js
  // ohne den Schluessel 'sonar' — window.FMS_AMB.sonar war undefined, und playSonarPing stieg
  // stumm aus. Der Hinweis 'erst abtauchen' kam trotzdem, weil der dem Sound nicht braucht.
  // In CORE steht sie jetzt mit den anderen Kern-Dateien und wird bei jeder neuen Cache-Version
  // frisch geladen (1,9 MB, das ist vertretbar).
  './ambient.js',
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

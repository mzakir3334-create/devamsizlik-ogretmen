/* Devamsızlık · Öğretmen uygulaması – çevrimdışı kabuk. Öğrenci verisi ÖNBELLEĞE ALINMAZ. */
var CACHE = 'devamsizlik-ogretmen-v1';
var KABUK = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(KABUK); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== self.location.origin) return; // sunucu istekleri doğrudan gider
  // Önce ağ (güncel sürüm), ağ yoksa önbellek
  e.respondWith(fetch(r).then(function (yanit) {
    var kopya = yanit.clone();
    caches.open(CACHE).then(function (c) { c.put(r, kopya); });
    return yanit;
  }).catch(function () { return caches.match(r).then(function (m) { return m || caches.match('./index.html'); }); }));
});

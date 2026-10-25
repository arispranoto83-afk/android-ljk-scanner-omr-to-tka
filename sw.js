const V = 'ljk-v1';
const CORE = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(CORE))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))));
  self.clients.claim();
});
// cache-first; pustaka SheetJS (cdnjs) ikut ter-cache saat pertama kali dipakai
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(r => {
    if (r.ok && (r.type === 'basic' || /cdnjs\.cloudflare\.com/.test(e.request.url))) {
      const cp = r.clone(); caches.open(V).then(c => c.put(e.request, cp));
    }
    return r;
  }).catch(() => caches.match('./index.html'))));
});

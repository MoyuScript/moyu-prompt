const VERSION = 'v3';

/**
 *
 * @param {Request} request
 */
async function cacheOrFetch(request) {
  let resp = await caches.match(request);

  if (resp) {
    return resp;
  }

  resp = await fetch(request);

  if (!request.url.startsWith('http')) {
    return resp;
  }

  const cache = await caches.open(VERSION);
  cache.put(request, resp.clone());

  return resp;
}

this.addEventListener('install', function(ev) {
  self.skipWaiting();
});

this.addEventListener('fetch', function(ev) {
  if (location.hostname.includes('localhost') || location.hostname.startsWith('192.168')) {
    // 调试环境不缓存
    ev.respondWith(fetch(ev.request));
    return;
  }

  ev.respondWith(
    cacheOrFetch(ev.request)
  );
});

this.addEventListener('activate', function(ev) {
  self.clients.claim();
  ev.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== VERSION) {
          return caches.delete(key);
        }
      }));
    })
  );
});

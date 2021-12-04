
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

  const cache = await caches.open('v1');
  cache.put(request, resp.clone());

  return resp;
}

this.addEventListener('install', function(ev) {
  ev.skipWait();
});

this.addEventListener('fetch', function(ev) {
  ev.respondWith(
    cacheOrFetch(ev.request)
  );
});

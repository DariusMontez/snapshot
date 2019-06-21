/*
 * SERVICE WORKER
 * ==============
 * Cache resources as they are fetched.
 *
 * When the web page requests a resource:
 * 1. the 'fetch' event listener is triggered
 * 2. the content is fetched from the internet and stored in cache
 * 3. the content is retreived from cache and given to the web page
 *
 */

const CACHE = "cache-offline-copy";

async function updateCache(req) {
  const cache = await caches.open(CACHE);

  try {
    const res = await fetch(req);
    const resClone = res.clone();
    cache.put(req, res);
    return resClone;
  } catch (e) {
    console.warn(`[Service Worker] Serving content from cache: ${req.url}`, e);
    return cache.match(req);
  }
}

self.addEventListener('fetch', function(event) {
  if (event.request.method != 'GET') return;

  event.respondWith(updateCache(event.request));
});
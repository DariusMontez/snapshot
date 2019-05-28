/* 
 * SERVICE WORKER
 * ==============
 * Cache resources as they are fetched.
 */

const CACHE = "cache-offline-copy";

async function updateCache(req) {
  try {
    const res = await fetch(req);
    const cache = await caches.open(CACHE);
    return cache.put(req, res);
  } catch (e) {
    console.warn(`[Service Worker] Network request failed: ${req.url}`);
  }
}

self.addEventListener('fetch', function(event) {
  if (event.request.method != 'GET') return;

  event.waitUntil(updateCache(event.request));
  
  event.respondWith(
    fetch(event.request).catch(async function(error) {
      console.warn(`[Service Worker] Serving content from cache: ${event.request.url}`);

      const cache = await caches.open(CACHE);
      return cache.match(event.request);
    })
  );
});
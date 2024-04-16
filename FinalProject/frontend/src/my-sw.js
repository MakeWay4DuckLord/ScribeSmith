import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
const STATIC_CACHE_NAME = "api-cache";

// Precache and route the assets defined in the Workbox configuration
precacheAndRoute(self.__WB_MANIFEST);

// Clean up outdated caches
cleanupOutdatedCaches();

// Install and activate service worker
self.addEventListener('install', event => {
    event.waitUntil(
      caches.open(STATIC_CACHE_NAME).then(cache => {
        return cache.addAll([
          '/offline',
          'https://cdn.tiny.cloud/1/knfnarhktdvw0v5q8muzms71g5lgmhn6rkdv8bxytr7qhcl8/tinymce/6.8.3-25/skins/ui/oxide/content.min.css ',
          'https://cdn.tiny.cloud/1/knfnarhktdvw0v5q8muzms71g5lgmhn6rkdv8bxytr7qhcl8/tinymce/6.8.3-25/skins/content/default/content.min.css',
        ]);
      })
    );
  });

self.addEventListener('activate', () => self.clients.claim());

const offlinePayload = {
  isOffline: true,
  message: "You are offline."
};

self.addEventListener('fetch', event => {
  var requestUrl = new URL(event.request.url);

  // Treat API calls (to our API) differently
  if (requestUrl.origin === location.origin && requestUrl.pathname.startsWith('/api')) {
    // If we are here, we are intercepting a call to our API
    if (event.request.method === 'GET') {
      // Only intercept (and cache) GET API requests
      event.respondWith(
        networkFirst(event.request)
      );
    } else { //If a PUT, POST, or DELTE method and the app is offline, return the offline payload
      event.respondWith(
        fetch(event.request)
          .catch(() => {
            return new Response(JSON.stringify(offlinePayload), {
              headers: { 'Content-Type': 'application/json' }
            });
          })
      );
    }
  } else {
    // If we are here, this was not a call to our API
    event.respondWith(
      networkFirst(event.request)
    );
  }
});
   
  function networkFirst(request) {
    return fetchAndCache(request)
    .catch(error => {
      //If we get an error, try to return from cache
      return caches.match(request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        } else {
          return new Response(JSON.stringify(offlinePayload), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
      });
    })
  }
  
  function fetchAndCache(request) {
    return fetch(request).then(response => {
      var requestUrl = new URL(request.url);
      //Cache successful GET requests that are not browser extensions
      if(response.ok && request.method === "GET" && !requestUrl.protocol.startsWith('chrome-extension')) {
        caches.open(STATIC_CACHE_NAME).then((cache) => {
          cache.put(request, response);
        });
      }
      return response.clone();
    });
  }

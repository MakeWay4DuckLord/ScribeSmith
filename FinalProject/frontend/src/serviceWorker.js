const STATIC_CACHE_NAME = 'scribesmith-static-v0';

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME).then(cache => {
            return cache.addAll([
                //campaign
                '/src/pages/campaign/campaign.css',
                '/src/pages/campaign/Campaign.jsx',
                //campaigns
                '/src/pages/campaigns/campaigns.css',
                '/src/pages/campaigns/Campaigns.jsx',
                //login
                '/src/pages/login/login.css',
                '/src/pages/login/Login.jsx',
                '/src/pages/login/formAction.jsx',
                //myNotes
                '/src/pages/my-notes/myNotes.css',
                '/src/pages/my-notes/MyNotes.jsx',
                //offline
                '/src/pages/offline/offline.css',
                '/src/pages/offline/offline.jsx',
                //sharedNotes
                '/src/pages/shared-notes/sharedNotes.css',
                '/src/pages/SharedNotes.jsx'
            ]);
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys(cacheNames => {
            return Promise.all(
                cacheNames.filter(cacheName => {
                    return cacheName.startsWith('scribesmith-') && cacheName != STATIC_CACHE_NAME;
                }).map(cacheName => {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    var requestUrl = new URL(event.request.url);

    if(requestUrl.origin === location.origin && requestUrl.pathname.startsWith('/api')) {
        if(event.request.method === "GET") {
            //only intercept and cache GET API requests
            event.respondWith(
                cacheFirst(event.request)
            );
        }
    } else {
        event.respondWith(
            cacheFirst(event.request)
        );
    }
});

function cacheFirst(request) {
    return caches.match(request)
    .then(response => {
        //return a response if we have one cached, otherwise ge from the network
        return response || fetchAndCache(request);
    })
    .catch(err => {
        return caches.match('/offline');
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
  
  
  
  self.addEventListener('message', event => {
    console.log('message', event.data);
    if(event.data.action === 'skipWaiting') {
      self.skipWaiting();
    }
  });
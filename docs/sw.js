// use a cacheName for cache versioning
var cacheName = 'v1:static';

// during the install phase you usually want to cache static assets
self.addEventListener('install', function(e) {
    // once the SW is installed, go ahead and fetch the resources to make this work offline
    console.log("install", {e});
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            console.log("caches open", {cache});
            return cache.addAll([
              'https://cdn.jsdelivr.net/npm/eruda',
              // './assets/eruda.js',
              // './assets/eruda.js.map',
              './assets/favicon.ico',
              './assets/icon.png',
              // './index.html',
              // './main.js',
              // './manifest.webmanifest',
              'https://momentjs.com/downloads/moment-with-locales.min.js',
              // './assets/moment-with-locales.min.js',
              // './assets/moment-with-locales.min.js.map',
              'https://unpkg.com/rxjs/bundles/rxjs.umd.min.js',
              // './assets/rxjs.umd.min.js',
              // './assets/rxjs.umd.min.js.map',
              // './style.css',
              // './sw.js',
            ]).then(function() {
                console.log("all cached");
                self.skipWaiting();
            });
        })
    );
});

// when the browser fetches a url
self.addEventListener('fetch', function(event) {
    // either respond with the cached object or go ahead and fetch the actual url
    console.log("fetch", {event});
    event.respondWith(
        caches.match(event.request).then(function(response) {
            console.log("match", {response});
            if (response) {
                // retrieve from cache
                return response;
            }
            // fetch as normal
            return fetch(event.request);
        })
    );
});

const precacheVersion = '1.0';
const precacheName = 'precache-v' + precacheVersion;
const precacheFiles = [
'./eruda.js',
'./eruda.js.map',
'./favicon.ico',
'./icon.png',
'./index.html',
'./main.js',
'./manifest.webmanifest',
'./moment-with-locales.min.js',
'./moment-with-locales.min.js.map',
'./rxjs.umd.min.js',
'./rxjs.umd.min.js.map',
'./sw.js',
];

self.addEventListener('install', (e) => {
  console.log('[ServiceWorker] Installed');

  self.skipWaiting();

  e.waitUntil(
    caches.open(precacheName).then((cache) => {
      console.log('[ServiceWorker] Precaching files');
      return cache.addAll(precacheFiles);
    }) // end caches.open()
  ); // end e.waitUntil
});


self.addEventListener('activate', (e) => {
  console.log('[ServiceWorker] Activated');

  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(cacheNames.map((thisCacheName) => {

        console.log(thisCacheName +' = '+precacheName)

        if (thisCacheName.includes("precache") && thisCacheName !== precacheName) {
          console.log('[ServiceWorker] Removing cached files from old cache - ', thisCacheName);
          return caches.delete(thisCacheName);
        }

      }));
    }) // end caches.keys()
  ); // end e.waitUntil
});


self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cacheResponse) => {
      if(cacheResponse) {
        console.log('Found in cache!')
        return cacheResponse
      }
      return fetch(e.request)
        .then((fetchResponse) => fetchResponse)
        .catch((err) => {

          const isHTMLPage = e.request.method == "GET" && e.request.headers.get("accept").includes("text/html");

          if (isHTMLPage) return caches.match("/index.html")

        });
    })
  );
});
        
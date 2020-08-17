// use a cacheName for cache versioning
var cacheName = 'v20200817.8';

var static = [
	'https://cdn.jsdelivr.net/npm/eruda',
	// './assets/eruda.js',
	// './assets/eruda.js.map',
	'./assets/favicon.ico',
	'./assets/icon.png',
	'https://momentjs.com/downloads/moment-with-locales.min.js',
	// './assets/moment-with-locales.min.js',
	// './assets/moment-with-locales.min.js.map',
	'https://unpkg.com/rxjs/bundles/rxjs.umd.min.js',
	// './assets/rxjs.umd.min.js',
	// './assets/rxjs.umd.min.js.map',
];

var notstatic = [
	// './index.html',
	'./main.js',
	'./manifest.webmanifest',
	'./style.css',
	'./sw.js',
	'./',
];

self.addEventListener('activate', function(e) {
	console.log("activated", {e});
	caches.keys().then(names=>{
		for(const name of names) if(name !== cacheName) caches.delete(name);
	})
});

// during the install phase you usually want to cache static assets
self.addEventListener('install', function(e) {
	// once the SW is installed, go ahead and fetch the resources to make this work offline
	console.log("install", {e});
	e.waitUntil(
		caches.open(cacheName).then(function(cache) {
			console.log("caches open", {cache});
			return cache.addAll(static.concat(notstatic)).then(function() {
				console.log("all cached");
			});
		})
	);
});

// when the browser fetches a url
self.addEventListener('fetch', function(event) {
	// either respond with the cached object or go ahead and fetch the actual url
	event.respondWith(
		caches.match(event.request).then(function(response) {
			if (response) {
				// retrieve from cache
				console.log("fetch matched", event.request.url, {event,response});
				if(shouldUpdate(event.request.url)) event.waitUntil(
					caches.open(cacheName).then(function (cache) {
						return cache.add(event.request);
					})
				);
				return response;
			}
			// fetch as normal
			console.log("fetch not matched", event.request.url, {event});
			return fetch(event.request);
		})
	);
});

function shouldUpdate(url){
	for(const x of notstatic)
		if((new Request(x)).url == url)
			return true;
	return false;
}
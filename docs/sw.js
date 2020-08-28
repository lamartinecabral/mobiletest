// use a cacheName for cache versioning
var cacheName = 'v20200828.2';

var static = [
	'./assets/favicon.ico',
	'./assets/icon.png',
	'./assets/github.svg',
	'https://cdn.jsdelivr.net/npm/eruda',
	// './assets/eruda.js',
	// './assets/eruda.js.map',
	'https://momentjs.com/downloads/moment-with-locales.min.js',
	// './assets/moment-with-locales.min.js',
	// './assets/moment-with-locales.min.js.map',
	'https://unpkg.com/rxjs/bundles/rxjs.umd.min.js',
	// './assets/rxjs.umd.min.js',
	// './assets/rxjs.umd.min.js.map',
	'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js',
	// './assets/jquery-3.5.1.min.js',
	// './assets/jquery-3.5.1.min.map',
];

var notstatic = [
	// './index.html',
	'./main.js',
	'./utils.js',
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
	self.skipWaiting();
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
	let getFromCache = function(){
		return caches.match(event.request).then(function(response) {
			if (response) {
				// retrieve from cache
				console.log("fetch matched", event.request.url, {event,response});
				return response;
			}
			// fetch as normal
			console.log("fetch not matched", event.request.url, {event});
			return fetch(event.request);
		});
	};
	
	if(shouldUpdate(event.request.url)) event.respondWith(
		fetch(event.request).then(function(response){
			if(response.status == 200){
				event.waitUntil(
					caches.open(cacheName).then(function (cache) {
						return cache.put(event.request, response).catch(function(e){});
					})
				);
				console.log("fetched", event.request.url, {event,response});
				return response;
			} else {
				return getFromCache();
			}
		}).catch(function(){
			return getFromCache();
		})
	);
	else event.respondWith( getFromCache() );
});

function shouldUpdate(url){
	for(const x of notstatic)
		if((new Request(x)).url == url)
			return true;
	return false;
}

//create cache-1 while installing service worker
self.addEventListener('install', function(event){
	console.log('installing...');
	event.waitUntil(
		caches.open('cache-1').then(function(cache){
			return cache.addAll(
				[
				'./'])
		}).then(function(){console.log('added static caches!')})
	)
})

//If a request doesn't match anything in the cache, get it from the network, send it to the page and add it to the cache at the same time.
//reference: Caching Files with Service Worker, https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker
self.addEventListener('fetch', function(event){
	console.log('making request...')
	event.respondWith(
		fetch(event.request).then(function(response){
			if (response.status == 404) {
				return new Response('Whoops, page not found')
			} 
			console.log('fetching new stuff!');
			return response
		}).catch(function(){
			caches.open('cache-1').then(function(cache){
				return cache.match(event.request)
				.then(function(response){
					if(response) {
						console.log('found in cache-1!')
						console.log(response)
						return response

					}
					return new Response('Uh oh, please check your internet connection!')
				})
			})
		})
	)
	// event.respondWith(
	// 	caches.open('cache-1').then(function(cache){
	// 		return cache.match(event.request).then(function(response){
	// 			if(response) {
	// 				console.log('found in cache-1!')
	// 				return response}
	// 			return fetch(event.request).then(function(fetchResponse){
	// 				console.log('new fetch!')
	// 				console.log(event.request.url)
	// 				if(!event.request.url.startsWith('chrome'))
	// 				{cache.put(event.request, fetchResponse.clone())};
	// 				return fetchResponse;
	// 			})
	// 		})
	// 	}))
})

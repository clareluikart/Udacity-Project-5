// modified from Lesson 13: Introducing the Service Worker
// and https://developers.google.com/web/fundamentals/primers/service-workers/#cache_and_return_requests
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('restaurant-stage-1').then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/restaurant.html',
        '/css/styles.css',
        '/css/restaurant-styles.css',
        '/data/restaurants.json',
        '/js/dbhelper.js',
        '/js/main.js',
        '/js/restaurant_info.js'
      ]);
    })
  );
});
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {return response;}
      var fetchRequest = event.request.clone();
      return fetch(fetchRequest).then(
        function(response){
          if(!response || response.status !== 200 ){//unlike in the google example, we don't want response.type !== 'basic' because we want 3rd party requests.
            return response;
          }
        var responseToCache = response.clone();
        caches.open(CACHE_NAME).then(
          function(cache){
            cache.put(event.request, responseToCache);
          });
          return response;
        }
      );
    })
  );
});

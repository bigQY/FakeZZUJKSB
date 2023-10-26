const CACHE_NAME = 'ResCache'
let util = {
  fetchPut: function (request, callback) {
    return fetch(request).then(response => {
      if (!response || response.status !== 200 || response.type !== "basic") {
        return response;
      }
      util.putCache(request, response.clone());
      typeof callback === "function" && callback();
      return response;
    });
  },
  putCache: function (request, resource) {
    if (request.method === "GET") {
      caches.open(CACHE_NAME).then(cache => {
        if (request.url.includes('chrome-extension://')) {
          return;
        }
        cache.put(request, resource);
      });
    }
  }
};

this.addEventListener('install', event => {
  caches.open(CACHE_NAME);
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/js/vue.js',
        '/js/elementui.js',
        '/js/elementui.css',
        '/imagesss/_xwss_2017.css',
        '/imagesss/need_photo.png',
        '/imagesss/sf_sheng4.png',
        '/imagesss/title316_63137.png',
        '/images/split5.png',
        '/js/fonts/element-icons.woff',
      ]);
    })
  );
});

this.addEventListener("active", event => {
  console.log("service worker is active");
});

this.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request, { ignoreVary: true }).then(response => {
      console.log(response)
      if (response) {
        return response;
      }
      return util.fetchPut(event.request.clone());
    })
  );
});

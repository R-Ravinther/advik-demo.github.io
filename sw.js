const cacheName = 'news-v1';
const staticAssets = [
  '/',
  '/index.html',
  '/styles.css',
  '/main.css',
  '/css/bootstrap.min.css',
  '/css/bootstrap-responsive.min.css',
  '/css/bootstrappage.css',
  '/css/flexslider.css',
  '/js/jquery-1.7.2.min.js',
  '/js/bootstrap.min.js',
  '/js/superfish.js',
  '/js/jquery.scrolltotop.js',
  '/js/common.js',
  '/js/jquery.flexslider-min.js',
  '/index.js',
  '/newsApi.js',
  '/news-article.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'
];

self.addEventListener('install', async e => {
  const cache = await caches.open(cacheName);
  await cache.addAll(staticAssets);
  return self.skipWaiting();
});

self.addEventListener('activate', e => {
  self.clients.claim();
});

self.addEventListener('fetch', async e => {
  const req = e.request;
  const url = new URL(req.url);

  if (url.origin === location.origin) {
    e.respondWith(cacheFirst(req));
  } else {
    e.respondWith(networkAndCache(req));
  }
});

async function cacheFirst(req) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  return cached || fetch(req);
}

async function networkAndCache(req) {
  const cache = await caches.open(cacheName);
  try {
    const fresh = await fetch(req);
    await cache.put(req, fresh.clone());
    return fresh;
  } catch (e) {
    const cached = await cache.match(req);
    return cached;
  }
}

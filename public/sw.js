const CACHE_NAME = 'zakpota-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.jpg',
  '/img/logo-mairie.jpg',
  '/badge.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Cache strategy: Network first falling back to cache
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes vers Supabase ou les analytics pour le cache offline strict
  if (event.request.url.includes('supabase.co')) return;

  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

self.addEventListener('push', function (event) {
  if (event.data) {
    try {
      const data = event.data.json();
      const options = {
        body: data.body,
        icon: data.icon || '/img/logo-mairie.jpg',
        badge: data.badge || '/badge.png',
        image: data.image || undefined,
        vibrate: [200, 100, 200, 100, 200, 100, 400],
        requireInteraction: true,
        data: { url: data.url || '/' }
      };

      event.waitUntil(
        self.registration.showNotification(data.title, options)
      );
    } catch (e) {
      // If payload is not valid JSON, show generic
      event.waitUntil(
        self.registration.showNotification(event.data.text(), {
          icon: '/img/logo-mairie.jpg',
          badge: '/badge.png',
          vibrate: [200, 100, 200, 100, 200, 100, 400],
          data: { url: '/' }
        })
      );
    }
  }
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

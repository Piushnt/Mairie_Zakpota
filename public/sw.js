const CACHE_NAME = 'zakpota-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.jpg'
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
  // Ignorer les requêtes de dev localhost, Vite et Supabase
  if (
    event.request.url.includes('localhost') ||
    event.request.url.includes('127.0.0.1') ||
    event.request.url.includes('supabase.co') ||
    event.request.url.includes('chrome-extension')
  ) {
    return;
  }

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
        icon: data.icon || '/logo.jpg',
        badge: data.badge || '/badge.png',
        image: data.image || undefined, // Rich Media image
        vibrate: [300, 100, 400],
        requireInteraction: true,
        data: { 
          url: data.data?.url || data.url || '/' 
        }
      };

      if (options.data.url && options.data.url.includes('/news/')) {
        options.actions = [
          { action: 'read-article', title: 'Lire l\'article' }
        ];
      }

      event.waitUntil(
        self.registration.showNotification(data.title, options)
      );
    } catch (e) {
      // If payload is not valid JSON, show generic
      event.waitUntil(
        self.registration.showNotification(event.data.text(), {
          icon: '/logo.jpg',
          badge: '/logo.jpg',
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
      // Si une fenêtre est déjà ouverte sur la bonne URL, on lui donne le focus
      for (let client of clientList) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      // Sinon, on ouvre une nouvelle fenêtre
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

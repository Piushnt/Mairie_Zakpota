
const CACHE_NAME = 'mairie-zakpota-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/logo.jpg'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Push Event
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { title: 'Mairie de Za-Kpota', body: 'Nouvelle notification' };
  
  const options = {
    body: data.body,
    icon: '/favicon.ico', // Update with real icon path
    badge: '/favicon.ico',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      { action: 'explore', title: 'Voir les détails', icon: 'checkmark.png' },
      { action: 'close', title: 'Fermer', icon: 'xmark.png' },
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification Click Event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});

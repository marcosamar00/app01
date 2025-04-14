// Definindo o nome do cache
const CACHE_NAME = 'pwa-cache-v1';

// Arquivos que serão armazenados no cache
const CACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/styles.css',
  '/app.js'
];

// Evento de instalação do Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker instalado.');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Arquivos em cache');
      return cache.addAll(CACHE_ASSETS);
    })
  );
});

// Evento de ativação do Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker ativado.');
  // Limpeza de caches antigos
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log(`Cache antigo removido: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Evento de busca (fetch) para retornar recursos do cache ou da rede
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Se o recurso estiver no cache, retorna do cache
      if (cachedResponse) {
        return cachedResponse;
      }
      // Caso contrário, tenta buscar o recurso da rede
      return fetch(event.request).then((response) => {
        // Se a resposta for válida, coloca-a no cache
        if (response && response.status === 200 && response.type === 'basic') {
          let responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      });
    })
  );
});

// Evento de sincronização periódica (se necessário)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(
      // Coloque aqui o código para sincronizar os dados em segundo plano
      console.log('Sincronização de dados em segundo plano.')
    );
  }
});

// Notificação push (se necessário)
self.addEventListener('push', (event) => {
  let options = {
    body: event.data ? event.data.text() : 'Nova notificação do PWA!',
    icon: '/icon-192.png',
    badge: '/icon-192.png'
  };

  event.waitUntil(
    self.registration.showNotification('Notificação Push', options)
  );
});

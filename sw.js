const CACHE_NAME = 'rank-v2'; // Mudei para V2 para forçar limpeza
const urlsToCache = ['./', './index.html', './manifest.json'];

// Instalação: Cacheia os arquivos básicos
self.addEventListener('install', event => {
  self.skipWaiting(); // Força o novo SW a ativar imediatamente
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Ativação: Limpa caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
});

// Estratégia Network-First: Tenta a rede, se falhar (offline), usa o cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Se a rede funcionar, clona a resposta e guarda no cache
        const resClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
        return response;
      })
      .catch(() => caches.match(event.request)) // Se falhar rede, usa cache
  );
});

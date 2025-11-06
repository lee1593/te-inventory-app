const CACHE = 'te-inventory-static-v3';
const ASSETS = [
  'index.html','styles.css','app.js','db.js',
  'components/camera.js','components/signature.js','components/meters.js',
  'manifest.webmanifest','icons/icon-192.png','icons/icon-512.png'
];

self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e)=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE?caches.delete(k):null)))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e)=>{
  const {request}=e;
  e.respondWith(
    caches.match(request).then(cached=>cached || fetch(request))
  );
});

const CACHE='pdf-library-v1-__VERSION__';
const ASSETS=__ASSETS__;
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const k of await caches.keys())if(k.startsWith('pdf-library-v')&&k!==CACHE)await caches.delete(k);await self.clients.claim();})()));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin||!u.pathname.startsWith(new URL(self.registration.scope).pathname))return;
e.respondWith((async()=>{const c=await caches.open(CACHE);if(e.request.mode==='navigate'){return await c.match('./index.html')||fetch(e.request);}return await c.match(e.request,{ignoreSearch:true})||fetch(e.request);})());});

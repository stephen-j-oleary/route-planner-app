self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("v1").then(cache => cache.addAll([
      "/manifest.json",
      "/favicon.ico",
      "/icon.png",
      "/apple-icon.png",
    ]))
  );
});



self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => (
      res || fetch(e.request)
    ))
  );
});
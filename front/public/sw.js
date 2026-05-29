const APP_CACHE = "dazyhub-app-v1";
const APP_CACHE_PREFIX = "dazyhub-app-";
const FAVICON_CACHE = "dazyhub-favicon-v3";
const FAVICON_CACHE_PREFIX = "dazyhub-favicon-";
const APP_SHELL = ["/", "/index.html", "/favicon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(APP_CACHE);
    await cache.addAll(APP_SHELL);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((key) => (
          (key.startsWith(APP_CACHE_PREFIX) && key !== APP_CACHE)
          || (key.startsWith(FAVICON_CACHE_PREFIX) && key !== FAVICON_CACHE)
          || key === "favicon-cache"
        ))
        .map((key) => caches.delete(key)),
    );
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname === "/api/favicon") {
    event.respondWith(faviconResponse(request));
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(navigationResponse(request));
    return;
  }

  if (isAppAsset(url)) {
    event.respondWith(appAssetResponse(request));
  }
});

async function navigationResponse(request) {
  const cache = await caches.open(APP_CACHE);

  try {
    const response = await fetch(request);
    if (response.ok) {
      await cache.put("/", response.clone());
      await cache.put("/index.html", response.clone());
    }
    return response;
  } catch {
    return (
      await cache.match(request)
      || await cache.match("/index.html")
      || await cache.match("/")
      || new Response("DazyHub is offline", {
        status: 503,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      })
    );
  }
}

async function appAssetResponse(request) {
  const cache = await caches.open(APP_CACHE);
  const cached = await cache.match(request);
  const fetched = fetch(request)
    .then(async (response) => {
      if (response.ok) {
        await cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  return cached || await fetched || new Response(null, { status: 504, statusText: "Asset unavailable" });
}

async function faviconResponse(request) {
  const cache = await caches.open(FAVICON_CACHE);
  const cached = await cache.match(request);
  if (cached) {
    return cached;
  }

  const response = await fetch(request).catch(() => null);
  if (isCacheableImage(response)) {
    await cache.put(request, response.clone());
  }
  if (response) return response;

  return new Response(null, { status: 504, statusText: "Favicon unavailable" });
}

function isCacheableImage(response) {
  if (!response || !response.ok) return false;
  const contentType = response.headers.get("content-type") || "";
  return contentType.toLowerCase().startsWith("image/");
}

function isAppAsset(url) {
  return (
    url.pathname === "/favicon.svg"
    || url.pathname.startsWith("/assets/")
    || /\.(?:js|css|png|jpe?g|webp|svg|ico|woff2?)$/i.test(url.pathname)
  );
}

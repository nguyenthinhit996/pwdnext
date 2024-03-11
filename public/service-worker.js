// the cache version gets updated every time there is a new deployment
const CACHE_VERSION = 1;
const CURRENT_CACHE = `main-${CACHE_VERSION}`;

// these are the routes we are going to cache for offline support
const cacheFiles = [
  "/",
  "/tasks",
  "/next.svg",
  "/vercel.svg",
  "/manifest.json",
  "/assets/img/avatar.jpg",
  "/assets/img/login-bg.png",
  "/assets/img/tma-logo.png",
  "/assets/img/android-192x192.png",
  "/assets/img/android-36x36.png",
  "/assets/img/android-144x144.png",
  "/assets/img/android-48x48.png",
  "/assets/img/android-72x72.png",
  "/assets/img/android-96x96.png",
  "/assets/img/android-chrome-192x192.png",
  "/assets/img/android-chrome-512x512.png",
  "/assets/img/android-chrome-maskable-192x192.png",
  "/assets/img/android-chrome-maskable-512x512.png",
  "/assets/img/apple-touch-icon.png",
  "/assets/img/bell64x64.png",
  "/assets/img/bell.png",
  "/assets/img/favicon.ico",
  "/assets/img/login-bg-1.png",
  "/assets/img/login-bg-3.png",
  "/assets/img/step1.png",
  "/assets/img/step2.png",
  "/assets/img/step3.png",
  "/assets/img/sticker.png",
];

// on activation we clean up the previously registered service workers
self.addEventListener("activate", (evt) => {
  evt.waitUntil(
    (async () => {
      // Take control of all clients as soon as the service worker becomes active.
      await self.clients.claim();
      // Get all cache names.
      const cacheNames = await caches.keys();
      // Delete any caches that are not the current one.
      const oldCachesPromises = cacheNames.map(async (cacheName) => {
        if (cacheName !== CURRENT_CACHE) {
          await caches.delete(cacheName);
        }
      });
      await Promise.all(oldCachesPromises);
    })()
  );
});

// on install we download the routes we want to cache for offline
self.addEventListener("install", (evt) =>
  evt.waitUntil(
    caches.open(CURRENT_CACHE).then((cache) => {
      return cache.addAll(
        cacheFiles.map(
          (url) => new Request(url, { credentials: "same-origin" })
        )
      );
    })
  )
);

// cache the current page to make it available for offline
const update = (request, response) => {
  console.log("const update = (request, response)", response);
  caches.open(CURRENT_CACHE).then((cache) => cache.put(request, response));
};

// fetch the resource from the network
const fromNetwork = async (request, timeout) => {
  let timeoutId;
  try {
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error("Request timed out"));
      }, timeout);
    });

    const fetchPromise = fetch(request);
    const response = await Promise.race([fetchPromise, timeoutPromise]);
    clearTimeout(timeoutId);
    await update(request, response.clone());
    return response;
  } catch (error) {
    clearTimeout(timeoutId); // Ensure the timeout is cleared if an error occurs
    throw error; // Re-throw the error to be handled by the caller
  }
};

// fetch the resource from the browser cache
const fromCache = async (request) => {
  const cache = await caches.open(CURRENT_CACHE);
  let matching = await cache.match(request);
  if (!matching) matching = await cache.match("/offline/");
  return matching;
};

// general strategy when making a request (eg if online try to fetch it
// from the network with a timeout, if something fails serve from cache)
self.addEventListener("fetch", (evt) => {
  if (evt.request.method !== "GET") {
    return;
  }
  evt.respondWith(
    fromNetwork(evt.request, 10000).catch(() => fromCache(evt.request))
  );
});

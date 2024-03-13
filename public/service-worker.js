// the cache version gets updated every time there is a new deployment
const CACHE_VERSION = 1;
const CURRENT_CACHE = `main-${CACHE_VERSION}`;
const indexedDBName = "WASMOfflinePWA";
const objectStoreName = "OfflinePostRequests";

// these are the routes we are going to cache for offline support
const cacheFiles = [
  "/",
  "/login",
  "/tasks",
  "/detail",
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
  "/offline",
  "/offline.html",
  "/assets/css/offline-style.css",
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
self.addEventListener("install", (evt) => {
  evt.waitUntil(
    caches.open(CURRENT_CACHE).then((cache) => {
      return cache.addAll(
        cacheFiles.map(
          (url) => new Request(url, { credentials: "same-origin" })
        )
      );
    })
  );
  /*
   ** check network state after certain time interval
   ** If online for the first time, create an indexed db and a table
   ** If online after going offline, hit all requests saved in indexed table to server and empty the table
   */
  checkNetworkState();
});

// cache the current page to make it available for offline
const update = (request, response) => {
  console.log("const update = (request, response)", response);
  caches.open(CURRENT_CACHE).then((cache) => cache.put(request.url, response));
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
  if (!matching && request.mode === "navigate") {
    matching = await cache.match("/offline.html");
  }
  return matching;
};

// general strategy when making a request (eg if online try to fetch it
// from the network with a timeout, if something fails serve from cache)
self.addEventListener("fetch", (evt) => {
  if (evt.request.method === "GET") {
    evt.respondWith(
      fromNetwork(evt.request, 10000).catch(() => fromCache(evt.request))
    );
  } else if (evt.request.method === "PUT") {
    console.log("PUT request ", evt.request.url);
    var reqUrl = evt.request.url;
    var authHeader = evt.request.headers.get("Authorization");

    if (!navigator.onLine) {
      evt.respondWith(
        Promise.resolve(evt.request.text()).then((payload) => {
          console.log("PUT request offline ");

          // if offline, save request details to IndexedDB to be sent later
          saveIntoIndexedDB(reqUrl, authHeader, payload);

          // return dummy response so application can continue execution
          const myOptions = { status: 200, statusText: "Fabulous" };
          return new Response(payload, myOptions);
        })
      );
    }

    // evt.respondWith(
    //   Promise.resolve(evt.request.text()).then((payload) => {
    //     // if application is online, send request over network
    //     // if (navigator.onLine) {
    //     //   return fetch(reqUrl, {
    //     //     method: "PUT",
    //     //     headers: {
    //     //       Accept: "application/json",
    //     //       "Content-Type": "application/json",
    //     //       Authorization: authHeader,
    //     //     },
    //     //     body: payload,
    //     //   });
    //     // } else {
    //     //   console.log("PUT request offline ");

    //     //   // if offline, save request details to IndexedDB to be sent later
    //     //   saveIntoIndexedDB(reqUrl, authHeader, payload);

    //     //   // return dummy response so application can continue execution
    //     //   const myOptions = { status: 200, statusText: "Fabulous" };
    //     //   return new Response(payload, myOptions);
    //     // }

    //     // TODO solution 2
    //     // if (!navigator.onLine) {
    //     //   console.log("PUT request offline ");

    //     //   // if offline, save request details to IndexedDB to be sent later
    //     //   saveIntoIndexedDB(reqUrl, authHeader, payload);

    //     //   // return dummy response so application can continue execution
    //     //   const myOptions = { status: 200, statusText: "Fabulous" };
    //     //   return new Response(payload, myOptions);
    //     // }
    //   })
    // );
  }
});

function saveIntoIndexedDB(url, authHeader, payload) {
  const DBOpenRequest = indexedDB.open(indexedDBName);

  DBOpenRequest.onsuccess = (event) => {
    // create request object
    const postRequest = [
      {
        url: url,
        authHeader: authHeader,
        payload: payload,
      },
    ];

    db = event.target.result;
    const transaction = db.transaction([objectStoreName], "readwrite");
    const objectStore = transaction.objectStore(objectStoreName);
    const objectStoreRequest = objectStore.add(postRequest[0]);

    objectStoreRequest.onsuccess = (event) => {
      console.log("Request saved to IndexedDB");
    };
  };
}

function checkNetworkState() {
  setInterval(function () {
    if (navigator.onLine) {
      sendOfflinePostRequestsToServer();
    }
  }, 3000);
}

async function sendOfflinePostRequestsToServer() {
  const DBOpenRequest = indexedDB.open(indexedDBName);

  // create the object store if doesn't exist
  DBOpenRequest.onupgradeneeded = (event) => {
    db = event.target.result;

    if (!db.objectStoreNames.contains(objectStoreName)) {
      objectStore = db.createObjectStore(objectStoreName, {
        keyPath: "id",
        autoIncrement: true,
      });
    }
  };

  DBOpenRequest.onsuccess = (event) => {
    db = event.target.result;

    const transaction = db.transaction([objectStoreName]);
    const objectStore = transaction.objectStore(objectStoreName);
    var allRecords = objectStore.getAll(); // get all records
    let currentRecord = null;

    allRecords.onsuccess = function () {
      if (allRecords.result && allRecords.result.length > 0) {
        console.log("IndexedDB records: ", allRecords.result);
        // only submit the last item in indexedDB(due to its status is the latest)
        lastRecord = allRecords.result[allRecords.result.length - 1];
        fetch(lastRecord.url, {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: lastRecord.authHeader,
          },
          body: lastRecord.payload,
        });
        const transaction = db.transaction([objectStoreName], "readwrite");
        const objectStore = transaction.objectStore(objectStoreName);
        // remove details from IndexedDB
        objectStore.clear();
      }
    };
  };
}

self.addEventListener("message", async (event) => {
  console.log(event.data);
  const STEP_STATUS_MAP = {
    STEP2: "IN_PROGRESS",
    STEP3: "IN_PROGRESS",
    COMPLETED: "COMPLETED",
  };
  const { url, userId, status, taskId } = event.data;

  if (url) {
    const cacheStorage = await caches.open(CURRENT_CACHE);
    const cachedResponse = await cacheStorage.match(url);
    if (!cachedResponse || !cachedResponse.ok) {
      console.log(`${event.data} is empty`);
      return;
    }
    const jsonRes = await cachedResponse.json();
    if (jsonRes?.length > 0) {
      jsonRes.forEach((t) => {
        if (t.id === taskId) {
          t.status = STEP_STATUS_MAP[status];
        }
      });
    }
    console.log(jsonRes);
    await updateExistingCache(url, jsonRes);
  }
});

async function updateExistingCache(key, updatedValue) {
  const cacheStorage = await caches.open(CURRENT_CACHE);
  const cachedResponse = await cacheStorage.match(key);
  if (!cachedResponse || !cachedResponse.ok) {
    return;
  }
  cacheStorage.put(key, Response.json(updatedValue));
}

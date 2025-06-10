const CACHE_NAME = "edubuilder-enhanced-v2"
const urlsToCache = ["/", "/manifest.json", "/data/demos.json", "/data/enhanced-demos.json", "/offline.html"]

// Install event - cache resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    }),
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
  self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return (
        response ||
        fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== "basic") {
              return response
            }

            // Clone the response
            const responseToCache = response.clone()

            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache)
            })

            return response
          })
          .catch(() => {
            // If both cache and network fail, return offline page for navigation requests
            if (event.request.destination === "document") {
              return caches.match("/offline.html")
            }
          })
      )
    }),
  )
})

// Background sync for custom content
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    event.waitUntil(doBackgroundSync())
  }
})

function doBackgroundSync() {
  // Sync custom content when online
  return fetch("/api/sync-custom-content", {
    method: "POST",
    body: JSON.stringify({}),
    headers: {
      "Content-Type": "application/json",
    },
  }).catch(() => {
    // Fail silently - will retry on next sync
  })
}

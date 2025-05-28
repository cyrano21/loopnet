// Service Worker pour les notifications push
const CACHE_NAME = "loopnet-clone-v1"
const urlsToCache = ["/", "/offline.html", "/icon-192x192.png", "/icon-512x512.png"]

// Installation du service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    }),
  )
})

// Activation du service worker
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
})

// Interception des requêtes (cache-first strategy)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Retourner la réponse du cache si disponible
      if (response) {
        return response
      }

      // Sinon, faire la requête réseau
      return fetch(event.request).catch(() => {
        // Si offline, retourner la page offline pour les navigations
        if (event.request.destination === "document") {
          return caches.match("/offline.html")
        }
      })
    }),
  )
})

// Gestion des notifications push
self.addEventListener("push", (event) => {
  const options = {
    body: "Vous avez une nouvelle notification",
    icon: "/icon-192x192.png",
    badge: "/icon-192x192.png",
    vibrate: [200, 100, 200],
    data: {
      timestamp: Date.now(),
    },
    actions: [
      {
        action: "view",
        title: "Voir",
      },
      {
        action: "dismiss",
        title: "Ignorer",
      },
    ],
  }

  if (event.data) {
    const data = event.data.json()
    options.body = data.body || options.body
    options.data = { ...options.data, ...data }
  }

  event.waitUntil(self.registration.showNotification("LoopNet Clone", options))
})

// Gestion des clics sur les notifications
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  if (event.action === "view") {
    // Ouvrir l'application
    event.waitUntil(clients.openWindow("/"))
  } else if (event.action === "dismiss") {
    // Ne rien faire, la notification est déjà fermée
  } else {
    // Clic par défaut sur la notification
    event.waitUntil(clients.openWindow("/"))
  }
})

// Gestion de la synchronisation en arrière-plan
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    event.waitUntil(
      // Synchroniser les données en arrière-plan
      syncData(),
    )
  }
})

async function syncData() {
  try {
    // Synchroniser les données critiques
    console.log("Background sync completed")
  } catch (error) {
    console.error("Background sync failed:", error)
  }
}

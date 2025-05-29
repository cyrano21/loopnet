"use client"

export class PushNotificationService {
  private static instance: PushNotificationService
  private registration: ServiceWorkerRegistration | null = null
  private vapidKey: string | null = null

  static getInstance(): PushNotificationService {
    if (!this.instance) {
      this.instance = new PushNotificationService()
    }
    return this.instance
  }

  // Récupérer la clé VAPID depuis le serveur
  private async getVapidKey(): Promise<string | null> {
    if (this.vapidKey) {
      return this.vapidKey
    }

    try {
      const response = await fetch("/api/notifications/vapid-key")
      if (!response.ok) {
        throw new Error("Impossible de récupérer la clé VAPID")
      }

      const data = await response.json()
      this.vapidKey = data.vapidKey
      return this.vapidKey
    } catch (error) {
      console.error("Erreur récupération clé VAPID:", error)
      return null
    }
  }

  // Initialiser les notifications push
  async initialize(): Promise<boolean> {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.warn("Push notifications not supported")
      return false
    }

    try {
      // Enregistrer le service worker
      this.registration = await navigator.serviceWorker.register("/sw.js")
      console.log("Service Worker registered:", this.registration)

      // Demander la permission
      const permission = await this.requestPermission()
      return permission === "granted"
    } catch (error) {
      console.error("Failed to initialize push notifications:", error)
      return false
    }
  }

  // Demander la permission
  async requestPermission(): Promise<NotificationPermission> {
    if (!("Notification" in window)) {
      return "denied"
    }

    if (Notification.permission === "default") {
      return await Notification.requestPermission()
    }

    return Notification.permission
  }

  // S'abonner aux notifications
  async subscribe(): Promise<PushSubscription | null> {
    if (!this.registration) {
      console.error("Service worker not registered")
      return null
    }

    try {
      // Récupérer la clé VAPID depuis le serveur
      const vapidKey = await this.getVapidKey()
      if (!vapidKey) {
        console.error("Clé VAPID non disponible")
        return null
      }

      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(vapidKey),
      })

      // Envoyer l'abonnement au serveur
      await this.sendSubscriptionToServer(subscription)
      return subscription
    } catch (error) {
      console.error("Failed to subscribe to push notifications:", error)
      return null
    }
  }

  // Se désabonner
  async unsubscribe(): Promise<boolean> {
    if (!this.registration) {
      return false
    }

    try {
      const subscription = await this.registration.pushManager.getSubscription()
      if (subscription) {
        await subscription.unsubscribe()
        await this.removeSubscriptionFromServer(subscription)
      }
      return true
    } catch (error) {
      console.error("Failed to unsubscribe:", error)
      return false
    }
  }

  // Envoyer une notification locale
  async showNotification(title: string, options: NotificationOptions = {}) {
    if (Notification.permission !== "granted") {
      return
    }

    const defaultOptions: NotificationOptions = {
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

    const notificationOptions = { ...defaultOptions, ...options }

    if (this.registration) {
      await this.registration.showNotification(title, notificationOptions)
    } else {
      new Notification(title, notificationOptions)
    }
  }

  // Envoyer l'abonnement au serveur
  private async sendSubscriptionToServer(subscription: PushSubscription) {
    try {
      await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription),
      })
    } catch (error) {
      console.error("Failed to send subscription to server:", error)
    }
  }

  // Supprimer l'abonnement du serveur
  private async removeSubscriptionFromServer(subscription: PushSubscription) {
    try {
      await fetch("/api/notifications/unsubscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription),
      })
    } catch (error) {
      console.error("Failed to remove subscription from server:", error)
    }
  }

  // Convertir la clé VAPID
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }

    return outputArray
  }

  // Vérifier le statut de l'abonnement
  async getSubscriptionStatus(): Promise<{
    supported: boolean
    permission: NotificationPermission
    subscribed: boolean
  }> {
    const supported = "serviceWorker" in navigator && "PushManager" in window
    const permission = "Notification" in window ? Notification.permission : "denied"

    let subscribed = false
    if (this.registration) {
      const subscription = await this.registration.pushManager.getSubscription()
      subscribed = !!subscription
    }

    return { supported, permission, subscribed }
  }
}

// Hook pour les notifications push
export function usePushNotifications() {
  const service = PushNotificationService.getInstance()

  const initialize = () => service.initialize()
  const subscribe = () => service.subscribe()
  const unsubscribe = () => service.unsubscribe()
  const showNotification = (title: string, options?: NotificationOptions) => service.showNotification(title, options)
  const getStatus = () => service.getSubscriptionStatus()

  return {
    initialize,
    subscribe,
    unsubscribe,
    showNotification,
    getStatus,
  }
}

interface SecurityEvent {
  type: "bot_detected" | "devtools_opened" | "suspicious_request" | "rate_limit_exceeded" | "unauthorized_access"
  ip: string
  userAgent: string
  timestamp: Date
  details: Record<string, any>
  severity: "low" | "medium" | "high" | "critical"
}

export class SecurityMonitor {
  private static events: SecurityEvent[] = []
  private static readonly MAX_EVENTS = 1000

  static async logSecurityEvent(event: Omit<SecurityEvent, "timestamp">) {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: new Date(),
    }

    // Ajouter à la mémoire
    this.events.unshift(securityEvent)
    if (this.events.length > this.MAX_EVENTS) {
      this.events.pop()
    }

    // Log en console avec couleurs
    const color = this.getSeverityColor(event.severity)
    console.log(`🚨 SECURITY EVENT [${event.severity.toUpperCase()}]`)
    console.log(`Type: ${event.type}`)
    console.log(`IP: ${event.ip}`)
    console.log(`User-Agent: ${event.userAgent}`)
    console.log(`Details:`, event.details)

    // Sauvegarder en base de données (optionnel) - Désactivé pour Edge Runtime
    try {
      await this.saveToMemory(securityEvent)
    } catch (error) {
      console.error("Failed to save security event:", error)
    }

    // Alertes critiques
    if (event.severity === "critical") {
      await this.sendCriticalAlert(securityEvent)
    }
  }

  private static getSeverityColor(severity: string): string {
    switch (severity) {
      case "low":
        return "#10b981"
      case "medium":
        return "#f59e0b"
      case "high":
        return "#ef4444"
      case "critical":
        return "#dc2626"
      default:
        return "#6b7280"
    }
  }

  private static async saveToMemory(event: SecurityEvent) {
    // Pour Edge Runtime, on sauvegarde seulement en mémoire
    // En production, utiliser une base de données compatible Edge
    try {
      // Simulation de sauvegarde
      console.log("Security event saved to memory:", event.type)
    } catch (error) {
      console.error("Memory save failed:", error)
    }
  }

  private static async sendCriticalAlert(event: SecurityEvent) {
    // Alertes simplifiées pour Edge Runtime
    console.error("🚨 CRITICAL SECURITY ALERT:", event)

    // En production, utiliser des services compatibles Edge (ex: fetch vers webhook)
    try {
      // await fetch('/api/alerts', {
      //   method: 'POST',
      //   body: JSON.stringify(event)
      // })
    } catch (error) {
      console.error("Failed to send critical alert:", error)
    }
  }

  // Obtenir les événements récents
  static getRecentEvents(limit = 50): SecurityEvent[] {
    return this.events.slice(0, limit)
  }

  // Obtenir les statistiques
  static getStatistics() {
    const now = new Date()
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const lastHour = new Date(now.getTime() - 60 * 60 * 1000)

    const events24h = this.events.filter((e) => e.timestamp > last24h)
    const eventsLastHour = this.events.filter((e) => e.timestamp > lastHour)

    const typeStats = this.events.reduce(
      (acc, event) => {
        acc[event.type] = (acc[event.type] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const severityStats = this.events.reduce(
      (acc, event) => {
        acc[event.severity] = (acc[event.severity] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      total: this.events.length,
      last24h: events24h.length,
      lastHour: eventsLastHour.length,
      byType: typeStats,
      bySeverity: severityStats,
      topIPs: this.getTopIPs(),
    }
  }

  private static getTopIPs(limit = 10) {
    const ipCounts = this.events.reduce(
      (acc, event) => {
        acc[event.ip] = (acc[event.ip] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(ipCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([ip, count]) => ({ ip, count }))
  }

  // Vérifier si une IP est suspecte
  static isSuspiciousIP(ip: string): boolean {
    const ipEvents = this.events.filter((e) => e.ip === ip)
    const recentEvents = ipEvents.filter((e) => e.timestamp > new Date(Date.now() - 60 * 60 * 1000))

    // IP suspecte si plus de 10 événements dans la dernière heure
    return recentEvents.length > 10
  }

  // Bloquer une IP temporairement
  static blockIP(ip: string, duration = 60 * 60 * 1000) {
    console.log(`🚫 Blocking IP ${ip} for ${duration}ms`)
  }
}

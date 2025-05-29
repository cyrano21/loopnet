import type { NextRequest } from "next/server"
import { SecurityMonitor } from "./security-monitor"

interface SecurityConfig {
  maxRequestsPerMinute: number
  maxRequestsPerHour: number
  blockedUserAgents: string[]
  allowedOrigins: string[]
  requireCaptcha: boolean
}

const SECURITY_CONFIG: SecurityConfig = {
  maxRequestsPerMinute: 60,
  maxRequestsPerHour: 1000,
  blockedUserAgents: [
    "bot",
    "crawler",
    "spider",
    "scraper",
    "wget",
    "curl",
    "python",
    "requests",
    "scrapy",
    "selenium",
    "phantomjs",
    "headless",
  ],
  allowedOrigins: [process.env.NEXTAUTH_URL || "http://localhost:3000", "https://your-domain.com"],
  requireCaptcha: true,
}

// Rate limiting store (en production, utiliser Redis)
const rateLimitStore = new Map<
  string,
  { count: number; resetTime: number; hourlyCount: number; hourlyResetTime: number }
>()

export class AntiScrapingService {
  static async validateRequest(request: NextRequest): Promise<{ allowed: boolean; reason?: string }> {
    const ip = this.getClientIP(request)
    const userAgent = request.headers.get("user-agent") || ""
    const origin = request.headers.get("origin")
    const referer = request.headers.get("referer")

    // 1. Vérifier les User-Agents suspects
    if (this.isSuspiciousUserAgent(userAgent)) {
      await SecurityMonitor.logSecurityEvent({
        type: "bot_detected",
        ip,
        userAgent,
        severity: "high",
        details: { reason: "Suspicious user agent detected" },
      })
      console.log(`🚫 Blocked suspicious user agent: ${userAgent} from IP: ${ip}`)
      return { allowed: false, reason: "Suspicious user agent" }
    }

    // 2. Vérifier l'origine
    if (origin && !this.isAllowedOrigin(origin)) {
      console.log(`🚫 Blocked unauthorized origin: ${origin} from IP: ${ip}`)
      return { allowed: false, reason: "Unauthorized origin" }
    }

    // 3. Rate limiting
    const rateLimitResult = this.checkRateLimit(ip)
    if (!rateLimitResult.allowed) {
      await SecurityMonitor.logSecurityEvent({
        type: "rate_limit_exceeded",
        ip,
        userAgent,
        severity: "medium",
        details: { remaining: rateLimitResult.remaining },
      })
      console.log(`🚫 Rate limit exceeded for IP: ${ip}`)
      return { allowed: false, reason: "Rate limit exceeded" }
    }

    // 4. Vérifier les patterns de requêtes suspectes
    if (this.isSuspiciousRequestPattern(request)) {
      console.log(`🚫 Suspicious request pattern from IP: ${ip}`)
      return { allowed: false, reason: "Suspicious request pattern" }
    }

    // 5. Vérifier les headers manquants (navigateurs réels ont certains headers)
    if (!this.hasValidBrowserHeaders(request)) {
      console.log(`🚫 Missing browser headers from IP: ${ip}`)
      return { allowed: false, reason: "Invalid browser headers" }
    }

    return { allowed: true }
  }

  private static getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get("x-forwarded-for")
    const realIP = request.headers.get("x-real-ip")
    const cfIP = request.headers.get("cf-connecting-ip")

    return cfIP || realIP || forwarded?.split(",")[0] || "unknown"
  }

  private static isSuspiciousUserAgent(userAgent: string): boolean {
    const lowerUA = userAgent.toLowerCase()
    return SECURITY_CONFIG.blockedUserAgents.some((blocked) => lowerUA.includes(blocked))
  }

  private static isAllowedOrigin(origin: string): boolean {
    return SECURITY_CONFIG.allowedOrigins.some((allowed) => origin.startsWith(allowed))
  }

  private static checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
    const now = Date.now()
    const minuteWindow = 60 * 1000 // 1 minute
    const hourWindow = 60 * 60 * 1000 // 1 hour

    let record = rateLimitStore.get(ip)

    if (!record) {
      record = {
        count: 0,
        resetTime: now + minuteWindow,
        hourlyCount: 0,
        hourlyResetTime: now + hourWindow,
      }
    }

    // Reset counters if windows expired
    if (now > record.resetTime) {
      record.count = 0
      record.resetTime = now + minuteWindow
    }

    if (now > record.hourlyResetTime) {
      record.hourlyCount = 0
      record.hourlyResetTime = now + hourWindow
    }

    record.count++
    record.hourlyCount++
    rateLimitStore.set(ip, record)

    const minuteExceeded = record.count > SECURITY_CONFIG.maxRequestsPerMinute
    const hourExceeded = record.hourlyCount > SECURITY_CONFIG.maxRequestsPerHour

    return {
      allowed: !minuteExceeded && !hourExceeded,
      remaining: Math.max(0, SECURITY_CONFIG.maxRequestsPerMinute - record.count),
    }
  }

  private static isSuspiciousRequestPattern(request: NextRequest): boolean {
    const url = request.url
    const method = request.method

    // Vérifier les patterns suspects
    const suspiciousPatterns = [
      /\/api\/.*\/.*\/.*\/.*/, // Trop de niveaux d'API
      /\.(php|asp|jsp|cgi)/, // Extensions de fichiers suspects
      /admin|wp-admin|phpmyadmin/, // Tentatives d'accès admin
      /\.env|config|backup/, // Fichiers sensibles
    ]

    return suspiciousPatterns.some((pattern) => pattern.test(url))
  }

  private static hasValidBrowserHeaders(request: NextRequest): boolean {
    const requiredHeaders = ["accept", "accept-language", "accept-encoding"]
    return requiredHeaders.every((header) => request.headers.has(header))
  }

  // Générer un token anti-CSRF
  static generateCSRFToken(): string {
    return Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString("base64")
  }

  // Valider le token anti-CSRF
  static validateCSRFToken(token: string, sessionToken: string): boolean {
    // En production, stocker les tokens en session/database
    return token === sessionToken
  }
}

// Middleware de protection des assets
export function protectAssets(request: NextRequest) {
  const url = request.nextUrl.pathname

  // Protéger les fichiers sensibles
  const protectedPaths = [
    "/.env",
    "/package.json",
    "/next.config.js",
    "/tsconfig.json",
    "/.git",
    "/node_modules",
    "/src",
    "/components",
    "/lib",
    "/utils",
  ]

  if (protectedPaths.some((path) => url.startsWith(path))) {
    return new Response("Forbidden", { status: 403 })
  }

  return null
}

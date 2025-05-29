"use client"

// Google Analytics 4
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

export function pageview(url: string) {
  if (!GA_TRACKING_ID) return
  
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  })
}

export function trackEvent(action: string, category: string, label?: string, value?: number) {
  if (!GA_TRACKING_ID) return
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}

export function trackWebVitals() {
  if (!GA_TRACKING_ID || typeof window === 'undefined') return

  // Import web-vitals dynamically to avoid SSR issues
  import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
    onCLS((metric: any) => {
      window.gtag('event', 'web_vitals', {
        event_category: 'Web Vitals',
        event_label: metric.name,
        value: Math.round(metric.value),
        custom_map: { metric_id: metric.id },
      })
    })

    onINP((metric: any) => {
      window.gtag('event', 'web_vitals', {
        event_category: 'Web Vitals',
        event_label: metric.name,
        value: Math.round(metric.value),
        custom_map: { metric_id: metric.id },
      })
    })

    onFCP((metric: any) => {
      window.gtag('event', 'web_vitals', {
        event_category: 'Web Vitals',
        event_label: metric.name,
        value: Math.round(metric.value),
        custom_map: { metric_id: metric.id },
      })
    })

    onLCP((metric: any) => {
      window.gtag('event', 'web_vitals', {
        event_category: 'Web Vitals',
        event_label: metric.name,
        value: Math.round(metric.value),
        custom_map: { metric_id: metric.id },
      })
    })

    onTTFB((metric: any) => {
      window.gtag('event', 'web_vitals', {
        event_category: 'Web Vitals',
        event_label: metric.name,
        value: Math.round(metric.value),
        custom_map: { metric_id: metric.id },
      })
    })
  }).catch((error) => {
    console.warn('Failed to load web-vitals:', error)
  })
}

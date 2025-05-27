import type { Metadata } from "next"

export interface SEOConfig {
  title: string
  description: string
  keywords: string[]
  canonical?: string
  ogImage?: string
  noindex?: boolean
  nofollow?: boolean
}

export class SEOService {
  private static readonly SITE_NAME = "LoopNet Clone - Commercial Real Estate"
  private static readonly SITE_URL = process.env.NEXTAUTH_URL || "https://your-domain.com"
  private static readonly DEFAULT_OG_IMAGE = "/og-image.jpg"

  static generateMetadata(config: SEOConfig): Metadata {
    const {
      title,
      description,
      keywords,
      canonical,
      ogImage = this.DEFAULT_OG_IMAGE,
      noindex = false,
      nofollow = false,
    } = config

    const fullTitle = `${title} | ${this.SITE_NAME}`
    const canonicalUrl = canonical || this.SITE_URL

    return {
      title: fullTitle,
      description,
      keywords: keywords.join(", "),

      // Robots
      robots: {
        index: !noindex,
        follow: !nofollow,
        googleBot: {
          index: !noindex,
          follow: !nofollow,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },

      // Open Graph
      openGraph: {
        title: fullTitle,
        description,
        url: canonicalUrl,
        siteName: this.SITE_NAME,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        locale: "fr_FR",
        type: "website",
      },

      // Twitter
      twitter: {
        card: "summary_large_image",
        title: fullTitle,
        description,
        images: [ogImage],
        creator: "@yourhandle",
      },

      // Canonical
      alternates: {
        canonical: canonicalUrl,
      },

      // Additional meta tags
      other: {
        "theme-color": "#3b82f6",
        "msapplication-TileColor": "#3b82f6",
        "apple-mobile-web-app-capable": "yes",
        "apple-mobile-web-app-status-bar-style": "default",
        "format-detection": "telephone=no",
      },
    }
  }

  // Générer le Schema.org JSON-LD
  static generateSchema(type: "Organization" | "RealEstateAgent" | "Product" | "Article", data: any) {
    const baseSchema = {
      "@context": "https://schema.org",
      "@type": type,
    }

    switch (type) {
      case "Organization":
        return {
          ...baseSchema,
          name: this.SITE_NAME,
          url: this.SITE_URL,
          logo: `${this.SITE_URL}/logo.png`,
          description: "Plateforme leader pour l'immobilier commercial",
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+33-1-23-45-67-89",
            contactType: "customer service",
            availableLanguage: ["French", "English"],
          },
          sameAs: [
            "https://facebook.com/yourpage",
            "https://twitter.com/yourhandle",
            "https://linkedin.com/company/yourcompany",
          ],
        }

      case "RealEstateAgent":
        return {
          ...baseSchema,
          name: data.name,
          telephone: data.phone,
          email: data.email,
          url: `${this.SITE_URL}/professionals/${data.id}`,
          worksFor: {
            "@type": "Organization",
            name: data.company,
          },
        }

      case "Product":
        return {
          ...baseSchema,
          name: data.title,
          description: data.description,
          image: data.images,
          offers: {
            "@type": "Offer",
            price: data.price,
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock",
          },
          brand: {
            "@type": "Brand",
            name: this.SITE_NAME,
          },
        }

      case "Article":
        return {
          ...baseSchema,
          headline: data.title,
          description: data.description,
          image: data.image,
          author: {
            "@type": "Person",
            name: data.author,
          },
          publisher: {
            "@type": "Organization",
            name: this.SITE_NAME,
            logo: {
              "@type": "ImageObject",
              url: `${this.SITE_URL}/logo.png`,
            },
          },
          datePublished: data.publishedAt,
          dateModified: data.updatedAt,
        }

      default:
        return baseSchema
    }
  }

  // Générer le sitemap
  static async generateSitemap(): Promise<string> {
    const baseUrl = this.SITE_URL
    const currentDate = new Date().toISOString()

    // URLs statiques
    const staticUrls = [
      { url: "", priority: 1.0, changefreq: "daily" },
      { url: "/properties", priority: 0.9, changefreq: "hourly" },
      { url: "/professionals", priority: 0.8, changefreq: "daily" },
      { url: "/news", priority: 0.7, changefreq: "daily" },
      { url: "/pricing", priority: 0.6, changefreq: "weekly" },
      { url: "/cre-explained", priority: 0.5, changefreq: "monthly" },
    ]

    // TODO: Récupérer les URLs dynamiques depuis la base de données
    // const properties = await Property.find({ status: "active" }).select("_id updatedAt")
    // const professionals = await Professional.find({ status: "active" }).select("_id updatedAt")

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`

    // Ajouter les URLs statiques
    staticUrls.forEach(({ url, priority, changefreq }) => {
      sitemap += `  <url>
    <loc>${baseUrl}${url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>
`
    })

    sitemap += `</urlset>`
    return sitemap
  }

  // Générer robots.txt
  static generateRobotsTxt(): string {
    const baseUrl = this.SITE_URL

    return `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /auth/
Disallow: /_next/
Disallow: /private/
Disallow: *.json$
Disallow: /*?*

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay for bots
Crawl-delay: 1

# Specific bot rules
User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Bingbot
Allow: /
Crawl-delay: 1

# Block bad bots
User-agent: SemrushBot
Disallow: /

User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /
`
  }
}

// Hook pour utiliser le SEO dans les composants
export function useSEO(config: SEOConfig) {
  return SEOService.generateMetadata(config)
}

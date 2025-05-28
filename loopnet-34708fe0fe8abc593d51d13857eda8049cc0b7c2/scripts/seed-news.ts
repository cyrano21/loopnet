import { connectToDatabase } from "@/lib/mongodb"
import News from "@/models/News"
import User from "@/models/User"

export default async function seedNews() {
  try {
    await connectToDatabase()

    console.log("📰 Peuplement des actualités...")

    // Récupérer un admin pour être l'auteur
    let admin = await User.findOne({ role: "admin" })
    if (!admin) {
      // Créer un admin si aucun n'existe
      const User = (await import("@/models/User")).default
      admin = await User.create({
        name: "Admin News",
        email: "admin.news@loopnet.com",
        role: "admin",
        subscription: { plan: "enterprise", status: "active" },
        preferences: {
          notifications: { email: true, sms: false, push: true },
          searchAlerts: false,
          newsletter: false,
        },
      })
    }

    const newsData = [
      {
        title: "Le marché immobilier commercial en forte croissance",
        excerpt: "Les investissements dans l'immobilier commercial atteignent des records historiques en 2024.",
        content: "Le secteur de l'immobilier commercial connaît une croissance exceptionnelle...",
        category: "Marché",
        author: admin._id,
        featured: true,
        image: "/placeholder.svg?height=400&width=600&query=commercial+real+estate",
        tags: ["marché", "investissement", "commercial"],
        status: "published",
        publishedAt: new Date(),
        views: 1250,
        likes: 89,
        readTime: 5,
        // Le slug sera généré automatiquement par le middleware pre-save
        metaTitle: "Marché immobilier commercial 2024",
        metaDescription: "Analyse complète du marché immobilier commercial en 2024",
      },
      {
        title: "Nouvelles réglementations pour les bureaux",
        excerpt: "Les nouvelles normes environnementales transforment le secteur des bureaux.",
        content: "Les réglementations environnementales récentes imposent de nouveaux standards...",
        category: "Réglementation",
        author: admin._id,
        featured: false,
        image: "/placeholder.svg?height=400&width=600&query=office+building+green",
        tags: ["réglementation", "environnement", "bureaux"],
        status: "published",
        publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        views: 890,
        likes: 45,
        readTime: 3,
        metaTitle: "Nouvelles réglementations bureaux 2024",
        metaDescription: "Guide des nouvelles normes environnementales pour les bureaux",
      },
      {
        title: "Tendances du retail en centre-ville",
        excerpt: "L'évolution du commerce de détail redessine les centres urbains.",
        content: "Le commerce de détail en centre-ville évolue rapidement...",
        category: "Retail",
        author: admin._id,
        featured: true,
        image: "/placeholder.svg?height=400&width=600&query=retail+store+city+center",
        tags: ["retail", "centre-ville", "tendances"],
        status: "published",
        publishedAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
        views: 2100,
        likes: 156,
        readTime: 7,
        metaTitle: "Tendances retail centre-ville 2024",
        metaDescription: "Analyse des nouvelles tendances du commerce en centre-ville",
      },
    ]

    console.log("📝 Données actualités à insérer:", JSON.stringify(newsData, null, 2))

    // Créer les articles un par un pour permettre la génération automatique des slugs
    const createdNews = []
    for (const article of newsData) {
      const news = await News.create(article)
      createdNews.push(news)
      console.log(`📰 Article créé: "${news.title}" avec slug: ${news.slug}`)
    }

    console.log(`📰 ${newsData.length} articles créés`)
    return createdNews
  } catch (error) {
    console.error("❌ Erreur lors du peuplement des actualités:", error)
    throw error
  }
}

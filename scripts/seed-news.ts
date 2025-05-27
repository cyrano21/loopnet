import connectDB from "@/lib/mongodb"
import News from "@/models/News"
import User from "@/models/User"

const newsData = [
  {
    title: "Le marché de l'immobilier commercial parisien en forte croissance",
    excerpt:
      "Les investissements dans l'immobilier commercial parisien ont augmenté de 15% au premier trimestre 2024, marquant une reprise significative du secteur.",
    content:
      "Le marché de l'immobilier commercial parisien connaît une dynamique positive avec une hausse de 15% des investissements au premier trimestre 2024...",
    category: "market",
    featured: true,
    image: "/placeholder.svg?height=400&width=600&query=modern office building paris",
    tags: ["paris", "croissance", "investissement"],
    readTime: 5,
    status: "published",
    publishedAt: new Date("2024-05-25"),
  },
  {
    title: "Nouvelles réglementations environnementales pour les bureaux",
    excerpt:
      "Les nouvelles normes RE2020 impactent significativement le secteur de l'immobilier tertiaire avec des exigences renforcées.",
    content:
      "Les nouvelles réglementations environnementales RE2020 transforment le paysage de l'immobilier commercial...",
    category: "regulation",
    featured: true,
    image: "/placeholder.svg?height=400&width=600&query=green sustainable office building",
    tags: ["réglementation", "environnement", "RE2020"],
    readTime: 7,
    status: "published",
    publishedAt: new Date("2024-05-24"),
  },
  {
    title: "L'IA révolutionne la gestion immobilière",
    excerpt:
      "Les technologies d'intelligence artificielle transforment la façon dont nous gérons les propriétés commerciales, optimisant les processus et améliorant l'efficacité.",
    content:
      "L'intelligence artificielle s'impose comme un outil incontournable dans la gestion immobilière moderne...",
    category: "technology",
    featured: false,
    image: "/placeholder.svg?height=400&width=600&query=AI technology real estate",
    tags: ["IA", "technologie", "gestion"],
    readTime: 4,
    status: "published",
    publishedAt: new Date("2024-05-23"),
  },
  {
    title: "Ouverture d'un nouveau centre commercial à Lyon",
    excerpt:
      "Un nouveau centre commercial de 50 000 m² ouvre ses portes à Lyon, créant plus de 1000 emplois dans la région.",
    content:
      "Lyon accueille un nouveau centre commercial d'envergure qui redynamise le secteur retail de la métropole...",
    category: "development",
    featured: false,
    tags: ["lyon", "centre commercial", "développement"],
    readTime: 3,
    status: "published",
    publishedAt: new Date("2024-05-22"),
  },
  {
    title: "Les taux d'intérêt immobiliers en baisse",
    excerpt: "Une tendance à la baisse des taux d'intérêt favorise les investissements immobiliers commerciaux.",
    content: "La baisse des taux d'intérêt crée de nouvelles opportunités pour les investisseurs immobiliers...",
    category: "market",
    featured: false,
    tags: ["taux", "financement", "investissement"],
    readTime: 6,
    status: "published",
    publishedAt: new Date("2024-05-21"),
  },
]

async function seedNews() {
  try {
    await connectDB()

    // Créer un utilisateur auteur si nécessaire
    let author = await User.findOne({ email: "admin@loopnet.com" })
    if (!author) {
      author = new User({
        email: "admin@loopnet.com",
        name: "Admin LoopNet",
        role: "admin",
        isEmailVerified: true,
      })
      await author.save()
    }

    // Supprimer les anciennes actualités
    await News.deleteMany({})

    // Créer les nouvelles actualités
    const newsPromises = newsData.map(async (news) => {
      const newsItem = new News({
        ...news,
        author: author._id,
      })
      return newsItem.save()
    })

    await Promise.all(newsPromises)

    console.log("✅ Base de données peuplée avec les actualités !")
    console.log(`📰 ${newsData.length} articles créés`)
  } catch (error) {
    console.error("❌ Erreur lors du peuplement des actualités:", error)
  }
}

export default seedNews

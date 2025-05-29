// app/api/favorites/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config"; // Assurez-vous que le chemin est correct

// --- Types (définissez-les de manière plus globale si utilisé ailleurs) ---
interface PropertyInFavorites {
  _id: string; // Ou id, selon votre modèle Property
  title: string;
  address: string; // Adresse complète
  city: string;
  price: number | string; // Nombre pour vente, chaîne pour location (ex: "1500/mois")
  surface: number; // en m² ou sqft
  propertyType: string;
  transactionType: "sale" | "rent" | "vacation";
  images: { url: string; alt?: string; isPrimary?: boolean }[]; // Ou string[]
  description: string;
  bedrooms?: number;
  bathrooms?: number;
  isPremium?: boolean;
  isFeatured?: boolean;
  slug?: string;
  // ...autres champs pertinents de votre modèle Property
}

interface FavoriteEntry {
  favoriteId: string; // ID unique de l'entrée de favori
  userId: string;
  propertyId: string;
  dateAdded: string; // ISOString
  property?: PropertyInFavorites; // Optionnel si GET retourne les détails de la propriété
}

// --- Fausse base de données en mémoire ---
// Ceci sera réinitialisé à chaque redémarrage du serveur de développement.
// Pour une persistance réelle, utilisez une base de données (MongoDB, PostgreSQL, etc.)
let DUMMY_FAVORITES_DB: FavoriteEntry[] = [
    // Quelques favoris initiaux pour l'utilisateur mocké "user-1-guest" ou un utilisateur connecté
    { favoriteId: "fav-1", userId: "user-1-guest", propertyId: "prop-office-1", dateAdded: new Date(Date.now() - 86400000 * 2).toISOString(), property: { _id: "prop-office-1", title: "Bureau Spacieux Centre-Ville", address: "1 Rue de la Paix, Paris", city: "Paris", price: 550000, surface: 120, propertyType: "Bureau", transactionType: "sale", images: [{url: "https://via.placeholder.com/400x300/007bff/FFFFFF?text=Bureau+Spacieux"}], description: "Un bureau exceptionnel avec vue.", isPremium: true, bedrooms: 0, bathrooms: 1 }},
    { favoriteId: "fav-2", userId: "user-1-guest", propertyId: "prop-retail-1", dateAdded: new Date(Date.now() - 86400000 * 1).toISOString(), property: { _id: "prop-retail-1", title: "Commerce Angle de Rue", address: "10 Avenue des Champs-Élysées, Paris", city: "Paris", price: "3200/mois", surface: 80, propertyType: "Commerce", transactionType: "rent", images: [{url: "https://via.placeholder.com/400x300/28a745/FFFFFF?text=Commerce+Angle"}], description: "Emplacement de choix pour votre commerce.", bedrooms: 0, bathrooms: 0 }},
];

let DUMMY_PROPERTIES_DB: PropertyInFavorites[] = [ // Base de données de propriétés pour la recherche
    DUMMY_FAVORITES_DB[0].property!,
    DUMMY_FAVORITES_DB[1].property!,
    { _id: "prop-land-1", title: "Terrain Constructible Vue Mer", address: "Route des Plages, Nice", city: "Nice", price: 1200000, surface: 1500, propertyType: "Terrain", transactionType: "sale", images: [{url: "https://via.placeholder.com/400x300/ffc107/000000?text=Terrain+Vue+Mer"}], description: "Grand terrain avec permis de construire.", isFeatured: true },
    { _id: "prop-industrial-1", title: "Entrepôt Logistique Proche Autoroute", address: "Zone Industrielle Nord, Lyon", city: "Lyon", price: "15/m²/an", surface: 1000, propertyType: "Industriel", transactionType: "rent", images: [{url: "https://via.placeholder.com/400x300/6f42c1/FFFFFF?text=Entrep%C3%B4t"}], description: "Idéal pour stockage et logistique." },
];


// --- Gestionnaire GET pour récupérer les favoris de l'utilisateur ---
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    // Pour le développement, si aucune session, on utilise un ID mocké.
    // En production, on devrait renvoyer une erreur 401 si pas de session.
    const userId = session?.user?.id || "user-1-guest"; // Ou lancez une erreur si !session en prod

    const { searchParams } = new URL(request.url);
    const sort = searchParams.get("sort") || "dateAdded-desc"; // Ex: "price-asc", "surface-desc"

    let userFavorites = DUMMY_FAVORITES_DB.filter(fav => fav.userId === userId);

    // Joindre les détails de la propriété si non déjà présents
    userFavorites = userFavorites.map(fav => {
        if (!fav.property) {
            const propertyDetails = DUMMY_PROPERTIES_DB.find(p => p._id === fav.propertyId);
            return { ...fav, property: propertyDetails };
        }
        return fav;
    }).filter(fav => fav.property != null) as FavoriteEntry[]; // Filtrer ceux où la propriété n'a pas été trouvée


    // Logique de tri améliorée
    userFavorites.sort((a, b) => {
      const propA = a.property!;
      const propB = b.property!;
      const [sortField, sortOrder = "asc"] = sort.split('-');

      switch (sortField) {
        case "dateAdded":
          const dateA = new Date(a.dateAdded).getTime();
          const dateB = new Date(b.dateAdded).getTime();
          return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
        case "price":
          // Gérer les prix numériques et les chaînes de location
          const priceAVal = typeof propA.price === 'number' ? propA.price : parseFloat(String(propA.price).replace(/[^0-9.]/g, ''));
          const priceBVal = typeof propB.price === 'number' ? propB.price : parseFloat(String(propB.price).replace(/[^0-9.]/g, ''));
          return sortOrder === "desc" ? priceBVal - priceAVal : priceAVal - priceBVal;
        case "surface":
          return sortOrder === "desc" ? propB.surface - propA.surface : propA.surface - propB.surface;
        case "propertyType":
          return sortOrder === "desc" ? propB.propertyType.localeCompare(propA.propertyType) : propA.propertyType.localeCompare(propB.propertyType);
        default:
          return 0;
      }
    });

    // Transformer pour le frontend : le frontend s'attend probablement à une liste de PropertyInFavorites
    const transformedFavoritesForFrontend = userFavorites.map(fav => ({
        ...fav.property, // Étaler toutes les propriétés de l'objet property
        // dateAddedToFavorites: fav.dateAdded, // Si le frontend a besoin de cette info spécifique
    }));

    return NextResponse.json({
      favorites: transformedFavoritesForFrontend, // Ou properties: si le hook useFavorites s'attend à cela
      total: transformedFavoritesForFrontend.length,
    });

  } catch (error) {
    console.error("[FAVORITES_GET_ERROR]", error);
    const errorMessage = error instanceof Error ? error.message : "Une erreur inconnue est survenue";
    return NextResponse.json({ error: "Impossible de récupérer les favoris", details: errorMessage }, { status: 500 });
  }
}


// --- Gestionnaire POST pour ajouter un favori ---
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Non authentifié. Veuillez vous connecter." }, { status: 401 });
    }
    const userId = session.user.id;

    const body = await request.json();
    const { propertyId } = body;

    if (!propertyId || typeof propertyId !== 'string') {
      return NextResponse.json({ error: "L'ID de la propriété est requis et doit être une chaîne." }, { status: 400 });
    }

    // Vérifier si la propriété existe (dans notre fausse DB de propriétés)
    const propertyExists = DUMMY_PROPERTIES_DB.some(p => p._id === propertyId);
    if (!propertyExists) {
        return NextResponse.json({ error: "Propriété non trouvée." }, { status: 404 });
    }

    // Vérifier si le favori existe déjà pour cet utilisateur
    const existingFavorite = DUMMY_FAVORITES_DB.find(
      (fav) => fav.userId === userId && fav.propertyId === propertyId
    );

    if (existingFavorite) {
      return NextResponse.json(
        { message: "Cette propriété est déjà dans vos favoris.", favorite: existingFavorite },
        { status: 200 } // Ou 409 Conflict, mais 200 avec un message est aussi courant
      );
    }

    const newFavoriteEntry: FavoriteEntry = {
      favoriteId: `fav-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId,
      propertyId,
      dateAdded: new Date().toISOString(),
    };

    DUMMY_FAVORITES_DB.push(newFavoriteEntry);
    console.log(`[FAVORITES_POST_SUCCESS] User ${userId} added property ${propertyId} to favorites.`);

    // Renvoyer l'entrée de favori créée (ou juste un succès)
    return NextResponse.json(
      { success: true, message: "Propriété ajoutée aux favoris.", favorite: newFavoriteEntry },
      { status: 201 } // 201 Created
    );

  } catch (error) {
    console.error("[FAVORITES_POST_ERROR]", error);
    const errorMessage = error instanceof Error ? error.message : "Une erreur inconnue est survenue";
    return NextResponse.json(
      { error: "Échec de l'ajout aux favoris.", details: errorMessage },
      { status: 500 }
    );
  }
}

// --- Gestionnaire DELETE pour supprimer un favori ---
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "Non authentifié. Veuillez vous connecter." }, { status: 401 });
        }
        const userId = session.user.id;

        // L'ID de la propriété à supprimer est généralement passé en paramètre d'URL pour DELETE
        // ou dans le corps de la requête si vous préférez.
        // Exemple avec paramètre d'URL: /api/favorites?propertyId=xyz
        const { searchParams } = new URL(request.url);
        const propertyId = searchParams.get("propertyId");

        // Ou si c'est dans le corps (moins RESTful pour DELETE mais possible)
        // const body = await request.json();
        // const { propertyId } = body;

        if (!propertyId || typeof propertyId !== 'string') {
            return NextResponse.json({ error: "L'ID de la propriété est requis pour la suppression." }, { status: 400 });
        }

        const favoriteIndex = DUMMY_FAVORITES_DB.findIndex(
            (fav) => fav.userId === userId && fav.propertyId === propertyId
        );

        if (favoriteIndex === -1) {
            return NextResponse.json({ error: "Favori non trouvé pour cet utilisateur et cette propriété." }, { status: 404 });
        }

        const deletedFavorite = DUMMY_FAVORITES_DB.splice(favoriteIndex, 1)[0];
        console.log(`[FAVORITES_DELETE_SUCCESS] User ${userId} removed property ${propertyId} from favorites.`);

        return NextResponse.json(
            { success: true, message: "Propriété retirée des favoris.", deletedFavoriteId: deletedFavorite.favoriteId },
            { status: 200 }
        );

    } catch (error) {
        console.error("[FAVORITES_DELETE_ERROR]", error);
        const errorMessage = error instanceof Error ? error.message : "Une erreur inconnue est survenue";
        return NextResponse.json(
            { error: "Échec de la suppression du favori.", details: errorMessage },
            { status: 500 }
        );
    }
}
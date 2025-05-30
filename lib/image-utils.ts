import { defaultImages, getImageForPropertyType } from "@/config/images";

/**
 * Interface for image result with illustration indicator
 */
export interface ImageResult {
  url: string;
  isIllustrative: boolean;
}

/**
 * Get the most appropriate image URL from an array of images
 * @param images - Array of image strings or objects with url property
 * @param propertyType - Type of the property for fallback image
 * @returns Object with image URL and flag indicating if it's illustrative
 */
export function getBestImageUrl(
  images: (string | { url: string; [key: string]: any })[] = [],
  propertyType: string = "property"
): ImageResult {
  try {
    // If images array is provided and not empty
    if (Array.isArray(images) && images.length > 0) {
      // Try to find primary image
      const primaryImg = images.find(
        (img) => typeof img === "object" && img.isPrimary
      );

      // Get first image
      const firstImg = images[0];

      // Return primary image URL if exists and is valid
      if (primaryImg && typeof primaryImg === "object" && primaryImg.url) {
        return { url: primaryImg.url, isIllustrative: false };
      }

      // Return first image if it's a string
      if (typeof firstImg === "string" && firstImg.trim()) {
        return { url: firstImg, isIllustrative: false };
      }

      // Return first image URL if it's an object with url
      if (
        firstImg &&
        typeof firstImg === "object" &&
        "url" in firstImg &&
        firstImg.url
      ) {
        return { url: firstImg.url, isIllustrative: false };
      }
    }

    // Fallback to property type specific image
    return { url: getImageForPropertyType(propertyType), isIllustrative: true };
  } catch (error) {
    console.error("Error getting image URL:", error);
    return { url: getImageForPropertyType(propertyType), isIllustrative: true };
  }
}

/**
 * Get a placeholder image URL based on type
 * @param type - Type of the placeholder (property, city, user, background, etc.)
 * @param subType - Subtype (e.g., 'office', 'apartment' for property type)
 * @returns Placeholder image URL
 */
export function getPlaceholderImage(
  type: keyof typeof defaultImages = "property",
  subType?: string
): ImageResult {
  try {
    // Get the image URL for the type
    const imageUrl = defaultImages[type];

    if (typeof imageUrl === "string") {
      return { url: imageUrl, isIllustrative: true };
    }

    // Fallback to property default
    return { url: defaultImages.property, isIllustrative: true };
  } catch (error) {
    console.error("Error getting placeholder image:", error);
    return { url: defaultImages.property, isIllustrative: true };
  }
}

/**
 * Vérifie si une URL d'image est une image Unsplash
 * @param imageUrl URL de l'image à vérifier
 * @returns Vrai si l'image provient d'Unsplash
 */
export function isUnsplashImage(imageUrl: string): boolean {
  return imageUrl.includes("unsplash.com");
}

/**
 * Collection d'URLs d'images Unsplash statiques par catégorie
 */
const staticUnsplashImages = {
  property: [
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop&crop=center",
  ],
  apartment: [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop&crop=center",
  ],
  office: [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=600&fit=crop&crop=center",
  ],
  retail: [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1604719312566-8912e9667d9f?w=800&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1604719312566-8912e9667d9f?w=800&h=600&fit=crop&crop=center",
  ],
  warehouse: [
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1565891741441-64926e441838?w=800&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1504275107627-0c2ba7a43dba?w=800&h=600&fit=crop&crop=center",
  ],
  land: [
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1500534623283-312aebe2edc9?w=800&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1501084817091-a4f3d1d19e07?w=800&h=600&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&h=600&fit=crop&crop=center",
  ],
};

/**
 * Génère une URL d'image Unsplash statique basée sur le type de propriété
 * @param propertyType Type de propriété
 * @param width Largeur de l'image (non utilisé avec les URLs statiques)
 * @param height Hauteur de l'image (non utilisé avec les URLs statiques)
 * @returns URL d'une image Unsplash statique
 */
export function getRandomUnsplashImage(
  propertyType: string = "property",
  width: number = 800,
  height: number = 600
): string {
  // Déterminer la catégorie d'image appropriée
  let category = "property";

  const type = propertyType.toLowerCase();
  if (type.includes("apartment") || type.includes("résidentiel")) {
    category = "apartment";
  } else if (type.includes("office") || type.includes("bureau")) {
    category = "office";
  } else if (type.includes("retail") || type.includes("commercial")) {
    category = "retail";
  } else if (type.includes("warehouse") || type.includes("entrepôt")) {
    category = "warehouse";
  } else if (type.includes("land") || type.includes("terrain")) {
    category = "land";
  }

  // Sélectionner une image aléatoire dans la catégorie
  const images =
    staticUnsplashImages[category as keyof typeof staticUnsplashImages] ||
    staticUnsplashImages.property;
  const randomIndex = Math.floor(Math.random() * images.length);

  return images[randomIndex];
}

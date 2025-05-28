import { defaultImages } from '@/config/images'

/**
 * Get the most appropriate image URL from an array of images
 * @param images - Array of image strings or objects with url property
 * @param type - Type of the image (property, city, user, etc.)
 * @returns The best available image URL
 */
export function getBestImageUrl(
  images: (string | { url: string; [key: string]: any })[] = [],
  type: keyof typeof defaultImages = 'property'
): string {
  try {
    // If images array is provided and not empty
    if (Array.isArray(images) && images.length > 0) {
      // Try to find primary image
      const primaryImg = images.find(
        img => typeof img === 'object' && img.isPrimary
      )
      
      // Get first image
      const firstImg = images[0]
      
      // Return primary image URL if exists
      if (primaryImg && typeof primaryImg === 'object' && primaryImg.url) {
        return primaryImg.url
      }
      
      // Return first image if it's a string
      if (typeof firstImg === 'string') {
        return firstImg
      }
      
      // Return first image URL if it's an object with url
      if (firstImg && typeof firstImg === 'object' && 'url' in firstImg) {
        return firstImg.url
      }
    }
    
    // If no specific image found, return type-based placeholder
    const typeImages = defaultImages[type] as Record<string, string> | undefined
    if (typeImages) {
      return typeImages.default || defaultImages.placeholder
    }
    
    // Fallback to default placeholder
    return defaultImages.placeholder
  } catch (error) {
    console.error('Error getting image URL:', error)
    return defaultImages.placeholder
  }
}

/**
 * Get a placeholder image URL based on type
 * @param type - Type of the placeholder (property, city, user, background, etc.)
 * @param subType - Subtype (e.g., 'office', 'apartment' for property type)
 * @returns Placeholder image URL
 */
export function getPlaceholderImage(
  type: keyof typeof defaultImages = 'property',
  subType?: string
): string {
  try {
    const typeImages = defaultImages[type] as Record<string, string> | undefined
    
    if (subType && typeImages && subType in typeImages) {
      return typeImages[subType]
    }
    
    if (typeImages && 'default' in typeImages) {
      return typeImages.default
    }
    
    return defaultImages.placeholder
  } catch (error) {
    console.error('Error getting placeholder image:', error)
    return defaultImages.placeholder
  }
}

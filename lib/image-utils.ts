import { defaultImages, getImageForPropertyType } from '@/config/images'

/**
 * Get the most appropriate image URL from an array of images
 * @param images - Array of image strings or objects with url property
 * @param propertyType - Type of the property for fallback image
 * @returns The best available image URL
 */
export function getBestImageUrl(
  images: (string | { url: string; [key: string]: any })[] = [],
  propertyType: string = 'property'
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
      
      // Return primary image URL if exists and is valid
      if (primaryImg && typeof primaryImg === 'object' && primaryImg.url) {
        return primaryImg.url
      }
      
      // Return first image if it's a string
      if (typeof firstImg === 'string' && firstImg.trim()) {
        return firstImg
      }
      
      // Return first image URL if it's an object with url
      if (firstImg && typeof firstImg === 'object' && 'url' in firstImg && firstImg.url) {
        return firstImg.url
      }
    }
    
    // Fallback to property type specific image
    return getImageForPropertyType(propertyType)
  } catch (error) {
    console.error('Error getting image URL:', error)
    return getImageForPropertyType(propertyType)
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
    // Get the image URL for the type
    const imageUrl = defaultImages[type]
    
    if (typeof imageUrl === 'string') {
      return imageUrl
    }
    
    // Fallback to property default
    return defaultImages.property
  } catch (error) {
    console.error('Error getting placeholder image:', error)
    return defaultImages.property
  }
}

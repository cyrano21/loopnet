// lib/property-image-utils.ts

export const getDefaultImageByPropertyType = (propertyType: string): string => {
  const baseUrl = "https://images.unsplash.com"
  const params = "?fit=crop&w=800&h=600&q=80"
  
  switch (propertyType?.toLowerCase()) {
    case 'apartment':
    case 'appartement':
      return `${baseUrl}/photo-1545324418-cc1a3fa10c00${params}` // Modern apartment
    
    case 'office':
    case 'bureau':
      return `${baseUrl}/photo-1497366216548-37526070297c${params}` // Modern office
    
    case 'warehouse':
    case 'entrepôt':
      return `${baseUrl}/photo-1586864387967-d02ef85d93e8${params}` // Industrial warehouse
    
    case 'retail':
    case 'commerce':
      return `${baseUrl}/photo-1441986300917-64674bd600d8${params}` // Retail store
    
    case 'industrial':
    case 'industriel':
      return `${baseUrl}/photo-1581094794329-c8112a89af12${params}` // Industrial building
    
    case 'land':
    case 'terrain':
      return `${baseUrl}/photo-1500382017468-9049fed747ef${params}` // Land/terrain
    
    case 'hotel':
    case 'hôtel':
      return `${baseUrl}/photo-1551882547-ff40c63fe5fa${params}` // Hotel building
    
    case 'restaurant':
      return `${baseUrl}/photo-1517248135467-4c7edcad34c4${params}` // Restaurant interior
    
    case 'mixed-use':
    case 'mixte':
      return `${baseUrl}/photo-1486406146926-c627a92ad1ab${params}` // Mixed use building
    
    case 'healthcare':
    case 'santé':
      return `${baseUrl}/photo-1519494026892-80bbd2d6fd0d${params}` // Healthcare facility
    
    case 'education':
    case 'éducation':
      return `${baseUrl}/photo-1523050854058-8df90110c9f1${params}` // Educational building
    
    default:
      return `${baseUrl}/photo-1560518883-ce09059eeffa${params}` // Generic commercial building
  }
}

export const getPropertyImageUrl = (property: any): string => {
  // Si la propriété a des images, utilise la première (mais vérifie qu'elle n'est pas vide)
  if (property.images && property.images.length > 0 && property.images[0] && property.images[0].trim() !== '') {
    return property.images[0]
  }
  
  // Sinon, utilise l'image par défaut basée sur le type
  return getDefaultImageByPropertyType(property.propertyType || 'commercial')
}

export const getPropertyIcon = (propertyType: string) => {
  switch (propertyType?.toLowerCase()) {
    case 'apartment':
    case 'appartement':
      return '🏢'
    
    case 'office':
    case 'bureau':
      return '🏛️'
    
    case 'warehouse':
    case 'entrepôt':
      return '🏭'
    
    case 'retail':
    case 'commerce':
      return '🏪'
    
    case 'industrial':
    case 'industriel':
      return '🏭'
    
    case 'land':
    case 'terrain':
      return '🌍'
    
    case 'hotel':
    case 'hôtel':
      return '🏨'
    
    case 'restaurant':
      return '🍽️'
    
    case 'mixed-use':
    case 'mixte':
      return '🏢'
    
    case 'healthcare':
    case 'santé':
      return '🏥'
    
    case 'education':
    case 'éducation':
      return '🎓'
    
    default:
      return '🏢'
  }
}

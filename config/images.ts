// Configuration des images et placeholders par défaut

export const defaultImages = {
  property: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop&crop=center',
  apartment: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop&crop=center',
  office: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop&crop=center',
  retail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&crop=center',
  warehouse: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center',
  land: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop&crop=center',
  user: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  city: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&crop=center',
  background: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=600&fit=crop&crop=center'
};

export const getImageForPropertyType = (propertyType: string): string => {
  const type = propertyType.toLowerCase();
  
  if (type.includes('apartment') || type.includes('résidentiel')) {
    return defaultImages.apartment;
  }
  if (type.includes('office') || type.includes('bureau')) {
    return defaultImages.office;
  }
  if (type.includes('retail') || type.includes('commercial')) {
    return defaultImages.retail;
  }
  if (type.includes('warehouse') || type.includes('entrepôt')) {
    return defaultImages.warehouse;
  }
  if (type.includes('land') || type.includes('terrain')) {
    return defaultImages.land;
  }
  
  return defaultImages.property;
};

export const getPlaceholderImage = (
  type: keyof typeof defaultImages = 'property',
  width = 400,
  height = 300
): string => {
  return defaultImages[type] || defaultImages.property;
};

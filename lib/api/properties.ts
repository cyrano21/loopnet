export interface Property {
  _id: string
  title: string
  description: string
  propertyType: string
  transactionType: 'rent' | 'sale' | 'vacation'
  address: string
  city: string
  postalCode: string
  country: string
  price: number
  surface: number
  bedrooms?: number
  bathrooms?: number
  features: string[]
  images: Array<{
    url: string
    publicId: string
    alt: string
    isPrimary: boolean
  }>
  owner: {
    _id: string
    name: string
    email: string
    phone?: string
  }
  status: 'active' | 'inactive' | 'sold' | 'rented'
  publishedAt: string
  views: number
  isPremium: boolean
  isFeatured: boolean
}

export interface PropertiesResponse {
  properties: Property[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface PropertiesFilters {
  search?: string
  propertyType?: string
  transactionType?: string
  minPrice?: number
  maxPrice?: number
  city?: string
  page?: number
  limit?: number
}

export async function fetchProperties(filters: PropertiesFilters = {}) {
  const searchParams = new URLSearchParams()
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value.toString())
    }
  })

  const url = `/api/properties${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Failed to fetch properties:', error)
    throw new Error('Failed to fetch properties')
  }
}

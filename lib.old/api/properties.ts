import { Property } from "@/types/property"

export type { Property }

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

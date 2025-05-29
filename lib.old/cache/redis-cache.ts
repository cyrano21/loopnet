// Cache service simplifié pour éviter les dépendances Redis en développement
interface CacheResult {
  data: any
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

class SimpleCacheService {
  private cache = new Map<string, { data: any; expires: number }>()

  generateSearchKey(search: string, filters: string, page: number, limit: number): string {
    return `search:${search}:${filters}:${page}:${limit}`
  }

  async getCachedSearchResults(key: string): Promise<CacheResult | null> {
    const cached = this.cache.get(key)
    if (cached && cached.expires > Date.now()) {
      return cached.data
    }
    this.cache.delete(key)
    return null
  }

  async cacheSearchResults(key: string, data: CacheResult, ttl: number): Promise<void> {
    this.cache.set(key, {
      data,
      expires: Date.now() + ttl * 1000,
    })
  }

  async clearCache(): Promise<void> {
    this.cache.clear()
  }
}

export const CacheService = new SimpleCacheService()

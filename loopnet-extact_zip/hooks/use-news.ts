"use client"

import { useState, useEffect } from "react"

interface NewsArticle {
  _id: string
  title: string
  excerpt: string
  content: string
  category: string
  author: {
    _id: string
    name: string
    avatar?: string
  }
  featured: boolean
  image?: string
  tags: string[]
  status: string
  publishedAt: string
  views: number
  likes: number
  readTime: number
  slug: string
  createdAt: string
  updatedAt: string
}

interface UseNewsOptions {
  page?: number
  limit?: number
  category?: string
  search?: string
  featured?: boolean
}

interface UseNewsReturn {
  articles: NewsArticle[]
  loading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  } | null
  refetch: () => void
}

export function useNews(options: UseNewsOptions = {}): UseNewsReturn {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState(null)

  const fetchNews = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()

      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString())
        }
      })

      const response = await fetch(`/api/news?${params.toString()}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch news")
      }

      setArticles(result.data.articles)
      setPagination(result.data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("Error fetching news:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [JSON.stringify(options)])

  return {
    articles,
    loading,
    error,
    pagination,
    refetch: fetchNews,
  }
}

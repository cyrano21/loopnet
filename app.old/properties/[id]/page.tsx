'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

/**
 * Page de redirection pour maintenir la compatibilité avec les anciennes URLs
 * Redirige /properties/[id] vers /property/[id]
 */
export default function PropertiesRedirectPage() {
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    if (params.id) {
      // Redirection immédiate vers la nouvelle route
      router.replace(`/property/${params.id}`)
    }
  }, [params.id, router])

  // Affichage de chargement pendant la redirection
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-sm text-gray-600">Redirection en cours...</p>
      </div>
    </div>
  )
}

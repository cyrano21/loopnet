'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { use } from 'react'

/**
 * Page de redirection pour maintenir la compatibilité avec les anciennes URLs
 * Redirige /properties/[id] vers /property/[id]
 */
interface PropertiesRedirectPageProps {
  params: Promise<{ id: string }>;
}

export default function PropertiesRedirectPage({ params }: PropertiesRedirectPageProps) {
  const router = useRouter()
  
  // Unwrap the params object using React.use()
  const unwrappedParams = use(params)

  useEffect(() => {
    if (unwrappedParams.id) {
      // Redirection immédiate vers la nouvelle route
      router.replace(`/property/${unwrappedParams.id}`)
    }
  }, [unwrappedParams.id, router])

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

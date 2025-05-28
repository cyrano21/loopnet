"use client"

import { useEffect } from "react"

// Désactiver le prerendering
export const dynamic = "force-dynamic"
export const revalidate = 0

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex flex-col">
      {/* Navigation simple */}
      <nav className="w-full border-b bg-white/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <a href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">L</div>
              <span className="text-xl font-bold text-gray-900">LoopNet</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Contenu d'erreur */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Une erreur s'est produite</h1>
            <p className="text-gray-600 mb-8">Quelque chose s'est mal passé. Veuillez réessayer.</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              🔄 Réessayer
            </button>

            <a
              href="/"
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-white text-red-600 font-medium rounded-lg border border-red-600 hover:bg-red-50 transition-colors"
            >
              🏠 Retour à l'accueil
            </a>
          </div>

          {error.digest && (
            <div className="mt-8 text-sm text-gray-500">
              <p>ID d'erreur: {error.digest}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

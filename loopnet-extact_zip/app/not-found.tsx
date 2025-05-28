// Désactiver le prerendering pour cette page
export const dynamic = "force-dynamic"
export const revalidate = 0

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Navigation simple sans hooks */}
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

      {/* Contenu 404 */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-blue-600 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Page non trouvée</h2>
            <p className="text-gray-600 mb-8">Désolé, la page que vous recherchez n'existe pas ou a été déplacée.</p>
          </div>

          <div className="space-y-4">
            <a
              href="/"
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              🏠 Retour à l'accueil
            </a>

            <a
              href="/properties"
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-white text-blue-600 font-medium rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors"
            >
              🔍 Rechercher des propriétés
            </a>
          </div>

          <div className="mt-8 text-sm text-gray-500">
            <p>Code d'erreur: 404</p>
          </div>
        </div>
      </div>
    </div>
  )
}

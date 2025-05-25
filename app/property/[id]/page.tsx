import { useProperty } from "@/hooks/use-properties"

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const { property, loading, error } = useProperty(params.id)

  if (loading)
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  if (error) return <div className="text-red-600 p-4">Erreur: {error}</div>
  if (!property) return <div className="p-4">Propriété non trouvée</div>

  // Utiliser les vraies données de la propriété
  return <div className="container mx-auto px-4 py-8">{/* Rendu avec property.* au lieu de données statiques */}</div>
}

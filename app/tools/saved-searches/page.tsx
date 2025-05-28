'use client'

import { usePermissions } from '@/hooks/use-permissions'
import { AccessRestriction } from '@/components/access-restriction'
import ToolPlaceholder from '../components/tool-placeholder'

export default function SavedSearchesPage () {
  const { can } = usePermissions()

  const title = 'Recherches Sauvegardées'
  const description =
    'Sauvegardez vos critères de recherche et retrouvez facilement vos recherches favorites.'
  const features = [
    'Sauvegarde de critères de recherche complexes pour une utilisation ultérieure',
    'Organisation et catégorisation de vos recherches par projet ou par intérêt',
    'Réutilisation rapide de critères de recherche précédents sans avoir à les redéfinir',
    'Partage de recherches avec des collègues ou des clients',
    'Notifications personnalisables sur les nouvelles propriétés correspondant à vos recherches sauvegardées'
  ]

  // Vérifier si l'utilisateur a la permission d'utiliser cette fonctionnalité
  if (!can('canSaveSearches')) {
    return (
      <AccessRestriction
        action='canSaveSearches'
        requiredLevel='premium'
        showUpgradePrompt={true}
      >
        <div className='container mx-auto py-8 max-w-4xl'>
          <ToolPlaceholder
            title={title}
            description={description}
            features={features}
          />
        </div>
      </AccessRestriction>
    )
  }

  return (
    <ToolPlaceholder
      title={title}
      description={description}
      features={features}
      comingSoon={true}
    />
  )
}

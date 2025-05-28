'use client'

import { usePermissions } from '@/hooks/use-permissions'
import { AccessRestriction } from '@/components/access-restriction'
import ToolPlaceholder from '../components/tool-placeholder'

export default function AdvancedMapsPage () {
  const { can } = usePermissions()

  const title = 'Cartes de Marché Avancées'
  const description =
    'Visualisations cartographiques avancées avec données de marché en temps réel pour analyser le marché immobilier.'
  const features = [
    'Cartes interactives montrant la densité des propriétés par secteur',
    'Visualisation des prix moyens par quartier avec code couleur',
    'Filtres avancés pour afficher les propriétés selon des critères spécifiques',
    'Superposition de données démographiques sur les cartes immobilières',
    'Analyse de proximité (écoles, transports, commerces) pour évaluation complète',
    'Identification des zones à fort potentiel de croissance',
    'Outils de mesure de distance et de surface directement sur la carte'
  ]

  // Vérifier si l'utilisateur a la permission d'utiliser cette fonctionnalité
  if (!can('canViewMarketAnalytics')) {
    return (
      <AccessRestriction
        action='canViewMarketAnalytics'
        requiredLevel='agent'
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

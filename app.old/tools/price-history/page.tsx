'use client'

import { usePermissions } from '@/hooks/use-permissions'
import { AccessRestriction } from '@/components/access-restriction'
import ToolPlaceholder from '../components/tool-placeholder'

export default function PriceHistoryPage () {
  const { can } = usePermissions()

  const title = 'Historique des Prix'
  const description =
    "Consultez l'évolution des prix et les tendances historiques des propriétés commerciales."
  const features = [
    "Suivi de l'évolution des prix des propriétés sur plusieurs années",
    'Comparaison des variations de prix par type de bien et par localisation',
    "Visualisation graphique des tendances avec des courbes d'évolution",
    'Analyse des facteurs influençant les changements de prix',
    'Détection des cycles immobiliers pour anticiper les évolutions',
    'Évaluation de la plus-value potentielle des investissements'
  ]

  // Vérifier si l'utilisateur a la permission d'utiliser cette fonctionnalité
  if (!can('canViewPropertyHistory')) {
    return (
      <AccessRestriction
        action='canViewPropertyHistory'
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

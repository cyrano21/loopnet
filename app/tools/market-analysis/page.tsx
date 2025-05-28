'use client'

import { usePermissions } from '@/hooks/use-permissions'
import { AccessRestriction } from '@/components/access-restriction'
import ToolPlaceholder from '../components/tool-placeholder'

export default function MarketAnalysisPage () {
  const { can } = usePermissions()

  const title = 'Analyse de Marché'
  const description =
    'Accédez aux analyses de marché avancées et aux tendances locales pour prendre des décisions éclairées.'
  const features = [
    'Visualisation des tendances de prix par zone géographique',
    "Statistiques sur l'offre et la demande dans différents quartiers",
    'Analyse comparative des prix au mètre carré par catégorie de bien',
    "Données démographiques et socio-économiques des zones d'intérêt",
    "Prévisions et projections basées sur l'historique du marché",
    'Indicateurs de performance des investissements par secteur'
  ]

  // Vérifier si l'utilisateur a la permission d'utiliser cette fonctionnalité
  if (!can('canViewMarketAnalytics')) {
    return (
      <AccessRestriction
        action='canViewMarketAnalytics'
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

'use client'

import { usePermissions } from '@/hooks/use-permissions'
import { AccessRestriction } from '@/components/access-restriction'
import ToolPlaceholder from '../components/tool-placeholder'

export default function SearchAlertsPage () {
  const { can } = usePermissions()

  const title = 'Alertes de Recherche'
  const description =
    'Recevez des notifications automatiques pour les nouvelles propriétés correspondant à vos critères.'
  const features = [
    "Configuration d'alertes personnalisées basées sur vos critères spécifiques",
    "Notifications par email dès qu'une nouvelle propriété correspondant à vos critères est publiée",
    'Définition de la fréquence des alertes (quotidienne, hebdomadaire, temps réel)',
    'Suivi des tendances du marché sans avoir à effectuer des recherches manuelles',
    "Personnalisation des paramètres de notification selon l'urgence et la priorité"
  ]

  // Vérifier si l'utilisateur a la permission d'utiliser cette fonctionnalité
  if (!can('canSetAlerts')) {
    return (
      <AccessRestriction
        action='canSetAlerts'
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

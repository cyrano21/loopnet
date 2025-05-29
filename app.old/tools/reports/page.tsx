'use client'

import { usePermissions } from '@/hooks/use-permissions'
import { AccessRestriction } from '@/components/access-restriction'
import ToolPlaceholder from '../components/tool-placeholder'

export default function ReportsPage () {
  const { can } = usePermissions()

  const title = 'Générateur de Rapports'
  const description =
    'Créez des rapports détaillés et personnalisés sur les propriétés et le marché immobilier.'
  const features = [
    'Génération de rapports professionnels avec votre logo et votre charte graphique',
    'Analyse comparative de plusieurs propriétés dans un même document',
    'Inclusion de graphiques et statistiques de marché pour enrichir vos présentations',
    'Rapports adaptés aux différents publics (investisseurs, clients, banques)',
    "Modèles de rapports personnalisables pour différents types d'analyses",
    'Export en PDF, Word ou présentation PowerPoint pour un partage facile'
  ]

  // Vérifier si l'utilisateur a la permission d'utiliser cette fonctionnalité
  if (!can('canGenerateReports')) {
    return (
      <AccessRestriction
        action='canGenerateReports'
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

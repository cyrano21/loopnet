'use client'

import { usePermissions } from '@/hooks/use-permissions'
import { AccessRestriction } from '@/components/access-restriction'
import ToolPlaceholder from '../components/tool-placeholder'

export default function DataExportPage () {
  const { can } = usePermissions()

  const title = 'Export de Données'
  const description =
    'Exportez les données des propriétés vers Excel, CSV ou PDF pour analyse et partage.'
  const features = [
    'Exportation des données de propriétés dans différents formats (CSV, Excel, PDF)',
    'Personnalisation des champs à inclure dans les exportations',
    "Création de modèles d'export réutilisables pour gagner du temps",
    'Export par lots de multiples propriétés en une seule opération',
    "Intégration avec des outils d'analyse externes pour des études approfondies"
  ]

  // Vérifier si l'utilisateur a la permission d'utiliser cette fonctionnalité
  if (!can('canExportData')) {
    return (
      <AccessRestriction
        action='canExportData'
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

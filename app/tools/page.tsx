'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Calculator,
  Heart,
  Scale,
  Search,
  Bell,
  Download,
  FileText,
  BarChart3,
  TrendingUp,
  Lock,
  Map,
  BookmarkPlus,
  DollarSign
} from 'lucide-react'
import Link from 'next/link'
import { usePermissions } from '@/hooks/use-permissions'
import { AccessRestriction } from '@/components/access-restriction'
import { Button } from '@/components/ui/button'

const freeTools = [
  {
    title: 'Calculateur de Taux de Capitalisation',
    description:
      'Calculez le taux de capitalisation de vos investissements immobiliers',
    href: '/tools/cap-rate-calculator',
    icon: Calculator,
    badge: 'Gratuit'
  },
  {
    title: 'Propriétés Favorites',
    description:
      'Gérez vos propriétés favorites et créez des listes personnalisées',
    href: '/dashboard',
    icon: Heart,
    badge: 'Gratuit'
  },
  {
    title: 'Comparaison de Propriétés',
    description: "Comparez jusqu'à 4 propriétés côte à côte",
    href: '/compare',
    icon: Scale,
    badge: 'Gratuit'
  }
]

const premiumTools = [
  {
    title: 'Recherches Sauvegardées',
    description:
      'Sauvegardez vos critères de recherche et retrouvez facilement vos recherches favorites',
    href: '/dashboard',
    icon: BookmarkPlus,
    badge: 'Premium',
    action: 'canSaveSearches'
  },
  {
    title: 'Alertes de Recherche',
    description:
      'Recevez des notifications automatiques pour les nouvelles propriétés correspondant à vos critères',
    href: '/dashboard',
    icon: Bell,
    badge: 'Premium',
    action: 'canSetAlerts'
  },
  {
    title: 'Export de Données',
    description: 'Exportez les données des propriétés vers Excel, CSV ou PDF',
    href: '/dashboard',
    icon: Download,
    badge: 'Premium',
    action: 'canExportData'
  }
]

const proTools = [
  {
    title: 'Générateur de Rapports',
    description:
      'Créez des rapports détaillés et personnalisés sur les propriétés et le marché',
    href: '/dashboard',
    icon: FileText,
    badge: 'Pro',
    action: 'canGenerateReports'
  },
  {
    title: 'Analyse de Marché',
    description:
      'Accédez aux analyses de marché avancées et aux tendances locales',
    href: '/dashboard',
    icon: BarChart3,
    badge: 'Pro',
    action: 'canViewMarketAnalytics'
  },
  {
    title: 'Historique des Prix',
    description:
      "Consultez l'évolution des prix et les tendances historiques des propriétés",
    href: '/dashboard',
    icon: TrendingUp,
    badge: 'Pro',
    action: 'canViewPropertyHistory'
  }
]

const agentTools = [
  {
    title: 'Cartes de Marché Avancées',
    description:
      'Visualisations cartographiques avancées avec données de marché en temps réel',
    href: '/dashboard',
    icon: Map,
    badge: 'Agent',
    action: 'canViewMarketAnalytics'
  },
  {
    title: 'Calculateur de Commission',
    description: 'Calculez vos commissions et revenus potentiels',
    href: '/tools/commission-calculator',
    icon: DollarSign,
    badge: 'Agent',
    action: 'canListProperties'
  }
]

export default function OutilsPage () {
  const { can } = usePermissions()

  const ToolCard = ({
    tool,
    isLocked = false
  }: {
    tool: any
    isLocked?: boolean
  }) => {
    const Icon = tool.icon

    if (isLocked) {
      return (
        <AccessRestriction action={tool.action} showUpgradePrompt={false}>
          <Card className='h-full opacity-50 cursor-not-allowed'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <Icon className='h-5 w-5 text-muted-foreground' />
                  <CardTitle className='text-lg'>{tool.title}</CardTitle>
                </div>
                <div className='flex items-center space-x-2'>
                  <Badge variant='secondary'>{tool.badge}</Badge>
                  <Lock className='h-4 w-4 text-muted-foreground' />
                </div>
              </div>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant='outline' size='sm' disabled>
                Mise à niveau requise
              </Button>
            </CardContent>
          </Card>
        </AccessRestriction>
      )
    }

    return (
      <Link href={tool.href}>
        <Card className='h-full transition-colors hover:bg-accent/50'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-2'>
                <Icon className='h-5 w-5 text-primary' />
                <CardTitle className='text-lg'>{tool.title}</CardTitle>
              </div>
              <Badge
                variant={tool.badge === 'Gratuit' ? 'secondary' : 'default'}
              >
                {tool.badge}
              </Badge>
            </div>
            <CardDescription>{tool.description}</CardDescription>
          </CardHeader>
        </Card>
      </Link>
    )
  }

  return (
    <div className='container mx-auto py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold mb-2'>Outils</h1>
        <p className='text-muted-foreground'>
          Des outils pratiques pour vous aider dans vos investissements
          immobiliers
        </p>
      </div>

      {/* Outils Gratuits */}
      <div className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>Outils Gratuits</h2>
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {freeTools.map(tool => (
            <ToolCard key={tool.href} tool={tool} />
          ))}
        </div>
      </div>

      {/* Outils Premium */}
      <div className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>Outils Premium</h2>
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {premiumTools.map(tool => (
            <ToolCard
              key={tool.href}
              tool={tool}
              isLocked={!can(tool.action)}
            />
          ))}
        </div>
      </div>

      {/* Outils Pro */}
      <div className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>Outils Pro</h2>
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {proTools.map(tool => (
            <ToolCard
              key={tool.href}
              tool={tool}
              isLocked={!can(tool.action)}
            />
          ))}
        </div>
      </div>

      {/* Outils Agent */}
      <div className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>Outils Agent</h2>
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {agentTools.map(tool => (
            <ToolCard
              key={tool.href}
              tool={tool}
              isLocked={!can(tool.action)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import {
  Building2,
  Download,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Settings,
  Calendar
} from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { RoleGuard } from '@/components/role-guard'

// Interfaces pour le typage
interface Source {
  id: string
  name: string
  category: string
  description: string
  lastImport: string | null
  status: 'active' | 'inactive' | 'error' | 'warning'
  totalImported: number
  imported?: number
  skipped?: number
  errors?: number
  logo?: string
  apiKeyRequired?: boolean
  lastSync?: string
  syncFrequency?: string
  isConnected?: boolean
  connectionUrl?: string
  requiresAuth?: boolean
  authUrl?: string
  docsUrl?: string
  version?: string
  isPremium?: boolean
  tags?: string[]
  features?: string[]
  settings?: {
    [key: string]: any
  }
}

interface ImportResults {
  imported: number
  skipped: number
  errors: number
  details: Array<{
    id: string
    status: string
    message?: string
  }>
}

export default function DataImportPage () {
  const [sources, setSources] = useState<Source[]>([])
  const [selectedSources, setSelectedSources] = useState<string[]>([])
  type ImportStatus = 'idle' | 'importing' | 'completed' | 'error' | 'success'
  const [importStatus, setImportStatus] = useState<ImportStatus>('idle')
  const [importProgress, setImportProgress] = useState(0)
  const [importResults, setImportResults] = useState<ImportResults | null>(null)
  
  interface Filters {
    location: string
    priceMin: string
    priceMax: string
    propertyType: string
    transactionType: string
    limit: number | string
  }
  
  const [filters, setFilters] = useState<Filters>({
    location: '',
    priceMin: '',
    priceMax: '',
    propertyType: '',
    transactionType: '',
    limit: 50
  })
  
  const [autoPublish, setAutoPublish] = useState(false)

  // Charger les sources disponibles
  useEffect(() => {
    fetchSources()
  }, [])

  const fetchSources = async () => {
    try {
      const response = await fetch('/api/import/external')
      const result = await response.json()
      if (result.success) {
        setSources(result.data)
      }
    } catch (error) {
      console.error('Erreur chargement sources:', error)
    }
  }

  const handleSourceToggle: (sourceId: string, checked: boolean) => void = (sourceId, checked) => {
    if (checked) {
      setSelectedSources([...selectedSources, sourceId])
    } else {
      setSelectedSources(selectedSources.filter(id => id !== sourceId))
    }
  }

  const handleFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  const handleImport: () => Promise<void> = async () => {
    if (selectedSources.length === 0) return

    setImportStatus('importing' as ImportStatus)
    setImportProgress(0)

    try {
      // Simulation du progrès
      const progressInterval = setInterval(() => {
        setImportProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 500)

      const response = await fetch('/api/import/external', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sources: selectedSources,
          filters: {
            ...filters,
            priceMin: filters.priceMin ? Number(filters.priceMin) : undefined,
            priceMax: filters.priceMax ? Number(filters.priceMax) : undefined,
            limit: Number(filters.limit)
          },
          autoPublish
        })
      })

      const result = await response.json()

      clearInterval(progressInterval)
      setImportProgress(100)

      if (result.success) {
        setImportStatus('completed' as ImportStatus)
        setImportResults(result.data)
      } else {
        setImportStatus('error' as ImportStatus)
      }
    } catch (error) {
      setImportStatus('error' as ImportStatus)
      console.error('Erreur import:', error)
    }
  }

  const getCategoryColor = (category: string): string => {
    switch (category.toLowerCase()) {
      case 'généraliste':
      case 'generaliste':
        return 'bg-blue-100 text-blue-800'
      case 'immobilier':
      case 'real estate':
        return 'bg-purple-100 text-purple-800'
      case 'location':
      case 'rental':
        return 'bg-green-100 text-green-800'
      case 'vente':
      case 'sale':
        return 'bg-orange-100 text-orange-800'
      case 'luxe':
      case 'luxury':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleCategoryFilter = (category: string): void => {
    // Implémentation de la logique de filtrage par catégorie
    console.log('Filtrer par catégorie:', category)
  }

  return (
    <RoleGuard requiredRole='premium' redirectTo='/pricing'>
      <div className='min-h-screen bg-background'>
        {/* Header */}
        <header className='border-b bg-white'>
          <div className='container mx-auto px-4'>
            <div className='flex items-center justify-between h-16'>
              <div className='flex items-center space-x-8'>
                <Link href='/' className='flex items-center space-x-2'>
                  <Building2 className='h-8 w-8 text-blue-600' />
                  <span className='text-2xl font-bold text-blue-600'>
                    LoopNet
                  </span>
                </Link>
                <nav className='hidden md:flex space-x-6'>
                  <Link
                    href='/data-import'
                    className='text-blue-600 font-medium'
                  >
                    Import Externe
                  </Link>
                  <Link
                    href='/property-management'
                    className='text-gray-700 hover:text-blue-600'
                  >
                    Gestion
                  </Link>
                  <Link
                    href='/dashboard'
                    className='text-gray-700 hover:text-blue-600'
                  >
                    Dashboard
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </header>

        <div className='container mx-auto px-4 py-6'>
          <div className='flex items-center justify-between mb-8'>
            <div>
              <h1 className='text-3xl font-bold'>
                Import depuis les APIs Externes
              </h1>
              <p className='text-gray-600'>
                Importez automatiquement des propriétés depuis les principales
                plateformes
              </p>
            </div>
            <div className='flex gap-4'>
              <Button
                onClick={handleImport}
                disabled={
                  selectedSources.length === 0 || importStatus === 'importing'
                }
              >
                {importStatus === 'importing' ? (
                  <RefreshCw className='h-4 w-4 mr-2 animate-spin' />
                ) : (
                  <Download className='h-4 w-4 mr-2' />
                )}
                Lancer l'import ({selectedSources.length})
              </Button>
            </div>
          </div>

          {/* Status d'import */}
          {importStatus === 'importing' && (
            <Card className='mb-6'>
              <CardContent className='p-6'>
                <div className='flex items-center gap-4'>
                  <RefreshCw className='h-6 w-6 animate-spin text-blue-600' />
                  <div className='flex-1'>
                    <h3 className='font-semibold'>Import en cours...</h3>
                    <Progress value={importProgress} className='mt-2' />
                    <p className='text-sm text-gray-600 mt-1'>
                      {importProgress}% terminé
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {importStatus === 'success' && importResults && (
            <Card className='mb-6 border-green-200 bg-green-50'>
              <CardContent className='p-6'>
                <div className='flex items-center gap-4'>
                  <CheckCircle className='h-6 w-6 text-green-600' />
                  <div>
                    <h3 className='font-semibold text-green-800'>
                      Import réussi !
                    </h3>
                    <p className='text-green-700'>
                      {importResults.imported} propriétés importées,{' '}
                      {importResults.skipped} ignorées, {importResults.errors}{' '}
                      erreurs
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {importStatus === 'error' && (
            <Card className='mb-6 border-red-200 bg-red-50'>
              <CardContent className='p-6'>
                <div className='flex items-center gap-4'>
                  <AlertCircle className='h-6 w-6 text-red-600' />
                  <div>
                    <h3 className='font-semibold text-red-800'>
                      Erreur d'import
                    </h3>
                    <p className='text-red-700'>
                      Une erreur s'est produite lors de l'import. Veuillez
                      réessayer.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue='sources' className='space-y-6'>
            <TabsList>
              <TabsTrigger value='sources'>Sources Externes</TabsTrigger>
              <TabsTrigger value='filters'>Filtres d'Import</TabsTrigger>
              <TabsTrigger value='schedule'>Planification</TabsTrigger>
              <TabsTrigger value='history'>Historique</TabsTrigger>
            </TabsList>

            <TabsContent value='sources' className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {sources.map(source => (
                  <Card key={source.id} className='relative'>
                    <CardHeader>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                          <Checkbox
                            checked={selectedSources.includes(source.id)}
                            onCheckedChange={(checked: boolean | string) => {
                              if (checked === true) {
                                setSelectedSources([
                                  ...selectedSources,
                                  source.id
                                ])
                              } else {
                                setSelectedSources(
                                  selectedSources.filter(id => id !== source.id)
                                )
                              }
                            }}
                            disabled={source.status !== 'active'}
                          />
                          <div>
                            <CardTitle className='text-lg'>
                              {source.name}
                            </CardTitle>
                            <Badge
                              className={getCategoryColor(source.category)}
                            >
                              {source.category}
                            </Badge>
                          </div>
                        </div>
                        {source.status === 'active' ? (
                          <Badge className='bg-green-100 text-green-800'>
                            Actif
                          </Badge>
                        ) : (
                          <Badge variant='outline'>Inactif</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className='text-gray-600 text-sm mb-4'>
                        {source.description}
                      </p>

                      <div className='space-y-2 text-sm'>
                        <div className='flex justify-between'>
                          <span className='text-gray-600'>Dernier import:</span>
                          <span>{source.lastImport || 'Jamais'}</span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-gray-600'>Total importé:</span>
                          <span className='font-semibold'>
                            {source.totalImported}
                          </span>
                        </div>
                      </div>

                      <div className='mt-4 flex gap-2'>
                        <Button size='sm' variant='outline' className='flex-1'>
                          <Settings className='h-3 w-3 mr-1' />
                          Config
                        </Button>
                        <Button size='sm' variant='outline'>
                          <ExternalLink className='h-3 w-3' />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value='filters' className='space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Filtres d'Import</CardTitle>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    <div>
                      <Label htmlFor='location'>Localisation</Label>
                      <Input
                        id='location'
                        placeholder='Paris, Lyon, Marseille...'
                        value={filters.location}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFilters({ ...filters, location: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor='propertyType'>Type de bien</Label>
                      <Select
                        value={filters.propertyType}
                        onValueChange={(value: string) =>
                          setFilters({ ...filters, propertyType: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Tous types' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='all'>Tous types</SelectItem>
                          <SelectItem value='apartment'>Appartement</SelectItem>
                          <SelectItem value='house'>Maison</SelectItem>
                          <SelectItem value='office'>Bureau</SelectItem>
                          <SelectItem value='retail'>Commerce</SelectItem>
                          <SelectItem value='warehouse'>Entrepôt</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor='transactionType'>Transaction</Label>
                      <Select
                        value={filters.transactionType}
                        onValueChange={(value: string) =>
                          setFilters({ ...filters, transactionType: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Toutes transactions' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value=''>Toutes</SelectItem>
                          <SelectItem value='sale'>Vente</SelectItem>
                          <SelectItem value='rent'>Location</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor='priceMin'>Prix minimum (€)</Label>
                      <Input
                        id='priceMin'
                        type='number'
                        placeholder='0'
                        value={filters.priceMin}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFilters({ ...filters, priceMin: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor='priceMax'>Prix maximum (€)</Label>
                      <Input
                        id='priceMax'
                        type='number'
                        placeholder='1000000'
                        value={filters.priceMax}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFilters({ ...filters, priceMax: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor='limit'>Limite par source</Label>
                      <Input
                        id='limit'
                        type='number'
                        placeholder='50'
                        value={filters.limit}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFilters({ ...filters, limit: Number(e.target.value) })
                        }
                      />
                    </div>
                  </div>

                  <div className='flex items-center space-x-2'>
                    <Switch
                      id='autoPublish'
                      checked={autoPublish}
                      onCheckedChange={setAutoPublish}
                    />
                    <Label htmlFor='autoPublish'>
                      Publication automatique (sinon en attente de validation)
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='schedule' className='space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Import Automatique</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='p-4 bg-blue-50 rounded-lg'>
                    <h4 className='font-medium text-blue-900 mb-2'>
                      🚀 Fonctionnalité Pro
                    </h4>
                    <p className='text-sm text-blue-800'>
                      Planifiez des imports automatiques quotidiens,
                      hebdomadaires ou mensuels.
                    </p>
                    <Button className='mt-3' variant='outline'>
                      Activer la planification
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='history' className='space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Historique des Imports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-center py-8 text-gray-500'>
                    <Calendar className='h-12 w-12 mx-auto mb-4 text-gray-400' />
                    <p>Aucun import effectué pour le moment</p>
                    <p className='text-sm'>
                      L'historique apparaîtra ici après votre premier import
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </RoleGuard>
  )
}

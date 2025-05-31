'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  FileText, 
  Download, 
  Calendar, 
  Building2, 
  DollarSign, 
  Users, 
  TrendingUp,
  TrendingDown,
  Eye,
  Mail,
  Phone,
  MapPin,
  Clock,
  Filter,
  Search,
  Plus,
  BarChart3,
  PieChart as PieChartIcon,
  FileBarChart
} from 'lucide-react'
import { RoleGuard } from '@/components/role-guard'

// Types pour les rapports
interface Report {
  id: number
  title: string
  description: string
  type: 'sales' | 'listings' | 'performance' | 'market' | 'financial'
  period: string
  createdAt: string
  status: 'generated' | 'pending' | 'scheduled'
  format: 'pdf' | 'excel' | 'csv'
  size: string
}

// Données fictives pour les rapports
const reports: Report[] = [
  {
    id: 1,
    title: 'Rapport mensuel des ventes',
    description: 'Analyse complète des performances de vente du mois',
    type: 'sales',
    period: 'Janvier 2024',
    createdAt: '2024-01-31',
    status: 'generated',
    format: 'pdf',
    size: '2.4 MB'
  },
  {
    id: 2,
    title: 'Analyse du marché immobilier',
    description: 'Tendances et évolutions du marché local',
    type: 'market',
    period: 'Q4 2023',
    createdAt: '2024-01-15',
    status: 'generated',
    format: 'excel',
    size: '1.8 MB'
  },
  {
    id: 3,
    title: 'Performance des annonces',
    description: 'Statistiques détaillées sur les propriétés listées',
    type: 'listings',
    period: 'Décembre 2023',
    createdAt: '2024-01-05',
    status: 'generated',
    format: 'pdf',
    size: '3.1 MB'
  },
  {
    id: 4,
    title: 'Rapport financier trimestriel',
    description: 'Analyse des revenus et commissions',
    type: 'financial',
    period: 'Q4 2023',
    createdAt: '2024-01-02',
    status: 'pending',
    format: 'excel',
    size: '-'
  },
  {
    id: 5,
    title: 'Rapport de performance annuel',
    description: 'Bilan complet de l\'année 2023',
    type: 'performance',
    period: '2023',
    createdAt: '2024-01-01',
    status: 'scheduled',
    format: 'pdf',
    size: '-'
  }
]

// Données pour les graphiques
const salesData = [
  { month: 'Jan', ventes: 12, objectif: 15, revenus: 45000 },
  { month: 'Fév', ventes: 18, objectif: 15, revenus: 67000 },
  { month: 'Mar', ventes: 14, objectif: 15, revenus: 52000 },
  { month: 'Avr', ventes: 22, objectif: 20, revenus: 78000 },
  { month: 'Mai', ventes: 16, objectif: 20, revenus: 58000 },
  { month: 'Juin', ventes: 25, objectif: 20, revenus: 89000 },
  { month: 'Juil', ventes: 19, objectif: 20, revenus: 71000 },
  { month: 'Août', ventes: 21, objectif: 20, revenus: 76000 },
  { month: 'Sep', ventes: 28, objectif: 25, revenus: 95000 },
  { month: 'Oct', ventes: 24, objectif: 25, revenus: 84000 },
  { month: 'Nov', ventes: 30, objectif: 25, revenus: 102000 },
  { month: 'Déc', ventes: 26, objectif: 25, revenus: 91000 },
]

const propertyTypes = [
  { name: 'Bureaux', value: 35, color: '#3b82f6' },
  { name: 'Commerce', value: 28, color: '#10b981' },
  { name: 'Entrepôts', value: 20, color: '#f59e0b' },
  { name: 'Terrains', value: 12, color: '#ef4444' },
  { name: 'Autres', value: 5, color: '#8b5cf6' },
]

const marketTrends = [
  { quarter: 'Q1 2023', prix: 2850, volume: 145 },
  { quarter: 'Q2 2023', prix: 2920, volume: 162 },
  { quarter: 'Q3 2023', prix: 3100, volume: 178 },
  { quarter: 'Q4 2023', prix: 3250, volume: 195 },
  { quarter: 'Q1 2024', prix: 3180, volume: 188 },
]

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'generated':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Généré</Badge>
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">En cours</Badge>
    case 'scheduled':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Programmé</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'sales':
      return <DollarSign className="h-4 w-4" />
    case 'listings':
      return <Building2 className="h-4 w-4" />
    case 'performance':
      return <BarChart3 className="h-4 w-4" />
    case 'market':
      return <TrendingUp className="h-4 w-4" />
    case 'financial':
      return <FileBarChart className="h-4 w-4" />
    default:
      return <FileText className="h-4 w-4" />
  }
}

const getTypeName = (type: string) => {
  switch (type) {
    case 'sales':
      return 'Ventes'
    case 'listings':
      return 'Annonces'
    case 'performance':
      return 'Performance'
    case 'market':
      return 'Marché'
    case 'financial':
      return 'Financier'
    default:
      return type
  }
}

export default function AgentReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly')
  const [selectedType, setSelectedType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false)
  const [newReport, setNewReport] = useState({
    title: '',
    description: '',
    type: 'sales',
    period: 'monthly',
    format: 'pdf'
  })

  const filteredReports = reports.filter(report => {
    const typeMatch = selectedType === 'all' || report.type === selectedType
    const searchMatch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       report.description.toLowerCase().includes(searchTerm.toLowerCase())
    return typeMatch && searchMatch
  })

  const handleGenerateReport = () => {
    console.log('Génération du rapport:', newReport)
    setIsGenerateDialogOpen(false)
    setNewReport({
      title: '',
      description: '',
      type: 'sales',
      period: 'monthly',
      format: 'pdf'
    })
  }

  const handleDownloadReport = (reportId: number) => {
    console.log('Téléchargement du rapport:', reportId)
  }

  return (
    <RoleGuard allowedRoles={['agent', 'admin']} message="Vous devez être un agent pour accéder à cette page.">
      <div className="w-full px-4 py-8">
        <div className="flex flex-col space-y-8">
          {/* En-tête */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Rapports</h1>
              <p className="text-gray-500 mt-1">
                Générez et consultez vos rapports d'activité
              </p>
            </div>
            <div className="flex gap-2">
              <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau rapport
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Générer un nouveau rapport</DialogTitle>
                    <DialogDescription>
                      Créez un rapport personnalisé selon vos besoins.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="title" className="text-right">
                        Titre
                      </Label>
                      <Input
                        id="title"
                        value={newReport.title}
                        onChange={(e) => setNewReport({...newReport, title: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        value={newReport.description}
                        onChange={(e) => setNewReport({...newReport, description: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="type" className="text-right">
                        Type
                      </Label>
                      <Select value={newReport.type} onValueChange={(value) => setNewReport({...newReport, type: value})}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sales">Ventes</SelectItem>
                          <SelectItem value="listings">Annonces</SelectItem>
                          <SelectItem value="performance">Performance</SelectItem>
                          <SelectItem value="market">Marché</SelectItem>
                          <SelectItem value="financial">Financier</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="period" className="text-right">
                        Période
                      </Label>
                      <Select value={newReport.period} onValueChange={(value) => setNewReport({...newReport, period: value})}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Hebdomadaire</SelectItem>
                          <SelectItem value="monthly">Mensuel</SelectItem>
                          <SelectItem value="quarterly">Trimestriel</SelectItem>
                          <SelectItem value="yearly">Annuel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="format" className="text-right">
                        Format
                      </Label>
                      <Select value={newReport.format} onValueChange={(value) => setNewReport({...newReport, format: value})}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="excel">Excel</SelectItem>
                          <SelectItem value="csv">CSV</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleGenerateReport}>Générer le rapport</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Rapports générés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{reports.filter(r => r.status === 'generated').length}</div>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% ce mois
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  En cours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{reports.filter(r => r.status === 'pending').length}</div>
                <p className="text-xs text-blue-500 flex items-center mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  En traitement
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Programmés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{reports.filter(r => r.status === 'scheduled').length}</div>
                <p className="text-xs text-purple-500 flex items-center mt-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  À venir
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Taille totale
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">12.8 MB</div>
                <p className="text-xs text-gray-500 flex items-center mt-1">
                  <FileText className="h-3 w-3 mr-1" />
                  Stockage utilisé
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filtres et recherche */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher un rapport..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type de rapport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="sales">Ventes</SelectItem>
                <SelectItem value="listings">Annonces</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="market">Marché</SelectItem>
                <SelectItem value="financial">Financier</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Hebdomadaire</SelectItem>
                <SelectItem value="monthly">Mensuel</SelectItem>
                <SelectItem value="quarterly">Trimestriel</SelectItem>
                <SelectItem value="yearly">Annuel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Onglets pour les différentes vues */}
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="list">
                <FileText className="h-4 w-4 mr-2" />
                Liste des rapports
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analyses
              </TabsTrigger>
              <TabsTrigger value="insights">
                <PieChartIcon className="h-4 w-4 mr-2" />
                Insights
              </TabsTrigger>
            </TabsList>

            {/* Liste des rapports */}
            <TabsContent value="list" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Rapports disponibles</CardTitle>
                  <CardDescription>
                    Consultez et téléchargez vos rapports générés
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rapport</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Période</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Taille</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                {getTypeIcon(report.type)}
                              </div>
                              <div>
                                <div className="font-medium">{report.title}</div>
                                <div className="text-sm text-gray-500">{report.description}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{getTypeName(report.type)}</Badge>
                          </TableCell>
                          <TableCell>{report.period}</TableCell>
                          <TableCell>{getStatusBadge(report.status)}</TableCell>
                          <TableCell>{report.size}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {report.status === 'generated' && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleDownloadReport(report.id)}
                                >
                                  <Download className="h-4 w-4 mr-1" />
                                  Télécharger
                                </Button>
                              )}
                              <Button size="sm" variant="ghost">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analyses */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance des ventes</CardTitle>
                    <CardDescription>
                      Évolution des ventes vs objectifs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={salesData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="objectif" fill="#e5e7eb" name="Objectif" />
                          <Bar dataKey="ventes" fill="#3b82f6" name="Ventes réalisées" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Évolution des revenus</CardTitle>
                    <CardDescription>
                      Revenus mensuels générés
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={salesData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`${value}€`, 'Revenus']} />
                          <Area type="monotone" dataKey="revenus" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Répartition par type de propriété</CardTitle>
                    <CardDescription>
                      Distribution des ventes par catégorie
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={propertyTypes}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {propertyTypes.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Tendances du marché</CardTitle>
                    <CardDescription>
                      Prix moyen et volume des transactions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={marketTrends}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="quarter" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip />
                          <Legend />
                          <Line yAxisId="left" type="monotone" dataKey="prix" stroke="#3b82f6" strokeWidth={3} name="Prix moyen (€/m²)" />
                          <Line yAxisId="right" type="monotone" dataKey="volume" stroke="#10b981" strokeWidth={3} name="Volume transactions" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Insights */}
            <TabsContent value="insights" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recommandations</CardTitle>
                    <CardDescription>
                      Conseils basés sur vos données
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-green-900">Performance excellente</h4>
                          <p className="text-sm text-green-700 mt-1">
                            Vos ventes dépassent les objectifs de 15% ce trimestre.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                        <Building2 className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900">Opportunité marché</h4>
                          <p className="text-sm text-blue-700 mt-1">
                            Le segment bureaux montre une forte demande (+28%).
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
                        <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-900">Optimisation temps</h4>
                          <p className="text-sm text-yellow-700 mt-1">
                            Réduisez le temps de vente moyen en améliorant le suivi client.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Métriques clés</CardTitle>
                    <CardDescription>
                      Indicateurs de performance importants
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Taux de conversion</span>
                          <span className="text-sm font-bold">68%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full w-[68%]"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Temps de vente moyen</span>
                          <span className="text-sm font-bold">45 jours</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full w-[75%]"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Satisfaction client</span>
                          <span className="text-sm font-bold">4.8/5</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full w-[96%]"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">ROI marketing</span>
                          <span className="text-sm font-bold">320%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-orange-600 h-2 rounded-full w-[85%]"></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Prochaines actions recommandées</CardTitle>
                  <CardDescription>
                    Actions prioritaires pour améliorer vos performances
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <Users className="h-4 w-4 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Relancer 8 prospects inactifs</h4>
                        <p className="text-sm text-gray-500">Dernière interaction il y a plus de 2 semaines</p>
                      </div>
                      <Badge variant="destructive">Urgent</Badge>
                    </div>
                    <div className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Building2 className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Mettre à jour 5 annonces</h4>
                        <p className="text-sm text-gray-500">Photos et descriptions à actualiser</p>
                      </div>
                      <Badge variant="secondary">Moyen</Badge>
                    </div>
                    <div className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <BarChart3 className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Analyser les tendances Q1</h4>
                        <p className="text-sm text-gray-500">Préparer la stratégie pour le prochain trimestre</p>
                      </div>
                      <Badge variant="outline">Faible</Badge>
                    </div>
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
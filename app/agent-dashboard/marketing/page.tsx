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
  ResponsiveContainer
} from 'recharts'
import TopFilter from '@/components/enhanced-filters/TopFilter'
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
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  Briefcase, 
  Mail, 
  Phone, 
  MessageSquare, 
  Share2, 
  Eye, 
  Clock, 
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Calendar,
  Plus,
  Edit,
  Trash2,
  Send,
  Image,
  Video,
  FileText,
  Globe,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube
} from 'lucide-react'
import { RoleGuard } from '@/components/role-guard'

// Types pour les campagnes marketing
interface Campaign {
  id: number
  name: string
  type: 'email' | 'social' | 'sms' | 'display' | 'video'
  status: 'active' | 'paused' | 'completed' | 'draft'
  budget: number
  spent: number
  impressions: number
  clicks: number
  conversions: number
  startDate: string
  endDate: string
  platform: string
}

// Types pour les contenus marketing
interface MarketingContent {
  id: number
  title: string
  type: 'post' | 'video' | 'brochure' | 'flyer' | 'newsletter'
  platform: string
  status: 'published' | 'draft' | 'scheduled'
  views: number
  engagement: number
  createdAt: string
  scheduledAt?: string
}

// Données fictives pour les campagnes
const campaigns: Campaign[] = [
  {
    id: 1,
    name: 'Campagne Bureaux Premium',
    type: 'email',
    status: 'active',
    budget: 5000,
    spent: 3200,
    impressions: 45000,
    clicks: 1250,
    conversions: 85,
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    platform: 'Email Marketing'
  },
  {
    id: 2,
    name: 'Promotion Entrepôts',
    type: 'social',
    status: 'active',
    budget: 3000,
    spent: 1800,
    impressions: 78000,
    clicks: 2100,
    conversions: 42,
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    platform: 'LinkedIn'
  },
  {
    id: 3,
    name: 'Retargeting Prospects',
    type: 'display',
    status: 'paused',
    budget: 2000,
    spent: 1200,
    impressions: 32000,
    clicks: 890,
    conversions: 28,
    startDate: '2023-12-01',
    endDate: '2024-01-15',
    platform: 'Google Ads'
  },
  {
    id: 4,
    name: 'Vidéo Visite Virtuelle',
    type: 'video',
    status: 'completed',
    budget: 4000,
    spent: 3800,
    impressions: 125000,
    clicks: 4200,
    conversions: 156,
    startDate: '2023-11-01',
    endDate: '2023-12-31',
    platform: 'YouTube'
  },
  {
    id: 5,
    name: 'SMS Nouveautés',
    type: 'sms',
    status: 'draft',
    budget: 1500,
    spent: 0,
    impressions: 0,
    clicks: 0,
    conversions: 0,
    startDate: '2024-02-01',
    endDate: '2024-02-28',
    platform: 'SMS Gateway'
  }
]

// Données fictives pour les contenus
const marketingContent: MarketingContent[] = [
  {
    id: 1,
    title: 'Nouveau complexe de bureaux disponible',
    type: 'post',
    platform: 'LinkedIn',
    status: 'published',
    views: 2500,
    engagement: 180,
    createdAt: '2024-01-20'
  },
  {
    id: 2,
    title: 'Visite virtuelle 360° - Entrepôt moderne',
    type: 'video',
    platform: 'YouTube',
    status: 'published',
    views: 8900,
    engagement: 420,
    createdAt: '2024-01-18'
  },
  {
    id: 3,
    title: 'Newsletter mensuelle - Tendances marché',
    type: 'newsletter',
    platform: 'Email',
    status: 'scheduled',
    views: 0,
    engagement: 0,
    createdAt: '2024-01-25',
    scheduledAt: '2024-02-01'
  },
  {
    id: 4,
    title: 'Brochure commerciale Q1 2024',
    type: 'brochure',
    platform: 'Print/Digital',
    status: 'draft',
    views: 0,
    engagement: 0,
    createdAt: '2024-01-22'
  }
]

// Données pour les graphiques
const campaignPerformance = [
  { month: 'Oct', impressions: 35000, clicks: 1200, conversions: 45 },
  { month: 'Nov', impressions: 42000, clicks: 1580, conversions: 68 },
  { month: 'Déc', impressions: 38000, clicks: 1350, conversions: 52 },
  { month: 'Jan', impressions: 48000, clicks: 1890, conversions: 89 },
]

const channelPerformance = [
  { channel: 'Email', roi: 320, cost: 2500, revenue: 8000 },
  { channel: 'Social Media', roi: 280, cost: 1800, revenue: 5040 },
  { channel: 'Google Ads', roi: 250, cost: 3200, revenue: 8000 },
  { channel: 'YouTube', roi: 380, cost: 1500, revenue: 5700 },
  { channel: 'SMS', roi: 420, cost: 800, revenue: 3360 },
]

const audienceData = [
  { segment: 'Investisseurs', value: 35, color: '#3b82f6' },
  { segment: 'Entreprises', value: 28, color: '#10b981' },
  { segment: 'Startups', value: 20, color: '#f59e0b' },
  { segment: 'Particuliers', value: 12, color: '#ef4444' },
  { segment: 'Autres', value: 5, color: '#8b5cf6' },
]

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Actif</Badge>
    case 'paused':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">En pause</Badge>
    case 'completed':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Terminé</Badge>
    case 'draft':
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Brouillon</Badge>
    case 'published':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Publié</Badge>
    case 'scheduled':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Programmé</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'email':
      return <Mail className="h-4 w-4" />
    case 'social':
      return <Share2 className="h-4 w-4" />
    case 'sms':
      return <MessageSquare className="h-4 w-4" />
    case 'display':
      return <Eye className="h-4 w-4" />
    case 'video':
      return <Video className="h-4 w-4" />
    case 'post':
      return <FileText className="h-4 w-4" />
    case 'brochure':
      return <FileText className="h-4 w-4" />
    case 'flyer':
      return <Image className="h-4 w-4" />
    case 'newsletter':
      return <Mail className="h-4 w-4" />
    default:
      return <Briefcase className="h-4 w-4" />
  }
}

const getPlatformIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'linkedin':
      return <Linkedin className="h-4 w-4" />
    case 'facebook':
      return <Facebook className="h-4 w-4" />
    case 'instagram':
      return <Instagram className="h-4 w-4" />
    case 'twitter':
      return <Twitter className="h-4 w-4" />
    case 'youtube':
      return <Youtube className="h-4 w-4" />
    case 'email':
    case 'email marketing':
      return <Mail className="h-4 w-4" />
    default:
      return <Globe className="h-4 w-4" />
  }
}

export default function AgentMarketingPage() {
  const [selectedCampaignType, setSelectedCampaignType] = useState('all')
  const [selectedContentType, setSelectedContentType] = useState('all')
  const [isNewCampaignDialogOpen, setIsNewCampaignDialogOpen] = useState(false)
  const [isNewContentDialogOpen, setIsNewContentDialogOpen] = useState(false)
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    type: 'email',
    budget: 0,
    platform: '',
    startDate: '',
    endDate: ''
  })
  const [newContent, setNewContent] = useState({
    title: '',
    type: 'post',
    platform: '',
    scheduledAt: ''
  })

  const filteredCampaigns = campaigns.filter(campaign => 
    selectedCampaignType === 'all' || campaign.type === selectedCampaignType
  )

  const filteredContent = marketingContent.filter(content => 
    selectedContentType === 'all' || content.type === selectedContentType
  )

  const totalBudget = campaigns.reduce((sum, campaign) => sum + campaign.budget, 0)
  const totalSpent = campaigns.reduce((sum, campaign) => sum + campaign.spent, 0)
  const totalImpressions = campaigns.reduce((sum, campaign) => sum + campaign.impressions, 0)
  const totalClicks = campaigns.reduce((sum, campaign) => sum + campaign.clicks, 0)
  const totalConversions = campaigns.reduce((sum, campaign) => sum + campaign.conversions, 0)
  const averageCTR = totalImpressions > 0 ? (totalClicks / totalImpressions * 100) : 0
  const averageConversionRate = totalClicks > 0 ? (totalConversions / totalClicks * 100) : 0

  const handleCreateCampaign = () => {
    console.log('Création de campagne:', newCampaign)
    setIsNewCampaignDialogOpen(false)
    setNewCampaign({
      name: '',
      type: 'email',
      budget: 0,
      platform: '',
      startDate: '',
      endDate: ''
    })
  }

  const handleCreateContent = () => {
    console.log('Création de contenu:', newContent)
    setIsNewContentDialogOpen(false)
    setNewContent({
      title: '',
      type: 'post',
      platform: '',
      scheduledAt: ''
    })
  }

  return (
    <RoleGuard allowedRoles={['agent', 'admin']} fallback={<div className="p-8 text-center">Vous devez être un agent pour accéder à cette page.</div>}>
      <div className="w-full px-4 py-8">
        <div className="flex flex-col space-y-8">
          {/* En-tête */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Marketing</h1>
              <p className="text-gray-500 mt-1">
                Gérez vos campagnes et contenus marketing
              </p>
            </div>
            <div className="flex gap-2">
              <Dialog open={isNewCampaignDialogOpen} onOpenChange={setIsNewCampaignDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle campagne
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Créer une nouvelle campagne</DialogTitle>
                    <DialogDescription>
                      Lancez une nouvelle campagne marketing pour promouvoir vos propriétés.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="campaign-name" className="text-right">
                        Nom
                      </Label>
                      <Input
                        id="campaign-name"
                        value={newCampaign.name}
                        onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="campaign-type" className="text-right">
                        Type
                      </Label>
                      <Select 
                        value={newCampaign.type} 
                        onValueChange={(value) => setNewCampaign({...newCampaign, type: value})}
                        aria-labelledby="campaign-type"
                      >
                        <SelectTrigger className="col-span-3" id="campaign-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="social">Réseaux sociaux</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                          <SelectItem value="display">Display</SelectItem>
                          <SelectItem value="video">Vidéo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="campaign-budget" className="text-right">
                        Budget (€)
                      </Label>
                      <Input
                        id="campaign-budget"
                        type="number"
                        value={newCampaign.budget}
                        onChange={(e) => setNewCampaign({...newCampaign, budget: parseInt(e.target.value)})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="campaign-platform" className="text-right">
                        Plateforme
                      </Label>
                      <Input
                        id="campaign-platform"
                        value={newCampaign.platform}
                        onChange={(e) => setNewCampaign({...newCampaign, platform: e.target.value})}
                        className="col-span-3"
                        placeholder="ex: LinkedIn, Google Ads"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="campaign-start" className="text-right">
                        Début
                      </Label>
                      <Input
                        id="campaign-start"
                        type="date"
                        value={newCampaign.startDate}
                        onChange={(e) => setNewCampaign({...newCampaign, startDate: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="campaign-end" className="text-right">
                        Fin
                      </Label>
                      <Input
                        id="campaign-end"
                        type="date"
                        value={newCampaign.endDate}
                        onChange={(e) => setNewCampaign({...newCampaign, endDate: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleCreateCampaign}>Créer la campagne</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Dialog open={isNewContentDialogOpen} onOpenChange={setIsNewContentDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau contenu
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Créer un nouveau contenu</DialogTitle>
                    <DialogDescription>
                      Créez du contenu marketing pour vos campagnes.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="content-title" className="text-right">
                        Titre
                      </Label>
                      <Input
                        id="content-title"
                        value={newContent.title}
                        onChange={(e) => setNewContent({...newContent, title: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="content-type" className="text-right">
                        Type
                      </Label>
                      <Select 
                        value={newContent.type} 
                        onValueChange={(value) => setNewContent({...newContent, type: value})}
                        aria-labelledby="content-type"
                      >
                        <SelectTrigger className="col-span-3" id="content-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="post">Post</SelectItem>
                          <SelectItem value="video">Vidéo</SelectItem>
                          <SelectItem value="brochure">Brochure</SelectItem>
                          <SelectItem value="flyer">Flyer</SelectItem>
                          <SelectItem value="newsletter">Newsletter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="content-platform" className="text-right">
                        Plateforme
                      </Label>
                      <Input
                        id="content-platform"
                        value={newContent.platform}
                        onChange={(e) => setNewContent({...newContent, platform: e.target.value})}
                        className="col-span-3"
                        placeholder="ex: LinkedIn, YouTube"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="content-scheduled" className="text-right">
                        Programmé
                      </Label>
                      <Input
                        id="content-scheduled"
                        type="datetime-local"
                        value={newContent.scheduledAt}
                        onChange={(e) => setNewContent({...newContent, scheduledAt: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleCreateContent}>Créer le contenu</Button>
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
                  Budget total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalBudget.toLocaleString()}€</div>
                <p className="text-xs text-blue-500 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {totalSpent.toLocaleString()}€ dépensés
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Impressions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalImpressions.toLocaleString()}</div>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <Eye className="h-3 w-3 mr-1" />
                  +15% ce mois
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Taux de clic
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{averageCTR.toFixed(2)}%</div>
                <p className="text-xs text-purple-500 flex items-center mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  {totalClicks.toLocaleString()} clics
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Conversions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalConversions}</div>
                <p className="text-xs text-orange-500 flex items-center mt-1">
                  <Target className="h-3 w-3 mr-1" />
                  {averageConversionRate.toFixed(2)}% taux
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Onglets pour les différentes sections */}
          <Tabs defaultValue="campaigns" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="campaigns">
                <Briefcase className="h-4 w-4 mr-2" />
                Campagnes
              </TabsTrigger>
              <TabsTrigger value="content">
                <FileText className="h-4 w-4 mr-2" />
                Contenus
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <TrendingUp className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="audience">
                <Users className="h-4 w-4 mr-2" />
                Audience
              </TabsTrigger>
            </TabsList>

            {/* Campagnes */}
            <TabsContent value="campaigns" className="space-y-6">
              <div className="flex gap-4 mb-6">
                <Select 
                  value={selectedCampaignType} 
                  onValueChange={setSelectedCampaignType}
                  aria-label="Filtrer par type de campagne"
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Type de campagne" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="social">Réseaux sociaux</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="display">Display</SelectItem>
                    <SelectItem value="video">Vidéo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Campagnes actives</CardTitle>
                  <CardDescription>
                    Gérez vos campagnes marketing en cours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Campagne</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead>Performance</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCampaigns.map((campaign) => {
                        const ctr = campaign.impressions > 0 ? (campaign.clicks / campaign.impressions * 100) : 0
                        const conversionRate = campaign.clicks > 0 ? (campaign.conversions / campaign.clicks * 100) : 0
                        
                        return (
                          <TableRow key={campaign.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                  {getTypeIcon(campaign.type)}
                                </div>
                                <div>
                                  <div className="font-medium">{campaign.name}</div>
                                  <div className="text-sm text-gray-500 flex items-center gap-1">
                                    {getPlatformIcon(campaign.platform)}
                                    {campaign.platform}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {campaign.type === 'email' ? 'Email' :
                                 campaign.type === 'social' ? 'Social' :
                                 campaign.type === 'sms' ? 'SMS' :
                                 campaign.type === 'display' ? 'Display' :
                                 campaign.type === 'video' ? 'Vidéo' : campaign.type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{campaign.spent.toLocaleString()}€ / {campaign.budget.toLocaleString()}€</div>
                                <div className="text-sm text-gray-500">
                                  {((campaign.spent / campaign.budget) * 100).toFixed(0)}% utilisé
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="text-sm">
                                  <span className="font-medium">{campaign.impressions.toLocaleString()}</span> vues
                                </div>
                                <div className="text-sm">
                                  <span className="font-medium">{campaign.clicks.toLocaleString()}</span> clics ({ctr.toFixed(2)}%)
                                </div>
                                <div className="text-sm">
                                  <span className="font-medium">{campaign.conversions}</span> conversions ({conversionRate.toFixed(2)}%)
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contenus */}
            <TabsContent value="content" className="space-y-6">
              <div className="flex gap-4 mb-6">
                <Select 
                  value={selectedContentType} 
                  onValueChange={setSelectedContentType}
                  aria-label="Filtrer par type de contenu"
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Type de contenu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="post">Posts</SelectItem>
                    <SelectItem value="video">Vidéos</SelectItem>
                    <SelectItem value="brochure">Brochures</SelectItem>
                    <SelectItem value="flyer">Flyers</SelectItem>
                    <SelectItem value="newsletter">Newsletters</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContent.map((content) => (
                  <Card key={content.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            {getTypeIcon(content.type)}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{content.title}</CardTitle>
                          </div>
                        </div>
                        {getStatusBadge(content.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          {getPlatformIcon(content.platform)}
                          <span>{content.platform}</span>
                        </div>
                        
                        {content.status === 'published' && (
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="font-medium">{content.views.toLocaleString()}</div>
                              <div className="text-gray-500">Vues</div>
                            </div>
                            <div>
                              <div className="font-medium">{content.engagement}</div>
                              <div className="text-gray-500">Engagements</div>
                            </div>
                          </div>
                        )}
                        
                        {content.status === 'scheduled' && content.scheduledAt && (
                          <div className="text-sm text-blue-600">
                            Programmé pour le {new Date(content.scheduledAt).toLocaleDateString('fr-FR')}
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Edit className="h-4 w-4 mr-1" />
                            Modifier
                          </Button>
                          {content.status === 'draft' && (
                            <Button size="sm" className="flex-1">
                              <Send className="h-4 w-4 mr-1" />
                              Publier
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Analytics */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance des campagnes</CardTitle>
                    <CardDescription>
                      Évolution des métriques clés
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={campaignPerformance}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip />
                          <Legend />
                          <Line yAxisId="left" type="monotone" dataKey="impressions" stroke="#3b82f6" strokeWidth={2} name="Impressions" />
                          <Line yAxisId="right" type="monotone" dataKey="clicks" stroke="#10b981" strokeWidth={2} name="Clics" />
                          <Line yAxisId="right" type="monotone" dataKey="conversions" stroke="#f59e0b" strokeWidth={2} name="Conversions" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>ROI par canal</CardTitle>
                    <CardDescription>
                      Retour sur investissement par plateforme
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={channelPerformance}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="channel" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`${value}%`, 'ROI']} />
                          <Bar dataKey="roi" fill="#3b82f6" name="ROI (%)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Détail des coûts et revenus</CardTitle>
                  <CardDescription>
                    Analyse financière par canal marketing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Canal</TableHead>
                        <TableHead>Coût</TableHead>
                        <TableHead>Revenus</TableHead>
                        <TableHead>ROI</TableHead>
                        <TableHead>Bénéfice</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {channelPerformance.map((channel) => {
                        const profit = channel.revenue - channel.cost
                        return (
                          <TableRow key={channel.channel}>
                            <TableCell className="font-medium">{channel.channel}</TableCell>
                            <TableCell>{channel.cost.toLocaleString()}€</TableCell>
                            <TableCell>{channel.revenue.toLocaleString()}€</TableCell>
                            <TableCell>
                              <Badge variant={channel.roi > 300 ? 'default' : channel.roi > 200 ? 'secondary' : 'outline'}>
                                {channel.roi}%
                              </Badge>
                            </TableCell>
                            <TableCell className={profit > 0 ? 'text-green-600' : 'text-red-600'}>
                              {profit > 0 ? '+' : ''}{profit.toLocaleString()}€
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Audience */}
            <TabsContent value="audience" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Segmentation de l'audience</CardTitle>
                    <CardDescription>
                      Répartition de votre audience cible
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={audienceData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {audienceData.map((entry, index) => (
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
                    <CardTitle>Insights audience</CardTitle>
                    <CardDescription>
                      Données démographiques et comportementales
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-2">Âge moyen</h4>
                        <div className="text-2xl font-bold">42 ans</div>
                        <p className="text-sm text-gray-500">Principalement 35-55 ans</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Localisation principale</h4>
                        <div className="text-2xl font-bold">Paris & IDF</div>
                        <p className="text-sm text-gray-500">68% de l'audience</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Intérêts principaux</h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline">Investissement</Badge>
                          <Badge variant="outline">Immobilier commercial</Badge>
                          <Badge variant="outline">Bureaux</Badge>
                          <Badge variant="outline">Entrepôts</Badge>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Engagement moyen</h4>
                        <div className="text-2xl font-bold">7.2%</div>
                        <p className="text-sm text-gray-500">+2.1% vs mois dernier</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recommandations d'audience</CardTitle>
                  <CardDescription>
                    Suggestions pour optimiser vos campagnes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                      <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">Cibler les investisseurs institutionnels</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          Segment à fort potentiel avec un budget moyen 3x supérieur.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                      <Users className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-900">Développer le segment startups</h4>
                        <p className="text-sm text-green-700 mt-1">
                          Croissance de 45% de la demande en espaces flexibles.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
                      <Calendar className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-900">Optimiser les horaires de diffusion</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          Meilleur engagement entre 9h-11h et 14h-16h en semaine.
                        </p>
                      </div>
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
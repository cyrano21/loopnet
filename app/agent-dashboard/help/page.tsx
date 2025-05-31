'use client'

import { useState } from 'react'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
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
  HelpCircle, 
  Search, 
  Book, 
  Video, 
  MessageCircle, 
  Phone, 
  Mail, 
  FileText, 
  ExternalLink, 
  Play, 
  Download, 
  Star, 
  Clock, 
  Users, 
  Zap, 
  Shield, 
  CreditCard, 
  Settings, 
  BarChart3, 
  Home, 
  Building, 
  Calendar, 
  Send, 
  CheckCircle,
  AlertCircle,
  Info,
  Lightbulb,
  Target,
  TrendingUp,
  Globe,
  Smartphone
} from 'lucide-react'
import { RoleGuard } from '@/components/role-guard'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Types pour les articles d'aide
interface HelpArticle {
  id: number
  title: string
  category: string
  content: string
  tags: string[]
  views: number
  helpful: number
  lastUpdated: string
}

// Types pour les tutoriels vidéo
interface VideoTutorial {
  id: number
  title: string
  description: string
  duration: string
  category: string
  thumbnail: string
  url: string
  views: number
}

// Types pour les FAQ
interface FAQItem {
  id: number
  question: string
  answer: string
  category: string
  helpful: number
}

// Données fictives pour les articles d'aide
const helpArticles: HelpArticle[] = [
  {
    id: 1,
    title: 'Comment ajouter une nouvelle propriété',
    category: 'Propriétés',
    content: 'Guide étape par étape pour ajouter une nouvelle propriété à votre portefeuille...',
    tags: ['propriété', 'ajout', 'gestion'],
    views: 1250,
    helpful: 89,
    lastUpdated: '2024-01-15'
  },
  {
    id: 2,
    title: 'Gérer vos prospects efficacement',
    category: 'Prospects',
    content: 'Apprenez à organiser et suivre vos prospects pour maximiser vos conversions...',
    tags: ['prospects', 'gestion', 'conversion'],
    views: 980,
    helpful: 76,
    lastUpdated: '2024-01-12'
  },
  {
    id: 3,
    title: 'Configurer vos notifications',
    category: 'Paramètres',
    content: 'Personnalisez vos notifications pour ne rien manquer d\'important...',
    tags: ['notifications', 'paramètres', 'configuration'],
    views: 654,
    helpful: 45,
    lastUpdated: '2024-01-10'
  },
  {
    id: 4,
    title: 'Analyser vos performances',
    category: 'Analytics',
    content: 'Utilisez les outils d\'analyse pour comprendre et améliorer vos performances...',
    tags: ['analytics', 'performance', 'rapports'],
    views: 432,
    helpful: 38,
    lastUpdated: '2024-01-08'
  }
]

// Données fictives pour les tutoriels vidéo
const videoTutorials: VideoTutorial[] = [
  {
    id: 1,
    title: 'Prise en main de la plateforme',
    description: 'Découvrez les fonctionnalités principales en 10 minutes',
    duration: '10:32',
    category: 'Démarrage',
    thumbnail: '/api/placeholder/320/180',
    url: '#',
    views: 2340
  },
  {
    id: 2,
    title: 'Créer votre première campagne marketing',
    description: 'Guide complet pour lancer votre première campagne',
    duration: '15:45',
    category: 'Marketing',
    thumbnail: '/api/placeholder/320/180',
    url: '#',
    views: 1890
  },
  {
    id: 3,
    title: 'Optimiser votre profil agent',
    description: 'Conseils pour un profil professionnel attractif',
    duration: '8:20',
    category: 'Profil',
    thumbnail: '/api/placeholder/320/180',
    url: '#',
    views: 1456
  },
  {
    id: 4,
    title: 'Utiliser les rapports avancés',
    description: 'Exploitez toute la puissance des analytics',
    duration: '12:15',
    category: 'Analytics',
    thumbnail: '/api/placeholder/320/180',
    url: '#',
    views: 987
  }
]

// Données fictives pour les FAQ
const faqItems: FAQItem[] = [
  {
    id: 1,
    question: 'Comment modifier les informations d\'une propriété ?',
    answer: 'Rendez-vous dans la section "Mes propriétés", cliquez sur la propriété à modifier, puis sur le bouton "Modifier". Vous pourrez alors mettre à jour toutes les informations.',
    category: 'Propriétés',
    helpful: 156
  },
  {
    id: 2,
    question: 'Pourquoi je ne reçois pas de notifications ?',
    answer: 'Vérifiez vos paramètres de notification dans la section "Paramètres > Notifications". Assurez-vous que les notifications sont activées pour les événements souhaités.',
    category: 'Notifications',
    helpful: 134
  },
  {
    id: 3,
    question: 'Comment exporter mes données ?',
    answer: 'Vous pouvez exporter vos données depuis la section "Paramètres > Gestion des données". Cliquez sur "Exporter mes données" pour télécharger un fichier JSON.',
    category: 'Données',
    helpful: 89
  },
  {
    id: 4,
    question: 'Comment contacter le support technique ?',
    answer: 'Vous pouvez nous contacter via le formulaire de contact ci-dessous, par email à support@loopnet.com, ou par téléphone au +33 1 23 45 67 89.',
    category: 'Support',
    helpful: 201
  },
  {
    id: 5,
    question: 'Comment modifier mon mot de passe ?',
    answer: 'Allez dans "Paramètres > Sécurité" et utilisez la section "Mot de passe" pour modifier votre mot de passe actuel.',
    category: 'Sécurité',
    helpful: 167
  },
  {
    id: 6,
    question: 'Puis-je personnaliser mon tableau de bord ?',
    answer: 'Oui, vous pouvez réorganiser les widgets de votre tableau de bord en les faisant glisser. Certains widgets peuvent également être configurés individuellement.',
    category: 'Interface',
    helpful: 98
  }
]

export default function AgentHelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false)
  const [contactForm, setContactForm] = useState({
    subject: '',
    category: 'general',
    message: '',
    priority: 'normal'
  })

  // Filtrer les articles selon la recherche et la catégorie
  const filteredArticles = helpArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Filtrer les FAQ selon la recherche
  const filteredFAQ = faqItems.filter(item => 
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleContactSubmit = () => {
    console.log('Formulaire de contact soumis:', contactForm)
    setIsContactDialogOpen(false)
    setContactForm({
      subject: '',
      category: 'general',
      message: '',
      priority: 'normal'
    })
    // Ici, vous ajouteriez la logique pour envoyer le formulaire
  }

  const categories = ['all', ...Array.from(new Set(helpArticles.map(article => article.category)))]

  return (
    <RoleGuard allowedRoles={['agent', 'admin']} message="Vous devez être un agent pour accéder à cette page.">
      <div className="container mx-auto py-8">
        <div className="flex flex-col space-y-8">
          {/* En-tête */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Centre d'aide</h1>
              <p className="text-gray-500 mt-1">
                Trouvez des réponses à vos questions et apprenez à utiliser la plateforme
              </p>
            </div>
            <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contacter le support
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Contacter le support</DialogTitle>
                  <DialogDescription>
                    Décrivez votre problème ou votre question, notre équipe vous répondra rapidement.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Sujet</Label>
                    <Input
                      id="subject"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                      placeholder="Résumez votre demande..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Catégorie</Label>
                      <Select
                        value={contactForm.category}
                        onValueChange={(value) => setContactForm({...contactForm, category: value})}
                      >
                        <SelectTrigger id="category" className="w-full" aria-label="Catégorie du support">
                          <SelectValue placeholder="Sélectionnez une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">Général</SelectItem>
                          <SelectItem value="technical">Technique</SelectItem>
                          <SelectItem value="billing">Facturation</SelectItem>
                          <SelectItem value="feature">Fonctionnalité</SelectItem>
                          <SelectItem value="bug">Bug</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priorité</Label>
                      <Select
                        value={contactForm.priority}
                        onValueChange={(value) => setContactForm({...contactForm, priority: value})}
                      >
                        <SelectTrigger id="priority" className="w-full" aria-label="Priorité du support">
                          <SelectValue placeholder="Sélectionnez une priorité" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Faible</SelectItem>
                          <SelectItem value="normal">Normale</SelectItem>
                          <SelectItem value="high">Élevée</SelectItem>
                          <SelectItem value="urgent">Urgente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      rows={4}
                      placeholder="Décrivez votre problème en détail..."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleContactSubmit} disabled={!contactForm.subject || !contactForm.message}>
                    <Send className="h-4 w-4 mr-2" />
                    Envoyer
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Barre de recherche */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher dans l'aide..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                  aria-label="Filtrer par catégorie"
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Toutes les catégories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    {categories.filter(cat => cat !== 'all').map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Liens rapides */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Zap className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Démarrage rapide</h3>
                    <p className="text-sm text-gray-500">Guide de prise en main</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Building className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Gestion propriétés</h3>
                    <p className="text-sm text-gray-500">Ajouter et gérer</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Gestion prospects</h3>
                    <p className="text-sm text-gray-500">Suivre et convertir</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Analytics</h3>
                    <p className="text-sm text-gray-500">Analyser performances</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Onglets pour les différentes sections */}
          <Tabs defaultValue="articles" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="articles">
                <Book className="h-4 w-4 mr-2" />
                Articles
              </TabsTrigger>
              <TabsTrigger value="videos">
                <Video className="h-4 w-4 mr-2" />
                Vidéos
              </TabsTrigger>
              <TabsTrigger value="faq">
                <HelpCircle className="h-4 w-4 mr-2" />
                FAQ
              </TabsTrigger>
              <TabsTrigger value="contact">
                <Phone className="h-4 w-4 mr-2" />
                Contact
              </TabsTrigger>
            </TabsList>

            {/* Articles d'aide */}
            <TabsContent value="articles" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article) => (
                  <Card key={article.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <Badge variant="outline">{article.category}</Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Star className="h-3 w-3" />
                          {article.helpful}
                        </div>
                      </div>
                      <CardTitle className="text-lg">{article.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4 line-clamp-3">{article.content}</p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {article.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(article.lastUpdated).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {article.views} vues
                        </div>
                      </div>
                      <Button className="w-full mt-4" variant="outline">
                        Lire l'article
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {filteredArticles.length === 0 && (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun article trouvé</h3>
                  <p className="text-gray-500">Essayez de modifier vos critères de recherche.</p>
                </div>
              )}
            </TabsContent>

            {/* Tutoriels vidéo */}
            <TabsContent value="videos" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videoTutorials.map((video) => (
                  <Card key={video.id} className="hover:shadow-md transition-shadow">
                    <div className="relative">
                      <div className="aspect-video bg-gray-200 rounded-t-lg flex items-center justify-center">
                        <Play className="h-12 w-12 text-gray-400" />
                      </div>
                      <Badge className="absolute top-2 right-2 bg-black/70 text-white">
                        {video.duration}
                      </Badge>
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <Badge variant="outline">{video.category}</Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Users className="h-3 w-3" />
                          {video.views}
                        </div>
                      </div>
                      <CardTitle className="text-lg">{video.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{video.description}</p>
                      <Button className="w-full">
                        <Play className="h-4 w-4 mr-2" />
                        Regarder
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* FAQ */}
            <TabsContent value="faq" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Questions fréquemment posées</CardTitle>
                  <CardDescription>
                    Trouvez rapidement des réponses aux questions les plus courantes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {filteredFAQ.map((item) => (
                      <AccordionItem key={item.id} value={`item-${item.id}`}>
                        <AccordionTrigger className="text-left">
                          <div className="flex items-start gap-2">
                            <HelpCircle className="h-4 w-4 mt-1 text-blue-500 flex-shrink-0" />
                            <span>{item.question}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pl-6">
                            <p className="text-gray-600 mb-3">{item.answer}</p>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline">{item.category}</Badge>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">
                                  {item.helpful} personnes ont trouvé cela utile
                                </span>
                                <div className="flex gap-1">
                                  <Button size="sm" variant="ghost">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  </Button>
                                  <Button size="sm" variant="ghost">
                                    <AlertCircle className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contact */}
            <TabsContent value="contact" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      Support téléphonique
                    </CardTitle>
                    <CardDescription>
                      Contactez notre équipe directement
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Phone className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium">+33 1 23 45 67 89</div>
                        <div className="text-sm text-gray-500">Lun-Ven 9h-18h</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Mail className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">support@loopnet.com</div>
                        <div className="text-sm text-gray-500">Réponse sous 24h</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <MessageCircle className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium">Chat en direct</div>
                        <div className="text-sm text-gray-500">Lun-Ven 9h-17h</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Ressources utiles
                    </CardTitle>
                    <CardDescription>
                      Liens et documents complémentaires
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="h-4 w-4 mr-2" />
                        Guide utilisateur complet
                        <Download className="h-4 w-4 ml-auto" />
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Video className="h-4 w-4 mr-2" />
                        Webinaires de formation
                        <ExternalLink className="h-4 w-4 ml-auto" />
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Lightbulb className="h-4 w-4 mr-2" />
                        Bonnes pratiques
                        <ExternalLink className="h-4 w-4 ml-auto" />
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Blog et actualités
                        <ExternalLink className="h-4 w-4 ml-auto" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Statut du service */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Statut du service
                  </CardTitle>
                  <CardDescription>
                    État actuel de nos services
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-medium">Plateforme principale</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        Opérationnel
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-medium">API et intégrations</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        Opérationnel
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-medium">Notifications</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        Opérationnel
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="font-medium">Rapports avancés</span>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        Maintenance
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-700">
                        <strong>Maintenance programmée:</strong> Les rapports avancés seront temporairement indisponibles le 25/01/2024 de 2h à 4h (UTC+1) pour maintenance.
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
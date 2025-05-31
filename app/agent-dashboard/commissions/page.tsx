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
import { 
  Download, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Building2, 
  Users, 
  Target,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import { RoleGuard } from '@/components/role-guard'

// Données fictives pour les commissions
const monthlyCommissions = [
  { month: 'Jan', earned: 12500, pending: 8000, target: 15000 },
  { month: 'Fév', earned: 15200, pending: 6500, target: 15000 },
  { month: 'Mar', earned: 18700, pending: 9200, target: 15000 },
  { month: 'Avr', earned: 14300, pending: 7800, target: 15000 },
  { month: 'Mai', earned: 16800, pending: 5400, target: 15000 },
  { month: 'Juin', earned: 21500, pending: 12000, target: 15000 },
  { month: 'Juil', earned: 19200, pending: 8900, target: 15000 },
  { month: 'Août', earned: 17600, pending: 6700, target: 15000 },
  { month: 'Sep', earned: 20100, pending: 11300, target: 15000 },
  { month: 'Oct', earned: 22800, pending: 9600, target: 15000 },
  { month: 'Nov', earned: 18900, pending: 7200, target: 15000 },
  { month: 'Déc', earned: 25300, pending: 14500, target: 15000 },
]

const commissionsByProperty = [
  { type: 'Appartements', amount: 45000, percentage: 40 },
  { type: 'Maisons', amount: 35000, percentage: 31 },
  { type: 'Bureaux', amount: 20000, percentage: 18 },
  { type: 'Commerces', amount: 12500, percentage: 11 },
]

const recentTransactions = [
  {
    id: 1,
    property: 'Appartement 3P - Paris 16ème',
    client: 'Marie Dubois',
    amount: 8500,
    commission: 2.5,
    status: 'paid',
    date: '2024-01-15',
    type: 'Vente'
  },
  {
    id: 2,
    property: 'Villa avec piscine - Cannes',
    client: 'Jean Martin',
    amount: 15000,
    commission: 3.0,
    status: 'pending',
    date: '2024-01-10',
    type: 'Vente'
  },
  {
    id: 3,
    property: 'Bureau 150m² - La Défense',
    client: 'SAS TechCorp',
    amount: 4200,
    commission: 2.0,
    status: 'paid',
    date: '2024-01-08',
    type: 'Location'
  },
  {
    id: 4,
    property: 'Loft moderne - Lyon',
    client: 'Pierre Leroy',
    amount: 6800,
    commission: 2.5,
    status: 'pending',
    date: '2024-01-05',
    type: 'Vente'
  },
  {
    id: 5,
    property: 'Commerce 80m² - Marseille',
    client: 'SARL Boutique Mode',
    amount: 3200,
    commission: 2.0,
    status: 'overdue',
    date: '2023-12-28',
    type: 'Location'
  },
]

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'paid':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="h-3 w-3 mr-1" />Payée</Badge>
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"><Clock className="h-3 w-3 mr-1" />En attente</Badge>
    case 'overdue':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100"><AlertCircle className="h-3 w-3 mr-1" />En retard</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function AgentCommissionsPage() {
  const [timeRange, setTimeRange] = useState('year')
  const [filterStatus, setFilterStatus] = useState('all')

  // Calculs des totaux
  const totalEarned = monthlyCommissions.reduce((sum, month) => sum + month.earned, 0)
  const totalPending = monthlyCommissions.reduce((sum, month) => sum + month.pending, 0)
  const totalTarget = monthlyCommissions.reduce((sum, month) => sum + month.target, 0)
  const achievementRate = ((totalEarned / totalTarget) * 100).toFixed(1)

  const filteredTransactions = recentTransactions.filter(transaction => {
    if (filterStatus === 'all') return true
    return transaction.status === filterStatus
  })

  return (
    <RoleGuard allowedRoles={['agent', 'admin']} message="Vous devez être un agent pour accéder à cette page.">
      <div className="w-full px-4 py-8">
        <div className="flex flex-col space-y-8">
          {/* En-tête */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Commissions</h1>
              <p className="text-gray-500 mt-1">
                Suivez vos revenus et commissions immobilières
              </p>
            </div>
            <div className="flex gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">7 derniers jours</SelectItem>
                  <SelectItem value="month">30 derniers jours</SelectItem>
                  <SelectItem value="quarter">3 derniers mois</SelectItem>
                  <SelectItem value="year">12 derniers mois</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>

          {/* Cartes de statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Commissions perçues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalEarned.toLocaleString('fr-FR')} €</div>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +15.2% depuis le mois dernier
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Commissions en attente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalPending.toLocaleString('fr-FR')} €</div>
                <p className="text-xs text-blue-500 flex items-center mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  {recentTransactions.filter(t => t.status === 'pending').length} transactions
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Objectif annuel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalTarget.toLocaleString('fr-FR')} €</div>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <Target className="h-3 w-3 mr-1" />
                  {achievementRate}% atteint
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Commission moyenne
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {(totalEarned / recentTransactions.length).toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €
                </div>
                <p className="text-xs text-gray-500 flex items-center mt-1">
                  <Building2 className="h-3 w-3 mr-1" />
                  Par transaction
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Onglets pour les différentes vues */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="overview">
                <BarChart className="h-4 w-4 mr-2" />
                Vue d'ensemble
              </TabsTrigger>
              <TabsTrigger value="transactions">
                <DollarSign className="h-4 w-4 mr-2" />
                Transactions
              </TabsTrigger>
              <TabsTrigger value="analysis">
                <TrendingUp className="h-4 w-4 mr-2" />
                Analyse
              </TabsTrigger>
            </TabsList>

            {/* Vue d'ensemble */}
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Évolution des commissions</CardTitle>
                  <CardDescription>
                    Commissions perçues vs objectifs sur les 12 derniers mois
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyCommissions}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value.toLocaleString('fr-FR')} €`, '']} />
                        <Legend />
                        <Bar dataKey="earned" fill="#3b82f6" name="Commissions perçues" />
                        <Bar dataKey="pending" fill="#f59e0b" name="Commissions en attente" />
                        <Line dataKey="target" stroke="#ef4444" name="Objectif" strokeWidth={2} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Répartition par type de propriété</CardTitle>
                    <CardDescription>
                      Commissions générées par catégorie de bien
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={commissionsByProperty}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percentage }) => `${name}: ${percentage}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="amount"
                          >
                            {commissionsByProperty.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value.toLocaleString('fr-FR')} €`, 'Commission']} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance mensuelle</CardTitle>
                    <CardDescription>
                      Taux d'atteinte des objectifs par mois
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyCommissions.map(month => ({
                          ...month,
                          achievement: (month.earned / month.target * 100).toFixed(1)
                        }))}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis unit="%" />
                          <Tooltip formatter={(value) => [`${value}%`, 'Taux d\'atteinte']} />
                          <Line type="monotone" dataKey="achievement" stroke="#10b981" strokeWidth={3} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Transactions */}
            <TabsContent value="transactions" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Transactions récentes</CardTitle>
                      <CardDescription>
                        Historique de vos commissions par transaction
                      </CardDescription>
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filtrer par statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="paid">Payées</SelectItem>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="overdue">En retard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{transaction.property}</h4>
                            {getStatusBadge(transaction.status)}
                          </div>
                          <div className="text-sm text-gray-500">
                            <p>Client: {transaction.client}</p>
                            <p>Date: {new Date(transaction.date).toLocaleDateString('fr-FR')}</p>
                            <p>Type: {transaction.type} • Commission: {transaction.commission}%</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            {transaction.amount.toLocaleString('fr-FR')} €
                          </div>
                          <div className="text-sm text-gray-500">
                            Commission
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analyse */}
            <TabsContent value="analysis" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Tendance trimestrielle</CardTitle>
                    <CardDescription>
                      Évolution des commissions par trimestre
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { quarter: 'Q1 2024', amount: 46400 },
                          { quarter: 'Q2 2024', amount: 52800 },
                          { quarter: 'Q3 2024', amount: 56900 },
                          { quarter: 'Q4 2024', amount: 67000 },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="quarter" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`${value.toLocaleString('fr-FR')} €`, 'Commission']} />
                          <Bar dataKey="amount" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Prévisions</CardTitle>
                    <CardDescription>
                      Projection des commissions pour les 3 prochains mois
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Janvier 2024</span>
                        <span className="text-lg font-bold">28 500 €</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Février 2024</span>
                        <span className="text-lg font-bold">31 200 €</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Mars 2024</span>
                        <span className="text-lg font-bold">29 800 €</span>
                      </div>
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Total prévu</span>
                          <span className="text-xl font-bold text-green-600">89 500 €</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recommandations</CardTitle>
                  <CardDescription>
                    Conseils pour optimiser vos commissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">Augmentez vos ventes d'appartements</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          Les appartements représentent 40% de vos commissions. Concentrez-vous sur ce segment pour maximiser vos revenus.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                      <Target className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-900">Objectif en bonne voie</h4>
                        <p className="text-sm text-green-700 mt-1">
                          Vous avez atteint {achievementRate}% de votre objectif annuel. Maintenez ce rythme pour le dépasser.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
                      <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-900">Suivez vos commissions en attente</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          Vous avez {totalPending.toLocaleString('fr-FR')} € de commissions en attente. Relancez vos clients pour accélérer les paiements.
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
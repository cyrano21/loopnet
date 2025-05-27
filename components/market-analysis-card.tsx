'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  TrendingUp,
  TrendingDown,
  Map,
  BarChart2,
  Activity,
  ArrowRight,
  LockIcon,
  BarChart
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePermissions } from '@/hooks/use-permissions'
import { PricingModal } from './pricing-modals'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

// Enregistrer les composants nécessaires pour le graphique
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface MarketAnalysisCardProps {
  propertyId: string
  propertyType: string
  location: {
    city: string
    state: string
    zip?: string
  }
}

export function MarketAnalysisCard ({
  propertyId,
  propertyType,
  location
}: MarketAnalysisCardProps) {
  const { can, requiresUpgrade } = usePermissions()
  const [activeTab, setActiveTab] = useState('trends')
  const [showPricingModal, setShowPricingModal] = useState(false)

  // Données mockées pour l'analyse de marché
  const marketData = {
    trends: {
      currentPricePerSqFt: 325,
      marketAvgPricePerSqFt: 310,
      pricePerSqFtTrend: 5.2, // pourcentage de hausse sur les 12 derniers mois
      vacancyRate: 4.2,
      vacancyTrend: -0.8, // baisse de 0.8%
      avgDaysOnMarket: 42,
      daysOnMarketTrend: -12 // baisse de 12 jours
    },
    comparable: [
      {
        address: '123 Business Ave',
        price: 2450000,
        size: 7500,
        daysOnMarket: 45
      },
      {
        address: '567 Commerce St',
        price: 1985000,
        size: 6200,
        daysOnMarket: 32
      },
      {
        address: '890 Market Blvd',
        price: 2730000,
        size: 8400,
        daysOnMarket: 60
      },
      {
        address: '234 Industry Way',
        price: 2100000,
        size: 6800,
        daysOnMarket: 28
      }
    ],
    forecast: {
      oneYear: 7.2, // pourcentage d'augmentation prévue dans 1 an
      threeYears: 15.8, // pourcentage d'augmentation prévue dans 3 ans
      fiveYears: 23.4, // pourcentage d'augmentation prévue dans 5 ans
      factors: [
        'Développement économique local',
        'Nouvelles infrastructures',
        'Hausse de la demande dans le secteur'
      ]
    }
  }

  // Configuration pour le graphique de prévision
  const forecastChartData = {
    labels: ['Actuel', '1 an', '3 ans', '5 ans'],
    datasets: [
      {
        label: 'Valeur estimée au m²',
        data: [
          marketData.trends.currentPricePerSqFt,
          marketData.trends.currentPricePerSqFt *
            (1 + marketData.forecast.oneYear / 100),
          marketData.trends.currentPricePerSqFt *
            (1 + marketData.forecast.threeYears / 100),
          marketData.trends.currentPricePerSqFt *
            (1 + marketData.forecast.fiveYears / 100)
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      }
    ]
  }

  // Configuration du graphique
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.formattedValue} €/m²`
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: function (value: any) {
            return `${value} €/m²`
          }
        }
      }
    }
  }

  // Si l'utilisateur n'a pas les permissions
  if (!can('canViewMarketAnalytics')) {
    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <BarChart className='h-5 w-5 text-blue-600' />
                Analyse de marché
              </div>
              <Badge variant='outline'>Premium requis</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col items-center justify-center py-8 text-center'>
              <LockIcon className='h-12 w-12 text-gray-400 mb-4' />
              <h3 className='text-lg font-semibold mb-2'>
                Analyse de marché avancée
              </h3>
              <p className='text-gray-600 mb-4 max-w-md'>
                Accédez aux tendances du marché, aux comparables et aux
                prévisions pour prendre des décisions d'investissement
                éclairées.
              </p>
              <Button onClick={() => setShowPricingModal(true)}>
                Passer au premium
                <ArrowRight className='ml-2 h-4 w-4' />
              </Button>
            </div>
          </CardContent>
        </Card>

        <PricingModal
          isOpen={showPricingModal}
          onClose={() => setShowPricingModal(false)}
          userType='premium'
        />
      </>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <BarChart className='h-5 w-5 text-blue-600' />
          Analyse de marché - {location.city}, {location.state}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className='grid grid-cols-3 mb-8'>
            <TabsTrigger value='trends'>
              <Activity className='h-4 w-4 mr-1' />
              Tendances
            </TabsTrigger>
            <TabsTrigger value='comparable'>
              <Map className='h-4 w-4 mr-1' />
              Comparables
            </TabsTrigger>
            <TabsTrigger value='forecast'>
              <BarChart2 className='h-4 w-4 mr-1' />
              Prévisions
            </TabsTrigger>
          </TabsList>

          <TabsContent value='trends'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
              <div className='bg-gray-50 p-4 rounded-lg'>
                <div className='text-sm text-gray-500 mb-1'>Prix au m²</div>
                <div className='text-2xl font-bold'>
                  {marketData.trends.currentPricePerSqFt} €/m²
                </div>
                <div
                  className={`text-sm mt-1 flex items-center ${
                    marketData.trends.pricePerSqFtTrend > 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {marketData.trends.pricePerSqFtTrend > 0 ? (
                    <TrendingUp className='h-3 w-3 mr-1' />
                  ) : (
                    <TrendingDown className='h-3 w-3 mr-1' />
                  )}
                  {Math.abs(marketData.trends.pricePerSqFtTrend)}% en 12 mois
                </div>
              </div>

              <div className='bg-gray-50 p-4 rounded-lg'>
                <div className='text-sm text-gray-500 mb-1'>
                  Taux d'inoccupation
                </div>
                <div className='text-2xl font-bold'>
                  {marketData.trends.vacancyRate}%
                </div>
                <div
                  className={`text-sm mt-1 flex items-center ${
                    marketData.trends.vacancyTrend < 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {marketData.trends.vacancyTrend < 0 ? (
                    <TrendingDown className='h-3 w-3 mr-1' />
                  ) : (
                    <TrendingUp className='h-3 w-3 mr-1' />
                  )}
                  {Math.abs(marketData.trends.vacancyTrend)}% en 12 mois
                </div>
              </div>

              <div className='bg-gray-50 p-4 rounded-lg'>
                <div className='text-sm text-gray-500 mb-1'>
                  Jours sur le marché
                </div>
                <div className='text-2xl font-bold'>
                  {marketData.trends.avgDaysOnMarket} jours
                </div>
                <div
                  className={`text-sm mt-1 flex items-center ${
                    marketData.trends.daysOnMarketTrend < 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {marketData.trends.daysOnMarketTrend < 0 ? (
                    <TrendingDown className='h-3 w-3 mr-1' />
                  ) : (
                    <TrendingUp className='h-3 w-3 mr-1' />
                  )}
                  {Math.abs(marketData.trends.daysOnMarketTrend)} jours en 12
                  mois
                </div>
              </div>
            </div>

            <div className='bg-gray-50 p-4 rounded-lg'>
              <div className='text-sm font-semibold mb-2'>
                Comparaison avec la moyenne du marché
              </div>
              <div className='flex items-center gap-8'>
                <div>
                  <div className='text-sm text-gray-500'>Cette propriété</div>
                  <div className='font-bold'>
                    {marketData.trends.currentPricePerSqFt} €/m²
                  </div>
                </div>
                <div>
                  <div className='text-sm text-gray-500'>
                    Moyenne {location.city}
                  </div>
                  <div className='font-bold'>
                    {marketData.trends.marketAvgPricePerSqFt} €/m²
                  </div>
                </div>
                <div>
                  <div className='text-sm text-gray-500'>Différence</div>
                  <div
                    className={`font-bold ${
                      marketData.trends.currentPricePerSqFt >
                      marketData.trends.marketAvgPricePerSqFt
                        ? 'text-red-600'
                        : 'text-green-600'
                    }`}
                  >
                    {Math.round(
                      (marketData.trends.currentPricePerSqFt /
                        marketData.trends.marketAvgPricePerSqFt -
                        1) *
                        100
                    )}
                    %
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value='comparable'>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead>
                  <tr>
                    <th className='py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Adresse
                    </th>
                    <th className='py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Prix
                    </th>
                    <th className='py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Surface
                    </th>
                    <th className='py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Prix/m²
                    </th>
                    <th className='py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Jours sur le marché
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {marketData.comparable.map((property, index) => (
                    <tr key={index}>
                      <td className='py-4 whitespace-nowrap'>
                        {property.address}
                      </td>
                      <td className='py-4 whitespace-nowrap'>
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          minimumFractionDigits: 0
                        }).format(property.price)}
                      </td>
                      <td className='py-4 whitespace-nowrap'>
                        {property.size.toLocaleString()} m²
                      </td>
                      <td className='py-4 whitespace-nowrap'>
                        {Math.round(property.price / property.size)} €/m²
                      </td>
                      <td className='py-4 whitespace-nowrap'>
                        {property.daysOnMarket} jours
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value='forecast'>
            <div className='mb-6 h-64'>
              <Bar data={forecastChartData} options={chartOptions} />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
              <div className='bg-gray-50 p-4 rounded-lg'>
                <div className='text-sm text-gray-500 mb-1'>À 1 an</div>
                <div className='text-2xl font-bold text-green-600'>
                  +{marketData.forecast.oneYear}%
                </div>
              </div>
              <div className='bg-gray-50 p-4 rounded-lg'>
                <div className='text-sm text-gray-500 mb-1'>À 3 ans</div>
                <div className='text-2xl font-bold text-green-600'>
                  +{marketData.forecast.threeYears}%
                </div>
              </div>
              <div className='bg-gray-50 p-4 rounded-lg'>
                <div className='text-sm text-gray-500 mb-1'>À 5 ans</div>
                <div className='text-2xl font-bold text-green-600'>
                  +{marketData.forecast.fiveYears}%
                </div>
              </div>
            </div>

            <div className='bg-gray-50 p-4 rounded-lg'>
              <div className='text-sm font-semibold mb-2'>
                Facteurs influençant la prévision
              </div>
              <ul className='list-disc pl-5 space-y-1'>
                {marketData.forecast.factors.map((factor, index) => (
                  <li key={index} className='text-sm'>
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertTriangle,
  Info,
  LockIcon
} from 'lucide-react'
import { usePriceHistory } from '@/hooks/use-price-history'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData
} from 'chart.js'

// Enregistrer les composants nécessaires pour le graphique
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface PriceHistoryCardProps {
  propertyId: string
}

export function PriceHistoryCard ({ propertyId }: PriceHistoryCardProps) {
  const { priceHistory, loading, error, canViewHistory } =
    usePriceHistory(propertyId)
  const [timeframe, setTimeframe] = useState<'6m' | '1y' | '2y' | 'all'>('1y')

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'short'
    }).format(date)
  }

  if (!canViewHistory) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <span>Historique des Prix</span>
            <Badge variant='outline' className='ml-2'>
              Premium
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className='text-center p-8'>
          <div className='flex flex-col items-center gap-4'>
            <LockIcon className='h-12 w-12 text-gray-300' />
            <div>
              <h3 className='text-lg font-semibold'>Fonctionnalité Premium</h3>
              <p className='text-gray-500 mt-1'>
                Accédez à l'historique complet des prix avec un abonnement
                Premium
              </p>
            </div>
            <Button variant='default'>Passer à Premium</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historique des Prix</CardTitle>
        </CardHeader>
        <CardContent className='h-80 flex items-center justify-center'>
          <div className='text-center'>
            <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent'></div>
            <p className='mt-2 text-sm text-gray-500'>
              Chargement des données...
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !priceHistory) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historique des Prix</CardTitle>
        </CardHeader>
        <CardContent className='text-center'>
          <AlertTriangle className='mx-auto h-12 w-12 text-amber-500 mb-2' />
          <p>Impossible de charger l'historique des prix</p>
          <p className='text-sm text-gray-500 mt-1'>{error}</p>
        </CardContent>
      </Card>
    )
  }

  // Filtrer les données selon la période sélectionnée
  const filterByTimeframe = () => {
    const history = priceHistory.history
    const now = new Date()

    switch (timeframe) {
      case '6m':
        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(now.getMonth() - 6)
        return history.filter(entry => new Date(entry.date) >= sixMonthsAgo)
      case '1y':
        const oneYearAgo = new Date()
        oneYearAgo.setFullYear(now.getFullYear() - 1)
        return history.filter(entry => new Date(entry.date) >= oneYearAgo)
      case '2y':
        const twoYearsAgo = new Date()
        twoYearsAgo.setFullYear(now.getFullYear() - 2)
        return history.filter(entry => new Date(entry.date) >= twoYearsAgo)
      default:
        return history
    }
  }

  const filteredHistory = filterByTimeframe()

  // Données pour le graphique
  const chartData: ChartData<'line'> = {
    labels: filteredHistory.map(entry => formatDate(entry.date)),
    datasets: [
      {
        label: 'Prix',
        data: filteredHistory.map(entry => entry.price),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `Prix: ${formatPrice(context.parsed.y)}`
          }
        }
      }
    }
  }

  // Calculer la tendance
  const lastEntry = filteredHistory[filteredHistory.length - 1]
  const firstEntry = filteredHistory[0]
  const priceChange = lastEntry.price - firstEntry.price
  const percentChange = (lastEntry.price / firstEntry.price - 1) * 100
  const isPositive = priceChange > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          <span>Historique des Prix</span>
          <div className='flex gap-2'>
            <Button
              variant={timeframe === '6m' ? 'default' : 'outline'}
              onClick={() => setTimeframe('6m')}
              size='sm'
            >
              6 mois
            </Button>
            <Button
              variant={timeframe === '1y' ? 'default' : 'outline'}
              onClick={() => setTimeframe('1y')}
              size='sm'
            >
              1 an
            </Button>
            <Button
              variant={timeframe === '2y' ? 'default' : 'outline'}
              onClick={() => setTimeframe('2y')}
              size='sm'
            >
              2 ans
            </Button>
            <Button
              variant={timeframe === 'all' ? 'default' : 'outline'}
              onClick={() => setTimeframe('all')}
              size='sm'
            >
              Tout
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
          <div className='bg-gray-50 p-4 rounded-lg'>
            <div className='text-gray-500 text-sm mb-1'>
              Premier prix enregistré
            </div>
            <div className='text-lg font-semibold'>
              {formatPrice(firstEntry.price)}
            </div>
            <div className='text-xs text-gray-500'>
              {formatDate(firstEntry.date)}
            </div>
          </div>

          <div className='bg-gray-50 p-4 rounded-lg'>
            <div className='text-gray-500 text-sm mb-1'>Prix actuel</div>
            <div className='text-lg font-semibold'>
              {formatPrice(lastEntry.price)}
            </div>
            <div className='text-xs text-gray-500'>
              {formatDate(lastEntry.date)}
            </div>
          </div>

          <div className='bg-gray-50 p-4 rounded-lg'>
            <div className='text-gray-500 text-sm mb-1'>Évolution</div>
            <div
              className={`text-lg font-semibold flex items-center ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {isPositive ? (
                <TrendingUp className='h-4 w-4 mr-1' />
              ) : (
                <TrendingDown className='h-4 w-4 mr-1' />
              )}
              {formatPrice(Math.abs(priceChange))} ({percentChange.toFixed(1)}%)
            </div>
            <div className='text-xs text-gray-500'>
              Variation sur la période
            </div>
          </div>
        </div>

        <div className='h-64 mb-6'>
          <Line data={chartData} options={chartOptions} />
        </div>

        <div className='border-t pt-4'>
          <h4 className='font-semibold mb-3'>Événements marquants</h4>
          <div className='space-y-2'>
            {filteredHistory
              .filter(entry => entry.event)
              .map((entry, index) => (
                <div key={index} className='flex items-start gap-2'>
                  <Calendar className='h-4 w-4 text-blue-600 mt-0.5' />
                  <div>
                    <div className='text-sm font-medium'>{entry.event}</div>
                    <div className='flex items-center text-sm text-gray-500'>
                      <span>{formatDate(entry.date)}</span>
                      <span className='mx-2'>•</span>
                      <span>{formatPrice(entry.price)}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

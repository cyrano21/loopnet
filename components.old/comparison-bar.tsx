'use client'

import {
  X,
  Scale,
  Eye,
  ChevronDown,
  Download,
  Grid,
  List,
  BarChart3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import Image from 'next/image'
import { usePermissions } from '@/hooks/use-permissions'
import { Property } from '@/types/property'
import { getBestImageUrl } from '@/lib/image-utils'

interface ComparisonBarProps {
  properties: Property[]
  onRemove: (id: string) => void
  onCompare: () => void
  onClear: () => void
  onCompareMode?: (
    mode: 'side-by-side' | 'table' | 'detailed' | 'chart'
  ) => void
  onExport?: (format: 'pdf' | 'excel' | 'csv') => void
}

export function ComparisonBar ({
  properties,
  onRemove,
  onCompare,
  onClear,
  onCompareMode,
  onExport
}: ComparisonBarProps) {
  const { limit, can } = usePermissions()

  if (properties.length === 0) return null

  const maxComparisons = (limit('maxComparisons') as number) || 4
  const hasComparisonAccess = can('maxComparisons')
  const canCompare =
    hasComparisonAccess &&
    properties.length >= 2 &&
    properties.length <= maxComparisons

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className='fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50 p-4'>
      <div className='container mx-auto'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <Scale className='h-5 w-5 text-blue-600' />
              <span className='font-semibold'>Comparaison</span>
              <Badge
                variant={
                  properties.length >= maxComparisons
                    ? 'destructive'
                    : 'secondary'
                }
                className={
                  properties.length >= maxComparisons ? 'bg-orange-500' : ''
                }
              >
                {properties.length}/{maxComparisons}
              </Badge>
              {properties.length >= maxComparisons && (
                <span className='text-xs text-orange-600 font-medium'>
                  Limite atteinte
                </span>
              )}
              {!hasComparisonAccess && (
                <span className='text-xs text-amber-600 font-medium'>
                  Mise à niveau requise
                </span>
              )}
            </div>

            <div className='flex gap-2 max-w-md overflow-x-auto'>
              {properties.map(property => (
                <div key={property._id} className='relative flex-shrink-0'>
                  <div className='w-16 h-16 rounded-lg overflow-hidden border-2 border-blue-200'>
                    <Image
                      src={getBestImageUrl(
                        property.images,
                        property.propertyType
                      )}
                      alt={property.title}
                      width={64}
                      height={64}
                      className='object-cover w-full h-full'
                    />
                  </div>
                  <button
                    onClick={() => onRemove(property._id)}
                    className='absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600'
                    aria-label={`Retirer ${property.title} de la comparaison`}
                  >
                    <X className='h-3 w-3' />
                  </button>
                  <div className='text-xs text-center mt-1 max-w-16 truncate'>
                    {formatPrice(property.price)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={onClear}
              disabled={properties.length === 0}
            >
              Effacer
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  disabled={!canCompare}
                  className='px-2'
                >
                  <ChevronDown className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-48'>
                <DropdownMenuItem
                  onClick={() => onCompareMode?.('side-by-side')}
                >
                  <Grid className='h-4 w-4 mr-2' />
                  Vue côte à côte
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onCompareMode?.('table')}>
                  <List className='h-4 w-4 mr-2' />
                  Vue tableau
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onCompareMode?.('detailed')}>
                  <Eye className='h-4 w-4 mr-2' />
                  Vue détaillée
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onCompareMode?.('chart')}>
                  <BarChart3 className='h-4 w-4 mr-2' />
                  Vue graphique
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onExport?.('pdf')}>
                  <Download className='h-4 w-4 mr-2' />
                  Exporter PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExport?.('excel')}>
                  <Download className='h-4 w-4 mr-2' />
                  Exporter Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExport?.('csv')}>
                  <Download className='h-4 w-4 mr-2' />
                  Exporter CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              onClick={onCompare}
              disabled={!canCompare}
              className='bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed'
              title={
                !hasComparisonAccess
                  ? 'Outil de comparaison non disponible - Mise à niveau requise'
                  : properties.length < 2
                  ? 'Sélectionnez au moins 2 propriétés pour comparer'
                  : properties.length > maxComparisons
                  ? `Maximum ${maxComparisons} propriétés autorisées`
                  : `Comparer ${properties.length} propriétés`
              }
            >
              <Eye className='h-4 w-4 mr-2' />
              {!hasComparisonAccess
                ? 'Mise à niveau'
                : `Comparer (${properties.length})`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

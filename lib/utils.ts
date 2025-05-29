import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, transactionType?: string): string {
  if (typeof price !== 'number' || isNaN(price)) {
    return 'Prix non disponible'
  }

  const formattedPrice = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)

  if (transactionType === 'rent') {
    return `${formattedPrice}/mois`
  }
  
  return formattedPrice
}

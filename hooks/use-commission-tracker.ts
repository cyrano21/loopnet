"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"

export interface Commission {
  id: string
  propertyId: string
  propertyTitle: string
  clientName: string
  dealType: "sale" | "lease"
  salePrice?: number
  leaseAmount?: number
  leaseTerm?: number
  commissionRate: number
  commissionAmount: number
  status: "negotiating" | "pending" | "completed" | "cancelled"
  closingDate: string | null
  paidDate: string | null
  agentSplit: number
  brokerageSplit: number
  agentAmount: number
  brokerageAmount: number
  notes: string
  createdAt?: string
  updatedAt?: string
}

export interface CommissionStats {
  totalCommissions: number
  paidCommissions: number
  pendingCommissions: number
  averageCommission: number
  totalDeals: number
  completedDeals: number
  thisMonthCommissions: number
}

export interface CreateCommissionData {
  propertyId?: string
  propertyTitle: string
  clientName: string
  dealType: "sale" | "lease"
  salePrice?: number
  leaseAmount?: number
  leaseTerm?: number
  commissionRate: number
  agentSplit?: number
  notes?: string
}

export function useCommissionTracker() {
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [stats, setStats] = useState<CommissionStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCommissions = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/commission-tracker')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du chargement des commissions')
      }

      setCommissions(data.commissions || [])
      setStats(data.stats || null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      console.error('Erreur commission tracker:', err)
    } finally {
      setLoading(false)
    }
  }

  const createCommission = async (commissionData: CreateCommissionData) => {
    try {
      const response = await fetch('/api/commission-tracker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commissionData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création de la commission')
      }

      // Ajouter la nouvelle commission à la liste locale
      setCommissions(prev => [data.commission, ...prev])
      
      // Recalculer les stats
      await fetchCommissions()
      
      toast.success('Commission créée avec succès!')
      return data.commission
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la création'
      toast.error(message)
      throw err
    }
  }

  const updateCommission = async (commissionId: string, updateData: Partial<Commission>) => {
    try {
      const response = await fetch('/api/commission-tracker', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: commissionId, ...updateData }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la mise à jour de la commission')
      }

      // Mettre à jour la commission dans la liste locale
      setCommissions(prev => 
        prev.map(commission => 
          commission.id === commissionId ? { ...commission, ...data.commission } : commission
        )
      )
      
      // Recalculer les stats
      await fetchCommissions()
      
      toast.success('Commission mise à jour!')
      return data.commission
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la mise à jour'
      toast.error(message)
      throw err
    }
  }

  const deleteCommission = async (commissionId: string) => {
    try {
      // Dans une vraie application, vous feriez un appel DELETE à l'API
      setCommissions(prev => prev.filter(commission => commission.id !== commissionId))
      
      // Recalculer les stats
      await fetchCommissions()
      
      toast.success('Commission supprimée!')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la suppression'
      toast.error(message)
      throw err
    }
  }

  const markAsPaid = async (commissionId: string) => {
    return updateCommission(commissionId, {
      status: 'completed',
      paidDate: new Date().toISOString()
    })
  }

  const markAsPending = async (commissionId: string, closingDate: string) => {
    return updateCommission(commissionId, {
      status: 'pending',
      closingDate
    })
  }

  // Calculer les commissions par mois pour les graphiques
  const getMonthlyCommissions = () => {
    const monthlyData: { [key: string]: number } = {}
    
    commissions
      .filter(c => c.status === 'completed' && c.paidDate)
      .forEach(commission => {
        const month = new Date(commission.paidDate!).toISOString().slice(0, 7) // YYYY-MM
        monthlyData[month] = (monthlyData[month] || 0) + commission.commissionAmount
      })

    return monthlyData
  }

  // Calculer la performance par type de transaction
  const getCommissionByType = () => {
    const saleCommissions = commissions
      .filter(c => c.dealType === 'sale')
      .reduce((sum, c) => sum + c.commissionAmount, 0)
    
    const leaseCommissions = commissions
      .filter(c => c.dealType === 'lease')
      .reduce((sum, c) => sum + c.commissionAmount, 0)

    return {
      sale: saleCommissions,
      lease: leaseCommissions
    }
  }

  useEffect(() => {
    fetchCommissions()
  }, [])

  return {
    commissions,
    stats,
    loading,
    error,
    fetchCommissions,
    createCommission,
    updateCommission,
    deleteCommission,
    markAsPaid,
    markAsPending,
    getMonthlyCommissions,
    getCommissionByType,
  }
}

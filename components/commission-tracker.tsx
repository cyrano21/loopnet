'use client'

import { useState } from 'react'
import {
  DollarSign,
  Plus,
  TrendingUp,
  Calendar,
  Check,
  Clock,
  AlertCircle,
  Edit,
  Trash2,
  Eye,
  Filter
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import {
  useCommissionTracker,
  type Commission,
  type CreateCommissionData
} from '@/hooks/use-commission-tracker'
import { toast } from 'sonner'

export function CommissionTracker () {
  const {
    commissions,
    stats,
    loading,
    error,
    createCommission,
    updateCommission,
    deleteCommission,
    markAsPaid,
    markAsPending
  } = useCommissionTracker()

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedCommission, setSelectedCommission] =
    useState<Commission | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  // Filtrage des commissions
  const filteredCommissions = commissions.filter(commission => {
    const matchesSearch =
      commission.propertyTitle
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      commission.clientName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' || commission.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleCreateCommission = async (data: CreateCommissionData) => {
    try {
      await createCommission(data)
      setShowCreateModal(false)
    } catch (error) {
      // L'erreur est déjà gérée dans le hook
    }
  }

  const handleUpdateCommission = async (
    commissionId: string,
    data: Partial<Commission>
  ) => {
    try {
      await updateCommission(commissionId, data)
      setShowEditModal(false)
      setSelectedCommission(null)
    } catch (error) {
      // L'erreur est déjà gérée dans le hook
    }
  }

  const handleDeleteCommission = async (commissionId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette commission ?')) {
      try {
        await deleteCommission(commissionId)
      } catch (error) {
        // L'erreur est déjà gérée dans le hook
      }
    }
  }

  const handleMarkAsPaid = async (commissionId: string) => {
    try {
      await markAsPaid(commissionId)
    } catch (error) {
      // L'erreur est déjà gérée dans le hook
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'negotiating':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className='w-4 h-4' />
      case 'pending':
        return <Clock className='w-4 h-4' />
      case 'negotiating':
        return <AlertCircle className='w-4 h-4' />
      case 'cancelled':
        return <Trash2 className='w-4 h-4' />
      default:
        return <AlertCircle className='w-4 h-4' />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className='p-6'>
          <div className='flex items-center justify-center py-8'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className='p-6'>
          <div className='text-center py-8'>
            <p className='text-red-600 mb-4'>Erreur : {error}</p>
            <Button onClick={() => window.location.reload()}>Réessayer</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Statistiques */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Total Commissions
                </p>
                <p className='text-2xl font-bold'>
                  {stats ? formatCurrency(stats.totalCommissions) : '$0'}
                </p>
                <p className='text-xs text-gray-500'>
                  {stats?.totalDeals || 0} transactions
                </p>
              </div>
              <DollarSign className='h-8 w-8 text-green-600' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Commissions Payées
                </p>
                <p className='text-2xl font-bold text-green-600'>
                  {stats ? formatCurrency(stats.paidCommissions) : '$0'}
                </p>
                <p className='text-xs text-gray-500'>
                  {stats?.completedDeals || 0} complétées
                </p>
              </div>
              <Check className='h-8 w-8 text-green-600' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>En Attente</p>
                <p className='text-2xl font-bold text-yellow-600'>
                  {stats ? formatCurrency(stats.pendingCommissions) : '$0'}
                </p>
                <p className='text-xs text-gray-500'>À recevoir</p>
              </div>
              <Clock className='h-8 w-8 text-yellow-600' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Moyenne</p>
                <p className='text-2xl font-bold text-blue-600'>
                  {stats ? formatCurrency(stats.averageCommission) : '$0'}
                </p>
                <p className='text-xs text-gray-500'>Par transaction</p>
              </div>
              <TrendingUp className='h-8 w-8 text-blue-600' />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Objectif mensuel */}
      {stats && (
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold'>Objectif Mensuel</h3>
              <Badge variant='outline'>
                {formatCurrency(stats.thisMonthCommissions)} ce mois
              </Badge>
            </div>
            <div className='space-y-2'>
              <div className='flex justify-between text-sm'>
                <span>Progression</span>
                <span>
                  {stats.thisMonthCommissions > 0
                    ? Math.round((stats.thisMonthCommissions / 50000) * 100)
                    : 0}
                  %
                </span>
              </div>
              <Progress
                value={
                  stats.thisMonthCommissions > 0
                    ? (stats.thisMonthCommissions / 50000) * 100
                    : 0
                }
                className='h-2'
              />
              <p className='text-xs text-gray-500'>
                Objectif: {formatCurrency(50000)} par mois
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gestion des commissions */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-2'>
              <DollarSign className='w-5 h-5' />
              Suivi des Commissions
            </CardTitle>
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className='w-4 h-4 mr-2' />
                  Nouvelle Commission
                </Button>
              </DialogTrigger>
              <DialogContent className='max-w-2xl'>
                <DialogHeader>
                  <DialogTitle>Créer une nouvelle commission</DialogTitle>
                </DialogHeader>
                <CreateCommissionForm onSubmit={handleCreateCommission} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col sm:flex-row gap-4 mb-6'>
            <div className='relative flex-1'>
              <Input
                placeholder='Rechercher par propriété ou client...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className='w-full sm:w-48'>
                <SelectValue placeholder='Statut' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Tous les statuts</SelectItem>
                <SelectItem value='negotiating'>En négociation</SelectItem>
                <SelectItem value='pending'>En attente</SelectItem>
                <SelectItem value='completed'>Complétée</SelectItem>
                <SelectItem value='cancelled'>Annulée</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table des commissions */}
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Propriété / Client</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCommissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className='text-center py-8'>
                      <DollarSign className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                      <p className='text-gray-600'>Aucune commission trouvée</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCommissions.map(commission => (
                    <TableRow key={commission.id}>
                      <TableCell>
                        <div>
                          <div className='font-medium text-sm'>
                            {commission.propertyTitle}
                          </div>
                          <div className='text-sm text-gray-500'>
                            {commission.clientName}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant='outline'>
                          {commission.dealType === 'sale'
                            ? 'Vente'
                            : 'Location'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {commission.dealType === 'sale'
                          ? formatCurrency(commission.salePrice || 0)
                          : `${formatCurrency(
                              commission.leaseAmount || 0
                            )}/mois`}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className='font-medium'>
                            {formatCurrency(commission.commissionAmount)}
                          </div>
                          <div className='text-xs text-gray-500'>
                            Agent: {formatCurrency(commission.agentAmount)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(commission.status)}>
                          <div className='flex items-center gap-1'>
                            {getStatusIcon(commission.status)}
                            {commission.status}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          {commission.status === 'pending' && (
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => handleMarkAsPaid(commission.id)}
                              title='Marquer comme payée'
                            >
                              <Check className='w-4 h-4' />
                            </Button>
                          )}
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => {
                              setSelectedCommission(commission)
                              setShowEditModal(true)
                            }}
                          >
                            <Edit className='w-4 h-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() =>
                              handleDeleteCommission(commission.id)
                            }
                          >
                            <Trash2 className='w-4 h-4' />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal d'édition */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Modifier la commission</DialogTitle>
          </DialogHeader>
          {selectedCommission && (
            <EditCommissionForm
              commission={selectedCommission}
              onSubmit={data =>
                handleUpdateCommission(selectedCommission.id, data)
              }
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Composant pour créer une nouvelle commission
function CreateCommissionForm ({
  onSubmit
}: {
  onSubmit: (data: CreateCommissionData) => void
}) {
  const [formData, setFormData] = useState<CreateCommissionData>({
    propertyTitle: '',
    clientName: '',
    dealType: 'sale',
    commissionRate: 2.5,
    agentSplit: 70,
    notes: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.propertyTitle || !formData.clientName) {
      toast.error('Propriété et client sont requis')
      return
    }
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <Label htmlFor='propertyTitle'>Propriété *</Label>
          <Input
            id='propertyTitle'
            value={formData.propertyTitle}
            onChange={e =>
              setFormData(prev => ({ ...prev, propertyTitle: e.target.value }))
            }
            required
          />
        </div>
        <div>
          <Label htmlFor='clientName'>Client *</Label>
          <Input
            id='clientName'
            value={formData.clientName}
            onChange={e =>
              setFormData(prev => ({ ...prev, clientName: e.target.value }))
            }
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor='dealType'>Type de transaction</Label>
        <Select
          value={formData.dealType}
          onValueChange={value =>
            setFormData(prev => ({
              ...prev,
              dealType: value as 'sale' | 'lease'
            }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='sale'>Vente</SelectItem>
            <SelectItem value='lease'>Location</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.dealType === 'sale' ? (
        <div>
          <Label htmlFor='salePrice'>Prix de vente</Label>
          <Input
            id='salePrice'
            type='number'
            value={formData.salePrice || ''}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                salePrice: Number(e.target.value)
              }))
            }
          />
        </div>
      ) : (
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <Label htmlFor='leaseAmount'>Loyer mensuel</Label>
            <Input
              id='leaseAmount'
              type='number'
              value={formData.leaseAmount || ''}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  leaseAmount: Number(e.target.value)
                }))
              }
            />
          </div>
          <div>
            <Label htmlFor='leaseTerm'>Durée (mois)</Label>
            <Input
              id='leaseTerm'
              type='number'
              value={formData.leaseTerm || ''}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  leaseTerm: Number(e.target.value)
                }))
              }
            />
          </div>
        </div>
      )}

      <div className='grid grid-cols-2 gap-4'>
        <div>
          <Label htmlFor='commissionRate'>Taux commission (%)</Label>
          <Input
            id='commissionRate'
            type='number'
            step='0.1'
            value={formData.commissionRate}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                commissionRate: Number(e.target.value)
              }))
            }
          />
        </div>
        <div>
          <Label htmlFor='agentSplit'>Part agent (%)</Label>
          <Input
            id='agentSplit'
            type='number'
            value={formData.agentSplit}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                agentSplit: Number(e.target.value)
              }))
            }
          />
        </div>
      </div>

      <div>
        <Label htmlFor='notes'>Notes</Label>
        <Textarea
          id='notes'
          value={formData.notes}
          onChange={e =>
            setFormData(prev => ({ ...prev, notes: e.target.value }))
          }
          rows={3}
        />
      </div>

      <div className='flex justify-end gap-2'>
        <Button type='submit'>Créer</Button>
      </div>
    </form>
  )
}

// Composant pour éditer une commission existante
function EditCommissionForm ({
  commission,
  onSubmit
}: {
  commission: Commission
  onSubmit: (data: Partial<Commission>) => void
}) {
  const [formData, setFormData] = useState({
    propertyTitle: commission.propertyTitle,
    clientName: commission.clientName,
    status: commission.status,
    notes: commission.notes,
    closingDate: commission.closingDate || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <Label htmlFor='edit-propertyTitle'>Propriété</Label>
          <Input
            id='edit-propertyTitle'
            value={formData.propertyTitle}
            onChange={e =>
              setFormData(prev => ({ ...prev, propertyTitle: e.target.value }))
            }
          />
        </div>
        <div>
          <Label htmlFor='edit-clientName'>Client</Label>
          <Input
            id='edit-clientName'
            value={formData.clientName}
            onChange={e =>
              setFormData(prev => ({ ...prev, clientName: e.target.value }))
            }
          />
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div>
          <Label htmlFor='edit-status'>Statut</Label>
          <Select
            value={formData.status}
            onValueChange={value =>
              setFormData(prev => ({ ...prev, status: value as any }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='negotiating'>En négociation</SelectItem>
              <SelectItem value='pending'>En attente</SelectItem>
              <SelectItem value='completed'>Complétée</SelectItem>
              <SelectItem value='cancelled'>Annulée</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor='edit-closingDate'>Date de clôture</Label>
          <Input
            id='edit-closingDate'
            type='date'
            value={formData.closingDate.split('T')[0] || ''}
            onChange={e =>
              setFormData(prev => ({ ...prev, closingDate: e.target.value }))
            }
          />
        </div>
      </div>

      <div>
        <Label htmlFor='edit-notes'>Notes</Label>
        <Textarea
          id='edit-notes'
          value={formData.notes}
          onChange={e =>
            setFormData(prev => ({ ...prev, notes: e.target.value }))
          }
          rows={3}
        />
      </div>

      <div className='flex justify-end gap-2'>
        <Button type='submit'>Sauvegarder</Button>
      </div>
    </form>
  )
}

'use client'

import { useState } from 'react'
import {
  Users,
  Plus,
  Search,
  Filter,
  Phone,
  Mail,
  Building2,
  Calendar,
  TrendingUp,
  UserCheck,
  UserX,
  Eye,
  Edit,
  Trash2
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
import { useCRM, type Contact, type CreateContactData } from '@/hooks/use-crm'
import { toast } from 'sonner'

export function CRMDashboard () {
  const {
    contacts,
    loading,
    error,
    createContact,
    updateContact,
    deleteContact,
    getContactStats
  } = useCRM()

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  const stats = getContactStats()

  // Filtrage des contacts
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' || contact.status === statusFilter
    const matchesType = typeFilter === 'all' || contact.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const handleCreateContact = async (data: CreateContactData) => {
    try {
      await createContact(data)
      setShowCreateModal(false)
    } catch (error) {
      // L'erreur est déjà gérée dans le hook
    }
  }

  const handleUpdateContact = async (
    contactId: string,
    data: Partial<Contact>
  ) => {
    try {
      await updateContact(contactId, data)
      setShowEditModal(false)
      setSelectedContact(null)
    } catch (error) {
      // L'erreur est déjà gérée dans le hook
    }
  }

  const handleDeleteContact = async (contactId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) {
      try {
        await deleteContact(contactId)
      } catch (error) {
        // L'erreur est déjà gérée dans le hook
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot':
        return 'bg-red-100 text-red-800'
      case 'warm':
        return 'bg-orange-100 text-orange-800'
      case 'cold':
        return 'bg-blue-100 text-blue-800'
      case 'new':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'buyer':
        return <TrendingUp className='w-4 h-4' />
      case 'seller':
        return <Building2 className='w-4 h-4' />
      case 'tenant':
        return <UserCheck className='w-4 h-4' />
      case 'prospect':
        return <UserX className='w-4 h-4' />
      default:
        return <Users className='w-4 h-4' />
    }
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
                  Total Contacts
                </p>
                <p className='text-2xl font-bold'>{stats.total}</p>
              </div>
              <Users className='h-8 w-8 text-blue-600' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Contacts Chauds
                </p>
                <p className='text-2xl font-bold text-red-600'>
                  {stats.byStatus.hot}
                </p>
              </div>
              <TrendingUp className='h-8 w-8 text-red-600' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Acheteurs</p>
                <p className='text-2xl font-bold text-green-600'>
                  {stats.byType.buyers}
                </p>
              </div>
              <UserCheck className='h-8 w-8 text-green-600' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Vendeurs</p>
                <p className='text-2xl font-bold text-purple-600'>
                  {stats.byType.sellers}
                </p>
              </div>
              <Building2 className='h-8 w-8 text-purple-600' />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contrôles et filtres */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-2'>
              <Users className='w-5 h-5' />
              Gestion des Contacts
            </CardTitle>
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className='w-4 h-4 mr-2' />
                  Nouveau Contact
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Créer un nouveau contact</DialogTitle>
                </DialogHeader>
                <CreateContactForm onSubmit={handleCreateContact} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col sm:flex-row gap-4 mb-6'>
            {' '}
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
              <Input
                placeholder='Rechercher par nom, email ou entreprise...'
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                className='pl-10'
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className='w-full sm:w-40'>
                <SelectValue placeholder='Statut' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Tous les statuts</SelectItem>
                <SelectItem value='hot'>Chaud</SelectItem>
                <SelectItem value='warm'>Tiède</SelectItem>
                <SelectItem value='cold'>Froid</SelectItem>
                <SelectItem value='new'>Nouveau</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className='w-full sm:w-40'>
                <SelectValue placeholder='Type' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Tous les types</SelectItem>
                <SelectItem value='buyer'>Acheteur</SelectItem>
                <SelectItem value='seller'>Vendeur</SelectItem>
                <SelectItem value='tenant'>Locataire</SelectItem>
                <SelectItem value='prospect'>Prospect</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table des contacts */}
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contact</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Dernière interaction</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className='text-center py-8'>
                      <Users className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                      <p className='text-gray-600'>Aucun contact trouvé</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredContacts.map(contact => (
                    <TableRow key={contact.id}>
                      <TableCell>
                        <div>
                          <div className='font-medium'>{contact.name}</div>
                          <div className='text-sm text-gray-500'>
                            {contact.email}
                          </div>
                          {contact.company && (
                            <div className='text-sm text-gray-500'>
                              {contact.company}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          {getTypeIcon(contact.type)}
                          <span className='capitalize'>{contact.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(contact.status)}>
                          {contact.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(contact.lastContact).toLocaleDateString(
                          'fr-FR'
                        )}
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          {contact.phone && (
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() =>
                                window.open(`tel:${contact.phone}`)
                              }
                            >
                              <Phone className='w-4 h-4' />
                            </Button>
                          )}
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() =>
                              window.open(`mailto:${contact.email}`)
                            }
                          >
                            <Mail className='w-4 h-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => {
                              setSelectedContact(contact)
                              setShowEditModal(true)
                            }}
                          >
                            <Edit className='w-4 h-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleDeleteContact(contact.id)}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le contact</DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <EditContactForm
              contact={selectedContact}
              onSubmit={data => handleUpdateContact(selectedContact.id, data)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Composant pour créer un nouveau contact
function CreateContactForm ({
  onSubmit
}: {
  onSubmit: (data: CreateContactData) => void
}) {
  const [formData, setFormData] = useState<CreateContactData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    type: 'prospect',
    notes: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email) {
      toast.error('Nom et email sont requis')
      return
    }
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <Label htmlFor='name'>Nom *</Label>{' '}
        <Input
          id='name'
          value={formData.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData(prev => ({ ...prev, name: e.target.value }))
          }
          required
        />
      </div>
      <div>
        <Label htmlFor='email'>Email *</Label>{' '}
        <Input
          id='email'
          type='email'
          value={formData.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData(prev => ({ ...prev, email: e.target.value }))
          }
          required
        />
      </div>
      <div>
        {' '}
        <Label htmlFor='phone'>Téléphone</Label>
        <Input
          id='phone'
          value={formData.phone}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData(prev => ({ ...prev, phone: e.target.value }))
          }
        />
      </div>
      <div>
        {' '}
        <Label htmlFor='company'>Entreprise</Label>
        <Input
          id='company'
          value={formData.company}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData(prev => ({ ...prev, company: e.target.value }))
          }
        />
      </div>
      <div>
        <Label htmlFor='type'>Type</Label>
        <Select
          value={formData.type}
          onValueChange={value =>
            setFormData(prev => ({ ...prev, type: value }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='prospect'>Prospect</SelectItem>
            <SelectItem value='buyer'>Acheteur</SelectItem>
            <SelectItem value='seller'>Vendeur</SelectItem>
            <SelectItem value='tenant'>Locataire</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        {' '}
        <Label htmlFor='notes'>Notes</Label>
        <Textarea
          id='notes'
          value={formData.notes}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
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

// Composant pour éditer un contact existant
function EditContactForm ({
  contact,
  onSubmit
}: {
  contact: Contact
  onSubmit: (data: Partial<Contact>) => void
}) {
  const [formData, setFormData] = useState({
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
    company: contact.company,
    type: contact.type,
    status: contact.status,
    notes: contact.notes
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        {' '}
        <Label htmlFor='edit-name'>Nom *</Label>
        <Input
          id='edit-name'
          value={formData.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData(prev => ({ ...prev, name: e.target.value }))
          }
          required
        />
      </div>
      <div>
        <Label htmlFor='edit-email'>Email *</Label>
        <Input
          id='edit-email'
          type='email'
          value={formData.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData(prev => ({ ...prev, email: e.target.value }))
          }
          required
        />
      </div>
      <div>
        <Label htmlFor='edit-phone'>Téléphone</Label>
        <Input
          id='edit-phone'
          value={formData.phone}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData(prev => ({ ...prev, phone: e.target.value }))
          }
        />
      </div>
      <div>
        <Label htmlFor='edit-company'>Entreprise</Label>
        <Input
          id='edit-company'
          value={formData.company}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData(prev => ({ ...prev, company: e.target.value }))
          }
        />
      </div>
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <Label htmlFor='edit-type'>Type</Label>
          <Select
            value={formData.type}
            onValueChange={value =>
              setFormData(prev => ({ ...prev, type: value as any }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='prospect'>Prospect</SelectItem>
              <SelectItem value='buyer'>Acheteur</SelectItem>
              <SelectItem value='seller'>Vendeur</SelectItem>
              <SelectItem value='tenant'>Locataire</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
              <SelectItem value='new'>Nouveau</SelectItem>
              <SelectItem value='hot'>Chaud</SelectItem>
              <SelectItem value='warm'>Tiède</SelectItem>
              <SelectItem value='cold'>Froid</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor='edit-notes'>Notes</Label>
        <Textarea
          id='edit-notes'
          value={formData.notes}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
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

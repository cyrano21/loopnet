"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"

export interface Contact {
  id: string
  name: string
  email: string
  phone: string
  company: string
  type: "buyer" | "seller" | "tenant" | "prospect"
  status: "hot" | "warm" | "cold" | "new"
  source: "website" | "referral" | "cold_call" | "manual"
  interestedProperties: string[]
  notes: string
  createdAt: string
  lastContact: string
  nextFollowUp: string | null
}

export interface CreateContactData {
  name: string
  email: string
  phone?: string
  company?: string
  type?: string
  notes?: string
}

export function useCRM() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContacts = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/crm/contacts')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du chargement des contacts')
      }

      setContacts(data.contacts || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      console.error('Erreur CRM:', err)
    } finally {
      setLoading(false)
    }
  }

  const createContact = async (contactData: CreateContactData) => {
    try {
      const response = await fetch('/api/crm/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création du contact')
      }

      // Ajouter le nouveau contact à la liste locale
      setContacts(prev => [data.contact, ...prev])
      toast.success('Contact créé avec succès!')
      
      return data.contact
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la création'
      toast.error(message)
      throw err
    }
  }

  const updateContact = async (contactId: string, updateData: Partial<Contact>) => {
    try {
      const response = await fetch('/api/crm/contacts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: contactId, ...updateData }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la mise à jour du contact')
      }

      // Mettre à jour le contact dans la liste locale
      setContacts(prev => 
        prev.map(contact => 
          contact.id === contactId ? { ...contact, ...data.contact } : contact
        )
      )
      
      toast.success('Contact mis à jour!')
      return data.contact
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la mise à jour'
      toast.error(message)
      throw err
    }
  }

  const deleteContact = async (contactId: string) => {
    try {
      // Dans une vraie application, vous feriez un appel DELETE à l'API
      setContacts(prev => prev.filter(contact => contact.id !== contactId))
      toast.success('Contact supprimé!')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la suppression'
      toast.error(message)
      throw err
    }
  }

  // Statistiques rapides
  const getContactStats = () => {
    const total = contacts.length
    const hot = contacts.filter(c => c.status === 'hot').length
    const warm = contacts.filter(c => c.status === 'warm').length
    const cold = contacts.filter(c => c.status === 'cold').length
    const newContacts = contacts.filter(c => c.status === 'new').length

    const byType = {
      buyers: contacts.filter(c => c.type === 'buyer').length,
      sellers: contacts.filter(c => c.type === 'seller').length,
      tenants: contacts.filter(c => c.type === 'tenant').length,
      prospects: contacts.filter(c => c.type === 'prospect').length,
    }

    return {
      total,
      byStatus: { hot, warm, cold, new: newContacts },
      byType
    }
  }

  useEffect(() => {
    fetchContacts()
  }, [])

  return {
    contacts,
    loading,
    error,
    fetchContacts,
    createContact,
    updateContact,
    deleteContact,
    getContactStats,
  }
}

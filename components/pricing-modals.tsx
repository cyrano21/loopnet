'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Check,
  Star,
  Crown,
  Building2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import { toast } from 'sonner'

interface PricingModalProps {
  isOpen: boolean
  onClose: () => void
  userType: 'simple' | 'premium' | 'agent'
}

export function PricingModal ({ isOpen, onClose, userType }: PricingModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleUpgrade = async (planId: string) => {
    try {
      setIsLoading(true)

      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          userId: 'user_123', // À remplacer par l'ID utilisateur réel
          userEmail: 'user@example.com' // À remplacer par l'email utilisateur réel
        })
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 503) {
          toast.error('Les paiements ne sont pas encore configurés.')
          return
        }
        throw new Error(data.error || 'Erreur lors de la création du checkout')
      }

      // Rediriger vers Stripe Checkout
      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
      )
      if (stripe && data.sessionId) {
        await stripe.redirectToCheckout({ sessionId: data.sessionId })
      } else if (data.url) {
        // Fallback: redirection directe
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Erreur upgrade:', error)
      toast.error("Erreur lors de l'upgrade. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  const plans = {
    simple: {
      title: 'Compte Utilisateur',
      subtitle: 'Parfait pour rechercher et découvrir des propriétés',
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      plans: [
        {
          name: 'Gratuit',
          price: 0,
          period: 'Toujours gratuit',
          planId: null,
          features: [
            '10 propriétés par session',
            'Détails de base',
            'Pas de favoris',
            'Pas de comparaison',
            'Support par email'
          ],
          limitations: ['Accès limité', 'Pas de sauvegarde', "Pas d'historique"]
        },
        {
          name: 'Premium Simple',
          price: 19,
          period: '/mois',
          planId: 'simple_premium',
          popular: true,
          trial: '7 jours gratuits',
          features: [
            '50 propriétés/mois',
            'Détails complets',
            '2 annonces max',
            'Support prioritaire',
            'Historique des recherches'
          ]
        }
      ]
    },
    premium: {
      title: 'Compte Premium',
      subtitle: 'Pour les investisseurs sérieux',
      icon: Star,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      plans: [
        {
          name: 'Pro Investor',
          price: 49,
          period: '/mois',
          planId: 'premium_investor',
          popular: true,
          trial: '7 jours gratuits',
          features: [
            'Propriétés illimitées',
            'Favoris illimités',
            'Comparaison (4 max)',
            '10 annonces',
            'Analytics avancées',
            'Historique des prix',
            'Support dédié'
          ]
        }
      ]
    },
    agent: {
      title: 'Compte Agent Immobilier',
      subtitle: 'Outils professionnels pour agents',
      icon: Crown,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      plans: [
        {
          name: 'Agent Starter',
          price: 99,
          period: '/mois',
          planId: 'agent_starter',
          trial: '7 jours gratuits',
          features: [
            'Accès complet',
            'Infos vendeur',
            'Contact direct',
            'CRM intégré',
            'Annonces illimitées',
            'Commission tracker'
          ]
        },
        {
          name: 'Agent Pro',
          price: 199,
          period: '/mois',
          planId: 'agent_pro',
          popular: true,
          trial: '7 jours gratuits',
          features: [
            'Tout Agent Starter',
            'Marketing automation',
            'AI descriptions',
            'Team management',
            'Analytics avancées',
            'White-label',
            'API access'
          ]
        }
      ]
    }
  }

  // Option pour afficher tous les plans ou seulement la catégorie sélectionnée
  const [showAllPlans, setShowAllPlans] = useState(false)
  const [activeTab, setActiveTab] = useState(userType)

  // Utiliser soit les plans de la catégorie active, soit tous les plans
  // S'assurer que la clé existe dans plans, sinon utiliser 'simple' par défaut
  const planKey = showAllPlans ? activeTab : userType
  const currentPlans = plans[planKey] || plans['simple']

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-5xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <div className='flex items-center gap-3 mb-2'>
            <div className={`p-2 rounded-lg ${currentPlans.bgColor}`}>
              <currentPlans.icon className={`h-6 w-6 ${currentPlans.color}`} />
            </div>
            <div>
              <DialogTitle className='text-2xl font-bold'>
                {currentPlans.title}
              </DialogTitle>
              <p className='text-gray-600'>{currentPlans.subtitle}</p>
            </div>
          </div>

          {/* Onglets pour naviguer entre les différentes catégories de plans */}
          <div className='flex items-center justify-center mt-4 gap-2 border-b pb-2'>
            <Button
              variant={activeTab === 'simple' ? 'default' : 'ghost'}
              className='rounded-full'
              onClick={() => setActiveTab('simple')}
            >
              <Building2 className='h-4 w-4 mr-1' />
              Utilisateur
            </Button>
            <Button
              variant={activeTab === 'premium' ? 'default' : 'ghost'}
              className='rounded-full'
              onClick={() => setActiveTab('premium')}
            >
              <Star className='h-4 w-4 mr-1' />
              Premium
            </Button>
            <Button
              variant={activeTab === 'agent' ? 'default' : 'ghost'}
              className='rounded-full'
              onClick={() => setActiveTab('agent')}
            >
              <Crown className='h-4 w-4 mr-1' />
              Agent
            </Button>
          </div>
        </DialogHeader>

        <div className='flex flex-wrap justify-center gap-6'>
          {(plans[activeTab] || plans['simple']).plans.map((plan, index) => (
            <div
              key={index}
              className={`relative border rounded-lg p-6 w-full max-w-sm ${
                plan.popular ? 'ring-2 ring-purple-600 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <Badge className='absolute -top-2 left-1/2 transform -translate-x-1/2 bg-purple-600'>
                  Plus Populaire
                </Badge>
              )}

              <div className='text-center mb-6'>
                <h3 className='text-xl font-bold mb-2'>{plan.name}</h3>
                <div className='text-3xl font-bold'>
                  ${plan.price}
                  <span className='text-lg font-normal text-gray-600'>
                    {plan.period}
                  </span>
                </div>
                {plan.trial && (
                  <p className='text-sm text-green-600 mt-1'>{plan.trial}</p>
                )}
              </div>

              <ul className='space-y-3 mb-6'>
                {plan.features.map((feature: string, idx: number) => (
                  <li key={idx} className='flex items-start gap-2'>
                    <Check className='h-4 w-4 text-green-600 mt-0.5 flex-shrink-0' />
                    <span className='text-sm'>{feature}</span>
                  </li>
                ))}
              </ul>

              {(plan as any).limitations && (
                <div className='mb-6'>
                  <h4 className='font-semibold text-gray-600 mb-2 text-sm'>
                    Limitations
                  </h4>
                  <ul className='space-y-2'>
                    {(plan as any).limitations.map(
                      (limitation: string, idx: number) => (
                        <li
                          key={idx}
                          className='flex items-start gap-2 text-sm text-gray-600'
                        >
                          <span className='text-gray-400'>•</span>
                          <span>{limitation}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

              <Button
                className='w-full'
                variant={plan.popular ? 'default' : 'outline'}
                onClick={() => plan.planId && handleUpgrade(plan.planId)}
                disabled={isLoading || !plan.planId}
              >
                {isLoading
                  ? 'Chargement...'
                  : plan.price === 0
                  ? 'Plan Actuel'
                  : 'Choisir ce Plan'}
              </Button>
            </div>
          ))}
        </div>

        {/* Pagination des catégories de plan pour mobile */}
        <div className='flex justify-center items-center gap-4 pt-6 md:hidden'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setActiveTab('simple')}
            className={activeTab === 'simple' ? 'bg-blue-100' : ''}
          >
            Utilisateur
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setActiveTab('premium')}
            className={activeTab === 'premium' ? 'bg-blue-100' : ''}
          >
            Premium
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setActiveTab('agent')}
            className={activeTab === 'agent' ? 'bg-blue-100' : ''}
          >
            Agent
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

'use client'

import { useState } from 'react'
import {
  Building2,
  CheckCircle,
  ArrowRight,
  Users,
  Home,
  Plane,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

export default function OnboardingPage () {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Étape 1: Profil
    agentType: '',
    experience: '',
    specialization: [] as string[],
    company: '',
    license: '',

    // Étape 2: Objectifs
    monthlyGoal: '',
    clientTypes: [] as string[],
    marketAreas: [] as string[],

    // Étape 3: Préférences
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    autoResponder: false,
    leadScoring: true,

    // Étape 4: Plan
    selectedPlan: 'professional'
  })

  const totalSteps = 5
  const progress = (currentStep / totalSteps) * 100

  const agentTypes = [
    { value: 'residential', label: 'Agent Résidentiel', icon: Home },
    { value: 'commercial', label: 'Agent Commercial', icon: Building2 },
    { value: 'vacation', label: 'Location Vacances', icon: Plane },
    { value: 'mixed', label: 'Mixte', icon: Users }
  ]

  const specializations = [
    'Vente',
    'Location',
    'Gestion locative',
    'Investissement',
    'Immobilier de luxe',
    "Immobilier d'entreprise",
    'Terrains',
    'Viager'
  ]

  const clientTypes = [
    'Particuliers',
    'Investisseurs',
    'Entreprises',
    'Promoteurs',
    'Bailleurs sociaux',
    "Fonds d'investissement"
  ]

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 29,
      features: ['5 propriétés', 'Support email', 'Analytics de base'],
      recommended: false
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 99,
      features: [
        '50 propriétés',
        'IA intégrée',
        'Support prioritaire',
        'Analytics avancées'
      ],
      recommended: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 299,
      features: [
        'Propriétés illimitées',
        'API complète',
        'Support dédié',
        'White-label'
      ],
      recommended: false
    }
  ]

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      // Finaliser l'onboarding
      completeOnboarding()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const completeOnboarding = async () => {
    try {
      // Sauvegarder les données d'onboarding
      const response = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        // Rediriger vers le dashboard
        router.push('/agent-dashboard?welcome=true')
      }
    } catch (error) {
      console.error("Erreur lors de l'onboarding:", error)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Parlez-nous de vous</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div>
                <Label>Quel type d'agent êtes-vous ?</Label>
                <div className='grid grid-cols-2 gap-4 mt-2'>
                  {agentTypes.map(type => {
                    const IconComponent = type.icon
                    return (
                      <Card
                        key={type.value}
                        className={`cursor-pointer transition-colors ${
                          formData.agentType === type.value
                            ? 'border-blue-500 bg-blue-50'
                            : ''
                        }`}
                        onClick={() =>
                          setFormData({ ...formData, agentType: type.value })
                        }
                      >
                        <CardContent className='p-4 text-center'>
                          <IconComponent className='h-8 w-8 mx-auto mb-2 text-blue-600' />
                          <p className='font-medium'>{type.label}</p>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label>Expérience</Label>
                  <Select
                    value={formData.experience}
                    onValueChange={value =>
                      setFormData({ ...formData, experience: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Sélectionner...' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='junior'>Moins de 2 ans</SelectItem>
                      <SelectItem value='intermediate'>2-5 ans</SelectItem>
                      <SelectItem value='senior'>5-10 ans</SelectItem>
                      <SelectItem value='expert'>Plus de 10 ans</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Numéro de carte professionnelle</Label>
                  <Input
                    value={formData.license}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, license: e.target.value })
                    }
                    placeholder='CPI 1234567890'
                  />
                </div>
              </div>

              <div>
                <Label>Agence / Société</Label>
                <Input
                  value={formData.company}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  placeholder='Nom de votre agence'
                />
              </div>

              <div>
                <Label>
                  Spécialisations (sélectionnez toutes celles qui s'appliquent)
                </Label>
                <div className='grid grid-cols-2 gap-2 mt-2'>
                  {specializations.map(spec => (
                    <div key={spec} className='flex items-center space-x-2'>
                      <Checkbox
                        checked={formData.specialization.includes(spec)}
                        onCheckedChange={(checked: boolean) => {
                          if (checked) {
                            setFormData({
                              ...formData,
                              specialization: [...formData.specialization, spec]
                            })
                          } else {
                            setFormData({
                              ...formData,
                              specialization: formData.specialization.filter(
                                s => s !== spec
                              )
                            })
                          }
                        }}
                      />
                      <Label className='text-sm'>{spec}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Définissez vos objectifs</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div>
                <Label>Objectif de commission mensuel (€)</Label>
                <Input
                  type='number'
                  value={formData.monthlyGoal}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, monthlyGoal: e.target.value })
                  }
                  placeholder='15000'
                />
              </div>

              <div>
                <Label>Types de clients cibles</Label>
                <div className='grid grid-cols-2 gap-2 mt-2'>
                  {clientTypes.map(type => (
                    <div key={type} className='flex items-center space-x-2'>
                      <Checkbox
                        checked={formData.clientTypes.includes(type)}
                        onCheckedChange={(checked: boolean) => {
                          if (checked) {
                            setFormData({
                              ...formData,
                              clientTypes: [...formData.clientTypes, type]
                            })
                          } else {
                            setFormData({
                              ...formData,
                              clientTypes: formData.clientTypes.filter(
                                t => t !== type
                              )
                            })
                          }
                        }}
                      />
                      <Label className='text-sm'>{type}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Zones géographiques d'intervention</Label>
                <Input
                  value={formData.marketAreas.join(', ')}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({
                      ...formData,
                      marketAreas: e.target.value
                        .split(', ')
                        .filter(area => area.trim() !== '')
                    })
                  }
                  placeholder='Paris, Lyon, Marseille...'
                />
                <p className='text-sm text-gray-600 mt-1'>
                  Séparez les villes par des virgules
                </p>
              </div>
            </CardContent>
          </Card>
        )

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Configurez vos préférences</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div>
                <Label className='text-base font-semibold'>Notifications</Label>
                <div className='space-y-3 mt-3'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <Label>Notifications email</Label>
                      <p className='text-sm text-gray-600'>
                        Recevez les alertes par email
                      </p>
                    </div>
                    <Checkbox
                      checked={formData.notifications.email}
                      onCheckedChange={(checked: boolean) =>
                        setFormData({
                          ...formData,
                          notifications: {
                            ...formData.notifications,
                            email: checked
                          }
                        })
                      }
                    />
                  </div>
                  <div className='flex items-center justify-between'>
                    <div>
                      <Label>Notifications SMS</Label>
                      <p className='text-sm text-gray-600'>
                        Alertes urgentes par SMS
                      </p>
                    </div>
                    <Checkbox
                      checked={formData.notifications.sms}
                      onCheckedChange={(checked: boolean) =>
                        setFormData({
                          ...formData,
                          notifications: {
                            ...formData.notifications,
                            sms: checked
                          }
                        })
                      }
                    />
                  </div>
                  <div className='flex items-center justify-between'>
                    <div>
                      <Label>Notifications push</Label>
                      <p className='text-sm text-gray-600'>
                        Notifications dans l'application
                      </p>
                    </div>
                    <Checkbox
                      checked={formData.notifications.push}
                      onCheckedChange={(checked: boolean) =>
                        setFormData({
                          ...formData,
                          notifications: {
                            ...formData.notifications,
                            push: checked
                          }
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label className='text-base font-semibold'>
                  Automatisation
                </Label>
                <div className='space-y-3 mt-3'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <Label>Répondeur automatique</Label>
                      <p className='text-sm text-gray-600'>
                        Réponses automatiques aux nouvelles demandes
                      </p>
                    </div>
                    <Checkbox
                      checked={formData.autoResponder}
                      onCheckedChange={(checked: boolean) =>
                        setFormData({ ...formData, autoResponder: checked })
                      }
                    />
                  </div>
                  <div className='flex items-center justify-between'>
                    <div>
                      <Label>Scoring automatique des leads</Label>
                      <p className='text-sm text-gray-600'>
                        IA pour qualifier automatiquement les prospects
                      </p>
                    </div>
                    <Checkbox
                      checked={formData.leadScoring}
                      onCheckedChange={(checked: boolean) =>
                        setFormData({ ...formData, leadScoring: checked })
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Choisissez votre plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                {plans.map(plan => (
                  <Card
                    key={plan.id}
                    className={`cursor-pointer transition-colors relative ${
                      formData.selectedPlan === plan.id
                        ? 'border-blue-500 bg-blue-50'
                        : ''
                    }`}
                    onClick={() =>
                      setFormData({ ...formData, selectedPlan: plan.id })
                    }
                  >
                    {plan.recommended && (
                      <Badge className='absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-600'>
                        Recommandé
                      </Badge>
                    )}
                    <CardContent className='p-6 text-center'>
                      <h3 className='text-xl font-bold mb-2'>{plan.name}</h3>
                      <div className='text-3xl font-bold text-blue-600 mb-4'>
                        {plan.price}€
                        <span className='text-sm text-gray-600'>/mois</span>
                      </div>
                      <ul className='space-y-2 text-sm'>
                        {plan.features.map((feature, index) => (
                          <li key={index} className='flex items-center gap-2'>
                            <CheckCircle className='h-4 w-4 text-green-600' />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className='mt-6 p-4 bg-green-50 rounded-lg'>
                <div className='flex items-center gap-2 text-green-800'>
                  <Zap className='h-5 w-5' />
                  <span className='font-semibold'>
                    Essai gratuit de 14 jours
                  </span>
                </div>
                <p className='text-green-700 text-sm mt-1'>
                  Aucune carte de crédit requise. Annulation possible à tout
                  moment.
                </p>
              </div>
            </CardContent>
          </Card>
        )

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Félicitations ! Vous êtes prêt à commencer</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='text-center'>
                <CheckCircle className='h-16 w-16 text-green-600 mx-auto mb-4' />
                <h3 className='text-xl font-semibold mb-2'>
                  Configuration terminée !
                </h3>
                <p className='text-gray-600'>
                  Votre compte agent est maintenant configuré et prêt à
                  l'emploi.
                </p>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <Card className='border-blue-200 bg-blue-50'>
                  <CardContent className='p-4'>
                    <Target className='h-8 w-8 text-blue-600 mb-2' />
                    <h4 className='font-semibold'>Prochaines étapes</h4>
                    <ul className='text-sm text-gray-700 mt-2 space-y-1'>
                      <li>• Ajouter vos premières propriétés</li>
                      <li>• Configurer votre profil public</li>
                      <li>• Importer vos contacts existants</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className='border-green-200 bg-green-50'>
                  <CardContent className='p-4'>
                    <TrendingUp className='h-8 w-8 text-green-600 mb-2' />
                    <h4 className='font-semibold'>Objectifs configurés</h4>
                    <ul className='text-sm text-gray-700 mt-2 space-y-1'>
                      <li>• Objectif mensuel: {formData.monthlyGoal}€</li>
                      <li>
                        • Spécialisations: {formData.specialization.length}
                      </li>
                      <li>
                        • Plan:{' '}
                        {plans.find(p => p.id === formData.selectedPlan)?.name}
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className='text-center'>
                <p className='text-sm text-gray-600 mb-4'>
                  Besoin d'aide ? Notre équipe support est disponible 24/7
                </p>
                <div className='flex gap-4 justify-center'>
                  <Button variant='outline'>Voir la documentation</Button>
                  <Button variant='outline'>Contacter le support</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white border-b'>
        <div className='container mx-auto px-4'>
          <div className='flex items-center justify-between h-16'>
            <Link href='/' className='flex items-center space-x-2'>
              <Building2 className='h-8 w-8 text-blue-600' />
              <span className='text-2xl font-bold text-blue-600'>LoopNet</span>
            </Link>
            <div className='text-sm text-gray-600'>
              Étape {currentStep} sur {totalSteps}
            </div>
          </div>
        </div>
      </header>

      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-2xl mx-auto'>
          {/* Progress Bar */}
          <div className='mb-8'>
            <div className='flex justify-between text-sm text-gray-600 mb-2'>
              <span>Configuration de votre compte</span>
              <span>{Math.round(progress)}% terminé</span>
            </div>
            <Progress value={progress} className='h-2' />
          </div>

          {/* Step Content */}
          {renderStep()}

          {/* Navigation */}
          <div className='flex justify-between mt-8'>
            <Button
              variant='outline'
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              Précédent
            </Button>
            <Button onClick={handleNext}>
              {currentStep === totalSteps ? 'Terminer' : 'Suivant'}
              <ArrowRight className='h-4 w-4 ml-2' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

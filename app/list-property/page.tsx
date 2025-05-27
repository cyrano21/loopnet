'use client'

import { useState } from 'react'
import {
  Building2,
  ArrowRight,
  ArrowLeft,
  Check,
  Upload,
  MapPin
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { PropertyTypeSelector } from '@/components/property-type-selector'
import { useImageUpload } from '@/hooks/use-image-upload'
import {
  getPropertyTypeByValue,
  getTransactionTypeByValue
} from '@/lib/property-types'

interface UploadedImage {
  url: string
  publicId: string
  width: number
  height: number
  format: string
  size: number
  alt?: string
}

export default function ListPropertyPage () {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)

  const { uploadImages, uploading, progress } = useImageUpload()

  const [formData, setFormData] = useState({
    // Type et transaction
    propertyType: '',
    transactionType: '',

    // Informations de base
    title: '',
    description: '',

    // Localisation
    address: '',
    city: '',
    postalCode: '',
    country: 'France',

    // Prix et surface
    price: '',
    surface: '',

    // Détails spécifiques selon le type
    rooms: '',
    bedrooms: '',
    bathrooms: '',
    yearBuilt: '',
    floor: '',
    totalFloors: '',

    // Caractéristiques
    features: [],
    energyClass: '',
    heating: '',
    parking: '',

    // Images
    images: [] as UploadedImage[],

    // Contact
    contactInfo: {
      name: '',
      email: '',
      phone: ''
    },

    // Disponibilité
    availableFrom: '',
    visitSchedule: ''
  })

  const steps = [
    { id: 1, title: 'Type de bien', description: 'Choisissez le type' },
    { id: 2, title: 'Informations', description: 'Détails du bien' },
    { id: 3, title: 'Localisation', description: 'Adresse et position' },
    { id: 4, title: 'Photos', description: 'Images du bien' },
    { id: 5, title: 'Contact', description: 'Vos coordonnées' },
    { id: 6, title: 'Publication', description: 'Finaliser' }
  ]

  const handleSubmit = async () => {
    try {
      setSubmitting(true)

      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          surface: Number(formData.surface),
          rooms: formData.rooms ? Number(formData.rooms) : undefined,
          bedrooms: formData.bedrooms ? Number(formData.bedrooms) : undefined,
          bathrooms: formData.bathrooms
            ? Number(formData.bathrooms)
            : undefined,
          yearBuilt: formData.yearBuilt
            ? Number(formData.yearBuilt)
            : undefined,
          floor: formData.floor ? Number(formData.floor) : undefined,
          totalFloors: formData.totalFloors
            ? Number(formData.totalFloors)
            : undefined
        })
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error)
      }

      router.push(`/property/${result.data._id}?created=true`)
    } catch (error) {
      console.error('Erreur création:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleImageUpload = async (files: File[]) => {
    try {
      const uploadedImages = await uploadImages(files, 'loopnet/properties')
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedImages]
      }))
    } catch (error) {
      console.error('Erreur upload:', error)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className='space-y-6'>
            <div>
              <h2 className='text-2xl font-bold mb-4'>
                Quel type de bien souhaitez-vous publier ?
              </h2>
              <PropertyTypeSelector
                selectedType={formData.propertyType}
                selectedTransaction={formData.transactionType}
                onTypeChange={type =>
                  setFormData({ ...formData, propertyType: type })
                }
                onTransactionChange={transaction =>
                  setFormData({ ...formData, transactionType: transaction })
                }
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className='space-y-6'>
            <h2 className='text-2xl font-bold mb-4'>
              Informations sur votre bien
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-4'>
                <div>
                  <Label htmlFor='title'>Titre de l'annonce *</Label>
                  <Input
                    id='title'
                    placeholder='Ex: Bureau moderne avec terrasse'
                    value={formData.title}
                    onChange={e =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor='price'>
                      Prix * (
                      {formData.transactionType === 'sale' ? '€' : '€/mois'})
                    </Label>
                    <Input
                      id='price'
                      type='number'
                      placeholder='450000'
                      value={formData.price}
                      onChange={e =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor='surface'>Surface (m²) *</Label>
                    <Input
                      id='surface'
                      type='number'
                      placeholder='120'
                      value={formData.surface}
                      onChange={e =>
                        setFormData({ ...formData, surface: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Champs conditionnels selon le type */}
                {(formData.propertyType === 'office' ||
                  formData.propertyType === 'apartment') && (
                  <div className='grid grid-cols-3 gap-4'>
                    <div>
                      <Label htmlFor='rooms'>Pièces</Label>
                      <Input
                        id='rooms'
                        type='number'
                        placeholder='4'
                        value={formData.rooms}
                        onChange={e =>
                          setFormData({ ...formData, rooms: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor='bedrooms'>Chambres</Label>
                      <Input
                        id='bedrooms'
                        type='number'
                        placeholder='2'
                        value={formData.bedrooms}
                        onChange={e =>
                          setFormData({ ...formData, bedrooms: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor='bathrooms'>Salles de bain</Label>
                      <Input
                        id='bathrooms'
                        type='number'
                        placeholder='1'
                        value={formData.bathrooms}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            bathrooms: e.target.value
                          })
                        }
                      />
                    </div>
                  </div>
                )}

                {formData.propertyType === 'warehouse' && (
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <Label htmlFor='yearBuilt'>Année de construction</Label>
                      <Input
                        id='yearBuilt'
                        type='number'
                        placeholder='2020'
                        value={formData.yearBuilt}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            yearBuilt: e.target.value
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor='parking'>Places de parking</Label>
                      <Input
                        id='parking'
                        placeholder='10 places'
                        value={formData.parking}
                        onChange={e =>
                          setFormData({ ...formData, parking: e.target.value })
                        }
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor='description'>Description *</Label>
                <Textarea
                  id='description'
                  placeholder='Décrivez votre bien en détail...'
                  rows={8}
                  value={formData.description}
                  onChange={e =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className='space-y-6'>
            <h2 className='text-2xl font-bold mb-4'>Localisation du bien</h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-4'>
                <div>
                  <Label htmlFor='address'>Adresse complète *</Label>
                  <Input
                    id='address'
                    placeholder='123 Rue de la République'
                    value={formData.address}
                    onChange={e =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor='city'>Ville *</Label>
                    <Input
                      id='city'
                      placeholder='Paris'
                      value={formData.city}
                      onChange={e =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor='postalCode'>Code postal *</Label>
                    <Input
                      id='postalCode'
                      placeholder='75001'
                      value={formData.postalCode}
                      onChange={e =>
                        setFormData({ ...formData, postalCode: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className='bg-gray-100 rounded-lg p-6 flex items-center justify-center'>
                <div className='text-center'>
                  <MapPin className='w-12 h-12 text-gray-400 mx-auto mb-2' />
                  <p className='text-gray-600'>Carte interactive</p>
                  <p className='text-sm text-gray-500'>
                    Positionnez votre bien
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className='space-y-6'>
            <h2 className='text-2xl font-bold mb-4'>Photos de votre bien</h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <div className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center'>
                  <Upload className='h-12 w-12 text-gray-400 mx-auto mb-4' />
                  <h3 className='text-lg font-semibold mb-2'>
                    Ajoutez vos photos
                  </h3>
                  <p className='text-gray-600 mb-4'>
                    Glissez-déposez ou cliquez pour sélectionner
                  </p>
                  <Button variant='outline' disabled={uploading}>
                    {uploading
                      ? `Upload... ${progress}%`
                      : 'Choisir des photos'}
                  </Button>
                  <label htmlFor='file-upload' className='sr-only'>
                    Choisir des fichiers d'images
                  </label>
                  <input
                    id='file-upload'
                    type='file'
                    multiple
                    accept='image/*'
                    className='hidden'
                    onChange={e => {
                      if (e.target.files) {
                        handleImageUpload(Array.from(e.target.files))
                      }
                    }}
                  />
                </div>

                {formData.images.length > 0 && (
                  <div className='mt-4'>
                    <h4 className='font-semibold mb-2'>
                      Photos ajoutées ({formData.images.length})
                    </h4>
                    <div className='grid grid-cols-3 gap-2'>
                      {formData.images.map((image, index) => (
                        <img
                          key={index}
                          src={image.url || '/placeholder.svg'}
                          alt={`Photo ${index + 1}`}
                          className='w-full h-20 object-cover rounded'
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h3 className='font-semibold mb-4'>
                  Conseils pour de bonnes photos
                </h3>
                <div className='space-y-3 text-sm'>
                  <div className='flex items-start gap-2'>
                    <Check className='h-4 w-4 text-green-600 mt-0.5' />
                    <span>
                      Prenez des photos avec une bonne luminosité naturelle
                    </span>
                  </div>
                  <div className='flex items-start gap-2'>
                    <Check className='h-4 w-4 text-green-600 mt-0.5' />
                    <span>Montrez chaque espace important</span>
                  </div>
                  <div className='flex items-start gap-2'>
                    <Check className='h-4 w-4 text-green-600 mt-0.5' />
                    <span>Incluez la façade et les accès</span>
                  </div>
                  <div className='flex items-start gap-2'>
                    <Check className='h-4 w-4 text-green-600 mt-0.5' />
                    <span>Évitez les photos floues ou sombres</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className='space-y-6'>
            <h2 className='text-2xl font-bold mb-4'>Informations de contact</h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-4'>
                <div>
                  <Label htmlFor='contactName'>Nom complet *</Label>
                  <Input
                    id='contactName'
                    placeholder='Jean Dupont'
                    value={formData.contactInfo.name}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        contactInfo: {
                          ...formData.contactInfo,
                          name: e.target.value
                        }
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor='contactEmail'>Email *</Label>
                  <Input
                    id='contactEmail'
                    type='email'
                    placeholder='jean.dupont@email.com'
                    value={formData.contactInfo.email}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        contactInfo: {
                          ...formData.contactInfo,
                          email: e.target.value
                        }
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor='contactPhone'>Téléphone *</Label>
                  <Input
                    id='contactPhone'
                    placeholder='+33 6 12 34 56 78'
                    value={formData.contactInfo.phone}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        contactInfo: {
                          ...formData.contactInfo,
                          phone: e.target.value
                        }
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor='availableFrom'>Disponible à partir du</Label>
                  <Input
                    id='availableFrom'
                    type='date'
                    value={formData.availableFrom}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        availableFrom: e.target.value
                      })
                    }
                  />
                </div>
              </div>

              <div className='space-y-4'>
                <div>
                  <Label htmlFor='visitSchedule'>Horaires de visite</Label>
                  <Textarea
                    id='visitSchedule'
                    placeholder='Ex: Du lundi au vendredi, 9h-18h sur rendez-vous'
                    rows={3}
                    value={formData.visitSchedule}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        visitSchedule: e.target.value
                      })
                    }
                  />
                </div>

                <div className='p-4 bg-blue-50 rounded-lg'>
                  <h4 className='font-medium text-blue-900 mb-2'>
                    🔒 Confidentialité
                  </h4>
                  <p className='text-sm text-blue-800'>
                    Vos informations sont protégées et ne seront partagées
                    qu'avec les personnes intéressées.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 6:
        return (
          <div className='space-y-6'>
            <h2 className='text-2xl font-bold mb-4'>
              Récapitulatif et publication
            </h2>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Aperçu de votre annonce</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <div>
                      <h3 className='font-semibold text-lg'>
                        {formData.title}
                      </h3>
                      <p className='text-gray-600'>
                        {formData.address}, {formData.city}
                      </p>
                    </div>

                    <div className='flex gap-2'>
                      <span className='px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm'>
                        {
                          getTransactionTypeByValue(formData.transactionType)
                            ?.label
                        }
                      </span>
                      <span className='px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm'>
                        {getPropertyTypeByValue(formData.propertyType)?.label}
                      </span>
                    </div>

                    <div className='text-2xl font-bold text-blue-600'>
                      {Number(formData.price).toLocaleString('fr-FR')}€
                      {formData.transactionType === 'rent' && '/mois'}
                    </div>

                    <div className='grid grid-cols-2 gap-4 text-sm'>
                      <div>
                        <span className='text-gray-600'>Surface</span>
                        <div className='font-semibold'>
                          {formData.surface} m²
                        </div>
                      </div>
                      {formData.rooms && (
                        <div>
                          <span className='text-gray-600'>Pièces</span>
                          <div className='font-semibold'>{formData.rooms}</div>
                        </div>
                      )}
                    </div>

                    {formData.images.length > 0 && (
                      <div>
                        <span className='text-gray-600'>Photos</span>
                        <div className='font-semibold'>
                          {formData.images.length} photo(s)
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Publication</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <div className='p-4 bg-green-50 rounded-lg'>
                      <h4 className='font-medium text-green-900 mb-2'>
                        ✅ Publication gratuite
                      </h4>
                      <p className='text-sm text-green-800'>
                        Votre annonce sera visible pendant 30 jours
                      </p>
                    </div>

                    <div className='p-4 bg-yellow-50 rounded-lg'>
                      <h4 className='font-medium text-yellow-900 mb-2'>
                        ⏳ Validation
                      </h4>
                      <p className='text-sm text-yellow-800'>
                        Votre annonce sera vérifiée sous 24h avant publication
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.propertyType && formData.transactionType
      case 2:
        return (
          formData.title &&
          formData.price &&
          formData.surface &&
          formData.description
        )
      case 3:
        return formData.address && formData.city && formData.postalCode
      case 4:
        return true // Photos optionnelles
      case 5:
        return (
          formData.contactInfo.name &&
          formData.contactInfo.email &&
          formData.contactInfo.phone
        )
      case 6:
        return true
      default:
        return false
    }
  }

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <header className='border-b bg-white'>
        <div className='container mx-auto px-4'>
          <div className='flex items-center justify-between h-16'>
            <div className='flex items-center space-x-8'>
              <Link href='/' className='flex items-center space-x-2'>
                <Building2 className='h-8 w-8 text-blue-600' />
                <span className='text-2xl font-bold text-blue-600'>
                  LoopNet
                </span>
              </Link>
              <nav className='hidden md:flex space-x-6'>
                <Link
                  href='/list-property'
                  className='text-blue-600 font-medium'
                >
                  Publier une annonce
                </Link>
                <Link
                  href='/my-properties'
                  className='text-gray-700 hover:text-blue-600'
                >
                  Mes annonces
                </Link>
                <Link
                  href='/properties'
                  className='text-gray-700 hover:text-blue-600'
                >
                  Rechercher
                </Link>
              </nav>
            </div>
            <div className='flex items-center space-x-4'>
              <Button variant='ghost'>Aide</Button>
              <Button variant='outline'>Sauvegarder</Button>
            </div>
          </div>
        </div>
      </header>

      <div className='container mx-auto px-4 py-8'>
        {/* Progress Steps */}
        <div className='mb-8'>
          <div className='flex items-center justify-between'>
            {steps.map((step, index) => (
              <div key={step.id} className='flex items-center'>
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.id
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-300 text-gray-500'
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className='w-5 h-5' />
                  ) : (
                    step.id
                  )}
                </div>
                <div className='ml-3 hidden md:block'>
                  <div
                    className={`text-sm font-medium ${
                      currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </div>
                  <div className='text-xs text-gray-500'>
                    {step.description}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-0.5 mx-4 ${
                      currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className='mb-8'>
          <CardContent className='p-8'>{renderStep()}</CardContent>
        </Card>

        {/* Navigation */}
        <div className='flex justify-between'>
          <Button
            variant='outline'
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            <ArrowLeft className='w-4 h-4 mr-2' />
            Précédent
          </Button>

          {currentStep < steps.length ? (
            <Button
              onClick={() =>
                setCurrentStep(Math.min(steps.length, currentStep + 1))
              }
              disabled={!canProceed()}
            >
              Suivant
              <ArrowRight className='w-4 h-4 ml-2' />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={submitting || !canProceed()}
            >
              {submitting ? 'Publication...' : "Publier l'annonce"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

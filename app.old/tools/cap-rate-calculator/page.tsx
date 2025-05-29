// cspell:disable
'use client'

import * as React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ChevronLeft, RefreshCw, Info } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

export default function CalculateurTauxCapitalisation () {
  const [propertyPrice, setPropertyPrice] = React.useState('')
  const [annualRent, setAnnualRent] = React.useState('')
  const [expenses, setExpenses] = React.useState('')
  const [calculResult, setCalculResult] = React.useState<string | null>(null)

  // Exemples prédéfinis
  const exemples = [
    {
      nom: 'Bureau centre-ville',
      prix: '750000',
      loyer: '60000',
      charges: '15000'
    },
    {
      nom: 'Local commercial',
      prix: '450000',
      loyer: '42000',
      charges: '8000'
    },
    {
      nom: 'Entrepôt logistique',
      prix: '1200000',
      loyer: '96000',
      charges: '24000'
    }
  ]

  // Calcul du taux de capitalisation
  const calculerTauxCapitalisation = () => {
    const prix = parseFloat(propertyPrice) || 0
    const loyerAnnuel = parseFloat(annualRent) || 0
    const charges = parseFloat(expenses) || 0

    if (prix <= 0) return '0.00'

    const noi = loyerAnnuel - charges // Résultat d'exploitation net
    const capRate = ((noi / prix) * 100).toFixed(2)
    setCalculResult(capRate)
    return capRate
  }

  // Formatage des nombres pour l'affichage
  const formaterNombre = (valeur: string) => {
    return valeur.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }

  // Appliquer un exemple
  const appliquerExemple = (exemple: typeof exemples[0]) => {
    setPropertyPrice(exemple.prix)
    setAnnualRent(exemple.loyer)
    setExpenses(exemple.charges)
  }

  // Réinitialiser les champs
  const reinitialiser = () => {
    setPropertyPrice('')
    setAnnualRent('')
    setExpenses('')
    setCalculResult(null)
  }

  return (
    <div className='container mx-auto py-8 px-4'>
      <div className='max-w-2xl mx-auto'>
        <Link
          href='/tools'
          className='inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors'
        >
          <ChevronLeft className='h-4 w-4 mr-1' />
          Retour aux outils
        </Link>

        <div className='mb-8'>
          <h1 className='text-3xl font-bold mb-2'>
            Calculateur de Taux de Capitalisation
          </h1>
          <p className='text-muted-foreground'>
            Calculez le taux de capitalisation d'un bien immobilier commercial
          </p>
        </div>

        <Tabs defaultValue='calculator' className='mb-8'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='calculator'>Calculateur</TabsTrigger>
            <TabsTrigger value='info'>Guide & Explications</TabsTrigger>
          </TabsList>

          <TabsContent value='calculator'>
            <Card>
              <CardHeader>
                <CardTitle>Entrées</CardTitle>
                <CardDescription>
                  Renseignez les informations du bien pour calculer le taux de
                  capitalisation
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <Label htmlFor='propertyPrice'>
                      Prix d'achat du bien (€)
                    </Label>
                    <TooltipProvider
                      children={
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className='cursor-help'>
                              <Info className='h-4 w-4 text-muted-foreground' />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className='max-w-xs'>
                              Montant total payé pour acquérir la propriété,
                              incluant le prix principal et les frais associés.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      }
                    />
                  </div>
                  <Input
                    id='propertyPrice'
                    type='text'
                    inputMode='numeric'
                    value={propertyPrice ? formaterNombre(propertyPrice) : ''}
                    onChange={(e: any) => {
                      const valeur = e.target.value.replace(/[^0-9]/g, '')
                      setPropertyPrice(valeur)
                    }}
                    placeholder='Ex: 500000'
                  />
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <Label htmlFor='annualRent'>Loyer annuel brut (€)</Label>
                    <TooltipProvider
                      children={
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className='cursor-help'>
                              <Info className='h-4 w-4 text-muted-foreground' />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className='max-w-xs'>
                              Revenu locatif total attendu sur une année, avant
                              déduction des charges et dépenses.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      }
                    />
                  </div>
                  <Input
                    id='annualRent'
                    type='text'
                    inputMode='numeric'
                    value={annualRent ? formaterNombre(annualRent) : ''}
                    onChange={(e: any) => {
                      const valeur = e.target.value.replace(/[^0-9]/g, '')
                      setAnnualRent(valeur)
                    }}
                    placeholder='Ex: 40000'
                  />
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <Label htmlFor='expenses'>Charges annuelles (€)</Label>
                    <TooltipProvider
                      children={
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className='cursor-help'>
                              <Info className='h-4 w-4 text-muted-foreground' />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className='max-w-xs'>
                              Ensemble des frais d'exploitation: taxes,
                              assurances, entretien, gestion locative, etc.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      }
                    />
                  </div>
                  <Input
                    id='expenses'
                    type='text'
                    inputMode='numeric'
                    value={expenses ? formaterNombre(expenses) : ''}
                    onChange={(e: any) => {
                      const valeur = e.target.value.replace(/[^0-9]/g, '')
                      setExpenses(valeur)
                    }}
                    placeholder='Ex: 10000'
                  />
                </div>
              </CardContent>
              <CardFooter className='flex flex-col items-stretch space-y-4'>
                <div className='w-full'>
                  <p className='mb-2 text-sm font-medium'>
                    Utiliser un exemple :
                  </p>
                  <div className='flex flex-wrap gap-2'>
                    {exemples.map((exemple, index) => (
                      <Button
                        key={index}
                        variant='outline'
                        size='sm'
                        onClick={() => appliquerExemple(exemple)}
                      >
                        {exemple.nom}
                      </Button>
                    ))}
                  </div>
                </div>
                <Button
                  variant='ghost'
                  size='sm'
                  className='self-start'
                  onClick={reinitialiser}
                >
                  <RefreshCw className='h-4 w-4 mr-2' />
                  Réinitialiser les champs
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value='info'>
            <Card>
              <CardHeader>
                <CardTitle>Guide du Taux de Capitalisation</CardTitle>
                <CardDescription>
                  Comprendre et utiliser le taux de capitalisation dans
                  l'investissement immobilier
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <h3 className='text-lg font-medium mb-2'>
                    Qu'est-ce que le taux de capitalisation ?
                  </h3>
                  <p className='text-sm text-muted-foreground'>
                    Le taux de capitalisation (ou "cap rate") est un indicateur
                    fondamental pour évaluer la rentabilité potentielle d'un
                    investissement immobilier. Il représente le rendement annuel
                    brut d'un bien immobilier en pourcentage de sa valeur.
                  </p>
                </div>

                <div>
                  <h3 className='text-lg font-medium mb-2'>
                    Comment l'interpréter ?
                  </h3>
                  <div className='text-sm text-muted-foreground space-y-2'>
                    <p>
                      <strong>Taux bas (3-5%)</strong> : Généralement associé à
                      des propriétés premium dans des emplacements de choix.
                      Risque plus faible, mais rendement limité.
                    </p>
                    <p>
                      <strong>Taux moyen (5-7%)</strong> : Équilibre entre
                      risque et rendement. Typique pour des propriétés
                      commerciales de bonne qualité dans des zones attractives.
                    </p>
                    <p>
                      <strong>Taux élevé (7%+)</strong> : Peut indiquer un
                      rendement potentiellement plus important, mais souvent
                      associé à un risque accru ou à des propriétés situées dans
                      des zones moins prisées.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className='text-lg font-medium mb-2'>
                    Facteurs influençant le taux
                  </h3>
                  <ul className='list-disc pl-5 text-sm text-muted-foreground'>
                    <li>Emplacement du bien</li>
                    <li>
                      Type de propriété (bureau, commerce, entrepôt, etc.)
                    </li>
                    <li>État et âge du bâtiment</li>
                    <li>Qualité des locataires et durée des baux</li>
                    <li>Conditions économiques du marché</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Résultat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex justify-between items-center'>
                <span className='text-muted-foreground'>
                  Taux de capitalisation
                </span>
                <span className='text-2xl font-bold text-primary'>
                  {calculerTauxCapitalisation()}%
                </span>
              </div>
              <Separator className='my-4' />
              <div className='text-sm text-muted-foreground'>
                <p className='mb-2'>
                  <strong>Note :</strong> Le taux de capitalisation (ou "cap
                  rate") est un indicateur clé de la rentabilité d'un
                  investissement immobilier.
                </p>
                <p className='mb-2'>
                  <strong>Formule :</strong> (Loyer annuel - Charges) ÷ Prix
                  d'achat × 100
                </p>
                <p className='text-xs text-muted-foreground'>
                  Un taux plus élevé indique un meilleur retour sur
                  investissement potentiel.
                </p>
                {calculResult && (
                  <div className='mt-4 p-3 bg-muted rounded-md'>
                    <h4 className='font-medium mb-1'>Interprétation</h4>
                    {parseFloat(calculResult) < 4 ? (
                      <p>
                        Ce taux de capitalisation est relativement bas, ce qui
                        peut indiquer un bien immobilier premium, généralement
                        avec un risque plus faible mais un rendement limité.
                      </p>
                    ) : parseFloat(calculResult) < 7 ? (
                      <p>
                        Ce taux de capitalisation est dans la moyenne pour des
                        propriétés commerciales de qualité. Un bon équilibre
                        entre risque et rendement.
                      </p>
                    ) : (
                      <p>
                        Ce taux de capitalisation est élevé, ce qui peut
                        suggérer soit un très bon rendement, soit un risque
                        accru. Vérifiez l'état du bien et son emplacement.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='mt-8'>
          <CardHeader>
            <CardTitle>Taux de Capitalisation par Type de Propriété</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-sm text-muted-foreground'>
              <p className='mb-4'>
                Les taux de capitalisation varient selon le type de propriété et
                l'emplacement. Utilisez ce tableau comme guide général :
              </p>
              <table className='min-w-full divide-y divide-muted'>
                <thead>
                  <tr>
                    <th className='px-4 py-2 text-left text-sm font-medium'>
                      Type de Propriété
                    </th>
                    <th className='px-4 py-2 text-left text-sm font-medium'>
                      Taux de Capitalisation Typique
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-muted'>
                  <tr>
                    <td className='px-4 py-2 text-sm'>Bureau</td>
                    <td className='px-4 py-2 text-sm'>4% - 6%</td>
                  </tr>
                  <tr>
                    <td className='px-4 py-2 text-sm'>Commerce de détail</td>
                    <td className='px-4 py-2 text-sm'>5% - 7%</td>
                  </tr>
                  <tr>
                    <td className='px-4 py-2 text-sm'>Entrepôt</td>
                    <td className='px-4 py-2 text-sm'>6% - 8%</td>
                  </tr>
                  <tr>
                    <td className='px-4 py-2 text-sm'>Résidentiel</td>
                    <td className='px-4 py-2 text-sm'>3% - 5%</td>
                  </tr>
                </tbody>
              </table>
              <p className='mt-4 text-xs'>
                Les taux réels peuvent varier. Consultez un expert immobilier
                pour une évaluation précise.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

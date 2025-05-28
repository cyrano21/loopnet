'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function CalculateurTauxCapitalisation() {
  const [propertyPrice, setPropertyPrice] = useState('');
  const [annualRent, setAnnualRent] = useState('');
  const [expenses, setExpenses] = useState('');
  
  // Calcul du taux de capitalisation
  const calculerTauxCapitalisation = () => {
    const prix = parseFloat(propertyPrice) || 0;
    const loyerAnnuel = parseFloat(annualRent) || 0;
    const charges = parseFloat(expenses) || 0;
    
    if (prix <= 0) return '0.00';
    
    const noi = loyerAnnuel - charges; // Résultat d'exploitation net
    return ((noi / prix) * 100).toFixed(2);
  };

  // Formatage des nombres pour l'affichage
  const formaterNombre = (valeur: string) => {
    return valeur.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Link 
          href="/tools" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Retour aux outils
        </Link>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Calculateur de Taux de Capitalisation</h1>
          <p className="text-muted-foreground">
            Calculez le taux de capitalisation d'un bien immobilier commercial
          </p>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Entrées</CardTitle>
            <CardDescription>
              Renseignez les informations du bien pour calculer le taux de capitalisation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="propertyPrice">Prix d'achat du bien (€)</Label>
              <Input
                id="propertyPrice"
                type="text"
                inputMode="numeric"
                value={propertyPrice ? formaterNombre(propertyPrice) : ''}
                onChange={(e) => {
                  const valeur = e.target.value.replace(/[^0-9]/g, '');
                  setPropertyPrice(valeur);
                }}
                placeholder="Ex: 500000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="annualRent">Loyer annuel brut (€)</Label>
              <Input
                id="annualRent"
                type="text"
                inputMode="numeric"
                value={annualRent ? formaterNombre(annualRent) : ''}
                onChange={(e) => {
                  const valeur = e.target.value.replace(/[^0-9]/g, '');
                  setAnnualRent(valeur);
                }}
                placeholder="Ex: 40000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expenses">Charges annuelles (€)</Label>
              <Input
                id="expenses"
                type="text"
                inputMode="numeric"
                value={expenses ? formaterNombre(expenses) : ''}
                onChange={(e) => {
                  const valeur = e.target.value.replace(/[^0-9]/g, '');
                  setExpenses(valeur);
                }}
                placeholder="Ex: 10000"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Résultat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Taux de capitalisation</span>
                <span className="text-2xl font-bold text-primary">
                  {calculerTauxCapitalisation()}%
                </span>
              </div>
              <Separator className="my-4" />
              <div className="text-sm text-muted-foreground">
                <p className="mb-2">
                  <strong>Note :</strong> Le taux de capitalisation (ou "cap rate") est un indicateur clé de la rentabilité d'un investissement immobilier.
                </p>
                <p className="mb-2">
                  <strong>Formule :</strong> (Loyer annuel - Charges) ÷ Prix d'achat × 100
                </p>
                <p className="text-xs text-muted-foreground">
                  Un taux plus élevé indique un meilleur retour sur investissement potentiel.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

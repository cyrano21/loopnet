"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Calculator,
  Euro,
  TrendingUp,
  Home,
  Shield,
  PiggyBank,
} from "lucide-react";
import { PropertySeedData } from "@/lib/seed-data";

interface MortgageCalculatorProps {
  property: PropertySeedData;
}

interface MortgageResult {
  monthlyPayment: number;
  principalAndInterest: number;
  propertyTaxes: number;
  homeInsurance: number;
  totalInterest: number;
  totalPayment: number;
}

export function MortgageCalculator({ property }: MortgageCalculatorProps) {
  const [loanAmount, setLoanAmount] = useState(property.price * 0.8); // 80% du prix
  const [downPayment, setDownPayment] = useState(property.price * 0.2); // 20% d'apport
  const [interestRate, setInterestRate] = useState(3.5); // Taux d'intérêt par défaut
  const [loanTerm, setLoanTerm] = useState(25); // Durée en années
  const [result, setResult] = useState<MortgageResult | null>(null);

  const calculateMortgage = useCallback(() => {
    if (loanAmount <= 0 || interestRate <= 0 || loanTerm <= 0) {
      setResult(null);
      return;
    }

    // Calcul des mensualités (formule standard)
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    const principalAndInterest =
      (loanAmount *
        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    // Estimation des taxes foncières (environ 1.2% du prix par an)
    const propertyTaxes = (property.price * 0.012) / 12;

    // Estimation de l'assurance habitation (environ 0.3% du prix par an)
    const homeInsurance = (property.price * 0.003) / 12;

    const monthlyPayment = principalAndInterest + propertyTaxes + homeInsurance;
    const totalPayment = principalAndInterest * numberOfPayments;
    const totalInterest = totalPayment - loanAmount;

    setResult({
      monthlyPayment,
      principalAndInterest,
      propertyTaxes,
      homeInsurance,
      totalInterest,
      totalPayment,
    });
  }, [loanAmount, interestRate, loanTerm, property.price, setResult]);

  // Calcul automatique quand les valeurs changent
  useEffect(() => {
    calculateMortgage();
  }, [loanAmount, interestRate, loanTerm, calculateMortgage]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("fr-FR").format(num);
  };

  const handleLoanAmountChange = (value: number) => {
    setLoanAmount(value);
    setDownPayment(property.price - value);
  };

  const handleDownPaymentChange = (value: number) => {
    setDownPayment(value);
    setLoanAmount(property.price - value);
  };

  const downPaymentPercentage = (downPayment / property.price) * 100;
  const loanToValue = (loanAmount / property.price) * 100;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-blue-600" />
          Calculateur de prêt immobilier
        </CardTitle>
        <p className="text-sm text-gray-600">
          Estimez vos mensualités pour l'achat de ce bien
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulaire de calcul */}
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Home className="h-4 w-4" />
                Prix du bien
              </h3>
              <p className="text-2xl font-bold text-blue-700">
                {formatCurrency(property.price)}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="downPayment" className="text-sm font-medium">
                  Apport personnel
                </Label>
                <div className="mt-1 relative">
                  <Input
                    id="downPayment"
                    type="number"
                    value={downPayment}
                    onChange={(e) =>
                      handleDownPaymentChange(Number(e.target.value))
                    }
                    className="pr-12"
                    min="0"
                    max={property.price}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Euro className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {downPaymentPercentage.toFixed(1)}% du prix d'achat
                </p>
              </div>

              <div>
                <Label htmlFor="loanAmount" className="text-sm font-medium">
                  Montant du prêt
                </Label>
                <div className="mt-1 relative">
                  <Input
                    id="loanAmount"
                    type="number"
                    value={loanAmount}
                    onChange={(e) =>
                      handleLoanAmountChange(Number(e.target.value))
                    }
                    className="pr-12"
                    min="0"
                    max={property.price}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Euro className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Ratio LTV: {loanToValue.toFixed(1)}%
                </p>
              </div>

              <div>
                <Label htmlFor="interestRate" className="text-sm font-medium">
                  Taux d'intérêt annuel
                </Label>
                <div className="mt-1 relative">
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="pr-8"
                    min="0"
                    max="10"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-400 text-sm">%</span>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="loanTerm" className="text-sm font-medium">
                  Durée du prêt
                </Label>
                <div className="mt-1 relative">
                  <Input
                    id="loanTerm"
                    type="number"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    className="pr-12"
                    min="5"
                    max="30"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-400 text-sm">ans</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Boutons de durée rapide */}
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Durées courantes
              </Label>
              <div className="flex gap-2 flex-wrap">
                {[15, 20, 25, 30].map((years) => (
                  <Button
                    key={years}
                    variant={loanTerm === years ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLoanTerm(years)}
                    className="text-xs"
                  >
                    {years} ans
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Résultats */}
          <div className="space-y-4">
            {result && (
              <>
                {/* Mensualité principale */}
                <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">
                    Mensualité totale
                  </h3>
                  <p className="text-3xl font-bold">
                    {formatCurrency(result.monthlyPayment)}
                  </p>
                  <p className="text-blue-100 text-sm mt-1">
                    Charges comprises
                  </p>
                </div>

                {/* Détail des mensualités */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">
                    Détail mensuel
                  </h4>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">
                          Capital + Intérêts
                        </span>
                      </div>
                      <span className="font-semibold">
                        {formatCurrency(result.principalAndInterest)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">
                          Taxes foncières
                        </span>
                      </div>
                      <span className="font-semibold">
                        {formatCurrency(result.propertyTaxes)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium">
                          Assurance habitation
                        </span>
                      </div>
                      <span className="font-semibold">
                        {formatCurrency(result.homeInsurance)}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Résumé du prêt */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">
                    Résumé du prêt
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 border rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">
                        Coût total du crédit
                      </p>
                      <p className="font-bold text-lg text-red-600">
                        {formatCurrency(result.totalInterest)}
                      </p>
                    </div>

                    <div className="text-center p-3 border rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">
                        Total remboursé
                      </p>
                      <p className="font-bold text-lg text-gray-900">
                        {formatCurrency(result.totalPayment)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Indicateurs */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      Ratio d'endettement recommandé
                    </span>
                    <Badge
                      variant={
                        result.monthlyPayment <= 2000
                          ? "default"
                          : "destructive"
                      }
                    >
                      {result.monthlyPayment <= 2000 ? "Acceptable" : "Élevé"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Apport personnel</span>
                    <Badge
                      variant={
                        downPaymentPercentage >= 20 ? "default" : "secondary"
                      }
                    >
                      {downPaymentPercentage.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Informations importantes */}
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <PiggyBank className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-900 mb-1">
                Informations importantes
              </h4>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>
                  • Cette simulation est indicative et ne constitue pas une
                  offre de prêt
                </li>
                <li>
                  • Les taux d'intérêt varient selon votre profil et
                  l'établissement bancaire
                </li>
                <li>
                  • D'autres frais peuvent s'ajouter (notaire, garantie, frais
                  de dossier)
                </li>
                <li>
                  • Il est recommandé de ne pas dépasser 33% d'endettement
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bouton de contact */}
        <div className="mt-6 text-center">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Calculator className="h-4 w-4 mr-2" />
            Obtenir une simulation personnalisée
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            Contactez nos conseillers pour une étude de financement détaillée
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default MortgageCalculator;

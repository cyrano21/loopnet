'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, 
  XCircle, 
  Wifi, 
  Car, 
  Shield, 
  Thermometer, 
  Droplets, 
  Zap, 
  Home, 
  Leaf, // Remplacé Trees par Leaf qui est disponible
  Dumbbell, 
  Utensils, 
  Tv, 
  Wind,
  Sun,
  Snowflake,
  Camera,
  Lock,
  ArrowUpDown, // Remplacé Elevator par ArrowUpDown qui est disponible
  User // Remplacé Accessibility par User qui est disponible
} from "lucide-react";
import { PropertySeedData } from "@/lib/seed-data";

interface PropertyFeaturesProps {
  property: PropertySeedData;
}

export function PropertyFeatures({ property }: PropertyFeaturesProps) {
  // Caractéristiques principales du bien
  const mainFeatures = [
    {
      category: "Confort et équipements",
      icon: <Home className="h-5 w-5" />,
      color: "text-blue-600",
      features: [
        { name: "Climatisation", available: true, icon: <Snowflake className="h-4 w-4" /> },
        { name: "Chauffage central", available: true, icon: <Thermometer className="h-4 w-4" /> },
        { name: "Cheminée", available: property.features?.includes('fireplace') || false, icon: <Sun className="h-4 w-4" /> },
        { name: "Balcon/Terrasse", available: property.features?.includes('balcony') || true, icon: <Leaf className="h-4 w-4" /> },
        { name: "Cave/Cellier", available: true, icon: <Home className="h-4 w-4" /> },
        { name: "Grenier", available: false, icon: <Home className="h-4 w-4" /> }
      ]
    },
    {
      category: "Sécurité et accès",
      icon: <Shield className="h-5 w-5" />,
      color: "text-green-600",
      features: [
        { name: "Système d'alarme", available: true, icon: <Shield className="h-4 w-4" /> },
        { name: "Vidéosurveillance", available: true, icon: <Camera className="h-4 w-4" /> },
        { name: "Digicode", available: true, icon: <Lock className="h-4 w-4" /> },
        { name: "Gardien", available: false, icon: <Shield className="h-4 w-4" /> },
        { name: "Ascenseur", available: property.features?.includes('elevator') || true, icon: <ArrowUpDown className="h-4 w-4" /> },
        { name: "Accès PMR", available: true, icon: <User className="h-4 w-4" /> }
      ]
    },
    {
      category: "Cuisine et électroménager",
      icon: <Utensils className="h-5 w-5" />,
      color: "text-orange-600",
      features: [
        { name: "Cuisine équipée", available: true, icon: <Utensils className="h-4 w-4" /> },
        { name: "Lave-vaisselle", available: true, icon: <Droplets className="h-4 w-4" /> },
        { name: "Four", available: true, icon: <Thermometer className="h-4 w-4" /> },
        { name: "Micro-ondes", available: true, icon: <Zap className="h-4 w-4" /> },
        { name: "Réfrigérateur", available: false, icon: <Snowflake className="h-4 w-4" /> },
        { name: "Lave-linge", available: true, icon: <Droplets className="h-4 w-4" /> }
      ]
    },
    {
      category: "Connectivité et multimédia",
      icon: <Wifi className="h-5 w-5" />,
      color: "text-purple-600",
      features: [
        { name: "Fibre optique", available: true, icon: <Wifi className="h-4 w-4" /> },
        { name: "Câble TV", available: true, icon: <Tv className="h-4 w-4" /> },
        { name: "Antenne satellite", available: false, icon: <Tv className="h-4 w-4" /> },
        { name: "Prises RJ45", available: true, icon: <Zap className="h-4 w-4" /> },
        { name: "Interphone vidéo", available: true, icon: <Camera className="h-4 w-4" /> },
        { name: "Domotique", available: false, icon: <Home className="h-4 w-4" /> }
      ]
    },
    {
      category: "Extérieur et stationnement",
      icon: <Car className="h-5 w-5" />,
      color: "text-indigo-600",
      features: [
        { name: "Garage", available: property.parking > 0, icon: <Car className="h-4 w-4" /> },
        { name: "Place de parking", available: property.parking > 0, icon: <Car className="h-4 w-4" /> },
        { name: "Jardin privatif", available: property.features?.includes('garden') || false, icon: <Leaf className="h-4 w-4" /> },
        { name: "Piscine", available: property.features?.includes('pool') || false, icon: <Droplets className="h-4 w-4" /> },
        { name: "Barbecue", available: false, icon: <Sun className="h-4 w-4" /> },
        { name: "Abri de jardin", available: false, icon: <Home className="h-4 w-4" /> }
      ]
    },
    {
      category: "Bien-être et loisirs",
      icon: <Dumbbell className="h-5 w-5" />,
      color: "text-pink-600",
      features: [
        { name: "Salle de sport", available: false, icon: <Dumbbell className="h-4 w-4" /> },
        { name: "Sauna", available: false, icon: <Thermometer className="h-4 w-4" /> },
        { name: "Jacuzzi", available: false, icon: <Droplets className="h-4 w-4" /> },
        { name: "Terrasse ensoleillée", available: true, icon: <Sun className="h-4 w-4" /> },
        { name: "Vue dégagée", available: true, icon: <Leaf className="h-4 w-4" /> },
        { name: "Calme", available: true, icon: <Wind className="h-4 w-4" /> }
      ]
    }
  ];

  // Informations énergétiques
  const energyInfo = {
    dpe: "C",
    dpeValue: 150,
    ges: "B",
    gesValue: 25,
    energyCost: "1200-1600"
  };

  // Statistiques des équipements
  const totalFeatures = mainFeatures.reduce((acc, category) => acc + category.features.length, 0);
  const availableFeatures = mainFeatures.reduce((acc, category) => 
    acc + category.features.filter(f => f.available).length, 0
  );
  const availabilityPercentage = Math.round((availableFeatures / totalFeatures) * 100);

  const getDPEColor = (grade: string) => {
    const colors: { [key: string]: string } = {
      'A': 'bg-green-500',
      'B': 'bg-green-400',
      'C': 'bg-yellow-400',
      'D': 'bg-orange-400',
      'E': 'bg-orange-500',
      'F': 'bg-red-400',
      'G': 'bg-red-500'
    };
    return colors[grade] || 'bg-gray-400';
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-blue-600" />
          Caractéristiques et équipements
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>{availableFeatures} équipements disponibles sur {totalFeatures}</span>
          <Badge variant="secondary" className="bg-blue-50 text-blue-700">
            {availabilityPercentage}% d'équipement
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Résumé énergétique */}
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Performance énergétique</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className={`w-12 h-12 ${getDPEColor(energyInfo.dpe)} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                  {energyInfo.dpe}
                </div>
              </div>
              <p className="text-sm font-medium">DPE</p>
              <p className="text-xs text-gray-600">{energyInfo.dpeValue} kWh/m²/an</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className={`w-12 h-12 ${getDPEColor(energyInfo.ges)} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                  {energyInfo.ges}
                </div>
              </div>
              <p className="text-sm font-medium">GES</p>
              <p className="text-xs text-gray-600">{energyInfo.gesValue} kg CO₂/m²/an</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white">
                  <Zap className="h-6 w-6" />
                </div>
              </div>
              <p className="text-sm font-medium">Coût énergétique</p>
              <p className="text-xs text-gray-600">{energyInfo.energyCost}€/an</p>
            </div>
          </div>
        </div>

        {/* Grille des caractéristiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mainFeatures.map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <div className={category.color}>
                  {category.icon}
                </div>
                <h4 className="font-semibold text-gray-900">{category.category}</h4>
                <Badge variant="outline" className="ml-auto">
                  {category.features.filter(f => f.available).length}/{category.features.length}
                </Badge>
              </div>
              
              <div className="space-y-2">
                {category.features.map((feature, featureIndex) => (
                  <div 
                    key={featureIndex} 
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                      feature.available 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={feature.available ? 'text-green-600' : 'text-gray-400'}>
                        {feature.icon}
                      </div>
                      <span className={`text-sm font-medium ${
                        feature.available ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {feature.name}
                      </span>
                    </div>
                    <div className={feature.available ? 'text-green-600' : 'text-gray-400'}>
                      {feature.available ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-6" />

        {/* Informations complémentaires */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Informations complémentaires</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <Home className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="font-semibold text-blue-900">Année de construction</p>
              <p className="text-sm text-blue-700">{property.yearBuilt || '2010'}</p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <Thermometer className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="font-semibold text-green-900">Type de chauffage</p>
              <p className="text-sm text-green-700">Gaz naturel</p>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg text-center">
              <Droplets className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <p className="font-semibold text-orange-900">Eau chaude</p>
              <p className="text-sm text-orange-700">Chaudière gaz</p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg text-center">
              <Wind className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="font-semibold text-purple-900">Ventilation</p>
              <p className="text-sm text-purple-700">VMC double flux</p>
            </div>
          </div>
        </div>

        {/* Note importante */}
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-900 mb-1">À noter</h4>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Les équipements listés sont présents au moment de la visite</li>
                <li>• Certains équipements peuvent nécessiter un entretien ou remplacement</li>
                <li>• Les performances énergétiques sont basées sur le DPE officiel</li>
                <li>• Les coûts énergétiques sont des estimations moyennes</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default PropertyFeatures;
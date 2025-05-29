'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  GraduationCap, 
  Heart, 
  Bus, 
  UtensilsCrossed, 
  ShoppingBag, 
  Coffee, 
  Palette, 
  Scissors, 
  Trees,
  Star,
  Clock,
  Phone,
  ExternalLink
} from "lucide-react";
import { PropertySeedData } from "@/lib/seed-data";

interface PropertyNearbyProps {
  property: PropertySeedData;
}

interface NearbyPlace {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  distance: string;
  walkTime: string;
  address: string;
  phone?: string;
  website?: string;
  description?: string;
  priceRange?: string;
  openHours?: string;
}

interface CategoryConfig {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
}

export function PropertyNearby({ property }: PropertyNearbyProps) {
  const [selectedCategory, setSelectedCategory] = useState('education');

  const categories: CategoryConfig[] = [
    { id: 'education', label: 'Éducation', icon: GraduationCap, color: 'text-blue-600' },
    { id: 'health', label: 'Santé & Médical', icon: Heart, color: 'text-red-600' },
    { id: 'transport', label: 'Transport', icon: Bus, color: 'text-green-600' },
    { id: 'restaurants', label: 'Restaurants', icon: UtensilsCrossed, color: 'text-orange-600' },
    { id: 'shopping', label: 'Shopping', icon: ShoppingBag, color: 'text-purple-600' },
    { id: 'cafes', label: 'Cafés', icon: Coffee, color: 'text-amber-600' },
    { id: 'arts', label: 'Arts & Divertissement', icon: Palette, color: 'text-pink-600' },
    { id: 'beauty', label: 'Beauté & Spas', icon: Scissors, color: 'text-indigo-600' },
    { id: 'parks', label: 'Parcs & Loisirs', icon: Trees, color: 'text-emerald-600' }
  ];

  // Simulation des lieux à proximité basée sur la ville
  const generateNearbyPlaces = (city: string): { [key: string]: NearbyPlace[] } => {
    const baseData = {
      education: [
        {
          id: '1',
          name: 'École Primaire Jean Jaurès',
          category: 'École primaire',
          rating: 4.2,
          reviewCount: 45,
          distance: '0.3 km',
          walkTime: '4 min',
          address: `12 Rue de l'École, ${city}`,
          phone: '01 23 45 67 89',
          description: 'École primaire publique avec cantine et garderie.',
          openHours: '8h30 - 16h30'
        },
        {
          id: '2',
          name: 'Collège Victor Hugo',
          category: 'Collège',
          rating: 4.0,
          reviewCount: 78,
          distance: '0.8 km',
          walkTime: '10 min',
          address: `25 Avenue Victor Hugo, ${city}`,
          phone: '01 23 45 67 90',
          description: 'Collège public avec section sportive.',
          openHours: '8h00 - 17h00'
        },
        {
          id: '3',
          name: 'Lycée Général Voltaire',
          category: 'Lycée',
          rating: 4.3,
          reviewCount: 156,
          distance: '1.2 km',
          walkTime: '15 min',
          address: `45 Boulevard Voltaire, ${city}`,
          phone: '01 23 45 67 91',
          description: 'Lycée général avec options scientifiques et littéraires.',
          openHours: '7h30 - 18h00'
        }
      ],
      health: [
        {
          id: '4',
          name: 'Pharmacie du Centre',
          category: 'Pharmacie',
          rating: 4.5,
          reviewCount: 89,
          distance: '0.2 km',
          walkTime: '3 min',
          address: `8 Place du Centre, ${city}`,
          phone: '01 23 45 67 92',
          description: 'Pharmacie de garde avec parapharmacie.',
          openHours: '8h30 - 19h30'
        },
        {
          id: '5',
          name: 'Cabinet Médical Dr. Martin',
          category: 'Médecin généraliste',
          rating: 4.7,
          reviewCount: 234,
          distance: '0.4 km',
          walkTime: '5 min',
          address: `15 Rue de la Santé, ${city}`,
          phone: '01 23 45 67 93',
          description: 'Cabinet de médecine générale, consultations sur RDV.',
          openHours: '9h00 - 18h00'
        },
        {
          id: '6',
          name: 'Hôpital Saint-Louis',
          category: 'Hôpital',
          rating: 4.1,
          reviewCount: 567,
          distance: '2.1 km',
          walkTime: '25 min',
          address: `100 Avenue de l'Hôpital, ${city}`,
          phone: '01 23 45 67 94',
          description: 'Hôpital public avec service d\'urgences 24h/24.',
          openHours: '24h/24'
        }
      ],
      transport: [
        {
          id: '7',
          name: 'Station Métro République',
          category: 'Métro',
          rating: 4.0,
          reviewCount: 123,
          distance: '0.3 km',
          walkTime: '4 min',
          address: `Place de la République, ${city}`,
          description: 'Lignes 3, 5, 8, 9 et 11. Accès PMR.',
          openHours: '5h30 - 1h15'
        },
        {
          id: '8',
          name: 'Arrêt Bus Mairie',
          category: 'Bus',
          rating: 3.8,
          reviewCount: 67,
          distance: '0.1 km',
          walkTime: '1 min',
          address: `Devant la Mairie, ${city}`,
          description: 'Lignes 20, 65, 96. Fréquence 5-10 min.',
          openHours: '6h00 - 0h30'
        },
        {
          id: '9',
          name: 'Station Vélib\' Centre',
          category: 'Vélos en libre-service',
          rating: 4.2,
          reviewCount: 45,
          distance: '0.2 km',
          walkTime: '2 min',
          address: `12 Place du Centre, ${city}`,
          description: '20 vélos disponibles, station automatique.',
          openHours: '24h/24'
        }
      ],
      restaurants: [
        {
          id: '10',
          name: 'Le Petit Bistrot',
          category: 'Bistrot français',
          rating: 4.6,
          reviewCount: 189,
          distance: '0.2 km',
          walkTime: '3 min',
          address: `5 Rue du Bistrot, ${city}`,
          phone: '01 23 45 67 95',
          priceRange: '€€',
          description: 'Cuisine française traditionnelle, terrasse.',
          openHours: '12h00 - 14h30, 19h00 - 22h30'
        },
        {
          id: '11',
          name: 'Sushi Zen',
          category: 'Restaurant japonais',
          rating: 4.4,
          reviewCount: 156,
          distance: '0.4 km',
          walkTime: '5 min',
          address: `18 Avenue du Japon, ${city}`,
          phone: '01 23 45 67 96',
          priceRange: '€€€',
          description: 'Sushis frais, menu dégustation disponible.',
          openHours: '18h30 - 23h00'
        },
        {
          id: '12',
          name: 'Pizza Corner',
          category: 'Pizzeria',
          rating: 4.1,
          reviewCount: 234,
          distance: '0.3 km',
          walkTime: '4 min',
          address: `22 Rue de la Pizza, ${city}`,
          phone: '01 23 45 67 97',
          priceRange: '€',
          description: 'Pizzas artisanales, livraison disponible.',
          openHours: '11h30 - 14h00, 18h00 - 23h00'
        }
      ],
      shopping: [
        {
          id: '13',
          name: 'Monoprix',
          category: 'Supermarché',
          rating: 4.0,
          reviewCount: 345,
          distance: '0.3 km',
          walkTime: '4 min',
          address: `30 Rue du Commerce, ${city}`,
          phone: '01 23 45 67 98',
          description: 'Supermarché avec rayon frais et produits bio.',
          openHours: '8h30 - 21h00'
        },
        {
          id: '14',
          name: 'Boulangerie Paul',
          category: 'Boulangerie',
          rating: 4.5,
          reviewCount: 123,
          distance: '0.1 km',
          walkTime: '1 min',
          address: `2 Place du Marché, ${city}`,
          phone: '01 23 45 67 99',
          description: 'Pain artisanal, viennoiseries, sandwichs.',
          openHours: '6h30 - 20h00'
        },
        {
          id: '15',
          name: 'Galeries Lafayette',
          category: 'Grand magasin',
          rating: 4.2,
          reviewCount: 567,
          distance: '0.8 km',
          walkTime: '10 min',
          address: `50 Boulevard Haussmann, ${city}`,
          phone: '01 23 45 68 00',
          description: 'Mode, beauté, maison. Personal shopper disponible.',
          openHours: '9h30 - 20h00'
        }
      ],
      cafes: [
        {
          id: '16',
          name: 'Café de Flore',
          category: 'Café traditionnel',
          rating: 4.3,
          reviewCount: 234,
          distance: '0.2 km',
          walkTime: '3 min',
          address: `6 Place Saint-Germain, ${city}`,
          phone: '01 23 45 68 01',
          priceRange: '€€',
          description: 'Café historique, terrasse, wifi gratuit.',
          openHours: '7h00 - 2h00'
        },
        {
          id: '17',
          name: 'Starbucks Coffee',
          category: 'Coffee shop',
          rating: 4.0,
          reviewCount: 189,
          distance: '0.4 km',
          walkTime: '5 min',
          address: `15 Rue de Rivoli, ${city}`,
          phone: '01 23 45 68 02',
          priceRange: '€€',
          description: 'Café américain, boissons chaudes et froides.',
          openHours: '6h30 - 22h00'
        }
      ],
      arts: [
        {
          id: '18',
          name: 'Cinéma Rex',
          category: 'Cinéma',
          rating: 4.4,
          reviewCount: 345,
          distance: '0.5 km',
          walkTime: '6 min',
          address: `25 Boulevard du Cinéma, ${city}`,
          phone: '01 23 45 68 03',
          description: '8 salles, films en VF et VOST, séances 3D.',
          openHours: '14h00 - 0h30'
        },
        {
          id: '19',
          name: 'Théâtre Municipal',
          category: 'Théâtre',
          rating: 4.6,
          reviewCount: 156,
          distance: '0.7 km',
          walkTime: '9 min',
          address: `12 Place du Théâtre, ${city}`,
          phone: '01 23 45 68 04',
          description: 'Théâtre classique et contemporain, 400 places.',
          openHours: 'Selon programmation'
        }
      ],
      beauty: [
        {
          id: '20',
          name: 'Salon de Coiffure Élégance',
          category: 'Coiffeur',
          rating: 4.5,
          reviewCount: 89,
          distance: '0.3 km',
          walkTime: '4 min',
          address: `8 Rue de la Beauté, ${city}`,
          phone: '01 23 45 68 05',
          priceRange: '€€',
          description: 'Coupe, couleur, soins. Sur rendez-vous.',
          openHours: '9h00 - 19h00'
        },
        {
          id: '21',
          name: 'Spa Zen Attitude',
          category: 'Spa',
          rating: 4.7,
          reviewCount: 123,
          distance: '0.6 km',
          walkTime: '8 min',
          address: `20 Avenue du Bien-être, ${city}`,
          phone: '01 23 45 68 06',
          priceRange: '€€€',
          description: 'Massages, soins du visage, hammam.',
          openHours: '10h00 - 20h00'
        }
      ],
      parks: [
        {
          id: '22',
          name: 'Parc des Buttes-Chaumont',
          category: 'Parc public',
          rating: 4.8,
          reviewCount: 567,
          distance: '0.4 km',
          walkTime: '5 min',
          address: `1 Rue Botzaris, ${city}`,
          description: 'Grand parc avec lac, aires de jeux, jogging.',
          openHours: '7h00 - 20h00 (été: 22h00)'
        },
        {
          id: '23',
          name: 'Complexe Sportif Municipal',
          category: 'Centre sportif',
          rating: 4.2,
          reviewCount: 234,
          distance: '0.8 km',
          walkTime: '10 min',
          address: `35 Rue du Sport, ${city}`,
          phone: '01 23 45 68 07',
          description: 'Piscine, tennis, fitness, cours collectifs.',
          openHours: '6h30 - 22h00'
        }
      ]
    };

    return baseData;
  };

  const nearbyPlaces = generateNearbyPlaces(property.city);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderPlaceCard = (place: NearbyPlace) => (
    <div key={place.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{place.name}</h4>
          <p className="text-sm text-gray-600">{place.category}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {place.distance}
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-2">
        <div className="flex items-center gap-1">
          {renderStars(place.rating)}
          <span className="text-sm font-medium">{place.rating}</span>
          <span className="text-xs text-gray-500">({place.reviewCount})</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <Clock className="h-3 w-3" />
          {place.walkTime} à pied
        </div>
      </div>

      {place.description && (
        <p className="text-sm text-gray-600 mb-2">{place.description}</p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <MapPin className="h-3 w-3" />
          {place.address}
        </div>
        {place.priceRange && (
          <Badge variant="secondary" className="text-xs">
            {place.priceRange}
          </Badge>
        )}
      </div>

      {(place.phone || place.website || place.openHours) && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {place.phone && (
              <Button variant="outline" size="sm" className="text-xs h-7">
                <Phone className="h-3 w-3 mr-1" />
                Appeler
              </Button>
            )}
            {place.website && (
              <Button variant="outline" size="sm" className="text-xs h-7">
                <ExternalLink className="h-3 w-3 mr-1" />
                Site web
              </Button>
            )}
          </div>
          {place.openHours && (
            <p className="text-xs text-gray-500 mt-2">
              <Clock className="h-3 w-3 inline mr-1" />
              {place.openHours}
            </p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          Commodités à proximité
        </CardTitle>
        <p className="text-sm text-gray-600">
          Découvrez les services et commerces autour de {property.address}, {property.city}
        </p>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid grid-cols-3 lg:grid-cols-9 mb-6">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex flex-col gap-1 p-2 h-auto"
                >
                  <IconComponent className={`h-4 w-4 ${category.color}`} />
                  <span className="text-xs hidden lg:block">{category.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <category.icon className={`h-5 w-5 ${category.color}`} />
                  <h3 className="text-lg font-semibold">{category.label}</h3>
                  <Badge variant="outline">
                    {nearbyPlaces[category.id]?.length || 0} lieux
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {nearbyPlaces[category.id]?.map(renderPlaceCard) || (
                    <div className="col-span-full text-center py-8 text-gray-500">
                      Aucun lieu trouvé dans cette catégorie
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Informations sur les distances</h4>
              <p className="text-sm text-blue-700">
                Les distances et temps de marche sont calculés depuis l'adresse du bien. 
                Les horaires et informations peuvent varier selon les établissements.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default PropertyNearby;

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Navigation, 
  Copy, 
  ExternalLink, 
  Car, 
  Train, 
  Bus, 
  Bike,
  Clock,
  Star
} from "lucide-react";
import { PropertySeedData } from "@/lib/seed-data";

interface PropertyAddressProps {
  property: PropertySeedData;
}

export function PropertyAddress({ property }: PropertyAddressProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Ici vous pourriez ajouter une notification toast
  };

  const openInMaps = () => {
    const address = encodeURIComponent(`${property.address}, ${property.city}`);
    window.open(`https://www.google.com/maps/search/${address}`, '_blank');
  };

  const getDirections = () => {
    const address = encodeURIComponent(`${property.address}, ${property.city}`);
    window.open(`https://www.google.com/maps/dir//${address}`, '_blank');
  };

  // Données simulées pour les scores de mobilité
  const mobilityScores = {
    walk: { score: 78, description: "Très accessible à pied" },
    transit: { score: 65, description: "Bon accès aux transports" },
    bike: { score: 82, description: "Très cyclable" },
    car: { score: 90, description: "Excellent accès routier" }
  };

  // Points d'intérêt à proximité (données simulées)
  const nearbyPlaces = [
    { name: "Supermarché Carrefour", type: "Commerce", distance: "350m", rating: 4.2 },
    { name: "École Primaire Saint-Martin", type: "Éducation", distance: "500m", rating: 4.5 },
    { name: "Pharmacie de la Place", type: "Santé", distance: "200m", rating: 4.3 },
    { name: "Parc Municipal", type: "Loisirs", distance: "800m", rating: 4.7 },
    { name: "Station Métro République", type: "Transport", distance: "600m", rating: 4.1 }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  const getScoreIcon = (type: string) => {
    switch (type) {
      case 'walk': return <span className="text-lg">🚶</span>;
      case 'transit': return <Train className="h-4 w-4" />;
      case 'bike': return <Bike className="h-4 w-4" />;
      case 'car': return <Car className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          Localisation et adresse
        </CardTitle>
        <p className="text-sm text-gray-600">
          Informations détaillées sur l'emplacement du bien
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informations d'adresse */}
          <div className="space-y-6">
            {/* Adresse principale */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Adresse complète
              </h3>
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-900">{property.address}</p>
                <p className="text-gray-700">
                  {property.city}, {property.postalCode}
                </p>
                <p className="text-gray-600">
                  {property.region}, France
                </p>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => copyToClipboard(`${property.address}, ${property.city}`)}
                  className="text-xs"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copier
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={openInMaps}
                  className="text-xs"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Voir sur Maps
                </Button>
                <Button 
                  size="sm" 
                  onClick={getDirections}
                  className="text-xs bg-blue-600 hover:bg-blue-700"
                >
                  <Navigation className="h-3 w-3 mr-1" />
                  Itinéraire
                </Button>
              </div>
            </div>

            {/* Détails de localisation */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Détails de localisation</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Quartier</p>
                  <p className="font-medium">{property.neighborhood || "Centre-ville"}</p>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Code postal</p>
                  <p className="font-medium">{property.postalCode}</p>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Région</p>
                  <p className="font-medium">{property.region}</p>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Pays</p>
                  <p className="font-medium">France</p>
                </div>
              </div>
            </div>

            {/* Scores de mobilité */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Scores de mobilité</h4>
              
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(mobilityScores).map(([type, data]) => (
                  <div key={type} className={`p-3 rounded-lg ${getScoreColor(data.score)}`}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {getScoreIcon(type)}
                        <span className="text-sm font-medium capitalize">
                          {type === 'walk' ? 'À pied' : 
                           type === 'transit' ? 'Transport' :
                           type === 'bike' ? 'Vélo' : 'Voiture'}
                        </span>
                      </div>
                      <span className="font-bold text-lg">{data.score}</span>
                    </div>
                    <p className="text-xs opacity-80">{data.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Carte et points d'intérêt */}
          <div className="space-y-6">
            {/* Carte simulée */}
            <div className="aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 font-medium">Carte interactive</p>
                <p className="text-sm text-gray-400">Google Maps sera intégré ici</p>
              </div>
              
              {/* Bouton pour ouvrir la carte */}
              <Button 
                className="absolute bottom-4 right-4"
                onClick={openInMaps}
                size="sm"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Ouvrir la carte
              </Button>
            </div>

            {/* Points d'intérêt à proximité */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Points d'intérêt à proximité</h4>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {nearbyPlaces.map((place, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-medium text-sm">{place.name}</h5>
                        <Badge variant="secondary" className="text-xs">
                          {place.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {place.distance}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {place.rating}
                        </span>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="text-xs">
                      <Navigation className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Informations de transport */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Accès et transport</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Train className="h-5 w-5 text-blue-600" />
                <h5 className="font-medium">Transports en commun</h5>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Métro République - 600m</li>
                <li>• Bus ligne 12 - 200m</li>
                <li>• Tramway T1 - 800m</li>
              </ul>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Car className="h-5 w-5 text-green-600" />
                <h5 className="font-medium">Accès routier</h5>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Autoroute A6 - 5 min</li>
                <li>• Rocade - 8 min</li>
                <li>• Centre-ville - 12 min</li>
              </ul>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Bike className="h-5 w-5 text-orange-600" />
                <h5 className="font-medium">Mobilité douce</h5>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Pistes cyclables</li>
                <li>• Station Vélib' - 300m</li>
                <li>• Zone piétonne proche</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bouton d'action */}
        <div className="mt-6 text-center">
          <Button size="lg" onClick={getDirections} className="bg-blue-600 hover:bg-blue-700">
            <Navigation className="h-4 w-4 mr-2" />
            Calculer l'itinéraire depuis ma position
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            Obtenez des directions détaillées vers cette propriété
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default PropertyAddress;
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Maximize2, Eye, ExternalLink } from "lucide-react";
import { PropertySeedData } from "@/lib/seed-data";

interface VirtualTour360Props {
  property: PropertySeedData;
}

interface Tour360Item {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  tourUrl: string;
  isActive: boolean;
}

export function VirtualTour360({ property }: VirtualTour360Props) {
  const [selectedTour, setSelectedTour] = useState<Tour360Item | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Données d'exemple pour les visites virtuelles 360°
  const tours: Tour360Item[] = [
    {
      id: '1',
      title: 'Salon principal',
      description: 'Vue panoramique du salon avec cheminée et baies vitrées',
      thumbnail: '/images/360-salon.jpg',
      tourUrl: 'https://momento360.com/e/u/example-tour-1',
      isActive: true
    },
    {
      id: '2',
      title: 'Cuisine équipée',
      description: 'Découvrez la cuisine moderne entièrement équipée',
      thumbnail: '/images/360-cuisine.jpg',
      tourUrl: 'https://momento360.com/e/u/example-tour-2',
      isActive: true
    },
    {
      id: '3',
      title: 'Chambre principale',
      description: 'Suite parentale avec dressing et salle de bain privative',
      thumbnail: '/images/360-chambre.jpg',
      tourUrl: 'https://momento360.com/e/u/example-tour-3',
      isActive: true
    },
    {
      id: '4',
      title: 'Terrasse extérieure',
      description: 'Espace extérieur avec vue dégagée',
      thumbnail: '/images/360-terrasse.jpg',
      tourUrl: 'https://momento360.com/e/u/example-tour-4',
      isActive: false
    }
  ];

  const activeTours = tours.filter(tour => tour.isActive);

  const openTourModal = (tour: Tour360Item) => {
    setSelectedTour(tour);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTour(null);
  };

  if (activeTours.length === 0) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-blue-600" />
            Visite virtuelle 360°
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <RotateCcw className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Aucune visite virtuelle 360° disponible</p>
            <p className="text-sm text-gray-400 mt-1">
              Cette fonctionnalité sera bientôt disponible pour cette propriété
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-blue-600" />
            Visite virtuelle 360°
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Tour principal en vedette */}
          {activeTours.length > 0 && (
            <div className="mb-6">
              <div 
                className="relative aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => openTourModal(activeTours[0])}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <RotateCcw className="h-16 w-16 text-blue-500 mx-auto mb-4 animate-spin-slow" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {activeTours[0].title}
                    </h3>
                    <p className="text-gray-600 mb-4">{activeTours[0].description}</p>
                    <Badge className="bg-blue-600 hover:bg-blue-700">
                      <Eye className="h-3 w-3 mr-1" />
                      Commencer la visite
                    </Badge>
                  </div>
                </div>
                
                {/* Overlay au survol */}
                <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <div className="bg-white bg-opacity-90 rounded-full p-4">
                    <Maximize2 className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Liste des autres tours */}
          {activeTours.length > 1 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Autres espaces disponibles</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeTours.slice(1).map((tour) => (
                  <div 
                    key={tour.id} 
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
                    onClick={() => openTourModal(tour)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
                        <RotateCcw className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {tour.title}
                        </h5>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{tour.description}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="h-3 w-3 mr-1" />
                      Voir en 360°
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Informations sur la technologie */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-blue-600" />
              Technologie de visite virtuelle
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium text-gray-800 mb-1">Fonctionnalités :</h5>
                <ul className="text-gray-600 space-y-1">
                  <li>• Navigation à 360° complète</li>
                  <li>• Zoom et rotation libres</li>
                  <li>• Points d'intérêt interactifs</li>
                  <li>• Compatible mobile et desktop</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-gray-800 mb-1">Avantages :</h5>
                <ul className="text-gray-600 space-y-1">
                  <li>• Visite immersive depuis chez vous</li>
                  <li>• Exploration détaillée de chaque pièce</li>
                  <li>• Gain de temps avant visite physique</li>
                  <li>• Disponible 24h/24, 7j/7</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal pour la visite 360° */}
      {isModalOpen && selectedTour && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="text-lg font-semibold">{selectedTour.title}</h3>
                <p className="text-sm text-gray-600">{selectedTour.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(selectedTour.tourUrl, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Plein écran
                </Button>
                <Button variant="outline" size="sm" onClick={closeModal}>
                  ✕
                </Button>
              </div>
            </div>
            <div className="aspect-video bg-gray-100">
              {/* Placeholder pour l'iframe de la visite 360° */}
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <RotateCcw className="h-16 w-16 text-blue-500 mx-auto mb-4 animate-spin" />
                  <p className="text-gray-600 mb-2">Chargement de la visite virtuelle...</p>
                  <p className="text-sm text-gray-500">
                    Dans un environnement de production, cette zone contiendrait l'iframe de la visite 360°
                  </p>
                  <Button 
                    className="mt-4"
                    onClick={() => window.open(selectedTour.tourUrl, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ouvrir la visite dans un nouvel onglet
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default VirtualTour360;
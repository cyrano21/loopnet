"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  MapPin,
  Car,
  Bike,
  Bus,
  Coffee,
  ShoppingBag,
  GraduationCap,
} from "lucide-react";
import { PropertySeedData } from "@/lib/seed-data";

interface WalkScoreProps {
  property: PropertySeedData;
}

interface ScoreData {
  score: number;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

interface NearbyAmenity {
  name: string;
  distance: string;
  icon: React.ElementType;
}

export function WalkScore({ property }: WalkScoreProps) {
  // Simulation des scores basés sur la localisation
  const getScoreByLocation = (city: string) => {
    // Scores simulés selon la ville
    const cityScores: {
      [key: string]: { walk: number; transit: number; bike: number };
    } = {
      Paris: { walk: 92, transit: 95, bike: 78 },
      Lyon: { walk: 85, transit: 88, bike: 72 },
      Marseille: { walk: 78, transit: 75, bike: 65 },
      Toulouse: { walk: 82, transit: 80, bike: 70 },
      Nice: { walk: 88, transit: 82, bike: 75 },
      Nantes: { walk: 86, transit: 85, bike: 80 },
      Bordeaux: { walk: 84, transit: 83, bike: 76 },
    };

    return cityScores[city] || { walk: 75, transit: 70, bike: 65 };
  };

  const scores = getScoreByLocation(property.city);

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Très bon";
    if (score >= 70) return "Bon";
    if (score >= 60) return "Moyen";
    if (score >= 50) return "Faible";
    return "Très faible";
  };

  const getScoreColor = (score: number) => {
    if (score >= 90)
      return {
        color: "text-green-700",
        bgColor: "bg-green-100",
        progressColor: "bg-green-500",
      };
    if (score >= 80)
      return {
        color: "text-blue-700",
        bgColor: "bg-blue-100",
        progressColor: "bg-blue-500",
      };
    if (score >= 70)
      return {
        color: "text-yellow-700",
        bgColor: "bg-yellow-100",
        progressColor: "bg-yellow-500",
      };
    if (score >= 60)
      return {
        color: "text-orange-700",
        bgColor: "bg-orange-100",
        progressColor: "bg-orange-500",
      };
    return {
      color: "text-red-700",
      bgColor: "bg-red-100",
      progressColor: "bg-red-500",
    };
  };

  const scoreData: ScoreData[] = [
    {
      score: scores.walk,
      label: "Walk Score",
      description: "Facilité de marche pour les courses quotidiennes",
      icon: MapPin,
      ...getScoreColor(scores.walk),
    },
    {
      score: scores.transit,
      label: "Transit Score",
      description: "Qualité des transports en commun",
      icon: Bus,
      ...getScoreColor(scores.transit),
    },
    {
      score: scores.bike,
      label: "Bike Score",
      description: "Facilité de circulation à vélo",
      icon: Bike,
      ...getScoreColor(scores.bike),
    },
  ];

  // Commodités à proximité simulées
  const nearbyAmenities: NearbyAmenity[] = [
    { name: "Supermarché", distance: "2 min à pied", icon: ShoppingBag },
    { name: "Café", distance: "1 min à pied", icon: Coffee },
    { name: "École", distance: "5 min à pied", icon: GraduationCap },
    { name: "Station métro", distance: "3 min à pied", icon: Bus },
    { name: "Parking", distance: "Sur place", icon: Car },
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          Scores de mobilité
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Scores principaux */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {scoreData.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={index} className={`p-4 rounded-lg ${item.bgColor}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-white p-2 rounded-lg">
                    <IconComponent className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${item.color}`}>
                      {item.label}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`text-2xl font-bold ${item.color}`}>
                      {item.score}
                    </span>
                    <Badge variant="outline" className={item.color}>
                      {getScoreLabel(item.score)}
                    </Badge>
                  </div>
                  <Progress value={item.score} className="h-2" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Explication des scores */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Que signifient ces scores ?
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex gap-3">
                <MapPin className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">Walk Score :</span>
                  <p className="text-gray-600">
                    Mesure la facilité de marche vers les commerces,
                    restaurants, écoles et parcs.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Bus className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">Transit Score :</span>
                  <p className="text-gray-600">
                    Évalue la qualité et la fréquence des transports en commun.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Bike className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">Bike Score :</span>
                  <p className="text-gray-600">
                    Indique la facilité de circulation à vélo et la présence de
                    pistes cyclables.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Commodités à proximité
            </h4>
            <div className="space-y-2">
              {nearbyAmenities.map((amenity, index) => {
                const IconComponent = amenity.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="bg-blue-100 p-1.5 rounded">
                      <IconComponent className="h-3 w-3 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900">
                        {amenity.name}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {amenity.distance}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Échelle de notation */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">
            Échelle de notation
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
            <div className="text-center p-2 bg-green-100 rounded">
              <div className="font-semibold text-green-700">90-100</div>
              <div className="text-green-600">Excellent</div>
            </div>
            <div className="text-center p-2 bg-blue-100 rounded">
              <div className="font-semibold text-blue-700">80-89</div>
              <div className="text-blue-600">Très bon</div>
            </div>
            <div className="text-center p-2 bg-yellow-100 rounded">
              <div className="font-semibold text-yellow-700">70-79</div>
              <div className="text-yellow-600">Bon</div>
            </div>
            <div className="text-center p-2 bg-orange-100 rounded">
              <div className="font-semibold text-orange-700">60-69</div>
              <div className="text-orange-600">Moyen</div>
            </div>
            <div className="text-center p-2 bg-red-100 rounded">
              <div className="font-semibold text-red-700">0-59</div>
              <div className="text-red-600">Faible</div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-500">
          * Les scores sont calculés en fonction de la distance aux commodités
          et de la qualité des infrastructures de transport.
        </div>
      </CardContent>
    </Card>
  );
}

export default WalkScore;

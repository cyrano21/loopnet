"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertySeedData } from "@/lib/seed-data";
import { Bed, Bath, Square, MapPin, Info } from "lucide-react";
import { isUnsplashImage, getRandomUnsplashImage } from "@/lib/image-utils";

interface NearbySimilarPropertyProps {
  property: PropertySeedData;
}

// Données d'exemple pour les propriétés similaires
const similarProperties = [
  {
    id: "1",
    title: "Appartement Moderne",
    location: "Paris, 75008",
    price: 450000,
    image: getRandomUnsplashImage("apartment", 400, 300),
    bed: 2,
    bath: 1,
    sqft: 85,
    forRent: false,
    isIllustrative: true,
  },
  {
    id: "2",
    title: "Maison de Ville",
    location: "Lyon, 69002",
    price: 520000,
    image: getRandomUnsplashImage("house", 400, 300),
    bed: 3,
    bath: 2,
    sqft: 120,
    forRent: false,
    isIllustrative: true,
  },
  {
    id: "3",
    title: "Loft Industriel",
    location: "Bordeaux, 33000",
    price: 380000,
    image: getRandomUnsplashImage("loft", 400, 300),
    bed: 1,
    bath: 1,
    sqft: 75,
    forRent: false,
    isIllustrative: true,
  },
  {
    id: "4",
    title: "Villa avec Piscine",
    location: "Nice, 06000",
    price: 890000,
    image: getRandomUnsplashImage("house", 400, 300),
    bed: 4,
    bath: 3,
    sqft: 200,
    forRent: false,
    isIllustrative: true,
  },
];

export function NearbySimilarProperty({
  property,
}: NearbySimilarPropertyProps) {
  // Formater les prix pour l'affichage
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Propriétés Similaires à Proximité</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {similarProperties.map((prop) => (
            <div
              key={prop.id}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative">
                <Image
                  width={382}
                  height={248}
                  className="w-full h-48 object-cover"
                  src={prop.image}
                  alt={prop.title}
                />
                <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium">
                  {formatPrice(prop.price)}
                </div>
                {/* Indicateur d'image illustrative */}
                {(prop.isIllustrative || isUnsplashImage(prop.image)) && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-1 flex items-center justify-center">
                    <Info className="h-3 w-3 mr-1" />
                    <span className="text-xs">Image illustrative</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1 truncate">
                  <Link
                    href={`/property/${prop.id}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {prop.title}
                  </Link>
                </h3>
                <p className="text-gray-600 mb-3 flex items-center text-sm">
                  <MapPin className="w-4 h-4 mr-1" /> {prop.location}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-700">
                  <div className="flex items-center">
                    <Bed className="w-4 h-4 mr-1" /> {prop.bed}
                  </div>
                  <div className="flex items-center">
                    <Bath className="w-4 h-4 mr-1" /> {prop.bath}
                  </div>
                  <div className="flex items-center">
                    <Square className="w-4 h-4 mr-1" /> {prop.sqft} m²
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default NearbySimilarProperty;

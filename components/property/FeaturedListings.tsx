'use client';

import { Grid, List, Heart, MapPin, Bed, Bath, Square } from 'lucide-react';
import Image from 'next/image';

interface Property {
  id: number;
  title: string;
  price: number;
  address: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  images: string[];
  type: string;
  status: string;
  description?: string;
  yearBuilt?: number;
  features?: string[];
}

interface FeaturedListingsProps {
  properties: Property[];
  viewType: 'grid' | 'list';
  gridCols: number;
}

export default function FeaturedListings({ properties, viewType, gridCols }: FeaturedListingsProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getGridClass = () => {
    switch (gridCols) {
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  if (viewType === 'list') {
    return (
      <div className="space-y-4">
        {properties.map((property) => (
          <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="flex flex-col md:flex-row">
              {/* Image */}
              <div className="relative w-full md:w-80 h-48 md:h-auto">
                <Image
                  src={property.images[0] || '/api/placeholder/400/300'}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
                <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                  <Heart className="h-4 w-4" />
                </button>
                <span className={`absolute top-3 left-3 px-2 py-1 rounded text-xs font-medium text-white ${
                  property.status === 'for_sale' ? 'bg-green-600' : 
                  property.status === 'for_rent' ? 'bg-blue-600' : 'bg-gray-600'
                }`}>
                  {property.status === 'for_sale' ? 'À vendre' : 
                   property.status === 'for_rent' ? 'À louer' : property.status}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">
                    {property.title}
                  </h3>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatPrice(property.price)}
                  </span>
                </div>

                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{property.address}</span>
                </div>

                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-1 text-gray-500" />
                    <span className="text-sm">{property.bedrooms} ch.</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-1 text-gray-500" />
                    <span className="text-sm">{property.bathrooms} sdb</span>
                  </div>
                  <div className="flex items-center">
                    <Square className="h-4 w-4 mr-1 text-gray-500" />
                    <span className="text-sm">{property.sqft} m²</span>
                  </div>
                </div>

                {property.description && (
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {property.description}
                  </p>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 capitalize">
                    {property.type}
                  </span>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Voir détails
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Grid view
  return (
    <div className={`grid gap-6 ${getGridClass()}`}>
      {properties.map((property) => (
        <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          {/* Image */}
          <div className="relative h-48">
            <Image
              src={property.images[0] || '/api/placeholder/400/300'}
              alt={property.title}
              fill
              className="object-cover"
            />
            <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
              <Heart className="h-4 w-4" />
            </button>
            <span className={`absolute top-3 left-3 px-2 py-1 rounded text-xs font-medium text-white ${
              property.status === 'for_sale' ? 'bg-green-600' : 
              property.status === 'for_rent' ? 'bg-blue-600' : 'bg-gray-600'
            }`}>
              {property.status === 'for_sale' ? 'À vendre' : 
               property.status === 'for_rent' ? 'À louer' : property.status}
            </span>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="mb-2">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                {property.title}
              </h3>
              <span className="text-xl font-bold text-blue-600">
                {formatPrice(property.price)}
              </span>
            </div>

            <div className="flex items-center text-gray-600 mb-3">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm line-clamp-1">{property.address}</span>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  <Bed className="h-4 w-4 mr-1 text-gray-500" />
                  <span className="text-sm">{property.bedrooms}</span>
                </div>
                <div className="flex items-center">
                  <Bath className="h-4 w-4 mr-1 text-gray-500" />
                  <span className="text-sm">{property.bathrooms}</span>
                </div>
                <div className="flex items-center">
                  <Square className="h-4 w-4 mr-1 text-gray-500" />
                  <span className="text-sm">{property.sqft}m²</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 capitalize">
                {property.type}
              </span>
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                Détails
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

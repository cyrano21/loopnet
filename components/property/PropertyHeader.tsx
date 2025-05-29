import React from 'react';
import { Heart, Share2, ExternalLink, Printer, MapPin, Home, Calendar, GitCompare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PropertySeedData } from "@/lib/seed-data";
import { useComparison } from "@/components/comparison-provider";
import { usePermissions } from "@/hooks/use-permissions";
import { toast } from "sonner";

interface PropertyHeaderProps {
  property: PropertySeedData;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
}

export function PropertyHeader({ property, isFavorite, onFavoriteToggle }: PropertyHeaderProps) {
  const { addToComparison, comparisonList } = useComparison();
  const { can, requiresUpgrade } = usePermissions();
  
  const isInComparison = comparisonList.some((p: any) => p._id === property._id);
  
  const handleCompareClick = () => {
    if (!can('canCompareProperties')) {
      const upgrade = requiresUpgrade('canCompareProperties');
      if (upgrade) {
        toast.info('Mise à niveau requise pour comparer les propriétés.');
        return;
      }
    }
    addToComparison(property);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3 animate-fade-in-down">
            <Badge variant="secondary" className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-3 py-1 text-sm font-medium rounded-full shadow-sm transform hover:scale-105 transition-transform">
              {property.type}
            </Badge>
            <Badge variant="outline" className="bg-white border-blue-200 text-blue-700 px-3 py-1 text-sm font-medium rounded-full shadow-sm transform hover:scale-105 transition-transform">
              {property.status}
            </Badge>
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight tracking-tight animate-fade-in-down" style={{ animationDelay: '0.1s' }}>
            {property.title}
          </h1>
          
          <div className="flex items-center text-gray-700 mb-4 animate-fade-in-down" style={{ animationDelay: '0.2s' }}>
            <MapPin className="h-5 w-5 mr-2 text-blue-600" />
            <span className="hover:text-blue-600 transition-colors">{property.address}, {property.city}</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-700 animate-fade-in-down" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm hover:bg-blue-50 transition-colors">
              <Home className="h-5 w-5 text-blue-600" />
              <span className="font-medium">{property.surface} m²</span>
            </div>
            {property.bedrooms && (
              <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm hover:bg-blue-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="9" width="20" height="12" rx="2" />
                  <path d="M2 16h20" />
                  <path d="M4 4h16a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
                </svg>
                <span className="font-medium">{property.bedrooms} chambres</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm hover:bg-blue-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
                  <line x1="10" y1="7" x2="15" y2="7" />
                  <line x1="9" y1="12" x2="14" y2="12" />
                  <line x1="12" y1="17" x2="12" y2="17" />
                </svg>
                <span className="font-medium">{property.bathrooms} salles de bain</span>
              </div>
            )}
            {property.parking && (
              <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm hover:bg-blue-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M10 8h4a2 2 0 0 1 2 2v8" />
                  <path d="M10 8v8" />
                </svg>
                <span className="font-medium">{property.parking} parking</span>
              </div>
            )}
            {property.yearBuilt && (
              <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm hover:bg-blue-50 transition-colors">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Construit en {property.yearBuilt}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-4 animate-fade-in-right">
          <div className="text-right">
            <div className="relative">
              <div className="absolute -top-4 -right-4">
                <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full animate-pulse">
                  {property.status === 'Nouvelle annonce' ? 'Nouveau!' : 'Hot'}
                </span>
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 drop-shadow-sm">
                {formatPrice(property.price)}
              </div>
            </div>
            <div className="text-sm font-medium text-gray-700 bg-blue-100 px-2 py-1 rounded-md mt-1 inline-block">
              {formatPrice(property.price / property.surface)}/m²
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onFavoriteToggle}
              className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-sm transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md ${isFavorite ? 'bg-pink-100 text-pink-600 border-pink-200 hover:bg-pink-200' : 'bg-white hover:bg-pink-50'}`}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-pink-600 text-pink-600 animate-heartbeat' : ''}`} />
              {isFavorite ? "Retiré" : "Favoris"}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCompareClick}
              disabled={isInComparison}
              className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-sm transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md ${isInComparison ? 'bg-green-100 text-green-600 border-green-200' : 'bg-white hover:bg-blue-50'}`}
            >
              <GitCompare className={`h-4 w-4 ${isInComparison ? "fill-current" : ""}`} />
              {isInComparison ? "Ajouté" : "Comparer"}
            </Button>
            
            <Button variant="outline" size="sm" className="flex items-center gap-2 px-4 py-2 rounded-full shadow-sm transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md bg-white hover:bg-blue-50">
              <Share2 className="h-4 w-4 text-blue-600" />
              Partager
            </Button>
            
            <Button variant="outline" size="sm" className="flex items-center gap-2 px-4 py-2 rounded-full shadow-sm transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md bg-white hover:bg-blue-50">
              <ExternalLink className="h-4 w-4 text-blue-600" />
              Voir sur le site
            </Button>
            
            <Button variant="outline" size="sm" className="flex items-center gap-2 px-4 py-2 rounded-full shadow-sm transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md bg-white hover:bg-blue-50">
              <Printer className="h-4 w-4 text-blue-600" />
              Imprimer
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
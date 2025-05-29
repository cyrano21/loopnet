import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PropertySeedData } from "@/lib/seed-data";

interface PropertyGalleryProps {
  property: PropertySeedData;
}

export function PropertyGallery({ property }: PropertyGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const images = (property.images || []).filter(img => img && typeof img === 'string' && img.trim() !== '');

  const nextImage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevImage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };
  
  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  if (images.length === 0) {
    return (
      <Card className="p-6 mb-6">
        <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
          <span className="text-gray-500">Aucune image disponible</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 mb-6 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Image principale */}
        <div className="lg:col-span-3 relative">
          <div 
            className={`relative aspect-video rounded-lg overflow-hidden bg-gray-100 cursor-pointer ${
              isZoomed ? 'fixed inset-0 z-50 bg-black flex items-center justify-center p-8' : ''
            }`}
            onClick={toggleZoom}
          >
            <Image
              src={images[selectedImageIndex]}
              alt={`${property.title} - Image ${selectedImageIndex + 1}`}
              width={1200}
              height={675}
              className={`object-cover w-full h-full transition-all duration-500 ${
                isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
              } ${isZoomed ? 'object-contain max-h-screen' : 'object-cover'}`}
              priority
            />
            
            {/* Contrôles de navigation */}
            {images.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
            
            {/* Bouton plein écran */}
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 right-2 bg-white/80 hover:bg-white hover:scale-110 transition-transform"
              onClick={(e) => {
                e.stopPropagation();
                toggleZoom();
              }}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
            
            {/* Indicateur d'image avec animation */}
            <div className="absolute bottom-2 left-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md transform hover:scale-105 transition-all">
              {selectedImageIndex + 1} / {images.length}
            </div>
          </div>
        </div>
        
        {/* Miniatures */}
        <div className="lg:col-span-1">
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 max-h-96 overflow-y-auto scrollbar-thumb-blue-500 scrollbar-track-gray-100 scrollbar-thin">
            {images.slice(0, 8).map((image, index) => (
              <div
                key={index}
                className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer transition-all transform hover:scale-105 ${
                  index === selectedImageIndex
                    ? "border-2 border-blue-500 ring-2 ring-blue-300 shadow-md"
                    : "border border-gray-200 hover:border-blue-300 hover:shadow"
                }`}
                onClick={() => setSelectedImageIndex(index)}
              >
                <Image
                  src={image}
                  alt={`${property.title} - Miniature ${index + 1}`}
                  width={200}
                  height={150}
                  className={`object-cover w-full h-full ${
                    index === selectedImageIndex ? 'filter-none' : 'filter brightness-90'
                  } transition-all duration-300`}
                />
                
                {/* Overlay pour les images supplémentaires avec animation */}
                {index === 7 && images.length > 8 && (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/70 to-indigo-800/70 flex items-center justify-center hover:from-blue-700/70 hover:to-indigo-900/70 transition-all duration-300">
                    <span className="text-white font-bold text-lg drop-shadow-md animate-pulse">
                      +{images.length - 8}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
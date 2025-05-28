import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { defaultImages } from '@/config/images';

type ImageWithFallbackProps = Omit<ImageProps, 'src'> & {
  src: string | null | undefined;
  fallbackType?: keyof typeof defaultImages;
  fallbackSubType?: string;
};

export function ImageWithFallback({
  src,
  alt,
  fallbackType = 'property',
  fallbackSubType,
  ...props
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState<string>('');

  useEffect(() => {
    // Si l'URL est valide, on l'utilise, sinon on utilise le fallback
    if (src) {
      // Vérifier si l'image existe
      const img = new window.Image();
      img.src = src;
      
      img.onload = () => {
        // L'image existe, on l'utilise
        setImgSrc(src);
      };
      
      img.onerror = () => {
        // En cas d'erreur, on utilise l'image de fallback
        setImgSrc(getFallbackImage(fallbackType, fallbackSubType));
      };
    } else {
      // Si pas d'URL, on utilise directement le fallback
      setImgSrc(getFallbackImage(fallbackType, fallbackSubType));
    }
  }, [src, fallbackType, fallbackSubType]);

  // Fonction pour obtenir l'image de fallback appropriée
  const getFallbackImage = (type: string, subType?: string): string => {
    const typeImages = defaultImages[type as keyof typeof defaultImages];
    
    if (typeof typeImages === 'object' && typeImages !== null) {
      // Si un sous-type est spécifié et qu'il existe dans les images de ce type
      if (subType && subType in typeImages) {
        return typeImages[subType as keyof typeof typeImages];
      }
      // Sinon, on utilise l'image par défaut pour ce type
      return typeImages.default || defaultImages.placeholder;
    }
    
    // Fallback général
    return defaultImages.placeholder;
  };

  return (
    <Image
      src={imgSrc || defaultImages.placeholder}
      alt={alt || 'Image non disponible'}
      onError={(e) => {
        // En cas d'erreur lors du chargement, on utilise le fallback
        const target = e.target as HTMLImageElement;
        target.src = getFallbackImage(fallbackType, fallbackSubType);
      }}
      {...props}
    />
  );
}

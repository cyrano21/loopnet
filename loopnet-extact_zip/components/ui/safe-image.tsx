import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { getPlaceholderImage } from '@/lib/image-utils';

interface SafeImageProps extends Omit<ImageProps, 'onError' | 'src'> {
  src?: string | null;
  fallbackSrc?: string;
  type?: keyof typeof import('@/config/images').defaultImages;
  subType?: string;
}

export function SafeImage({ 
  src, 
  alt, 
  fallbackSrc, 
  type = 'property',
  subType,
  className = '',
  ...props 
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  // Déterminer l'image de secours à utiliser
  const getFallbackImage = () => {
    if (fallbackSrc) return fallbackSrc;
    return getPlaceholderImage(type, subType);
  };

  // Mettre à jour l'image source quand elle change
  useEffect(() => {
    if (src) {
      setImgSrc(src);
      setHasError(false);
    } else {
      setImgSrc(getFallbackImage());
    }
  }, [src, type, subType]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(getFallbackImage());
    }
  };

  // Si aucune source n'est fournie, utiliser directement l'image de secours
  if (!src) {
    return (
      <Image
        {...props}
        src={getFallbackImage()}
        alt={alt || 'Placeholder image'}
        className={`${className} bg-gray-100`}
      />
    );
  }

  return (
    <Image
      {...props}
      src={imgSrc || getFallbackImage()}
      alt={alt || 'Property image'}
      onError={handleError}
      className={`${className} ${hasError ? 'bg-gray-100' : ''}`}
      onLoadingComplete={(result) => {
        if (result.naturalWidth === 0) {
          // Image chargée mais invalide (0x0)
          handleError();
        }
      }}
    />
  );
}

import Image, { ImageProps } from 'next/image';
import React from 'react';

interface CompanyLogoProps extends Omit<ImageProps, 'onError'> {
  name: string;
}

export function CompanyLogo({ name, ...props }: CompanyLogoProps) {
  const handleError = (e: React.FormEvent<HTMLImageElement>) => {
    const target = e.currentTarget as HTMLImageElement;
    target.style.display = 'none';
    const fallback = target.nextElementSibling as HTMLElement;
    if (fallback) fallback.style.display = 'block';
  };

  return (
    <div className="flex-shrink-0 w-36 h-20 bg-white dark:bg-slate-800 rounded-lg shadow-md flex items-center justify-center p-4 transition-all duration-300 hover:shadow-xl hover:scale-105 grayscale hover:grayscale-0 opacity-75 hover:opacity-100 dark:opacity-60 dark:hover:opacity-100"
         title={name}>
      <Image
        {...props}
        alt={`${name} logo`}
        className="object-contain max-w-full max-h-full"
        onError={handleError}
      />
      <span className="text-sm font-medium text-slate-600 dark:text-slate-400 text-center hidden">
        {name}
      </span>
    </div>
  );
}

import Image, { ImageProps } from 'next/image';
import { SyntheticEvent } from 'react';

interface CompanyLogoItemProps extends Omit<ImageProps, 'onError'> {
  name: string;
}

export function CompanyLogoItem({ name, ...props }: CompanyLogoItemProps) {
  const handleError = (e: SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget as HTMLImageElement;
    target.style.display = 'none';
    const fallback = target.nextElementSibling as HTMLElement;
    if (fallback) {
      fallback.style.display = 'flex';
      fallback.classList.remove('hidden');
    }
  };

  return (
    <div className="flex-shrink-0 w-40 h-24 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-center p-5 transition-all duration-500 group/logo hover:shadow-2xl hover:scale-110 hover:-translate-y-2 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 dark:opacity-50 dark:hover:opacity-100 cursor-pointer relative overflow-hidden">
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent opacity-0 group-hover/logo:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
      
      {/* Premium border glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-transparent opacity-0 group-hover/logo:opacity-100 transition-opacity duration-500 blur-sm"></div>
      
      <Image
        {...props}
        alt={`${name} logo`}
        className="object-contain max-w-full max-h-full relative z-10 transition-transform duration-300 group-hover/logo:scale-105"
        onError={handleError}
      />
      <div 
        className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-slate-700 dark:text-slate-300 text-center hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600"
        style={{ display: 'none' }}
      >
        {name}
      </div>
    </div>
  );
}

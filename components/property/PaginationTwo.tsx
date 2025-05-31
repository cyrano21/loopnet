'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationTwoProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export default function PaginationTwo({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  totalItems, 
  itemsPerPage 
}: PaginationTwoProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
      {/* Informations sur les résultats */}
      <div className="text-sm text-gray-600">
        Affichage de {startItem} à {endItem} sur {totalItems} résultats
      </div>

      {/* Navigation pagination */}
      <div className="flex items-center gap-1">
        {/* Bouton Précédent */}
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            currentPage === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Précédent
        </button>

        {/* Numéros de page */}
        <div className="flex items-center gap-1 mx-2">
          {getVisiblePages().map((page, index) => (
            <div key={index}>
              {page === '...' ? (
                <span className="px-3 py-2 text-gray-500">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Bouton Suivant */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            currentPage === totalPages
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Suivant
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>

      {/* Navigation rapide (optionnelle) */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Aller à la page:</span>
        <input
          type="number"
          min="1"
          max={totalPages}
          value={currentPage}
          onChange={(e) => {
            const page = parseInt(e.target.value);
            if (page >= 1 && page <= totalPages) {
              onPageChange(page);
            }
          }}
          className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <span className="text-sm text-gray-600">sur {totalPages}</span>
      </div>
    </div>
  );
}

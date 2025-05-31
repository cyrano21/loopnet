'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';

interface ListingStatusProps {
  onStatusChange: (status: string[]) => void;
  selectedStatuses: string[];
}

export default function ListingStatus({ onStatusChange, selectedStatuses }: ListingStatusProps) {
  const statusOptions = [
    { value: 'for_sale', label: 'À vendre' },
    { value: 'for_rent', label: 'À louer' },
    { value: 'pending', label: 'En attente' },
    { value: 'sold', label: 'Vendu' },
    { value: 'coming_soon', label: 'Bientôt disponible' }
  ];

  const handleStatusToggle = (status: string) => {
    if (selectedStatuses.includes(status)) {
      onStatusChange(selectedStatuses.filter(s => s !== status));
    } else {
      onStatusChange([...selectedStatuses, status]);
    }
  };

  return (
    <div className="listing-status-filter">
      <h6 className="text-lg font-semibold mb-3">Statut de l'annonce</h6>
      <div className="space-y-2">
        {statusOptions.map((option) => (
          <label key={option.value} className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={selectedStatuses.includes(option.value)}
              onChange={() => handleStatusToggle(option.value)}
              className="mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

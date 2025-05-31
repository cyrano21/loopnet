'use client';

interface BathroomProps {
  onBathroomChange: (bathrooms: number[]) => void;
  selectedBathrooms: number[];
}

export default function Bathroom({ onBathroomChange, selectedBathrooms }: BathroomProps) {
  const bathroomOptions = [
    { value: 1, label: '1 salle de bain' },
    { value: 2, label: '2 salles de bain' },
    { value: 3, label: '3 salles de bain' },
    { value: 4, label: '4+ salles de bain' }
  ];

  const handleBathroomToggle = (bathroom: number) => {
    if (selectedBathrooms.includes(bathroom)) {
      onBathroomChange(selectedBathrooms.filter(b => b !== bathroom));
    } else {
      onBathroomChange([...selectedBathrooms, bathroom]);
    }
  };

  return (
    <div className="bathroom-filter">
      <h6 className="text-lg font-semibold mb-3">Salles de bain</h6>
      <div className="grid grid-cols-1 gap-2">
        {bathroomOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleBathroomToggle(option.value)}
            className={`px-3 py-2 text-sm border rounded-md transition-colors text-left ${
              selectedBathrooms.includes(option.value)
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      
      {selectedBathrooms.length > 0 && (
        <div className="mt-3">
          <button
            onClick={() => onBathroomChange([])}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Effacer la sélection
          </button>
        </div>
      )}
    </div>
  );
}

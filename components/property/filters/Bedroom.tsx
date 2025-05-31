'use client';

interface BedroomProps {
  onBedroomChange: (bedrooms: number[]) => void;
  selectedBedrooms: number[];
}

export default function Bedroom({ onBedroomChange, selectedBedrooms }: BedroomProps) {
  const bedroomOptions = [
    { value: 0, label: 'Studio' },
    { value: 1, label: '1 chambre' },
    { value: 2, label: '2 chambres' },
    { value: 3, label: '3 chambres' },
    { value: 4, label: '4 chambres' },
    { value: 5, label: '5+ chambres' }
  ];

  const handleBedroomToggle = (bedroom: number) => {
    if (selectedBedrooms.includes(bedroom)) {
      onBedroomChange(selectedBedrooms.filter(b => b !== bedroom));
    } else {
      onBedroomChange([...selectedBedrooms, bedroom]);
    }
  };

  return (
    <div className="bedroom-filter">
      <h6 className="text-lg font-semibold mb-3">Chambres</h6>
      <div className="grid grid-cols-2 gap-2">
        {bedroomOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleBedroomToggle(option.value)}
            className={`px-3 py-2 text-sm border rounded-md transition-colors ${
              selectedBedrooms.includes(option.value)
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      
      {selectedBedrooms.length > 0 && (
        <div className="mt-3">
          <button
            onClick={() => onBedroomChange([])}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Effacer la sélection
          </button>
        </div>
      )}
    </div>
  );
}

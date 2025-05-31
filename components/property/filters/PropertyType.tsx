'use client';

interface PropertyTypeProps {
  onTypeChange: (types: string[]) => void;
  selectedTypes: string[];
}

export default function PropertyType({ onTypeChange, selectedTypes }: PropertyTypeProps) {
  const propertyTypes = [
    { value: 'house', label: 'Maison', count: 245 },
    { value: 'apartment', label: 'Appartement', count: 189 },
    { value: 'condo', label: 'Condominium', count: 76 },
    { value: 'townhouse', label: 'Maison de ville', count: 42 },
    { value: 'villa', label: 'Villa', count: 38 },
    { value: 'studio', label: 'Studio', count: 24 },
    { value: 'loft', label: 'Loft', count: 15 },
    { value: 'penthouse', label: 'Penthouse', count: 8 }
  ];

  const handleTypeToggle = (type: string) => {
    if (selectedTypes.includes(type)) {
      onTypeChange(selectedTypes.filter(t => t !== type));
    } else {
      onTypeChange([...selectedTypes, type]);
    }
  };

  return (
    <div className="property-type-filter">
      <h6 className="text-lg font-semibold mb-3">Type de propriété</h6>
      <div className="space-y-2">
        {propertyTypes.map((type) => (
          <label key={type.value} className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selectedTypes.includes(type.value)}
                onChange={() => handleTypeToggle(type.value)}
                className="mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">{type.label}</span>
            </div>
            <span className="text-gray-500 text-sm">({type.count})</span>
          </label>
        ))}
      </div>
    </div>
  );
}

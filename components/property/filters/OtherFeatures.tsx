'use client';

interface OtherFeaturesProps {
  onFeaturesChange: (features: string[]) => void;
  selectedFeatures: string[];
}

export default function OtherFeatures({ onFeaturesChange, selectedFeatures }: OtherFeaturesProps) {
  const featureCategories = [
    {
      title: 'Équipements intérieurs',
      features: [
        { value: 'fireplace', label: 'Cheminée' },
        { value: 'balcony', label: 'Balcon' },
        { value: 'terrace', label: 'Terrasse' },
        { value: 'air_conditioning', label: 'Climatisation' },
        { value: 'elevator', label: 'Ascenseur' },
        { value: 'storage', label: 'Cave/Rangement' }
      ]
    },
    {
      title: 'Équipements extérieurs',
      features: [
        { value: 'garden', label: 'Jardin' },
        { value: 'pool', label: 'Piscine' },
        { value: 'garage', label: 'Garage' },
        { value: 'parking', label: 'Parking' },
        { value: 'security', label: 'Sécurité' }
      ]
    },
    {
      title: 'Caractéristiques spéciales',
      features: [
        { value: 'new_construction', label: 'Construction neuve' },
        { value: 'luxury', label: 'Luxe' },
        { value: 'furnished', label: 'Meublé' },
        { value: 'pets_allowed', label: 'Animaux autorisés' },
        { value: 'accessible', label: 'Accessible PMR' }
      ]
    }
  ];

  const handleFeatureToggle = (feature: string) => {
    if (selectedFeatures.includes(feature)) {
      onFeaturesChange(selectedFeatures.filter(f => f !== feature));
    } else {
      onFeaturesChange([...selectedFeatures, feature]);
    }
  };

  return (
    <div className="other-features-filter">
      <h6 className="text-lg font-semibold mb-3">Autres caractéristiques</h6>
      
      {featureCategories.map((category, categoryIndex) => (
        <div key={categoryIndex} className="mb-6">
          <h6 className="text-sm font-medium mb-2 text-gray-600">{category.title}</h6>
          <div className="space-y-2">
            {category.features.map((feature) => (
              <label key={feature.value} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedFeatures.includes(feature.value)}
                  onChange={() => handleFeatureToggle(feature.value)}
                  className="mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">{feature.label}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {/* Caractéristiques sélectionnées */}
      {selectedFeatures.length > 0 && (
        <div className="border-t pt-3">
          <h6 className="text-sm font-medium mb-2">Caractéristiques sélectionnées</h6>
          <div className="flex flex-wrap gap-2">
            {selectedFeatures.map((feature) => {
              const featureLabel = featureCategories
                .flatMap(cat => cat.features)
                .find(f => f.value === feature)?.label || feature;
              
              return (
                <span
                  key={feature}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800"
                >
                  {featureLabel}
                  <button
                    onClick={() => handleFeatureToggle(feature)}
                    className="ml-1 hover:text-green-600"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
          <button
            onClick={() => onFeaturesChange([])}
            className="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            Effacer toutes les caractéristiques
          </button>
        </div>
      )}
    </div>
  );
}

import { User, Droplets, ParkingCircle, Calendar, Home, MapPin, Building, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PropertySeedData } from "@/lib/seed-data";

interface PropertyOverviewProps {
  property: PropertySeedData;
}

export function PropertyOverview({ property }: PropertyOverviewProps) {
  const overviewItems = [
    {
      icon: Home,
      label: "Surface",
      value: `${property.surface} m²`,
      color: "text-blue-600"
    },
    {
      icon: User,
      label: "Chambres",
      value: property.bedrooms || "N/A",
      color: "text-green-600"
    },
    {
      icon: Droplets,
      label: "Salles de bain",
      value: property.bathrooms || "N/A",
      color: "text-purple-600"
    },
    {
      icon: ParkingCircle,
      label: "Parking",
      value: property.parking || "N/A",
      color: "text-orange-600"
    },
    {
      icon: Calendar,
      label: "Année de construction",
      value: property.yearBuilt?.toString() || "N/A",
      color: "text-red-600"
    },
    {
      icon: Building,
      label: "Type de propriété",
      value: "Studio étudiant",
      color: "text-indigo-600"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Description avec animation */}
      <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in-up">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <div className="p-2 bg-blue-600 rounded-full animate-float">
              <Home className="h-5 w-5 text-white" />
            </div>
            Description de la propriété
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-gray-700 leading-relaxed text-lg">
            {property.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {property.tags?.map((tag, index) => (
              <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Aperçu des caractéristiques avec animations */}
      <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in-up animation-delay-200">
        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
          <CardTitle className="text-gray-800">Caractéristiques principales</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {overviewItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="group flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                  <div className={`p-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">{item.label}</p>
                    <p className="font-bold text-gray-900 text-lg">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Informations de localisation avec animation */}
      <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in-up animation-delay-400">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <div className="p-2 bg-purple-600 rounded-full animate-float animation-delay-1000">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            Localisation
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100 hover:border-blue-200 transition-colors">
                <p className="text-sm font-medium text-gray-600 mb-1">Adresse complète</p>
                <p className="font-semibold text-gray-900">{property.address}</p>
                <p className="text-gray-700">{property.city}, {property.postalCode}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-lg border border-green-100 hover:border-green-200 transition-colors">
                <p className="text-sm font-medium text-gray-600 mb-1">Quartier</p>
                <p className="font-semibold text-gray-900">Quartier universitaire</p>
                <p className="text-gray-700">Zone dynamique et étudiante</p>
              </div>
            </div>
            
            {/* Ajout d'informations sur les transports */}
            <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="6" width="18" height="12" rx="2" />
                  <circle cx="8" cy="12" r="2" />
                  <circle cx="16" cy="12" r="2" />
                  <path d="M7 6V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
                </svg>
                Transports en commun
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="text-center p-2 bg-white rounded-md shadow-sm">
                  <p className="text-sm font-medium text-gray-600">Métro</p>
                  <p className="font-bold text-amber-700">5 min</p>
                </div>
                <div className="text-center p-2 bg-white rounded-md shadow-sm">
                  <p className="text-sm font-medium text-gray-600">Bus</p>
                  <p className="font-bold text-amber-700">2 min</p>
                </div>
                <div className="text-center p-2 bg-white rounded-md shadow-sm">
                  <p className="text-sm font-medium text-gray-600">Université</p>
                  <p className="font-bold text-amber-700">10 min</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statut et disponibilité */}
      <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in-up animation-delay-600">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <div className="p-2 bg-green-600 rounded-full animate-heartbeat">
              <Building className="h-5 w-5 text-white" />
            </div>
            Statut de la propriété
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Badge 
              variant="default"
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 text-sm font-semibold animate-pulse"
            >
              Disponible
            </Badge>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-600">
              Mis à jour le {new Date().toLocaleDateString('fr-FR')}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
              <p className="text-sm font-medium text-gray-600 mb-1">Adresse complète</p>
              <p className="font-semibold text-gray-900">{property.address}</p>
              <p className="text-gray-700">{property.city}, {property.postalCode}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100">
              <p className="text-sm font-medium text-gray-600 mb-1">Proximité</p>
              <p className="font-semibold text-gray-900">Campus universitaire</p>
              <p className="text-gray-700">À 5 minutes à pied</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
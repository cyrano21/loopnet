import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PropertySeedData } from "@/lib/seed-data";
import { Building, DollarSign, Calendar, Ruler, Hash } from "lucide-react";

interface PropertyDetailsProps {
  property: PropertySeedData;
}

export function PropertyDetails({ property }: PropertyDetailsProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const detailSections = [
    {
      title: "Informations financières",
      icon: DollarSign,
      items: [
        { label: "Prix de vente", value: formatPrice(property.price) },
        { label: "Prix par m²", value: formatPrice(property.price / property.surface) },
        { label: "Charges mensuelles", value: "À définir" },
        { label: "Taxe foncière", value: "À définir" }
      ]
    },
    {
      title: "Caractéristiques du bâtiment",
      icon: Building,
      items: [
        { label: "Type de propriété", value: property.type },
        { label: "Surface habitable", value: `${property.surface} m²` },
        { label: "Nombre de chambres", value: property.bedrooms?.toString() || "N/A" },
        { label: "Nombre de salles de bain", value: property.bathrooms?.toString() || "N/A" },
        { label: "Places de parking", value: property.parking?.toString() || "N/A" }
      ]
    },
    {
      title: "Informations techniques",
      icon: Ruler,
      items: [
        { label: "Année de construction", value: property.yearBuilt?.toString() || "N/A" },
        { label: "État du bien", value: "Bon état" },
        { label: "Orientation", value: "Sud-Ouest" },
        { label: "Étage", value: "Rez-de-chaussée" },
        { label: "Ascenseur", value: "Non" }
      ]
    },
    {
      title: "Informations légales",
      icon: Hash,
      items: [
        { label: "Référence", value: property.id },
        { label: "Statut", value: property.status },
        { label: "Date de mise en ligne", value: new Date().toLocaleDateString('fr-FR') },
        { label: "DPE", value: "C (150 kWh/m²/an)" },
        { label: "GES", value: "B (25 kg CO2/m²/an)" }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {detailSections.map((section, sectionIndex) => {
        const IconComponent = section.icon;
        return (
          <Card key={sectionIndex}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconComponent className="h-5 w-5" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">{item.label}</span>
                    <span className="font-semibold text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Diagnostic énergétique */}
      <Card>
        <CardHeader>
          <CardTitle>Diagnostic de performance énergétique</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Consommation énergétique</span>
                  <Badge variant="outline">C</Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-yellow-500 h-3 rounded-full" style={{ width: '40%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>A</span>
                  <span>G</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Émissions de GES</span>
                  <Badge variant="outline">B</Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-green-500 h-3 rounded-full" style={{ width: '25%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>A</span>
                  <span>G</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PropertySeedData } from "@/lib/seed-data";
import { toast } from "sonner";
import { Eye, Heart, Phone, Globe, Mail, MessageSquare } from "lucide-react";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { PropertyOverview } from "@/components/property/PropertyOverview";
import { PropertyDetails } from "@/components/property/PropertyDetails";
import { PropertyFeatures } from "@/components/property/PropertyFeatures";
import { PropertyReviews } from "@/components/property/PropertyReviews";
import { PropertySidebar } from "@/components/property/PropertySidebar";
import { PropertyAddress } from "@/components/property/PropertyAddress";
import { PropertyVideo } from "@/components/property/PropertyVideo";
import { PropertyNearby } from "@/components/property/PropertyNearby";
import { VirtualTour360 } from "@/components/property/VirtualTour360";
import { WalkScore } from "@/components/property/WalkScore";
import { MortgageCalculator } from "@/components/property/MortgageCalculator";
import { EnergyClass } from "@/components/property/EnergyClass";
import { FloorPlans } from "@/components/property/FloorPlans";
import { HomeValueChart } from "@/components/property/HomeValueChart";
import { NearbySimilarProperty } from "@/components/property/NearbySimilarProperty";
import { PropertyViews } from "@/components/property/PropertyViews";

interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  surface: number;
  propertyType: string;
  transactionType: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  images: Array<{
    url: string;
    alt?: string;
    isPrimary?: boolean;
  }>;
  features: {
    bedrooms?: number;
    bathrooms?: number;
    parking?: number;
    yearBuilt?: number;
    lotSize?: number;
  };
  amenities: string[];
  status: string;
  views: number;
  favorites: number;
  inquiries: number;
  pricePerSqm: number;
  agent: {
    name: string;
    phone: string;
    email: string;
    company: string;
    image?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const router = useRouter();

  // Unwrap the params object using React.use()
  const unwrappedParams = use(params) as { id: string };

  const [property, setProperty] = useState<PropertySeedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (unwrappedParams.id) {
      fetchProperty(unwrappedParams.id as string);
    }
  }, [unwrappedParams.id]);

  const fetchProperty = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/properties/${id}`);
      if (!response.ok) {
        throw new Error("Property not found");
      }
      const data = await response.json();
      setProperty(data.property);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!property) return;

    try {
      setIsFavorite(!isFavorite);
      toast(isFavorite ? "Retiré des favoris" : "Ajouté aux favoris");
    } catch (error) {
      toast("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  const formatPrice = (price: number, transactionType: string) => {
    const formatted = new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(price);
    return transactionType === "rent" ? `${formatted}/mois` : formatted;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de la propriété...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Propriété non trouvée
          </h1>
          <p className="text-gray-600 mb-8">
            {error || "Cette propriété n'existe pas ou a été supprimée."}
          </p>
        </div>
      </div>
    );
  }

  const primaryImage =
    property.images?.find((img: any) => img.isPrimary) || property.images?.[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête de la propriété */}
        <PropertyHeader
          property={property}
          isFavorite={isFavorite}
          onFavoriteToggle={handleFavoriteToggle}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Images et détails principaux */}
          <div className="lg:col-span-2 space-y-6">
            {/* Galerie d'images */}
            <PropertyGallery property={property} />

            {/* Contenu avec onglets */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-8">
                <TabsTrigger value="overview">Aperçu</TabsTrigger>
                <TabsTrigger value="details">Détails</TabsTrigger>
                <TabsTrigger value="features">Équipements</TabsTrigger>
                <TabsTrigger value="location">Localisation</TabsTrigger>
                <TabsTrigger value="media">Médias</TabsTrigger>
                <TabsTrigger value="energy">Énergie</TabsTrigger>
                <TabsTrigger value="stats">Statistiques</TabsTrigger>
                <TabsTrigger value="reviews">Avis</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <PropertyOverview property={property} />
              </TabsContent>

              <TabsContent value="details">
                <div className="space-y-6">
                  <PropertyDetails property={property} />
                  <FloorPlans property={property} />
                </div>
              </TabsContent>

              <TabsContent value="features">
                <PropertyFeatures property={property} />
              </TabsContent>

              <TabsContent value="location">
                <div className="space-y-6">
                  <PropertyAddress property={property} />
                  <WalkScore property={property} />
                  <PropertyNearby property={property} />
                </div>
              </TabsContent>

              <TabsContent value="media">
                <div className="space-y-6">
                  <PropertyVideo property={property} />
                  <VirtualTour360 property={property} />
                </div>
              </TabsContent>

              <TabsContent value="energy">
                <EnergyClass property={property} />
              </TabsContent>

              <TabsContent value="stats">
                <PropertyViews property={property} />
              </TabsContent>

              <TabsContent value="reviews">
                <PropertyReviews property={property} />
              </TabsContent>
            </Tabs>

            {/* Mortgage Calculator Section */}
            <div className="mt-8">
              <MortgageCalculator property={property} />
            </div>

            {/* Home Value Chart Section */}
            <div className="mt-8">
              <HomeValueChart property={property} />
            </div>

            {/* Nearby Similar Properties Section */}
            <div className="mt-8">
              <NearbySimilarProperty property={property} />
            </div>
          </div>

          {/* Enhanced Sidebar */}
          <PropertySidebar property={property} />
        </div>
      </div>
    </div>
  );
}

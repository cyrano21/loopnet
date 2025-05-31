"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Property } from "@/types/property";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Heart,
  GitCompare,
  Phone,
  Mail,
  Eye,
  Lock,
  Zap,
  Star,
  Building2,
  Store,
  Factory,
  Landmark,
  Home,
  Users,
  Sparkles,
} from "lucide-react";
import { usePermissions } from "@/hooks/use-permissions";
import { useFavorites } from "@/hooks/use-favorites";
import { useComparison } from "@/components/comparison-provider";
import { PricingModal } from "./pricing-modals";
import { toast } from "sonner";
import { getBestImageUrl } from "@/lib/image-utils";
import { getPropertyImageUrl } from "@/lib/property-image-utils";
import { cn } from "@/lib/utils";

// Interface PropertyCardMobileProps
interface PropertyCardMobileProps {
  property: Property;
  onAddToComparison?: (property: Property) => void;
  isInComparison?: boolean;
  className?: string;
  compact?: boolean;
}

// Fonction de formatage de prix locale
const formatPriceInternal = (
  price: number,
  transactionType: string
): string => {
  const isRental =
    transactionType?.toLowerCase().includes("rent") ||
    transactionType?.toLowerCase().includes("lease");

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: isRental && price < 10000 ? 2 : 0,
  });
  let formatted = formatter.format(price);
  return formatted;
};

// Icônes pour les types de propriété
const propertyTypeIcons: Record<string, React.ReactNode> = {
  Office: <Building2 className="w-3 h-3" />,
  Retail: <Store className="w-3 h-3" />,
  Commerce: <Landmark className="w-3 h-3" />,
  Industrial: <Factory className="w-3 h-3" />,
  Land: <Square className="w-3 h-3" />,
  Residential: <Home className="w-3 h-3" />,
  Coworking: <Users className="w-3 h-3" />,
  Restaurant: <Landmark className="w-3 h-3" />,
  Medical: <Heart className="w-3 h-3" />,
  Flex: <Zap className="w-3 h-3" />,
  Default: <Building2 className="w-3 h-3" />,
};

export function PropertyCardMobile({
  property,
  onAddToComparison,
  isInComparison,
  className,
  compact = false,
}: PropertyCardMobileProps) {
  const { can, requiresUpgrade, userRole } = usePermissions();
  const { addToFavorites, removeFromFavorites, favorites } = useFavorites();
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [pricingType, setPricingType] = useState<
    "simple" | "premium" | "agent"
  >("premium");
  const [isFavoritedState, setIsFavoritedState] = useState(false);

  // Mise à jour de l'état des favoris
  useEffect(() => {
    if (favorites && property?._id) {
      setIsFavoritedState(
        favorites.some((fav) =>
          typeof fav === "object" && fav !== null
            ? fav._id === property._id
            : fav === property._id
        )
      );
    }
  }, [favorites, property?._id]);

  const priceDisplay = formatPriceInternal(
    property.price,
    property.transactionType
  );

  // Gestionnaires d'événements
  const handleFavorite = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!can("canAddFavorites")) {
      const upgradePlan = requiresUpgrade("canAddFavorites");
      if (upgradePlan && typeof upgradePlan === "string") {
        setPricingType(upgradePlan as "simple" | "premium" | "agent");
        setShowPricingModal(true);
      } else {
        toast.info("Connexion ou mise à niveau requise pour les favoris.");
      }
      return;
    }

    try {
      if (isFavoritedState) {
        await removeFromFavorites(property._id);
        toast.success("Retiré des favoris.");
      } else {
        await addToFavorites(property._id);
        toast.success("Ajouté aux favoris.");
      }
    } catch (error) {
      toast.error("Erreur de mise à jour des favoris.");
      console.error("Fav Error:", error);
    }
  };

  const comparisonHook = useComparison();
  const {
    addToComparison: hookAddToComparison,
    removeFromComparison,
    comparisonList,
  } = comparisonHook;

  // Utiliser les props si disponibles, sinon utiliser le hook
  const finalAddToComparison = onAddToComparison || hookAddToComparison;
  const isInComparisonList =
    isInComparison !== undefined
      ? isInComparison
      : comparisonList.some((p: Property) => p._id === property._id);

  const handleCompare = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!can("canCompareProperties")) {
      const upgrade = requiresUpgrade("canCompareProperties");
      if (upgrade && typeof upgrade === "string") {
        setPricingType(upgrade as "simple" | "premium" | "agent");
        setShowPricingModal(true);
      } else {
        toast.info("Mise à niveau requise pour comparer.");
      }
      return;
    }

    if (isInComparisonList) {
      removeFromComparison(property._id);
      toast.success("Propriété retirée de la comparaison");
    } else {
      finalAddToComparison(property as any);
      toast.success("Propriété ajoutée à la comparaison");
    }
  };

  const handleViewDetailsClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!can("canViewPropertyDetails")) {
      const upgradePlan = requiresUpgrade("canViewPropertyDetails");
      if (upgradePlan && typeof upgradePlan === "string") {
        setPricingType(upgradePlan as "simple" | "premium" | "agent");
        setShowPricingModal(true);
      } else {
        toast.info("Mise à niveau ou connexion requise.");
      }
      return;
    }

    window.location.href = `/property/${property.slug || property._id}`;
  };

  const imageResult = getBestImageUrl(property.images, property.propertyType);
  const imageUrl =
    imageResult?.url ||
    getPropertyImageUrl(property);
  const imageAlt =
    property.images?.find((img) => img.isPrimary)?.alt ||
    property.images?.[0]?.alt ||
    property.title;

  const canActuallyViewDetails = can("canViewPropertyDetails");
  const upgradeNeededForDetails = requiresUpgrade("canViewPropertyDetails");
  const showDetailsRestriction =
    !canActuallyViewDetails && !!upgradeNeededForDetails;

  const propertyIcon =
    propertyTypeIcons[property.propertyType] || propertyTypeIcons["Default"];
  const isNewListing =
    property.publishedAt &&
    new Date(property.publishedAt) >
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  return (
    <>
      <Card
        className={cn(
          "overflow-hidden group transition-all duration-300 ease-out flex flex-col h-full transform hover:scale-[1.02]",
          "border border-slate-200/80 dark:border-slate-700/60 rounded-lg shadow-sm hover:shadow-md",
          compact ? "text-xs" : "text-sm",
          property.isPremium && "border-amber-300/50 dark:border-amber-700/70",
          isNewListing && "ring-1 ring-blue-400/30 dark:ring-blue-500/20",
          className
        )}
      >
        <CardHeader className="p-0 relative">
          <Link
            href={`/property/${property.slug || property._id}`}
            className={cn(
              "block relative overflow-hidden rounded-t-lg group/image",
              compact ? "aspect-[4/3]" : "aspect-[3/2]"
            )}
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
              if (!canActuallyViewDetails) {
                e.preventDefault();
                handleViewDetailsClick();
              }
            }}
          >
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-cover transition-all duration-500 ease-out group-hover/image:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              quality={75}
              priority={false}
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                (
                  e.target as HTMLImageElement
                ).src = `https://via.placeholder.com/300x200/EEEEEE/CCCCCC?text=Image+Error`;
              }}
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover/image:opacity-80 transition-opacity duration-300 rounded-t-lg"></div>
            
            {/* Actions en overlay */}
            <div className="absolute top-1 right-1 flex gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={handleFavorite}
                className={cn(
                  "h-6 w-6 rounded-full transition-all duration-200 shadow-sm",
                  isFavoritedState
                    ? "bg-red-100 dark:bg-red-900/60 border-red-300 dark:border-red-600 text-red-600 dark:text-red-400"
                    : "bg-white/90 hover:bg-white dark:bg-slate-800/90 dark:hover:bg-slate-800 border-white/60 dark:border-slate-700/60"
                )}
                aria-label={isFavoritedState ? "Retirer des favoris" : "Ajouter aux favoris"}
              >
                <Heart
                  className={cn(
                    "h-3 w-3",
                    isFavoritedState ? "fill-current text-red-600" : "text-slate-600"
                  )}
                />
              </Button>
              
              {onAddToComparison && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCompare}
                  className={cn(
                    "h-6 w-6 rounded-full transition-all duration-200 shadow-sm",
                    isInComparisonList
                      ? "bg-blue-100 dark:bg-blue-900/60 border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400"
                      : "bg-white/90 hover:bg-white dark:bg-slate-800/90 dark:hover:bg-slate-800 border-white/60 dark:border-slate-700/60"
                  )}
                  aria-label={
                    isInComparisonList
                      ? "Retirer de la comparaison"
                      : "Ajouter à la comparaison"
                  }
                >
                  <GitCompare
                    className={cn(
                      "h-3 w-3",
                      isInComparisonList ? "text-blue-600" : "text-slate-600"
                    )}
                  />
                </Button>
              )}
            </div>
            
            {/* Badges */}
            <div className="absolute top-1 left-1 flex flex-col gap-1">
              {property.isPremium === true && (
                <Badge
                  variant="default"
                  className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 shadow-sm text-xs px-1.5 py-0.5 font-bold rounded-full"
                >
                  <Sparkles className="w-2 h-2 mr-1 fill-current" />
                  {compact ? "P" : "Premium"}
                </Badge>
              )}
              {isNewListing && (
                <Badge
                  variant="default"
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-sm text-xs px-1.5 py-0.5 font-bold rounded-full"
                >
                  <Star className="w-2 h-2 mr-1 fill-current" />
                  {compact ? "N" : "Nouveau"}
                </Badge>
              )}
            </div>
            
            {/* Prix en overlay */}
            <div className="absolute bottom-1 left-1">
              <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-md px-2 py-1 shadow-sm">
                <div className={cn(
                  "font-bold text-blue-600 dark:text-blue-400",
                  compact ? "text-xs" : "text-sm"
                )}>
                  {property.price ? `${priceDisplay}` : 'Prix sur demande'}
                  {property.transactionType === 'forLease' && (
                    <span className="text-xs font-normal text-slate-500 dark:text-slate-400">/mois</span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        </CardHeader>
        
        <CardContent className={cn("flex-1 p-2", compact && "p-1.5")}>
          <div className="space-y-1">
            {/* Titre et type */}
            <div className="flex items-start justify-between gap-1">
              <h3 className={cn(
                "font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 leading-tight",
                compact ? "text-xs" : "text-sm"
              )}>
                {property.title}
              </h3>
              <Badge variant="secondary" className={cn(
                "flex-shrink-0 text-xs px-1.5 py-0.5",
                compact && "text-xs px-1 py-0.5"
              )}>
                {propertyIcon}
                <span className="ml-1 hidden sm:inline">
                  {property.propertyType}
                </span>
              </Badge>
            </div>
            
            {/* Adresse */}
            <p className={cn(
              "text-slate-600 dark:text-slate-400 flex items-center gap-1 line-clamp-1",
              compact ? "text-xs" : "text-xs"
            )}>
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{property.address}</span>
            </p>
            
            {/* Caractéristiques */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                {property.surface && (
                  <div className="flex items-center gap-0.5">
                    <Square className="h-3 w-3" />
                    <span className={compact ? "text-xs" : "text-xs"}>
                      {property.surface}m²
                    </span>
                  </div>
                )}
                {property.rooms && (
                  <div className="flex items-center gap-0.5">
                    <Bed className="h-3 w-3" />
                    <span className={compact ? "text-xs" : "text-xs"}>
                      {property.rooms}
                    </span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-0.5">
                    <Bath className="h-3 w-3" />
                    <span className={compact ? "text-xs" : "text-xs"}>
                      {property.bathrooms}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Badges de statut */}
              <div className="flex gap-1">
                {property.featured && (
                  <Badge className="bg-yellow-100 text-yellow-800 text-xs px-1 py-0.5">
                    <Star className="h-2 w-2" />
                  </Badge>
                )}
                {property.verified && (
                  <Badge className="bg-green-100 text-green-800 text-xs px-1 py-0.5">
                    ✓
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {showPricingModal && (
        <PricingModal
          isOpen={showPricingModal}
          onClose={() => setShowPricingModal(false)}
          planType={pricingType}
        />
      )}
    </>
  );
}
// components/property-card-clean.tsx
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Interface PropertyCardProps utilisant le type Property centralisé
interface PropertyCardProps {
  property: Property;
  onAddToComparison?: (property: Property) => void;
  isInComparison?: boolean;
  className?: string;
  compact?: boolean; // Nouvelle prop pour l'affichage compact mobile
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
  // Pas besoin d'ajouter le suffixe ici car il sera ajouté séparément dans le rendu
  return formatted;
};

// Icônes pour les types de propriété
const propertyTypeIcons: Record<string, React.ReactNode> = {
  Office: <Building2 className="w-3.5 h-3.5" />,
  Retail: <Store className="w-3.5 h-3.5" />,
  Commerce: <Landmark className="w-3.5 h-3.5" />,
  Industrial: <Factory className="w-3.5 h-3.5" />,
  Land: <Square className="w-3.5 h-3.5" />,
  Residential: <Home className="w-3.5 h-3.5" />,
  Coworking: <Users className="w-3.5 h-3.5" />,
  Restaurant: <Landmark className="w-3.5 h-3.5" />,
  Medical: <Heart className="w-3.5 h-3.5" />,
  Flex: <Zap className="w-3.5 h-3.5" />,
  Default: <Building2 className="w-3.5 h-3.5" />,
};

export function PropertyCard({
  property,
  onAddToComparison,
  isInComparison,
  className,
  compact = false,
}: PropertyCardProps) {
  const { can, requiresUpgrade, userRole } = usePermissions();
  const { addToFavorites, removeFromFavorites, favorites } = useFavorites();
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [pricingType, setPricingType] = useState<
    "simple" | "premium" | "agent"
  >("premium");
  const [isFavoritedState, setIsFavoritedState] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

  const handleContact = (type: "phone" | "email") => {
    const action = type === "phone" ? "canCallSellers" : "canEmailSellers";
    if (!can(action)) {
      const upgradePlan = requiresUpgrade(action);
      if (upgradePlan && typeof upgradePlan === "string") {
        setPricingType(upgradePlan as "simple" | "premium" | "agent");
      } else {
        setPricingType("agent");
      }
      setShowPricingModal(true);
      return;
    }

    // Priorité aux données d'agent populées, puis contactInfo
    const agentData =
      typeof property.owner === "object" ? property.owner : null;
    const phone = agentData?.phone || property.contactInfo?.phone;
    const email = agentData?.email || property.contactInfo?.email;

    if (type === "phone" && phone) {
      window.open(`tel:${phone}`);
    } else if (type === "email" && email) {
      window.open(`mailto:${email}?subject=Info: ${property.title}`);
    } else {
      toast.error(`Contact (${type}) non disponible.`);
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
  };  const imageResult = getBestImageUrl(property.images, property.propertyType);
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
      {" "}      <Card
        className={cn(
          "overflow-hidden group transition-all duration-500 ease-out card-enhanced flex flex-col h-full transform hover:-translate-y-1 sm:hover:-translate-y-2 hover:scale-[1.01] sm:hover:scale-[1.02]",
          "focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-900 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-700/60 surface-1 backdrop-blur-sm shadow-custom-lg",
          "relative before:absolute before:inset-0 before:rounded-xl sm:before:rounded-2xl before:bg-gradient-to-br before:from-blue-500/5 before:via-purple-500/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100",
          property.isPremium && "border-amber-300/50 dark:border-amber-700/70",
          isNewListing && "ring-2 ring-blue-400/30 dark:ring-blue-500/20",
          compact && "sm:flex-row sm:h-auto", // Mode compact pour mobile/tablette
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {" "}
        <CardHeader className="p-0 relative z-10">
          <Link
            href={`/property/${property.slug || property._id}`}
            className="block aspect-[4/3] sm:aspect-[16/10] relative overflow-hidden rounded-t-xl sm:rounded-t-2xl group/image"
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
              className={cn(
                "object-cover transition-all duration-700 ease-out group-hover/image:scale-110 brightness-95 group-hover/image:brightness-105",
                compact && "sm:object-center"
              )}
              sizes={compact ? "(max-width: 640px) 100vw, 200px" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
              quality={75}
              priority={false}
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                (
                  e.target as HTMLImageElement
                ).src = `https://via.placeholder.com/400x300/EEEEEE/CCCCCC?text=Image+Error`;
              }}
            />
            {/* Gradient overlay premium */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover/image:opacity-80 transition-opacity duration-500 rounded-t-2xl"></div>{" "}
            {/* Premium shine effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-700 rounded-t-2xl"></div>{" "}
            {/* Bouton de comparaison en position proéminente */}
            {onAddToComparison && (
              <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-20">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCompare}
                  className={cn(
                    "h-7 w-7 sm:h-9 sm:w-9 rounded-full transition-all duration-300 shadow-lg relative",
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
                      "h-4 w-4",
                      isInComparisonList ? "text-blue-600" : "text-slate-600"
                    )}
                  />
                </Button>
              </div>
            )}
            {/* Badges positionnés avec design premium */}
            <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-20 flex flex-col gap-1 sm:gap-2">
              {property.contactInfo?.email === "scraped@system.com" && (
                <Badge
                  variant="outline"
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0 shadow-lg backdrop-blur-sm text-xs px-2 sm:px-3 py-1 sm:py-1.5 font-bold rounded-full transform hover:scale-105 transition-transform duration-300"
                >
                  <Building2 className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5 fill-current" />
                  <span className="hidden sm:inline">Scrapé</span>
                  <span className="sm:hidden">S</span>
                </Badge>
              )}
              {property.isPremium === true && (
                <Badge
                  variant="default"
                  className="bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-900 border-0 shadow-lg backdrop-blur-sm text-xs sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 font-bold rounded-full transform hover:scale-105 transition-transform duration-300"
                >
                  <Zap className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5 fill-current" />
                  <span className="hidden sm:inline">Premium</span>
                  <span className="sm:hidden">P</span>
                </Badge>
              )}
              {property.isFeatured === true && (
                <Badge
                  variant="destructive"
                  className="bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg backdrop-blur-sm text-xs px-3 py-1.5 font-bold rounded-full transform hover:scale-105 transition-transform duration-300"
                >
                  <Star className="w-3.5 h-3.5 mr-1.5 fill-current" /> Featured
                </Badge>
              )}
              {isNewListing && (
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg backdrop-blur-sm text-xs px-3 py-1.5 font-bold rounded-full transform hover:scale-105 transition-transform duration-300">
                  <Sparkles className="w-3.5 h-3.5 mr-1.5 fill-current" /> New
                </Badge>
              )}
              {property.status &&
                property.status.toLowerCase() !== "active" && (
                  <Badge
                    variant="outline"
                    className="bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 shadow-lg backdrop-blur-sm text-xs px-3 py-1.5 font-semibold capitalize rounded-full border-slate-300 dark:border-slate-600"
                  >
                    {property.status}
                  </Badge>
                )}
            </div>
            {/* Bouton Favori avec Tooltip */}{" "}
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 sm:top-4 right-2 sm:right-4 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 backdrop-blur-sm shadow-lg border border-white/50 dark:border-slate-700/50 transition-all duration-300 transform hover:scale-110 hover:shadow-xl"
                    onClick={handleFavorite}
                  >
                    <Heart
                      className={cn(
                        "w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300",
                        isFavoritedState
                          ? "fill-red-500 text-red-500 scale-110"
                          : "text-slate-600 dark:text-slate-300 group-hover/image:text-red-400"
                      )}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-800 text-white border-slate-700 text-xs">
                  <p>
                    {isFavoritedState
                      ? "Retirer des favoris"
                      : "Ajouter aux favoris"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Link>
        </CardHeader>{" "}
        <CardContent className={cn(
          "p-3 sm:p-4 md:p-5 lg:p-6 flex-grow flex flex-col relative z-10",
          compact && "sm:flex-1 sm:space-y-2"
        )}>
          {/* Titre cliquable avec effet premium */}{" "}
          <div
            onClick={() => handleViewDetailsClick()}
            className="cursor-pointer mb-3 group/titleblock"
          >
            <CardTitle
              className={cn(
                "text-sm sm:text-base md:text-lg font-bold transition-all duration-300 leading-tight",
                "bg-gradient-to-r bg-clip-text",
                "from-slate-800 to-slate-700 dark:from-slate-100 dark:to-slate-200",
                "group-hover/titleblock:from-blue-600 group-hover/titleblock:to-blue-500",
                isHovered ? "line-clamp-none" : "line-clamp-2",
                compact && "sm:text-sm sm:line-clamp-1"
              )}
            >
              <span className="bg-clip-text hover:text-transparent">
                {property.title}
              </span>
            </CardTitle>
          </div>{" "}
          <div className={cn(
            "flex items-center text-muted-foreground text-xs mb-3 sm:mb-4 group/location",
            compact && "sm:mb-1 sm:text-xs"
          )}>
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 flex-shrink-0 text-blue-500 dark:text-blue-400 group-hover/location:animate-pulse" />
            <div
              className={cn(
                "text-slate-600 dark:text-slate-300 overflow-hidden transition-all duration-300",
                isHovered ? "whitespace-normal" : "truncate"
              )}
              title={`${property.address}, ${property.city}${
                property.postalCode ? ", " + property.postalCode : ""
              }`}
            >
              {property.address}, {property.city}
              {property.postalCode && (
                <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                  ({property.postalCode})
                </span>
              )}
            </div>
          </div>{" "}
          {/* Informations clés avec design premium */}
          <div className={cn(
            "grid grid-cols-2 gap-x-2 sm:gap-x-4 gap-y-2 sm:gap-y-3 text-xs text-slate-700 dark:text-slate-300 mb-3 sm:mb-5 bg-gradient-to-br from-slate-50/80 to-slate-100/80 dark:from-slate-800/50 dark:to-slate-700/50 backdrop-blur-sm rounded-lg sm:rounded-xl border border-slate-200/50 dark:border-slate-700/50 p-2.5 sm:p-4 shadow-sm",
            compact && "sm:grid-cols-2 sm:gap-1 sm:mb-2 sm:text-xs"
          )}>
            <div
              className="flex items-center gap-2 truncate group/info hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
              title={property.propertyType}
            >
              {propertyIcon &&
              typeof propertyIcon === "object" &&
              "props" in propertyIcon ? (
                <div className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 dark:text-blue-400 flex-shrink-0 group-hover/info:scale-110 transition-transform duration-300">
                  {propertyIcon}
                </div>
              ) : (
                <Building2 className="h-4 w-4 text-blue-500 dark:text-blue-400 flex-shrink-0 group-hover/info:scale-110 transition-transform duration-300" />
              )}
              <span className="truncate font-medium">
                {property.propertyType}
              </span>
            </div>
            <div
              className="flex items-center gap-2 truncate group/info hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
              title={`${property.surface.toLocaleString()} m²`}
            >
              <Square className="h-4 w-4 text-blue-500 dark:text-blue-400 flex-shrink-0 group-hover/info:scale-110 transition-transform duration-300" />
              <span className="truncate font-medium">
                {property.surface.toLocaleString()} m²
              </span>
            </div>
            {property.bedrooms ? (
              <div
                className="flex items-center gap-2 truncate group/info hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                title={`${property.bedrooms} chambre(s)`}
              >
                <Bed className="h-4 w-4 text-blue-500 dark:text-blue-400 flex-shrink-0 group-hover/info:scale-110 transition-transform duration-300" />
                <span className="truncate font-medium">
                  {property.bedrooms} ch.
                </span>
              </div>
            ) : (
              <div className="min-h-[1.25rem]" />
            )}
            {property.bathrooms ? (
              <div
                className="flex items-center gap-2 truncate group/info hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                title={`${property.bathrooms} salle(s) de bain`}
              >
                <Bath className="h-4 w-4 text-blue-500 dark:text-blue-400 flex-shrink-0 group-hover/info:scale-110 transition-transform duration-300" />
                <span className="truncate font-medium">
                  {property.bathrooms} sdb.
                </span>
              </div>
            ) : (
              <div className="min-h-[1.25rem]" />
            )}
          </div>{" "}
          {/* Description courte */}
          {!(can("canViewSellerInfo") && property.contactInfo) &&
            property.description && (
              <div className="mb-4 flex-grow group/description">
                <p
                  className={cn(
                    "text-slate-600 dark:text-slate-300 text-sm leading-relaxed transition-all duration-500",
                    isHovered ? "line-clamp-3" : "line-clamp-2",
                    isHovered &&
                      "bg-slate-50 dark:bg-slate-700/40 p-2 rounded-lg"
                  )}
                >
                  {property.description}
                </p>
                {isHovered && property.description.length > 150 && (
                  <div
                    className="text-xs text-blue-500 dark:text-blue-400 text-right mt-1 font-medium hover:underline cursor-pointer"
                    onClick={() => handleViewDetailsClick()}
                  >
                    Lire plus
                  </div>
                )}
              </div>
            )}
          {/* Contact vendeur/agent */}
          {can("canViewSellerInfo") &&
          (property.contactInfo ||
            (typeof property.owner === "object" && property.owner)) ? (
            <div className="bg-slate-50 dark:bg-slate-700/60 p-3 rounded-md mb-1 mt-auto border border-slate-200 dark:border-slate-600 text-xs">
              <h4 className="font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                {typeof property.owner === "object" && property.owner ? (
                  <span>
                    Agent: {property.owner.name}{" "}
                    {property.owner.company && `(${property.owner.company})`}
                  </span>
                ) : (
                  <span>Contact: {property.contactInfo?.name}</span>
                )}
              </h4>
              <div className="flex gap-1 sm:gap-2">
                {((typeof property.owner === "object" &&
                  property.owner?.phone) ||
                  property.contactInfo?.phone) && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs dark:border-slate-500 dark:hover:bg-slate-600 dark:text-slate-200 hover:bg-slate-100 flex-1"
                    onClick={() => handleContact("phone")}
                  >
                    <Phone className="h-3 w-3 mr-1.5" /> Appeler
                  </Button>
                )}
                {((typeof property.owner === "object" &&
                  property.owner?.email) ||
                  property.contactInfo?.email) && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs dark:border-slate-500 dark:hover:bg-slate-600 dark:text-slate-200 hover:bg-slate-100 flex-1"
                    onClick={() => handleContact("email")}
                  >
                    <Mail className="h-3 w-3 mr-1.5" /> Email
                  </Button>
                )}
              </div>
            </div>
          ) : !can("canViewSellerInfo") &&
            requiresUpgrade("canViewSellerInfo") ? (
            <div className="bg-amber-50 dark:bg-amber-900/30 p-2.5 rounded-md mb-1 mt-auto border border-amber-200 dark:border-amber-700 text-xs text-center">
              <Button
                variant="link"
                className="p-0 h-auto text-amber-600 dark:text-amber-400 text-xs hover:underline font-medium"
                onClick={() => {
                  const plan = requiresUpgrade("canViewSellerInfo");
                  if (typeof plan === "string")
                    setPricingType(plan as "simple" | "premium" | "agent");
                  else setPricingType("agent");
                  setShowPricingModal(true);
                }}
              >
                <Lock className="h-3 w-3 mr-1.5" /> Voir contact (
                {requiresUpgrade("canViewSellerInfo") || "Premium"})
              </Button>
            </div>
          ) : null}
        </CardContent>{" "}
        <CardFooter className={cn(
          "p-3 sm:p-4 md:p-5 lg:p-6 pt-0 mt-auto relative z-10",
          compact && "sm:p-3 sm:pt-0"
        )}>
          <div className="w-full">
            {/* Prix et upgrade badge sur une ligne */}
            <div className="flex items-center justify-between border-t border-slate-200/80 dark:border-slate-700/80 pt-4 mb-4">
              {" "}
              <div
                className="relative group/price flex items-center flex-wrap"
                title={`Prix: ${priceDisplay}`}
              >
                <div
                  className={cn(
                    "text-sm sm:text-lg md:text-xl font-bold transition-all duration-500 cursor-default flex-shrink-0 break-words max-w-full",
                    isHovered
                      ? "bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent scale-110"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent"
                  )}
                >
                  {priceDisplay}
                </div>
                {isHovered && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-500 animate-ping"></div>
                )}
                {(property.transactionType?.toLowerCase().includes("rent") ||
                  property.transactionType
                    ?.toLowerCase()
                    .includes("lease")) && (
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 ml-1 font-medium">
                    /mois
                  </span>
                )}
              </div>
              {showDetailsRestriction && (
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40 px-2 py-1 h-auto rounded-lg font-medium border border-amber-200 dark:border-amber-700 transition-all duration-300 ml-2 flex-shrink-0"
                        onClick={() => {
                          const plan = upgradeNeededForDetails;
                          if (typeof plan === "string")
                            setPricingType(
                              plan as "simple" | "premium" | "agent"
                            );
                          else setPricingType("premium");
                          setShowPricingModal(true);
                        }}
                      >
                        <Zap className="h-3 w-3 mr-1" />
                        {upgradeNeededForDetails}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-800 text-white border-slate-700 text-xs">
                      <p>
                        Mise à niveau vers "{upgradeNeededForDetails}" requise.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            {/* Boutons d'action en bas */}
            <div className="flex gap-1.5 sm:gap-2 items-center">
              <Button
                variant={canActuallyViewDetails ? "default" : "secondary"}
                className={cn(
                  "flex-1 h-9 sm:h-11 text-xs sm:text-sm font-medium transition-all duration-300 rounded-md sm:rounded-lg",
                  canActuallyViewDetails
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg"
                    : "bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300"
                )}
                onClick={() => handleViewDetailsClick()}
              >
                <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">
                  {canActuallyViewDetails
                    ? "Voir détails"
                    : upgradeNeededForDetails
                    ? `Upgrade ${upgradeNeededForDetails}`
                    : "Accès Restreint"}
                </span>
                <span className="sm:hidden">
                  {canActuallyViewDetails
                    ? "Détails"
                    : upgradeNeededForDetails
                    ? "Upgrade"
                    : "Restreint"}
                </span>
              </Button>

              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCompare}
                      disabled={
                        !can("canCompareProperties") &&
                        !!requiresUpgrade("canCompareProperties")
                      }
                      className={cn(
                        "h-9 w-9 sm:h-11 sm:w-11 transition-all duration-300 rounded-md sm:rounded-lg relative",
                        isInComparisonList
                          ? "bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400"
                          : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                      )}
                    >
                      <GitCompare className="h-4 w-4" />
                      {!can("canCompareProperties") &&
                        requiresUpgrade("canCompareProperties") && (
                          <Lock className="absolute -top-1 -right-1 h-3 w-3 text-amber-500 bg-white dark:bg-slate-800 rounded-full p-0.5 border border-amber-300" />
                        )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-slate-800 text-white border-slate-700 text-xs">
                    <p>
                      {isInComparisonList
                        ? "Retirer de la comparaison"
                        : !can("canCompareProperties") &&
                          requiresUpgrade("canCompareProperties")
                        ? `Upgrade ${requiresUpgrade(
                            "canCompareProperties"
                          )} requis`
                        : "Ajouter à la comparaison"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>{" "}
            {/* Lien compte gratuit pour les invités */}
            {userRole === "guest" && !canActuallyViewDetails && (
              <div className="text-center mt-3">
                {" "}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 dark:text-blue-400 text-xs h-auto py-1 sm:py-1.5 px-2 sm:px-3 font-medium truncate max-w-full hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full border border-blue-200 dark:border-blue-700/50 transition-all duration-300 hover:shadow-sm flex items-center gap-1 sm:gap-1.5"
                  onClick={() => {
                    setPricingType("simple");
                    setShowPricingModal(true);
                  }}
                >
                  <Sparkles className="w-3 h-3" />
                  Créer un compte gratuit
                </Button>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>{" "}
      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        userType={pricingType}
      />
    </>
  );
}

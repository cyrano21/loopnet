'use client'

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Search,
  Building2,
  TrendingUp,
  Users,
  Clock,
  ChevronDown,
  Heart,
  Star,
  MapPin,
  Briefcase,
  Zap,
  Landmark,
  Store,
  Calculator,
  Bell,
  Sparkles,
  BarChart3,
  Target,
  ArrowRight,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useComparison } from "@/components/comparison-provider";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyCard } from "@/components/property-card";
import { CompanyLogoItem } from "@/components/company-logo-item";
import { useProperties } from "@/hooks/use-properties";
import { cn } from "@/lib/utils";

// Hook useOnScreen with proper typing
function useOnScreen(
  ref: React.RefObject<HTMLDivElement | null>,
  rootMargin = "0px",
  threshold = 0.1,
) {
  const [isIntersecting, setIntersecting] = useState(false);
  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef || typeof IntersectionObserver === 'undefined') {
      return () => {};
    }

    // Utiliser try/catch pour éviter les erreurs d'instanciation
    try {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIntersecting(true);
            // Optional: stop observing once visible for performance
            // if (currentRef) {
            //   observer.unobserve(currentRef);
            // }
          } else {
            // Optional: reset to false if you want animation to replay
            // setIntersecting(false);
          }
        },
        { rootMargin, threshold },
      );

      observer.observe(currentRef);
      return () => {
        observer.unobserve(currentRef);
      };
    } catch (error) {
      console.error('Error with IntersectionObserver:', error);
      return () => {};
    }
  }, [ref, rootMargin, threshold]);
  return isIntersecting;
}

const handleLogoError = (e: React.SyntheticEvent<HTMLImageElement>): void => {
  const target = e.currentTarget as HTMLImageElement;
  target.style.display = "none";
  const fallback = target.nextElementSibling as HTMLElement;
  if (fallback) {
    fallback.style.display = "flex";
    fallback.classList.remove("hidden");
  }
};

export default function HomePage() {
  // VOTRE ÉTAT ET LOGIQUE EXISTANTE SONT PRÉSERVÉS
  const [searchType, setSearchType] = useState("forLease");
  const [selectedPropertyType, setSelectedPropertyType] = useState("");
  const [trendingTab, setTrendingTab] = useState("ForLease");
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 45,
    seconds: 30,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isToolsSidebarOpen, setIsToolsSidebarOpen] = useState(false);

  const router = useRouter();
  const { properties, loading, error } = useProperties({ page: 1, limit: 8 }); // VOTRE HOOK
  const { addToComparison, removeFromComparison, isInComparison, comparisonList } = useComparison(); // Hook pour la fonctionnalité de comparaison

  // Refs pour les animations
  const trustSectionRef = useRef<HTMLDivElement | null>(null);
  const companyLogosRef = useRef<HTMLDivElement | null>(null);
  const trendingSectionRef = useRef<HTMLDivElement | null>(null);
  const featuredSectionRef = useRef<HTMLDivElement | null>(null);
  const auctionSectionRef = useRef<HTMLDivElement | null>(null);
  const citiesSectionRef = useRef<HTMLDivElement | null>(null);
  const articlesSectionRef = useRef<HTMLDivElement | null>(null);
  const marketingSectionRef = useRef<HTMLDivElement | null>(null);
  const faqSectionRef = useRef<HTMLDivElement | null>(null);

  // Utilisation des hooks sans condition
  const isTrustSectionOnScreen = useOnScreen(trustSectionRef, "-100px");
  const isCompanyLogosOnScreen = useOnScreen(companyLogosRef, "-100px");
  const isTrendingSectionOnScreen = useOnScreen(trendingSectionRef, "-100px");
  const isFeaturedSectionOnScreen = useOnScreen(featuredSectionRef, "-100px");
  const isAuctionSectionOnScreen = useOnScreen(auctionSectionRef, "-100px");
  const isCitiesSectionOnScreen = useOnScreen(citiesSectionRef, "-100px");
  const isArticlesSectionOnScreen = useOnScreen(articlesSectionRef, "-100px");
  const isMarketingSectionOnScreen = useOnScreen(marketingSectionRef, "-100px");
  const isFaqSectionOnScreen = useOnScreen(faqSectionRef, "-100px");

  // VOTRE useEffect pour le timer
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (timeLeft.hours > 0 || timeLeft.minutes > 0 || timeLeft.seconds > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
          if (prev.minutes > 0)
            return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
          if (prev.hours > 0)
            return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
          if (timer) clearInterval(timer); // Arrêter quand tout est à zéro
          return { hours: 0, minutes: 0, seconds: 0 };
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timeLeft.hours, timeLeft.minutes, timeLeft.seconds]);

  // VOS DONNÉES SONT PRÉSERVÉES
  const companyLogos = [
    { name: "Amazon", logo: "/logos/amazon.svg" },
    { name: "Google", logo: "/logos/google.svg" },
    { name: "Goldman Sachs", logo: "/logos/goldman-sachs.svg" },
    { name: "IBM", logo: "/logos/ibm.svg" },
    { name: "Netflix", logo: "/logos/netflix.svg" },
    { name: "Blackstone", logo: "/logos/blackstone.svg" },
    { name: "Intel", logo: "/logos/intel.svg" },
    { name: "Starbucks", logo: "/logos/starbucks.svg" },
    { name: "3M", logo: "/logos/3m.svg" },
    { name: "Pfizer", logo: "/logos/pfizer.svg" },
    { name: "Target", logo: "/logos/target.svg" },
    { name: "Walmart", logo: "/logos/walmart.svg" },
    { name: "Adobe", logo: "/logos/adobe.svg" },
    { name: "Disney", logo: "/logos/disney.svg" },
    { name: "FedEx", logo: "/logos/fedex.svg" },
    { name: "Home Depot", logo: "/logos/home-depot.svg" },
    { name: "Microsoft", logo: "/logos/microsoft.svg" },
    { name: "Apple", logo: "/logos/apple.svg" },
  ];
  const propertyTypesData = [
    // Renommé pour éviter conflit avec type 'propertyTypes' ailleurs
    { id: 8, name: "Office", icon: "🏢" },
    { id: 16, name: "Retail", icon: "🏪" },
    { id: 2, name: "Industrial", icon: "🏭" },
    { id: 32, name: "Flex", icon: "🏗️" },
    { id: 8192, name: "Coworking", icon: "💼" },
    { id: 512, name: "Medical", icon: "🏥" },
    { id: 4, name: "Land", icon: "🌍" },
    { id: 4096, name: "Restaurant", icon: "🍽️" },
  ];
  const trendingPropertiesData = {
    // Renommé
    ForLease: [
      {
        id: 1,
        type: "Office",
        price: "From $25.50 SF/YR",
        address: "800 Fairway Dr, Deerfield Beach, FL 33441",
        size: "Up to 56,900 SF",
        image:
          "https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&h=200&fit=crop&crop=center",
      },
      {
        id: 2,
        type: "Coworking",
        price: "From $40 SF/YR",
        address: "8230 210th St S, Boca Raton, FL 33433",
        size: "Up to 1,000 SF",
        image:
          "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=300&h=200&fit=crop&crop=center",
      },
      {
        id: 3,
        type: "Retail",
        price: "From $13 SF/YR",
        address: "450 Amwell Rd, Hillsborough, NJ 08844",
        size: "Up to 4,100 SF",
        image:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop&crop=center",
      },
      {
        id: 4,
        type: "Restaurant",
        price: "From $39 SF/YR",
        address: "Rainbow Blvd, Las Vegas, NV 89178",
        size: "Up to 16,800 SF",
        image:
          "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&h=200&fit=crop&crop=center",
      },
    ],
    ForSale: [
      {
        id: 5,
        type: "Office",
        price: "$1,875,000",
        address: "68 Evergreen St, Kingston, MA 02364",
        size: "19,000 SF",
        image:
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&h=200&fit=crop&crop=center",
      },
      {
        id: 6,
        type: "Industrial",
        price: "$18,520,400",
        address: "4437 E 49th St, Cleveland, OH 44125",
        size: "231,500 SF",
        image:
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop&crop=center",
      },
    ],
    Auctions: [
      {
        id: 7,
        type: "Office",
        price: "Starting Bid $2,500,000",
        address: "3 Independence Way, Princeton, NJ 08540",
        size: "125,700 SF",
        image:
          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&h=200&fit=crop&crop=center",
      },
    ],
  };
  const popularCitiesData = [
    // Renommé
    {
      name: "New York City",
      image:
        "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=200&h=150&fit=crop&crop=center",
    },
    {
      name: "London",
      image:
        "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=200&h=150&fit=crop&crop=center",
    },
    {
      name: "Paris",
      image:
        "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=200&h=150&fit=crop&crop=center",
    },
    {
      name: "Los Angeles",
      image:
        "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=200&h=150&fit=crop&crop=center",
    },
    {
      name: "Chicago",
      image:
        "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=200&h=150&fit=crop&crop=center",
    },
    {
      name: "Miami",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop&crop=center",
    },
  ];
  const educationalArticlesData = [
    // Renommé
    {
      title: "Lease Terms Commercial Investors Need to Know",
      description:
        "Understand the essential terms when leasing commercial space, including Letter of Intent, Tenant Improvements and more.",
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300&h=200&fit=crop&crop=center",
    },
    {
      title: "10 Reasons to Hire a Commercial Real Estate Broker",
      description:
        "A Tenant Rep Can Help Your Business Find and Execute the Perfect Lease",
      image:
        "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=300&h=200&fit=crop&crop=center",
    },
    {
      title: "Commercial Real Estate Investment Strategies",
      description:
        "Essential Guidelines for Success in Commercial Property Investment",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop&crop=center",
    },
  ];

  // VOTRE logique de recherche
  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search/${encodeURIComponent(searchQuery)}`);
    } else {
      const params = new URLSearchParams();
      if (searchType) params.set("type", searchType);
      if (selectedPropertyType)
        params.set("propertyType", selectedPropertyType);
      router.push(`/properties?${params.toString()}`);
    }
  };

  const formatTime = (time: number) => time.toString().padStart(2, "0");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-300 overflow-x-hidden relative">
      {/* Main Content Wrapper - Add padding for sidebar */}
      <div className="xl:pr-80 2xl:pr-96 transition-all duration-300">
        {/* Tools Sidebar - Desktop */}
        <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-50 hidden xl:block 2xl:block">
          <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md shadow-2xl rounded-l-2xl border border-slate-200 dark:border-slate-700 p-6 w-80 2xl:w-96 max-h-[80vh] overflow-y-auto tools-sidebar-scroll">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 2xl:p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                  <Zap className="w-5 h-5 2xl:w-6 2xl:h-6 text-white" />
                </div>
                <h3 className="text-lg 2xl:text-xl font-bold text-slate-800 dark:text-slate-100">
                  Outils Pro
                </h3>
              </div>
              <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 text-xs px-2 py-1">
                Nouveaux
              </Badge>
            </div>

            <div className="space-y-4">
              {/* Calculateur Gratuit */}
              <Link href="/tools/cap-rate-calculator" className="group block">
                <div className="p-4 2xl:p-5 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl border border-emerald-200 dark:border-emerald-700/30 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="p-2 2xl:p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg shadow-md">
                      <Calculator className="w-4 h-4 2xl:w-5 2xl:h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm 2xl:text-base text-slate-800 dark:text-slate-100 mb-1">
                        Calculateur Cap Rate
                      </h4>
                      <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs px-2 py-0.5">
                        <Star className="w-3 h-3 mr-1" />
                        Gratuit
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs 2xl:text-sm text-slate-600 dark:text-slate-400 mb-2">
                    Calculez instantanément la rentabilité
                  </p>
                  <div className="flex items-center text-emerald-600 dark:text-emerald-400 text-xs 2xl:text-sm font-medium group-hover:translate-x-1 transition-transform">
                    Essayer <ArrowRight className="w-3 h-3 ml-1" />
                  </div>
                </div>
              </Link>

              {/* Alertes Premium */}
              <div className="group cursor-pointer relative">
                {/* Notification Badge */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg z-10">
                  3
                </div>
                <div className="p-4 2xl:p-5 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-700/30 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="p-2 2xl:p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-md">
                      <Bell className="w-4 h-4 2xl:w-5 2xl:h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm 2xl:text-base text-slate-800 dark:text-slate-100 mb-1">
                        Alertes Intelligentes
                      </h4>
                      <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs px-2 py-0.5">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs 2xl:text-sm text-slate-600 dark:text-slate-400 mb-2">
                    Notifications automatiques
                  </p>
                  <div className="flex items-center text-blue-600 dark:text-blue-400 text-xs 2xl:text-sm font-medium group-hover:translate-x-1 transition-transform">
                    Découvrir <ArrowRight className="w-3 h-3 ml-1" />
                  </div>
                </div>
              </div>

              {/* Analyses Pro */}
              <div className="group cursor-pointer">
                <div className="p-4 2xl:p-5 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-200 dark:border-purple-700/30 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="p-2 2xl:p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-md">
                      <BarChart3 className="w-4 h-4 2xl:w-5 2xl:h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm 2xl:text-base text-slate-800 dark:text-slate-100 mb-1">
                        Analyses de Marché
                      </h4>
                      <Badge className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs px-2 py-0.5">
                        <Target className="w-3 h-3 mr-1" />
                        Pro
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs 2xl:text-sm text-slate-600 dark:text-slate-400 mb-2">
                    Tendances du marché détaillées
                  </p>
                  <div className="flex items-center text-purple-600 dark:text-purple-400 text-xs 2xl:text-sm font-medium group-hover:translate-x-1 transition-transform">
                    Explorer <ArrowRight className="w-3 h-3 ml-1" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
              <Link href="/tools">
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs rounded-lg shadow-md"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Tous les outils
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Tools Sidebar - Mobile/Tablet */}
        {isToolsSidebarOpen && (
          <div className="fixed inset-0 z-50 xl:hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsToolsSidebarOpen(false)}
            />

            {/* Sidebar */}
            <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white dark:bg-slate-800 shadow-2xl transform transition-transform duration-300 ease-out">
              <div className="p-6 h-full overflow-y-auto tools-sidebar-scroll">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                      Outils Pro
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsToolsSidebarOpen(false)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                  >
                    <ChevronDown className="w-5 h-5 rotate-90" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {/* Calculateur Gratuit */}
                  <Link
                    href="/tools/cap-rate-calculator"
                    className="group block"
                    onClick={() => setIsToolsSidebarOpen(false)}
                  >
                    <div className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl border border-emerald-200 dark:border-emerald-700/30 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start space-x-3 mb-3">
                        <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-md">
                          <Calculator className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-base text-slate-800 dark:text-slate-100 mb-2">
                            Calculateur Cap Rate
                          </h4>
                          <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs px-3 py-1">
                            Gratuit
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                        Calculez instantanément la rentabilité de vos
                        investissements
                      </p>
                      <div className="flex items-center text-emerald-600 dark:text-emerald-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                        Essayer maintenant{" "}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </div>
                    </div>
                  </Link>

                  {/* Alertes Premium */}
                  <div
                    className="group cursor-pointer"
                    onClick={() => setIsToolsSidebarOpen(false)}
                  >
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-700/30 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start space-x-3 mb-3">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-md">
                          <Bell className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-base text-slate-800 dark:text-slate-100 mb-2">
                            Alertes Intelligentes
                          </h4>
                          <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs px-3 py-1">
                            Premium
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                        Recevez des notifications automatiques pour les
                        opportunités
                      </p>
                      <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                        Découvrir Premium{" "}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </div>
                    </div>
                  </div>

                  {/* Analyses Pro */}
                  <div
                    className="group cursor-pointer"
                    onClick={() => setIsToolsSidebarOpen(false)}
                  >
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-200 dark:border-purple-700/30 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start space-x-3 mb-3">
                        <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-md">
                          <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-base text-slate-800 dark:text-slate-100 mb-2">
                            Analyses de Marché
                          </h4>
                          <Badge className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs px-3 py-1">
                            Pro
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                        Accédez à des analyses détaillées et des tendances du
                        marché
                      </p>
                      <div className="flex items-center text-purple-600 dark:text-purple-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                        Explorer Pro <ArrowRight className="w-4 h-4 ml-2" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <Link
                    href="/tools"
                    onClick={() => setIsToolsSidebarOpen(false)}
                  >
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-md"
                    >
                      <Zap className="w-5 h-5 mr-3" />
                      Découvrir tous les outils
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Tools Button */}
        <div className="fixed bottom-6 right-6 z-40 xl:hidden">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 w-16 h-16 p-0 flex items-center justify-center tools-button-pulse"
            onClick={() => setIsToolsSidebarOpen(true)}
          >
            <Zap className="w-7 h-7" />
          </Button>
        </div>

        {/* Hero Section - Enhanced with Premium Design */}
        <section className="relative text-white py-20 md:py-28 lg:py-36 overflow-hidden isolate">
          {/* Enhanced Background with Multiple Layers */}
          <div className="absolute inset-0 z-[-1]">
            <Image
              src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=600&fit=crop&crop=center"
              alt="City skyline"
              fill
              className="object-cover"
              priority
              quality={75}
            />
            {/* Enhanced gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-700/80 to-purple-600/70"></div>
            
            {/* Animated particles background */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white/20 rounded-full"
                  initial={{
                    x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : Math.random() * 1200,
                    y: typeof window !== 'undefined' ? Math.random() * window.innerHeight : Math.random() * 800,
                    opacity: 0,
                  }}
                  animate={{
                    y: [null, -100],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>
            
            {/* Geometric shapes overlay */}
            <div className="absolute inset-0 opacity-10">
              <motion.div
                className="absolute top-20 left-10 w-32 h-32 border border-white/30 rounded-full"
                animate={{
                  rotate: 360,
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <motion.div
                className="absolute bottom-20 right-20 w-24 h-24 border border-white/20 rotate-45"
                animate={{
                  rotate: [45, 405],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </div>

          <div className="relative z-10 container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              {/* Enhanced Hero Title with Premium Animations */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative mb-6"
              >
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight relative">
                  <motion.span
                    className="block relative"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    The World's #1
                  </motion.span>
                  <motion.span 
                    className="block relative overflow-hidden mt-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <span className="relative inline-block">
                      <span className="bg-gradient-to-r from-yellow-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent font-black">
                        Commercial Real Estate
                      </span>
                      {/* Animated underline */}
                      <motion.div
                        className="absolute bottom-0 left-0 h-1.5 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.2, delay: 1 }}
                      />
                    </span>
                  </motion.span>
                  <motion.span
                    className="block mt-2 text-white"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    Marketplace
                  </motion.span>
                  
                  {/* Floating accent elements */}
                  <motion.div
                    className="absolute -top-6 -right-6 w-12 h-12 bg-yellow-400/20 rounded-full blur-md"
                    animate={{
                      y: [-15, 15, -15],
                      opacity: [0.2, 0.6, 0.2],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.div
                    className="absolute -bottom-4 -left-4 w-8 h-8 bg-blue-400/30 rounded-full blur-sm"
                    animate={{
                      x: [-10, 10, -10],
                      opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                  />
                </h1>
              </motion.div>
              
              {/* Enhanced Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="mb-10"
              >
                <p className="text-lg md:text-xl lg:text-2xl text-slate-100 leading-relaxed font-light max-w-3xl mx-auto">
                  Find, Lease, or Buy Your Next Commercial Property With Us.
                  <span className="block mt-2 text-yellow-200/90 font-medium">
                    Explore Thousands of Premium Listings
                  </span>
                </p>
                <motion.div
                  className="mt-4 text-sm md:text-base text-blue-200/80"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1.4 }}
                >
                  ✨ Trusted by over 12 million professionals worldwide
                </motion.div>
              </motion.div>

              {/* Enhanced Search Card with Premium Design */}
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
                className="relative"
              >
                {/* Glowing border effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/50 via-blue-500/50 to-purple-600/50 rounded-2xl blur-sm opacity-75"></div>
                
                <Card className="relative bg-white/98 dark:bg-slate-800/98 backdrop-blur-xl text-slate-900 dark:text-slate-100 p-5 md:p-8 shadow-2xl rounded-xl border border-white/20 overflow-hidden">
                  {/* Subtle animated background pattern */}
                  <div className="absolute inset-0 opacity-5 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 pointer-events-none"></div>
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-32 h-32 bg-gradient-to-r from-yellow-400/20 to-blue-500/20 rounded-full blur-xl pointer-events-none"
                        style={{
                          left: `${20 + i * 30}%`,
                          top: `${10 + i * 20}%`,
                        }}
                        animate={{
                          x: [0, 20, 0],
                          y: [0, -10, 0],
                          opacity: [0.1, 0.3, 0.1],
                        }}
                        transition={{
                          duration: 8 + i * 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 2,
                        }}
                      />
                    ))}
                  </div>
                <CardContent className="p-0">
                  <div className="flex flex-wrap justify-center mb-6 border-b border-slate-200 dark:border-slate-700">
                    {[
                      {
                        key: "forLease",
                        label: "For Lease",
                        icon: <Briefcase className="w-4 h-4 mr-1.5" />,
                      },
                      {
                        key: "forSale",
                        label: "For Sale",
                        icon: <TrendingUp className="w-4 h-4 mr-1.5" />,
                      },
                      {
                        key: "auctions",
                        label: "Auctions",
                        icon: <Clock className="w-4 h-4 mr-1.5" />,
                      },
                      {
                        key: "businesses",
                        label: "Businesses For Sale",
                        icon: <Store className="w-4 h-4 mr-1.5" />,
                      },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => {
                          setSearchType(tab.key);
                          router.push(`/properties?type=${tab.key}`);
                        }}
                        className={cn(
                          "flex items-center px-3 sm:px-4 py-2.5 font-medium text-sm sm:text-base transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800 rounded-t-md",
                          searchType === tab.key
                            ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-slate-50 dark:bg-slate-700/50"
                            : "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700/30",
                        )}
                      >
                        {tab.icon}
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex overflow-x-auto space-x-2.5 sm:space-x-3 mb-6 pb-2 -mx-2 px-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
                    {propertyTypesData.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => {
                          setSelectedPropertyType(type.id.toString());
                          router.push(
                            `/properties?propertyType=${
                              type.id
                            }&name=${encodeURIComponent(type.name)}`,
                          );
                        }}
                        className={cn(
                          "flex-shrink-0 group flex flex-col items-center p-2.5 w-20 h-20 sm:w-24 sm:h-24 justify-center rounded-lg transition-all duration-200 transform hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-slate-800",
                          selectedPropertyType === type.id.toString()
                            ? "bg-blue-100 dark:bg-blue-600/40 text-blue-700 dark:text-blue-300 shadow-md ring-1 ring-blue-300 dark:ring-blue-500"
                            : "bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600",
                        )}
                      >
                        <span className="text-2xl sm:text-3xl mb-1 transition-transform duration-200 group-hover:scale-110">
                          {type.icon}
                        </span>
                        <span className="text-xs font-medium">
                          {type.name}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mb-4">
                    <div className="flex-1 relative">
                      <MapPin className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 pointer-events-none" />
                      <Input
                        placeholder="Enter location, address, city, or ZIP code"
                        className="h-12 text-base pl-11 focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 rounded-md"
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setSearchQuery(e.target.value)
                        }
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                          e.key === "Enter" && handleSearch()
                        }
                      />
                    </div>
                    <Button
                      onClick={handleSearch}
                      size="lg"
                      className="h-12 px-6 sm:px-8 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600 rounded-md text-base"
                    >
                      <Search className="w-5 h-5 mr-2" />
                      Search
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2.5 sm:gap-3 text-sm">
                    <Select>
                      <SelectTrigger className="w-full sm:w-auto sm:flex-1 md:w-44 h-10 dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 rounded-md text-slate-700 dark:text-slate-300">
                        <SelectValue placeholder="Price Range" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-slate-700 dark:text-slate-100 border-slate-600">
                        <SelectItem value="0-500k">$0 - $500K</SelectItem>
                        <SelectItem value="500k-1m">$500K - $1M</SelectItem>
                        <SelectItem value="1m-5m">$1M - $5M</SelectItem>
                        <SelectItem value="5m+">$5M+</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className="w-full sm:w-auto sm:flex-1 md:w-44 h-10 dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 rounded-md text-slate-700 dark:text-slate-300">
                        <SelectValue placeholder="Size (sq ft)" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-slate-700 dark:text-slate-100 border-slate-600">
                        <SelectItem value="0-5k">0 - 5,000</SelectItem>
                        <SelectItem value="5k-10k">5,000 - 10,000</SelectItem>
                        <SelectItem value="10k-25k">10,000 - 25,000</SelectItem>
                        <SelectItem value="25k+">25,000+</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="link"
                      className="text-blue-600 dark:text-blue-400 hover:underline p-0 h-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm text-sm"
                    >
                      More Filters <ChevronDown className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section
          ref={trustSectionRef}
          className={cn(
            "py-16 bg-white dark:bg-slate-800 transition-all duration-1000 ease-out",
            isTrustSectionOnScreen
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12",
          )}
        >
          <div className="container mx-auto px-4 text-center">
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
              For over 30 years, LoopNet has been the trusted brand for
              Commercial Real Estate
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  value: "300K+",
                  label: "Active Listings",
                  icon: (
                    <Building2 className="w-10 h-10 text-blue-500 mb-3 mx-auto" />
                  ),
                },
                {
                  value: "13M+",
                  label: "Monthly Visitors",
                  icon: (
                    <Users className="w-10 h-10 text-green-500 mb-3 mx-auto" />
                  ),
                },
                {
                  value: "$109B+",
                  label: "In Transaction Value",
                  icon: (
                    <TrendingUp className="w-10 h-10 text-purple-500 mb-3 mx-auto" />
                  ),
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-6 bg-slate-100 dark:bg-slate-700/70 rounded-xl shadow-lg transition-all duration-500 ease-out hover:shadow-xl hover:scale-105",
                    isTrustSectionOnScreen
                      ? `opacity-100 scale-100 animation-delay-${index * 150}`
                      : "opacity-0 scale-90",
                  )}
                >
                  {stat.icon}
                  <div className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Company Logos Carousel - Premium Design */}
        <section
          ref={companyLogosRef}
          className={cn(
            "py-16 relative overflow-hidden transition-all duration-1000 ease-out",
            isCompanyLogosOnScreen ? "opacity-100" : "opacity-0",
          )}
        >
          {/* Premium gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900/20"></div>

          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pattern-dots"></div>

          <div className="relative z-10 container mx-auto px-4">
            {/* Premium Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-blue-300 dark:to-blue-600"></div>
                <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 text-blue-700 dark:text-blue-300 border-0 px-4 py-1.5">
                  <Sparkles className="w-3 h-3 mr-1.5" />
                  Partenaires Premium
                </Badge>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-blue-300 dark:to-blue-600"></div>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 dark:from-slate-100 dark:via-slate-200 dark:to-slate-100 bg-clip-text text-transparent mb-3">
                Entreprises qui font confiance à LoopNet
              </h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Rejoignez les leaders mondiaux qui utilisent notre plateforme
                pour leurs investissements immobiliers
              </p>
            </div>

            {/* Premium Carousel Container */}
            <div className="relative group">
              {/* Gradient fade edges */}
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent dark:from-slate-900 dark:via-slate-900/80 dark:to-transparent z-10 pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent dark:from-slate-900 dark:via-slate-900/80 dark:to-transparent z-10 pointer-events-none"></div>

              {/* Container with overflow hidden for smooth scrolling */}
              <div className="overflow-hidden py-8">
                <div className="flex animate-scroll-smooth space-x-8 md:space-x-12 items-center w-max group-hover:animation-play-state-paused">
                  {/* First set of logos */}
                  {companyLogos.map((company, index) => (
                    <CompanyLogoItem
                      key={`first-${index}`}
                      src={company.logo}
                      name={company.name}
                      width={140}
                      height={70}
                      className={cn(
                        isCompanyLogosOnScreen
                          ? `animation-delay-${index * 50}`
                          : "",
                      )}
                    />
                  ))}
                  {/* Duplicate set for seamless loop */}
                  {companyLogos.map((company, index) => (
                    <CompanyLogoItem
                      key={`second-${index}`}
                      src={company.logo}
                      name={company.name}
                      width={140}
                      height={70}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Premium Trust Indicators */}
            <div className="mt-12 text-center">
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>+10M recherches actives/mois</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <span>Partenariats certifiés</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                  <span>96% Fortune 1000</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trending on LoopNet */}
        <section
          ref={trendingSectionRef}
          className={cn(
            "py-16 bg-white dark:bg-slate-800 transition-all duration-1000 ease-out",
            isTrendingSectionOnScreen
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12",
          )}
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-10">
              <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-3 sm:mb-0">
                Trending on LoopNet
              </h2>
              <Link
                href="/properties"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center group transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm"
              >
                See More
                <ChevronDown className="w-5 h-5 ml-1 transform rotate-[-90deg] group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <Tabs
              value={trendingTab}
              onValueChange={setTrendingTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 max-w-lg mx-auto mb-8 bg-slate-100 dark:bg-slate-700 rounded-lg p-1 shadow-sm">
                {Object.keys(trendingPropertiesData).map((key) => (
                  <TabsTrigger
                    key={key}
                    value={key}
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:shadow-md data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-300 rounded-md h-10 text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-slate-700"
                  >
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </TabsTrigger>
                ))}
              </TabsList>

              {Object.entries(trendingPropertiesData).map(([key, trendProps]) => (
                <TabsContent
                  key={key}
                  value={key}
                  className="mt-8 focus:outline-none"
                >
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {trendProps.map((property, idx) => (
                      <div
                        key={property.id}
                        className={cn(
                          "transition-all duration-500 ease-out",
                          isTrendingSectionOnScreen
                            ? `opacity-100 translate-y-0 animation-delay-${
                                idx * 100
                              }`
                            : "opacity-0 translate-y-8",
                        )}
                      >
                        <Card className="overflow-hidden group hover:shadow-2xl dark:bg-slate-700/80 dark:border-slate-600 transition-all duration-300 transform hover:-translate-y-1.5 rounded-xl">
                          <CardHeader className="p-0 relative">
                            <Link
                              href={`/mock-property/${property.id}`}
                              className="block aspect-[4/3] relative overflow-hidden rounded-t-xl"
                            >
                                <Image
                                  src={property.image}
                                  alt={property.type}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                  quality={70}
                                />
                                <Badge
                                  variant="secondary"
                                  className="absolute top-3 left-3 z-10 bg-blue-600 text-white dark:bg-blue-500 dark:text-slate-900 shadow-md text-xs px-2 py-1"
                                >
                                  {property.type}
                                </Badge>
                                <div className="absolute top-3 right-3 z-10">
                                  <Button
                                    asChild
                                    size="icon"
                                    variant="ghost"
                                    className="w-9 h-9 rounded-full bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 backdrop-blur-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                                  >
                                    <button
                                      aria-label="Ajouter aux favoris"
                                      title="Ajouter aux favoris"
                                    >
                                      <Heart className="w-4 h-4 text-slate-600 dark:text-slate-300 group-hover:text-red-500 dark:group-hover:text-red-400 group-hover:fill-red-500/20 transition-all" />
                                    </button>
                                  </Button>
                                </div>
                            </Link>
                          </CardHeader>
                          <CardContent className="p-4">
                            <Link
                              href={`/mock-property/${property.id}`}
                              className="block"
                            >
                                <h3 className="font-semibold text-blue-700 dark:text-blue-400 text-md mb-1 hover:underline leading-tight">
                                  {property.price}
                                </h3>
                                <p
                                  className="text-sm text-slate-700 dark:text-slate-300 mb-1 truncate group-hover:text-clip group-hover:whitespace-normal"
                                  title={property.address}
                                >
                                  {property.address}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  {property.size}
                                </p>
                            </Link>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* Featured Properties from Database */}
        <section
          ref={featuredSectionRef}
          className={cn(
            "py-16 bg-slate-100 dark:bg-slate-800/50 transition-all duration-1000 ease-out",
            isFeaturedSectionOnScreen ? "opacity-100" : "opacity-0",
          )}
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                  Featured Properties
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Discover our best investment opportunities
                </p>
              </div>
              <Link href="/properties" className="mt-4 sm:mt-0">
                <Button
                  variant="outline"
                  size="lg"
                  className="dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md"
                >
                  View All Properties{" "}
                  <ChevronDown className="w-5 h-5 ml-2 transform rotate-[-90deg] group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-slate-700 rounded-xl shadow-lg h-96 animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {properties.slice(0, 8).map((propertyData, idx) => (
                  <div
                    key={propertyData._id}
                    className={cn(
                      "transition-all duration-500 ease-out",
                      isFeaturedSectionOnScreen
                        ? `opacity-100 translate-y-0 animation-delay-${
                            idx * 100
                          }`
                        : "opacity-0 translate-y-10",
                    )}
                  >
                    <PropertyCard
                      property={propertyData as any}
                      onAddToComparison={addToComparison}
                      isInComparison={comparisonList.some(
                        (item: { _id: string }) =>
                          item._id === propertyData._id,
                      )}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Live Auction Section */}
        <section
          ref={auctionSectionRef}
          className={cn(
            "py-20 bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-600 text-white transition-all duration-1000 ease-out",
            isAuctionSectionOnScreen
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95",
          )}
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div
                className={cn(
                  "bg-white/10 dark:bg-black/20 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-2xl transition-all duration-500 ease-out",
                  isAuctionSectionOnScreen
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-10 opacity-0",
                )}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <Badge
                    variant="destructive"
                    className="text-sm px-3 py-1 bg-red-500 border-red-500 shadow-md"
                  >
                    <Clock className="w-4 h-4 mr-2 animate-pulse" /> LIVE
                  </Badge>
                  <span className="text-lg font-semibold opacity-90">
                    Auction Ending Soon
                  </span>
                </div>
                <h3 className="text-3xl font-bold mb-2">Health Care</h3>
                <p className="text-lg mb-6 opacity-80 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 opacity-70" /> Boynton Beach,
                  FL
                </p>
                <div className="flex items-center justify-center space-x-1.5 sm:space-x-3 mb-8 p-4 bg-white/5 dark:bg-black/10 rounded-lg shadow-inner">
                  {[
                    { label: "Hours", value: timeLeft.hours },
                    { label: "Minutes", value: timeLeft.minutes },
                    { label: "Seconds", value: timeLeft.seconds },
                  ]
                    .map((time) => (
                      <div key={time.label} className="text-center px-1">
                        <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-amber-500 tabular-nums leading-none">
                          {formatTime(time.value)}
                        </div>
                        <div className="text-xs sm:text-sm opacity-70 uppercase tracking-wider mt-1">
                          {time.label}
                        </div>
                      </div>
                    ))
                    .reduce((prev, curr, index, arr) => {
                      prev.push(curr);
                      if (index < arr.length / 2 - 1) {
                        prev.push(
                          <div
                            key={`sep-${index}`}
                            className="text-xl sm:text-2xl md:text-3xl opacity-50 pt-1"
                          >
                            :
                          </div>,
                        );
                      }
                      return prev;
                    }, [] as React.ReactNode[])}
                </div>
                <div className="text-center">
                  <div className="text-sm opacity-80 mb-1">Starting Bid</div>
                  <div className="text-3xl md:text-4xl font-bold">
                    $1,750,000
                  </div>
                </div>
                <Button
                  size="xl"
                  className="w-full mt-8 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold text-lg transition-transform transform hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-700 rounded-lg py-3.5"
                >
                  Place Your Bid
                </Button>
              </div>
              <div
                className={cn(
                  "transition-all duration-500 ease-out delay-200",
                  isAuctionSectionOnScreen
                    ? "translate-x-0 opacity-100"
                    : "translate-x-10 opacity-0",
                )}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Discover Your Next Investment at Auction
                </h2>
                <p className="text-lg md:text-xl mb-8 opacity-90 leading-relaxed">
                  Identify and bid on quality assets through our transparent and
                  competitive platform—all online. Join the investors worldwide
                  who have partnered with us to successfully transact 11,000+
                  properties.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="xl"
                    variant="secondary"
                    className="bg-white/90 hover:bg-white text-purple-700 dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-purple-600 transition-transform transform hover:scale-105 rounded-lg px-8 py-3.5 text-base"
                  >
                    Learn More About Auctions
                  </Button>
                  <Button
                    size="xl"
                    variant="outline"
                    className="border-white/50 text-white hover:bg-white/10 dark:border-slate-400 dark:hover:bg-slate-700/50 transition-transform transform hover:scale-105 rounded-lg px-8 py-3.5 text-base"
                  >
                    View Auction Listings
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Cities Carousel */}
        <section
          ref={citiesSectionRef}
          className={cn(
            "py-16 bg-slate-100 dark:bg-slate-800/50 transition-all duration-1000 ease-out",
            isCitiesSectionOnScreen ? "opacity-100" : "opacity-0",
          )}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100 mb-12">
              Explore Popular Cities
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
              {popularCitiesData.map((city, index) => (
                <Link
                  key={index}
                  href={`/search/${city.name
                    .toLowerCase()
                    .replace(" ", "-")}`}
                  className={cn(
                    "block group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800",
                    isCitiesSectionOnScreen
                      ? `opacity-100 scale-100 animation-delay-${index * 100}`
                      : "opacity-0 scale-90",
                  )}
                >
                  <div className="relative aspect-[3/4]">
                    <Image
                      src={city.image}
                      alt={city.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      quality={70}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-3 sm:p-4 w-full">
                      <h3 className="font-semibold text-md sm:text-lg text-white group-hover:text-blue-300 transition-colors drop-shadow-md text-center sm:text-left">
                        {city.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Commercial Real Estate Explained */}
        <section
          ref={articlesSectionRef}
          className={cn(
            "py-16 bg-white dark:bg-slate-800 transition-all duration-1000 ease-out",
            isArticlesSectionOnScreen ? "opacity-100" : "opacity-0",
          )}
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-12">
              <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-3 sm:mb-0">
                Commercial Real Estate Explained
              </h2>
              <Link
                href="/cre-explained"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center group transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm"
              >
                See More{" "}
                <ChevronDown className="w-5 h-5 ml-1 transform rotate-[-90deg] group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {educationalArticlesData.map((article, index) => (
                <Card
                  key={index}
                  className={cn(
                    "overflow-hidden group hover:shadow-2xl dark:bg-slate-700/80 dark:border-slate-600 transition-all duration-500 transform hover:-translate-y-1.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-800 rounded-xl",
                    isArticlesSectionOnScreen
                      ? `opacity-100 translate-y-0 animation-delay-${
                          index * 150
                        }`
                      : "opacity-0 translate-y-8",
                  )}
                >
                  <Link href={`/news/mock-article-${index}`} className="h-full flex flex-col">
                      <div className="aspect-[16/9] overflow-hidden relative rounded-t-xl">
                        <Image
                          src={article.image}
                          alt={article.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <CardContent className="p-5 sm:p-6 flex-grow flex flex-col">
                        <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                          {article.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-3 mb-3 leading-relaxed flex-grow">
                          {article.description}
                        </p>
                        <span className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:underline mt-auto pt-2">
                          Read article{" "}
                          <ChevronDown className="w-4 h-4 ml-1 transform rotate-[-90deg] transition-transform" />
                        </span>
                      </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Marketing to Listers */}
        <section
          ref={marketingSectionRef}
          className={cn(
            "py-20 bg-blue-600 dark:bg-blue-700 text-white transition-all duration-1000 ease-out",
            isMarketingSectionOnScreen ? "opacity-100" : "opacity-0",
          )}
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                LoopNet Listings Lease or Sell 14% Faster*
              </h2>
              <p className="text-lg opacity-90 max-w-2xl mx-auto">
                Reach millions of active tenants and investors. Our platform is
                designed to get your property noticed and leased or sold
                quickly.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {[
                {
                  icon: <Users className="w-10 h-10" />,
                  title: "Right Audience",
                  desc: "96% of the Fortune 1000 search on LoopNet.",
                },
                {
                  icon: <Star className="w-10 h-10" />,
                  title: "Engage Prospects",
                  desc: "Stunning photography, videos and drone shots.",
                },
                {
                  icon: <TrendingUp className="w-10 h-10" />,
                  title: "More Opportunity",
                  desc: "Find a tenant or buyer, faster than before.",
                },
              ].map((item, index) => (
                <div
                  key={item.title}
                  className={cn(
                    "text-center p-6 md:p-8 bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-xl shadow-xl transition-all duration-500 transform hover:scale-105 hover:shadow-2xl",
                    isMarketingSectionOnScreen
                      ? `opacity-100 translate-y-0 animation-delay-${
                          index * 100
                        }`
                      : "opacity-0 translate-y-5",
                  )}
                >
                  <div className="w-20 h-20 bg-white/20 dark:bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md ring-1 ring-white/20">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                  <p className="opacity-80 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Button
                size="xl"
                variant="secondary"
                className="bg-white/90 hover:bg-white text-blue-700 dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-blue-600 transition-transform transform hover:scale-105 rounded-lg px-10 py-3.5 text-base sm:text-lg"
              >
                Explore Marketing Solutions
              </Button>
              <p className="text-xs opacity-75 mt-6 max-w-md mx-auto">
                *Based on internal analysis comparing properties advertised on
                LoopNet to properties listed only on CoStar.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section
          ref={faqSectionRef}
          className={cn(
            "py-16 bg-slate-100 dark:bg-slate-800/50 transition-all duration-1000 ease-out",
            isFaqSectionOnScreen ? "opacity-100" : "opacity-0",
          )}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100 mb-12">
              Commercial Real Estate Fundamentals: Essential Questions for
              Investors & Businesses
            </h2>
            <div className="max-w-3xl mx-auto space-y-4 sm:space-y-5">
              {[
                {
                  question:
                    "Is LoopNet Available for International Property Searches?",
                  answer:
                    "Yes, LoopNet operates globally, with dedicated platforms for commercial real estate in the UK, Canada, France, and Spain. These country specific versions offer localized commercial property listings and search capabilities.",
                },
                {
                  question:
                    "Office Space or Coworking: Which Fits Your Business Needs?",
                  answer:
                    "Deciding between coworking and traditional office space depends on your team's size, budget, and how quickly you need to move in. For short term flexibility or shared amenities, coworking spaces may be the better fit.",
                },
                {
                  question:
                    "What Should I Know Before Investing in Multifamily Properties?",
                  answer:
                    "Multifamily properties offer steady cash flow, appreciation, and scalable management, making them a cornerstone of many investment portfolios. Key financial metrics like net operating income, cap rate, and internal rate of return help investors evaluate opportunities with precision.",
                },
              ].map((faq, index) => (
                <Card
                  key={index}
                  className={cn(
                    "bg-white dark:bg-slate-700 shadow-md hover:shadow-lg dark:border-slate-600 transition-all duration-500 ease-out rounded-lg",
                    isFaqSectionOnScreen
                      ? `opacity-100 translate-x-0 animation-delay-${
                          index * 100
                        }`
                      : "opacity-0 -translate-x-5",
                  )}
                >
                  <CardContent className="p-0">
                    <details className="group p-5 sm:p-6">
                      <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-lg text-slate-800 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm">
                        <span className="flex-1 pr-2">{faq.question}</span>
                        <ChevronDown className="w-5 h-5 text-slate-500 dark:text-slate-400 group-open:rotate-180 transition-transform duration-300 transform flex-shrink-0" />
                      </summary>
                      <div className="grid grid-rows-[0fr] group-open:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-in-out">
                        <div className="overflow-hidden">
                          <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed text-base pt-4 border-t border-slate-200 dark:border-slate-600">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </details>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900 dark:bg-black text-slate-300 dark:text-slate-400 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-10">
              <div className="col-span-2 md:col-span-4 lg:col-span-2 pr-8">
                <Link
                  href="/"
                  className="flex items-center space-x-2 mb-4 group"
                >
                  <Building2 className="h-8 w-8 text-blue-500 group-hover:text-blue-400 transition-colors" />
                  <span className="text-2xl font-bold text-white group-hover:text-slate-200 transition-colors">
                    LoopNet
                  </span>
                </Link>
                <p className="text-sm mb-6 leading-relaxed">
                  The leading commercial real estate marketplace connecting
                  buyers, sellers, and industry professionals worldwide.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-4 text-base">
                  For Sale
                </h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>
                    <Link href="#" className="hover:text-white">
                      Office Buildings for Sale
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-4 text-base">
                  For Lease
                </h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>
                    <Link href="#" className="hover:text-white">
                      Office Space for Lease
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-4 text-base">
                  Resources
                </h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>
                    <Link href="#" className="hover:text-white">
                      Market Data
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-4 text-base">
                  Company
                </h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>
                    <Link href="#" className="hover:text-white">
                      About
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-800 dark:border-slate-700 mt-10 pt-10 text-center text-sm">
              <p>
                © {new Date().getFullYear()} LoopNet Clone. All rights
                reserved.
              </p>
              <p className="mt-2">
                <Link href="/terms" className="hover:underline mx-2">
                  Terms of Service
                </Link>{" "}
                |
                <Link href="/privacy" className="hover:underline mx-2">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </footer>


      </div>
    </div>
  );
}

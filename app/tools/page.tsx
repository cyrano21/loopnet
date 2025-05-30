"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calculator,
  Heart,
  GitCompare,
  Search,
  Bell,
  Download,
  FileText,
  BarChart3,
  TrendingUp,
  Lock,
  Map,
  BookmarkPlus,
  DollarSign,
  Zap,
  ChevronDown,
  Star,
  Sparkles,
  ArrowRight,
  Users,
  Target,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";
import { usePermissions } from "@/hooks/use-permissions";
import { AccessRestriction } from "@/components/access-restriction";
import { Button } from "@/components/ui/button";
import type { UserPermissions } from "@/lib/permissions";

const freeTools: ToolItem[] = [
  {
    title: "Calculateur de Taux de Capitalisation",
    description:
      "Calculez le taux de capitalisation de vos investissements immobiliers pour évaluer leur rentabilité et comparer différentes opportunités",
    href: "/tools/cap-rate-calculator",
    icon: Calculator,
    badge: "Gratuit",
  },
  {
    title: "Propriétés Favorites",
    description:
      "Enregistrez et organisez vos propriétés préférées pour y accéder facilement et suivre leur évolution",
    href: "/favorites",
    icon: Heart,
    badge: "Gratuit",
  },
  {
    title: "Comparaison de Propriétés",
    description:
      "Analysez et comparez jusqu'à 4 propriétés côte à côte selon différents critères pour prendre la meilleure décision",
    href: "/compare",
    icon: GitCompare,
    badge: "Gratuit",
  },
];

const premiumTools: ToolItem[] = [
  {
    title: "Recherches Sauvegardées",
    description:
      "Enregistrez vos critères de recherche spécifiques pour gagner du temps et suivre régulièrement le marché sans ressaisir vos paramètres",
    href: "/tools/saved-searches",
    icon: BookmarkPlus,
    badge: "Premium",
    action: "canSaveSearches" as keyof UserPermissions,
  },
  {
    title: "Alertes de Recherche",
    description:
      "Configurez des alertes personnalisées et recevez des notifications automatiques dès qu'une nouvelle propriété correspond à vos critères",
    href: "/tools/search-alerts",
    icon: Bell,
    badge: "Premium",
    action: "canSetAlerts" as keyof UserPermissions,
  },
  {
    title: "Export de Données",
    description:
      "Exportez les données détaillées des propriétés dans différents formats (Excel, CSV, PDF) pour analyse ou présentation client",
    href: "/tools/data-export",
    icon: Download,
    badge: "Premium",
    action: "canExportData" as keyof UserPermissions,
  },
];

const proTools: ToolItem[] = [
  {
    title: "Générateur de Rapports",
    description:
      "Créez des rapports professionnels personnalisés sur les propriétés et le marché avec votre logo et charte graphique pour vos clients",
    href: "/tools/reports",
    icon: FileText,
    badge: "Pro",
    action: "canGenerateReports" as keyof UserPermissions,
  },
  {
    title: "Analyse de Marché",
    description:
      "Accédez à des analyses détaillées du marché immobilier par secteur, avec graphiques et tendances pour prendre des décisions éclairées",
    href: "/tools/market-analysis",
    icon: BarChart3,
    badge: "Pro",
    action: "canViewMarketAnalytics" as keyof UserPermissions,
  },
  {
    title: "Historique des Prix",
    description:
      "Visualisez l'évolution historique des prix par zone et par type de bien pour identifier les cycles et opportunités d'investissement",
    href: "/tools/price-history",
    icon: TrendingUp,
    badge: "Pro",
    action: "canViewPropertyHistory" as keyof UserPermissions,
  },
];

const agentTools: ToolItem[] = [
  {
    title: "Cartes de Marché Avancées",
    description:
      "Explorez des cartes interactives avec données de marché en temps réel, zones de chalandise et indicateurs démographiques pour une analyse complète",
    href: "/tools/advanced-maps",
    icon: Map,
    badge: "Agent",
    action: "canViewMarketAnalytics" as keyof UserPermissions,
  },
  {
    title: "Calculateur de Commission",
    description:
      "Estimez précisément vos commissions et revenus potentiels sur différentes transactions immobilières avec prise en compte des frais",
    href: "/tools/commission-calculator",
    icon: DollarSign,
    badge: "Agent",
    action: "canListProperties" as keyof UserPermissions,
  },
];

// Type pour les outils avec des actions qui doivent être des clés de UserPermissions
interface ToolItem {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  badge: string;
  action?: keyof UserPermissions;
}

// Fonction pour vérifier si une action est une clé valide de UserPermissions
function isValidUserPermissionKey(key: string): key is keyof UserPermissions {
  return (
    key !== undefined &&
    key !== null &&
    [
      "canViewProperties",
      "maxPropertiesView",
      "canViewPropertyDetails",
      "canViewSellerInfo",
      "canContactSeller",
      "canListProperties",
      "maxListings",
      "canAddFavorites",
      "maxFavorites",
      "canCompareProperties",
      "maxComparisons",
      "canUseAdvancedSearch",
      "canSaveSearches",
      "maxSavedSearches",
      "canSetAlerts",
      "maxAlerts",
      "canViewMarketAnalytics",
      "canViewPropertyHistory",
      "canViewPriceEstimates",
      "canCallSellers",
      "canEmailSellers",
      "canScheduleVisits",
      "canExportData",
      "canGenerateReports",
      "canUseCRM",
      "canManageTasks",
      "canUseAI",
      "canAccessAPI",
      "hasCustomerSupport",
    ].includes(key)
  );
}

export default function OutilsPage() {
  const { can } = usePermissions();

  const ToolCard = ({
    tool,
    isLocked = false,
  }: {
    tool: ToolItem;
    isLocked?: boolean;
  }) => {
    const Icon = tool.icon;

    // Si l'outil nécessite une permission et que l'utilisateur n'a pas cette permission
    if (tool.action && isLocked) {
      // Déterminer le niveau requis en fonction du badge de l'outil
      const requiredLevel = (() => {
        switch (tool.badge) {
          case "Premium":
            return "premium";
          case "Pro":
            return "premium";
          case "Agent":
            return "agent";
          default:
            return "simple";
        }
      })();

      return (
        <AccessRestriction
          action={
            tool.action && isValidUserPermissionKey(tool.action)
              ? tool.action
              : "canViewProperties"
          }
          showUpgradePrompt={true}
          requiredLevel={requiredLevel}
        >
          <Card className="h-full transition-all duration-500 hover:shadow-2xl hover:scale-105 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-400/10 to-gray-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-gray-400 to-gray-600 rounded-xl shadow-lg">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-gray-600 dark:text-gray-300">
                      {tool.title}
                    </CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {tool.badge}
                      </Badge>
                      <Lock className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
              <CardDescription className="text-gray-500 dark:text-gray-400 leading-relaxed">
                {tool.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <Button
                variant="outline"
                size="sm"
                className="w-full border-dashed"
              >
                <Lock className="w-4 h-4 mr-2" />
                Mise à niveau requise
              </Button>
            </CardContent>
          </Card>
        </AccessRestriction>
      );
    }

    return (
      <Link href={tool.href} className="group block h-full">
        <Card className="h-full transition-all duration-500 hover:shadow-2xl hover:scale-105 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-slate-800 dark:via-slate-800/80 dark:to-slate-900 border-0 shadow-lg group-hover:shadow-blue-500/25 dark:group-hover:shadow-blue-400/25 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-2xl transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-700"></div>

          <CardHeader className="pb-4 relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-500">
                <Icon className="h-7 w-7 text-white" />
              </div>
              <Badge
                variant={tool.badge === "Gratuit" ? "secondary" : "default"}
                className={`${
                  tool.badge === "Gratuit"
                    ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300"
                    : "bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0"
                } shadow-md px-3 py-1 text-sm font-medium`}
              >
                {tool.badge === "Gratuit" && <Star className="w-3 h-3 mr-1" />}
                {tool.badge !== "Gratuit" && (
                  <Sparkles className="w-3 h-3 mr-1" />
                )}
                {tool.badge}
              </Badge>
            </div>
            <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 mb-3">
              {tool.title}
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
              {tool.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:translate-x-2 transition-transform duration-300">
                <span className="text-sm">Découvrir l'outil</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors duration-300">
                <ChevronDown className="w-4 h-4 text-blue-600 dark:text-blue-400 transform rotate-[-90deg]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };

  const FeatureCard = ({
    icon: Icon,
    title,
    description,
  }: {
    icon: any;
    title: string;
    description: string;
  }) => (
    <div className="text-center p-6 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Éléments décoratifs d'arrière-plan */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-indigo-400/10 rounded-full blur-2xl"></div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-8 shadow-lg backdrop-blur-sm border border-white/20">
              <Zap className="w-5 h-5 mr-2" />
              Suite d'Outils Professionnels
              <Sparkles className="w-4 h-4 ml-2" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
              Transformez Vos
              <br />
              <span className="text-6xl md:text-8xl">Investissements</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 leading-relaxed max-w-4xl mx-auto">
              Une suite d'outils intelligents conçue pour maximiser vos
              performances, automatiser vos analyses et révolutionner votre
              approche immobilière
            </p>
            <div className="flex flex-wrap gap-6 justify-center mb-12">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Search className="w-6 h-6 mr-3" />
                Explorer les outils
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-blue-200 dark:border-blue-800 px-8 py-4 text-lg rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300"
              >
                <TrendingUp className="w-6 h-6 mr-3" />
                Voir les tarifs
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <FeatureCard
                icon={Users}
                title="10,000+ Utilisateurs"
                description="Professionnels qui nous font confiance"
              />
              <FeatureCard
                icon={Target}
                title="15+ Outils"
                description="Solutions complètes pour tous vos besoins"
              />
              <FeatureCard
                icon={Lightbulb}
                title="IA Intégrée"
                description="Analyses intelligentes automatisées"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-20 relative z-10">
        {/* Outils Gratuits */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4 mr-2" />
              Accès Gratuit
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 dark:text-slate-100">
              Commencez <span className="text-emerald-600">Gratuitement</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Découvrez la puissance de nos outils essentiels sans aucun
              engagement. Parfait pour débuter votre journey immobilier.
            </p>
          </div>
          <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {freeTools.map((tool, index) => (
              <div
                key={tool.href}
                className="opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <ToolCard tool={tool} />
              </div>
            ))}
          </div>
        </div>

        {/* Outils Premium */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Premium
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 dark:text-slate-100">
              Fonctionnalités{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Avancées
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Automatisez vos recherches, configurez des alertes intelligentes
              et exportez vos données pour une approche professionnelle
              complète.
            </p>
          </div>
          <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {premiumTools.map((tool, index) => (
              <div
                key={tool.href}
                className="opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]"
                style={{ animationDelay: `${index * 200 + 400}ms` }}
              >
                <ToolCard
                  tool={tool}
                  isLocked={tool.action ? !can(tool.action) : false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Outils Pro */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium mb-6">
              <BarChart3 className="w-4 h-4 mr-2" />
              Professional
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 dark:text-slate-100">
              Analyses{" "}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Expertes
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Accédez à des analyses de marché approfondies, générez des
              rapports professionnels et exploitez l'historique des données pour
              vos décisions stratégiques.
            </p>
          </div>
          <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {proTools.map((tool, index) => (
              <div
                key={tool.href}
                className="opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]"
                style={{ animationDelay: `${index * 200 + 800}ms` }}
              >
                <ToolCard
                  tool={tool}
                  isLocked={tool.action ? !can(tool.action) : false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Outils Agent */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium mb-6">
              <Users className="w-4 h-4 mr-2" />
              Agent Immobilier
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 dark:text-slate-100">
              Solutions{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                Professionnelles
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Outils spécialisés pour les agents immobiliers : cartes
              interactives avancées, calculateurs de commission et gestion
              client complète.
            </p>
          </div>
          <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {agentTools.map((tool, index) => (
              <div
                key={tool.href}
                className="opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]"
                style={{ animationDelay: `${index * 200 + 1200}ms` }}
              >
                <ToolCard
                  tool={tool}
                  isLocked={tool.action ? !can(tool.action) : false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 shadow-2xl">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à transformer votre approche immobilière ?
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers de professionnels qui utilisent déjà nos
            outils pour maximiser leurs investissements.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-xl shadow-lg"
            >
              Commencer gratuitement
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg rounded-xl"
            >
              Découvrir Premium
            </Button>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}

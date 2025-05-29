"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowUpDown,
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Database as DatabaseBackup,
  DollarSign,
  Download,
  Edit,
  Eye,
  FileText,
  Filter,
  Home,
  MoreHorizontal,
  PieChart,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Shield,
  Sliders,
  Terminal,
  Trash2,
  TrendingUp,
  User,
  UserCheck,
  UserPlus,
  Users,
  X,
  XCircle,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// Types
type UserRole = "ADMIN" | "AGENT" | "USER" | "GUEST" | "PREMIUM";
type UserStatus = "ACTIVE" | "PENDING" | "SUSPENDED";
type PropertyStatus =
  | "DRAFT"
  | "PENDING"
  | "PUBLISHED"
  | "REJECTED"
  | "SOLD"
  | "RENTED";

interface DashboardStats {
  users: {
    total: number;
    admin: number;
    agent: number;
    premium: number;
    simple: number;
    guest: number;
    active: number;
    pending: number;
    suspended: number;
  };
  properties: {
    total: number;
    active: number;
    pending: number;
    rejected: number;
    sold: number;
    rented: number;
    types: Record<string, number>;
  };
  revenue: {
    monthly: number;
    yearly: number;
    growth: number;
    transactions: number;
    averageOrderValue: number;
  };
  activity: {
    newUsersThisMonth: number;
    propertiesAddedThisMonth: number;
    activeUsers: number;
    pageViews: number;
  };
  stripe: {
    balance: number;
    pendingPayouts: number;
    totalPayouts: number;
  };
}

// Formatage des devises
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(value);
};

// Formatage des dates
const formatDate = (dateString: string) => {
  return format(new Date(dateString), "PPP", { locale: fr });
};

const AdminDashboard = () => {
  // 1. ALL HOOKS CALLED AT THE TOP, UNCONDITIONALLY
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    users: {
      total: 1247,
      admin: 5,
      agent: 42,
      premium: 356,
      simple: 844,
      guest: 0,
      active: 1189,
      pending: 23,
      suspended: 35,
    },
    properties: {
      total: 2458,
      active: 1987,
      pending: 124,
      rejected: 45,
      sold: 256,
      rented: 91,
      types: { appartement: 1245, maison: 867, terrain: 198, local: 148 },
    },
    revenue: {
      monthly: 28473.92,
      yearly: 341687.04,
      growth: 15.5,
      transactions: 1247,
      averageOrderValue: 274.05,
    },
    activity: {
      newUsersThisMonth: 124,
      propertiesAddedThisMonth: 87,
      activeUsers: 847,
      pageViews: 125478,
    },
    stripe: {
      balance: 1254780,
      pendingPayouts: 245780,
      totalPayouts: 10245890,
    },
  });

  // Effect for handling redirection based on session status and role
  useEffect(() => {
    if (sessionStatus === "authenticated") {
      if (!session || session.user.role !== "admin") {
        router.push("/dashboard");
      }
    } else if (sessionStatus === "unauthenticated") {
      router.push("/auth/signin"); // Ajustez ce chemin vers votre page de connexion
    }
  }, [session, sessionStatus, router]);

  // Effect for loading dashboard-specific data
  useEffect(() => {
    if (
      sessionStatus === "authenticated" &&
      session &&
      session.user.role === "admin"
    ) {
      const timer = setTimeout(() => {
        setIsLoadingDashboard(false);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (sessionStatus !== "loading") {
      setIsLoadingDashboard(false);
    }
  }, [session, sessionStatus]);

  // Données simulées pour les utilisateurs récents
  const recentUsers = [
    {
      id: "1",
      name: "Marie Dubois",
      email: "marie@example.com",
      role: "USER" as UserRole,
      status: "ACTIVE" as UserStatus,
      avatar: "/avatars/user-01.jpg",
      lastLogin: "2024-01-15T14:30:00Z",
      joinDate: "2023-06-15",
    },
    {
      id: "2",
      name: "Pierre Martin",
      email: "pierre@example.com",
      role: "AGENT" as UserRole,
      status: "PENDING" as UserStatus,
      avatar: "/avatars/user-02.jpg",
      lastLogin: "2024-01-14T09:15:00Z",
      joinDate: "2024-01-14",
    },
    {
      id: "3",
      name: "Sophie Laurent",
      email: "sophie@example.com",
      role: "USER" as UserRole,
      status: "ACTIVE" as UserStatus,
      avatar: "/avatars/user-03.jpg",
      lastLogin: "2024-01-13T16:45:00Z",
      joinDate: "2023-11-22",
    },
    {
      id: "4",
      name: "Thomas Bernard",
      email: "thomas@example.com",
      role: "PREMIUM" as UserRole,
      status: "ACTIVE" as UserStatus,
      avatar: "/avatars/user-04.jpg",
      lastLogin: "2024-01-12T11:20:00Z",
      joinDate: "2023-09-05",
    },
    {
      id: "5",
      name: "Julie Petit",
      email: "julie@example.com",
      role: "USER" as UserRole,
      status: "SUSPENDED" as UserStatus,
      avatar: "/avatars/user-05.jpg",
      lastLogin: "2024-01-11T10:05:00Z",
      joinDate: "2023-12-18",
    },
  ];

  // Données simulées pour les propriétés récentes
  const recentProperties = [
    {
      id: "1",
      title: "Appartement Paris 16e",
      owner: "Marie Dubois",
      status: "PENDING" as PropertyStatus,
      price: 850000,
      type: "Appartement",
      location: "Paris 16e, France",
      image: "/properties/prop-01.jpg",
      createdAt: "2024-01-15T14:30:00Z",
      updatedAt: "2024-01-15T14:30:00Z",
    },
    {
      id: "2",
      title: "Villa avec vue sur mer à Cannes",
      owner: "Pierre Martin",
      status: "PUBLISHED" as PropertyStatus,
      price: 2500000,
      type: "Villa",
      location: "Cannes, France",
      image: "/properties/prop-02.jpg",
      createdAt: "2024-01-14T09:15:00Z",
      updatedAt: "2024-01-14T09:15:00Z",
    },
    {
      id: "3",
      title: "Bureau d'affaires centre-ville",
      owner: "Sophie Laurent",
      status: "PUBLISHED" as PropertyStatus,
      price: 450000,
      type: "Bureau",
      location: "Lyon, France",
      image: "/properties/prop-03.jpg",
      createdAt: "2024-01-13T16:45:00Z",
      updatedAt: "2024-01-13T16:45:00Z",
    },
    {
      id: "4",
      title: "Loft industriel à Bordeaux",
      owner: "Thomas Bernard",
      status: "DRAFT" as PropertyStatus,
      price: 320000,
      type: "Appartement",
      location: "Bordeaux, France",
      image: "/properties/prop-04.jpg",
      createdAt: "2024-01-12T11:20:00Z",
      updatedAt: "2024-01-12T11:20:00Z",
    },
    {
      id: "5",
      title: "Chalet montagnard aux Gets",
      owner: "Julie Petit",
      status: "REJECTED" as PropertyStatus,
      price: 1250000,
      type: "Chalet",
      location: "Les Gets, France",
      image: "/properties/prop-05.jpg",
      createdAt: "2024-01-11T10:05:00Z",
      updatedAt: "2024-01-11T10:05:00Z",
    },
  ];

  // Fonction pour obtenir la couleur en fonction du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
      case "PUBLISHED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "SUSPENDED":
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "DRAFT":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // 2. CONDITIONAL RENDERING LOGIC AFTER ALL HOOKS
  if (sessionStatus === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin" />
        <p className="ml-2">Chargement de la session...</p>
      </div>
    );
  }

  if (
    sessionStatus !== "authenticated" ||
    !session ||
    session.user.role !== "admin"
  ) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin" />
        <p className="ml-2">Vérification des autorisations...</p>
      </div>
    );
  }

  if (isLoadingDashboard) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
          <p className="text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  // 3. RENDER THE ACTUAL DASHBOARD CONTENT
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="space-y-8">
          {/* Header Admin */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-6 h-6 text-red-600" />
                <h1 className="text-3xl font-bold">Administration</h1>
                <Badge className="bg-red-100 text-red-800">ADMIN</Badge>
              </div>
              <p className="text-gray-600">
                Gestion complète de la plateforme LoopNet
              </p>
            </div>
            <div className="flex gap-2">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 derniers jours</SelectItem>
                  <SelectItem value="30d">30 derniers jours</SelectItem>
                  <SelectItem value="90d">90 derniers jours</SelectItem>
                  <SelectItem value="1y">1 an</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Navigation rapide vers les autres dashboards */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Accès aux Dashboards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Dashboard Utilisateur
                  </Button>
                </Link>
                <Link href="/agent-dashboard">
                  <Button variant="outline" className="w-full justify-start">
                    <Building2 className="w-4 h-4 mr-2" />
                    Dashboard Agent
                  </Button>
                </Link>
                <Link href="/admin">
                  <Button variant="default" className="w-full justify-start">
                    <Shield className="w-4 h-4 mr-2" />
                    Dashboard Admin (Actuel)
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Button className="h-full py-8 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:bg-blue-50">
              <UserPlus className="w-6 h-6 text-blue-600" />
              <span className="font-medium">Ajouter un utilisateur</span>
            </Button>
            <Button
              variant="outline"
              className="h-full py-8 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:bg-green-50"
            >
              <Home className="w-6 h-6 text-green-600" />
              <span className="font-medium">Ajouter une propriété</span>
            </Button>
            <Button
              variant="outline"
              className="h-full py-8 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:bg-purple-50"
            >
              <CreditCard className="w-6 h-6 text-purple-600" />
              <span className="font-medium">Voir les paiements</span>
            </Button>
            <Button
              variant="outline"
              className="h-full py-8 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:bg-orange-50"
            >
              <FileText className="w-6 h-6 text-orange-600" />
              <span className="font-medium">Générer un rapport</span>
            </Button>
          </div>

          {/* Métriques globales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-green-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Utilisateurs
                    </p>
                    <div className="text-2xl font-bold">
                      {dashboardStats.users.total.toLocaleString()}
                    </div>
                    <div className="flex items-center mt-1">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-xs text-green-600">
                        +{dashboardStats.activity.newUsersThisMonth} ce mois
                      </span>
                    </div>
                  </div>
                  <div className="p-3 rounded-full bg-green-50 text-green-600">
                    <Users className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Actifs: {dashboardStats.users.active}</span>
                    <span>En attente: {dashboardStats.users.pending}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Propriétés
                    </p>
                    <div className="text-2xl font-bold">
                      {dashboardStats.properties.total.toLocaleString()}
                    </div>
                    <div className="flex items-center mt-1">
                      <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                      <span className="text-xs text-blue-600">
                        +{dashboardStats.activity.propertiesAddedThisMonth} ce
                        mois
                      </span>
                    </div>
                  </div>
                  <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                    <Building2 className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                    <span>✓ {dashboardStats.properties.active} actives</span>
                    <span>
                      ⏳ {dashboardStats.properties.pending} en attente
                    </span>
                    <span>✗ {dashboardStats.properties.rejected} rejetées</span>
                    <span>🏠 {dashboardStats.properties.sold} vendues</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Revenu (30j)
                    </p>
                    <div className="text-2xl font-bold">
                      {formatCurrency(dashboardStats.revenue.monthly)}
                    </div>
                    <div className="flex items-center mt-1">
                      <TrendingUp className="w-4 h-4 text-purple-500 mr-1" />
                      <span className="text-xs text-purple-600">
                        +{dashboardStats.revenue.growth}% vs mois dernier
                      </span>
                    </div>
                  </div>
                  <div className="p-3 rounded-full bg-purple-50 text-purple-600">
                    <DollarSign className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>
                      Annuel: {formatCurrency(dashboardStats.revenue.yearly)}
                    </span>
                    <span>
                      {dashboardStats.revenue.transactions} transactions
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Utilisateurs actifs
                    </p>
                    <div className="text-2xl font-bold">
                      {dashboardStats.activity.activeUsers.toLocaleString()}
                    </div>
                    <div className="flex items-center mt-1">
                      <Activity className="w-4 h-4 text-amber-500 mr-1" />
                      <span className="text-xs text-amber-600">
                        {Math.round(
                          (dashboardStats.activity.activeUsers /
                            dashboardStats.users.total) *
                            100
                        )}
                        % des utilisateurs
                      </span>
                    </div>
                  </div>
                  <div className="p-3 rounded-full bg-amber-50 text-amber-600">
                    <Activity className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>
                      {dashboardStats.activity.pageViews.toLocaleString()} vues
                    </span>
                    <span>
                      {Math.round(
                        (dashboardStats.activity.activeUsers /
                          dashboardStats.users.total) *
                          100
                      )}
                      % d'engagement
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contenu principal avec onglets */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="flex w-full overflow-x-auto">
              <TabsTrigger value="overview">
                <BarChart3 className="w-4 h-4 mr-2" />
                Vue d'ensemble
              </TabsTrigger>
              <TabsTrigger value="users">
                <Users className="w-4 h-4 mr-2" />
                Utilisateurs
              </TabsTrigger>
              <TabsTrigger value="properties">
                <Building2 className="w-4 h-4 mr-2" />
                Propriétés
              </TabsTrigger>
              <TabsTrigger value="payments">
                <CreditCard className="w-4 h-4 mr-2" />
                Paiements
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <Activity className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="system">
                <Settings className="w-4 h-4 mr-2" />
                Système
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="w-4 h-4 mr-2" />
                Configuration
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Répartition des utilisateurs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4 text-center">
                    <div className="p-4 border rounded-lg bg-blue-50">
                      <div className="text-2xl font-bold">
                        {dashboardStats.users.admin}
                      </div>
                      <div className="text-sm text-blue-600">
                        Administrateurs
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg bg-green-50">
                      <div className="text-2xl font-bold">
                        {dashboardStats.users.agent}
                      </div>
                      <div className="text-sm text-green-600">Agents</div>
                    </div>
                    <div className="p-4 border rounded-lg bg-purple-50">
                      <div className="text-2xl font-bold">
                        {dashboardStats.users.premium}
                      </div>
                      <div className="text-sm text-purple-600">
                        Utilisateurs Premium
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg bg-gray-50">
                      <div className="text-2xl font-bold">
                        {dashboardStats.users.simple}
                      </div>
                      <div className="text-sm text-gray-600">
                        Utilisateurs standards
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Activité Système
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <UserCheck className="w-5 h-5 text-green-600" />
                          <span>
                            {dashboardStats.activity.newUsersThisMonth} nouveaux
                            utilisateurs ce mois
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          Mise à jour récente
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Building2 className="w-5 h-5 text-blue-600" />
                          <span>
                            {dashboardStats.activity.propertiesAddedThisMonth}{" "}
                            propriétés ajoutées ce mois
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          Mise à jour récente
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="w-5 h-5 text-orange-600" />
                          <span>Propriété en attente de validation</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          Il y a 25 min
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Santé du Système
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Nouveaux utilisateurs (30j)</span>
                        <Badge className="bg-green-100 text-green-800">
                          +{dashboardStats.activity.newUsersThisMonth}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Nouvelles propriétés (30j)</span>
                        <Badge className="bg-blue-100 text-blue-800">
                          +{dashboardStats.activity.propertiesAddedThisMonth}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Temps de réponse API</span>
                        <Badge className="bg-green-100 text-green-800">
                          142ms
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Disponibilité</span>
                        <Badge className="bg-green-100 text-green-800">
                          99.9%
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Gestion des Utilisateurs</CardTitle>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Rechercher un utilisateur..."
                        value={searchTerm}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setSearchTerm(e.target.value)
                        }
                        className="pl-8 w-64"
                      />
                    </div>
                    <Button variant="outline">
                      <Filter className="w-4 h-4 mr-2" />
                      Filtrer
                    </Button>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Nouvel utilisateur
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Utilisateur</TableHead>
                        <TableHead>Rôle</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Date d'inscription</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-gray-600">
                                {user.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                user.role === "ADMIN"
                                  ? "bg-red-100 text-red-800"
                                  : user.role === "AGENT"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                              }
                            >
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                user.status === "ACTIVE"
                                  ? "bg-green-100 text-green-800"
                                  : user.status === "PENDING"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }
                            >
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(user.joinDate).toLocaleDateString(
                              "fr-FR"
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="properties" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Gestion des Propriétés</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Filter className="w-4 h-4 mr-2" />
                      Filtrer
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Propriété</TableHead>
                        <TableHead>Propriétaire</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Prix</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentProperties.map((property) => (
                        <TableRow key={property.id}>
                          <TableCell className="font-medium">
                            {property.title}
                          </TableCell>
                          <TableCell>{property.owner}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{property.type}</Badge>
                          </TableCell>
                          <TableCell>
                            {property.price.toLocaleString("fr-FR")}€
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(property.status)}>
                              {property.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <UserCheck className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments" className="space-y-6">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Tableau de bord des paiements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6 mb-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <p className="text-sm font-medium text-gray-600">
                            Solde disponible
                          </p>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {formatCurrency(
                              dashboardStats.stripe.balance / 100
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            Paiements en attente:{" "}
                            {formatCurrency(
                              dashboardStats.stripe.pendingPayouts / 100
                            )}
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <p className="text-sm font-medium text-gray-600">
                            Transactions (30j)
                          </p>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {dashboardStats.revenue.transactions}
                          </div>
                          <p className="text-xs text-gray-500">
                            Panier moyen:{" "}
                            {formatCurrency(
                              dashboardStats.revenue.averageOrderValue
                            )}
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <p className="text-sm font-medium text-gray-600">
                            Paiements
                          </p>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {formatCurrency(dashboardStats.revenue.monthly)}
                          </div>
                          <p className="text-xs text-green-600">
                            +{dashboardStats.revenue.growth}% vs mois dernier
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">
                          Graphique des revenus et transactions
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Analytics Globales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                        <p className="text-gray-600">Graphiques Chart.js</p>
                        <p className="text-sm text-gray-500">
                          Analytics détaillées
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Métriques Temps Réel</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Utilisateurs en ligne</span>
                        <Badge className="bg-green-100 text-green-800">
                          247
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Nouvelles inscriptions (24h)</span>
                        <Badge className="bg-blue-100 text-blue-800">12</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Propriétés vues (24h)</span>
                        <Badge className="bg-purple-100 text-purple-800">
                          1,847
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Revenus (24h)</span>
                        <Badge className="bg-green-100 text-green-800">
                          8,450€
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="system" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monitoring Système</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Monitoring Avancé
                    </h3>
                    <p className="text-gray-600">
                      Surveillance des performances et logs système
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configuration Plateforme</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Paramètres Globaux
                    </h3>
                    <p className="text-gray-600">
                      Configuration de la plateforme et des fonctionnalités
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

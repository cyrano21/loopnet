"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Award,
  Building2,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  MessageSquare,
  Share2,
  Download,
  ChevronLeft,
  CheckCircle,
  Heart,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { use } from "react";

interface AgentSinglePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function AgentSinglePage({ params }: AgentSinglePageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [agent, setAgent] = useState<any>(null);
  const [agentProperties, setAgentProperties] = useState<any[]>([]);
  const [propertiesLoading, setPropertiesLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Demande d'information",
    message: "",
    propertyType: "",
    budget: "",
  });

  useEffect(() => {
    fetchAgent();
  }, [resolvedParams.id]);

  useEffect(() => {
    if (agent?._id) {
      fetchAgentProperties();
    }
  }, [agent]);

  const fetchAgent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/professionals/${resolvedParams.id}`);
      if (!response.ok) {
        throw new Error("Agent non trouvé");
      }
      const data = await response.json();
      setAgent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  const fetchAgentProperties = async () => {
    try {
      setPropertiesLoading(true);
      const response = await fetch(
        `/api/user/properties?userId=${agent._id}&limit=6`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAgentProperties(data.data.properties);
        }
      }
    } catch (err) {
      console.error("Erreur lors du chargement des propriétés:", err);
    } finally {
      setPropertiesLoading(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Logique d'envoi du formulaire de contact
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...contactForm,
          agentId: resolvedParams.id,
          agentName: agent?.name,
        }),
      });

      if (response.ok) {
        alert("Message envoyé avec succès!");
        setContactForm({
          name: "",
          email: "",
          phone: "",
          subject: "Demande d'information",
          message: "",
          propertyType: "",
          budget: "",
        });
      }
    } catch (error) {
      alert("Erreur lors de l'envoi du message");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setContactForm((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">Agent non trouvé</p>
            <Button onClick={() => router.back()}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" onClick={() => router.back()}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div className="flex gap-2 ml-auto">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart
                  className={`h-4 w-4 ${
                    isFavorite ? "fill-red-500 text-red-500" : ""
                  }`}
                />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Agent Info */}
            <div className="lg:col-span-2">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative w-48 h-48 mx-auto md:mx-0 flex-shrink-0">
                  <Image
                    src={agent.image || "/placeholder.svg?height=200&width=200"}
                    alt={agent.name}
                    fill
                    className="object-cover rounded-lg"
                    sizes="200px"
                  />
                  {agent.isVerified && (
                    <Badge className="absolute -top-2 -right-2 bg-green-600">
                      <Award className="h-4 w-4 mr-1" />
                      Vérifié
                    </Badge>
                  )}
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold mb-2 dark:text-white">
                    {agent.name}
                  </h1>
                  <p className="text-xl text-blue-600 dark:text-blue-400 font-medium mb-1">
                    {agent.title}
                  </p>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                    {agent.company}
                  </p>

                  <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-lg">{agent.rating}</span>
                      <span className="text-gray-600 dark:text-gray-400">
                        ({agent.reviews} avis)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <MapPin className="h-5 w-5" />
                      <span>
                        {agent.location.city}, {agent.location.region}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <div className="font-bold text-2xl text-blue-600 dark:text-blue-400">
                        {agent.yearsExperience}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Années d'expérience
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-2xl text-green-600 dark:text-green-400">
                        {agent.totalTransactions}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Transactions
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-2xl text-purple-600 dark:text-purple-400">
                        {agent.totalVolume
                          ? `€${(agent.totalVolume / 1000000).toFixed(1)}M`
                          : "N/A"}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Volume total
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-2xl text-orange-600 dark:text-orange-400">
                        {agent.responseTime || "< 2h"}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Temps de réponse
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    {agent.specialties.map((specialty: string) => (
                      <Badge key={specialty} variant="secondary">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Direct</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" size="lg">
                    <Phone className="h-4 w-4 mr-2" />
                    {agent.phone}
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <Mail className="h-4 w-4 mr-2" />
                    Envoyer un email
                  </Button>
                  {agent.socialLinks?.website && (
                    <Button variant="outline" className="w-full" size="lg">
                      <Globe className="h-4 w-4 mr-2" />
                      Site web
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                  <Button variant="outline" className="w-full" size="lg">
                    <Calendar className="h-4 w-4 mr-2" />
                    Planifier un rendez-vous
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="about" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="about">À propos</TabsTrigger>
                <TabsTrigger value="properties">Propriétés</TabsTrigger>
                <TabsTrigger value="reviews">
                  Avis ({agent.reviews})
                </TabsTrigger>
                <TabsTrigger value="market">Marché</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Présentation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                      {agent.bio ||
                        `${
                          agent.name
                        } est un professionnel de l'immobilier commercial expérimenté avec ${
                          agent.yearsExperience
                        } années d'expérience dans le secteur. Spécialisé dans ${agent.specialties.join(
                          ", "
                        )}, il accompagne ses clients dans leurs projets immobiliers avec expertise et professionnalisme.`}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Spécialisations</h4>
                        <div className="space-y-2">
                          {agent.specialties.map((specialty: string) => (
                            <div
                              key={specialty}
                              className="flex items-center gap-2"
                            >
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span>{specialty}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">
                          Zones d'intervention
                        </h4>
                        <div className="space-y-2">
                          {agent.serviceAreas?.map((area: string) => (
                            <div key={area} className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-blue-500" />
                              <span>{area}</span>
                            </div>
                          )) || (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-blue-500" />
                              <span>{agent.location.city} et région</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Certifications & Récompenses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <Award className="h-8 w-8 text-blue-600" />
                        <div>
                          <p className="font-medium">Agent Certifié</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Immobilier Commercial
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <TrendingUp className="h-8 w-8 text-green-600" />
                        <div>
                          <p className="font-medium">Top Performer</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            2024
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="properties" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Propriétés récentes ({agentProperties.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {propertiesLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Chargement des propriétés...
                        </p>
                      </div>
                    ) : agentProperties.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {agentProperties.map((property) => (
                          <div
                            key={property._id}
                            className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                          >
                            <div className="aspect-video relative bg-gray-200 dark:bg-gray-700">
                              {property.images && property.images.length > 0 ? (
                                <Image
                                  src={property.images[0].url}
                                  alt={property.title}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 768px) 100vw, 50vw"
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <Building2 className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                                </div>
                              )}
                              <div className="absolute top-2 left-2">
                                <Badge
                                  className={
                                    property.transactionType === "sale"
                                      ? "bg-green-600"
                                      : "bg-blue-600"
                                  }
                                >
                                  {property.transactionType === "sale"
                                    ? "Vente"
                                    : "Location"}
                                </Badge>
                              </div>
                            </div>
                            <div className="p-4">
                              <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                                {property.title}
                              </h3>
                              <p className="text-gray-600 text-sm mb-2 flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {property.address}
                              </p>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                  {property.price?.toLocaleString("fr-FR")}€
                                  {property.transactionType === "rent" &&
                                    "/mois"}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {property.surface}m²
                                </span>
                              </div>
                              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                <span>{property.rooms} pièces</span>
                                <span>{property.views || 0} vues</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Building2 className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">
                          Aucune propriété trouvée pour cet agent
                        </p>
                      </div>
                    )}

                    {agentProperties.length > 0 && (
                      <div className="text-center mt-6">
                        <Button variant="outline" asChild>
                          <Link href={`/properties?agent=${agent._id}`}>
                            Voir toutes les propriétés ({agentProperties.length}
                            +)
                          </Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Avis clients</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">
                        Les avis clients seront affichés ici
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="market" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Analyse de marché</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <TrendingUp className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">
                        L'analyse de marché sera affichée ici
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Contact Form Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Contactez {agent.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Nom
                      </label>
                      <Input
                        required
                        value={contactForm.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        placeholder="Votre nom"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Email
                      </label>
                      <Input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Téléphone
                    </label>
                    <Input
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="Votre numéro"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Sujet
                    </label>
                    <Select
                      value={contactForm.subject}
                      onValueChange={(value) =>
                        handleInputChange("subject", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionner un sujet" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Demande d'information">
                          Demande d'information
                        </SelectItem>
                        <SelectItem value="Vente de propriété">
                          Vente de propriété
                        </SelectItem>
                        <SelectItem value="Achat de propriété">
                          Achat de propriété
                        </SelectItem>
                        <SelectItem value="Location">Location</SelectItem>
                        <SelectItem value="Évaluation">Évaluation</SelectItem>
                        <SelectItem value="Consultation">Consultation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Type de propriété
                    </label>
                    <Select
                      value={contactForm.propertyType}
                      onValueChange={(value) =>
                        handleInputChange("propertyType", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bureau">Bureau</SelectItem>
                        <SelectItem value="Commerce">Commerce</SelectItem>
                        <SelectItem value="Entrepôt">Entrepôt</SelectItem>
                        <SelectItem value="Industriel">Industriel</SelectItem>
                        <SelectItem value="Terrain">Terrain</SelectItem>
                        <SelectItem value="Hôtel">Hôtel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Budget
                    </label>
                    <Select
                      value={contactForm.budget}
                      onValueChange={(value) =>
                        handleInputChange("budget", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionner un budget" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="< 500k€">Moins de 500k€</SelectItem>
                        <SelectItem value="500k€ - 1M€">500k€ - 1M€</SelectItem>
                        <SelectItem value="1M€ - 5M€">1M€ - 5M€</SelectItem>
                        <SelectItem value="5M€ - 10M€">5M€ - 10M€</SelectItem>
                        <SelectItem value="> 10M€">Plus de 10M€</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Message
                    </label>
                    <Textarea
                      rows={4}
                      required
                      value={contactForm.message}
                      onChange={(e) =>
                        handleInputChange("message", e.target.value)
                      }
                      placeholder="Décrivez votre projet ou vos besoins..."
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Envoyer le message
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    En soumettant ce formulaire, vous acceptez d'être contacté
                    par cet agent.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

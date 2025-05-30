"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Heart,
  Phone,
  Globe,
  Mail,
  MessageSquare,
  LogIn,
} from "lucide-react";
import { PropertySeedData } from "@/lib/seed-data";
import { ScheduleTour } from "./ScheduleTour";
import { useAuth } from "@/hooks/use-auth";
import { usePermissions } from "@/hooks/use-permissions";
import Link from "next/link";

interface PropertySidebarProps {
  property: PropertySeedData;
}

export function PropertySidebar({ property }: PropertySidebarProps) {
  const { isAuthenticated, isAdmin } = useAuth();
  const { can } = usePermissions();
  const canContactSeller = can("canContactSeller") || isAdmin;

  const formatPrice = (price: number, transactionType: string) => {
    const formatted = new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(price);
    return transactionType === "rent" ? `${formatted}/mois` : formatted;
  };

  return (
    <div className="space-y-6">
      {/* Contact Agent - Enhanced */}
      {property.agent && (
        <Card>
          <CardHeader>
            <CardTitle>Contact Agent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6 pb-6 border-b">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  {property.agent.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <div className="flex-1">
                <Link
                  href={`/agents/${
                    property.agent.id ||
                    encodeURIComponent(
                      property.agent.name.toLowerCase().replace(/\s+/g, "-")
                    )
                  }`}
                >
                  <h3 className="font-semibold text-lg mb-1 hover:text-blue-600 transition-colors">
                    {property.agent.name}
                  </h3>
                </Link>
                <p className="text-gray-600 mb-2">{property.agent.company}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Phone className="w-4 h-4" />
                    <span>{property.agent.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Globe className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Toujours afficher les boutons de base */}
            <div className="space-y-3 mb-6">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!isAuthenticated || !canContactSeller}
                onClick={() =>
                  !isAuthenticated && (window.location.href = "/auth/signin")
                }
              >
                <Phone className="w-4 h-4 mr-2" />
                {isAuthenticated && canContactSeller
                  ? "Appeler l'agent"
                  : "Se connecter pour appeler"}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                disabled={!isAuthenticated || !canContactSeller}
                onClick={() =>
                  !isAuthenticated && (window.location.href = "/auth/signin")
                }
              >
                <Mail className="w-4 h-4 mr-2" />
                {isAuthenticated && canContactSeller
                  ? "Envoyer un email"
                  : "Se connecter pour écrire"}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                disabled={!isAuthenticated || !canContactSeller}
                onClick={() =>
                  !isAuthenticated && (window.location.href = "/auth/signin")
                }
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                {isAuthenticated && canContactSeller
                  ? "Envoyer un message"
                  : "Se connecter pour contacter"}
              </Button>
            </div>

            {/* Formulaire de contact - Conditionnel */}
            {isAuthenticated && canContactSeller ? (
              <div className="space-y-4">
                <h4 className="font-medium">Demander plus d'informations</h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Votre nom"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="email"
                    placeholder="Votre email"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="tel"
                    placeholder="Votre téléphone"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Type de profil"
                    title="Sélectionnez votre type de profil"
                  >
                    <option value="">Je suis</option>
                    <option value="buyer">Acheteur</option>
                    <option value="renter">Locataire</option>
                    <option value="agent">Agent</option>
                    <option value="investor">Investisseur</option>
                  </select>
                  <textarea
                    placeholder="Votre message"
                    rows={3}
                    defaultValue={`Bonjour, je suis intéressé(e) par [${property.title}]`}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Demander des informations
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="text-center">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    🔒 Accès Premium
                  </h4>
                  <p className="text-blue-700 text-sm mb-4">
                    Connectez-vous pour accéder aux informations complètes de
                    l'agent et envoyer des messages directement.
                  </p>
                  <div className="space-y-2">
                    <Link href="/auth/signin">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        <LogIn className="w-4 h-4 mr-2" />
                        Se connecter
                      </Button>
                    </Link>
                    <Link href="/auth/signup">
                      <Button
                        variant="outline"
                        className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                      >
                        Créer un compte gratuit
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Schedule Tour */}
      <ScheduleTour property={property} />

      {/* Property Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Property Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              <span className="font-medium">Views</span>
            </div>
            <span className="font-bold text-lg">{property.views || 0}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="font-medium">Favorites</span>
            </div>
            <span className="font-bold text-lg">{property.favorites || 0}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-green-600" />
              <span className="font-medium">Inquiries</span>
            </div>
            <span className="font-bold text-lg">{property.inquiries || 0}</span>
          </div>
        </CardContent>
      </Card>

      {/* Mortgage Calculator */}
      <Card>
        <CardHeader>
          <CardTitle>Mortgage Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Loan Amount
              </label>
              <input
                type="text"
                value={formatPrice(property.price * 0.8, "sale")}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
                aria-label="Montant du prêt"
                title="Montant du prêt calculé automatiquement"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Interest Rate (%)
              </label>
              <input
                type="number"
                defaultValue="3.5"
                step="0.1"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Taux d'intérêt"
                title="Entrez le taux d'intérêt en pourcentage"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Loan Term (years)
              </label>
              <select
                defaultValue="25"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Durée du prêt"
                title="Sélectionnez la durée du prêt en années"
              >
                <option value="15">15 years</option>
                <option value="20">20 years</option>
                <option value="25">25 years</option>
                <option value="30">30 years</option>
              </select>
            </div>
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-medium">Monthly Payment:</span>
                <span className="font-bold text-lg text-blue-600">
                  {formatPrice(
                    Math.round(
                      ((property.price * 0.8 * 0.035) /
                        12 /
                        (1 - Math.pow(1 + 0.035 / 12, -25 * 12))) *
                        100
                    ) / 100,
                    "rent"
                  )}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PropertySidebar;

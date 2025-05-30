"use client";

import { useState, useEffect, useCallback } from "react";
import { Heart, MapPin, Building2, Trash2, Share, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useComparison } from "@/components/comparison-provider";
import { PropertyCard } from "@/components/property-card";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("date-added");
  const [loading, setLoading] = useState(true);
  const comparison = useComparison();

  const fetchFavorites = useCallback(async () => {
    try {
      const response = await fetch(`/api/favorites?sort=${sortBy}`);
      const data = await response.json();
      setFavorites(data.favorites || []);
    } catch (error) {
      console.error("Erreur lors du chargement des favoris:", error);
    } finally {
      setLoading(false);
    }
  }, [sortBy]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const removeFavorite = async (propertyId: string) => {
    try {
      await fetch(`/api/favorites/${propertyId}`, {
        method: "DELETE",
      });
      setFavorites(favorites.filter((fav: any) => fav.id !== propertyId));
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const removeSelected = async () => {
    try {
      await Promise.all(
        selectedItems.map((id) =>
          fetch(`/api/favorites/${id}`, { method: "DELETE" })
        )
      );
      setFavorites(
        favorites.filter((fav: any) => !selectedItems.includes(fav.id))
      );
      setSelectedItems([]);
    } catch (error) {
      console.error("Erreur lors de la suppression multiple:", error);
    }
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === favorites.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(favorites.map((fav: any) => fav.id));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center space-x-2">
                <Building2 className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-blue-600">
                  LoopNet
                </span>
              </Link>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Chargement de vos favoris...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <Building2 className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-blue-600">
                  LoopNet
                </span>
              </Link>
              <nav className="hidden md:flex space-x-6">
                <Link
                  href="/properties"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Properties
                </Link>
                <Link href="/favorites" className="text-blue-600 font-medium">
                  Favorites
                </Link>
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Dashboard
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost">Sign In</Button>
              <Button>List Property</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Heart className="w-8 h-8 text-red-500" />
              Mes Favoris
            </h1>
            <p className="text-gray-600 mt-1">
              {favorites.length} propriété{favorites.length !== 1 ? "s" : ""}{" "}
              sauvegardée
              {favorites.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-added">Date d'ajout</SelectItem>
                <SelectItem value="price-low">Prix croissant</SelectItem>
                <SelectItem value="price-high">Prix décroissant</SelectItem>
                <SelectItem value="size">Superficie</SelectItem>
                <SelectItem value="type">Type de bien</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {favorites.length === 0 ? (
          <Card className="p-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Aucun favori pour le moment
            </h3>
            <p className="text-gray-600 mb-6">
              Commencez à sauvegarder des propriétés qui vous intéressent pour
              les retrouver facilement ici.
            </p>
            <Button asChild>
              <Link href="/properties">Parcourir les propriétés</Link>
            </Button>
          </Card>
        ) : (
          <>
            {/* Bulk Actions */}
            {selectedItems.length > 0 && (
              <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Checkbox
                      checked={selectedItems.length === favorites.length}
                      onCheckedChange={toggleSelectAll}
                    />
                    <span className="font-medium">
                      {selectedItems.length} élément
                      {selectedItems.length !== 1 ? "s" : ""} sélectionné
                      {selectedItems.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={removeSelected}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Supprimer la sélection
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share className="w-4 h-4 mr-1" />
                      Partager
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((property: any) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onAddToComparison={comparison.addToComparison}
                  isInComparison={comparison.comparisonList.some(
                    (p: any) => p._id === property._id
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { PropertyCard } from "@/components/property-card";
import { useComparison } from "@/components/comparison-provider";
import { useProperties } from "@/hooks/use-properties";

export default function SearchPage() {
  const params = useParams();
  const query = params.query as string;
  const decodedQuery = decodeURIComponent(query);
  const searchParams = useSearchParams();
  const comparison = useComparison();

  const [filters, setFilters] = useState({
    q: decodedQuery,
    page: 1,
    transactionType: "",
    propertyType: "",
    city: "",
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    minSurface: undefined as number | undefined,
    maxSurface: undefined as number | undefined,
    rooms: undefined as number | undefined,
    sort: "newest",
  });

  const { properties, loading, error, pagination } = useProperties(filters);

  const handleFilterChange = (key: string, value: any) => {
    // Convert string values to numbers for numeric filters
    let processedValue = value;
    if (
      ["minPrice", "maxPrice", "minSurface", "maxSurface", "rooms"].includes(
        key
      )
    ) {
      processedValue =
        value === "" || value === null || value === undefined
          ? undefined
          : Number(value);
    }
    setFilters((prev) => ({ ...prev, [key]: processedValue, page: 1 }));
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">
        Résultats de recherche pour "{decodedQuery}"
      </h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[300px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Aucun résultat trouvé pour votre recherche.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property._id}
              property={property}
              onAddToComparison={comparison.addToComparison}
              isInComparison={comparison.comparisonList.some(
                (p: any) => p._id === property._id
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

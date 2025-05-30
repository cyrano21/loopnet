"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertySeedData } from "@/lib/seed-data";
import { Info } from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";

interface HomeValueChartProps {
  property: PropertySeedData;
}

// Données d'exemple pour le graphique d'évolution de la valeur
const data = [
  {
    name: "Jan",
    value: 400000,
  },
  {
    name: "Fév",
    value: 405000,
  },
  {
    name: "Mar",
    value: 410000,
  },
  {
    name: "Avr",
    value: 420000,
  },
  {
    name: "Mai",
    value: 418000,
  },
  {
    name: "Juin",
    value: 425000,
  },
  {
    name: "Juil",
    value: 435000,
  },
];

export function HomeValueChart({ property }: HomeValueChartProps) {
  // Formater les prix pour l'affichage
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Évolution de la Valeur</CardTitle>
          <div className="flex items-center text-gray-500 text-sm">
            <Info className="h-4 w-4 mr-1" />
            <span>Données illustratives</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatPrice} />
              <Tooltip
                formatter={(value) => [formatPrice(value as number), "Valeur"]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                fill="#93c5fd"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default HomeValueChart;

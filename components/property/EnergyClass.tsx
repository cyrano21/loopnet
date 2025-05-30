"use client";

import React from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertySeedData } from "@/lib/seed-data";
import { Info } from "lucide-react";
import { isUnsplashImage, getRandomUnsplashImage } from "@/lib/image-utils";

interface EnergyClassProps {
  property: PropertySeedData;
}

const energyMetrics = [
  {
    label: "Indice de Performance Énergétique Global",
    value: "A+",
  },
  {
    label: "Indice de performance énergétique renouvelable",
    value: "92.42 kWh / m²a",
  },
  {
    label: "Performance énergétique du bâtiment",
    value: "00.00 kWh / m²a",
  },
  {
    label: "Note DPE actuelle",
    value: "92",
  },
  {
    label: "Note DPE potentielle",
    value: "80+",
  },
];

export function EnergyClass({ property }: EnergyClassProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Classe Énergétique</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {energyMetrics.map((metric, index) => (
            <div className="flex justify-between items-center" key={index}>
              <p className="text-gray-700">{metric.label}</p>
              <p className="font-semibold">{metric.value}</p>
            </div>
          ))}
          <div className="mt-6 relative">
            <div className="w-full h-24 bg-gradient-to-r from-green-500 to-yellow-500 rounded-md flex items-center justify-center">
              <div className="text-white font-bold text-xl">
                Classe Énergétique A+
              </div>
            </div>
            {/* Indicateur d'image illustrative */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-1 flex items-center justify-center">
              <Info className="h-3 w-3 mr-1" />
              <span className="text-xs">Image illustrative</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default EnergyClass;

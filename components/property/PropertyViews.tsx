"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertySeedData } from "@/lib/seed-data";
import { BarChart, LineChart, PieChart } from "@/components/ui/charts";

interface PropertyViewsProps {
  property: PropertySeedData;
}

export function PropertyViews({ property }: PropertyViewsProps) {
  // Données d'exemple pour les graphiques
  const hourlyData = [
    { hour: "00:00", views: 5 },
    { hour: "02:00", views: 3 },
    { hour: "04:00", views: 2 },
    { hour: "06:00", views: 4 },
    { hour: "08:00", views: 10 },
    { hour: "10:00", views: 15 },
    { hour: "12:00", views: 12 },
    { hour: "14:00", views: 18 },
    { hour: "16:00", views: 20 },
    { hour: "18:00", views: 15 },
    { hour: "20:00", views: 10 },
    { hour: "22:00", views: 7 },
  ];

  const weeklyData = [
    { day: "Lun", views: 45 },
    { day: "Mar", views: 52 },
    { day: "Mer", views: 49 },
    { day: "Jeu", views: 63 },
    { day: "Ven", views: 58 },
    { day: "Sam", views: 72 },
    { day: "Dim", views: 60 },
  ];

  const monthlyData = [
    { month: "Jan", views: 120 },
    { month: "Fév", views: 150 },
    { month: "Mar", views: 180 },
    { month: "Avr", views: 220 },
    { month: "Mai", views: 250 },
    { month: "Juin", views: 200 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistiques de vues de la propriété</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="hourly" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="hourly">Par heure</TabsTrigger>
            <TabsTrigger value="weekly">Hebdomadaire</TabsTrigger>
            <TabsTrigger value="monthly">Mensuel</TabsTrigger>
          </TabsList>

          <TabsContent value="hourly" className="pt-4">
            <div className="h-[400px]">
              <BarChart
                data={hourlyData}
                index="hour"
                categories={["views"]}
                colors={["blue"]}
                valueFormatter={(value) => `${value} vues`}
                yAxisWidth={40}
              />
            </div>
          </TabsContent>

          <TabsContent value="weekly" className="pt-4">
            <div className="h-[400px]">
              <LineChart
                data={weeklyData}
                index="day"
                categories={["views"]}
                colors={["blue"]}
                valueFormatter={(value) => `${value} vues`}
                yAxisWidth={40}
              />
            </div>
          </TabsContent>

          <TabsContent value="monthly" className="pt-4">
            <div className="h-[400px]">
              <BarChart
                data={monthlyData}
                index="month"
                categories={["views"]}
                colors={["blue"]}
                valueFormatter={(value) => `${value} vues`}
                yAxisWidth={40}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

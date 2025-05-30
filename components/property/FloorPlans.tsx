"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PropertySeedData } from "@/lib/seed-data";
import { isUnsplashImage, getRandomUnsplashImage } from "@/lib/image-utils";
import { Info } from "lucide-react";

interface FloorPlansProps {
  property: PropertySeedData;
}

// Données d'exemple pour les plans d'étage
const floorPlanData = [
  {
    id: "first-floor",
    title: "Premier Étage",
    size: "118 m²",
    bedrooms: "2",
    bathrooms: "2",
    price: "920,99 €",
    imageSrc: getRandomUnsplashImage("apartment", 800, 600),
    isIllustrative: true,
  },
  {
    id: "second-floor",
    title: "Deuxième Étage",
    size: "118 m²",
    bedrooms: "2",
    bathrooms: "2",
    price: "920,99 €",
    imageSrc: getRandomUnsplashImage("apartment", 800, 600),
    isIllustrative: true,
  },
  {
    id: "third-floor",
    title: "Troisième Étage",
    size: "118 m²",
    bedrooms: "2",
    bathrooms: "2",
    price: "920,99 €",
    imageSrc: getRandomUnsplashImage("apartment", 800, 600),
    isIllustrative: true,
  },
];

export function FloorPlans({ property }: FloorPlansProps) {
  const [openItem, setOpenItem] = useState<string>("first-floor");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plans d'Étage</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion
          type="single"
          collapsible
          value={openItem}
          onValueChange={setOpenItem}
        >
          {floorPlanData.map((floorPlan) => (
            <AccordionItem value={floorPlan.id} key={floorPlan.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex w-full justify-between items-center">
                  <span className="font-medium">{floorPlan.title}</span>
                  <div className="hidden md:flex items-center space-x-4 text-sm">
                    <span>
                      <span className="font-semibold mr-1">Surface:</span>
                      {floorPlan.size}
                    </span>
                    <span>
                      <span className="font-semibold mr-1">Chambres:</span>
                      {floorPlan.bedrooms}
                    </span>
                    <span>
                      <span className="font-semibold mr-1">
                        Salles de bain:
                      </span>
                      {floorPlan.bathrooms}
                    </span>
                    <span>
                      <span className="font-semibold mr-1">Prix:</span>
                      {floorPlan.price}
                    </span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col md:hidden mb-4 space-y-2 text-sm">
                  <span>
                    <span className="font-semibold mr-1">Surface:</span>
                    {floorPlan.size}
                  </span>
                  <span>
                    <span className="font-semibold mr-1">Chambres:</span>
                    {floorPlan.bedrooms}
                  </span>
                  <span>
                    <span className="font-semibold mr-1">Salles de bain:</span>
                    {floorPlan.bathrooms}
                  </span>
                  <span>
                    <span className="font-semibold mr-1">Prix:</span>
                    {floorPlan.price}
                  </span>
                </div>
                <div className="relative text-center">
                  <Image
                    width={736}
                    height={544}
                    className="w-full h-auto rounded-md"
                    src={floorPlan.imageSrc}
                    alt={`Plan d'étage - ${floorPlan.title}`}
                  />
                  {/* Indicateur d'image illustrative */}
                  {(floorPlan.isIllustrative ||
                    isUnsplashImage(floorPlan.imageSrc)) && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 flex items-center justify-center">
                      <Info className="h-4 w-4 mr-2" />
                      <span className="text-sm">Image illustrative</span>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}

export default FloorPlans;

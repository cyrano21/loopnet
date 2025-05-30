"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertySeedData } from "@/lib/seed-data";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ScheduleTourProps {
  property: PropertySeedData;
}

export function ScheduleTour({ property }: ScheduleTourProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [tourType, setTourType] = useState<string>("inperson");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique pour soumettre la demande de visite
    console.log("Tour request submitted");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Planifier une Visite</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={tourType} onValueChange={setTourType}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="inperson">En Personne</TabsTrigger>
            <TabsTrigger value="videochat">Visio-Conférence</TabsTrigger>
          </TabsList>

          <TabsContent value="inperson" className="mt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="date" className="text-sm font-medium">
                  Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? (
                        format(date, "PPP", { locale: fr })
                      ) : (
                        <span>Choisir une date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-col space-y-2">
                <label htmlFor="time" className="text-sm font-medium">
                  Heure
                </label>
                <select
                  id="time"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner une heure</option>
                  <option value="09:00">09:00</option>
                  <option value="10:00">10:00</option>
                  <option value="11:00">11:00</option>
                  <option value="14:00">14:00</option>
                  <option value="15:00">15:00</option>
                  <option value="16:00">16:00</option>
                  <option value="17:00">17:00</option>
                </select>
              </div>

              <Input type="text" placeholder="Nom" />
              <Input type="tel" placeholder="Téléphone" />
              <Input type="email" placeholder="Email" />
              <Textarea placeholder="Message" rows={3} />

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Demander une Visite
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="videochat" className="mt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="date" className="text-sm font-medium">
                  Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? (
                        format(date, "PPP", { locale: fr })
                      ) : (
                        <span>Choisir une date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-col space-y-2">
                <label htmlFor="time" className="text-sm font-medium">
                  Heure
                </label>
                <select
                  id="time"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner une heure</option>
                  <option value="09:00">09:00</option>
                  <option value="10:00">10:00</option>
                  <option value="11:00">11:00</option>
                  <option value="14:00">14:00</option>
                  <option value="15:00">15:00</option>
                  <option value="16:00">16:00</option>
                  <option value="17:00">17:00</option>
                </select>
              </div>

              <Input type="text" placeholder="Nom" />
              <Input type="tel" placeholder="Téléphone" />
              <Input type="email" placeholder="Email" />
              <Textarea placeholder="Message" rows={3} />

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Demander une Visio-Conférence
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default ScheduleTour;

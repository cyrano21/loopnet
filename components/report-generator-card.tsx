"use client";

import React, { useState } from "react";
import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  BarChart3,
  TrendingUp,
  PieChart,
  Map,
  Lock,
  Loader2,
  Download,
} from "lucide-react";
import { usePermissions } from "@/hooks/use-permissions";
import { toast } from "sonner";

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  icon: any;
  type:
    | "market-analysis"
    | "portfolio-summary"
    | "comparative-analysis"
    | "custom";
}

export function ReportGeneratorCard() {
  const { can } = usePermissions();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [reportTitle, setReportTitle] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTemplates: ReportTemplate[] = [
    {
      id: "market-analysis",
      name: "Analyse de Marché",
      description: "Rapport complet sur les tendances du marché immobilier",
      icon: TrendingUp,
      type: "market-analysis",
    },
    {
      id: "portfolio-summary",
      name: "Résumé de Portfolio",
      description: "Vue d'ensemble de vos propriétés et performances",
      icon: PieChart,
      type: "portfolio-summary",
    },
    {
      id: "comparative-analysis",
      name: "Analyse Comparative",
      description: "Comparaison détaillée entre plusieurs propriétés",
      icon: BarChart3,
      type: "comparative-analysis",
    },
    {
      id: "location-report",
      name: "Rapport de Localisation",
      description: "Analyse géographique et démographique",
      icon: Map,
      type: "custom",
    },
  ];

  if (!can("canGenerateReports")) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <Lock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold mb-2">
              Génération de Rapports
            </h3>
            <p className="text-sm">
              Disponible avec les plans Premium et Agent
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleGenerateReport = async () => {
    if (!selectedTemplate) {
      toast.error("Veuillez sélectionner un modèle de rapport");
      return;
    }

    if (!reportTitle.trim()) {
      toast.error("Veuillez saisir un titre pour le rapport");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/reports/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateId: selectedTemplate,
          title: reportTitle,
          description: reportDescription,
          filters: Object.fromEntries(
            new URLSearchParams(window.location.search).entries()
          ),
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la génération du rapport");
      }

      // Télécharger le rapport
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `rapport_${selectedTemplate}_${
        new Date().toISOString().split("T")[0]
      }.pdf`;

      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setIsDialogOpen(false);
      setSelectedTemplate("");
      setReportTitle("");
      setReportDescription("");
      toast.success("Rapport généré et téléchargé avec succès");
    } catch (error) {
      console.error("Erreur lors de la génération du rapport:", error);
      toast.error("Erreur lors de la génération du rapport");
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedTemplateData = reportTemplates.find(
    (t) => t.id === selectedTemplate
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Génération de Rapports
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Générez des rapports professionnels personnalisés pour vos analyses
            immobilières.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportTemplates.map((template) => {
              const IconComponent = template.icon;
              const isOpen = isDialogOpen && selectedTemplate === template.id;
              return (
                <Dialog
                  key={template.id}
                  open={isOpen}
                  onOpenChange={(open) => {
                    if (!open) {
                      setIsDialogOpen(false);
                      setSelectedTemplate("");
                    } else {
                      setSelectedTemplate(template.id);
                      setIsDialogOpen(true);
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex flex-col items-start p-4 h-auto text-left"
                    >
                      <div className="flex items-center gap-2 mb-2 w-full">
                        <IconComponent className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">{template.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {template.description}
                      </span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        {selectedTemplateData && (
                          <selectedTemplateData.icon className="h-5 w-5" />
                        )}
                        Générer {selectedTemplateData?.name}
                      </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="reportTitle">Titre du rapport</Label>
                        <Input
                          id="reportTitle"
                          value={reportTitle}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setReportTitle(e.target.value)
                          }
                          placeholder={`Rapport ${
                            selectedTemplateData?.name
                          } - ${new Date().toLocaleDateString()}`}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="reportDescription">
                          Description (optionnel)
                        </Label>
                        <Textarea
                          id="reportDescription"
                          value={reportDescription}
                          onChange={(
                            e: React.ChangeEvent<HTMLTextAreaElement>
                          ) => setReportDescription(e.target.value)}
                          placeholder="Décrivez le contexte ou les objectifs de ce rapport..."
                          className="mt-1"
                          rows={3}
                        />
                      </div>

                      <div className="bg-blue-50 p-3 rounded-lg">
                        <h4 className="font-medium text-sm mb-2">
                          Ce rapport inclura :
                        </h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {template.type === "market-analysis" && (
                            <>
                              <li>• Tendances des prix par zone</li>
                              <li>• Analyse de la demande</li>
                              <li>• Comparaisons historiques</li>
                              <li>• Prévisions de marché</li>
                            </>
                          )}
                          {template.type === "portfolio-summary" && (
                            <>
                              <li>• Vue d'ensemble de vos propriétés</li>
                              <li>• Performances financières</li>
                              <li>• Recommandations d'optimisation</li>
                              <li>• Analyse des risques</li>
                            </>
                          )}
                          {template.type === "comparative-analysis" && (
                            <>
                              <li>• Comparaison détaillée entre propriétés</li>
                              <li>• Analyse coût-bénéfice</li>
                              <li>• ROI potentiel</li>
                              <li>• Facteurs de risque</li>
                            </>
                          )}
                          {template.type === "custom" && (
                            <>
                              <li>• Données démographiques</li>
                              <li>• Infrastructure locale</li>
                              <li>• Tendances de développement</li>
                              <li>• Facteurs d'attractivité</li>
                            </>
                          )}
                        </ul>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t">
                        <Badge variant="secondary">Format PDF</Badge>
                        <Button
                          onClick={handleGenerateReport}
                          disabled={isGenerating}
                          className="min-w-[120px]"
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Génération...
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4 mr-2" />
                              Générer
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              );
            })}
          </div>

          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
            💡 <strong>Astuce :</strong> Les rapports sont générés en temps réel
            avec les données actuelles du marché et peuvent être personnalisés
            selon vos besoins.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

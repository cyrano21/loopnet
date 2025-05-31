'use client'

import { useState, useEffect } from 'react'
import { usePermissions } from '@/hooks/use-permissions'
import { AccessRestriction } from '@/components/access-restriction'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FileText, Download, Settings, Eye, Plus, Trash2, Copy, Calendar, BarChart3, MapPin, Building } from 'lucide-react'
import { toast } from 'sonner'

interface ReportTemplate {
  id: string
  name: string
  description: string
  type: 'property' | 'market' | 'comparison' | 'investment'
  sections: string[]
  customizable: boolean
  format: 'pdf' | 'word' | 'ppt'
}

interface SavedReport {
  id: string
  name: string
  template: string
  properties: string[]
  generatedDate: Date
  status: 'draft' | 'generated' | 'sent'
  recipient?: string
}

interface ReportSection {
  id: string
  name: string
  description: string
  enabled: boolean
  required: boolean
}

export default function ReportsPage() {
  const { can } = usePermissions()
  const [templates, setTemplates] = useState<ReportTemplate[]>([])
  const [savedReports, setSavedReports] = useState<SavedReport[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [reportSections, setReportSections] = useState<ReportSection[]>([])
  const [reportName, setReportName] = useState('')
  const [reportDescription, setReportDescription] = useState('')
  const [selectedProperties, setSelectedProperties] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const title = 'Générateur de Rapports'
  const description = 'Créez des rapports détaillés et personnalisés sur les propriétés et le marché immobilier.'

  // Vérifier si l'utilisateur a la permission d'utiliser cette fonctionnalité
  if (!can('canGenerateReports')) {
    return (
      <AccessRestriction
        action='canGenerateReports'
        requiredLevel='premium'
        showUpgradePrompt={true}
      >
        <div className='container mx-auto py-8 max-w-4xl'>
          <Card>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </AccessRestriction>
    )
  }

  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/reports/templates')
      if (response.ok) {
        const data = await response.json()
        setTemplates(data.templates || [])
      } else {
        throw new Error('Erreur lors du chargement des modèles')
      }
    } catch (error) {
      console.error('Erreur:', error)
      // Données de démonstration
      const mockTemplates: ReportTemplate[] = [
        {
          id: '1',
          name: 'Rapport de Propriété Détaillé',
          description: 'Analyse complète d\'une propriété avec données de marché',
          type: 'property',
          sections: ['overview', 'market-analysis', 'photos', 'financials', 'recommendations'],
          customizable: true,
          format: 'pdf'
        },
        {
          id: '2',
          name: 'Analyse de Marché',
          description: 'Étude de marché pour une zone géographique spécifique',
          type: 'market',
          sections: ['market-overview', 'trends', 'demographics', 'forecasts'],
          customizable: true,
          format: 'pdf'
        },
        {
          id: '3',
          name: 'Comparaison de Propriétés',
          description: 'Comparaison détaillée entre plusieurs propriétés',
          type: 'comparison',
          sections: ['properties-overview', 'comparison-table', 'analysis', 'recommendations'],
          customizable: true,
          format: 'pdf'
        },
        {
          id: '4',
          name: 'Rapport d\'Investissement',
          description: 'Analyse d\'investissement avec projections financières',
          type: 'investment',
          sections: ['property-overview', 'financial-analysis', 'roi-projections', 'risks', 'conclusion'],
          customizable: true,
          format: 'pdf'
        }
      ]
      setTemplates(mockTemplates)
    }
  }

  const loadSavedReports = async () => {
    try {
      const response = await fetch('/api/reports/saved')
      if (response.ok) {
        const data = await response.json()
        setSavedReports(data.reports || [])
      } else {
        throw new Error('Erreur lors du chargement des rapports')
      }
    } catch (error) {
      console.error('Erreur:', error)
      // Données de démonstration
      const mockReports: SavedReport[] = [
        {
          id: '1',
          name: 'Rapport Bureau Champs-Élysées',
          template: 'Rapport de Propriété Détaillé',
          properties: ['prop-1'],
          generatedDate: new Date('2025-05-30'),
          status: 'generated',
          recipient: 'client@example.com'
        },
        {
          id: '2',
          name: 'Analyse Marché Lyon',
          template: 'Analyse de Marché',
          properties: [],
          generatedDate: new Date('2025-05-28'),
          status: 'sent'
        }
      ]
      setSavedReports(mockReports)
    }
  }

  const loadReportSections = (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    if (!template) return

    const sectionsMap: Record<string, ReportSection> = {
      'overview': { id: 'overview', name: 'Vue d\'ensemble', description: 'Informations générales de la propriété', enabled: true, required: true },
      'market-analysis': { id: 'market-analysis', name: 'Analyse de marché', description: 'Données et tendances du marché local', enabled: true, required: false },
      'photos': { id: 'photos', name: 'Photos', description: 'Galerie de photos de la propriété', enabled: true, required: false },
      'financials': { id: 'financials', name: 'Analyse financière', description: 'Détails financiers et rentabilité', enabled: true, required: false },
      'recommendations': { id: 'recommendations', name: 'Recommandations', description: 'Recommandations d\'investissement', enabled: true, required: false },
      'market-overview': { id: 'market-overview', name: 'Aperçu du marché', description: 'Vue générale du marché', enabled: true, required: true },
      'trends': { id: 'trends', name: 'Tendances', description: 'Tendances et évolutions', enabled: true, required: false },
      'demographics': { id: 'demographics', name: 'Démographie', description: 'Données démographiques', enabled: true, required: false },
      'forecasts': { id: 'forecasts', name: 'Prévisions', description: 'Prévisions de marché', enabled: true, required: false },
      'properties-overview': { id: 'properties-overview', name: 'Vue d\'ensemble des propriétés', description: 'Résumé des propriétés comparées', enabled: true, required: true },
      'comparison-table': { id: 'comparison-table', name: 'Tableau comparatif', description: 'Comparaison détaillée', enabled: true, required: true },
      'analysis': { id: 'analysis', name: 'Analyse', description: 'Analyse comparative', enabled: true, required: false },
      'roi-projections': { id: 'roi-projections', name: 'Projections ROI', description: 'Projections de retour sur investissement', enabled: true, required: false },
      'risks': { id: 'risks', name: 'Analyse des risques', description: 'Évaluation des risques', enabled: true, required: false },
      'conclusion': { id: 'conclusion', name: 'Conclusion', description: 'Conclusion et recommandations finales', enabled: true, required: false }
    }

    const sections = template.sections.map(sectionId => sectionsMap[sectionId]).filter(Boolean)
    setReportSections(sections)
  }

  const handleGenerateReport = async () => {
    if (!selectedTemplate || !reportName) {
      toast.error('Veuillez sélectionner un modèle et saisir un nom de rapport')
      return
    }

    setIsGenerating(true)
    try {
      const enabledSections = reportSections.filter(s => s.enabled).map(s => s.id)
      
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: selectedTemplate,
          name: reportName,
          description: reportDescription,
          sections: enabledSections,
          properties: selectedProperties
        })
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${reportName.replace(/\s+/g, '-').toLowerCase()}.pdf`
        a.click()
        toast.success('Rapport généré avec succès')
        loadSavedReports()
      } else {
        throw new Error('Erreur lors de la génération')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors de la génération du rapport')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDeleteReport = async (reportId: string) => {
    try {
      await fetch(`/api/reports/${reportId}`, { method: 'DELETE' })
      setSavedReports(prev => prev.filter(r => r.id !== reportId))
      toast.success('Rapport supprimé')
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    }
  }

  const handleDuplicateReport = async (reportId: string) => {
    const report = savedReports.find(r => r.id === reportId)
    if (report) {
      setReportName(`${report.name} (copie)`)
      setSelectedTemplate(templates.find(t => t.name === report.template)?.id || '')
      setSelectedProperties(report.properties)
      toast.info('Rapport dupliqué dans l\'éditeur')
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      'draft': 'secondary',
      'generated': 'default',
      'sent': 'destructive'
    } as const
    
    const labels = {
      'draft': 'Brouillon',
      'generated': 'Généré',
      'sent': 'Envoyé'
    }
    
    return <Badge variant={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'property': return <Building className="h-4 w-4" />
      case 'market': return <BarChart3 className="h-4 w-4" />
      case 'comparison': return <Copy className="h-4 w-4" />
      case 'investment': return <FileText className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  useEffect(() => {
    loadTemplates()
    loadSavedReports()
  }, [])

  useEffect(() => {
    if (selectedTemplate) {
      loadReportSections(selectedTemplate)
    }
  }, [selectedTemplate, templates])

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex flex-col gap-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-muted-foreground mt-2">{description}</p>
          </div>
        </div>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="create">Créer un rapport</TabsTrigger>
            <TabsTrigger value="templates">Modèles</TabsTrigger>
            <TabsTrigger value="saved">Rapports sauvegardés</TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Configuration du rapport */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Configuration du rapport</CardTitle>
                    <CardDescription>Configurez les paramètres de votre rapport</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="template">Modèle de rapport</Label>
                        <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un modèle" />
                          </SelectTrigger>
                          <SelectContent>
                            {templates.map((template) => (
                              <SelectItem key={template.id} value={template.id}>
                                <div className="flex items-center gap-2">
                                  {getTypeIcon(template.type)}
                                  {template.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="name">Nom du rapport</Label>
                        <Input
                          id="name"
                          placeholder="Ex: Rapport Propriété Paris 8e"
                          value={reportName}
                          onChange={(e) => setReportName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Description (optionnelle)</Label>
                      <Textarea
                        id="description"
                        placeholder="Description du rapport..."
                        value={reportDescription}
                        onChange={(e) => setReportDescription(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Sections du rapport */}
                {reportSections.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Sections du rapport</CardTitle>
                      <CardDescription>Personnalisez le contenu de votre rapport</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {reportSections.map((section) => (
                          <div key={section.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                            <Checkbox
                              id={section.id}
                              checked={section.enabled}
                              disabled={section.required}
                              onCheckedChange={(checked) => {
                                setReportSections(prev => 
                                  prev.map(s => 
                                    s.id === section.id ? { ...s, enabled: checked as boolean } : s
                                  )
                                )
                              }}
                            />
                            <div className="flex-1">
                              <label htmlFor={section.id} className="text-sm font-medium cursor-pointer">
                                {section.name}
                                {section.required && <span className="text-red-500 ml-1">*</span>}
                              </label>
                              <p className="text-xs text-muted-foreground mt-1">{section.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      onClick={handleGenerateReport} 
                      disabled={!selectedTemplate || !reportName || isGenerating}
                      className="w-full"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {isGenerating ? 'Génération...' : 'Générer le rapport'}
                    </Button>
                    
                    <Dialog open={showPreview} onOpenChange={setShowPreview}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full" disabled={!selectedTemplate}>
                          <Eye className="h-4 w-4 mr-2" />
                          Aperçu
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh]">
                        <DialogHeader>
                          <DialogTitle>Aperçu du rapport</DialogTitle>
                          <DialogDescription>
                            Prévisualisation de votre rapport avant génération
                          </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="h-[60vh] w-full">
                          <div className="p-6 space-y-4">
                            <div className="text-center border-b pb-4">
                              <h1 className="text-2xl font-bold">{reportName || 'Nom du rapport'}</h1>
                              <p className="text-muted-foreground">{reportDescription}</p>
                            </div>
                            {reportSections.filter(s => s.enabled).map((section) => (
                              <div key={section.id} className="border rounded p-4">
                                <h2 className="text-lg font-semibold mb-2">{section.name}</h2>
                                <p className="text-sm text-muted-foreground">{section.description}</p>
                                <div className="mt-3 text-sm text-gray-500">
                                  [Contenu de la section sera généré ici]
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Propriétés sélectionnées</CardTitle>
                    <CardDescription>Propriétés à inclure dans le rapport</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter des propriétés
                    </Button>
                    {selectedProperties.length === 0 && (
                      <p className="text-sm text-muted-foreground mt-2 text-center">
                        Aucune propriété sélectionnée
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="templates">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        {getTypeIcon(template.type)}
                        <span className="text-lg">{template.name}</span>
                      </CardTitle>
                      <Badge variant="outline">{template.format.toUpperCase()}</Badge>
                    </div>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Sections incluses:</h4>
                        <div className="text-xs text-muted-foreground">
                          {template.sections.length} sections configurables
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => {
                          setSelectedTemplate(template.id)
                          toast.info('Modèle sélectionné, basculez vers l\'onglet "Créer"')
                        }}
                      >
                        Utiliser ce modèle
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="saved">
            <div className="space-y-4">
              {savedReports.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucun rapport sauvegardé</h3>
                    <p className="text-muted-foreground">
                      Vos rapports générés apparaîtront ici
                    </p>
                  </CardContent>
                </Card>
              ) : (
                savedReports.map((report) => (
                  <Card key={report.id}>
                    <CardContent className="pt-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{report.name}</h3>
                            {getStatusBadge(report.status)}
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              Modèle: {report.template}
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Généré le: {report.generatedDate.toLocaleDateString('fr-FR')}
                            </div>
                            {report.recipient && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Envoyé à: {report.recipient}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDuplicateReport(report.id)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteReport(report.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Télécharger
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

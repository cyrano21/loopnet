'use client'

import { useState, useEffect } from 'react'
import { usePermissions } from '@/hooks/use-permissions'
import { AccessRestriction } from '@/components/access-restriction'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Download, FileText, Table, File, ChevronLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface ExportField {
  id: string
  label: string
  description: string
  included: boolean
}

interface ExportTemplate {
  id: string
  name: string
  description: string
  fields: string[]
  format: string
}

export default function DataExportPage() {
  const { can } = usePermissions()
  const [selectedFormat, setSelectedFormat] = useState<string>('csv')
  const [selectedFields, setSelectedFields] = useState<ExportField[]>([])
  const [templateName, setTemplateName] = useState<string>('')
  const [templateDescription, setTemplateDescription] = useState<string>('')
  const [savedTemplates, setSavedTemplates] = useState<ExportTemplate[]>([])
  const [isExporting, setIsExporting] = useState<boolean>(false)
  const [isLoadingTemplates, setIsLoadingTemplates] = useState<boolean>(true)

  const availableFields: ExportField[] = [
    { id: 'title', label: 'Titre', description: 'Nom de la propriété', included: true },
    { id: 'price', label: 'Prix', description: 'Prix de vente ou loyer', included: true },
    { id: 'surface', label: 'Surface', description: 'Surface en m²', included: true },
    { id: 'location', label: 'Localisation', description: 'Adresse complète', included: true },
    { id: 'propertyType', label: 'Type', description: 'Type de propriété', included: true },
    { id: 'transactionType', label: 'Transaction', description: 'Vente ou location', included: true },
    { id: 'description', label: 'Description', description: 'Description complète', included: false },
    { id: 'features', label: 'Caractéristiques', description: 'Caractéristiques spéciales', included: false },
    { id: 'contactInfo', label: 'Contact', description: 'Informations de contact', included: false },
    { id: 'dateCreated', label: 'Date création', description: 'Date de publication', included: false },
    { id: 'lastModified', label: 'Dernière modif.', description: 'Dernière modification', included: false },
    { id: 'views', label: 'Vues', description: 'Nombre de vues', included: false },
    { id: 'capRate', label: 'Taux cap.', description: 'Taux de capitalisation', included: false },
    { id: 'roi', label: 'ROI', description: 'Retour sur investissement', included: false },
  ]

  const exportFormats = [
    { value: 'csv', label: 'CSV', icon: Table, description: 'Format compatible avec Excel et Google Sheets' },
    { value: 'excel', label: 'Excel (XLSX)', icon: FileText, description: 'Fichier Excel avec mise en forme' },
    { value: 'pdf', label: 'PDF', icon: File, description: 'Document PDF pour présentation' },
  ]

  // Vérifier si l'utilisateur a la permission d'utiliser cette fonctionnalité
  if (!can('canExportData')) {
    return (
      <AccessRestriction
        action='canExportData'
        requiredLevel='premium'
        showUpgradePrompt={true}
      >
        <div className='container mx-auto py-8 max-w-4xl'>
          <div className="text-center py-12">
            <Download className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Export de Données</h2>
            <p className="text-muted-foreground">
              Exportez les données des propriétés vers Excel, CSV ou PDF pour analyse et partage.
            </p>
          </div>
        </div>
      </AccessRestriction>
    )
  }

  useEffect(() => {
    setSelectedFields(availableFields)
    loadSavedTemplates()
  }, [])

  const loadSavedTemplates = async () => {
    try {
      const response = await fetch('/api/export/templates')
      if (response.ok) {
        const templates = await response.json()
        setSavedTemplates(templates)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des modèles:', error)
    } finally {
      setIsLoadingTemplates(false)
    }
  }

  const handleFieldToggle = (fieldId: string) => {
    setSelectedFields(fields =>
      fields.map(field =>
        field.id === fieldId ? { ...field, included: !field.included } : field
      )
    )
  }

  const handleExport = async () => {
    const includedFields = selectedFields.filter(field => field.included)
    
    if (includedFields.length === 0) {
      toast.error('Veuillez sélectionner au moins un champ à exporter')
      return
    }

    setIsExporting(true)

    try {
      const response = await fetch('/api/export/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          format: selectedFormat,
          fields: includedFields.map(field => field.id)
        })
      })

      if (!response.ok) {
        throw new Error('Erreur lors de l\'exportation')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url

      const timestamp = new Date().toISOString().slice(0, 10)
      const extension = selectedFormat === 'excel' ? 'xlsx' : selectedFormat
      a.download = `proprietes_export_${timestamp}.${extension}`

      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success('Export terminé avec succès')
    } catch (error) {
      toast.error('Erreur lors de l\'exportation')
      console.error('Erreur d\'export:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      toast.error('Veuillez entrer un nom pour le modèle')
      return
    }

    const includedFields = selectedFields.filter(field => field.included)
    if (includedFields.length === 0) {
      toast.error('Veuillez sélectionner au moins un champ')
      return
    }

    try {
      const response = await fetch('/api/export/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: templateName,
          description: templateDescription,
          fields: includedFields.map(field => field.id),
          format: selectedFormat
        })
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde')
      }

      await loadSavedTemplates()
      setTemplateName('')
      setTemplateDescription('')
      toast.success('Modèle sauvegardé avec succès')
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde du modèle')
      console.error('Erreur de sauvegarde:', error)
    }
  }

  const handleLoadTemplate = (templateId: string) => {
    const template = savedTemplates.find(t => t.id === templateId)
    if (template) {
      setSelectedFormat(template.format)
      setSelectedFields(fields =>
        fields.map(field => ({
          ...field,
          included: template.fields.includes(field.id)
        }))
      )
      toast.success('Modèle chargé')
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/tools"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Retour aux outils
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Export de Données</h1>
          <p className="text-muted-foreground">
            Exportez les données des propriétés dans différents formats pour analyse et partage.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Configuration de l'export */}
          <div className="space-y-6">
            {/* Format d'export */}
            <Card>
              <CardHeader>
                <CardTitle>Format d'Export</CardTitle>
                <CardDescription>
                  Choisissez le format de fichier pour votre export
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {exportFormats.map((format) => (
                  <div
                    key={format.value}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedFormat === format.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedFormat(format.value)}
                  >
                    <div className="flex items-center space-x-3">
                      <format.icon className="w-5 h-5" />
                      <div>
                        <div className="font-medium">{format.label}</div>
                        <div className="text-sm text-muted-foreground">
                          {format.description}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Sélection des champs */}
            <Card>
              <CardHeader>
                <CardTitle>Champs à Exporter</CardTitle>
                <CardDescription>
                  Sélectionnez les données à inclure dans l'export
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedFields.map((field) => (
                  <div
                    key={field.id}
                    className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/50"
                  >
                    <Checkbox
                      id={field.id}
                      checked={field.included}
                      onCheckedChange={() => handleFieldToggle(field.id)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor={field.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {field.label}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {field.description}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Modèles et actions */}
          <div className="space-y-6">
            {/* Modèles sauvegardés */}
            <Card>
              <CardHeader>
                <CardTitle>Modèles Sauvegardés</CardTitle>
                <CardDescription>
                  Réutilisez vos configurations d'export favorites
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingTemplates ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Chargement...
                  </div>
                ) : savedTemplates.length > 0 ? (
                  <div className="space-y-3">
                    {savedTemplates.map((template) => (
                      <div
                        key={template.id}
                        className="p-3 border rounded-lg hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{template.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {template.description}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {template.fields.length} champs • {template.format.toUpperCase()}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleLoadTemplate(template.id)}
                          >
                            Charger
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    Aucun modèle sauvegardé
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Sauvegarder un nouveau modèle */}
            <Card>
              <CardHeader>
                <CardTitle>Sauvegarder un Modèle</CardTitle>
                <CardDescription>
                  Enregistrez cette configuration pour un usage futur
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="templateName">Nom du modèle</Label>
                  <Input
                    id="templateName"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Ex: Export complet, Export basique..."
                  />
                </div>
                <div>
                  <Label htmlFor="templateDescription">Description (optionnel)</Label>
                  <Textarea
                    id="templateDescription"
                    value={templateDescription}
                    onChange={(e) => setTemplateDescription(e.target.value)}
                    placeholder="Description du modèle..."
                    rows={3}
                  />
                </div>
                <Button
                  onClick={handleSaveTemplate}
                  className="w-full"
                  variant="outline"
                >
                  Sauvegarder le Modèle
                </Button>
              </CardContent>
            </Card>

            {/* Bouton d'export */}
            <Card>
              <CardHeader>
                <CardTitle>Exporter les Données</CardTitle>
                <CardDescription>
                  Générez le fichier d'export avec la configuration actuelle
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="w-full"
                  size="lg"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Export en cours...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Exporter ({selectedFields.filter(f => f.included).length} champs)
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Format: {selectedFormat.toUpperCase()} • {selectedFields.filter(f => f.included).length} champs sélectionnés
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Download,
  FileText,
  Table,
  FileSpreadsheet,
  FileImage,
  Lock,
  Loader2
} from 'lucide-react'
import { usePermissions } from '@/hooks/use-permissions'
import { toast } from 'sonner'

interface ExportField {
  key: string
  label: string
  included: boolean
}

export function ExportDataCard () {
  const { can } = usePermissions()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel' | 'pdf'>(
    'csv'
  )
  const [isExporting, setIsExporting] = useState(false)
  const [exportFields, setExportFields] = useState<ExportField[]>([
    { key: 'title', label: 'Titre de la propriété', included: true },
    { key: 'price', label: 'Prix', included: true },
    { key: 'address', label: 'Adresse', included: true },
    { key: 'city', label: 'Ville', included: true },
    { key: 'propertyType', label: 'Type de propriété', included: true },
    { key: 'surface', label: 'Surface', included: true },
    { key: 'bedrooms', label: 'Chambres', included: false },
    { key: 'bathrooms', label: 'Salles de bain', included: false },
    { key: 'description', label: 'Description', included: false },
    { key: 'contactInfo', label: 'Informations de contact', included: false }
  ])

  if (!can('canExportData')) {
    return (
      <Card>
        <CardContent className='p-6'>
          <div className='text-center text-gray-500'>
            <Lock className='h-12 w-12 mx-auto mb-4 text-gray-300' />
            <h3 className='text-lg font-semibold mb-2'>Export de données</h3>
            <p className='text-sm'>
              Disponible avec les plans Premium et Agent
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleFieldToggle = (fieldKey: string) => {
    setExportFields(prev =>
      prev.map(field =>
        field.key === fieldKey ? { ...field, included: !field.included } : field
      )
    )
  }

  const handleExport = async () => {
    const selectedFields = exportFields.filter(field => field.included)

    if (selectedFields.length === 0) {
      toast.error('Veuillez sélectionner au moins un champ à exporter')
      return
    }

    setIsExporting(true)

    try {
      // Récupérer les filtres actuels pour l'export
      const currentFilters = new URLSearchParams(window.location.search)

      const response = await fetch('/api/export/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          format: exportFormat,
          fields: selectedFields.map(f => f.key),
          filters: Object.fromEntries(currentFilters.entries())
        })
      })

      if (!response.ok) {
        throw new Error("Erreur lors de l'export")
      }

      // Télécharger le fichier
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url

      const extension = exportFormat === 'excel' ? 'xlsx' : exportFormat
      a.download = `properties_export_${
        new Date().toISOString().split('T')[0]
      }.${extension}`

      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      setIsDialogOpen(false)
      toast.success('Export téléchargé avec succès')
    } catch (error) {
      console.error("Erreur lors de l'export:", error)
      toast.error("Erreur lors de l'export")
    } finally {
      setIsExporting(false)
    }
  }

  const formatIcons = {
    csv: Table,
    excel: FileSpreadsheet,
    pdf: FileText
  }

  const FormatIcon = formatIcons[exportFormat]

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Download className='h-5 w-5' />
          Export de données
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <p className='text-sm text-gray-600'>
            Exportez vos résultats de recherche dans différents formats pour une
            analyse approfondie.
          </p>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant='outline'
                  className='flex flex-col items-center p-4 h-auto'
                  onClick={() => setExportFormat('csv')}
                >
                  <Table className='h-8 w-8 mb-2' />
                  <span className='text-sm'>CSV</span>
                  <span className='text-xs text-gray-500'>
                    Tableau de données
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent className='max-w-2xl'>
                <DialogHeader>
                  <DialogTitle className='flex items-center gap-2'>
                    <FormatIcon className='h-5 w-5' />
                    Exporter en {exportFormat.toUpperCase()}
                  </DialogTitle>
                </DialogHeader>

                <div className='space-y-6'>
                  <div>
                    <Label className='text-base font-medium'>
                      Format d'export
                    </Label>
                    <Select
                      value={exportFormat}
                      onValueChange={(value: any) => setExportFormat(value)}
                    >
                      <SelectTrigger className='mt-2'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='csv'>
                          <div className='flex items-center gap-2'>
                            <Table className='h-4 w-4' />
                            CSV - Tableau de données
                          </div>
                        </SelectItem>
                        <SelectItem value='excel'>
                          <div className='flex items-center gap-2'>
                            <FileSpreadsheet className='h-4 w-4' />
                            Excel - Classeur Excel
                          </div>
                        </SelectItem>
                        <SelectItem value='pdf'>
                          <div className='flex items-center gap-2'>
                            <FileText className='h-4 w-4' />
                            PDF - Rapport formaté
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className='text-base font-medium'>
                      Champs à inclure
                    </Label>
                    <div className='mt-3 grid grid-cols-2 gap-3'>
                      {exportFields.map(field => (
                        <div
                          key={field.key}
                          className='flex items-center space-x-2'
                        >
                          <Checkbox
                            id={field.key}
                            checked={field.included}
                            onCheckedChange={() => handleFieldToggle(field.key)}
                          />
                          <Label
                            htmlFor={field.key}
                            className='text-sm font-normal cursor-pointer'
                          >
                            {field.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className='flex justify-between items-center pt-4 border-t'>
                    <Badge variant='secondary'>
                      {exportFields.filter(f => f.included).length} champs
                      sélectionnés
                    </Badge>
                    <Button
                      onClick={handleExport}
                      disabled={isExporting}
                      className='min-w-[120px]'
                    >
                      {isExporting ? (
                        <>
                          <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                          Export...
                        </>
                      ) : (
                        <>
                          <Download className='h-4 w-4 mr-2' />
                          Exporter
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              variant='outline'
              className='flex flex-col items-center p-4 h-auto'
              onClick={() => {
                setExportFormat('excel')
                setIsDialogOpen(true)
              }}
            >
              <FileSpreadsheet className='h-8 w-8 mb-2' />
              <span className='text-sm'>Excel</span>
              <span className='text-xs text-gray-500'>Classeur Excel</span>
            </Button>

            <Button
              variant='outline'
              className='flex flex-col items-center p-4 h-auto'
              onClick={() => {
                setExportFormat('pdf')
                setIsDialogOpen(true)
              }}
            >
              <FileText className='h-8 w-8 mb-2' />
              <span className='text-sm'>PDF</span>
              <span className='text-xs text-gray-500'>Rapport formaté</span>
            </Button>
          </div>

          <div className='text-xs text-gray-500 bg-gray-50 p-3 rounded'>
            💡 <strong>Astuce :</strong> L'export inclura toutes les propriétés
            correspondant à vos filtres de recherche actuels.
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

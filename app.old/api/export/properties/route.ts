import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { format, fields, filters } = await request.json()

    // Dans une vraie application, vous récupéreriez les données depuis votre base de données
    // en appliquant les filtres fournis
    const mockProperties = [
      {
        title: "Prime Office Building - Downtown Financial District",
        price: 2500000,
        address: "123 Business District",
        city: "San Francisco",
        propertyType: "Office",
        surface: 15000,
        bedrooms: null,
        bathrooms: null,
        description: "Prime commercial office space in the heart of the financial district...",
        contactInfo: "John Doe - (555) 123-4567"
      },
      {
        title: "Modern Retail Space in Shopping Center",
        price: 18,
        address: "456 Shopping Center",
        city: "Los Angeles",
        propertyType: "Retail",
        surface: 8500,
        bedrooms: null,
        bathrooms: null,
        description: "High-traffic retail location with excellent visibility...",
        contactInfo: "Jane Smith - (555) 987-6543"
      },
      {
        title: "Luxury Hotel Property - Waterfront Location",
        price: 15000000,
        address: "555 Ocean View Blvd",
        city: "Miami",
        propertyType: "Hospitality",
        surface: 25000,
        bedrooms: 150,
        bathrooms: 150,
        description: "Stunning waterfront hotel with panoramic ocean views...",
        contactInfo: "Mike Johnson - (555) 456-7890"
      }
    ]

    // Filtrer les données selon les champs sélectionnés
    const filteredData = mockProperties.map(property => {
      const filteredProperty: any = {}
      fields.forEach((field: string) => {
        if (property.hasOwnProperty(field)) {
          filteredProperty[field] = (property as any)[field]
        }
      })
      return filteredProperty
    })

    let content: string
    let contentType: string
    let extension: string

    switch (format) {
      case 'csv':
        content = generateCSV(filteredData, fields)
        contentType = 'text/csv'
        extension = 'csv'
        break
      case 'excel':
        // Pour une vraie application, vous utiliseriez une bibliothèque comme xlsx
        content = generateCSV(filteredData, fields) // Simplification pour la démo
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        extension = 'xlsx'
        break
      case 'pdf':
        content = generatePDF(filteredData, fields)
        contentType = 'application/pdf'
        extension = 'pdf'
        break
      default:
        return NextResponse.json({ error: "Format non supporté" }, { status: 400 })
    }

    const response = new NextResponse(content, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="properties_export_${new Date().toISOString().split('T')[0]}.${extension}"`
      }
    })

    return response

  } catch (error) {
    console.error("Erreur lors de l'export:", error)
    return NextResponse.json(
      { error: "Erreur lors de l'export" },
      { status: 500 }
    )
  }
}

function generateCSV(data: any[], fields: string[]): string {
  const fieldLabels: { [key: string]: string } = {
    title: 'Titre',
    price: 'Prix',
    address: 'Adresse',
    city: 'Ville',
    propertyType: 'Type',
    surface: 'Surface',
    bedrooms: 'Chambres',
    bathrooms: 'Salles de bain',
    description: 'Description',
    contactInfo: 'Contact'
  }

  // En-têtes
  const headers = fields.map(field => fieldLabels[field] || field).join(',')
  
  // Données
  const rows = data.map(row => 
    fields.map(field => {
      const value = row[field]
      if (value === null || value === undefined) return ''
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return String(value)
    }).join(',')
  )

  return [headers, ...rows].join('\n')
}

function generatePDF(data: any[], fields: string[]): string {
  // Pour une vraie application, vous utiliseriez une bibliothèque comme jsPDF ou PDFKit
  // Ici, nous retournons un PDF simple simulé
  const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
(Export de propriétés) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000207 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
299
%%EOF`

  return pdfContent
}

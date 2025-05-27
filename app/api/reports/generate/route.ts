import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { templateId, title, description, filters } = await request.json()

    // Dans une vraie application, vous génèreriez un vrai rapport PDF
    // en utilisant des bibliothèques comme jsPDF, PDFKit, ou Puppeteer
    const reportContent = generateReportPDF(templateId, title, description, filters)

    const response = new NextResponse(reportContent, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="rapport_${templateId}_${new Date().toISOString().split('T')[0]}.pdf"`
      }
    })

    return response

  } catch (error) {
    console.error("Erreur lors de la génération du rapport:", error)
    return NextResponse.json(
      { error: "Erreur lors de la génération du rapport" },
      { status: 500 }
    )
  }
}

function generateReportPDF(templateId: string, title: string, description: string, filters: any): string {
  // Simulation d'un PDF - Dans une vraie application, vous utiliseriez une vraie bibliothèque PDF
  const templateNames: { [key: string]: string } = {
    'market-analysis': 'Analyse de Marché',
    'portfolio-summary': 'Résumé de Portfolio',
    'comparative-analysis': 'Analyse Comparative',
    'location-report': 'Rapport de Localisation'
  }

  const templateName = templateNames[templateId] || 'Rapport Personnalisé'
  const currentDate = new Date().toLocaleDateString('fr-FR')

  // Structure PDF simplifiée pour la démo
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
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 500
>>
stream
BT
/F1 16 Tf
50 750 Td
(${title || templateName}) Tj
0 -30 Td
/F1 12 Tf
(Généré le ${currentDate}) Tj
0 -50 Td
(${description || 'Rapport généré automatiquement par LoopNet'}) Tj
0 -40 Td
(Type de rapport: ${templateName}) Tj
0 -30 Td
(Filtres appliqués: ${Object.keys(filters).length} critères) Tj
0 -50 Td
(CONTENU DU RAPPORT:) Tj
0 -30 Td
/F1 10 Tf
(• Analyse des données de marché) Tj
0 -20 Td
(• Tendances et prévisions) Tj
0 -20 Td
(• Recommandations stratégiques) Tj
0 -20 Td
(• Graphiques et visualisations) Tj
0 -20 Td
(• Conclusions et prochaines étapes) Tj
0 -50 Td
/F1 8 Tf
(Rapport généré par LoopNet - Plateforme d'analyse immobilière) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000251 00000 n 
0000000802 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
879
%%EOF`

  return pdfContent
}

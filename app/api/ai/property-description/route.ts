import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const body = await request.json()
  const { propertyData } = body

  try {
    // Use Hugging Face text generation model for property descriptions
    const response = await fetch("https://api-inference.huggingface.co/models/gpt2", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: `Generate a professional commercial real estate property description for: ${JSON.stringify(propertyData)}. The description should be compelling, detailed, and highlight key features and benefits.`,
        parameters: {
          max_length: 300,
          temperature: 0.8,
          do_sample: true,
          return_full_text: false,
        },
      }),
    })

    const data = await response.json()

    // Process and clean the generated description
    const description = data[0]?.generated_text || ""

    // Add professional formatting and structure
    const formattedDescription = formatPropertyDescription(description, propertyData)

    return NextResponse.json({
      description: formattedDescription,
      originalInput: propertyData,
      model: "huggingface-gpt2",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Property Description Generation Error:", error)

    // Fallback template-based description
    const fallbackDescription = generateFallbackDescription(propertyData)

    return NextResponse.json({
      description: fallbackDescription,
      fallback: true,
      error: "AI generation failed, using template",
    })
  }
}

function formatPropertyDescription(aiText: string, propertyData: any): string {
  const { type, sqft, location, price, features } = propertyData

  let formatted = `**${type} Property - ${location}**\n\n`
  formatted += aiText.trim() + "\n\n"
  formatted += `**Key Details:**\n`
  formatted += `• Size: ${sqft} square feet\n`
  formatted += `• Location: ${location}\n`
  formatted += `• Price: ${price}\n\n`

  if (features && features.length > 0) {
    formatted += `**Features:**\n`
    features.forEach((feature: string) => {
      formatted += `• ${feature}\n`
    })
  }

  return formatted
}

function generateFallbackDescription(propertyData: any): string {
  const { type, sqft, location, price, features } = propertyData

  return `Exceptional ${type.toLowerCase()} opportunity in ${location}. This ${sqft} square foot property offers outstanding potential for businesses seeking premium commercial space. 

Located in a highly desirable area, this property combines modern amenities with strategic positioning for maximum business impact. The space features flexible layouts suitable for various commercial applications.

**Property Highlights:**
• ${sqft} square feet of premium space
• Prime location in ${location}
• Competitive pricing at ${price}
• Professional-grade amenities
${features ? features.map((f: string) => `• ${f}`).join("\n") : ""}

This property represents an excellent opportunity for businesses looking to establish or expand their presence in this thriving market. Contact us today to schedule a viewing and discover the potential this space offers for your business goals.`
}

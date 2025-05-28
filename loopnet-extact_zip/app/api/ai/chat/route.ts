import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const body = await request.json()
  const { message, context, history } = body

  try {
    // Integration with Hugging Face Inference API
    const response = await fetch("https://api-inference.huggingface.co/models/microsoft/DialoGPT-large", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: {
          past_user_inputs: history?.filter((h: any) => h.type === "user").map((h: any) => h.content) || [],
          generated_responses: history?.filter((h: any) => h.type === "ai").map((h: any) => h.content) || [],
          text: `Real Estate Context: ${message}`,
        },
        parameters: {
          max_length: 500,
          temperature: 0.7,
          do_sample: true,
        },
      }),
    })

    if (!response.ok) {
      throw new Error("Hugging Face API error")
    }

    const data = await response.json()

    // Process the response for real estate context
    let aiResponse =
      data.generated_text || "I'm here to help with your real estate needs. Could you please provide more details?"

    // Add real estate specific logic
    if (message.toLowerCase().includes("valuation") || message.toLowerCase().includes("price")) {
      aiResponse +=
        "\n\nFor accurate property valuation, I'd need details like location, square footage, property type, and recent comparable sales. Would you like me to help you gather this information?"
    }

    if (message.toLowerCase().includes("market") || message.toLowerCase().includes("trend")) {
      aiResponse +=
        "\n\nI can provide market analysis based on current data. Which specific market or property type are you interested in?"
    }

    // Generate suggestions based on the conversation
    const suggestions = generateSuggestions(message, context)

    return NextResponse.json({
      response: aiResponse,
      suggestions: suggestions,
      model: "huggingface-dialogpt",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("AI Chat Error:", error)

    // Fallback response
    return NextResponse.json({
      response:
        "I apologize, but I'm experiencing some technical difficulties. However, I can still help you with real estate questions. What specific information are you looking for?",
      suggestions: [
        "Property valuation help",
        "Market analysis",
        "Generate property description",
        "Investment analysis",
      ],
      error: true,
    })
  }
}

function generateSuggestions(message: string, context: string): string[] {
  const baseSuggestions = [
    "Generate property description",
    "Analyze market trends",
    "Calculate property value",
    "Investment analysis",
  ]

  // Context-aware suggestions
  if (message.toLowerCase().includes("office")) {
    return [
      "Office market trends",
      "Office space valuation",
      "Commercial lease analysis",
      "Office building description",
    ]
  }

  if (message.toLowerCase().includes("retail")) {
    return ["Retail market analysis", "Foot traffic impact", "Retail space valuation", "Shopping center trends"]
  }

  if (message.toLowerCase().includes("industrial")) {
    return ["Industrial market trends", "Warehouse valuation", "Logistics hub analysis", "Industrial lease rates"]
  }

  return baseSuggestions
}

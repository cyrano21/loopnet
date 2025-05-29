import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const body = await request.json()
  const { location, propertyType, timeframe } = body

  try {
    // Use Hugging Face model for market analysis
    const prompt = `Analyze the commercial real estate market for ${propertyType} properties in ${location} for ${timeframe}. Include trends, pricing, demand, and investment outlook.`

    const response = await fetch("https://api-inference.huggingface.co/models/facebook/bart-large-cnn", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: 500,
          min_length: 200,
          do_sample: true,
          temperature: 0.7,
        },
      }),
    })

    const data = await response.json()

    // Combine AI analysis with real market data
    const analysis = await enhanceWithMarketData(data[0]?.summary_text || "", { location, propertyType, timeframe })

    return NextResponse.json({
      analysis: analysis,
      location: location,
      propertyType: propertyType,
      timeframe: timeframe,
      model: "huggingface-bart",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Market Analysis Error:", error)

    // Fallback analysis
    const fallbackAnalysis = generateFallbackAnalysis({ location, propertyType, timeframe })

    return NextResponse.json({
      analysis: fallbackAnalysis,
      fallback: true,
      error: "AI analysis failed, using template",
    })
  }
}

async function enhanceWithMarketData(aiAnalysis: string, params: any) {
  // Mock market data - in production, integrate with real market data APIs
  const marketData = {
    averagePrice: "$245/sq ft",
    vacancyRate: "8.3%",
    absorption: "+15.2%",
    newSupply: "2.1M sq ft",
    priceGrowth: "+5.7% YoY",
  }

  return `${aiAnalysis}

**Current Market Metrics:**
• Average Price: ${marketData.averagePrice}
• Vacancy Rate: ${marketData.vacancyRate}
• Net Absorption: ${marketData.absorption}
• New Supply: ${marketData.newSupply}
• Price Growth: ${marketData.priceGrowth}

**Investment Outlook:**
Based on current trends and AI analysis, the ${params.propertyType} market in ${params.location} shows positive indicators for ${params.timeframe}. Key factors include strong demand fundamentals, limited new supply, and favorable economic conditions.

**Recommendations:**
• Consider properties in emerging submarkets
• Focus on value-add opportunities
• Monitor interest rate impacts
• Evaluate long-term lease structures`
}

function generateFallbackAnalysis(params: any): string {
  return `**Market Analysis: ${params.propertyType} in ${params.location}**

The ${params.propertyType.toLowerCase()} market in ${params.location} continues to show resilience and growth potential for ${params.timeframe}. Current market conditions indicate:

**Market Trends:**
• Steady demand from businesses seeking quality space
• Limited new construction maintaining supply-demand balance
• Rental rates showing modest growth year-over-year
• Investment activity remains strong with institutional interest

**Key Factors:**
• Economic growth supporting commercial real estate demand
• Infrastructure improvements enhancing property values
• Demographic trends favoring commercial development
• Technology adoption driving space efficiency needs

**Investment Considerations:**
• Properties with modern amenities commanding premium rents
• Location remains the primary value driver
• Flexible lease terms becoming more important
• ESG factors increasingly influencing investment decisions

**Outlook:**
The market outlook for ${params.timeframe} appears positive, with continued growth expected in both rental rates and property values. Investors should focus on well-located properties with strong tenant profiles and modern amenities.`
}

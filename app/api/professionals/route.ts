import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const specialty = searchParams.get("specialty")
  const location = searchParams.get("location")
  const sortBy = searchParams.get("sortBy") || "rating"

  // Mock professionals data - in real app, this would call your NestJS API
  const professionals = [
    {
      id: 1,
      name: "John Smith",
      title: "Senior Commercial Broker",
      company: "Premier Commercial Realty",
      location: "San Francisco, CA",
      specialties: ["Office", "Retail"],
      rating: 4.9,
      reviews: 127,
      yearsExperience: 15,
      totalTransactions: 245,
      totalVolume: "$125M",
      certifications: ["CCIM", "SIOR"],
      phone: "(555) 123-4567",
      email: "john.smith@premier.com",
    },
    // ... more professionals
  ]

  // Filter and sort logic would go here
  let filteredProfessionals = professionals

  if (specialty && specialty !== "all") {
    filteredProfessionals = filteredProfessionals.filter((p) =>
      p.specialties.some((s) => s.toLowerCase() === specialty.toLowerCase()),
    )
  }

  if (location && location !== "all") {
    filteredProfessionals = filteredProfessionals.filter((p) =>
      p.location.toLowerCase().includes(location.toLowerCase()),
    )
  }

  // Sort professionals
  filteredProfessionals.sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating
      case "experience":
        return b.yearsExperience - a.yearsExperience
      case "transactions":
        return b.totalTransactions - a.totalTransactions
      default:
        return b.rating - a.rating
    }
  })

  return NextResponse.json({
    professionals: filteredProfessionals,
    total: filteredProfessionals.length,
  })
}

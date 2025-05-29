import { NextResponse } from "next/server"
import seedNews from "@/scripts/seed-news"

export async function POST() {
  try {
    await seedNews()

    return NextResponse.json({
      success: true,
      message: "Base de données peuplée avec les actualités !",
    })
  } catch (error) {
    console.error("Seed News Error:", error)
    return NextResponse.json({ success: false, error: "Failed to seed news" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"
import bcrypt from "bcryptjs"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, email, role, phone, company, bio, password } = body

    await connectToDatabase()

    const updateData: any = {
      name,
      email,
      role,
      phone,
      company,
      bio,
    }

    // Si un nouveau mot de passe est fourni
    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 12)
    }

    const user = await User.findByIdAndUpdate(params.id, updateData, { new: true }).select("-password")

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour de l'utilisateur" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const user = await User.findByIdAndDelete(params.id)

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    return NextResponse.json({ message: "Utilisateur supprimé avec succès" })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Erreur lors de la suppression de l'utilisateur" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"
import bcrypt from "bcryptjs"

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    const users = await User.find({}).select("-password").sort({ createdAt: -1 })

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des utilisateurs" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, role, phone, company, bio, password } = body

    await connectToDatabase()

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "Un utilisateur avec cet email existe déjà" }, { status: 400 })
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12)

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      company,
      bio,
      isEmailVerified: true, // Admin créé = vérifié
    })

    await user.save()

    const userResponse = user.toObject()
    delete userResponse.password

    return NextResponse.json({ user: userResponse }, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Erreur lors de la création de l'utilisateur" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { sign } from "jsonwebtoken"
import { redirect } from "next/navigation"

// Gérer les redirections lors des erreurs d'authentification
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const error = searchParams.get("error");
  
  // Rediriger vers la page de connexion avec le paramètre d'erreur
  return redirect(`/auth/signin?error=${error || "unknown"}`);
}

export async function POST(request: Request) {
  const body = await request.json()
  const { email, password } = body

  // Admin credentials
  if (email === "louiscyrano@gmail.com" && password === "Figoro21.") {
    const user = {
      id: "admin-1",
      email: "louiscyrano@gmail.com",
      firstName: "Louis",
      lastName: "Cyrano",
      accountType: "admin",
      company: "LoopNet Admin",
      verified: true,
      role: "admin",
      permissions: ["all"],
    }

    const token = sign(user, "your-secret-key", { expiresIn: "30d" })

    return NextResponse.json({
      success: true,
      token,
      user,
    })
  }

  // Demo user
  if (email === "demo@loopnet.com" && password === "password") {
    const user = {
      id: "1",
      email: "demo@loopnet.com",
      firstName: "John",
      lastName: "Smith",
      accountType: "broker",
      company: "Premier Commercial Realty",
      verified: true,
    }

    const token = sign(user, "your-secret-key", { expiresIn: "7d" })

    return NextResponse.json({
      success: true,
      token,
      user,
    })
  }

  return NextResponse.json(
    {
      success: false,
      message: "Invalid credentials",
    },
    { status: 401 },
  )
}

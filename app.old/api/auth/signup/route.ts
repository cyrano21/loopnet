import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const body = await request.json()
  const { firstName, lastName, email, password, accountType, company, phone } = body

  // Mock user creation - in real app, this would create user in your NestJS backend
  console.log("Creating user:", { firstName, lastName, email, accountType, company, phone })

  // Simulate user creation
  const newUser = {
    id: Date.now().toString(),
    firstName,
    lastName,
    email,
    accountType,
    company,
    phone,
    verified: false,
    createdAt: new Date().toISOString(),
  }

  return NextResponse.json({
    success: true,
    message: "Account created successfully",
    user: newUser,
  })
}

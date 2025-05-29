import { NextResponse } from "next/server"
import { sign } from "jsonwebtoken"

export async function POST(request: Request) {
  const body = await request.json()
  const { googleToken, userInfo } = body

  try {
    // Verify Google token (in production, verify with Google's API)
    // For demo, we'll create a user from the provided info
    const user = {
      id: `google-${userInfo.sub}`,
      email: userInfo.email,
      firstName: userInfo.given_name,
      lastName: userInfo.family_name,
      accountType: "buyer",
      verified: true,
      provider: "google",
      avatar: userInfo.picture,
    }

    const token = sign(user, "your-secret-key", { expiresIn: "30d" })

    return NextResponse.json({
      success: true,
      token,
      user,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Google authentication failed",
      },
      { status: 401 },
    )
  }
}

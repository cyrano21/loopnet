import { NextResponse } from "next/server"
import { sign } from "jsonwebtoken"

export async function POST(request: Request) {
  const body = await request.json()
  const { facebookToken, userInfo } = body

  try {
    // Verify Facebook token (in production, verify with Facebook's API)
    const user = {
      id: `facebook-${userInfo.id}`,
      email: userInfo.email,
      firstName: userInfo.first_name,
      lastName: userInfo.last_name,
      accountType: "buyer",
      verified: true,
      provider: "facebook",
      avatar: userInfo.picture?.data?.url,
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
        message: "Facebook authentication failed",
      },
      { status: 401 },
    )
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { uploadToCloudinary } from "@/lib/cloudinary"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("images") as File[]
    const folder = (formData.get("folder") as string) || "loopnet/properties"

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, error: "No files provided" }, { status: 400 })
    }

    // Validate file types and sizes
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
    const maxSize = 10 * 1024 * 1024 // 10MB

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ success: false, error: `Invalid file type: ${file.type}` }, { status: 400 })
      }

      if (file.size > maxSize) {
        return NextResponse.json({ success: false, error: `File too large: ${file.name}` }, { status: 400 })
      }
    }

    // Upload files to Cloudinary
    const uploadPromises = files.map(async (file) => {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const result = await uploadToCloudinary(buffer, folder)

      return {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        size: result.bytes,
        alt: file.name.split(".")[0],
      }
    })

    const uploadedImages = await Promise.all(uploadPromises)

    return NextResponse.json({
      success: true,
      data: uploadedImages,
      message: `${uploadedImages.length} images uploaded successfully`,
    })
  } catch (error) {
    console.error("Image upload error:", error)
    return NextResponse.json({ success: false, error: "Failed to upload images" }, { status: 500 })
  }
}

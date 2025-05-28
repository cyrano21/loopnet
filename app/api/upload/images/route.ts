import { NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

interface CloudinaryUploadResult {
  secure_url: string
  public_id: string
  width: number
  height: number
  format: string
  resource_type: string
  created_at: string
  bytes: number
}

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

      // Upload vers Cloudinary
      const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: "image",
            folder: "loopnet-properties",
            transformation: [
              { width: 1200, height: 800, crop: "limit" },
              { quality: "auto:good" },
            ],
          },
          (error, result) => {
            if (error) reject(error)
            else if (result) resolve(result as CloudinaryUploadResult)
            else reject(new Error("Upload failed"))
          }
        ).end(buffer)
      })

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

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const publicId = searchParams.get("publicId")

    if (!publicId) {
      return NextResponse.json({ error: "Public ID required" }, { status: 400 })
    }

    // Supprimer l'image de Cloudinary
    await cloudinary.uploader.destroy(publicId)

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    })
  } catch (error) {
    console.error("Image deletion error:", error)
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 })
  }
}

import { v2 as cloudinary } from "cloudinary"

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface CloudinaryUploadResult {
  secure_url: string
  public_id: string
  width: number
  height: number
  format: string
  resource_type: string
  created_at: string
  bytes: number
}

export const uploadToCloudinary = async (
  buffer: Buffer,
  options?: {
    folder?: string
    transformation?: any[]
    resource_type?: "image" | "video" | "raw" | "auto"
  },
): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: options?.resource_type || "image",
          folder: options?.folder || "loopnet",
          transformation: options?.transformation || [
            { width: 1200, height: 800, crop: "limit" },
            { quality: "auto:good" },
          ],
        },
        (error, result) => {
          if (error) {
            reject(error)
          } else if (result) {
            resolve(result as CloudinaryUploadResult)
          } else {
            reject(new Error("Upload failed: no result"))
          }
        },
      )
      .end(buffer)
  })
}

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error("Erreur suppression Cloudinary:", error)
    throw error
  }
}

export default cloudinary

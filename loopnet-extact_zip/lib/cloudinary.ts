import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const uploadToCloudinary = async (file: File | Buffer, folder = "loopnet") => {
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: folder,
            resource_type: "auto",
            transformation: [{ width: 1200, height: 800, crop: "limit", quality: "auto" }, { format: "webp" }],
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          },
        )
        .end(file)
    })

    return result
  } catch (error) {
    console.error("Cloudinary upload error:", error)
    throw error
  }
}

export const deleteFromCloudinary = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result
  } catch (error) {
    console.error("Cloudinary delete error:", error)
    throw error
  }
}

export default cloudinary

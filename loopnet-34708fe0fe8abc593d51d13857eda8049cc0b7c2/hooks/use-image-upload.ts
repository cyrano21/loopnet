"use client"

import { useState } from "react"

interface UploadedImage {
  url: string
  publicId: string
  width: number
  height: number
  format: string
  size: number
  alt?: string
}

interface UseImageUploadReturn {
  uploadImages: (files: File[], folder?: string) => Promise<UploadedImage[]>
  uploading: boolean
  progress: number
  error: string | null
}

export function useImageUpload(): UseImageUploadReturn {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const uploadImages = async (files: File[], folder = "loopnet/properties"): Promise<UploadedImage[]> => {
    try {
      setUploading(true)
      setProgress(0)
      setError(null)

      // Validate files
      const maxSize = 10 * 1024 * 1024 // 10MB
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"]

      for (const file of files) {
        if (!allowedTypes.includes(file.type)) {
          throw new Error(`Type de fichier non supporté: ${file.type}`)
        }
        if (file.size > maxSize) {
          throw new Error(`Fichier trop volumineux: ${file.name} (max 10MB)`)
        }
      }

      const formData = new FormData()
      files.forEach((file) => {
        formData.append("images", file)
      })
      formData.append("folder", folder)

      const response = await fetch("/api/upload/images", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to upload images")
      }

      setProgress(100)
      return result.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de l'upload"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setUploading(false)
    }
  }

  return {
    uploadImages,
    uploading,
    progress,
    error,
  }
}

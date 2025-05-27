"use client"

export class ImageOptimizer {
  // Compresser une image côté client
  static async compressImage(file: File, maxWidth = 1920, maxHeight = 1080, quality = 0.8): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!
      const img = new Image()

      img.onload = () => {
        // Calculer les nouvelles dimensions
        let { width, height } = img
        const aspectRatio = width / height

        if (width > maxWidth) {
          width = maxWidth
          height = width / aspectRatio
        }

        if (height > maxHeight) {
          height = maxHeight
          width = height * aspectRatio
        }

        // Redimensionner le canvas
        canvas.width = width
        canvas.height = height

        // Dessiner l'image redimensionnée
        ctx.drawImage(img, 0, 0, width, height)

        // Convertir en blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              })
              resolve(compressedFile)
            } else {
              resolve(file)
            }
          },
          "image/jpeg",
          quality,
        )
      }

      img.src = URL.createObjectURL(file)
    })
  }

  // Générer des thumbnails
  static async generateThumbnail(file: File, size = 300): Promise<File> {
    return this.compressImage(file, size, size, 0.7)
  }

  // Convertir en WebP si supporté
  static async convertToWebP(file: File, quality = 0.8): Promise<File> {
    if (!this.supportsWebP()) {
      return file
    }

    return new Promise((resolve) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!
      const img = new Image()

      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const webpFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".webp"), {
                type: "image/webp",
                lastModified: Date.now(),
              })
              resolve(webpFile)
            } else {
              resolve(file)
            }
          },
          "image/webp",
          quality,
        )
      }

      img.src = URL.createObjectURL(file)
    })
  }

  // Vérifier le support WebP
  static supportsWebP(): boolean {
    const canvas = document.createElement("canvas")
    canvas.width = 1
    canvas.height = 1
    return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0
  }

  // Optimiser automatiquement une image
  static async optimizeImage(file: File): Promise<File> {
    let optimizedFile = file

    // 1. Compresser si trop grande
    if (file.size > 2 * 1024 * 1024) {
      // Si > 2MB
      optimizedFile = await this.compressImage(optimizedFile, 1920, 1080, 0.7)
    }

    // 2. Convertir en WebP si possible
    if (this.supportsWebP() && !file.type.includes("webp")) {
      optimizedFile = await this.convertToWebP(optimizedFile)
    }

    return optimizedFile
  }

  // Valider une image
  static validateImage(file: File): { valid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: "Type de fichier non supporté" }
    }

    if (file.size > maxSize) {
      return { valid: false, error: "Fichier trop volumineux (max 10MB)" }
    }

    return { valid: true }
  }

  // Générer un placeholder base64
  static generatePlaceholder(width = 400, height = 300, color = "#f3f4f6"): string {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")!

    canvas.width = width
    canvas.height = height

    // Fond coloré
    ctx.fillStyle = color
    ctx.fillRect(0, 0, width, height)

    // Texte placeholder
    ctx.fillStyle = "#9ca3af"
    ctx.font = "16px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Image", width / 2, height / 2)

    return canvas.toDataURL("image/png")
  }
}

// Hook pour l'optimisation d'images
export function useImageOptimizer() {
  const optimizeImage = async (file: File) => {
    const validation = ImageOptimizer.validateImage(file)
    if (!validation.valid) {
      throw new Error(validation.error)
    }

    return ImageOptimizer.optimizeImage(file)
  }

  const generateThumbnail = (file: File, size?: number) => {
    return ImageOptimizer.generateThumbnail(file, size)
  }

  return {
    optimizeImage,
    generateThumbnail,
    validateImage: ImageOptimizer.validateImage,
    generatePlaceholder: ImageOptimizer.generatePlaceholder,
  }
}

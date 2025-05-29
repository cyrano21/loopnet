import { z } from "zod"

export const PropertySchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  price: z.number().positive("Price must be positive"),
  propertyType: z.string().min(1, "Property type is required"),
  bedrooms: z.number().int().positive().optional(),
  bathrooms: z.number().int().positive().optional(),
  squareFootage: z.number().int().positive().optional(),
  lotSize: z.number().positive().optional(),
  yearBuilt: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
  imageUrl: z.string().url().optional(),
  amenities: z.array(z.string()).default([]),
})

export const PropertyUpdateSchema = PropertySchema.partial()

export const PropertyFilterSchema = z.object({
  search: z.string().optional(),
  propertyType: z.string().optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  bedrooms: z.number().int().positive().optional(),
  bathrooms: z.number().int().positive().optional(),
  location: z.string().optional(),
})

export type PropertyInput = z.infer<typeof PropertySchema>
export type PropertyUpdate = z.infer<typeof PropertyUpdateSchema>
export type PropertyFilter = z.infer<typeof PropertyFilterSchema>

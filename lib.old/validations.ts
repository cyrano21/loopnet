import { z } from "zod"

export const propertySchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(10, "La description doit faire au moins 10 caractères"),
  price: z.number().min(0, "Le prix doit être positif"),
  type: z.string().min(1, "Le type est requis"),
  address: z.string().min(1, "L'adresse est requise"),
  city: z.string().min(1, "La ville est requise"),
  state: z.string().min(1, "L'état/région est requis"),
  zipCode: z.string().min(1, "Le code postal est requis"),
  squareFootage: z.number().min(1, "La superficie doit être positive"),
  yearBuilt: z.number().min(1800, "L'année de construction doit être valide"),
  images: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
})

export const userSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit faire au moins 6 caractères"),
  role: z.enum(["user", "agent", "admin"]).default("user"),
})

export const signInSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
})

export const signUpSchema = z
  .object({
    name: z.string().min(1, "Le nom est requis"),
    email: z.string().email("Email invalide"),
    password: z.string().min(6, "Le mot de passe doit faire au moins 6 caractères"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  })

export type PropertyFormData = z.infer<typeof propertySchema>
export type UserFormData = z.infer<typeof userSchema>
export type SignInFormData = z.infer<typeof signInSchema>
export type SignUpFormData = z.infer<typeof signUpSchema>

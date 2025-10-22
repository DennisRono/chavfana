import { z } from "zod"

const dateFormat = /^\d{4}-\d{2}-\d{2}$/

export const animalDiseaseSchema = z.object({
  name: z.string().min(1, "Disease name is required").max(30),
  date: z.string().regex(dateFormat, "Invalid date format"),
  animal: z.string().uuid("Invalid animal ID"),
})

export const animalProcessSchema = z.object({
  date: z.string().regex(dateFormat, "Invalid date format"),
  type: z.enum(["DEATH", "SALE", "TRANSFER", "OTHER"]),
  number_of_animal: z.number().min(1, "Number must be at least 1"),
  animal: z.string().uuid("Invalid animal ID"),
})

export type AnimalDiseaseForm = z.infer<typeof animalDiseaseSchema>
export type AnimalProcessForm = z.infer<typeof animalProcessSchema>

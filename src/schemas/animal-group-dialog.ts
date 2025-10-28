import { z } from "zod"

const dateFormat = /^\d{4}-\d{2}-\d{2}$/
const dateString = z
  .string()
  .transform((str) => (str === "" ? undefined : str))
  .optional()
  .refine((val) => !val || dateFormat.test(val), {
    message: "Date has wrong format. Use YYYY-MM-DD.",
  })

export const individualAnimalGroupSchema = z.object({
  group_name: z.string().min(1, "Group name is required"),
  type: z.literal("Individual"),
  housing: z.enum(["BARN", "PASTURE", "CAGE", "PEN", "COOP", "STABLE"]),
  animal: z.object({
    type: z.string().min(1, "Animal type is required"),
    breed: z.string().min(1, "Breed is required"),
    name: z.string().min(1, "Animal name is required"),
    gender: z.enum(["MALE", "FEMALE"]),
    tag: z.string().min(1, "Tag is required"),
    weight: z.number().min(0, "Weight cannot be negative"),
    age: z.number().min(0, "Age cannot be negative"),
    arrival_date: dateString,
    birthday: dateString,
    notes: z.string().optional(),
  }),
})

export const animalGroupDialogSchema = z.object({
  group_name: z.string().min(1, "Group name is required"),
  housing: z.enum(["BARN", "PASTURE", "CAGE", "PEN", "COOP", "STABLE"]),
  animals: z.object({
    breed: z.string().min(1, "Breed is required"),
    name: z.string().min(1, "Animal name is required"),
    gender: z.enum(["MALE", "FEMALE"]),
    notes: z.string().optional(),
    type: z.string().min(1, "Animal type is required"),
    starting_number: z.number().min(1, "Starting number must be at least 1"),
    average_weight: z.number().min(0, "Average weight cannot be negative"),
    average_age: z.number().min(0, "Average age cannot be negative"),
  }),
  group_created_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date has wrong format. Use YYYY-MM-DD."),
})


export type IndividualAnimalGroupForm = z.infer<typeof individualAnimalGroupSchema>
export type GroupAnimalGroupForm = z.infer<typeof animalGroupDialogSchema>
export type AnimalGroupDialogForm = z.infer<typeof animalGroupDialogSchema>

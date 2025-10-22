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

export const groupAnimalGroupSchema = z.object({
  group_name: z.string().min(1, "Group name is required"),
  type: z.literal("Group"),
  housing: z.enum(["BARN", "PASTURE", "CAGE", "PEN", "COOP", "STABLE"]),
  animal: z.object({
    type: z.string().min(1, "Animal type is required"),
    breed: z.string().min(1, "Breed is required"),
    name: z.string().min(1, "Animal name is required"),
    gender: z.enum(["MALE", "FEMALE"]),
    starting_number: z.number().min(1, "Starting number must be at least 1"),
    average_weight: z.number().min(0, "Average weight cannot be negative"),
    average_age: z.number().min(0, "Average age cannot be negative"),
    arrival_date: dateString,
    birthday: dateString,
    notes: z.string().optional(),
  }),
})

export const animalGroupDialogSchema = z.discriminatedUnion("type", [
  individualAnimalGroupSchema,
  groupAnimalGroupSchema,
])

export type IndividualAnimalGroupForm = z.infer<typeof individualAnimalGroupSchema>
export type GroupAnimalGroupForm = z.infer<typeof groupAnimalGroupSchema>
export type AnimalGroupDialogForm = z.infer<typeof animalGroupDialogSchema>

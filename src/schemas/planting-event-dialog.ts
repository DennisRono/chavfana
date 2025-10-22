import { z } from "zod"

export const plantingEventDialogSchema = z.object({
  name: z.string().min(1, "Event name is required").max(100),
  planting_date: z
    .string()
    .min(1, "Planting date is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  end_date: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val), "Invalid date format"),
  area_size: z.number().min(1, "Area size must be greater than 0"),
  area_size_unit: z.enum(["SQUARE_FEET", "SQUARE_YARD", "SQUARE_METER", "ACRE", "HECTARE"]),
  stage: z.string().min(1, "Stage is required").max(20),
  type: z.string().min(1, "Type is required").max(20),
  notes: z.string().max(100).optional(),
})

export type PlantingEventDialogForm = z.infer<typeof plantingEventDialogSchema>

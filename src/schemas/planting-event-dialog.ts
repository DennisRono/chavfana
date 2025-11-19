import { z } from 'zod'

export const speciesSchema = z.object({
  id: z.string().uuid().optional(),
  species: z.object({
    id: z.string().uuid().optional(),
    type: z.string().min(1, 'Type is required').max(50),
    variety: z.string().min(1, 'Variety is required').max(50),
    name: z.string().min(1, 'Name is required').max(100),
    bloom_szn: z.string().max(50).optional(),
    notes: z.string().max(500).optional(),
  }),
  amount: z.string().min(1, 'Amount is required'),
  unit: z.enum(['KILOGRAM', 'GRAM', 'POUND', 'OUNCE', 'COUNT']),
})

export const plantingEventDialogSchema = z.object({
  name: z.string().min(1, 'Event name is required').max(100),
  planting_date: z
    .string()
    .min(1, 'Planting date is required')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
    .refine((val) => {
      const today = new Date()
      const date = new Date(val)
      return date <= today
    }, 'Planting date cannot be in the future'),
  end_date: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val),
      'Invalid date format'
    ),
  area_size: z.number().min(1, 'Area size must be greater than 0'),
  area_size_unit: z.enum([
    'SQUARE_FEET',
    'SQUARE_YARD',
    'SQUARE_METER',
    'ACRE',
    'HECTARE',
  ]),
  stage: z.string().min(1, 'Stage is required').max(20),
  type: z.string().min(1, 'Type is required').max(20),
  notes: z.string().max(100).optional(),
  species: z.array(speciesSchema).min(1, 'At least one species is required'),
})

export type SpeciesForm = z.infer<typeof speciesSchema>
export type PlantingEventDialogForm = z.infer<typeof plantingEventDialogSchema>
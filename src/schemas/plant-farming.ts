import { z } from 'zod'

const soilSchema = z
  .object({
    phosphorous: z
      .number()
      .min(0, 'Phosphorous cannot be negative')
      .max(1000, 'Phosphorous value too high'),
    potassium: z
      .number()
      .min(0, 'Potassium cannot be negative')
      .max(1000, 'Potassium value too high'),
    nitrogen: z
      .number()
      .min(0, 'Nitrogen cannot be negative')
      .max(1000, 'Nitrogen value too high'),
    soil_ph: z
      .number()
      .min(0, 'pH must be between 0 and 14')
      .max(14, 'pH must be between 0 and 14'),
  })
  .optional()

const speciesSchema = z.object({
  species: z.object({
    variety: z.string().min(1, 'Variety is required'),
    name: z.string().min(1, 'Species name is required'),
    type: z.string().min(1, 'Species type is required'),
    bloom_szn: z.string(),
    notes: z.string().optional(),
  }),
  amount: z.string().min(1, 'Amount is required'),
  unit: z.enum(['KILOGRAM', 'GRAM', 'UNIT', 'POUND'], {
    error: () => ({ message: 'Invalid unit' }),
  }),
})

const plantingEventSchema = z.object({
  planting_date: z
    .string()
    .min(1, 'Planting date is required')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  area_size: z.string().min(1, 'Area size is required'),
  area_size_unit: z.enum(
    ['SQUARE_FEET', 'SQUARE_YARD', 'SQUARE_METER', 'ACRE', 'HECTARE'],
    {
      error: () => ({ message: 'Invalid area unit' }),
    }
  ),

  end_date: z.string().optional(),
  notes: z.string().optional(),
  stage: z.string().min(1, 'Stage is required'),
  type: z.string().min(1, 'Crop type is required'),
  name: z.string().min(1, 'Event name is required'),
  species: z.array(speciesSchema).min(1, 'At least one species is required'),
})

export const plantingProjectSchema = z.object({
  name: z
    .string()
    .min(1, 'Project name is required')
    .max(100, 'Project name must be less than 100 characters'),
  created_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  type: z.literal('PlantingProject'),
  status: z.enum(['Planning', 'Active', 'Completed', 'Archived']),
  location: z.object({
    country: z
      .string()
      .min(2, 'Country is required')
      .max(2, 'Country code must be 2 characters'),
    city: z.string().min(1, 'City is required').max(100, 'City name too long'),
    coordinate: z.object({
      latitude: z
        .number()
        .min(-90, 'Latitude must be between -90 and 90')
        .max(90, 'Latitude must be between -90 and 90'),
      longitude: z
        .number()
        .min(-180, 'Longitude must be between -180 and 180')
        .max(180, 'Longitude must be between -180 and 180'),
    }),
  }),
  soil: soilSchema,
  planting_event: plantingEventSchema,
})

export type PlantingProjectForm = z.infer<typeof plantingProjectSchema>
export type SpeciesForm = z.infer<typeof speciesSchema>

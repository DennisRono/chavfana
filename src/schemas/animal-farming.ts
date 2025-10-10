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

const individualAnimalSchema = z.object({
  tag: z.string().min(1, 'Tag ID is required'),
  breed: z.string().min(1, 'Breed is required'),
  name: z.string().optional(),
  arrival_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  birthday: z.string().optional(),
  type: z.string().min(1, 'Animal type is required'),
  gender: z.enum(['MALE', 'FEMALE'], {
    error: () => ({ message: 'Invalid gender' }),
  }),
  weight: z.number().min(0, 'Weight cannot be negative'),
  age: z.string().min(1, 'Age is required'),
  notes: z.string().optional(),
})

const groupAnimalSchema = z.object({
  breed: z.string().min(1, 'Breed is required'),
  name: z.string().optional(),
  arrival_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  birthday: z.string().optional(),
  type: z.string().min(1, 'Animal type is required'),
  gender: z.enum(['MALE', 'FEMALE'], {
    error: () => ({ message: 'Invalid gender' }),
  }),
  average_weight: z.number().min(0, 'Average weight cannot be negative'),
  average_age: z.number().min(0, 'Average age cannot be negative'),
  starting_number: z.number().min(1, 'Starting number must be at least 1'),
  notes: z.string().optional(),
})

const animalGroupSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('Individual'),
    group_name: z.string().min(1, 'Group name is required'),
    housing: z.enum(['BARN', 'PASTURE', 'CAGE', 'PEN', 'COOP', 'STABLE'], {
      error: () => ({ message: 'Invalid housing type' }),
    }),
    group_created_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
    animals: individualAnimalSchema,
  }),
  z.object({
    type: z.literal('Group'),
    group_name: z.string().min(1, 'Group name is required'),
    housing: z.enum(['BARN', 'PASTURE', 'CAGE', 'PEN', 'COOP', 'STABLE'], {
      error: () => ({ message: 'Invalid housing type' }),
    }),
    group_created_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
    animals: groupAnimalSchema,
  }),
])

export const animalProjectSchema = z.object({
  name: z
    .string()
    .min(1, 'Project name is required')
    .max(100, 'Project name must be less than 100 characters'),
  created_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  type: z.literal('AnimalKeepingProject'),
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
  animal_group: animalGroupSchema,
})

export type AnimalProjectForm = z.infer<typeof animalProjectSchema>
export type IndividualAnimalForm = z.infer<typeof individualAnimalSchema>
export type GroupAnimalForm = z.infer<typeof groupAnimalSchema>

import { z } from 'zod'

const dateFormat = /^\d{4}-\d{2}-\d{2}$/
const dateString = z
  .string()
  .transform((str) => (str === '' ? undefined : str))
  .optional()
  .refine((val) => !val || dateFormat.test(val), {
    message: 'Date has wrong format. Use YYYY-MM-DD.',
  })

const uuidSchema = z.string().uuid('Invalid UUID format').optional()

const individualAnimalSchema = z.object({
  tag: z.string().min(1, 'Tag ID is required'),
  breed: z.string().min(1, 'Breed is required'),
  name: z.string().min(1, 'Animal name is required'),
  arrival_date: dateString,
  birthday: dateString,
  type: z.string().min(1, 'Animal type is required'),
  gender: z.enum(['MALE', 'FEMALE'], {
    error: 'Invalid gender',
  }),
  weight: z.number().min(0, 'Weight cannot be negative'),
  age: z.number().min(0, 'Age cannot be negative'),
  notes: z.string().optional(),
})

const groupAnimalSchema = z.object({
  breed: z.string().min(1, 'Breed is required'),
  name: z.string().min(1, 'Group name is required'),
  type: z.string().min(1, 'Animal type is required'),
  gender: z.enum(['MALE', 'FEMALE', 'BOTH'], {
    error: 'Invalid gender',
  }),
  starting_number: z.number().min(1, 'Starting number must be at least 1'),
  average_weight: z
    .number()
    .min(0, 'Average weight cannot be negative')
    .optional(),
  average_age: z.number().min(0, 'Average age cannot be negative').optional(),
  arrival_date: dateString.optional(),
  birthday: dateString.optional(),
  notes: z.string().optional(),
})

const baseAnimalGroupFields = {
  group_name: z.string().min(1, 'Group name is required'),
  housing: z.enum(
    ['BARN', 'PASTURE', 'CAGE', 'PEN', 'COOP', 'STABLE', 'FREE_RANGE', 'MIXED'],
    {
      error: 'Invalid housing type',
    }
  ),
  group_created_date: dateString,
}

const animalGroupSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('Individual'),
    ...baseAnimalGroupFields,
    animals: z
      .array(individualAnimalSchema)
      .min(1, 'At least one animal is required'),
  }),
  z.object({
    type: z.literal('Group'),
    ...baseAnimalGroupFields,
    pack: groupAnimalSchema,
  }),
])

export const animalProjectSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Project name is required')
      .max(100, 'Project name must be less than 100 characters'),
    created_date: dateString,
    type: z.literal('AnimalKeepingProject'),
    status: z.enum(['Planning', 'Active', 'Completed']),
    location: z.object({
      country: z
        .string()
        .min(2, 'Country is required')
        .max(2, 'Country code must be 2 characters'),
      city: z
        .string()
        .min(1, 'City is required')
        .max(100, 'City name too long'),
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

    animal: individualAnimalSchema.optional(),

    animal_group: animalGroupSchema.optional(),

    farm_id: uuidSchema,
    plot_id: uuidSchema,
  })

  .refine((data) => !(data.animal && data.animal_group), {
    message: 'Cannot have both animal and animal_group',
    path: ['animal_group'],
  })

export const animalProjectUpdateSchema = animalProjectSchema.partial()

export type AnimalProjectForm = z.infer<typeof animalProjectSchema>
export type AnimalProjectUpdateForm = z.infer<typeof animalProjectUpdateSchema>
export type IndividualAnimalForm = z.infer<typeof individualAnimalSchema>
export type GroupAnimalForm = z.infer<typeof groupAnimalSchema>
export type AnimalGroupForm = z.infer<typeof animalGroupSchema>

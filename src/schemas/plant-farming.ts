import { z } from 'zod'

export const plantingProjectSchema = z.object({
  name: z
    .string()
    .min(1, 'Project name is required')
    .max(100, 'Project name must be less than 100 characters'),
  created_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  type: z.literal('PlantingProject'),
  status: z.enum(['Planning', 'Active', 'Completed', 'Archived']),
  is_active: z.boolean(),
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
  soil: z.object({
    type: z.enum(['Sandy', 'Clay', 'Loam', 'Silty', 'Peaty', 'Chalky']),
    nitrogen: z
      .number()
      .min(0, 'Nitrogen cannot be negative')
      .max(1000, 'Nitrogen value too high'),
    phosphorous: z
      .number()
      .min(0, 'Phosphorous cannot be negative')
      .max(1000, 'Phosphorous value too high'),
    potassium: z
      .number()
      .min(0, 'Potassium cannot be negative')
      .max(1000, 'Potassium value too high'),
    soil_ph: z
      .number()
      .min(0, 'pH must be between 0 and 14')
      .max(14, 'pH must be between 0 and 14'),
  }),
  weather: z.object({
    temperature: z
      .number()
      .min(-50, 'Temperature too low')
      .max(60, 'Temperature too high'),
    humidity: z
      .number()
      .int()
      .min(0, 'Humidity must be between 0 and 100')
      .max(100, 'Humidity must be between 0 and 100'),
    precipitation: z
      .number()
      .min(0, 'Precipitation cannot be negative')
      .max(10000, 'Precipitation value too high'),
    wind_speed: z
      .number()
      .min(0, 'Wind speed cannot be negative')
      .max(500, 'Wind speed too high'),
    solar_radiation: z
      .number()
      .min(0, 'Solar radiation cannot be negative')
      .max(2000, 'Solar radiation too high'),
  }),
  planting_event: z.object({
    planting_date: z
      .string()
      .min(1, 'Planting date is required')
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
    area_size: z.string().min(1, 'Area size is required'),
    area_size_unit: z.enum(['acres', 'hectares', 'sqm', 'sqft']),
    end_date: z.string().optional(),
    notes: z.string().optional(),
    stage: z.enum([
      'Planning',
      'Planting',
      'Growing',
      'Harvesting',
      'Completed',
    ]),
    type: z
      .string()
      .min(1, 'Crop type is required')
      .max(100, 'Crop type too long'),
    name: z
      .string()
      .min(1, 'Event name is required')
      .max(100, 'Event name too long'),
    species: z.array(
      z.object({
        species: z.object({
          variety: z.string().min(1, 'Variety is required'),
          name: z.string().min(1, 'Species name is required'),
          type: z.string().min(1, 'Species type is required'),
          bloom_szn: z.string(),
          notes: z.string(),
        }),
        amount: z.string().min(1, 'Amount is required'),
        unit: z.string().min(1, 'Unit is required'),
      })
    ),
  }),
})

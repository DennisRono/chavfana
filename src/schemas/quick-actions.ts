import { z } from "zod"

const dateFormat = /^\d{4}-\d{2}-\d{2}$/

// Feeding Schema
export const logFeedingSchema = z.object({
  animal_group_id: z.string().uuid("Invalid animal group ID"),
  feed_type: z.string().min(1, "Feed type is required").max(50),
  quantity: z.number().min(0.01, "Quantity must be greater than 0"),
  unit: z.enum(["KG", "LB", "LITER", "GALLON"]),
  feeding_date: z.string().regex(dateFormat, "Invalid date format"),
  notes: z.string().max(500).optional(),
})

// Health Record Schema
export const addHealthRecordSchema = z.object({
  animal_id: z.string().uuid("Invalid animal ID"),
  status: z.enum(["HEALTHY", "SICK", "DEAD"]),
  notes: z.string().max(500).optional(),
})

// Harvest Schema
export const recordHarvestSchema = z.object({
  planting_event_id: z.string().uuid("Invalid planting event ID"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  unit: z.enum(["KILOGRAM", "POUND", "LITER", "GALLON", "BUSHEL", "TON"]),
  harvest_date: z.string().regex(dateFormat, "Invalid date format"),
  quality: z.enum(["EXCELLENT", "GOOD", "FAIR", "POOR"]),
})

// Soil Data Schema
export const updateSoilDataSchema = z.object({
  soil_type: z.string().max(50).optional(),
  nitrogen: z.number().min(0).optional(),
  phosphorous: z.number().min(0).optional(),
  potassium: z.number().min(0).optional(),
  soil_ph: z.number().min(0).max(14).optional(),
  notes: z.string().max(500).optional(),
})

export type LogFeedingForm = z.infer<typeof logFeedingSchema>
export type AddHealthRecordForm = z.infer<typeof addHealthRecordSchema>
export type RecordHarvestForm = z.infer<typeof recordHarvestSchema>
export type UpdateSoilDataForm = z.infer<typeof updateSoilDataSchema>

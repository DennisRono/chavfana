import type { AnimalType, HealthStatus } from '@/types/animal-farming'

export const ANIMAL_TYPES: { value: AnimalType; label: string }[] = [
  { value: 'cattle', label: 'Cattle' },
  { value: 'sheep', label: 'Sheep' },
  { value: 'goat', label: 'Goat' },
  { value: 'pig', label: 'Pig' },
  { value: 'chicken', label: 'Chicken' },
  { value: 'duck', label: 'Duck' },
]

export const HEALTH_STATUSES: { value: HealthStatus; label: string }[] = [
  { value: 'healthy', label: 'Healthy' },
  { value: 'sick', label: 'Sick' },
  { value: 'recovering', label: 'Recovering' },
  { value: 'pregnant', label: 'Pregnant' },
]

export const ACTIVITY_TYPES = [
  { value: 'process', label: 'Process' },
  { value: 'sale', label: 'Sale' },
  { value: 'treatment', label: 'Treatment' },
] as const

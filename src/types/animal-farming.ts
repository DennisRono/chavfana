export interface AnimalData {
  projectName: string
  animalType: string
  breed: string
  location: string
  startDate: string
}

export interface IndividualRecord {
  id: number
  tagId: string
  age: string
  weight: string
  healthStatus: string
}

export interface GroupData {
  startNumber: string
  currentNumber: string
  averageAge: string
  averageWeight: string
}

export interface ActivityRecord {
  id: number
  type: 'process' | 'sale' | 'treatment'
  description: string
  date: string
  quantity: string
  cost: string
  timestamp: string
}

export interface NewRecord {
  type: 'process' | 'sale' | 'treatment'
  description: string
  date: string
  quantity: string
  cost: string
}

export interface ActivitySection {
  title: string
  data: ActivityRecord[]
  type: 'process' | 'sale' | 'treatment'
}

export type FarmingType = 'individual' | 'group'
export type HealthStatus = 'healthy' | 'sick' | 'recovering' | 'pregnant'
export type AnimalType =
  | 'cattle'
  | 'sheep'
  | 'goat'
  | 'pig'
  | 'chicken'
  | 'duck'

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


export type FarmingType = 'individual' | 'group'
export type HealthStatus = 'healthy' | 'sick' | 'recovering' | 'pregnant'
export type AnimalType =
  | 'cattle'
  | 'sheep'
  | 'goat'
  | 'pig'
  | 'chicken'
  | 'duck'

/** SLICE TYPES */


export interface AnimalGroup {
  id: string
  type: "Group" | "Individual"
  group_name: string
  housing: string
  animals: any
  group_created_date: string
}

export interface AnimalDisease {
  id: string
  name: string
  date: string
  animal: string
  treatments?: any[]
}

export interface AnimalHarvest {
  id: string
  product: string
  amount: number
  unit: string
  date: string
  animal: string
}

export interface AnimalProcess {
  id: string
  date: string
  type: string
  number_of_animal: number
  animal: string
}

export interface AnimalFeed {
  animal: string
  date: string
  name: string
  amount: number
  unit: string
}

export interface AnimalState {
  groups: AnimalGroup[]
  currentGroup: AnimalGroup | null
  diseases: AnimalDisease[]
  harvests: AnimalHarvest[]
  processes: AnimalProcess[]
  feeds: AnimalFeed[]
  isLoading: boolean
  error: string | null
}

/** ACTIONS TYPES */

export interface AnimalDiseaseManagementData {}
export interface AnimalDiseaseData {}
export interface AnimalFeedData {}
export interface AnimalGroupData {}
export interface AnimalHarvestData {}
export interface AnimalProcessData {}

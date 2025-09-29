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

/** ACTIONS TYPES */

export interface AnimalDiseaseManagementResponse {}
export interface AnimalDiseaseManagementData {}
export interface AnimalDiseaseResponse {}
export interface AnimalDiseaseData {}
export interface AnimalFeedResponse {}
export interface AnimalFeedData {}
export interface AnimalGroupResponse {}
export interface AnimalGroupData {}
export interface AnimalHarvestResponse {}
export interface AnimalHarvestData {}
export interface AnimalProcessResponse {}
export interface AnimalProcessData {}

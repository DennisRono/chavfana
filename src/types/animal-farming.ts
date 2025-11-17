export type AnimalHarvestUnit =
  | 'KILOGRAM'
  | 'POUND'
  | 'TON'
  | 'TONNE'
  | 'LITRE'
  | 'GALLON'
  | 'GRAM'

export type AnimalFeedUnit = 'KILOGRAM' | 'POUND' | 'TON' | 'TONNE' | 'GRAM'

export type AnimalProcessType = 'DEATH' | 'SOLD'

export type AnimalGender = 'MALE' | 'FEMALE'

export type AnimalHousingType = 'BARN' | 'CAGE' | 'FREE_RANGE'

export type AnimalGroupType = 'Group' | 'Individual'

export type HealthStatusType = 'HEALTHY' | 'SICK' | 'DEAD' | 'RECOVERING' | 'PREGNANT'

export interface AnimalDiseaseManagementData {
  name: string
  date: string
  disease: string
  method: string
}

export interface AnimalDiseaseManagementResponse {
  id: string
  name: string
  date: string
  disease: string
  method: string
}

export interface AnimalDiseaseData {
  name: string
  date: string
  animal: string
}

export interface AnimalDiseaseResponse {
  id: string
  name: string
  date: string
  animal: string
  treatments: AnimalDiseaseManagementResponse[]
}

export interface AnimalFeedData {
  animal: string
  date: string
  name: string
  amount: number
  unit: AnimalFeedUnit
  nutrients?: {
    protein?: number
    fat?: number
    fiber?: number
    carbohydrates?: number
  } | null
}

export interface AnimalFeedResponse {
  id: string
  animal: string
  date: string
  name: string
  amount: number
  unit: AnimalFeedUnit
  nutrients: {
    protein: number
    fat: number
    fiber: number
    carbohydrates: number
  } | null
}

export interface AnimalGroupData {
  type: AnimalGroupType
  group_name: string
  project: string
  housing: AnimalHousingType
  group_created_date: string
  animals?: IndividualAnimalData | GroupAnimalData
}

export interface AnimalGroupResponse {
  id: string
  type: AnimalGroupType
  group_name: string
  project: string
  housing: AnimalHousingType
  animals: AnimalResponse | GroupAnimalResponse
  group_created_date: string
}

export interface IndividualAnimalData {
  tag: string
  breed: string
  name: string
  arrival_date: string
  birthday: string
  notes?: string
  type: string
  gender: AnimalGender
  weight: number
  age: number
}

export interface GroupAnimalData {
  breed: string
  name: string
  arrival_date: string
  birthday: string
  notes?: string
  type: string
  gender: AnimalGender
  average_weight: number
  average_age: number
  starting_number: number
}

export interface AnimalResponse {
  id: string
  tag: string
  breed: string
  name: string
  arrival_date: string
  birthday: string
  notes?: string | null
  type: string
  gender: AnimalGender
  weight: number
  age: number
  created_at: string
  group: string
  health_status: HealthStatusResponse[]
  harvests: AnimalHarvestResponse[]
  processed?: AnimalProcessResponse[]
}

export interface GroupAnimalResponse {
  id: string
  breed: string
  name: string
  arrival_date: string
  birthday: string
  notes?: string | null
  type: string
  gender: AnimalGender
  average_weight: number
  average_age: number
  starting_number: number
  created_at: string
  group: string
  health_status: HealthStatusResponse[]
  harvests: AnimalHarvestResponse[]
  processed?: AnimalProcessResponse[]
}

export interface HealthStatusResponse {
  id: string
  status: HealthStatusType
  created_at: string
  updated_at: string
  animal: string
}

export interface AnimalHarvestData {
  product: string
  amount: number
  unit: AnimalHarvestUnit
  harvest_notes?: string | null
  date: string
  animal: string
}

export interface AnimalHarvestResponse {
  id: string
  product: string
  amount: number
  unit: AnimalHarvestUnit
  harvest_notes: string | null
  date: string
  animal: string
}

export interface AnimalProcessData {
  date: string
  type: AnimalProcessType
  number_of_animal?: number
  animal: string
}

export interface AnimalProcessResponse {
  id: string
  date: string
  type: AnimalProcessType
  number_of_animal?: number
  animal: string
}

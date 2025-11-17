export type PlantHarvestUnit = 'KILOGRAM' | 'POUND' | 'TON' | 'TONNE'
export type PlantHarvestQuality = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR'

export type FertilitySpreadUnit =
  | 'gallon'
  | 'litre'
  | 'kilogram'
  | 'pound'
  | 'ton'
  | 'tonne'

export type FertilitySpreadMaterialUnit =
  | 'GALLON'
  | 'LITRE'
  | 'KILOGRAM'
  | 'POUND'
  | 'TON'
  | 'TONNE'

export interface PlantDiseaseManagementData {
  treatment_name: string
  application_rate: string
  application_date: string
  plant_disease: string
}

export interface PlantDiseaseManagementResponse {
  id: string
  treatment_name: string
  application_rate: string
  application_date: string
  plant_disease: string
}

export interface PlantDiseaseData {
  name: string
  spotted_date: string
  damage: string
  species: string
}

export interface PlantDiseaseResponse {
  id: string
  name: string
  spotted_date: string
  damage: string
  species: string
}

export interface PlantHarvestData {
  date: string
  amount: string
  unit: PlantHarvestUnit
  quality: PlantHarvestQuality
  species: string
}

export interface PlantHarvestResponse {
  id: string
  date: string
  amount: string
  unit: PlantHarvestUnit
  quality: PlantHarvestQuality
  species: string
}

export interface PlantPestManagementData {
  treatment_name: string
  application_rate: string
  application_date: string
  plant_pest: string
}

export interface PlantPestManagementResponse {
  id: string
  treatment_name: string
  application_rate: string
  application_date: string
  plant_pest: string
}

export interface PlantPestData {
  name: string
  spotted_date: string
  damage?: string
  species: string
}

export interface PlantPestResponse {
  id: string
  name: string
  spotted_date: string
  damage?: string
  species: string
}

export interface PlantingEventData {
  project: string
  name: string
  planting_date: string
  area_size: number
  area_size_unit: string
  end_date?: string
  notes?: string
  stage: string
  type: string
  species?: Array<{
    species: {
      variety: string
      name: string
      type: string
      bloom_szn?: string
      notes?: string
    }
    amount: string
    unit: string
  }>
}

export interface PlantingEventResponse {
  id: string
  project: string
  name: string
  planting_date: string
  area_size: number
  area_size_unit: string
  end_date?: string
  notes?: string
  stage: string
  type: string
  species: Array<{
    id: string
    species: {
      id: string
      type: string
      variety: string
      name: string
      bloom_szn: string
      notes: string
      harvests: PlantHarvestResponse[]
      diseases: PlantDiseaseResponse[]
      pests: PlantPestResponse[]
    }
    amount: string
    unit: string
  }>
  fertilities: FertilitySpreadResponse[]
}

export interface FertilitySpreadData {
  date: string
  notes: string
  growth_stage: string
  method: string
  amount: number
  unit: FertilitySpreadUnit
  planting_event: string
  fertility_materials?: Array<{
    amount: string
    unit: FertilitySpreadMaterialUnit
    fertility_material: {
      name: string
      notes?: string | null
      type: string
      start_date?: string | null
      end_date?: string | null
    }
  }>
}

export interface FertilitySpreadResponse {
  id: string
  fertility_materials: Array<{
    amount: string
    unit: FertilitySpreadMaterialUnit
    fertility_material: {
      name: string
      notes: string | null
      type: string
      start_date: string | null
      end_date: string | null
    }
  }>
  date: string
  notes: string
  growth_stage: string
  method: string
  amount: number
  unit: FertilitySpreadUnit
  planting_event: string
}

export interface LandDetails {
  projectName: string
  location: string
  longitude: string
  latitude: string
  soilType: string
  cropPlanted: string
  size: string
  plantingDate: string
}

export interface Supplement {
  id: number
  name: string
  quantity: string
  price: string
}

export interface FieldRecord {
  value: string
  timestamp: string
}

export type UpdatableFieldKey =
  | 'fertilitySpread'
  | 'pest'
  | 'diseases'
  | 'management'
  | 'species'
  | 'harvest'

export type SupplementsAction =
  | { type: 'add'; payload?: { id?: number } }
  | { type: 'remove'; payload: { id: number } }
  | {
      type: 'update'
      payload: { id: number; field: keyof Supplement; value: string }
    }
  | { type: 'set'; payload: Supplement[] }

export type LandAction =
  | { type: 'patch'; payload: Partial<LandDetails> }
  | { type: 'reset'; payload?: LandDetails }

/** SLICE  TYPES */

export interface PlantingEvent {
  id: string
  name: string
  planting_date: string
  area_size: number
  area_size_unit: string
  end_date?: string
  notes?: string
  stage: string
  type: string
  species: any[]
}

export interface PlantDisease {
  id: string
  name: string
  spotted_date: string
  damage: string
  species: string
}

export interface PlantPest {
  id: string
  name: string
  spotted_date: string
  damage?: string
  species: string
}

export interface PlantHarvest {
  id: string
  date: string
  amount: string
  unit: string
  quality: string
  species: string
}

export interface FertilitySpread {
  id: string
  date: string
  notes: string
  growth_stage: string
  method: string
  amount: number
  unit: string
  planting_event: string
}

export interface PlantState {
  plantingEvents: PlantingEvent[]
  currentEvent: PlantingEvent | null
  diseases: PlantDisease[]
  pests: PlantPest[]
  harvests: PlantHarvest[]
  fertilitySpreads: FertilitySpread[]
  isLoading: boolean
  error: string | null
}

/** PLANT ACTIONS */

export interface PlantDiseaseManagementResponse {}
export interface PlantDiseaseManagementData {}
export interface PlantDiseaseResponse {}
export interface PlantDiseaseData {}
export interface PlantHarvestResponse {}
export interface PlantHarvestData {}
export interface PlantPestManagementResponse {}
export interface PlantPestManagementData {}
export interface PlantPestResponse {}
export interface PlantPestData {}
export interface PlantingEventResponse {}
export interface PlantingEventData {}
export interface FertilitySpreadResponse {}
export interface FertilitySpreadData {}

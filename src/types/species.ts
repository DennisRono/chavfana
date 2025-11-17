import { PlantHarvestResponse } from './plant-farming'
import { PlantDiseaseResponse, PlantPestResponse } from './plant-farming'

export interface SpeciesData {
  type: string
  variety: string
  name: string
  bloom_szn?: string | null
  notes?: string | null
}

export interface SpeciesResponse {
  id: string
  type: string
  variety: string
  name: string
  bloom_szn: string | null
  notes: string | null
  harvests: PlantHarvestResponse[]
  diseases: PlantDiseaseResponse[]
  pests: PlantPestResponse[]
}

export interface PlantingEventSpeciesData {
  species: {
    variety: string
    name: string
    type: string
    bloom_szn?: string
    notes?: string
  }
  amount: string
  unit: string
}

export interface PlantingEventSpeciesResponse {
  id: string
  species: SpeciesResponse
  amount: string
  unit: string
}

export interface SpeciesState {
  species: SpeciesResponse[]
  currentSpecies: SpeciesResponse | null
  isLoading: boolean
  error: string | null
}

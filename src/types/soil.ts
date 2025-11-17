export type SoilType = 'Sandy' | 'Silty' | 'Clay' | 'Loam' | 'Peaty' | 'Chalky'

export interface SoilData {
  type: SoilType
  nitrogen: number
  phosphorous: number
  potassium: number
  soil_ph: number
}

export interface SoilResponse {
  type: SoilType
  nitrogen: number
  phosphorous: number
  potassium: number
  soil_ph: number
}

export interface SoilState {
  soils: SoilResponse[]
  currentSoil: SoilResponse | null
  isLoading: boolean
  error: string | null
}

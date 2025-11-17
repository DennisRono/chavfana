export interface FarmData {
  name: string
  location?: string
  size?: number
  size_unit?: 'HECTARE' | 'ACRE' | 'SQUARE_METER'
  description?: string
}

export interface FarmResponse {
  id: string
  name: string
  location?: string
  size?: number
  size_unit?: 'HECTARE' | 'ACRE' | 'SQUARE_METER'
  description?: string
  user: string
  created_at: string
  updated_at: string
  plots?: PlotResponse[]
}

export interface PlotData {
  name: string
  size: number
  size_unit: 'HECTARE' | 'ACRE' | 'SQUARE_METER'
  soil_type?: SoilType
  location?: string
  description?: string
}

export interface PlotResponse {
  id: string
  name: string
  size: number
  size_unit: 'HECTARE' | 'ACRE' | 'SQUARE_METER'
  soil_type?: SoilType
  location?: string
  description?: string
  farm: string
  created_at: string
  updated_at: string
}

export type SoilType = 'Sandy' | 'Silty' | 'Clay' | 'Loam' | 'Peaty' | 'Chalky'

export interface FarmState {
  farms: FarmResponse[]
  currentFarm: FarmResponse | null
  plots: PlotResponse[]
  currentPlot: PlotResponse | null
  isLoading: boolean
  error: string | null
}

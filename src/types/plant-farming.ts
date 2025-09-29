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

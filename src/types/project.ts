export interface Location {
  country: string
  city: string
  coordinate: {
    latitude: number
    longitude: number
  }
}

export interface Soil {
  phosphorous?: number
  potassium?: number
  nitrogen?: number
  soil_ph?: number
}

export interface IndividualAnimal {
  tag: string
  breed: string
  name: string
  arrival_date: string
  birthday: string
  notes?: string
  type: string
  gender: 'MALE' | 'FEMALE'
  weight: number
  age: number | string
}

export interface GroupAnimal {
  breed: string
  name: string
  arrival_date: string
  birthday: string
  notes?: string
  type: string
  gender: 'MALE' | 'FEMALE'
  average_weight: number
  average_age: number
  starting_number: number
}

export interface AnimalGroupBase {
  group_name: string
  housing: 'BARN' | 'CAGE' | 'FREE_RANGE'
  group_created_date: string
}

export interface IndividualAnimalGroup extends AnimalGroupBase {
  type: 'Individual'
  animals: IndividualAnimal
}

export interface GroupAnimalGroup extends AnimalGroupBase {
  type: 'Group'
  animals: GroupAnimal
}

export type AnimalGroup = IndividualAnimalGroup | GroupAnimalGroup

export interface PlantSpecies {
  species: {
    variety: string
    name: string
    type: string
    bloom_szn: string
    notes?: string
  }
  amount: string
  unit: string
}

export interface PlantingEvent {
  planting_date: string
  area_size: string
  area_size_unit: string
  end_date: string
  notes?: string
  stage: string
  type: string
  name: string
  species: PlantSpecies[]
}

export interface BaseProject {
  name: string
  created_date: string
  type: 'AnimalKeepingProject' | 'PlantingProject'
  status: 'Active' | 'Planning' | 'Completed'
  location: Location
  soil?: Soil
}

export interface AnimalKeepingProject extends BaseProject {
  type: 'AnimalKeepingProject'
  animal_group: AnimalGroup
}

export interface PlantingProject extends BaseProject {
  type: 'PlantingProject'
  planting_event: PlantingEvent
}

export type ProjectData = AnimalKeepingProject | PlantingProject

export interface ProjectCreateResponse {}

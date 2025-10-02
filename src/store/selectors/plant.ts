import type { RootState } from "@/store/store"
import { createSelector } from "@reduxjs/toolkit"

export const selectPlantingEvents = (state: RootState) => state.plant.plantingEvents
export const selectCurrentEvent = (state: RootState) => state.plant.currentEvent
export const selectPlantDiseases = (state: RootState) => state.plant.diseases
export const selectPlantPests = (state: RootState) => state.plant.pests
export const selectPlantHarvests = (state: RootState) => state.plant.harvests
export const selectFertilitySpreads = (state: RootState) => state.plant.fertilitySpreads
export const selectPlantLoading = (state: RootState) => state.plant.isLoading
export const selectPlantError = (state: RootState) => state.plant.error

export const selectEventById = (eventId: string) =>
  createSelector([selectPlantingEvents], (events) => events.find((e) => e.id === eventId))

export const selectDiseasesBySpeciesId = (speciesId: string) =>
  createSelector([selectPlantDiseases], (diseases) => diseases.filter((d) => d.species === speciesId))

export const selectPestsBySpeciesId = (speciesId: string) =>
  createSelector([selectPlantPests], (pests) => pests.filter((p) => p.species === speciesId))

export const selectHarvestsBySpeciesId = (speciesId: string) =>
  createSelector([selectPlantHarvests], (harvests) => harvests.filter((h) => h.species === speciesId))

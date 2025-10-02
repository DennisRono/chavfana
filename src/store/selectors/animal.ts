import type { RootState } from "@/store/store"
import { createSelector } from "@reduxjs/toolkit"

export const selectAnimalGroups = (state: RootState) => state.animal.groups
export const selectCurrentGroup = (state: RootState) => state.animal.currentGroup
export const selectAnimalDiseases = (state: RootState) => state.animal.diseases
export const selectAnimalHarvests = (state: RootState) => state.animal.harvests
export const selectAnimalProcesses = (state: RootState) => state.animal.processes
export const selectAnimalFeeds = (state: RootState) => state.animal.feeds
export const selectAnimalLoading = (state: RootState) => state.animal.isLoading
export const selectAnimalError = (state: RootState) => state.animal.error

export const selectGroupById = (groupId: string) =>
  createSelector([selectAnimalGroups], (groups) => groups.find((g) => g.id === groupId))

export const selectDiseasesByAnimalId = (animalId: string) =>
  createSelector([selectAnimalDiseases], (diseases) => diseases.filter((d) => d.animal === animalId))

export const selectHarvestsByAnimalId = (animalId: string) =>
  createSelector([selectAnimalHarvests], (harvests) => harvests.filter((h) => h.animal === animalId))

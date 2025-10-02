import { createSlice, WritableDraft, type PayloadAction } from "@reduxjs/toolkit"
import { getAnimalGroups, getAnimalGroupById, createAnimalGroup, deleteAnimalGroup } from "@/store/actions/animal-group"
import {
  getAnimalDiseases,
  createAnimalDisease,
  updateAnimalDisease,
  deleteAnimalDisease,
} from "@/store/actions/animal-disease"
import {
  getAnimalHarvests,
  createAnimalHarvest,
  updateAnimalHarvest,
  deleteAnimalHarvest,
} from "@/store/actions/animal-harvest"
import {
  getAnimalProcesses,
  createAnimalProcess,
  updateAnimalProcess,
  deleteAnimalProcess,
} from "@/store/actions/animal-process"
import { getAnimalFeeds, createAnimalFeed } from "@/store/actions/animal-feeds"
import { AnimalGroup, AnimalState } from "@/types/animal-farming"


const initialState: AnimalState = {
  groups: [],
  currentGroup: null,
  diseases: [],
  harvests: [],
  processes: [],
  feeds: [],
  isLoading: false,
  error: null,
}

const animalSlice = createSlice({
  name: "animal",
  initialState,
  reducers: {
    clearAnimalError: (state) => {
      state.error = null
    },
    setCurrentGroup: (state, action: PayloadAction<AnimalGroup | null>) => {
      state.currentGroup = action.payload
    },
    clearAnimalData: (state) => {
      state.diseases = []
      state.harvests = []
      state.processes = []
      state.feeds = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAnimalGroups.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getAnimalGroups.fulfilled, (state, action: PayloadAction<WritableDraft<AnimalGroup>[]>) => {
        state.isLoading = false
        state.groups = action.payload
      })
      .addCase(getAnimalGroups.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload?.message || "Failed to fetch animal groups"
      })

    builder
      .addCase(getAnimalGroupById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getAnimalGroupById.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentGroup = action.payload
      })
      .addCase(getAnimalGroupById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload?.message || "Failed to fetch animal group"
      })

    builder
      .addCase(createAnimalGroup.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createAnimalGroup.fulfilled, (state, action) => {
        state.isLoading = false
        state.groups.push(action.payload)
      })
      .addCase(createAnimalGroup.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload?.message || "Failed to create animal group"
      })

    builder
      .addCase(deleteAnimalGroup.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteAnimalGroup.fulfilled, (state, action) => {
        state.isLoading = false
        state.groups = state.groups.filter((g) => g.id !== action.meta.arg.groupId)
      })
      .addCase(deleteAnimalGroup.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload?.message || "Failed to delete animal group"
      })

    builder
      .addCase(getAnimalDiseases.fulfilled, (state, action) => {
        state.diseases = action.payload
      })
      .addCase(createAnimalDisease.fulfilled, (state, action) => {
        state.diseases.push(action.payload)
      })
      .addCase(updateAnimalDisease.fulfilled, (state, action) => {
        const index = state.diseases.findIndex((d) => d.id === action.payload.id)
        if (index !== -1) {
          state.diseases[index] = action.payload
        }
      })
      .addCase(deleteAnimalDisease.fulfilled, (state, action) => {
        state.diseases = state.diseases.filter((d) => d.id !== action.meta.arg.diseaseId)
      })

    builder
      .addCase(getAnimalHarvests.fulfilled, (state, action) => {
        state.harvests = action.payload
      })
      .addCase(createAnimalHarvest.fulfilled, (state, action) => {
        state.harvests.push(action.payload)
      })
      .addCase(updateAnimalHarvest.fulfilled, (state, action) => {
        const index = state.harvests.findIndex((h) => h.id === action.payload.id)
        if (index !== -1) {
          state.harvests[index] = action.payload
        }
      })
      .addCase(deleteAnimalHarvest.fulfilled, (state, action) => {
        state.harvests = state.harvests.filter((h) => h.id !== action.meta.arg.harvestId)
      })

    builder
      .addCase(getAnimalProcesses.fulfilled, (state, action) => {
        state.processes = action.payload
      })
      .addCase(createAnimalProcess.fulfilled, (state, action) => {
        state.processes.push(action.payload)
      })
      .addCase(updateAnimalProcess.fulfilled, (state, action) => {
        const index = state.processes.findIndex((p) => p.id === action.payload.id)
        if (index !== -1) {
          state.processes[index] = action.payload
        }
      })
      .addCase(deleteAnimalProcess.fulfilled, (state, action) => {
        state.processes = state.processes.filter((p) => p.id !== action.meta.arg.animalId)
      })

    builder
      .addCase(getAnimalFeeds.fulfilled, (state, action) => {
        state.feeds = action.payload
      })
      .addCase(createAnimalFeed.fulfilled, (state, action) => {
        state.feeds.push(action.payload)
      })
  },
})

export const { clearAnimalError, setCurrentGroup, clearAnimalData } = animalSlice.actions

export default animalSlice.reducer

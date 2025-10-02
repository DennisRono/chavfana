import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import {
  createPlantingEvent,
  getPlantingEventById,
  updatePlantingEvent,
  deletePlantingEvent,
} from "@/store/actions/planting-event"
import {
  getPlantDiseases,
  createPlantDisease,
  updatePlantDisease,
  deletePlantDisease,
} from "@/store/actions/plant-disease"
import { getPlantPests, createPlantPest, updatePlantPest, deletePlantPest } from "@/store/actions/plant-pest"
import {
  getPlantHarvests,
  createPlantHarvest,
  updatePlantHarvest,
  deletePlantHarvest,
} from "@/store/actions/plant-harvest"
import {
  getFertilitySpreads,
  createFertilitySpread,
  updateFertilitySpread,
  deleteFertilitySpread,
} from "@/store/actions/fertility-spread"
import { PlantingEvent, PlantState } from "@/types/plant-farming"



const initialState: PlantState = {
  plantingEvents: [],
  currentEvent: null,
  diseases: [],
  pests: [],
  harvests: [],
  fertilitySpreads: [],
  isLoading: false,
  error: null,
}

const plantSlice = createSlice({
  name: "plant",
  initialState,
  reducers: {
    clearPlantError: (state) => {
      state.error = null
    },
    setCurrentEvent: (state, action: PayloadAction<PlantingEvent | null>) => {
      state.currentEvent = action.payload
    },
    clearPlantData: (state) => {
      state.diseases = []
      state.pests = []
      state.harvests = []
      state.fertilitySpreads = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPlantingEvent.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createPlantingEvent.fulfilled, (state, action) => {
        state.isLoading = false
        state.plantingEvents.push(action.payload)
      })
      .addCase(createPlantingEvent.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload?.message || "Failed to create planting event"
      })

    builder
      .addCase(getPlantingEventById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getPlantingEventById.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentEvent = action.payload
      })
      .addCase(getPlantingEventById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload?.message || "Failed to fetch planting event"
      })

    builder.addCase(updatePlantingEvent.fulfilled, (state, action) => {
      const index = state.plantingEvents.findIndex((e) => e.id === action.payload.id)
      if (index !== -1) {
        state.plantingEvents[index] = action.payload
      }
      if (state.currentEvent?.id === action.payload.id) {
        state.currentEvent = action.payload
      }
    })

    builder.addCase(deletePlantingEvent.fulfilled, (state, action) => {
      state.plantingEvents = state.plantingEvents.filter((e) => e.id !== action.meta.arg.eventId)
    })

    builder
      .addCase(getPlantDiseases.fulfilled, (state, action) => {
        state.diseases = action.payload
      })
      .addCase(createPlantDisease.fulfilled, (state, action) => {
        state.diseases.push(action.payload)
      })
      .addCase(updatePlantDisease.fulfilled, (state, action) => {
        const index = state.diseases.findIndex((d) => d.id === action.payload.id)
        if (index !== -1) {
          state.diseases[index] = action.payload
        }
      })
      .addCase(deletePlantDisease.fulfilled, (state, action) => {
        state.diseases = state.diseases.filter((d) => d.id !== action.meta.arg.diseaseId)
      })

    builder
      .addCase(getPlantPests.fulfilled, (state, action) => {
        state.pests = action.payload
      })
      .addCase(createPlantPest.fulfilled, (state, action) => {
        state.pests.push(action.payload)
      })
      .addCase(updatePlantPest.fulfilled, (state, action) => {
        const index = state.pests.findIndex((p) => p.id === action.payload.id)
        if (index !== -1) {
          state.pests[index] = action.payload
        }
      })
      .addCase(deletePlantPest.fulfilled, (state, action) => {
        state.pests = state.pests.filter((p) => p.id !== action.meta.arg.pestId)
      })

    builder
      .addCase(getPlantHarvests.fulfilled, (state, action) => {
        state.harvests = action.payload
      })
      .addCase(createPlantHarvest.fulfilled, (state, action) => {
        state.harvests.push(action.payload)
      })
      .addCase(updatePlantHarvest.fulfilled, (state, action) => {
        const index = state.harvests.findIndex((h) => h.id === action.payload.id)
        if (index !== -1) {
          state.harvests[index] = action.payload
        }
      })
      .addCase(deletePlantHarvest.fulfilled, (state, action) => {
        state.harvests = state.harvests.filter((h) => h.id !== action.meta.arg.harvestId)
      })

    builder
      .addCase(getFertilitySpreads.fulfilled, (state, action) => {
        state.fertilitySpreads = action.payload
      })
      .addCase(createFertilitySpread.fulfilled, (state, action) => {
        state.fertilitySpreads.push(action.payload)
      })
      .addCase(updateFertilitySpread.fulfilled, (state, action) => {
        const index = state.fertilitySpreads.findIndex((f) => f.id === action.payload.id)
        if (index !== -1) {
          state.fertilitySpreads[index] = action.payload
        }
      })
      .addCase(deleteFertilitySpread.fulfilled, (state, action) => {
        state.fertilitySpreads = state.fertilitySpreads.filter((f) => f.id !== action.meta.arg.spreadId)
      })
  },
})

export const { clearPlantError, setCurrentEvent, clearPlantData } = plantSlice.actions

export default plantSlice.reducer

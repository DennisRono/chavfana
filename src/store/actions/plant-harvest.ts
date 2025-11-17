import { createAsyncThunk } from '@reduxjs/toolkit'
import type {
  PlantHarvestResponse,
  PlantHarvestData,
} from '@/types/plant-farming'
import type { ErrorResponse } from '@/types/responses'
import type { RootState } from '@/store/store'

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export const getPlantHarvestById = createAsyncThunk<
  PlantHarvestResponse,
  { speciesId: string; harvestId: string },
  { rejectValue: ErrorResponse }
>(
  'plantHarvest/getById',
  async ({ speciesId, harvestId }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/project/planting-event/species/${speciesId}/plant-harvest/${harvestId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${state?.auth?.access_token}`,
          },
        }
      )

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json()
        return rejectWithValue(errorData)
      }

      return await response.json()
    } catch (error) {
      return rejectWithValue({
        message: 'Failed to fetch plant harvest. Please try again.',
      })
    }
  }
)

export const updatePlantHarvest = createAsyncThunk<
  PlantHarvestResponse,
  { speciesId: string; harvestId: string; harvestData: PlantHarvestData },
  { rejectValue: ErrorResponse }
>(
  'plantHarvest/update',
  async (
    { speciesId, harvestId, harvestData },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/project/planting-event/species/${speciesId}/plant-harvest/${harvestId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${state?.auth?.access_token}`,
          },
          body: JSON.stringify(harvestData),
        }
      )

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json()
        return rejectWithValue(errorData)
      }

      return await response.json()
    } catch (error) {
      return rejectWithValue({
        message: 'Failed to update plant harvest. Please try again.',
      })
    }
  }
)

export const deletePlantHarvest = createAsyncThunk<
  { message: string },
  { speciesId: string; harvestId: string },
  { rejectValue: ErrorResponse }
>(
  'plantHarvest/delete',
  async ({ speciesId, harvestId }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/project/planting-event/species/${speciesId}/plant-harvest/${harvestId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${state?.auth?.access_token}`,
          },
        }
      )

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json()
        return rejectWithValue(errorData)
      }

      return { message: 'Plant harvest deleted successfully' }
    } catch (error) {
      return rejectWithValue({
        message: 'Failed to delete plant harvest. Please try again.',
      })
    }
  }
)

export const getPlantHarvests = createAsyncThunk<
  PlantHarvestResponse[],
  string,
  { rejectValue: ErrorResponse }
>('plantHarvest/getAll', async (speciesId, { getState, rejectWithValue }) => {
  try {
    const state = getState() as RootState
    const response = await fetch(
      `${BASE_URL}/api/project/planting-event/species/${speciesId}/plant-harvests`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${state?.auth?.access_token}`,
        },
      }
    )

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json()
      return rejectWithValue(errorData)
    }

    return await response.json()
  } catch (error) {
    return rejectWithValue({
      message: 'Failed to fetch plant harvests. Please try again.',
    })
  }
})

export const createPlantHarvest = createAsyncThunk<
  PlantHarvestResponse,
  { speciesId: string; harvestData: PlantHarvestData },
  { rejectValue: ErrorResponse }
>(
  'plantHarvest/create',
  async ({ speciesId, harvestData }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/project/planting-event/species/${speciesId}/plant-harvests`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${state?.auth?.access_token}`,
          },
          body: JSON.stringify(harvestData),
        }
      )

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json()
        return rejectWithValue(errorData)
      }

      return await response.json()
    } catch (error) {
      return rejectWithValue({
        message: 'Failed to create plant harvest. Please try again.',
      })
    }
  }
)

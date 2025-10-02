import { createAsyncThunk } from '@reduxjs/toolkit'
import type {
  PlantDisease,
  PlantDiseaseData,
} from '@/types/plant-farming'
import type { ErrorResponse } from '@/types/responses'
import type { RootState } from '@/store/store'

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export const getPlantDiseaseById = createAsyncThunk<
  PlantDisease,
  { speciesId: string; diseaseId: string },
  { rejectValue: ErrorResponse }
>(
  'plantDisease/getById',
  async ({ speciesId, diseaseId }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/project/planting-event/species/${speciesId}/plant-disease/${diseaseId}`,
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
        message: 'Failed to fetch plant disease. Please try again.',
      })
    }
  }
)

export const updatePlantDisease = createAsyncThunk<
  PlantDisease,
  { speciesId: string; diseaseId: string; diseaseData: PlantDiseaseData },
  { rejectValue: ErrorResponse }
>(
  'plantDisease/update',
  async (
    { speciesId, diseaseId, diseaseData },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/project/planting-event/species/${speciesId}/plant-disease/${diseaseId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${state?.auth?.access_token}`,
          },
          body: JSON.stringify(diseaseData),
        }
      )

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json()
        return rejectWithValue(errorData)
      }

      return await response.json()
    } catch (error) {
      return rejectWithValue({
        message: 'Failed to update plant disease. Please try again.',
      })
    }
  }
)

export const deletePlantDisease = createAsyncThunk<
  { message: string },
  { speciesId: string; diseaseId: string },
  { rejectValue: ErrorResponse }
>(
  'plantDisease/delete',
  async ({ speciesId, diseaseId }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/project/planting-event/species/${speciesId}/plant-disease/${diseaseId}`,
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

      return { message: 'Plant disease deleted successfully' }
    } catch (error) {
      return rejectWithValue({
        message: 'Failed to delete plant disease. Please try again.',
      })
    }
  }
)

export const getPlantDiseases = createAsyncThunk<
  PlantDisease[],
  string,
  { rejectValue: ErrorResponse }
>('plantDisease/getAll', async (speciesId, { getState, rejectWithValue }) => {
  try {
    const state = getState() as RootState
    const response = await fetch(
      `${BASE_URL}/api/project/planting-event/species/${speciesId}/plant-diseases`,
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
      message: 'Failed to fetch plant diseases. Please try again.',
    })
  }
})

export const createPlantDisease = createAsyncThunk<
  PlantDisease,
  { speciesId: string; diseaseData: PlantDiseaseData },
  { rejectValue: ErrorResponse }
>(
  'plantDisease/create',
  async ({ speciesId, diseaseData }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/project/planting-event/species/${speciesId}/plant-diseases`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${state?.auth?.access_token}`,
          },
          body: JSON.stringify(diseaseData),
        }
      )

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json()
        return rejectWithValue(errorData)
      }

      return await response.json()
    } catch (error) {
      return rejectWithValue({
        message: 'Failed to create plant disease. Please try again.',
      })
    }
  }
)

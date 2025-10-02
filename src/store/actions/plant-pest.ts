import { createAsyncThunk } from '@reduxjs/toolkit'
import type { PlantPest, PlantPestData } from '@/types/plant-farming'
import type { ErrorResponse } from '@/types/responses'
import type { RootState } from '@/store/store'

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export const getPlantPestById = createAsyncThunk<
  PlantPest,
  { speciesId: string; pestId: string },
  { rejectValue: ErrorResponse }
>(
  'plantPest/getById',
  async ({ speciesId, pestId }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/project/planting-event/species/${speciesId}/plant-pest/${pestId}`,
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
        message: 'Failed to fetch plant pest. Please try again.',
      })
    }
  }
)

export const updatePlantPest = createAsyncThunk<
  PlantPest,
  { speciesId: string; pestId: string; pestData: PlantPestData },
  { rejectValue: ErrorResponse }
>(
  'plantPest/update',
  async ({ speciesId, pestId, pestData }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/project/planting-event/species/${speciesId}/plant-pest/${pestId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${state?.auth?.access_token}`,
          },
          body: JSON.stringify(pestData),
        }
      )

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json()
        return rejectWithValue(errorData)
      }

      return await response.json()
    } catch (error) {
      return rejectWithValue({
        message: 'Failed to update plant pest. Please try again.',
      })
    }
  }
)

export const deletePlantPest = createAsyncThunk<
  { message: string },
  { speciesId: string; pestId: string },
  { rejectValue: ErrorResponse }
>(
  'plantPest/delete',
  async ({ speciesId, pestId }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/project/planting-event/species/${speciesId}/plant-pest/${pestId}`,
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

      return { message: 'Plant pest deleted successfully' }
    } catch (error) {
      return rejectWithValue({
        message: 'Failed to delete plant pest. Please try again.',
      })
    }
  }
)

export const getPlantPests = createAsyncThunk<
  PlantPest[],
  string,
  { rejectValue: ErrorResponse }
>('plantPest/getAll', async (speciesId, { getState, rejectWithValue }) => {
  try {
    const state = getState() as RootState
    const response = await fetch(
      `${BASE_URL}/api/project/planting-event/species/${speciesId}/plant-pests`,
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
      message: 'Failed to fetch plant pests. Please try again.',
    })
  }
})

export const createPlantPest = createAsyncThunk<
  PlantPest,
  { speciesId: string; pestData: PlantPestData },
  { rejectValue: ErrorResponse }
>(
  'plantPest/create',
  async ({ speciesId, pestData }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/project/planting-event/species/${speciesId}/plant-pests`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${state?.auth?.access_token}`,
          },
          body: JSON.stringify(pestData),
        }
      )

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json()
        return rejectWithValue(errorData)
      }

      return await response.json()
    } catch (error) {
      return rejectWithValue({
        message: 'Failed to create plant pest. Please try again.',
      })
    }
  }
)

import { createAsyncThunk } from '@reduxjs/toolkit'
import type {
  AnimalHarvest,
  AnimalHarvestData,
} from '@/types/animal-farming'
import type { ErrorResponse } from '@/types/responses'
import type { RootState } from '@/store/store'

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export const getAnimalHarvests = createAsyncThunk<
  AnimalHarvest[],
  string,
  { rejectValue: ErrorResponse }
>('animalHarvest/getAll', async (animalId, { getState, rejectWithValue }) => {
  try {
    const state = getState() as RootState
    const response = await fetch(
      `${BASE_URL}/api/project/animal-group/animal/${animalId}/harvest`,
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
      message: 'Failed to fetch animal harvests. Please try again.',
    })
  }
})

export const createAnimalHarvest = createAsyncThunk<
  AnimalHarvest,
  { animalId: string; harvestData: AnimalHarvestData },
  { rejectValue: ErrorResponse }
>(
  'animalHarvest/create',
  async ({ animalId, harvestData }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/project/animal-group/animal/${animalId}/harvest`,
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
        message: 'Failed to create animal harvest. Please try again.',
      })
    }
  }
)

export const getAnimalHarvestById = createAsyncThunk<
  AnimalHarvest,
  { animalId: string; harvestId: string },
  { rejectValue: ErrorResponse }
>(
  'animalHarvest/getById',
  async ({ animalId, harvestId }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/project/animal-group/animal/${animalId}/harvest/${harvestId}`,
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
        message: 'Failed to fetch animal harvest. Please try again.',
      })
    }
  }
)

export const updateAnimalHarvest = createAsyncThunk<
  AnimalHarvest,
  { animalId: string; harvestId: string; harvestData: AnimalHarvestData },
  { rejectValue: ErrorResponse }
>(
  'animalHarvest/update',
  async (
    { animalId, harvestId, harvestData },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/project/animal-group/animal/${animalId}/harvest/${harvestId}`,
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
        message: 'Failed to update animal harvest. Please try again.',
      })
    }
  }
)

export const deleteAnimalHarvest = createAsyncThunk<
  { message: string },
  { animalId: string; harvestId: string },
  { rejectValue: ErrorResponse }
>(
  'animalHarvest/delete',
  async ({ animalId, harvestId }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/project/animal-group/animal/${animalId}/harvest/${harvestId}`,
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

      return { message: 'Animal harvest deleted successfully' }
    } catch (error) {
      return rejectWithValue({
        message: 'Failed to delete animal harvest. Please try again.',
      })
    }
  }
)

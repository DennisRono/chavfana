import { createAsyncThunk } from '@reduxjs/toolkit'
import type {
  AnimalDiseaseResponse,
  AnimalDiseaseData,
} from '@/types/animal-farming'
import type { ErrorResponse } from '@/types/responses'
import type { RootState } from '@/store/store'

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export const getAnimalDiseases = createAsyncThunk<
  AnimalDiseaseResponse[],
  string,
  { rejectValue: ErrorResponse }
>('animalDisease/getAll', async (animalId, { getState, rejectWithValue }) => {
  try {
    const state = getState() as RootState
    const response = await fetch(
      `${BASE_URL}/api/project/animal-group/animal/${animalId}/animal-disease`,
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
      message: 'Failed to fetch animal diseases. Please try again.',
    })
  }
})

export const createAnimalDisease = createAsyncThunk<
  AnimalDiseaseResponse,
  { animalId: string; diseaseData: AnimalDiseaseData },
  { rejectValue: ErrorResponse }
>(
  'animalDisease/create',
  async ({ animalId, diseaseData }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/project/animal-group/animal/${animalId}/animal-disease`,
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
        message: 'Failed to create animal disease. Please try again.',
      })
    }
  }
)

export const getAnimalDiseaseById = createAsyncThunk<
  AnimalDiseaseResponse,
  { animalId: string; diseaseId: string },
  { rejectValue: ErrorResponse }
>(
  'animalDisease/getById',
  async ({ animalId, diseaseId }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/project/animal-group/animal/${animalId}/animal-disease/${diseaseId}`,
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
        message: 'Failed to fetch animal disease. Please try again.',
      })
    }
  }
)

export const updateAnimalDisease = createAsyncThunk<
  AnimalDiseaseResponse,
  { animalId: string; diseaseId: string; diseaseData: AnimalDiseaseData },
  { rejectValue: ErrorResponse }
>(
  'animalDisease/update',
  async (
    { animalId, diseaseId, diseaseData },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/project/animal-group/animal/${animalId}/animal-disease/${diseaseId}`,
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
        message: 'Failed to update animal disease. Please try again.',
      })
    }
  }
)

export const deleteAnimalDisease = createAsyncThunk<
  { message: string },
  { animalId: string; diseaseId: string },
  { rejectValue: ErrorResponse }
>(
  'animalDisease/delete',
  async ({ animalId, diseaseId }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/project/animal-group/animal/${animalId}/animal-disease/${diseaseId}`,
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

      return { message: 'Animal disease deleted successfully' }
    } catch (error) {
      return rejectWithValue({
        message: 'Failed to delete animal disease. Please try again.',
      })
    }
  }
)

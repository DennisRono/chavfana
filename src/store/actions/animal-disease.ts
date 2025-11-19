import { createAsyncThunk } from '@reduxjs/toolkit'
import type { AnimalDiseaseResponse, AnimalDiseaseData } from '@/types/animal-farming'
import type { ErrorResponse } from '@/types/responses'
import type { RootState } from '@/store/store'

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

const getAuthHeader = (
  state: RootState | undefined
): Record<string, string> => {
  if (!state?.auth?.access_token) {
    throw new Error('Authentication token not found')
  }
  return {
    Authorization: `Bearer ${state.auth.access_token}`,
  }
}

export const getAnimalDiseases = createAsyncThunk<
  AnimalDiseaseResponse[],
  string,
  { rejectValue: ErrorResponse }
>('animalDisease/getAll', async (animalId, { getState, rejectWithValue }) => {
  try {
    if (!animalId || typeof animalId !== 'string') {
      return rejectWithValue({ message: 'Invalid animal ID' })
    }

    const state = getState() as RootState
    const headers = getAuthHeader(state)

    const response = await fetch(
      `${BASE_URL}/api/project/animal-group/animal/${animalId}/animal-disease`,
      {
        method: 'GET',
        headers,
      }
    )

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json()
      return rejectWithValue(errorData)
    }

    return await response.json()
  } catch (error) {
    return rejectWithValue({
      message:
        error instanceof Error
          ? error.message
          : 'Failed to fetch animal diseases. Please try again.',
    })
  }
})

export const createAnimalDisease = createAsyncThunk<
  AnimalDiseaseResponse,
  { animalid: string; diseaseData: AnimalDiseaseData },
  { rejectValue: ErrorResponse }
>(
  'animalDisease/create',
  async ({ animalid, diseaseData }, { getState, rejectWithValue }) => {
    try {
      if (!animalid || typeof animalid !== 'string') {
        return rejectWithValue({ message: 'Invalid animal ID' })
      }
      if (!diseaseData || typeof diseaseData !== 'object') {
        return rejectWithValue({ message: 'Invalid disease data' })
      }

      const state = getState() as RootState
      const headers = getAuthHeader(state)

      const response = await fetch(
        `${BASE_URL}/api/project/animal-group/animal/${animalid}/animal-disease`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...headers,
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
        message:
          error instanceof Error
            ? error.message
            : 'Failed to create animal disease. Please try again.',
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
      if (!animalId || typeof animalId !== 'string') {
        return rejectWithValue({ message: 'Invalid animal ID' })
      }
      if (!diseaseId || typeof diseaseId !== 'string') {
        return rejectWithValue({ message: 'Invalid disease ID' })
      }

      const state = getState() as RootState
      const headers = getAuthHeader(state)

      const response = await fetch(
        `${BASE_URL}/api/project/animal-group/animal/${animalId}/animal-disease/${diseaseId}`,
        {
          method: 'GET',
          headers,
        }
      )

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json()
        return rejectWithValue(errorData)
      }

      return await response.json()
    } catch (error) {
      return rejectWithValue({
        message:
          error instanceof Error
            ? error.message
            : 'Failed to fetch animal disease. Please try again.',
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
      if (!animalId || typeof animalId !== 'string') {
        return rejectWithValue({ message: 'Invalid animal ID' })
      }
      if (!diseaseId || typeof diseaseId !== 'string') {
        return rejectWithValue({ message: 'Invalid disease ID' })
      }
      if (!diseaseData || typeof diseaseData !== 'object') {
        return rejectWithValue({ message: 'Invalid disease data' })
      }

      const state = getState() as RootState
      const headers = getAuthHeader(state)

      const response = await fetch(
        `${BASE_URL}/api/project/animal-group/animal/${animalId}/animal-disease/${diseaseId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...headers,
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
        message:
          error instanceof Error
            ? error.message
            : 'Failed to update animal disease. Please try again.',
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
      if (!animalId || typeof animalId !== 'string') {
        return rejectWithValue({ message: 'Invalid animal ID' })
      }
      if (!diseaseId || typeof diseaseId !== 'string') {
        return rejectWithValue({ message: 'Invalid disease ID' })
      }

      const state = getState() as RootState
      const headers = getAuthHeader(state)

      const response = await fetch(
        `${BASE_URL}/api/project/animal-group/animal/${animalId}/animal-disease/${diseaseId}`,
        {
          method: 'DELETE',
          headers,
        }
      )

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json()
        return rejectWithValue(errorData)
      }

      return { message: 'Animal disease deleted successfully' }
    } catch (error) {
      return rejectWithValue({
        message:
          error instanceof Error
            ? error.message
            : 'Failed to delete animal disease. Please try again.',
      })
    }
  }
)

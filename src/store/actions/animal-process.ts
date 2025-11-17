import { createAsyncThunk } from '@reduxjs/toolkit'
import type {
  AnimalProcessResponse,
  AnimalProcessData,
} from '@/types/animal-farming'
import type { ErrorResponse } from '@/types/responses'
import type { RootState } from '@/store/store'

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export const getAnimalProcesses = createAsyncThunk<
  AnimalProcessResponse[],
  string,
  { rejectValue: ErrorResponse }
>('animalProcess/getAll', async (animalId, { getState, rejectWithValue }) => {
  try {
    const state = getState() as RootState
    const response = await fetch(
      `${BASE_URL}/api/project/animal-group/animal/${animalId}/animal-process`,
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
      message: 'Failed to fetch animal processes. Please try again.',
    })
  }
})

export const createAnimalProcess = createAsyncThunk<
  AnimalProcessResponse,
  { animalId: string; processData: AnimalProcessData },
  { rejectValue: ErrorResponse }
>(
  'animalProcess/create',
  async ({ animalId, processData }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/project/animal-group/animal/${animalId}/animal-process`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${state?.auth?.access_token}`,
          },
          body: JSON.stringify(processData),
        }
      )

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json()
        return rejectWithValue(errorData)
      }

      return await response.json()
    } catch (error) {
      return rejectWithValue({
        message: 'Failed to create animal process. Please try again.',
      })
    }
  }
)

export const getAnimalProcessById = createAsyncThunk<
  AnimalProcessResponse,
  { animalId: string; processId: string },
  { rejectValue: ErrorResponse }
>(
  'animalProcess/getById',
  async ({ animalId, processId }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/project/animal-group/animal/${animalId}/animal-process/${processId}`,
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
        message: 'Failed to fetch animal process. Please try again.',
      })
    }
  }
)

export const updateAnimalProcess = createAsyncThunk<
  AnimalProcessResponse,
  { animalId: string; processId: string; processData: AnimalProcessData },
  { rejectValue: ErrorResponse }
>(
  'animalProcess/update',
  async (
    { animalId, processId, processData },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/project/animal-group/animal/${animalId}/animal-process/${processId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${state?.auth?.access_token}`,
          },
          body: JSON.stringify(processData),
        }
      )

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json()
        return rejectWithValue(errorData)
      }

      return await response.json()
    } catch (error) {
      return rejectWithValue({
        message: 'Failed to update animal process. Please try again.',
      })
    }
  }
)

export const deleteAnimalProcess = createAsyncThunk<
  { message: string },
  { animalId: string; processId: string },
  { rejectValue: ErrorResponse }
>(
  'animalProcess/delete',
  async ({ animalId, processId }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/project/animal-group/animal/${animalId}/animal-process/${processId}`,
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

      return { message: 'Animal process deleted successfully' }
    } catch (error) {
      return rejectWithValue({
        message: 'Failed to delete animal process. Please try again.',
      })
    }
  }
)

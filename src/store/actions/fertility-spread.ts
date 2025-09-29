import { createAsyncThunk } from '@reduxjs/toolkit'
import type {
  FertilitySpreadResponse,
  FertilitySpreadData,
} from '@/types/plant-farming'
import type { ErrorResponse } from '@/types/responses'
import type { RootState } from '@/store/store'

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export const getFertilitySpreadById = createAsyncThunk<
  FertilitySpreadResponse,
  { plantingEventId: string; spreadId: string },
  { rejectValue: ErrorResponse }
>(
  'fertilitySpread/getById',
  async ({ plantingEventId, spreadId }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/project/planting-event/${plantingEventId}/fertility-spread/${spreadId}`,
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
        message: 'Failed to fetch fertility spread. Please try again.',
      })
    }
  }
)

export const updateFertilitySpread = createAsyncThunk<
  FertilitySpreadResponse,
  {
    plantingEventId: string
    spreadId: string
    spreadData: FertilitySpreadData
  },
  { rejectValue: ErrorResponse }
>(
  'fertilitySpread/update',
  async (
    { plantingEventId, spreadId, spreadData },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/project/planting-event/${plantingEventId}/fertility-spread/${spreadId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${state?.auth?.access_token}`,
          },
          body: JSON.stringify(spreadData),
        }
      )

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json()
        return rejectWithValue(errorData)
      }

      return await response.json()
    } catch (error) {
      return rejectWithValue({
        message: 'Failed to update fertility spread. Please try again.',
      })
    }
  }
)

export const deleteFertilitySpread = createAsyncThunk<
  { message: string },
  { plantingEventId: string; spreadId: string },
  { rejectValue: ErrorResponse }
>(
  'fertilitySpread/delete',
  async ({ plantingEventId, spreadId }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/project/planting-event/${plantingEventId}/fertility-spread/${spreadId}`,
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

      return { message: 'Fertility spread deleted successfully' }
    } catch (error) {
      return rejectWithValue({
        message: 'Failed to delete fertility spread. Please try again.',
      })
    }
  }
)

export const getFertilitySpreads = createAsyncThunk<
  FertilitySpreadResponse[],
  string,
  { rejectValue: ErrorResponse }
>(
  'fertilitySpread/getAll',
  async (plantingEventId, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/project/planting-event/${plantingEventId}/fertility-spreads`,
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
        message: 'Failed to fetch fertility spreads. Please try again.',
      })
    }
  }
)

export const createFertilitySpread = createAsyncThunk<
  FertilitySpreadResponse,
  { plantingEventId: string; spreadData: FertilitySpreadData },
  { rejectValue: ErrorResponse }
>(
  'fertilitySpread/create',
  async ({ plantingEventId, spreadData }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/project/planting-event/${plantingEventId}/fertility-spreads`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${state?.auth?.access_token}`,
          },
          body: JSON.stringify(spreadData),
        }
      )

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json()
        return rejectWithValue(errorData)
      }

      return await response.json()
    } catch (error) {
      return rejectWithValue({
        message: 'Failed to create fertility spread. Please try again.',
      })
    }
  }
)

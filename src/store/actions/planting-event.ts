import { createAsyncThunk } from '@reduxjs/toolkit'
import type {
  PlantingEvent,
  PlantingEventData,
} from '@/types/plant-farming'
import type { ErrorResponse } from '@/types/responses'
import type { RootState } from '@/store/store'

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export const createPlantingEvent = createAsyncThunk<
  PlantingEvent,
  { projectId: string; eventData: PlantingEventData },
  { rejectValue: ErrorResponse }
>(
  'plantingEvent/create',
  async ({ projectId, eventData }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/projects/${projectId}/planting-events/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${state?.auth?.access_token}`,
          },
          body: JSON.stringify(eventData),
        }
      )

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json()
        return rejectWithValue(errorData)
      }

      return await response.json()
    } catch (error) {
      return rejectWithValue({
        message: 'Failed to create planting event. Please try again.',
      })
    }
  }
)

export const getPlantingEventById = createAsyncThunk<
  PlantingEvent,
  { projectId: string; eventId: string },
  { rejectValue: ErrorResponse }
>(
  'plantingEvent/getById',
  async ({ projectId, eventId }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/projects/${projectId}/planting-events/${eventId}/`,
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
        message: 'Failed to fetch planting event. Please try again.',
      })
    }
  }
)

export const updatePlantingEvent = createAsyncThunk<
  PlantingEvent,
  { projectId: string; eventId: string; eventData: PlantingEventData },
  { rejectValue: ErrorResponse }
>(
  'plantingEvent/update',
  async ({ projectId, eventId, eventData }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/projects/${projectId}/planting-events/${eventId}/`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${state?.auth?.access_token}`,
          },
          body: JSON.stringify(eventData),
        }
      )

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json()
        return rejectWithValue(errorData)
      }

      return await response.json()
    } catch (error) {
      return rejectWithValue({
        message: 'Failed to update planting event. Please try again.',
      })
    }
  }
)

export const deletePlantingEvent = createAsyncThunk<
  { message: string },
  { projectId: string; eventId: string },
  { rejectValue: ErrorResponse }
>(
  'plantingEvent/delete',
  async ({ projectId, eventId }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/projects/${projectId}/planting-events/${eventId}/`,
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

      return { message: 'Planting event deleted successfully' }
    } catch (error) {
      return rejectWithValue({
        message: 'Failed to delete planting event. Please try again.',
      })
    }
  }
)

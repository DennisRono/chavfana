import { createAsyncThunk } from '@reduxjs/toolkit'
import type { ErrorResponse } from '@/types/responses'
import type { RootState } from '@/store/store'

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

const getAuthHeader = (state: RootState | undefined): Record<string, string> => {
  if (!state?.auth?.access_token) throw new Error('Authentication token not found')
  return { Authorization: `Bearer ${state.auth.access_token}` }
}

export const getAllSpecies = createAsyncThunk<any, string, { rejectValue: ErrorResponse }>(
  'species/getAll',
  async (eventId, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const headers = getAuthHeader(state)
      const response = await fetch(`${BASE_URL}/api/project/planting-event/${eventId}/species`, { method: 'GET', headers })
      if (!response.ok) {
        const errorData: ErrorResponse = await response.json()
        return rejectWithValue(errorData)
      }
      return await response.json()
    } catch (error) {
      return rejectWithValue({ message: error instanceof Error ? error.message : 'Failed to fetch species' })
    }
  }
)

export const createSpecies = createAsyncThunk<any, { eventId: string; data: any }, { rejectValue: ErrorResponse }>(
  'species/create',
  async ({ eventId, data }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const headers = getAuthHeader(state)
      const response = await fetch(`${BASE_URL}/api/project/planting-event/${eventId}/species`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const errorData: ErrorResponse = await response.json()
        return rejectWithValue(errorData)
      }
      return await response.json()
    } catch (error) {
      return rejectWithValue({ message: error instanceof Error ? error.message : 'Failed to create species' })
    }
  }
)

export const getSpeciesById = createAsyncThunk<any, { eventId: string; speciesId: string }, { rejectValue: ErrorResponse }>(
  'species/getById',
  async ({ eventId, speciesId }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const headers = getAuthHeader(state)
      const response = await fetch(`${BASE_URL}/api/project/planting-event/${eventId}/species/${speciesId}`, { method: 'GET', headers })
      if (!response.ok) {
        const errorData: ErrorResponse = await response.json()
        return rejectWithValue(errorData)
      }
      return await response.json()
    } catch (error) {
      return rejectWithValue({ message: error instanceof Error ? error.message : 'Failed to fetch species' })
    }
  }
)

export const updateSpecies = createAsyncThunk<any, { eventId: string; speciesId: string; data: any }, { rejectValue: ErrorResponse }>(
  'species/update',
  async ({ eventId, speciesId, data }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const headers = getAuthHeader(state)
      const response = await fetch(`${BASE_URL}/api/project/planting-event/${eventId}/species/${speciesId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const errorData: ErrorResponse = await response.json()
        return rejectWithValue(errorData)
      }
      return await response.json()
    } catch (error) {
      return rejectWithValue({ message: error instanceof Error ? error.message : 'Failed to update species' })
    }
  }
)

export const deleteSpecies = createAsyncThunk<{ message: string }, { eventId: string; speciesId: string }, { rejectValue: ErrorResponse }>(
  'species/delete',
  async ({ eventId, speciesId }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const headers = getAuthHeader(state)
      const response = await fetch(`${BASE_URL}/api/project/planting-event/${eventId}/species/${speciesId}`, { method: 'DELETE', headers })
      if (!response.ok) {
        const errorData: ErrorResponse = await response.json()
        return rejectWithValue(errorData)
      }
      return { message: 'Species deleted successfully' }
    } catch (error) {
      return rejectWithValue({ message: error instanceof Error ? error.message : 'Failed to delete species' })
    }
  }
)

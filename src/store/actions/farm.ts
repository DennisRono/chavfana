import { createAsyncThunk } from '@reduxjs/toolkit'
import type { ErrorResponse } from '@/types/responses'
import type { RootState } from '@/store/store'

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

const getAuthHeader = (state: RootState | undefined): Record<string, string> => {
  if (!state?.auth?.access_token) throw new Error('Authentication token not found')
  return { Authorization: `Bearer ${state.auth.access_token}` }
}

export const getAllFarms = createAsyncThunk<any, void, { rejectValue: ErrorResponse }>(
  'farm/getAll',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const headers = getAuthHeader(state)
      const response = await fetch(`${BASE_URL}/api/farms/`, { method: 'GET', headers })
      if (!response.ok) {
        const errorData: ErrorResponse = await response.json()
        return rejectWithValue(errorData)
      }
      return await response.json()
    } catch (error) {
      return rejectWithValue({ message: error instanceof Error ? error.message : 'Failed to fetch farms' })
    }
  }
)

export const createFarm = createAsyncThunk<any, any, { rejectValue: ErrorResponse }>(
  'farm/create',
  async (farmData, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const headers = getAuthHeader(state)
      const response = await fetch(`${BASE_URL}/api/farms/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(farmData),
      })
      if (!response.ok) {
        const errorData: ErrorResponse = await response.json()
        return rejectWithValue(errorData)
      }
      return await response.json()
    } catch (error) {
      return rejectWithValue({ message: error instanceof Error ? error.message : 'Failed to create farm' })
    }
  }
)

export const getFarmById = createAsyncThunk<any, string, { rejectValue: ErrorResponse }>(
  'farm/getById',
  async (farmId, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const headers = getAuthHeader(state)
      const response = await fetch(`${BASE_URL}/api/farms/${farmId}/`, { method: 'GET', headers })
      if (!response.ok) {
        const errorData: ErrorResponse = await response.json()
        return rejectWithValue(errorData)
      }
      return await response.json()
    } catch (error) {
      return rejectWithValue({ message: error instanceof Error ? error.message : 'Failed to fetch farm' })
    }
  }
)

export const updateFarm = createAsyncThunk<any, { farmId: string; data: any }, { rejectValue: ErrorResponse }>(
  'farm/update',
  async ({ farmId, data }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const headers = getAuthHeader(state)
      const response = await fetch(`${BASE_URL}/api/farms/${farmId}/`, {
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
      return rejectWithValue({ message: error instanceof Error ? error.message : 'Failed to update farm' })
    }
  }
)

export const deleteFarm = createAsyncThunk<{ message: string }, string, { rejectValue: ErrorResponse }>(
  'farm/delete',
  async (farmId, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const headers = getAuthHeader(state)
      const response = await fetch(`${BASE_URL}/api/farms/${farmId}/`, { method: 'DELETE', headers })
      if (!response.ok) {
        const errorData: ErrorResponse = await response.json()
        return rejectWithValue(errorData)
      }
      return { message: 'Farm deleted successfully' }
    } catch (error) {
      return rejectWithValue({ message: error instanceof Error ? error.message : 'Failed to delete farm' })
    }
  }
)

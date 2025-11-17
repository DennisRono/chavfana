import { createAsyncThunk } from '@reduxjs/toolkit'
import type { ErrorResponse } from '@/types/responses'
import type { RootState } from '@/store/store'

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

const getAuthHeader = (state: RootState | undefined): Record<string, string> => {
  if (!state?.auth?.access_token) throw new Error('Authentication token not found')
  return { Authorization: `Bearer ${state.auth.access_token}` }
}

export const getAllPlots = createAsyncThunk<any, string, { rejectValue: ErrorResponse }>(
  'plot/getAll',
  async (farmId, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const headers = getAuthHeader(state)
      const response = await fetch(`${BASE_URL}/api/farms/${farmId}/plots/`, { method: 'GET', headers })
      if (!response.ok) {
        const errorData: ErrorResponse = await response.json()
        return rejectWithValue(errorData)
      }
      return await response.json()
    } catch (error) {
      return rejectWithValue({ message: error instanceof Error ? error.message : 'Failed to fetch plots' })
    }
  }
)

export const createPlot = createAsyncThunk<any, { farmId: string; data: any }, { rejectValue: ErrorResponse }>(
  'plot/create',
  async ({ farmId, data }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const headers = getAuthHeader(state)
      const response = await fetch(`${BASE_URL}/api/farms/${farmId}/plots/`, {
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
      return rejectWithValue({ message: error instanceof Error ? error.message : 'Failed to create plot' })
    }
  }
)

export const getPlotById = createAsyncThunk<any, { farmId: string; plotId: string }, { rejectValue: ErrorResponse }>(
  'plot/getById',
  async ({ farmId, plotId }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const headers = getAuthHeader(state)
      const response = await fetch(`${BASE_URL}/api/farms/${farmId}/plots/${plotId}/`, { method: 'GET', headers })
      if (!response.ok) {
        const errorData: ErrorResponse = await response.json()
        return rejectWithValue(errorData)
      }
      return await response.json()
    } catch (error) {
      return rejectWithValue({ message: error instanceof Error ? error.message : 'Failed to fetch plot' })
    }
  }
)

export const updatePlot = createAsyncThunk<any, { farmId: string; plotId: string; data: any }, { rejectValue: ErrorResponse }>(
  'plot/update',
  async ({ farmId, plotId, data }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const headers = getAuthHeader(state)
      const response = await fetch(`${BASE_URL}/api/farms/${farmId}/plots/${plotId}/`, {
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
      return rejectWithValue({ message: error instanceof Error ? error.message : 'Failed to update plot' })
    }
  }
)

export const deletePlot = createAsyncThunk<{ message: string }, { farmId: string; plotId: string }, { rejectValue: ErrorResponse }>(
  'plot/delete',
  async ({ farmId, plotId }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const headers = getAuthHeader(state)
      const response = await fetch(`${BASE_URL}/api/farms/${farmId}/plots/${plotId}/`, { method: 'DELETE', headers })
      if (!response.ok) {
        const errorData: ErrorResponse = await response.json()
        return rejectWithValue(errorData)
      }
      return { message: 'Plot deleted successfully' }
    } catch (error) {
      return rejectWithValue({ message: error instanceof Error ? error.message : 'Failed to delete plot' })
    }
  }
)

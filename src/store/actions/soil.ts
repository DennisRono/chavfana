import { createAsyncThunk } from '@reduxjs/toolkit'
import type { ErrorResponse } from '@/types/responses'
import type { RootState } from '@/store/store'

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

const getAuthHeader = (state: RootState | undefined): Record<string, string> => {
  if (!state?.auth?.access_token) throw new Error('Authentication token not found')
  return { Authorization: `Bearer ${state.auth.access_token}` }
}

export const getAllSoils = createAsyncThunk<any, { page?: number }, { rejectValue: ErrorResponse }>(
  'soil/getAll',
  async ({ page }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const headers = getAuthHeader(state)
      const url = page ? `${BASE_URL}/api/soil/?page=${page}` : `${BASE_URL}/api/soil/`
      const response = await fetch(url, { method: 'GET', headers })
      if (!response.ok) {
        const errorData: ErrorResponse = await response.json()
        return rejectWithValue(errorData)
      }
      return await response.json()
    } catch (error) {
      return rejectWithValue({ message: error instanceof Error ? error.message : 'Failed to fetch soils' })
    }
  }
)

export const createSoil = createAsyncThunk<any, any, { rejectValue: ErrorResponse }>(
  'soil/create',
  async (soilData, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const headers = getAuthHeader(state)
      const response = await fetch(`${BASE_URL}/api/soil/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(soilData),
      })
      if (!response.ok) {
        const errorData: ErrorResponse = await response.json()
        return rejectWithValue(errorData)
      }
      return await response.json()
    } catch (error) {
      return rejectWithValue({ message: error instanceof Error ? error.message : 'Failed to create soil' })
    }
  }
)

export const getSoilById = createAsyncThunk<any, string, { rejectValue: ErrorResponse }>(
  'soil/getById',
  async (id, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const headers = getAuthHeader(state)
      const response = await fetch(`${BASE_URL}/api/soil/${id}/`, { method: 'GET', headers })
      if (!response.ok) {
        const errorData: ErrorResponse = await response.json()
        return rejectWithValue(errorData)
      }
      return await response.json()
    } catch (error) {
      return rejectWithValue({ message: error instanceof Error ? error.message : 'Failed to fetch soil' })
    }
  }
)

export const updateSoil = createAsyncThunk<any, { id: string; data: any }, { rejectValue: ErrorResponse }>(
  'soil/update',
  async ({ id, data }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const headers = getAuthHeader(state)
      const response = await fetch(`${BASE_URL}/api/soil/${id}/`, {
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
      return rejectWithValue({ message: error instanceof Error ? error.message : 'Failed to update soil' })
    }
  }
)

export const patchSoil = createAsyncThunk<any, { id: string; data: any }, { rejectValue: ErrorResponse }>(
  'soil/patch',
  async ({ id, data }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const headers = getAuthHeader(state)
      const response = await fetch(`${BASE_URL}/api/soil/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const errorData: ErrorResponse = await response.json()
        return rejectWithValue(errorData)
      }
      return await response.json()
    } catch (error) {
      return rejectWithValue({ message: error instanceof Error ? error.message : 'Failed to patch soil' })
    }
  }
)

export const deleteSoil = createAsyncThunk<{ message: string }, string, { rejectValue: ErrorResponse }>(
  'soil/delete',
  async (id, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const headers = getAuthHeader(state)
      const response = await fetch(`${BASE_URL}/api/soil/${id}/`, { method: 'DELETE', headers })
      if (!response.ok) {
        const errorData: ErrorResponse = await response.json()
        return rejectWithValue(errorData)
      }
      return { message: 'Soil deleted successfully' }
    } catch (error) {
      return rejectWithValue({ message: error instanceof Error ? error.message : 'Failed to delete soil' })
    }
  }
)

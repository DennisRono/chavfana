import { createAsyncThunk } from '@reduxjs/toolkit'
import type { ErrorResponse } from '@/types/responses'
import type { RootState } from '@/store/store'

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

const getAuthHeader = (state: RootState | undefined): Record<string, string> => {
  if (!state?.auth?.access_token) throw new Error('Authentication token not found')
  return { Authorization: `Bearer ${state.auth.access_token}` }
}

export const getAllFinances = createAsyncThunk<any, { page?: number }, { rejectValue: ErrorResponse }>(
  'finance/getAll',
  async ({ page }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const headers = getAuthHeader(state)
      const url = page ? `${BASE_URL}/api/finances/?page=${page}` : `${BASE_URL}/api/finances/`
      const response = await fetch(url, { method: 'GET', headers })
      if (!response.ok) {
        const errorData: ErrorResponse = await response.json()
        return rejectWithValue(errorData)
      }
      return await response.json()
    } catch (error) {
      return rejectWithValue({ message: error instanceof Error ? error.message : 'Failed to fetch finances' })
    }
  }
)

export const createFinance = createAsyncThunk<any, any, { rejectValue: ErrorResponse }>(
  'finance/create',
  async (financeData, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const headers = getAuthHeader(state)
      const response = await fetch(`${BASE_URL}/api/finances/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(financeData),
      })
      if (!response.ok) {
        const errorData: ErrorResponse = await response.json()
        return rejectWithValue(errorData)
      }
      return await response.json()
    } catch (error) {
      return rejectWithValue({ message: error instanceof Error ? error.message : 'Failed to create finance' })
    }
  }
)

export const getFinanceById = createAsyncThunk<any, string, { rejectValue: ErrorResponse }>(
  'finance/getById',
  async (id, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const headers = getAuthHeader(state)
      const response = await fetch(`${BASE_URL}/api/finances/${id}/`, { method: 'GET', headers })
      if (!response.ok) {
        const errorData: ErrorResponse = await response.json()
        return rejectWithValue(errorData)
      }
      return await response.json()
    } catch (error) {
      return rejectWithValue({ message: error instanceof Error ? error.message : 'Failed to fetch finance' })
    }
  }
)

export const updateFinance = createAsyncThunk<any, { id: string; data: any }, { rejectValue: ErrorResponse }>(
  'finance/update',
  async ({ id, data }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const headers = getAuthHeader(state)
      const response = await fetch(`${BASE_URL}/api/finances/${id}/`, {
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
      return rejectWithValue({ message: error instanceof Error ? error.message : 'Failed to update finance' })
    }
  }
)

export const patchFinance = createAsyncThunk<any, { id: string; data: any }, { rejectValue: ErrorResponse }>(
  'finance/patch',
  async ({ id, data }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const headers = getAuthHeader(state)
      const response = await fetch(`${BASE_URL}/api/finances/${id}/`, {
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
      return rejectWithValue({ message: error instanceof Error ? error.message : 'Failed to patch finance' })
    }
  }
)

export const deleteFinance = createAsyncThunk<{ message: string }, string, { rejectValue: ErrorResponse }>(
  'finance/delete',
  async (id, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const headers = getAuthHeader(state)
      const response = await fetch(`${BASE_URL}/api/finances/${id}/`, { method: 'DELETE', headers })
      if (!response.ok) {
        const errorData: ErrorResponse = await response.json()
        return rejectWithValue(errorData)
      }
      return { message: 'Finance deleted successfully' }
    } catch (error) {
      return rejectWithValue({ message: error instanceof Error ? error.message : 'Failed to delete finance' })
    }
  }
)

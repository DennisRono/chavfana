import { createAsyncThunk } from '@reduxjs/toolkit'
import type {
  PlantPestManagementResponse,
  PlantPestManagementData,
} from '@/types/plant-farming'
import type { ErrorResponse } from '@/types/responses'
import type { RootState } from '@/store/store'

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export const getPlantPestManagementById = createAsyncThunk<
  PlantPestManagementResponse,
  { speciesId: string; pestId: string; managementId: string },
  { rejectValue: ErrorResponse }
>(
  'plantPestManagement/getById',
  async (
    { speciesId, pestId, managementId },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/project/planting-event/species/${speciesId}/pest/${pestId}/plant-pest-management/${managementId}`,
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
        message: 'Failed to fetch plant pest management. Please try again.',
      })
    }
  }
)

export const updatePlantPestManagement = createAsyncThunk<
  PlantPestManagementResponse,
  {
    speciesId: string
    pestId: string
    managementId: string
    managementData: PlantPestManagementData
  },
  { rejectValue: ErrorResponse }
>(
  'plantPestManagement/update',
  async (
    { speciesId, pestId, managementId, managementData },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/project/planting-event/species/${speciesId}/pest/${pestId}/plant-pest-management/${managementId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${state?.auth?.access_token}`,
          },
          body: JSON.stringify(managementData),
        }
      )

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json()
        return rejectWithValue(errorData)
      }

      return await response.json()
    } catch (error) {
      return rejectWithValue({
        message: 'Failed to update plant pest management. Please try again.',
      })
    }
  }
)

export const deletePlantPestManagement = createAsyncThunk<
  { message: string },
  { speciesId: string; pestId: string; managementId: string },
  { rejectValue: ErrorResponse }
>(
  'plantPestManagement/delete',
  async (
    { speciesId, pestId, managementId },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/project/planting-event/species/${speciesId}/pest/${pestId}/plant-pest-management/${managementId}`,
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

      return { message: 'Plant pest management deleted successfully' }
    } catch (error) {
      return rejectWithValue({
        message: 'Failed to delete plant pest management. Please try again.',
      })
    }
  }
)

export const getPlantPestManagements = createAsyncThunk<
  PlantPestManagementResponse[],
  { speciesId: string; pestId: string },
  { rejectValue: ErrorResponse }
>(
  'plantPestManagement/getAll',
  async ({ speciesId, pestId }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/project/planting-event/species/${speciesId}/pest/${pestId}/plant-pest-managements`,
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
        message: 'Failed to fetch plant pest managements. Please try again.',
      })
    }
  }
)

export const createPlantPestManagement = createAsyncThunk<
  PlantPestManagementResponse,
  {
    speciesId: string
    pestId: string
    managementData: PlantPestManagementData
  },
  { rejectValue: ErrorResponse }
>(
  'plantPestManagement/create',
  async (
    { speciesId, pestId, managementData },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/project/planting-event/species/${speciesId}/pest/${pestId}/plant-pest-managements`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${state?.auth?.access_token}`,
          },
          body: JSON.stringify(managementData),
        }
      )

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json()
        return rejectWithValue(errorData)
      }

      return await response.json()
    } catch (error) {
      return rejectWithValue({
        message: 'Failed to create plant pest management. Please try again.',
      })
    }
  }
)

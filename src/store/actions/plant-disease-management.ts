import { createAsyncThunk } from '@reduxjs/toolkit'
import type {
  PlantDiseaseManagementResponse,
  PlantDiseaseManagementData,
} from '@/types/plant-farming'
import type { ErrorResponse } from '@/types/responses'
import type { RootState } from '@/store/store'

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export const getPlantDiseaseManagementById = createAsyncThunk<
  PlantDiseaseManagementResponse,
  { speciesId: string; diseaseId: string; managementId: string },
  { rejectValue: ErrorResponse }
>(
  'plantDiseaseManagement/getById',
  async (
    { speciesId, diseaseId, managementId },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/project/planting-event/species/${speciesId}/disease/${diseaseId}/plant-disease-management/${managementId}`,
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
        message: 'Failed to fetch plant disease management. Please try again.',
      })
    }
  }
)

export const updatePlantDiseaseManagement = createAsyncThunk<
  PlantDiseaseManagementResponse,
  {
    speciesId: string
    diseaseId: string
    managementId: string
    managementData: PlantDiseaseManagementData
  },
  { rejectValue: ErrorResponse }
>(
  'plantDiseaseManagement/update',
  async (
    { speciesId, diseaseId, managementId, managementData },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/project/planting-event/species/${speciesId}/disease/${diseaseId}/plant-disease-management/${managementId}`,
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
        message: 'Failed to update plant disease management. Please try again.',
      })
    }
  }
)

export const deletePlantDiseaseManagement = createAsyncThunk<
  { message: string },
  { speciesId: string; diseaseId: string; managementId: string },
  { rejectValue: ErrorResponse }
>(
  'plantDiseaseManagement/delete',
  async (
    { speciesId, diseaseId, managementId },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/project/planting-event/species/${speciesId}/disease/${diseaseId}/plant-disease-management/${managementId}`,
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

      return { message: 'Plant disease management deleted successfully' }
    } catch (error) {
      return rejectWithValue({
        message: 'Failed to delete plant disease management. Please try again.',
      })
    }
  }
)

export const getPlantDiseaseManagements = createAsyncThunk<
  PlantDiseaseManagementResponse[],
  { speciesId: string; diseaseId: string },
  { rejectValue: ErrorResponse }
>(
  'plantDiseaseManagement/getAll',
  async ({ speciesId, diseaseId }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/project/planting-event/species/${speciesId}/disease/${diseaseId}/plant-disease-managements`,
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
        message: 'Failed to fetch plant disease managements. Please try again.',
      })
    }
  }
)

export const createPlantDiseaseManagement = createAsyncThunk<
  PlantDiseaseManagementResponse,
  {
    speciesId: string
    diseaseId: string
    managementData: PlantDiseaseManagementData
  },
  { rejectValue: ErrorResponse }
>(
  'plantDiseaseManagement/create',
  async (
    { speciesId, diseaseId, managementData },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/project/planting-event/species/${speciesId}/disease/${diseaseId}/plant-disease-managements`,
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
        message: 'Failed to create plant disease management. Please try again.',
      })
    }
  }
)

import { createAsyncThunk } from '@reduxjs/toolkit'
import type {
  AnimalDiseaseManagementResponse,
  AnimalDiseaseManagementData,
} from '@/types/animal-farming'
import type { ErrorResponse } from '@/types/responses'
import type { RootState } from '@/store/store'

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export const getAnimalDiseaseManagement = createAsyncThunk<
  AnimalDiseaseManagementResponse,
  { animalId: string; diseaseId: string; managementId: string },
  { rejectValue: ErrorResponse }
>(
  'animalDiseaseManagement/get',
  async (
    { animalId, diseaseId, managementId },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/project/animal-group/animal/${animalId}/disease/${diseaseId}/animal-disease-management/${managementId}`,
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
        message: 'Failed to fetch animal disease management. Please try again.',
      })
    }
  }
)

export const updateAnimalDiseaseManagement = createAsyncThunk<
  AnimalDiseaseManagementResponse,
  {
    animalId: string
    diseaseId: string
    managementId: string
    managementData: AnimalDiseaseManagementData
  },
  { rejectValue: ErrorResponse }
>(
  'animalDiseaseManagement/update',
  async (
    { animalId, diseaseId, managementId, managementData },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/project/animal-group/animal/${animalId}/disease/${diseaseId}/animal-disease-management/${managementId}`,
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
        message:
          'Failed to update animal disease management. Please try again.',
      })
    }
  }
)

export const deleteAnimalDiseaseManagement = createAsyncThunk<
  { message: string },
  { animalId: string; diseaseId: string; managementId: string },
  { rejectValue: ErrorResponse }
>(
  'animalDiseaseManagement/delete',
  async (
    { animalId, diseaseId, managementId },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/project/animal-group/animal/${animalId}/disease/${diseaseId}/animal-disease-management/${managementId}`,
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

      return { message: 'Animal disease management deleted successfully' }
    } catch (error) {
      return rejectWithValue({
        message:
          'Failed to delete animal disease management. Please try again.',
      })
    }
  }
)

export const getDiseaseManagements = createAsyncThunk<
  AnimalDiseaseManagementResponse[],
  { animalId: string; diseaseId: string },
  { rejectValue: ErrorResponse }
>(
  'animalDiseaseManagement/getAll',
  async ({ animalId, diseaseId }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/project/animal-group/animal/${animalId}/disease/${diseaseId}/disease-management`,
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
        message: 'Failed to fetch disease managements. Please try again.',
      })
    }
  }
)

export const createDiseaseManagement = createAsyncThunk<
  AnimalDiseaseManagementResponse,
  {
    animalId: string
    diseaseId: string
    managementData: AnimalDiseaseManagementData
  },
  { rejectValue: ErrorResponse }
>(
  'animalDiseaseManagement/create',
  async (
    { animalId, diseaseId, managementData },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/project/animal-group/animal/${animalId}/disease/${diseaseId}/disease-management`,
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
        message: 'Failed to create disease management. Please try again.',
      })
    }
  }
)

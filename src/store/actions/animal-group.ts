import { createAsyncThunk } from '@reduxjs/toolkit'
import type { AnimalGroupResponse, AnimalGroupData } from '@/types/animal-farming'
import type { ErrorResponse } from '@/types/responses'
import type { RootState } from '@/store/store'

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export const getAnimalGroups = createAsyncThunk<
  AnimalGroupResponse[],
  string,
  { rejectValue: ErrorResponse }
>('animalGroup/getAll', async (projectId, { getState, rejectWithValue }) => {
  try {
    const state = getState() as RootState
    const response = await fetch(
      `${BASE_URL}/api/projects/${projectId}/animal-groups/`,
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
      message: 'Failed to fetch animal groups. Please try again.',
    })
  }
})

export const createAnimalGroup = createAsyncThunk<
  AnimalGroupResponse,
  { projectId: string; groupData: AnimalGroupData },
  { rejectValue: ErrorResponse }
>(
  'animalGroup/create',
  async ({ projectId, groupData }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/projects/${projectId}/animal-groups/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${state?.auth?.access_token}`,
          },
          body: JSON.stringify(groupData),
        }
      )

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json()
        return rejectWithValue(errorData)
      }

      return await response.json()
    } catch (error) {
      return rejectWithValue({
        message: 'Failed to create animal group. Please try again.',
      })
    }
  }
)

export const getAnimalGroupById = createAsyncThunk<
  AnimalGroupResponse,
  { projectId: string; groupId: string },
  { rejectValue: ErrorResponse }
>(
  'animalGroup/getById',
  async ({ projectId, groupId }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/projects/${projectId}/animal-groups/${groupId}/`,
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
        message: 'Failed to fetch animal group. Please try again.',
      })
    }
  }
)

export const deleteAnimalGroup = createAsyncThunk<
  { message: string },
  { projectId: string; groupId: string },
  { rejectValue: ErrorResponse }
>(
  'animalGroup/delete',
  async ({ projectId, groupId }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/projects/${projectId}/animal-groups/${groupId}/`,
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

      return { message: 'Animal group deleted successfully' }
    } catch (error) {
      return rejectWithValue({
        message: 'Failed to delete animal group. Please try again.',
      })
    }
  }
)

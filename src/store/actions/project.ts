import { createAsyncThunk } from '@reduxjs/toolkit'
import type {
  ProjectData,
  ProjectResponse,
  ProjectSearchResponse,
} from '@/types/project'
import type { ErrorResponse } from '@/types/responses'
import type { RootState } from '@/store/store'

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export const createProject = createAsyncThunk<
  ProjectResponse,
  ProjectData,
  { rejectValue: ErrorResponse }
>('project/create', async (projectData, { getState, rejectWithValue }) => {
  try {
    const state = getState() as RootState
    const response = await fetch(`${BASE_URL}/api/projects/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state?.auth?.access_token}`,
      },
      body: JSON.stringify(projectData),
    })

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json()
      return rejectWithValue(errorData)
    }

    return await response.json()
  } catch (error) {
    return rejectWithValue({
      message: 'Failed to create project. Please try again.',
    })
  }
})

export const getAllProjects = createAsyncThunk<
  { count: number; next: string; previous: string; results: ProjectResponse[] },
  void,
  { rejectValue: ErrorResponse }
>('project/getAll', async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState() as RootState
    const response = await fetch(`${BASE_URL}/api/projects/`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${state?.auth?.access_token}`,
      },
    })

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json()
      return rejectWithValue(errorData)
    }

    return await response.json()
  } catch (error) {
    return rejectWithValue({
      message: 'Failed to fetch projects. Please try again.',
    })
  }
})

export const getProjectById = createAsyncThunk<
  ProjectResponse,
  string,
  { rejectValue: ErrorResponse }
>('project/getById', async (projectId, { getState, rejectWithValue }) => {
  try {
    const state = getState() as RootState
    const response = await fetch(`${BASE_URL}/api/projects/${projectId}/`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${state?.auth?.access_token}`,
      },
    })

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json()
      return rejectWithValue(errorData)
    }

    return await response.json()
  } catch (error) {
    return rejectWithValue({
      message: 'Failed to fetch project. Please try again.',
    })
  }
})

export const searchProjects = createAsyncThunk<
  ProjectSearchResponse,
  { search: string; page: number },
  { rejectValue: ErrorResponse }
>('project/search', async (query, { getState, rejectWithValue }) => {
  try {
    const state = getState() as RootState
    const response = await fetch(
      `${BASE_URL}/api/projects/search/?search=${encodeURIComponent(
        query.search
      )}&page=${encodeURIComponent(query.page)}`,
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
      message: 'Failed to search projects. Please try again.',
    })
  }
})

export const createSoil = createAsyncThunk<
  any,
  { locationId: string; soilData: any },
  { rejectValue: ErrorResponse }
>(
  'project/createSoil',
  async ({ locationId, soilData }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/projects/${locationId}/soil/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${state?.auth?.access_token}`,
          },
          body: JSON.stringify(soilData),
        }
      )

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json()
        return rejectWithValue(errorData)
      }

      return await response.json()
    } catch (error) {
      return rejectWithValue({
        message: 'Failed to create soil data. Please try again.',
      })
    }
  }
)

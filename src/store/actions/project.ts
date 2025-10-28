import { createAsyncThunk } from '@reduxjs/toolkit'
import type {
  ProjectData,
  ProjectResponse,
  ProjectSearchResponse,
} from '@/types/project'
import type { ErrorResponse } from '@/types/responses'
import type { RootState } from '@/store/store'

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

const getAuthHeader = (
  state: RootState | undefined
): Record<string, string> => {
  if (!state?.auth?.access_token) {
    throw new Error('Authentication token not found')
  }
  return {
    Authorization: `Bearer ${state.auth.access_token}`,
  }
}

export const createProject = createAsyncThunk<
  ProjectResponse,
  ProjectData,
  { rejectValue: ErrorResponse }
>('project/create', async (projectData, { getState, rejectWithValue }) => {
  try {
    const state = getState() as RootState
    const headers = getAuthHeader(state)

    if (!projectData || typeof projectData !== 'object') {
      return rejectWithValue({ message: 'Invalid project data' })
    }

    const response = await fetch(`${BASE_URL}/api/projects/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify({
        ...projectData,
        user: state?.auth?.user?.id,
      }),
    })

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json()
      return rejectWithValue(errorData)
    }

    return await response.json()
  } catch (error) {
    return rejectWithValue({
      message:
        error instanceof Error
          ? error.message
          : 'Failed to create project. Please try again.',
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
    const headers = getAuthHeader(state)

    const response = await fetch(`${BASE_URL}/api/projects/`, {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json()
      return rejectWithValue(errorData)
    }

    return await response.json()
  } catch (error) {
    return rejectWithValue({
      message:
        error instanceof Error
          ? error.message
          : 'Failed to fetch projects. Please try again.',
    })
  }
})

export const getProjectById = createAsyncThunk<
  ProjectResponse,
  string,
  { rejectValue: ErrorResponse }
>('project/getById', async (projectId, { getState, rejectWithValue }) => {
  try {
    if (!projectId || typeof projectId !== 'string') {
      return rejectWithValue({ message: 'Invalid project ID' })
    }

    const state = getState() as RootState
    const headers = getAuthHeader(state)

    const response = await fetch(`${BASE_URL}/api/projects/${projectId}/`, {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json()
      return rejectWithValue(errorData)
    }

    return await response.json()
  } catch (error) {
    return rejectWithValue({
      message:
        error instanceof Error
          ? error.message
          : 'Failed to fetch project. Please try again.',
    })
  }
})

export const updateProject = createAsyncThunk<
  ProjectResponse,
  { projectId: string; data: Partial<ProjectData> },
  { rejectValue: ErrorResponse }
>(
  'project/update',
  async ({ projectId, data }, { getState, rejectWithValue }) => {
    try {
      if (!projectId || typeof projectId !== 'string') {
        return rejectWithValue({ message: 'Invalid project ID' })
      }
      if (!data || typeof data !== 'object') {
        return rejectWithValue({ message: 'Invalid project data' })
      }

      const state = getState() as RootState
      const headers = getAuthHeader(state)

      const response = await fetch(`${BASE_URL}/api/projects/${projectId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json()
        return rejectWithValue(errorData)
      }

      return await response.json()
    } catch (error) {
      return rejectWithValue({
        message:
          error instanceof Error
            ? error.message
            : 'Failed to update project. Please try again.',
      })
    }
  }
)

export const deleteProject = createAsyncThunk<
  { message: string },
  string,
  { rejectValue: ErrorResponse }
>('project/delete', async (projectId, { getState, rejectWithValue }) => {
  try {
    if (!projectId || typeof projectId !== 'string') {
      return rejectWithValue({ message: 'Invalid project ID' })
    }

    const state = getState() as RootState
    const headers = getAuthHeader(state)

    const response = await fetch(`${BASE_URL}/api/projects/${projectId}/`, {
      method: 'DELETE',
      headers,
    })

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json()
      return rejectWithValue(errorData)
    }

    return { message: 'Project deleted successfully' }
  } catch (error) {
    return rejectWithValue({
      message:
        error instanceof Error
          ? error.message
          : 'Failed to delete project. Please try again.',
    })
  }
})

export const searchProjects = createAsyncThunk<
  ProjectSearchResponse,
  { search: string; page: number },
  { rejectValue: ErrorResponse }
>('project/search', async (query, { getState, rejectWithValue }) => {
  try {
    if (!query || typeof query !== 'object') {
      return rejectWithValue({ message: 'Invalid search query' })
    }

    const state = getState() as RootState
    const headers = getAuthHeader(state)

    const response = await fetch(
      `${BASE_URL}/api/projects/search/?search=${encodeURIComponent(
        query.search || ''
      )}&page=${encodeURIComponent(query.page || 1)}`,
      {
        method: 'GET',
        headers,
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
        error instanceof Error
          ? error.message
          : 'Failed to search projects. Please try again.',
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
      if (!locationId || typeof locationId !== 'string') {
        return rejectWithValue({ message: 'Invalid location ID' })
      }
      if (!soilData || typeof soilData !== 'object') {
        return rejectWithValue({ message: 'Invalid soil data' })
      }

      const state = getState() as RootState
      const headers = getAuthHeader(state)

      const response = await fetch(
        `${BASE_URL}/api/projects/${locationId}/soil/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...headers,
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
        message:
          error instanceof Error
            ? error.message
            : 'Failed to create soil data. Please try again.',
      })
    }
  }
)

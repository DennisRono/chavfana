import { createAsyncThunk } from '@reduxjs/toolkit'
import { ProjectCreateResponse, ProjectData } from '@/types/project'
import { ErrorResponse } from '@/types/responses'
import { RootState } from '@/store/store'

export const createProject = createAsyncThunk<
  ProjectCreateResponse,
  ProjectData,
  { rejectValue: ErrorResponse }
>('project/create', async (projectData, { getState, rejectWithValue }) => {
  try {
    const state = getState() as RootState
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/projects`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${state?.auth?.access_token}`,
        },
        body: JSON.stringify(projectData),
      }
    )

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json()
      return rejectWithValue(errorData)
    }

    return await response.json()
  } catch (error) {
    return rejectWithValue({
      message: 'Registration failed. Please try again.',
    })
  }
})

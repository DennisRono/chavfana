import { createAsyncThunk } from '@reduxjs/toolkit'
import { UserResponse } from '@/types/user'
import { ErrorResponse } from '@/types/responses'
import { RootState } from '@/store/store'

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export const getUserDetails = createAsyncThunk<
  UserResponse,
  void,
  { rejectValue: ErrorResponse }
>('user/details', async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState() as RootState
    const response = await fetch(`${BASE_URL}/api/user/`, {
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
      message: 'Failed to get user Details. Please try again.',
    })
  }
})

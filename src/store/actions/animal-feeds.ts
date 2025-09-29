import { createAsyncThunk } from '@reduxjs/toolkit'
import type { AnimalFeedResponse, AnimalFeedData } from '@/types/animal-farming'
import type { ErrorResponse } from '@/types/responses'
import type { RootState } from '@/store/store'

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export const getAnimalFeeds = createAsyncThunk<
  AnimalFeedResponse[],
  string,
  { rejectValue: ErrorResponse }
>('animalFeed/getAll', async (animalId, { getState, rejectWithValue }) => {
  try {
    const state = getState() as RootState
    const response = await fetch(
      `${BASE_URL}/api/project/animal-group/animal/${animalId}/feeds`,
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
      message: 'Failed to fetch animal feeds. Please try again.',
    })
  }
})

export const createAnimalFeed = createAsyncThunk<
  AnimalFeedResponse,
  { animalId: string; feedData: AnimalFeedData },
  { rejectValue: ErrorResponse }
>(
  'animalFeed/create',
  async ({ animalId, feedData }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const response = await fetch(
        `${BASE_URL}/api/project/animal-group/animal/${animalId}/feeds`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${state?.auth?.access_token}`,
          },
          body: JSON.stringify(feedData),
        }
      )

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json()
        return rejectWithValue(errorData)
      }

      return await response.json()
    } catch (error) {
      return rejectWithValue({
        message: 'Failed to create animal feed. Please try again.',
      })
    }
  }
)

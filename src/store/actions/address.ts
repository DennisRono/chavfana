import { createAsyncThunk } from '@reduxjs/toolkit'
import { AddressData, AddressResponse } from '@/types/address'
import { ErrorResponse, PaginatedResponse } from '@/types/responses'
import { RootState } from '@/store/store'

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export const createPrimaryAddress = createAsyncThunk<
  AddressResponse,
  AddressData,
  { rejectValue: ErrorResponse }
>(
  'address/createPrimary',
  async (addressData, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const response = await fetch(`${BASE_URL}/api/user/address/primary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${state?.auth?.access_token}`,
        },
        body: JSON.stringify(addressData),
      })

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json()
        return rejectWithValue(errorData)
      }

      return await response.json()
    } catch (error) {
      return rejectWithValue({
        message: 'Failed to create primary address. Please try again.',
      })
    }
  }
)

export const createSecondaryAddress = createAsyncThunk<
  AddressResponse,
  AddressData,
  { rejectValue: ErrorResponse }
>(
  'address/createSecondary',
  async (addressData, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const response = await fetch(`${BASE_URL}/api/user/address/secondary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${state?.auth?.access_token}`,
        },
        body: JSON.stringify(addressData),
      })

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json()
        return rejectWithValue(errorData)
      }

      return await response.json()
    } catch (error) {
      return rejectWithValue({
        message: 'Failed to create secondary address. Please try again.',
      })
    }
  }
)

export const getAddressById = createAsyncThunk<
  AddressResponse,
  string,
  { rejectValue: ErrorResponse }
>('address/getById', async (id, { getState, rejectWithValue }) => {
  try {
    const state = getState() as RootState
    const response = await fetch(`${BASE_URL}/api/user/address/${id}/`, {
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
      message: 'Failed to fetch address. Please try again.',
    })
  }
})

export const getAllAddresses = createAsyncThunk<
  PaginatedResponse<AddressResponse>,
  void,
  { rejectValue: ErrorResponse }
>('address/getAll', async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState() as RootState
    const response = await fetch(`${BASE_URL}/api/user/address/`, {
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
      message: 'Failed to fetch addresses. Please try again.',
    })
  }
})

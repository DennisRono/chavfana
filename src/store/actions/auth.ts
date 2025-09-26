import { createAsyncThunk } from '@reduxjs/toolkit'
import { LoginCredentials, RegisterData, AuthResponse } from '@/types/auth'
import { ErrorResponse } from '@/types/responses'

export const login = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  { rejectValue: ErrorResponse }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const urlEncodedBody = new URLSearchParams()
    urlEncodedBody.append('grant_type', 'password')
    urlEncodedBody.append('username', credentials.username)
    urlEncodedBody.append('password', credentials.password)

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/auth/login`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: urlEncodedBody.toString(),
        redirect: 'follow',
      }
    )

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json()
      return rejectWithValue(errorData)
    }

    return await response.json()
  } catch (error) {
    console.log(error)
    return rejectWithValue({
      message: 'Login failed. Please try again.',
    })
  }
})

export const register = createAsyncThunk<
  AuthResponse,
  RegisterData,
  { rejectValue: ErrorResponse }
>('auth/register', async (registerData, { rejectWithValue }) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/api/v1/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData),
    })

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

export const logout = createAsyncThunk<
  { message: string },
  { allDevices?: boolean },
  { rejectValue: ErrorResponse }
>('auth/logout', async ({ allDevices = false }, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ allDevices }),
    })

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json()
      return rejectWithValue(errorData)
    }

    return await response.json()
  } catch (error) {
    return rejectWithValue({
      message: 'Logout failed. Please try again.',
    })
  }
})

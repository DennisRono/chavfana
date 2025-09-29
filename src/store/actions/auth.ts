import { createAsyncThunk } from '@reduxjs/toolkit'
import { LoginCredentials, RegisterData, AuthResponse } from '@/types/auth'
import { ErrorResponse } from '@/types/responses'

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export const login = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  { rejectValue: ErrorResponse }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BASE_URL}/api/user/login/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json()
      return rejectWithValue(errorData)
    }

    return await response.json()
  } catch (error) {
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
    const response = await fetch(`${BASE_URL}/api/user/register/`, {
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

export const verifyToken = createAsyncThunk<
  AuthResponse,
  { token: string },
  { rejectValue: ErrorResponse }
>('auth/register', async (tokenData, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BASE_URL}/api/token/verify/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tokenData),
    })

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json()
      return rejectWithValue(errorData)
    }

    return await response.json()
  } catch (error) {
    return rejectWithValue({
      message: 'Failed to verify Token. Please try again.',
    })
  }
})

export const logout = createAsyncThunk<
  { message: string },
  { allDevices?: boolean },
  { rejectValue: ErrorResponse }
>('auth/logout', async ({ allDevices = false }, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BASE_URL}/logout/`, {
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

export const changePassword = createAsyncThunk<
  { message: string },
  { oldPassword: string; newPassword: string },
  { rejectValue: ErrorResponse }
>('auth/changePassword', async (data, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BASE_URL}/password/change/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json()
      return rejectWithValue(errorData)
    }

    return await response.json()
  } catch {
    return rejectWithValue({
      message: 'Password change failed. Please try again.',
    })
  }
})

export const initiatePasswordReset = createAsyncThunk<
  { message: string },
  { email: string },
  { rejectValue: ErrorResponse }
>('auth/initiatePasswordReset', async ({ email }, { rejectWithValue }) => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/user/password/initiate-password-reset/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      }
    )

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json()
      return rejectWithValue(errorData)
    }

    return await response.json()
  } catch {
    return rejectWithValue({
      message: 'Failed to initiate password reset.',
    })
  }
})

export const confirmPasswordReset = createAsyncThunk<
  { message: string },
  { uid: string; token: string; newPassword: string },
  { rejectValue: ErrorResponse }
>('auth/confirmPasswordReset', async (data, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BASE_URL}/password/reset/confirm/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json()
      return rejectWithValue(errorData)
    }

    return await response.json()
  } catch {
    return rejectWithValue({
      message: 'Failed to confirm password reset.',
    })
  }
})

export const createPasswordFromOtp = createAsyncThunk<
  { message: string },
  { otp: string; newPassword: string },
  { rejectValue: ErrorResponse }
>('auth/createPasswordFromOtp', async (data, { rejectWithValue }) => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/user/password/create-password-from-otp/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    )

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json()
      return rejectWithValue(errorData)
    }

    return await response.json()
  } catch {
    return rejectWithValue({
      message: 'Failed to create password from OTP.',
    })
  }
})

export const resendEmail = createAsyncThunk<
  { message: string },
  { email: string },
  { rejectValue: ErrorResponse }
>('auth/resendEmail', async ({ email }, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BASE_URL}/resend-email/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json()
      return rejectWithValue(errorData)
    }

    return await response.json()
  } catch {
    return rejectWithValue({
      message: 'Failed to resend email.',
    })
  }
})

export const verifyPhone = createAsyncThunk<
  { message: string },
  { otp: string },
  { rejectValue: ErrorResponse }
>('auth/verifyPhone', async ({ otp }, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BASE_URL}/api/user/verify-phone/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ otp }),
    })

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json()
      return rejectWithValue(errorData)
    }

    return await response.json()
  } catch {
    return rejectWithValue({
      message: 'Phone verification failed.',
    })
  }
})

export const sendSms = createAsyncThunk<
  { message: string },
  { phone: string },
  { rejectValue: ErrorResponse }
>('auth/sendSms', async ({ phone }, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BASE_URL}/api/user/send-sms/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone }),
    })

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json()
      return rejectWithValue(errorData)
    }

    return await response.json()
  } catch {
    return rejectWithValue({
      message: 'Failed to send SMS.',
    })
  }
})

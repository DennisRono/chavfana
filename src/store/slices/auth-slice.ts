import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AuthState, UserProfile } from '@/types/auth'
import { login, logout, register } from '@/store/actions/auth'

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  access_token: null,
  refresh_token: null,
  isLoading: false,
  error: null,
  isInitialized: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthError: (state) => {
      state.error = null
    },
    updateUserProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },
    setAuthState: (state, action: PayloadAction<Partial<AuthState>>) => {
      return { ...state, ...action.payload }
    },

    reduxLogoutUser: () => ({
      user: null,
      isAuthenticated: false,
      access_token: null,
      refresh_token: null,
      isLoading: false,
      error: null,
      isInitialized: false,
    }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = {
          phone_number: action.payload.phone_number,
          email: action.payload.email,
          id: action.payload.id,
          role: action.payload.role,
        }
        state.access_token = action.payload.access
        state.refresh_token = action.payload.refresh
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload?.message || 'Login failed'
      })

    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload?.message || 'Registration failed'
      })

    builder
      .addCase(logout.pending, (state) => {
        state.isLoading = true
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.user = null
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload?.message || 'Logout failed'
      })
  },
})

export const {
  resetAuthError,
  updateUserProfile,
  setAuthState,
  reduxLogoutUser,
} = authSlice.actions

export default authSlice.reducer

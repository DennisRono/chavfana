import { createSlice } from '@reduxjs/toolkit'
import { getUserDetails } from '@/store/actions/user'
import {
  createPrimaryAddress,
  createSecondaryAddress,
  getAddressById,
  getAllAddresses,
} from '@/store/actions/address'
import { UserState } from '@/types/user'

const initialState: UserState = {
  userDetails: null,
  addresses: [],
  currentAddress: null,
  isLoading: false,
  error: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null
    },
    setCurrentAddress: (state, action) => {
      state.currentAddress = action.payload
    },
    updateUserDetails: (state, action) => {
      if (state.userDetails) {
        state.userDetails = { ...state.userDetails, ...action.payload }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserDetails.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.isLoading = false
        state.userDetails = action.payload
        state.addresses = action.payload.addresses || []
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload?.message || 'Failed to fetch user details'
      })

    builder
      .addCase(getAllAddresses.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getAllAddresses.fulfilled, (state, action) => {
        state.isLoading = false
        state.addresses = action.payload.results || []
      })
      .addCase(getAllAddresses.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload?.message || 'Failed to fetch addresses'
      })

    builder
      .addCase(getAddressById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getAddressById.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentAddress = action.payload
      })
      .addCase(getAddressById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload?.message || 'Failed to fetch address'
      })

    builder
      .addCase(createPrimaryAddress.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createPrimaryAddress.fulfilled, (state, action) => {
        state.isLoading = false
        state.addresses.push(action.payload)
      })
      .addCase(createPrimaryAddress.rejected, (state, action) => {
        state.isLoading = false
        state.error =
          action.payload?.message || 'Failed to create primary address'
      })

    builder
      .addCase(createSecondaryAddress.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createSecondaryAddress.fulfilled, (state, action) => {
        state.isLoading = false
        state.addresses.push(action.payload)
      })
      .addCase(createSecondaryAddress.rejected, (state, action) => {
        state.isLoading = false
        state.error =
          action.payload?.message || 'Failed to create secondary address'
      })
  },
})

export const { clearUserError, setCurrentAddress, updateUserDetails } =
  userSlice.actions

export default userSlice.reducer

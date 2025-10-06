import type { RootState } from '@/store/store'
import { createSelector } from '@reduxjs/toolkit'

export const selectUserDetails = (
  state: RootState
): {
  phone_number: string
  email: string
  id: string
  role: string
  full_name: string
} | null => state.auth.user
export const selectUserAddresses = (state: RootState) => state.user.addresses
export const selectCurrentAddress = (state: RootState) =>
  state.user.currentAddress
export const selectUserLoading = (state: RootState) => state.user.isLoading
export const selectUserError = (state: RootState) => state.user.error

export const selectPrimaryAddress = createSelector(
  [selectUserAddresses],
  (addresses) => addresses.find((a) => a.address_type === 'P')
)

export const selectSecondaryAddresses = createSelector(
  [selectUserAddresses],
  (addresses) => addresses.filter((a) => a.address_type === 'S')
)


import { AuthState } from '@/types/auth'
import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/store/store'

const selectFinanceState = (state: RootState): AuthState => state.auth

export const selectAuth = createSelector(
  [selectFinanceState],
  (authState) => authState
)

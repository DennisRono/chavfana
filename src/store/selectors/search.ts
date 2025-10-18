import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/store/store'
import { SearchType } from '@/store/slices/search-slice'

const selectSearchState = (state: RootState): SearchType => state.search

export const selectSearch = createSelector(
  [selectSearchState],
  (searchState) => searchState
)

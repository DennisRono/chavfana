import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface SearchType {
  search_term: string
}

const initialState: SearchType = {
  search_term: '',
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.search_term = action.payload
    },
    clearSearchTerm: (state) => {
      state.search_term = ''
    },
  },
})

export const { setSearchTerm, clearSearchTerm } = searchSlice.actions

export default searchSlice.reducer

import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { ProjectResponse } from '@/types/project'
import {
  getAllProjects,
  getProjectById,
  searchProjects,
  createProject,
} from '@/store/actions/project'

export interface ProjectState {
  projects: {
    count: number
    next: string | null
    previous: string | null
    results: ProjectResponse[]
    total_active_projects: number
    total_animals: number
    total_land_under_cultivation: number
    last_month_total_animal: number
    last_month_total_planted_area: number
    last_month_created_project: number
    current_month_total_animal: number
    current_month_total_planted_area: number
    current_month_created_project: number
  }
  currentProject: ProjectResponse | null
  isLoading: boolean
  error: string | null
  searchResults: ProjectResponse[]
}

const initialState: ProjectState = {
  projects: {
    count: 0,
    next: null,
    previous: null,
    results: [],
    total_active_projects: 0,
    total_animals: 0,
    total_land_under_cultivation: 0,
    last_month_total_animal: 0,
    last_month_total_planted_area: 0,
    last_month_created_project: 0,
    current_month_total_animal: 0,
    current_month_total_planted_area: 0,
    current_month_created_project: 0,
  },
  currentProject: null,
  isLoading: false,
  error: null,
  searchResults: [],
}

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    clearProjectError: (state) => {
      state.error = null
    },
    setCurrentProject: (
      state,
      action: PayloadAction<ProjectResponse | null>
    ) => {
      state.currentProject = action.payload
    },
    clearSearchResults: (state) => {
      state.searchResults = []
    },
    updateProjectInList: (state, action: PayloadAction<ProjectResponse>) => {
      const index = state.projects.results.findIndex(
        (p) => p.id === action.payload.id
      )
      if (index !== -1) {
        state.projects.results[index] = action.payload
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // --- getAllProjects ---
      .addCase(getAllProjects.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getAllProjects.fulfilled, (state, action) => {
        state.isLoading = false
        state.projects = {
          ...state.projects,
          ...action.payload, // merge totals, count, etc.
          results: action.payload.results || [],
        }
      })
      .addCase(getAllProjects.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload?.message || 'Failed to fetch projects'
      })

      // --- getProjectById ---
      .addCase(getProjectById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getProjectById.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentProject = action.payload
      })
      .addCase(getProjectById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload?.message || 'Failed to fetch project'
      })

      // --- searchProjects ---
      .addCase(searchProjects.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(searchProjects.fulfilled, (state, action) => {
        state.isLoading = false
        state.searchResults = action.payload.results || []
      })
      .addCase(searchProjects.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload?.message || 'Search failed'
      })

      // --- createProject ---
      .addCase(createProject.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isLoading = false
        if (action.payload) {
          state.projects.results.unshift(action.payload)
          state.projects.count += 1
        }
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload?.message || 'Failed to create project'
      })
  },
})

export const {
  clearProjectError,
  setCurrentProject,
  clearSearchResults,
  updateProjectInList,
} = projectSlice.actions

export default projectSlice.reducer

import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { ProjectResponse } from "@/types/project"
import { getAllProjects, getProjectById, searchProjects, createProject } from "@/store/actions/project"

interface ProjectState {
  projects: ProjectResponse[]
  currentProject: ProjectResponse | null
  isLoading: boolean
  error: string | null
  searchResults: ProjectResponse[]
  pagination: {
    count: number
    next: string | null
    previous: string | null
  }
}

const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,
  searchResults: [],
  pagination: {
    count: 0,
    next: null,
    previous: null,
  },
}

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    clearProjectError: (state) => {
      state.error = null
    },
    setCurrentProject: (state, action: PayloadAction<ProjectResponse | null>) => {
      state.currentProject = action.payload
    },
    clearSearchResults: (state) => {
      state.searchResults = []
    },
    updateProjectInList: (state, action: PayloadAction<ProjectResponse>) => {
      const index = state.projects.findIndex((p) => p.id === action.payload.id)
      if (index !== -1) {
        state.projects[index] = action.payload
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllProjects.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getAllProjects.fulfilled, (state, action) => {
        state.isLoading = false
        state.projects = action.payload.results || []
        state.pagination = {
          count: action.payload.count || 0,
          next: action.payload.next || null,
          previous: action.payload.previous || null,
        }
      })
      .addCase(getAllProjects.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload?.message || "Failed to fetch projects"
      })

    builder
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
        state.error = action.payload?.message || "Failed to fetch project"
      })

    builder
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
        state.error = action.payload?.message || "Search failed"
      })

    builder
      .addCase(createProject.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isLoading = false
        if (action.payload) {
          state.projects.unshift(action.payload as ProjectResponse)
        }
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload?.message || "Failed to create project"
      })
  },
})

export const { clearProjectError, setCurrentProject, clearSearchResults, updateProjectInList } = projectSlice.actions

export default projectSlice.reducer

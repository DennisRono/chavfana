import type { RootState } from "@/store/store"
import { createSelector } from "@reduxjs/toolkit"

export const selectProjects = (state: RootState) => state.project.projects
export const selectCurrentProject = (state: RootState) => state.project.currentProject
export const selectProjectLoading = (state: RootState) => state.project.isLoading
export const selectProjectError = (state: RootState) => state.project.error
export const selectSearchResults = (state: RootState) => state.project.searchResults
export const selectProjectPagination = (state: RootState) => state.project.pagination

export const selectActiveProjects = createSelector([selectProjects], (projects) => projects.filter((p) => p.is_active))

export const selectProjectById = (projectId: string) =>
  createSelector([selectProjects], (projects) => projects.find((p) => p.id === projectId))

import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/store/store'
import { ProjectState } from '@/store/slices/project-slice'

const selectProjectsState = (state: RootState): ProjectState => state.projects

export const selectProjects = createSelector(
  [selectProjectsState],
  (projectsState) => projectsState
)

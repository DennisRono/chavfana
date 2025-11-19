'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { AppDispatch } from '@/store/store'
import type { ProjectResponse } from '@/types/project'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { deleteAnimalGroup } from '@/store/actions/animal-group'
import { getProjectById } from '@/store/actions/project'
import { deletePlantingEvent } from '@/store/actions/planting-event'
import { toast } from 'sonner'
import { AnimalDetailsDialog } from './components/animal-details-dialog'
import { AnimalGroupDialog } from './components/animal-group-dialog'
import { PlantingEventDialog } from './components/planting-event-dialog'
import { EditProjectDialog } from './components/edit-project-dialog'
import { ProjectHeader } from './components/project-header'
import { ProjectDetailsCard } from './components/project-details-card'
import { AnimalGroupList } from './components/animal-group-list'
import { PlantingEventList } from './components/planting-event-list'
import { QuickActionsCard } from './components/quick-actions-card'
import { FinanceList } from './components/finance-list'
import LogFeeding from './components/log-feeding'
import UpdateSoilData from './components/update-soil-data-dialog'
import AnimalCard from './components/animal-card'

interface ProjectViewProps {
  projectId: string
}

export default function ProjectView({ projectId }: ProjectViewProps) {
  const dispatch = useAppDispatch<AppDispatch>()
  const [project, setProject] = useState<ProjectResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const [deleteGroupDialog, setDeleteGroupDialog] = useState<string | null>(
    null
  )
  const [deleteEventDialog, setDeleteEventDialog] = useState<string | null>(
    null
  )
  const [animalGroupDialog, setAnimalGroupDialog] = useState<{
    open: boolean
    groupId?: string
  }>({ open: false })
  const [plantingEventDialog, setPlantingEventDialog] = useState<{
    open: boolean
    eventId?: string
  }>({ open: false })
  const [editProjectDialog, setEditProjectDialog] = useState(false)
  const [animalDetailsDialog, setAnimalDetailsDialog] = useState<{
    open: boolean
    groupId?: string
    animalId?: string
  }>({ open: false })
  const [logFeedingDialog, setLogFeedingDialog] = useState(false)
  const [updateSoilDataDialog, setUpdateSoilDataDialog] = useState(false)

  const fetchProject = useCallback(async () => {
    setLoading(true)
    dispatch(getProjectById(projectId))
      .unwrap()
      .then((result) => {
        setProject(result)
      })
      .catch((err: any) => {
        toast.error('Error', {
          description: err?.message || 'Failed to load project',
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }, [dispatch, projectId])

  useEffect(() => {
    fetchProject()
  }, [fetchProject])

  const handleDeleteAnimalGroup = useCallback(
    async (groupId: string) => {
      dispatch(deleteAnimalGroup({ projectId, groupId }))
        .unwrap()
        .then(() => {
          toast.success('Success', {
            description: 'Animal group deleted successfully',
          })
          return fetchProject()
        })
        .catch((err: any) => {
          toast.error('Error', {
            description: err?.message || 'Failed to delete animal group',
          })
        })
    },
    [dispatch, projectId, fetchProject]
  )

  const handleDeletePlantingEvent = useCallback(
    async (eventId: string) => {
      dispatch(deletePlantingEvent({ projectId, eventId }))
        .unwrap()
        .then(() => {
          toast.success('Success', {
            description: 'Planting event deleted successfully',
          })
          return fetchProject()
        })
        .catch((err: any) => {
          toast.error('Error', {
            description: err?.message || 'Failed to delete planting event',
          })
        })
    },
    [dispatch, projectId, fetchProject]
  )

  const isAnimalProject = useMemo(
    () => project?.type === 'AnimalKeepingProject',
    [project?.type]
  )

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="mx-auto container space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>Project not found</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <ProjectHeader
        project={project}
        onEditClick={() => setEditProjectDialog(true)}
      />

      <div className="mx-auto container px-6 py-4">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="finance">Finance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <ProjectDetailsCard project={project} />

              <div className="space-y-6 lg:col-span-2">
                {isAnimalProject &&
                  Array.isArray(project?.animal_group) &&
                  project?.animal_group?.length > 0 && (
                    <AnimalGroupList
                      project={project}
                      onAddGroup={() => setAnimalGroupDialog({ open: true })}
                      onViewDetails={(groupId, animalId) =>
                        setAnimalDetailsDialog({
                          open: true,
                          groupId,
                          animalId,
                        })
                      }
                      onEditGroup={(groupId) =>
                        setAnimalGroupDialog({ open: true, groupId })
                      }
                      onDeleteGroup={(groupId) => setDeleteGroupDialog(groupId)}
                    />
                  )}

                {isAnimalProject && project.animal && (
                  <AnimalCard animal={project.animal} />
                )}

                {!isAnimalProject && (
                  <PlantingEventList
                    project={project}
                    onAddEvent={() => setPlantingEventDialog({ open: true })}
                    onEditEvent={(eventId) =>
                      setPlantingEventDialog({ open: true, eventId })
                    }
                    onDeleteEvent={(eventId) => setDeleteEventDialog(eventId)}
                    onSuccess={fetchProject}
                  />
                )}

                <QuickActionsCard
                  project={project}
                  onUpdateSoilData={() => setUpdateSoilDataDialog(true)}
                  onLogFeeding={() => setLogFeedingDialog(true)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="finance">
            <FinanceList projectId={projectId} />
          </TabsContent>
        </Tabs>
      </div>

      <EditProjectDialog
        open={editProjectDialog}
        onOpenChange={setEditProjectDialog}
        project={project}
        onSuccess={fetchProject}
      />

      <AnimalGroupDialog
        open={animalGroupDialog.open}
        onOpenChange={(open) => setAnimalGroupDialog({ open })}
        projectId={projectId}
        groupId={animalGroupDialog.groupId}
        onSuccess={fetchProject}
      />

      <PlantingEventDialog
        open={plantingEventDialog.open}
        onOpenChange={(open) => setPlantingEventDialog({ open })}
        projectId={projectId}
        eventId={plantingEventDialog.eventId}
        onSuccess={fetchProject}
      />

      <AnimalDetailsDialog
        open={animalDetailsDialog.open}
        onOpenChange={(open) => setAnimalDetailsDialog({ open })}
        projectId={projectId}
        groupId={animalDetailsDialog.groupId}
        animalId={animalDetailsDialog.animalId}
        onSuccess={fetchProject}
      />

      <LogFeeding
        open={logFeedingDialog}
        onOpenChange={setLogFeedingDialog}
        project={project}
        onSuccess={fetchProject}
      />
      <UpdateSoilData
        open={updateSoilDataDialog}
        onOpenChange={setUpdateSoilDataDialog}
        project={project}
        onSuccess={fetchProject}
      />

      <AlertDialog
        open={!!deleteGroupDialog}
        onOpenChange={(open) => !open && setDeleteGroupDialog(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Animal Group</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this animal group? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteGroupDialog)
                  handleDeleteAnimalGroup(deleteGroupDialog)
                setDeleteGroupDialog(null)
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!deleteEventDialog}
        onOpenChange={(open) => !open && setDeleteEventDialog(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Planting Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this planting event? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteEventDialog)
                  handleDeletePlantingEvent(deleteEventDialog)
                setDeleteEventDialog(null)
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

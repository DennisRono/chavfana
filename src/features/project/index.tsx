"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { useAppDispatch } from "@/store/hooks"
import type { ProjectResponse } from "@/types/project"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteAnimalGroup } from "@/store/actions/animal-group"
import { getProjectById } from "@/store/actions/project"
import { deletePlantingEvent } from "@/store/actions/planting-event"
import { toast } from "sonner"
import { AnimalDetailsDialog } from "./components/animal-details-dialog"
import { AnimalGroupDialog } from "./components/animal-group-dialog"
import { PlantingEventDialog } from "./components/planting-event-dialog"
import { EditProjectDialog } from "./components/edit-project-dialog"
import { ProjectHeader } from "./components/project-header"
import { ProjectDetailsCard } from "./components/project-details-card"
import { AnimalGroupList } from "./components/animal-group-list"
import { PlantingEventList } from "./components/planting-event-list"
import { QuickActionsCard } from "./components/quick-actions-card"
import AddHealthRecord from "./components/add-health-record"
import LogFeeding from "./components/log-feeding"
import RecordHarvest from "./components/record-harvest-dialog"
import UpdateSoilData from "./components/update-soil-data-dialog"

interface ProjectViewProps {
  projectId: string
}

export default function ProjectView({ projectId }: ProjectViewProps) {
  const dispatch = useAppDispatch()
  const [project, setProject] = useState<ProjectResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteGroupDialog, setDeleteGroupDialog] = useState<string | null>(null)
  const [deleteEventDialog, setDeleteEventDialog] = useState<string | null>(null)
  const [animalGroupDialog, setAnimalGroupDialog] = useState<{ open: boolean; groupId?: string }>({ open: false })
  const [plantingEventDialog, setPlantingEventDialog] = useState<{ open: boolean; eventId?: string }>({ open: false })
  const [editProjectDialog, setEditProjectDialog] = useState(false)
  const [animalDetailsDialog, setAnimalDetailsDialog] = useState<{
    open: boolean
    groupId?: string
    animalId?: string
  }>({ open: false })
  const [addHealthRecordDialog, setAddHealthRecordDialog] = useState(false)
  const [logFeedingDialog, setLogFeedingDialog] = useState(false)
  const [recordHarvestDialog, setRecordHarvestDialog] = useState(false)
  const [updateSoilDataDialog, setUpdateSoilDataDialog] = useState(false)

  const fetchProject = useCallback(async () => {
    try {
      setLoading(true)
      const result = await dispatch(getProjectById(projectId)).unwrap()
      setProject(result)
    } catch (err: any) {
      toast.error("Error", { description: "Failed to load project" })
    } finally {
      setLoading(false)
    }
  }, [dispatch, projectId])

  useEffect(() => {
    fetchProject()
  }, [fetchProject])

  const handleDeleteAnimalGroup = useCallback(
    async (groupId: string) => {
      try {
        await dispatch(deleteAnimalGroup({ projectId, groupId })).unwrap()
        toast.success("Animal group deleted successfully")
        await fetchProject()
      } catch (err: any) {
        toast.error(err.message || "Failed to delete animal group")
      }
    },
    [dispatch, projectId, fetchProject],
  )

  const handleDeletePlantingEvent = useCallback(
    async (eventId: string) => {
      try {
        await dispatch(deletePlantingEvent({ projectId, eventId })).unwrap()
        toast.success("Planting event deleted successfully")
        await fetchProject()
      } catch (err: any) {
        toast.error(err.message || "Failed to delete planting event")
      }
    },
    [dispatch, projectId, fetchProject],
  )

  const isAnimalProject = useMemo(() => project?.type === "AnimalKeepingProject", [project?.type])

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
      <ProjectHeader project={project} onEditClick={() => setEditProjectDialog(true)} />

      <div className="mx-auto container px-6 py-4">
        <div className="grid gap-6 lg:grid-cols-3">
          <ProjectDetailsCard project={project} />

          <div className="space-y-6 lg:col-span-2">
            {isAnimalProject && (
              <AnimalGroupList
                project={project}
                onAddGroup={() => setAnimalGroupDialog({ open: true })}
                onViewDetails={(groupId, animalId) => setAnimalDetailsDialog({ open: true, groupId, animalId })}
                onEditGroup={(groupId) => setAnimalGroupDialog({ open: true, groupId })}
                onDeleteGroup={(groupId) => setDeleteGroupDialog(groupId)}
              />
            )}

            {!isAnimalProject && (
              <PlantingEventList
                project={project}
                onAddEvent={() => setPlantingEventDialog({ open: true })}
                onEditEvent={(eventId) => setPlantingEventDialog({ open: true, eventId })}
                onDeleteEvent={(eventId) => setDeleteEventDialog(eventId)}
              />
            )}

            <QuickActionsCard
              project={project}
              onRecordHarvest={() => setRecordHarvestDialog(true)}
              onUpdateSoilData={() => setUpdateSoilDataDialog(true)}
              onAddHealthRecord={() => setAddHealthRecordDialog(true)}
              onLogFeeding={() => setLogFeedingDialog(true)}
            />
          </div>
        </div>
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

      <AddHealthRecord
        open={addHealthRecordDialog}
        onOpenChange={setAddHealthRecordDialog}
        project={project}
        onSuccess={fetchProject}
      />
      <LogFeeding
        open={logFeedingDialog}
        onOpenChange={setLogFeedingDialog}
        project={project}
        onSuccess={fetchProject}
      />
      <RecordHarvest
        open={recordHarvestDialog}
        onOpenChange={setRecordHarvestDialog}
        project={project}
        onSuccess={fetchProject}
      />
      <UpdateSoilData
        open={updateSoilDataDialog}
        onOpenChange={setUpdateSoilDataDialog}
        project={project}
        onSuccess={fetchProject}
      />

      <AlertDialog open={!!deleteGroupDialog} onOpenChange={(open) => !open && setDeleteGroupDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Animal Group</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this animal group? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteGroupDialog) handleDeleteAnimalGroup(deleteGroupDialog)
                setDeleteGroupDialog(null)
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteEventDialog} onOpenChange={(open) => !open && setDeleteEventDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Planting Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this planting event? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteEventDialog) handleDeletePlantingEvent(deleteEventDialog)
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

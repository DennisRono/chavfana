'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch } from '@/store/hooks'
import type { ProjectResponse } from '@/types/project'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import {
  MapPin,
  Calendar,
  Sprout,
  Beef,
  Plus,
  MoreVertical,
  Trash2,
  Edit,
  Eye,
} from 'lucide-react'
import { AnimalGroupDialog } from './components/animal-group-dialog'
import { PlantingEventDialog } from './components/planting-event-dialog'
import { EditProjectDialog } from './components/edit-project-dialog'
import { deleteAnimalGroup } from '@/store/actions/animal-group'
import { getProjectById } from '@/store/actions/project'
import { deletePlantingEvent } from '@/store/actions/planting-event'
import { toast } from 'sonner'

interface ProjectViewProps {
  projectId: string
}

export default function ProjectView({ projectId }: ProjectViewProps) {
  const dispatch = useAppDispatch()
  const [project1, setProject] = useState<ProjectResponse | null>(null)
  const [loading, setLoading] = useState(true)
  //   const [error, setError] = useState<string | null>(null)
  const error = null
  const project: ProjectResponse = {
    id: '1b2c3d4e-5678-90ab-cdef-1234567890ab',
    name: 'Dairy Expansion Project',
    created_date: '2025-09-30',
    user: '9f8e7d6c-5432-10ab-cdef-9876543210ff',
    soil: {
      type: 'Loamy',
      nitrogen: 12,
      phosphorous: 8,
      potassium: 15,
      soil_ph: 6.5,
    },
    location: {
      city: 'Kampala',
      country: 'UG',
      coordinate: '0.3476, 32.5825',
    },
    status: 'Active',
    animal_group: [
      {
        type: 'Group',
        id: 'group-001',
        group_name: 'Dairy Cattle Group A',
        project: '1b2c3d4e-5678-90ab-cdef-1234567890ab',
        housing: 'BARN',
        animals: {
          id: 'animal-group-001',
          breed: 'Friesian',
          name: 'Cattle Herd',
          gender: 'FEMALE',
          notes: 'High milk yield group',
          type: 'CATTLE',
          created_at: '2025-09-30T15:11:43.199Z',
          group: 'group-001',
          health_status: [
            {
              id: 'hs-001',
              status: 'HEALTHY',
              created_at: '2025-09-30T15:11:43.199Z',
              updated_at: '2025-09-30T15:11:43.199Z',
              animal: 'animal-group-001',
            },
          ],
          starting_number: 45,
          average_weight: 550,
          average_age: 4,
          processed: [
            {
              id: 'proc-001',
              date: '2025-09-25',
              type: 'DEATH',
              number_of_animal: 1,
              animal: 'animal-group-001',
            },
          ],
          harvests: [
            {
              id: 'harv-001',
              product: 'Milk',
              amount: 300,
              unit: 'LITER',
              harvest_notes: 'Morning milking',
              date: '2025-09-29',
              animal: 'animal-group-001',
            },
          ],
        },
        group_created_date: '2025-09-01',
      },
      {
        type: 'Individual',
        id: 'ind-001',
        group_name: 'Tagged Poultry',
        project: '1b2c3d4e-5678-90ab-cdef-1234567890ab',
        housing: 'COOP',
        animals: {
          id: 'chicken-001',
          breed: 'Rhode Island Red',
          name: 'Hen 101',
          gender: 'FEMALE',
          notes: 'Good egg layer',
          type: 'CHICKEN',
          created_at: '2025-09-15T09:00:00.000Z',
          group: 'ind-001',
          health_status: [
            {
              id: 'hs-002',
              status: 'HEALTHY',
              created_at: '2025-09-15T09:00:00.000Z',
              updated_at: '2025-09-30T09:00:00.000Z',
              animal: 'chicken-001',
            },
          ],
          arrival_date: '2025-09-10',
          birthday: '2025-05-01',
          age: 0,
          weight: 2,
          tag: 'CH-101',
          harvests: [
            {
              id: 'harv-002',
              product: 'Egg',
              amount: 1,
              unit: 'UNIT',
              harvest_notes: 'Daily egg collection',
              date: '2025-09-29',
              animal: 'chicken-001',
            },
          ],
        },
        group_created_date: '2025-09-10',
      },
    ],
    is_active: true,
    created_at: '2025-09-30T15:11:43.199Z',
  }

  const [deleteProjectDialog, setDeleteProjectDialog] = useState(false)
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

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true)
        const result = await dispatch(getProjectById(projectId)).unwrap()
        setProject(result)
      } catch (err: any) {
        // setError(err.message || 'Failed to load project')
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [dispatch, projectId])

  const handleDeleteProject = async () => {
    try {
      //   await dispatch(deleteProject(projectId)).unwrap()
      toast('Success', { description: 'Project deleted successfully' })
      window.location.href = '/projects'
    } catch (err: any) {
      toast.error('Error', {
        description: err.message || 'Failed to delete project',
      })
    }
  }

  const handleDeleteAnimalGroup = async (groupId: string) => {
    try {
      await dispatch(deleteAnimalGroup({ projectId, groupId })).unwrap()
      toast('Success', { description: 'Animal group deleted successfully' })
      const result = await dispatch(getProjectById(projectId)).unwrap()
      setProject(result)
    } catch (err: any) {
      toast.error('Error', {
        description: err.message || 'Failed to delete animal group',
      })
    }
  }

  const handleDeletePlantingEvent = async (eventId: string) => {
    try {
      await dispatch(deletePlantingEvent({ projectId, eventId })).unwrap()
      toast('Success', { description: 'Planting event deleted successfully' })
      const result = await dispatch(getProjectById(projectId)).unwrap()
      setProject(result)
    } catch (err: any) {
      toast.error('Error', {
        description: err.message || 'Failed to delete planting event',
      })
    }
  }

  const handleRefreshProject = async () => {
    try {
      const result = await dispatch(getProjectById(projectId)).unwrap()
      setProject(result)
    } catch (err: any) {
      toast.error('Error', { description: 'Failed to refresh project data' })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
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

  if (error || !project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>{error || 'Project not found'}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const isAnimalProject =
    project.animal_group && project.animal_group.length > 0
  const projectType = isAnimalProject ? 'Animal Farming' : 'Plant Farming'

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card">
        <div className="mx-auto container px-6 py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  {project.name}
                </h1>
                <Badge
                  variant={
                    project.status === 'Active' ? 'default' : 'secondary'
                  }
                  className="text-xs"
                >
                  {project.status}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {project.location.city}, {project.location.country}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Created{' '}
                    {new Date(project.created_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {isAnimalProject ? (
                    <Beef className="h-4 w-4" />
                  ) : (
                    <Sprout className="h-4 w-4" />
                  )}
                  <span>{projectType}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditProjectDialog(true)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Project
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setDeleteProjectDialog(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto container px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Status
                </p>
                <p className="mt-1 text-sm text-foreground">{project.status}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Location
                </p>
                <p className="mt-1 text-sm text-foreground">
                  {project.location.city}
                </p>
                <p className="text-sm text-muted-foreground">
                  {project.location.country}
                </p>
                {project.location.coordinate && (
                  <p className="mt-1 font-mono text-xs text-muted-foreground">
                    {project.location.coordinate}
                  </p>
                )}
              </div>
              {project.soil && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Soil Information
                    </p>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Type</span>
                        <span className="text-foreground">
                          {project.soil.type}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">pH</span>
                        <span className="text-foreground">
                          {project.soil.soil_ph}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Nitrogen</span>
                        <span className="text-foreground">
                          {project.soil.nitrogen}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Phosphorous
                        </span>
                        <span className="text-foreground">
                          {project.soil.phosphorous}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Potassium</span>
                        <span className="text-foreground">
                          {project.soil.potassium}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6 lg:col-span-2">
            {isAnimalProject && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Animal Groups</CardTitle>
                      <CardDescription className="mt-1">
                        Manage your animal groups and livestock
                      </CardDescription>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setAnimalGroupDialog({ open: true })}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Group
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {project.animal_group.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Beef className="mb-4 h-12 w-12 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        No animal groups yet
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4 bg-transparent"
                        onClick={() => setAnimalGroupDialog({ open: true })}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create First Group
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {project.animal_group.map((group) => (
                        <Card
                          key={group.id}
                          className="border-border bg-primary/20"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-foreground">
                                    {group.group_name}
                                  </h4>
                                  <Badge variant="outline" className="text-xs">
                                    {group.type}
                                  </Badge>
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {group.housing}
                                  </Badge>
                                </div>
                                <div className="grid gap-2 text-sm sm:grid-cols-2">
                                  {group.type === 'Group' &&
                                    group.animals &&
                                    'starting_number' in group.animals && (
                                      <>
                                        <div>
                                          <span className="text-muted-foreground">
                                            Count:{' '}
                                          </span>
                                          <span className="text-foreground">
                                            {group.animals.starting_number}
                                          </span>
                                        </div>
                                        <div>
                                          <span className="text-muted-foreground">
                                            Avg Weight:{' '}
                                          </span>
                                          <span className="text-foreground">
                                            {group.animals.average_weight} kg
                                          </span>
                                        </div>
                                        <div>
                                          <span className="text-muted-foreground">
                                            Avg Age:{' '}
                                          </span>
                                          <span className="text-foreground">
                                            {group.animals.average_age} days
                                          </span>
                                        </div>
                                        <div>
                                          <span className="text-muted-foreground">
                                            Health:{' '}
                                          </span>
                                          <span className="text-success">
                                            {group.animals.health_status[0]
                                              ?.status || 'Unknown'}
                                          </span>
                                        </div>
                                      </>
                                    )}
                                  {group.type === 'Individual' &&
                                    group.animals &&
                                    'tag' in group.animals && (
                                      <>
                                        <div>
                                          <span className="text-muted-foreground">
                                            Tag:{' '}
                                          </span>
                                          <span className="text-foreground">
                                            {group.animals.tag}
                                          </span>
                                        </div>
                                        <div>
                                          <span className="text-muted-foreground">
                                            Weight:{' '}
                                          </span>
                                          <span className="text-foreground">
                                            {group.animals.weight} kg
                                          </span>
                                        </div>
                                        <div>
                                          <span className="text-muted-foreground">
                                            Age:{' '}
                                          </span>
                                          <span className="text-foreground">
                                            {group.animals.age} days
                                          </span>
                                        </div>
                                        <div>
                                          <span className="text-muted-foreground">
                                            Health:{' '}
                                          </span>
                                          <span className="text-success">
                                            {group.animals.health_status[0]
                                              ?.status || 'Unknown'}
                                          </span>
                                        </div>
                                      </>
                                    )}
                                </div>
                                {group.animals &&
                                  'harvests' in group.animals &&
                                  group.animals.harvests &&
                                  group.animals.harvests.length > 0 && (
                                    <div className="mt-2 pt-2 border-t border-border">
                                      <p className="text-xs text-muted-foreground mb-1">
                                        Recent Harvests
                                      </p>
                                      <div className="flex flex-wrap gap-2">
                                        {group.animals.harvests
                                          .slice(0, 3)
                                          .map((harvest) => (
                                            <Badge
                                              key={harvest.id}
                                              variant="outline"
                                              className="text-xs"
                                            >
                                              {harvest.product}:{' '}
                                              {harvest.amount} {harvest.unit}
                                            </Badge>
                                          ))}
                                      </div>
                                    </div>
                                  )}
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() =>
                                      (window.location.href = `/projects/${projectId}/animal-groups/${group.id}`)
                                    }
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      setAnimalGroupDialog({
                                        open: true,
                                        groupId: group.id,
                                      })
                                    }
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Group
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() =>
                                      setDeleteGroupDialog(group.id)
                                    }
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Group
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {!isAnimalProject && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Planting Events</CardTitle>
                      <CardDescription className="mt-1">
                        Track your crops and planting schedule
                      </CardDescription>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setPlantingEventDialog({ open: true })}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Event
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Sprout className="mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      No planting events yet
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 bg-transparent"
                      onClick={() => setPlantingEventDialog({ open: true })}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create First Event
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks for this project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Button
                    variant="outline"
                    className="justify-start bg-transparent"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Record Harvest
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start bg-transparent"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Health Record
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start bg-transparent"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Log Feeding
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start bg-transparent"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Update Soil Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <EditProjectDialog
        open={editProjectDialog}
        onOpenChange={setEditProjectDialog}
        project={project}
        onSuccess={handleRefreshProject}
      />

      <AnimalGroupDialog
        open={animalGroupDialog.open}
        onOpenChange={(open) => setAnimalGroupDialog({ open })}
        projectId={projectId}
        groupId={animalGroupDialog.groupId}
        onSuccess={handleRefreshProject}
      />

      <PlantingEventDialog
        open={plantingEventDialog.open}
        onOpenChange={(open) => setPlantingEventDialog({ open })}
        projectId={projectId}
        eventId={plantingEventDialog.eventId}
        onSuccess={handleRefreshProject}
      />

      <AlertDialog
        open={deleteProjectDialog}
        onOpenChange={setDeleteProjectDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this project? This action cannot
              be undone and will remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProject}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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

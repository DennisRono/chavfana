"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAppDispatch } from "@/store/hooks"
import { getAnimalGroupById } from "@/store/actions/animal-group"
import { getAnimalDiseases, deleteAnimalDisease } from "@/store/actions/animal-disease"
import { getAnimalProcesses, deleteAnimalProcess } from "@/store/actions/animal-process"
import { toast } from "sonner"
import { Calendar, Weight, Tag, Heart, Package, Plus, Trash2 } from "lucide-react"
import type { AnimalType } from "@/types/project"
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
import { AddDiseaseDialog } from "./add-disease-dialog"
import { AddProcessDialog } from "./add-process-dialog"

interface AnimalDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  groupId?: string
  animalId?: string
  onSuccess: () => void
}

export function AnimalDetailsDialog({
  open,
  onOpenChange,
  projectId,
  groupId,
  animalId,
  onSuccess,
}: AnimalDetailsDialogProps) {
  const dispatch = useAppDispatch()
  const [animal, setAnimal] = useState<AnimalType | null>(null)
  const [diseases, setDiseases] = useState<any[]>([])
  const [processes, setProcesses] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState<{
    type: "disease" | "process"
    id: string
  } | null>(null)
  const [addDiseaseOpen, setAddDiseaseOpen] = useState(false)
  const [addProcessOpen, setAddProcessOpen] = useState(false)

  const fetchAnimalData = useCallback(async () => {
    if (!groupId || !animalId) return

    setLoading(true)
    try {
      const group = await dispatch(getAnimalGroupById({ projectId, groupId })).unwrap()
      setAnimal(group.animals)

      // Fetch diseases and processes in parallel
      const [diseasesData, processesData] = await Promise.all([
        dispatch(getAnimalDiseases(animalId))
          .unwrap()
          .catch(() => []),
        dispatch(getAnimalProcesses(animalId))
          .unwrap()
          .catch(() => []),
      ])

      setDiseases(diseasesData || [])
      setProcesses(processesData || [])
    } catch (err: any) {
      toast.error("Error", { description: "Failed to load animal data" })
    } finally {
      setLoading(false)
    }
  }, [dispatch, projectId, groupId, animalId])

  useEffect(() => {
    if (open && groupId && animalId) {
      fetchAnimalData()
    }
  }, [open, groupId, animalId, fetchAnimalData])

  const getHealthStatus = useCallback((healthStatus: any): string => {
    if (typeof healthStatus === "string") return healthStatus
    if (Array.isArray(healthStatus) && healthStatus.length > 0) {
      return healthStatus[0].status
    }
    return "Unknown"
  }, [])

  const handleDeleteDisease = async (diseaseId: string) => {
    try {
      if (!animalId) return
      await dispatch(deleteAnimalDisease({ animalId, diseaseId })).unwrap()
      toast.success("Disease record deleted")
      setDiseases(diseases.filter((d) => d.id !== diseaseId))
      setDeleteDialog(null)
    } catch (err: any) {
      toast.error("Failed to delete disease record")
    }
  }

  const handleDeleteProcess = async (processId: string) => {
    try {
      if (!animalId) return
      await dispatch(deleteAnimalProcess({ animalId, processId })).unwrap()
      toast.success("Process record deleted")
      setProcesses(processes.filter((p) => p.id !== processId))
      setDeleteDialog(null)
    } catch (err: any) {
      toast.error("Failed to delete process record")
    }
  }

  const handleAddDiseaseSuccess = () => {
    setAddDiseaseOpen(false)
    fetchAnimalData()
  }

  const handleAddProcessSuccess = () => {
    setAddProcessOpen(false)
    fetchAnimalData()
  }

  const healthStatus = useMemo(
    () => (animal ? getHealthStatus(animal.health_status) : "Unknown"),
    [animal, getHealthStatus],
  )

  if (!animal) return null

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {animal.name || "Animal Details"}
              <Badge variant={healthStatus === "HEALTHY" ? "default" : "destructive"}>{healthStatus}</Badge>
            </DialogTitle>
            <DialogDescription>Complete information about this animal</DialogDescription>
          </DialogHeader>

          {loading ? (
            <div className="py-8 text-center text-muted-foreground">Loading...</div>
          ) : (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2">
                  {animal.name && (
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="text-sm font-medium">{animal.name}</p>
                    </div>
                  )}
                  {animal.breed && (
                    <div>
                      <p className="text-sm text-muted-foreground">Breed</p>
                      <p className="text-sm font-medium">{animal.breed}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="text-sm font-medium">{animal.type}</p>
                  </div>
                  {animal.gender && (
                    <div>
                      <p className="text-sm text-muted-foreground">Gender</p>
                      <p className="text-sm font-medium">{animal.gender}</p>
                    </div>
                  )}
                  {animal.tag && (
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Tag</p>
                        <p className="text-sm font-medium">{animal.tag}</p>
                      </div>
                    </div>
                  )}
                  {animal.weight !== undefined && (
                    <div className="flex items-center gap-2">
                      <Weight className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Weight</p>
                        <p className="text-sm font-medium">{animal.weight} kg</p>
                      </div>
                    </div>
                  )}
                  {animal.age !== undefined && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Age</p>
                        <p className="text-sm font-medium">{animal.age} days</p>
                      </div>
                    </div>
                  )}
                  {animal.arrival_date && (
                    <div>
                      <p className="text-sm text-muted-foreground">Arrival Date</p>
                      <p className="text-sm font-medium">{new Date(animal.arrival_date).toLocaleDateString()}</p>
                    </div>
                  )}
                  {animal.birthday && (
                    <div>
                      <p className="text-sm text-muted-foreground">Birthday</p>
                      <p className="text-sm font-medium">{new Date(animal.birthday).toLocaleDateString()}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {animal.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground">{animal.notes}</p>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      Disease Records
                    </CardTitle>
                    <Button size="sm" onClick={() => setAddDiseaseOpen(true)}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Disease
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {diseases.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No disease records yet</p>
                  ) : (
                    <div className="space-y-2">
                      {diseases.map((disease) => (
                        <div key={disease.id} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                          <div>
                            <p className="text-sm font-medium">{disease.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(disease.date).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              setDeleteDialog({
                                type: "disease",
                                id: disease.id,
                              })
                            }
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Process Records
                    </CardTitle>
                    <Button size="sm" onClick={() => setAddProcessOpen(true)}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Process
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {processes.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No process records yet</p>
                  ) : (
                    <div className="space-y-2">
                      {processes.map((process) => (
                        <div key={process.id} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                          <div>
                            <p className="text-sm font-medium">{process.type}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(process.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{process.number_of_animal} animals</Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                setDeleteDialog({
                                  type: "process",
                                  id: process.id,
                                })
                              }
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {animal.harvests && animal.harvests.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Harvest Records
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {animal.harvests.map((harvest) => (
                        <div key={harvest.id} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                          <div>
                            <p className="text-sm font-medium">{harvest.product}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(harvest.date).toLocaleDateString()}
                            </p>
                            {harvest.harvest_notes && (
                              <p className="text-xs text-muted-foreground mt-1">{harvest.harvest_notes}</p>
                            )}
                          </div>
                          <Badge variant="secondary">
                            {harvest.amount} {harvest.unit}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {animalId && (
        <>
          <AddDiseaseDialog
            open={addDiseaseOpen}
            onOpenChange={setAddDiseaseOpen}
            animalId={animalId}
            onSuccess={handleAddDiseaseSuccess}
          />
          <AddProcessDialog
            open={addProcessOpen}
            onOpenChange={setAddProcessOpen}
            animalId={animalId}
            onSuccess={handleAddProcessSuccess}
          />
        </>
      )}

      <AlertDialog open={!!deleteDialog} onOpenChange={(open) => !open && setDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this {deleteDialog?.type === "disease" ? "disease" : "process"} record?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteDialog?.type === "disease") {
                  handleDeleteDisease(deleteDialog.id)
                } else {
                  handleDeleteProcess(deleteDialog.id)
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

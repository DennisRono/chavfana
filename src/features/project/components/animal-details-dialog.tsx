'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppDispatch } from '@/store/hooks'
import { getAnimalGroupById } from '@/store/actions/animal-group'
import { toast } from 'sonner'
import { Calendar, Weight, Tag, Heart, Package } from 'lucide-react'
import { AnimalType } from '@/types/project'

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
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (groupId && animalId && open) {
      const fetchAnimal = async () => {
        setLoading(true)
        try {
          const group = await dispatch(
            getAnimalGroupById({ projectId, groupId })
          ).unwrap()
          setAnimal(group.animals)
        } catch (err: any) {
          toast.error('Error', { description: 'Failed to load animal data' })
        } finally {
          setLoading(false)
        }
      }
      fetchAnimal()
    }
  }, [groupId, animalId, open, dispatch, projectId])

  const getHealthStatus = (healthStatus: any): string => {
    if (typeof healthStatus === 'string') return healthStatus
    if (Array.isArray(healthStatus) && healthStatus.length > 0) {
      return healthStatus[0].status
    }
    return 'Unknown'
  }

  if (!animal) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] !min-w-[60vw] overflow-y-auto no-scrollbar">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {animal.name || 'Animal Details'}
            <Badge
              variant={
                getHealthStatus(animal.health_status) === 'HEALTHY'
                  ? 'default'
                  : 'destructive'
              }
            >
              {getHealthStatus(animal.health_status)}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Complete information about this animal
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center text-muted-foreground">
            Loading...
          </div>
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
                    <p className="text-sm text-muted-foreground">
                      Arrival Date
                    </p>
                    <p className="text-sm font-medium">
                      {new Date(animal.arrival_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {animal.birthday && (
                  <div>
                    <p className="text-sm text-muted-foreground">Birthday</p>
                    <p className="text-sm font-medium">
                      {new Date(animal.birthday).toLocaleDateString()}
                    </p>
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
                      <div
                        key={harvest.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded"
                      >
                        <div>
                          <p className="text-sm font-medium">
                            {harvest.product}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(harvest.date).toLocaleDateString()}
                          </p>
                          {harvest.harvest_notes && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {harvest.harvest_notes}
                            </p>
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

            {Array.isArray(animal.health_status) &&
              animal.health_status.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      Health History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {animal.health_status.map((status) => (
                        <div
                          key={status.id}
                          className="flex items-center justify-between p-2 bg-muted/50 rounded"
                        >
                          <div>
                            <p className="text-sm font-medium">
                              {status.status}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(status.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge
                            variant={
                              status.status === 'HEALTHY'
                                ? 'default'
                                : 'destructive'
                            }
                          >
                            {status.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

            {animal.processed && animal.processed.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Processing Records
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {animal.processed.map((record) => (
                      <div
                        key={record.id}
                        className="flex items-center justify-between p-2 bg-muted/50 rounded"
                      >
                        <div>
                          <p className="text-sm font-medium">{record.type}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(record.date).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {record.number_of_animal} animals
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
  )
}

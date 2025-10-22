"use client"

import { useMemo, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, MoreVertical, Eye, Edit, Trash2, Beef } from "lucide-react"
import type { ProjectResponse } from "@/types/project"

interface AnimalGroupListProps {
  project: ProjectResponse
  onAddGroup: () => void
  onViewDetails: (groupId: string, animalId: string) => void
  onEditGroup: (groupId: string) => void
  onDeleteGroup: (groupId: string) => void
}

export function AnimalGroupList({
  project,
  onAddGroup,
  onViewDetails,
  onEditGroup,
  onDeleteGroup,
}: AnimalGroupListProps) {
  const animalGroups = useMemo(() => project.animal_group || [], [project.animal_group])

  const getHealthStatus = useCallback((healthStatus: any): string => {
    if (typeof healthStatus === "string") return healthStatus
    if (Array.isArray(healthStatus) && healthStatus.length > 0) {
      return healthStatus[0].status
    }
    return "Unknown"
  }, [])

  if (animalGroups.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Animal Groups</CardTitle>
              <CardDescription className="mt-1">Manage your animal groups and livestock</CardDescription>
            </div>
            <Button size="sm" onClick={onAddGroup}>
              <Plus className="mr-2 h-4 w-4" />
              Add Group
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Beef className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No animal groups yet</p>
            <Button variant="outline" size="sm" className="mt-4 bg-transparent" onClick={onAddGroup}>
              <Plus className="mr-2 h-4 w-4" />
              Create First Group
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Animal Groups</CardTitle>
            <CardDescription className="mt-1">Manage your animal groups and livestock</CardDescription>
          </div>
          <Button size="sm" onClick={onAddGroup}>
            <Plus className="mr-2 h-4 w-4" />
            Add Group
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {animalGroups.map((group) => {
            const animal = group.animals
            return (
              <Card key={group.id} className="border-border bg-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-foreground">{group.group_name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {group.type}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {group.housing}
                        </Badge>
                      </div>
                      <div className="grid gap-2 text-sm sm:grid-cols-2">
                        {group.type === "Group" && animal.starting_number !== undefined && (
                          <>
                            <div>
                              <span className="text-muted-foreground">Count: </span>
                              <span className="text-foreground">{animal.starting_number}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Avg Weight: </span>
                              <span className="text-foreground">{animal.average_weight} kg</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Avg Age: </span>
                              <span className="text-foreground">{animal.average_age} days</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Health: </span>
                              <span className="text-success">{getHealthStatus(animal.health_status)}</span>
                            </div>
                          </>
                        )}
                        {group.type === "Individual" && animal.tag !== undefined && (
                          <>
                            <div>
                              <span className="text-muted-foreground">Name: </span>
                              <span className="text-foreground">{animal.name || "N/A"}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Breed: </span>
                              <span className="text-foreground">{animal.breed || "N/A"}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Tag: </span>
                              <span className="text-foreground">{animal.tag}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Gender: </span>
                              <span className="text-foreground">{animal.gender || "N/A"}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Weight: </span>
                              <span className="text-foreground">{animal.weight} kg</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Age: </span>
                              <span className="text-foreground">{animal.age} days</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Health: </span>
                              <span className="text-success">{getHealthStatus(animal.health_status)}</span>
                            </div>
                          </>
                        )}
                      </div>
                      {animal.harvests && animal.harvests.length > 0 && (
                        <div className="mt-2 border-t border-border pt-2">
                          <p className="mb-1 text-xs text-muted-foreground">Recent Harvests</p>
                          <div className="flex flex-wrap gap-2">
                            {animal.harvests.slice(0, 3).map((harvest) => (
                              <Badge key={harvest.id} variant="outline" className="text-xs">
                                {harvest.product}: {harvest.amount} {harvest.unit}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewDetails(group.id, animal.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEditGroup(group.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Group
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => onDeleteGroup(group.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Group
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

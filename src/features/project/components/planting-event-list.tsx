"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, MoreVertical, Edit, Trash2, Sprout } from "lucide-react"
import type { ProjectResponse } from "@/types/project"

interface PlantingEventListProps {
  project: ProjectResponse
  onAddEvent: () => void
  onEditEvent: (eventId: string) => void
  onDeleteEvent: (eventId: string) => void
}

export function PlantingEventList({ project, onAddEvent, onEditEvent, onDeleteEvent }: PlantingEventListProps) {
  const plantingEvents = useMemo(() => project.planting_events || [], [project.planting_events])

  if (plantingEvents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Planting Events</CardTitle>
              <CardDescription className="mt-1">Track your crops and planting schedule</CardDescription>
            </div>
            <Button size="sm" onClick={onAddEvent}>
              <Plus className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Sprout className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No planting events yet</p>
            <Button variant="outline" size="sm" className="mt-4 bg-transparent" onClick={onAddEvent}>
              <Plus className="mr-2 h-4 w-4" />
              Create First Event
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
            <CardTitle>Planting Events</CardTitle>
            <CardDescription className="mt-1">Track your crops and planting schedule</CardDescription>
          </div>
          <Button size="sm" onClick={onAddEvent}>
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {plantingEvents.map((event) => (
            <Card key={event.id} className="border-border bg-primary/20">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground">{event.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {event.stage}
                      </Badge>
                    </div>
                    <div className="grid gap-2 text-sm sm:grid-cols-2">
                      <div>
                        <span className="text-muted-foreground">Planting Date: </span>
                        <span className="text-foreground">{new Date(event.planting_date).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">End Date: </span>
                        <span className="text-foreground">{new Date(event.end_date).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Area: </span>
                        <span className="text-foreground">
                          {event.area_size} {event.area_size_unit.toLowerCase()}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Type: </span>
                        <span className="text-foreground">{event.type}</span>
                      </div>
                    </div>
                    {event.notes && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground">Notes:</p>
                        <p className="text-sm text-foreground">{event.notes}</p>
                      </div>
                    )}
                    {event.species && event.species.length > 0 && (
                      <div className="mt-2 border-t border-border pt-2">
                        <p className="mb-2 text-xs text-muted-foreground">Species Planted</p>
                        <div className="space-y-2">
                          {event.species.map((sp) => (
                            <div
                              key={sp.id}
                              className="flex items-center justify-between rounded bg-card/50 p-2 text-sm"
                            >
                              <div>
                                <p className="font-medium text-foreground">{sp.species.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {sp.species.variety} • {sp.species.type}
                                </p>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {sp.amount} {sp.unit.toLowerCase()}
                              </Badge>
                            </div>
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
                      <DropdownMenuItem onClick={() => onEditEvent(event.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Event
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => onDeleteEvent(event.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Event
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

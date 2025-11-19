'use client'

import { useMemo, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Sprout,
  Bug,
  Skull,
  ShoppingBasket,
} from 'lucide-react'
import type { ProjectResponse } from '@/types/project'
import AddHealthRecord from './add-health-record'
import { AddDiseaseDialog } from './add-disease-dialog'
import AddPestsDialog from './add-pests'
import RecordHarvest from './record-harvest-dialog'

interface PlantingEventListProps {
  project: ProjectResponse
  onAddEvent: () => void
  onEditEvent: (eventId: string) => void
  onDeleteEvent: (eventId: string) => void
  onSuccess: () => void
}

export function PlantingEventList({
  project,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  onSuccess,
}: PlantingEventListProps) {
  const [openHealthModal, setOpenHealthModal] = useState<boolean>(false)
  const [openDiseaseModal, setOpenDiseaseModal] = useState<boolean>(false)
  const [openHarvestModal, setOpenHarvestModal] = useState<boolean>(false)
  const [openPestModal, setOpenPestModal] = useState<boolean>(false)
  const [speciesid, setSpeciesId] = useState<string>('')
  const [eventid, setEventId] = useState<string>('')

  const plantingEvents = useMemo(
    () => project.planting_events || [],
    [project.planting_events]
  )

  if (plantingEvents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Planting Events</CardTitle>
              <CardDescription className="mt-1">
                Track your crops and planting schedule
              </CardDescription>
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
            <p className="text-sm text-muted-foreground">
              No planting events yet
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 bg-transparent"
              onClick={onAddEvent}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create First Event
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Planting Events</CardTitle>
              <CardDescription className="mt-1">
                Track your crops and planting schedule
              </CardDescription>
            </div>
            <Button size="sm" onClick={onAddEvent}>
              <Plus className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {plantingEvents.map((event) => (
              <Card key={event.id} className="border-border bg-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-foreground">
                          {event.name}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {event.stage}
                        </Badge>
                      </div>

                      <div className="grid gap-2 text-sm sm:grid-cols-2">
                        <div>
                          <span className="text-muted-foreground">
                            Planting Date:{' '}
                          </span>
                          <span className="text-foreground">
                            {new Date(event.planting_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            End Date:{' '}
                          </span>
                          <span className="text-foreground">
                            {new Date(event.end_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Area: </span>
                          <span className="text-foreground">
                            {event.area_size}{' '}
                            {event.area_size_unit.toLowerCase()}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Type: </span>
                          <span className="text-foreground">{event.type}</span>
                        </div>
                      </div>

                      {event.notes && (
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground">
                            Notes:
                          </p>
                          <p className="text-sm text-foreground">
                            {event.notes}
                          </p>
                        </div>
                      )}

                      {event.species && event.species.length > 0 && (
                        <div className="mt-4 border-t border-border pt-3">
                          <p className="mb-3 text-xs text-muted-foreground">
                            Species Planted
                          </p>
                          <div className="space-y-4">
                            {event.species.map((sp) => (
                              <div
                                key={sp.id}
                                className="rounded-lg bg-card/50 p-3"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <p className="font-medium text-foreground">
                                      {sp.species.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {sp.species.variety} • {sp.species.type} •
                                      Bloom: {sp.species.bloom_szn}
                                    </p>
                                  </div>
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {sp.amount} {sp.unit.toLowerCase()}
                                  </Badge>
                                </div>

                                {sp.species.notes && (
                                  <div className="mt-2">
                                    <p className="text-xs text-muted-foreground">
                                      Species Notes:
                                    </p>
                                    <p className="text-sm text-foreground">
                                      {sp.species.notes}
                                    </p>
                                  </div>
                                )}

                                <div className="mt-3 border-t border-border pt-2">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <ShoppingBasket className="h-4 w-4 text-muted-foreground" />
                                      <p className="text-xs font-medium text-muted-foreground">
                                        Harvests
                                      </p>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-7 text-xs"
                                      onClick={() => {
                                        setOpenHarvestModal(true)
                                        setSpeciesId(sp.species.id)
                                        setEventId(event.id)
                                      }}
                                    >
                                      <Plus className="mr-1 h-3 w-3" />
                                      Add Harvest
                                    </Button>
                                  </div>
                                  {sp.species.harvests &&
                                  sp.species.harvests.length > 0 ? (
                                    <div className="space-y-2">
                                      {sp.species.harvests.map((harvest) => (
                                        <div
                                          key={harvest.id}
                                          className="flex items-center justify-between rounded bg-muted/30 p-2 text-sm"
                                        >
                                          <div>
                                            <p className="font-medium text-foreground">
                                              {harvest.name || 'Harvest'}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                              Date:{' '}
                                              {new Date(
                                                harvest.harvest_date
                                              ).toLocaleDateString()}
                                            </p>
                                          </div>
                                          <Badge
                                            variant="outline"
                                            className="text-xs"
                                          >
                                            {harvest.amount}{' '}
                                            {harvest.unit?.toLowerCase() ||
                                              'units'}
                                          </Badge>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-sm text-muted-foreground italic">
                                      No harvests yet
                                    </p>
                                  )}
                                </div>

                                <div className="mt-3 border-t border-border pt-2">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <Skull className="h-4 w-4 text-muted-foreground" />
                                      <p className="text-xs font-medium text-muted-foreground">
                                        Diseases
                                      </p>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-7 text-xs"
                                      onClick={() => {
                                        setOpenHealthModal(true)
                                        setSpeciesId(sp.species.id)
                                        setEventId(event.id)
                                      }}
                                    >
                                      <Plus className="mr-1 h-3 w-3" />
                                      Add Disease
                                    </Button>
                                  </div>
                                  {sp.species.diseases &&
                                  sp.species.diseases.length > 0 ? (
                                    <div className="space-y-2">
                                      {sp.species.diseases.map((disease) => (
                                        <div
                                          key={disease.id}
                                          className="flex items-center justify-between rounded bg-destructive/10 p-2 text-sm"
                                        >
                                          <div>
                                            <p className="font-medium text-foreground">
                                              {disease.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                              Severity: {disease.severity}
                                            </p>
                                          </div>
                                          <Badge
                                            variant="destructive"
                                            className="text-xs"
                                          >
                                            {disease.status || 'Active'}
                                          </Badge>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-sm text-muted-foreground italic">
                                      No diseases reported
                                    </p>
                                  )}
                                </div>

                                <div className="mt-3 border-t border-border pt-2">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <Bug className="h-4 w-4 text-muted-foreground" />
                                      <p className="text-xs font-medium text-muted-foreground">
                                        Pests
                                      </p>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-7 text-xs"
                                      onClick={() => {
                                        setOpenPestModal(true)
                                        setSpeciesId(sp.species.id)
                                        setEventId(event.id)
                                      }}
                                    >
                                      <Plus className="mr-1 h-3 w-3" />
                                      Add Pest
                                    </Button>
                                  </div>
                                  {sp.species.pests &&
                                  sp.species.pests.length > 0 ? (
                                    <div className="space-y-2">
                                      {sp.species.pests.map((pest) => (
                                        <div
                                          key={pest.id}
                                          className="flex items-center justify-between rounded bg-warning/10 p-2 text-sm"
                                        >
                                          <div>
                                            <p className="font-medium text-foreground">
                                              {pest.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                              Type: {pest.type}
                                            </p>
                                          </div>
                                          <Badge
                                            variant="outline"
                                            className="text-xs bg-warning/20"
                                          >
                                            {pest.severity}
                                          </Badge>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-sm text-muted-foreground italic">
                                      No pests reported
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {event.fertilities && event.fertilities.length > 0 && (
                        <div className="mt-4 border-t border-border pt-3">
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-xs text-muted-foreground">
                              Fertility Applications
                            </p>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs"
                              onClick={() => {
                                /* Add fertility handler if needed */
                              }}
                            >
                              <Plus className="mr-1 h-3 w-3" />
                              Add Fertility
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {event.fertilities.map((fertility) => (
                              <div
                                key={fertility.id}
                                className="flex items-center justify-between rounded bg-success/10 p-2 text-sm"
                              >
                                <div>
                                  <p className="font-medium text-foreground">
                                    {fertility.fertilizer_type}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Applied:{' '}
                                    {new Date(
                                      fertility.application_date
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-success/20"
                                >
                                  {fertility.amount}{' '}
                                  {fertility.unit?.toLowerCase() || 'units'}
                                </Badge>
                              </div>
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
                        <DropdownMenuItem onClick={() => onEditEvent(event.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Event
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => onDeleteEvent(event.id)}
                        >
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
      <AddHealthRecord
        open={openHealthModal}
        onOpenChange={setOpenHealthModal}
        project={project}
        speciesid={speciesid}
        eventid={eventid}
        onSuccess={onSuccess}
      />
      <AddDiseaseDialog
        open={openDiseaseModal}
        onOpenChange={setOpenDiseaseModal}
        animalid={''}
        speciesid={speciesid}
        eventid={eventid}
        onSuccess={onSuccess}
      />
      openPestModal
      <AddPestsDialog
        open={openPestModal}
        onOpenChange={setOpenPestModal}
        speciesid={speciesid}
        eventid={eventid}
        onSuccess={onSuccess}
      />
      <RecordHarvest
        open={openHarvestModal}
        onOpenChange={setOpenHarvestModal}
        project={project}
        speciesid={speciesid}
        eventid={eventid}
        onSuccess={onSuccess}
      />
    </>
  )
}

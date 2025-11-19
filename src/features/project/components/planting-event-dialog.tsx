'use client'

import { useEffect, useState } from 'react'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useAppDispatch } from '@/store/hooks'
import {
  createPlantingEvent,
  updatePlantingEvent,
  getPlantingEventById,
} from '@/store/actions/planting-event'
import { toast } from 'sonner'
import {
  plantingEventDialogSchema,
  type PlantingEventDialogForm,
  type SpeciesForm,
} from '@/schemas/planting-event-dialog'
import { Plus, Trash2 } from 'lucide-react'

interface PlantingEventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  eventId?: string
  onSuccess: () => void
}

export function PlantingEventDialog({
  open,
  onOpenChange,
  projectId,
  eventId,
  onSuccess,
}: PlantingEventDialogProps) {
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PlantingEventDialogForm>({
    resolver: zodResolver(plantingEventDialogSchema),
    defaultValues: {
      name: '',
      planting_date: '',
      end_date: '',
      area_size: 0,
      area_size_unit: 'ACRE',
      stage: '',
      type: '',
      notes: '',
      species: [
        {
          species: {
            type: '',
            variety: '',
            name: '',
            bloom_szn: '',
            notes: '',
          },
          amount: '',
          unit: 'KILOGRAM',
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'species',
  })

  const addSpecies = () => {
    append({
      species: {
        type: '',
        variety: '',
        name: '',
        bloom_szn: '',
        notes: '',
      },
      amount: '',
      unit: 'KILOGRAM',
    })
  }

  useEffect(() => {
    if (eventId && open) {
      const fetchEvent = async () => {
        try {
          setIsLoading(true)
          if (!projectId || typeof projectId !== 'string') {
            toast.error('Error', { description: 'Invalid project ID' })
            return
          }

          if (!eventId || typeof eventId !== 'string') {
            toast.error('Error', { description: 'Invalid event ID' })
            return
          }

          const event = await dispatch(
            getPlantingEventById({ projectId, eventId })
          ).unwrap()

          if (!event || typeof event !== 'object') {
            toast.error('Error', { description: 'Event data not found' })
            return
          }

          // Transform the species data to match our form structure
          const transformedSpecies = event.species?.map((speciesItem: any) => ({
            id: speciesItem.id,
            species: {
              id: speciesItem.species?.id,
              type: speciesItem.species?.type || '',
              variety: speciesItem.species?.variety || '',
              name: speciesItem.species?.name || '',
              bloom_szn: speciesItem.species?.bloom_szn || '',
              notes: speciesItem.species?.notes || '',
            },
            amount: speciesItem.amount || '',
            unit: speciesItem.unit || 'KILOGRAM',
          })) || [
            {
              species: {
                type: '',
                variety: '',
                name: '',
                bloom_szn: '',
                notes: '',
              },
              amount: '',
              unit: 'KILOGRAM',
            },
          ]

          reset({
            name: event?.name ?? '',
            planting_date: event?.planting_date ?? '',
            end_date: event?.end_date ?? '',
            area_size: event?.area_size ?? 0,
            area_size_unit: event?.area_size_unit ?? 'ACRE',
            stage: event?.stage ?? '',
            type: event?.type ?? '',
            notes: event?.notes ?? '',
            species: transformedSpecies,
          })
        } catch (err: any) {
          const errorMessage =
            err?.message || err?.detail || 'Failed to load event data'
          toast.error('Error', { description: errorMessage })
        } finally {
          setIsLoading(false)
        }
      }
      fetchEvent()
    } else if (!open) {
      reset()
      setIsLoading(false)
    }
  }, [eventId, open, dispatch, projectId, reset])

  const onSubmit = async (data: PlantingEventDialogForm) => {
    try {
      if (!projectId || typeof projectId !== 'string') {
        toast.error('Error', { description: 'Invalid project ID' })
        return
      }

      // Prepare the payload matching backend structure
      const payload = {
        name: data.name,
        planting_date: data.planting_date,
        end_date: data.end_date || null,
        area_size: data.area_size,
        area_size_unit: data.area_size_unit,
        stage: data.stage,
        type: data.type,
        notes: data.notes || null,
        species: data.species.map((speciesItem) => ({
          ...(speciesItem.id && { id: speciesItem.id }),
          species: {
            ...(speciesItem.species.id && { id: speciesItem.species.id }),
            type: speciesItem.species.type,
            variety: speciesItem.species.variety,
            name: speciesItem.species.name,
            ...(speciesItem.species.bloom_szn && {
              bloom_szn: speciesItem.species.bloom_szn,
            }),
            ...(speciesItem.species.notes && {
              notes: speciesItem.species.notes,
            }),
          },
          amount: speciesItem.amount,
          unit: speciesItem.unit,
        })),
      }

      if (eventId) {
        await dispatch(
          updatePlantingEvent({ projectId, eventId, data: payload })
        ).unwrap()
        toast.success('Success', {
          description: 'Planting event updated successfully',
        })
      } else {
        await dispatch(
          createPlantingEvent({ projectId, data: payload })
        ).unwrap()
        toast.success('Success', {
          description: 'Planting event created successfully',
        })
      }

      onSuccess()
      onOpenChange(false)
    } catch (err: any) {
      const errorMessage =
        err?.message || err?.detail || 'Failed to save planting event'
      toast.error('Error', { description: errorMessage })
    }
  }

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="flex justify-center items-center py-8">
            Loading...
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!min-w-3xl max-h-[90vh] overflow-y-auto no-scrollbar">
        <DialogHeader>
          <DialogTitle>
            {eventId ? 'Edit Planting Event' : 'Create Planting Event'}
          </DialogTitle>
          <DialogDescription>
            {eventId
              ? 'Update the planting event details'
              : 'Add a new planting event to your project'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>

            <div className="space-y-2">
              <Label htmlFor="name">Event Name</Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <>
                    <Input id="name" {...field} disabled={isSubmitting} />
                    {errors.name && (
                      <p className="text-sm text-destructive">
                        {errors.name.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="planting_date">Planting Date</Label>
                <Controller
                  name="planting_date"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        id="planting_date"
                        type="date"
                        {...field}
                        disabled={isSubmitting}
                      />
                      {errors.planting_date && (
                        <p className="text-sm text-destructive">
                          {errors.planting_date.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Controller
                  name="end_date"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        id="end_date"
                        type="date"
                        {...field}
                        disabled={isSubmitting}
                      />
                      {errors.end_date && (
                        <p className="text-sm text-destructive">
                          {errors.end_date.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="area_size">Area Size</Label>
                <Controller
                  name="area_size"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        id="area_size"
                        type="number"
                        step="0.01"
                        {...field}
                        disabled={isSubmitting}
                        onChange={(e) =>
                          field.onChange(Number.parseFloat(e.target.value) || 0)
                        }
                      />
                      {errors.area_size && (
                        <p className="text-sm text-destructive">
                          {errors.area_size.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="area_size_unit">Unit</Label>
                <Controller
                  name="area_size_unit"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SQUARE_FEET">
                            Square Feet
                          </SelectItem>
                          <SelectItem value="SQUARE_YARD">
                            Square Yard
                          </SelectItem>
                          <SelectItem value="SQUARE_METER">
                            Square Meter
                          </SelectItem>
                          <SelectItem value="ACRE">Acre</SelectItem>
                          <SelectItem value="HECTARE">Hectare</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.area_size_unit && (
                        <p className="text-sm text-destructive">
                          {errors.area_size_unit.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="stage">Stage</Label>
                <Controller
                  name="stage"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        id="stage"
                        placeholder="e.g., Seedling, Growing"
                        {...field}
                        disabled={isSubmitting}
                      />
                      {errors.stage && (
                        <p className="text-sm text-destructive">
                          {errors.stage.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        id="type"
                        placeholder="e.g., Vegetable, Fruit"
                        {...field}
                        disabled={isSubmitting}
                      />
                      {errors.type && (
                        <p className="text-sm text-destructive">
                          {errors.type.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <>
                    <Textarea
                      id="notes"
                      rows={3}
                      {...field}
                      disabled={isSubmitting}
                    />
                    {errors.notes && (
                      <p className="text-sm text-destructive">
                        {errors.notes.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          </div>

          {/* Species Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Species</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSpecies}
                disabled={isSubmitting}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Species
              </Button>
            </div>

            {errors.species && (
              <p className="text-sm text-destructive">
                {errors.species.message}
              </p>
            )}

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Species #{index + 1}</h4>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => remove(index)}
                        disabled={isSubmitting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor={`species.${index}.species.type`}>
                        Type
                      </Label>
                      <Controller
                        name={`species.${index}.species.type`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="e.g., Vegetable"
                            disabled={isSubmitting}
                          />
                        )}
                      />
                      {errors.species?.[index]?.species?.type && (
                        <p className="text-sm text-destructive">
                          {errors.species[index]?.species?.type?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`species.${index}.species.variety`}>
                        Variety
                      </Label>
                      <Controller
                        name={`species.${index}.species.variety`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="e.g., Cherry"
                            disabled={isSubmitting}
                          />
                        )}
                      />
                      {errors.species?.[index]?.species?.variety && (
                        <p className="text-sm text-destructive">
                          {errors.species[index]?.species?.variety?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`species.${index}.species.name`}>
                        Name
                      </Label>
                      <Controller
                        name={`species.${index}.species.name`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="e.g., Tomato"
                            disabled={isSubmitting}
                          />
                        )}
                      />
                      {errors.species?.[index]?.species?.name && (
                        <p className="text-sm text-destructive">
                          {errors.species[index]?.species?.name?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor={`species.${index}.species.bloom_szn`}>
                        Bloom Season
                      </Label>
                      <Controller
                        name={`species.${index}.species.bloom_szn`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="e.g., Spring"
                            disabled={isSubmitting}
                          />
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`species.${index}.amount`}>Amount</Label>
                      <Controller
                        name={`species.${index}.amount`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="e.g., 2.5"
                            disabled={isSubmitting}
                          />
                        )}
                      />
                      {errors.species?.[index]?.amount && (
                        <p className="text-sm text-destructive">
                          {errors.species[index]?.amount?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`species.${index}.unit`}>Unit</Label>
                      <Controller
                        name={`species.${index}.unit`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={isSubmitting}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="KILOGRAM">Kilogram</SelectItem>
                              <SelectItem value="GRAM">Gram</SelectItem>
                              <SelectItem value="POUND">Pound</SelectItem>
                              <SelectItem value="OUNCE">Ounce</SelectItem>
                              <SelectItem value="COUNT">Count</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.species?.[index]?.unit && (
                        <p className="text-sm text-destructive">
                          {errors.species[index]?.unit?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`species.${index}.species.notes`}>
                      Species Notes
                    </Label>
                    <Controller
                      name={`species.${index}.species.notes`}
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          rows={2}
                          placeholder="Additional notes about this species..."
                          disabled={isSubmitting}
                        />
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : eventId ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

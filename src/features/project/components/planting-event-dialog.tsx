"use client"

import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAppDispatch } from "@/store/hooks"
import { createPlantingEvent, updatePlantingEvent, getPlantingEventById } from "@/store/actions/planting-event"
import { toast } from "sonner"
import { plantingEventDialogSchema, type PlantingEventDialogForm } from "@/schemas/planting-event-dialog"

interface PlantingEventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  eventId?: string
  onSuccess: () => void
}

export function PlantingEventDialog({ open, onOpenChange, projectId, eventId, onSuccess }: PlantingEventDialogProps) {
  const dispatch = useAppDispatch()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PlantingEventDialogForm>({
    resolver: zodResolver(plantingEventDialogSchema),
    defaultValues: {
      name: "",
      planting_date: "",
      end_date: "",
      area_size: 0,
      area_size_unit: "ACRE",
      stage: "",
      type: "",
      notes: "",
    },
  })

  useEffect(() => {
    if (eventId && open) {
      const fetchEvent = async () => {
        try {
          const event = await dispatch(getPlantingEventById({ projectId, eventId })).unwrap()

          reset({
            name: event.name,
            planting_date: event.planting_date,
            end_date: event.end_date || "",
            area_size: event.area_size,
            area_size_unit: event.area_size_unit,
            stage: event.stage,
            type: event.type,
            notes: event.notes || "",
          })
        } catch (err: any) {
          toast.error("Error", { description: "Failed to load event data" })
        }
      }
      fetchEvent()
    } else if (!open) {
      reset()
    }
  }, [eventId, open, dispatch, projectId, reset])

  const onSubmit = async (data: PlantingEventDialogForm) => {
    try {
      if (eventId) {
        await dispatch(updatePlantingEvent({ projectId, eventId, data })).unwrap()
        toast.success("Planting event updated successfully")
      } else {
        await dispatch(createPlantingEvent({ projectId, data })).unwrap()
        toast.success("Planting event created successfully")
      }

      onSuccess()
      onOpenChange(false)
    } catch (err: any) {
      toast.error(err.message || "Failed to save planting event")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{eventId ? "Edit Planting Event" : "Create Planting Event"}</DialogTitle>
          <DialogDescription>
            {eventId ? "Update the planting event details" : "Add a new planting event to your project"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Event Name</Label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <>
                  <Input id="name" {...field} />
                  {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
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
                    <Input id="planting_date" type="date" {...field} />
                    {errors.planting_date && <p className="text-sm text-destructive">{errors.planting_date.message}</p>}
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
                    <Input id="end_date" type="date" {...field} />
                    {errors.end_date && <p className="text-sm text-destructive">{errors.end_date.message}</p>}
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
                      onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                    />
                    {errors.area_size && <p className="text-sm text-destructive">{errors.area_size.message}</p>}
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
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SQUARE_FEET">Square Feet</SelectItem>
                        <SelectItem value="SQUARE_YARD">Square Yard</SelectItem>
                        <SelectItem value="SQUARE_METER">Square Meter</SelectItem>
                        <SelectItem value="ACRE">Acre</SelectItem>
                        <SelectItem value="HECTARE">Hectare</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.area_size_unit && (
                      <p className="text-sm text-destructive">{errors.area_size_unit.message}</p>
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
                    <Input id="stage" placeholder="e.g., Seedling, Growing" {...field} />
                    {errors.stage && <p className="text-sm text-destructive">{errors.stage.message}</p>}
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
                    <Input id="type" placeholder="e.g., Vegetable, Fruit" {...field} />
                    {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
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
                  <Textarea id="notes" rows={3} {...field} />
                  {errors.notes && <p className="text-sm text-destructive">{errors.notes.message}</p>}
                </>
              )}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : eventId ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

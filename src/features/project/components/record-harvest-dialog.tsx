"use client"

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
import type { ProjectResponse } from "@/types/project"
import { useAppDispatch } from "@/store/hooks"
import { toast } from "sonner"
import { createPlantHarvest } from "@/store/actions/plant-harvest"
import { recordHarvestSchema, type RecordHarvestForm } from "@/schemas/quick-actions"
import { useMemo } from "react"

interface RecordHarvestProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: ProjectResponse
  onSuccess: () => void
}

export default function RecordHarvest({ open, onOpenChange, project, onSuccess }: RecordHarvestProps) {
  const dispatch = useAppDispatch()

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RecordHarvestForm>({
    resolver: zodResolver(recordHarvestSchema),
    defaultValues: {
      planting_event_id: "",
      amount: 0,
      unit: "KILOGRAM",
      harvest_date: new Date().toISOString().split("T")[0],
      quality: "EXCELLENT",
    },
  })

  const plantingEvents = useMemo(() => {
    if (project.type !== "PlantingProject" || !project.planting_events) {
      return []
    }
    return project.planting_events.map((event) => ({
      id: event.id,
      name: event.name,
    }))
  }, [project.type, project.planting_events])

  const selectedEventId = watch("planting_event_id")
  const selectedEvent = useMemo(() => {
    return (project.planting_events || []).find((event) => event.id === selectedEventId)
  }, [project.planting_events, selectedEventId])

  const speciesId = selectedEvent?.species?.[0]?.id || ""

  const onSubmit = async (data: RecordHarvestForm) => {
    try {
      if (!speciesId) {
        toast.error("No species found for this planting event")
        return
      }

      const cleanedHarvestData = {
        date: data.harvest_date,
        amount: data.amount.toString(),
        unit: data.unit,
        quality: data.quality,
        species: speciesId,
      }

      await dispatch(
        createPlantHarvest({
          speciesId,
          harvestData: cleanedHarvestData,
        }),
      ).unwrap()

      toast.success("Harvest record created successfully")
      reset()
      onSuccess()
      onOpenChange(false)
    } catch (err: any) {
      toast.error(err.message || "Failed to record harvest")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Record Harvest</DialogTitle>
          <DialogDescription>Log a harvest event for your planting project</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="planting_event_id">Planting Event</Label>
            <Controller
              name="planting_event_id"
              control={control}
              render={({ field }) => (
                <>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a planting event" />
                    </SelectTrigger>
                    <SelectContent>
                      {plantingEvents.map((event) => (
                        <SelectItem key={event.id} value={event.id}>
                          {event.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.planting_event_id && (
                    <p className="text-sm text-destructive">{errors.planting_event_id.message}</p>
                  )}
                </>
              )}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="harvest_date">Harvest Date</Label>
              <Controller
                name="harvest_date"
                control={control}
                render={({ field }) => (
                  <>
                    <Input id="harvest_date" type="date" {...field} />
                    {errors.harvest_date && <p className="text-sm text-destructive">{errors.harvest_date.message}</p>}
                  </>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="Quantity harvested"
                      {...field}
                      onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                    />
                    {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
                  </>
                )}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Controller
                name="unit"
                control={control}
                render={({ field }) => (
                  <>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="KILOGRAM">Kilogram (kg)</SelectItem>
                        <SelectItem value="POUND">Pound (lb)</SelectItem>
                        <SelectItem value="LITER">Liter (L)</SelectItem>
                        <SelectItem value="GALLON">Gallon (gal)</SelectItem>
                        <SelectItem value="BUSHEL">Bushel</SelectItem>
                        <SelectItem value="TON">Metric Ton</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.unit && <p className="text-sm text-destructive">{errors.unit.message}</p>}
                  </>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quality">Quality</Label>
              <Controller
                name="quality"
                control={control}
                render={({ field }) => (
                  <>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EXCELLENT">Excellent</SelectItem>
                        <SelectItem value="GOOD">Good</SelectItem>
                        <SelectItem value="FAIR">Fair</SelectItem>
                        <SelectItem value="POOR">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.quality && <p className="text-sm text-destructive">{errors.quality.message}</p>}
                  </>
                )}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Record Harvest"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

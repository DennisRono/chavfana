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
import { AppDispatch } from "@/store/store"
import { toast } from "sonner"
import { createPlantHarvest } from "@/store/actions/plant-harvest"
import { recordHarvestSchema, type RecordHarvestForm } from "@/schemas/quick-actions"
import { useMemo, useState } from "react"
import { PlantHarvestData } from "@/types/plant-farming"

interface RecordHarvestProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: ProjectResponse | null
  eventid: string
  speciesid: string
  onSuccess: () => void
}

export default function RecordHarvest({ open, onOpenChange, project, eventid, speciesid, onSuccess }: RecordHarvestProps) {
  const [isSubmitting, setIsLoading] = useState<boolean>(false)
  const dispatch = useAppDispatch<AppDispatch>()

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<RecordHarvestForm>({
    resolver: zodResolver(recordHarvestSchema),
    defaultValues: {
      planting_event_id: eventid,
      amount: 0,
      unit: "KILOGRAM",
      harvest_date: new Date().toISOString().split("T")[0],
      quality: "EXCELLENT",
    },
  })


  const selectedEventId = watch("planting_event_id")
  const selectedEvent = useMemo(() => {
    if (!project?.planting_events || !Array.isArray(project.planting_events)) {
      return null
    }
    return project.planting_events.find((event) => event?.id === selectedEventId) || null
  }, [project?.planting_events, selectedEventId])

  const speciesId = useMemo(() => {
    if (!selectedEvent?.species || !Array.isArray(selectedEvent.species)) {
      return ""
    }
    return selectedEvent.species[0]?.id ?? ""
  }, [selectedEvent?.species])

  const onSubmit = async (data: RecordHarvestForm) => {
    setIsLoading(true)
    if (!project || typeof project !== "object") {
      toast.error("Error", { description: "Invalid project data" })
      return
    }

    if (!data || typeof data !== "object") {
      toast.error("Error", { description: "Invalid harvest data" })
      return
    }

    if (!speciesId || typeof speciesId !== "string") {
      toast.error("Error", { description: "No species found for this planting event" })
      return
    }

    if (typeof data.amount !== "number" || data.amount <= 0) {
      toast.error("Error", { description: "Invalid harvest amount" })
      return
    }

    if (!data.unit || typeof data.unit !== "string") {
      toast.error("Error", { description: "Please select a unit" })
      return
    }

    if (!data.quality || typeof data.quality !== "string") {
      toast.error("Error", { description: "Please select quality" })
      return
    }

    const cleanedHarvestData = {
      date: data.harvest_date,
      amount: data.amount.toString(),
      unit: data.unit,
      quality: data.quality,
      species: speciesId,
    }

    dispatch(createPlantHarvest({
      speciesId,
      harvestData: cleanedHarvestData as PlantHarvestData,
    }))
      .unwrap()
      .then(() => {
        toast.success("Success", { description: "Harvest record created successfully" })
        reset()
        onSuccess()
        onOpenChange(false)
      })
      .catch((err: any) => {
        const errorMessage = err?.message || err?.detail || "Failed to record harvest"
        toast.error("Error", { description: errorMessage })
      }).finally(()=>{
        setIsLoading(false)
      })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Record Harvest</DialogTitle>
          <DialogDescription>Log a harvest event for your planting project</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
 

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="harvest_date">Harvest Date</Label>
              <Controller
                name="harvest_date"
                control={control}
                render={({ field }) => (
                  <>
                    <Input id="harvest_date" type="date" {...field} disabled={isSubmitting} />
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
                      disabled={isSubmitting}
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
                    <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
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
                    <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
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

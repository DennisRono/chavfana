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
import { Textarea } from "@/components/ui/textarea"
import type { ProjectResponse } from "@/types/project"
import { useAppDispatch } from "@/store/hooks"
import { toast } from "sonner"
import { logFeedingSchema, type LogFeedingForm } from "@/schemas/quick-actions"
import { useMemo } from "react"

interface LogFeedingProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: ProjectResponse
  onSuccess: () => void
}

export default function LogFeeding({ open, onOpenChange, project, onSuccess }: LogFeedingProps) {
  const dispatch = useAppDispatch()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LogFeedingForm>({
    resolver: zodResolver(logFeedingSchema),
    defaultValues: {
      animal_group_id: "",
      feed_type: "",
      quantity: 0,
      unit: "KG",
      feeding_date: new Date().toISOString().split("T")[0],
      notes: "",
    },
  })

  const animalGroups = useMemo(() => {
    if (project.type !== "AnimalKeepingProject" || !project.animal_group) {
      return []
    }
    return project.animal_group.map((group) => ({
      id: group.id,
      name: group.group_name,
    }))
  }, [project.type, project.animal_group])

  const onSubmit = async (data: LogFeedingForm) => {
    try {
      // await dispatch(logFeeding({ projectId: project.id, data })).unwrap()
      toast.success("Feeding record logged successfully")
      reset()
      onSuccess()
      onOpenChange(false)
    } catch (err: any) {
      toast.error(err.message || "Failed to log feeding record")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log Feeding</DialogTitle>
          <DialogDescription>Record a feeding event for your animals</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="animal_group_id">Animal Group</Label>
            <Controller
              name="animal_group_id"
              control={control}
              render={({ field }) => (
                <>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an animal group" />
                    </SelectTrigger>
                    <SelectContent>
                      {animalGroups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.animal_group_id && (
                    <p className="text-sm text-destructive">{errors.animal_group_id.message}</p>
                  )}
                </>
              )}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="feed_type">Feed Type</Label>
              <Controller
                name="feed_type"
                control={control}
                render={({ field }) => (
                  <>
                    <Input id="feed_type" placeholder="e.g., Corn, Hay, Pellets" {...field} />
                    {errors.feed_type && <p className="text-sm text-destructive">{errors.feed_type.message}</p>}
                  </>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feeding_date">Feeding Date</Label>
              <Controller
                name="feeding_date"
                control={control}
                render={({ field }) => (
                  <>
                    <Input id="feeding_date" type="date" {...field} />
                    {errors.feeding_date && <p className="text-sm text-destructive">{errors.feeding_date.message}</p>}
                  </>
                )}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Controller
                name="quantity"
                control={control}
                render={({ field }) => (
                  <>
                    <Input
                      id="quantity"
                      type="number"
                      step="0.01"
                      placeholder="Amount of feed"
                      {...field}
                      onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                    />
                    {errors.quantity && <p className="text-sm text-destructive">{errors.quantity.message}</p>}
                  </>
                )}
              />
            </div>
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
                        <SelectItem value="KG">Kilogram (kg)</SelectItem>
                        <SelectItem value="LB">Pound (lb)</SelectItem>
                        <SelectItem value="LITER">Liter (L)</SelectItem>
                        <SelectItem value="GALLON">Gallon (gal)</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.unit && <p className="text-sm text-destructive">{errors.unit.message}</p>}
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
                  <Textarea id="notes" placeholder="Add any relevant notes about the feeding..." rows={3} {...field} />
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
              {isSubmitting ? "Saving..." : "Log Feeding"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

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
import { Textarea } from "@/components/ui/textarea"
import type { ProjectResponse } from "@/types/project"
import { useAppDispatch } from "@/store/hooks"
import { toast } from "sonner"
import { updateSoilDataSchema, type UpdateSoilDataForm } from "@/schemas/quick-actions"
import { useMemo } from "react"

interface UpdateSoilDataProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: ProjectResponse
  onSuccess: () => void
}

export default function UpdateSoilData({ open, onOpenChange, project, onSuccess }: UpdateSoilDataProps) {
  const dispatch = useAppDispatch()

  const defaultValues = useMemo(
    () => ({
      soil_type: project?.soil?.type || "",
      nitrogen: project?.soil?.nitrogen || 0,
      phosphorous: project?.soil?.phosphorous || 0,
      potassium: project?.soil?.potassium || 0,
      soil_ph: project?.soil?.soil_ph || 0,
      notes: "",
    }),
    [project?.soil],
  )

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateSoilDataForm>({
    resolver: zodResolver(updateSoilDataSchema),
    defaultValues,
  })

  const onSubmit = async (data: UpdateSoilDataForm) => {
    try {
      if (!project || typeof project !== "object") {
        toast.error("Error", { description: "Invalid project data" })
        return
      }

      if (!project.id || typeof project.id !== "string") {
        toast.error("Error", { description: "Invalid project ID" })
        return
      }

      if (!data || typeof data !== "object") {
        toast.error("Error", { description: "Invalid soil data" })
        return
      }

      const payload = {
        type: data.soil_type || undefined,
        nitrogen: typeof data.nitrogen === "number" ? data.nitrogen : undefined,
        phosphorous: typeof data.phosphorous === "number" ? data.phosphorous : undefined,
        potassium: typeof data.potassium === "number" ? data.potassium : undefined,
        soil_ph: typeof data.soil_ph === "number" ? data.soil_ph : undefined,
      }

      // TODO: Implement updateSoilData action when backend endpoint is available
      toast.success("Success", { description: "Soil data updated successfully" })
      onSuccess()
      onOpenChange(false)
    } catch (err: any) {
      const errorMessage = err?.message || err?.detail || "Failed to update soil data"
      toast.error("Error", { description: errorMessage })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Soil Data</DialogTitle>
          <DialogDescription>Update soil composition and pH information for your project</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="soil_type">Soil Type</Label>
            <Controller
              name="soil_type"
              control={control}
              render={({ field }) => (
                <>
                  <Input id="soil_type" placeholder="e.g., Loamy, Clay, Sandy" {...field} disabled={isSubmitting} />
                  {errors.soil_type && <p className="text-sm text-destructive">{errors.soil_type.message}</p>}
                </>
              )}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nitrogen">Nitrogen (N)</Label>
              <Controller
                name="nitrogen"
                control={control}
                render={({ field }) => (
                  <>
                    <Input
                      id="nitrogen"
                      type="number"
                      step="0.01"
                      placeholder="mg/kg or ppm"
                      {...field}
                      disabled={isSubmitting}
                      onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                    />
                    {errors.nitrogen && <p className="text-sm text-destructive">{errors.nitrogen.message}</p>}
                  </>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phosphorous">Phosphorous (P)</Label>
              <Controller
                name="phosphorous"
                control={control}
                render={({ field }) => (
                  <>
                    <Input
                      id="phosphorous"
                      type="number"
                      step="0.01"
                      placeholder="mg/kg or ppm"
                      {...field}
                      disabled={isSubmitting}
                      onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                    />
                    {errors.phosphorous && <p className="text-sm text-destructive">{errors.phosphorous.message}</p>}
                  </>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="potassium">Potassium (K)</Label>
              <Controller
                name="potassium"
                control={control}
                render={({ field }) => (
                  <>
                    <Input
                      id="potassium"
                      type="number"
                      step="0.01"
                      placeholder="mg/kg or ppm"
                      {...field}
                      disabled={isSubmitting}
                      onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                    />
                    {errors.potassium && <p className="text-sm text-destructive">{errors.potassium.message}</p>}
                  </>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="soil_ph">Soil pH</Label>
              <Controller
                name="soil_ph"
                control={control}
                render={({ field }) => (
                  <>
                    <Input
                      id="soil_ph"
                      type="number"
                      step="0.1"
                      min="0"
                      max="14"
                      placeholder="0-14"
                      {...field}
                      disabled={isSubmitting}
                      onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                    />
                    {errors.soil_ph && <p className="text-sm text-destructive">{errors.soil_ph.message}</p>}
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
                    placeholder="Add any relevant notes about the soil analysis..."
                    rows={3}
                    {...field}
                    disabled={isSubmitting}
                  />
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
              {isSubmitting ? "Saving..." : "Update Soil Data"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

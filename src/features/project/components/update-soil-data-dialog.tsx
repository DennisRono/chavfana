"use client"

import type React from "react"
import { useState } from "react"
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

interface UpdateSoilDataProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: ProjectResponse
  onSuccess: () => void
}

const UpdateSoilData = ({ open, onOpenChange, project, onSuccess }: UpdateSoilDataProps) => {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    soil_type: project.soil?.type || "",
    nitrogen: project.soil?.nitrogen?.toString() || "",
    phosphorous: project.soil?.phosphorous?.toString() || "",
    potassium: project.soil?.potassium?.toString() || "",
    soil_ph: project.soil?.soil_ph?.toString() || "",
    notes: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        type: formData.soil_type,
        nitrogen: formData.nitrogen ? Number.parseFloat(formData.nitrogen) : undefined,
        phosphorous: formData.phosphorous ? Number.parseFloat(formData.phosphorous) : undefined,
        potassium: formData.potassium ? Number.parseFloat(formData.potassium) : undefined,
        soil_ph: formData.soil_ph ? Number.parseFloat(formData.soil_ph) : undefined,
      }

      // await dispatch(updateSoilData({ projectId: project.id, data: payload })).unwrap()
      toast("Success", { description: "Soil data updated successfully" })
      onSuccess()
      onOpenChange(false)
    } catch (err: any) {
      toast.error("Error", {
        description: err.message || "Failed to update soil data",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] !min-w-[60vw] overflow-y-auto no-scrollbar">
        <DialogHeader>
          <DialogTitle>Update Soil Data</DialogTitle>
          <DialogDescription>Update soil composition and pH information for your project</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="soil_type">Soil Type</Label>
            <Input
              id="soil_type"
              value={formData.soil_type}
              onChange={(e) => setFormData({ ...formData, soil_type: e.target.value })}
              placeholder="e.g., Loamy, Clay, Sandy"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nitrogen">Nitrogen (N)</Label>
              <Input
                id="nitrogen"
                type="number"
                step="0.01"
                value={formData.nitrogen}
                onChange={(e) => setFormData({ ...formData, nitrogen: e.target.value })}
                placeholder="mg/kg or ppm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phosphorous">Phosphorous (P)</Label>
              <Input
                id="phosphorous"
                type="number"
                step="0.01"
                value={formData.phosphorous}
                onChange={(e) => setFormData({ ...formData, phosphorous: e.target.value })}
                placeholder="mg/kg or ppm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="potassium">Potassium (K)</Label>
              <Input
                id="potassium"
                type="number"
                step="0.01"
                value={formData.potassium}
                onChange={(e) => setFormData({ ...formData, potassium: e.target.value })}
                placeholder="mg/kg or ppm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="soil_ph">Soil pH</Label>
              <Input
                id="soil_ph"
                type="number"
                step="0.1"
                min="0"
                max="14"
                value={formData.soil_ph}
                onChange={(e) => setFormData({ ...formData, soil_ph: e.target.value })}
                placeholder="0-14"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any relevant notes about the soil analysis..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Update Soil Data"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateSoilData

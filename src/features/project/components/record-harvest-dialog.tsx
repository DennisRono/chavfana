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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { ProjectResponse } from "@/types/project"
import { useAppDispatch } from "@/store/hooks"
import { toast } from "sonner"

interface RecordHarvestProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: ProjectResponse
  onSuccess: () => void
}

const RecordHarvest = ({ open, onOpenChange, project, onSuccess }: RecordHarvestProps) => {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    planting_event_id: "",
    product: "",
    amount: "",
    unit: "KG",
    harvest_date: new Date().toISOString().split("T")[0],
    harvest_notes: "",
  })

  const getPlantingEvents = () => {
    if (project.type !== "PlantingProject" || !project.planting_events) {
      return []
    }
    return project.planting_events.map((event) => ({
      id: event.id,
      name: event.name,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // await dispatch(recordHarvest({ projectId: project.id, data: formData })).unwrap()
      toast("Success", { description: "Harvest record created successfully" })
      onSuccess()
      onOpenChange(false)
      setFormData({
        planting_event_id: "",
        product: "",
        amount: "",
        unit: "KG",
        harvest_date: new Date().toISOString().split("T")[0],
        harvest_notes: "",
      })
    } catch (err: any) {
      toast.error("Error", {
        description: err.message || "Failed to record harvest",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] !min-w-[60vw] overflow-y-auto no-scrollbar">
        <DialogHeader>
          <DialogTitle>Record Harvest</DialogTitle>
          <DialogDescription>Log a harvest event for your planting project</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="planting_event_id">Planting Event</Label>
            <Select
              value={formData.planting_event_id}
              onValueChange={(value) => setFormData({ ...formData, planting_event_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a planting event" />
              </SelectTrigger>
              <SelectContent>
                {getPlantingEvents().map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="product">Product Name</Label>
              <Input
                id="product"
                value={formData.product}
                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                placeholder="e.g., Tomatoes, Corn, Wheat"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="harvest_date">Harvest Date</Label>
              <Input
                id="harvest_date"
                type="date"
                value={formData.harvest_date}
                onChange={(e) => setFormData({ ...formData, harvest_date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="Quantity harvested"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KG">Kilogram (kg)</SelectItem>
                  <SelectItem value="LB">Pound (lb)</SelectItem>
                  <SelectItem value="LITER">Liter (L)</SelectItem>
                  <SelectItem value="GALLON">Gallon (gal)</SelectItem>
                  <SelectItem value="BUSHEL">Bushel</SelectItem>
                  <SelectItem value="TON">Metric Ton</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="harvest_notes">Notes</Label>
            <Textarea
              id="harvest_notes"
              value={formData.harvest_notes}
              onChange={(e) => setFormData({ ...formData, harvest_notes: e.target.value })}
              placeholder="Add any relevant notes about the harvest..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.planting_event_id || !formData.product || !formData.amount}
            >
              {loading ? "Saving..." : "Record Harvest"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default RecordHarvest

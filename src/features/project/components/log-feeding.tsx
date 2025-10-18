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

interface LogFeedingProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: ProjectResponse
  onSuccess: () => void
}

const LogFeeding = ({ open, onOpenChange, project, onSuccess }: LogFeedingProps) => {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    animal_group_id: "",
    feed_type: "",
    quantity: "",
    unit: "KG",
    feeding_date: new Date().toISOString().split("T")[0],
    notes: "",
  })

  const getAnimalGroups = () => {
    if (project.type !== "AnimalKeepingProject" || !project.animal_group) {
      return []
    }
    return project.animal_group.map((group) => ({
      id: group.id,
      name: group.group_name,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // await dispatch(logFeeding({ projectId: project.id, data: formData })).unwrap()
      toast("Success", { description: "Feeding record logged successfully" })
      onSuccess()
      onOpenChange(false)
      setFormData({
        animal_group_id: "",
        feed_type: "",
        quantity: "",
        unit: "KG",
        feeding_date: new Date().toISOString().split("T")[0],
        notes: "",
      })
    } catch (err: any) {
      toast.error("Error", {
        description: err.message || "Failed to log feeding record",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] !min-w-[60vw] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log Feeding</DialogTitle>
          <DialogDescription>Record a feeding event for your animals</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="animal_group_id">Animal Group</Label>
            <Select
              value={formData.animal_group_id}
              onValueChange={(value) => setFormData({ ...formData, animal_group_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose an animal group" />
              </SelectTrigger>
              <SelectContent>
                {getAnimalGroups().map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="feed_type">Feed Type</Label>
              <Input
                id="feed_type"
                value={formData.feed_type}
                onChange={(e) => setFormData({ ...formData, feed_type: e.target.value })}
                placeholder="e.g., Corn, Hay, Pellets"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feeding_date">Feeding Date</Label>
              <Input
                id="feeding_date"
                type="date"
                value={formData.feeding_date}
                onChange={(e) => setFormData({ ...formData, feeding_date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="Amount of feed"
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
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any relevant notes about the feeding..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.animal_group_id || !formData.feed_type || !formData.quantity}
            >
              {loading ? "Saving..." : "Log Feeding"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default LogFeeding
